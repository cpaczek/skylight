// Continuous auto-calibration: every steady, vision-locked detection pairs a
// mechanical pose (the pan/tilt that would have CENTERED the plane) with the
// plane's true world direction from ADS-B — exactly the sample the manual
// star-capture wizard collects, but free, dozens per pass.
//
// Samples are binned across the sky (az × el bands) so one long pass through
// a single corner can't dominate the fit, persisted to disk so calibration
// survives restarts, and periodically refit with the same Gauss-Newton
// solver the wizard uses. A solution is only APPLIED when it clearly beats
// the current model on the same data and the step is sane — the system
// re-squares itself across passes (absorbing e.g. a slowly rotating base)
// without ever being able to wander off after one bad pass.

import fs from "node:fs";
import { dirname } from "node:path";
import {
  DEG,
  norm180,
  norm360,
  solveMount,
  worldFromMount,
  type MountModel,
} from "@shared/index.js";

export interface AutoCalSample {
  /** Mechanical pose that would center the reference. */
  panDeg: number;
  tiltDeg: number;
  /** True world direction (ADS-B, geometric altitude only). */
  azDeg: number;
  elDeg: number;
  t: number;
}

export interface AutoCalStatus {
  samples: number;
  /** RMS of the CURRENT mount model over the buffer, deg (null = too few). */
  rmsDeg: number | null;
  lastAppliedAt: number | null;
  spanAzDeg: number;
  spanElDeg: number;
}

export interface SolveOutcome {
  model: MountModel;
  rmsBeforeDeg: number;
  rmsAfterDeg: number;
  n: number;
  solvedGains: boolean;
  solvedLevel: boolean;
}

/** Spatial binning: 12 azimuth sectors × elevation bands. */
const AZ_SECTORS = 12;
const EL_BANDS = [8, 25, 50, 75]; // → bands [8,25) [25,50) [50,75)
const PER_BIN = 6;
/** Accept at most one sample per this interval (passes yield plenty). */
const MIN_SAMPLE_INTERVAL_MS = 1500;
/** Samples older than this no longer describe the mount (base may move). */
const SAMPLE_TTL_MS = 12 * 3600_000;
/** Floor before any solve is attempted. */
const MIN_SAMPLES = 12;
/** Gains/level need real sky coverage or they soak up noise. */
const GAINS_MIN_SAMPLES = 40;
const GAINS_MIN_AZ_SPAN = 120;
const GAINS_MIN_EL_SPAN = 25;
const LEVEL_MIN_SAMPLES = 60;
/** Apply at most one mount update per this window. */
const APPLY_COOLDOWN_MS = 5 * 60_000;
/** Refuse pathological jumps — they mean bad data, not a rotated base. */
const MAX_OFFSET_STEP_DEG = 5;
const MAX_GAIN_STEP = 0.08;
/** Required improvement to swap models: rmsAfter < rmsBefore × this. */
const IMPROVE_FACTOR = 0.85;
/** Iterative robust trim: refit after dropping the worst 20% until the fit
 *  converges. A busy sky feeds 30-40% mis-locked junk when the model is far
 *  off (vision centers the WRONG plane near the expected spot) — a single
 *  trim round can't dig through that. */
const TRIM_TARGET_RMS = 0.5;
const TRIM_MAX_ROUNDS = 10;
/** REMOUNT path: the base was physically moved/re-placed, so the honest
 *  samples all agree on one large offset step the normal guard would refuse.
 *  Allowed only for an offsets-only fit of exceptional quality with real
 *  support — and never for gains/level, which a re-placement barely moves. */
const REMOUNT_MAX_OFFSET_STEP_DEG = 20;
const REMOUNT_MAX_RMS = 0.65;
const REMOUNT_MIN_SAMPLES = 24;
const REMOUNT_MIN_BINS = 3;
/** The inlier core must clearly MISFIT the current model — small shifts are
 *  the normal path's job. */
