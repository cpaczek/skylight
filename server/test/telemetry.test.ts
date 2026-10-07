import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, mergeConfig, type Config } from "@shared/index.js";
import { applyReply, buildPing, ensureInstallId, type TelemetryStore } from "../src/telemetry.js";

function fakeStore(initial: Partial<Config> = {}): TelemetryStore & { patches: Partial<Config>[] } {
  let cfg = mergeConfig(DEFAULT_CONFIG, initial);
  const patches: Partial<Config>[] = [];
  return {
    patches,
    get: () => cfg,
    patch(p) {
      patches.push(p);
      cfg = mergeConfig(cfg, p);
      return cfg;
    },
  };
}

describe("telemetry ping", () => {
  it("contains only the agreed fields and never a location", () => {
    const ping = buildPing("11111111-2222-4333-8444-555555555555", "abc1234", "radio", "Raspberry Pi 5 Model B Rev 1.1");
    expect(Object.keys(ping).sort()).toEqual(["arch", "id", "model", "source", "version"]);
    expect(JSON.stringify(ping)).not.toMatch(/lat|lon|centre|center/i);
  });

  it("creates the install id once and persists it", () => {
    const store = fakeStore();
    const a = ensureInstallId(store);
    const b = ensureInstallId(store);
    expect(a).toMatch(/^[0-9a-f-]{36}$/);
    expect(b).toBe(a);
    expect(store.patches).toHaveLength(1);
  });

  it("adopts a remote aggregator URL only while the shipped default is in use", () => {
    const store = fakeStore();
    const remote = "https://example.org/v9/{lat}/{lon}/{r}";
    expect(applyReply(store, { apiUrl: remote })).toMatch(/updated/);
    expect(store.get().apiUrl).toBe(remote);
    // A second, different remote URL is ignored: the install no longer uses the default.
    expect(applyReply(store, { apiUrl: "https://other.example/{lat}/{lon}/{r}" })).toBeNull();
    expect(store.get().apiUrl).toBe(remote);
  });

  it("ignores a customised install, non-https values and junk", () => {
    const custom = fakeStore({ apiUrl: "https://mine.example/{lat}/{lon}/{r}" });
    expect(applyReply(custom, { apiUrl: "https://example.org/{lat}/{lon}/{r}" })).toBeNull();
    const fresh = fakeStore();
    expect(applyReply(fresh, { apiUrl: "http://plain.example/{lat}/{lon}/{r}" })).toBeNull();
    expect(applyReply(fresh, { apiUrl: "https://no-placeholders.example/" })).toBeNull();
    expect(applyReply(fresh, { apiUrl: DEFAULT_CONFIG.apiUrl })).toBeNull();
    expect(applyReply(fresh, {})).toBeNull();
    expect(fresh.patches).toHaveLength(0);
  });
});
