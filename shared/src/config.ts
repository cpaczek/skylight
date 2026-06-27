// Central, fully-adjustable configuration for the ceiling tracker.
// This object is the single source of truth shared between the display
// (projector) and the control panel (phone). Everything here is live-tunable
// and persisted server-side so changes survive reboots.

import type {
  CameraLimits,
  GeoPoint,
  MountModel,
  TargetCriteria,
  TargetMode,
  ViscaUnitScale,
} from "./camera.js";
import type { FovPoint } from "./aim.js";
import { SFO_AIRPORT, type Airport } from "./airport.js";

export type Theme = "ambient" | "telemetry" | "focus";
export type LabelDensity = "all" | "nearestN" | "nearestOnly";
export type DataSource = "radio" | "api";
export type NameDisplay = "airline" | "flight";
export type LocationDisplay = "name" | "iata";
/** Ground-speed display unit. ADS-B reports knots; the rest are converted. */
export type SpeedUnit = "kt" | "mph" | "kmh";
/** Altitude display unit. */
export type AltitudeUnit = "ft" | "m";
/** Distance display unit. */
export type DistanceUnit = "mi" | "km";
/** map = flat ground plan; sky = look-up dome with altitude-aware motion. */
export type ProjectionMode = "map" | "sky";

export interface Palette {
  bg: string;
  glyph: string;
  trail: string;
  accent: string;
  warn: string;
  /** Range rings / compass ticks. */
  grid: string;
  /** Label / card text. */
  text: string;
}

export interface Fonts {
  label: string;
  mono: string;
}

/** A saved place you can jump the view to from the control panel. */
export interface LocationProfile {
  id: string;
  name: string;
  lat: number;
  lon: number;
  radiusMiles: number;
}

export interface ShowFields {
  name: boolean;
  type: boolean;
  altitude: boolean;
  speed: boolean;
  verticalRate: boolean;
  destination: boolean;
  registration: boolean;
}

// --- PTZ camera tracker (roof camera that films the aircraft) ---

