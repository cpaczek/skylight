import { useEffect, useRef, useState } from "react";
import type { Config, Theme } from "@shared/index.js";
import type { SkyBody } from "./celestial.js";
import { DEFAULT_CONFIG, formatDistance } from "@shared/index.js";
import { useStream } from "../lib/useStream.js";
import { useAmbientMode, kioskRequested } from "../lib/useAmbientMode.js";
import { Renderer, type Pickable } from "./renderer.js";
import { PlaneCard } from "./PlaneCard.js";
import { SatelliteCard } from "./SatelliteCard.js";

const THEMES: Theme[] = ["ambient", "telemetry", "focus"];
const HIT_RADIUS_PX = 60;
const CURSOR_IDLE_MS = 1500;
const CARD_MARGIN = 16;
const CARD_FALLBACK_W = 220;
const CARD_FALLBACK_H = 140;
const CARD_OFFSET_X = -220;
const CARD_OFFSET_Y = 80;

export function Display() {
  const { state, conn } = useStream("display");
  const ambient = useAmbientMode();
  const isKiosk = kioskRequested();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  // Keep the latest config in a ref so the RAF loop always reads fresh values.
  const configRef = useRef<Config>(state.config ?? DEFAULT_CONFIG);
  configRef.current = state.config ?? DEFAULT_CONFIG;

  // Latest ambient toggle in a ref so the keydown listener stays subscribed once.
  const ambientToggleRef = useRef(ambient.toggle);
  ambientToggleRef.current = ambient.toggle;

  const [selected, setSelected] = useState<Pickable | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [liveSat, setLiveSat] = useState<SkyBody | null>(null);

  // Create renderer once.
  useEffect(() => {
    if (!canvasRef.current) return;
    const r = new Renderer(canvasRef.current, () => configRef.current);
    rendererRef.current = r;
    r.start();
    const onResize = () => r.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      r.stop();
      rendererRef.current = null;
    };
  }, []);

  // Feed snapshots.
  useEffect(() => {
    rendererRef.current?.update(state.aircraft);
  }, [state.now, state.aircraft]);

  // Source health: during an outage the renderer holds planes instead of
  // staling them out. A dropped WebSocket counts as an outage too.
  useEffect(() => {
    rendererRef.current?.setSourceOk(state.connected && (state.status?.ok ?? true));
  }, [state.connected, state.status]);

  useEffect(() => {
    if (!selected) return;
    let raf = 0;
    const tick = () => {
      const p = rendererRef.current?.getScreenPos(selected.id) ?? null;
      const rect = rootRef.current?.getBoundingClientRect();
      const alpha =
        selected.kind === "aircraft" ? rendererRef.current?.getAlpha(selected.id) ?? 0 : 1;

      if (!p || !rect || alpha < 0.05) {
        setSelected(null);
        rendererRef.current?.setSelected(null);
        return;
      }

      const cardW = cardWrapperRef.current?.offsetWidth || CARD_FALLBACK_W;
      const cardH = cardWrapperRef.current?.offsetHeight || CARD_FALLBACK_H;
      const clampedX = Math.min(
        Math.max(p.x + CARD_OFFSET_X, CARD_MARGIN),
        rect.width - cardW - CARD_MARGIN,
      );
      const clampedY = Math.min(
        Math.max(p.y + CARD_OFFSET_Y, CARD_MARGIN),
        rect.height - cardH - CARD_MARGIN,
      );

      if (cardWrapperRef.current) {
        cardWrapperRef.current.style.left = `${clampedX}px`;
        cardWrapperRef.current.style.top = `${clampedY}px`;
        cardWrapperRef.current.style.setProperty("--card-alpha", String(alpha));
      }

      if (lineRef.current) {
        lineRef.current.setAttribute("x1", String(clampedX));
        lineRef.current.setAttribute("y1", String(clampedY));
        lineRef.current.setAttribute("x2", String(p.x));
        lineRef.current.setAttribute("y2", String(p.y));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [selected]);

  // Aircraft data refreshes live automatically via state.aircraft (below);
  // satellite positions/altitude live inside the renderer, so poll them on
  // a slower cadence than the 60fps position-tracking loop — no need to
  // re-render that often for numbers, just for the moving dot/card position.
  useEffect(() => {
    if (!selected || selected.kind !== "satellite") {
      setLiveSat(null);
      return;
    }
    const update = () => {
      const p = rendererRef.current?.getPickable(selected.id);
      setLiveSat((p?.sat as SkyBody | undefined) ?? null);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [selected]);

  const findNearest = (x: number, y: number): Pickable | null => {
    const list = rendererRef.current?.getPickables() ?? [];
    let best: Pickable | null = null;
    let bestD = HIT_RADIUS_PX;
    for (const p of list) {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bestD) {
        best = p;
        bestD = d;
      }
    }
    return best;
  };

  const showCursor = () => {
    setCursorVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setCursorVisible(false), CURSOR_IDLE_MS);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    showCursor();
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
    const hit = findNearest(x, y);
    rendererRef.current?.setHovered(hit?.id ?? null);
  };

  const onClick = (e: React.MouseEvent) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    if ((e.target as HTMLElement).closest(".plane-card")) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = findNearest(x, y);

    if (!hit) {
      setSelected(null);
      rendererRef.current?.setSelected(null);
      return;
    }
    if (selected && selected.id === hit.id) {
      setSelected(null);
      rendererRef.current?.setSelected(null);
      return;
    }
    setSelected(hit);
    rendererRef.current?.setSelected(hit.id);
  };

  // Keyboard calibration (handy when a keyboard is plugged into the Pi).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const c = configRef.current;
      switch (e.key) {
        case "r":
          conn.patchConfig({ rotationDeg: (c.rotationDeg + 5) % 360 });
          break;
        case "R":
          conn.patchConfig({ rotationDeg: (c.rotationDeg - 5 + 360) % 360 });
          break;
        case "m":
          conn.patchConfig({ mirrorX: !c.mirrorX });
          break;
        case "M":
          conn.patchConfig({ mirrorY: !c.mirrorY });
          break;
        case "t": {
          const next = THEMES[(THEMES.indexOf(c.theme) + 1) % THEMES.length];
          conn.patchConfig({ theme: next });
          break;
        }
        case "[":
          conn.patchConfig({ radiusMiles: Math.max(0.5, c.radiusMiles - 0.5) });
          break;
        case "]":
          conn.patchConfig({ radiusMiles: c.radiusMiles + 0.5 });
          break;
        case "h":
          conn.patchConfig({ showHud: !c.showHud });
          break;
        case "f":
          ambientToggleRef.current();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [conn]);

  const cfg = state.config;
  return (
    <div
      ref={rootRef}
      className="display-root"
      style={{
        position: "relative",
        cursor: "none",
        overflow: "hidden",
        width: "100%",
        height: "100vh",
      }}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      <canvas ref={canvasRef} className="display-canvas" />

      {selected && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <line
            ref={lineRef}
            stroke="rgba(232,236,255,0.55)"
            strokeWidth={1.5}
            strokeDasharray="3,4"
          />
        </svg>
      )}

      <div
        ref={cardWrapperRef}
        style={{ position: "absolute", left: -9999, top: -9999, zIndex: 6 }}
      >
        {selected && cfg && selected.kind === "aircraft" && (
          <PlaneCard
            ac={state.aircraft.find((a) => a.hex === selected.id) ?? selected.ac!}
            cfg={cfg}
            onClose={() => {
              setSelected(null);
              rendererRef.current?.setSelected(null);
            }}
          />
        )}
        {selected && selected.kind === "satellite" && (liveSat ?? selected.sat) && (
          <SatelliteCard
            sat={(liveSat ?? selected.sat) as SkyBody}
            onClose={() => {
              setSelected(null);
              rendererRef.current?.setSelected(null);
            }}
          />
        )}
      </div>

      {cursorVisible && (
        <div
          style={{
            position: "absolute",
            left: cursorPos.x - 3,
            top: cursorPos.y - 3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}

      {cfg?.showHud && (
        <div className="hud">
          <div className={`hud-dot ${state.connected ? "ok" : "bad"}`} />
          <span>
            {state.status?.source ?? "—"} · {state.aircraft.length} ac ·{" "}
            rot {cfg.rotationDeg}° · mirror {cfg.mirrorX ? "X" : "–"}
            {cfg.mirrorY ? "Y" : ""} · r {formatDistance(cfg.radiusMiles, cfg.distanceUnit)} · {cfg.projectionMode} · {cfg.theme}
          </span>
        </div>
      )}
      {!state.connected && <div className="reconnect">connecting…</div>}
      {!isKiosk && (
        <button
          type="button"
          className={`ambient-toggle ${ambient.active ? "on" : ""}`}
          onClick={() => ambient.toggle()}
          title={
            ambient.active
              ? "Exit ambient mode (fullscreen + keep awake) — press f"
              : "Ambient mode: fullscreen + keep screen awake — press f"
          }
          aria-label="Toggle ambient fullscreen mode"
        >
          {ambient.active ? "◱ exit ambient" : "◳ ambient"}
          {ambient.active && !ambient.wakeLocked && <span className="ambient-warn"> · no wake-lock</span>}
        </button>
      )}
    </div>
  );
}
