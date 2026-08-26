// Data acquisition: poll the active source (radio | api), normalize records
// into our Aircraft shape, enrich them, and emit snapshots. dump1090-fa and the
// ADS-B aggregators (adsb.lol, adsb.fi, airplanes.live) all speak the readsb
// JSON schema, so one normalizer covers every source.

import type { Aircraft, Config, DataSource } from "@shared/index.js";
import type { SourceStatus } from "@shared/index.js";
import { NM_PER_MILE, llToMeters, metersToMiles, rangeMeters } from "@shared/index.js";
import { lookupAirline, lookupType } from "./enrich/tables.js";
import type { RouteEnricher } from "./enrich/routes.js";

/** Raw readsb-style aircraft record (subset we use). */
interface RawAircraft {
  hex?: string;
  flight?: string;
  lat?: number;
  lon?: number;
  alt_baro?: number | "ground";
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  squawk?: string;
  category?: string;
  r?: string;
  t?: string;
  seen?: number;
  rssi?: number;
}

function normalize(raw: RawAircraft, ts: number): Aircraft | null {
  if (!raw.hex) return null;
  const onGround = raw.alt_baro === "ground";
  return {
    hex: raw.hex,
    flight: raw.flight?.trim() || undefined,
    lat: raw.lat,
    lon: raw.lon,
    altBaro: onGround ? null : (raw.alt_baro as number | undefined) ?? null,
    altGeom: raw.alt_geom ?? null,
    gs: raw.gs,
    track: raw.track,
    baroRate: raw.baro_rate ?? null,
    squawk: raw.squawk,
    category: raw.category,
    onGround,
    registration: raw.r,
    typeCode: raw.t,
    seen: raw.seen,
    rssi: raw.rssi,
    ts,
  };
}

/**
 * Aggregators want to know who is calling. adsb.lol answers 403 to anything
 * without a descriptive User-Agent — including Node's default — so this is not
 * just courtesy, it's the difference between the api source working and not.
 * (Same ask Nominatim makes of the geocoder.)
 */
export const API_USER_AGENT = "skylight/0.1 (+https://github.com/cpaczek/skylight)";

/** A non-2xx response, carrying the status so callers can branch on it rather
 *  than parse a message. */
class HttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
    this.name = "HttpError";
  }
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: { "User-Agent": API_USER_AGENT },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new HttpError(res.status);
  return res.json();
}

/**
 * Turn a fetch failure into something a human can act on. "source fetch
 * failed" alone is useless when the real problem is a Docker container that
 * can't resolve a sibling's hostname or an API rate limit (#24, #32).
 */
function describeFetchError(e: unknown, source: DataSource): string {
  if (!(e instanceof Error)) return "fetch failed";
  if (e.name === "TimeoutError" || e.name === "AbortError") return "timeout after 5s";
  // An aggregator that goes feeder-only answers 401/403 forever, and the status
  // code alone reads like a bug in Skylight. Name the knob instead — this is
  // how airplanes.live stranded every no-radio install (#66).
  if (source === "api" && e instanceof HttpError && (e.status === 401 || e.status === 403)) {
    return (
      `${e.message} — the aggregator refused the request; it likely serves ` +
      "feeders only now, so try a different API URL"
    );
  }
  const code: string | undefined =
    (e.cause as { code?: string } | undefined)?.code ?? (e as { code?: string }).code;
  switch (code) {
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return "DNS lookup failed";
    case "ECONNREFUSED":
      return "connection refused";
    case "EHOSTUNREACH":
    case "ENETUNREACH":
      return "host unreachable";
    case "ETIMEDOUT":
      return "connect timeout";
    case "ECONNRESET":
      return "connection reset";
  }
  if (code) return code;
  return e.message || "fetch failed";
}

/** Hold off the API after an HTTP 429 — hammering through a rate limit just
 *  extends it (the freeze/vanish/reappear cycle in #24). */
const RATE_LIMIT_BACKOFF_MS = 15_000;

/**
 * Fill an aggregator URL template from a location and radius. Providers differ
 * in path shape — adsb.lol takes /v2/point/{lat}/{lon}/{r}, adsb.fi takes
 * /lat/{lat}/lon/{lon}/dist/{r} — so the whole URL is the unit of config.
 */
export function buildPointUrl(
  template: string,
  lat: number,
  lon: number,
  radiusNm: number,
): string {
  return template
    .replace("{lat}", String(lat))
    .replace("{lon}", String(lon))
    .replace("{r}", String(radiusNm));
}

export interface PollerOptions {
  source: DataSource;
  pollMs: number;
  /** When source is "radio", also poll the API and merge (keeps landing
   *  aircraft alive when local ADS-B drops them). */
  supplementApi: boolean;
  /** API poll cadence when supplementing (slower, to respect rate limits). */
  apiPollMs: number;
  getConfig: () => Config;
  enricher: RouteEnricher;
  onSnapshot: (now: number, aircraft: Aircraft[]) => void;
  onStatus: (status: SourceStatus) => void;
}

