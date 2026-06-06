import { useEffect, useRef, useState } from "react";
import { useStream } from "../lib/useStream.js";

interface ApiHealth {
  ok: boolean;
}

interface SetupStatus {
  hasSavedConfig: boolean;
}

interface FlightStats {
  uniqueAircraft: number;
  activeAircraft: number;
}

interface DiagSnapshot {
  // timing
  fetchedAt: number;
  // backend
  backendOnline: boolean;
  wsConnected: boolean;
  // data
  source: string;
  aircraftReceived: number;
  lastApiUpdateMs: number | null;
  lastWsMessageMs: number | null;
  wsReconnects: number;
  // config
  theme: string;
  radiusMiles: number;
  hasSavedConfig: boolean;
  // memory
  aircraftMemorySec: number;
  staleSec: number;
  // browser
  userAgent: string;
}

function elapsed(ms: number | null): string {
  if (ms === null) return "—";
  const s = (Date.now() - ms) / 1000;
  if (s < 2) return `${Math.round(s * 10) / 10}s ago`;
  return `${Math.round(s)}s ago`;
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={`diag-dot ${ok ? "ok" : "bad"}`} />;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="diag-row">
      <td className="diag-label">{label}</td>
      <td className="diag-value">{children}</td>
    </tr>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="diag-section">
      <h2 className="diag-section-title">{title}</h2>
      <table className="diag-table">
        <tbody>{children}</tbody>
      </table>
    </section>
  );
}

