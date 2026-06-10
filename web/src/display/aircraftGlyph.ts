// Type-aware aircraft glyphs, all in the same luminous swept-wing style as the
// original airliner: bigger widebodies, four-engine heavies, turboprops and GA
// with spinning props, and helicopters with spinning rotors. Classification is
// from the ICAO type code with emitter-category fallbacks.

import type { Aircraft } from "@shared/index.js";

export type GlyphKind =
  | "light"
  | "glider"
  | "turboprop"
  | "airliner"
  | "widebody"
  | "quadjet"
  | "helicopter";

// Relative size per kind (multiplies the configured glyph size).
export const GLYPH_SCALE: Record<GlyphKind, number> = {
  light: 0.62,
  glider: 0.58,
  turboprop: 0.86,
  airliner: 1.0,
  widebody: 1.3,
  quadjet: 1.46,
  helicopter: 0.82,
};

const HELI = new Set([
  "EC20", "EC25", "EC30", "EC35", "EC45", "EC55", "AS50", "AS55", "AS65", "AS32",
  "A109", "A119", "A139", "A169", "A189", "B06", "B06T", "B407", "B412", "B427",
  "B429", "B430", "B505", "S76", "S92", "S61", "S64", "H60", "H500", "MD52",
  "MD60", "R22", "R44", "R66", "EXEC", "EXPL", "GAZL", "LYNX", "NH90", "PUMA",
  "SCAV", "UH1", "B105", "B212", "B214", "B222", "AC", "H47", "H64",
]);
const QUAD = new Set([
  "B741", "B742", "B743", "B744", "B748", "B74S", "B74R", "B74D", "A388", "A342",
  "A343", "A345", "A346", "A124", "C5M", "A225", "IL96", "B52", "A140",
]);
const WIDE = new Set([
  "A306", "A30B", "A310", "A332", "A333", "A338", "A339", "A359", "A35K", "B762",
  "B763", "B764", "B772", "B77L", "B773", "B77W", "B778", "B779", "B788", "B789",
  "B78X", "MD11", "IL86", "DC10", "L101", "A337", "B767", "B777", "B787",
]);
const TPROP = new Set([
  "DH8A", "DH8B", "DH8C", "DH8D", "AT43", "AT44", "AT45", "AT46", "AT72", "AT73",
  "AT75", "AT76", "SF34", "SB20", "SW3", "SW4", "E110", "E120", "C208", "C212",
  "C408", "PC12", "B190", "BE20", "B350", "B300", "JS31", "JS32", "JS41", "D228",
  "D328", "F50", "F27", "ATP", "TBM7", "TBM8", "TBM9", "TBM0", "PC6", "C441",
  "C425", "DHC6", "DHC7", "C130", "AN12", "AN26", "AN32", "SH36", "CVLT", "SAAB",
]);
const GLIDER = new Set([
  "DISC", "DUOD", "VENT", "NIMB", "NIM3", "NIM4", "JANS", "ARCE", "DG40", "DG80",
  "DG1T", "DG30", "DG50", "LS3", "LS4", "LS6", "LS7", "LS8", "STD3", "G103",
  "G102", "G104", "PW5", "PW6", "L13", "L23", "L33", "PIK", "PEGA", "KEST",
  "TWIN", "AS33", "ASW", "ASG", "ASK", "VENS", "GLID", "MOSQ", "DIMO",
]);
const LIGHT = new Set([
  "C150", "C152", "C162", "C172", "C72R", "C175", "C177", "C180", "C182", "C185",
  "C188", "C206", "C207", "C210", "C310", "C337", "SR20", "SR22", "S22T", "PA18",
  "PA24", "PA28", "P28A", "P28B", "P28R", "PA32", "P32R", "PA34", "PA38", "PA44",
  "PA46", "DA20", "DA40", "DA42", "DA62", "BE33", "BE35", "BE36", "BE58", "BE76",
  "BE19", "BE23", "BE24", "M20P", "M20T", "AA1", "AA5", "GLAS", "COL4", "RV4",
  "RV6", "RV7", "RV8", "RV9", "RV10", "RV14", "GA8", "G115", "BL8", "CH7", "SF50",
]);