/**
 * Merge a primary (radio) list with a secondary (API) list by hex, preferring
 * whichever fix is fresher. Radio is biased a couple seconds so it wins while
 * it's tracking; the API takes over only once the radio fix goes stale.
 */
function mergeSources(radio: Aircraft[], api: Aircraft[]): Aircraft[] {
  const byHex = new Map<string, Aircraft>();
  for (const a of api) byHex.set(a.hex, a);
  for (const r of radio) {
    const existing = byHex.get(r.hex);
    if (!existing) {
      byHex.set(r.hex, r);
      continue;
    }
    const rSeen = (r.seen ?? 0) - 2; // bias toward the local radio
    const aSeen = existing.seen ?? 999;
    byHex.set(r.hex, rSeen <= aSeen ? r : existing);
  }
  return [...byHex.values()];
}

/** Enrichment we've resolved for an aircraft, kept sticky for its session. */
interface StickyEnrichment {
  typeName?: string;
  airline?: string;
  origin?: string;
  destination?: string;
  registration?: string;
  originName?: string;
  destName?: string;
  originLat?: number;
  originLon?: number;
  destLat?: number;
  destLon?: number;
  lastSeen: number;
}

export class Poller {
  private timer: ReturnType<typeof setInterval> | null = null;
  private apiTimer: ReturnType<typeof setInterval> | null = null;
  private status: SourceStatus;
  private last: Aircraft[] = [];
  /** Most recent API snapshot, used to supplement the radio. */
  private lastApi: Aircraft[] = [];
  /** hex -> last good enrichment, so resolved routes never flicker back to "—". */
  private sticky = new Map<string, StickyEnrichment>();
  /** Why the last poll failed, formatted for the status line. */
  private lastError: string | null = null;
  private lastErrorLogAt = 0;
  /** After an HTTP 429, no API requests until this timestamp. */
  private apiBackoffUntil = 0;

  constructor(private o: PollerOptions) {
    this.status = {
      source: o.source,
      ok: false,
      count: 0,
      lastOk: null,
    };
  }

  getSnapshot(): { now: number; aircraft: Aircraft[] } {
    return { now: Date.now(), aircraft: this.last };
  }
  getStatus(): SourceStatus {
    return this.status;
  }
  setSource(source: DataSource): void {
    this.o.source = source;
    this.status.source = source;
    this.syncApiTimer();
  }

