// Pure pointing math for the PTZ aircraft tracker. No DOM, no state — shared
// by the tracker process, the debug UI, and tests.
//
// Conventions match geo.ts: azimuth in degrees from true North clockwise
// (az = atan2(East, North)), elevation in degrees above the horizon, meters
// internally, knots/feet only at the data boundary.

import type { Aircraft } from "./aircraft.js";
import type {
  AzEl,
  CameraLimits,
  GeoPoint,
  MountModel,
  PanTilt,
} from "./camera.js";

import { DEG, KT_TO_MS, FT_TO_M } from "./constants.js";

// WGS84 ellipsoid.
const WGS84_A = 6378137.0;
const WGS84_F = 1 / 298.257223563;
const WGS84_E2 = WGS84_F * (2 - WGS84_F);

export function norm360(d: number): number {
  return ((d % 360) + 360) % 360;
}

/** Normalize to (-180, 180]. */
export function norm180(d: number): number {
  const n = norm360(d);
  return n > 180 ? n - 360 : n;
}

export type Vec3 = [number, number, number];

/** Geodetic lat/lon (deg) + ellipsoidal height (m) -> ECEF meters. */
export function geodeticToEcef(lat: number, lon: number, hM: number): Vec3 {
  const sLat = Math.sin(lat * DEG);
  const cLat = Math.cos(lat * DEG);
  const sLon = Math.sin(lon * DEG);
  const cLon = Math.cos(lon * DEG);
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sLat * sLat);
  return [
    (N + hM) * cLat * cLon,
    (N + hM) * cLat * sLon,
    (N * (1 - WGS84_E2) + hM) * sLat,
  ];
}

/**
 * Exact look direction from a site to a target: WGS84 ECEF difference rotated
 * into the site's East/North/Up frame. No flat-earth or curvature error at
 * any range (refraction ignored — negligible above a few degrees elevation).
 */
export function azElFromSite(site: GeoPoint, target: GeoPoint): AzEl {
  const s = geodeticToEcef(site.lat, site.lon, site.altM);
  const t = geodeticToEcef(target.lat, target.lon, target.altM);
  const dx = t[0] - s[0];
  const dy = t[1] - s[1];
  const dz = t[2] - s[2];

  const sLat = Math.sin(site.lat * DEG);
  const cLat = Math.cos(site.lat * DEG);
  const sLon = Math.sin(site.lon * DEG);
  const cLon = Math.cos(site.lon * DEG);

  const e = -sLon * dx + cLon * dy;
  const n = -sLat * cLon * dx - sLat * sLon * dy + cLat * dz;
  const u = cLat * cLon * dx + cLat * sLon * dy + sLat * dz;

  const horiz = Math.hypot(e, n);
  return {
    azDeg: norm360(Math.atan2(e, n) / DEG),
    elDeg: Math.atan2(u, horiz) / DEG,
    slantM: Math.hypot(horiz, u),
  };
}

/** World az/el -> ENU unit vector. */
export function azElToVec(azDeg: number, elDeg: number): Vec3 {
  const az = azDeg * DEG;
  const el = elDeg * DEG;
  return [Math.cos(el) * Math.sin(az), Math.cos(el) * Math.cos(az), Math.sin(el)];
}

/** ENU unit vector -> world az/el (degrees). */
export function vecToAzEl(v: Vec3): { azDeg: number; elDeg: number } {
  return {
    azDeg: norm360(Math.atan2(v[0], v[1]) / DEG),
    elDeg: Math.asin(Math.max(-1, Math.min(1, v[2]))) / DEG,
  };
}

/** Great-circle angle between two look directions, degrees. */
export function angularSepDeg(
  az1: number, el1: number, az2: number, el2: number,
): number {
  const a = azElToVec(az1, el1);
  const b = azElToVec(az2, el2);
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return Math.acos(Math.max(-1, Math.min(1, dot))) / DEG;
}

/** Rodrigues rotation of v about unit axis k by angle deg. */
function rotate(v: Vec3, k: Vec3, deg: number): Vec3 {
  const th = deg * DEG;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const cross: Vec3 = [
    k[1] * v[2] - k[2] * v[1],
    k[2] * v[0] - k[0] * v[2],
    k[0] * v[1] - k[1] * v[0],
  ];
  const dot = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  return [
    v[0] * c + cross[0] * s + k[0] * dot * (1 - c),
    v[1] * c + cross[1] * s + k[1] * dot * (1 - c),
    v[2] * c + cross[2] * s + k[2] * dot * (1 - c),
  ];
}

