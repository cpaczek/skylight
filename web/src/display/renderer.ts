// Canvas renderer — the art piece.
//
// Motion model: every fix is stamped with its local arrival time and pushed to a
// per-aircraft history. We render the world RENDER_DELAY_MS in the past and
// *interpolate* between the two surrounding real fixes (rather than extrapolating
// into the future). Interpolating between known points is buttery smooth and
// removes the once-per-second "snap" you get from naive dead-reckoning. The small
// added latency is irrelevant for an ambient ceiling piece.
//
// Sky projection (projectionMode = "sky"): each fix is converted from ground
// position + altitude to azimuth/elevation on a look-up hemisphere (zenith =
// center, horizon = edge). Interpolation happens in ground space, then the
// trig mapping runs every frame so apparent angular speed matches lying outside
// and watching the real sky — fast overhead, slow at the horizon.
//
// Visual language: pure black, luminous altitude-graded glyphs, comet trails that
// taper and fade, and restrained typography that fades in only for the nearest few.

import {
  llToMeters,
  project,
  pxPerMeter,
  deadReckon,
  rangeMeters,
  metersToMiles,
  formatSpeed,
  horizonRadiusM,
  groundToSkyAngles,
  projectAircraft,
  projectSkyPoint,
  skyGlyphScale,
  lerpAzimuth,
  EMERGENCY_SQUAWKS,
  type Aircraft,
  type Config,
  type GroundSample,
  type Meters,
  type Point,
  type SkyAngles,
} from "@shared/index.js";
import { classifyGlyph, drawAircraftGlyph, GLYPH_SCALE } from "./aircraftGlyph.js";
import { computeSky, type Sky, type Tle } from "./celestial.js";
import { ASTERISMS } from "./stars.js";
import tzLookup from "tz-lookup";

/** How far in the past we render, ms. Just over the ~1 Hz fix interval. */
const RENDER_DELAY_MS = 1150;

/** Characteristic tints for the naked-eye planets, as "r,g,b". */
const PLANET_COLORS: Record<string, string> = {
  Venus: "255,244,214",
  Jupiter: "245,226,184",
  Mars: "232,131,90",
  Saturn: "232,217,160",
  Mercury: "200,192,176",
};

interface Sample {
  t: number; // performance.now() at arrival
  m: Meters;
  altFt: number;
  track?: number;
  gs?: number;
}

interface Track {
  ac: Aircraft;
  history: Sample[];
  firstSeen: number;
  lastSeen: number;
  hasPos: boolean;
  /** Smoothed appearance alpha (fade in on spawn, out when stale). */
  life: number;
}

type ProjOpts = Parameters<typeof project>[1];

// Altitude colour ramp — warm low, cool high. Tuned to glow on black.
const ALT_STOPS: [number, [number, number, number]][] = [
  [0, [255, 138, 61]], // amber (ground / pattern)
  [4000, [255, 198, 92]], // gold
  [10000, [120, 224, 196]], // teal
  [20000, [110, 178, 255]], // sky blue
  [30000, [150, 150, 255]], // periwinkle
  [40000, [232, 236, 255]], // near-white
];

function altRamp(alt: number): [number, number, number] {
  if (alt <= ALT_STOPS[0][0]) return ALT_STOPS[0][1];
  for (let i = 1; i < ALT_STOPS.length; i++) {
    if (alt <= ALT_STOPS[i][0]) {
      const [a0, c0] = ALT_STOPS[i - 1];
      const [a1, c1] = ALT_STOPS[i];
      const f = (alt - a0) / (a1 - a0);
      return [
        c0[0] + (c1[0] - c0[0]) * f,
        c0[1] + (c1[1] - c0[1]) * f,
        c0[2] + (c1[2] - c0[2]) * f,
      ];
    }
  }
  return ALT_STOPS[ALT_STOPS.length - 1][1];
}

export function labelLines(cfg: Config, ac: Aircraft): { text: string; kind: "title" | "sub" }[] {
  const f = cfg.showFields;
  const out: { text: string; kind: "title" | "sub" }[] = [];
  const title = f.flight ? ac.flight ?? ac.hex.toUpperCase() : ac.airline;
  if (title) out.push({ text: title, kind: "title" });

  const sub: string[] = [];
  if (f.type && (ac.typeName || ac.typeCode)) sub.push(ac.typeName ?? ac.typeCode!);
  const alt = ac.altBaro ?? ac.altGeom;
  if (f.altitude) {
    if (ac.onGround) sub.push("GND");
    else if (alt != null) sub.push(`${alt.toLocaleString("en-US")} ft`);
  }
  if (f.speed && ac.gs != null) sub.push(formatSpeed(ac.gs, cfg.speedUnit));
  if (sub.length) out.push({ text: sub.join("   "), kind: "sub" });

  if (f.destination && ac.destination && routePlausible(ac, cfg)) {
    const head = ac.origin ? `${ac.origin} → ${ac.destination}` : `→ ${ac.destination}`;
    out.push({ text: ac.destName ? `${head}   ${ac.destName}` : head, kind: "sub" });
    if (cfg.showRouteDetail && ac.destLat != null && ac.destLon != null) {
      const bits: string[] = [`${localTimeAt(ac.destLat, ac.destLon)} local`];
      if (ac.lat != null && ac.lon != null) {
        const mi = Math.round(greatCircleMiles(ac.lat, ac.lon, ac.destLat, ac.destLon));
        if (mi > 1) bits.push(`${mi.toLocaleString("en-US")} mi to go`);
      }
      out.push({ text: bits.join("   ·   "), kind: "sub" });
    }
  }
  if (f.registration && ac.registration) out.push({ text: ac.registration, kind: "sub" });
  return out;
}