const REMOUNT_MIN_PRIOR_RMS = 1.0;
/** Evidence is counted in PASSES (time-clusters of inliers separated by this
 *  gap), not wall-span: a single 30-minute mis-tracked lock is one pass no
 *  matter how long, while two independent locks agreeing on the same shift
 *  are two. */
const REMOUNT_CLUSTER_GAP_MS = 3 * 60_000;
/** How much evidence to demand scales with how broken the incumbent is.
 *  Unusable (inliers misfit by ≥ this): two agreeing passes suffice — locks
 *  are rare precisely BECAUSE the model is far off, and every guarded step
 *  is recoverable (cooldown + later solves). */
const REMOUNT_URGENT_PRIOR_RMS = 3;
const REMOUNT_MIN_PASSES_URGENT = 2;
/** Merely marginal: don't move a working system >5° without sustained
 *  multi-pass evidence. */
const REMOUNT_MIN_PASSES = 3;
const REMOUNT_MIN_SPAN_MS = 30 * 60_000;
/** The normal path may only apply when the trim kept most of the buffer: a
 *  fit that survives by discarding more was steered by its own inlier
 *  selection and must not buy gains/level degrees of freedom with it. */
const NORMAL_MIN_RETAINED = 0.75;

export class AutoCalibrator {
  private samples: AutoCalSample[] = [];
  private lastAcceptedAt = 0;
  private lastAppliedAt: number | null = null;
  private lastSaveAt = 0;
  private dirty = false;

  constructor(private file: string) {
    this.load();
  }

  /** Samples accepted since the last solve attempt (worth re-solving?). */
  get hasNewData(): boolean {
    return this.dirty;
  }

  add(s: AutoCalSample): boolean {
    if (s.t - this.lastAcceptedAt < MIN_SAMPLE_INTERVAL_MS) return false;
    if (s.elDeg < EL_BANDS[0] || s.elDeg >= EL_BANDS[EL_BANDS.length - 1]) return false;
    this.prune(s.t);
    // Bin-capped insert: evict the oldest sample in the same sky bin.
    const key = this.binKey(s.azDeg, s.elDeg);
    const inBin = this.samples.filter((x) => this.binKey(x.azDeg, x.elDeg) === key);
    if (inBin.length >= PER_BIN) {
      const oldest = inBin.reduce((a, b) => (a.t < b.t ? a : b));
      this.samples = this.samples.filter((x) => x !== oldest);
    }
    this.samples.push(s);
    this.lastAcceptedAt = s.t;
    this.dirty = true;
    this.save(s.t);
    return true;
  }

  status(current: MountModel): AutoCalStatus {
    return {
      samples: this.samples.length,
      rmsDeg: this.samples.length >= 4 ? rmsUnder(this.samples, current) : null,
      lastAppliedAt: this.lastAppliedAt,
      spanAzDeg: azSpan(this.samples),
      spanElDeg: elSpan(this.samples),
    };
  }