export interface TrackerConfig {
  /** Drive the real camera ("visca") or the software simulator ("sim"). */
  driver: "sim" | "visca";
  cameraIp: string;
  viscaPort: number;
  /** RTSP main stream (full quality, passed through untouched to the TV). */
  rtspUrl: string;
  /** RTSP substream (lower res) feeding the vision detector + MJPEG debug. */
  rtspSubUrl: string;
  /** Camera location — lat/lon + meters above the WGS84 ellipsoid. */
  site: GeoPoint;
  limits: CameraLimits;
  units: ViscaUnitScale;
  mount: MountModel;
  targetMode: TargetMode;
  target: TargetCriteria;
  predict: {
    /** ADS-B decode/transport latency beyond the fix's `seen` age, s. */
    adsbLatencySec: number;
    /**
     * Command-to-motion latency of the camera (UDP + firmware + accel ramp),
     * s. Folded into the aim lead so the setpoint trajectory is evaluated
     * where the plane will be when the command actually bites — the rate
     * feedforward then carries the right value for free.
     */
    motorLatencySec: number;
    /** Never extrapolate further than this. */
    maxLeadSec: number;
    /** Don't re-command moves smaller than this, deg. */
    deadbandDeg: number;
    /** Smoothed-setpoint command cadence, Hz. */
    commandHz: number;
    /** Alpha-beta filter constants for the setpoint tracker. */
    alpha: number;
    beta: number;
    /**
     * Pursuit style: "carrot" = speed-matched absolute moves toward a goal
     * slightly ahead (smoothest); "velocity" = closed-loop drive commands.
     */
    pursuit: "carrot" | "velocity";
    /** Carrot lead horizon, s, and re-issue cadence, ms. */
    carrotHorizonSec: number;
    carrotMs: number;
    /**
     * Position-smoothing strength 0..1: denoise the plane's ADS-B position
     * before aiming so the camera follows the smooth predicted PATH rather
     * than jittering to each noisy fix. 0 = off (raw fix). ~0.7 = smooth.
     */
    posSmoothing: number;
    /**
     * Pose-error low-pass 0..1 for the velocity loop's P term: damps the
     * spikes from position-inquiry replies snapping after a stall. 0 = off,
     * ~0.4 = gentle. Higher trades a little correction speed for smoothness.
     */
    errSmoothing: number;
    /**
     * Cap on how fast the commanded velocity may change, deg/s² (jerk limit).
     * Turns any residual command step into a brief smooth ramp. Set well
     * below the camera's physical accel (~180°/s²) only enough to catch
     * spikes; 0 = off.
     */
    maxAccelDps2: number;
    /**
     * Keep the sweep continuous: when the feedforward (predicted plane) rate
     * exceeds this many deg/s, the drive is floored at it so the reactive P/I
     * and deadband can't STOP or REVERSE a moving axis (the ~1 Hz stop-go).
     * Below it, near-still targets rest normally. 0 = off.
     */
    minSweepDps: number;
  };
  zoom: {
    auto: boolean;
    /** Estimated pointing sigma used for the zoom-out floor, deg. */
    sigmaDeg: number;
    /**
     * Pointing sigma to use while vision is actively locked, deg — the
     * detector's residual, far tighter than the open-loop estimate. This is
     * what lets the camera zoom past ~5× to the framing target once locked.
     */
    lockedSigmaDeg: number;
    /** Fraction of frame height the plane should fill. */
    fillFrac: number;
    /** HFOV used when auto is off, deg. */
    manualHfovDeg: number;
    /** Measured zoom-units -> HFOV samples (endpoints from the datasheet). */
    fovLut: FovPoint[];
  };
  vision: {
    /** Run the in-frame plane detector while tracking. */
    enabled: boolean;
    /** Close the loop: nudge the aim by the detected offset. */
    applyCorrection: boolean;
    /** Stay at full wide while searching (Phase B bring-up). */
    lockWide: boolean;
    /**
     * Once zoomed in and vision-locked on the plane, fire a one-push
     * autofocus ON THE PLANE (re-triggered on each zoom step). The lens is
     * not parfocal, so the fixed infinity far-stop goes soft at high zoom —
     * focusing on the actual subject keeps it sharp. false = hold the
     * infinity far-stop (sharp at low zoom, may soften at high zoom).
     */
    autofocusOnZoom: boolean;
    /** Detector cadence, ms. */
    intervalMs: number;
    /**
     * Residual video latency BEFORE arrival at the tracker: exposure ->
     * camera encode -> RTSP -> ffmpeg decode -> pipe. (Arrival itself is
     * timestamped per frame; this covers only the unobservable part.)
     */
    encodeLagMs: number;
    /**
     * Max rate the vision correction may slew the aim, deg/s — corrections
     * glide in instead of stepping per detection (the steps read as jank).
     */
    correctionSlewDps: number;
    /**
     * Continuously refit the mount model from vision-locked passes (every
     * steady locked detection is a free calibration sample). Applied only
     * when the refit clearly beats the current model.
     */
    autoCalibrate: boolean;
    /**
     * Optional neural airplane detector (ONNX). Adds a SEMANTIC signal that
     * the classical blob paths lack — kills cloud locks and nails the big-
     * overhead case. Self-disables gracefully when the runtime or model file
     * is missing (run scripts/fetch-vision-model.sh on the Pi to install it).
     */
    net: {
      enabled: boolean;
      /** Path to the .onnx model (downloaded at setup, not committed). */
      modelPath: string;
      /** Square network input size (YOLOX-Nano = 416). */
      inputSize: number;
      /** Min airplane-class score to accept a detection. */
      scoreThresh: number;
      /** COCO class id (4 = airplane). */
      classId: number;
      /** Run the net every Nth vision tick (CPU budget). 1 = every tick. */
      everyNTicks: number;
    };
  };
  /** Idle "ready position" when auto mode has no target. */
  home: {
    enabled: boolean;
    /** "sfo" = aim along the bearing site->SFO; "fixed" = use azDeg. */
    mode: "sfo" | "fixed";
    azDeg: number;
    elDeg: number;
    /** Go home after this long without a target, s. */
    afterSec: number;
  };
}