/**
 * Level-error rotation axis: rotating "up" about this axis by +levelTiltDeg
 * tips the mount's up-axis toward world azimuth levelDirDeg.
 */
function leanAxis(levelDirDeg: number): Vec3 {
  const d = levelDirDeg * DEG;
  return [-Math.cos(d), Math.sin(d), 0];
}

/**
 * Forward mount model: where does the camera point (world az/el) at the given
 * mechanical pan/tilt? Inverse of mountFromWorld.
 */
export function worldFromMount(pt: PanTilt, m: MountModel): { azDeg: number; elDeg: number } {
  const azM = pt.panDeg * m.panGain + m.panOffsetDeg;
  const elM = pt.tiltDeg * m.tiltGain + m.tiltOffsetDeg;
  if (m.levelTiltDeg === 0) return { azDeg: norm360(azM), elDeg: elM };
  const v = rotate(azElToVec(azM, elM), leanAxis(m.levelDirDeg), m.levelTiltDeg);
  return vecToAzEl(v);
}

/** Inverse mount model: mechanical pan/tilt that points at a world az/el. */
export function mountFromWorld(azDeg: number, elDeg: number, m: MountModel): PanTilt {
  let azM = azDeg;
  let elM = elDeg;
  if (m.levelTiltDeg !== 0) {
    const v = rotate(azElToVec(azDeg, elDeg), leanAxis(m.levelDirDeg), -m.levelTiltDeg);
    const r = vecToAzEl(v);
    azM = r.azDeg;
    elM = r.elDeg;
  }
  return {
    panDeg: norm180(azM - m.panOffsetDeg) / m.panGain,
    tiltDeg: (elM - m.tiltOffsetDeg) / m.tiltGain,
  };
}

// ---------------------------------------------------------------------------
// Prediction
// ---------------------------------------------------------------------------

export interface Kinematics {
  lat: number;
  lon: number;
  /** Meters above the WGS84 ellipsoid. */
  altM: number;
  gsKt?: number;
  trackDeg?: number;
  /** Vertical rate, ft/min. */
  vRateFpm?: number | null;
  /** Turn rate, deg/s (estimated from track history; 0 = straight). */
  turnRateDps?: number;
}

/**
 * Aircraft -> the position we aim at. Prefers geometric (GNSS, ellipsoidal)
 * altitude; barometric is a fallback that can be hundreds of feet off.
 * Returns null without a usable 3D fix.
 */
export function aircraftGeoPoint(ac: Aircraft): GeoPoint | null {
  const altFt = ac.altGeom ?? ac.altBaro;
  if (ac.lat == null || ac.lon == null || altFt == null) return null;
  return { lat: ac.lat, lon: ac.lon, altM: altFt * FT_TO_M };
}

/**
 * Dead-reckon a target dtSec into the future: along-track at ground speed
 * (arc integration when turning), vertical rate held. Mirrors geo.ts
 * deadReckon conventions, but in geodetic coordinates and with altitude.
 */
export function predictGeo(k: Kinematics, dtSec: number): GeoPoint {
  let east = 0;
  let north = 0;
  if (k.trackDeg != null && k.gsKt != null && k.gsKt > 0 && dtSec !== 0) {
    const v = k.gsKt * KT_TO_MS;
    const tr = k.trackDeg * DEG;
    const w = (k.turnRateDps ?? 0) * DEG; // rad/s
    if (Math.abs(w) > 1e-4) {
      // Constant-rate turn: integrate the arc.
      east = (v / w) * (Math.cos(tr) - Math.cos(tr + w * dtSec));
      north = (v / w) * (Math.sin(tr + w * dtSec) - Math.sin(tr));
    } else {
      east = v * Math.sin(tr) * dtSec;
      north = v * Math.cos(tr) * dtSec;
    }
  }
  const altM = k.altM + ((k.vRateFpm ?? 0) * FT_TO_M / 60) * dtSec;
  return {
    lat: k.lat + north / 110540,
    lon: k.lon + east / (111320 * Math.cos(k.lat * DEG)),
    altM,
  };
}

/**
 * Turn-rate estimate (deg/s) from a short track history, with angle
 * unwrapping. Below the noise floor returns 0 (treat as straight); clamped to
 * a sane max (standard-rate turn is 3°/s).
 */
