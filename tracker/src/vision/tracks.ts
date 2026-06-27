// Track-before-detect: keep EVERY candidate blob alive as a short track in
// WORLD coordinates (az/el at frame time) and decide which one is the plane
// from how it MOVES, not how it looks in a single frame.
//
// The physics does the discrimination: over 1–2 s the plane moves through the
// world almost exactly as the ADS-B prediction says it will; clouds are
// world-static (<~0.3°/s drift); sensor/JPEG noise is incoherent frame to
// frame. A cloud edge can out-shine and out-compact the plane in any single
// frame — it cannot fake the plane's angular velocity for a second.
//
// Pure data + math (no camera, no timers) so it is directly unit-testable.

import { DEG, norm180 } from "@shared/index.js";

/** One blob observation, already converted to world angles at frame time. */
export interface WorldObs {
  /** Frame time, ms epoch. */
  t: number;
  azDeg: number;
  elDeg: number;
  /** Frame-space data carried through for the UI / zoom gate. */
  cx: number;
  cy: number;
  box: { x: number; y: number; w: number; h: number };
  contrastSigma: number;
  areaPx: number;
  /** Neural detector confidence (0 = classical-only blob). A track that the
   *  net has confirmed as an airplane carries a semantic edge over a cloud. */
  netScore?: number;
}

/** Where the plane should be and how it should move (from ADS-B). */
export interface PredictedMotion {
  azDeg: number;
  elDeg: number;
  azRateDps: number;
  elRateDps: number;
}

export interface SelectOptions {
  /** Position-error e-folding scale, deg (≈ ADS-B bias tolerance). */
  posScaleDeg?: number;
  /** Velocity-error e-folding scale, deg/s. */
  velScaleDps?: number;
}

/** Linear velocity fit over a track's recent observations. */
export interface VelocityFit {
  azRateDps: number;
  elRateDps: number;
  /** RMS residual of the fit, deg — coherent motion is small. */
  residDeg: number;
  n: number;
}

/** Observations participate in the velocity fit for this long. */
const FIT_WINDOW_MS = 2600;
/** Keep at most this many observations per track. */
const MAX_OBS = 16;
/** A track unseen for this long dies (the locked track gets a grace). */
const EXPIRE_MS = 2200;
const EXPIRE_LOCKED_MS = 3800;
/** At most this many concurrent tracks (lowest-quality dropped first). */
const MAX_TRACKS = 10;
/** Eligibility to ever become the lock. */
const LOCK_MIN_HITS = 3;
const LOCK_MIN_AGE_MS = 700;
/** A challenger must beat the locked score by this factor, this many
 *  consecutive selects, before the lock switches (~0.75 s at 4 Hz). */
const SWITCH_FACTOR = 1.6;
const SWITCH_COUNT = 3;

let nextTrackId = 1;

export class CandidateTrack {
  readonly id = nextTrackId++;
  readonly obs: WorldObs[] = [];
  hits = 0;
  createdAt: number;
  lastSeen: number;
  /** EMA of detection contrast (slow — a one-frame flash shouldn't win). */
  emaContrast = 0;
  /** Frames on which the neural net confirmed this track as an airplane. */
  netHits = 0;
  /** Best neural confidence this track has ever earned. */
  netBest = 0;
  /** When the net last confirmed it (decays the semantic bonus). */
  lastNetAt = 0;

  constructor(first: WorldObs) {
    this.createdAt = first.t;
    this.lastSeen = first.t;
    this.push(first);
  }

  push(o: WorldObs): void {
    this.obs.push(o);
    if (this.obs.length > MAX_OBS) this.obs.shift();
    this.hits++;
    this.lastSeen = o.t;
    this.emaContrast = this.emaContrast
      ? this.emaContrast + 0.3 * (o.contrastSigma - this.emaContrast)
      : o.contrastSigma;
    if (o.netScore && o.netScore > 0) {
      this.netHits++;
      this.netBest = Math.max(this.netBest, o.netScore);
      this.lastNetAt = o.t;
    }
  }

  latest(): WorldObs {
    return this.obs[this.obs.length - 1];
  }

  ageMs(now: number): number {
    return now - this.createdAt;
  }

