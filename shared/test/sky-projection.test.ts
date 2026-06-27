import { describe, expect, it } from "vitest";
import { FT_PER_M } from "../src/constants.js";
import {
  groundToSkyAngles,
  skyElevToRadius,
  skyGlyphScale,
  lerpAzimuth,
} from "../src/geo.js";

// Pure geometry behind the opt-in "sky" projection mode (PR #10). These lock in
// the look-up dome mapping so apparent motion stays correct: overhead aircraft
// near the zenith, horizon aircraft near the field edge.

describe("groundToSkyAngles", () => {
  it("maps cardinal ground bearings to azimuth", () => {
    expect(groundToSkyAngles({ east: 0, north: 1000 }, 5000).az).toBeCloseTo(0, 3); // north
    expect(groundToSkyAngles({ east: 1000, north: 0 }, 5000).az).toBeCloseTo(90, 3); // east
    expect(groundToSkyAngles({ east: 0, north: -1000 }, 5000).az).toBeCloseTo(180, 3); // south
    expect(groundToSkyAngles({ east: -1000, north: 0 }, 5000).az).toBeCloseTo(270, 3); // west
  });

  it("computes elevation from the range/altitude right triangle", () => {
    // ground range == altitude → 45°
    const a = groundToSkyAngles({ east: 0, north: 1000 }, 1000 * FT_PER_M);
    expect(a.elev).toBeCloseTo(45, 3);
  });

  it("pins a near-overhead fix to the zenith and uses the fallback azimuth", () => {
    const a = groundToSkyAngles({ east: 0, north: 0 }, 35000, 137);
    expect(a.elev).toBeGreaterThan(89);
    expect(a.az).toBe(137);
  });
});

describe("skyElevToRadius", () => {
  it("places zenith at center and horizon at the edge", () => {
    expect(skyElevToRadius(90, 500)).toBeCloseTo(0, 6);
    expect(skyElevToRadius(0, 500)).toBeCloseTo(500, 6);
    expect(skyElevToRadius(45, 500)).toBeCloseTo(250, 6);
  });
  it("clamps below-horizon and above-zenith inputs", () => {
    expect(skyElevToRadius(-10, 500)).toBeCloseTo(500, 6);
    expect(skyElevToRadius(120, 500)).toBeCloseTo(0, 6);
  });
});

describe("skyGlyphScale", () => {
  it("grows nearer aircraft and shrinks distant ones, within clamps", () => {
    expect(skyGlyphScale(400)).toBe(1.38); // very near → upper clamp
    expect(skyGlyphScale(50000)).toBe(0.72); // far → lower clamp
    expect(skyGlyphScale(4500)).toBeCloseTo(1, 2); // reference distance ≈ 1
  });
});

describe("lerpAzimuth", () => {
  it("takes the shortest path across the 0/360 wrap", () => {
    expect(lerpAzimuth(350, 10, 0.5)).toBeCloseTo(0, 6);
    expect(lerpAzimuth(10, 350, 0.5)).toBeCloseTo(0, 6);
    expect(lerpAzimuth(0, 90, 0.5)).toBeCloseTo(45, 6);
  });
});
