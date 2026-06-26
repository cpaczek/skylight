import { describe, expect, it } from "vitest";
import { bearing, routePlausible, type Aircraft, type Config } from "../src/index.js";

const BSL = { lat: 47.59, lon: 7.529 };
const GOT = { lat: 57.7089, lon: 11.9746 };
const PLANE_NORTH_OF_BSL = { lat: 47.85, lon: 7.6 };

const localCfg = {
  centerLat: BSL.lat,
  centerLon: BSL.lon,
} as Config;

const distantCfg = {
  centerLat: 37.6213,
  centerLon: -122.379,
} as Config;

function routedAircraft(overrides: Partial<Aircraft> = {}): Aircraft {
  return {
    hex: "abc123",
    lat: PLANE_NORTH_OF_BSL.lat,
    lon: PLANE_NORTH_OF_BSL.lon,
    altBaro: 5000,
    origin: "BSL",
    destination: "GOT",
    originLat: BSL.lat,
    originLon: BSL.lon,
    destLat: GOT.lat,
    destLon: GOT.lon,
    ...overrides,
  };
}

describe("routePlausible", () => {
  it("keeps a low local route when track points toward the destination", () => {
    const track = bearing(PLANE_NORTH_OF_BSL.lat, PLANE_NORTH_OF_BSL.lon, GOT.lat, GOT.lon);

    expect(routePlausible(routedAircraft({ track }), localCfg)).toBe(true);
  });

  it("rejects a low local route when track points back toward the claimed origin", () => {
    const track = bearing(PLANE_NORTH_OF_BSL.lat, PLANE_NORTH_OF_BSL.lon, BSL.lat, BSL.lon);

    expect(routePlausible(routedAircraft({ track }), localCfg)).toBe(false);
  });

  it("skips the heading gate when track is missing", () => {
    expect(routePlausible(routedAircraft(), localCfg)).toBe(true);
  });

  it("skips the heading gate when only one endpoint has coordinates", () => {
    const track = bearing(PLANE_NORTH_OF_BSL.lat, PLANE_NORTH_OF_BSL.lon, BSL.lat, BSL.lon);
    const onlyDestination = routedAircraft({
      track,
      originLat: undefined,
      originLon: undefined,
    });
    const onlyOrigin = routedAircraft({
      track,
      destLat: undefined,
      destLon: undefined,
    });

    expect(routePlausible(onlyDestination, localCfg)).toBe(true);
    expect(routePlausible(onlyOrigin, localCfg)).toBe(true);
  });

  it("skips the heading gate for non-local traffic", () => {
    const track = bearing(PLANE_NORTH_OF_BSL.lat, PLANE_NORTH_OF_BSL.lon, BSL.lat, BSL.lon);

    expect(routePlausible(routedAircraft({ track }), distantCfg)).toBe(true);
  });

  it("skips the heading gate for high-altitude traffic", () => {
    const track = bearing(PLANE_NORTH_OF_BSL.lat, PLANE_NORTH_OF_BSL.lon, BSL.lat, BSL.lon);

    expect(routePlausible(routedAircraft({ altBaro: 35000, track }), localCfg)).toBe(true);
  });

  it("keeps legacy cache entries that have no route coordinates", () => {
    const track = bearing(PLANE_NORTH_OF_BSL.lat, PLANE_NORTH_OF_BSL.lon, BSL.lat, BSL.lon);
    const ac = routedAircraft({
      track,
      originLat: undefined,
      originLon: undefined,
      destLat: undefined,
      destLon: undefined,
    });

    expect(routePlausible(ac, localCfg)).toBe(true);
  });
});
