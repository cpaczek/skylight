/**
 * Skylight telemetry Worker.
 *
 *   POST /ping      once a day from each Skylight server: { id, version, source, arch, model }
 *                   → { ok, latest, apiUrl, notice } (remote defaults, see settings)
 *   POST /view      from skylightceiling.com pages: { path, ref } — no cookies, no IP stored
 *   GET  /stats     counts and charts; Authorization: Bearer <STATS_KEY> or ?key=
 *   PUT  /settings  { key: "latest"|"apiUrl"|"notice", value } with the same key
 *   GET  /health
 *
 * Stored per install: random id, first/last seen, version, radio|api, CPU arch,
 * Pi model, country (from Cloudflare, never the IP). Nothing about location.
 */
export interface Env {
  DB: D1Database;
  STATS_KEY?: string;
  SITE_ORIGIN?: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SETTING_KEYS = new Set(["latest", "apiUrl", "notice"]);
const DEV_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

const str = (v: unknown, max: number): string | null =>
  typeof v === "string" && v.length > 0 ? v.slice(0, max) : null;
const day = (d = new Date()) => d.toISOString().slice(0, 10);

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

function cors(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowed = [env.SITE_ORIGIN ?? "https://skylightceiling.com", ...DEV_ORIGINS];
  return allowed.includes(origin)
    ? { "access-control-allow-origin": origin, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", vary: "origin" }
    : {};
}

async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text();
    if (text.length > 4096) return null;
    const v = JSON.parse(text);
    return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function authorized(req: Request, url: URL, env: Env): boolean {
  if (!env.STATS_KEY) return false;
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const key = bearer || url.searchParams.get("key");
  return !!key && key === env.STATS_KEY;
}

async function settings(env: Env): Promise<Record<string, string>> {
  const rows = await env.DB.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>();
  return Object.fromEntries((rows.results ?? []).map((r) => [r.key, r.value]));
}

async function handlePing(req: Request, env: Env): Promise<Response> {
  const body = await readJson(req);
  const id = body && str(body.id, 36);
  if (!id || !UUID.test(id)) return json({ ok: false, error: "bad id" }, 400);
  const now = new Date();
  const country = (req.cf as { country?: string } | undefined)?.country ?? null;
  await env.DB.batch([
    env.DB
      .prepare(
        `INSERT INTO installs (id, first_seen, last_seen, version, source, arch, model, country, pings)
         VALUES (?1, ?2, ?2, ?3, ?4, ?5, ?6, ?7, 1)
         ON CONFLICT(id) DO UPDATE SET last_seen = excluded.last_seen, version = excluded.version,
           source = excluded.source, arch = excluded.arch, model = excluded.model,
           country = excluded.country, pings = installs.pings + 1`,
      )
      .bind(id.toLowerCase(), now.toISOString(), str(body!.version, 40), str(body!.source, 10), str(body!.arch, 20), str(body!.model, 60), country),
    env.DB.prepare("INSERT OR IGNORE INTO daily (day, id) VALUES (?1, ?2)").bind(day(now), id.toLowerCase()),
  ]);
  const s = await settings(env);
  return json({ ok: true, latest: s.latest ?? null, apiUrl: s.apiUrl ?? null, notice: s.notice ?? null });
}

async function handleView(req: Request, env: Env): Promise<Response> {
  const headers = cors(req, env);
  const body = await readJson(req);
  const path = body && str(body.path, 200);
  if (!path || !path.startsWith("/")) return json({ ok: false }, 400, headers);
  let ref: string | null = null;
  const rawRef = body && str(body.ref, 300);
  if (rawRef) {
    try {
      const h = new URL(rawRef).hostname;
      ref = h && !h.endsWith("skylightceiling.com") ? h : null;
    } catch {
      ref = null;
    }
  }
  const ua = req.headers.get("user-agent") ?? "";
  const device = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop";
  const country = (req.cf as { country?: string } | undefined)?.country ?? null;
  const now = new Date();
  await env.DB.prepare("INSERT INTO views (ts, day, path, ref, country, device) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
    .bind(now.toISOString(), day(now), path.split("?")[0], ref, country, device)
    .run();
  return json({ ok: true }, 200, headers);
}

type Row = Record<string, string | number | null>;
async function rows(env: Env, sql: string, ...binds: unknown[]): Promise<Row[]> {
  const r = await env.DB.prepare(sql).bind(...binds).all<Row>();
  return r.results ?? [];
}
async function one(env: Env, sql: string): Promise<number> {
  const r = await env.DB.prepare(sql).first<{ n: number }>();
  return Number(r?.n ?? 0);
}

async function stats(env: Env) {
  const [installs, active1, active7, active30, newPerDay, activePerDay, bySource, byVersion, byCountry, byModel, views30, viewsToday, viewsPerDay, topPaths, topRefs, byDevice] =
    await Promise.all([
      one(env, "SELECT COUNT(*) n FROM installs"),
      one(env, "SELECT COUNT(DISTINCT id) n FROM daily WHERE day >= date('now','-1 day')"),
      one(env, "SELECT COUNT(DISTINCT id) n FROM daily WHERE day >= date('now','-7 days')"),
      one(env, "SELECT COUNT(DISTINCT id) n FROM daily WHERE day >= date('now','-30 days')"),
      rows(env, "SELECT substr(first_seen,1,10) d, COUNT(*) n FROM installs WHERE first_seen >= date('now','-30 days') GROUP BY d ORDER BY d"),
      rows(env, "SELECT day d, COUNT(*) n FROM daily WHERE day >= date('now','-30 days') GROUP BY day ORDER BY day"),
      rows(env, "SELECT COALESCE(source,'?') k, COUNT(*) n FROM installs GROUP BY k ORDER BY n DESC"),
      rows(env, "SELECT COALESCE(version,'?') k, COUNT(*) n FROM installs GROUP BY k ORDER BY n DESC LIMIT 10"),
      rows(env, "SELECT COALESCE(country,'?') k, COUNT(*) n FROM installs GROUP BY k ORDER BY n DESC LIMIT 15"),
      rows(env, "SELECT COALESCE(model,'?') k, COUNT(*) n FROM installs GROUP BY k ORDER BY n DESC LIMIT 10"),
      one(env, "SELECT COUNT(*) n FROM views WHERE day >= date('now','-30 days')"),
      one(env, "SELECT COUNT(*) n FROM views WHERE day = date('now')"),
      rows(env, "SELECT day d, COUNT(*) n FROM views WHERE day >= date('now','-30 days') GROUP BY day ORDER BY day"),
      rows(env, "SELECT path k, COUNT(*) n FROM views WHERE day >= date('now','-30 days') GROUP BY path ORDER BY n DESC LIMIT 15"),
      rows(env, "SELECT COALESCE(ref,'(direct)') k, COUNT(*) n FROM views WHERE day >= date('now','-30 days') GROUP BY ref ORDER BY n DESC LIMIT 10"),
      rows(env, "SELECT COALESCE(device,'?') k, COUNT(*) n FROM views WHERE day >= date('now','-30 days') GROUP BY device ORDER BY n DESC"),
    ]);
  return {
    generated_at: new Date().toISOString(),
    installs: { total: installs, active_1d: active1, active_7d: active7, active_30d: active30, new_per_day: newPerDay, active_per_day: activePerDay, by_source: bySource, by_version: byVersion, by_country: byCountry, by_model: byModel },
    site: { views_30d: views30, views_today: viewsToday, views_per_day: viewsPerDay, top_paths: topPaths, top_referrers: topRefs, by_device: byDevice },
  };
}

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}
function table(title: string, data: Row[], k = "k", n = "n") {
  const max = Math.max(1, ...data.map((r) => Number(r[n] ?? 0)));
  const body = data.length
    ? data.map((r) => `<tr><td>${esc(r[k])}</td><td class="n">${esc(r[n])}</td><td class="bar"><i style="width:${(Number(r[n]) / max) * 100}%"></i></td></tr>`).join("")
    : `<tr><td colspan="3" class="empty">nothing yet</td></tr>`;
  return `<section><h2>${esc(title)}</h2><table>${body}</table></section>`;
}
function html(s: Awaited<ReturnType<typeof stats>>) {
  const i = s.installs, w = s.site;
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Skylight stats</title>
<style>body{font:15px/1.5 system-ui,sans-serif;margin:0;padding:24px;background:#fafaf8;color:#17181c;max-width:980px;margin:auto}h1{font-size:1.5rem;margin:0 0 4px}h2{font-size:1rem;margin:0 0 8px;color:#5d6370}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:18px 0 28px}.tile{background:#fff;border:1px solid #e5e6e2;border-radius:12px;padding:14px 16px}.tile b{display:block;font-size:1.7rem}.tile span{color:#5d6370;font-size:.85rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}section{background:#fff;border:1px solid #e5e6e2;border-radius:12px;padding:14px 16px}table{width:100%;border-collapse:collapse;font-size:.9rem}td{padding:4px 6px;border-top:1px solid #f0f0ee}td.n{text-align:right;white-space:nowrap;color:#9a3412;font-weight:600}td.bar{width:40%}td.bar i{display:block;height:8px;background:#fde6d6;border-radius:4px;position:relative}td.bar i::after{content:"";position:absolute;inset:0;background:#c2410c;border-radius:4px;opacity:.7}td.empty{color:#9aa0ab;text-align:center}.meta{color:#9aa0ab;font-size:.8rem;margin-bottom:12px}</style>
<h1>Skylight</h1><div class="meta">anonymous usage ping + site views · generated ${esc(s.generated_at)} · <a href="?format=json&key=">json</a></div>
<div class="tiles"><div class="tile"><b>${i.total}</b><span>installs ever pinged</span></div><div class="tile"><b>${i.active_1d}</b><span>active today</span></div><div class="tile"><b>${i.active_7d}</b><span>active, 7 days</span></div><div class="tile"><b>${i.active_30d}</b><span>active, 30 days</span></div><div class="tile"><b>${w.views_today}</b><span>site views today</span></div><div class="tile"><b>${w.views_30d}</b><span>site views, 30 days</span></div></div>
<div class="grid">${table("New installs per day (30d)", i.new_per_day, "d")}${table("Active installs per day (30d)", i.active_per_day, "d")}${table("Radio vs internet feed", i.by_source)}${table("Versions", i.by_version)}${table("Countries", i.by_country)}${table("Pi models", i.by_model)}${table("Site views per day (30d)", w.views_per_day, "d")}${table("Top pages (30d)", w.top_paths)}${table("Referrers (30d)", w.top_referrers)}${table("Devices (30d)", w.by_device)}</div>`;
}

async function handleStats(req: Request, url: URL, env: Env): Promise<Response> {
  if (!authorized(req, url, env)) return json({ ok: false, error: "unauthorized" }, 401);
  const s = await stats(env);
  const wantsHtml = url.searchParams.get("format") !== "json" && (req.headers.get("accept") ?? "").includes("text/html");
  if (!wantsHtml) return json(s);
  // Keep the key out of the json link if it came in a header.
  const page = html(s).replace('href="?format=json&key="', `href="?format=json&key=${encodeURIComponent(url.searchParams.get("key") ?? "")}"`);
  return new Response(page, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

async function handleSettings(req: Request, url: URL, env: Env): Promise<Response> {
  if (!authorized(req, url, env)) return json({ ok: false, error: "unauthorized" }, 401);
  if (req.method === "GET") return json({ ok: true, settings: await settings(env) });
  const body = await readJson(req);
  const key = body && str(body.key, 20);
  if (!key || !SETTING_KEYS.has(key)) return json({ ok: false, error: "key must be latest, apiUrl or notice" }, 400);
  const value = body!.value;
  if (value === null || value === undefined || value === "") {
    await env.DB.prepare("DELETE FROM settings WHERE key = ?1").bind(key).run();
  } else {
    if (typeof value !== "string" || value.length > 500) return json({ ok: false, error: "value must be a short string" }, 400);
    if (key === "apiUrl" && !(value.startsWith("https://") && value.includes("{lat}"))) return json({ ok: false, error: "apiUrl must be https and contain {lat}" }, 400);
    await env.DB.prepare("INSERT INTO settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(key, value).run();
  }
  return json({ ok: true, settings: await settings(env) });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    try {
      if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req, env) });
      if (path === "/" || path === "/health") return json({ ok: true, service: "skylight telemetry" });
      if (path === "/ping" && req.method === "POST") return await handlePing(req, env);
      if (path === "/view" && req.method === "POST") return await handleView(req, env);
      if (path === "/stats" && req.method === "GET") return await handleStats(req, url, env);
      if (path === "/settings" && (req.method === "GET" || req.method === "PUT")) return await handleSettings(req, url, env);
      return json({ ok: false, error: "not found" }, 404);
    } catch (e) {
      console.error("telemetry error", e);
      return json({ ok: false, error: "server error" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