  start(): void {
    if (this.timer) return;
    void this.tick();
    this.timer = setInterval(() => void this.tick(), this.o.pollMs);
    this.syncApiTimer();
  }
  stop(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.apiTimer) clearInterval(this.apiTimer);
    this.timer = null;
    this.apiTimer = null;
  }

  /**
   * The supplement timer should only run when the radio is primary — it exists
   * to keep landing aircraft alive when local ADS-B drops them. When the API is
   * itself the primary source, `tick()` already polls it, so a second timer just
   * doubles the request rate into the aggregator's rate limit (429s there make
   * polls fail, the display extrapolates, then drops aircraft — the "planes
   * disappearing and reappearing" in #15). Reconcile it against the live source.
   */
  private syncApiTimer(): void {
    const want = this.o.source === "radio" && this.o.supplementApi;
    if (want && !this.apiTimer && this.timer) {
      void this.refreshApi();
      this.apiTimer = setInterval(() => void this.refreshApi(), this.o.apiPollMs);
    } else if (!want && this.apiTimer) {
      clearInterval(this.apiTimer);
      this.apiTimer = null;
      this.lastApi = [];
    }
  }

  private async fetchList(source: DataSource, now: number): Promise<Aircraft[] | null> {
    const url = source === "radio" ? this.o.getConfig().radioUrl : this.buildApiUrl();
    try {
      const json = await fetchJson(url);
      const rawList: RawAircraft[] = json.aircraft ?? json.ac ?? [];
      const list: Aircraft[] = [];
      for (const raw of rawList) {
        const ac = normalize(raw, now);
        if (ac) list.push(ac);
      }
      // Area APIs sometimes return a far wider box than the radius we asked
      // for, so a 3-mile setup ends up showing flights across the country.
      // Trim to the configured radius ourselves (matching the renderer's
      // radiusMiles * 1.08 cutoff). The radio feed is already local-only.
      return source === "api" ? this.withinRadius(list) : list;
    } catch (e) {
      const reason = describeFetchError(e, source);
      if (source === "api" && e instanceof HttpError && e.status === 429) {
        this.apiBackoffUntil = now + RATE_LIMIT_BACKOFF_MS;
      }
      let host = url;
      try {
        host = new URL(url).host;
      } catch {
        // keep the raw url — a malformed one is itself the diagnosis
      }
      this.lastError = `${source} fetch failed: ${reason} (${host})`;
      if (now - this.lastErrorLogAt > 30_000) {
        this.lastErrorLogAt = now;
        console.error(`[poller] ${source} fetch failed: ${reason} — ${url}`);
      }
      return null;
    }
  }

  private async refreshApi(): Promise<void> {
    if (this.o.getConfig().planetariumMode) return;
    if (Date.now() < this.apiBackoffUntil) return;
    const list = await this.fetchList("api", Date.now());
    if (list) this.lastApi = list;
  }

  /** Keep only aircraft within the configured display radius. Position-less
   *  records are kept — they're extrapolated from the last known fix client-side. */
  private withinRadius(list: Aircraft[]): Aircraft[] {
    const c = this.o.getConfig();
    const maxMi = c.radiusMiles * 1.08;
    return list.filter((ac) => {
      if (ac.lat == null || ac.lon == null) return true;
      const mi = metersToMiles(rangeMeters(llToMeters(ac.lat, ac.lon, c.centerLat, c.centerLon)));
      return mi <= maxMi;
    });
  }

  private buildApiUrl(): string {
    const c = this.o.getConfig();
    const r = Math.min(250, Math.ceil(c.radiusMiles * NM_PER_MILE) + 1);
    return buildPointUrl(c.apiUrl, c.centerLat, c.centerLon, r);
  }

  private async tick(): Promise<void> {
    const now = Date.now();

    if (this.o.getConfig().planetariumMode) {
      this.last = [];
      this.status = {
        source: this.o.source,
        ok: true,
        count: 0,
        lastOk: now,
        message: "Aircraft display disabled",
      };
      this.o.onSnapshot(now, []);
      this.o.onStatus(this.status);
      return;
    }

    if (this.o.source === "api" && now < this.apiBackoffUntil) {
      const waitS = Math.ceil((this.apiBackoffUntil - now) / 1000);
      this.status = {
        ...this.status,
        ok: false,
        message: `API rate limited — retrying in ${waitS}s`,
      };
      this.o.onStatus(this.status);
      return;
    }
    const primary = await this.fetchList(this.o.source, now);
    if (primary === null) {
      this.status = {
        ...this.status,
        ok: false,
        message: this.lastError ?? "source fetch failed",
      };
      this.o.onStatus(this.status);
      return;
    }
    const supplement = this.o.source === "radio" && this.o.supplementApi;
    const merged = supplement ? mergeSources(primary, this.lastApi) : primary;
    for (const ac of merged) this.enrich(ac, now);
    this.last = merged;
    this.pruneSticky(now);
    this.status = {
      source: this.o.source,
      ok: true,
      count: merged.length,
      lastOk: now,
      message: supplement ? `radio + ${this.lastApi.length} via API` : undefined,
    };
    this.o.onSnapshot(now, merged);
    this.o.onStatus(this.status);
  }

  private enrich(ac: Aircraft, now: number): void {
    // Instant table lookups first.
    ac.typeName = lookupType(ac.typeCode);
    ac.airline = lookupAirline(ac.flight);

    // adsbdb fills gaps (route + better type), from cache when available.
    const e = this.o.enricher.enrichSync(ac.hex, ac.flight, now);
    if (e.route) {
      ac.airline = ac.airline ?? e.route.airline;
      ac.origin = e.route.origin ?? ac.origin;
      ac.destination = e.route.destination ?? ac.destination;
      ac.originName = e.route.originName ?? ac.originName;
      ac.destName = e.route.destName ?? ac.destName;
      ac.originLat = e.route.originLat ?? ac.originLat;
      ac.originLon = e.route.originLon ?? ac.originLon;
      ac.destLat = e.route.destLat ?? ac.destLat;
      ac.destLon = e.route.destLon ?? ac.destLon;
    }
    if (e.aircraft) {
      ac.typeName = ac.typeName ?? e.aircraft.typeName;
      ac.registration = ac.registration ?? e.aircraft.registration;
    }

    // Sticky merge: once we've resolved something for this hex, never drop it
    // back to undefined on a later snapshot (prevents label flicker).
    const prev = this.sticky.get(ac.hex);
    ac.typeName = ac.typeName ?? prev?.typeName;
    ac.airline = ac.airline ?? prev?.airline;
    ac.origin = ac.origin ?? prev?.origin;
    ac.destination = ac.destination ?? prev?.destination;
    ac.registration = ac.registration ?? prev?.registration;
    ac.originName = ac.originName ?? prev?.originName;
    ac.destName = ac.destName ?? prev?.destName;
    ac.originLat = ac.originLat ?? prev?.originLat;
    ac.originLon = ac.originLon ?? prev?.originLon;
    ac.destLat = ac.destLat ?? prev?.destLat;
    ac.destLon = ac.destLon ?? prev?.destLon;
    this.sticky.set(ac.hex, {
      typeName: ac.typeName,
      airline: ac.airline,
      origin: ac.origin,
      destination: ac.destination,
      registration: ac.registration,
      originName: ac.originName,
      destName: ac.destName,
      originLat: ac.originLat,
      originLon: ac.originLon,
      destLat: ac.destLat,
      destLon: ac.destLon,
      lastSeen: now,
    });
  }

  /** Drop sticky entries for aircraft long gone (keep the map small). */
  private pruneSticky(now: number): void {
    for (const [hex, s] of this.sticky) {
      if (now - s.lastSeen > 600_000) this.sticky.delete(hex);
    }
  }
}