  /**
   * Refit the mount to the buffer. Returns a model ONLY when it is clearly
   * better than `current` on the same samples and the step is sane; the
   * caller applies it (config patch) and resets any vision bias state.
   *
   * Two ways to apply: the NORMAL path (small steps, clear improvement) and
   * the REMOUNT path — an offsets-only fit of exceptional quality whose step
   * exceeds the normal guard, which is what a physically moved base looks
   * like. The remount apply also flushes samples that don't fit the new
   * model: they were measured against the old orientation (or are mis-locks)
   * and would steer every later solve.
   */
  trySolve(current: MountModel, now: number): SolveOutcome | null {
    this.prune(now);
    this.dirty = false;
    if (this.samples.length < MIN_SAMPLES) return null;
    if (this.lastAppliedAt && now - this.lastAppliedAt < APPLY_COOLDOWN_MS) return null;

    const aSpan = azSpan(this.samples);
    const eSpan = elSpan(this.samples);
    const solveGains =
      this.samples.length >= GAINS_MIN_SAMPLES &&
      aSpan >= GAINS_MIN_AZ_SPAN &&
      eSpan >= GAINS_MIN_EL_SPAN;
    const solveLevel = solveGains && this.samples.length >= LEVEL_MIN_SAMPLES;

    const rmsBefore = rmsUnder(this.samples, current);
    const fit = this.robustFit(this.samples, current, { solveGains, solveLevel }, MIN_SAMPLES);
    if (!fit) return null;

    const m = fit.model;
    const dPan = Math.abs(norm180(m.panOffsetDeg - current.panOffsetDeg));
    const dTilt = Math.abs(m.tiltOffsetDeg - current.tiltOffsetDeg);
    const gainsSane =
      Math.abs(m.panGain - current.panGain) <= MAX_GAIN_STEP &&
      Math.abs(m.tiltGain - current.tiltGain) <= MAX_GAIN_STEP;

    if (
      fit.pool.length >= this.samples.length * NORMAL_MIN_RETAINED &&
      dPan <= MAX_OFFSET_STEP_DEG &&
      dTilt <= MAX_OFFSET_STEP_DEG &&
      gainsSane &&
      fit.rmsDeg <= rmsBefore * IMPROVE_FACTOR &&
      // Demand a meaningful absolute gain too — refitting a model that is
      // already good just churns the config for noise.
      rmsBefore - fit.rmsDeg >= 0.05 &&
      fit.rmsDeg <= 1.2 // never apply a poor fit
    ) {
      this.lastAppliedAt = now;
      this.save(now, true);
      return {
        model: m,
        rmsBeforeDeg: rmsBefore,
        rmsAfterDeg: fit.rmsDeg,
        n: fit.pool.length,
        solvedGains: solveGains,
        solvedLevel: solveLevel,
      };
    }

    // Normal path refused — check for a remount. Offsets-only: a re-placed
    // base changes where it points, not its gear ratios; freezing gains and
    // level keeps a contaminated buffer from buying degrees of freedom.
    const rfit = this.robustFit(
      this.samples, current, { solveGains: false, solveLevel: false }, REMOUNT_MIN_SAMPLES,
    );
    if (!rfit || rfit.pool.length < REMOUNT_MIN_SAMPLES) return null;
    const rm = rfit.model;
    const rdPan = Math.abs(norm180(rm.panOffsetDeg - current.panOffsetDeg));
    const rdTilt = Math.abs(rm.tiltOffsetDeg - current.tiltOffsetDeg);
    const ts = rfit.pool.map((s) => s.t).sort((a, b) => a - b);
    const spanMs = ts[ts.length - 1] - ts[0];
    let passes = 1;
    for (let i = 1; i < ts.length; i++) {
      if (ts[i] - ts[i - 1] > REMOUNT_CLUSTER_GAP_MS) passes++;
    }
    const bins = new Set(rfit.pool.map((s) => this.binKey(s.azDeg, s.elDeg))).size;
    const priorRms = rmsUnder(rfit.pool, current);
    const evidenceOk =
      priorRms >= REMOUNT_URGENT_PRIOR_RMS
        ? passes >= REMOUNT_MIN_PASSES_URGENT
        : passes >= REMOUNT_MIN_PASSES && spanMs >= REMOUNT_MIN_SPAN_MS;
    if (
      rfit.rmsDeg <= REMOUNT_MAX_RMS &&
      bins >= REMOUNT_MIN_BINS &&
      evidenceOk &&
      rdPan <= REMOUNT_MAX_OFFSET_STEP_DEG &&
      rdTilt <= REMOUNT_MAX_OFFSET_STEP_DEG &&
      priorRms >= REMOUNT_MIN_PRIOR_RMS
    ) {
      this.samples = [...rfit.pool]; // flush what the new model can't explain
      this.lastAppliedAt = now;
      this.save(now, true);
      return {
        model: rm,
        rmsBeforeDeg: rmsBefore,
        rmsAfterDeg: rfit.rmsDeg,
        n: rfit.pool.length,
        solvedGains: false,
        solvedLevel: false,
      };
    }
    return null;
  }