/** Shallow-by-section patch for TrackerConfig (nested sections may be partial). */
export type TrackerConfigPatch = {
  [K in keyof TrackerConfig]?: TrackerConfig[K] extends object
    ? Partial<TrackerConfig[K]>
    : TrackerConfig[K];
};

export interface Config {
  // --- location & scope ---
  centerLat: number;
  centerLon: number;
  /** Human-readable place name for the current location (shown in the panel). */
  locationName: string;
  radiusMiles: number;
  /** Saved places (airports/cities) switchable from the control panel. */
  locationProfiles: LocationProfile[];

  // --- data source ---
  /** dump1090/readsb aircraft.json URL for the radio source. */
  radioUrl: string;

  // --- calibration (tune against a real overhead pass) ---
  /** Rotate the whole field, degrees. */
  rotationDeg: number;
  /** Horizontal flip for the looking-up problem. */
  mirrorX: boolean;
  /** Vertical flip (rarely needed; available for awkward mounts). */
  mirrorY: boolean;
  /** Rotate only the text labels (so they read right-side-up from where you
   *  lie), independent of the field rotation. Degrees. */
  labelRotationDeg: number;
  /** How aircraft are placed on the ceiling (sky = realistic look-up geometry). */
  projectionMode: ProjectionMode;

  // --- filtering ---
  minAltitudeFt: number;
  maxAltitudeFt: number;
  hideOnGround: boolean;

  // --- motion ---
  /** Display interpolation toggle (server poll cadence is separate). */
  interpolate: boolean;
  maxExtrapolationSec: number;
  staleSec: number;
  /** Ease factor toward each fresh fix (0 = snap, 1 = never move). */
  smoothing: number;
  /** Cap the render loop, frames per second. 0 = uncapped (use display
   *  refresh rate). Lower this to cut GPU/CPU load (and laptop fan noise). */
  maxFps: number;

  // --- visuals ---
  theme: Theme;
  palette: Palette;
  fonts: Fonts;
  glyphSizePx: number;
  /** Color the glyph by altitude. */
  altitudeColor: boolean;
  trailSeconds: number;
  /** Global brightness 0..1 (helps keep projector blacks deep). */
  brightness: number;

  // --- labels ---
  labelDensity: LabelDensity;
  nearestN: number;
  showFields: ShowFields;
  nameDisplay: NameDisplay;
  locationDisplay: LocationDisplay;
  /** Unit for the speed shown on labels (ADS-B is knots). */
  speedUnit: SpeedUnit;
  /** Unit for the altitude shown on labels. */
  altitudeUnit: AltitudeUnit;
  /** Unit for the distance shown on labels. */
  distanceUnit: DistanceUnit;

  // --- overlays ---
  rangeRings: boolean;
  compass: boolean;
  highlightEmergency: boolean;
  /** Draw the airport (runways) at its true geographic position. */
  showAirport: boolean;
  /** Which airport to draw — importable by ICAO/IATA code from the control
   *  panel (worldwide, via OurAirports). */
  airport: Airport;
  /** Show the on-screen calibration HUD on the display. */
  showHud: boolean;

  // --- sky layer (sun / moon / stars / satellites at true positions) ---
  showStars: boolean;
  showSun: boolean;
  showMoon: boolean;
  showSatellites: boolean; // includes the ISS
  /** Label non-ISS satellites with their names (the ISS is always labelled). */
  satelliteLabels: boolean;
  /** Draw the naked-eye planets (Venus, Jupiter, Mars, Saturn, Mercury). */
  showPlanets: boolean;
  /** Faintest star magnitude to draw (higher = more stars). */
  starMagLimit: number;
  /** Faintest star magnitude to label with its name (higher = more names). */
  starLabelMagLimit: number;
  /** Offset the sky clock for testing/scrubbing, minutes (0 = live). */
  skyTimeOffsetMin: number;

