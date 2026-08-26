// WebSocket message contracts between clients (display + control) and server.

import type { Config } from "./config.js";
import type { Aircraft } from "./aircraft.js";
import type { DataSource } from "./config.js";

export interface SourceStatus {
  source: DataSource;
  /** Whether the most recent poll succeeded. */
  ok: boolean;
  /** Number of aircraft in the last snapshot. */
  count: number;
  /** Last successful poll (ms epoch), or null. */
  lastOk: number | null;
  /** Human-readable note (e.g. last error). */
  message?: string;
}

/** An aircraft on the airport surface (from the aggregator's area API). */
export interface GroundAircraft {
  hex: string;
  /** Callsign, trimmed. */
  flight?: string;
  reg?: string;
  typeCode?: string;
  lat: number;
  lon: number;
  trackDeg?: number;
  gsKt?: number;
}

/** Server -> client. */
export type ServerMessage =
  | { type: "config"; config: Config }
  | { type: "aircraft"; now: number; aircraft: Aircraft[] }
  | { type: "status"; status: SourceStatus }
  | { type: "sfoGround"; at: number; aircraft: GroundAircraft[] };

/** Client -> server. */
export type ClientMessage =
  | { type: "hello"; role: "display" | "control" }
  | { type: "patchConfig"; patch: Partial<Config> }
  | { type: "setConfig"; config: Config }
  | { type: "resetConfig" };