  /**
   * Fit with iterative outlier rejection: drop the worst 20% and refit until
   * the rms converges, the floor is reached, or a round stops helping.
   * Returns the surviving inlier pool alongside the model.
   */
  private robustFit(
    samples: AutoCalSample[],
    init: MountModel,
    opts: { solveGains: boolean; solveLevel: boolean },
    floor: number,
  ): { model: MountModel; rmsDeg: number; pool: AutoCalSample[] } | null {
    let pool = [...samples];
    let fit = solveMount(pool, init, opts);
    if (!fit) return null;
    for (let round = 0; round < TRIM_MAX_ROUNDS && fit.rmsDeg > TRIM_TARGET_RMS; round++) {
      const keep = Math.max(floor, Math.floor(pool.length * 0.8));
      if (keep >= pool.length) break;
      const next = pool
        .map((s, i) => ({ s, r: fit!.residualsDeg[i] }))
        .sort((a, b) => a.r - b.r)
        .slice(0, keep)
        .map((x) => x.s);
      const retry = solveMount(next, init, opts);
      if (!retry || retry.rmsDeg >= fit.rmsDeg) break;
      pool = next;
      fit = retry;
    }
    return { model: fit.model, rmsDeg: fit.rmsDeg, pool };
  }

  // --- internals ---

  private binKey(azDeg: number, elDeg: number): string {
    const a = Math.floor(norm360(azDeg) / (360 / AZ_SECTORS));
    let band = 0;
    for (let i = 1; i < EL_BANDS.length - 1; i++) if (elDeg >= EL_BANDS[i]) band = i;
    return `${a}:${band}`;
  }

  private prune(now: number): void {
    const cutoff = now - SAMPLE_TTL_MS;
    if (this.samples.some((s) => s.t < cutoff)) {
      this.samples = this.samples.filter((s) => s.t >= cutoff);
    }
  }

  private load(): void {
    try {
      const raw = JSON.parse(fs.readFileSync(this.file, "utf8")) as {
        samples?: AutoCalSample[];
        lastAppliedAt?: number | null;
      };
      this.samples = raw.samples ?? [];
      this.lastAppliedAt = raw.lastAppliedAt ?? null;
    } catch {
      /* first run / unreadable — start empty */
    }
  }

  private save(now: number, force = false): void {
    if (!force && now - this.lastSaveAt < 30_000) return;
    this.lastSaveAt = now;
    try {
      fs.mkdirSync(dirname(this.file), { recursive: true });
      fs.writeFileSync(
        this.file,
        JSON.stringify({ samples: this.samples, lastAppliedAt: this.lastAppliedAt }),
      );
    } catch {
      /* persistence is best-effort */
    }
  }
}

/** RMS angular residual of samples under a mount model, deg. */
export function rmsUnder(samples: AutoCalSample[], m: MountModel): number {
  if (!samples.length) return 0;
  let ss = 0;
  for (const s of samples) {
    const p = worldFromMount({ panDeg: s.panDeg, tiltDeg: s.tiltDeg }, m);
    const ra = norm180(p.azDeg - s.azDeg) * Math.cos(s.elDeg * DEG);
    const re = p.elDeg - s.elDeg;
    ss += ra * ra + re * re;
  }
  return Math.sqrt(ss / samples.length);
}

/** Circular azimuth span: 360 minus the largest empty gap between samples. */
function azSpan(samples: AutoCalSample[]): number {
  if (samples.length < 2) return 0;
  const az = samples.map((s) => norm360(s.azDeg)).sort((a, b) => a - b);
  let maxGap = az[0] + 360 - az[az.length - 1];
  for (let i = 1; i < az.length; i++) maxGap = Math.max(maxGap, az[i] - az[i - 1]);
  return 360 - maxGap;
}

function elSpan(samples: AutoCalSample[]): number {
  if (samples.length < 2) return 0;
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of samples) {
    lo = Math.min(lo, s.elDeg);
    hi = Math.max(hi, s.elDeg);
  }
  return hi - lo;
}