export function estimateTurnRate(
  hist: { t: number; trackDeg: number }[],
  noiseFloorDps = 0.4,
  maxDps = 4,
): number {
  if (hist.length < 2) return 0;
  let sum = 0;
  let weight = 0;
  for (let i = 1; i < hist.length; i++) {
    const dt = (hist[i].t - hist[i - 1].t) / 1000;
    if (dt <= 0.2 || dt > 15) continue;
    sum += norm180(hist[i].trackDeg - hist[i - 1].trackDeg) / dt;
    weight += 1;
  }
  if (!weight) return 0;
  const rate = sum / weight;
  if (Math.abs(rate) < noiseFloorDps) return 0;
  return Math.max(-maxDps, Math.min(maxDps, rate));
}

/**
 * Time for the camera to slew between two poses (slower axis governs). The
 * settle term only applies to discrete moves — while continuously tracking
 * (tiny deltas) it scales away, so it doesn't inject phantom lead.
 */
export function slewSeconds(from: PanTilt, to: PanTilt, lim: CameraLimits, settleSec = 0.15): number {
  const dPan = Math.abs(norm180(to.panDeg - from.panDeg));
  const dTilt = Math.abs(to.tiltDeg - from.tiltDeg);
  const travel = Math.max(dPan / lim.panSpeedMaxDps, dTilt / lim.tiltSpeedMaxDps);
  return travel + settleSec * Math.min(1, Math.max(dPan, dTilt) / 2);
}

// ---------------------------------------------------------------------------
// Setpoint smoothing — alpha-beta tracker per axis
// ---------------------------------------------------------------------------

/**
 * Alpha-beta filter on one axis so the camera glides between ~1 Hz target
 * updates instead of stepping. Tracks a constant-velocity target with zero
 * steady-state lag (unlike a plain EMA). `wrap` enables 360° angle handling
 * for the azimuth axis.
 */
export class AxisTracker {
  pos = 0;
  rate = 0;
  private initialized = false;

  constructor(
    private wrap: boolean,
    public alpha = 0.5,
    public beta = 0.1,
  ) {}

  reset(pos?: number): void {
    this.initialized = pos != null;
    this.pos = pos ?? 0;
    this.rate = 0;
  }

  /** Advance the smoothed setpoint by dt, rate-limited to maxDps. */
  propagate(dtSec: number, maxDps: number): number {
    const rate = Math.max(-maxDps, Math.min(maxDps, this.rate));
    this.pos += rate * dtSec;
    if (this.wrap) this.pos = norm360(this.pos);
    return this.pos;
  }

  /**
   * Fold in a fresh target observation that arrived dtFix after the last.
   * When the observer also knows the target's rate (e.g. computed
   * analytically by the predictor), passing it as `rateHint` eliminates the
   * filter's acceleration lag — the residual only trims the remainder.
   */
  observe(target: number, dtFixSec: number, rateHint?: number): void {
    if (!this.initialized) {
      this.pos = target;
      this.rate = rateHint ?? 0;
      this.initialized = true;
      return;
    }
    const resid = this.wrap ? norm180(target - this.pos) : target - this.pos;
    this.pos += this.alpha * resid;
    if (this.wrap) this.pos = norm360(this.pos);
    if (rateHint != null) {
      this.rate = rateHint + (dtFixSec > 0.05 ? (this.beta / dtFixSec) * resid : 0);
    } else if (dtFixSec > 0.05) {
      this.rate += (this.beta / dtFixSec) * resid;
    }
  }
}

// ---------------------------------------------------------------------------
// Calibration solver — Gauss-Newton with Levenberg damping
// ---------------------------------------------------------------------------

export interface CalibrationSample {
  /** Camera mechanical angles when the reference was centered. */
  panDeg: number;
  tiltDeg: number;
  /** True world direction of the reference at that instant. */
  azDeg: number;
  elDeg: number;
}

export interface SolveOptions {
  /** Also solve panGain/tiltGain (needs ≥3 well-spread samples). */
  solveGains: boolean;
  /** Also solve the 2-param level error (needs ≥4 spread samples). */
  solveLevel: boolean;
}

export interface SolveResult {
  model: MountModel;
  /** RMS angular residual, degrees. */
  rmsDeg: number;
  /** Per-sample angular residual, degrees. */
  residualsDeg: number[];
}

/** Residuals (az·cos el, el) in degrees for one sample under a model. */
function sampleResiduals(s: CalibrationSample, m: MountModel): [number, number] {
  const p = worldFromMount({ panDeg: s.panDeg, tiltDeg: s.tiltDeg }, m);
  return [
    norm180(p.azDeg - s.azDeg) * Math.cos(s.elDeg * DEG),
    p.elDeg - s.elDeg,
  ];
}

