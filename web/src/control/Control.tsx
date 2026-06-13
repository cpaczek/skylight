import { useEffect, useMemo, useState } from "react";
import type { Airport, Config, ShowFields, LocationProfile } from "@shared/index.js";
import { formatLatLon } from "@shared/geo.js";
import { useStream } from "../lib/useStream.js";
import { nextISSPass, type Tle } from "../display/celestial.js";
import { ColorRow, Row, Section, Segmented, Slider, TextInput, Toggle } from "./components.js";

function skyTimeLabel(offsetMin: number): string {
  if (offsetMin === 0) return "live";
  const d = new Date(Date.now() + offsetMin * 60000);
  return d.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

function fmtIn(ms: number): string {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const FIELD_LABELS: Record<keyof ShowFields, string> = {
  airline: "Airline",
  flight: "Flight",
  type: "Type",
  altitude: "Altitude",
  speed: "Speed",
  verticalRate: "Vert. rate",
  destination: "Destination",
  registration: "Registration",
};

export function Control() {
  const { state, conn } = useStream("control");
  const cfg = state.config;

  // Location editor (Nominatim via the server's /api/geocode).
  const [geoBusy, setGeoBusy] = useState(false);
  const [geoErr, setGeoErr] = useState<string | null>(null);

  // Airport runway import (OurAirports via the server's /api/airport).
  const [apBusy, setApBusy] = useState(false);
  const [apErr, setApErr] = useState<string | null>(null);

  // ISS pass finder (for the Sky section).
  const [tles, setTles] = useState<Tle[]>([]);
  useEffect(() => {
    let on = true;
    fetch("/api/tle")
      .then((r) => (r.ok ? r.json() : []))
      .then((t) => on && setTles(t as Tle[]))
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);
  const nextPass = useMemo(
    () => (tles.length && cfg ? nextISSPass(Date.now(), cfg.centerLat, cfg.centerLon, tles) : null),
    [tles, cfg?.centerLat, cfg?.centerLon],
  );

  if (!cfg) {
    return (
      <div className="loading">
        <div className={`dot ${state.connected ? "ok" : "bad"}`} />
        {state.connected ? "Loading config…" : "Connecting to tracker…"}
      </div>
    );
  }

  const set = (patch: Partial<Config>) => conn.patchConfig(patch);
  const setField = (k: keyof ShowFields, v: boolean) =>
    conn.patchConfig({ showFields: { ...cfg.showFields, [k]: v } });
  const statusMessage = state.status?.message ? ` · ${state.status.message}` : "";

  const changeLocation = async (q: string) => {
    if (!q.trim()) return;
    setGeoBusy(true);
    setGeoErr(null);
    try {
      const r = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      if (!r.ok) {
        setGeoErr(r.status === 404 ? `No match for “${q}”` : "Lookup failed");
        return;
      }
      const hit = (await r.json()) as { lat: number; lon: number; name: string };
      set({ centerLat: hit.lat, centerLon: hit.lon, locationName: hit.name });
    } catch {
      setGeoErr("Lookup failed");
    } finally {
      setGeoBusy(false);
    }
  };

  // --- saved location profiles (favorite airports) ---
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const atCurrent = (p: { lat: number; lon: number }) =>
    Math.abs(p.lat - cfg.centerLat) < 1e-4 && Math.abs(p.lon - cfg.centerLon) < 1e-4;
  const switchToProfile = (p: LocationProfile) =>
    set({ centerLat: p.lat, centerLon: p.lon, radiusMiles: p.radiusMiles, locationName: p.name });
  const saveCurrentProfile = () => {
    const name = cfg.locationName?.trim() || formatLatLon(cfg.centerLat, cfg.centerLon);
    const profile: LocationProfile = {
      id: genId(),
      name,
      lat: cfg.centerLat,
      lon: cfg.centerLon,
      radiusMiles: cfg.radiusMiles,
    };
    // Replace any existing profile already saved at this spot.
    const rest = cfg.locationProfiles.filter((p) => !atCurrent(p));
    set({ locationProfiles: [...rest, profile] });
  };
  const removeProfile = (id: string) =>
    set({ locationProfiles: cfg.locationProfiles.filter((p) => p.id !== id) });
  const centerOnTraffic = () => {
    const ac = state.aircraft.filter((a) => a.lat != null && a.lon != null);
    if (!ac.length) return;
    const lat = ac.reduce((s, a) => s + (a.lat as number), 0) / ac.length;
    const lon = ac.reduce((s, a) => s + (a.lon as number), 0) / ac.length;
    set({ centerLat: lat, centerLon: lon, locationName: "Traffic center" });
  };

  // Import runway geometry for any airport and draw it on the ceiling.
  const importAirport = async (code: string) => {
    if (!code.trim()) return;
    setApBusy(true);
    setApErr(null);
    try {
      const r = await fetch(`/api/airport?code=${encodeURIComponent(code.trim())}`);
      const body = (await r.json()) as Airport & { error?: string };
      if (!r.ok) {
        setApErr(body.error ?? "Lookup failed");
        return;
      }
      set({ airport: body, showAirport: true });
    } catch {
      setApErr("Lookup failed");
    } finally {
      setApBusy(false);
    }
  };
  const centerOnAirport = () =>
    set({
      centerLat: cfg.airport.lat,
      centerLon: cfg.airport.lon,
      locationName: cfg.airport.fullName ?? cfg.airport.icao,
    });

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoErr("Geolocation not supported on this device");
      return;
    }
    setGeoBusy(true);
    setGeoErr(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({
          centerLat: pos.coords.latitude,
          centerLon: pos.coords.longitude,
          locationName: "Current location",
        });
        setGeoBusy(false);
      },
      (err) => {
        setGeoBusy(false);
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied"
            : err.code === err.TIMEOUT
              ? "Location request timed out"
              : "Location unavailable";
        setGeoErr(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60_000 },
    );
  };

  return (
    <div className="control">
      <header className="topbar">
        <div className="brand">
          <span className={`dot ${state.connected ? "ok" : "bad"}`} />
          Ceiling Tracker
        </div>
        <div className="stat">
          {state.status?.source ?? "—"} · {state.aircraft.length} overhead{statusMessage}
        </div>
      </header>

      <main>
        <Section title="Location">
          <Row label={cfg.locationName || "Location"} hint={formatLatLon(cfg.centerLat, cfg.centerLon)}>
            <div className="loc-bar">
              <TextInput
                key={cfg.locationName}
                value=""
                placeholder="city, airport, or lat,lon"
                ariaLabel="Change location"
                onCommit={changeLocation}
              />
              <button
                type="button"
                className="loc-btn"
                aria-label="Use current location"
                disabled={geoBusy}
                onClick={useCurrentLocation}
              >
                Current
              </button>
            </div>
          </Row>
          {geoBusy && <Row label="" hint="resolving…"><span /></Row>}
          {geoErr && <Row label="" hint={geoErr}><span /></Row>}
          <div className="chips">
            {cfg.locationProfiles.map((pr) => (
              <span key={pr.id} className={`profile-chip ${atCurrent(pr) ? "on" : ""}`}>
                <button className="profile-name" onClick={() => switchToProfile(pr)}>
                  {pr.name}
                </button>
                <button
                  className="profile-del"
                  aria-label={`Delete ${pr.name}`}
                  onClick={() => removeProfile(pr.id)}
                >
                  ×
                </button>
              </span>
            ))}
            <button className="chip" onClick={saveCurrentProfile}>
              + Save current
            </button>
            {state.aircraft.length > 0 && (
              <button className="chip" onClick={centerOnTraffic}>
                Center on traffic
              </button>
            )}
          </div>
          <Row
            label="Runways"
            hint={`${cfg.airport.icao}${cfg.airport.fullName ? ` · ${cfg.airport.fullName}` : ""}`}
          >
            <div className="loc-bar">
              <TextInput
                key={cfg.airport.icao}
                value=""
                placeholder="airport code (KSFO, EDDF, SNA…)"
                ariaLabel="Import airport runways"
                onCommit={importAirport}
              />
              <button
                type="button"
                className="loc-btn"
                aria-label="Center view on the airport"
                disabled={apBusy}
                onClick={centerOnAirport}
              >
                Center
              </button>
            </div>
          </Row>
          {apBusy && <Row label="" hint="importing runways…"><span /></Row>}
          {apErr && <Row label="" hint={apErr}><span /></Row>}
        </Section>

        <Section title="Source">
          <Row label="Radio URL" hint="dump1090 aircraft.json">
            <TextInput
              value={cfg.radioUrl}
              ariaLabel="Radio aircraft JSON URL"
              onCommit={(v) => {
                if (v !== cfg.radioUrl) set({ radioUrl: v });
              }}
            />
          </Row>
        </Section>

        <Section title="Calibration">
          <Row label="Rotation" hint="align field to ceiling">
            <Slider value={cfg.rotationDeg} min={0} max={355} step={5} unit="°"
              onChange={(v) => set({ rotationDeg: v })} />
          </Row>
          <Row label="Mirror horizontally" hint="looking-up flip">
            <Toggle value={cfg.mirrorX} onChange={(v) => set({ mirrorX: v })} />
          </Row>
          <Row label="Mirror vertically">
            <Toggle value={cfg.mirrorY} onChange={(v) => set({ mirrorY: v })} />
          </Row>
          <Row label="Label rotation" hint="text only, not the map">
            <Slider value={cfg.labelRotationDeg} min={0} max={355} step={5} unit="°"
              onChange={(v) => set({ labelRotationDeg: v })} />
          </Row>
          <Row label="Radius" hint="wide ranges suit map projection best">
            <Slider value={cfg.radiusMiles} min={0.5} max={100} step={0.5} unit="mi"
              onChange={(v) => set({ radiusMiles: v })} />
          </Row>
          <Row label="Projection" hint="sky = realistic look-up motion">
            <Segmented
              value={cfg.projectionMode}
              options={[
                { value: "sky", label: "Sky" },
                { value: "map", label: "Map" },
              ]}
              onChange={(v) => set({ projectionMode: v })}
            />
          </Row>
        </Section>

        <Section title="View">
          <Row label="Theme">
            <Segmented value={cfg.theme}
              options={[
                { value: "ambient", label: "Ambient" },
                { value: "telemetry", label: "Telemetry" },
                { value: "focus", label: "Focus" },
              ]}
              onChange={(v) => set({ theme: v })} />
          </Row>
          <Row label="Brightness">
            <Slider value={cfg.brightness} min={0.1} max={1} step={0.05}
              onChange={(v) => set({ brightness: v })} />
          </Row>
          <Row label="Glyph size">
            <Slider value={cfg.glyphSizePx} min={6} max={40} step={1} unit="px"
              onChange={(v) => set({ glyphSizePx: v })} />
          </Row>
          <Row label="Trail length">
            <Slider value={cfg.trailSeconds} min={0} max={120} step={5} unit="s"
              onChange={(v) => set({ trailSeconds: v })} />
          </Row>
          <Row label="Color by altitude">
            <Toggle value={cfg.altitudeColor} onChange={(v) => set({ altitudeColor: v })} />
          </Row>
        </Section>

        <Section title="Labels">
          <Row label="Density">
            <Segmented value={cfg.labelDensity}
              options={[
                { value: "all", label: "All" },
                { value: "nearestN", label: "Nearest N" },
                { value: "nearestOnly", label: "Nearest" },
              ]}
              onChange={(v) => set({ labelDensity: v })} />
          </Row>
          {cfg.labelDensity === "nearestN" && (
            <Row label="N">
              <Slider value={cfg.nearestN} min={1} max={20} step={1}
                onChange={(v) => set({ nearestN: v })} />
            </Row>
          )}
          <Row label="Speed unit">
            <Segmented value={cfg.speedUnit}
              options={[
                { value: "kt", label: "kt" },
                { value: "mph", label: "mph" },
                { value: "kmh", label: "km/h" },
              ]}
              onChange={(v) => set({ speedUnit: v })} />
          </Row>
          <div className="chips">
            {(Object.keys(FIELD_LABELS) as (keyof ShowFields)[]).map((k) => (
              <button key={k}
                className={`chip ${cfg.showFields[k] ? "on" : ""}`}
                onClick={() => setField(k, !cfg.showFields[k])}>
                {FIELD_LABELS[k]}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Filters">
          <Row label="Min altitude" hint="hide ground/taxi">
            <Slider value={cfg.minAltitudeFt} min={0} max={10000} step={100} unit="ft"
              onChange={(v) => set({ minAltitudeFt: v })} />
          </Row>
          <Row label="Max altitude">
            <Slider value={cfg.maxAltitudeFt} min={1000} max={60000} step={1000} unit="ft"
              onChange={(v) => set({ maxAltitudeFt: v })} />
          </Row>
          <Row label="Hide aircraft on ground">
            <Toggle value={cfg.hideOnGround} onChange={(v) => set({ hideOnGround: v })} />
          </Row>
        </Section>

        <Section title="Motion">
          <Row label="Interpolate">
            <Toggle value={cfg.interpolate} onChange={(v) => set({ interpolate: v })} />
          </Row>
          <Row label="Smoothing" hint="0 snap · 1 slow">
            <Slider value={cfg.smoothing} min={0} max={0.9} step={0.02}
              onChange={(v) => set({ smoothing: v })} />
          </Row>
          <Row label="Max extrapolation">
            <Slider value={cfg.maxExtrapolationSec} min={0} max={15} step={1} unit="s"
              onChange={(v) => set({ maxExtrapolationSec: v })} />
          </Row>
          <Row label="Drop after">
            <Slider value={cfg.staleSec} min={5} max={60} step={1} unit="s"
              onChange={(v) => set({ staleSec: v })} />
          </Row>
          <Row label="Max FPS" hint="0 = uncapped">
            <Slider value={cfg.maxFps} min={0} max={120} step={5} unit="fps"
              onChange={(v) => set({ maxFps: v })} />
          </Row>
        </Section>

        <Section title="Overlays">
          <Row label="Range rings">
            <Toggle value={cfg.rangeRings} onChange={(v) => set({ rangeRings: v })} />
          </Row>
          <Row label="Compass">
            <Toggle value={cfg.compass} onChange={(v) => set({ compass: v })} />
          </Row>
          <Row label="Airport runways" hint="SFO geometry; off if you've moved">
            <Toggle value={cfg.showAirport} onChange={(v) => set({ showAirport: v })} />
          </Row>
          <Row label="Highlight emergency">
            <Toggle value={cfg.highlightEmergency} onChange={(v) => set({ highlightEmergency: v })} />
          </Row>
          <Row label="On-screen HUD (display)">
            <Toggle value={cfg.showHud} onChange={(v) => set({ showHud: v })} />
          </Row>
        </Section>

        <Section title="Sky">
          <Row label="Stars">
            <Toggle value={cfg.showStars} onChange={(v) => set({ showStars: v })} />
          </Row>
          {cfg.showStars && (
            <>
              <Row label="Star density" indent={true}>
                <Slider value={cfg.starMagLimit} min={1} max={4} step={0.1}
                  onChange={(v) => set({ starMagLimit: v })} />
              </Row>
              <Row label="Star labels" hint="higher = more names" indent={true}>
                <Slider value={cfg.starLabelMagLimit} min={0} max={3} step={0.1}
                  onChange={(v) => set({ starLabelMagLimit: v })} />
              </Row>
            </>
          )}
          <Row label="Sun">
            <Toggle value={cfg.showSun} onChange={(v) => set({ showSun: v })} />
          </Row>
          <Row label="Moon">
            <Toggle value={cfg.showMoon} onChange={(v) => set({ showMoon: v })} />
          </Row>
          <Row label="Satellites & ISS">
            <Toggle value={cfg.showSatellites} onChange={(v) => set({ showSatellites: v })} />
          </Row>
          {cfg.showSatellites && (
            <Row label="Satellite labels" hint="name every satellite">
              <Toggle value={cfg.satelliteLabels} onChange={(v) => set({ satelliteLabels: v })} />
            </Row>
          )}
          <Row label="Planets" hint="Venus, Jupiter, Mars…">
            <Toggle value={cfg.showPlanets} onChange={(v) => set({ showPlanets: v })} />
          </Row>
          <Row label="Sky time" hint={skyTimeLabel(cfg.skyTimeOffsetMin)}>
            <Slider value={cfg.skyTimeOffsetMin} min={-720} max={720} step={5} unit="m"
              onChange={(v) => set({ skyTimeOffsetMin: v })} />
          </Row>
          <div className="chips">
            <button className={`chip ${cfg.skyTimeOffsetMin === 0 ? "on" : ""}`}
              onClick={() => set({ skyTimeOffsetMin: 0 })}>
              Live
            </button>
            {nextPass && (
              <button className="chip on"
                onClick={() => set({ skyTimeOffsetMin: Math.round((nextPass - Date.now()) / 60000) })}>
                ISS pass in {fmtIn(nextPass - Date.now())} → jump
              </button>
            )}
          </div>
        </Section>

        <Section title="Window to elsewhere">
          <Row label="Destination arcs" hint="great-circle toward dest">
            <Toggle value={cfg.showDestArc} onChange={(v) => set({ showDestArc: v })} />
          </Row>
          <Row label="Local time & distance">
            <Toggle value={cfg.showRouteDetail} onChange={(v) => set({ showRouteDetail: v })} />
          </Row>
        </Section>

        <Section title="Palette">
          <div className="palette">
            <ColorRow label="Background" value={cfg.palette.bg}
              onChange={(v) => set({ palette: { ...cfg.palette, bg: v } })} />
            <ColorRow label="Glyph" value={cfg.palette.glyph}
              onChange={(v) => set({ palette: { ...cfg.palette, glyph: v } })} />
            <ColorRow label="Trail" value={cfg.palette.trail}
              onChange={(v) => set({ palette: { ...cfg.palette, trail: v } })} />
            <ColorRow label="Accent" value={cfg.palette.accent}
              onChange={(v) => set({ palette: { ...cfg.palette, accent: v } })} />
            <ColorRow label="Warn" value={cfg.palette.warn}
              onChange={(v) => set({ palette: { ...cfg.palette, warn: v } })} />
            <ColorRow label="Grid" value={cfg.palette.grid}
              onChange={(v) => set({ palette: { ...cfg.palette, grid: v } })} />
            <ColorRow label="Text" value={cfg.palette.text}
              onChange={(v) => set({ palette: { ...cfg.palette, text: v } })} />
          </div>
        </Section>

        <Section title="System">
          <button className="reset" onClick={() => conn.resetConfig()}>
            Reset all to defaults
          </button>
        </Section>
      </main>
    </div>
  );
}
