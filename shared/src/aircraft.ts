// Normalized aircraft model. The server maps both dump1090 (`aircraft.json`)
// and the aggregator APIs into this single shape so the renderer never
// cares where the data came from.

export interface Aircraft {
  /** 24-bit ICAO address — the stable key for everything. */
  hex: string;
  /** Callsign, trimmed (e.g. "UAL1234"). */
  flight?: string;

  lat?: number;
  lon?: number;
  /** Barometric altitude in feet, or null when on ground. */
  altBaro?: number | null;
  /** Geometric altitude in feet. */
  altGeom?: number | null;
  /** Ground speed, knots. */
  gs?: number;
  /** Track / heading over ground, degrees. */
  track?: number;
  /** Vertical rate, ft/min (positive = climbing). */
  baroRate?: number | null;
  squawk?: string;
  category?: string;
  onGround?: boolean;

  /** Registration (dump1090 `r`). */
  registration?: string;
  /** ICAO type code, e.g. "B738" (dump1090 `t`). */
  typeCode?: string;

  /** Seconds since the last message for this aircraft (from the source). */
  seen?: number;
  /** Signal strength, dBFS (radio only). */
  rssi?: number;

  // --- enrichment (filled server-side) ---
  /** Human type name, e.g. "Boeing 737-800". */
  typeName?: string;
  airline?: string;
  origin?: string;
  destination?: string;
  /** Destination/origin city + coordinates (for ghost arcs + local time). */
  originName?: string;
  destName?: string;
  originLat?: number;
  originLon?: number;
  destLat?: number;
  destLon?: number;

  /** Server timestamp (ms) of the snapshot this fix came from. */
  ts?: number;
}

/** A single broadcast snapshot of the current sky. */
export interface AircraftSnapshot {
  /** Server time (ms epoch) the snapshot was produced. */
  now: number;
  aircraft: Aircraft[];
}
