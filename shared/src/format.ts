// Display formatting helpers shared between the display renderer and any HUD.

import type { SpeedUnit, AltitudeUnit, DistanceUnit } from "./config.js";

import { FT_TO_M, KT_TO_MPH, KT_TO_KMH, MI_TO_KM } from "./constants.js";

const SPEED_SUFFIX: Record<SpeedUnit, string> = {
  kt: "kt",
  mph: "mph",
  kmh: "km/h",
};
const ALTITUDE_SUFFIX: Record<AltitudeUnit, string> = {
  ft: "ft",
  m: "m",
};
const DISTANCE_SUFFIX: Record<DistanceUnit, string> = {
  mi: "mi",
  km: "km",
};

/** Instantiate cached Intl.NumberFormat format function (using the current browser locale) */
export const NUMBER_FORMAT = new Intl.NumberFormat().format;

export function round(value: number, precision?: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

/** Convert a ground speed in knots (as ADS-B reports it) to the chosen unit. */
export function convertSpeed(gsKnots: number, unit: SpeedUnit): number {
  switch (unit) {
    case "mph":
      return gsKnots * KT_TO_MPH;
    case "kmh":
      return gsKnots * KT_TO_KMH;
    default:
      return gsKnots;
  }
}

/** Convert altitude stored in feet to the chosen display unit. */
export function convertAltitude(altitudeFt: number, unit: AltitudeUnit): number {
  switch (unit) {
    case "m":
      return altitudeFt * FT_TO_M;
    default:
      return altitudeFt;
  }
}

/** Convert a display-unit altitude back to feet for storage. */
export function convertAltitudeToFt(value: number, unit: AltitudeUnit): number {
  switch (unit) {
    case "m":
      return value / FT_TO_M;
    default:
      return value;
  }
}

/** Convert distance stored in miles to the chosen display unit. */
export function convertDistance(distanceMi: number, unit: DistanceUnit): number {
  switch (unit) {
    case "km":
      return distanceMi * MI_TO_KM;
    default:
      return distanceMi;
  }
}

/** Convert a display-unit distance back to miles for storage. */
export function convertDistanceToMi(value: number, unit: DistanceUnit): number {
  switch (unit) {
    case "km":
      return value / MI_TO_KM;
    default:
      return value;
  }
}

/** Signed decimal degrees, e.g. `37.6213, -122.3790`. */
export function formatLatLon(lat: number, lon: number): string {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

/** Format a ground speed in the specified unit as a rounded, unit-suffixed string. */
export function formatSpeed(gsKnots: number, unit: SpeedUnit): string {
  return `${NUMBER_FORMAT(round(convertSpeed(gsKnots, unit)))} ${SPEED_SUFFIX[unit]}`;
}

/** Format altitude in the specified unit as a rounded, unit-suffixed string. */
export function formatAltitude(altitudeFt: number, unit: AltitudeUnit): string {
  return `${NUMBER_FORMAT(round(convertAltitude(altitudeFt, unit)))} ${ALTITUDE_SUFFIX[unit]}`;
}

/** Format distance in the specified unit as a rounded, unit-suffixed string. */
export function formatDistance(distanceMi: number, unit: DistanceUnit): string {
  return `${NUMBER_FORMAT(round(convertDistance(distanceMi, unit)))} ${DISTANCE_SUFFIX[unit]}`;
}
