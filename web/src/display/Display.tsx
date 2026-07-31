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
// Mouse must move this far from mousedown before a press becomes a drag,
// so a plain click (e.g. on the ✕ button) never gets eaten as a no-op drag.
const DRAG_THRESHOLD_PX = 4;

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

  // Per-selection card drag state, kept in a ref so 60fps drag updates don't
  // trigger re-renders — the tick() RAF loop below reads it directly, same
  // pattern as the object position-tracking it already does.
  const dragRef = useRef<{
    dragging: boolean;
    startClientX: number;
    startClientY: number;
    cardStartX: number;
    cardStartY: number;
    dragX: number;
    dragY: number;
    /** Offset chosen by the last drag on the CURRENT selection; null = use the default offset. */
    dropOffset: { x: number; y: number } | null;
    /** One-shot: swallow the synthetic click that follows a drag's mouseup. */
    justDragged: boolean;
  }>({
    dragging: false,
    startClientX: 0,
    startClientY: 0,
    cardStartX: 0,
    cardStartY: 0,
    dragX: 0,
    dragY: 0,
    dropOffset: null,
    justDragged: false,
  });
  // Only for the custom cursor dot's styling while dragging — everything
  // else about drag state lives in dragRef to avoid extra re-renders.
  const [cardDragging, setCardDragging] = useState(false);

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
    // New selection: any custom drag offset belonged to the previous object.
    dragRef.current.dropOffset = null;
    dragRef.current.dragging = false;
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

      const drag = dragRef.current;
      // While dragging, follow the cursor directly; otherwise follow the
      // object at the default offset, or the offset chosen by the last drag.
      const rawX = drag.dragging ? drag.dragX : p.x + (drag.dropOffset?.x ?? CARD_OFFSET_X);
      const rawY = drag.dragging ? drag.dragY : p.y + (drag.dropOffset?.y ?? CARD_OFFSET_Y);
      // Same clamp in both cases: keeps the card fully on-screen and means
      // there's no snap when a drag ends (the dropped position was already
      // the clamped position).
      const clampedX = Math.min(Math.max(rawX, CARD_MARGIN), rect.width - cardW - CARD_MARGIN);
      const clampedY = Math.min(Math.max(rawY, CARD_MARGIN), rect.height - cardH - CARD_MARGIN);

      if (cardWrapperRef.current) {
        cardWrapperRef.current.style.left = `${clampedX}px`;
        cardWrapperRef.current.style.top = `${clampedY}px`;
        cardWrapperRef.current.style.setProperty("--card-alpha", String(alpha));
      }

      if (lineRef.current) {
        // Attach to whichever point on the card's box is closest to the
        // object, so the line never crosses over or hangs under the card.
        const attachX = Math.min(Math.max(p.x, clampedX), clampedX + cardW);
        const attachY = Math.min(Math.max(p.y, clampedY), clampedY + cardH);
        lineRef.current.setAttribute("x1", String(attachX));
        lineRef.current.setAttribute("y1", String(attachY));
        lineRef.current.setAttribute("x2", String(p.x));
        lineRef.current.setAttribute("y2", String(p.y));
        // Fade the connector in step with the card's own alpha.
        lineRef.current.setAttribute("stroke-opacity", String(alpha * 0.55));
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
    // Dragging the card: don't hit-test the canvas underneath the cursor.
    if (dragRef.current.dragging) return;
    const hit = findNearest(x, y);
    rendererRef.current?.setHovered(hit?.id ?? null);
  };

  const onClick = (e: React.MouseEvent) => {
    // Swallow the synthetic click that follows a drag's mouseup — a drag is
    // not a click-elsewhere-closes-the-card or click-to-select gesture.
    if (dragRef.current.justDragged) {
      dragRef.current.justDragged = false;
      return;
    }
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

  // Press-and-drag the info card to reposition it. Shared by PlaneCard and
  // SatelliteCard since both render through cardWrapperRef — no per-card
  // drag logic needed. A plain click (no movement past the threshold) falls
  // through untouched, so the card's own onClick/close button still work.
  const onCardMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !selected) return;
    const wrapper = cardWrapperRef.current;
    if (!wrapper) return;
    // Native text-selection/drag-ghost would otherwise kick in as the
    // cursor moves across the card's text while dragging.
    e.preventDefault();

    const drag = dragRef.current;
    drag.startClientX = e.clientX;
    drag.startClientY = e.clientY;
    drag.cardStartX = wrapper.offsetLeft;
    drag.cardStartY = wrapper.offsetTop;
    drag.dragX = drag.cardStartX;
    drag.dragY = drag.cardStartY;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - drag.startClientX;
      const dy = ev.clientY - drag.startClientY;
      if (!drag.dragging && Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
        drag.dragging = true;
        setCardDragging(true);
        rendererRef.current?.setHovered(null);
      }
      if (drag.dragging) {
        drag.dragX = drag.cardStartX + dx;
        drag.dragY = drag.cardStartY + dy;
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (drag.dragging) {
        // Anchor future frames at the offset between the object and where
        // the card was actually dropped, not the default offset.
        const p = rendererRef.current?.getScreenPos(selected.id);
        const wrapperNow = cardWrapperRef.current;
        if (p && wrapperNow) {
          drag.dropOffset = { x: wrapperNow.offsetLeft - p.x, y: wrapperNow.offsetTop - p.y };
        }
        // Consumed by the very next click (the synthetic one this mouseup
        // is about to generate) — self-expires so it can never swallow an
        // unrelated later click.
        drag.justDragged = true;
        setTimeout(() => {
          drag.justDragged = false;
        }, 0);
      }
      drag.dragging = false;
      setCardDragging(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
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
            stroke="rgb(232,236,255)"
            strokeWidth={1.5}
            strokeDasharray="3,4"
          />
        </svg>
      )}

      <div
        ref={cardWrapperRef}
        onMouseDown={onCardMouseDown}
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
            left: cursorPos.x - (cardDragging ? 5 : 3),
            top: cursorPos.y - (cardDragging ? 5 : 3),
            width: cardDragging ? 10 : 6,
            height: cardDragging ? 10 : 6,
            borderRadius: "50%",
            background: cardDragging ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)",
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
