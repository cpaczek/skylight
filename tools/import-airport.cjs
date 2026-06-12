#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const airportCode = process.argv[2]?.toUpperCase();

if (!airportCode) {
  console.error("Usage: node tools/import-airport.cjs KCNO");
  process.exit(1);
}

const root = path.resolve(__dirname, "..");
const airportsPath = path.join(root, "web/src/display/airports.ts");
const configPath = path.join(root, "server/data/config.json");
const reloadPath = path.join(root, "server/data/reload.json");
const blockScript = path.join(root, "tools/airport-block.cjs");

const output = execSync(`node "${blockScript}" ${airportCode}`, {
  encoding: "utf8",
});

const fullMatch = output.match(
  /export const\s+([A-Z0-9_]+):\s*Airport\s*=\s*{[\s\S]*?};\s*\n\s*export const AIRPORTS:\s*Airport\[\]\s*=\s*\[[A-Z0-9_,\s]+\];/
);

if (!fullMatch) {
  console.error("Could not find generated airport block in script output.");
  console.error(output);
  process.exit(1);
}

const newConstName = fullMatch[1];

const airportOnlyMatch = fullMatch[0].match(
  /export const\s+[A-Z0-9_]+:\s*Airport\s*=\s*{[\s\S]*?};/
);

if (!airportOnlyMatch) {
  console.error("Could not isolate generated airport block.");
  process.exit(1);
}

const newAirportBlock = airportOnlyMatch[0];

const oldFile = fs.readFileSync(airportsPath, "utf8");
//const backupPath = `${airportsPath}.backup-${Date.now()}`;
//fs.writeFileSync(backupPath, oldFile);

const airportBlockRegex = new RegExp(
  `export const\\s+${newConstName}:\\s*Airport\\s*=\\s*{[\\s\\S]*?};`,
  "m"
);

let updatedFile = oldFile;

if (airportBlockRegex.test(updatedFile)) {
  updatedFile = updatedFile.replace(airportBlockRegex, newAirportBlock);
  console.log(`Updated existing airport block: ${newConstName}`);
} else {
  const airportsListRegex = /export const AIRPORTS:\s*Airport\[\]\s*=\s*\[[\s\S]*?\];/m;

  if (!airportsListRegex.test(updatedFile)) {
    console.error("Could not find AIRPORTS list.");
   // console.error(`Backup saved at: ${backupPath}`);
    process.exit(1);
  }

  updatedFile = updatedFile.replace(airportsListRegex, `${newAirportBlock}\n\n$&`);
  console.log(`Added new airport block: ${newConstName}`);
}

const airportsListRegex = /export const AIRPORTS:\s*Airport\[\]\s*=\s*\[([\s\S]*?)\];/m;
const listMatch = updatedFile.match(airportsListRegex);

if (!listMatch) {
  console.error("Could not find AIRPORTS list after update.");
 // console.error(`Backup saved at: ${backupPath}`);
  process.exit(1);
}

const existingNames = listMatch[1]
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

if (!existingNames.includes(newConstName)) {
  existingNames.push(newConstName);
}

const newList = `export const AIRPORTS: Airport[] = [${existingNames.join(", ")}];`;
updatedFile = updatedFile.replace(airportsListRegex, newList);

fs.writeFileSync(airportsPath, updatedFile);

const centerMatch = output.match(/"centerLat":\s*([-0-9.]+),\s*\n"centerLon":\s*([-0-9.]+),/);

if (centerMatch && fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.centerLat = Number(centerMatch[1]);
  config.centerLon = Number(centerMatch[2]);
  config.locationName = airportCode;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
  console.log(`Updated config center to ${config.centerLat}, ${config.centerLon}`);
}

if (fs.existsSync(reloadPath)) {
  const reloadData = {
    reloadVersion: Date.now(),
  };

  fs.writeFileSync(
    reloadPath,
    JSON.stringify(reloadData, null, 2) + "\n"
  );

  console.log("Display reload requested.");
}

console.log(`Imported airport ${airportCode} as ${newConstName}`);
console.log(`Updated: ${airportsPath}`);
//console.log(`Backup: ${backupPath}`);
