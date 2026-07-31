import type { Aircraft, Config } from "@shared/index.js";
import { routePlausible, greatCircleMiles, EMERGENCY_SQUAWKS } from "@shared/index.js";
import { useEffect, useState } from "react";

const cityCache = new Map<string, string>();

async function cityFor(code?: string | null): Promise<string | null> {
  if (!code) return null;
  if (cityCache.has(code)) return cityCache.get(code)!;
  try {
    const res = await fetch(`/api/city?code=${encodeURIComponent(code)}`);
    const data = await res.json();
    const city = data.city ?? code;
    cityCache.set(code, city);
    return city;
  } catch {
    return code;
  }
}

const airlineCache = new Map<string, string | null>();

async function airlineFor(callsign?: string | null): Promise<string | null> {
  if (!callsign) return null;
  if (airlineCache.has(callsign)) return airlineCache.get(callsign)!;
  try {
    const res = await fetch(`/api/airline?callsign=${encodeURIComponent(callsign)}`);
    const data = await res.json();
    airlineCache.set(callsign, data.name ?? null);
    return data.name ?? null;
  } catch {
    return null;
  }
}

function relatableAltitude(ft?: number | null): string {
  if (ft == null) return "altitude unknown";
  const miles = (ft / 5280).toFixed(1);
  return `${ft.toLocaleString("en-US")} ft · about ${miles} mi up`;
}

function verticalTrend(rate?: number | null): string | null {
  if (rate == null || Math.abs(rate) < 150) return null;
  const fpm = Math.abs(Math.round(rate / 100) * 100);
  return rate > 0 ? `climbing · ${fpm.toLocaleString("en-US")} ft/min` : `descending · ${fpm.toLocaleString("en-US")} ft/min`;
}

const COMPASS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

function headingLabel(track?: number | null): string | null {
  if (track == null) return null;
  const idx = Math.round(track / 22.5) % 16;
  return `${Math.round(track)}° ${COMPASS[idx]}`;
}

function milesToGo(ac: Aircraft, destCode: string | null | undefined): number | null {
  if (ac.lat == null || ac.lon == null || !destCode) return null;
  let destLat: number | undefined;
  let destLon: number | undefined;
  if (destCode === ac.destination) {
    destLat = ac.destLat ?? undefined;
    destLon = ac.destLon ?? undefined;
  } else if (destCode === ac.origin) {
    destLat = ac.originLat ?? undefined;
    destLon = ac.originLon ?? undefined;
  }
  if (destLat == null || destLon == null) return null;
  return Math.round(greatCircleMiles(ac.lat, ac.lon, destLat, destLon));
}

function resolveRoute(
  ac: Aircraft,
  cfg: Config,
): { origin: string | null | undefined; dest: string | null | undefined } | null {
  if (routePlausible(ac, cfg)) {
    return { origin: ac.origin, dest: ac.destination };
  }
  const swapped: Aircraft = {
    ...ac,
    origin: ac.destination,
    destination: ac.origin,
    originLat: ac.destLat,
    originLon: ac.destLon,
    destLat: ac.originLat,
    destLon: ac.originLon,
  };
  if (routePlausible(swapped, cfg)) {
    return { origin: swapped.origin, dest: swapped.destination };
  }
  return null;
}

function Row(props: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "3px 0" }}>
      <span style={{ color: "#6B7A8F", fontSize: 11, letterSpacing: "0.4px", textTransform: "uppercase" }}>
        {props.label}
      </span>
      <span style={{ color: "#D6DEEA", fontSize: 12.5, textAlign: "right" }}>{props.value}</span>
    </div>
  );
}

export function PlaneCard(props: { ac: Aircraft; cfg: Config; onClose: () => void }) {
  const { ac, cfg, onClose } = props;
  const alt = ac.altBaro ?? ac.altGeom;
  const route = resolveRoute(ac, cfg);
  const trend = verticalTrend(ac.baroRate);
  const heading = headingLabel(ac.track);
  const isEmergency = !!ac.squawk && EMERGENCY_SQUAWKS.has(ac.squawk);

  const [origin, setOrigin] = useState<string | null>(null);
  const [dest, setDest] = useState<string | null>(null);

  const [airline, setAirline] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (ac.flight) airlineFor(ac.flight).then((a) => !cancelled && setAirline(a));
    else setAirline(null);
    return () => {
      cancelled = true;
    };
  }, [ac.flight]);

  useEffect(() => {
    let cancelled = false;
    if (route?.origin) cityFor(route.origin).then((c) => !cancelled && setOrigin(c));
    else setOrigin(null);
    if (route?.dest) cityFor(route.dest).then((c) => !cancelled && setDest(c));
    else setDest(null);
    return () => {
      cancelled = true;
    };
  }, [route?.origin, route?.dest]);

  return (
    <div
      className="plane-card"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        cursor: "none",
        width: 240,
        opacity: "var(--card-alpha, 1)",
        transition: "opacity 0.3s linear",
        background: "linear-gradient(180deg, rgba(28,32,44,0.45) 0%, rgba(16,19,28,0.52) 100%)",
        backdropFilter: "blur(6px) saturate(130%)",
        border: "1px solid rgba(255,198,92,0.14)",
        borderRadius: 12,
        padding: "14px 16px 12px",
        color: "#AEB6C6",
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
          color: "#6B7A8F",
          fontSize: 13,
          cursor: "none",
          padding: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>

      <div style={{ color: "#F5F7FF", fontWeight: 600, fontSize: 16, letterSpacing: "0.3px" }}>
        {ac.flight ?? ac.hex.toUpperCase()}
      </div>
      {airline && (
        <div style={{ color: "#9AAAC2", fontSize: 12.5, marginTop: 1 }}>{airline}</div>
      )}
      {ac.typeName && (
        <div style={{ color: "#8B98AC", fontSize: 12, marginTop: 1 }}>{ac.typeName}</div>
      )}

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 0 8px" }} />

      <Row label="Altitude" value={relatableAltitude(alt ?? undefined)} />
      {trend && <Row label="Vertical" value={trend} />}
      {ac.gs != null && <Row label="Speed" value={`${Math.round(ac.gs)} kt`} />}
      {ac.registration && <Row label="Tail #" value={ac.registration} />}
      {heading && <Row label="Heading" value={heading} />}
      {ac.squawk && (
        <Row
          label="Squawk"
          value={isEmergency ? `${ac.squawk} · emergency code` : ac.squawk}
        />
      )}

      {origin && dest && (
        <>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
          <div style={{ color: "#F5F7FF", fontSize: 13, fontWeight: 500 }}>
            {origin} <span style={{ color: "#4A5568" }}>→</span> {dest}
          </div>
          {(() => {
            const mi = milesToGo(ac, route?.dest);
            return mi != null ? (
              <div style={{ color: "#8B98AC", fontSize: 12, marginTop: 2 }}>
                {mi.toLocaleString("en-US")} mi to go
              </div>
            ) : null;
          })()}
        </>
      )}
    </div>
  );
}