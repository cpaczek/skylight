import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_CONFIG, type Config } from "@shared/index.js";
import {
  AggregatorGate,
  API_MIN_POLL_MS,
  API_USER_AGENT,
  Poller,
  type PollerOptions,
} from "../src/datasource.js";
import type { RouteEnricher } from "../src/enrich/routes.js";
import { ConfigStore, ConfigValidationError } from "../src/config-store.js";

// Regression tests for #66: airplanes.live went feeder-only and started
// answering the public API with 403, which took the no-radio path down with a
// message ("HTTP 403") that told nobody what to do about it. The aggregator is
// now a config field like radioUrl, so a dead provider is a one-field fix from
// the control panel rather than a rebuild.

const stubEnricher = { enrichSync: () => ({}) } as unknown as RouteEnricher;

function makeOpts(config: Config, over: Partial<PollerOptions> = {}): PollerOptions {
  return {
    source: "api",
    pollMs: 1000,
    supplementApi: false,
    apiPollMs: 4000,
    getConfig: () => config,
    enricher: stubEnricher,
    onSnapshot: () => {},
    onStatus: () => {},
    ...over,
  };
}

function withConfig(over: Partial<Config>): Config {
  return { ...DEFAULT_CONFIG, ...over };
}

/** A fetch stub that answers with `status` and an empty readsb payload. */
function stubFetch(status = 200) {
  return vi.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ ac: [] }),
  }));
}

