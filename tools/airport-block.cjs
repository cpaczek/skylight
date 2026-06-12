#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

const QUERY = (process.argv[2] || "").toUpperCase();

if (!QUERY) {
  console.error("Usage: node tools/airport-block.cjs KCNO");
  process.exit(1);
}

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "tools", "ourairports-cache");

const AIRPORTS_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const RUNWAYS_URL = "https://davidmegginson.github.io/ourairports-data/runways.csv";

function download(url, file) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(file)) return resolve();

    console.log(`Downloading ${url}`);
    const out = fs.createWriteStream(file);

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Download failed: ${res.statusCode}`));
          return;
        }

        res.pipe(out);
        out.on("finish", () => out.close(resolve));
      })
      .on("error", reject);
  });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];

    if (quoted) {
      if (c === '"' && n === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        cell += c;
      }
    } else {
      if (c === '"') quoted = true;
      else if (c === ",") {
        row.push(cell);
        cell = "";
      } else if (c === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else if (c !== "\r") {
        cell += c;
      }
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows.shift();
  return rows.map((r) =>
    Object.fromEntries(headers.map((h, i) => [h, r[i] || ""]))
  );
}

function num(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function safeConstName(ident) {
  return ident.replace(/[^A-Z0-9_]/g, "_");
}

(async () => {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const airportsFile = path.join(DATA_DIR, "airports.csv");
  const runwaysFile = path.join(DATA_DIR, "runways.csv");

  await download(AIRPORTS_URL, airportsFile);
  await download(RUNWAYS_URL, runwaysFile);

  const airports = parseCsv(fs.readFileSync(airportsFile, "utf8"));
  const runways = parseCsv(fs.readFileSync(runwaysFile, "utf8"));

  const airport =
    airports.find((a) => a.ident.toUpperCase() === QUERY) ||
    airports.find((a) => a.gps_code.toUpperCase() === QUERY) ||
    airports.find((a) => a.local_code.toUpperCase() === QUERY) ||
    airports.find((a) => a.iata_code.toUpperCase() === QUERY) ||
    airports.find((a) => a.name.toUpperCase().includes(QUERY));

  if (!airport) {
    console.error(`Airport not found: ${QUERY}`);
    process.exit(1);
  }

  const airportRunways = runways
    .filter((r) => r.airport_ident === airport.ident && r.closed !== "1")
    .map((r) => ({
      leIdent: r.le_ident,
      heIdent: r.he_ident,
      leLat: num(r.le_latitude_deg),
      leLon: num(r.le_longitude_deg),
      heLat: num(r.he_latitude_deg),
      heLon: num(r.he_longitude_deg),
      widthFt: num(r.width_ft) || 150,
    }))
    .filter((r) =>
      r.leIdent &&
      r.heIdent &&
      r.leLat !== null &&
      r.leLon !== null &&
      r.heLat !== null &&
      r.heLon !== null
    );

  if (!airportRunways.length) {
    console.error(`No usable runway data found for ${airport.ident}`);
    process.exit(1);
  }

  const ident = airport.ident;
  const constName = safeConstName(ident);
  const airportName = airport.name || ident;
  const centerLat = num(airport.latitude_deg);
  const centerLon = num(airport.longitude_deg);

  console.log("");
  console.log("/* ---------- COPY BELOW INTO airports.ts ---------- */");
  console.log("");
  console.log(`export const ${constName}: Airport = {`);
  console.log(`  icao: "${ident}",`);
  console.log(`  name: "${airportName}",`);
  console.log(`  runways: [`);

  for (const r of airportRunways) {
    console.log(
      `    { leIdent: "${r.leIdent}", heIdent: "${r.heIdent}", le: [${r.leLat}, ${r.leLon}], he: [${r.heLat}, ${r.heLon}], widthFt: ${r.widthFt} },`
    );
  }

  console.log(`  ],`);
  console.log(`};`);
  console.log("");
  console.log(`export const AIRPORTS: Airport[] = [${constName}];`);
  console.log("");
  console.log("/* ---------- CONFIG.JSON CENTER ---------- */");
  console.log(`"centerLat": ${centerLat},`);
  console.log(`"centerLon": ${centerLon},`);
  console.log("");
})();
