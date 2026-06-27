// Compute the sky at a given instant + location: sun, moon (with phase), bright
// stars, and satellites/ISS. Everything is reduced to horizontal coordinates
// (azimuth from North, altitude above horizon) so the renderer can place them on
// the same circular "looking up" field as the aircraft.

import * as AstronomyNS from "astronomy-engine";
import * as satelliteNS from "satellite.js";
import { DEG } from "./constants.js";
import { STARS } from "./stars.js";

// Both packages ship UMD/CJS bundles. Under some Node versions the ESM
// namespace only exposes `default` (the module lexer can't parse the UMD
// wrapper), so unwrap it; in browsers/bundlers the namespace works directly.
const Astronomy: typeof AstronomyNS =
  (AstronomyNS as unknown as { default?: typeof AstronomyNS }).default ?? AstronomyNS;
const satellite: typeof satelliteNS =
  (satelliteNS as unknown as { default?: typeof satelliteNS }).default ?? satelliteNS;

const R2D = 180 / Math.PI;

export type SkyKind = "sun" | "moon" | "star" | "satellite" | "iss" | "planet";

export interface SkyBody {
  kind: SkyKind;
  name?: string;
  id?: string;
  az: number; // degrees from North, clockwise
  alt: number; // degrees above horizon
  mag?: number;
  illum?: number; // moon lit fraction 0..1
  waning?: boolean;
}

export interface Tle {
  name: string;
  line1: string;
  line2: string;
}

export interface Sky {
  sun?: SkyBody;
  moon?: SkyBody;
  stars: SkyBody[];
  sats: SkyBody[];
  planets: SkyBody[];
}

export interface SkyOpts {
  sun: boolean;
  moon: boolean;
  stars: boolean;
  satellites: boolean;
  planets: boolean;
  magLimit: number;
  tles: Tle[];
}

/** Naked-eye planets, in rough order of how often they're a standout. */
const PLANETS: { body: AstronomyNS.Body; name: string }[] = [
  { body: Astronomy.Body.Venus, name: "Venus" },
  { body: Astronomy.Body.Jupiter, name: "Jupiter" },
  { body: Astronomy.Body.Mars, name: "Mars" },
  { body: Astronomy.Body.Saturn, name: "Saturn" },
  { body: Astronomy.Body.Mercury, name: "Mercury" },
];

function norm360(d: number): number {
  return ((d % 360) + 360) % 360;
}

/** Horizontal coords of a fixed star from its RA/Dec and the local sidereal time. */
function starAltAz(raDeg: number, decDeg: number, lstHours: number, latDeg: number) {
  const ra = raDeg * DEG;
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;
  const H = (lstHours * 15) * DEG - ra; // hour angle (rad)
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAz = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat));
  const sinAz = (-Math.sin(H) * Math.cos(dec)) / Math.cos(alt);
  const az = norm360(Math.atan2(sinAz, cosAz) * R2D);
  return { az, alt: alt * R2D };
}

function bodyAltAz(
  body: AstronomyNS.Body,
  date: Date,
  observer: AstronomyNS.Observer,
): { az: number; alt: number } {
  const eq = Astronomy.Equator(body, date, observer, true, true);
  const hor = Astronomy.Horizon(date, observer, eq.ra, eq.dec, "normal");
  return { az: hor.azimuth, alt: hor.altitude };
}

const satrecCache = new Map<string, satelliteNS.SatRec>();
function getSatrec(tle: Tle): satelliteNS.SatRec | null {
  const key = tle.line1 + tle.line2;
  let rec = satrecCache.get(key);
  if (!rec) {
    try {
      rec = satellite.twoline2satrec(tle.line1, tle.line2);
    } catch {
      return null;
    }
    satrecCache.set(key, rec);
  }
  return rec;
}

export function computeSky(date: Date, latDeg: number, lonDeg: number, o: SkyOpts): Sky {
  const observer = new Astronomy.Observer(latDeg, lonDeg, 0);
  const sky: Sky = { stars: [], sats: [], planets: [] };

  if (o.sun) {
    const { az, alt } = bodyAltAz(Astronomy.Body.Sun, date, observer);
    sky.sun = { kind: "sun", az, alt };
  }
  if (o.moon) {
    const { az, alt } = bodyAltAz(Astronomy.Body.Moon, date, observer);
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, date);
    const phase = Astronomy.MoonPhase(date); // 0..360, 180 = full
    sky.moon = { kind: "moon", az, alt, illum: illum.phase_fraction, waning: phase > 180 };
  }
  if (o.stars) {
    const lst = Astronomy.SiderealTime(date) + lonDeg / 15; // local sidereal hours
    for (const s of STARS) {
      if (s.mag > o.magLimit) continue;
      const { az, alt } = starAltAz(s.ra, s.dec, lst, latDeg);
      if (alt < -2) continue; // below horizon
      sky.stars.push({ kind: "star", id: s.id, name: s.name, az, alt, mag: s.mag });
    }
  }
  if (o.satellites && o.tles.length) {
    const gmst = satellite.gstime(date);
    const observerGd = {
      longitude: lonDeg * DEG,
      latitude: latDeg * DEG,
      height: 0,
    };
    for (const tle of o.tles) {
      const rec = getSatrec(tle);
      if (!rec) continue;
      const pv = satellite.propagate(rec, date);
      const pos = pv?.position;
      if (!pos || typeof pos === "boolean") continue;
      const ecf = satellite.eciToEcf(pos, gmst);
      const look = satellite.ecfToLookAngles(observerGd, ecf);
      const alt = look.elevation * R2D;
      if (alt < 0) continue; // below horizon
      const isISS = /\bISS\b|\bZARYA\b/i.test(tle.name);
      sky.sats.push({
        kind: isISS ? "iss" : "satellite",
        name: tle.name.replace(/\s*\(.*\)\s*$/, "").trim(),
        az: norm360(look.azimuth * R2D),
        alt,
      });
    }
  }
  if (o.planets) {
    for (const p of PLANETS) {
      const { az, alt } = bodyAltAz(p.body, date, observer);
      if (alt < -2) continue; // below horizon
      // True apparent visual magnitude drives the on-screen size/glow.
      let mag = 0;
      try {
        mag = Astronomy.Illumination(p.body, date).mag;
      } catch {
        // Illumination can throw for a body at an unusual geometry; skip mag.
      }
      sky.planets.push({ kind: "planet", name: p.name, az, alt, mag });
    }
  }
  return sky;
}

/** Find the next time the ISS rises above `minAlt` degrees, scanning forward. */
export function nextISSPass(
  fromMs: number,
  latDeg: number,
  lonDeg: number,
  tles: Tle[],
  minAlt = 10,
  horizonHours = 12,
): number | null {
  const iss = tles.find((t) => /\bISS\b|\bZARYA\b/i.test(t.name));
  if (!iss) return null;
  const rec = getSatrec(iss);
  if (!rec) return null;
  const observerGd = { longitude: lonDeg * DEG, latitude: latDeg * DEG, height: 0 };
  const stepMs = 30_000;
  for (let t = fromMs + stepMs; t < fromMs + horizonHours * 3600_000; t += stepMs) {
    const date = new Date(t);
    const pv = satellite.propagate(rec, date);
    const pos = pv?.position;
    if (!pos || typeof pos === "boolean") continue;
    const ecf = satellite.eciToEcf(pos, satellite.gstime(date));
    const alt = satellite.ecfToLookAngles(observerGd, ecf).elevation * R2D;
    if (alt >= minAlt) return t;
  }
  return null;
}
