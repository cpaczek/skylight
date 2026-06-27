// Zenith-pass planner: a plane flying DIRECTLY overhead — the case where
// chasing azimuth needs unbounded pan rate. The planner must pre-rotate to
// the exit azimuth and keep the plane inside the (widened) FOV throughout,
// with a camera that physically respects its slew limits.

import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  FT_TO_M,
  AxisTracker,
  angularSepDeg,
  azElFromSite,
  mountFromWorld,
  norm180,
  predictGeo,
  worldFromMount,
  type Aircraft,
  type GeoPoint,
} from "@shared/index.js";
import {
  planPass,
  zenithHold,
  ZENITH_MIN_HFOV,
  ZENITH_REGIME_EL,
} from "../src/pointing/planner.js";
import { predictAim, TrackHistory } from "../src/pointing/predict.js";
import { chooseZoom } from "../src/pointing/zoom.js";

const SITE: GeoPoint = { lat: 37.6213, lon: -122.379, altM: 0 };
const CFG = {
  ...DEFAULT_CONFIG.tracker,
  predict: { ...DEFAULT_CONFIG.tracker.predict, adsbLatencySec: 0 },
};

/** 250 kt northbound at 2500 m, dead over the site (closest approach t≈90s). */
function overheadFix(tSec: number): Aircraft {
  const start = predictGeo(
    { lat: SITE.lat - 0.104, lon: SITE.lon, altM: 2500, gsKt: 250, trackDeg: 0 },
    tSec,
  );
  return {
    hex: "overhead",
    typeCode: "A320",
    lat: start.lat,
    lon: start.lon,
    altGeom: start.altM / FT_TO_M,
    gs: 250,
    track: 0,
    baroRate: 0,
    ts: tSec * 1000,
    seen: 0,
  };
}

describe("planPass", () => {
  it("classifies a direct overhead pass as a zenith pass", () => {
    const plan = planPass(overheadFix(60), SITE, 60_000);
    expect(plan).not.toBeNull();
    expect(plan!.zenithPass).toBe(true);
    expect(plan!.elMaxDeg).toBeGreaterThan(85);
    // Northbound: exits to the north (az ~0/360).
    expect(Math.abs(norm180(plan!.outboundAzDeg - 0))).toBeLessThan(10);
    expect(plan!.tCaSec).toBeGreaterThan(20);
  });

  it("does NOT flag a moderate pass", () => {
    // Same flight, but offset 3 km east: peaks well below the zenith.
    const ac = overheadFix(60);
    const plan = planPass(
      { ...ac, lon: ac.lon! + 3000 / (111320 * Math.cos((SITE.lat * Math.PI) / 180)) },
      SITE,
      60_000,
    );
    expect(plan).not.toBeNull();
    expect(plan!.zenithPass).toBe(false);
  });
});

describe("zenith crossing, end to end with a rate-limited camera", () => {
  it("keeps the plane in frame through a direct overhead pass", () => {
    const history = new TrackHistory();
    const az = new AxisTracker(true, CFG.predict.alpha, CFG.predict.beta);
    const el = new AxisTracker(false, CFG.predict.alpha, CFG.predict.beta);
    const dt = 1 / CFG.predict.commandHz;

    // Physical camera model: follows the commanded setpoint at axis limits.
    let camPan = 0;
    let camTilt = 0;
    const approach = (cur: number, goal: number, maxStep: number) => {
      const d = norm180(goal - cur);
      return Math.abs(d) <= maxStep ? goal : cur + Math.sign(d) * maxStep;
    };

    let lastFixSec = -1;
    let worstSep = 0; // worst (boresight-to-plane) / (hfov/2) while el > 30°
    let usedHold = false;

    for (let tMs = 30_000; tMs <= 160_000; tMs += 1000 / CFG.predict.commandHz) {
      const tSec = tMs / 1000;
      const fixSec = Math.floor(tSec);
      const ac = overheadFix(fixSec);

      const plan = planPass(ac, SITE, tMs);
      const truthNow = azElFromSite(SITE, {
        lat: overheadFix(tSec).lat!,
        lon: overheadFix(tSec).lon!,
        altM: 2500,
      });
      const hold = zenithHold(plan, truthNow.elDeg);

      let cmdAz: number;
      let cmdEl: number;
      if (hold) {
        usedHold = true;
        cmdAz = hold.azDeg;
        cmdEl = hold.elDeg;
        az.reset(cmdAz);
        el.reset(cmdEl);
        lastFixSec = -1;
      } else {
        if (fixSec !== lastFixSec) {
          history.observe(ac, tMs);
          const pred = predictAim(
            ac, SITE, tMs, history, CFG.predict, CFG.mount, CFG.limits,
            { panDeg: camPan, tiltDeg: camTilt },
          );
          if (pred) {
            az.observe(pred.azEl.azDeg, 1, pred.azRateDps);
            el.observe(pred.azEl.elDeg, 1, pred.elRateDps);
          }
          lastFixSec = fixSec;
        }
        cmdAz = az.propagate(dt, CFG.limits.panSpeedMaxDps);
        cmdEl = el.propagate(dt, CFG.limits.tiltSpeedMaxDps);
      }

      // Drive the physical camera toward the commanded mount pose.
      const goal = mountFromWorld(cmdAz, cmdEl, CFG.mount);
      camPan = approach(camPan, goal.panDeg, CFG.limits.panSpeedMaxDps * dt);
      camTilt = approach(camTilt, goal.tiltDeg, CFG.limits.tiltSpeedMaxDps * dt);

      // Where is the boresight, and is the plane in frame?
      if (truthNow.elDeg > 30 && tSec > 40) {
        const bore = worldFromMount({ panDeg: camPan, tiltDeg: camTilt }, CFG.mount);
        let hfov = chooseZoom(ac, truthNow, CFG, 0).hfovDeg;
        if (hold) hfov = Math.max(hfov, ZENITH_MIN_HFOV);
        const sep = angularSepDeg(bore.azDeg, bore.elDeg, truthNow.azDeg, truthNow.elDeg);
        worstSep = Math.max(worstSep, sep / (hfov / 2));
      }
    }

    expect(usedHold).toBe(true); // the strategy actually engaged
    expect(worstSep).toBeLessThan(1); // plane never left the frame
  });

  it("regime boundary is consistent with the hold trigger", () => {
    const plan = planPass(overheadFix(60), SITE, 60_000);
    expect(zenithHold(plan, ZENITH_REGIME_EL + 1)).not.toBeNull();
    expect(zenithHold(plan, ZENITH_REGIME_EL - 1)).toBeNull();
  });
});
