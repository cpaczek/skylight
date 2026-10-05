# Skylight server + display, for a projector driven by a server (issue #11).
#
# This image runs the Node server (which also serves the built web UI). It does
# NOT include the optional sky-camera tracker (sharp / onnxruntime) - that path
# wants direct camera + GPU access and is out of scope for a container.
#
# No radio in the container: point it at an existing dump1090/readsb feed with
# AIRCRAFT_JSON_URL (now runtime-tunable from the control panel too), or run with
# DATA_SOURCE=api to use a free aggregator feed (adsb.fi by default, API_URL to
# change it) with no hardware at all.

FROM node:22-bookworm-slim

# pnpm via corepack (version pinned by package.json "packageManager").
RUN corepack enable
WORKDIR /app

# Install only the deps the server + web actually need (skips the tracker
# workspace and its native deps). Manifests first so this layer caches on the
# lockfile, not on source edits.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY shared/package.json shared/package.json
COPY server/package.json server/package.json
COPY web/package.json web/package.json
RUN pnpm install --frozen-lockfile --filter server --filter web --filter shared

# Source (node_modules excluded via .dockerignore) + production web build.
COPY . .
RUN pnpm -F web build

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production
EXPOSE 3000

# Persisted config + route/TLE caches live here; mount a volume to keep them.
VOLUME ["/app/server/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["pnpm", "start"]
