import { describe, expect, it } from "vitest";
import { nextSkyEvents, nextSkyEvent, type SkyEvent } from "../src/skyEvents.js";

// Sky events (#68): the "look up tonight" layer. These assert the engine finds
// the right *kinds* of events in known windows and gates visibility by horizon,
// without pinning exact timestamps (the ephemeris owns those).

const SFO = { lat: 37.6213, lon: -122.379 };
const FROM = new Date("2026-01-01T00:00:00Z").getTime();

function kinds(events: SkyEvent[]): Set<string> {
  return new Set(events.map((e) => e.kind));
}

describe("nextSkyEvents", () => {
  const events = nextSkyEvents(FROM, SFO.lat, SFO.lon, 400);

  it("returns a non-empty, time-sorted list within the horizon", () => {
    expect(events.length).toBeGreaterThan(0);
    for (let i = 1; i < events.length; i++) {
      expect(events[i].timeMs).toBeGreaterThanOrEqual(events[i - 1].timeMs);
    }
    const end = FROM + 400 * 86_400_000;
    for (const e of events) {
      expect(e.timeMs).toBeGreaterThanOrEqual(FROM);
      expect(e.timeMs).toBeLessThan(end);
    }
  });

  it("surfaces each category across a year", () => {
    const k = kinds(events);
    expect(k.has("moon-phase")).toBe(true);
    expect(k.has("season")).toBe(true);
    expect(k.has("meteor-shower")).toBe(true);
    expect(k.has("elongation")).toBe(true);
    // eclipses are rarer; at least two lunar + solar happen within 400 days.
    expect(k.has("eclipse")).toBe(true);
  });

  it("finds all four equinoxes/solstices in a calendar year", () => {
    const seasons = nextSkyEvents(FROM, SFO.lat, SFO.lon, 370).filter((e) => e.kind === "season");
    const labels = new Set(seasons.map((e) => e.label));
    expect(labels).toEqual(
      new Set(["March equinox", "June solstice", "September equinox", "December solstice"]),
    );
  });

  it("flags a full moon as visible and a new moon as not", () => {
    const phases = events.filter((e) => e.kind === "moon-phase");
    expect(phases.find((e) => e.label === "Full moon")?.visible).toBe(true);
    expect(phases.find((e) => e.label === "New moon")?.visible).toBe(false);
  });

  it("gates meteor-shower visibility on radiant altitude", () => {
    const showers = events.filter((e) => e.kind === "meteor-shower");
    expect(showers.length).toBeGreaterThan(0);
    for (const s of showers) {
      expect(s.visible).toBe((s.altDeg ?? -99) > 15);
    }
  });

  it("respects the opts filter", () => {
    const moonOnly = nextSkyEvents(FROM, SFO.lat, SFO.lon, 60, {
      moonPhases: true,
      eclipses: false,
      meteorShowers: false,
      elongations: false,
      seasons: false,
    });
    expect(moonOnly.every((e) => e.kind === "moon-phase")).toBe(true);
    expect(moonOnly.length).toBeGreaterThan(0);
  });

  it("differs by hemisphere: a far-northern radiant is lower from the south", () => {
    // Ursids radiant sits near +76 dec, so it rides high in the north and low
    // (or below the horizon) from southern latitudes.
    const north = nextSkyEvents(FROM, 60, 0, 400).find((e) => e.label === "Ursids peak");
    const south = nextSkyEvents(FROM, -40, 0, 400).find((e) => e.label === "Ursids peak");
    expect(north?.altDeg ?? -99).toBeGreaterThan(south?.altDeg ?? 99);
  });
});

describe("nextSkyEvent", () => {
  it("returns the soonest visible event, or null when nothing is soon", () => {
    const soon = nextSkyEvent(FROM, SFO.lat, SFO.lon, 30);
    if (soon) {
      expect(soon.visible).toBe(true);
      expect(soon.timeMs).toBeGreaterThanOrEqual(FROM);
      expect(soon.timeMs).toBeLessThan(FROM + 30 * 86_400_000);
    }
    // A one-day window from an arbitrary instant may legitimately have nothing.
    const none = nextSkyEvent(FROM, SFO.lat, SFO.lon, 0);
    expect(none).toBeNull();
  });
});
