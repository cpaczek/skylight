// SFO surface traffic from the configured aggregator API — feeds the "who's
// taxiing / who's next" panel on the TV and the Twitch stream. The local
// receiver rarely hears surface targets 13 mi away at ground level, so this
// comes from the aggregator instead.
//
// It follows config.apiUrl rather than pinning a provider of its own: when
// airplanes.live went feeder-only this panel died silently alongside the main
// feed, and one dead host should only ever need fixing in one place (#66).
//
// Polite polling: one request every POLL_MS (aggregators ask hobby users to
// stay around 1 req/s; we're far under). Failures skip the tick and keep
// the last snapshot — the panel just shows slightly stale dots.

import type { GroundAircraft } from "@shared/index.js";
import { API_USER_AGENT, buildPointUrl, type AggregatorGate } from "./datasource.js";

const SFO_LAT = 37.6213;
const SFO_LON = -122.379;
const RADIUS_NM = 3;
const POLL_MS = 6000;

/** Raw readsb-style aircraft record (the fields we read). */
interface RawGroundAircraft {
  hex?: string;
  flight?: string;
  r?: string;
  t?: string;
  category?: string;
  alt_baro?: number | "ground";
  gs?: number;
  track?: number;
  lat?: number;
  lon?: number;
}

export class SfoGroundPoller {
  private timer: ReturnType<typeof setInterval> | null = null;
  private last: { at: number; aircraft: GroundAircraft[] } | null = null;
  private lastErrorLogAt = 0;

  constructor(
    private onUpdate: (at: number, aircraft: GroundAircraft[]) => void,
    /** The live config.apiUrl template — read per poll so a provider change
     *  from the control panel takes effect without a restart. */
    private getApiUrl: () => string,
    /** Shared with the main poller so the two never hit the aggregator in
     *  the same second. */
    private gate: AggregatorGate,
  ) {}

  /** Latest snapshot for late-joining clients (null until first success). */
  getSnapshot(): { at: number; aircraft: GroundAircraft[] } | null {
    return this.last;
  }

  start(): void {
    if (this.timer) return;
    void this.poll();
    this.timer = setInterval(() => void this.poll(), POLL_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private async poll(): Promise<void> {
    try {
      const url = buildPointUrl(this.getApiUrl(), SFO_LAT, SFO_LON, RADIUS_NM);
      await this.gate.wait();
      const res = await fetch(url, {
        headers: { "User-Agent": API_USER_AGENT },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Aggregators disagree on the list key: adsb.lol and adsb.fi's v3 say
      // "ac", adsb.fi's v2 and dump1090 say "aircraft".
      const body = (await res.json()) as {
        ac?: RawGroundAircraft[];
        aircraft?: RawGroundAircraft[];
      };
      const aircraft: GroundAircraft[] = [];
      for (const a of body.ac ?? body.aircraft ?? []) {
        if (a.alt_baro !== "ground") continue;
        if (a.lat == null || a.lon == null || !a.hex) continue;
        // Surface VEHICLES are ADS-B category C; TIS-B tracks with no
        // identity at all are almost always vehicles too. Keep aircraft.
        if (a.category?.startsWith("C")) continue;
        if (!a.t && !a.flight && !a.r) continue;
        aircraft.push({
          hex: a.hex,
          flight: a.flight?.trim() || undefined,
          reg: a.r,
          typeCode: a.t,
          lat: a.lat,
          lon: a.lon,
          trackDeg: a.track,
          gsKt: a.gs,
        });
      }
      const at = Date.now();
      this.last = { at, aircraft };
      this.onUpdate(at, aircraft);
    } catch (err) {
      // Quietly tolerant: log at most once a minute.
      const now = Date.now();
      if (now - this.lastErrorLogAt > 60_000) {
        this.lastErrorLogAt = now;
        console.warn(`[sfo-ground] poll failed: ${(err as Error).message}`);
      }
    }
  }
}
