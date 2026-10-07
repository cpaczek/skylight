# Skylight telemetry (Cloudflare Worker)

Receives a once-a-day anonymous ping from every Skylight server and page views
from skylightceiling.com, stores them in D1, and serves a stats page.

What a ping contains: a random install id (generated on the Pi), the Skylight
version, `radio` or `api`, CPU architecture, Pi model, and the country Cloudflare
derives from the connection. No coordinates, no IP is stored, no cookies.
Turn it off on the Pi from the phone page (System → Anonymous usage ping) or
with `SKYLIGHT_TELEMETRY=0` in the service environment.

```
npx wrangler d1 execute skylight-telemetry --remote --file schema.sql   # once
npx wrangler secret put STATS_KEY                                       # once
npx wrangler deploy
```

- `GET /stats?key=…` — HTML dashboard (or `&format=json`).
- `PUT /settings` `{ "key": "apiUrl", "value": "https://…/{lat}/{lon}/{r}" }` — a
  Skylight that still uses the shipped aggregator URL adopts this one on its
  next ping (the remote fix for "the free feed closed"). Keys: `latest`,
  `apiUrl`, `notice`.
