// SFO surface panel — "who's next": a mini airport diagram drawn from the
// real runway geometry with live ground traffic from airplanes.live (via the
// server's sfoGround feed). Taxiing aircraft (the ones about to be overhead)
// glow; parked/stationary traffic stays dim. Shown on the TV and the Twitch
// stream layout; the vertical TikTok page doesn't render it.

import { useMemo } from "react";
import type { GroundAircraft } from "@shared/index.js";
import { DEG, SFO_AIRPORT as SFO } from "@shared/index.js";

/** Diagram center: SFO ARP. */
const LAT0 = 37.6213;
const LON0 = -122.379;
/** Meters per degree at SFO's latitude. */
const M_PER_LAT = 110540;
const M_PER_LON = 111320 * Math.cos(LAT0 * DEG);
/** Diagram extent: ±this many meters from the ARP. */
const EXTENT_M = 2300;
const VIEW = 300; // square viewBox

function toXY(lat: number, lon: number): { x: number; y: number } {
  const e = (lon - LON0) * M_PER_LON;
  const n = (lat - LAT0) * M_PER_LAT;
  return {
    x: VIEW / 2 + (e / EXTENT_M) * (VIEW / 2),
    y: VIEW / 2 - (n / EXTENT_M) * (VIEW / 2),
  };
}

/** Moving on the surface = taxiing/rolling; these are the "next up" planes. */
const TAXI_MIN_KT = 3;

export function SfoGroundPanel(props: {
  ground: { at: number; aircraft: GroundAircraft[] } | null;
}): JSX.Element | null {
  const { ground } = props;
  const runways = useMemo(
    () =>
      SFO.runways.map((r) => ({
        a: toXY(r.le[0], r.le[1]),
        b: toXY(r.he[0], r.he[1]),
      })),
    [],
  );
  if (!ground) return null;

  const planes = ground.aircraft.filter((a) => {
    const p = toXY(a.lat, a.lon);
    return p.x >= 0 && p.x <= VIEW && p.y >= 0 && p.y <= VIEW;
  });
  const taxiing = planes
    .filter((a) => (a.gsKt ?? 0) >= TAXI_MIN_KT)
    .sort((x, y) => (y.gsKt ?? 0) - (x.gsKt ?? 0));
  const label = (a: GroundAircraft) => a.flight ?? a.reg ?? a.hex;

  return (
    <aside className="tv-ground">
      <div className="tv-ground-title">
        SFO GROUND · {planes.length} AIRCRAFT
      </div>
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="tv-ground-map">
        {/* runways */}
        {runways.map((r, i) => (
          <line
            key={i}
            x1={r.a.x}
            y1={r.a.y}
            x2={r.b.x}
            y2={r.b.y}
            className="tv-ground-runway"
          />
        ))}
        {/* aircraft */}
        {planes.map((a) => {
          const p = toXY(a.lat, a.lon);
          const moving = (a.gsKt ?? 0) >= TAXI_MIN_KT;
          const rot = a.trackDeg ?? 0;
          return (
            <g
              key={a.hex}
              transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}
              className={moving ? "tv-ground-ac moving" : "tv-ground-ac"}
            >
              <path
                d="M 0 -4.6 L 3.2 3.8 L 0 1.9 L -3.2 3.8 Z"
                transform={`rotate(${rot.toFixed(0)})`}
              />
              {moving && (
                <text x={5} y={3} className="tv-ground-label">
                  {label(a)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="tv-ground-next">
        {taxiing.length ? (
          <>
            <span className="tv-ground-next-tag">TAXIING</span>
            {taxiing.slice(0, 4).map((a) => (
              <span key={a.hex} className="tv-ground-next-flight">
                {label(a)}
              </span>
            ))}
          </>
        ) : (
          <span className="tv-ground-next-tag idle">APRON QUIET</span>
        )}
      </div>
    </aside>
  );
}
