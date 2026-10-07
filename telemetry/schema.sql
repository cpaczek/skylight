-- One row per Skylight install (random id generated on the Pi; nothing else identifies it).
CREATE TABLE IF NOT EXISTS installs (
  id         TEXT PRIMARY KEY,
  first_seen TEXT NOT NULL,
  last_seen  TEXT NOT NULL,
  version    TEXT,
  source     TEXT,
  arch       TEXT,
  model      TEXT,
  country    TEXT,
  pings      INTEGER NOT NULL DEFAULT 0
);
-- Which installs pinged on which day (for "active in the last N days").
CREATE TABLE IF NOT EXISTS daily (
  day TEXT NOT NULL,
  id  TEXT NOT NULL,
  PRIMARY KEY (day, id)
);
-- Site page views: no cookies, no IP, no user id.
CREATE TABLE IF NOT EXISTS views (
  ts      TEXT NOT NULL,
  day     TEXT NOT NULL,
  path    TEXT NOT NULL,
  ref     TEXT,
  country TEXT,
  device  TEXT
);
CREATE INDEX IF NOT EXISTS views_day ON views (day);
-- Remote defaults handed back in the ping response (latest, apiUrl, notice).
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
