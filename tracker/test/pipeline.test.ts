// End-to-end pipeline invariants on a synthetic overhead pass: the commanded
// camera path must be smooth (within axis rate limits), within mechanical
// limits, and keep the (true) plane inside the chosen FOV.

import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  FT_TO_M,
  AxisTracker,
  azElFromSite,
  mountFromWorld,
  norm180,
  predictGeo,
  type Aircraft,
  type GeoPoint,
} from "@shared/index.js";
import { predictAim, TrackHistory } from "../src/pointing/predict.js";
import { chooseZoom } from "../src/pointing/zoom.js";

const SITE: GeoPoint = { lat: 37.6213, lon: -122.379, altM: 0 };
// Synthetic fixes are truth-instant: no decode latency to compensate.
const CFG = {
  ...DEFAULT_CONFIG.tracker,
  predict: { ...DEFAULT_CONFIG.tracker.predict, adsbLatencySec: 0 },
};

/** Simulate a 737 passing 600 m north of the site at 3000 m, 250 kt, heading east. */
function passFix(tSec: number): Aircraft {
  const start = predictGeo(
    {
      lat: SITE.lat + 600 / 110540,
      lon: SITE.lon - 0.12, // start west, fly east past overhead
      altM: 3000,
      gsKt: 250,
      trackDeg: 90,
    },
    tSec,
  );
  return {
    hex: "abc123",
    typeCode: "B738",
    lat: start.lat,
    lon: start.lon,
    altGeom: start.altM / FT_TO_M,
    gs: 250,
    track: 90,
    baroRate: 0,
    ts: tSec * 1000,
    seen: 0,
  };
}

describe("pipeline on a synthetic pass", () => {
  it("stays smooth, in-limits, and keeps the plane in frame", () => {
    const history = new TrackHistory();
    const az = new AxisTracker(true, CFG.predict.alpha, CFG.predict.beta);
    const el = new AxisTracker(false, CFG.predict.alpha, CFG.predict.beta);

    const dt = 1 / CFG.predict.commandHz;
    let pose = { panDeg: 0, tiltDeg: 0 };
    let lastFixSec = -1;
    let maxPanRate = 0;
    let maxOffCenter = 0;
    let minHfov = Infinity;

    for (let tMs = 0; tMs <= 240_000; tMs += 1000 / CFG.predict.commandHz) {
      const tSec = tMs / 1000;
      const fixSec = Math.floor(tSec); // 1 Hz fixes
      const ac = passFix(fixSec);
      const now = tMs;

      if (fixSec !== lastFixSec) {
        history.observe(ac, now);
        const pred = predictAim(ac, SITE, now, history, CFG.predict, CFG.mount, CFG.limits, pose);
        if (pred) {
          const dtFix = lastFixSec < 0 ? 1 : fixSec - lastFixSec;
          az.observe(pred.azEl.azDeg, dtFix, pred.azRateDps);
          el.observe(pred.azEl.elDeg, dtFix, pred.elRateDps);
        }
        lastFixSec = fixSec;
      }

      const prevPan = pose.panDeg;
      const azNow = az.propagate(dt, CFG.limits.panSpeedMaxDps);
      const elNow = el.propagate(dt, CFG.limits.tiltSpeedMaxDps);
      pose = mountFromWorld(azNow, elNow, CFG.mount);

      // --- invariants (after the initial acquisition slew settles) ---
      expect(pose.tiltDeg).toBeGreaterThanOrEqual(CFG.limits.tiltMinDeg - 1e-6);
      expect(pose.tiltDeg).toBeLessThanOrEqual(CFG.limits.tiltMaxDeg + 1e-6);
      if (tSec > 5) {
        const panRate = Math.abs(norm180(pose.panDeg - prevPan)) / dt;
        maxPanRate = Math.max(maxPanRate, panRate);
      }

      // Where is the plane RIGHT NOW (truth), and is it inside the FOV?
      const truth = azElFromSite(SITE, {
        lat: passFix(tSec).lat!,
        lon: passFix(tSec).lon!,
        altM: 3000,
      });
      if (truth.elDeg > CFG.target.minElevationDeg + 3 && tSec > 5) {
        const rateDps = Math.hypot(
          az.rate * Math.cos((truth.elDeg * Math.PI) / 180),
          el.rate,
        );
        const zoom = chooseZoom(ac, truth, CFG, rateDps);
        minHfov = Math.min(minHfov, zoom.hfovDeg);
        const dAz = Math.abs(norm180(truth.azDeg - azNow)) *
          Math.cos((truth.elDeg * Math.PI) / 180);
        const dEl = Math.abs(truth.elDeg - elNow);
        const off = Math.hypot(dAz, dEl);
        maxOffCenter = Math.max(maxOffCenter, off / (zoom.hfovDeg / 2));
      }
    }

    // The camera never needs to exceed its pan limit on this pass...
    expect(maxPanRate).toBeLessThanOrEqual(CFG.limits.panSpeedMaxDps + 1e-6);
    // ...the plane stays well inside the half-FOV the zoom logic chose...
    expect(maxOffCenter).toBeLessThan(1);
    // ...and the zoom logic actually zoomed in meaningfully at some point.
    expect(minHfov).toBeLessThan(20);
  });
});
