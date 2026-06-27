// Pure geo/projection math. No DOM, no state — shared by display + server.

import type { ProjectionMode } from "./config.js";

import { DEG, FT_TO_M, KT_TO_MS, MI_TO_M } from "./constants.js";

export interface Meters {
  east: number;
  north: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Flat-earth approximation of lat/lon -> local meters relative to a center.
 * Plenty accurate within a few miles.
 */
export function llToMeters(
  lat: number,
  lon: number,
  lat0: number,
  lon0: number,
): Meters {
  const east = (lon - lon0) * Math.cos(lat0 * DEG) * 111320;
  const north = (lat - lat0) * 110540;
  return { east, north };
}

/** Horizontal ground distance (meters) from center. */
export function rangeMeters(m: Meters): number {
  return Math.hypot(m.east, m.north);
}

export function metersToMiles(m: number): number {
  return m / MI_TO_M;
}

/** Pixels per meter so that `radiusMiles` fills half of the smaller screen axis. */
export function pxPerMeter(
  screenW: number,
  screenH: number,
  radiusMiles: number,
): number {
  return Math.min(screenW, screenH) / 2 / (radiusMiles * MI_TO_M);
}

export interface ProjectOpts {
  rotationDeg: number;
  mirrorX: boolean;
  mirrorY: boolean;
  pxPerM: number;
  screenW: number;
  screenH: number;
}

/** Local meters -> screen pixels with rotation + mirror, screen-Y inverted. */
export function project(m: Meters, o: ProjectOpts): Point {
  const t = o.rotationDeg * DEG;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  let x = m.east * cos - m.north * sin;
  let y = m.east * sin + m.north * cos;
  if (o.mirrorX) x = -x;
  if (o.mirrorY) y = -y;
  return {
    x: o.screenW / 2 + x * o.pxPerM,
    y: o.screenH / 2 - y * o.pxPerM, // screen Y grows downward
  };
}

/**
 * Dead-reckon a position forward along its track at ground speed.
 * Returns new local meters. Used to smooth ~1 Hz updates to 60 fps.
 */
export function deadReckon(
  m: Meters,
  trackDeg: number | undefined,
  gsKt: number | undefined,
  dtSec: number,
): Meters {
  if (trackDeg == null || gsKt == null || gsKt <= 0) return m;
  const dist = gsKt * KT_TO_MS * dtSec;
  const t = trackDeg * DEG;
  return {
    east: m.east + dist * Math.sin(t),
    north: m.north + dist * Math.cos(t),
  };
}

export const EMERGENCY_SQUAWKS = new Set(["7500", "7600", "7700"]);

/** Horizontal sky coordinates relative to the observer (zenith = center). */
export interface SkyAngles {
  /** Degrees from true North, clockwise. */
  az: number;
  /** Degrees above the mathematical horizon. */
  elev: number;
  /** Horizontal ground range from observer, meters. */
  groundM: number;
  /** Line-of-sight distance observer → aircraft, meters. */
  slantM: number;
}

/** Interpolated ground fix used by the renderer motion model. */
export interface GroundSample {
  m: Meters;
  altFt: number;
}

/** Horizon radius in meters (maps to the edge of the circular sky field). */
export function horizonRadiusM(radiusMiles: number): number {
  return radiusMiles * MI_TO_M;
}

/**
 * Observer at ground level → apparent sky position of an aircraft.
 * Uses flat-earth for bearing (accurate within a few miles) and right-triangle
 * elevation from horizontal range + altitude. Near zenith, `fallbackAz` (e.g.
 * track) stabilizes the singularity.
 */
export function groundToSkyAngles(
  m: Meters,
  altFt: number,
  fallbackAz?: number,
): SkyAngles {
  const groundM = rangeMeters(m);
  const h = Math.max(0, altFt) * FT_TO_M;

  let elev: number;
  let az: number;

  if (groundM < 0.5) {
    elev = 89.5;
    az = fallbackAz ?? 0;
  } else {
    elev = Math.atan2(h, groundM) * (180 / Math.PI);
    az = normAz(Math.atan2(m.east, m.north) * (180 / Math.PI));
  }

  const slantM = Math.hypot(groundM, h);
  return { az, elev, groundM, slantM };
}

/** Radial distance on the sky dome for a given elevation (90° = zenith = 0). */
export function skyElevToRadius(elevDeg: number, horizonRadius: number): number {
  const e = Math.max(0, Math.min(90, elevDeg));
  return (1 - e / 90) * horizonRadius;
}

/** Sky angles → local east/north on the dome (before calibration rotation). */
export function skyAnglesToMeters(angles: SkyAngles, horizonRadius: number): Meters {
  const r = skyElevToRadius(angles.elev, horizonRadius);
  const a = angles.az * DEG;
  return { east: Math.sin(a) * r, north: Math.cos(a) * r };
}

/**
 * Project an aircraft fix to screen pixels. In sky mode, ground position and
 * altitude are converted to azimuth/elevation on the look-up dome so apparent
 * angular speed matches what you see outdoors.
 */
export function projectAircraft(
  sample: GroundSample,
  mode: ProjectionMode,
  o: ProjectOpts,
  horizonRadius: number,
  fallbackAz?: number,
): Point {
  if (mode === "map") return project(sample.m, o);
  const sky = groundToSkyAngles(sample.m, sample.altFt, fallbackAz);
  return project(skyAnglesToMeters(sky, horizonRadius), o);
}

/** Project a celestial / horizon point (azimuth + elevation) to screen pixels. */
export function projectSkyPoint(
  azDeg: number,
  elevDeg: number,
  o: ProjectOpts,
  horizonRadius: number,
): Point {
  const r = skyElevToRadius(elevDeg, horizonRadius);
  const a = azDeg * DEG;
  return project({ east: Math.sin(a) * r, north: Math.cos(a) * r }, o);
}

/**
 * Subtle slant-range size scale for sky mode — nearer / lower aircraft read
 * slightly larger, matching outdoor perspective. Clamped for stability.
 */
export function skyGlyphScale(slantM: number, refSlantM = 4500): number {
  return Math.max(0.72, Math.min(1.38, refSlantM / Math.max(slantM, 400)));
}

/** Shortest-path interpolate between two azimuths, degrees. */
export function lerpAzimuth(a: number, b: number, t: number): number {
  let d = ((b - a + 540) % 360) - 180;
  return normAz(a + d * t);
}

function normAz(deg: number): number {
  return ((deg % 360) + 360) % 360;
}
