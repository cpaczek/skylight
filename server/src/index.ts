// Entry point. Wires the config store, data poller, WebSocket hub, REST API,
// and (in production) serves the built web app. Binds 0.0.0.0 so the control
// panel is reachable from your phone on the LAN.

import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import express from "express";
import { DEFAULT_CONFIG, type Config, type DataSource } from "@shared/index.js";
import { ConfigStore, ConfigValidationError } from "./config-store.js";
import { RouteEnricher } from "./enrich/routes.js";
import { Poller } from "./datasource.js";
import { Hub } from "./hub.js";
import { TleStore } from "./tle.js";
import { resolveLocation } from "./geocode.js";
import { buildHostMatcher, originHostname } from "./allowed-hosts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../data");
const WEB_DIST = resolve(__dirname, "../../web/dist");

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const SOURCE = (process.env.DATA_SOURCE as DataSource) ?? "radio";
const RADIO_URL =
  process.env.AIRCRAFT_JSON_URL ?? "http://localhost:8080/data/aircraft.json";
const API_URL =
  process.env.API_URL ?? "https://api.airplanes.live/v2/point/{lat}/{lon}/{r}";
const POLL_MS = Number(process.env.POLL_MS ?? 1000);
const ROUTE_CACHE_HOURS = Number(process.env.ROUTE_CACHE_HOURS ?? 12);
// When on radio, also poll the API and merge (keeps landing aircraft alive).
const SUPPLEMENT_API = (process.env.SUPPLEMENT_API ?? "1") !== "0";
const API_POLL_MS = Number(process.env.API_POLL_MS ?? 4000);
// Nominatim asks for a descriptive User-Agent identifying the application.
const GEOCODE_UA =
  process.env.GEOCODE_USER_AGENT ??
  "skylight/0.1 (https://github.com/cpaczek/skylight)";
const CONFIG_PATH = resolve(DATA_DIR, "config.json");
const SERVER_DEFAULT_CONFIG: Config = { ...DEFAULT_CONFIG, radioUrl: RADIO_URL };