const rgba = (c: [number, number, number], a: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

interface Visible {
  tr: Track;
  sample: GroundSample;
  sky: SkyAngles | null;
  p: Point;
  heading: number;
  rangeMi: number;
  alpha: number;
  color: [number, number, number];
  emergency: boolean;
  sizeScale: number;
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private tracks = new Map<string, Track>();
  private raf = 0;
  private dpr = 1;
  private w = 0;
  private h = 0;
  private prevFrame = 0;
  /** When the next frame is due (ms, rAF clock), for the maxFps cap.
   *  0 = uninitialized; set on the first capped frame. */
  private nextFrameDue = 0;
  /** Current frame time in seconds, for animating props/rotors. */
  private frameT = 0;

  // Sky layer state.
  private tles: Tle[] = [];
  private sky: Sky = { stars: [], sats: [], planets: [] };
  private skyComputedAt = 0;
  private skyOffsetUsed = NaN;

  /** When the source went down (rAF clock), null while healthy. While down,
   *  the staleness clock pauses so a transient fetch failure doesn't wipe the
   *  sky and re-spawn everything seconds later (#24). */
  private sourceDownAt: number | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private getConfig: () => Config,
  ) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2D canvas context unavailable");
    this.ctx = ctx;
    this.resize();
  }

  start(): void {
    void this.fetchTles();
    setInterval(() => void this.fetchTles(), 3600_000);
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      // Cap to maxFps via an accumulator: advance a running "due" time by whole
      // frame intervals so the cadence stays anchored to a schedule (even
      // pacing, no drift) rather than to actual draw timestamps. fps <= 0 means
      // uncapped — draw on every rAF tick.
      const fps = this.getConfig().maxFps;
      if (fps > 0) {
        const interval = 1000 / fps;
        if (this.nextFrameDue === 0) this.nextFrameDue = now;
        if (now < this.nextFrameDue) return; // not due yet — skip this tick
        this.nextFrameDue += interval;
        // If we've fallen more than a frame behind (e.g. tab was backgrounded
        // or a draw stalled), resync to avoid a burst of catch-up frames.
        if (now - this.nextFrameDue > interval) this.nextFrameDue = now + interval;
      } else {
        this.nextFrameDue = 0; // reset so re-enabling the cap starts clean
      }
      this.draw();
    };
    this.raf = requestAnimationFrame(loop);
  }

  private async fetchTles(): Promise<void> {
    try {
      const res = await fetch("/api/tle");
      if (res.ok) this.tles = (await res.json()) as Tle[];
    } catch {
      /* keep whatever we had */
    }
  }
  stop(): void {
    cancelAnimationFrame(this.raf);
  }

  resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** Source health from server status messages. */
  setSourceOk(ok: boolean): void {
    if (ok) this.sourceDownAt = null;
    else this.sourceDownAt ??= performance.now();
  }

  /** Feed a fresh snapshot. Stamps each fix with local arrival time. */
  update(aircraft: Aircraft[]): void {
    const cfg = this.getConfig();
    const now = performance.now();
    for (const ac of aircraft) {
      if (!this.passesFilter(ac, cfg)) continue;
      const hasPos = ac.lat != null && ac.lon != null;
      const m = hasPos
        ? llToMeters(ac.lat!, ac.lon!, cfg.centerLat, cfg.centerLon)
        : { east: 0, north: 0 };
      const altFt = ac.altBaro ?? ac.altGeom ?? 0;
      let tr = this.tracks.get(ac.hex);
      if (!tr) {
        tr = { ac, history: [], firstSeen: now, lastSeen: now, hasPos, life: 0 };
        this.tracks.set(ac.hex, tr);
      }
      tr.ac = ac;
      tr.lastSeen = now;
      tr.hasPos = hasPos;
      if (hasPos) {
        const last = tr.history[tr.history.length - 1];
        // Dedup identical fixes (source sometimes repeats a position).
        if (
          !last ||
          last.m.east !== m.east ||
          last.m.north !== m.north ||
          last.altFt !== altFt
        ) {
          tr.history.push({ t: now, m, altFt, track: ac.track, gs: ac.gs });
        }
      }
    }
  }

  private passesFilter(ac: Aircraft, cfg: Config): boolean {
    if (cfg.hideOnGround && ac.onGround) return false;
    const alt = ac.altBaro ?? ac.altGeom;
    if (alt != null) {
      if (alt < cfg.minAltitudeFt) return false;
      if (alt > cfg.maxAltitudeFt) return false;
    }
    return true;
  }

  /** Interpolate a track's ground fix (+ altitude) at render time `tt`. */
  private sampleAt(tr: Track, tt: number, cfg: Config): GroundSample | null {
    const h = tr.history;
    if (h.length === 0) return null;
    if (tt <= h[0].t) return { m: h[0].m, altFt: h[0].altFt };
    const lastS = h[h.length - 1];
    if (tt >= lastS.t) {
      const dt = Math.min((tt - lastS.t) / 1000, cfg.maxExtrapolationSec);
      const m = cfg.interpolate
        ? deadReckon(lastS.m, lastS.track, lastS.gs, dt)
        : lastS.m;
      const vr = tr.ac.baroRate ?? 0;
      const altFt = lastS.altFt + (vr / 60) * dt;
      return { m, altFt };
    }
    for (let i = h.length - 1; i > 0; i--) {
      if (h[i - 1].t <= tt && tt <= h[i].t) {
        const a = h[i - 1];
        const b = h[i];
        const f = (tt - a.t) / Math.max(1, b.t - a.t);
        return {
          m: {
            east: a.m.east + (b.m.east - a.m.east) * f,
            north: a.m.north + (b.m.north - a.m.north) * f,
          },
          altFt: a.altFt + (b.altFt - a.altFt) * f,
        };
      }
    }
    return { m: lastS.m, altFt: lastS.altFt };
  }

  private horizonM(cfg: Config): number {
    return horizonRadiusM(cfg.radiusMiles);
  }

  /** Azimuth fallback when an aircraft is directly overhead (zenith singularity). */
  private fallbackAz(tr: Track): number | undefined {
    return tr.ac.track ?? tr.history[tr.history.length - 1]?.track;
  }

  private toPoint(
    sample: GroundSample,
    cfg: Config,
    proj: ProjOpts,
    tr?: Track,
  ): Point {
    return projectAircraft(
      sample,
      cfg.projectionMode,
      proj,
      this.horizonM(cfg),
      tr ? this.fallbackAz(tr) : undefined,
    );
  }

  private draw(): void {
    const cfg = this.getConfig();
    const ctx = this.ctx;
    const now = performance.now();
    const frameDt = this.prevFrame ? (now - this.prevFrame) / 1000 : 0.016;
    this.prevFrame = now;
    this.frameT = now / 1000;

    if (this.canvas.clientWidth !== this.w || this.canvas.clientHeight !== this.h) {
      this.resize();
    }

    ctx.fillStyle = cfg.palette.bg;
    ctx.fillRect(0, 0, this.w, this.h);

    const pxPerM = pxPerMeter(this.w, this.h, cfg.radiusMiles);
    const proj: ProjOpts = {
      rotationDeg: cfg.rotationDeg,
      mirrorX: cfg.mirrorX,
      mirrorY: cfg.mirrorY,
      pxPerM,
      screenW: this.w,
      screenH: this.h,
    };

    this.updateSky(cfg, now);
    this.drawSky(cfg, proj);
    this.drawOverlays(cfg, proj);
    if (cfg.showAirport) this.drawAirport(cfg, proj);

    const tt = now - RENDER_DELAY_MS;
    const visible: Visible[] = [];

    for (const [hex, tr] of this.tracks) {
      let stale = (now - tr.lastSeen) / 1000;
      if (this.sourceDownAt !== null) {
        // Outage: hold staleness at its value when the source went down, so
        // planes dim in place instead of vanishing. A hard cap still clears
        // the sky if the source stays dead — frozen planes stop being true.
        const downFor = (now - this.sourceDownAt) / 1000;
        stale = Math.max(0, stale - downFor);
        if ((now - tr.lastSeen) / 1000 > Math.max(cfg.staleSec, 90)) {
          this.tracks.delete(hex);
          continue;
        }
      }
      if (stale > cfg.staleSec) {
        this.tracks.delete(hex);
        continue;
      }
      // Trim history to the trail window (+ a little headroom for interp).
      const keep = Math.max(cfg.trailSeconds, 6) * 1000 + 4000;
      while (tr.history.length > 2 && now - tr.history[0].t > keep) tr.history.shift();

      // Fade in on spawn, fade out as it goes stale.
      const target = stale > cfg.staleSec * 0.5 ? 0 : 1;
      tr.life += (target - tr.life) * Math.min(1, frameDt * 3.5);

      if (!tr.hasPos) continue;
      const sample = this.sampleAt(tr, tt, cfg);
      if (!sample) continue;

      const rangeMi = metersToMiles(rangeMeters(sample.m));
      if (rangeMi > cfg.radiusMiles * 1.08) continue;

      const sky =
        cfg.projectionMode === "sky"
          ? groundToSkyAngles(sample.m, sample.altFt, this.fallbackAz(tr))
          : null;
      const p = this.toPoint(sample, cfg, proj, tr);
      const heading = this.screenHeading(tr, tt, cfg, proj);
      const edgeFade =
        cfg.projectionMode === "sky" && sky
          ? clamp01(sky.elev / 6) * clamp01((cfg.radiusMiles - rangeMi) / (cfg.radiusMiles * 0.14))
          : clamp01((cfg.radiusMiles - rangeMi) / (cfg.radiusMiles * 0.14));
      const alpha = clamp01(edgeFade) * tr.life * cfg.brightness;
      const alt = sample.altFt;
      const color = cfg.altitudeColor ? altRamp(alt) : hexToRgb(cfg.palette.glyph);
      const emergency = cfg.highlightEmergency && !!tr.ac.squawk && EMERGENCY_SQUAWKS.has(tr.ac.squawk);
      const sizeScale =
        cfg.projectionMode === "sky" && sky ? skyGlyphScale(sky.slantM) : 1;

      visible.push({ tr, sample, sky, p, heading, rangeMi, alpha, color, emergency, sizeScale });
    }

    // Nearest last so it paints on top.
    visible.sort((a, b) => b.rangeMi - a.rangeMi);

    // Trails + glyphs for everyone.
    if (cfg.showDestArc) for (const v of visible) this.drawDestArc(cfg, proj, v);
    for (const v of visible) this.drawTrail(cfg, proj, v, tt);
    for (const v of visible) this.drawGlyph(cfg, v);

    // Labels: nearest are at the END after the sort.
    const byNear = [...visible].reverse(); // nearest first
    this.drawLabels(cfg, byNear);

    if (cfg.theme === "focus" && byNear.length) this.drawDetailPanel(cfg, byNear[0]);
  }

  /**
   * Run `draw` with the canvas rotated by `labelRotationDeg` around an anchor,
   * so text reads upright from where the viewer lies without moving the field.
   */
  private withLabelRotation(cfg: Config, ax: number, ay: number, draw: () => void): void {
    if (!cfg.labelRotationDeg) {
      draw();
      return;
    }
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate((cfg.labelRotationDeg * Math.PI) / 180);
    ctx.translate(-ax, -ay);
    draw();
    ctx.restore();
  }

  private screenHeading(tr: Track, tt: number, cfg: Config, proj: ProjOpts): number {
    const a = this.sampleAt(tr, tt - 400, cfg);
    const b = this.sampleAt(tr, tt + 400, cfg);
    if (a && b) {
      const pa = this.toPoint(a, cfg, proj, tr);
      const pb = this.toPoint(b, cfg, proj, tr);
      if (Math.hypot(pb.x - pa.x, pb.y - pa.y) > 0.5) {
        return Math.atan2(pb.y - pa.y, pb.x - pa.x);
      }
    }
    const mid = this.sampleAt(tr, tt, cfg);
    if (mid && tr.ac.track != null) {
      const ahead = deadReckon(mid.m, tr.ac.track, 120, 1);
      const p0 = this.toPoint(mid, cfg, proj, tr);
      const p1 = this.toPoint({ m: ahead, altFt: mid.altFt }, cfg, proj, tr);
      return Math.atan2(p1.y - p0.y, p1.x - p0.x);
    }
    return 0;
  }

  // --- overlays: whisper-quiet rings + compass ---
  private drawOverlays(cfg: Config, proj: ProjOpts): void {
    const ctx = this.ctx;
    const cx = this.w / 2;
    const cy = this.h / 2;
    const hM = this.horizonM(cfg);
    const skyMode = cfg.projectionMode === "sky";

    if (cfg.rangeRings) {
      ctx.save();
      if (skyMode) {
        // Elevation contours on the look-up dome (15° … 75° above horizon).
        for (const elev of [15, 30, 45, 60, 75]) {
          const r = (1 - elev / 90) * hM * proj.pxPerM;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(hexToRgb(cfg.palette.grid), (0.22 + elev / 300) * cfg.brightness);
          ctx.lineWidth = 1;
          ctx.setLineDash(elev === 45 ? [] : [2, 8]);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.font = `300 9px ${cfg.fonts.mono}`;
        ctx.fillStyle = rgba(hexToRgb(cfg.palette.text), 0.22 * cfg.brightness);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        for (const elev of [30, 60]) {
          const r = (1 - elev / 90) * hM * proj.pxPerM;
          ctx.fillText(`${elev}°`, cx + r + 4, cy);
        }
      } else {
        for (let mi = 1; mi <= Math.floor(cfg.radiusMiles); mi++) {
          const r = mi * 1609.34 * proj.pxPerM;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(hexToRgb(cfg.palette.grid), 0.5 * cfg.brightness);
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 7]);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      // Zenith mark.
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(hexToRgb(cfg.palette.grid), 0.7 * cfg.brightness);
      ctx.fill();
      ctx.restore();
    }

    if (cfg.compass) {
      ctx.save();
      ctx.font = `300 12px ${cfg.fonts.label}`;
      ctx.fillStyle = rgba(hexToRgb(cfg.palette.text), 0.32 * cfg.brightness);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      try {
        ctx.letterSpacing = "3px";
      } catch {
        /* older browsers */
      }
      for (const [label, deg] of [["N", 0], ["E", 90], ["S", 180], ["W", 270]] as [string, number][]) {
        const p = skyMode
          ? projectSkyPoint(deg, 1.5, proj, hM)
          : project(
              {
                east: Math.sin((deg * Math.PI) / 180) * 1e6,
                north: Math.cos((deg * Math.PI) / 180) * 1e6,
              },
              { ...proj, pxPerM: (Math.min(this.w, this.h) / 2) * 0.965 / 1e6 },
            );
        this.withLabelRotation(cfg, p.x, p.y, () => ctx.fillText(label, p.x, p.y));
      }
      try {
        ctx.letterSpacing = "0px";
      } catch {
        /* noop */
      }
      ctx.restore();
    }
  }

  // --- airport: runways at true geographic position ---
  private drawAirport(cfg: Config, proj: ProjOpts): void {
    const ctx = this.ctx;
    const rwyRgb: [number, number, number] = [150, 180, 220];
    {
      const ap = cfg.airport;
      let cx = 0;
      let cy = 0;
      let n = 0;
      for (const r of ap.runways) {
        const a = this.toScreen(r.le, cfg, proj);
        const b = this.toScreen(r.he, cfg, proj);
        // True runway width in px, nudged up a touch so it stays legible.
        const wpx = Math.max(2.5, r.widthFt * 0.3048 * proj.pxPerM * 1.4);

        ctx.save();
        ctx.lineCap = "butt";
        // Asphalt body.
        ctx.strokeStyle = rgba(rwyRgb, 0.16 * cfg.brightness);
        ctx.lineWidth = wpx;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        // Dashed centerline.
        ctx.strokeStyle = rgba([210, 226, 255], 0.22 * cfg.brightness);
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();

        cx += (a.x + b.x) / 2;
        cy += (a.y + b.y) / 2;
        n++;
      }
      // Airport label at the runway centroid.
      if (n) {
        cx /= n;
        cy /= n;
        ctx.save();
        ctx.font = `300 13px ${cfg.fonts.label}`;
        ctx.fillStyle = rgba(rwyRgb, 0.5 * cfg.brightness);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        try {
          ctx.letterSpacing = "4px";
        } catch {
          /* noop */
        }
        ctx.fillText(ap.name, cx, cy);
        try {
          ctx.letterSpacing = "0px";
        } catch {
          /* noop */
        }
        ctx.restore();
      }
    }
  }

  private toScreen(ll: [number, number], cfg: Config, proj: ProjOpts, altFt = 0): Point {
    const sample: GroundSample = {
      m: llToMeters(ll[0], ll[1], cfg.centerLat, cfg.centerLon),
      altFt,
    };
    return this.toPoint(sample, cfg, proj);
  }

  // --- sky layer (sun / moon / stars / satellites) ---
  private updateSky(cfg: Config, now: number): void {
    const want =
      cfg.showStars || cfg.showSun || cfg.showMoon || cfg.showSatellites || cfg.showPlanets;
    if (!want) {
      this.sky = { stars: [], sats: [], planets: [] };
      return;
    }
    if (now - this.skyComputedAt < 300 && this.skyOffsetUsed === cfg.skyTimeOffsetMin) return;
    this.skyComputedAt = now;
    this.skyOffsetUsed = cfg.skyTimeOffsetMin;
    const date = new Date(Date.now() + cfg.skyTimeOffsetMin * 60000);
    this.sky = computeSky(date, cfg.centerLat, cfg.centerLon, {
      sun: cfg.showSun,
      moon: cfg.showMoon,
      stars: cfg.showStars,
      satellites: cfg.showSatellites,
      planets: cfg.showPlanets,
      magLimit: cfg.starMagLimit,
      tles: this.tles,
    });
  }

  /** Place an (azimuth, altitude) sky point on the field. Zenith=center, horizon=edge. */
  private projectSky(az: number, alt: number, cfg: Config, proj: ProjOpts): Point {
    return projectSkyPoint(az, alt, proj, this.horizonM(cfg));
  }

  private drawSky(cfg: Config, proj: ProjOpts): void {
    const ctx = this.ctx;
    const b = cfg.brightness;

    // Asterism lines (faint) — need star screen points by id.
    if (cfg.showStars && this.sky.stars.length) {
      const pts = new Map<string, Point>();
      for (const s of this.sky.stars) {
        if (s.id) pts.set(s.id, this.projectSky(s.az, s.alt, cfg, proj));
      }
      ctx.save();
      ctx.strokeStyle = `rgba(150,170,220,${0.14 * b})`;
      ctx.lineWidth = 1;
      for (const [a, c] of ASTERISMS) {
        const pa = pts.get(a);
        const pc = pts.get(c);
        if (pa && pc) {
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pc.x, pc.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Stars themselves, sized + twinkling by magnitude.
      for (const s of this.sky.stars) {
        const p = pts.get(s.id!)!;
        const mag = s.mag ?? 2;
        const size = Math.max(0.6, 2.6 - mag * 0.7);
        const tw = 0.78 + 0.22 * Math.sin(this.frameT * 3 + s.az);
        const a = clamp01((2.8 - mag) / 3) * b * tw;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214,224,255,${a})`;
        if (mag < 0.6) {
          ctx.shadowColor = `rgba(200,215,255,${a})`;
          ctx.shadowBlur = size * 3;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        if (mag < cfg.starLabelMagLimit && s.name) this.skyLabel(p, s.name, cfg, 0.5 * b);
      }
    }

    if (cfg.showMoon && this.sky.moon && this.sky.moon.alt > -2) {
      this.drawMoon(this.projectSky(this.sky.moon.az, this.sky.moon.alt, cfg, proj),
        this.sky.moon.illum ?? 1, this.sky.moon.waning ?? false, b);
    }
    if (cfg.showSun && this.sky.sun && this.sky.sun.alt > -2) {
      this.drawSun(this.projectSky(this.sky.sun.az, this.sky.sun.alt, cfg, proj), b);
    }
    if (cfg.showPlanets && this.sky.planets.length) {
      for (const pl of this.sky.planets) {
        const p = this.projectSky(pl.az, pl.alt, cfg, proj);
        const mag = pl.mag ?? 1;
        // Brighter planets (lower magnitude) read larger, with a soft glow.
        const size = Math.max(1.6, Math.min(4, 3 - mag * 0.5));
        const col = PLANET_COLORS[pl.name ?? ""] ?? "230,224,205";
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${0.95 * b})`;
        if (mag < 0.5) {
          ctx.shadowColor = `rgba(${col},${b})`;
          ctx.shadowBlur = size * 2.5;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        if (pl.name) {
          this.skyLabel({ x: p.x + 6, y: p.y - 6 }, pl.name, cfg, 0.7 * b, `rgb(${col})`);
        }
      }
    }
    if (cfg.showSatellites && this.sky.sats.length) {
      for (const sat of this.sky.sats) {
        const p = this.projectSky(sat.az, sat.alt, cfg, proj);
        const iss = sat.kind === "iss";
        ctx.beginPath();
        ctx.arc(p.x, p.y, iss ? 3 : 1.6, 0, Math.PI * 2);
        if (iss) {
          ctx.fillStyle = `rgba(140,255,214,${0.95 * b})`;
          ctx.shadowColor = `rgba(140,255,214,${b})`;
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `rgba(170,205,255,${0.65 * b})`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        if (iss) {
          this.skyLabel({ x: p.x + 6, y: p.y - 6 }, "ISS", cfg, 0.9 * b, "#8CFFD6");
        } else if (cfg.satelliteLabels && sat.name) {
          this.skyLabel({ x: p.x + 5, y: p.y - 5 }, sat.name, cfg, 0.6 * b);
        }
      }
    }
  }

  private drawSun(p: Point, b: number): void {
    const ctx = this.ctx;
    ctx.save();
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 26);
    g.addColorStop(0, `rgba(255,210,120,${0.9 * b})`);
    g.addColorStop(0.4, `rgba(255,180,80,${0.4 * b})`);
    g.addColorStop(1, "rgba(255,170,70,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255,224,150,${b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawMoon(p: Point, illum: number, waning: boolean, b: number): void {
    const ctx = this.ctx;
    const r = 8;
    ctx.save();
    // Soft glow.
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.6);
    g.addColorStop(0, `rgba(220,228,245,${0.35 * b})`);
    g.addColorStop(1, "rgba(220,228,245,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
    ctx.fill();
    // Dim full disc (earthshine).
    ctx.fillStyle = `rgba(64,72,90,${0.55 * b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    // Lit region: bright limb semicircle + elliptical terminator.
    ctx.translate(p.x, p.y);
    ctx.scale(waning ? -1 : 1, 1); // bright limb on the right (waxing) / left (waning)
    const rx = r * (1 - 2 * illum); // >0 crescent, <0 gibbous, 0 = half
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.ellipse(0, 0, Math.abs(rx), r, 0, Math.PI / 2, -Math.PI / 2, rx > 0);
    ctx.closePath();
    ctx.fillStyle = `rgba(232,238,250,${b})`;
    ctx.fill();
    ctx.restore();
  }

  private skyLabel(p: Point, text: string, cfg: Config, alpha: number, color = "#AEB6C6"): void {
    const ctx = this.ctx;
    this.withLabelRotation(cfg, p.x, p.y, () => {
      ctx.save();
      ctx.font = `300 10px ${cfg.fonts.label}`;
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      try {
        ctx.letterSpacing = "1px";
      } catch {
        /* noop */
      }
      ctx.fillText(text, p.x + 5, p.y);
      try {
        ctx.letterSpacing = "0px";
      } catch {
        /* noop */
      }
      ctx.restore();
    });
  }

  // --- window to elsewhere: faint arc toward destination ---
  private drawDestArc(cfg: Config, proj: ProjOpts, v: Visible): void {
    const ac = v.tr.ac;
    if (ac.lat == null || ac.lon == null || ac.destLat == null || ac.destLon == null) return;
    if (!routePlausible(ac, cfg)) return;

    const ctx = this.ctx;
    const destAz = bearing(ac.lat, ac.lon, ac.destLat, ac.destLon);
    const pts: Point[] = [v.p];

    if (cfg.projectionMode === "sky" && v.sky) {
      // Curve along the dome from the aircraft's sky position toward the
      // destination azimuth at the horizon — a realistic look-up great-circle hint.
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        const f = i / steps;
        const az = lerpAzimuth(v.sky.az, destAz, f);
        const elev = v.sky.elev * (1 - f * f);
        pts.push(this.projectSky(az, elev, cfg, proj));
      }
    } else {
      const brg = destAz * (Math.PI / 180);
      const stepM = this.horizonM(cfg) * 0.5;
      const ahead = project(
        {
          east: v.sample.m.east + Math.sin(brg) * stepM,
          north: v.sample.m.north + Math.cos(brg) * stepM,
        },
        proj,
      );
      const dx = ahead.x - v.p.x;
      const dy = ahead.y - v.p.y;
      const len = Math.hypot(dx, dy) || 1;
      const L = Math.min(this.w, this.h) * 0.24;
      pts.push({ x: v.p.x + (dx / len) * L, y: v.p.y + (dy / len) * L });
    }

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 1; i < pts.length; i++) {
      const f = i / (pts.length - 1);
      ctx.strokeStyle = rgba(v.color, (0.34 - f * 0.28) * v.alpha);
      ctx.lineWidth = 1.4 - f * 0.5;
      ctx.setLineDash(f > 0.6 ? [2, 5] : []);
      ctx.beginPath();
      ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
      ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- comet trail ---
  private drawTrail(cfg: Config, proj: ProjOpts, v: Visible, tt: number): void {
    if (cfg.trailSeconds <= 0) return;
    const ctx = this.ctx;
    const h = v.tr.history;
    if (h.length < 2) return;

    // Build the polyline from real fixes within the window, ending at the head.
    const windowMs = cfg.trailSeconds * 1000;
    const pts: { p: Point; age: number }[] = [];
    for (const s of h) {
      if (s.t < tt - windowMs || s.t > tt) continue;
      const sample: GroundSample = { m: s.m, altFt: s.altFt };
      pts.push({
        p: this.toPoint(sample, cfg, proj, v.tr),
        age: (tt - s.t) / windowMs,
      });
    }
    pts.push({ p: v.p, age: 0 });
    if (pts.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const f = 1 - b.age; // 1 at head, 0 at tail
      ctx.strokeStyle = rgba(v.color, 0.55 * f * v.alpha);
      ctx.lineWidth = 0.7 + 2.2 * f * (cfg.glyphSizePx / 14);
      ctx.beginPath();
      ctx.moveTo(a.p.x, a.p.y);
      ctx.lineTo(b.p.x, b.p.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- glyph: type-aware luminous silhouette ---
  private drawGlyph(cfg: Config, v: Visible): void {
    const ctx = this.ctx;
    const color = v.emergency ? hexToRgb(cfg.palette.warn) : v.color;
    const kind = classifyGlyph(v.tr.ac);
    const s = cfg.glyphSizePx * GLYPH_SCALE[kind] * v.sizeScale;

    ctx.save();
    ctx.translate(v.p.x, v.p.y);
    ctx.rotate(v.heading + Math.PI / 2);

    // Soft halo — restrained so the silhouette reads as an aircraft.
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.7);
    halo.addColorStop(0, rgba(color, 0.16 * v.alpha));
    halo.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, s * 1.7, 0, Math.PI * 2);
    ctx.fill();

    drawAircraftGlyph(ctx, kind, s, color, v.alpha, this.frameT, hexSeed(v.tr.ac.hex));
    ctx.restore();
  }

  // --- labels: restrained typography, nearest only ---
  private placedBoxes: { x: number; y: number; w: number; h: number }[] = [];

  private drawLabels(cfg: Config, nearestFirst: Visible[]): void {
    const limit =
      cfg.labelDensity === "all"
        ? nearestFirst.length
        : cfg.labelDensity === "nearestN"
          ? cfg.nearestN
          : 1;
    this.placedBoxes = [];
    for (let i = 0; i < Math.min(limit, nearestFirst.length); i++) {
      // Nearest labels brightest; gently dim further ones (but keep readable).
      const prom = 1 - i / Math.max(1, nearestFirst.length);
      this.drawLabel(cfg, nearestFirst[i], 0.7 + 0.3 * prom);
    }
  }

  private measureLabel(
    cfg: Config,
    lines: { text: string; kind: "title" | "sub" }[],
  ): { w: number; lh: number; h: number } {
    const ctx = this.ctx;
    const lh = 16;
    let w = 0;
    for (const ln of lines) {
      ctx.font = ln.kind === "title" ? `500 14px ${cfg.fonts.label}` : `400 11px ${cfg.fonts.label}`;
      try {
        ctx.letterSpacing = ln.kind === "title" ? "1.5px" : "0.5px";
      } catch {
        /* noop */
      }
      w = Math.max(w, ctx.measureText(ln.text).width);
    }
    try {
      ctx.letterSpacing = "0px";
    } catch {
      /* noop */
    }
    return { w: w + 2, lh, h: lines.length * lh };
  }

  private collides(b: { x: number; y: number; w: number; h: number }): boolean {
    const pad = 3;
    for (const p of this.placedBoxes) {
      if (
        b.x - pad < p.x + p.w &&
        b.x + b.w + pad > p.x &&
        b.y - pad < p.y + p.h &&
        b.y + b.h + pad > p.y
      ) {
        return true;
      }
    }
    return false;
  }

  private drawLabel(cfg: Config, v: Visible, strength: number): void {
    const ctx = this.ctx;
    const lines = labelLines(cfg, v.tr.ac);
    if (!lines.length) return;
    const a = v.alpha * strength;
    if (a < 0.04) return;

    const { w, lh, h } = this.measureLabel(cfg, lines);
    const gap = cfg.glyphSizePx * 0.7 + 9;
    const onScreen = (b: { x: number; y: number; w: number; h: number }) =>
      b.x >= 6 && b.x + b.w <= this.w - 6 && b.y >= 6 && b.y + b.h <= this.h - 6;

    // Try four quadrants, then nudge downward, to avoid overlapping other labels.
    const candidates = [
      { x: v.p.x + gap, y: v.p.y - gap - h },
      { x: v.p.x + gap, y: v.p.y + gap },
      { x: v.p.x - gap - w, y: v.p.y - gap - h },
      { x: v.p.x - gap - w, y: v.p.y + gap },
    ];
    let box: { x: number; y: number; w: number; h: number } | null = null;
    for (const c of candidates) {
      const b = { x: c.x, y: c.y, w, h };
      if (onScreen(b) && !this.collides(b)) {
        box = b;
        break;
      }
    }
    if (!box) {
      let b = { x: v.p.x + gap, y: v.p.y - gap - h, w, h };
      for (let k = 0; k < 9 && (this.collides(b) || !onScreen(b)); k++) {
        b = { ...b, y: b.y + lh + 2 };
      }
      box = b;
    }
    box.x = Math.max(6, Math.min(box.x, this.w - 6 - w));
    box.y = Math.max(6, Math.min(box.y, this.h - 6 - h));
    this.placedBoxes.push(box);

    // Hairline leader from glyph to the nearest edge of the label.
    const anchorX = box.x + w / 2 < v.p.x ? box.x + w : box.x;
    const anchorY = Math.max(box.y, Math.min(v.p.y, box.y + h));
    // Rotate the whole label (leader + text) around the glyph so it reads
    // upright from where you lie, without disturbing the field.
    this.withLabelRotation(cfg, v.p.x, v.p.y, () => {
      ctx.save();
      ctx.strokeStyle = rgba(hexToRgb(cfg.palette.text), 0.24 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(v.p.x, v.p.y);
      ctx.lineTo(anchorX, anchorY);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 6;
      let y = box.y;
      for (const ln of lines) {
        if (ln.kind === "title") {
          ctx.font = `500 14px ${cfg.fonts.label}`;
          ctx.fillStyle = rgba([245, 247, 255], a);
          try {
            ctx.letterSpacing = "1.5px";
          } catch {
            /* noop */
          }
        } else {
          ctx.font = `400 11px ${cfg.fonts.label}`;
          ctx.fillStyle = rgba(hexToRgb(cfg.palette.text), 0.82 * a);
          try {
            ctx.letterSpacing = "0.5px";
          } catch {
            /* noop */
          }
        }
        ctx.fillText(ln.text, box.x, y);
        y += lh;
      }
      try {
        ctx.letterSpacing = "0px";
      } catch {
        /* noop */
      }
      ctx.restore();
    });
  }

  private drawDetailPanel(cfg: Config, v: Visible): void {
    const ac = v.tr.ac;
    const x = 40;
    const y = this.h - 120;
    this.withLabelRotation(cfg, x, y, () => this.drawDetailPanelText(cfg, v, ac, x, y));
  }

  private drawDetailPanelText(cfg: Config, v: Visible, ac: Aircraft, x: number, y: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 10;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    try {
      ctx.letterSpacing = "2px";
    } catch {
      /* noop */
    }
    ctx.font = `300 34px ${cfg.fonts.label}`;
    ctx.fillStyle = rgba([245, 247, 255], v.alpha);
    ctx.fillText(ac.flight ?? ac.hex.toUpperCase(), x, y);
    try {
      ctx.letterSpacing = "0.5px";
    } catch {
      /* noop */
    }
    ctx.font = `400 15px ${cfg.fonts.label}`;
    ctx.fillStyle = rgba(hexToRgb(cfg.palette.text), 0.85 * v.alpha);
    const dpAlt = ac.altBaro ?? ac.altGeom;
    const bits = [
      ac.airline,
      ac.typeName ?? ac.typeCode,
      ac.onGround ? "on ground" : dpAlt != null ? `${dpAlt.toLocaleString("en-US")} ft` : null,
      ac.gs != null ? formatSpeed(ac.gs, cfg.speedUnit) : null,
      ac.origin && ac.destination && routePlausible(ac, cfg) ? `${ac.origin} → ${ac.destination}` : null,
    ].filter(Boolean);
    ctx.fillText(bits.join("    ·    "), x, y + 26);
    try {
      ctx.letterSpacing = "0px";
    } catch {
      /* noop */
    }
    ctx.restore();
  }
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** Stable per-aircraft phase offset (0..2π) so props/rotors aren't all in sync. */
function hexSeed(hex: string): number {
  let n = 0;
  for (let i = 0; i < hex.length; i++) n = (n * 31 + hex.charCodeAt(i)) % 360;
  return (n / 360) * Math.PI * 2;
}

const DEG = Math.PI / 180;

/** Initial great-circle bearing (deg from North) from point 1 to point 2. */
function bearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = lat1 * DEG;
  const φ2 = lat2 * DEG;
  const Δλ = (lon2 - lon1) * DEG;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

/** Great-circle distance in statute miles. */
function greatCircleMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = lat1 * DEG;
  const φ2 = lat2 * DEG;
  const dφ = (lat2 - lat1) * DEG;
  const dλ = (lon2 - lon1) * DEG;
  const a = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Civil local time at a place as HH:MM (real timezone incl. DST). Falls
 *  back to longitude-based mean solar time if the tz lookup fails — solar
 *  time can read ~an hour off the wall clock (#25). */
function localTimeAt(lat: number, lon: number): string {
  try {
    const tz = tzLookup(lat, lon);
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    });
  } catch {
    const now = new Date();
    const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
    let m = (utcMin + (lon / 15) * 60) % 1440;
    if (m < 0) m += 1440;
    const hh = Math.floor(m / 60);
    const mm = Math.floor(m % 60);
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
}

/** Cross-track distance (miles) of a point from the great circle p1→p2. */
function crossTrackMiles(
  lat: number, lon: number,
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 3958.8;
  const d13 = greatCircleMiles(lat1, lon1, lat, lon) / R; // angular (rad)
  const θ13 = bearing(lat1, lon1, lat, lon) * DEG;
  const θ12 = bearing(lat1, lon1, lat2, lon2) * DEG;
  return Math.asin(Math.sin(d13) * Math.sin(θ13 - θ12)) * R;
}

/**
 * Is the adsbdb route consistent with where the plane actually is and what it's
 * doing? adsbdb returns the scheduled route for a callsign, which is sometimes
 * the wrong leg. We reject a route if:
 *  (a) it's geographically impossible — the plane is neither near an endpoint
 *      nor roughly on the great-circle path; or
 *  (b) the plane's vertical trend disagrees — a climbing plane near you just
 *      departed the local airport (so that should be the origin); a descending
 *      one is arriving (the destination).
 */
function routePlausible(ac: Aircraft, cfg: Config): boolean {
  if (ac.lat == null || ac.lon == null) return true;
  const haveCoords = ac.originLat != null || ac.destLat != null;
  if (!haveCoords) return true; // legacy cache without coords — don't hide

  // (a) geographic consistency
  const nearPlane = (la?: number, lo?: number) =>
    la != null && lo != null && greatCircleMiles(ac.lat!, ac.lon!, la, lo) < 80;
  let geomOk = nearPlane(ac.originLat, ac.originLon) || nearPlane(ac.destLat, ac.destLon);
  if (
    !geomOk &&
    ac.originLat != null && ac.originLon != null &&
    ac.destLat != null && ac.destLon != null
  ) {
    geomOk = Math.abs(crossTrackMiles(ac.lat, ac.lon, ac.originLat, ac.originLon, ac.destLat, ac.destLon)) < 130;
  } else if (!geomOk && (ac.originLat == null || ac.destLat == null)) {
    geomOk = true; // only one endpoint known and not near — can't judge, allow
  }
  if (!geomOk) return false;

  // (b) vertical-trend consistency for low, nearby traffic
  const alt = ac.altBaro ?? ac.altGeom;
  const localTraffic = greatCircleMiles(ac.lat, ac.lon, cfg.centerLat, cfg.centerLon) < 30;
  const localAirport = (la?: number, lo?: number) =>
    la != null && lo != null && greatCircleMiles(cfg.centerLat, cfg.centerLon, la, lo) < 45;
  if (localTraffic && alt != null && alt < 12000 && ac.baroRate != null && Math.abs(ac.baroRate) > 250) {
    if (ac.baroRate > 0) {
      if (ac.originLat != null && !localAirport(ac.originLat, ac.originLon)) return false; // departing
    } else {
      if (ac.destLat != null && !localAirport(ac.destLat, ac.destLon)) return false; // arriving
    }
  }
  return true;
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
