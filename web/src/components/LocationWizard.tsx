import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { LeafletMouseEvent } from "leaflet";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface SetupStatus {
  hasSavedConfig: boolean;
}

const PRESETS = [
  { id: "home", label: "Home", description: "Balanced local view", radiusMiles: 3 },
  { id: "airport", label: "Airport", description: "Wider approach coverage", radiusMiles: 8 },
] as const;

function ClickToSet({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => onPick(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
}

export function LocationWizard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [lat, setLat] = useState(37.6213);
  const [lon, setLon] = useState(-122.379);
  const [radiusMiles, setRadiusMiles] = useState(3);
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([
      fetch("/api/config").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/setup/status").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([cfg, s]) => {
        if (!live) return;
        if (cfg) {
          setLat(Number(cfg.centerLat) || 0);
          setLon(Number(cfg.centerLon) || 0);
          setRadiusMiles(Number(cfg.radiusMiles) || 3);
        }
        if (s) setStatus(s as SetupStatus);
      })
      .catch(() => {
        if (live) setError("Failed to load current settings.");
      });
    return () => {
      live = false;
    };
  }, []);

  const position = useMemo<[number, number]>(() => [lat, lon], [lat, lon]);

  const runSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query.trim())}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("search failed");
      const data = (await res.json()) as GeocodeResult[];
      setResults(data);
      if (data[0]) {
        setLat(Number(data[0].lat));
        setLon(Number(data[0].lon));
      }
    } catch {
      setError("Search failed. Enter coordinates manually.");
    } finally {
      setSearching(false);
    }
  };

  const chooseResult = (r: GeocodeResult) => {
    setLat(Number(r.lat));
    setLon(Number(r.lon));
    setResults([]);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/setup/location", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ centerLat: lat, centerLon: lon, radiusMiles }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Save failed");
      }
      location.assign("/control");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="setup-root">
      <header className="setup-header">
        <h1>Location setup</h1>
        <p>Pick your center point and preferred radius.</p>
      </header>

      <section className="setup-card">
        <form className="setup-search" onSubmit={runSearch}>
          <input
            type="search"
            placeholder="Search city or postcode"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={searching}>
            {searching ? "Searching…" : "Search"}
          </button>
        </form>

        {results.length > 0 && (
          <ul className="search-results">
            {results.map((r) => (
              <li key={`${r.lat}:${r.lon}:${r.display_name}`}>
                <button type="button" onClick={() => chooseResult(r)}>
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="preset-row">
          {PRESETS.map((preset) => (
            <button key={preset.id} type="button" onClick={() => setRadiusMiles(preset.radiusMiles)}>
              {preset.label}
              <span>{preset.description}</span>
            </button>
          ))}
        </div>

        <div className="map-wrap">
          <MapContainer center={position} zoom={10} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Recenter lat={lat} lon={lon} />
            <ClickToSet onPick={(nextLat, nextLon) => {
              setLat(nextLat);
              setLon(nextLon);
            }} />
            <CircleMarker center={position} radius={8} pathOptions={{ color: "#9b7ecf" }} />
          </MapContainer>
        </div>

        <div className="field-grid">
          <label>
            Latitude
            <input
              type="number"
              min={-90}
              max={90}
              step="0.000001"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
            />
          </label>
          <label>
            Longitude
            <input
              type="number"
              min={-180}
              max={180}
              step="0.000001"
              value={lon}
              onChange={(e) => setLon(Number(e.target.value))}
            />
          </label>
          <label>
            Radius (miles)
            <input
              type="range"
              min={1}
              max={25}
              step={0.5}
              value={radiusMiles}
              onChange={(e) => setRadiusMiles(Number(e.target.value))}
            />
            <strong>{radiusMiles.toFixed(1)} mi</strong>
          </label>
        </div>

        {error && <p className="setup-error">{error}</p>}

        <div className="setup-actions">
          <button type="button" className="primary" disabled={saving} onClick={save}>
            {saving ? "Saving…" : "Save and continue"}
          </button>
          {status?.hasSavedConfig && (
            <button type="button" className="secondary" onClick={() => location.assign("/control") }>
              Cancel
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