export function classifyGlyph(ac: Aircraft): GlyphKind {
  const code = (ac.typeCode || "").toUpperCase();
  const cat = ac.category;
  if (cat === "A7" || HELI.has(code)) return "helicopter";
  if (QUAD.has(code)) return "quadjet";
  if (WIDE.has(code) || cat === "A5") return "widebody";
  if (TPROP.has(code)) return "turboprop";
  if (GLIDER.has(code) || cat === "B1") return "glider";
  if (LIGHT.has(code) || cat === "A1") return "light";
  return "airliner";
}

type RGB = [number, number, number];
const col = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/**
 * Draw a glyph in local space (already translated to position and rotated so
 * "up" / -y is the direction of travel). Caller draws the halo; we draw the
 * glowing silhouette, engines/props/rotors, and bright core.
 */
export function drawAircraftGlyph(
  ctx: CanvasRenderingContext2D,
  kind: GlyphKind,
  s: number,
  color: RGB,
  alpha: number,
  t: number,
  seed: number,
): void {
  ctx.shadowColor = col(color, 0.85 * alpha);
  ctx.shadowBlur = s * 0.7;
  ctx.fillStyle = col(color, Math.min(1, alpha * 1.08));

  switch (kind) {
    case "widebody":
      jetBody(ctx, s, { fw: 0.22, nose: -1.16, tail: 1.06, span: 1.16, tipY: 0.5 });
      fillAndEngines(ctx, s, color, alpha, [0.42, 0.66]);
      core(ctx, s, alpha, 0.1);
      break;
    case "quadjet":
      jetBody(ctx, s, { fw: 0.22, nose: -1.2, tail: 1.08, span: 1.2, tipY: 0.5 });
      fillAndEngines(ctx, s, color, alpha, [0.34, 0.55, 0.74, 0.95].map((x) => x * 0.95));
      core(ctx, s, alpha, 0.1);
      break;
    case "turboprop":
      jetBody(ctx, s, { fw: 0.2, nose: -1.0, tail: 0.96, span: 1.04, tipY: 0.34, straight: true });
      ctx.fill();
      ctx.shadowBlur = 0;
      // Props in place of nacelles, spinning.
      propDisc(ctx, -0.5 * s, 0.18 * s, 0.26 * s, color, alpha, t * 9 + seed);
      propDisc(ctx, 0.5 * s, 0.18 * s, 0.26 * s, color, alpha, -t * 9 + seed, true);
      core(ctx, s, alpha, 0.09);
      break;
    case "light":
      lightBody(ctx, s);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Single nose prop, spinning.
      propDisc(ctx, 0, -0.95 * s, 0.34 * s, color, alpha, t * 11 + seed);
      break;
    case "glider":
      gliderBody(ctx, s);
      ctx.fill();
      ctx.shadowBlur = 0;
      core(ctx, s, alpha, 0.07);
      break;
    case "helicopter":
      heliBody(ctx, s);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Tail rotor (small, fast) then main rotor (large, over the body).
      propDisc(ctx, 0.04 * s, 1.18 * s, 0.22 * s, color, alpha, t * 16 + seed, false, 2);
      mainRotor(ctx, s, color, alpha, t * 6 + seed);
      break;
    case "airliner":
    default:
      jetBody(ctx, s, { fw: 0.2, nose: -1.06, tail: 0.98, span: 1.05, tipY: 0.52 });
      fillAndEngines(ctx, s, color, alpha, [0.46]);
      core(ctx, s, alpha, 0.1);
      break;
  }
}

interface JetOpts {
  fw: number;
  nose: number;
  tail: number;
  span: number;
  tipY: number;
  straight?: boolean;
}

