// Sky-event awareness: the "look up tonight" layer. Skylight already computes
// where everything in the sky is (see celestial.ts); this computes *when* the sky
// is about to do something worth looking up for, reusing the same astronomy-engine
// and the same "find the next occurrence, offer a jump" pattern as nextISSPass.
//
// Everything is local to the configured lat/lon. Events are returned sorted by
// time, each flagged `visible` when the relevant body or radiant is above the
// horizon at the moment it happens, so the UI can gate its nudges.

import * as AstronomyNS from "astronomy-engine";

// astronomy-engine ships a UMD/CJS bundle; under some Node versions the ESM
// namespace only exposes `default` (same unwrap celestial.ts does).
const Astronomy: typeof AstronomyNS =
  (AstronomyNS as unknown as { default?: typeof AstronomyNS }).default ?? AstronomyNS;

const DAY = 86_400_000;

export type SkyEventKind = "moon-phase" | "eclipse" | "meteor-shower" | "elongation" | "season";

export interface SkyEvent {
  kind: SkyEventKind;
  /** Short human label, e.g. "Full moon", "Total lunar eclipse", "Perseids peak". */
  label: string;
  /** When it peaks / occurs (epoch ms, UTC). */
  timeMs: number;
  /** Altitude in degrees of the relevant body or radiant at `timeMs`, when meaningful. */
  altDeg?: number;
  /** Locally worth looking up: the thing is above the horizon when it happens. */
  visible: boolean;
  /** One short extra line, e.g. "98% lit", "moon 34° up", "radiant 52° up". */
  detail?: string;
}

const msOf = (t: AstronomyNS.AstroTime): number => t.date.getTime();
const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function bodyAlt(body: AstronomyNS.Body, date: Date, observer: AstronomyNS.Observer): number {
  const eq = Astronomy.Equator(body, date, observer, true, true);
  return Astronomy.Horizon(date, observer, eq.ra, eq.dec, "normal").altitude;
}

// --- moon phases ------------------------------------------------------------
function moonPhaseEvents(fromMs: number, horizonMs: number, observer: AstronomyNS.Observer): SkyEvent[] {
  const out: SkyEvent[] = [];
  const limitDays = horizonMs / DAY;
  for (const [target, label, visible] of [[180, "Full moon", true], [0, "New moon", false]] as const) {
    const t = Astronomy.SearchMoonPhase(target, new Date(fromMs), limitDays);
    if (!t) continue;
    const alt = bodyAlt(Astronomy.Body.Moon, t.date, observer);
    const lit = Math.round(Astronomy.Illumination(Astronomy.Body.Moon, t.date).phase_fraction * 100);
    out.push({ kind: "moon-phase", label, timeMs: msOf(t), altDeg: alt, visible, detail: `${lit}% lit` });
  }
  return out;
}

// --- eclipses ---------------------------------------------------------------
function eclipseEvents(fromMs: number, horizonMs: number, observer: AstronomyNS.Observer): SkyEvent[] {
  const out: SkyEvent[] = [];
  const end = fromMs + horizonMs;

  let le = Astronomy.SearchLunarEclipse(new Date(fromMs));
  for (let i = 0; i < 24 && msOf(le.peak) < end; i++) {
    const alt = bodyAlt(Astronomy.Body.Moon, le.peak.date, observer);
    out.push({
      kind: "eclipse",
      label: `${cap(le.kind)} lunar eclipse`,
      timeMs: msOf(le.peak),
      altDeg: alt,
      visible: alt > 0,
      detail: alt > 0 ? `moon ${Math.round(alt)}° up` : "moon below the horizon here",
    });
    le = Astronomy.NextLunarEclipse(le.peak);
  }

  // SearchLocalSolarEclipse only returns eclipses actually visible at this spot.
  let se = Astronomy.SearchLocalSolarEclipse(new Date(fromMs), observer);
  for (let i = 0; i < 24 && se.peak.time.date.getTime() < end; i++) {
    const alt = se.peak.altitude;
    out.push({
      kind: "eclipse",
      label: `${cap(se.kind)} solar eclipse`,
      timeMs: se.peak.time.date.getTime(),
      altDeg: alt,
      visible: alt > 0,
      detail: `${Math.round(se.obscuration * 100)}% of the sun covered`,
    });
    se = Astronomy.NextLocalSolarEclipse(se.peak.time, observer);
  }
  return out;
}

// --- equinoxes & solstices --------------------------------------------------
function seasonEvents(fromMs: number, horizonMs: number): SkyEvent[] {
  const out: SkyEvent[] = [];
  const end = fromMs + horizonMs;
  const startYear = new Date(fromMs).getUTCFullYear();
  const endYear = new Date(end).getUTCFullYear();
  for (let y = startYear; y <= endYear; y++) {
    const s = Astronomy.Seasons(y);
    const marks: [AstronomyNS.AstroTime, string][] = [
      [s.mar_equinox, "March equinox"],
      [s.jun_solstice, "June solstice"],
      [s.sep_equinox, "September equinox"],
      [s.dec_solstice, "December solstice"],
    ];
    for (const [t, label] of marks) {
      const m = msOf(t);
      if (m >= fromMs && m < end) out.push({ kind: "season", label, timeMs: m, visible: true });
    }
  }
  return out;
}

