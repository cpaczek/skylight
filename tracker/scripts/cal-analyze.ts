// Offline analysis of the auto-calibration buffer: residual structure of the
// CURRENT mount model vs elevation/azimuth, plus what each solver variant
// would do with the same samples. Reads an autocal.json + mount model pulled
// from the Pi — no camera, no network.
//
//   pnpm exec tsx scripts/cal-analyze.ts /tmp/autocal.json '<mount json>'

import fs from "node:fs";
import { DEG, norm180, solveMount, worldFromMount, type MountModel } from "@shared/index.js";

const [, , file, mountJson] = process.argv;
const { samples } = JSON.parse(fs.readFileSync(file, "utf8")) as {
  samples: { panDeg: number; tiltDeg: number; azDeg: number; elDeg: number; t: number }[];
};
const current = JSON.parse(mountJson) as MountModel;

console.log(`samples: ${samples.length}`);

function resid(s: (typeof samples)[0], m: MountModel): { ra: number; re: number } {
  const p = worldFromMount({ panDeg: s.panDeg, tiltDeg: s.tiltDeg }, m);
  return { ra: norm180(p.azDeg - s.azDeg) * Math.cos(s.elDeg * DEG), re: p.elDeg - s.elDeg };
}
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const rms = (a: number[]) => Math.sqrt(mean(a.map((x) => x * x)));

// Residuals of the CURRENT model, banded by elevation.
console.log("\n== current model residuals by elevation band ==");
const BANDS: [number, number][] = [[8, 15], [15, 25], [25, 40], [40, 60], [60, 75]];
for (const [lo, hi] of BANDS) {
  const inBand = samples.filter((s) => s.elDeg >= lo && s.elDeg < hi);
  if (!inBand.length) { console.log(`  el ${lo}-${hi}: (none)`); continue; }
  const rs = inBand.map((s) => resid(s, current));
  console.log(
    `  el ${String(lo).padStart(2)}-${hi}: n=${String(inBand.length).padStart(3)}  ` +
    `az bias ${mean(rs.map((r) => r.ra)).toFixed(2)}° el bias ${mean(rs.map((r) => r.re)).toFixed(2)}°  ` +
    `rms ${rms(rs.flatMap((r) => [r.ra, r.re])).toFixed(2)}°`,
  );
}

// Same banding by azimuth — a pan-gain error shows as an az-dependent ramp.
console.log("\n== current model residuals by azimuth sector ==");
for (let a0 = 0; a0 < 360; a0 += 60) {
  const inSec = samples.filter((s) => ((s.azDeg % 360) + 360) % 360 >= a0 && ((s.azDeg % 360) + 360) % 360 < a0 + 60);
  if (inSec.length < 3) continue;
  const rs = inSec.map((s) => resid(s, current));
  console.log(
    `  az ${String(a0).padStart(3)}-${a0 + 60}: n=${String(inSec.length).padStart(3)}  ` +
    `az bias ${mean(rs.map((r) => r.ra)).toFixed(2)}°  el bias ${mean(rs.map((r) => r.re)).toFixed(2)}°`,
  );
}

// What would each solver variant deliver on these samples?
console.log("\n== solver variants on this buffer ==");
const all = samples.map((s) => ({ panDeg: s.panDeg, tiltDeg: s.tiltDeg, azDeg: s.azDeg, elDeg: s.elDeg }));
const rmsNow = rms(samples.flatMap((s) => { const r = resid(s, current); return [r.ra, r.re]; }));
console.log(`  current model:            rms ${rmsNow.toFixed(3)}°`);
for (const [label, opts] of [
  ["offsets only", { solveGains: false, solveLevel: false }],
  ["offsets + gains", { solveGains: true, solveLevel: false }],
  ["offsets + gains + level", { solveGains: true, solveLevel: true }],
] as const) {
  const out = solveMount(all, current, opts);
  if (!out) { console.log(`  ${label}: solve failed`); continue; }
  const m = out.model;
  console.log(
    `  ${label.padEnd(25)} rms ${out.rmsDeg.toFixed(3)}°  ` +
    `panOff ${m.panOffsetDeg.toFixed(2)} tiltOff ${m.tiltOffsetDeg.toFixed(2)} ` +
    `gains ${m.panGain.toFixed(4)}/${m.tiltGain.toFixed(4)} level ${m.levelTiltDeg.toFixed(2)}@${m.levelDirDeg.toFixed(0)}`,
  );
}