/** Solve a small symmetric system A x = b by Gaussian elimination. */
function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    }
    if (Math.abs(M[piv][col]) < 1e-12) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row, i) => row[n] / M[i][i]);
}

/**
 * Least-squares fit of the mount model to centered-reference captures.
 * 2 params (offsets) always; gains and level terms optional. Initial guess
 * comes from `init` (typically the currently-configured model).
 */
export function solveMount(
  samples: CalibrationSample[],
  init: MountModel,
  opts: SolveOptions,
): SolveResult | null {
  if (samples.length < 1) return null;

  type Key = keyof MountModel;
  const keys: Key[] = ["panOffsetDeg", "tiltOffsetDeg"];
  if (opts.solveGains && samples.length >= 2) keys.push("panGain", "tiltGain");
  if (opts.solveLevel && samples.length >= 4) keys.push("levelTiltDeg", "levelDirDeg");

  const model: MountModel = { ...init };
  // A degenerate levelDir stalls the solver when levelTilt starts at 0.
  if (keys.includes("levelTiltDeg") && model.levelTiltDeg === 0) model.levelTiltDeg = 0.05;

  // Gauss-Newton can't jump the sign basin (a mirrored pan axis), so when
  // gains are being solved, bootstrap them with a two-point linear estimate —
  // the SIGN comes out of the data, not the initial guess.
  if (keys.includes("panGain") && samples.length >= 2) {
    let best: [CalibrationSample, CalibrationSample] | null = null;
    let bestSep = 0;
    for (let i = 0; i < samples.length; i++) {
      for (let j = i + 1; j < samples.length; j++) {
        const sep = Math.abs(samples[j].panDeg - samples[i].panDeg);
        if (sep > bestSep) {
          bestSep = sep;
          best = [samples[i], samples[j]];
        }
      }
    }
    if (best && bestSep > 5) {
      const [a, b] = best;
      const gain = norm180(b.azDeg - a.azDeg) / (b.panDeg - a.panDeg);
      if (Number.isFinite(gain) && Math.abs(gain) > 0.5 && Math.abs(gain) < 2) {
        model.panGain = gain;
        model.panOffsetDeg = norm360(a.azDeg - a.panDeg * gain);
      }
    }
    const tiltPair = [...samples].sort(
      (x, y) => Math.abs(y.tiltDeg - samples[0].tiltDeg) - Math.abs(x.tiltDeg - samples[0].tiltDeg),
    );
    const dTilt = tiltPair[0].tiltDeg - samples[0].tiltDeg;
    if (Math.abs(dTilt) > 5) {
      const tGain = (tiltPair[0].elDeg - samples[0].elDeg) / dTilt;
      if (Number.isFinite(tGain) && Math.abs(tGain) > 0.5 && Math.abs(tGain) < 2) {
        model.tiltGain = tGain;
        model.tiltOffsetDeg = samples[0].elDeg - samples[0].tiltDeg * tGain;
      }
    }
  }

  const nP = keys.length;
  const nR = samples.length * 2;
  const eps: Record<string, number> = {
    panOffsetDeg: 0.01, tiltOffsetDeg: 0.01,
    panGain: 1e-4, tiltGain: 1e-4,
    levelTiltDeg: 0.01, levelDirDeg: 0.5,
  };

  let lambda = 1e-3;
  let cost = Infinity;

  const residuals = (m: MountModel): number[] => {
    const r: number[] = [];
    for (const s of samples) {
      const [ra, re] = sampleResiduals(s, m);
      r.push(ra, re);
    }
    return r;
  };
  const costOf = (r: number[]) => r.reduce((a, v) => a + v * v, 0);

  let r = residuals(model);
  cost = costOf(r);

  for (let iter = 0; iter < 50; iter++) {
    // Finite-difference Jacobian.
    const J: number[][] = Array.from({ length: nR }, () => new Array(nP).fill(0));
    for (let p = 0; p < nP; p++) {
      const k = keys[p];
      const h = eps[k];
      const m2 = { ...model, [k]: model[k] + h };
      const r2 = residuals(m2);
      for (let i = 0; i < nR; i++) J[i][p] = (r2[i] - r[i]) / h;
    }
    // Normal equations with Levenberg damping.
    const A: number[][] = Array.from({ length: nP }, () => new Array(nP).fill(0));
    const b: number[] = new Array(nP).fill(0);
    for (let i = 0; i < nR; i++) {
      for (let p = 0; p < nP; p++) {
        b[p] -= J[i][p] * r[i];
        for (let q = 0; q < nP; q++) A[p][q] += J[i][p] * J[i][q];
      }
    }
    for (let p = 0; p < nP; p++) A[p][p] *= 1 + lambda;
    const step = solveLinear(A, b);
    if (!step) break;

    const trial: MountModel = { ...model };
    for (let p = 0; p < nP; p++) trial[keys[p]] += step[p];
    const rTrial = residuals(trial);
    const cTrial = costOf(rTrial);
    if (cTrial < cost) {
      Object.assign(model, trial);
      r = rTrial;
      const improved = cost - cTrial;
      cost = cTrial;
      lambda = Math.max(1e-6, lambda / 3);
      if (improved < 1e-12) break;
    } else {
      lambda *= 10;
      if (lambda > 1e6) break;
    }
  }

  model.panOffsetDeg = norm360(model.panOffsetDeg);
  model.levelDirDeg = norm360(model.levelDirDeg);
  if (model.levelTiltDeg < 0) {
    model.levelTiltDeg = -model.levelTiltDeg;
    model.levelDirDeg = norm360(model.levelDirDeg + 180);
  }

  const perSample: number[] = [];
  for (const s of samples) {
    const [ra, re] = sampleResiduals(s, model);
    perSample.push(Math.hypot(ra, re));
  }
  return {
    model,
    rmsDeg: Math.sqrt(cost / nR),
    residualsDeg: perSample,
  };
}

