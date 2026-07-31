// Airline name lookup by ICAO callsign prefix, backed by the OpenFlights
// public airline dataset (Open Database License). Downloaded on first use
// and cached on disk for a month, same pattern as airports.ts.

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat";
const MAX_AGE_MS = 30 * 24 * 3600_000;

async function cachedDat(dataDir: string): Promise<string> {
  const dir = join(dataDir, "openflights");
  const path = join(dir, "airlines.dat");
  let fresh = false;
  try {
    fresh = Date.now() - (await stat(path)).mtimeMs < MAX_AGE_MS;
  } catch {
    /* not downloaded yet */
  }
  if (!fresh) {
    try {
      const res = await fetch(URL, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      await mkdir(dir, { recursive: true });
      await writeFile(path, text);
      return text;
    } catch (e) {
      console.error("[airlines] OpenFlights download failed:", e);
    }
  }
  try {
    return await readFile(path, "utf8");
  } catch {
    throw new Error("airline database download failed — check the server's internet access");
  }
}

/** One CSV line -> fields, honoring quotes. Same parser style as airports.ts. */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

let cache: Map<string, string> | null = null;

/** airlines.dat has no header row; columns are fixed by position:
 *  0 id, 1 name, 2 alias, 3 IATA, 4 ICAO, 5 callsign, 6 country, 7 active */
async function buildIndex(dataDir: string): Promise<Map<string, string>> {
  const text = await cachedDat(dataDir);
  const byIcao = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const f = parseCsvLine(line);
    const name = f[1];
    const icao = f[4];
    if (icao && icao !== "\\N" && name && name !== "\\N") {
      byIcao.set(icao.toUpperCase(), name);
    }
  }
  return byIcao;
}

/** Resolve a callsign's operating airline from its ICAO prefix (e.g. the
 *  first 3 letters of "SWA808" -> "Southwest Airlines"). Returns null on
 *  no match rather than guessing. */
export async function lookupAirlineByCallsign(
  callsign: string,
  dataDir: string,
): Promise<string | null> {
  const prefix = callsign.trim().toUpperCase().match(/^[A-Z]{3}/)?.[0];
  if (!prefix) return null;
  if (!cache) cache = await buildIndex(dataDir);
  return cache.get(prefix) ?? null;
}