/** Trace fuselage + swept (or straight) wings + tailplane into the current path. */
function jetBody(ctx: CanvasRenderingContext2D, s: number, o: JetOpts): void {
  const sweep = o.straight ? 0.18 : 0.54; // wing leading-edge sweep depth
  ctx.beginPath();
  ctx.roundRect((-o.fw * s) / 2, o.nose * s, o.fw * s, (o.tail - o.nose) * s, (o.fw * s) / 2);
  // Main wings.
  ctx.moveTo(-0.09 * s, -0.02 * s);
  ctx.lineTo(-o.span * s, sweep * s);
  ctx.lineTo(-(o.span - 0.1) * s, (sweep + 0.06) * s);
  ctx.lineTo(-0.09 * s, 0.3 * s);
  ctx.lineTo(0.09 * s, 0.3 * s);
  ctx.lineTo((o.span - 0.1) * s, (sweep + 0.06) * s);
  ctx.lineTo(o.span * s, sweep * s);
  ctx.lineTo(0.09 * s, -0.02 * s);
  ctx.closePath();
  // Tailplane.
  const ty = o.tail - 0.24;
  ctx.moveTo(-0.08 * s, ty * s);
  ctx.lineTo(-0.44 * s, (ty + 0.23) * s);
  ctx.lineTo(-0.37 * s, (ty + 0.27) * s);
  ctx.lineTo(-0.08 * s, (ty + 0.12) * s);
  ctx.lineTo(0.08 * s, (ty + 0.12) * s);
  ctx.lineTo(0.37 * s, (ty + 0.27) * s);
  ctx.lineTo(0.44 * s, (ty + 0.23) * s);
  ctx.lineTo(0.08 * s, ty * s);
  ctx.closePath();
}

/** Fill the traced jet body, then add engine nacelles at the given |x| offsets. */
function fillAndEngines(
  ctx: CanvasRenderingContext2D,
  s: number,
  color: RGB,
  alpha: number,
  xs: number[],
): void {
  for (const ex of xs) {
    for (const sign of [-1, 1]) {
      ctx.moveTo(sign * ex * s + 0.07 * s, 0.24 * s);
      ctx.ellipse(sign * ex * s, 0.24 * s, 0.07 * s, 0.13 * s, 0, 0, Math.PI * 2);
    }
  }
  ctx.fillStyle = col(color, Math.min(1, alpha * 1.08));
  ctx.fill();
}

/** Small high-wing single (Cessna-like). */
function lightBody(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath();
  ctx.roundRect(-0.11 * s, -0.85 * s, 0.22 * s, 1.7 * s, 0.11 * s);
  // Straight high wings.
  ctx.moveTo(-0.1 * s, -0.34 * s);
  ctx.lineTo(-1.0 * s, -0.18 * s);
  ctx.lineTo(-1.0 * s, -0.02 * s);
  ctx.lineTo(-0.1 * s, -0.08 * s);
  ctx.lineTo(0.1 * s, -0.08 * s);
  ctx.lineTo(1.0 * s, -0.02 * s);
  ctx.lineTo(1.0 * s, -0.18 * s);
  ctx.lineTo(0.1 * s, -0.34 * s);
  ctx.closePath();
  // Tailplane.
  ctx.moveTo(-0.09 * s, 0.6 * s);
  ctx.lineTo(-0.42 * s, 0.78 * s);
  ctx.lineTo(-0.42 * s, 0.88 * s);
  ctx.lineTo(-0.09 * s, 0.74 * s);
  ctx.lineTo(0.09 * s, 0.74 * s);
  ctx.lineTo(0.42 * s, 0.88 * s);
  ctx.lineTo(0.42 * s, 0.78 * s);
  ctx.lineTo(0.09 * s, 0.6 * s);
  ctx.closePath();
}

