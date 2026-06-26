import type { Aircraft } from "./aircraft.js";
import type { Config } from "./config.js";

const DEG = Math.PI / 180;
const LOW_LOCAL_ALT_FT = 12000;
const LOCAL_TRAFFIC_MI = 30;
const LOCAL_AIRPORT_MI = 45;
const NEAR_ENDPOINT_MI = 80;
const CROSS_TRACK_MI = 130;
const ROUTE_HEADING_TOLERANCE_DEG = 75;

/** Initial great-circle bearing (deg from North) from point 1 to point 2. */
export function bearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = lat1 * DEG;
  const phi2 = lat2 * DEG;
  const deltaLambda = (lon2 - lon1) * DEG;
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

/** Great-circle distance in statute miles. */
export function greatCircleMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = lat1 * DEG;
  const phi2 = lat2 * DEG;
  const dPhi = (lat2 - lat1) * DEG;
  const dLambda = (lon2 - lon1) * DEG;
  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Cross-track distance (miles) of a point from the great circle p1 -> p2. */
export function crossTrackMiles(
  lat: number, lon: number,
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 3958.8;
  const d13 = greatCircleMiles(lat1, lon1, lat, lon) / R; // angular (rad)
  const theta13 = bearing(lat1, lon1, lat, lon) * DEG;
  const theta12 = bearing(lat1, lon1, lat2, lon2) * DEG;
  return Math.asin(Math.sin(d13) * Math.sin(theta13 - theta12)) * R;
}

/**
 * Is the adsbdb route consistent with where the plane actually is and what it's
 * doing? adsbdb returns the scheduled route for a callsign, which is sometimes
 * the wrong leg. We reject a route if:
 *  (a) it's geographically impossible - the plane is neither near an endpoint
 *      nor roughly on the great-circle path;
 *  (b) the plane's heading is opposite the claimed route for low, nearby
 *      traffic; or
 *  (c) the plane's vertical trend disagrees - a climbing plane near you just
 *      departed the local airport (so that should be the origin); a descending
 *      one is arriving (the destination).
 */
export function routePlausible(ac: Aircraft, cfg: Config): boolean {
  if (ac.lat == null || ac.lon == null) return true;
  const haveCoords = ac.originLat != null || ac.destLat != null;
  if (!haveCoords) return true; // legacy cache without coords - don't hide

  // (a) geographic consistency
  const nearPlane = (la?: number, lo?: number) =>
    la != null && lo != null && greatCircleMiles(ac.lat!, ac.lon!, la, lo) < NEAR_ENDPOINT_MI;
  let geomOk = nearPlane(ac.originLat, ac.originLon) || nearPlane(ac.destLat, ac.destLon);
  if (
    !geomOk &&
    ac.originLat != null && ac.originLon != null &&
    ac.destLat != null && ac.destLon != null
  ) {
    geomOk = Math.abs(crossTrackMiles(ac.lat, ac.lon, ac.originLat, ac.originLon, ac.destLat, ac.destLon)) < CROSS_TRACK_MI;
  } else if (!geomOk && (ac.originLat == null || ac.destLat == null)) {
    geomOk = true; // only one endpoint known and not near - can't judge, allow
  }
  if (!geomOk) return false;

  const alt = ac.altBaro ?? ac.altGeom;
  const localTraffic = greatCircleMiles(ac.lat, ac.lon, cfg.centerLat, cfg.centerLon) < LOCAL_TRAFFIC_MI;

  // (b) heading consistency for low, nearby traffic with full route coordinates
  if (
    localTraffic &&
    alt != null && alt < LOW_LOCAL_ALT_FT &&
    ac.track != null && Number.isFinite(ac.track) &&
    ac.originLat != null && ac.originLon != null &&
    ac.destLat != null && ac.destLon != null
  ) {
    const destBearing = bearing(ac.lat, ac.lon, ac.destLat, ac.destLon);
    const originBearing = bearing(ac.lat, ac.lon, ac.originLat, ac.originLon);
    const offDestination = angleDiffDeg(ac.track, destBearing) > ROUTE_HEADING_TOLERANCE_DEG;
    const towardOrigin = angleDiffDeg(ac.track, originBearing) <= ROUTE_HEADING_TOLERANCE_DEG;
    if (offDestination && towardOrigin) return false;
  }

  // (c) vertical-trend consistency for low, nearby traffic
  const localAirport = (la?: number, lo?: number) =>
    la != null && lo != null && greatCircleMiles(cfg.centerLat, cfg.centerLon, la, lo) < LOCAL_AIRPORT_MI;
  if (localTraffic && alt != null && alt < LOW_LOCAL_ALT_FT && ac.baroRate != null && Math.abs(ac.baroRate) > 250) {
    if (ac.baroRate > 0) {
      if (ac.originLat != null && !localAirport(ac.originLat, ac.originLon)) return false; // departing
    } else {
      if (ac.destLat != null && !localAirport(ac.destLat, ac.destLon)) return false; // arriving
    }
  }
  return true;
}

function angleDiffDeg(a: number, b: number): number {
  return Math.abs((((a - b) % 360) + 540) % 360 - 180);
}