// ---------------------------------------------------------------------------
// Zoom / field of view
// ---------------------------------------------------------------------------

export interface FovPoint {
  units: number;
  hfovDeg: number;
}

/** Angular size of a span (e.g. wingspan) at slant range, degrees. */
export function angularSizeDeg(spanM: number, slantM: number): number {
  if (slantM <= 0) return 180;
  return (2 * Math.atan(spanM / 2 / slantM)) / DEG;
}

// FOV vs zoom-units is nonlinear; interpolate in log(tan(hfov/2)) space which
// is near-linear for zoom blocks. The LUT is measured empirically (M4); the
// default is just the wide/tele endpoints.
function toLogTan(hfovDeg: number): number {
  return Math.log(Math.tan((hfovDeg / 2) * DEG));
}
function fromLogTan(v: number): number {
  return (2 * Math.atan(Math.exp(v))) / DEG;
}

export function hfovFromZoomUnits(units: number, lut: FovPoint[]): number {
  const pts = [...lut].sort((a, b) => a.units - b.units);
  if (pts.length === 0) return 60;
  if (units <= pts[0].units) return pts[0].hfovDeg;
  const last = pts[pts.length - 1];
  if (units >= last.units) return last.hfovDeg;
  for (let i = 1; i < pts.length; i++) {
    if (units <= pts[i].units) {
      const f = (units - pts[i - 1].units) / (pts[i].units - pts[i - 1].units);
      return fromLogTan(
        toLogTan(pts[i - 1].hfovDeg) * (1 - f) + toLogTan(pts[i].hfovDeg) * f,
      );
    }
  }
  return last.hfovDeg;
}

export function zoomUnitsFromHfov(hfovDeg: number, lut: FovPoint[]): number {
  const pts = [...lut].sort((a, b) => b.hfovDeg - a.hfovDeg); // wide -> tele
  if (pts.length === 0) return 0;
  if (hfovDeg >= pts[0].hfovDeg) return pts[0].units;
  const last = pts[pts.length - 1];
  if (hfovDeg <= last.hfovDeg) return last.units;
  for (let i = 1; i < pts.length; i++) {
    if (hfovDeg >= pts[i].hfovDeg) {
      const a = toLogTan(pts[i - 1].hfovDeg);
      const b = toLogTan(pts[i].hfovDeg);
      const f = (toLogTan(hfovDeg) - a) / (b - a);
      return Math.round(pts[i - 1].units * (1 - f) + pts[i].units * f);
    }
  }
  return last.units;
}

/**
 * The HFOV to command: frame the plane at ~1/4–1/3 of frame height, but never
 * tighter than the pointing uncertainty allows — the target must stay inside
 * the frame at ~2σ.
 *   HFOV ≥ 2·(2σ + θ/2)   (pointing-limited floor)
 *   VFOV ≈ θ/0.28 → HFOV = VFOV·16/9   (framing-desired)
 */
export function requiredHfovDeg(
  angularSize: number,
  sigmaDeg: number,
  fillFrac = 0.28,
): number {
  const framing = (angularSize / fillFrac) * (16 / 9);
  const pointing = 2 * (2 * sigmaDeg + angularSize / 2);
  return Math.max(framing, pointing);
}
