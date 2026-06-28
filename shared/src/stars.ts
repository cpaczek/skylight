// Bright-star catalog (J2000). RA in degrees, Dec in degrees, plus visual
// magnitude. Precession over a couple decades is well under a degree — fine for
// an ambient sky. Includes a few iconic asterisms for instant recognizability.

export interface Star {
  id: string;
  name: string;
  ra: number; // degrees
  dec: number; // degrees
  mag: number;
}

export interface Constellation {
  id: string;
  name: string;
  segments: [string, string][];
}

export const STARS: Star[] = [
  { id: "sirius", name: "Sirius", ra: 101.288, dec: -16.716, mag: -1.46 },
  { id: "canopus", name: "Canopus", ra: 95.988, dec: -52.696, mag: -0.74 },
  { id: "rigil", name: "Rigil Kent.", ra: 219.9, dec: -60.835, mag: -0.27 },
  { id: "arcturus", name: "Arcturus", ra: 213.915, dec: 19.182, mag: -0.05 },
  { id: "vega", name: "Vega", ra: 279.234, dec: 38.784, mag: 0.03 },
  { id: "capella", name: "Capella", ra: 79.173, dec: 45.998, mag: 0.08 },
  { id: "rigel", name: "Rigel", ra: 78.6345, dec: -8.2016, mag: 0.13 },
  { id: "procyon", name: "Procyon", ra: 114.825, dec: 5.225, mag: 0.34 },
  { id: "betelgeuse", name: "Betelgeuse", ra: 88.7925, dec: 7.407, mag: 0.42 },
  { id: "achernar", name: "Achernar", ra: 24.429, dec: -57.237, mag: 0.46 },
  { id: "hadar", name: "Hadar", ra: 210.9555, dec: -60.373, mag: 0.61 },
  { id: "altair", name: "Altair", ra: 297.696, dec: 8.868, mag: 0.77 },
  { id: "aldebaran", name: "Aldebaran", ra: 68.9805, dec: 16.509, mag: 0.85 },
  { id: "spica", name: "Spica", ra: 201.2985, dec: -11.161, mag: 1.04 },
  { id: "antares", name: "Antares", ra: 247.3515, dec: -26.432, mag: 1.09 },
  { id: "pollux", name: "Pollux", ra: 116.3295, dec: 28.026, mag: 1.14 },
  { id: "fomalhaut", name: "Fomalhaut", ra: 344.412, dec: -29.622, mag: 1.16 },
  { id: "deneb", name: "Deneb", ra: 310.3575, dec: 45.28, mag: 1.25 },
  { id: "regulus", name: "Regulus", ra: 152.0925, dec: 11.967, mag: 1.35 },
  { id: "adhara", name: "Adhara", ra: 104.655, dec: -28.972, mag: 1.5 },
  { id: "castor", name: "Castor", ra: 113.6505, dec: 31.888, mag: 1.57 },
  { id: "shaula", name: "Shaula", ra: 263.4015, dec: -37.104, mag: 1.62 },
  { id: "bellatrix", name: "Bellatrix", ra: 81.282, dec: 6.35, mag: 1.64 },
  { id: "elnath", name: "Elnath", ra: 81.573, dec: 28.608, mag: 1.65 },
  { id: "alnilam", name: "Alnilam", ra: 84.054, dec: -1.202, mag: 1.69 },
  { id: "alnitak", name: "Alnitak", ra: 85.1895, dec: -1.943, mag: 1.74 },
  { id: "alioth", name: "Alioth", ra: 193.506, dec: 55.96, mag: 1.77 },
  { id: "dubhe", name: "Dubhe", ra: 165.9315, dec: 61.751, mag: 1.79 },
  { id: "mirfak", name: "Mirfak", ra: 51.0808, dec: 49.861, mag: 1.79 },
  { id: "alkaid", name: "Alkaid", ra: 206.8845, dec: 49.313, mag: 1.86 },
  { id: "polaris", name: "Polaris", ra: 37.9545, dec: 89.264, mag: 1.98 },
  { id: "mizar", name: "Mizar", ra: 200.9805, dec: 54.925, mag: 2.04 },
  { id: "saiph", name: "Saiph", ra: 86.937, dec: -9.6696, mag: 2.06 },
  { id: "mintaka", name: "Mintaka", ra: 83.0016, dec: -0.299, mag: 2.23 },
  { id: "merak", name: "Merak", ra: 165.4605, dec: 56.382, mag: 2.37 },
  { id: "phecda", name: "Phecda", ra: 178.458, dec: 53.695, mag: 2.44 },
  { id: "megrez", name: "Megrez", ra: 183.8565, dec: 57.033, mag: 3.31 },
  { id: "schedar", name: "Schedar", ra: 10.1268, dec: 56.537, mag: 2.24 },
  { id: "caph", name: "Caph", ra: 2.2945, dec: 59.15, mag: 2.28 },
  { id: "navi", name: "Gamma Cas", ra: 14.1772, dec: 60.717, mag: 2.47 },
  { id: "ruchbah", name: "Ruchbah", ra: 21.454, dec: 60.235, mag: 2.68 },
  { id: "segin", name: "Segin", ra: 28.5988, dec: 63.67, mag: 3.35 },
];

const byId = new Map(STARS.map((s) => [s.id, s]));
export const star = (id: string): Star | undefined => byId.get(id);

/** Asterism line segments grouped by constellation, using star ids. */
export const CONSTELLATIONS: Constellation[] = [
  {
    id: "orion",
    name: "Orion",
    segments: [
      // Shoulders, two diagonals down to the belt, the belt itself, two
      // diagonals down to the feet, and the feet, forming the classic hourglass.
      ["betelgeuse", "bellatrix"], ["betelgeuse", "alnitak"], ["bellatrix", "mintaka"],
      ["alnitak", "alnilam"], ["alnilam", "mintaka"],
      ["alnitak", "saiph"], ["mintaka", "rigel"], ["saiph", "rigel"],
    ],
  },
  {
    id: "ursa_major",
    name: "Big Dipper",
    segments: [
      ["dubhe", "merak"], ["merak", "phecda"], ["phecda", "megrez"],
      ["megrez", "dubhe"], ["megrez", "alioth"], ["alioth", "mizar"],
      ["mizar", "alkaid"],
    ],
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    segments: [
      ["segin", "ruchbah"], ["ruchbah", "navi"], ["navi", "schedar"],
      ["schedar", "caph"],
    ],
  },
  {
    id: "summer_triangle",
    name: "Summer Triangle",
    segments: [["vega", "deneb"], ["deneb", "altair"], ["altair", "vega"]],
  },
  {
    id: "winter_triangle",
    name: "Winter Triangle",
    segments: [["betelgeuse", "sirius"], ["sirius", "procyon"], ["procyon", "betelgeuse"]],
  },
];

/** True if a constellation's lines should draw. Unknown/missing ids default visible. */
export function constellationVisible(constellations: Record<string, boolean>, id: string): boolean {
  return constellations[id] !== false;
}

/** Flattened asterism segments for the currently-visible constellations. */
export function visibleAsterisms(constellations: Record<string, boolean>): [string, string][] {
  return CONSTELLATIONS.filter((c) => constellationVisible(constellations, c.id))
    .flatMap((c) => c.segments);
}

/** Asterism line segments, by star id, drawn faintly when both ends are up. */
export const ASTERISMS: [string, string][] = CONSTELLATIONS.flatMap((c) => c.segments);