/** Sailplane: slender fuselage + very long, thin, high-aspect-ratio wings + T-tail. */
function gliderBody(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath();
  // Slender fuselage, pointed nose.
  ctx.roundRect(-0.07 * s, -0.92 * s, 0.14 * s, 1.7 * s, 0.07 * s);
  // Long, thin, near-straight wings (high aspect ratio).
  ctx.moveTo(-0.06 * s, -0.18 * s);
  ctx.lineTo(-1.55 * s, -0.02 * s);
  ctx.lineTo(-1.55 * s, 0.05 * s);
  ctx.lineTo(-0.06 * s, 0.02 * s);
  ctx.lineTo(0.06 * s, 0.02 * s);
  ctx.lineTo(1.55 * s, 0.05 * s);
  ctx.lineTo(1.55 * s, -0.02 * s);
  ctx.lineTo(0.06 * s, -0.18 * s);
  ctx.closePath();
  // T-tail: horizontal stabilizer carried high at the tail.
  ctx.moveTo(-0.06 * s, 0.66 * s);
  ctx.lineTo(-0.38 * s, 0.72 * s);
  ctx.lineTo(-0.38 * s, 0.8 * s);
  ctx.lineTo(-0.06 * s, 0.76 * s);
  ctx.lineTo(0.06 * s, 0.76 * s);
  ctx.lineTo(0.38 * s, 0.8 * s);
  ctx.lineTo(0.38 * s, 0.72 * s);
  ctx.lineTo(0.06 * s, 0.66 * s);
  ctx.closePath();
}

/** Helicopter: teardrop cabin + tail boom + tail-rotor pylon. */
function heliBody(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath();
  // Cabin (rounded, nose up).
  ctx.ellipse(0, -0.15 * s, 0.34 * s, 0.55 * s, 0, 0, Math.PI * 2);
  // Tail boom.
  ctx.moveTo(-0.07 * s, 0.3 * s);
  ctx.lineTo(-0.05 * s, 1.12 * s);
  ctx.lineTo(0.05 * s, 1.12 * s);
  ctx.lineTo(0.07 * s, 0.3 * s);
  ctx.closePath();
  // Tail fin.
  ctx.moveTo(-0.05 * s, 1.0 * s);
  ctx.lineTo(-0.22 * s, 1.22 * s);
  ctx.lineTo(-0.05 * s, 1.22 * s);
  ctx.closePath();
}

/** A spinning propeller / small rotor disc. */
function propDisc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: RGB,
  alpha: number,
  spin: number,
  hub = true,
  blades = 4,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(spin);
  ctx.globalAlpha = 1;
  // Faint disc (motion blur).
  ctx.fillStyle = col(color, 0.14 * alpha);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  // Blades.
  ctx.strokeStyle = col(color, 0.7 * alpha);
  ctx.lineWidth = Math.max(1, r * 0.16);
  ctx.lineCap = "round";
  for (let i = 0; i < blades; i++) {
    const a = (i / blades) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  if (hub) {
    ctx.fillStyle = col([255, 255, 255], 0.7 * alpha);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Large two-blade main rotor over the helicopter body. */
function mainRotor(
  ctx: CanvasRenderingContext2D,
  s: number,
  color: RGB,
  alpha: number,
  spin: number,
): void {
  const r = 1.15 * s;
  ctx.save();
  ctx.translate(0, -0.15 * s);
  ctx.rotate(spin);
  // Disc blur.
  ctx.fillStyle = col(color, 0.08 * alpha);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  // Two blades.
  ctx.strokeStyle = col(color, 0.55 * alpha);
  ctx.lineWidth = Math.max(1.2, r * 0.06);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.lineTo(r, 0);
  ctx.stroke();
  // Hub.
  ctx.fillStyle = col([255, 255, 255], 0.85 * alpha);
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function core(ctx: CanvasRenderingContext2D, s: number, alpha: number, r: number): void {
  ctx.shadowBlur = 0;
  ctx.fillStyle = col([255, 255, 255], 0.75 * alpha);
  ctx.beginPath();
  ctx.arc(0, 0, s * r, 0, Math.PI * 2);
  ctx.fill();
}