// --- greatest elongations (Mercury / Venus at their best) -------------------
// A greatest elongation is the best apparition of an inner planet for its cycle:
// you catch it low in twilight (evening or morning), so it is always worth a look.
// No altitude is reported, because the planet's altitude at the exact geometric
// elongation instant says nothing about when you actually go out to see it.
function elongationEvents(fromMs: number, horizonMs: number): SkyEvent[] {
  const out: SkyEvent[] = [];
  const end = fromMs + horizonMs;
  for (const [body, name] of [[Astronomy.Body.Mercury, "Mercury"], [Astronomy.Body.Venus, "Venus"]] as const) {
    let searchFrom = fromMs;
    for (let i = 0; i < 8; i++) {
      const e = Astronomy.SearchMaxElongation(body, new Date(searchFrom));
      const m = msOf(e.time);
      if (m >= end) break;
      out.push({
        kind: "elongation",
        label: `${name} greatest elongation`,
        timeMs: m,
        visible: true,
        detail: `${Math.round(e.elongation)}° from the sun, ${e.visibility} sky`,
      });
      searchFrom = m + 10 * DAY; // step past this one to find the next
    }
  }
  return out;
}

// --- meteor showers ---------------------------------------------------------
// astronomy-engine has no shower model, so the major naked-eye showers are a small
// table of radiant positions and peak dates. Each is gated by the radiant's
// altitude at local solar midnight on the peak night, so it only counts as visible
// when the radiant is actually up for this latitude.
interface Shower {
  name: string;
  month: number; // 1-12
  day: number; // day of peak
  raHours: number; // radiant right ascension, hours
  decDeg: number; // radiant declination, degrees
}
const SHOWERS: Shower[] = [
  { name: "Quadrantids", month: 1, day: 3, raHours: 15.3, decDeg: 49 },
  { name: "Lyrids", month: 4, day: 22, raHours: 18.1, decDeg: 34 },
  { name: "Eta Aquariids", month: 5, day: 6, raHours: 22.5, decDeg: -1 },
  { name: "Perseids", month: 8, day: 12, raHours: 3.1, decDeg: 58 },
  { name: "Orionids", month: 10, day: 21, raHours: 6.3, decDeg: 16 },
  { name: "Leonids", month: 11, day: 17, raHours: 10.3, decDeg: 22 },
  { name: "Geminids", month: 12, day: 14, raHours: 7.5, decDeg: 33 },
  { name: "Ursids", month: 12, day: 22, raHours: 14.5, decDeg: 76 },
];

function meteorEvents(fromMs: number, horizonMs: number, lonDeg: number, observer: AstronomyNS.Observer): SkyEvent[] {
  const out: SkyEvent[] = [];
  const end = fromMs + horizonMs;
  const lonOffsetMs = (lonDeg / 15) * 3600_000; // local solar time offset from UTC
  const startYear = new Date(fromMs).getUTCFullYear();
  for (const s of SHOWERS) {
    for (let y = startYear; y <= startYear + 2; y++) {
      // ~01:00 local solar time on the peak night is a representative dark-sky moment.
      const peakMs = Date.UTC(y, s.month - 1, s.day, 1, 0, 0) - lonOffsetMs;
      if (peakMs < fromMs || peakMs >= end) continue;
      const alt = Astronomy.Horizon(new Date(peakMs), observer, s.raHours, s.decDeg, "normal").altitude;
      out.push({
        kind: "meteor-shower",
        label: `${s.name} peak`,
        timeMs: peakMs,
        altDeg: alt,
        visible: alt > 15, // radiant meaningfully above the horizon
        detail: alt > 15 ? `radiant ${Math.round(alt)}° up` : "radiant too low here",
      });
      break; // one upcoming peak per shower is enough
    }
  }
  return out;
}

export interface SkyEventOpts {
  moonPhases?: boolean;
  eclipses?: boolean;
  meteorShowers?: boolean;
  elongations?: boolean;
  seasons?: boolean;
}
const ALL: Required<SkyEventOpts> = { moonPhases: true, eclipses: true, meteorShowers: true, elongations: true, seasons: true };

/**
 * Upcoming local sky events, sorted by time. `horizonDays` bounds how far ahead
 * to look (showers can be up to a year out, so the default is generous).
 */
export function nextSkyEvents(
  fromMs: number,
  latDeg: number,
  lonDeg: number,
  horizonDays = 400,
  opts: SkyEventOpts = ALL,
): SkyEvent[] {
  const o = { ...ALL, ...opts };
  const observer = new Astronomy.Observer(latDeg, lonDeg, 0);
  const horizonMs = horizonDays * DAY;
  const events: SkyEvent[] = [];
  if (o.moonPhases) events.push(...moonPhaseEvents(fromMs, horizonMs, observer));
  if (o.eclipses) events.push(...eclipseEvents(fromMs, horizonMs, observer));
  if (o.seasons) events.push(...seasonEvents(fromMs, horizonMs));
  if (o.elongations) events.push(...elongationEvents(fromMs, horizonMs));
  if (o.meteorShowers) events.push(...meteorEvents(fromMs, horizonMs, lonDeg, observer));
  return events
    .filter((e) => e.timeMs >= fromMs && e.timeMs < fromMs + horizonMs)
    .sort((a, b) => a.timeMs - b.timeMs);
}

/**
 * The soonest visible event within `withinDays` (default 30), for the control
 * panel's "look up" nudge. Null when nothing visible is coming up soon.
 */
export function nextSkyEvent(fromMs: number, latDeg: number, lonDeg: number, withinDays = 30, opts?: SkyEventOpts): SkyEvent | null {
  const soon = nextSkyEvents(fromMs, latDeg, lonDeg, withinDays, opts).filter((e) => e.visible);
  return soon.length ? soon[0] : null;
}
