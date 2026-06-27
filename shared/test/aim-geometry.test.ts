// Geometry: az/el/slant from ECEF→ENU vs independent truth.

import { describe, expect, it } from "vitest";
import { DEG, azElFromSite, type GeoPoint } from "../src/index.js";

const SFO: GeoPoint = { lat: 37.6213, lon: -122.379, altM: 0 };

/** Independent great-circle initial bearing (spherical, for cross-check). */
function greatCircleBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = (lon2 - lon1) * DEG;
  const y = Math.sin(dLon) * Math.cos(lat2 * DEG);
  const x =
    Math.cos(lat1 * DEG) * Math.sin(lat2 * DEG) -
    Math.sin(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

describe("azElFromSite", () => {
  it("points due north at a target straight up the meridian", () => {
    const r = azElFromSite(SFO, { lat: 38.0, lon: SFO.lon, altM: 0 });
    expect(Math.abs(r.azDeg) < 0.01 || Math.abs(r.azDeg - 360) < 0.01).toBe(true);
  });

  it("points due east at a target along the parallel", () => {
    const r = azElFromSite(SFO, { lat: SFO.lat, lon: -122.0, altM: 0 });
    expect(r.azDeg).toBeCloseTo(90, 0); // tiny convergence effects allowed
  });

  it("elevation is ~45° for a target as high as it is far", () => {
    // ~1 km north (110540 m/deg is approximate — allow ~0.5% slop), 1 km up.
    const r = azElFromSite(SFO, { lat: SFO.lat + 1000 / 110540, lon: SFO.lon, altM: 1000 });
    expect(r.elDeg).toBeGreaterThan(44.5);
    expect(r.elDeg).toBeLessThan(45.5);
    expect(r.slantM).toBeGreaterThan(1400);
    expect(r.slantM).toBeLessThan(1430);
  });

  it("matches an independent great-circle bearing to a real landmark", () => {
    // Sutro Tower, San Francisco.
    const sutro = { lat: 37.7552, lon: -122.4528, altM: 250 };
    const r = azElFromSite(SFO, sutro);
    const truth = greatCircleBearing(SFO.lat, SFO.lon, sutro.lat, sutro.lon);
    expect(Math.abs(r.azDeg - truth)).toBeLessThan(0.1);
  });

  it("includes earth curvature: a level target 10 km away sits below the horizon", () => {
    // Drop ≈ d²/(2R) → angle ≈ d/(2R) ≈ 0.045° at 10 km. Flat-earth would say 0.
    const north10k = { lat: SFO.lat + 10_000 / 110540, lon: SFO.lon, altM: 0 };
    const r = azElFromSite(SFO, north10k);
    expect(r.elDeg).toBeLessThan(0);
    expect(r.elDeg).toBeCloseTo(-0.045, 1);
  });

  it("a 61 m (200 ft) altitude error ≈ 1° of elevation at a low-el geometry", () => {
    // Plane ~3000 ft up at ~2 mi slant (the error-budget example).
    const d = 3087;
    const base = { lat: SFO.lat + d / 110540, lon: SFO.lon, altM: 914 };
    const high = { ...base, altM: 914 + 61 };
    const dEl = azElFromSite(SFO, high).elDeg - azElFromSite(SFO, base).elDeg;
    expect(dEl).toBeGreaterThan(0.9);
    expect(dEl).toBeLessThan(1.2);
  });
});