export function Diagnostics() {
  const { state, conn } = useStream("control");
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [flightStats, setFlightStats] = useState<FlightStats | null>(null);
  const [lastWsMs, setLastWsMs] = useState<number | null>(null);
  const [wsReconnects, setWsReconnects] = useState(0);
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(0);

  const prevConnected = useRef(false);
  const reconnectCount = useRef(0);

  // Track websocket reconnects.
  useEffect(() => {
    if (!prevConnected.current && state.connected) {
      if (reconnectCount.current > 0) {
        setWsReconnects((n) => n + 1);
      }
      reconnectCount.current++;
    }
    prevConnected.current = state.connected;
  }, [state.connected]);

  // Track last WS message time.
  useEffect(() => {
    if (state.now > 0) {
      setLastWsMs(Date.now());
    }
  }, [state.now, state.aircraft]);

  // Fetch health + setup status on mount.
  useEffect(() => {
    fetch("/api/health")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setHealth(d))
      .catch(() => setHealth(null));

    fetch("/api/setup/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSetupStatus(d))
      .catch(() => setSetupStatus(null));

    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setFlightStats(d))
      .catch(() => setFlightStats(null));
  }, []);

  // Re-render every 2s so elapsed times stay fresh.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const cfg = state.config;

  // Build a snapshot for copying.
  const buildReport = (): DiagSnapshot => ({
    fetchedAt: Date.now(),
    backendOnline: health?.ok ?? false,
    wsConnected: state.connected,
    source: state.status?.source ?? "unknown",
    aircraftReceived: state.aircraft.length,
    lastApiUpdateMs: state.status?.lastOk ?? null,
    lastWsMessageMs: lastWsMs,
    wsReconnects,
    theme: cfg?.theme ?? "—",
    radiusMiles: cfg?.radiusMiles ?? 0,
    hasSavedConfig: setupStatus?.hasSavedConfig ?? false,
    aircraftMemorySec: cfg?.aircraftMemorySec ?? 0,
    staleSec: cfg?.staleSec ?? 0,
    userAgent: navigator.userAgent,
  });

  const copyDiagnostics = async () => {
    const report = buildReport();
    const text = [
      `Skylight Diagnostics — ${new Date(report.fetchedAt).toISOString()}`,
      ``,
      `Backend status:       ${report.backendOnline ? "online" : "offline"}`,
      `Frontend websocket:   ${report.wsConnected ? "connected" : "disconnected"}`,
      `Data source:          ${report.source}`,
      `Aircraft received:    ${report.aircraftReceived}`,
      `Last API update:      ${elapsed(report.lastApiUpdateMs)}`,
      `Last WS message:      ${elapsed(report.lastWsMessageMs)}`,
      `WS reconnects:        ${report.wsReconnects}`,
      ``,
      `Current theme:        ${report.theme}`,
      `Radius:               ${report.radiusMiles}mi`,
      `Has saved config:     ${report.hasSavedConfig}`,
      `Aircraft memory:      ${report.aircraftMemorySec}s`,
      `Stale threshold:      ${report.staleSec}s`,
      ``,
      `Browser:              ${report.userAgent}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: show in a textarea
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const reloadConfig = () => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(() => window.location.reload())
      .catch(() => {});
  };

  const clearTracks = () => {
    // Patch staleSec momentarily to 0 and back to flush the renderer.
    const s = cfg?.staleSec ?? 20;
    conn.patchConfig({ staleSec: 0 });
    setTimeout(() => conn.patchConfig({ staleSec: s }), 500);
  };

  // Used only to silence the tick dep warning — tick is used to keep elapsed times fresh.
  void tick;

  return (
    <div className="diag-root">
      <header className="diag-topbar">
        <div className="diag-brand">
          <StatusDot ok={state.connected} />
          Diagnostics
        </div>
        <a className="diag-back" href="/control">← Control</a>
      </header>

      <main className="diag-main">
        <Section title="Connection">
          <Row label="Backend HTTP">
            <StatusDot ok={health?.ok ?? false} />
            {health?.ok ? "online" : health === null ? "checking…" : "offline"}
          </Row>
          <Row label="WebSocket">
            <StatusDot ok={state.connected} />
            {state.connected ? "connected" : "disconnected"}
          </Row>
          <Row label="WS reconnects">{wsReconnects}</Row>
          <Row label="Last WS message">{elapsed(lastWsMs)}</Row>
          <Row label="Last WS error">{state.error ?? "—"}</Row>
        </Section>

        <Section title="Data">
          <Row label="Data source">{state.status?.source ?? "—"}</Row>
          <Row label="Aircraft received">{state.aircraft.length}</Row>
          <Row label="Unique aircraft today">{flightStats?.uniqueAircraft ?? "—"}</Row>
          <Row label="Active in flight log">{flightStats?.activeAircraft ?? "—"}</Row>
          <Row label="Source status">
            <StatusDot ok={state.status?.ok ?? false} />
            {state.status?.ok ? "ok" : "error"}
            {state.status?.message ? ` · ${state.status.message}` : ""}
          </Row>
          <Row label="Last API update">{elapsed(state.status?.lastOk ?? null)}</Row>
        </Section>

        <Section title="Config">
          <Row label="Has saved config">
            <StatusDot ok={setupStatus?.hasSavedConfig ?? false} />
            {setupStatus === null ? "checking…" : setupStatus.hasSavedConfig ? "yes" : "no — using defaults"}
          </Row>
          <Row label="Theme">{cfg?.theme ?? "—"}</Row>
          <Row label="Radius">{cfg ? `${cfg.radiusMiles}mi` : "—"}</Row>
          <Row label="Location">
            {cfg ? `${cfg.centerLat.toFixed(4)}, ${cfg.centerLon.toFixed(4)}` : "—"}
          </Row>
        </Section>

        <Section title="Anti-flicker memory">
          <Row label="Stale threshold">{cfg ? `${cfg.staleSec}s` : "—"}</Row>
          <Row label="Memory window">{cfg ? `${cfg.aircraftMemorySec}s` : "—"}</Row>
          <Row label="Fade out over">{cfg ? `${cfg.fadeOutSec}s` : "—"}</Row>
          <Row label="Remove after">{cfg ? `${cfg.hideOnlyAfterSec}s` : "—"}</Row>
          <Row label="Show estimated indicator">{cfg ? (cfg.showStaleIndicator ? "yes" : "no") : "—"}</Row>
        </Section>

        <Section title="Browser">
          <Row label="User agent">{navigator.userAgent}</Row>
          <Row label="Screen">{`${window.screen.width}×${window.screen.height}`}</Row>
          <Row label="Window">{`${window.innerWidth}×${window.innerHeight}`}</Row>
          <Row label="DPR">{window.devicePixelRatio}</Row>
        </Section>

        <div className="diag-actions">
          <button className="diag-btn diag-btn-primary" onClick={copyDiagnostics}>
            {copied ? "✓ Copied" : "Copy diagnostics"}
          </button>
          <button className="diag-btn" onClick={reloadConfig}>Reload config</button>
          <button className="diag-btn diag-btn-warn" onClick={clearTracks}>Clear track memory</button>
          <button className="diag-btn diag-btn-warn" onClick={() => conn.resetConfig()}>Reset config</button>
        </div>

        <p className="diag-hint">
          Copy diagnostics to paste into a GitHub issue. Location data is included — remove it if you prefer.
        </p>
      </main>
    </div>
  );
}
