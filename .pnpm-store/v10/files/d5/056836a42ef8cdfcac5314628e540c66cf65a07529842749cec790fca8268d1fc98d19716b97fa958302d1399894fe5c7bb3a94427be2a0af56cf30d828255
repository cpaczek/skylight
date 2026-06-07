declare module 'satellite.js' {
  /**
   * Satellite record containing description of orbit.
   */
  export interface SatRec {
    /**
     * Unique satellite number given in the TLE file.
     */
    satnum: string;
    /**
     * Full four-digit year of this element set's epoch moment.
     */
    epochyr: number;
    /**
     * Fractional days into the year of the epoch moment.
     */
    epochdays: number;
    /**
     * Julian date of the epoch (computed from epochyr and epochdays).
     */
    jdsatepoch: number;
    /**
     * First time derivative of the mean motion (ignored by SGP4).
     */
    ndot: number;
    /**
     * Second time derivative of the mean motion (ignored by SGP4).
     */
    nddot: number;
    /**
     * Ballistic drag coefficient B* in inverse earth radii.
     */
    bstar: number;
    /**
     * Inclination in radians.
     */
    inclo: number;
    /**
     * Right ascension of ascending node in radians.
     */
    nodeo: number;
    /**
     * Eccentricity.
     */
    ecco: number;
    /**
     * Argument of perigee in radians.
     */
    argpo: number;
    /**
     * Mean anomaly in radians.
     */
    mo: number;
    /**
     * Mean motion in radians per minute.
     */
    no: number;
    /**
     * Error code indicating propagation failure type.
     */
    error: number;
  }

  /**
   * Initialize a satellite record
   */
  export function twoline2satrec(tleLine1: string, tleLine2: string): SatRec;

  /**
   * Coordinate frame Earth Centered Inertial (ECI)
   * https://en.wikipedia.org/wiki/Earth-centered_inertial
   */
  export interface EciVec3<T> {
    x: T;
    y: T;
    z: T;
  }

  /**
   * Coordinate frame Earth Centered Fixed (ECF)
   * https://en.wikipedia.org/wiki/ECEF
   */
  export interface EcfVec3<T> {
    x: T;
    y: T;
    z: T;
  }

  /**
   * Type alias documents units are kilometer (km)
   */
  export type Kilometer = number;

  /**
   * Type alias documents units are kilometer per second (km/s)
   */
  export type KilometerPerSecond = number;

  /**
   * The position_velocity result is a key-value pair of ECI coordinates.
   * These are the base results from which all other coordinates are derived.
   * If there is an error the position and velocity will be false.
   */
  export interface PositionAndVelocity {
    position: EciVec3<Kilometer>|boolean;
    velocity: EciVec3<KilometerPerSecond>|boolean;
  }

  /**
   * Propagate satellite using time since epoch (in minutes).
   */
  export function sgp4(satrec: SatRec, timeSinceTleEpochMinutes: number): PositionAndVelocity;

  /**
   * Propagate satellite using time as JavaScript Date.
   */
  export function propagate(satrec: SatRec, date: Date): PositionAndVelocity;

  /**
   * Type alias documents units are radians
   */
  export type Radians = number;

  /**
   * Type alias documents units are degrees
   */
  export type Degrees = number;

  /**
   * Convert number in degrees to number in radians
   * @param value Number to convert
   */
  export function degreesToRadians(value: Degrees): Radians;

  /**
   * https://en.wikipedia.org/wiki/Geographic_coordinate_system#Latitude_and_longitude
   */
  export interface GeodeticLocation {
    longitude: Radians;
    latitude: Radians;
    height: Kilometer;
  }

  /**
   * You will need GMST for some of the coordinate transforms.
   * GMST - Greenwich Mean Sidereal Time
   * http://en.wikipedia.org/wiki/Sidereal_time#Definition
   */
  export type GMSTime = number;

  /**
   * Convert values to GMST. Accepts either a Date object, a Julian date number, or individual date and time
   * component values. If individual values are specified, all but `msec` are required.
   * @param dateYearArg Can be a Date, Julian date, or the year number for
   * @param month Zero-based month number
   * @param day Day of month
   * @param hour Hour of day, based on 24 hour clock
   * @param minute Minute(s)
   * @param second Second(s)
   * @param msec Optional milliseconds
   */
  export function gstime(
      dateYearArg: number | Date,
      month?: number,
      day?: number,
      hour?: number,
      minute?: number,
      second?: number,
      msec?: number): GMSTime;

  /**
   * Convert ECI to ECF. Units are not modified.
   */
  export function eciToEcf<T>(positionEci: EciVec3<T>, gmst: GMSTime): EcfVec3<T>;

  /**
   * Convert ECF to ECI. Units are not modified.
   */
  export function ecfToEci<T>(positionEcf: EcfVec3<T>, gmst: GMSTime): EciVec3<T>;

  /**
   * Convert geodetic location to ECF
   */
  export function geodeticToEcf(observerGd: GeodeticLocation): EcfVec3<Kilometer>;

  /**
   * Convert ECI to geodetic location
   */
  export function eciToGeodetic(positionEci: EciVec3<Kilometer>, gmst: GMSTime): GeodeticLocation;

  /**
   * https://en.wikipedia.org/wiki/Azimuth
   */
  export interface LookAngles {
    azimuth: Radians;
    elevation: Radians;
    rangeSat: Kilometer;
  }

  /**
   * Convert ECF to look angles
   */
  export function ecfToLookAngles(observerGd: GeodeticLocation, positionEcf: EcfVec3<Kilometer>): LookAngles;

  /**
   * Compute doppler factor between observer and satellite with position and velocity.
   */
  export function dopplerFactor(
    observerCoordsEcf: EcfVec3<Kilometer>,
    positionEcf: EcfVec3<Kilometer>,
    velocityEcf: EcfVec3<KilometerPerSecond>
  ): number;

  /**
   * Convert the longitude in RADIANS to DEGREES.
   */
  export function degreesLong(longitude: Radians): number;

  /**
   * Convert the latitude in RADIANS to DEGREES.
   */
  export function degreesLat(latitude: Radians): number;
}