// Refraction signature: el residual vs elevation, low bands. Standard
// atmosphere bends light DOWN to the observer, lifting the APPARENT target;
// vision centers the apparent target, so the pose tilts higher than the
// geometric model expects -> NEGATIVE el residual growing toward low el
// (model_el - truth_el, where the pose was lifted by refraction).
console.log("\n== refraction check: mean el residual vs 1/tan(el) ==");
const lowEl = samples.filter((s) => s.elDeg < 30);
const xs = lowEl.map((s) => 1 / Math.tan(s.elDeg * DEG));
const ys = lowEl.map((s) => resid(s, current).re);
const mx = mean(xs);
const my = mean(ys);
const slope = mean(xs.map((x, i) => (x - mx) * (ys[i] - my))) / Math.max(1e-9, mean(xs.map((x) => (x - mx) ** 2)));
console.log(`  n=${lowEl.length} slope ${(slope * 60).toFixed(2)} arcmin per unit cot(el)  (refraction predicts ~ -1 arcmin)`);

// Per-sample residual histogram + iterative-trim fit: is there a clean core?
console.log("\n== residual histogram (current model) ==");
const perS = samples.map((s) => { const r = resid(s, current); return Math.hypot(r.ra, r.re); });
for (const [lo, hi] of [[0, 0.5], [0.5, 1], [1, 2], [2, 4], [4, 8], [8, 30]] as const) {
  const n = perS.filter((r) => r >= lo && r < hi).length;
  console.log(`  ${String(lo).padStart(3)}-${hi}°: ${"#".repeat(n)} (${n})`);
}

console.log("\n== iterative-trim fit (drop worst 20% until rms<0.5 or n<25) ==");
let pool = [...all];
for (let round = 0; round < 8; round++) {
  const out = solveMount(pool, current, { solveGains: false, solveLevel: false });
  if (!out) break;
  console.log(`  n=${String(pool.length).padStart(3)} rms ${out.rmsDeg.toFixed(3)}°  panOff ${out.model.panOffsetDeg.toFixed(2)} tiltOff ${out.model.tiltOffsetDeg.toFixed(2)}`);
  if (out.rmsDeg < 0.5 || pool.length < 25) break;
  const withR = pool.map((s, i) => ({ s, r: out.residualsDeg[i] })).sort((a, b) => a.r - b.r);
  pool = withR.slice(0, Math.floor(withR.length * 0.8)).map((x) => x.s);
}

// Are outliers time-clustered (bad passes) or geometry-clustered (math bug)?
console.log("\n== worst 30 samples: time vs sky position ==");
const tag = samples.map((s) => { const r = resid(s, current); return { s, r: Math.hypot(r.ra, r.re) }; })
  .sort((a, b) => b.r - a.r).slice(0, 30);
const tmin = Math.min(...samples.map((s) => s.t));
for (const { s, r } of tag.slice(0, 12)) {
  console.log(`  +${((s.t - tmin) / 60000).toFixed(0).padStart(4)}min az ${s.azDeg.toFixed(0).padStart(4)} el ${s.elDeg.toFixed(0).padStart(3)}  resid ${r.toFixed(1)}°`);
}
const outlierT = tag.map((x) => x.s.t).sort((a, b) => a - b);
let clusters = 1;
for (let i = 1; i < outlierT.length; i++) if (outlierT[i] - outlierT[i - 1] > 10 * 60_000) clusters++;
console.log(`  -> ${clusters} time-cluster(s) of 30 worst (10min gap rule)`);