  // --- "window to elsewhere" ---
  /** Faint great-circle arc toward each plane's destination. */
  showDestArc: boolean;
  /** Add destination local time + distance-to-go to labels. */
  showRouteDetail: boolean;

  // --- PTZ camera tracker ---
  tracker: TrackerConfig;
}

export const DEFAULT_CONFIG: Config = {
  // Default center: San Francisco International (SFO). Set this to your own
  // location — ideally where you'll be looking up at the ceiling.
  centerLat: 37.6213,
  centerLon: -122.379,
  locationName: "San Francisco International",
  radiusMiles: 3,
  locationProfiles: [],

  radioUrl: "http://localhost:8080/data/aircraft.json",

  rotationDeg: 0,
  mirrorX: true,
  mirrorY: false,
  labelRotationDeg: 0,
  // Default to the flat ground plan (the original look); "sky" is opt-in.
  projectionMode: "map",

  minAltitudeFt: 100,
  maxAltitudeFt: 60000,
  hideOnGround: true,

  interpolate: true,
  maxExtrapolationSec: 5,
  staleSec: 20,
  smoothing: 0.18,
  maxFps: 0,

  theme: "ambient",
  palette: {
    bg: "#000000",
    glyph: "#E8ECFF",
    trail: "#6B7280",
    accent: "#9B7ECF",
    warn: "#FF5A47",
    grid: "#3A4256",
    text: "#AEB6C6",
  },
  fonts: {
    label: "Inter, system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
  glyphSizePx: 22,
  altitudeColor: true,
  trailSeconds: 45,
  brightness: 1,

  labelDensity: "all",
  nearestN: 5,
  showFields: {
    name: true,
    type: true,
    altitude: true,
    speed: true,
    verticalRate: false,
    destination: true,
    registration: false,
  },
  nameDisplay: "flight",
  locationDisplay: "name",
  speedUnit: "kt",
  altitudeUnit: "ft",
  distanceUnit: "mi",

  rangeRings: true,
  compass: true,
  highlightEmergency: true,
  showAirport: true,
  airport: SFO_AIRPORT,
  showHud: false,

  showStars: true,
  showSun: true,
  showMoon: true,
  showSatellites: true,
  satelliteLabels: false,
  showPlanets: true,
  starMagLimit: 2.6,
  starLabelMagLimit: 0.3,
  skyTimeOffsetMin: 0,

  showDestArc: true,
  showRouteDetail: true,

  tracker: {
    driver: "sim",
    cameraIp: "192.168.0.206", // factory default; updated at network bring-up
    viscaPort: 52381,
    rtspUrl: "rtsp://{ip}:554/live/av0",
    rtspSubUrl: "rtsp://{ip}:554/live/av1",
    // Default site = the display center; replace with the camera's real spot.
    site: { lat: 37.6213, lon: -122.379, altM: 0 },
    limits: {
      panMinDeg: -175,
      panMaxDeg: 175,
      tiltMinDeg: -90,
      tiltMaxDeg: 90,
      panSpeedMaxDps: 100,
      tiltSpeedMaxDps: 80,
    },
    // Placeholder VISCA scales — measured for real in bring-up milestone M4.
    units: {
      panUnitsPerDeg: 14.4,
      tiltUnitsPerDeg: 14.4,
      panZeroUnits: 0,
      tiltZeroUnits: 0,
      zoomWideUnits: 0,
      zoomTeleUnits: 16384,
    },
    mount: {
      panOffsetDeg: 0,
      tiltOffsetDeg: 0,
      panGain: 1,
      tiltGain: 1,
      levelTiltDeg: 0,
      levelDirDeg: 0,
    },
    targetMode: "overhead",
    target: {
      minElevationDeg: 12,
      maxRangeMi: 15,
      minAltFt: 500,
      hysteresisSec: 8,
      switchMargin: 0.15,
    },
    predict: {
      adsbLatencySec: 0.6,
      motorLatencySec: 0.2,
      maxLeadSec: 5,
      deadbandDeg: 0.05,
      commandHz: 15,
      alpha: 0.5,
      beta: 0.1,
      pursuit: "velocity",
      carrotHorizonSec: 1.5,
      carrotMs: 600,
      posSmoothing: 0.7,
      errSmoothing: 0.5,
      maxAccelDps2: 80,
      minSweepDps: 0.6,
    },
    zoom: {
      auto: true,
      sigmaDeg: 0.6,
      lockedSigmaDeg: 0.35,
      fillFrac: 0.28,
      manualHfovDeg: 20,
      // Datasheet endpoints; refined empirically at M4.
      fovLut: [
        { units: 0, hfovDeg: 62.3 },
        { units: 16384, hfovDeg: 3.46 },
      ],
    },
    vision: {
      enabled: true,
      applyCorrection: false,
      lockWide: true,
      autofocusOnZoom: true,
      // Motion-compensated detection is cheap (no net, no contrast machinery),
      // so the loop runs fast: ~10 Hz gives a fresh, low-lag error signal for a
      // dead-set lock, and corrections glide on faster than the old 1.2°/s.
      intervalMs: 100,
      encodeLagMs: 350,
      correctionSlewDps: 2.5,
      autoCalibrate: true,
      net: {
        // Retired: the YOLOX net (generic COCO, ~266 ms/inference) was the wrong
        // tool for a speck on sky AND a CPU hog. Camera-motion-compensated
        // detection replaced it. Left here (disabled) so old configs merge.
        enabled: false,
        modelPath: "tracker/models/yolox_nano.onnx",
        inputSize: 416,
        scoreThresh: 0.3,
        classId: 4,
        everyNTicks: 3,
      },
    },
    home: {
      enabled: true,
      mode: "sfo",
      azDeg: 120,
      elDeg: 15,
      afterSec: 10,
    },
  },
};

/**
 * Deep-merge a partial config onto a base, so persisted/partial payloads
 * never drop nested keys (palette, showFields, fonts, tracker sections).
 */
export function mergeConfig(base: Config, patch: Partial<Config>): Config {
  return {
    ...base,
    ...patch,
    palette: { ...base.palette, ...(patch.palette ?? {}) },
    fonts: { ...base.fonts, ...(patch.fonts ?? {}) },
    showFields: { ...base.showFields, ...(patch.showFields ?? {}) },
    tracker: mergeTrackerConfig(base.tracker, patch.tracker ?? {}),
  };
}

/** Deep-merge a tracker patch (each nested section may be partial). */
export function mergeTrackerConfig(
  base: TrackerConfig,
  patch: TrackerConfigPatch,
): TrackerConfig {
  return {
    ...base,
    ...patch,
    site: { ...base.site, ...(patch.site ?? {}) },
    limits: { ...base.limits, ...(patch.limits ?? {}) },
    units: { ...base.units, ...(patch.units ?? {}) },
    mount: { ...base.mount, ...(patch.mount ?? {}) },
    target: { ...base.target, ...(patch.target ?? {}) },
    predict: { ...base.predict, ...(patch.predict ?? {}) },
    zoom: { ...base.zoom, ...(patch.zoom ?? {}) },
    vision: {
      ...base.vision,
      ...(patch.vision ?? {}),
      // `net` is a nested object inside vision — deep-merge it too, or a
      // partial patch (e.g. {net:{everyNTicks:3}}) would wipe enabled/
      // modelPath and silently disable the detector.
      net: { ...base.vision.net, ...(patch.vision?.net ?? {}) },
    },
    home: { ...base.home, ...(patch.home ?? {}) },
  } as TrackerConfig;
}
