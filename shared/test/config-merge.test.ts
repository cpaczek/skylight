// Config deep-merge: partial patches must never drop sibling keys. The
// tracker's vision.net is a nested object inside a section, the easiest place
// to silently wipe the whole detector config with a one-field patch.

import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, mergeConfig, mergeTrackerConfig } from "../src/config.js";
import { ASTERISMS, CONSTELLATIONS, visibleAsterisms } from "../src/stars.js";

describe("mergeTrackerConfig", () => {
  it("deep-merges a partial vision.net patch (keeps enabled/modelPath)", () => {
    const merged = mergeTrackerConfig(DEFAULT_CONFIG.tracker, {
      vision: { net: { everyNTicks: 3 } } as never,
    });
    expect(merged.vision.net.everyNTicks).toBe(3);
    // The fields the patch DIDN'T mention must survive.
    expect(merged.vision.net.enabled).toBe(DEFAULT_CONFIG.tracker.vision.net.enabled);
    expect(merged.vision.net.modelPath).toBe(DEFAULT_CONFIG.tracker.vision.net.modelPath);
    expect(merged.vision.net.inputSize).toBe(DEFAULT_CONFIG.tracker.vision.net.inputSize);
  });

  it("keeps other vision keys when patching net", () => {
    const merged = mergeTrackerConfig(DEFAULT_CONFIG.tracker, {
      vision: { net: { scoreThresh: 0.5 } } as never,
    });
    expect(merged.vision.enabled).toBe(DEFAULT_CONFIG.tracker.vision.enabled);
    expect(merged.vision.autoCalibrate).toBe(DEFAULT_CONFIG.tracker.vision.autoCalibrate);
    expect(merged.vision.net.scoreThresh).toBe(0.5);
  });

  it("restores a persisted config that predates the net section", () => {
    // Simulate loading an old persisted config (no net) against new defaults.
    const persisted = mergeConfig(DEFAULT_CONFIG, {
      tracker: { vision: { applyCorrection: true } } as never,
    });
    expect(persisted.tracker.vision.net).toEqual(DEFAULT_CONFIG.tracker.vision.net);
  });
});

describe("mergeConfig locationProfiles (#18)", () => {
  const profile = { id: "a1", name: "LAX", lat: 33.94, lon: -118.4, radiusMiles: 5 };

  it("persists saved profiles and replaces the array wholesale on patch", () => {
    const withOne = mergeConfig(DEFAULT_CONFIG, { locationProfiles: [profile] });
    expect(withOne.locationProfiles).toEqual([profile]);
    // A later patch of the array replaces it (the client sends the full list).
    const cleared = mergeConfig(withOne, { locationProfiles: [] });
    expect(cleared.locationProfiles).toEqual([]);
  });

  it("keeps saved profiles when an unrelated field is patched", () => {
    const base = mergeConfig(DEFAULT_CONFIG, { locationProfiles: [profile] });
    const after = mergeConfig(base, { brightness: 0.5 });
    expect(after.locationProfiles).toEqual([profile]);
  });
});

describe("mergeConfig constellation visibility (#47)", () => {
  it("leaves every constellation enabled by default", () => {
    const merged = mergeConfig(DEFAULT_CONFIG, {});

    for (const constellation of CONSTELLATIONS) {
      expect(merged.constellations[constellation.id]).toBe(true);
    }
  });

  it("disables only a patched constellation and keeps the others enabled", () => {
    const merged = mergeConfig(DEFAULT_CONFIG, { constellations: { orion: false } });

    expect(merged.constellations.orion).toBe(false);
    for (const constellation of CONSTELLATIONS.filter((c) => c.id !== "orion")) {
      expect(merged.constellations[constellation.id]).toBe(true);
    }
  });

  it("returns the full flattened catalog unless a known constellation is disabled", () => {
    const orion = CONSTELLATIONS.find((c) => c.id === "orion")!;
    const allVisible = visibleAsterisms(DEFAULT_CONFIG.constellations);
    const withoutOrion = visibleAsterisms({ ...DEFAULT_CONFIG.constellations, orion: false });

    expect(allVisible).toHaveLength(ASTERISMS.length);
    expect(withoutOrion).toHaveLength(ASTERISMS.length - orion.segments.length);
    for (const segment of orion.segments) {
      expect(withoutOrion).not.toContainEqual(segment);
    }
  });

  it("treats missing catalog entries in config as visible", () => {
    expect(visibleAsterisms({})).toEqual(ASTERISMS);
  });

  it("ignores unknown ids without adding segments", () => {
    expect(visibleAsterisms({ not_a_real_one: true })).toEqual(ASTERISMS);
  });

  it("returns no segments when every known constellation is disabled", () => {
    const allDisabled = Object.fromEntries(CONSTELLATIONS.map((c) => [c.id, false]));

    expect(visibleAsterisms(allDisabled)).toEqual([]);
  });
});
