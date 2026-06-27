// Resolve a free-text location query to coordinates. Two paths: a direct
// "lat,lon" fast path, and a Nominatim (OpenStreetMap) lookup for place names,
// cities, and airport codes. Kept dependency-free and unit-testable; the network
// piece takes an injectable endpoint so tests never hit the real service.

import { formatLatLon } from "@shared/format.js";

export interface GeoResult {
  lat: number;
  lon: number;
  name: string;
}

export function validLatLon(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

/** Parse a `lat,lon` / `lat lon` string; null if it isn't a valid coord pair. */
export function parseCoords(q: string): GeoResult | null {
  const m = q.trim().match(/^(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!validLatLon(lat, lon)) return null;
  return { lat, lon, name: formatLatLon(lat, lon) };
}

export interface GeocodeOpts {
  /** Nominatim requires a descriptive User-Agent identifying the app. */
  userAgent: string;
  timeoutMs?: number;
  /** Override the search endpoint (for tests). */
  endpoint?: string;
}

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

/** Resolve a place name / city / airport code via Nominatim. null = no match. */
export async function geocodePlace(
  q: string,
  opts: GeocodeOpts,
): Promise<GeoResult | null> {
  const base = opts.endpoint ?? NOMINATIM;
  const url = `${base}?format=jsonv2&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": opts.userAgent, "Accept-Language": "en" },
    signal: AbortSignal.timeout(opts.timeoutMs ?? 6000),
  });
  if (!res.ok) return null;
  const js = (await res.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
  }>;
  const hit = Array.isArray(js) ? js[0] : undefined;
  if (!hit) return null;
  const lat = Number(hit.lat);
  const lon = Number(hit.lon);
  if (!validLatLon(lat, lon)) return null;
  const name = (hit.display_name ?? q).split(",")[0].trim() || q;
  return { lat, lon, name };
}

/** Full resolve: coord fast-path, else Nominatim. null = unresolved. */
export async function resolveLocation(
  q: string,
  opts: GeocodeOpts,
): Promise<GeoResult | null> {
  const trimmed = q.trim();
  if (!trimmed) return null;
  return parseCoords(trimmed) ?? (await geocodePlace(trimmed, opts));
}
