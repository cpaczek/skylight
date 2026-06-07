// Pure geo/projection math. No DOM, no state — shared by display + server.

const M_PER_MILE = 1609.34;
const KT_TO_MS = 0.514444;
const DEG = Math.PI / 180;

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
  return m / M_PER_MILE;
}

/** Pixels per meter so that `radiusMiles` fills half of the larger screen axis,
 *  ensuring the view covers the full screen in both width and height. */
export function pxPerMeter(
  screenW: number,
  screenH: number,
  radiusMiles: number,
): number {
  return Math.max(screenW, screenH) / 2 / (radiusMiles * M_PER_MILE);
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
