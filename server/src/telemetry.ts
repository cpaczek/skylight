// Anonymous usage ping. Once a day the server tells telemetry.skylightceiling.com
// "an install with this random id is alive: this version, radio or api, this
// Pi model". Nothing about where it is. Off switch: the control panel
// (System → Anonymous usage ping) or SKYLIGHT_TELEMETRY=0 in the environment.
//
// The reply can carry remote defaults: an `apiUrl` is adopted only while the
// install still uses the shipped aggregator URL (so a dead free feed can be
// swapped without a code update), and a `notice` is logged.

import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { arch } from "node:os";
import { DEFAULT_CONFIG, type Config, type DataSource } from "@shared/index.js";

export const DEFAULT_TELEMETRY_URL = "https://telemetry.skylightceiling.com/ping";
const FIRST_PING_MS = 90_000;
const INTERVAL_MS = 24 * 3600_000;

export interface Ping {
  id: string;
  version: string;
  source: DataSource;
  arch: string;
  model: string | null;
}

export interface PingReply {
  ok?: boolean;
  latest?: string | null;
  apiUrl?: string | null;
  notice?: string | null;
}

/** The only state the ping needs from the config. */
export interface TelemetryStore {
  get(): Config;
  patch(p: Partial<Config>): Config;
}

/** Pure: what gets sent. Kept separate so a test can assert the shape. */
export function buildPing(id: string, version: string, source: DataSource, model: string | null): Ping {
  return { id, version, source, arch: arch(), model };
}

/** Pure: apply a reply's remote defaults. Returns a log line or null. */
export function applyReply(store: TelemetryStore, reply: PingReply): string | null {
  const url = reply.apiUrl;
  if (
    typeof url === "string" &&
    url.startsWith("https://") &&
    url.includes("{lat}") &&
    url !== DEFAULT_CONFIG.apiUrl &&
    store.get().apiUrl === DEFAULT_CONFIG.apiUrl
  ) {
    store.patch({ apiUrl: url });
    return `aggregator URL updated from the shipped default to ${url}`;
  }
  return null;
}

/** Random id, created once and persisted with the rest of the config. */
export function ensureInstallId(store: TelemetryStore): string {
  const cur = store.get().installId;
  if (cur) return cur;
  const id = randomUUID();
  store.patch({ installId: id });
  return id;
}

async function gitVersion(cwd: string): Promise<string | null> {
  return new Promise((resolve) => {
    execFile("git", ["-C", cwd, "rev-parse", "--short", "HEAD"], { timeout: 3000 }, (err, out) => {
      resolve(err ? null : out.trim() || null);
    });
  });
}

async function piModel(): Promise<string | null> {
  try {
    const raw = await readFile("/proc/device-tree/model", "utf8");
    return raw.replace(/\0/g, "").trim() || null;
  } catch {
    return null;
  }
}

export interface TelemetryOptions {
  store: TelemetryStore;
  source: DataSource;
  /** Endpoint; TELEMETRY_URL in the environment overrides. */
  url?: string;
  /** SKYLIGHT_TELEMETRY=0 turns the whole thing off before anything is generated. */
  enabled?: boolean;
  /** Fallback version when not running from a git checkout. */
  packageVersion?: string;
  log?: (line: string) => void;
}

/** Start the daily ping. Returns a stop function. */
export function startTelemetry(o: TelemetryOptions): () => void {
  const log = o.log ?? ((l: string) => console.log(`[telemetry] ${l}`));
  if (o.enabled === false) {
    log("off (SKYLIGHT_TELEMETRY=0)");
    return () => {};
  }
  const url = o.url || DEFAULT_TELEMETRY_URL;
  const id = ensureInstallId(o.store);
  log(`anonymous daily usage ping is on (id ${id.slice(0, 8)}…). Turn it off: control panel → System, or SKYLIGHT_TELEMETRY=0`);

  let warnedOff = false;
  const tick = async () => {
    if (o.store.get().telemetry === false) {
      if (!warnedOff) log("off (control panel)");
      warnedOff = true;
      return;
    }
    warnedOff = false;
    try {
      const version = (await gitVersion(process.cwd())) ?? o.packageVersion ?? "unknown";
      const ping = buildPing(id, version, o.source, await piModel());
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "user-agent": "skylight-server" },
        body: JSON.stringify(ping),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return log(`ping not accepted (HTTP ${res.status})`);
      const reply = (await res.json()) as PingReply;
      const applied = applyReply(o.store, reply);
      if (applied) log(applied);
      if (reply.notice) log(`notice: ${reply.notice}`);
    } catch (e) {
      log(`ping skipped (${(e as Error).message})`);
    }
  };

  const first = setTimeout(() => void tick(), FIRST_PING_MS);
  const every = setInterval(() => void tick(), INTERVAL_MS);
  first.unref();
  every.unref();
  return () => {
    clearTimeout(first);
    clearInterval(every);
  };
}