  /**
   * Least-squares angular velocity over the recent window (az unwrapped
   * around the first sample so the fit never sees a 360° seam).
   */
  velocity(): VelocityFit {
    const t1 = this.lastSeen;
    const pts = this.obs.filter((o) => t1 - o.t <= FIT_WINDOW_MS);
    if (pts.length < 2) {
      return { azRateDps: 0, elRateDps: 0, residDeg: 0, n: pts.length };
    }
    const t0 = pts[0].t;
    const az0 = pts[0].azDeg;
    let st = 0;
    let saz = 0;
    let sel = 0;
    let stt = 0;
    let staz = 0;
    let stel = 0;
    for (const o of pts) {
      const dt = (o.t - t0) / 1000;
      const az = norm180(o.azDeg - az0); // unwrapped, small
      const el = o.elDeg;
      st += dt;
      saz += az;
      sel += el;
      stt += dt * dt;
      staz += dt * az;
      stel += dt * el;
    }
    const n = pts.length;
    const denom = n * stt - st * st;
    if (Math.abs(denom) < 1e-9) {
      return { azRateDps: 0, elRateDps: 0, residDeg: 0, n };
    }
    const vaz = (n * staz - st * saz) / denom;
    const vel = (n * stel - st * sel) / denom;
    const baz = (saz - vaz * st) / n;
    const bel = (sel - vel * st) / n;
    // RMS residual, az weighted by cos(el) so it's a true angular distance.
    const cosE = Math.max(0.2, Math.cos((sel / n) * DEG));
    let ss = 0;
    for (const o of pts) {
      const dt = (o.t - t0) / 1000;
      const ra = (norm180(o.azDeg - az0) - (baz + vaz * dt)) * cosE;
      const re = o.elDeg - (bel + vel * dt);
      ss += ra * ra + re * re;
    }
    return {
      azRateDps: vaz,
      elRateDps: vel,
      residDeg: Math.sqrt(ss / n),
      n,
    };
  }

  /** Track position extrapolated to time t (capped — don't coast forever). */
  positionAt(t: number): { azDeg: number; elDeg: number } {
    const last = this.latest();
    const v = this.velocity();
    const dt = Math.max(-1.5, Math.min(1.5, (t - last.t) / 1000));
    if (v.n < 2) return { azDeg: last.azDeg, elDeg: last.elDeg };
    return {
      azDeg: last.azDeg + v.azRateDps * dt,
      elDeg: last.elDeg + v.elRateDps * dt,
    };
  }
}

export interface ScoredTrack {
  track: CandidateTrack;
  score: number;
  eligible: boolean;
  velErrDps: number;
  posErrDeg: number;
}

export class TrackTable {
  private tracks: CandidateTrack[] = [];
  private lockedId: number | null = null;
  private challengerId: number | null = null;
  private challengerCount = 0;

  all(): CandidateTrack[] {
    return this.tracks;
  }

  lockedTrack(): CandidateTrack | null {
    return this.tracks.find((t) => t.id === this.lockedId) ?? null;
  }

  /** Drop the lock and all tracks (target switch — nothing carries over). */
  reset(): void {
    this.tracks = [];
    this.lockedId = null;
    this.challengerId = null;
    this.challengerCount = 0;
  }

  /**
   * Associate this frame's observations to tracks (greedy nearest-neighbor
   * within gateDeg, az distance cos(el)-weighted), spawn tracks for the
   * unmatched, expire the stale.
   */
  update(observations: WorldObs[], now: number, gateDeg: number): void {
    // All candidate pairings, nearest first.
    const pairs: { ti: number; oi: number; d: number }[] = [];
    for (let ti = 0; ti < this.tracks.length; ti++) {
      const tr = this.tracks[ti];
      for (let oi = 0; oi < observations.length; oi++) {
        const o = observations[oi];
        const p = tr.positionAt(o.t);
        const cosE = Math.max(0.2, Math.cos((o.elDeg * DEG)));
        const d = Math.hypot(
          norm180(o.azDeg - p.azDeg) * cosE,
          o.elDeg - p.elDeg,
        );
        if (d <= gateDeg) pairs.push({ ti, oi, d });
      }
    }
    pairs.sort((a, b) => a.d - b.d);
    const trackUsed = new Set<number>();
    const obsUsed = new Set<number>();
    for (const p of pairs) {
      if (trackUsed.has(p.ti) || obsUsed.has(p.oi)) continue;
      trackUsed.add(p.ti);
      obsUsed.add(p.oi);
      this.tracks[p.ti].push(observations[p.oi]);
    }
    // Unmatched observations seed new tracks.
    for (let oi = 0; oi < observations.length; oi++) {
      if (!obsUsed.has(oi)) this.tracks.push(new CandidateTrack(observations[oi]));
    }
    // Expire stale tracks; cap the population (locked track is immortal
    // within its grace window).
    this.tracks = this.tracks.filter((t) => {
      const limit = t.id === this.lockedId ? EXPIRE_LOCKED_MS : EXPIRE_MS;
      return now - t.lastSeen <= limit;
    });
    if (this.tracks.length > MAX_TRACKS) {
      this.tracks.sort((a, b) =>
        (b.id === this.lockedId ? 1e9 : b.hits) - (a.id === this.lockedId ? 1e9 : a.hits));
      this.tracks.length = MAX_TRACKS;
    }
    if (this.lockedId !== null && !this.tracks.some((t) => t.id === this.lockedId)) {
      this.lockedId = null;
      this.challengerCount = 0;
    }
  }

