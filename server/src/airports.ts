// Airport lookup by ICAO/IATA code, backed by the OurAirports public-domain
// dataset (airports.csv + runways.csv). The CSVs are downloaded on first use
// and cached on disk for a month; if a refresh download fails, the stale
// cache keeps working.

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Airport, Runway } from "@shared/index.js";

const BASE = "https://davidmegginson.github.io/ourairports-data";
const MAX_AGE_MS = 30 * 24 * 3600_000;

async function cachedCsv(dataDir: string, name: string): Promise<string> {
  const dir = join(dataDir, "ourairports");
  const path = join(dir, name);
  let fresh = false;
  try {
    fresh = Date.now() - (await stat(path)).mtimeMs < MAX_AGE_MS;
  } catch {
    // not downloaded yet
  }
  if (!fresh) {
    try {
      const res = await fetch(`${BASE}/${name}`, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      await mkdir(dir, { recursive: true });
      await writeFile(path, text);
      return text;
    } catch (e) {
      // fall through to a stale cache if we have one
      console.error(`[airports] OurAirports ${name} download failed:`, e);
    }
  }
  try {
    return await readFile(path, "utf8");
  } catch {
    throw new Error("airport database download failed — check the server's internet access");
  }
}

/** One CSV line -> fields, honoring quotes ("a,b" stays one field). */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

/**
 * Resolve an airport (with runway geometry) by ICAO ident ("KSFO", "EDDF")
 * or IATA code ("SFO"). Throws with a human-readable message on miss.
 */
export async function lookupAirport(code: string, dataDir: string): Promise<Airport> {
  const q = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,4}$/.test(q)) {
    throw new Error("enter an ICAO (KSFO) or IATA (SFO) airport code");
  }

  const airportsCsv = await cachedCsv(dataDir, "airports.csv");
  const lines = airportsCsv.split("\n");
  const h = parseCsvLine(lines[0]);
  const cIdent = h.indexOf("ident");
  const cName = h.indexOf("name");
  const cLat = h.indexOf("latitude_deg");
  const cLon = h.indexOf("longitude_deg");
  const cIcao = h.indexOf("icao_code");
  const cIata = h.indexOf("iata_code");

  let row: string[] | null = null;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].includes(q)) continue; // cheap prefilter, ~80k rows
    const r = parseCsvLine(lines[i]);
    if (r[cIdent] === q) {
      row = r;
      break; // exact ident match always wins
    }
    if (!row && ((cIcao >= 0 && r[cIcao] === q) || (cIata >= 0 && r[cIata] === q))) {
      row = r;
    }
  }
  if (!row) throw new Error(`no airport found for "${q}"`);

  const ident = row[cIdent];
  const lat = parseFloat(row[cLat]);
  const lon = parseFloat(row[cLon]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error(`${ident} has no coordinates in OurAirports`);
  }

  const runwaysCsv = await cachedCsv(dataDir, "runways.csv");
  const rl = runwaysCsv.split("\n");
  const rh = parseCsvLine(rl[0]);
  const col = (name: string) => rh.indexOf(name);
  const cAp = col("airport_ident");
  const cClosed = col("closed");
  const cWidth = col("width_ft");
  const cLeId = col("le_ident");
  const cLeLat = col("le_latitude_deg");
  const cLeLon = col("le_longitude_deg");
  const cHeId = col("he_ident");
  const cHeLat = col("he_latitude_deg");
  const cHeLon = col("he_longitude_deg");

  const runways: Runway[] = [];
  for (let i = 1; i < rl.length; i++) {
    if (!rl[i].includes(ident)) continue;
    const r = parseCsvLine(rl[i]);
    if (r[cAp] !== ident || r[cClosed] === "1") continue;
    const le: [number, number] = [parseFloat(r[cLeLat]), parseFloat(r[cLeLon])];
    const he: [number, number] = [parseFloat(r[cHeLat]), parseFloat(r[cHeLon])];
    if (!le.every(Number.isFinite) || !he.every(Number.isFinite)) continue;
    runways.push({
      leIdent: r[cLeId] || "?",
      heIdent: r[cHeId] || "?",
      le,
      he,
      widthFt: parseFloat(r[cWidth]) || 100,
    });
  }
  if (!runways.length) {
    throw new Error(
      `OurAirports has no runway endpoint coordinates for ${ident} — ` +
        "smaller airfields often lack them",
    );
  }

  const iata = cIata >= 0 ? row[cIata] : "";
  return { icao: ident, name: iata || ident, fullName: row[cName], lat, lon, runways };
}

/**
 * Resolve just the city name for a 3-letter IATA code (fast path for the
 * click-card feature — no runway lookup needed). Falls back to the code
 * itself on any miss so the UI never shows an empty string.
 */
export async function lookupCity(code: string, dataDir: string): Promise<string> {
  const q = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,4}$/.test(q)) return code;

  try {
    const airportsCsv = await cachedCsv(dataDir, "airports.csv");
    const lines = airportsCsv.split("\n");
    const h = parseCsvLine(lines[0]);
    const cIdent = h.indexOf("ident");
    const cIcao = h.indexOf("icao_code");
    const cIata = h.indexOf("iata_code");
    const cCity = h.indexOf("municipality");

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].includes(q)) continue;
      const r = parseCsvLine(lines[i]);
      const isMatch =
        r[cIdent] === q ||
        (cIcao >= 0 && r[cIcao] === q) ||
        (cIata >= 0 && r[cIata] === q);
      if (isMatch && cCity >= 0 && r[cCity]) {
        return r[cCity];
      }
    }
  } catch {
    /* fall through to code fallback below */
  }
  return code;
}
