import { useEffect, useRef, useState } from "react";
import type { Aircraft, Config, Theme } from "@shared/index.js";
import { DEFAULT_CONFIG } from "@shared/index.js";
import { useStream } from "../lib/useStream.js";
import { loadRuntimeAirports } from "./airports.js";
import { Renderer, type AircraftHit } from "./renderer.js";

const THEMES: Theme[] = ["ambient", "telemetry", "focus"];

// How many pixels the pointer must move before we treat it as a drag rather
// than a click for aircraft selection.
const DRAG_THRESHOLD_PX = 6;

// Inertia friction: velocity multiplied by this each frame (0.88 = ~88% kept).
// Higher = longer glide. Lower = snappier stop.
const FRICTION = 0.88;

// Minimum speed (px/frame) below which inertia stops.
const MIN_SPEED = 0.4;

// Wheel zoom: each notch changes radius by this factor.
const WHEEL_ZOOM_FACTOR = 0.92;

// Debounce for committing radius after scroll ends (ms).
const WHEEL_COMMIT_DELAY = 220;

export function Display() {
  const { state, conn } = useStream("display");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const configRef = useRef<Config>(state.config ?? DEFAULT_CONFIG);
  configRef.current = state.config ?? DEFAULT_CONFIG;

  const [rendererStats, setRendererStats] = useState({ total: 0, estimated: 0, stale: 0 });
  const [rendererError, setRendererError] = useState<string | null>(null);
  const [selectedHit, setSelectedHit] = useState<AircraftHit | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // connRef lets closures in the renderer useEffect (empty deps) always reach
  // the latest conn without going stale.
  const connRef = useRef(conn);
  connRef.current = conn;

  // ── Drag / inertia state (all in refs — no re-renders needed) ───────────────
  const drag = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    movedPx: number;       // total pixels moved since mousedown (for click guard)
    velX: number;          // px/frame velocity at moment of release
    velY: number;
    lastTime: number;
  }>({
    active: false, startX: 0, startY: 0, lastX: 0, lastY: 0,
    movedPx: 0, velX: 0, velY: 0, lastTime: 0,
  });

  // Inertia rAF handle.
  const inertiaRaf = useRef(0);

  // ── Wheel / zoom state ──────────────────────────────────────────────────────
  // We accumulate radius changes locally and commit after scrolling stops.
  const wheelRadius = useRef<number | null>(null);   // null = use config value
  const wheelTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Renderer setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    void loadRuntimeAirports();
    let r: Renderer;
    try {
      r = new Renderer(canvasRef.current, () => {
        // While zooming via wheel, override radiusMiles with the local value
        // so the renderer reflects changes before the debounce commits them.
        if (wheelRadius.current !== null) {
          return { ...configRef.current, radiusMiles: wheelRadius.current };
        }
        return configRef.current;
      });
    } catch (err) {
      setRendererError(err instanceof Error ? err.message : "Renderer failed to start");
      return;
    }
    rendererRef.current = r;
    r.start();

    const onResize = () => r.resize();
    window.addEventListener("resize", onResize);

    // ── Mouse wheel zoom — attached here where canvas is guaranteed valid ──
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Current radius: use local accumulator if already mid-scroll, else config.
      const base = wheelRadius.current ?? configRef.current.radiusMiles;

      // Normalise delta across deltaMode values.
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 18;   // line mode  → pixel approx
      if (e.deltaMode === 2) delta *= 300;  // page mode  → pixel approx

      // Each 100 px of scroll = one zoom step.
      const steps  = delta / 100;
      const factor = Math.pow(WHEEL_ZOOM_FACTOR, steps);
      const next   = Math.max(0.5, Math.min(250, base * factor));

      wheelRadius.current = next;

      // Debounce the config commit so we don't flood the server mid-scroll.
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        if (wheelRadius.current !== null) {
          const rounded = Math.round(wheelRadius.current * 10) / 10;
          connRef.current?.patchConfig({ radiusMiles: rounded });
          wheelRadius.current = null;
        }
        wheelTimer.current = null;
      }, WHEEL_COMMIT_DELAY);
    };

    // Use window so the event fires even if the canvas doesn't have focus,
    // and add { passive: false } so we can call preventDefault().
    window.addEventListener("wheel", onWheel, { passive: false });

    const statsInterval = setInterval(() => {
      if (configRef.current.showHud) setRendererStats(r.getStats());
    }, 2000);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      clearInterval(statsInterval);
      r.stop();
      rendererRef.current = null;
    };
  }, []);

  // Feed aircraft snapshots.
  useEffect(() => {
    rendererRef.current?.update(state.aircraft);
  }, [state.now, state.aircraft]);

  // Keep popover anchor live while aircraft is selected.
  useEffect(() => {
    if (!selectedHit) return;
    let raf = 0;
    const tick = () => {
      const hit = rendererRef.current?.getAircraftHit(selectedHit.aircraft.hex) ?? null;
      setSelectedHit((cur) => {
        if (!cur || !hit) return cur;
        if (Math.abs(cur.x - hit.x) < 0.5 && Math.abs(cur.y - hit.y) < 0.5) return cur;
        return hit;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [selectedHit?.aircraft.hex]);

  // ── Inertia loop ────────────────────────────────────────────────────────────
  const stopInertia = () => {
    cancelAnimationFrame(inertiaRaf.current);
    inertiaRaf.current = 0;
  };

  const startInertia = () => {
    stopInertia();
    const r = rendererRef.current;
    if (!r) return;

    const tick = () => {
      const d = drag.current;
      const speed = Math.hypot(d.velX, d.velY);
      if (speed < MIN_SPEED) {
        // Commit the final position.
        const { centerLat, centerLon } = r.getPannedCenter();
        connRef.current.patchConfig({ centerLat, centerLon });
        r.resetPan();
        setIsDragging(false);
        return;
      }
      r.applyPanDelta(d.velX, d.velY);
      d.velX *= FRICTION;
      d.velY *= FRICTION;
      inertiaRaf.current = requestAnimationFrame(tick);
    };

    inertiaRaf.current = requestAnimationFrame(tick);
  };

  // ── Mouse handlers (attached to window to capture outside-canvas releases) ──
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;  // left button only
      stopInertia();
      rendererRef.current?.resetPan();
      const d = drag.current;
      d.active   = true;
      d.startX   = e.clientX;
      d.startY   = e.clientY;
      d.lastX    = e.clientX;
      d.lastY    = e.clientY;
      d.movedPx  = 0;
      d.velX     = 0;
      d.velY     = 0;
      d.lastTime = performance.now();
    };

    const onMouseMove = (e: MouseEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.movedPx += Math.hypot(dx, dy);

      const now = performance.now();
      const dt  = Math.max(1, now - d.lastTime);
      // Exponential smoothing on velocity (stable even when dt varies).
      const alpha = Math.min(1, dt / 16);
      d.velX = d.velX * (1 - alpha) + (dx / dt * 16) * alpha;
      d.velY = d.velY * (1 - alpha) + (dy / dt * 16) * alpha;
      d.lastTime = now;

      rendererRef.current?.applyPanDelta(dx, dy);

      if (d.movedPx > DRAG_THRESHOLD_PX) setIsDragging(true);
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const d = drag.current;
      if (!d.active) return;
      d.active = false;

      if (d.movedPx <= DRAG_THRESHOLD_PX) {
        // It was a click — do aircraft hit test.
        rendererRef.current?.resetPan();
        setIsDragging(false);
        setSelectedHit(
          rendererRef.current?.hitTest(e.clientX, e.clientY) ?? null,
        );
        return;
      }

      // It was a real drag — launch inertia.
      startInertia();
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, []);

  // ── Touch handlers ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      stopInertia();
      rendererRef.current?.resetPan();
      const t = e.touches[0];
      const d = drag.current;
      d.active   = true;
      d.startX   = t.clientX;
      d.startY   = t.clientY;
      d.lastX    = t.clientX;
      d.lastY    = t.clientY;
      d.movedPx  = 0;
      d.velX     = 0;
      d.velY     = 0;
      d.lastTime = performance.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const d = drag.current;
      if (!d.active) return;
      e.preventDefault();
      const t  = e.touches[0];
      const dx = t.clientX - d.lastX;
      const dy = t.clientY - d.lastY;
      d.lastX = t.clientX;
      d.lastY = t.clientY;
      d.movedPx += Math.hypot(dx, dy);

      const now  = performance.now();
      const dt   = Math.max(1, now - d.lastTime);
      const alpha = Math.min(1, dt / 16);
      d.velX = d.velX * (1 - alpha) + (dx / dt * 16) * alpha;
      d.velY = d.velY * (1 - alpha) + (dy / dt * 16) * alpha;
      d.lastTime = now;

      rendererRef.current?.applyPanDelta(dx, dy);
      if (d.movedPx > DRAG_THRESHOLD_PX) setIsDragging(true);
    };

    const onTouchEnd = (e: TouchEvent) => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;

      if (d.movedPx <= DRAG_THRESHOLD_PX) {
        rendererRef.current?.resetPan();
        setIsDragging(false);
        if (e.changedTouches.length) {
          const t = e.changedTouches[0];
          setSelectedHit(
            rendererRef.current?.hitTest(t.clientX, t.clientY) ?? null,
          );
        }
        return;
      }

      startInertia();
    };

    el.addEventListener("touchstart",  onTouchStart, { passive: true });
    el.addEventListener("touchmove",   onTouchMove,  { passive: false });
    el.addEventListener("touchend",    onTouchEnd,   { passive: true });
    el.addEventListener("touchcancel", onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart",  onTouchStart);
      el.removeEventListener("touchmove",   onTouchMove);
      el.removeEventListener("touchend",    onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const c = configRef.current;
      switch (e.key) {
        case "Escape":
          stopInertia();
          rendererRef.current?.resetPan();
          setIsDragging(false);
          setSelectedHit(null);
          break;
        case "r":
          connRef.current.patchConfig({ rotationDeg: (c.rotationDeg + 5) % 360 });
          break;
        case "R":
          connRef.current.patchConfig({ rotationDeg: (c.rotationDeg - 5 + 360) % 360 });
          break;
        case "m":
          connRef.current.patchConfig({ mirrorX: !c.mirrorX });
          break;
        case "M":
          connRef.current.patchConfig({ mirrorY: !c.mirrorY });
          break;
        case "t": {
          const next = THEMES[(THEMES.indexOf(c.theme) + 1) % THEMES.length];
          connRef.current.patchConfig({ theme: next });
          break;
        }
        case "[":
          connRef.current.patchConfig({ radiusMiles: Math.max(0.5, c.radiusMiles - 0.5) });
          break;
        case "]":
          connRef.current.patchConfig({ radiusMiles: c.radiusMiles + 0.5 });
          break;
        case "h":
          connRef.current.patchConfig({ showHud: !c.showHud });
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  const cfg = state.config;

  const selectedAircraft: Aircraft | null = selectedHit
    ? state.aircraft.find(
        (ac) => ac.hex.toLowerCase() === selectedHit.aircraft.hex.toLowerCase(),
      ) ?? selectedHit.aircraft
    : null;

  const following =
    !!selectedAircraft &&
    cfg?.followFlightHex.toLowerCase() === selectedAircraft.hex.toLowerCase();

  const actions =
    selectedAircraft && cfg
      ? [
          {
            id: "follow",
            label: following ? "Stop following" : "Follow this flight",
            primary: true,
            run: () =>
              conn.patchConfig({
                followFlightHex: following ? "" : selectedAircraft.hex.toLowerCase(),
              }),
          },
          {
            id: "close",
            label: "Close",
            primary: false,
            run: () => setSelectedHit(null),
          },
        ]
      : [];

  return (
    <div className="display-root">
      <canvas
        ref={canvasRef}
        className={`display-canvas${isDragging ? " dragging" : ""}`}
      />

      {cfg?.followFlightHex && (
        <>
          <div className="follow-reticle" aria-hidden="true" />
          <div className="follow-status">
            <span>TRACKING</span>
            {state.aircraft.find(
              (ac) => ac.hex.toLowerCase() === cfg.followFlightHex.toLowerCase(),
            )?.flight ?? cfg.followFlightHex.toUpperCase()}
          </div>
        </>
      )}

      {selectedHit && selectedAircraft && (
        <div
          className="aircraft-action-popover"
          style={{
            left: Math.max(12, Math.min(selectedHit.x, window.innerWidth - 232)),
            top:  Math.max(12, Math.min(selectedHit.y + 28, window.innerHeight - 210)),
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="aircraft-action-kicker">Selected aircraft</div>
          <div className="aircraft-action-flight">
            {selectedAircraft.flight ?? selectedAircraft.hex.toUpperCase()}
          </div>
          <div className="aircraft-action-meta">
            {[
              selectedAircraft.typeName ?? selectedAircraft.typeCode,
              selectedAircraft.altBaro != null
                ? `${selectedAircraft.altBaro.toLocaleString("en-US")} ft`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
          <div className="aircraft-action-buttons">
            {actions.map((action) => (
              <button
                key={action.id}
                className={action.primary ? "primary" : ""}
                onClick={action.run}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {rendererError && (
        <div className="reconnect">display error: {rendererError}</div>
      )}

      {cfg?.showHud && (
        <div className="hud">
          <div className={`hud-dot ${state.connected ? "ok" : "bad"}`} />
          <span>
            {state.status?.source ?? "—"} · {state.aircraft.length} ac ·{" "}
            rot {cfg.rotationDeg}° · mirror {cfg.mirrorX ? "X" : "–"}
            {cfg.mirrorY ? "Y" : ""} · r {cfg.radiusMiles}mi · {cfg.theme}
            {rendererStats.estimated > 0 && ` · ${rendererStats.estimated} est`}
            {rendererStats.stale > 0 && ` · ${rendererStats.stale} stale`}
            {cfg.followFlightHex &&
              ` · following ${cfg.followFlightHex.toUpperCase()}`}
          </span>
        </div>
      )}

      {!state.connected && (
        <div className="reconnect">connecting…</div>
      )}
    </div>
  );
}