  /**
   * Score every track against the predicted motion and manage the lock.
   * Returns the locked track's scoring (or null when nothing is locked).
   *
   * Scoring: multiplicative evidence —
   *   velocity match  e^(−velErr/velScale)   ← the cloud-killer
   *   position match  e^(−posErr/posScale)   (loose: ADS-B bias is real)
   *   coherence       e^(−fitResid/0.25°)    (real objects move smoothly)
   *   persistence     ramps over the first ~6 hits
   *   contrast        mild bonus, saturating
   * When the predicted rate is tiny (far slow plane) velocity carries little
   * information — its weight scales down rather than letting noise decide.
   */
  select(pred: PredictedMotion, now: number, opts: SelectOptions = {}): ScoredTrack | null {
    const posScale = opts.posScaleDeg ?? 1.6;
    const velScale = opts.velScaleDps ?? 1.2;
    const predRate = Math.hypot(
      pred.azRateDps * Math.max(0.2, Math.cos(pred.elDeg * DEG)),
      pred.elRateDps,
    );
    const velWeight = Math.min(1, Math.max(0.25, predRate / 1.0));

    const scored: ScoredTrack[] = this.tracks.map((tr) => {
      const v = tr.velocity();
      const p = tr.positionAt(now);
      const cosE = Math.max(0.2, Math.cos(p.elDeg * DEG));
      const velErr = Math.hypot(
        (v.azRateDps - pred.azRateDps) * cosE,
        v.elRateDps - pred.elRateDps,
      );
      const posErr = Math.hypot(
        norm180(p.azDeg - pred.azDeg) * cosE,
        p.elDeg - pred.elDeg,
      );
      const velScore = Math.exp((-velErr / velScale) * velWeight);
      const posScore = Math.exp(-posErr / (posScale * 2));
      const coherence = v.n >= 3 ? Math.exp(-v.residDeg / 0.25) : 0.5;
      const persistence = 0.3 + 0.7 * Math.min(1, tr.hits / 6);
      const contrast = 0.5 + 0.5 * Math.min(1, tr.emaContrast / 6);
      // SEMANTIC bonus: a track the neural net has called an airplane gets a
      // multiplicative edge (decaying ~3 s after the last confirmation), so a
      // confirmed plane beats a coherent cloud even if the cloud's motion
      // briefly matches better. Classical-only tracks score at ×1 (unchanged
      // behavior when the net is disabled/absent).
      const netFresh = tr.lastNetAt > 0 && now - tr.lastNetAt < 3000;
      const semantic = netFresh ? 1 + 1.5 * Math.min(1, tr.netBest) : 1;
      const score =
        velScore * posScore * coherence * persistence * contrast * semantic;
      const eligible =
        tr.hits >= LOCK_MIN_HITS &&
        tr.ageMs(now) >= LOCK_MIN_AGE_MS &&
        v.n >= 3 &&
        velErr < 3 + (1 - velWeight) * 3 &&
        posErr < posScale * 3;
      return { track: tr, score, eligible, velErrDps: velErr, posErrDeg: posErr };
    });
    scored.sort((a, b) => b.score - a.score);

    const locked = scored.find((s) => s.track.id === this.lockedId) ?? null;
    const best = scored.find((s) => s.eligible) ?? null;

    if (!locked) {
      // No lock: take the best eligible track.
      if (best) {
        this.lockedId = best.track.id;
        this.challengerCount = 0;
        return best;
      }
      return null;
    }

    // Challenger hysteresis: a different track must CLEARLY beat the lock,
    // repeatedly, before we switch — one lucky frame moves nothing.
    if (best && best.track.id !== locked.track.id && best.score > locked.score * SWITCH_FACTOR) {
      if (this.challengerId === best.track.id) this.challengerCount++;
      else {
        this.challengerId = best.track.id;
        this.challengerCount = 1;
      }
      if (this.challengerCount >= SWITCH_COUNT) {
        this.lockedId = best.track.id;
        this.challengerCount = 0;
        return best;
      }
    } else {
      this.challengerCount = 0;
    }
    return locked;
  }
}
