// Target selection: filters, modes, and switch hysteresis.

import { describe, expect, it } from "vitest";
import type { Aircraft, GeoPoint, TargetCriteria } from "@shared/index.js";
import { FT_TO_M } from "@shared/index.js";
import { selectTarget } from "../src/pointing/target.js";

const SITE: GeoPoint = { lat: 37.6213, lon: -122.379, altM: 0 };
const CRIT: TargetCriteria = {
  minElevationDeg: 12,
  maxRangeMi: 15,
  minAltFt: 500,
  hysteresisSec: 8,
  switchMargin: 0.15,
};

/** A plane at given elevation (deg) due north, via altitude over fixed ground range. */
function planeAt(hex: string, elDeg: number, now: number, extra: Partial<Aircraft> = {}): Aircraft {
  const groundM = 4000;
  const altM = Math.tan((elDeg * Math.PI) / 180) * groundM;
  return {
    hex,
    flight: hex.toUpperCase(),
    lat: SITE.lat + groundM / 110540,
    lon: SITE.lon,
    altGeom: altM / FT_TO_M,
    gs: 250,
    track: 0,
    ts: now,
    seen: 0,
    ...extra,
  };
}

describe("selectTarget", () => {
  const now = 1_000_000;

  it("filters below min elevation, on-ground, and stale fixes", () => {
    const sel = selectTarget(
      [
        planeAt("low", 5, now),
        planeAt("ground", 45, now, { onGround: true }),
        planeAt("stale", 45, now - 30_000),
        planeAt("good", 45, now),
      ],
      SITE, now, null, "overhead", CRIT,
    );
    expect(sel.candidates.map((c) => c.hex)).toEqual(["good"]);
    expect(sel.hex).toBe("good");
  });

  it("overhead mode prefers the higher-elevation plane", () => {
    const sel = selectTarget(
      [planeAt("a", 30, now), planeAt("b", 70, now)],
      SITE, now, null, "overhead", CRIT,
    );
    expect(sel.hex).toBe("b");
  });

  it("closest mode prefers the shortest slant range", () => {
    // Lower elevation here means lower altitude over the same ground point ->
    // shorter slant range.
    const sel = selectTarget(
      [planeAt("near", 20, now), planeAt("far", 70, now)],
      SITE, now, null, "closest", CRIT,
    );
    expect(sel.hex).toBe("near");
  });

  it("filters aircraft below the minimum altitude", () => {
    const lowAltFt = 300; // below the 500 ft floor
    const sel = selectTarget(
      [planeAt("lowalt", 45, now, { altGeom: lowAltFt })],
      SITE, now, null, "overhead", CRIT,
    );
    expect(sel.candidates).toHaveLength(0);
  });

  it("holds the current target inside the hysteresis window", () => {
    const planes = [planeAt("cur", 40, now), planeAt("better", 60, now)];
    // Held for only 3 s — challenger must wait.
    const held = selectTarget(planes, SITE, now, { hex: "cur", sinceMs: now - 3000 }, "overhead", CRIT);
    expect(held.hex).toBe("cur");
    // After 10 s and with a clear margin, the challenger wins.
    const switched = selectTarget(planes, SITE, now, { hex: "cur", sinceMs: now - 10_000 }, "overhead", CRIT);
    expect(switched.hex).toBe("better");
  });

  it("does not switch for a marginal challenger even after the dwell", () => {
    const planes = [planeAt("cur", 50, now), planeAt("rival", 52, now)];
    const sel = selectTarget(planes, SITE, now, { hex: "cur", sinceMs: now - 60_000 }, "overhead", CRIT);
    expect(sel.hex).toBe("cur");
  });

  it("sticky mode never abandons a valid target", () => {
    const planes = [planeAt("cur", 20, now), planeAt("way-better", 80, now)];
    const sel = selectTarget(planes, SITE, now, { hex: "cur", sinceMs: now - 600_000 }, "sticky", CRIT);
    expect(sel.hex).toBe("cur");
  });

  it("approach mode favors low descending traffic", () => {
    const cruiser = planeAt("cruise", 60, now, { altBaro: 35_000, baroRate: 0 });
    const lander = planeAt("lander", 25, now, { altBaro: 3000, baroRate: -900 });
    const sel = selectTarget([cruiser, lander], SITE, now, null, "approach", CRIT);
    expect(sel.hex).toBe("lander");
  });
});