function hasPersistedRadioUrl(path: string): boolean {
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<Config>;
    return typeof raw.radioUrl === "string";
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const configHasRadioUrl = hasPersistedRadioUrl(CONFIG_PATH);
  const store = new ConfigStore(CONFIG_PATH, SERVER_DEFAULT_CONFIG);
  await store.load();
  if (!configHasRadioUrl && store.get().radioUrl !== RADIO_URL) {
    store.patch({ radioUrl: RADIO_URL });
  }

  const enricher = new RouteEnricher(
    resolve(DATA_DIR, "route-cache.json"),
    ROUTE_CACHE_HOURS,
  );
  await enricher.load();

  const tleStore = new TleStore(resolve(DATA_DIR, "tle-cache.json"));
  await tleStore.load();

  const app = express();

  // DNS-rebinding gate. Untrusted browsers can resolve attacker.com to the
  // user's loopback / LAN IP and reach this server with the attacker's Host
  // header still attached; the CORS check is bypassed because the browser
  // treats the response as same-origin with attacker.com. We reject any
  // request whose Host header is not in the operator's allowlist before any
  // body parsing or routing runs.
  const hostMatcher = buildHostMatcher(process.env);
  app.use((req, res, next) => {
    const host = req.headers.host;
    if (!hostMatcher.test(host)) {
      res
        .status(403)
        .type("text/plain")
        .send(
          "Forbidden: Host header not in allowlist. " +
            "Set ALLOWED_HOSTS to include your hostname.\n",
        );
      return;
    }
    next();
  });

  app.use(express.json());

  const server = createServer(app);
  const hub = new Hub(server, {
    store,
    getSnapshot: () => poller.getSnapshot(),
    getStatus: () => poller.getStatus(),
    isOriginAllowed: (origin) => {
      // No Origin header: not a browser (curl/scripts). Allow — the WS
      // hijack risk is browser-only.
      if (!origin) return true;
      const host = originHostname(origin);
      return host !== null && hostMatcher.test(host);
    },
  });

  const poller = new Poller({
    source: SOURCE,
    apiUrlTemplate: API_URL,
    pollMs: POLL_MS,
    supplementApi: SUPPLEMENT_API,
    apiPollMs: API_POLL_MS,
    getConfig: () => store.get(),
    enricher,
    onSnapshot: (now, aircraft) => hub.broadcastAircraft(now, aircraft),
    onStatus: (status) => hub.broadcastStatus(status),
  });

  // --- REST API (handy for debugging + non-WS clients) ---
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.get("/api/config", (_req, res) => res.json(store.get()));
  app.post("/api/config", (req, res) => {
    try {
      res.json(store.patch(req.body));
    } catch (err) {
      if (err instanceof ConfigValidationError) {
        return res.status(400).json({ error: err.message });
      }
      throw err;
    }
  });
  app.post("/api/config/reset", (_req, res) => res.json(store.reset()));
  app.get("/api/aircraft", (_req, res) => res.json(poller.getSnapshot()));
  app.get("/api/status", (_req, res) => res.json(poller.getStatus()));
app.post("/api/import-airport", async (req, res) => {
  const code = String(req.body?.code ?? "").trim().toUpperCase();

  if (!/^[A-Z0-9]{3,5}$/.test(code)) {
    return res.status(400).json({ error: "Airport code must look like KSNA, KCNO, KFUL, etc." });
  }

  try {
    const { execFileSync } = await import("node:child_process");

    execFileSync("node", ["tools/import-airport.cjs", code], {
      cwd: resolve(__dirname, "../.."),
      stdio: "inherit",
    });

    execFileSync("pnpm", ["build"], {
      cwd: resolve(__dirname, "../.."),
      stdio: "inherit",
    });

    res.json({
      ok: true,
      code,
      message: `Imported ${code}. Restarting Skylight server now. Refresh the display after a few seconds.`,
    });

    setTimeout(() => {
      try {
        execFileSync("sudo", ["-n", "systemctl", "restart", "skylight-server"], {
          stdio: "ignore",
        });
      } catch {
        // server may die during restart; ignore here
      }
    }, 1000);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

  app.get("/api/tle", async (_req, res) => res.json(await tleStore.get()));
  app.post("/api/source", (req, res) => {
    const s = req.body?.source;
    if (s !== "radio" && s !== "api") {
      return res.status(400).json({ error: "source must be 'radio' or 'api'" });
    }
    poller.setSource(s);
    res.json(poller.getStatus());
  });
  // Resolve a place name / "lat,lon" / airport code to coordinates for the
  // control panel's location editor. Never invents a fallback: a miss is a 404,
  // so the caller never silently relocates to 0,0.
  app.get("/api/geocode", async (req, res) => {
    const q = String(req.query.q ?? "").trim();
    if (!q) return res.status(400).json({ error: "missing query parameter q" });
    try {
      const hit = await resolveLocation(q, { userAgent: GEOCODE_UA });
      if (!hit) return res.status(404).json({ error: `no match for "${q}"` });
      res.json(hit);
    } catch {
      res.status(502).json({ error: "geocoding service unavailable" });
    }
  });

  // --- static web (production build) ---
  if (existsSync(WEB_DIST)) {
    app.use(express.static(WEB_DIST));
    app.get("/control", (_req, res) => res.sendFile(resolve(WEB_DIST, "control.html")));
    app.get("/", (_req, res) => res.sendFile(resolve(WEB_DIST, "index.html")));
  } else {
    app.get("/", (_req, res) =>
      res
        .type("text/plain")
        .send("Web build not found. Run `npm run build`, or use the Vite dev server."),
    );
  }

app.get("/api/reload-version", async (_req, res) => {
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");

    const reloadPath = path.resolve(
      process.cwd(),
      "data/reload.json"
    );

    console.log("Reload endpoint reading:", reloadPath);

    if (!fs.existsSync(reloadPath)) {
      return res.json({
        error: "file not found",
        path: reloadPath,
      });
    }

    const data = JSON.parse(
      fs.readFileSync(reloadPath, "utf8")
    );

    res.json(data);
  } catch (err) {
    res.json({
      error: String(err),
    });
  }
});

  poller.start();

  server.listen(PORT, HOST, () => {
    console.log(`[server] listening on http://${HOST}:${PORT}`);
    console.log(`[server] data source: ${SOURCE} (${SOURCE === "radio" ? RADIO_URL : API_URL})`);
    console.log(`[server] control panel: http://<this-host>:${PORT}/control`);
    console.log(`[server] host allowlist: ${hostMatcher.describe()}`);
  });
}

main().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
