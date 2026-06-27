// Prediction, turn-rate estimation, setpoint smoothing, zoom mapping.

import { describe, expect, it } from "vitest";
import {
  DEG,
  KT_TO_MS,
  FT_TO_M,
  AxisTracker,
  angularSizeDeg,
  estimateTurnRate,
  hfovFromZoomUnits,
  norm180,
  predictGeo,
  requiredHfovDeg,
  zoomUnitsFromHfov,
  type FovPoint,
} from "../src/index.js";

describe("predictGeo", () => {
  it("flies straight north at ground speed", () => {
    const p = predictGeo(
      { lat: 37.6, lon: -122.4, altM: 1000, gsKt: 360, trackDeg: 0 },
      10,
    );
    // 360 kt = 185.2 m/s -> 1852 m in 10 s.
    expect((p.lat - 37.6) * 110540).toBeCloseTo(1852, 0);
    expect(p.lon).toBeCloseTo(-122.4, 8);
    expect(p.altM).toBe(1000);
  });

  it("applies vertical rate", () => {
    const p = predictGeo(
      { lat: 37.6, lon: -122.4, altM: 1000, gsKt: 0, trackDeg: 0, vRateFpm: 1200 },
      30,
    );
    expect(p.altM).toBeCloseTo(1000 + (1200 * FT_TO_M / 60) * 30, 3);
  });

  it("turn integration converges to straight for tiny rates", () => {
    const k = { lat: 37.6, lon: -122.4, altM: 1000, gsKt: 250, trackDeg: 45 };
    const straight = predictGeo(k, 5);
    const tinyTurn = predictGeo({ ...k, turnRateDps: 0.001 }, 5);
    expect(tinyTurn.lat).toBeCloseTo(straight.lat, 6);
    expect(tinyTurn.lon).toBeCloseTo(straight.lon, 6);
  });

  it("a 3°/s turn for 30 s ends 90° around the arc", () => {
    const k = { lat: 37.6, lon: -122.4, altM: 1000, gsKt: 200, trackDeg: 0, turnRateDps: 3 };
    const p = predictGeo(k, 30);
    // Radius = v/ω: 102.9 m/s / 0.05236 rad/s ≈ 1964 m. After a quarter turn
    // starting north, displacement = (R, R) east/north.
    const R = (200 * KT_TO_MS) / (3 * DEG);
    expect((p.lat - k.lat) * 110540).toBeCloseTo(R, -2);
    expect((p.lon - k.lon) * 111320 * Math.cos((37.6 * Math.PI) / 180)).toBeCloseTo(R, -2);
  });
});

describe("estimateTurnRate", () => {
  const hist = (rates: [number, number][]) =>
    rates.map(([t, trackDeg]) => ({ t: t * 1000, trackDeg }));

  it("reads a steady 3°/s", () => {
    expect(estimateTurnRate(hist([[0, 10], [1, 13], [2, 16], [3, 19]]))).toBeCloseTo(3, 5);
  });
  it("returns 0 below the noise floor", () => {
    expect(estimateTurnRate(hist([[0, 10], [1, 10.2], [2, 9.9], [3, 10.1]]))).toBe(0);
  });
  it("unwraps through north and clamps", () => {
    expect(estimateTurnRate(hist([[0, 354], [1, 0], [2, 6]]))).toBe(4); // 6°/s clamped
  });
});

describe("AxisTracker", () => {
  it("tracks a constant-velocity target with little lag", () => {
    const tr = new AxisTracker(false);
    let target = 10;
    let t = 0;
    for (let fix = 0; fix < 12; fix++) {
      tr.observe(target, 1);
      for (let i = 0; i < 20; i++) {
        tr.propagate(0.05, 100);
        t += 0.05;
      }
      target += 2; // 2°/s
    }
    const trueNow = 10 + 2 * t;
    expect(Math.abs(tr.pos - trueNow)).toBeLessThan(0.6);
  });

  it("wraps cleanly through 0/360", () => {
    const tr = new AxisTracker(true);
    tr.observe(359, 1);
    tr.observe(1, 1); // +2° through north, NOT -358°
    expect(Math.abs(norm180(tr.pos - 0))).toBeLessThan(1.5);
    expect(tr.rate).toBeGreaterThan(0);
  });
});

describe("zoom mapping", () => {
  const lut: FovPoint[] = [
    { units: 0, hfovDeg: 62.3 },
    { units: 16384, hfovDeg: 3.46 },
  ];

  it("hits the LUT endpoints", () => {
    expect(hfovFromZoomUnits(0, lut)).toBeCloseTo(62.3, 5);
    expect(hfovFromZoomUnits(16384, lut)).toBeCloseTo(3.46, 5);
  });

  it("round-trips units -> hfov -> units", () => {
    for (const u of [0, 4000, 9000, 16384]) {
      const hfov = hfovFromZoomUnits(u, lut);
      expect(zoomUnitsFromHfov(hfov, lut)).toBeCloseTo(u, -1);
    }
  });

  it("angular size: 60 m wingspan at 1 mi ≈ 2.1°", () => {
    expect(angularSizeDeg(60, 1609)).toBeCloseTo(2.14, 1);
  });

  it("pointing uncertainty floors the zoom", () => {
    // Tight pointing -> framing-driven; sloppy pointing -> sigma-driven.
    const theta = 1.0;
    expect(requiredHfovDeg(theta, 0.3)).toBeCloseTo((theta / 0.28) * (16 / 9), 3);
    expect(requiredHfovDeg(theta, 3)).toBeCloseTo(2 * (2 * 3 + theta / 2), 3);
  });
});
