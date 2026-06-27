// Position smoothing: the camera should follow the plane's smooth predicted
// PATH, not jitter to each noisy ADS-B fix. smoothGeo is a geo-frame
// complementary filter — velocity feedforward (lag-free) + a fractional pull
// toward each fix (denoise).

import { describe, expect, it } from "vitest";
import { FT_TO_M, KT_TO_MS, azElFromSite, type Aircraft, type GeoPoint } from "@shared/index.js";
import { TrackHistory } from "../src/pointing/predict.js";

const SITE: GeoPoint = { lat: 37.6213, lon: -122.379, altM: 0 };
// A plane flying due east at 250 kt, 5000 ft, starting just north of the site.
const GS = 250;
const TRACK = 90;
const ALT_FT = 5000;
const LAT0 = SITE.lat + 0.05;
const LON0 = SITE.lon;
const M_PER_DEG_LON = 111_320 * Math.cos((LAT0 * Math.PI) / 180);

/** True position dtSec into the flight (no noise). */
function truth(dtSec: number): { lat: number; lon: number } {
  const east = GS * KT_TO_MS * dtSec; // m
  return { lat: LAT0, lon: LON0 + east / M_PER_DEG_LON };
}

/** Deterministic pseudo-noise in degrees (~±40 m), repeatable. */
function noise(i: number): { dlat: number; dlon: number } {
  const m = 40;
  return {
    dlat: (Math.sin(i * 12.9898) * m) / 110_540,
    dlon: (Math.cos(i * 78.233) * m) / M_PER_DEG_LON,
  };
}

function fix(i: number, t: number, withNoise: boolean): Aircraft {
  const p = truth((t - 1_000_000) / 1000);
  const n = withNoise ? noise(i) : { dlat: 0, dlon: 0 };
  return {
    hex: "abc123",
    lat: p.lat + n.dlat,
    lon: p.lon + n.dlon,
    altGeom: ALT_FT,
    gs: GS,
    track: TRACK,
    ts: t,
    seen: 0,
  };
}

describe("TrackHistory.smoothGeo", () => {
  it("reduces aim error vs the true path compared to the raw noisy fix", () => {
    const hist = new TrackHistory();
    const t0 = 1_000_000;
    let rawErr = 0;
    let smErr = 0;
    for (let i = 0; i < 30; i++) {
      const t = t0 + i * 1000; // 1 Hz fixes
      const ac = fix(i, t, true);
      hist.observe(ac, t);
      const altM = ALT_FT * FT_TO_M;
      // True (noise-free) aim azimuth at this instant.
      const tp = truth((t - t0) / 1000);
      const trueAz = azElFromSite(SITE, { ...tp, altM }).azDeg;
      // Raw aim azimuth from the noisy fix.
      const rawAz = azElFromSite(SITE, { lat: ac.lat!, lon: ac.lon!, altM }).azDeg;
      // Smoothed aim azimuth.
      const sm = hist.smoothGeo(ac, t, 0.3)!;
      const smAz = azElFromSite(SITE, { ...sm, altM }).azDeg;
      if (i > 5) {
        // Let the filter settle past the seed.
        rawErr += Math.abs(rawAz - trueAz);
        smErr += Math.abs(smAz - trueAz);
      }
    }
    // The complementary filter rejects most of the per-fix noise.
    expect(smErr).toBeLessThan(rawErr * 0.7);
  });

  it("stays locked onto a clean straight path (no lag, near-exact)", () => {
    const hist = new TrackHistory();
    const t0 = 1_000_000;
    let maxErrDeg = 0;
    for (let i = 0; i < 20; i++) {
      const t = t0 + i * 1000;
      const ac = fix(i, t, false); // no noise
      hist.observe(ac, t);
      const sm = hist.smoothGeo(ac, t, 0.3)!;
      const tp = truth((t - t0) / 1000);
      // Error between smoothed and true position, in degrees of arc.
      const errLat = Math.abs(sm.lat - tp.lat);
      const errLon = Math.abs(sm.lon - tp.lon);
      if (i > 3) maxErrDeg = Math.max(maxErrDeg, errLat + errLon);
    }
    expect(maxErrDeg).toBeLessThan(1e-4); // no lag on a clean path
  });

  it("seeds from the first fix and re-seeds after a long gap", () => {
    const hist = new TrackHistory();
    const t0 = 1_000_000;
    const first = fix(0, t0, false);
    hist.observe(first, t0);
    const s0 = hist.smoothGeo(first, t0, 0.3)!;
    expect(s0.lat).toBeCloseTo(first.lat!, 6);
    // A 20 s gap (target lost + reacquired) re-seeds rather than coasting.
    const later = fix(0, t0 + 20_000, false);
    hist.observe(later, t0 + 20_000);
    const s1 = hist.smoothGeo(later, t0 + 20_000, 0.3)!;
    expect(s1.lon).toBeCloseTo(later.lon!, 6);
  });
});
