import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_CONFIG } from "@shared/index.js";
import { Poller, type PollerOptions } from "../src/datasource.js";
import type { RouteEnricher } from "../src/enrich/routes.js";

// Regression test for #15: when the API is the *primary* source, the supplement
// timer must not also poll it — the double request rate trips airplanes.live's
// rate limit and makes aircraft flicker out and back.

const stubEnricher = { enrichSync: () => ({}) } as unknown as RouteEnricher;

function makeOpts(over: Partial<PollerOptions>): PollerOptions {
  return {
    source: "api",
    pollMs: 1000,
    supplementApi: true,
    apiPollMs: 4000,
    getConfig: () => DEFAULT_CONFIG,
    enricher: stubEnricher,
    onSnapshot: () => {},
    onStatus: () => {},
    ...over,
  };
}

describe("Poller supplement-timer lifecycle (#15)", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchSpy = vi.fn(async () => ({
      ok: true,
      json: async () => ({ aircraft: [] }),
    }));
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("does not double-poll when the API is the primary source", async () => {
    const poller = new Poller(makeOpts({ source: "api" }));
    poller.start();
    await vi.advanceTimersByTimeAsync(4100); // 4 primary ticks, 0 supplement ticks
    poller.stop();
    // 1 immediate + 4 interval ticks = 5; a stray supplement timer would add more.
    expect(fetchSpy).toHaveBeenCalledTimes(5);
  });

  it("runs the supplement timer only while radio is primary", async () => {
    const poller = new Poller(makeOpts({ source: "radio" }));
    poller.start();
    await vi.advanceTimersByTimeAsync(0); // flush immediate radio + supplement polls
    const afterStart = fetchSpy.mock.calls.length;
    expect(afterStart).toBeGreaterThanOrEqual(2); // radio tick + supplement refresh

    // Switching to API should tear the supplement timer down.
    poller.setSource("api");
    fetchSpy.mockClear();
    await vi.advanceTimersByTimeAsync(4100);
    poller.stop();
    // 4 primary interval ticks over 4100ms; a live supplement timer would add ~1 more.
    expect(fetchSpy).toHaveBeenCalledTimes(4);
  });
});
