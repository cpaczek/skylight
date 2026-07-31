import { useEffect, useState } from "react";
import type { SkyBody } from "./celestial.js";

interface SatCatEntry {
  noradId: string;
  category: string;
  launchDate?: string;
  owner?: string;
}

let satCatPromise: Promise<Map<string, SatCatEntry>> | null = null;
function getSatCat(): Promise<Map<string, SatCatEntry>> {
  if (!satCatPromise) {
    satCatPromise = fetch("/api/satcat")
      .then((r) => (r.ok ? r.json() : []))
      .then((entries: SatCatEntry[]) => new Map(entries.map((e) => [e.noradId, e])))
      .catch(() => new Map<string, SatCatEntry>());
  }
  return satCatPromise;
}

function formatLaunchDate(raw?: string): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function describeOrbit(sat: SkyBody): string {
  if (sat.altitudeKm == null) return "altitude unavailable";
  const km = Math.round(sat.altitudeKm);
  const mi = Math.round(sat.altitudeKm * 0.621371);

  let regime: string;
  if (km < 2000) regime = "low Earth orbit";
  else if (km < 35786 * 0.9) regime = "medium Earth orbit";
  else if (km < 35786 * 1.1) regime = "geostationary orbit";
  else regime = "high Earth orbit";

  return `${regime} · ${mi.toLocaleString("en-US")} mi up`;
}

function issNote(sat: SkyBody): string | null {
  if (sat.kind !== "iss") return null;
  return "The only continuously crewed structure in orbit, home to rotating international crews since 2000";
}

function Row(props: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "3px 0" }}>
      <span style={{ color: "#5C7A94", fontSize: 11, letterSpacing: "0.4px", textTransform: "uppercase" }}>
        {props.label}
      </span>
      <span style={{ color: "#C7D6E8", fontSize: 12.5, textAlign: "right" }}>{props.value}</span>
    </div>
  );
}

export function SatelliteCard(props: { sat: SkyBody; onClose: () => void }) {
  const { sat, onClose } = props;
  const [entry, setEntry] = useState<SatCatEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!sat.noradId) {
      setEntry(null);
      return;
    }
    getSatCat().then((map) => {
      if (!cancelled) setEntry(map.get(sat.noradId!) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [sat.noradId]);

  const displayName =
    sat.kind === "iss" ? "International Space Station" : sat.name ?? "Satellite";

  return (
    <div
      className="plane-card sat-card"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        cursor: "none",
        width: 240,
        opacity: "var(--card-alpha, 1)",
        transition: "opacity 0.3s linear",
        background: "linear-gradient(180deg, rgba(18,28,42,0.45) 0%, rgba(10,15,24,0.52) 100%)",
        backdropFilter: "blur(6px) saturate(130%)",
        border: "1px solid rgba(140,200,255,0.14)",
        borderRadius: 12,
        padding: "14px 16px 12px",
        color: "#A9B8C9",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 13,
        lineHeight: 1.5,
        boxShadow: "0 8px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
      }}
    >
      <button className="card-close-btn"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "none",
          border: "none",
          color: "#5C7A94",
          fontSize: 13,
          cursor: "none",
          padding: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>

      <div style={{ color: "#E4F0FF", fontWeight: 600, fontSize: 16, letterSpacing: "0.3px" }}>
        {displayName}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 0 8px" }} />

      <Row label="Type" value={entry?.category ?? "Satellite"} />
      <Row label="Orbit" value={describeOrbit(sat)} />
      {entry?.owner && <Row label="Operator" value={entry.owner} />}
      {formatLaunchDate(entry?.launchDate) && (
        <Row label="Launched" value={formatLaunchDate(entry?.launchDate)!} />
      )}
      {sat.noradId && <Row label="NORAD ID" value={sat.noradId} />}
      {issNote(sat) && (
        <div style={{ color: "#8FA6BE", fontSize: 12, marginTop: 8, lineHeight: 1.4 }}>
          {issNote(sat)}
        </div>
      )}
    </div>
  );
}