describe("aggregator API source (#66)", () => {
  let fetchSpy: ReturnType<typeof stubFetch>;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchSpy = stubFetch();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("polls the aggregator from config, filling lat/lon/radius", async () => {
    const config = withConfig({
      apiUrl: "https://api.example/v2/point/{lat}/{lon}/{r}",
      centerLat: 37.6188,
      centerLon: -122.375,
      radiusMiles: 20,
    });
    const poller = new Poller(makeOpts(config));
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    poller.stop();

    // 20 mi -> 18 nm, +1 for the rounding margin buildApiUrl already applied.
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      "https://api.example/v2/point/37.6188/-122.375/19",
    );
  });

  it("fills a provider whose radius lives elsewhere in the path", async () => {
    // adsb.fi takes /lat/{lat}/lon/{lon}/dist/{r} rather than a /point/ triple.
    const config = withConfig({
      apiUrl: "https://opendata.adsb.fi/api/v2/lat/{lat}/lon/{lon}/dist/{r}",
      centerLat: 37.6188,
      centerLon: -122.375,
      radiusMiles: 20,
    });
    const poller = new Poller(makeOpts(config));
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    poller.stop();

    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      "https://opendata.adsb.fi/api/v2/lat/37.6188/lon/-122.375/dist/19",
    );
  });

  it("switches provider without a restart when the config changes", async () => {
    let config = withConfig({ apiUrl: "https://first.example/{lat}/{lon}/{r}" });
    const poller = new Poller(makeOpts(config, { getConfig: () => config }));
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(String(fetchSpy.mock.calls[0]?.[0])).toContain("first.example");

    config = withConfig({ apiUrl: "https://second.example/{lat}/{lon}/{r}" });
    await vi.advanceTimersByTimeAsync(API_MIN_POLL_MS);
    poller.stop();
    expect(String(fetchSpy.mock.calls.at(-1)?.[0])).toContain("second.example");
  });

  it("says what to do when the aggregator refuses the request", async () => {
    vi.stubGlobal("fetch", stubFetch(403));
    const statuses: string[] = [];
    const poller = new Poller(
      makeOpts(withConfig({ apiUrl: "https://api.example/{lat}/{lon}/{r}" }), {
        onStatus: (s) => {
          if (s.message) statuses.push(s.message);
        },
      }),
    );
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    poller.stop();

    const message = statuses.at(-1) ?? "";
    expect(message).toContain("403");
    // The point of the fix: name the knob, don't just report the status code.
    expect(message).toMatch(/API URL/i);
    expect(message).toContain("api.example");
  });

  it("still backs off instead of hammering through a 429", async () => {
    const rateLimited = stubFetch(429);
    vi.stubGlobal("fetch", rateLimited);
    const poller = new Poller(
      makeOpts(withConfig({ apiUrl: "https://api.example/{lat}/{lon}/{r}" })),
    );
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(rateLimited).toHaveBeenCalledTimes(1);

    // Backoff is 15s; the ticks in between must not reach the network.
    await vi.advanceTimersByTimeAsync(5000);
    poller.stop();
    expect(rateLimited).toHaveBeenCalledTimes(1);
  });

  it("polls the aggregator every 2s, not at the 1s radio rate", async () => {
    // adsb.fi allows 1 request/second and adsb.lol less: at the radio rate
    // every request after the first came back 429.
    const poller = new Poller(
      makeOpts(withConfig({ apiUrl: "https://api.example/{lat}/{lon}/{r}" })),
    );
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(4000);
    poller.stop();
    expect(fetchSpy).toHaveBeenCalledTimes(4);
  });

  it("does not hold a new provider to the old one's rate-limit backoff", async () => {
    const byHost = vi.fn(async (url: string) => {
      const limited = url.includes("limited.example");
      return { ok: !limited, status: limited ? 429 : 200, json: async () => ({ ac: [] }) };
    });
    vi.stubGlobal("fetch", byHost);
    let config = withConfig({ apiUrl: "https://limited.example/{lat}/{lon}/{r}" });
    const poller = new Poller(makeOpts(config, { getConfig: () => config }));
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(byHost).toHaveBeenCalledTimes(1);

    // Well inside the 15s backoff the 429 started.
    config = withConfig({ apiUrl: "https://open.example/{lat}/{lon}/{r}" });
    await vi.advanceTimersByTimeAsync(API_MIN_POLL_MS);
    poller.stop();
    expect(String(byHost.mock.calls.at(-1)?.[0])).toContain("open.example");
  });

  it("spaces out requests that share the aggregator's rate limit", async () => {
    // The feed and the SFO ground panel tick independently; fired together,
    // the second must wait rather than land in the same second.
    const gate = new AggregatorGate();
    const sent: number[] = [];
    const start = Date.now();
    const request = async () => {
      await gate.wait();
      sent.push(Date.now() - start);
    };
    void request();
    void request();
    void request();
    await vi.advanceTimersByTimeAsync(5000);

    expect(sent).toHaveLength(3);
    expect(sent[0]).toBe(0);
    expect(sent[1] - sent[0]).toBeGreaterThanOrEqual(1000);
    expect(sent[2] - sent[1]).toBeGreaterThanOrEqual(1000);
  });

  it("identifies itself, which adsb.lol requires (403 without it)", async () => {
    const poller = new Poller(
      makeOpts(withConfig({ apiUrl: "https://api.example/{lat}/{lon}/{r}" })),
    );
    poller.start();
    await vi.advanceTimersByTimeAsync(0);
    poller.stop();

    const init = fetchSpy.mock.calls[0]?.[1] as { headers?: Record<string, string> };
    expect(init?.headers?.["User-Agent"]).toBe(API_USER_AGENT);
    expect(API_USER_AGENT).toContain("skylight");
  });

  it("ships a default that needs no key and no radio", () => {
    expect(DEFAULT_CONFIG.apiUrl).toMatch(/^https:\/\//);
    for (const token of ["{lat}", "{lon}", "{r}"]) {
      expect(DEFAULT_CONFIG.apiUrl).toContain(token);
    }
    // airplanes.live is feeder-only now — it cannot be the out-of-box default.
    expect(DEFAULT_CONFIG.apiUrl).not.toContain("airplanes.live");
  });
});

describe("apiUrl validation", () => {
  it("rejects a non-http aggregator URL", () => {
    const store = new ConfigStore("/nonexistent/config.json");
    expect(() => store.patch({ apiUrl: "not a url" })).toThrow(ConfigValidationError);
    expect(() => store.patch({ apiUrl: "ftp://example.com/{lat}" })).toThrow(
      ConfigValidationError,
    );
  });

  it("accepts an http(s) aggregator URL", () => {
    const store = new ConfigStore("/nonexistent/config.json");
    expect(store.patch({ apiUrl: "https://api.example/{lat}/{lon}/{r}" }).apiUrl).toBe(
      "https://api.example/{lat}/{lon}/{r}",
    );
  });
});
