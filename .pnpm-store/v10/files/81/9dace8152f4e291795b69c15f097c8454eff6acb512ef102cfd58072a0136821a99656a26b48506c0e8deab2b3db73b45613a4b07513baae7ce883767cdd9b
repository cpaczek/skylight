(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Astronomy = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
    @preserve

    Astronomy library for JavaScript (browser and Node.js).
    https://github.com/cosinekitty/astronomy

    MIT License

    Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/
/**
 * @fileoverview Astronomy calculation library for browser scripting and Node.js.
 * @author Don Cross <cosinekitty@gmail.com>
 * @license MIT
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoEmbState = exports.GeoMoonState = exports.EclipticGeoMoon = exports.GeoMoon = exports.Ecliptic = exports.ObserverGravity = exports.VectorObserver = exports.ObserverState = exports.ObserverVector = exports.Equator = exports.SunPosition = exports.Observer = exports.Horizon = exports.EclipticCoordinates = exports.HorizontalCoordinates = exports.MakeRotation = exports.RotationMatrix = exports.EquatorialCoordinates = exports.Spherical = exports.StateVector = exports.Vector = exports.SiderealTime = exports.Libration = exports.LibrationInfo = exports.CalcMoonCount = exports.e_tilt = exports.MakeTime = exports.AstroTime = exports.SetDeltaTFunction = exports.DeltaT_JplHorizons = exports.DeltaT_EspenakMeeus = exports.PlanetOrbitalPeriod = exports.DefineStar = exports.Body = exports.AngleBetween = exports.MassProduct = exports.CALLISTO_RADIUS_KM = exports.GANYMEDE_RADIUS_KM = exports.EUROPA_RADIUS_KM = exports.IO_RADIUS_KM = exports.JUPITER_MEAN_RADIUS_KM = exports.JUPITER_POLAR_RADIUS_KM = exports.JUPITER_EQUATORIAL_RADIUS_KM = exports.RAD2HOUR = exports.RAD2DEG = exports.HOUR2RAD = exports.DEG2RAD = exports.AU_PER_LY = exports.KM_PER_AU = exports.C_AUDAY = void 0;
exports.VectorFromHorizon = exports.HorizonFromVector = exports.SphereFromVector = exports.EquatorFromVector = exports.VectorFromSphere = exports.Pivot = exports.IdentityMatrix = exports.CombineRotation = exports.InverseRotation = exports.NextPlanetApsis = exports.SearchPlanetApsis = exports.NextLunarApsis = exports.SearchLunarApsis = exports.Apsis = exports.ApsisKind = exports.SearchPeakMagnitude = exports.SearchMaxElongation = exports.Elongation = exports.ElongationEvent = exports.Seasons = exports.SeasonInfo = exports.HourAngle = exports.SearchHourAngle = exports.HourAngleEvent = exports.SearchAltitude = exports.SearchRiseSet = exports.Atmosphere = exports.AtmosphereInfo = exports.NextMoonQuarter = exports.SearchMoonQuarter = exports.MoonQuarter = exports.SearchMoonPhase = exports.MoonPhase = exports.SearchRelativeLongitude = exports.Illumination = exports.IlluminationInfo = exports.EclipticLongitude = exports.AngleFromSun = exports.PairLongitude = exports.SearchSunLongitude = exports.Search = exports.HelioState = exports.BaryState = exports.GeoVector = exports.BackdatePosition = exports.CorrectLightTravel = exports.HelioDistance = exports.HelioVector = exports.JupiterMoons = exports.JupiterMoonsInfo = void 0;
exports.GravitySimulator = exports.LagrangePointFast = exports.LagrangePoint = exports.RotationAxis = exports.AxisInfo = exports.NextMoonNode = exports.SearchMoonNode = exports.NodeEventInfo = exports.NodeEventKind = exports.NextTransit = exports.SearchTransit = exports.TransitInfo = exports.NextLocalSolarEclipse = exports.SearchLocalSolarEclipse = exports.LocalSolarEclipseInfo = exports.EclipseEvent = exports.NextGlobalSolarEclipse = exports.SearchGlobalSolarEclipse = exports.NextLunarEclipse = exports.GlobalSolarEclipseInfo = exports.SearchLunarEclipse = exports.LunarEclipseInfo = exports.EclipseKind = exports.Constellation = exports.ConstellationInfo = exports.Rotation_EQD_ECT = exports.Rotation_ECT_EQD = exports.Rotation_GAL_EQJ = exports.Rotation_EQJ_GAL = exports.Rotation_HOR_ECL = exports.Rotation_ECL_HOR = exports.Rotation_ECL_EQD = exports.Rotation_EQD_ECL = exports.Rotation_EQJ_HOR = exports.Rotation_HOR_EQJ = exports.Rotation_HOR_EQD = exports.Rotation_EQD_HOR = exports.Rotation_EQD_EQJ = exports.Rotation_ECT_EQJ = exports.Rotation_EQJ_ECT = exports.Rotation_EQJ_EQD = exports.Rotation_ECL_EQJ = exports.Rotation_EQJ_ECL = exports.RotateState = exports.RotateVector = exports.InverseRefraction = exports.Refraction = void 0;
/**
 * @brief The speed of light in AU/day.
 */
exports.C_AUDAY = 173.1446326846693;
/**
 * @brief The number of kilometers per astronomical unit.
 */
exports.KM_PER_AU = 1.4959787069098932e+8;
/**
 * @brief The number of astronomical units per light-year.
 */
exports.AU_PER_LY = 63241.07708807546;
/**
 * @brief The factor to convert degrees to radians = pi/180.
 */
exports.DEG2RAD = 0.017453292519943296;
/**
 * @brief The factor to convert sidereal hours to radians = pi/12.
 */
exports.HOUR2RAD = 0.2617993877991494365;
/**
 * @brief The factor to convert radians to degrees = 180/pi.
 */
exports.RAD2DEG = 57.295779513082321;
/**
 * @brief The factor to convert radians to sidereal hours = 12/pi.
 */
exports.RAD2HOUR = 3.819718634205488;
// Jupiter radius data are nominal values obtained from:
// https://www.iau.org/static/resolutions/IAU2015_English.pdf
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html
/**
 * @brief The equatorial radius of Jupiter, expressed in kilometers.
 */
exports.JUPITER_EQUATORIAL_RADIUS_KM = 71492.0;
/**
 * @brief The polar radius of Jupiter, expressed in kilometers.
 */
exports.JUPITER_POLAR_RADIUS_KM = 66854.0;
/**
 * @brief The volumetric mean radius of Jupiter, expressed in kilometers.
 */
exports.JUPITER_MEAN_RADIUS_KM = 69911.0;
// The radii of Jupiter's four major moons are obtained from:
// https://ssd.jpl.nasa.gov/?sat_phys_par
/**
 * @brief The mean radius of Jupiter's moon Io, expressed in kilometers.
 */
exports.IO_RADIUS_KM = 1821.6;
/**
 * @brief The mean radius of Jupiter's moon Europa, expressed in kilometers.
 */
exports.EUROPA_RADIUS_KM = 1560.8;
/**
 * @brief The mean radius of Jupiter's moon Ganymede, expressed in kilometers.
 */
exports.GANYMEDE_RADIUS_KM = 2631.2;
/**
 * @brief The mean radius of Jupiter's moon Callisto, expressed in kilometers.
 */
exports.CALLISTO_RADIUS_KM = 2410.3;
const DAYS_PER_TROPICAL_YEAR = 365.24217;
const J2000 = new Date('2000-01-01T12:00:00Z');
const PI2 = 2 * Math.PI;
const ARC = 3600 * (180 / Math.PI); // arcseconds per radian
const ASEC2RAD = 4.848136811095359935899141e-6;
const ASEC180 = 180 * 60 * 60; // arcseconds per 180 degrees (or pi radians)
const ASEC360 = 2 * ASEC180; // arcseconds per 360 degrees (or 2*pi radians)
const ANGVEL = 7.2921150e-5;
const AU_PER_PARSEC = ASEC180 / Math.PI; // exact definition of how many AU = one parsec
const SUN_MAG_1AU = -0.17 - 5 * Math.log10(AU_PER_PARSEC); // formula from JPL Horizons
const MEAN_SYNODIC_MONTH = 29.530588; // average number of days for Moon to return to the same phase
const SECONDS_PER_DAY = 24 * 3600;
const MILLIS_PER_DAY = SECONDS_PER_DAY * 1000;
const SOLAR_DAYS_PER_SIDEREAL_DAY = 0.9972695717592592;
const SUN_RADIUS_KM = 695700.0;
const SUN_RADIUS_AU = SUN_RADIUS_KM / exports.KM_PER_AU;
const EARTH_FLATTENING = 0.996647180302104;
const EARTH_FLATTENING_SQUARED = EARTH_FLATTENING * EARTH_FLATTENING;
const EARTH_EQUATORIAL_RADIUS_KM = 6378.1366;
const EARTH_EQUATORIAL_RADIUS_AU = EARTH_EQUATORIAL_RADIUS_KM / exports.KM_PER_AU;
const EARTH_POLAR_RADIUS_KM = EARTH_EQUATORIAL_RADIUS_KM * EARTH_FLATTENING;
const EARTH_MEAN_RADIUS_KM = 6371.0; /* mean radius of the Earth's geoid, without atmosphere */
const EARTH_ATMOSPHERE_KM = 88.0; /* effective atmosphere thickness for lunar eclipses */
const EARTH_ECLIPSE_RADIUS_KM = EARTH_MEAN_RADIUS_KM + EARTH_ATMOSPHERE_KM;
const MOON_EQUATORIAL_RADIUS_KM = 1738.1;
const MOON_EQUATORIAL_RADIUS_AU = (MOON_EQUATORIAL_RADIUS_KM / exports.KM_PER_AU);
const MOON_MEAN_RADIUS_KM = 1737.4;
const MOON_POLAR_RADIUS_KM = 1736.0;
const MOON_POLAR_RADIUS_AU = (MOON_POLAR_RADIUS_KM / exports.KM_PER_AU);
const REFRACTION_NEAR_HORIZON = 34 / 60; // degrees of refractive "lift" seen for objects near horizon
const EARTH_MOON_MASS_RATIO = 81.30056;
/*
    Masses of the Sun and outer planets, used for:
    (1) Calculating the Solar System Barycenter
    (2) Integrating the movement of Pluto

    https://web.archive.org/web/20120220062549/http://iau-comm4.jpl.nasa.gov/de405iom/de405iom.pdf

    Page 10 in the above document describes the constants used in the DE405 ephemeris.
    The following are G*M values (gravity constant * mass) in [au^3 / day^2].
    This side-steps issues of not knowing the exact values of G and masses M[i];
    the products GM[i] are known extremely accurately.
*/
const SUN_GM = 0.2959122082855911e-03;
const MERCURY_GM = 0.4912547451450812e-10;
const VENUS_GM = 0.7243452486162703e-09;
const EARTH_GM = 0.8887692390113509e-09;
const MARS_GM = 0.9549535105779258e-10;
const JUPITER_GM = 0.2825345909524226e-06;
const SATURN_GM = 0.8459715185680659e-07;
const URANUS_GM = 0.1292024916781969e-07;
const NEPTUNE_GM = 0.1524358900784276e-07;
const PLUTO_GM = 0.2188699765425970e-11;
const MOON_GM = EARTH_GM / EARTH_MOON_MASS_RATIO;
/**
 * @brief Returns the product of mass and universal gravitational constant of a Solar System body.
 *
 * For problems involving the gravitational interactions of Solar System bodies,
 * it is helpful to know the product GM, where G = the universal gravitational constant
 * and M = the mass of the body. In practice, GM is known to a higher precision than
 * either G or M alone, and thus using the product results in the most accurate results.
 * This function returns the product GM in the units au^3/day^2.
 * The values come from page 10 of a
 * [JPL memorandum regarding the DE405/LE405 ephemeris](https://web.archive.org/web/20120220062549/http://iau-comm4.jpl.nasa.gov/de405iom/de405iom.pdf).
 *
 * @param {Body} body
 *      The body for which to find the GM product.
 *      Allowed to be the Sun, Moon, EMB (Earth/Moon Barycenter), or any planet.
 *      Any other value will cause an exception to be thrown.
 *
 * @returns {number}
 *      The mass product of the given body in au^3/day^2.
 */
function MassProduct(body) {
    switch (body) {
        case Body.Sun: return SUN_GM;
        case Body.Mercury: return MERCURY_GM;
        case Body.Venus: return VENUS_GM;
        case Body.Earth: return EARTH_GM;
        case Body.Moon: return MOON_GM;
        case Body.EMB: return EARTH_GM + MOON_GM;
        case Body.Mars: return MARS_GM;
        case Body.Jupiter: return JUPITER_GM;
        case Body.Saturn: return SATURN_GM;
        case Body.Uranus: return URANUS_GM;
        case Body.Neptune: return NEPTUNE_GM;
        case Body.Pluto: return PLUTO_GM;
        default:
            throw `Do not know mass product for body: ${body}`;
    }
}
exports.MassProduct = MassProduct;
function VerifyBoolean(b) {
    if (b !== true && b !== false) {
        console.trace();
        throw `Value is not boolean: ${b}`;
    }
    return b;
}
function VerifyNumber(x) {
    if (!Number.isFinite(x)) {
        console.trace();
        throw `Value is not a finite number: ${x}`;
    }
    return x;
}
function Frac(x) {
    return x - Math.floor(x);
}
/**
 * @brief Calculates the angle in degrees between two vectors.
 *
 * Given a pair of vectors, this function returns the angle in degrees
 * between the two vectors in 3D space.
 * The angle is measured in the plane that contains both vectors.
 *
 * @param {Vector} a
 *      The first of a pair of vectors between which to measure an angle.
 *
 * @param {Vector} b
 *      The second of a pair of vectors between which to measure an angle.
 *
 * @returns {number}
 *      The angle between the two vectors expressed in degrees.
 *      The value is in the range [0, 180].
 */
function AngleBetween(a, b) {
    const aa = (a.x * a.x + a.y * a.y + a.z * a.z);
    if (Math.abs(aa) < 1.0e-8)
        throw `AngleBetween: first vector is too short.`;
    const bb = (b.x * b.x + b.y * b.y + b.z * b.z);
    if (Math.abs(bb) < 1.0e-8)
        throw `AngleBetween: second vector is too short.`;
    const dot = (a.x * b.x + a.y * b.y + a.z * b.z) / Math.sqrt(aa * bb);
    if (dot <= -1.0)
        return 180;
    if (dot >= +1.0)
        return 0;
    return exports.RAD2DEG * Math.acos(dot);
}
exports.AngleBetween = AngleBetween;
/**
 * @brief String constants that represent the solar system bodies supported by Astronomy Engine.
 *
 * The following strings represent solar system bodies supported by various Astronomy Engine functions.
 * Not every body is supported by every function; consult the documentation for each function
 * to find which bodies it supports.
 *
 * "Sun", "Moon", "Mercury", "Venus", "Earth", "Mars", "Jupiter",
 * "Saturn", "Uranus", "Neptune", "Pluto",
 * "SSB" (Solar System Barycenter),
 * "EMB" (Earth/Moon Barycenter)
 *
 * You can also use enumeration syntax for the bodies, like
 * `Astronomy.Body.Moon`, `Astronomy.Body.Jupiter`, etc.
 *
 * @enum {string}
 */
var Body;
(function (Body) {
    Body["Sun"] = "Sun";
    Body["Moon"] = "Moon";
    Body["Mercury"] = "Mercury";
    Body["Venus"] = "Venus";
    Body["Earth"] = "Earth";
    Body["Mars"] = "Mars";
    Body["Jupiter"] = "Jupiter";
    Body["Saturn"] = "Saturn";
    Body["Uranus"] = "Uranus";
    Body["Neptune"] = "Neptune";
    Body["Pluto"] = "Pluto";
    Body["SSB"] = "SSB";
    Body["EMB"] = "EMB";
    // User-defined fixed locations in the sky...
    Body["Star1"] = "Star1";
    Body["Star2"] = "Star2";
    Body["Star3"] = "Star3";
    Body["Star4"] = "Star4";
    Body["Star5"] = "Star5";
    Body["Star6"] = "Star6";
    Body["Star7"] = "Star7";
    Body["Star8"] = "Star8";
})(Body = exports.Body || (exports.Body = {}));
const StarList = [
    Body.Star1, Body.Star2, Body.Star3, Body.Star4,
    Body.Star5, Body.Star6, Body.Star7, Body.Star8
];
;
const StarTable = [
    { ra: 0, dec: 0, dist: 0 },
    { ra: 0, dec: 0, dist: 0 },
    { ra: 0, dec: 0, dist: 0 },
    { ra: 0, dec: 0, dist: 0 },
    { ra: 0, dec: 0, dist: 0 },
    { ra: 0, dec: 0, dist: 0 },
    { ra: 0, dec: 0, dist: 0 },
    { ra: 0, dec: 0, dist: 0 },
];
function GetStar(body) {
    const index = StarList.indexOf(body);
    return (index >= 0) ? StarTable[index] : null;
}
function UserDefinedStar(body) {
    const star = GetStar(body);
    return (star && star.dist > 0) ? star : null;
}
/**
 * @brief Assign equatorial coordinates to a user-defined star.
 *
 * Some Astronomy Engine functions allow their `body` parameter to
 * be a user-defined fixed point in the sky, loosely called a "star".
 * This function assigns a right ascension, declination, and distance
 * to one of the eight user-defined stars `Star1`..`Star8`.
 *
 * Stars are not valid until defined. Once defined, they retain their
 * definition until re-defined by another call to `DefineStar`.
 *
 * @param {Body} body
 *      One of the eight user-defined star identifiers:
 *      `Star1`, `Star2`, `Star3`, `Star4`, `Star5`, `Star6`, `Star7`, or `Star8`.
 *
 * @param {number} ra
 *      The right ascension to be assigned to the star, expressed in J2000 equatorial coordinates (EQJ).
 *      The value is in units of sidereal hours, and must be within the half-open range [0, 24).
 *
 * @param {number} dec
 *      The declination to be assigned to the star, expressed in J2000 equatorial coordinates (EQJ).
 *      The value is in units of degrees north (positive) or south (negative) of the J2000 equator,
 *      and must be within the closed range [-90, +90].
 *
 * @param {number} distanceLightYears
 *      The distance between the star and the Sun, expressed in light-years.
 *      This value is used to calculate the tiny parallax shift as seen by an observer on Earth.
 *      If you don't know the distance to the star, using a large value like 1000 will generally work well.
 *      The minimum allowed distance is 1 light-year, which is required to provide certain internal optimizations.
 */
function DefineStar(body, ra, dec, distanceLightYears) {
    const star = GetStar(body);
    if (!star)
        throw `Invalid star body: ${body}`;
    VerifyNumber(ra);
    VerifyNumber(dec);
    VerifyNumber(distanceLightYears);
    if (ra < 0 || ra >= 24)
        throw `Invalid right ascension for star: ${ra}`;
    if (dec < -90 || dec > +90)
        throw `Invalid declination for star: ${dec}`;
    if (distanceLightYears < 1)
        throw `Invalid star distance: ${distanceLightYears}`;
    star.ra = ra;
    star.dec = dec;
    star.dist = distanceLightYears * exports.AU_PER_LY;
}
exports.DefineStar = DefineStar;
var PrecessDirection;
(function (PrecessDirection) {
    PrecessDirection[PrecessDirection["From2000"] = 0] = "From2000";
    PrecessDirection[PrecessDirection["Into2000"] = 1] = "Into2000";
})(PrecessDirection || (PrecessDirection = {}));
const Planet = {
    Mercury: { OrbitalPeriod: 87.969 },
    Venus: { OrbitalPeriod: 224.701 },
    Earth: { OrbitalPeriod: 365.256 },
    Mars: { OrbitalPeriod: 686.980 },
    Jupiter: { OrbitalPeriod: 4332.589 },
    Saturn: { OrbitalPeriod: 10759.22 },
    Uranus: { OrbitalPeriod: 30685.4 },
    Neptune: { OrbitalPeriod: 60189.0 },
    Pluto: { OrbitalPeriod: 90560.0 }
};
/**
 * @brief Returns the mean orbital period of a planet in days.
 *
 * @param {Body} body
 *      One of: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, or Pluto.
 *
 * @returns {number}
 *      The approximate average time it takes for the planet to travel once around the Sun.
 *      The value is expressed in days.
 */
function PlanetOrbitalPeriod(body) {
    if (body in Planet)
        return Planet[body].OrbitalPeriod;
    throw `Unknown orbital period for: ${body}`;
}
exports.PlanetOrbitalPeriod = PlanetOrbitalPeriod;
const vsop = {
    Mercury: [
        [
            [
                [4.40250710144, 0.00000000000, 0.00000000000],
                [0.40989414977, 1.48302034195, 26087.90314157420],
                [0.05046294200, 4.47785489551, 52175.80628314840],
                [0.00855346844, 1.16520322459, 78263.70942472259],
                [0.00165590362, 4.11969163423, 104351.61256629678],
                [0.00034561897, 0.77930768443, 130439.51570787099],
                [0.00007583476, 3.71348404924, 156527.41884944518]
            ],
            [
                [26087.90313685529, 0.00000000000, 0.00000000000],
                [0.01131199811, 6.21874197797, 26087.90314157420],
                [0.00292242298, 3.04449355541, 52175.80628314840],
                [0.00075775081, 6.08568821653, 78263.70942472259],
                [0.00019676525, 2.80965111777, 104351.61256629678]
            ]
        ],
        [
            [
                [0.11737528961, 1.98357498767, 26087.90314157420],
                [0.02388076996, 5.03738959686, 52175.80628314840],
                [0.01222839532, 3.14159265359, 0.00000000000],
                [0.00543251810, 1.79644363964, 78263.70942472259],
                [0.00129778770, 4.83232503958, 104351.61256629678],
                [0.00031866927, 1.58088495658, 130439.51570787099],
                [0.00007963301, 4.60972126127, 156527.41884944518]
            ],
            [
                [0.00274646065, 3.95008450011, 26087.90314157420],
                [0.00099737713, 3.14159265359, 0.00000000000]
            ]
        ],
        [
            [
                [0.39528271651, 0.00000000000, 0.00000000000],
                [0.07834131818, 6.19233722598, 26087.90314157420],
                [0.00795525558, 2.95989690104, 52175.80628314840],
                [0.00121281764, 6.01064153797, 78263.70942472259],
                [0.00021921969, 2.77820093972, 104351.61256629678],
                [0.00004354065, 5.82894543774, 130439.51570787099]
            ],
            [
                [0.00217347740, 4.65617158665, 26087.90314157420],
                [0.00044141826, 1.42385544001, 52175.80628314840]
            ]
        ]
    ],
    Venus: [
        [
            [
                [3.17614666774, 0.00000000000, 0.00000000000],
                [0.01353968419, 5.59313319619, 10213.28554621100],
                [0.00089891645, 5.30650047764, 20426.57109242200],
                [0.00005477194, 4.41630661466, 7860.41939243920],
                [0.00003455741, 2.69964447820, 11790.62908865880],
                [0.00002372061, 2.99377542079, 3930.20969621960],
                [0.00001317168, 5.18668228402, 26.29831979980],
                [0.00001664146, 4.25018630147, 1577.34354244780],
                [0.00001438387, 4.15745084182, 9683.59458111640],
                [0.00001200521, 6.15357116043, 30639.85663863300]
            ],
            [
                [10213.28554621638, 0.00000000000, 0.00000000000],
                [0.00095617813, 2.46406511110, 10213.28554621100],
                [0.00007787201, 0.62478482220, 20426.57109242200]
            ]
        ],
        [
            [
                [0.05923638472, 0.26702775812, 10213.28554621100],
                [0.00040107978, 1.14737178112, 20426.57109242200],
                [0.00032814918, 3.14159265359, 0.00000000000]
            ],
            [
                [0.00287821243, 1.88964962838, 10213.28554621100]
            ]
        ],
        [
            [
                [0.72334820891, 0.00000000000, 0.00000000000],
                [0.00489824182, 4.02151831717, 10213.28554621100],
                [0.00001658058, 4.90206728031, 20426.57109242200],
                [0.00001378043, 1.12846591367, 11790.62908865880],
                [0.00001632096, 2.84548795207, 7860.41939243920],
                [0.00000498395, 2.58682193892, 9683.59458111640],
                [0.00000221985, 2.01346696541, 19367.18916223280],
                [0.00000237454, 2.55136053886, 15720.83878487840]
            ],
            [
                [0.00034551041, 0.89198706276, 10213.28554621100]
            ]
        ]
    ],
    Earth: [
        [
            [
                [1.75347045673, 0.00000000000, 0.00000000000],
                [0.03341656453, 4.66925680415, 6283.07584999140],
                [0.00034894275, 4.62610242189, 12566.15169998280],
                [0.00003417572, 2.82886579754, 3.52311834900],
                [0.00003497056, 2.74411783405, 5753.38488489680],
                [0.00003135899, 3.62767041756, 77713.77146812050],
                [0.00002676218, 4.41808345438, 7860.41939243920],
                [0.00002342691, 6.13516214446, 3930.20969621960],
                [0.00001273165, 2.03709657878, 529.69096509460],
                [0.00001324294, 0.74246341673, 11506.76976979360],
                [0.00000901854, 2.04505446477, 26.29831979980],
                [0.00001199167, 1.10962946234, 1577.34354244780],
                [0.00000857223, 3.50849152283, 398.14900340820],
                [0.00000779786, 1.17882681962, 5223.69391980220],
                [0.00000990250, 5.23268072088, 5884.92684658320],
                [0.00000753141, 2.53339052847, 5507.55323866740],
                [0.00000505267, 4.58292599973, 18849.22754997420],
                [0.00000492392, 4.20505711826, 775.52261132400],
                [0.00000356672, 2.91954114478, 0.06731030280],
                [0.00000284125, 1.89869240932, 796.29800681640],
                [0.00000242879, 0.34481445893, 5486.77784317500],
                [0.00000317087, 5.84901948512, 11790.62908865880],
                [0.00000271112, 0.31486255375, 10977.07880469900],
                [0.00000206217, 4.80646631478, 2544.31441988340],
                [0.00000205478, 1.86953770281, 5573.14280143310],
                [0.00000202318, 2.45767790232, 6069.77675455340],
                [0.00000126225, 1.08295459501, 20.77539549240],
                [0.00000155516, 0.83306084617, 213.29909543800]
            ],
            [
                [6283.07584999140, 0.00000000000, 0.00000000000],
                [0.00206058863, 2.67823455808, 6283.07584999140],
                [0.00004303419, 2.63512233481, 12566.15169998280]
            ],
            [
                [0.00008721859, 1.07253635559, 6283.07584999140]
            ]
        ],
        [
            [],
            [
                [0.00227777722, 3.41376620530, 6283.07584999140],
                [0.00003805678, 3.37063423795, 12566.15169998280]
            ]
        ],
        [
            [
                [1.00013988784, 0.00000000000, 0.00000000000],
                [0.01670699632, 3.09846350258, 6283.07584999140],
                [0.00013956024, 3.05524609456, 12566.15169998280],
                [0.00003083720, 5.19846674381, 77713.77146812050],
                [0.00001628463, 1.17387558054, 5753.38488489680],
                [0.00001575572, 2.84685214877, 7860.41939243920],
                [0.00000924799, 5.45292236722, 11506.76976979360],
                [0.00000542439, 4.56409151453, 3930.20969621960],
                [0.00000472110, 3.66100022149, 5884.92684658320],
                [0.00000085831, 1.27079125277, 161000.68573767410],
                [0.00000057056, 2.01374292245, 83996.84731811189],
                [0.00000055736, 5.24159799170, 71430.69561812909],
                [0.00000174844, 3.01193636733, 18849.22754997420],
                [0.00000243181, 4.27349530790, 11790.62908865880]
            ],
            [
                [0.00103018607, 1.10748968172, 6283.07584999140],
                [0.00001721238, 1.06442300386, 12566.15169998280]
            ],
            [
                [0.00004359385, 5.78455133808, 6283.07584999140]
            ]
        ]
    ],
    Mars: [
        [
            [
                [6.20347711581, 0.00000000000, 0.00000000000],
                [0.18656368093, 5.05037100270, 3340.61242669980],
                [0.01108216816, 5.40099836344, 6681.22485339960],
                [0.00091798406, 5.75478744667, 10021.83728009940],
                [0.00027744987, 5.97049513147, 3.52311834900],
                [0.00010610235, 2.93958560338, 2281.23049651060],
                [0.00012315897, 0.84956094002, 2810.92146160520],
                [0.00008926784, 4.15697846427, 0.01725365220],
                [0.00008715691, 6.11005153139, 13362.44970679920],
                [0.00006797556, 0.36462229657, 398.14900340820],
                [0.00007774872, 3.33968761376, 5621.84292321040],
                [0.00003575078, 1.66186505710, 2544.31441988340],
                [0.00004161108, 0.22814971327, 2942.46342329160],
                [0.00003075252, 0.85696614132, 191.44826611160],
                [0.00002628117, 0.64806124465, 3337.08930835080],
                [0.00002937546, 6.07893711402, 0.06731030280],
                [0.00002389414, 5.03896442664, 796.29800681640],
                [0.00002579844, 0.02996736156, 3344.13554504880],
                [0.00001528141, 1.14979301996, 6151.53388830500],
                [0.00001798806, 0.65634057445, 529.69096509460],
                [0.00001264357, 3.62275122593, 5092.15195811580],
                [0.00001286228, 3.06796065034, 2146.16541647520],
                [0.00001546404, 2.91579701718, 1751.53953141600],
                [0.00001024902, 3.69334099279, 8962.45534991020],
                [0.00000891566, 0.18293837498, 16703.06213349900],
                [0.00000858759, 2.40093811940, 2914.01423582380],
                [0.00000832715, 2.46418619474, 3340.59517304760],
                [0.00000832720, 4.49495782139, 3340.62968035200],
                [0.00000712902, 3.66335473479, 1059.38193018920],
                [0.00000748723, 3.82248614017, 155.42039943420],
                [0.00000723861, 0.67497311481, 3738.76143010800],
                [0.00000635548, 2.92182225127, 8432.76438481560],
                [0.00000655162, 0.48864064125, 3127.31333126180],
                [0.00000550474, 3.81001042328, 0.98032106820],
                [0.00000552750, 4.47479317037, 1748.01641306700],
                [0.00000425966, 0.55364317304, 6283.07584999140],
                [0.00000415131, 0.49662285038, 213.29909543800],
                [0.00000472167, 3.62547124025, 1194.44701022460],
                [0.00000306551, 0.38052848348, 6684.74797174860],
                [0.00000312141, 0.99853944405, 6677.70173505060],
                [0.00000293198, 4.22131299634, 20.77539549240],
                [0.00000302375, 4.48618007156, 3532.06069281140],
                [0.00000274027, 0.54222167059, 3340.54511639700],
                [0.00000281079, 5.88163521788, 1349.86740965880],
                [0.00000231183, 1.28242156993, 3870.30339179440],
                [0.00000283602, 5.76885434940, 3149.16416058820],
                [0.00000236117, 5.75503217933, 3333.49887969900],
                [0.00000274033, 0.13372524985, 3340.67973700260],
                [0.00000299395, 2.78323740866, 6254.62666252360]
            ],
            [
                [3340.61242700512, 0.00000000000, 0.00000000000],
                [0.01457554523, 3.60433733236, 3340.61242669980],
                [0.00168414711, 3.92318567804, 6681.22485339960],
                [0.00020622975, 4.26108844583, 10021.83728009940],
                [0.00003452392, 4.73210393190, 3.52311834900],
                [0.00002586332, 4.60670058555, 13362.44970679920],
                [0.00000841535, 4.45864030426, 2281.23049651060]
            ],
            [
                [0.00058152577, 2.04961712429, 3340.61242669980],
                [0.00013459579, 2.45738706163, 6681.22485339960]
            ]
        ],
        [
            [
                [0.03197134986, 3.76832042431, 3340.61242669980],
                [0.00298033234, 4.10616996305, 6681.22485339960],
                [0.00289104742, 0.00000000000, 0.00000000000],
                [0.00031365539, 4.44651053090, 10021.83728009940],
                [0.00003484100, 4.78812549260, 13362.44970679920]
            ],
            [
                [0.00217310991, 6.04472194776, 3340.61242669980],
                [0.00020976948, 3.14159265359, 0.00000000000],
                [0.00012834709, 1.60810667915, 6681.22485339960]
            ]
        ],
        [
            [
                [1.53033488271, 0.00000000000, 0.00000000000],
                [0.14184953160, 3.47971283528, 3340.61242669980],
                [0.00660776362, 3.81783443019, 6681.22485339960],
                [0.00046179117, 4.15595316782, 10021.83728009940],
                [0.00008109733, 5.55958416318, 2810.92146160520],
                [0.00007485318, 1.77239078402, 5621.84292321040],
                [0.00005523191, 1.36436303770, 2281.23049651060],
                [0.00003825160, 4.49407183687, 13362.44970679920],
                [0.00002306537, 0.09081579001, 2544.31441988340],
                [0.00001999396, 5.36059617709, 3337.08930835080],
                [0.00002484394, 4.92545639920, 2942.46342329160],
                [0.00001960195, 4.74249437639, 3344.13554504880],
                [0.00001167119, 2.11260868341, 5092.15195811580],
                [0.00001102816, 5.00908403998, 398.14900340820],
                [0.00000899066, 4.40791133207, 529.69096509460],
                [0.00000992252, 5.83861961952, 6151.53388830500],
                [0.00000807354, 2.10217065501, 1059.38193018920],
                [0.00000797915, 3.44839203899, 796.29800681640],
                [0.00000740975, 1.49906336885, 2146.16541647520]
            ],
            [
                [0.01107433345, 2.03250524857, 3340.61242669980],
                [0.00103175887, 2.37071847807, 6681.22485339960],
                [0.00012877200, 0.00000000000, 0.00000000000],
                [0.00010815880, 2.70888095665, 10021.83728009940]
            ],
            [
                [0.00044242249, 0.47930604954, 3340.61242669980],
                [0.00008138042, 0.86998389204, 6681.22485339960]
            ]
        ]
    ],
    Jupiter: [
        [
            [
                [0.59954691494, 0.00000000000, 0.00000000000],
                [0.09695898719, 5.06191793158, 529.69096509460],
                [0.00573610142, 1.44406205629, 7.11354700080],
                [0.00306389205, 5.41734730184, 1059.38193018920],
                [0.00097178296, 4.14264726552, 632.78373931320],
                [0.00072903078, 3.64042916389, 522.57741809380],
                [0.00064263975, 3.41145165351, 103.09277421860],
                [0.00039806064, 2.29376740788, 419.48464387520],
                [0.00038857767, 1.27231755835, 316.39186965660],
                [0.00027964629, 1.78454591820, 536.80451209540],
                [0.00013589730, 5.77481040790, 1589.07289528380],
                [0.00008246349, 3.58227925840, 206.18554843720],
                [0.00008768704, 3.63000308199, 949.17560896980],
                [0.00007368042, 5.08101194270, 735.87651353180],
                [0.00006263150, 0.02497628807, 213.29909543800],
                [0.00006114062, 4.51319998626, 1162.47470440780],
                [0.00004905396, 1.32084470588, 110.20632121940],
                [0.00005305285, 1.30671216791, 14.22709400160],
                [0.00005305441, 4.18625634012, 1052.26838318840],
                [0.00004647248, 4.69958103684, 3.93215326310],
                [0.00003045023, 4.31676431084, 426.59819087600],
                [0.00002609999, 1.56667394063, 846.08283475120],
                [0.00002028191, 1.06376530715, 3.18139373770],
                [0.00001764763, 2.14148655117, 1066.49547719000],
                [0.00001722972, 3.88036268267, 1265.56747862640],
                [0.00001920945, 0.97168196472, 639.89728631400],
                [0.00001633223, 3.58201833555, 515.46387109300],
                [0.00001431999, 4.29685556046, 625.67019231240],
                [0.00000973272, 4.09764549134, 95.97922721780]
            ],
            [
                [529.69096508814, 0.00000000000, 0.00000000000],
                [0.00489503243, 4.22082939470, 529.69096509460],
                [0.00228917222, 6.02646855621, 7.11354700080],
                [0.00030099479, 4.54540782858, 1059.38193018920],
                [0.00020720920, 5.45943156902, 522.57741809380],
                [0.00012103653, 0.16994816098, 536.80451209540],
                [0.00006067987, 4.42422292017, 103.09277421860],
                [0.00005433968, 3.98480737746, 419.48464387520],
                [0.00004237744, 5.89008707199, 14.22709400160]
            ],
            [
                [0.00047233601, 4.32148536482, 7.11354700080],
                [0.00030649436, 2.92977788700, 529.69096509460],
                [0.00014837605, 3.14159265359, 0.00000000000]
            ]
        ],
        [
            [
                [0.02268615702, 3.55852606721, 529.69096509460],
                [0.00109971634, 3.90809347197, 1059.38193018920],
                [0.00110090358, 0.00000000000, 0.00000000000],
                [0.00008101428, 3.60509572885, 522.57741809380],
                [0.00006043996, 4.25883108339, 1589.07289528380],
                [0.00006437782, 0.30627119215, 536.80451209540]
            ],
            [
                [0.00078203446, 1.52377859742, 529.69096509460]
            ]
        ],
        [
            [
                [5.20887429326, 0.00000000000, 0.00000000000],
                [0.25209327119, 3.49108639871, 529.69096509460],
                [0.00610599976, 3.84115365948, 1059.38193018920],
                [0.00282029458, 2.57419881293, 632.78373931320],
                [0.00187647346, 2.07590383214, 522.57741809380],
                [0.00086792905, 0.71001145545, 419.48464387520],
                [0.00072062974, 0.21465724607, 536.80451209540],
                [0.00065517248, 5.97995884790, 316.39186965660],
                [0.00029134542, 1.67759379655, 103.09277421860],
                [0.00030135335, 2.16132003734, 949.17560896980],
                [0.00023453271, 3.54023522184, 735.87651353180],
                [0.00022283743, 4.19362594399, 1589.07289528380],
                [0.00023947298, 0.27458037480, 7.11354700080],
                [0.00013032614, 2.96042965363, 1162.47470440780],
                [0.00009703360, 1.90669633585, 206.18554843720],
                [0.00012749023, 2.71550286592, 1052.26838318840],
                [0.00007057931, 2.18184839926, 1265.56747862640],
                [0.00006137703, 6.26418240033, 846.08283475120],
                [0.00002616976, 2.00994012876, 1581.95934828300]
            ],
            [
                [0.01271801520, 2.64937512894, 529.69096509460],
                [0.00061661816, 3.00076460387, 1059.38193018920],
                [0.00053443713, 3.89717383175, 522.57741809380],
                [0.00031185171, 4.88276958012, 536.80451209540],
                [0.00041390269, 0.00000000000, 0.00000000000]
            ]
        ]
    ],
    Saturn: [
        [
            [
                [0.87401354025, 0.00000000000, 0.00000000000],
                [0.11107659762, 3.96205090159, 213.29909543800],
                [0.01414150957, 4.58581516874, 7.11354700080],
                [0.00398379389, 0.52112032699, 206.18554843720],
                [0.00350769243, 3.30329907896, 426.59819087600],
                [0.00206816305, 0.24658372002, 103.09277421860],
                [0.00079271300, 3.84007056878, 220.41264243880],
                [0.00023990355, 4.66976924553, 110.20632121940],
                [0.00016573588, 0.43719228296, 419.48464387520],
                [0.00014906995, 5.76903183869, 316.39186965660],
                [0.00015820290, 0.93809155235, 632.78373931320],
                [0.00014609559, 1.56518472000, 3.93215326310],
                [0.00013160301, 4.44891291899, 14.22709400160],
                [0.00015053543, 2.71669915667, 639.89728631400],
                [0.00013005299, 5.98119023644, 11.04570026390],
                [0.00010725067, 3.12939523827, 202.25339517410],
                [0.00005863206, 0.23656938524, 529.69096509460],
                [0.00005227757, 4.20783365759, 3.18139373770],
                [0.00006126317, 1.76328667907, 277.03499374140],
                [0.00005019687, 3.17787728405, 433.71173787680],
                [0.00004592550, 0.61977744975, 199.07200143640],
                [0.00004005867, 2.24479718502, 63.73589830340],
                [0.00002953796, 0.98280366998, 95.97922721780],
                [0.00003873670, 3.22283226966, 138.51749687070],
                [0.00002461186, 2.03163875071, 735.87651353180],
                [0.00003269484, 0.77492638211, 949.17560896980],
                [0.00001758145, 3.26580109940, 522.57741809380],
                [0.00001640172, 5.50504453050, 846.08283475120],
                [0.00001391327, 4.02333150505, 323.50541665740],
                [0.00001580648, 4.37265307169, 309.27832265580],
                [0.00001123498, 2.83726798446, 415.55249061210],
                [0.00001017275, 3.71700135395, 227.52618943960],
                [0.00000848642, 3.19150170830, 209.36694217490]
            ],
            [
                [213.29909521690, 0.00000000000, 0.00000000000],
                [0.01297370862, 1.82834923978, 213.29909543800],
                [0.00564345393, 2.88499717272, 7.11354700080],
                [0.00093734369, 1.06311793502, 426.59819087600],
                [0.00107674962, 2.27769131009, 206.18554843720],
                [0.00040244455, 2.04108104671, 220.41264243880],
                [0.00019941774, 1.27954390470, 103.09277421860],
                [0.00010511678, 2.74880342130, 14.22709400160],
                [0.00006416106, 0.38238295041, 639.89728631400],
                [0.00004848994, 2.43037610229, 419.48464387520],
                [0.00004056892, 2.92133209468, 110.20632121940],
                [0.00003768635, 3.64965330780, 3.93215326310]
            ],
            [
                [0.00116441330, 1.17988132879, 7.11354700080],
                [0.00091841837, 0.07325195840, 213.29909543800],
                [0.00036661728, 0.00000000000, 0.00000000000],
                [0.00015274496, 4.06493179167, 206.18554843720]
            ]
        ],
        [
            [
                [0.04330678039, 3.60284428399, 213.29909543800],
                [0.00240348302, 2.85238489373, 426.59819087600],
                [0.00084745939, 0.00000000000, 0.00000000000],
                [0.00030863357, 3.48441504555, 220.41264243880],
                [0.00034116062, 0.57297307557, 206.18554843720],
                [0.00014734070, 2.11846596715, 639.89728631400],
                [0.00009916667, 5.79003188904, 419.48464387520],
                [0.00006993564, 4.73604689720, 7.11354700080],
                [0.00004807588, 5.43305312061, 316.39186965660]
            ],
            [
                [0.00198927992, 4.93901017903, 213.29909543800],
                [0.00036947916, 3.14159265359, 0.00000000000],
                [0.00017966989, 0.51979431110, 426.59819087600]
            ]
        ],
        [
            [
                [9.55758135486, 0.00000000000, 0.00000000000],
                [0.52921382865, 2.39226219573, 213.29909543800],
                [0.01873679867, 5.23549604660, 206.18554843720],
                [0.01464663929, 1.64763042902, 426.59819087600],
                [0.00821891141, 5.93520042303, 316.39186965660],
                [0.00547506923, 5.01532618980, 103.09277421860],
                [0.00371684650, 2.27114821115, 220.41264243880],
                [0.00361778765, 3.13904301847, 7.11354700080],
                [0.00140617506, 5.70406606781, 632.78373931320],
                [0.00108974848, 3.29313390175, 110.20632121940],
                [0.00069006962, 5.94099540992, 419.48464387520],
                [0.00061053367, 0.94037691801, 639.89728631400],
                [0.00048913294, 1.55733638681, 202.25339517410],
                [0.00034143772, 0.19519102597, 277.03499374140],
                [0.00032401773, 5.47084567016, 949.17560896980],
                [0.00020936596, 0.46349251129, 735.87651353180],
                [0.00009796004, 5.20477537945, 1265.56747862640],
                [0.00011993338, 5.98050967385, 846.08283475120],
                [0.00020839300, 1.52102476129, 433.71173787680],
                [0.00015298404, 3.05943814940, 529.69096509460],
                [0.00006465823, 0.17732249942, 1052.26838318840],
                [0.00011380257, 1.73105427040, 522.57741809380],
                [0.00003419618, 4.94550542171, 1581.95934828300]
            ],
            [
                [0.06182981340, 0.25843511480, 213.29909543800],
                [0.00506577242, 0.71114625261, 206.18554843720],
                [0.00341394029, 5.79635741658, 426.59819087600],
                [0.00188491195, 0.47215589652, 220.41264243880],
                [0.00186261486, 3.14159265359, 0.00000000000],
                [0.00143891146, 1.40744822888, 7.11354700080]
            ],
            [
                [0.00436902572, 4.78671677509, 213.29909543800]
            ]
        ]
    ],
    Uranus: [
        [
            [
                [5.48129294297, 0.00000000000, 0.00000000000],
                [0.09260408234, 0.89106421507, 74.78159856730],
                [0.01504247898, 3.62719260920, 1.48447270830],
                [0.00365981674, 1.89962179044, 73.29712585900],
                [0.00272328168, 3.35823706307, 149.56319713460],
                [0.00070328461, 5.39254450063, 63.73589830340],
                [0.00068892678, 6.09292483287, 76.26607127560],
                [0.00061998615, 2.26952066061, 2.96894541660],
                [0.00061950719, 2.85098872691, 11.04570026390],
                [0.00026468770, 3.14152083966, 71.81265315070],
                [0.00025710476, 6.11379840493, 454.90936652730],
                [0.00021078850, 4.36059339067, 148.07872442630],
                [0.00017818647, 1.74436930289, 36.64856292950],
                [0.00014613507, 4.73732166022, 3.93215326310],
                [0.00011162509, 5.82681796350, 224.34479570190],
                [0.00010997910, 0.48865004018, 138.51749687070],
                [0.00009527478, 2.95516862826, 35.16409022120],
                [0.00007545601, 5.23626582400, 109.94568878850],
                [0.00004220241, 3.23328220918, 70.84944530420],
                [0.00004051900, 2.27755017300, 151.04766984290],
                [0.00003354596, 1.06549007380, 4.45341812490],
                [0.00002926718, 4.62903718891, 9.56122755560],
                [0.00003490340, 5.48306144511, 146.59425171800],
                [0.00003144069, 4.75199570434, 77.75054398390],
                [0.00002922333, 5.35235361027, 85.82729883120],
                [0.00002272788, 4.36600400036, 70.32818044240],
                [0.00002051219, 1.51773566586, 0.11187458460],
                [0.00002148602, 0.60745949945, 38.13303563780],
                [0.00001991643, 4.92437588682, 277.03499374140],
                [0.00001376226, 2.04283539351, 65.22037101170],
                [0.00001666902, 3.62744066769, 380.12776796000],
                [0.00001284107, 3.11347961505, 202.25339517410],
                [0.00001150429, 0.93343589092, 3.18139373770],
                [0.00001533221, 2.58594681212, 52.69019803950],
                [0.00001281604, 0.54271272721, 222.86032299360],
                [0.00001372139, 4.19641530878, 111.43016149680],
                [0.00001221029, 0.19900650030, 108.46121608020],
                [0.00000946181, 1.19253165736, 127.47179660680],
                [0.00001150989, 4.17898916639, 33.67961751290]
            ],
            [
                [74.78159860910, 0.00000000000, 0.00000000000],
                [0.00154332863, 5.24158770553, 74.78159856730],
                [0.00024456474, 1.71260334156, 1.48447270830],
                [0.00009258442, 0.42829732350, 11.04570026390],
                [0.00008265977, 1.50218091379, 63.73589830340],
                [0.00009150160, 1.41213765216, 149.56319713460]
            ]
        ],
        [
            [
                [0.01346277648, 2.61877810547, 74.78159856730],
                [0.00062341400, 5.08111189648, 149.56319713460],
                [0.00061601196, 3.14159265359, 0.00000000000],
                [0.00009963722, 1.61603805646, 76.26607127560],
                [0.00009926160, 0.57630380333, 73.29712585900]
            ],
            [
                [0.00034101978, 0.01321929936, 74.78159856730]
            ]
        ],
        [
            [
                [19.21264847206, 0.00000000000, 0.00000000000],
                [0.88784984413, 5.60377527014, 74.78159856730],
                [0.03440836062, 0.32836099706, 73.29712585900],
                [0.02055653860, 1.78295159330, 149.56319713460],
                [0.00649322410, 4.52247285911, 76.26607127560],
                [0.00602247865, 3.86003823674, 63.73589830340],
                [0.00496404167, 1.40139935333, 454.90936652730],
                [0.00338525369, 1.58002770318, 138.51749687070],
                [0.00243509114, 1.57086606044, 71.81265315070],
                [0.00190522303, 1.99809394714, 1.48447270830],
                [0.00161858838, 2.79137786799, 148.07872442630],
                [0.00143706183, 1.38368544947, 11.04570026390],
                [0.00093192405, 0.17437220467, 36.64856292950],
                [0.00071424548, 4.24509236074, 224.34479570190],
                [0.00089806014, 3.66105364565, 109.94568878850],
                [0.00039009723, 1.66971401684, 70.84944530420],
                [0.00046677296, 1.39976401694, 35.16409022120],
                [0.00039025624, 3.36234773834, 277.03499374140],
                [0.00036755274, 3.88649278513, 146.59425171800],
                [0.00030348723, 0.70100838798, 151.04766984290],
                [0.00029156413, 3.18056336700, 77.75054398390],
                [0.00022637073, 0.72518687029, 529.69096509460],
                [0.00011959076, 1.75043392140, 984.60033162190],
                [0.00025620756, 5.25656086672, 380.12776796000]
            ],
            [
                [0.01479896629, 3.67205697578, 74.78159856730]
            ]
        ]
    ],
    Neptune: [
        [
            [
                [5.31188633046, 0.00000000000, 0.00000000000],
                [0.01798475530, 2.90101273890, 38.13303563780],
                [0.01019727652, 0.48580922867, 1.48447270830],
                [0.00124531845, 4.83008090676, 36.64856292950],
                [0.00042064466, 5.41054993053, 2.96894541660],
                [0.00037714584, 6.09221808686, 35.16409022120],
                [0.00033784738, 1.24488874087, 76.26607127560],
                [0.00016482741, 0.00007727998, 491.55792945680],
                [0.00009198584, 4.93747051954, 39.61750834610],
                [0.00008994250, 0.27462171806, 175.16605980020]
            ],
            [
                [38.13303563957, 0.00000000000, 0.00000000000],
                [0.00016604172, 4.86323329249, 1.48447270830],
                [0.00015744045, 2.27887427527, 38.13303563780]
            ]
        ],
        [
            [
                [0.03088622933, 1.44104372644, 38.13303563780],
                [0.00027780087, 5.91271884599, 76.26607127560],
                [0.00027623609, 0.00000000000, 0.00000000000],
                [0.00015355489, 2.52123799551, 36.64856292950],
                [0.00015448133, 3.50877079215, 39.61750834610]
            ]
        ],
        [
            [
                [30.07013205828, 0.00000000000, 0.00000000000],
                [0.27062259632, 1.32999459377, 38.13303563780],
                [0.01691764014, 3.25186135653, 36.64856292950],
                [0.00807830553, 5.18592878704, 1.48447270830],
                [0.00537760510, 4.52113935896, 35.16409022120],
                [0.00495725141, 1.57105641650, 491.55792945680],
                [0.00274571975, 1.84552258866, 175.16605980020],
                [0.00012012320, 1.92059384991, 1021.24889455140],
                [0.00121801746, 5.79754470298, 76.26607127560],
                [0.00100896068, 0.37702724930, 73.29712585900],
                [0.00135134092, 3.37220609835, 39.61750834610],
                [0.00007571796, 1.07149207335, 388.46515523820]
            ]
        ]
    ]
};
function DeltaT_EspenakMeeus(ut) {
    var u, u2, u3, u4, u5, u6, u7;
    /*
        Fred Espenak writes about Delta-T generically here:
        https://eclipse.gsfc.nasa.gov/SEhelp/deltaT.html
        https://eclipse.gsfc.nasa.gov/SEhelp/deltat2004.html

        He provides polynomial approximations for distant years here:
        https://eclipse.gsfc.nasa.gov/SEhelp/deltatpoly2004.html

        They start with a year value 'y' such that y=2000 corresponds
        to the UTC Date 15-January-2000. Convert difference in days
        to mean tropical years.
    */
    const y = 2000 + ((ut - 14) / DAYS_PER_TROPICAL_YEAR);
    if (y < -500) {
        u = (y - 1820) / 100;
        return -20 + (32 * u * u);
    }
    if (y < 500) {
        u = y / 100;
        u2 = u * u;
        u3 = u * u2;
        u4 = u2 * u2;
        u5 = u2 * u3;
        u6 = u3 * u3;
        return 10583.6 - 1014.41 * u + 33.78311 * u2 - 5.952053 * u3 - 0.1798452 * u4 + 0.022174192 * u5 + 0.0090316521 * u6;
    }
    if (y < 1600) {
        u = (y - 1000) / 100;
        u2 = u * u;
        u3 = u * u2;
        u4 = u2 * u2;
        u5 = u2 * u3;
        u6 = u3 * u3;
        return 1574.2 - 556.01 * u + 71.23472 * u2 + 0.319781 * u3 - 0.8503463 * u4 - 0.005050998 * u5 + 0.0083572073 * u6;
    }
    if (y < 1700) {
        u = y - 1600;
        u2 = u * u;
        u3 = u * u2;
        return 120 - 0.9808 * u - 0.01532 * u2 + u3 / 7129.0;
    }
    if (y < 1800) {
        u = y - 1700;
        u2 = u * u;
        u3 = u * u2;
        u4 = u2 * u2;
        return 8.83 + 0.1603 * u - 0.0059285 * u2 + 0.00013336 * u3 - u4 / 1174000;
    }
    if (y < 1860) {
        u = y - 1800;
        u2 = u * u;
        u3 = u * u2;
        u4 = u2 * u2;
        u5 = u2 * u3;
        u6 = u3 * u3;
        u7 = u3 * u4;
        return 13.72 - 0.332447 * u + 0.0068612 * u2 + 0.0041116 * u3 - 0.00037436 * u4 + 0.0000121272 * u5 - 0.0000001699 * u6 + 0.000000000875 * u7;
    }
    if (y < 1900) {
        u = y - 1860;
        u2 = u * u;
        u3 = u * u2;
        u4 = u2 * u2;
        u5 = u2 * u3;
        return 7.62 + 0.5737 * u - 0.251754 * u2 + 0.01680668 * u3 - 0.0004473624 * u4 + u5 / 233174;
    }
    if (y < 1920) {
        u = y - 1900;
        u2 = u * u;
        u3 = u * u2;
        u4 = u2 * u2;
        return -2.79 + 1.494119 * u - 0.0598939 * u2 + 0.0061966 * u3 - 0.000197 * u4;
    }
    if (y < 1941) {
        u = y - 1920;
        u2 = u * u;
        u3 = u * u2;
        return 21.20 + 0.84493 * u - 0.076100 * u2 + 0.0020936 * u3;
    }
    if (y < 1961) {
        u = y - 1950;
        u2 = u * u;
        u3 = u * u2;
        return 29.07 + 0.407 * u - u2 / 233 + u3 / 2547;
    }
    if (y < 1986) {
        u = y - 1975;
        u2 = u * u;
        u3 = u * u2;
        return 45.45 + 1.067 * u - u2 / 260 - u3 / 718;
    }
    if (y < 2005) {
        u = y - 2000;
        u2 = u * u;
        u3 = u * u2;
        u4 = u2 * u2;
        u5 = u2 * u3;
        return 63.86 + 0.3345 * u - 0.060374 * u2 + 0.0017275 * u3 + 0.000651814 * u4 + 0.00002373599 * u5;
    }
    if (y < 2050) {
        u = y - 2000;
        return 62.92 + 0.32217 * u + 0.005589 * u * u;
    }
    if (y < 2150) {
        u = (y - 1820) / 100;
        return -20 + 32 * u * u - 0.5628 * (2150 - y);
    }
    /* all years after 2150 */
    u = (y - 1820) / 100;
    return -20 + (32 * u * u);
}
exports.DeltaT_EspenakMeeus = DeltaT_EspenakMeeus;
function DeltaT_JplHorizons(ut) {
    return DeltaT_EspenakMeeus(Math.min(ut, 17.0 * DAYS_PER_TROPICAL_YEAR));
}
exports.DeltaT_JplHorizons = DeltaT_JplHorizons;
let DeltaT = DeltaT_EspenakMeeus;
function SetDeltaTFunction(func) {
    DeltaT = func;
}
exports.SetDeltaTFunction = SetDeltaTFunction;
/**
 * @ignore
 *
 * @brief Calculates Terrestrial Time (TT) from Universal Time (UT).
 *
 * @param {number} ut
 *      The Universal Time expressed as a floating point number of days since the 2000.0 epoch.
 *
 * @returns {number}
 *      A Terrestrial Time expressed as a floating point number of days since the 2000.0 epoch.
 */
function TerrestrialTime(ut) {
    return ut + DeltaT(ut) / 86400;
}
/**
 * @brief The date and time of an astronomical observation.
 *
 * Objects of type `AstroTime` are used throughout the internals
 * of the Astronomy library, and are included in certain return objects.
 * Use the constructor or the {@link MakeTime} function to create an `AstroTime` object.
 *
 * @property {Date} date
 *      The JavaScript Date object for the given date and time.
 *      This Date corresponds to the numeric day value stored in the `ut` property.
 *
 * @property {number} ut
 *      Universal Time (UT1/UTC) in fractional days since the J2000 epoch.
 *      Universal Time represents time measured with respect to the Earth's rotation,
 *      tracking mean solar days.
 *      The Astronomy library approximates UT1 and UTC as being the same thing.
 *      This gives sufficient accuracy for the precision requirements of this project.
 *
 * @property {number} tt
 *      Terrestrial Time in fractional days since the J2000 epoch.
 *      TT represents a continuously flowing ephemeris timescale independent of
 *      any variations of the Earth's rotation, and is adjusted from UT
 *      using a best-fit piecewise polynomial model devised by
 *      [Espenak and Meeus](https://eclipse.gsfc.nasa.gov/SEhelp/deltatpoly2004.html).
 */
class AstroTime {
    /**
     * @param {FlexibleDateTime} date
     *      A JavaScript Date object, a numeric UTC value expressed in J2000 days, or another AstroTime object.
     */
    constructor(date) {
        if (date instanceof AstroTime) {
            // Construct a clone of the AstroTime passed in.
            this.date = date.date;
            this.ut = date.ut;
            this.tt = date.tt;
            return;
        }
        const MillisPerDay = 1000 * 3600 * 24;
        if ((date instanceof Date) && Number.isFinite(date.getTime())) {
            this.date = date;
            this.ut = (date.getTime() - J2000.getTime()) / MillisPerDay;
            this.tt = TerrestrialTime(this.ut);
            return;
        }
        if (Number.isFinite(date)) {
            this.date = new Date(J2000.getTime() + date * MillisPerDay);
            this.ut = date;
            this.tt = TerrestrialTime(this.ut);
            return;
        }
        throw 'Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date.';
    }
    /**
     * @brief Creates an `AstroTime` value from a Terrestrial Time (TT) day value.
     *
     * This function can be used in rare cases where a time must be based
     * on Terrestrial Time (TT) rather than Universal Time (UT).
     * Most developers will want to invoke `new AstroTime(ut)` with a universal time
     * instead of this function, because usually time is based on civil time adjusted
     * by leap seconds to match the Earth's rotation, rather than the uniformly
     * flowing TT used to calculate solar system dynamics. In rare cases
     * where the caller already knows TT, this function is provided to create
     * an `AstroTime` value that can be passed to Astronomy Engine functions.
     *
     * @param {number} tt
     *      The number of days since the J2000 epoch as expressed in Terrestrial Time.
     *
     * @returns {AstroTime}
     *      An `AstroTime` object for the specified terrestrial time.
     */
    static FromTerrestrialTime(tt) {
        let time = new AstroTime(tt);
        for (;;) {
            const err = tt - time.tt;
            if (Math.abs(err) < 1.0e-12)
                return time;
            time = time.AddDays(err);
        }
    }
    /**
     * Formats an `AstroTime` object as an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
     * date/time string in UTC, to millisecond resolution.
     * Example: `2018-08-17T17:22:04.050Z`
     * @returns {string}
     */
    toString() {
        return this.date.toISOString();
    }
    /**
     * Returns a new `AstroTime` object adjusted by the floating point number of days.
     * Does NOT modify the original `AstroTime` object.
     *
     * @param {number} days
     *      The floating point number of days by which to adjust the given date and time.
     *      Positive values adjust the date toward the future, and
     *      negative values adjust the date toward the past.
     *
     * @returns {AstroTime}
     */
    AddDays(days) {
        // This is slightly wrong, but the error is tiny.
        // We really should be adding to TT, not to UT.
        // But using TT would require creating an inverse function for DeltaT,
        // which would be quite a bit of extra calculation.
        // I estimate the error is in practice on the order of 10^(-7)
        // times the value of 'days'.
        // This is based on a typical drift of 1 second per year between UT and TT.
        return new AstroTime(this.ut + days);
    }
}
exports.AstroTime = AstroTime;
function InterpolateTime(time1, time2, fraction) {
    return new AstroTime(time1.ut + fraction * (time2.ut - time1.ut));
}
/**
 * @brief A `Date`, `number`, or `AstroTime` value that specifies the date and time of an astronomical event.
 *
 * `FlexibleDateTime` is a placeholder type that represents three different types
 * that may be passed to many Astronomy Engine functions: a JavaScript `Date` object,
 * a number representing the real-valued number of UT days since the J2000 epoch,
 * or an {@link AstroTime} object.
 *
 * This flexibility is for convenience of outside callers.
 * Internally, Astronomy Engine always converts a `FlexibleDateTime` parameter
 * to an `AstroTime` object by calling {@link MakeTime}.
 *
 * @typedef {Date | number | AstroTime} FlexibleDateTime
 */
/**
 * @brief Converts multiple date/time formats to `AstroTime` format.
 *
 * Given a Date object or a number days since noon (12:00) on January 1, 2000 (UTC),
 * this function creates an {@link AstroTime} object.
 *
 * Given an {@link AstroTime} object, returns the same object unmodified.
 * Use of this function is not required for any of the other exposed functions in this library,
 * because they all guarantee converting date/time parameters to `AstroTime`
 * as needed. However, it may be convenient for callers who need to understand
 * the difference between UTC and TT (Terrestrial Time). In some use cases,
 * converting once to `AstroTime` format and passing the result into multiple
 * function calls may be more efficient than passing in native JavaScript Date objects.
 *
 * @param {FlexibleDateTime} date
 *      A Date object, a number of UTC days since the J2000 epoch (noon on January 1, 2000),
 *      or an AstroTime object. See remarks above.
 *
 * @returns {AstroTime}
 */
function MakeTime(date) {
    if (date instanceof AstroTime) {
        return date;
    }
    return new AstroTime(date);
}
exports.MakeTime = MakeTime;
function iau2000b(time) {
    function mod(x) {
        return (x % ASEC360) * ASEC2RAD;
    }
    const t = time.tt / 36525;
    const elp = mod(1287104.79305 + t * 129596581.0481);
    const f = mod(335779.526232 + t * 1739527262.8478);
    const d = mod(1072260.70369 + t * 1602961601.2090);
    const om = mod(450160.398036 - t * 6962890.5431);
    let sarg = Math.sin(om);
    let carg = Math.cos(om);
    let dp = (-172064161.0 - 174666.0 * t) * sarg + 33386.0 * carg;
    let de = (92052331.0 + 9086.0 * t) * carg + 15377.0 * sarg;
    let arg = 2.0 * (f - d + om);
    sarg = Math.sin(arg);
    carg = Math.cos(arg);
    dp += (-13170906.0 - 1675.0 * t) * sarg - 13696.0 * carg;
    de += (5730336.0 - 3015.0 * t) * carg - 4587.0 * sarg;
    arg = 2.0 * (f + om);
    sarg = Math.sin(arg);
    carg = Math.cos(arg);
    dp += (-2276413.0 - 234.0 * t) * sarg + 2796.0 * carg;
    de += (978459.0 - 485.0 * t) * carg + 1374.0 * sarg;
    arg = 2.0 * om;
    sarg = Math.sin(arg);
    carg = Math.cos(arg);
    dp += (2074554.0 + 207.0 * t) * sarg - 698.0 * carg;
    de += (-897492.0 + 470.0 * t) * carg - 291.0 * sarg;
    sarg = Math.sin(elp);
    carg = Math.cos(elp);
    dp += (1475877.0 - 3633.0 * t) * sarg + 11817.0 * carg;
    de += (73871.0 - 184.0 * t) * carg - 1924.0 * sarg;
    return {
        dpsi: -0.000135 + (dp * 1.0e-7),
        deps: +0.000388 + (de * 1.0e-7)
    };
}
function mean_obliq(time) {
    var t = time.tt / 36525;
    var asec = (((((-0.0000000434 * t
        - 0.000000576) * t
        + 0.00200340) * t
        - 0.0001831) * t
        - 46.836769) * t + 84381.406);
    return asec / 3600.0;
}
var cache_e_tilt;
function e_tilt(time) {
    if (!cache_e_tilt || Math.abs(cache_e_tilt.tt - time.tt) > 1.0e-6) {
        const nut = iau2000b(time);
        const mean_ob = mean_obliq(time);
        const true_ob = mean_ob + (nut.deps / 3600);
        cache_e_tilt = {
            tt: time.tt,
            dpsi: nut.dpsi,
            deps: nut.deps,
            ee: nut.dpsi * Math.cos(mean_ob * exports.DEG2RAD) / 15,
            mobl: mean_ob,
            tobl: true_ob
        };
    }
    return cache_e_tilt;
}
exports.e_tilt = e_tilt;
function obl_ecl2equ_vec(oblDegrees, pos) {
    const obl = oblDegrees * exports.DEG2RAD;
    const cos_obl = Math.cos(obl);
    const sin_obl = Math.sin(obl);
    return [
        pos[0],
        pos[1] * cos_obl - pos[2] * sin_obl,
        pos[1] * sin_obl + pos[2] * cos_obl
    ];
}
function ecl2equ_vec(time, pos) {
    return obl_ecl2equ_vec(mean_obliq(time), pos);
}
exports.CalcMoonCount = 0;
function CalcMoon(time) {
    ++exports.CalcMoonCount;
    const T = time.tt / 36525;
    function DeclareArray1(xmin, xmax) {
        const array = [];
        let i;
        for (i = 0; i <= xmax - xmin; ++i) {
            array.push(0);
        }
        return { min: xmin, array: array };
    }
    function DeclareArray2(xmin, xmax, ymin, ymax) {
        const array = [];
        for (let i = 0; i <= xmax - xmin; ++i) {
            array.push(DeclareArray1(ymin, ymax));
        }
        return { min: xmin, array: array };
    }
    function ArrayGet2(a, x, y) {
        const m = a.array[x - a.min];
        return m.array[y - m.min];
    }
    function ArraySet2(a, x, y, v) {
        const m = a.array[x - a.min];
        m.array[y - m.min] = v;
    }
    let S, MAX, ARG, FAC, I, J, T2, DGAM, DLAM, N, GAM1C, SINPI, L0, L, LS, F, D, DL0, DL, DLS, DF, DD, DS;
    let coArray = DeclareArray2(-6, 6, 1, 4);
    let siArray = DeclareArray2(-6, 6, 1, 4);
    function CO(x, y) {
        return ArrayGet2(coArray, x, y);
    }
    function SI(x, y) {
        return ArrayGet2(siArray, x, y);
    }
    function SetCO(x, y, v) {
        return ArraySet2(coArray, x, y, v);
    }
    function SetSI(x, y, v) {
        return ArraySet2(siArray, x, y, v);
    }
    function AddThe(c1, s1, c2, s2, func) {
        func(c1 * c2 - s1 * s2, s1 * c2 + c1 * s2);
    }
    function Sine(phi) {
        return Math.sin(PI2 * phi);
    }
    T2 = T * T;
    DLAM = 0;
    DS = 0;
    GAM1C = 0;
    SINPI = 3422.7000;
    var S1 = Sine(0.19833 + 0.05611 * T);
    var S2 = Sine(0.27869 + 0.04508 * T);
    var S3 = Sine(0.16827 - 0.36903 * T);
    var S4 = Sine(0.34734 - 5.37261 * T);
    var S5 = Sine(0.10498 - 5.37899 * T);
    var S6 = Sine(0.42681 - 0.41855 * T);
    var S7 = Sine(0.14943 - 5.37511 * T);
    DL0 = 0.84 * S1 + 0.31 * S2 + 14.27 * S3 + 7.26 * S4 + 0.28 * S5 + 0.24 * S6;
    DL = 2.94 * S1 + 0.31 * S2 + 14.27 * S3 + 9.34 * S4 + 1.12 * S5 + 0.83 * S6;
    DLS = -6.40 * S1 - 1.89 * S6;
    DF = 0.21 * S1 + 0.31 * S2 + 14.27 * S3 - 88.70 * S4 - 15.30 * S5 + 0.24 * S6 - 1.86 * S7;
    DD = DL0 - DLS;
    DGAM = (-3332E-9 * Sine(0.59734 - 5.37261 * T)
        - 539E-9 * Sine(0.35498 - 5.37899 * T)
        - 64E-9 * Sine(0.39943 - 5.37511 * T));
    L0 = PI2 * Frac(0.60643382 + 1336.85522467 * T - 0.00000313 * T2) + DL0 / ARC;
    L = PI2 * Frac(0.37489701 + 1325.55240982 * T + 0.00002565 * T2) + DL / ARC;
    LS = PI2 * Frac(0.99312619 + 99.99735956 * T - 0.00000044 * T2) + DLS / ARC;
    F = PI2 * Frac(0.25909118 + 1342.22782980 * T - 0.00000892 * T2) + DF / ARC;
    D = PI2 * Frac(0.82736186 + 1236.85308708 * T - 0.00000397 * T2) + DD / ARC;
    for (I = 1; I <= 4; ++I) {
        switch (I) {
            case 1:
                ARG = L;
                MAX = 4;
                FAC = 1.000002208;
                break;
            case 2:
                ARG = LS;
                MAX = 3;
                FAC = 0.997504612 - 0.002495388 * T;
                break;
            case 3:
                ARG = F;
                MAX = 4;
                FAC = 1.000002708 + 139.978 * DGAM;
                break;
            case 4:
                ARG = D;
                MAX = 6;
                FAC = 1.0;
                break;
            default: throw `Internal error: I = ${I}`; // persuade TypeScript that ARG, ... are all initialized before use.
        }
        SetCO(0, I, 1);
        SetCO(1, I, Math.cos(ARG) * FAC);
        SetSI(0, I, 0);
        SetSI(1, I, Math.sin(ARG) * FAC);
        for (J = 2; J <= MAX; ++J) {
            AddThe(CO(J - 1, I), SI(J - 1, I), CO(1, I), SI(1, I), (c, s) => (SetCO(J, I, c), SetSI(J, I, s)));
        }
        for (J = 1; J <= MAX; ++J) {
            SetCO(-J, I, CO(J, I));
            SetSI(-J, I, -SI(J, I));
        }
    }
    function Term(p, q, r, s) {
        var result = { x: 1, y: 0 };
        var I = [0, p, q, r, s]; // I[0] is not used; it is a placeholder
        for (var k = 1; k <= 4; ++k)
            if (I[k] !== 0)
                AddThe(result.x, result.y, CO(I[k], k), SI(I[k], k), (c, s) => (result.x = c, result.y = s));
        return result;
    }
    function AddSol(coeffl, coeffs, coeffg, coeffp, p, q, r, s) {
        var result = Term(p, q, r, s);
        DLAM += coeffl * result.y;
        DS += coeffs * result.y;
        GAM1C += coeffg * result.x;
        SINPI += coeffp * result.x;
    }
    AddSol(13.9020, 14.0600, -0.0010, 0.2607, 0, 0, 0, 4);
    AddSol(0.4030, -4.0100, 0.3940, 0.0023, 0, 0, 0, 3);
    AddSol(2369.9120, 2373.3600, 0.6010, 28.2333, 0, 0, 0, 2);
    AddSol(-125.1540, -112.7900, -0.7250, -0.9781, 0, 0, 0, 1);
    AddSol(1.9790, 6.9800, -0.4450, 0.0433, 1, 0, 0, 4);
    AddSol(191.9530, 192.7200, 0.0290, 3.0861, 1, 0, 0, 2);
    AddSol(-8.4660, -13.5100, 0.4550, -0.1093, 1, 0, 0, 1);
    AddSol(22639.5000, 22609.0700, 0.0790, 186.5398, 1, 0, 0, 0);
    AddSol(18.6090, 3.5900, -0.0940, 0.0118, 1, 0, 0, -1);
    AddSol(-4586.4650, -4578.1300, -0.0770, 34.3117, 1, 0, 0, -2);
    AddSol(3.2150, 5.4400, 0.1920, -0.0386, 1, 0, 0, -3);
    AddSol(-38.4280, -38.6400, 0.0010, 0.6008, 1, 0, 0, -4);
    AddSol(-0.3930, -1.4300, -0.0920, 0.0086, 1, 0, 0, -6);
    AddSol(-0.2890, -1.5900, 0.1230, -0.0053, 0, 1, 0, 4);
    AddSol(-24.4200, -25.1000, 0.0400, -0.3000, 0, 1, 0, 2);
    AddSol(18.0230, 17.9300, 0.0070, 0.1494, 0, 1, 0, 1);
    AddSol(-668.1460, -126.9800, -1.3020, -0.3997, 0, 1, 0, 0);
    AddSol(0.5600, 0.3200, -0.0010, -0.0037, 0, 1, 0, -1);
    AddSol(-165.1450, -165.0600, 0.0540, 1.9178, 0, 1, 0, -2);
    AddSol(-1.8770, -6.4600, -0.4160, 0.0339, 0, 1, 0, -4);
    AddSol(0.2130, 1.0200, -0.0740, 0.0054, 2, 0, 0, 4);
    AddSol(14.3870, 14.7800, -0.0170, 0.2833, 2, 0, 0, 2);
    AddSol(-0.5860, -1.2000, 0.0540, -0.0100, 2, 0, 0, 1);
    AddSol(769.0160, 767.9600, 0.1070, 10.1657, 2, 0, 0, 0);
    AddSol(1.7500, 2.0100, -0.0180, 0.0155, 2, 0, 0, -1);
    AddSol(-211.6560, -152.5300, 5.6790, -0.3039, 2, 0, 0, -2);
    AddSol(1.2250, 0.9100, -0.0300, -0.0088, 2, 0, 0, -3);
    AddSol(-30.7730, -34.0700, -0.3080, 0.3722, 2, 0, 0, -4);
    AddSol(-0.5700, -1.4000, -0.0740, 0.0109, 2, 0, 0, -6);
    AddSol(-2.9210, -11.7500, 0.7870, -0.0484, 1, 1, 0, 2);
    AddSol(1.2670, 1.5200, -0.0220, 0.0164, 1, 1, 0, 1);
    AddSol(-109.6730, -115.1800, 0.4610, -0.9490, 1, 1, 0, 0);
    AddSol(-205.9620, -182.3600, 2.0560, 1.4437, 1, 1, 0, -2);
    AddSol(0.2330, 0.3600, 0.0120, -0.0025, 1, 1, 0, -3);
    AddSol(-4.3910, -9.6600, -0.4710, 0.0673, 1, 1, 0, -4);
    AddSol(0.2830, 1.5300, -0.1110, 0.0060, 1, -1, 0, 4);
    AddSol(14.5770, 31.7000, -1.5400, 0.2302, 1, -1, 0, 2);
    AddSol(147.6870, 138.7600, 0.6790, 1.1528, 1, -1, 0, 0);
    AddSol(-1.0890, 0.5500, 0.0210, 0.0000, 1, -1, 0, -1);
    AddSol(28.4750, 23.5900, -0.4430, -0.2257, 1, -1, 0, -2);
    AddSol(-0.2760, -0.3800, -0.0060, -0.0036, 1, -1, 0, -3);
    AddSol(0.6360, 2.2700, 0.1460, -0.0102, 1, -1, 0, -4);
    AddSol(-0.1890, -1.6800, 0.1310, -0.0028, 0, 2, 0, 2);
    AddSol(-7.4860, -0.6600, -0.0370, -0.0086, 0, 2, 0, 0);
    AddSol(-8.0960, -16.3500, -0.7400, 0.0918, 0, 2, 0, -2);
    AddSol(-5.7410, -0.0400, 0.0000, -0.0009, 0, 0, 2, 2);
    AddSol(0.2550, 0.0000, 0.0000, 0.0000, 0, 0, 2, 1);
    AddSol(-411.6080, -0.2000, 0.0000, -0.0124, 0, 0, 2, 0);
    AddSol(0.5840, 0.8400, 0.0000, 0.0071, 0, 0, 2, -1);
    AddSol(-55.1730, -52.1400, 0.0000, -0.1052, 0, 0, 2, -2);
    AddSol(0.2540, 0.2500, 0.0000, -0.0017, 0, 0, 2, -3);
    AddSol(0.0250, -1.6700, 0.0000, 0.0031, 0, 0, 2, -4);
    AddSol(1.0600, 2.9600, -0.1660, 0.0243, 3, 0, 0, 2);
    AddSol(36.1240, 50.6400, -1.3000, 0.6215, 3, 0, 0, 0);
    AddSol(-13.1930, -16.4000, 0.2580, -0.1187, 3, 0, 0, -2);
    AddSol(-1.1870, -0.7400, 0.0420, 0.0074, 3, 0, 0, -4);
    AddSol(-0.2930, -0.3100, -0.0020, 0.0046, 3, 0, 0, -6);
    AddSol(-0.2900, -1.4500, 0.1160, -0.0051, 2, 1, 0, 2);
    AddSol(-7.6490, -10.5600, 0.2590, -0.1038, 2, 1, 0, 0);
    AddSol(-8.6270, -7.5900, 0.0780, -0.0192, 2, 1, 0, -2);
    AddSol(-2.7400, -2.5400, 0.0220, 0.0324, 2, 1, 0, -4);
    AddSol(1.1810, 3.3200, -0.2120, 0.0213, 2, -1, 0, 2);
    AddSol(9.7030, 11.6700, -0.1510, 0.1268, 2, -1, 0, 0);
    AddSol(-0.3520, -0.3700, 0.0010, -0.0028, 2, -1, 0, -1);
    AddSol(-2.4940, -1.1700, -0.0030, -0.0017, 2, -1, 0, -2);
    AddSol(0.3600, 0.2000, -0.0120, -0.0043, 2, -1, 0, -4);
    AddSol(-1.1670, -1.2500, 0.0080, -0.0106, 1, 2, 0, 0);
    AddSol(-7.4120, -6.1200, 0.1170, 0.0484, 1, 2, 0, -2);
    AddSol(-0.3110, -0.6500, -0.0320, 0.0044, 1, 2, 0, -4);
    AddSol(0.7570, 1.8200, -0.1050, 0.0112, 1, -2, 0, 2);
    AddSol(2.5800, 2.3200, 0.0270, 0.0196, 1, -2, 0, 0);
    AddSol(2.5330, 2.4000, -0.0140, -0.0212, 1, -2, 0, -2);
    AddSol(-0.3440, -0.5700, -0.0250, 0.0036, 0, 3, 0, -2);
    AddSol(-0.9920, -0.0200, 0.0000, 0.0000, 1, 0, 2, 2);
    AddSol(-45.0990, -0.0200, 0.0000, -0.0010, 1, 0, 2, 0);
    AddSol(-0.1790, -9.5200, 0.0000, -0.0833, 1, 0, 2, -2);
    AddSol(-0.3010, -0.3300, 0.0000, 0.0014, 1, 0, 2, -4);
    AddSol(-6.3820, -3.3700, 0.0000, -0.0481, 1, 0, -2, 2);
    AddSol(39.5280, 85.1300, 0.0000, -0.7136, 1, 0, -2, 0);
    AddSol(9.3660, 0.7100, 0.0000, -0.0112, 1, 0, -2, -2);
    AddSol(0.2020, 0.0200, 0.0000, 0.0000, 1, 0, -2, -4);
    AddSol(0.4150, 0.1000, 0.0000, 0.0013, 0, 1, 2, 0);
    AddSol(-2.1520, -2.2600, 0.0000, -0.0066, 0, 1, 2, -2);
    AddSol(-1.4400, -1.3000, 0.0000, 0.0014, 0, 1, -2, 2);
    AddSol(0.3840, -0.0400, 0.0000, 0.0000, 0, 1, -2, -2);
    AddSol(1.9380, 3.6000, -0.1450, 0.0401, 4, 0, 0, 0);
    AddSol(-0.9520, -1.5800, 0.0520, -0.0130, 4, 0, 0, -2);
    AddSol(-0.5510, -0.9400, 0.0320, -0.0097, 3, 1, 0, 0);
    AddSol(-0.4820, -0.5700, 0.0050, -0.0045, 3, 1, 0, -2);
    AddSol(0.6810, 0.9600, -0.0260, 0.0115, 3, -1, 0, 0);
    AddSol(-0.2970, -0.2700, 0.0020, -0.0009, 2, 2, 0, -2);
    AddSol(0.2540, 0.2100, -0.0030, 0.0000, 2, -2, 0, -2);
    AddSol(-0.2500, -0.2200, 0.0040, 0.0014, 1, 3, 0, -2);
    AddSol(-3.9960, 0.0000, 0.0000, 0.0004, 2, 0, 2, 0);
    AddSol(0.5570, -0.7500, 0.0000, -0.0090, 2, 0, 2, -2);
    AddSol(-0.4590, -0.3800, 0.0000, -0.0053, 2, 0, -2, 2);
    AddSol(-1.2980, 0.7400, 0.0000, 0.0004, 2, 0, -2, 0);
    AddSol(0.5380, 1.1400, 0.0000, -0.0141, 2, 0, -2, -2);
    AddSol(0.2630, 0.0200, 0.0000, 0.0000, 1, 1, 2, 0);
    AddSol(0.4260, 0.0700, 0.0000, -0.0006, 1, 1, -2, -2);
    AddSol(-0.3040, 0.0300, 0.0000, 0.0003, 1, -1, 2, 0);
    AddSol(-0.3720, -0.1900, 0.0000, -0.0027, 1, -1, -2, 2);
    AddSol(0.4180, 0.0000, 0.0000, 0.0000, 0, 0, 4, 0);
    AddSol(-0.3300, -0.0400, 0.0000, 0.0000, 3, 0, 2, 0);
    function ADDN(coeffn, p, q, r, s) {
        return coeffn * Term(p, q, r, s).y;
    }
    N = 0;
    N += ADDN(-526.069, 0, 0, 1, -2);
    N += ADDN(-3.352, 0, 0, 1, -4);
    N += ADDN(+44.297, +1, 0, 1, -2);
    N += ADDN(-6.000, +1, 0, 1, -4);
    N += ADDN(+20.599, -1, 0, 1, 0);
    N += ADDN(-30.598, -1, 0, 1, -2);
    N += ADDN(-24.649, -2, 0, 1, 0);
    N += ADDN(-2.000, -2, 0, 1, -2);
    N += ADDN(-22.571, 0, +1, 1, -2);
    N += ADDN(+10.985, 0, -1, 1, -2);
    DLAM += (+0.82 * Sine(0.7736 - 62.5512 * T) + 0.31 * Sine(0.0466 - 125.1025 * T)
        + 0.35 * Sine(0.5785 - 25.1042 * T) + 0.66 * Sine(0.4591 + 1335.8075 * T)
        + 0.64 * Sine(0.3130 - 91.5680 * T) + 1.14 * Sine(0.1480 + 1331.2898 * T)
        + 0.21 * Sine(0.5918 + 1056.5859 * T) + 0.44 * Sine(0.5784 + 1322.8595 * T)
        + 0.24 * Sine(0.2275 - 5.7374 * T) + 0.28 * Sine(0.2965 + 2.6929 * T)
        + 0.33 * Sine(0.3132 + 6.3368 * T));
    S = F + DS / ARC;
    let lat_seconds = (1.000002708 + 139.978 * DGAM) * (18518.511 + 1.189 + GAM1C) * Math.sin(S) - 6.24 * Math.sin(3 * S) + N;
    return {
        geo_eclip_lon: PI2 * Frac((L0 + DLAM / ARC) / PI2),
        geo_eclip_lat: (Math.PI / (180 * 3600)) * lat_seconds,
        distance_au: (ARC * EARTH_EQUATORIAL_RADIUS_AU) / (0.999953253 * SINPI)
    };
}
/**
 * @brief Lunar libration angles, returned by {@link Libration}.
 *
 * @property {number} elat
 *      Sub-Earth libration ecliptic latitude angle, in degrees.
 * @property {number} elon
 *      Sub-Earth libration ecliptic longitude angle, in degrees.
 * @property {number} mlat
 *      Moon's geocentric ecliptic latitude, in degrees.
 * @property {number} mlon
 *      Moon's geocentric ecliptic longitude, in degrees.
 * @property {number} dist_km
 *      Distance between the centers of the Earth and Moon in kilometers.
 * @property {number} diam_deg
 *      The apparent angular diameter of the Moon, in degrees, as seen from the center of the Earth.
 */
class LibrationInfo {
    constructor(elat, elon, mlat, mlon, dist_km, diam_deg) {
        this.elat = elat;
        this.elon = elon;
        this.mlat = mlat;
        this.mlon = mlon;
        this.dist_km = dist_km;
        this.diam_deg = diam_deg;
    }
}
exports.LibrationInfo = LibrationInfo;
/**
 * @brief Calculates the Moon's libration angles at a given moment in time.
 *
 * Libration is an observed back-and-forth wobble of the portion of the
 * Moon visible from the Earth. It is caused by the imperfect tidal locking
 * of the Moon's fixed rotation rate, compared to its variable angular speed
 * of orbit around the Earth.
 *
 * This function calculates a pair of perpendicular libration angles,
 * one representing rotation of the Moon in ecliptic longitude `elon`, the other
 * in ecliptic latitude `elat`, both relative to the Moon's mean Earth-facing position.
 *
 * This function also returns the geocentric position of the Moon
 * expressed in ecliptic longitude `mlon`, ecliptic latitude `mlat`, the
 * distance `dist_km` between the centers of the Earth and Moon expressed in kilometers,
 * and the apparent angular diameter of the Moon `diam_deg`.
 *
 * @param {FlexibleDateTime} date
 *      A Date object, a number of UTC days since the J2000 epoch (noon on January 1, 2000),
 *      or an AstroTime object.
 *
 * @returns {LibrationInfo}
 */
function Libration(date) {
    const time = MakeTime(date);
    const t = time.tt / 36525.0;
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t2 * t2;
    const moon = CalcMoon(time);
    const mlon = moon.geo_eclip_lon;
    const mlat = moon.geo_eclip_lat;
    const dist_km = moon.distance_au * exports.KM_PER_AU;
    // Inclination angle
    const I = exports.DEG2RAD * 1.543;
    // Moon's argument of latitude in radians.
    const f = exports.DEG2RAD * NormalizeLongitude(93.2720950 + 483202.0175233 * t - 0.0036539 * t2 - t3 / 3526000 + t4 / 863310000);
    // Moon's ascending node's mean longitude in radians.
    const omega = exports.DEG2RAD * NormalizeLongitude(125.0445479 - 1934.1362891 * t + 0.0020754 * t2 + t3 / 467441 - t4 / 60616000);
    // Sun's mean anomaly.
    const m = exports.DEG2RAD * NormalizeLongitude(357.5291092 + 35999.0502909 * t - 0.0001536 * t2 + t3 / 24490000);
    // Moon's mean anomaly.
    const mdash = exports.DEG2RAD * NormalizeLongitude(134.9633964 + 477198.8675055 * t + 0.0087414 * t2 + t3 / 69699 - t4 / 14712000);
    // Moon's mean elongation.
    const d = exports.DEG2RAD * NormalizeLongitude(297.8501921 + 445267.1114034 * t - 0.0018819 * t2 + t3 / 545868 - t4 / 113065000);
    // Eccentricity of the Earth's orbit.
    const e = 1.0 - 0.002516 * t - 0.0000074 * t2;
    // Optical librations
    const w = mlon - omega;
    const a = Math.atan2(Math.sin(w) * Math.cos(mlat) * Math.cos(I) - Math.sin(mlat) * Math.sin(I), Math.cos(w) * Math.cos(mlat));
    const ldash = LongitudeOffset(exports.RAD2DEG * (a - f));
    const bdash = Math.asin(-Math.sin(w) * Math.cos(mlat) * Math.sin(I) - Math.sin(mlat) * Math.cos(I));
    // Physical librations
    const k1 = exports.DEG2RAD * (119.75 + 131.849 * t);
    const k2 = exports.DEG2RAD * (72.56 + 20.186 * t);
    const rho = (-0.02752 * Math.cos(mdash) +
        -0.02245 * Math.sin(f) +
        +0.00684 * Math.cos(mdash - 2 * f) +
        -0.00293 * Math.cos(2 * f) +
        -0.00085 * Math.cos(2 * f - 2 * d) +
        -0.00054 * Math.cos(mdash - 2 * d) +
        -0.00020 * Math.sin(mdash + f) +
        -0.00020 * Math.cos(mdash + 2 * f) +
        -0.00020 * Math.cos(mdash - f) +
        +0.00014 * Math.cos(mdash + 2 * f - 2 * d));
    const sigma = (-0.02816 * Math.sin(mdash) +
        +0.02244 * Math.cos(f) +
        -0.00682 * Math.sin(mdash - 2 * f) +
        -0.00279 * Math.sin(2 * f) +
        -0.00083 * Math.sin(2 * f - 2 * d) +
        +0.00069 * Math.sin(mdash - 2 * d) +
        +0.00040 * Math.cos(mdash + f) +
        -0.00025 * Math.sin(2 * mdash) +
        -0.00023 * Math.sin(mdash + 2 * f) +
        +0.00020 * Math.cos(mdash - f) +
        +0.00019 * Math.sin(mdash - f) +
        +0.00013 * Math.sin(mdash + 2 * f - 2 * d) +
        -0.00010 * Math.cos(mdash - 3 * f));
    const tau = (+0.02520 * e * Math.sin(m) +
        +0.00473 * Math.sin(2 * mdash - 2 * f) +
        -0.00467 * Math.sin(mdash) +
        +0.00396 * Math.sin(k1) +
        +0.00276 * Math.sin(2 * mdash - 2 * d) +
        +0.00196 * Math.sin(omega) +
        -0.00183 * Math.cos(mdash - f) +
        +0.00115 * Math.sin(mdash - 2 * d) +
        -0.00096 * Math.sin(mdash - d) +
        +0.00046 * Math.sin(2 * f - 2 * d) +
        -0.00039 * Math.sin(mdash - f) +
        -0.00032 * Math.sin(mdash - m - d) +
        +0.00027 * Math.sin(2 * mdash - m - 2 * d) +
        +0.00023 * Math.sin(k2) +
        -0.00014 * Math.sin(2 * d) +
        +0.00014 * Math.cos(2 * mdash - 2 * f) +
        -0.00012 * Math.sin(mdash - 2 * f) +
        -0.00012 * Math.sin(2 * mdash) +
        +0.00011 * Math.sin(2 * mdash - 2 * m - 2 * d));
    const ldash2 = -tau + (rho * Math.cos(a) + sigma * Math.sin(a)) * Math.tan(bdash);
    const bdash2 = sigma * Math.cos(a) - rho * Math.sin(a);
    const diam_deg = 2.0 * exports.RAD2DEG * Math.atan(MOON_MEAN_RADIUS_KM / Math.sqrt(dist_km * dist_km - MOON_MEAN_RADIUS_KM * MOON_MEAN_RADIUS_KM));
    return new LibrationInfo(exports.RAD2DEG * bdash + bdash2, ldash + ldash2, exports.RAD2DEG * mlat, exports.RAD2DEG * mlon, dist_km, diam_deg);
}
exports.Libration = Libration;
function rotate(rot, vec) {
    return [
        rot.rot[0][0] * vec[0] + rot.rot[1][0] * vec[1] + rot.rot[2][0] * vec[2],
        rot.rot[0][1] * vec[0] + rot.rot[1][1] * vec[1] + rot.rot[2][1] * vec[2],
        rot.rot[0][2] * vec[0] + rot.rot[1][2] * vec[1] + rot.rot[2][2] * vec[2]
    ];
}
function precession(pos, time, dir) {
    const r = precession_rot(time, dir);
    return rotate(r, pos);
}
function precession_posvel(state, time, dir) {
    const r = precession_rot(time, dir);
    return RotateState(r, state);
}
function precession_rot(time, dir) {
    const t = time.tt / 36525;
    let eps0 = 84381.406;
    let psia = (((((-0.0000000951 * t
        + 0.000132851) * t
        - 0.00114045) * t
        - 1.0790069) * t
        + 5038.481507) * t);
    let omegaa = (((((+0.0000003337 * t
        - 0.000000467) * t
        - 0.00772503) * t
        + 0.0512623) * t
        - 0.025754) * t + eps0);
    let chia = (((((-0.0000000560 * t
        + 0.000170663) * t
        - 0.00121197) * t
        - 2.3814292) * t
        + 10.556403) * t);
    eps0 *= ASEC2RAD;
    psia *= ASEC2RAD;
    omegaa *= ASEC2RAD;
    chia *= ASEC2RAD;
    const sa = Math.sin(eps0);
    const ca = Math.cos(eps0);
    const sb = Math.sin(-psia);
    const cb = Math.cos(-psia);
    const sc = Math.sin(-omegaa);
    const cc = Math.cos(-omegaa);
    const sd = Math.sin(chia);
    const cd = Math.cos(chia);
    const xx = cd * cb - sb * sd * cc;
    const yx = cd * sb * ca + sd * cc * cb * ca - sa * sd * sc;
    const zx = cd * sb * sa + sd * cc * cb * sa + ca * sd * sc;
    const xy = -sd * cb - sb * cd * cc;
    const yy = -sd * sb * ca + cd * cc * cb * ca - sa * cd * sc;
    const zy = -sd * sb * sa + cd * cc * cb * sa + ca * cd * sc;
    const xz = sb * sc;
    const yz = -sc * cb * ca - sa * cc;
    const zz = -sc * cb * sa + cc * ca;
    if (dir === PrecessDirection.Into2000) {
        // Perform rotation from epoch to J2000.0.
        return new RotationMatrix([
            [xx, yx, zx],
            [xy, yy, zy],
            [xz, yz, zz]
        ]);
    }
    if (dir === PrecessDirection.From2000) {
        // Perform rotation from J2000.0 to epoch.
        return new RotationMatrix([
            [xx, xy, xz],
            [yx, yy, yz],
            [zx, zy, zz]
        ]);
    }
    throw 'Invalid precess direction';
}
function era(time) {
    const thet1 = 0.7790572732640 + 0.00273781191135448 * time.ut;
    const thet3 = time.ut % 1;
    let theta = 360 * ((thet1 + thet3) % 1);
    if (theta < 0) {
        theta += 360;
    }
    return theta;
}
let sidereal_time_cache;
function sidereal_time(time) {
    if (!sidereal_time_cache || sidereal_time_cache.tt !== time.tt) {
        const t = time.tt / 36525;
        let eqeq = 15 * e_tilt(time).ee; // Replace with eqeq=0 to get GMST instead of GAST (if we ever need it)
        const theta = era(time);
        const st = (eqeq + 0.014506 +
            ((((-0.0000000368 * t
                - 0.000029956) * t
                - 0.00000044) * t
                + 1.3915817) * t
                + 4612.156534) * t);
        let gst = ((st / 3600 + theta) % 360) / 15;
        if (gst < 0) {
            gst += 24;
        }
        sidereal_time_cache = {
            tt: time.tt,
            st: gst
        };
    }
    return sidereal_time_cache.st; // return sidereal hours in the half-open range [0, 24).
}
/**
 * @brief Calculates Greenwich Apparent Sidereal Time (GAST).
 *
 * Given a date and time, this function calculates the rotation of the
 * Earth, represented by the equatorial angle of the Greenwich prime meridian
 * with respect to distant stars (not the Sun, which moves relative to background
 * stars by almost one degree per day).
 * This angle is called Greenwich Apparent Sidereal Time (GAST).
 * GAST is measured in sidereal hours in the half-open range [0, 24).
 * When GAST = 0, it means the prime meridian is aligned with the of-date equinox,
 * corrected at that time for precession and nutation of the Earth's axis.
 * In this context, the "equinox" is the direction in space where the Earth's
 * orbital plane (the ecliptic) intersects with the plane of the Earth's equator,
 * at the location on the Earth's orbit of the (seasonal) March equinox.
 * As the Earth rotates, GAST increases from 0 up to 24 sidereal hours,
 * then starts over at 0.
 * To convert to degrees, multiply the return value by 15.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to find GAST.
 *
 * @returns {number}
 */
function SiderealTime(date) {
    const time = MakeTime(date);
    return sidereal_time(time);
}
exports.SiderealTime = SiderealTime;
function inverse_terra(ovec, st) {
    // Convert from AU to kilometers
    const x = ovec[0] * exports.KM_PER_AU;
    const y = ovec[1] * exports.KM_PER_AU;
    const z = ovec[2] * exports.KM_PER_AU;
    const p = Math.hypot(x, y);
    let lon_deg, lat_deg, height_km;
    if (p < 1.0e-6) {
        // Special case: within 1 millimeter of a pole!
        // Use arbitrary longitude, and latitude determined by polarity of z.
        lon_deg = 0;
        lat_deg = (z > 0.0) ? +90 : -90;
        // Elevation is calculated directly from z.
        height_km = Math.abs(z) - EARTH_POLAR_RADIUS_KM;
    }
    else {
        const stlocl = Math.atan2(y, x);
        // Calculate exact longitude.
        lon_deg = (exports.RAD2DEG * stlocl) - (15.0 * st);
        // Normalize longitude to the range (-180, +180].
        while (lon_deg <= -180)
            lon_deg += 360;
        while (lon_deg > +180)
            lon_deg -= 360;
        // Numerically solve for exact latitude, using Newton's Method.
        // Start with initial latitude estimate, based on a spherical Earth.
        let lat = Math.atan2(z, p);
        let cos, sin, denom;
        let count = 0;
        for (;;) {
            if (++count > 10)
                throw `inverse_terra failed to converge.`;
            // Calculate the error function W(lat).
            // We try to find the root of W, meaning where the error is 0.
            cos = Math.cos(lat);
            sin = Math.sin(lat);
            const factor = (EARTH_FLATTENING_SQUARED - 1) * EARTH_EQUATORIAL_RADIUS_KM;
            const cos2 = cos * cos;
            const sin2 = sin * sin;
            const radicand = cos2 + EARTH_FLATTENING_SQUARED * sin2;
            denom = Math.sqrt(radicand);
            const W = (factor * sin * cos) / denom - z * cos + p * sin;
            if (Math.abs(W) < 1.0e-8)
                break; // The error is now negligible
            // Error is still too large. Find the next estimate.
            // Calculate D = the derivative of W with respect to lat.
            const D = factor * ((cos2 - sin2) / denom - sin2 * cos2 * (EARTH_FLATTENING_SQUARED - 1) / (factor * radicand)) + z * sin + p * cos;
            lat -= W / D;
        }
        // We now have a solution for the latitude in radians.
        lat_deg = exports.RAD2DEG * lat;
        // Solve for exact height in meters.
        // There are two formulas I can use. Use whichever has the less risky denominator.
        const adjust = EARTH_EQUATORIAL_RADIUS_KM / denom;
        if (Math.abs(sin) > Math.abs(cos))
            height_km = z / sin - EARTH_FLATTENING_SQUARED * adjust;
        else
            height_km = p / cos - adjust;
    }
    return new Observer(lat_deg, lon_deg, 1000 * height_km);
}
function terra(observer, st) {
    const phi = observer.latitude * exports.DEG2RAD;
    const sinphi = Math.sin(phi);
    const cosphi = Math.cos(phi);
    const c = 1 / Math.hypot(cosphi, EARTH_FLATTENING * sinphi);
    const s = EARTH_FLATTENING_SQUARED * c;
    const ht_km = observer.height / 1000;
    const ach = EARTH_EQUATORIAL_RADIUS_KM * c + ht_km;
    const ash = EARTH_EQUATORIAL_RADIUS_KM * s + ht_km;
    const stlocl = (15 * st + observer.longitude) * exports.DEG2RAD;
    const sinst = Math.sin(stlocl);
    const cosst = Math.cos(stlocl);
    return {
        pos: [ach * cosphi * cosst / exports.KM_PER_AU, ach * cosphi * sinst / exports.KM_PER_AU, ash * sinphi / exports.KM_PER_AU],
        vel: [-ANGVEL * ach * cosphi * sinst * 86400 / exports.KM_PER_AU, ANGVEL * ach * cosphi * cosst * 86400 / exports.KM_PER_AU, 0]
    };
}
function nutation(pos, time, dir) {
    const r = nutation_rot(time, dir);
    return rotate(r, pos);
}
function nutation_posvel(state, time, dir) {
    const r = nutation_rot(time, dir);
    return RotateState(r, state);
}
function nutation_rot(time, dir) {
    const tilt = e_tilt(time);
    const oblm = tilt.mobl * exports.DEG2RAD;
    const oblt = tilt.tobl * exports.DEG2RAD;
    const psi = tilt.dpsi * ASEC2RAD;
    const cobm = Math.cos(oblm);
    const sobm = Math.sin(oblm);
    const cobt = Math.cos(oblt);
    const sobt = Math.sin(oblt);
    const cpsi = Math.cos(psi);
    const spsi = Math.sin(psi);
    const xx = cpsi;
    const yx = -spsi * cobm;
    const zx = -spsi * sobm;
    const xy = spsi * cobt;
    const yy = cpsi * cobm * cobt + sobm * sobt;
    const zy = cpsi * sobm * cobt - cobm * sobt;
    const xz = spsi * sobt;
    const yz = cpsi * cobm * sobt - sobm * cobt;
    const zz = cpsi * sobm * sobt + cobm * cobt;
    if (dir === PrecessDirection.From2000) {
        // convert J2000 to of-date
        return new RotationMatrix([
            [xx, xy, xz],
            [yx, yy, yz],
            [zx, zy, zz]
        ]);
    }
    if (dir === PrecessDirection.Into2000) {
        // convert of-date to J2000
        return new RotationMatrix([
            [xx, yx, zx],
            [xy, yy, zy],
            [xz, yz, zz]
        ]);
    }
    throw 'Invalid precess direction';
}
function gyration(pos, time, dir) {
    // Combine nutation and precession into a single operation I call "gyration".
    // The order they are composed depends on the direction,
    // because both directions are mutual inverse functions.
    return (dir === PrecessDirection.Into2000) ?
        precession(nutation(pos, time, dir), time, dir) :
        nutation(precession(pos, time, dir), time, dir);
}
function gyration_posvel(state, time, dir) {
    // Combine nutation and precession into a single operation I call "gyration".
    // The order they are composed depends on the direction,
    // because both directions are mutual inverse functions.
    return (dir === PrecessDirection.Into2000) ?
        precession_posvel(nutation_posvel(state, time, dir), time, dir) :
        nutation_posvel(precession_posvel(state, time, dir), time, dir);
}
function geo_pos(time, observer) {
    const gast = sidereal_time(time);
    const pos = terra(observer, gast).pos;
    return gyration(pos, time, PrecessDirection.Into2000);
}
/**
 * @brief A 3D Cartesian vector with a time attached to it.
 *
 * Holds the Cartesian coordinates of a vector in 3D space,
 * along with the time at which the vector is valid.
 *
 * @property {number} x        The x-coordinate expressed in astronomical units (AU).
 * @property {number} y        The y-coordinate expressed in astronomical units (AU).
 * @property {number} z        The z-coordinate expressed in astronomical units (AU).
 * @property {AstroTime} t     The time at which the vector is valid.
 */
class Vector {
    constructor(x, y, z, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
    }
    /**
     * Returns the length of the vector in astronomical units (AU).
     * @returns {number}
     */
    Length() {
        return Math.hypot(this.x, this.y, this.z);
    }
}
exports.Vector = Vector;
/**
 * @brief A combination of a position vector, a velocity vector, and a time.
 *
 * Holds the state vector of a body at a given time, including its position,
 * velocity, and the time they are valid.
 *
 * @property {number} x        The position x-coordinate expressed in astronomical units (AU).
 * @property {number} y        The position y-coordinate expressed in astronomical units (AU).
 * @property {number} z        The position z-coordinate expressed in astronomical units (AU).
 * @property {number} vx       The velocity x-coordinate expressed in AU/day.
 * @property {number} vy       The velocity y-coordinate expressed in AU/day.
 * @property {number} vz       The velocity z-coordinate expressed in AU/day.
 * @property {AstroTime} t     The time at which the vector is valid.
 */
class StateVector {
    constructor(x, y, z, vx, vy, vz, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.t = t;
    }
}
exports.StateVector = StateVector;
/**
 * @brief Holds spherical coordinates: latitude, longitude, distance.
 *
 * Spherical coordinates represent the location of
 * a point using two angles and a distance.
 *
 * @property {number} lat       The latitude angle: -90..+90 degrees.
 * @property {number} lon       The longitude angle: 0..360 degrees.
 * @property {number} dist      Distance in AU.
 */
class Spherical {
    constructor(lat, lon, dist) {
        this.lat = VerifyNumber(lat);
        this.lon = VerifyNumber(lon);
        this.dist = VerifyNumber(dist);
    }
}
exports.Spherical = Spherical;
/**
 * @brief Holds right ascension, declination, and distance of a celestial object.
 *
 * @property {number} ra
 *      Right ascension in sidereal hours: [0, 24).
 *
 * @property {number} dec
 *      Declination in degrees: [-90, +90].
 *
 * @property {number} dist
 *      Distance to the celestial object expressed in
 *      <a href="https://en.wikipedia.org/wiki/Astronomical_unit">astronomical units</a> (AU).
 *
 * @property {Vector} vec
 *      The equatorial coordinates in cartesian form, using AU distance units.
 *      x = direction of the March equinox,
 *      y = direction of the June solstice,
 *      z = north.
 */
class EquatorialCoordinates {
    constructor(ra, dec, dist, vec) {
        this.ra = VerifyNumber(ra);
        this.dec = VerifyNumber(dec);
        this.dist = VerifyNumber(dist);
        this.vec = vec;
    }
}
exports.EquatorialCoordinates = EquatorialCoordinates;
function IsValidRotationArray(rot) {
    if (!(rot instanceof Array) || (rot.length !== 3))
        return false;
    for (let i = 0; i < 3; ++i) {
        if (!(rot[i] instanceof Array) || (rot[i].length !== 3))
            return false;
        for (let j = 0; j < 3; ++j)
            if (!Number.isFinite(rot[i][j]))
                return false;
    }
    return true;
}
/**
 * @brief Contains a rotation matrix that can be used to transform one coordinate system to another.
 *
 * @property {number[][]} rot
 *      A normalized 3x3 rotation matrix. For example, the identity matrix is represented
 *      as `[[1, 0, 0], [0, 1, 0], [0, 0, 1]]`.
 */
class RotationMatrix {
    constructor(rot) {
        this.rot = rot;
    }
}
exports.RotationMatrix = RotationMatrix;
/**
 * @brief Creates a rotation matrix that can be used to transform one coordinate system to another.
 *
 * This function verifies that the `rot` parameter is of the correct format:
 * a number[3][3] array. It throws an exception if `rot` is not of that shape.
 * Otherwise it creates a new {@link RotationMatrix} object based on `rot`.
 *
 * @param {number[][]} rot
 *      An array [3][3] of numbers. Defines a rotation matrix used to premultiply
 *      a 3D vector to reorient it into another coordinate system.
 *
 * @returns {RotationMatrix}
 */
function MakeRotation(rot) {
    if (!IsValidRotationArray(rot))
        throw 'Argument must be a [3][3] array of numbers';
    return new RotationMatrix(rot);
}
exports.MakeRotation = MakeRotation;
/**
 * @brief Represents the location of an object seen by an observer on the Earth.
 *
 * Holds azimuth (compass direction) and altitude (angle above/below the horizon)
 * of a celestial object as seen by an observer at a particular location on the Earth's surface.
 * Also holds right ascension and declination of the same object.
 * All of these coordinates are optionally adjusted for atmospheric refraction;
 * therefore the right ascension and declination values may not exactly match
 * those found inside a corresponding {@link EquatorialCoordinates} object.
 *
 * @property {number} azimuth
 *      A horizontal compass direction angle in degrees measured starting at north
 *      and increasing positively toward the east.
 *      The value is in the range [0, 360).
 *      North = 0, east = 90, south = 180, west = 270.
 *
 * @property {number} altitude
 *      A vertical angle in degrees above (positive) or below (negative) the horizon.
 *      The value is in the range [-90, +90].
 *      The altitude angle is optionally adjusted upward due to atmospheric refraction.
 *
 * @property {number} ra
 *      The right ascension of the celestial body in sidereal hours.
 *      The value is in the reange [0, 24).
 *      If `altitude` was adjusted for atmospheric reaction, `ra`
 *      is likewise adjusted.
 *
 * @property {number} dec
 *      The declination of of the celestial body in degrees.
 *      The value in the range [-90, +90].
 *      If `altitude` was adjusted for atmospheric reaction, `dec`
 *      is likewise adjusted.
 */
class HorizontalCoordinates {
    constructor(azimuth, altitude, ra, dec) {
        this.azimuth = VerifyNumber(azimuth);
        this.altitude = VerifyNumber(altitude);
        this.ra = VerifyNumber(ra);
        this.dec = VerifyNumber(dec);
    }
}
exports.HorizontalCoordinates = HorizontalCoordinates;
/**
 * @brief Ecliptic coordinates of a celestial body.
 *
 * The origin and date of the coordinate system may vary depending on the caller's usage.
 * In general, ecliptic coordinates are measured with respect to the mean plane of the Earth's
 * orbit around the Sun.
 * Includes Cartesian coordinates `(ex, ey, ez)` measured in
 * <a href="https://en.wikipedia.org/wiki/Astronomical_unit">astronomical units</a> (AU)
 * and spherical coordinates `(elon, elat)` measured in degrees.
 *
 * @property {Vector} vec
 *      Ecliptic cartesian vector with components measured in astronomical units (AU).
 *      The x-axis is within the ecliptic plane and is oriented in the direction of the
 *      <a href="https://en.wikipedia.org/wiki/Equinox_(celestial_coordinates)">equinox</a>.
 *      The y-axis is within the ecliptic plane and is oriented 90 degrees
 *      counterclockwise from the equinox, as seen from above the Sun's north pole.
 *      The z-axis is oriented perpendicular to the ecliptic plane,
 *      along the direction of the Sun's north pole.
 *
 * @property {number} elat
 *      The ecliptic latitude of the body in degrees.
 *      This is the angle north or south of the ecliptic plane.
 *      The value is in the range [-90, +90].
 *      Positive values are north and negative values are south.
 *
 * @property {number} elon
 *      The ecliptic longitude of the body in degrees.
 *      This is the angle measured counterclockwise around the ecliptic plane,
 *      as seen from above the Sun's north pole.
 *      This is the same direction that the Earth orbits around the Sun.
 *      The angle is measured starting at 0 from the equinox and increases
 *      up to 360 degrees.
 */
class EclipticCoordinates {
    constructor(vec, elat, elon) {
        this.vec = vec;
        this.elat = VerifyNumber(elat);
        this.elon = VerifyNumber(elon);
    }
}
exports.EclipticCoordinates = EclipticCoordinates;
function VectorFromArray(av, time) {
    return new Vector(av[0], av[1], av[2], time);
}
function vector2radec(pos, time) {
    const vec = VectorFromArray(pos, time);
    const xyproj = vec.x * vec.x + vec.y * vec.y;
    const dist = Math.sqrt(xyproj + vec.z * vec.z);
    if (xyproj === 0) {
        if (vec.z === 0)
            throw 'Indeterminate sky coordinates';
        return new EquatorialCoordinates(0, (vec.z < 0) ? -90 : +90, dist, vec);
    }
    let ra = exports.RAD2HOUR * Math.atan2(vec.y, vec.x);
    if (ra < 0)
        ra += 24;
    const dec = exports.RAD2DEG * Math.atan2(pos[2], Math.sqrt(xyproj));
    return new EquatorialCoordinates(ra, dec, dist, vec);
}
function spin(angle, pos) {
    const angr = angle * exports.DEG2RAD;
    const c = Math.cos(angr);
    const s = Math.sin(angr);
    return [c * pos[0] + s * pos[1], c * pos[1] - s * pos[0], pos[2]];
}
/**
 * @brief Converts equatorial coordinates to horizontal coordinates.
 *
 * Given a date and time, a geographic location of an observer on the Earth, and
 * equatorial coordinates (right ascension and declination) of a celestial body,
 * returns horizontal coordinates (azimuth and altitude angles) for that body
 * as seen by that observer. Allows optional correction for atmospheric refraction.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to find horizontal coordinates.
 *
 * @param {Observer} observer
 *      The location of the observer for which to find horizontal coordinates.
 *
 * @param {number} ra
 *      Right ascension in sidereal hours of the celestial object,
 *      referred to the mean equinox of date for the J2000 epoch.
 *
 * @param {number} dec
 *      Declination in degrees of the celestial object,
 *      referred to the mean equator of date for the J2000 epoch.
 *      Positive values are north of the celestial equator and negative values are south.
 *
 * @param {string} refraction
 *      If omitted or has a false-like value (false, null, undefined, etc.)
 *      the calculations are performed without any correction for atmospheric
 *      refraction. If the value is the string `"normal"`,
 *      uses the recommended refraction correction based on Meeus "Astronomical Algorithms"
 *      with a linear taper more than 1 degree below the horizon. The linear
 *      taper causes the refraction to linearly approach 0 as the altitude of the
 *      body approaches the nadir (-90 degrees).
 *      If the value is the string `"jplhor"`, uses a JPL Horizons
 *      compatible formula. This is the same algorithm as `"normal"`,
 *      only without linear tapering; this can result in physically impossible
 *      altitudes of less than -90 degrees, which may cause problems for some applications.
 *      (The `"jplhor"` option was created for unit testing against data
 *      generated by JPL Horizons, and is otherwise not recommended for use.)
 *
 * @returns {HorizontalCoordinates}
 */
function Horizon(date, observer, ra, dec, refraction) {
    // based on NOVAS equ2hor()
    let time = MakeTime(date);
    VerifyObserver(observer);
    VerifyNumber(ra);
    VerifyNumber(dec);
    const sinlat = Math.sin(observer.latitude * exports.DEG2RAD);
    const coslat = Math.cos(observer.latitude * exports.DEG2RAD);
    const sinlon = Math.sin(observer.longitude * exports.DEG2RAD);
    const coslon = Math.cos(observer.longitude * exports.DEG2RAD);
    const sindc = Math.sin(dec * exports.DEG2RAD);
    const cosdc = Math.cos(dec * exports.DEG2RAD);
    const sinra = Math.sin(ra * exports.HOUR2RAD);
    const cosra = Math.cos(ra * exports.HOUR2RAD);
    // Calculate three mutually perpendicular unit vectors
    // in equatorial coordinates: uze, une, uwe.
    //
    // uze = The direction of the observer's local zenith (straight up).
    // une = The direction toward due north on the observer's horizon.
    // uwe = The direction toward due west on the observer's horizon.
    //
    // HOWEVER, these are uncorrected for the Earth's rotation due to the time of day.
    //
    // The components of these 3 vectors are as follows:
    // x = direction from center of Earth toward 0 degrees longitude (the prime meridian) on equator.
    // y = direction from center of Earth toward 90 degrees west longitude on equator.
    // z = direction from center of Earth toward the north pole.
    let uze = [coslat * coslon, coslat * sinlon, sinlat];
    let une = [-sinlat * coslon, -sinlat * sinlon, coslat];
    let uwe = [sinlon, -coslon, 0];
    // Correct the vectors uze, une, uwe for the Earth's rotation by calculating
    // sidereal time. Call spin() for each uncorrected vector to rotate about
    // the Earth's axis to yield corrected unit vectors uz, un, uw.
    // Multiply sidereal hours by -15 to convert to degrees and flip eastward
    // rotation of the Earth to westward apparent movement of objects with time.
    const spin_angle = -15 * sidereal_time(time);
    let uz = spin(spin_angle, uze);
    let un = spin(spin_angle, une);
    let uw = spin(spin_angle, uwe);
    // Convert angular equatorial coordinates (RA, DEC) to
    // cartesian equatorial coordinates in 'p', using the
    // same orientation system as uze, une, uwe.
    let p = [cosdc * cosra, cosdc * sinra, sindc];
    // Use dot products of p with the zenith, north, and west
    // vectors to obtain the cartesian coordinates of the body in
    // the observer's horizontal orientation system.
    // pz = zenith component [-1, +1]
    // pn = north  component [-1, +1]
    // pw = west   component [-1, +1]
    const pz = p[0] * uz[0] + p[1] * uz[1] + p[2] * uz[2];
    const pn = p[0] * un[0] + p[1] * un[1] + p[2] * un[2];
    const pw = p[0] * uw[0] + p[1] * uw[1] + p[2] * uw[2];
    // proj is the "shadow" of the body vector along the observer's flat ground.
    let proj = Math.hypot(pn, pw);
    // Calculate az = azimuth (compass direction clockwise from East.)
    let az;
    if (proj > 0) {
        // If the body is not exactly straight up/down, it has an azimuth.
        // Invert the angle to produce degrees eastward from north.
        az = -exports.RAD2DEG * Math.atan2(pw, pn);
        if (az < 0)
            az += 360;
    }
    else {
        // The body is straight up/down, so it does not have an azimuth.
        // Report an arbitrary but reasonable value.
        az = 0;
    }
    // zd = the angle of the body away from the observer's zenith, in degrees.
    let zd = exports.RAD2DEG * Math.atan2(proj, pz);
    let out_ra = ra;
    let out_dec = dec;
    if (refraction) {
        let zd0 = zd;
        let refr = Refraction(refraction, 90 - zd);
        zd -= refr;
        if (refr > 0.0 && zd > 3.0e-4) {
            const sinzd = Math.sin(zd * exports.DEG2RAD);
            const coszd = Math.cos(zd * exports.DEG2RAD);
            const sinzd0 = Math.sin(zd0 * exports.DEG2RAD);
            const coszd0 = Math.cos(zd0 * exports.DEG2RAD);
            const pr = [];
            for (let j = 0; j < 3; ++j) {
                pr.push(((p[j] - coszd0 * uz[j]) / sinzd0) * sinzd + uz[j] * coszd);
            }
            proj = Math.hypot(pr[0], pr[1]);
            if (proj > 0) {
                out_ra = exports.RAD2HOUR * Math.atan2(pr[1], pr[0]);
                if (out_ra < 0) {
                    out_ra += 24;
                }
            }
            else {
                out_ra = 0;
            }
            out_dec = exports.RAD2DEG * Math.atan2(pr[2], proj);
        }
    }
    return new HorizontalCoordinates(az, 90 - zd, out_ra, out_dec);
}
exports.Horizon = Horizon;
function VerifyObserver(observer) {
    if (!(observer instanceof Observer)) {
        throw `Not an instance of the Observer class: ${observer}`;
    }
    VerifyNumber(observer.latitude);
    VerifyNumber(observer.longitude);
    VerifyNumber(observer.height);
    if (observer.latitude < -90 || observer.latitude > +90) {
        throw `Latitude ${observer.latitude} is out of range. Must be -90..+90.`;
    }
    return observer;
}
/**
 * @brief Represents the geographic location of an observer on the surface of the Earth.
 *
 * @property {number} latitude
 *      The observer's geographic latitude in degrees north of the Earth's equator.
 *      The value is negative for observers south of the equator.
 *      Must be in the range -90 to +90.
 *
 * @property {number} longitude
 *      The observer's geographic longitude in degrees east of the prime meridian
 *      passing through Greenwich, England.
 *      The value is negative for observers west of the prime meridian.
 *      The value should be kept in the range -180 to +180 to minimize floating point errors.
 *
 * @property {number} height
 *      The observer's elevation above mean sea level, expressed in meters.
 */
class Observer {
    constructor(latitude, longitude, height) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.height = height;
        VerifyObserver(this);
    }
}
exports.Observer = Observer;
/**
 * @brief Returns apparent geocentric true ecliptic coordinates of date for the Sun.
 *
 * This function is used for calculating the times of equinoxes and solstices.
 *
 * <i>Geocentric</i> means coordinates as the Sun would appear to a hypothetical observer
 * at the center of the Earth.
 * <i>Ecliptic coordinates of date</i> are measured along the plane of the Earth's mean
 * orbit around the Sun, using the
 * <a href="https://en.wikipedia.org/wiki/Equinox_(celestial_coordinates)">equinox</a>
 * of the Earth as adjusted for precession and nutation of the Earth's
 * axis of rotation on the given date.
 *
 * @param {FlexibleDateTime} date
 *      The date and time at which to calculate the Sun's apparent location as seen from
 *      the center of the Earth.
 *
 * @returns {EclipticCoordinates}
 */
function SunPosition(date) {
    // Correct for light travel time from the Sun.
    // This is really the same as correcting for aberration.
    // Otherwise season calculations (equinox, solstice) will all be early by about 8 minutes!
    const time = MakeTime(date).AddDays(-1 / exports.C_AUDAY);
    // Get heliocentric cartesian coordinates of Earth in J2000.
    const earth2000 = CalcVsop(vsop.Earth, time);
    // Convert to geocentric location of the Sun.
    const sun2000 = [-earth2000.x, -earth2000.y, -earth2000.z];
    // Convert to equator-of-date equatorial cartesian coordinates.
    const [gx, gy, gz] = gyration(sun2000, time, PrecessDirection.From2000);
    // Convert to ecliptic coordinates of date.
    const true_obliq = exports.DEG2RAD * e_tilt(time).tobl;
    const cos_ob = Math.cos(true_obliq);
    const sin_ob = Math.sin(true_obliq);
    const vec = new Vector(gx, gy, gz, time);
    const sun_ecliptic = RotateEquatorialToEcliptic(vec, cos_ob, sin_ob);
    return sun_ecliptic;
}
exports.SunPosition = SunPosition;
/**
 * @brief Calculates equatorial coordinates of a Solar System body at a given time.
 *
 * Returns topocentric equatorial coordinates (right ascension and declination)
 * in one of two different systems: J2000 or true-equator-of-date.
 * Allows optional correction for aberration.
 * Always corrects for light travel time (represents the object as seen by the observer
 * with light traveling to the Earth at finite speed, not where the object is right now).
 * <i>Topocentric</i> refers to a position as seen by an observer on the surface of the Earth.
 * This function corrects for
 * <a href="https://en.wikipedia.org/wiki/Parallax">parallax</a>
 * of the object between a geocentric observer and a topocentric observer.
 * This is most significant for the Moon, because it is so close to the Earth.
 * However, it can have a small effect on the apparent positions of other bodies.
 *
 * @param {Body} body
 *      The body for which to find equatorial coordinates.
 *      Not allowed to be `Body.Earth`.
 *
 * @param {FlexibleDateTime} date
 *      Specifies the date and time at which the body is to be observed.
 *
 * @param {Observer} observer
 *      The location on the Earth of the observer.
 *
 * @param {bool} ofdate
 *      Pass `true` to return equatorial coordinates of date,
 *      i.e. corrected for precession and nutation at the given date.
 *      This is needed to get correct horizontal coordinates when you call
 *      {@link Horizon}.
 *      Pass `false` to return equatorial coordinates in the J2000 system.
 *
 * @param {bool} aberration
 *      Pass `true` to correct for
 *      <a href="https://en.wikipedia.org/wiki/Aberration_of_light">aberration</a>,
 *      or `false` to leave uncorrected.
 *
 * @returns {EquatorialCoordinates}
 *      The topocentric coordinates of the body as adjusted for the given observer.
 */
function Equator(body, date, observer, ofdate, aberration) {
    VerifyObserver(observer);
    VerifyBoolean(ofdate);
    VerifyBoolean(aberration);
    const time = MakeTime(date);
    const gc_observer = geo_pos(time, observer);
    const gc = GeoVector(body, time, aberration);
    const j2000 = [
        gc.x - gc_observer[0],
        gc.y - gc_observer[1],
        gc.z - gc_observer[2]
    ];
    if (!ofdate)
        return vector2radec(j2000, time);
    const datevect = gyration(j2000, time, PrecessDirection.From2000);
    return vector2radec(datevect, time);
}
exports.Equator = Equator;
/**
 * @brief Calculates geocentric equatorial coordinates of an observer on the surface of the Earth.
 *
 * This function calculates a vector from the center of the Earth to
 * a point on or near the surface of the Earth, expressed in equatorial
 * coordinates. It takes into account the rotation of the Earth at the given
 * time, along with the given latitude, longitude, and elevation of the observer.
 *
 * The caller may pass `ofdate` as `true` to return coordinates relative to the Earth's
 * equator at the specified time, or `false` to use the J2000 equator.
 *
 * The returned vector has components expressed in astronomical units (AU).
 * To convert to kilometers, multiply the `x`, `y`, and `z` values by
 * the constant value {@link KM_PER_AU}.
 *
 * The inverse of this function is also available: {@link VectorObserver}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the observer's position vector.
 *
 * @param {Observer} observer
 *      The geographic location of a point on or near the surface of the Earth.
 *
 * @param {boolean} ofdate
 *      Selects the date of the Earth's equator in which to express the equatorial coordinates.
 *      The caller may pass `false` to use the orientation of the Earth's equator
 *      at noon UTC on January 1, 2000, in which case this function corrects for precession
 *      and nutation of the Earth as it was at the moment specified by the `time` parameter.
 *      Or the caller may pass `true` to use the Earth's equator at `time`
 *      as the orientation.
 *
 * @returns {Vector}
 *      An equatorial vector from the center of the Earth to the specified location
 *      on (or near) the Earth's surface.
 */
function ObserverVector(date, observer, ofdate) {
    const time = MakeTime(date);
    const gast = sidereal_time(time);
    let ovec = terra(observer, gast).pos;
    if (!ofdate)
        ovec = gyration(ovec, time, PrecessDirection.Into2000);
    return VectorFromArray(ovec, time);
}
exports.ObserverVector = ObserverVector;
/**
 * @brief Calculates geocentric equatorial position and velocity of an observer on the surface of the Earth.
 *
 * This function calculates position and velocity vectors of an observer
 * on or near the surface of the Earth, expressed in equatorial
 * coordinates. It takes into account the rotation of the Earth at the given
 * time, along with the given latitude, longitude, and elevation of the observer.
 *
 * The caller may pass `ofdate` as `true` to return coordinates relative to the Earth's
 * equator at the specified time, or `false` to use the J2000 equator.
 *
 * The returned position vector has components expressed in astronomical units (AU).
 * To convert to kilometers, multiply the `x`, `y`, and `z` values by
 * the constant value {@link KM_PER_AU}.
 * The returned velocity vector has components expressed in AU/day.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the observer's position and velocity vectors.
 *
 * @param {Observer} observer
 *      The geographic location of a point on or near the surface of the Earth.
 *
 * @param {boolean} ofdate
 *      Selects the date of the Earth's equator in which to express the equatorial coordinates.
 *      The caller may pass `false` to use the orientation of the Earth's equator
 *      at noon UTC on January 1, 2000, in which case this function corrects for precession
 *      and nutation of the Earth as it was at the moment specified by the `time` parameter.
 *      Or the caller may pass `true` to use the Earth's equator at `time`
 *      as the orientation.
 *
 * @returns {StateVector}
 */
function ObserverState(date, observer, ofdate) {
    const time = MakeTime(date);
    const gast = sidereal_time(time);
    const svec = terra(observer, gast);
    const state = new StateVector(svec.pos[0], svec.pos[1], svec.pos[2], svec.vel[0], svec.vel[1], svec.vel[2], time);
    if (!ofdate)
        return gyration_posvel(state, time, PrecessDirection.Into2000);
    return state;
}
exports.ObserverState = ObserverState;
/**
 * @brief Calculates the geographic location corresponding to an equatorial vector.
 *
 * This is the inverse function of {@link ObserverVector}.
 * Given a geocentric equatorial vector, it returns the geographic
 * latitude, longitude, and elevation for that vector.
 *
 * @param {Vector} vector
 *      The geocentric equatorial position vector for which to find geographic coordinates.
 *      The components are expressed in Astronomical Units (AU).
 *      You can calculate AU by dividing kilometers by the constant {@link KM_PER_AU}.
 *      The time `vector.t` determines the Earth's rotation.
 *
 * @param {boolean} ofdate
 *      Selects the date of the Earth's equator in which `vector` is expressed.
 *      The caller may select `false` to use the orientation of the Earth's equator
 *      at noon UTC on January 1, 2000, in which case this function corrects for precession
 *      and nutation of the Earth as it was at the moment specified by `vector.t`.
 *      Or the caller may select `true` to use the Earth's equator at `vector.t`
 *      as the orientation.
 *
 * @returns {Observer}
 *      The geographic latitude, longitude, and elevation above sea level
 *      that corresponds to the given equatorial vector.
 */
function VectorObserver(vector, ofdate) {
    const gast = sidereal_time(vector.t);
    let ovec = [vector.x, vector.y, vector.z];
    if (!ofdate) {
        ovec = precession(ovec, vector.t, PrecessDirection.From2000);
        ovec = nutation(ovec, vector.t, PrecessDirection.From2000);
    }
    return inverse_terra(ovec, gast);
}
exports.VectorObserver = VectorObserver;
/**
 * @brief Calculates the gravitational acceleration experienced by an observer on the Earth.
 *
 * This function implements the WGS 84 Ellipsoidal Gravity Formula.
 * The result is a combination of inward gravitational acceleration
 * with outward centrifugal acceleration, as experienced by an observer
 * in the Earth's rotating frame of reference.
 * The resulting value increases toward the Earth's poles and decreases
 * toward the equator, consistent with changes of the weight measured
 * by a spring scale of a fixed mass moved to different latitudes and heights
 * on the Earth.
 *
 * @param {number} latitude
 *      The latitude of the observer in degrees north or south of the equator.
 *      By formula symmetry, positive latitudes give the same answer as negative
 *      latitudes, so the sign does not matter.
 *
 * @param {number} height
 *      The height above the sea level geoid in meters.
 *      No range checking is done; however, accuracy is only valid in the
 *      range 0 to 100000 meters.
 *
 * @returns {number}
 *      The effective gravitational acceleration expressed in meters per second squared [m/s^2].
 */
function ObserverGravity(latitude, height) {
    const s = Math.sin(latitude * exports.DEG2RAD);
    const s2 = s * s;
    const g0 = 9.7803253359 * (1.0 + 0.00193185265241 * s2) / Math.sqrt(1.0 - 0.00669437999013 * s2);
    return g0 * (1.0 - (3.15704e-07 - 2.10269e-09 * s2) * height + 7.37452e-14 * height * height);
}
exports.ObserverGravity = ObserverGravity;
function RotateEquatorialToEcliptic(equ, cos_ob, sin_ob) {
    // Rotate equatorial vector to obtain ecliptic vector.
    const ex = equ.x;
    const ey = equ.y * cos_ob + equ.z * sin_ob;
    const ez = -equ.y * sin_ob + equ.z * cos_ob;
    const xyproj = Math.hypot(ex, ey);
    let elon = 0;
    if (xyproj > 0) {
        elon = exports.RAD2DEG * Math.atan2(ey, ex);
        if (elon < 0)
            elon += 360;
    }
    let elat = exports.RAD2DEG * Math.atan2(ez, xyproj);
    let ecl = new Vector(ex, ey, ez, equ.t);
    return new EclipticCoordinates(ecl, elat, elon);
}
/**
 * @brief Converts a J2000 mean equator (EQJ) vector to a true ecliptic of date (ETC) vector and angles.
 *
 * Given coordinates relative to the Earth's equator at J2000 (the instant of noon UTC
 * on 1 January 2000), this function converts those coordinates to true ecliptic coordinates
 * that are relative to the plane of the Earth's orbit around the Sun on that date.
 *
 * @param {Vector} eqj
 *      Equatorial coordinates in the EQJ frame of reference.
 *      You can call {@link GeoVector} to obtain suitable equatorial coordinates.
 *
 * @returns {EclipticCoordinates}
 */
function Ecliptic(eqj) {
    // Calculate nutation and obliquity for this time.
    // As an optimization, the nutation angles are cached in `time`,
    // and reused below when the `nutation` function is called.
    const et = e_tilt(eqj.t);
    // Convert mean J2000 equator (EQJ) to true equator of date (EQD).
    const eqj_pos = [eqj.x, eqj.y, eqj.z];
    const mean_pos = precession(eqj_pos, eqj.t, PrecessDirection.From2000);
    const [x, y, z] = nutation(mean_pos, eqj.t, PrecessDirection.From2000);
    const eqd = new Vector(x, y, z, eqj.t);
    // Rotate from EQD to true ecliptic of date (ECT).
    const tobl = et.tobl * exports.DEG2RAD;
    return RotateEquatorialToEcliptic(eqd, Math.cos(tobl), Math.sin(tobl));
}
exports.Ecliptic = Ecliptic;
/**
 * @brief Calculates equatorial geocentric Cartesian coordinates for the Moon.
 *
 * Given a time of observation, calculates the Moon's position as a vector.
 * The vector gives the location of the Moon's center relative to the Earth's center
 * with x-, y-, and z-components measured in astronomical units.
 * The coordinates are oriented with respect to the Earth's equator at the J2000 epoch.
 * In Astronomy Engine, this orientation is called EQJ.
 * Based on the Nautical Almanac Office's <i>Improved Lunar Ephemeris</i> of 1954,
 * which in turn derives from E. W. Brown's lunar theories.
 * Adapted from Turbo Pascal code from the book
 * <a href="https://www.springer.com/us/book/9783540672210">Astronomy on the Personal Computer</a>
 * by Montenbruck and Pfleger.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the Moon's geocentric position.
 *
 * @returns {Vector}
 */
function GeoMoon(date) {
    const time = MakeTime(date);
    const moon = CalcMoon(time);
    // Convert geocentric ecliptic spherical coords to cartesian coords.
    const dist_cos_lat = moon.distance_au * Math.cos(moon.geo_eclip_lat);
    const gepos = [
        dist_cos_lat * Math.cos(moon.geo_eclip_lon),
        dist_cos_lat * Math.sin(moon.geo_eclip_lon),
        moon.distance_au * Math.sin(moon.geo_eclip_lat)
    ];
    // Convert ecliptic coordinates to equatorial coordinates, both in mean equinox of date.
    const mpos1 = ecl2equ_vec(time, gepos);
    // Convert from mean equinox of date to J2000...
    const mpos2 = precession(mpos1, time, PrecessDirection.Into2000);
    return new Vector(mpos2[0], mpos2[1], mpos2[2], time);
}
exports.GeoMoon = GeoMoon;
/**
 * @brief Calculates spherical ecliptic geocentric position of the Moon.
 *
 * Given a time of observation, calculates the Moon's geocentric position
 * in ecliptic spherical coordinates. Provides the ecliptic latitude and
 * longitude in degrees, and the geocentric distance in astronomical units (AU).
 *
 * The ecliptic angles are measured in "ECT": relative to the true ecliptic plane and
 * equatorial plane at the specified time. This means the Earth's equator
 * is corrected for precession and nutation, and the plane of the Earth's
 * orbit is corrected for gradual obliquity drift.
 *
 * This algorithm is based on the Nautical Almanac Office's <i>Improved Lunar Ephemeris</i> of 1954,
 * which in turn derives from E. W. Brown's lunar theories from the early twentieth century.
 * It is adapted from Turbo Pascal code from the book
 * <a href="https://www.springer.com/us/book/9783540672210">Astronomy on the Personal Computer</a>
 * by Montenbruck and Pfleger.
 *
 * To calculate a J2000 mean equator vector instead, use {@link GeoMoon}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the Moon's position.
 *
 * @returns {Spherical}
 */
function EclipticGeoMoon(date) {
    const time = MakeTime(date);
    const moon = CalcMoon(time);
    // Convert spherical coordinates to a vector.
    // The MoonResult angles are already expressed in radians.
    const dist_cos_lat = moon.distance_au * Math.cos(moon.geo_eclip_lat);
    const ecm = [
        dist_cos_lat * Math.cos(moon.geo_eclip_lon),
        dist_cos_lat * Math.sin(moon.geo_eclip_lon),
        moon.distance_au * Math.sin(moon.geo_eclip_lat)
    ];
    // Obtain true and mean obliquity angles for the given time.
    // This serves to pre-calculate the nutation also, and cache it in `time`.
    const et = e_tilt(time);
    // Convert ecliptic coordinates to equatorial coordinates, both in mean equinox of date.
    const eqm = obl_ecl2equ_vec(et.mobl, ecm);
    // Add nutation to convert ECM to true equatorial coordinates of date (EQD).
    const eqd = nutation(eqm, time, PrecessDirection.From2000);
    const eqd_vec = VectorFromArray(eqd, time);
    // Convert back to ecliptic, this time in true equinox of date (ECT).
    const toblRad = et.tobl * exports.DEG2RAD;
    const cos_tobl = Math.cos(toblRad);
    const sin_tobl = Math.sin(toblRad);
    const eclip = RotateEquatorialToEcliptic(eqd_vec, cos_tobl, sin_tobl);
    return new Spherical(eclip.elat, eclip.elon, moon.distance_au);
}
exports.EclipticGeoMoon = EclipticGeoMoon;
/**
 * @brief Calculates equatorial geocentric position and velocity of the Moon at a given time.
 *
 * Given a time of observation, calculates the Moon's position and velocity vectors.
 * The position and velocity are of the Moon's center relative to the Earth's center.
 * The position (x, y, z) components are expressed in AU (astronomical units).
 * The velocity (vx, vy, vz) components are expressed in AU/day.
 * The coordinates are oriented with respect to the Earth's equator at the J2000 epoch.
 * In Astronomy Engine, this orientation is called EQJ.
 * If you need the Moon's position only, and not its velocity,
 * it is much more efficient to use {@link GeoMoon} instead.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the Moon's geocentric state.
 *
 * @returns {StateVector}
 */
function GeoMoonState(date) {
    const time = MakeTime(date);
    // This is a hack, because trying to figure out how to derive a time
    // derivative for CalcMoon() would be extremely painful!
    // Calculate just before and just after the given time.
    // Average to find position, subtract to find velocity.
    const dt = 1.0e-5; // 0.864 seconds
    const t1 = time.AddDays(-dt);
    const t2 = time.AddDays(+dt);
    const r1 = GeoMoon(t1);
    const r2 = GeoMoon(t2);
    return new StateVector((r1.x + r2.x) / 2, (r1.y + r2.y) / 2, (r1.z + r2.z) / 2, (r2.x - r1.x) / (2 * dt), (r2.y - r1.y) / (2 * dt), (r2.z - r1.z) / (2 * dt), time);
}
exports.GeoMoonState = GeoMoonState;
/**
 * @brief Calculates the geocentric position and velocity of the Earth/Moon barycenter.
 *
 * Given a time of observation, calculates the geocentric position and velocity vectors
 * of the Earth/Moon barycenter (EMB).
 * The position (x, y, z) components are expressed in AU (astronomical units).
 * The velocity (vx, vy, vz) components are expressed in AU/day.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the EMB's geocentric state.
 *
 * @returns {StateVector}
 */
function GeoEmbState(date) {
    const time = MakeTime(date);
    const s = GeoMoonState(time);
    const d = 1.0 + EARTH_MOON_MASS_RATIO;
    return new StateVector(s.x / d, s.y / d, s.z / d, s.vx / d, s.vy / d, s.vz / d, time);
}
exports.GeoEmbState = GeoEmbState;
function VsopFormula(formula, t, clamp_angle) {
    let tpower = 1;
    let coord = 0;
    for (let series of formula) {
        let sum = 0;
        for (let [ampl, phas, freq] of series)
            sum += ampl * Math.cos(phas + (t * freq));
        let incr = tpower * sum;
        if (clamp_angle)
            incr %= PI2; // improve precision for longitudes: they can be hundreds of radians
        coord += incr;
        tpower *= t;
    }
    return coord;
}
function VsopDeriv(formula, t) {
    let tpower = 1; // t^s
    let dpower = 0; // t^(s-1)
    let deriv = 0;
    let s = 0;
    for (let series of formula) {
        let sin_sum = 0;
        let cos_sum = 0;
        for (let [ampl, phas, freq] of series) {
            let angle = phas + (t * freq);
            sin_sum += ampl * freq * Math.sin(angle);
            if (s > 0)
                cos_sum += ampl * Math.cos(angle);
        }
        deriv += (s * dpower * cos_sum) - (tpower * sin_sum);
        dpower = tpower;
        tpower *= t;
        ++s;
    }
    return deriv;
}
const DAYS_PER_MILLENNIUM = 365250;
const LON_INDEX = 0;
const LAT_INDEX = 1;
const RAD_INDEX = 2;
function VsopRotate(eclip) {
    // Convert ecliptic cartesian coordinates to equatorial cartesian coordinates.
    return new TerseVector(eclip[0] + 0.000000440360 * eclip[1] - 0.000000190919 * eclip[2], -0.000000479966 * eclip[0] + 0.917482137087 * eclip[1] - 0.397776982902 * eclip[2], 0.397776982902 * eclip[1] + 0.917482137087 * eclip[2]);
}
function VsopSphereToRect(lon, lat, radius) {
    // Convert spherical coordinates to ecliptic cartesian coordinates.
    const r_coslat = radius * Math.cos(lat);
    const coslon = Math.cos(lon);
    const sinlon = Math.sin(lon);
    return [
        r_coslat * coslon,
        r_coslat * sinlon,
        radius * Math.sin(lat)
    ];
}
function CalcVsop(model, time) {
    const t = time.tt / DAYS_PER_MILLENNIUM; // millennia since 2000
    const lon = VsopFormula(model[LON_INDEX], t, true);
    const lat = VsopFormula(model[LAT_INDEX], t, false);
    const rad = VsopFormula(model[RAD_INDEX], t, false);
    const eclip = VsopSphereToRect(lon, lat, rad);
    return VsopRotate(eclip).ToAstroVector(time);
}
function CalcVsopPosVel(model, tt) {
    const t = tt / DAYS_PER_MILLENNIUM;
    // Calculate the VSOP "B" trigonometric series to obtain ecliptic spherical coordinates.
    const lon = VsopFormula(model[LON_INDEX], t, true);
    const lat = VsopFormula(model[LAT_INDEX], t, false);
    const rad = VsopFormula(model[RAD_INDEX], t, false);
    const dlon_dt = VsopDeriv(model[LON_INDEX], t);
    const dlat_dt = VsopDeriv(model[LAT_INDEX], t);
    const drad_dt = VsopDeriv(model[RAD_INDEX], t);
    // Use spherical coords and spherical derivatives to calculate
    // the velocity vector in rectangular coordinates.
    const coslon = Math.cos(lon);
    const sinlon = Math.sin(lon);
    const coslat = Math.cos(lat);
    const sinlat = Math.sin(lat);
    const vx = (+(drad_dt * coslat * coslon)
        - (rad * sinlat * coslon * dlat_dt)
        - (rad * coslat * sinlon * dlon_dt));
    const vy = (+(drad_dt * coslat * sinlon)
        - (rad * sinlat * sinlon * dlat_dt)
        + (rad * coslat * coslon * dlon_dt));
    const vz = (+(drad_dt * sinlat)
        + (rad * coslat * dlat_dt));
    const eclip_pos = VsopSphereToRect(lon, lat, rad);
    // Convert speed units from [AU/millennium] to [AU/day].
    const eclip_vel = [
        vx / DAYS_PER_MILLENNIUM,
        vy / DAYS_PER_MILLENNIUM,
        vz / DAYS_PER_MILLENNIUM
    ];
    // Rotate the vectors from ecliptic to equatorial coordinates.
    const equ_pos = VsopRotate(eclip_pos);
    const equ_vel = VsopRotate(eclip_vel);
    return new body_state_t(tt, equ_pos, equ_vel);
}
function AdjustBarycenter(ssb, time, body, pmass) {
    const shift = pmass / (pmass + SUN_GM);
    const planet = CalcVsop(vsop[body], time);
    ssb.x += shift * planet.x;
    ssb.y += shift * planet.y;
    ssb.z += shift * planet.z;
}
function CalcSolarSystemBarycenter(time) {
    const ssb = new Vector(0.0, 0.0, 0.0, time);
    AdjustBarycenter(ssb, time, Body.Jupiter, JUPITER_GM);
    AdjustBarycenter(ssb, time, Body.Saturn, SATURN_GM);
    AdjustBarycenter(ssb, time, Body.Uranus, URANUS_GM);
    AdjustBarycenter(ssb, time, Body.Neptune, NEPTUNE_GM);
    return ssb;
}
// Pluto integrator begins ----------------------------------------------------
const PLUTO_NUM_STATES = 51;
const PLUTO_TIME_STEP = 29200;
const PLUTO_DT = 146;
const PLUTO_NSTEPS = 201;
const PlutoStateTable = [
    [-730000.0, [-26.118207232108, -14.376168177825, 3.384402515299], [1.6339372163656e-03, -2.7861699588508e-03, -1.3585880229445e-03]],
    [-700800.0, [41.974905202127, -0.448502952929, -12.770351505989], [7.3458569351457e-04, 2.2785014891658e-03, 4.8619778602049e-04]],
    [-671600.0, [14.706930780744, 44.269110540027, 9.353698474772], [-2.1000147999800e-03, 2.2295915939915e-04, 7.0143443551414e-04]],
    [-642400.0, [-29.441003929957, -6.430161530570, 6.858481011305], [8.4495803960544e-04, -3.0783914758711e-03, -1.2106305981192e-03]],
    [-613200.0, [39.444396946234, -6.557989760571, -13.913760296463], [1.1480029005873e-03, 2.2400006880665e-03, 3.5168075922288e-04]],
    [-584000.0, [20.230380950700, 43.266966657189, 7.382966091923], [-1.9754081700585e-03, 5.3457141292226e-04, 7.5929169129793e-04]],
    [-554800.0, [-30.658325364620, 2.093818874552, 9.880531138071], [6.1010603013347e-05, -3.1326500935382e-03, -9.9346125151067e-04]],
    [-525600.0, [35.737703251673, -12.587706024764, -14.677847247563], [1.5802939375649e-03, 2.1347678412429e-03, 1.9074436384343e-04]],
    [-496400.0, [25.466295188546, 41.367478338417, 5.216476873382], [-1.8054401046468e-03, 8.3283083599510e-04, 8.0260156912107e-04]],
    [-467200.0, [-29.847174904071, 10.636426313081, 12.297904180106], [-6.3257063052907e-04, -2.9969577578221e-03, -7.4476074151596e-04]],
    [-438000.0, [30.774692107687, -18.236637015304, -14.945535879896], [2.0113162005465e-03, 1.9353827024189e-03, -2.0937793168297e-06]],
    [-408800.0, [30.243153324028, 38.656267888503, 2.938501750218], [-1.6052508674468e-03, 1.1183495337525e-03, 8.3333973416824e-04]],
    [-379600.0, [-27.288984772533, 18.643162147874, 14.023633623329], [-1.1856388898191e-03, -2.7170609282181e-03, -4.9015526126399e-04]],
    [-350400.0, [24.519605196774, -23.245756064727, -14.626862367368], [2.4322321483154e-03, 1.6062008146048e-03, -2.3369181613312e-04]],
    [-321200.0, [34.505274805875, 35.125338586954, 0.557361475637], [-1.3824391637782e-03, 1.3833397561817e-03, 8.4823598806262e-04]],
    [-292000.0, [-23.275363915119, 25.818514298769, 15.055381588598], [-1.6062295460975e-03, -2.3395961498533e-03, -2.4377362639479e-04]],
    [-262800.0, [17.050384798092, -27.180376290126, -13.608963321694], [2.8175521080578e-03, 1.1358749093955e-03, -4.9548725258825e-04]],
    [-233600.0, [38.093671910285, 30.880588383337, -1.843688067413], [-1.1317697153459e-03, 1.6128814698472e-03, 8.4177586176055e-04]],
    [-204400.0, [-18.197852930878, 31.932869934309, 15.438294826279], [-1.9117272501813e-03, -1.9146495909842e-03, -1.9657304369835e-05]],
    [-175200.0, [8.528924039997, -29.618422200048, -11.805400994258], [3.1034370787005e-03, 5.1393633292430e-04, -7.7293066202546e-04]],
    [-146000.0, [40.946857258640, 25.904973592021, -4.256336240499], [-8.3652705194051e-04, 1.8129497136404e-03, 8.1564228273060e-04]],
    [-116800.0, [-12.326958895325, 36.881883446292, 15.217158258711], [-2.1166103705038e-03, -1.4814420035990e-03, 1.7401209844705e-04]],
    [-87600.0, [-0.633258375909, -30.018759794709, -9.171932874950], [3.2016994581737e-03, -2.5279858672148e-04, -1.0411088271861e-03]],
    [-58400.0, [42.936048423883, 20.344685584452, -6.588027007912], [-5.0525450073192e-04, 1.9910074335507e-03, 7.7440196540269e-04]],
    [-29200.0, [-5.975910552974, 40.611809958460, 14.470131723673], [-2.2184202156107e-03, -1.0562361130164e-03, 3.3652250216211e-04]],
    [0.0, [-9.875369580774, -27.978926224737, -5.753711824704], [3.0287533248818e-03, -1.1276087003636e-03, -1.2651326732361e-03]],
    [29200.0, [43.958831986165, 14.214147973292, -8.808306227163], [-1.4717608981871e-04, 2.1404187242141e-03, 7.1486567806614e-04]],
    [58400.0, [0.678136763520, 43.094461639362, 13.243238780721], [-2.2358226110718e-03, -6.3233636090933e-04, 4.7664798895648e-04]],
    [87600.0, [-18.282602096834, -23.305039586660, -1.766620508028], [2.5567245263557e-03, -1.9902940754171e-03, -1.3943491701082e-03]],
    [116800.0, [43.873338744526, 7.700705617215, -10.814273666425], [2.3174803055677e-04, 2.2402163127924e-03, 6.2988756452032e-04]],
    [146000.0, [7.392949027906, 44.382678951534, 11.629500214854], [-2.1932815453830e-03, -2.1751799585364e-04, 5.9556516201114e-04]],
    [175200.0, [-24.981690229261, -16.204012851426, 2.466457544298], [1.8193989149580e-03, -2.6765419531201e-03, -1.3848283502247e-03]],
    [204400.0, [42.530187039511, 0.845935508021, -12.554907527683], [6.5059779150669e-04, 2.2725657282262e-03, 5.1133743202822e-04]],
    [233600.0, [13.999526486822, 44.462363044894, 9.669418486465], [-2.1079296569252e-03, 1.7533423831993e-04, 6.9128485798076e-04]],
    [262800.0, [-29.184024803031, -7.371243995762, 6.493275957928], [9.3581363109681e-04, -3.0610357109184e-03, -1.2364201089345e-03]],
    [292000.0, [39.831980671753, -6.078405766765, -13.909815358656], [1.1117769689167e-03, 2.2362097830152e-03, 3.6230548231153e-04]],
    [321200.0, [20.294955108476, 43.417190420251, 7.450091985932], [-1.9742157451535e-03, 5.3102050468554e-04, 7.5938408813008e-04]],
    [350400.0, [-30.669992302160, 2.318743558955, 9.973480913858], [4.5605107450676e-05, -3.1308219926928e-03, -9.9066533301924e-04]],
    [379600.0, [35.626122155983, -12.897647509224, -14.777586508444], [1.6015684949743e-03, 2.1171931182284e-03, 1.8002516202204e-04]],
    [408800.0, [26.133186148561, 41.232139187599, 5.006401326220], [-1.7857704419579e-03, 8.6046232702817e-04, 8.0614690298954e-04]],
    [438000.0, [-29.576740229230, 11.863535943587, 12.631323039872], [-7.2292830060955e-04, -2.9587820140709e-03, -7.0824296450300e-04]],
    [467200.0, [29.910805787391, -19.159019294000, -15.013363865194], [2.0871080437997e-03, 1.8848372554514e-03, -3.8528655083926e-05]],
    [496400.0, [31.375957451819, 38.050372720763, 2.433138343754], [-1.5546055556611e-03, 1.1699815465629e-03, 8.3565439266001e-04]],
    [525600.0, [-26.360071336928, 20.662505904952, 14.414696258958], [-1.3142373118349e-03, -2.6236647854842e-03, -4.2542017598193e-04]],
    [554800.0, [22.599441488648, -24.508879898306, -14.484045731468], [2.5454108304806e-03, 1.4917058755191e-03, -3.0243665086079e-04]],
    [584000.0, [35.877864013014, 33.894226366071, -0.224524636277], [-1.2941245730845e-03, 1.4560427668319e-03, 8.4762160640137e-04]],
    [613200.0, [-21.538149762417, 28.204068269761, 15.321973799534], [-1.7312117409010e-03, -2.1939631314577e-03, -1.6316913275180e-04]],
    [642400.0, [13.971521374415, -28.339941764789, -13.083792871886], [2.9334630526035e-03, 9.1860931752944e-04, -5.9939422488627e-04]],
    [671600.0, [39.526942044143, 28.939897360110, -2.872799527539], [-1.0068481658095e-03, 1.7021132888090e-03, 8.3578230511981e-04]],
    [700800.0, [-15.576200701394, 34.399412961275, 15.466033737854], [-2.0098814612884e-03, -1.7191109825989e-03, 7.0414782780416e-05]],
    [730000.0, [4.243252837090, -30.118201690825, -10.707441231349], [3.1725847067411e-03, 1.6098461202270e-04, -9.0672150593868e-04]]
];
class TerseVector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    clone() {
        return new TerseVector(this.x, this.y, this.z);
    }
    ToAstroVector(t) {
        return new Vector(this.x, this.y, this.z, t);
    }
    static zero() {
        return new TerseVector(0, 0, 0);
    }
    quadrature() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    add(other) {
        return new TerseVector(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    sub(other) {
        return new TerseVector(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    incr(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }
    decr(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
    }
    mul(scalar) {
        return new TerseVector(scalar * this.x, scalar * this.y, scalar * this.z);
    }
    div(scalar) {
        return new TerseVector(this.x / scalar, this.y / scalar, this.z / scalar);
    }
    mean(other) {
        return new TerseVector((this.x + other.x) / 2, (this.y + other.y) / 2, (this.z + other.z) / 2);
    }
    neg() {
        return new TerseVector(-this.x, -this.y, -this.z);
    }
}
class body_state_t {
    constructor(tt, r, v) {
        this.tt = tt;
        this.r = r;
        this.v = v;
    }
    clone() {
        return new body_state_t(this.tt, this.r, this.v);
    }
    sub(other) {
        return new body_state_t(this.tt, this.r.sub(other.r), this.v.sub(other.v));
    }
}
function BodyStateFromTable(entry) {
    let [tt, [rx, ry, rz], [vx, vy, vz]] = entry;
    return new body_state_t(tt, new TerseVector(rx, ry, rz), new TerseVector(vx, vy, vz));
}
function AdjustBarycenterPosVel(ssb, tt, body, planet_gm) {
    const shift = planet_gm / (planet_gm + SUN_GM);
    const planet = CalcVsopPosVel(vsop[body], tt);
    ssb.r.incr(planet.r.mul(shift));
    ssb.v.incr(planet.v.mul(shift));
    return planet;
}
function AccelerationIncrement(small_pos, gm, major_pos) {
    const delta = major_pos.sub(small_pos);
    const r2 = delta.quadrature();
    return delta.mul(gm / (r2 * Math.sqrt(r2)));
}
class major_bodies_t {
    constructor(tt) {
        // Accumulate the Solar System Barycenter position.
        let ssb = new body_state_t(tt, new TerseVector(0, 0, 0), new TerseVector(0, 0, 0));
        this.Jupiter = AdjustBarycenterPosVel(ssb, tt, Body.Jupiter, JUPITER_GM);
        this.Saturn = AdjustBarycenterPosVel(ssb, tt, Body.Saturn, SATURN_GM);
        this.Uranus = AdjustBarycenterPosVel(ssb, tt, Body.Uranus, URANUS_GM);
        this.Neptune = AdjustBarycenterPosVel(ssb, tt, Body.Neptune, NEPTUNE_GM);
        // Convert planets' [pos, vel] vectors from heliocentric to barycentric.
        this.Jupiter.r.decr(ssb.r);
        this.Jupiter.v.decr(ssb.v);
        this.Saturn.r.decr(ssb.r);
        this.Saturn.v.decr(ssb.v);
        this.Uranus.r.decr(ssb.r);
        this.Uranus.v.decr(ssb.v);
        this.Neptune.r.decr(ssb.r);
        this.Neptune.v.decr(ssb.v);
        // Convert heliocentric SSB to barycentric Sun.
        this.Sun = new body_state_t(tt, ssb.r.mul(-1), ssb.v.mul(-1));
    }
    Acceleration(pos) {
        // Use barycentric coordinates of the Sun and major planets to calculate
        // the gravitational acceleration vector experienced at location 'pos'.
        let acc = AccelerationIncrement(pos, SUN_GM, this.Sun.r);
        acc.incr(AccelerationIncrement(pos, JUPITER_GM, this.Jupiter.r));
        acc.incr(AccelerationIncrement(pos, SATURN_GM, this.Saturn.r));
        acc.incr(AccelerationIncrement(pos, URANUS_GM, this.Uranus.r));
        acc.incr(AccelerationIncrement(pos, NEPTUNE_GM, this.Neptune.r));
        return acc;
    }
}
/**
 * @ignore
 *
 * @brief The state of a body at an incremental step in a gravity simulation.
 *
 * This is an internal data structure used to represent the
 * position, velocity, and acceleration vectors of a body
 * in a gravity simulation at a given moment in time.
 *
 * @property tt
 *      The J2000 terrestrial time of the state [days].
 *
 * @property r
 *      The position vector [au].
 *
 * @property v
 *      The velocity vector [au/day].
 *
 * @property a
 *      The acceleration vector [au/day^2].
 */
class body_grav_calc_t {
    constructor(tt, r, v, a) {
        this.tt = tt;
        this.r = r;
        this.v = v;
        this.a = a;
    }
    clone() {
        return new body_grav_calc_t(this.tt, this.r.clone(), this.v.clone(), this.a.clone());
    }
}
class grav_sim_t {
    constructor(bary, grav) {
        this.bary = bary;
        this.grav = grav;
    }
}
function UpdatePosition(dt, r, v, a) {
    return new TerseVector(r.x + dt * (v.x + dt * a.x / 2), r.y + dt * (v.y + dt * a.y / 2), r.z + dt * (v.z + dt * a.z / 2));
}
function UpdateVelocity(dt, v, a) {
    return new TerseVector(v.x + dt * a.x, v.y + dt * a.y, v.z + dt * a.z);
}
function GravSim(tt2, calc1) {
    const dt = tt2 - calc1.tt;
    // Calculate where the major bodies (Sun, Jupiter...Neptune) will be at tt2.
    const bary2 = new major_bodies_t(tt2);
    // Estimate position of small body as if current acceleration applies across the whole time interval.
    const approx_pos = UpdatePosition(dt, calc1.r, calc1.v, calc1.a);
    // Calculate the average acceleration of the endpoints.
    // This becomes our estimate of the mean effective acceleration over the whole interval.
    const mean_acc = bary2.Acceleration(approx_pos).mean(calc1.a);
    // Refine the estimates of [pos, vel, acc] at tt2 using the mean acceleration.
    const pos = UpdatePosition(dt, calc1.r, calc1.v, mean_acc);
    const vel = calc1.v.add(mean_acc.mul(dt));
    const acc = bary2.Acceleration(pos);
    const grav = new body_grav_calc_t(tt2, pos, vel, acc);
    return new grav_sim_t(bary2, grav);
}
const pluto_cache = [];
function ClampIndex(frac, nsteps) {
    const index = Math.floor(frac);
    if (index < 0)
        return 0;
    if (index >= nsteps)
        return nsteps - 1;
    return index;
}
function GravFromState(entry) {
    const state = BodyStateFromTable(entry);
    const bary = new major_bodies_t(state.tt);
    const r = state.r.add(bary.Sun.r);
    const v = state.v.add(bary.Sun.v);
    const a = bary.Acceleration(r);
    const grav = new body_grav_calc_t(state.tt, r, v, a);
    return new grav_sim_t(bary, grav);
}
function GetSegment(cache, tt) {
    const t0 = PlutoStateTable[0][0];
    if (tt < t0 || tt > PlutoStateTable[PLUTO_NUM_STATES - 1][0]) {
        // Don't bother calculating a segment. Let the caller crawl backward/forward to this time.
        return null;
    }
    const seg_index = ClampIndex((tt - t0) / PLUTO_TIME_STEP, PLUTO_NUM_STATES - 1);
    if (!cache[seg_index]) {
        const seg = cache[seg_index] = [];
        // Each endpoint is exact.
        seg[0] = GravFromState(PlutoStateTable[seg_index]).grav;
        seg[PLUTO_NSTEPS - 1] = GravFromState(PlutoStateTable[seg_index + 1]).grav;
        // Simulate forwards from the lower time bound.
        let i;
        let step_tt = seg[0].tt;
        for (i = 1; i < PLUTO_NSTEPS - 1; ++i)
            seg[i] = GravSim(step_tt += PLUTO_DT, seg[i - 1]).grav;
        // Simulate backwards from the upper time bound.
        step_tt = seg[PLUTO_NSTEPS - 1].tt;
        var reverse = [];
        reverse[PLUTO_NSTEPS - 1] = seg[PLUTO_NSTEPS - 1];
        for (i = PLUTO_NSTEPS - 2; i > 0; --i)
            reverse[i] = GravSim(step_tt -= PLUTO_DT, reverse[i + 1]).grav;
        // Fade-mix the two series so that there are no discontinuities.
        for (i = PLUTO_NSTEPS - 2; i > 0; --i) {
            const ramp = i / (PLUTO_NSTEPS - 1);
            seg[i].r = seg[i].r.mul(1 - ramp).add(reverse[i].r.mul(ramp));
            seg[i].v = seg[i].v.mul(1 - ramp).add(reverse[i].v.mul(ramp));
            seg[i].a = seg[i].a.mul(1 - ramp).add(reverse[i].a.mul(ramp));
        }
    }
    return cache[seg_index];
}
function CalcPlutoOneWay(entry, target_tt, dt) {
    let sim = GravFromState(entry);
    const n = Math.ceil((target_tt - sim.grav.tt) / dt);
    for (let i = 0; i < n; ++i)
        sim = GravSim((i + 1 === n) ? target_tt : (sim.grav.tt + dt), sim.grav);
    return sim;
}
function CalcPluto(time, helio) {
    let r, v, bary;
    const seg = GetSegment(pluto_cache, time.tt);
    if (!seg) {
        // The target time is outside the year range 0000..4000.
        // Calculate it by crawling backward from 0000 or forward from 4000.
        // FIXFIXFIX - This is super slow. Could optimize this with extra caching if needed.
        let sim;
        if (time.tt < PlutoStateTable[0][0])
            sim = CalcPlutoOneWay(PlutoStateTable[0], time.tt, -PLUTO_DT);
        else
            sim = CalcPlutoOneWay(PlutoStateTable[PLUTO_NUM_STATES - 1], time.tt, +PLUTO_DT);
        r = sim.grav.r;
        v = sim.grav.v;
        bary = sim.bary;
    }
    else {
        const left = ClampIndex((time.tt - seg[0].tt) / PLUTO_DT, PLUTO_NSTEPS - 1);
        const s1 = seg[left];
        const s2 = seg[left + 1];
        // Find mean acceleration vector over the interval.
        const acc = s1.a.mean(s2.a);
        // Use Newtonian mechanics to extrapolate away from t1 in the positive time direction.
        const ra = UpdatePosition(time.tt - s1.tt, s1.r, s1.v, acc);
        const va = UpdateVelocity(time.tt - s1.tt, s1.v, acc);
        // Use Newtonian mechanics to extrapolate away from t2 in the negative time direction.
        const rb = UpdatePosition(time.tt - s2.tt, s2.r, s2.v, acc);
        const vb = UpdateVelocity(time.tt - s2.tt, s2.v, acc);
        // Use fade in/out idea to blend the two position estimates.
        const ramp = (time.tt - s1.tt) / PLUTO_DT;
        r = ra.mul(1 - ramp).add(rb.mul(ramp));
        v = va.mul(1 - ramp).add(vb.mul(ramp));
    }
    if (helio) {
        // Convert barycentric vectors to heliocentric vectors.
        if (!bary)
            bary = new major_bodies_t(time.tt);
        r = r.sub(bary.Sun.r);
        v = v.sub(bary.Sun.v);
    }
    return new StateVector(r.x, r.y, r.z, v.x, v.y, v.z, time);
}
;
const Rotation_JUP_EQJ = new RotationMatrix([
    [9.99432765338654e-01, -3.36771074697641e-02, 0.00000000000000e+00],
    [3.03959428906285e-02, 9.02057912352809e-01, 4.30543388542295e-01],
    [-1.44994559663353e-02, -4.30299169409101e-01, 9.02569881273754e-01]
]);
const JupiterMoonModel = [
    // [0] Io
    {
        mu: 2.8248942843381399e-07,
        al: [1.4462132960212239e+00, 3.5515522861824000e+00],
        a: [
            [0.0028210960212903, 0.0000000000000000e+00, 0.0000000000000000e+00]
        ],
        l: [
            [-0.0001925258348666, 4.9369589722644998e+00, 1.3584836583050000e-02],
            [-0.0000970803596076, 4.3188796477322002e+00, 1.3034138432430000e-02],
            [-0.0000898817416500, 1.9080016428616999e+00, 3.0506486715799999e-03],
            [-0.0000553101050262, 1.4936156681568999e+00, 1.2938928911549999e-02]
        ],
        z: [
            [0.0041510849668155, 4.0899396355450000e+00, -1.2906864146660001e-02],
            [0.0006260521444113, 1.4461888986270000e+00, 3.5515522949801999e+00],
            [0.0000352747346169, 2.1256287034577999e+00, 1.2727416566999999e-04]
        ],
        zeta: [
            [0.0003142172466014, 2.7964219722923001e+00, -2.3150960980000000e-03],
            [0.0000904169207946, 1.0477061879627001e+00, -5.6920638196000003e-04]
        ]
    },
    // [1] Europa
    {
        mu: 2.8248327439289299e-07,
        al: [-3.7352634374713622e-01, 1.7693227111234699e+00],
        a: [
            [0.0044871037804314, 0.0000000000000000e+00, 0.0000000000000000e+00],
            [0.0000004324367498, 1.8196456062910000e+00, 1.7822295777568000e+00]
        ],
        l: [
            [0.0008576433172936, 4.3188693178264002e+00, 1.3034138308049999e-02],
            [0.0004549582875086, 1.4936531751079001e+00, 1.2938928819619999e-02],
            [0.0003248939825174, 1.8196494533458001e+00, 1.7822295777568000e+00],
            [-0.0003074250079334, 4.9377037005910998e+00, 1.3584832867240000e-02],
            [0.0001982386144784, 1.9079869054759999e+00, 3.0510121286900001e-03],
            [0.0001834063551804, 2.1402853388529000e+00, 1.4500978933800000e-03],
            [-0.0001434383188452, 5.6222140366630002e+00, 8.9111478887838003e-01],
            [-0.0000771939140944, 4.3002724372349999e+00, 2.6733443704265998e+00]
        ],
        z: [
            [-0.0093589104136341, 4.0899396509038999e+00, -1.2906864146660001e-02],
            [0.0002988994545555, 5.9097265185595003e+00, 1.7693227079461999e+00],
            [0.0002139036390350, 2.1256289300016000e+00, 1.2727418406999999e-04],
            [0.0001980963564781, 2.7435168292649998e+00, 6.7797343008999997e-04],
            [0.0001210388158965, 5.5839943711203004e+00, 3.2056614899999997e-05],
            [0.0000837042048393, 1.6094538368039000e+00, -9.0402165808846002e-01],
            [0.0000823525166369, 1.4461887708689001e+00, 3.5515522949801999e+00]
        ],
        zeta: [
            [0.0040404917832303, 1.0477063169425000e+00, -5.6920640539999997e-04],
            [0.0002200421034564, 3.3368857864364001e+00, -1.2491307306999999e-04],
            [0.0001662544744719, 2.4134862374710999e+00, 0.0000000000000000e+00],
            [0.0000590282470983, 5.9719930968366004e+00, -3.0561602250000000e-05]
        ]
    },
    // [2] Ganymede
    {
        mu: 2.8249818418472298e-07,
        al: [2.8740893911433479e-01, 8.7820792358932798e-01],
        a: [
            [0.0071566594572575, 0.0000000000000000e+00, 0.0000000000000000e+00],
            [0.0000013930299110, 1.1586745884981000e+00, 2.6733443704265998e+00]
        ],
        l: [
            [0.0002310797886226, 2.1402987195941998e+00, 1.4500978438400001e-03],
            [-0.0001828635964118, 4.3188672736968003e+00, 1.3034138282630000e-02],
            [0.0001512378778204, 4.9373102372298003e+00, 1.3584834812520000e-02],
            [-0.0001163720969778, 4.3002659861490002e+00, 2.6733443704265998e+00],
            [-0.0000955478069846, 1.4936612842567001e+00, 1.2938928798570001e-02],
            [0.0000815246854464, 5.6222137132535002e+00, 8.9111478887838003e-01],
            [-0.0000801219679602, 1.2995922951532000e+00, 1.0034433456728999e+00],
            [-0.0000607017260182, 6.4978769669238001e-01, 5.0172167043264004e-01]
        ],
        z: [
            [0.0014289811307319, 2.1256295942738999e+00, 1.2727413029000001e-04],
            [0.0007710931226760, 5.5836330003496002e+00, 3.2064341100000001e-05],
            [0.0005925911780766, 4.0899396636447998e+00, -1.2906864146660001e-02],
            [0.0002045597496146, 5.2713683670371996e+00, -1.2523544076106000e-01],
            [0.0001785118648258, 2.8743156721063001e-01, 8.7820792442520001e-01],
            [0.0001131999784893, 1.4462127277818000e+00, 3.5515522949801999e+00],
            [-0.0000658778169210, 2.2702423990985001e+00, -1.7951364394536999e+00],
            [0.0000497058888328, 5.9096792204858000e+00, 1.7693227129285001e+00]
        ],
        zeta: [
            [0.0015932721570848, 3.3368862796665000e+00, -1.2491307058000000e-04],
            [0.0008533093128905, 2.4133881688166001e+00, 0.0000000000000000e+00],
            [0.0003513347911037, 5.9720789850126996e+00, -3.0561017709999999e-05],
            [-0.0001441929255483, 1.0477061764435001e+00, -5.6920632124000004e-04]
        ]
    },
    // [3] Callisto
    {
        mu: 2.8249214488990899e-07,
        al: [-3.6203412913757038e-01, 3.7648623343382798e-01],
        a: [
            [0.0125879701715314, 0.0000000000000000e+00, 0.0000000000000000e+00],
            [0.0000035952049470, 6.4965776007116005e-01, 5.0172168165034003e-01],
            [0.0000027580210652, 1.8084235781510001e+00, 3.1750660413359002e+00]
        ],
        l: [
            [0.0005586040123824, 2.1404207189814999e+00, 1.4500979323100001e-03],
            [-0.0003805813868176, 2.7358844897852999e+00, 2.9729650620000000e-05],
            [0.0002205152863262, 6.4979652596399995e-01, 5.0172167243580001e-01],
            [0.0001877895151158, 1.8084787604004999e+00, 3.1750660413359002e+00],
            [0.0000766916975242, 6.2720114319754998e+00, 1.3928364636651001e+00],
            [0.0000747056855106, 1.2995916202344000e+00, 1.0034433456728999e+00]
        ],
        z: [
            [0.0073755808467977, 5.5836071576083999e+00, 3.2065099140000001e-05],
            [0.0002065924169942, 5.9209831565786004e+00, 3.7648624194703001e-01],
            [0.0001589869764021, 2.8744006242622999e-01, 8.7820792442520001e-01],
            [-0.0001561131605348, 2.1257397865089001e+00, 1.2727441285000001e-04],
            [0.0001486043380971, 1.4462134301023000e+00, 3.5515522949801999e+00],
            [0.0000635073108731, 5.9096803285953996e+00, 1.7693227129285001e+00],
            [0.0000599351698525, 4.1125517584797997e+00, -2.7985797954588998e+00],
            [0.0000540660842731, 5.5390350845569003e+00, 2.8683408228299999e-03],
            [-0.0000489596900866, 4.6218149483337996e+00, -6.2695712529518999e-01]
        ],
        zeta: [
            [0.0038422977898495, 2.4133922085556998e+00, 0.0000000000000000e+00],
            [0.0022453891791894, 5.9721736773277003e+00, -3.0561255249999997e-05],
            [-0.0002604479450559, 3.3368746306408998e+00, -1.2491309972000001e-04],
            [0.0000332112143230, 5.5604137742336999e+00, 2.9003768850700000e-03]
        ]
    }
];
/**
 * @brief Holds the positions and velocities of Jupiter's major 4 moons.
 *
 * The {@link JupiterMoons} function returns an object of this type
 * to report position and velocity vectors for Jupiter's largest 4 moons
 * Io, Europa, Ganymede, and Callisto. Each position vector is relative
 * to the center of Jupiter. Both position and velocity are oriented in
 * the EQJ system (that is, using Earth's equator at the J2000 epoch).
 * The positions are expressed in astronomical units (AU),
 * and the velocities in AU/day.
 *
 * @property {StateVector} io
 *      The position and velocity of Jupiter's moon Io.
 *
 * @property {StateVector} europa
 *      The position and velocity of Jupiter's moon Europa.
 *
 * @property {StateVector} ganymede
 *      The position and velocity of Jupiter's moon Ganymede.
 *
 * @property {StateVector} callisto
 *      The position and velocity of Jupiter's moon Callisto.
 */
class JupiterMoonsInfo {
    constructor(io, europa, ganymede, callisto) {
        this.io = io;
        this.europa = europa;
        this.ganymede = ganymede;
        this.callisto = callisto;
    }
}
exports.JupiterMoonsInfo = JupiterMoonsInfo;
function JupiterMoon_elem2pv(time, mu, elem) {
    // Translation of FORTRAN subroutine ELEM2PV from:
    // https://ftp.imcce.fr/pub/ephem/satel/galilean/L1/L1.2/
    const A = elem[0];
    const AL = elem[1];
    const K = elem[2];
    const H = elem[3];
    const Q = elem[4];
    const P = elem[5];
    const AN = Math.sqrt(mu / (A * A * A));
    let CE, SE, DE;
    let EE = AL + K * Math.sin(AL) - H * Math.cos(AL);
    do {
        CE = Math.cos(EE);
        SE = Math.sin(EE);
        DE = (AL - EE + K * SE - H * CE) / (1.0 - K * CE - H * SE);
        EE += DE;
    } while (Math.abs(DE) >= 1.0e-12);
    CE = Math.cos(EE);
    SE = Math.sin(EE);
    const DLE = H * CE - K * SE;
    const RSAM1 = -K * CE - H * SE;
    const ASR = 1.0 / (1.0 + RSAM1);
    const PHI = Math.sqrt(1.0 - K * K - H * H);
    const PSI = 1.0 / (1.0 + PHI);
    const X1 = A * (CE - K - PSI * H * DLE);
    const Y1 = A * (SE - H + PSI * K * DLE);
    const VX1 = AN * ASR * A * (-SE - PSI * H * RSAM1);
    const VY1 = AN * ASR * A * (+CE + PSI * K * RSAM1);
    const F2 = 2.0 * Math.sqrt(1.0 - Q * Q - P * P);
    const P2 = 1.0 - 2.0 * P * P;
    const Q2 = 1.0 - 2.0 * Q * Q;
    const PQ = 2.0 * P * Q;
    return new StateVector(X1 * P2 + Y1 * PQ, X1 * PQ + Y1 * Q2, (Q * Y1 - X1 * P) * F2, VX1 * P2 + VY1 * PQ, VX1 * PQ + VY1 * Q2, (Q * VY1 - VX1 * P) * F2, time);
}
function CalcJupiterMoon(time, m) {
    // This is a translation of FORTRAN code by Duriez, Lainey, and Vienne:
    // https://ftp.imcce.fr/pub/ephem/satel/galilean/L1/L1.2/
    const t = time.tt + 18262.5; // number of days since 1950-01-01T00:00:00Z
    // Calculate 6 orbital elements at the given time t
    const elem = [0, m.al[0] + (t * m.al[1]), 0, 0, 0, 0];
    for (let [amplitude, phase, frequency] of m.a)
        elem[0] += amplitude * Math.cos(phase + (t * frequency));
    for (let [amplitude, phase, frequency] of m.l)
        elem[1] += amplitude * Math.sin(phase + (t * frequency));
    elem[1] %= PI2;
    if (elem[1] < 0)
        elem[1] += PI2;
    for (let [amplitude, phase, frequency] of m.z) {
        const arg = phase + (t * frequency);
        elem[2] += amplitude * Math.cos(arg);
        elem[3] += amplitude * Math.sin(arg);
    }
    for (let [amplitude, phase, frequency] of m.zeta) {
        const arg = phase + (t * frequency);
        elem[4] += amplitude * Math.cos(arg);
        elem[5] += amplitude * Math.sin(arg);
    }
    // Convert the oribital elements into position vectors in the Jupiter equatorial system (JUP).
    const state = JupiterMoon_elem2pv(time, m.mu, elem);
    // Re-orient position and velocity vectors from Jupiter-equatorial (JUP) to Earth-equatorial in J2000 (EQJ).
    return RotateState(Rotation_JUP_EQJ, state);
}
/**
 * @brief Calculates jovicentric positions and velocities of Jupiter's largest 4 moons.
 *
 * Calculates position and velocity vectors for Jupiter's moons
 * Io, Europa, Ganymede, and Callisto, at the given date and time.
 * The vectors are jovicentric (relative to the center of Jupiter).
 * Their orientation is the Earth's equatorial system at the J2000 epoch (EQJ).
 * The position components are expressed in astronomical units (AU), and the
 * velocity components are in AU/day.
 *
 * To convert to heliocentric vectors, call {@link HelioVector}
 * with `Astronomy.Body.Jupiter` to get Jupiter's heliocentric position, then
 * add the jovicentric vectors. Likewise, you can call {@link GeoVector}
 * to convert to geocentric vectors.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate Jupiter's moons.
 *
 * @return {JupiterMoonsInfo}
 *      Position and velocity vectors of Jupiter's largest 4 moons.
 */
function JupiterMoons(date) {
    const time = new AstroTime(date);
    return new JupiterMoonsInfo(CalcJupiterMoon(time, JupiterMoonModel[0]), CalcJupiterMoon(time, JupiterMoonModel[1]), CalcJupiterMoon(time, JupiterMoonModel[2]), CalcJupiterMoon(time, JupiterMoonModel[3]));
}
exports.JupiterMoons = JupiterMoons;
// Jupiter Moons ends --------------------------------------------------------
/**
 * @brief Calculates a vector from the center of the Sun to the given body at the given time.
 *
 * Calculates heliocentric (i.e., with respect to the center of the Sun)
 * Cartesian coordinates in the J2000 equatorial system of a celestial
 * body at a specified time. The position is not corrected for light travel time or aberration.
 *
 * @param {Body} body
 *      One of the following values:
 *      `Body.Sun`, `Body.Moon`, `Body.Mercury`, `Body.Venus`,
 *      `Body.Earth`, `Body.Mars`, `Body.Jupiter`, `Body.Saturn`,
 *      `Body.Uranus`, `Body.Neptune`, `Body.Pluto`,
 *      `Body.SSB`, or `Body.EMB`.
 *      Also allowed to be a user-defined star created by {@link DefineStar}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which the body's position is to be calculated.
 *
 * @returns {Vector}
 */
function HelioVector(body, date) {
    var time = MakeTime(date);
    if (body in vsop)
        return CalcVsop(vsop[body], time);
    if (body === Body.Pluto) {
        const p = CalcPluto(time, true);
        return new Vector(p.x, p.y, p.z, time);
    }
    if (body === Body.Sun)
        return new Vector(0, 0, 0, time);
    if (body === Body.Moon) {
        var e = CalcVsop(vsop.Earth, time);
        var m = GeoMoon(time);
        return new Vector(e.x + m.x, e.y + m.y, e.z + m.z, time);
    }
    if (body === Body.EMB) {
        const e = CalcVsop(vsop.Earth, time);
        const m = GeoMoon(time);
        const denom = 1.0 + EARTH_MOON_MASS_RATIO;
        return new Vector(e.x + (m.x / denom), e.y + (m.y / denom), e.z + (m.z / denom), time);
    }
    if (body === Body.SSB)
        return CalcSolarSystemBarycenter(time);
    const star = UserDefinedStar(body);
    if (star) {
        const sphere = new Spherical(star.dec, 15 * star.ra, star.dist);
        return VectorFromSphere(sphere, time);
    }
    throw `HelioVector: Unknown body "${body}"`;
}
exports.HelioVector = HelioVector;
;
/**
 * @brief Calculates the distance between a body and the Sun at a given time.
 *
 * Given a date and time, this function calculates the distance between
 * the center of `body` and the center of the Sun.
 * For the planets Mercury through Neptune, this function is significantly
 * more efficient than calling {@link HelioVector} followed by taking the length
 * of the resulting vector.
 *
 * @param {Body} body
 *      A body for which to calculate a heliocentric distance:
 *      the Sun, Moon, any of the planets, or a user-defined star.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the heliocentric distance.
 *
 * @returns {number}
 *      The heliocentric distance in AU.
 */
function HelioDistance(body, date) {
    const star = UserDefinedStar(body);
    if (star)
        return star.dist;
    const time = MakeTime(date);
    if (body in vsop)
        return VsopFormula(vsop[body][RAD_INDEX], time.tt / DAYS_PER_MILLENNIUM, false);
    return HelioVector(body, time).Length();
}
exports.HelioDistance = HelioDistance;
/**
 * Solve for light travel time of a vector function.
 *
 * When observing a distant object, for example Jupiter as seen from Earth,
 * the amount of time it takes for light to travel from the object to the
 * observer can significantly affect the object's apparent position.
 * This function is a generic solver that figures out how long in the
 * past light must have left the observed object to reach the observer
 * at the specified observation time. It requires passing in `func`
 * to express an arbitrary position vector as a function of time.
 *
 * `CorrectLightTravel` repeatedly calls `func`, passing a series of time
 * estimates in the past. Then `func` must return a relative position vector between
 * the observer and the target. `CorrectLightTravel` keeps calling
 * `func` with more and more refined estimates of the time light must have
 * left the target to arrive at the observer.
 *
 * For common use cases, it is simpler to use {@link BackdatePosition}
 * for calculating the light travel time correction of one body observing another body.
 *
 * For geocentric calculations, {@link GeoVector} also backdates the returned
 * position vector for light travel time, only it returns the observation time in
 * the returned vector's `t` field rather than the backdated time.
 *
 * @param {function(AstroTime): number} func
 *      An arbitrary position vector as a function of time:
 *      function({@link AstroTime}) =&gt; {@link Vector}.
 *
 * @param {AstroTime} time
 *      The observation time for which to solve for light travel delay.
 *
 * @returns {AstroVector}
 *      The position vector at the solved backdated time.
 *      The `t` field holds the time that light left the observed
 *      body to arrive at the observer at the observation time.
 */
function CorrectLightTravel(func, time) {
    let ltime = time;
    let dt = 0;
    for (let iter = 0; iter < 10; ++iter) {
        const pos = func(ltime);
        const lt = pos.Length() / exports.C_AUDAY;
        // This solver does not support more than one light-day of distance,
        // because that would cause convergence problems and inaccurate
        // values for stellar aberration angles.
        if (lt > 1.0)
            throw `Object is too distant for light-travel solver.`;
        const ltime2 = time.AddDays(-lt);
        dt = Math.abs(ltime2.tt - ltime.tt);
        if (dt < 1.0e-9) // 86.4 microseconds
            return pos;
        ltime = ltime2;
    }
    throw `Light-travel time solver did not converge: dt = ${dt}`;
}
exports.CorrectLightTravel = CorrectLightTravel;
class BodyPosition {
    constructor(observerBody, targetBody, aberration, observerPos) {
        this.observerBody = observerBody;
        this.targetBody = targetBody;
        this.aberration = aberration;
        this.observerPos = observerPos;
    }
    Position(time) {
        if (this.aberration) {
            // The following discussion is worded with the observer body being the Earth,
            // which is often the case. However, the same reasoning applies to any observer body
            // without loss of generality.
            //
            // To include aberration, make a good first-order approximation
            // by backdating the Earth's position also.
            // This is confusing, but it works for objects within the Solar System
            // because the distance the Earth moves in that small amount of light
            // travel time (a few minutes to a few hours) is well approximated
            // by a line segment that substends the angle seen from the remote
            // body viewing Earth. That angle is pretty close to the aberration
            // angle of the moving Earth viewing the remote body.
            // In other words, both of the following approximate the aberration angle:
            //     (transverse distance Earth moves) / (distance to body)
            //     (transverse speed of Earth) / (speed of light).
            this.observerPos = HelioVector(this.observerBody, time);
        }
        else {
            // No aberration, so use the pre-calculated initial position of
            // the observer body that is already stored in `observerPos`.
        }
        const targetPos = HelioVector(this.targetBody, time);
        return new Vector(targetPos.x - this.observerPos.x, targetPos.y - this.observerPos.y, targetPos.z - this.observerPos.z, time);
    }
}
/**
 * @brief Solve for light travel time correction of apparent position.
 *
 * When observing a distant object, for example Jupiter as seen from Earth,
 * the amount of time it takes for light to travel from the object to the
 * observer can significantly affect the object's apparent position.
 *
 * This function solves the light travel time correction for the apparent
 * relative position vector of a target body as seen by an observer body
 * at a given observation time.
 *
 * For geocentric calculations, {@link GeoVector} also includes light
 * travel time correction, but the time `t` embedded in its returned vector
 * refers to the observation time, not the backdated time that light left
 * the observed body. Thus `BackdatePosition` provides direct
 * access to the light departure time for callers that need it.
 *
 * For a more generalized light travel correction solver, see {@link CorrectLightTravel}.
 *
 * @param {FlexibleDateTime} date
 *      The time of observation.
 *
 * @param {Body} observerBody
 *      The body to be used as the observation location.
 *
 * @param {Body} targetBody
 *      The body to be observed.
 *
 * @param {boolean} aberration
 *      `true` to correct for aberration, or `false` to leave uncorrected.
 *
 * @returns {Vector}
 *      The position vector at the solved backdated time.
 *      The `t` field holds the time that light left the observed
 *      body to arrive at the observer at the observation time.
 */
function BackdatePosition(date, observerBody, targetBody, aberration) {
    VerifyBoolean(aberration);
    const time = MakeTime(date);
    if (UserDefinedStar(targetBody)) {
        // This is a user-defined star, which must be treated as a special case.
        // First, we assume its heliocentric position does not change with time.
        // Second, we assume its heliocentric position has already been corrected
        // for light-travel time, its coordinates given as it appears on Earth at the present.
        // Therefore, no backdating is applied.
        const tvec = HelioVector(targetBody, time);
        if (aberration) {
            // (Observer velocity) - (light vector) = (Aberration-corrected direction to target body).
            // Note that this is an approximation, because technically the light vector should
            // be measured in barycentric coordinates, not heliocentric. The error is very small.
            const ostate = HelioState(observerBody, time);
            const rvec = new Vector(tvec.x - ostate.x, tvec.y - ostate.y, tvec.z - ostate.z, time);
            const s = exports.C_AUDAY / rvec.Length(); // conversion factor from relative distance to speed of light
            return new Vector(rvec.x + ostate.vx / s, rvec.y + ostate.vy / s, rvec.z + ostate.vz / s, time);
        }
        // No correction is needed. Simply return the star's current position as seen from the observer.
        const ovec = HelioVector(observerBody, time);
        return new Vector(tvec.x - ovec.x, tvec.y - ovec.y, tvec.z - ovec.z, time);
    }
    let observerPos;
    if (aberration) {
        // With aberration, `BackdatePosition` will calculate `observerPos` at different times.
        // Therefore, do not waste time calculating it now.
        // Create a placeholder value that will be ignored.
        observerPos = new Vector(0, 0, 0, time);
    }
    else {
        observerPos = HelioVector(observerBody, time);
    }
    const bpos = new BodyPosition(observerBody, targetBody, aberration, observerPos);
    return CorrectLightTravel(t => bpos.Position(t), time);
}
exports.BackdatePosition = BackdatePosition;
/**
 * @brief Calculates a vector from the center of the Earth to the given body at the given time.
 *
 * Calculates geocentric (i.e., with respect to the center of the Earth)
 * Cartesian coordinates in the J2000 equatorial system of a celestial
 * body at a specified time. The position is always corrected for light travel time:
 * this means the position of the body is "back-dated" based on how long it
 * takes light to travel from the body to an observer on the Earth.
 * Also, the position can optionally be corrected for aberration, an effect
 * causing the apparent direction of the body to be shifted based on
 * transverse movement of the Earth with respect to the rays of light
 * coming from that body.
 *
 * @param {Body} body
 *      One of the following values:
 *      `Body.Sun`, `Body.Moon`, `Body.Mercury`, `Body.Venus`,
 *      `Body.Earth`, `Body.Mars`, `Body.Jupiter`, `Body.Saturn`,
 *      `Body.Uranus`, `Body.Neptune`, or `Body.Pluto`.
 *      Also allowed to be a user-defined star created with {@link DefineStar}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which the body's position is to be calculated.
 *
 * @param {boolean} aberration
 *      Pass `true` to correct for
 *      <a href="https://en.wikipedia.org/wiki/Aberration_of_light">aberration</a>,
 *      or `false` to leave uncorrected.
 *
 * @returns {Vector}
 */
function GeoVector(body, date, aberration) {
    VerifyBoolean(aberration);
    const time = MakeTime(date);
    switch (body) {
        case Body.Earth:
            return new Vector(0, 0, 0, time);
        case Body.Moon:
            return GeoMoon(time);
        default:
            const vec = BackdatePosition(time, Body.Earth, body, aberration);
            vec.t = time; // tricky: return the observation time, not the backdated time
            return vec;
    }
}
exports.GeoVector = GeoVector;
function ExportState(terse, time) {
    return new StateVector(terse.r.x, terse.r.y, terse.r.z, terse.v.x, terse.v.y, terse.v.z, time);
}
/**
 * @brief  Calculates barycentric position and velocity vectors for the given body.
 *
 * Given a body and a time, calculates the barycentric position and velocity
 * vectors for the center of that body at that time.
 * The vectors are expressed in J2000 mean equator coordinates (EQJ).
 *
 * @param {Body} body
 *      The celestial body whose barycentric state vector is to be calculated.
 *      Supported values are `Body.Sun`, `Body.Moon`, `Body.EMB`, `Body.SSB`, and all planets:
 *      `Body.Mercury`, `Body.Venus`, `Body.Earth`, `Body.Mars`, `Body.Jupiter`,
 *      `Body.Saturn`, `Body.Uranus`, `Body.Neptune`, `Body.Pluto`.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate position and velocity.
 *
 *  @returns {StateVector}
 *      An object that contains barycentric position and velocity vectors.
 */
function BaryState(body, date) {
    const time = MakeTime(date);
    if (body === Body.SSB) {
        // Trivial case: the solar system barycenter itself.
        return new StateVector(0, 0, 0, 0, 0, 0, time);
    }
    if (body === Body.Pluto) {
        return CalcPluto(time, false);
    }
    // Find the barycentric positions and velocities for the 5 major bodies:
    // Sun, Jupiter, Saturn, Uranus, Neptune.
    const bary = new major_bodies_t(time.tt);
    switch (body) {
        case Body.Sun: return ExportState(bary.Sun, time);
        case Body.Jupiter: return ExportState(bary.Jupiter, time);
        case Body.Saturn: return ExportState(bary.Saturn, time);
        case Body.Uranus: return ExportState(bary.Uranus, time);
        case Body.Neptune: return ExportState(bary.Neptune, time);
        case Body.Moon:
        case Body.EMB:
            const earth = CalcVsopPosVel(vsop[Body.Earth], time.tt);
            const state = (body === Body.Moon) ? GeoMoonState(time) : GeoEmbState(time);
            return new StateVector(state.x + bary.Sun.r.x + earth.r.x, state.y + bary.Sun.r.y + earth.r.y, state.z + bary.Sun.r.z + earth.r.z, state.vx + bary.Sun.v.x + earth.v.x, state.vy + bary.Sun.v.y + earth.v.y, state.vz + bary.Sun.v.z + earth.v.z, time);
    }
    // Handle the remaining VSOP bodies: Mercury, Venus, Earth, Mars.
    if (body in vsop) {
        const planet = CalcVsopPosVel(vsop[body], time.tt);
        return new StateVector(bary.Sun.r.x + planet.r.x, bary.Sun.r.y + planet.r.y, bary.Sun.r.z + planet.r.z, bary.Sun.v.x + planet.v.x, bary.Sun.v.y + planet.v.y, bary.Sun.v.z + planet.v.z, time);
    }
    throw `BaryState: Unsupported body "${body}"`;
}
exports.BaryState = BaryState;
/**
 * @brief  Calculates heliocentric position and velocity vectors for the given body.
 *
 * Given a body and a time, calculates the position and velocity
 * vectors for the center of that body at that time, relative to the center of the Sun.
 * The vectors are expressed in J2000 mean equator coordinates (EQJ).
 * If you need the position vector only, it is more efficient to call {@link HelioVector}.
 * The Sun's center is a non-inertial frame of reference. In other words, the Sun
 * experiences acceleration due to gravitational forces, mostly from the larger
 * planets (Jupiter, Saturn, Uranus, and Neptune). If you want to calculate momentum,
 * kinetic energy, or other quantities that require a non-accelerating frame
 * of reference, consider using {@link BaryState} instead.
 *
 * @param {Body} body
 *      The celestial body whose heliocentric state vector is to be calculated.
 *      Supported values are `Body.Sun`, `Body.Moon`, `Body.EMB`, `Body.SSB`, and all planets:
 *      `Body.Mercury`, `Body.Venus`, `Body.Earth`, `Body.Mars`, `Body.Jupiter`,
 *      `Body.Saturn`, `Body.Uranus`, `Body.Neptune`, `Body.Pluto`.
 *      Also allowed to be a user-defined star created by {@link DefineStar}.
 *
 *  @param {FlexibleDateTime} date
 *      The date and time for which to calculate position and velocity.
 *
 *  @returns {StateVector}
 *      An object that contains heliocentric position and velocity vectors.
 */
function HelioState(body, date) {
    const time = MakeTime(date);
    switch (body) {
        case Body.Sun:
            // Trivial case: the Sun is the origin of the heliocentric frame.
            return new StateVector(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, time);
        case Body.SSB:
            // Calculate the barycentric Sun. Then the negative of that is the heliocentric SSB.
            const bary = new major_bodies_t(time.tt);
            return new StateVector(-bary.Sun.r.x, -bary.Sun.r.y, -bary.Sun.r.z, -bary.Sun.v.x, -bary.Sun.v.y, -bary.Sun.v.z, time);
        case Body.Mercury:
        case Body.Venus:
        case Body.Earth:
        case Body.Mars:
        case Body.Jupiter:
        case Body.Saturn:
        case Body.Uranus:
        case Body.Neptune:
            // Planets included in the VSOP87 model.
            const planet = CalcVsopPosVel(vsop[body], time.tt);
            return ExportState(planet, time);
        case Body.Pluto:
            return CalcPluto(time, true);
        case Body.Moon:
        case Body.EMB:
            const earth = CalcVsopPosVel(vsop.Earth, time.tt);
            const state = (body == Body.Moon) ? GeoMoonState(time) : GeoEmbState(time);
            return new StateVector(state.x + earth.r.x, state.y + earth.r.y, state.z + earth.r.z, state.vx + earth.v.x, state.vy + earth.v.y, state.vz + earth.v.z, time);
        default:
            if (UserDefinedStar(body)) {
                const vec = HelioVector(body, time);
                return new StateVector(vec.x, vec.y, vec.z, 0, 0, 0, time);
            }
            throw `HelioState: Unsupported body "${body}"`;
    }
}
exports.HelioState = HelioState;
function QuadInterp(tm, dt, fa, fm, fb) {
    let Q = (fb + fa) / 2 - fm;
    let R = (fb - fa) / 2;
    let S = fm;
    let x;
    if (Q == 0) {
        // This is a line, not a parabola.
        if (R == 0) {
            // This is a HORIZONTAL line... can't make progress!
            return null;
        }
        x = -S / R;
        if (x < -1 || x > +1)
            return null; // out of bounds
    }
    else {
        // It really is a parabola. Find roots x1, x2.
        let u = R * R - 4 * Q * S;
        if (u <= 0)
            return null;
        let ru = Math.sqrt(u);
        let x1 = (-R + ru) / (2 * Q);
        let x2 = (-R - ru) / (2 * Q);
        if (-1 <= x1 && x1 <= +1) {
            if (-1 <= x2 && x2 <= +1)
                return null;
            x = x1;
        }
        else if (-1 <= x2 && x2 <= +1) {
            x = x2;
        }
        else {
            return null;
        }
    }
    let t = tm + x * dt;
    let df_dt = (2 * Q * x + R) / dt;
    return { t: t, df_dt: df_dt };
}
/**
 * @brief Options for the {@link Search} function.
 *
 * @typedef {object} SearchOptions
 *
 * @property {number | undefined} dt_tolerance_seconds
 *      The number of seconds for a time window smaller than which the search
 *      is considered successful.  Using too large a tolerance can result in
 *      an inaccurate time estimate.  Using too small a tolerance can cause
 *      excessive computation, or can even cause the search to fail because of
 *      limited floating-point resolution.  Defaults to 1 second.
 *
 * @property {number | undefined} init_f1
 *      As an optimization, if the caller of {@link Search}
 *      has already calculated the value of the function being searched (the parameter `func`)
 *      at the time coordinate `t1`, it can pass in that value as `init_f1`.
 *      For very expensive calculations, this can measurably improve performance.
 *
 * @property {number | undefined} init_f2
 *      The same as `init_f1`, except this is the optional initial value of `func(t2)`
 *      instead of `func(t1)`.
 *
 * @property {number | undefined} iter_limit
 */
/**
 * @brief Finds the time when a function ascends through zero.
 *
 * Search for next time <i>t</i> (such that <i>t</i> is between `t1` and `t2`)
 * that `func(t)` crosses from a negative value to a non-negative value.
 * The given function must have "smooth" behavior over the entire inclusive range [`t1`, `t2`],
 * meaning that it behaves like a continuous differentiable function.
 * It is not required that `t1` &lt; `t2`; `t1` &gt; `t2`
 * allows searching backward in time.
 * Note: `t1` and `t2` must be chosen such that there is no possibility
 * of more than one zero-crossing (ascending or descending), or it is possible
 * that the "wrong" event will be found (i.e. not the first event after t1)
 * or even that the function will return `null`, indicating that no event was found.
 *
 * @param {function(AstroTime): number} func
 *      The function to find an ascending zero crossing for.
 *      The function must accept a single parameter of type {@link AstroTime}
 *      and return a numeric value:
 *      function({@link AstroTime}) =&gt; `number`
 *
 * @param {AstroTime} t1
 *      The lower time bound of a search window.
 *
 * @param {AstroTime} t2
 *      The upper time bound of a search window.
 *
 * @param {SearchOptions | undefined} options
 *      Options that can tune the behavior of the search.
 *      Most callers can omit this argument.
 *
 * @returns {AstroTime | null}
 *      If the search is successful, returns the date and time of the solution.
 *      If the search fails, returns `null`.
 */
function Search(f, t1, t2, options) {
    const dt_tolerance_seconds = VerifyNumber((options && options.dt_tolerance_seconds) || 1);
    const dt_days = Math.abs(dt_tolerance_seconds / SECONDS_PER_DAY);
    let f1 = (options && options.init_f1) || f(t1);
    let f2 = (options && options.init_f2) || f(t2);
    let fmid = NaN;
    let iter = 0;
    let iter_limit = (options && options.iter_limit) || 20;
    let calc_fmid = true;
    while (true) {
        if (++iter > iter_limit)
            throw `Excessive iteration in Search()`;
        let tmid = InterpolateTime(t1, t2, 0.5);
        let dt = tmid.ut - t1.ut;
        if (Math.abs(dt) < dt_days) {
            // We are close enough to the event to stop the search.
            return tmid;
        }
        if (calc_fmid)
            fmid = f(tmid);
        else
            calc_fmid = true; // we already have the correct value of fmid from the previous loop
        // Quadratic interpolation:
        // Try to find a parabola that passes through the 3 points we have sampled:
        // (t1,f1), (tmid,fmid), (t2,f2).
        let q = QuadInterp(tmid.ut, t2.ut - tmid.ut, f1, fmid, f2);
        // Did we find an approximate root-crossing?
        if (q) {
            // Evaluate the function at our candidate solution.
            let tq = MakeTime(q.t);
            let fq = f(tq);
            if (q.df_dt !== 0) {
                if (Math.abs(fq / q.df_dt) < dt_days) {
                    // The estimated time error is small enough that we can quit now.
                    return tq;
                }
                // Try guessing a tighter boundary with the interpolated root at the center.
                let dt_guess = 1.2 * Math.abs(fq / q.df_dt);
                if (dt_guess < dt / 10) {
                    let tleft = tq.AddDays(-dt_guess);
                    let tright = tq.AddDays(+dt_guess);
                    if ((tleft.ut - t1.ut) * (tleft.ut - t2.ut) < 0) {
                        if ((tright.ut - t1.ut) * (tright.ut - t2.ut) < 0) {
                            let fleft = f(tleft);
                            let fright = f(tright);
                            if (fleft < 0 && fright >= 0) {
                                f1 = fleft;
                                f2 = fright;
                                t1 = tleft;
                                t2 = tright;
                                fmid = fq;
                                calc_fmid = false;
                                continue;
                            }
                        }
                    }
                }
            }
        }
        if (f1 < 0 && fmid >= 0) {
            t2 = tmid;
            f2 = fmid;
            continue;
        }
        if (fmid < 0 && f2 >= 0) {
            t1 = tmid;
            f1 = fmid;
            continue;
        }
        // Either there is no ascending zero-crossing in this range
        // or the search window is too wide.
        return null;
    }
}
exports.Search = Search;
function LongitudeOffset(diff) {
    let offset = diff;
    while (offset <= -180)
        offset += 360;
    while (offset > 180)
        offset -= 360;
    return offset;
}
function NormalizeLongitude(lon) {
    while (lon < 0)
        lon += 360;
    while (lon >= 360)
        lon -= 360;
    return lon;
}
/**
 * @brief Searches for when the Sun reaches a given ecliptic longitude.
 *
 * Searches for the moment in time when the center of the Sun reaches a given apparent
 * ecliptic longitude, as seen from the center of the Earth, within a given range of dates.
 * This function can be used to determine equinoxes and solstices.
 * However, it is usually more convenient and efficient to call {@link Seasons}
 * to calculate equinoxes and solstices for a given calendar year.
 * `SearchSunLongitude` is more general in that it allows searching for arbitrary longitude values.
 *
 * @param {number} targetLon
 *      The desired ecliptic longitude of date in degrees.
 *      This may be any value in the range [0, 360), although certain
 *      values have conventional meanings:
 *
 *      When `targetLon` is 0, finds the March equinox,
 *      which is the moment spring begins in the northern hemisphere
 *      and the beginning of autumn in the southern hemisphere.
 *
 *      When `targetLon` is 180, finds the September equinox,
 *      which is the moment autumn begins in the northern hemisphere and
 *      spring begins in the southern hemisphere.
 *
 *      When `targetLon` is 90, finds the northern solstice, which is the
 *      moment summer begins in the northern hemisphere and winter
 *      begins in the southern hemisphere.
 *
 *      When `targetLon` is 270, finds the southern solstice, which is the
 *      moment winter begins in the northern hemisphere and summer
 *      begins in the southern hemisphere.
 *
 * @param {FlexibleDateTime} dateStart
 *      A date and time known to be earlier than the desired longitude event.
 *
 * @param {number} limitDays
 *      A floating point number of days, which when added to `dateStart`,
 *      yields a date and time known to be after the desired longitude event.
 *
 * @returns {AstroTime | null}
 *      The date and time when the Sun reaches the apparent ecliptic longitude `targetLon`
 *      within the range of times specified by `dateStart` and `limitDays`.
 *      If the Sun does not reach the target longitude within the specified time range, or the
 *      time range is excessively wide, the return value is `null`.
 *      To avoid a `null` return value, the caller must pick a time window around
 *      the event that is within a few days but not so small that the event might fall outside the window.
 */
function SearchSunLongitude(targetLon, dateStart, limitDays) {
    function sun_offset(t) {
        let pos = SunPosition(t);
        return LongitudeOffset(pos.elon - targetLon);
    }
    VerifyNumber(targetLon);
    VerifyNumber(limitDays);
    let t1 = MakeTime(dateStart);
    let t2 = t1.AddDays(limitDays);
    return Search(sun_offset, t1, t2, { dt_tolerance_seconds: 0.01 });
}
exports.SearchSunLongitude = SearchSunLongitude;
/**
 * @brief Returns one body's ecliptic longitude with respect to another, as seen from the Earth.
 *
 * This function determines where one body appears around the ecliptic plane
 * (the plane of the Earth's orbit around the Sun) as seen from the Earth,
 * relative to the another body's apparent position.
 * The function returns an angle in the half-open range [0, 360) degrees.
 * The value is the ecliptic longitude of `body1` relative to the ecliptic
 * longitude of `body2`.
 *
 * The angle is 0 when the two bodies are at the same ecliptic longitude
 * as seen from the Earth. The angle increases in the prograde direction
 * (the direction that the planets orbit the Sun and the Moon orbits the Earth).
 *
 * When the angle is 180 degrees, it means the two bodies appear on opposite sides
 * of the sky for an Earthly observer.
 *
 * Neither `body1` nor `body2` is allowed to be `Body.Earth`.
 * If this happens, the function throws an exception.
 *
 * @param {Body} body1
 *      The first body, whose longitude is to be found relative to the second body.
 *
 * @param {Body} body2
 *      The second body, relative to which the longitude of the first body is to be found.
 *
 * @param {FlexibleDateTime} date
 *      The date and time of the observation.
 *
 * @returns {number}
 *      An angle in the range [0, 360), expressed in degrees.
 */
function PairLongitude(body1, body2, date) {
    if (body1 === Body.Earth || body2 === Body.Earth)
        throw 'The Earth does not have a longitude as seen from itself.';
    const time = MakeTime(date);
    const vector1 = GeoVector(body1, time, false);
    const eclip1 = Ecliptic(vector1);
    const vector2 = GeoVector(body2, time, false);
    const eclip2 = Ecliptic(vector2);
    return NormalizeLongitude(eclip1.elon - eclip2.elon);
}
exports.PairLongitude = PairLongitude;
/**
 * @brief Calculates the angular separation between the Sun and the given body.
 *
 * Returns the full angle seen from
 * the Earth, between the given body and the Sun.
 * Unlike {@link PairLongitude}, this function does not
 * project the body's "shadow" onto the ecliptic;
 * the angle is measured in 3D space around the plane that
 * contains the centers of the Earth, the Sun, and `body`.
 *
 * @param {Body} body
 *      The name of a supported celestial body other than the Earth.
 *
 * @param {FlexibleDateTime} date
 *      The time at which the angle from the Sun is to be found.
 *
 * @returns {number}
 *      An angle in degrees in the range [0, 180].
 */
function AngleFromSun(body, date) {
    if (body == Body.Earth)
        throw 'The Earth does not have an angle as seen from itself.';
    const time = MakeTime(date);
    const sv = GeoVector(Body.Sun, time, true);
    const bv = GeoVector(body, time, true);
    const angle = AngleBetween(sv, bv);
    return angle;
}
exports.AngleFromSun = AngleFromSun;
/**
 * @brief Calculates heliocentric ecliptic longitude of a body.
 *
 * This function calculates the angle around the plane of the Earth's orbit
 * of a celestial body, as seen from the center of the Sun.
 * The angle is measured prograde (in the direction of the Earth's orbit around the Sun)
 * in degrees from the true equinox of date. The ecliptic longitude is always in the range [0, 360).
 *
 * @param {Body} body
 *      A body other than the Sun.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the ecliptic longitude.
 *
 * @returns {number}
 */
function EclipticLongitude(body, date) {
    if (body === Body.Sun)
        throw 'Cannot calculate heliocentric longitude of the Sun.';
    const hv = HelioVector(body, date);
    const eclip = Ecliptic(hv);
    return eclip.elon;
}
exports.EclipticLongitude = EclipticLongitude;
function VisualMagnitude(body, phase, helio_dist, geo_dist) {
    // For Mercury and Venus, see:  https://iopscience.iop.org/article/10.1086/430212
    let c0, c1 = 0, c2 = 0, c3 = 0;
    switch (body) {
        case Body.Mercury:
            c0 = -0.60;
            c1 = +4.98;
            c2 = -4.88;
            c3 = +3.02;
            break;
        case Body.Venus:
            if (phase < 163.6) {
                c0 = -4.47;
                c1 = +1.03;
                c2 = +0.57;
                c3 = +0.13;
            }
            else {
                c0 = 0.98;
                c1 = -1.02;
            }
            break;
        case Body.Mars:
            c0 = -1.52;
            c1 = +1.60;
            break;
        case Body.Jupiter:
            c0 = -9.40;
            c1 = +0.50;
            break;
        case Body.Uranus:
            c0 = -7.19;
            c1 = +0.25;
            break;
        case Body.Neptune:
            c0 = -6.87;
            break;
        case Body.Pluto:
            c0 = -1.00;
            c1 = +4.00;
            break;
        default: throw `VisualMagnitude: unsupported body ${body}`;
    }
    const x = phase / 100;
    let mag = c0 + x * (c1 + x * (c2 + x * c3));
    mag += 5 * Math.log10(helio_dist * geo_dist);
    return mag;
}
function SaturnMagnitude(phase, helio_dist, geo_dist, gc, time) {
    // Based on formulas by Paul Schlyter found here:
    // http://www.stjarnhimlen.se/comp/ppcomp.html#15
    // We must handle Saturn's rings as a major component of its visual magnitude.
    // Find geocentric ecliptic coordinates of Saturn.
    const eclip = Ecliptic(gc);
    const ir = exports.DEG2RAD * 28.06; // tilt of Saturn's rings to the ecliptic, in radians
    const Nr = exports.DEG2RAD * (169.51 + (3.82e-5 * time.tt)); // ascending node of Saturn's rings, in radians
    // Find tilt of Saturn's rings, as seen from Earth.
    const lat = exports.DEG2RAD * eclip.elat;
    const lon = exports.DEG2RAD * eclip.elon;
    const tilt = Math.asin(Math.sin(lat) * Math.cos(ir) - Math.cos(lat) * Math.sin(ir) * Math.sin(lon - Nr));
    const sin_tilt = Math.sin(Math.abs(tilt));
    let mag = -9.0 + 0.044 * phase;
    mag += sin_tilt * (-2.6 + 1.2 * sin_tilt);
    mag += 5 * Math.log10(helio_dist * geo_dist);
    return { mag: mag, ring_tilt: exports.RAD2DEG * tilt };
}
function MoonMagnitude(phase, helio_dist, geo_dist) {
    // https://astronomy.stackexchange.com/questions/10246/is-there-a-simple-analytical-formula-for-the-lunar-phase-brightness-curve
    let rad = phase * exports.DEG2RAD;
    let rad2 = rad * rad;
    let rad4 = rad2 * rad2;
    let mag = -12.717 + 1.49 * Math.abs(rad) + 0.0431 * rad4;
    const moon_mean_distance_au = 385000.6 / exports.KM_PER_AU;
    let geo_au = geo_dist / moon_mean_distance_au;
    mag += 5 * Math.log10(helio_dist * geo_au);
    return mag;
}
/**
 * @brief Information about the apparent brightness and sunlit phase of a celestial object.
 *
 * @property {AstroTime} time
 *      The date and time pertaining to the other calculated values in this object.
 *
 * @property {number} mag
 *      The <a href="https://en.wikipedia.org/wiki/Apparent_magnitude">apparent visual magnitude</a> of the celestial body.
 *
 * @property {number} phase_angle
 *      The angle in degrees as seen from the center of the celestial body between the Sun and the Earth.
 *      The value is always in the range 0 to 180.
 *      The phase angle provides a measure of what fraction of the body's face appears
 *      illuminated by the Sun as seen from the Earth.
 *      When the observed body is the Sun, the `phase` property is set to 0,
 *      although this has no physical meaning because the Sun emits, rather than reflects, light.
 *      When the phase is near 0 degrees, the body appears "full".
 *      When it is 90 degrees, the body appears "half full".
 *      And when it is 180 degrees, the body appears "new" and is very difficult to see
 *      because it is both dim and lost in the Sun's glare as seen from the Earth.
 *
 * @property {number} phase_fraction
 *      The fraction of the body's face that is illuminated by the Sun, as seen from the Earth.
 *      Calculated from `phase_angle` for convenience.
 *      This value ranges from 0 to 1.
 *
 * @property {number} helio_dist
 *      The distance between the center of the Sun and the center of the body in
 *      <a href="https://en.wikipedia.org/wiki/Astronomical_unit">astronomical units</a> (AU).
 *
 * @property {number} geo_dist
 *      The distance between the center of the Earth and the center of the body in AU.
 *
 * @property {Vector} gc
 *      Geocentric coordinates: the 3D vector from the center of the Earth to the center of the body.
 *      The components are in expressed in AU and are oriented with respect to the J2000 equatorial plane.
 *
 * @property {Vector} hc
 *      Heliocentric coordinates: The 3D vector from the center of the Sun to the center of the body.
 *      Like `gc`, `hc` is expressed in AU and oriented with respect
 *      to the J2000 equatorial plane.
 *
 * @property {number | undefined} ring_tilt
 *      For Saturn, this is the angular tilt of the planet's rings in degrees away
 *      from the line of sight from the Earth. When the value is near 0, the rings
 *      appear edge-on from the Earth and are therefore difficult to see.
 *      When `ring_tilt` approaches its maximum value (about 27 degrees),
 *      the rings appear widest and brightest from the Earth.
 *      Unlike the <a href="https://ssd.jpl.nasa.gov/horizons.cgi">JPL Horizons</a> online tool,
 *      this library includes the effect of the ring tilt angle in the calculated value
 *      for Saturn's visual magnitude.
 *      For all bodies other than Saturn, the value of `ring_tilt` is `undefined`.
 */
class IlluminationInfo {
    constructor(time, mag, phase_angle, helio_dist, geo_dist, gc, hc, ring_tilt) {
        this.time = time;
        this.mag = mag;
        this.phase_angle = phase_angle;
        this.helio_dist = helio_dist;
        this.geo_dist = geo_dist;
        this.gc = gc;
        this.hc = hc;
        this.ring_tilt = ring_tilt;
        this.phase_fraction = (1 + Math.cos(exports.DEG2RAD * phase_angle)) / 2;
    }
}
exports.IlluminationInfo = IlluminationInfo;
/**
 * @brief Calculates visual magnitude and related information about a body.
 *
 * Calculates the phase angle, visual magnitude,
 * and other values relating to the body's illumination
 * at the given date and time, as seen from the Earth.
 *
 * @param {Body} body
 *      The name of the celestial body being observed.
 *      Not allowed to be `Body.Earth`.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the illumination data for the given body.
 *
 * @returns {IlluminationInfo}
 */
function Illumination(body, date) {
    if (body === Body.Earth)
        throw `The illumination of the Earth is not defined.`;
    const time = MakeTime(date);
    const earth = CalcVsop(vsop.Earth, time);
    let phase; // phase angle in degrees between Earth and Sun as seen from body
    let hc; // vector from Sun to body
    let gc; // vector from Earth to body
    let mag; // visual magnitude
    if (body === Body.Sun) {
        gc = new Vector(-earth.x, -earth.y, -earth.z, time);
        hc = new Vector(0, 0, 0, time);
        phase = 0; // a placeholder value; the Sun does not have an illumination phase because it emits, rather than reflects, light.
    }
    else {
        if (body === Body.Moon) {
            // For extra numeric precision, use geocentric moon formula directly.
            gc = GeoMoon(time);
            hc = new Vector(earth.x + gc.x, earth.y + gc.y, earth.z + gc.z, time);
        }
        else {
            // For planets, heliocentric vector is most direct to calculate.
            hc = HelioVector(body, date);
            gc = new Vector(hc.x - earth.x, hc.y - earth.y, hc.z - earth.z, time);
        }
        phase = AngleBetween(gc, hc);
    }
    let geo_dist = gc.Length(); // distance from body to center of Earth
    let helio_dist = hc.Length(); // distance from body to center of Sun
    let ring_tilt; // only reported for Saturn
    if (body === Body.Sun) {
        mag = SUN_MAG_1AU + 5 * Math.log10(geo_dist);
    }
    else if (body === Body.Moon) {
        mag = MoonMagnitude(phase, helio_dist, geo_dist);
    }
    else if (body === Body.Saturn) {
        const saturn = SaturnMagnitude(phase, helio_dist, geo_dist, gc, time);
        mag = saturn.mag;
        ring_tilt = saturn.ring_tilt;
    }
    else {
        mag = VisualMagnitude(body, phase, helio_dist, geo_dist);
    }
    return new IlluminationInfo(time, mag, phase, helio_dist, geo_dist, gc, hc, ring_tilt);
}
exports.Illumination = Illumination;
function SynodicPeriod(body) {
    if (body === Body.Earth)
        throw 'The Earth does not have a synodic period as seen from itself.';
    if (body === Body.Moon)
        return MEAN_SYNODIC_MONTH;
    // Calculate the synodic period of the planet from its and the Earth's sidereal periods.
    // The sidereal period of a planet is how long it takes to go around the Sun in days, on average.
    // The synodic period of a planet is how long it takes between consecutive oppositions
    // or conjunctions, on average.
    let planet = Planet[body];
    if (!planet)
        throw `Not a valid planet name: ${body}`;
    // See here for explanation of the formula:
    // https://en.wikipedia.org/wiki/Elongation_(astronomy)#Elongation_period
    const Te = Planet.Earth.OrbitalPeriod;
    const Tp = planet.OrbitalPeriod;
    const synodicPeriod = Math.abs(Te / (Te / Tp - 1));
    return synodicPeriod;
}
/**
 * @brief Searches for when the Earth and a given body reach a relative ecliptic longitude separation.
 *
 * Searches for the date and time the relative ecliptic longitudes of
 * the specified body and the Earth, as seen from the Sun, reach a certain
 * difference. This function is useful for finding conjunctions and oppositions
 * of the planets. For the opposition of a superior planet (Mars, Jupiter, ..., Pluto),
 * or the inferior conjunction of an inferior planet (Mercury, Venus),
 * call with `targetRelLon` = 0. The 0 value indicates that both
 * planets are on the same ecliptic longitude line, ignoring the other planet's
 * distance above or below the plane of the Earth's orbit.
 * For superior conjunctions, call with `targetRelLon` = 180.
 * This means the Earth and the other planet are on opposite sides of the Sun.
 *
 * @param {Body} body
 *      Any planet other than the Earth.
 *
 * @param {number} targetRelLon
 *      The desired angular difference in degrees between the ecliptic longitudes
 *      of `body` and the Earth. Must be in the range (-180, +180].
 *
 * @param {FlexibleDateTime} startDate
 *      The date and time after which to find the next occurrence of the
 *      body and the Earth reaching the desired relative longitude.
 *
 * @returns {AstroTime}
 *      The time when the Earth and the body next reach the specified relative longitudes.
 */
function SearchRelativeLongitude(body, targetRelLon, startDate) {
    VerifyNumber(targetRelLon);
    const planet = Planet[body];
    if (!planet)
        throw `Cannot search relative longitude because body is not a planet: ${body}`;
    if (body === Body.Earth)
        throw 'Cannot search relative longitude for the Earth (it is always 0)';
    // Determine whether the Earth "gains" (+1) on the planet or "loses" (-1)
    // as both race around the Sun.
    const direction = (planet.OrbitalPeriod > Planet.Earth.OrbitalPeriod) ? +1 : -1;
    function offset(t) {
        const plon = EclipticLongitude(body, t);
        const elon = EclipticLongitude(Body.Earth, t);
        const diff = direction * (elon - plon);
        return LongitudeOffset(diff - targetRelLon);
    }
    let syn = SynodicPeriod(body);
    let time = MakeTime(startDate);
    // Iterate until we converge on the desired event.
    // Calculate the error angle, which will be a negative number of degrees,
    // meaning we are "behind" the target relative longitude.
    let error_angle = offset(time);
    if (error_angle > 0)
        error_angle -= 360; // force searching forward in time
    for (let iter = 0; iter < 100; ++iter) {
        // Estimate how many days in the future (positive) or past (negative)
        // we have to go to get closer to the target relative longitude.
        let day_adjust = (-error_angle / 360) * syn;
        time = time.AddDays(day_adjust);
        if (Math.abs(day_adjust) * SECONDS_PER_DAY < 1)
            return time;
        let prev_angle = error_angle;
        error_angle = offset(time);
        if (Math.abs(prev_angle) < 30) {
            // Improve convergence for Mercury/Mars (eccentric orbits)
            // by adjusting the synodic period to more closely match the
            // variable speed of both planets in this part of their respective orbits.
            if (prev_angle !== error_angle) {
                let ratio = prev_angle / (prev_angle - error_angle);
                if (ratio > 0.5 && ratio < 2.0)
                    syn *= ratio;
            }
        }
    }
    throw `Relative longitude search failed to converge for ${body} near ${time.toString()} (error_angle = ${error_angle}).`;
}
exports.SearchRelativeLongitude = SearchRelativeLongitude;
/**
 * @brief Determines the moon's phase expressed as an ecliptic longitude.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the moon's phase.
 *
 * @returns {number}
 *      A value in the range [0, 360) indicating the difference
 *      in ecliptic longitude between the center of the Sun and the
 *      center of the Moon, as seen from the center of the Earth.
 *      Certain longitude values have conventional meanings:
 *
 * * 0 = new moon
 * * 90 = first quarter
 * * 180 = full moon
 * * 270 = third quarter
 */
function MoonPhase(date) {
    return PairLongitude(Body.Moon, Body.Sun, date);
}
exports.MoonPhase = MoonPhase;
/**
 * @brief Searches for the date and time that the Moon reaches a specified phase.
 *
 * Lunar phases are defined in terms of geocentric ecliptic longitudes
 * with respect to the Sun.  When the Moon and the Sun have the same ecliptic
 * longitude, that is defined as a new moon. When the two ecliptic longitudes
 * are 180 degrees apart, that is defined as a full moon.
 * To enumerate quarter lunar phases, it is simpler to call
 * {@link SearchMoonQuarter} once, followed by repeatedly calling
 * {@link NextMoonQuarter}. `SearchMoonPhase` is only
 * necessary for finding other lunar phases than the usual quarter phases.
 *
 * @param {number} targetLon
 *      The difference in geocentric ecliptic longitude between the Sun and Moon
 *      that specifies the lunar phase being sought. This can be any value
 *      in the range [0, 360). Here are some helpful examples:
 *      0 = new moon,
 *      90 = first quarter,
 *      180 = full moon,
 *      270 = third quarter.
 *
 * @param {FlexibleDateTime} dateStart
 *      The beginning of the window of time in which to search.
 *
 * @param {number} limitDays
 *      The floating point number of days away from `dateStart`
 *      that limits the window of time in which to search.
 *      If the value is negative, the search is performed into the past from `startTime`.
 *      Otherwise, the search is performed into the future from `startTime`.
 *
 * @returns {AstroTime | null}
 *      If successful, returns the date and time the moon reaches the phase specified by `targetlon`.
 *      This function will return `null` if the phase does not occur within `limitDays` of `startTime`;
 *      that is, if the search window is too small.
 */
function SearchMoonPhase(targetLon, dateStart, limitDays) {
    function moon_offset(t) {
        let mlon = MoonPhase(t);
        return LongitudeOffset(mlon - targetLon);
    }
    VerifyNumber(targetLon);
    VerifyNumber(limitDays);
    // To avoid discontinuities in the moon_offset function causing problems,
    // we need to approximate when that function will next return 0.
    // We probe it with the start time and take advantage of the fact
    // that every lunar phase repeats roughly every 29.5 days.
    // There is a surprising uncertainty in the quarter timing,
    // due to the eccentricity of the moon's orbit.
    // I have seen more than 0.9 days away from the simple prediction.
    // To be safe, we take the predicted time of the event and search
    // +/-1.5 days around it (a 3.0-day wide window).
    // But we must return null if the final result goes beyond limitDays after dateStart.
    const uncertainty = 1.5;
    const ta = MakeTime(dateStart);
    let ya = moon_offset(ta);
    let est_dt, dt1, dt2;
    if (limitDays < 0) {
        // Search backward in time.
        if (ya < 0)
            ya += 360;
        est_dt = -(MEAN_SYNODIC_MONTH * ya) / 360;
        dt2 = est_dt + uncertainty;
        if (dt2 < limitDays)
            return null; // not possible for moon phase to occur within the specified window
        dt1 = Math.max(limitDays, est_dt - uncertainty);
    }
    else {
        // Search forward in time.
        if (ya > 0)
            ya -= 360;
        est_dt = -(MEAN_SYNODIC_MONTH * ya) / 360;
        dt1 = est_dt - uncertainty;
        if (dt1 > limitDays)
            return null; // not possible for moon phase to occur within the specified window
        dt2 = Math.min(limitDays, est_dt + uncertainty);
    }
    const t1 = ta.AddDays(dt1);
    const t2 = ta.AddDays(dt2);
    return Search(moon_offset, t1, t2, { dt_tolerance_seconds: 0.1 });
}
exports.SearchMoonPhase = SearchMoonPhase;
/**
 * @brief A quarter lunar phase, along with when it occurs.
 *
 * @property {number} quarter
 *      An integer as follows:
 *      0 = new moon,
 *      1 = first quarter,
 *      2 = full moon,
 *      3 = third quarter.
 *
 * @property {AstroTime} time
 *      The date and time of the quarter lunar phase.
 */
class MoonQuarter {
    constructor(quarter, time) {
        this.quarter = quarter;
        this.time = time;
    }
}
exports.MoonQuarter = MoonQuarter;
/**
 * @brief Finds the first quarter lunar phase after the specified date and time.
 *
 * The quarter lunar phases are: new moon, first quarter, full moon, and third quarter.
 * To enumerate quarter lunar phases, call `SearchMoonQuarter` once,
 * then pass its return value to {@link NextMoonQuarter} to find the next
 * `MoonQuarter`. Keep calling `NextMoonQuarter` in a loop,
 * passing the previous return value as the argument to the next call.
 *
 * @param {FlexibleDateTime} dateStart
 *      The date and time after which to find the first quarter lunar phase.
 *
 * @returns {MoonQuarter}
 */
function SearchMoonQuarter(dateStart) {
    // Determine what the next quarter phase will be.
    let phaseStart = MoonPhase(dateStart);
    let quarterStart = Math.floor(phaseStart / 90);
    let quarter = (quarterStart + 1) % 4;
    let time = SearchMoonPhase(90 * quarter, dateStart, 10);
    if (!time)
        throw 'Cannot find moon quarter';
    return new MoonQuarter(quarter, time);
}
exports.SearchMoonQuarter = SearchMoonQuarter;
/**
 * @brief Finds the next quarter lunar phase in a series.
 *
 * Given a {@link MoonQuarter} object, finds the next consecutive
 * quarter lunar phase. See remarks in {@link SearchMoonQuarter}
 * for explanation of usage.
 *
 * @param {MoonQuarter} mq
 *      The return value of a prior call to {@link MoonQuarter} or `NextMoonQuarter`.
 *
 * @returns {MoonQuarter}
 */
function NextMoonQuarter(mq) {
    // Skip 6 days past the previous found moon quarter to find the next one.
    // This is less than the minimum possible increment.
    // So far I have seen the interval well contained by the range (6.5, 8.3) days.
    let date = new Date(mq.time.date.getTime() + 6 * MILLIS_PER_DAY);
    return SearchMoonQuarter(date);
}
exports.NextMoonQuarter = NextMoonQuarter;
/**
 * @brief Information about idealized atmospheric variables at a given elevation.
 *
 * @property {number} pressure
 *      Atmospheric pressure in pascals.
 *
 * @property {number} temperature
 *      Atmospheric temperature in kelvins.
 *
 * @property {number} density
 *      Atmospheric density relative to sea level.
 */
class AtmosphereInfo {
    constructor(pressure, temperature, density) {
        this.pressure = pressure;
        this.temperature = temperature;
        this.density = density;
    }
}
exports.AtmosphereInfo = AtmosphereInfo;
/**
 * @brief Calculates U.S. Standard Atmosphere (1976) variables as a function of elevation.
 *
 * This function calculates idealized values of pressure, temperature, and density
 * using the U.S. Standard Atmosphere (1976) model.
 * 1. COESA, U.S. Standard Atmosphere, 1976, U.S. Government Printing Office, Washington, DC, 1976.
 * 2. Jursa, A. S., Ed., Handbook of Geophysics and the Space Environment, Air Force Geophysics Laboratory, 1985.
 * See:
 * https://hbcp.chemnetbase.com/faces/documents/14_12/14_12_0001.xhtml
 * https://ntrs.nasa.gov/api/citations/19770009539/downloads/19770009539.pdf
 * https://www.ngdc.noaa.gov/stp/space-weather/online-publications/miscellaneous/us-standard-atmosphere-1976/us-standard-atmosphere_st76-1562_noaa.pdf
 *
 * @param {number} elevationMeters
 *      The elevation above sea level at which to calculate atmospheric variables.
 *      Must be in the range -500 to +100000, or an exception will occur.
 *
 * @returns {AtmosphereInfo}
 */
function Atmosphere(elevationMeters) {
    const P0 = 101325.0; // pressure at sea level [pascals]
    const T0 = 288.15; // temperature at sea level [kelvins]
    const T1 = 216.65; // temperature between 20 km and 32 km [kelvins]
    if (!Number.isFinite(elevationMeters) || elevationMeters < -500.0 || elevationMeters > 100000.0)
        throw `Invalid elevation: ${elevationMeters}`;
    let temperature;
    let pressure;
    if (elevationMeters <= 11000.0) {
        temperature = T0 - 0.0065 * elevationMeters;
        pressure = P0 * Math.pow(T0 / temperature, -5.25577);
    }
    else if (elevationMeters <= 20000.0) {
        temperature = T1;
        pressure = 22632.0 * Math.exp(-0.00015768832 * (elevationMeters - 11000.0));
    }
    else {
        temperature = T1 + 0.001 * (elevationMeters - 20000.0);
        pressure = 5474.87 * Math.pow(T1 / temperature, 34.16319);
    }
    // The density is calculated relative to the sea level value.
    // Using the ideal gas law PV=nRT, we deduce that density is proportional to P/T.
    const density = (pressure / temperature) / (P0 / T0);
    return new AtmosphereInfo(pressure, temperature, density);
}
exports.Atmosphere = Atmosphere;
function HorizonDipAngle(observer, metersAboveGround) {
    // Calculate the effective radius of the Earth at ground level below the observer.
    // Correct for the Earth's oblateness.
    const phi = observer.latitude * exports.DEG2RAD;
    const sinphi = Math.sin(phi);
    const cosphi = Math.cos(phi);
    const c = 1.0 / Math.hypot(cosphi, sinphi * EARTH_FLATTENING);
    const s = c * (EARTH_FLATTENING * EARTH_FLATTENING);
    const ht_km = (observer.height - metersAboveGround) / 1000.0; // height of ground above sea level
    const ach = EARTH_EQUATORIAL_RADIUS_KM * c + ht_km;
    const ash = EARTH_EQUATORIAL_RADIUS_KM * s + ht_km;
    const radius_m = 1000.0 * Math.hypot(ach * cosphi, ash * sinphi);
    // Correct refraction of a ray of light traveling tangent to the Earth's surface.
    // Based on: https://www.largeformatphotography.info/sunmooncalc/SMCalc.js
    // which in turn derives from:
    // Sweer, John. 1938.  The Path of a Ray of Light Tangent to the Surface of the Earth.
    // Journal of the Optical Society of America 28 (September):327-329.
    // k = refraction index
    const k = 0.175 * Math.pow(1.0 - (6.5e-3 / 283.15) * (observer.height - (2.0 / 3.0) * metersAboveGround), 3.256);
    // Calculate how far below the observer's horizontal plane the observed horizon dips.
    return exports.RAD2DEG * -(Math.sqrt(2 * (1 - k) * metersAboveGround / radius_m) / (1 - k));
}
function BodyRadiusAu(body) {
    // For the purposes of calculating rise/set times,
    // only the Sun and Moon appear large enough to an observer
    // on the Earth for their radius to matter.
    // All other bodies are treated as points.
    switch (body) {
        case Body.Sun: return SUN_RADIUS_AU;
        case Body.Moon: return MOON_EQUATORIAL_RADIUS_AU;
        default: return 0;
    }
}
/**
 * @brief Searches for the next time a celestial body rises or sets as seen by an observer on the Earth.
 *
 * This function finds the next rise or set time of the Sun, Moon, or planet other than the Earth.
 * Rise time is when the body first starts to be visible above the horizon.
 * For example, sunrise is the moment that the top of the Sun first appears to peek above the horizon.
 * Set time is the moment when the body appears to vanish below the horizon.
 * Therefore, this function adjusts for the apparent angular radius of the observed body
 * (significant only for the Sun and Moon).
 *
 * This function corrects for a typical value of atmospheric refraction, which causes celestial
 * bodies to appear higher above the horizon than they would if the Earth had no atmosphere.
 * Astronomy Engine uses a correction of 34 arcminutes. Real-world refraction varies based
 * on air temperature, pressure, and humidity; such weather-based conditions are outside
 * the scope of Astronomy Engine.
 *
 * Note that rise or set may not occur in every 24 hour period.
 * For example, near the Earth's poles, there are long periods of time where
 * the Sun stays below the horizon, never rising.
 * Also, it is possible for the Moon to rise just before midnight but not set during the subsequent 24-hour day.
 * This is because the Moon sets nearly an hour later each day due to orbiting the Earth a
 * significant amount during each rotation of the Earth.
 * Therefore callers must not assume that the function will always succeed.
 *
 * @param {Body} body
 *      The Sun, Moon, any planet other than the Earth,
 *      or a user-defined star that was created by a call to {@link DefineStar}.
 *
 * @param {Observer} observer
 *      Specifies the geographic coordinates and elevation above sea level of the observer.
 *
 * @param {number} direction
 *      Either +1 to find rise time or -1 to find set time.
 *      Any other value will cause an exception to be thrown.
 *
 * @param {FlexibleDateTime} dateStart
 *      The date and time after which the specified rise or set time is to be found.
 *
 * @param {number} limitDays
 *      Limits how many days to search for a rise or set time, and defines
 *      the direction in time to search. When `limitDays` is positive, the
 *      search is performed into the future, after `dateStart`.
 *      When negative, the search is performed into the past, before `dateStart`.
 *      To limit a rise or set time to the same day, you can use a value of 1 day.
 *      In cases where you want to find the next rise or set time no matter how far
 *      in the future (for example, for an observer near the south pole), you can
 *      pass in a larger value like 365.
 *
 * @param {number?} metersAboveGround
 *      Defaults to 0.0 if omitted.
 *      Usually the observer is located at ground level. Then this parameter
 *      should be zero. But if the observer is significantly higher than ground
 *      level, for example in an airplane, this parameter should be a positive
 *      number indicating how far above the ground the observer is.
 *      An exception occurs if `metersAboveGround` is negative.
 *
 * @returns {AstroTime | null}
 *      The date and time of the rise or set event, or null if no such event
 *      occurs within the specified time window.
 */
function SearchRiseSet(body, observer, direction, dateStart, limitDays, metersAboveGround = 0.0) {
    if (!Number.isFinite(metersAboveGround) || (metersAboveGround < 0.0))
        throw `Invalid value for metersAboveGround: ${metersAboveGround}`;
    // We want to find when the top of the body crosses the horizon, not the body's center.
    // Therefore, we need to know the body's radius.
    const body_radius_au = BodyRadiusAu(body);
    // Calculate atmospheric density at ground level.
    const atmos = Atmosphere(observer.height - metersAboveGround);
    // Calculate the apparent angular dip of the horizon.
    const dip = HorizonDipAngle(observer, metersAboveGround);
    // Correct refraction for objects near the horizon, using atmospheric density at the ground.
    const altitude = dip - (REFRACTION_NEAR_HORIZON * atmos.density);
    // Search for the top of the body crossing the corrected altitude angle.
    return InternalSearchAltitude(body, observer, direction, dateStart, limitDays, body_radius_au, altitude);
}
exports.SearchRiseSet = SearchRiseSet;
/**
 * @brief Finds the next time the center of a body passes through a given altitude.
 *
 * Finds when the center of the given body ascends or descends through a given
 * altitude angle, as seen by an observer at the specified location on the Earth.
 * By using the appropriate combination of `direction` and `altitude` parameters,
 * this function can be used to find when civil, nautical, or astronomical twilight
 * begins (dawn) or ends (dusk).
 *
 * Civil dawn begins before sunrise when the Sun ascends through 6 degrees below
 * the horizon. To find civil dawn, pass +1 for `direction` and -6 for `altitude`.
 *
 * Civil dusk ends after sunset when the Sun descends through 6 degrees below the horizon.
 * To find civil dusk, pass -1 for `direction` and -6 for `altitude`.
 *
 * Nautical twilight is similar to civil twilight, only the `altitude` value should be -12 degrees.
 *
 * Astronomical twilight uses -18 degrees as the `altitude` value.
 *
 * By convention for twilight time calculations, the altitude is not corrected for
 * atmospheric refraction. This is because the target altitudes are below the horizon,
 * and refraction is not directly observable.
 *
 * `SearchAltitude` is not intended to find rise/set times of a body for two reasons:
 * (1) Rise/set times of the Sun or Moon are defined by their topmost visible portion, not their centers.
 * (2) Rise/set times are affected significantly by atmospheric refraction.
 * Therefore, it is better to use {@link SearchRiseSet} to find rise/set times, which
 * corrects for both of these considerations.
 *
 * `SearchAltitude` will not work reliably for altitudes at or near the body's
 * maximum or minimum altitudes. To find the time a body reaches minimum or maximum altitude
 * angles, use {@link SearchHourAngle}.
 *
 * @param {Body} body
 *      The Sun, Moon, any planet other than the Earth,
 *      or a user-defined star that was created by a call to {@link DefineStar}.
 *
 * @param {Observer} observer
 *      Specifies the geographic coordinates and elevation above sea level of the observer.
 *
 * @param {number} direction
 *      Either +1 to find when the body ascends through the altitude,
 *      or -1 for when the body descends through the altitude.
 *      Any other value will cause an exception to be thrown.
 *
 * @param {FlexibleDateTime} dateStart
 *      The date and time after which the specified altitude event is to be found.
 *
 * @param {number} limitDays
 *      Limits how many days to search for the body reaching the altitude angle,
 *      and defines the direction in time to search. When `limitDays` is positive, the
 *      search is performed into the future, after `dateStart`.
 *      When negative, the search is performed into the past, before `dateStart`.
 *      To limit the search to the same day, you can use a value of 1 day.
 *      In cases where you want to find the altitude event no matter how far
 *      in the future (for example, for an observer near the south pole), you can
 *      pass in a larger value like 365.
 *
 * @param {number} altitude
 *      The desired altitude angle of the body's center above (positive)
 *      or below (negative) the observer's local horizon, expressed in degrees.
 *      Must be in the range [-90, +90].
 *
 * @returns {AstroTime | null}
 *      The date and time of the altitude event, or null if no such event
 *      occurs within the specified time window.
 */
function SearchAltitude(body, observer, direction, dateStart, limitDays, altitude) {
    if (!Number.isFinite(altitude) || altitude < -90 || altitude > +90)
        throw `Invalid altitude angle: ${altitude}`;
    return InternalSearchAltitude(body, observer, direction, dateStart, limitDays, 0, altitude);
}
exports.SearchAltitude = SearchAltitude;
class AscentInfo {
    constructor(tx, ty, ax, ay) {
        this.tx = tx;
        this.ty = ty;
        this.ax = ax;
        this.ay = ay;
    }
}
function FindAscent(depth, altdiff, max_deriv_alt, t1, t2, a1, a2) {
    // See if we can find any time interval where the altitude-diff function
    // rises from non-positive to positive.
    if (a1 < 0.0 && a2 >= 0.0) {
        // Trivial success case: the endpoints already rise through zero.
        return new AscentInfo(t1, t2, a1, a2);
    }
    if (a1 >= 0.0 && a2 < 0.0) {
        // Trivial failure case: Assume Nyquist condition prevents an ascent.
        return null;
    }
    if (depth > 17) {
        // Safety valve: do not allow unlimited recursion.
        // This should never happen if the rest of the logic is working correctly,
        // so fail the whole search if it does happen. It's a bug!
        throw `Excessive recursion in rise/set ascent search.`;
    }
    // Both altitudes are on the same side of zero: both are negative, or both are non-negative.
    // There could be a convex "hill" or a concave "valley" that passes through zero.
    // In polar regions sometimes there is a rise/set or set/rise pair within minutes of each other.
    // For example, the Moon can be below the horizon, then the very top of it becomes
    // visible (moonrise) for a few minutes, then it moves sideways and down below
    // the horizon again (moonset). We want to catch these cases.
    // However, for efficiency and practicality concerns, because the rise/set search itself
    // has a 0.1 second threshold, we do not worry about rise/set pairs that are less than
    // one second apart. These are marginal cases that are rendered highly uncertain
    // anyway, due to unpredictable atmospheric refraction conditions (air temperature and pressure).
    const dt = t2.ut - t1.ut;
    if (dt * SECONDS_PER_DAY < 1.0)
        return null;
    // Is it possible to reach zero from the altitude that is closer to zero?
    const da = Math.min(Math.abs(a1), Math.abs(a2));
    // Without loss of generality, assume |a1| <= |a2|.
    // (Reverse the argument in the case |a2| < |a1|.)
    // Imagine you have to "drive" from a1 to 0, then back to a2.
    // You can't go faster than max_deriv_alt. If you can't reach 0 in half the time,
    // you certainly don't have time to reach 0, turn around, and still make your way
    // back up to a2 (which is at least as far from 0 than a1 is) in the time interval dt.
    // Therefore, the time threshold is half the time interval, or dt/2.
    if (da > max_deriv_alt * (dt / 2)) {
        // Prune: the altitude cannot change fast enough to reach zero.
        return null;
    }
    // Bisect the time interval and evaluate the altitude at the midpoint.
    const tmid = new AstroTime((t1.ut + t2.ut) / 2);
    const amid = altdiff(tmid);
    // Use recursive bisection to search for a solution bracket.
    return (FindAscent(1 + depth, altdiff, max_deriv_alt, t1, tmid, a1, amid) ||
        FindAscent(1 + depth, altdiff, max_deriv_alt, tmid, t2, amid, a2));
}
function MaxAltitudeSlope(body, latitude) {
    // Calculate the maximum possible rate that this body's altitude
    // could change [degrees/day] as seen by this observer.
    // First use experimentally determined extreme bounds for this body
    // of how much topocentric RA and DEC can ever change per rate of time.
    // We need minimum possible d(RA)/dt, and maximum possible magnitude of d(DEC)/dt.
    // Conservatively, we round d(RA)/dt down, d(DEC)/dt up.
    // Then calculate the resulting maximum possible altitude change rate.
    if (latitude < -90 || latitude > +90)
        throw `Invalid geographic latitude: ${latitude}`;
    let deriv_ra;
    let deriv_dec;
    switch (body) {
        case Body.Moon:
            deriv_ra = +4.5;
            deriv_dec = +8.2;
            break;
        case Body.Sun:
            deriv_ra = +0.8;
            deriv_dec = +0.5;
            break;
        case Body.Mercury:
            deriv_ra = -1.6;
            deriv_dec = +1.0;
            break;
        case Body.Venus:
            deriv_ra = -0.8;
            deriv_dec = +0.6;
            break;
        case Body.Mars:
            deriv_ra = -0.5;
            deriv_dec = +0.4;
            break;
        case Body.Jupiter:
        case Body.Saturn:
        case Body.Uranus:
        case Body.Neptune:
        case Body.Pluto:
            deriv_ra = -0.2;
            deriv_dec = +0.2;
            break;
        case Body.Star1:
        case Body.Star2:
        case Body.Star3:
        case Body.Star4:
        case Body.Star5:
        case Body.Star6:
        case Body.Star7:
        case Body.Star8:
            // The minimum allowed heliocentric distance of a user-defined star
            // is one light-year. This can cause a tiny amount of parallax (about 0.001 degrees).
            // Also, including stellar aberration (22 arcsec = 0.006 degrees), we provide a
            // generous safety buffer of 0.008 degrees.
            deriv_ra = -0.008;
            deriv_dec = +0.008;
            break;
        default:
            throw `Body not allowed for altitude search: ${body}`;
    }
    const latrad = exports.DEG2RAD * latitude;
    return Math.abs(((360.0 / SOLAR_DAYS_PER_SIDEREAL_DAY) - deriv_ra) * Math.cos(latrad)) + Math.abs(deriv_dec * Math.sin(latrad));
}
function InternalSearchAltitude(body, observer, direction, dateStart, limitDays, bodyRadiusAu, targetAltitude) {
    VerifyObserver(observer);
    VerifyNumber(limitDays);
    VerifyNumber(bodyRadiusAu);
    VerifyNumber(targetAltitude);
    if (targetAltitude < -90 || targetAltitude > +90)
        throw `Invalid target altitude angle: ${targetAltitude}`;
    const RISE_SET_DT = 0.42; // 10.08 hours: Nyquist-safe for 22-hour period.
    const max_deriv_alt = MaxAltitudeSlope(body, observer.latitude);
    function altdiff(time) {
        const ofdate = Equator(body, time, observer, true, true);
        const hor = Horizon(time, observer, ofdate.ra, ofdate.dec);
        const altitude = hor.altitude + exports.RAD2DEG * Math.asin(bodyRadiusAu / ofdate.dist);
        return direction * (altitude - targetAltitude);
    }
    // We allow searching forward or backward in time.
    // But we want to keep t1 < t2, so we need a few if/else statements.
    const startTime = MakeTime(dateStart);
    let t1 = startTime;
    let t2 = startTime;
    let a1 = altdiff(t1);
    let a2 = a1;
    for (;;) {
        if (limitDays < 0.0) {
            t1 = t2.AddDays(-RISE_SET_DT);
            a1 = altdiff(t1);
        }
        else {
            t2 = t1.AddDays(+RISE_SET_DT);
            a2 = altdiff(t2);
        }
        const ascent = FindAscent(0, altdiff, max_deriv_alt, t1, t2, a1, a2);
        if (ascent) {
            // We found a time interval [t1, t2] that contains an alt-diff
            // rising from negative a1 to non-negative a2.
            // Search for the time where the root occurs.
            const time = Search(altdiff, ascent.tx, ascent.ty, {
                dt_tolerance_seconds: 0.1,
                init_f1: ascent.ax,
                init_f2: ascent.ay
            });
            if (time) {
                // Now that we have a solution, we have to check whether it goes outside the time bounds.
                if (limitDays < 0.0) {
                    if (time.ut < startTime.ut + limitDays)
                        return null;
                }
                else {
                    if (time.ut > startTime.ut + limitDays)
                        return null;
                }
                return time; // success!
            }
            // The search should have succeeded. Something is wrong with the ascent finder!
            throw `Rise/set search failed after finding ascent: t1=${t1}, t2=${t2}, a1=${a1}, a2=${a2}`;
        }
        // There is no ascent in this interval, so keep searching.
        if (limitDays < 0.0) {
            if (t1.ut < startTime.ut + limitDays)
                return null;
            t2 = t1;
            a2 = a1;
        }
        else {
            if (t2.ut > startTime.ut + limitDays)
                return null;
            t1 = t2;
            a1 = a2;
        }
    }
}
/**
 * @brief Horizontal position of a body upon reaching an hour angle.
 *
 * Returns information about an occurrence of a celestial body
 * reaching a given hour angle as seen by an observer at a given
 * location on the surface of the Earth.
 *
 * @property {AstroTime} time
 *      The date and time of the celestial body reaching the hour angle.
 *
 * @property {HorizontalCoordinates} hor
 *      Topocentric horizontal coordinates for the body
 *      at the time indicated by the `time` property.
 */
class HourAngleEvent {
    constructor(time, hor) {
        this.time = time;
        this.hor = hor;
    }
}
exports.HourAngleEvent = HourAngleEvent;
/**
 * @brief Searches for the time when the center of a body reaches a specified hour angle as seen by an observer on the Earth.
 *
 * The *hour angle* of a celestial body indicates its position in the sky with respect
 * to the Earth's rotation. The hour angle depends on the location of the observer on the Earth.
 * The hour angle is 0 when the body's center reaches its highest angle above the horizon in a given day.
 * The hour angle increases by 1 unit for every sidereal hour that passes after that point, up
 * to 24 sidereal hours when it reaches the highest point again. So the hour angle indicates
 * the number of hours that have passed since the most recent time that the body has culminated,
 * or reached its highest point.
 *
 * This function searches for the next or previous time a celestial body reaches the given hour angle
 * relative to the date and time specified by `dateStart`.
 * To find when a body culminates, pass 0 for `hourAngle`.
 * To find when a body reaches its lowest point in the sky, pass 12 for `hourAngle`.
 *
 * Note that, especially close to the Earth's poles, a body as seen on a given day
 * may always be above the horizon or always below the horizon, so the caller cannot
 * assume that a culminating object is visible nor that an object is below the horizon
 * at its minimum altitude.
 *
 * The function returns the date and time, along with the horizontal coordinates
 * of the body at that time, as seen by the given observer.
 *
 * @param {Body} body
 *      The Sun, Moon, any planet other than the Earth,
 *      or a user-defined star that was created by a call to {@link DefineStar}.
 *
 * @param {Observer} observer
 *      Specifies the geographic coordinates and elevation above sea level of the observer.
 *
 * @param {number} hourAngle
 *      The hour angle expressed in
 *      <a href="https://en.wikipedia.org/wiki/Sidereal_time">sidereal</a>
 *      hours for which the caller seeks to find the body attain.
 *      The value must be in the range [0, 24).
 *      The hour angle represents the number of sidereal hours that have
 *      elapsed since the most recent time the body crossed the observer's local
 *      <a href="https://en.wikipedia.org/wiki/Meridian_(astronomy)">meridian</a>.
 *      This specifying `hourAngle` = 0 finds the moment in time
 *      the body reaches the highest angular altitude in a given sidereal day.
 *
 * @param {FlexibleDateTime} dateStart
 *      The date and time after which the desired hour angle crossing event
 *      is to be found.
 *
 * @param {number} direction
 *      The direction in time to perform the search: a positive value
 *      searches forward in time, a negative value searches backward in time.
 *      The function throws an exception if `direction` is zero.
 *
 * @returns {HourAngleEvent}
 */
function SearchHourAngle(body, observer, hourAngle, dateStart, direction = +1) {
    VerifyObserver(observer);
    let time = MakeTime(dateStart);
    let iter = 0;
    if (body === Body.Earth)
        throw 'Cannot search for hour angle of the Earth.';
    VerifyNumber(hourAngle);
    if (hourAngle < 0.0 || hourAngle >= 24.0)
        throw `Invalid hour angle ${hourAngle}`;
    VerifyNumber(direction);
    if (direction === 0)
        throw `Direction must be positive or negative.`;
    while (true) {
        ++iter;
        // Calculate Greenwich Apparent Sidereal Time (GAST) at the given time.
        let gast = sidereal_time(time);
        let ofdate = Equator(body, time, observer, true, true);
        // Calculate the adjustment needed in sidereal time to bring
        // the hour angle to the desired value.
        let delta_sidereal_hours = ((hourAngle + ofdate.ra - observer.longitude / 15) - gast) % 24;
        if (iter === 1) {
            // On the first iteration, always search in the requested time direction.
            if (direction > 0) {
                // Search forward in time.
                if (delta_sidereal_hours < 0)
                    delta_sidereal_hours += 24;
            }
            else {
                // Search backward in time.
                if (delta_sidereal_hours > 0)
                    delta_sidereal_hours -= 24;
            }
        }
        else {
            // On subsequent iterations, we make the smallest possible adjustment,
            // either forward or backward in time.
            if (delta_sidereal_hours < -12)
                delta_sidereal_hours += 24;
            else if (delta_sidereal_hours > +12)
                delta_sidereal_hours -= 24;
        }
        // If the error is tolerable (less than 0.1 seconds), stop searching.
        if (Math.abs(delta_sidereal_hours) * 3600 < 0.1) {
            const hor = Horizon(time, observer, ofdate.ra, ofdate.dec, 'normal');
            return new HourAngleEvent(time, hor);
        }
        // We need to loop another time to get more accuracy.
        // Update the terrestrial time adjusting by sidereal time.
        let delta_days = (delta_sidereal_hours / 24) * SOLAR_DAYS_PER_SIDEREAL_DAY;
        time = time.AddDays(delta_days);
    }
}
exports.SearchHourAngle = SearchHourAngle;
/**
 * @brief Finds the hour angle of a body for a given observer and time.
 *
 * The *hour angle* of a celestial body indicates its position in the sky with respect
 * to the Earth's rotation. The hour angle depends on the location of the observer on the Earth.
 * The hour angle is 0 when the body's center reaches its highest angle above the horizon in a given day.
 * The hour angle increases by 1 unit for every sidereal hour that passes after that point, up
 * to 24 sidereal hours when it reaches the highest point again. So the hour angle indicates
 * the number of hours that have passed since the most recent time that the body has culminated,
 * or reached its highest point.
 *
 * This function returns the hour angle of the body as seen at the given time and geogrpahic location.
 * The hour angle is a number in the half-open range [0, 24).
 *
 * @param {Body} body
 *      The body whose observed hour angle is to be found.
 *
 * @param {FlexibleDateTime} date
 *      The date and time of the observation.
 *
 * @param {Observer} observer
 *      The geographic location where the observation takes place.
 *
 * @returns {number}
 */
function HourAngle(body, date, observer) {
    const time = MakeTime(date);
    const gast = SiderealTime(time);
    const ofdate = Equator(body, time, observer, true, true);
    let hourAngle = (observer.longitude / 15 + gast - ofdate.ra) % 24;
    if (hourAngle < 0.0)
        hourAngle += 24.0;
    return hourAngle;
}
exports.HourAngle = HourAngle;
/**
 * @brief When the seasons change for a given calendar year.
 *
 * Represents the dates and times of the two solstices
 * and the two equinoxes in a given calendar year.
 * These four events define the changing of the seasons on the Earth.
 *
 * @property {AstroTime} mar_equinox
 *      The date and time of the March equinox in the given calendar year.
 *      This is the moment in March that the plane of the Earth's equator passes
 *      through the center of the Sun; thus the Sun's declination
 *      changes from a negative number to a positive number.
 *      The March equinox defines
 *      the beginning of spring in the northern hemisphere and
 *      the beginning of autumn in the southern hemisphere.
 *
 * @property {AstroTime} jun_solstice
 *      The date and time of the June solstice in the given calendar year.
 *      This is the moment in June that the Sun reaches its most positive
 *      declination value.
 *      At this moment the Earth's north pole is most tilted most toward the Sun.
 *      The June solstice defines
 *      the beginning of summer in the northern hemisphere and
 *      the beginning of winter in the southern hemisphere.
 *
 * @property {AstroTime} sep_equinox
 *      The date and time of the September equinox in the given calendar year.
 *      This is the moment in September that the plane of the Earth's equator passes
 *      through the center of the Sun; thus the Sun's declination
 *      changes from a positive number to a negative number.
 *      The September equinox defines
 *      the beginning of autumn in the northern hemisphere and
 *      the beginning of spring in the southern hemisphere.
 *
 * @property {AstroTime} dec_solstice
 *      The date and time of the December solstice in the given calendar year.
 *      This is the moment in December that the Sun reaches its most negative
 *      declination value.
 *      At this moment the Earth's south pole is tilted most toward the Sun.
 *      The December solstice defines
 *      the beginning of winter in the northern hemisphere and
 *      the beginning of summer in the southern hemisphere.
 */
class SeasonInfo {
    constructor(mar_equinox, jun_solstice, sep_equinox, dec_solstice) {
        this.mar_equinox = mar_equinox;
        this.jun_solstice = jun_solstice;
        this.sep_equinox = sep_equinox;
        this.dec_solstice = dec_solstice;
    }
}
exports.SeasonInfo = SeasonInfo;
/**
 * @brief Finds the equinoxes and solstices for a given calendar year.
 *
 * @param {number | AstroTime} year
 *      The integer value or `AstroTime` object that specifies
 *      the UTC calendar year for which to find equinoxes and solstices.
 *
 * @returns {SeasonInfo}
 */
function Seasons(year) {
    function find(targetLon, month, day) {
        let startDate = new Date(Date.UTC(year, month - 1, day));
        let time = SearchSunLongitude(targetLon, startDate, 20);
        if (!time)
            throw `Cannot find season change near ${startDate.toISOString()}`;
        return time;
    }
    if ((year instanceof Date) && Number.isFinite(year.getTime()))
        year = year.getUTCFullYear();
    if (!Number.isSafeInteger(year))
        throw `Cannot calculate seasons because year argument ${year} is neither a Date nor a safe integer.`;
    let mar_equinox = find(0, 3, 10);
    let jun_solstice = find(90, 6, 10);
    let sep_equinox = find(180, 9, 10);
    let dec_solstice = find(270, 12, 10);
    return new SeasonInfo(mar_equinox, jun_solstice, sep_equinox, dec_solstice);
}
exports.Seasons = Seasons;
/**
 * @brief The viewing conditions of a body relative to the Sun.
 *
 * Represents the angular separation of a body from the Sun as seen from the Earth
 * and the relative ecliptic longitudes between that body and the Earth as seen from the Sun.
 *
 * @property {AstroTime} time
 *      The date and time of the observation.
 *
 * @property {string}  visibility
 *      Either `"morning"` or `"evening"`,
 *      indicating when the body is most easily seen.
 *
 * @property {number}  elongation
 *      The angle in degrees, as seen from the center of the Earth,
 *      of the apparent separation between the body and the Sun.
 *      This angle is measured in 3D space and is not projected onto the ecliptic plane.
 *      When `elongation` is less than a few degrees, the body is very
 *      difficult to see from the Earth because it is lost in the Sun's glare.
 *      The elongation is always in the range [0, 180].
 *
 * @property {number}  ecliptic_separation
 *      The absolute value of the difference between the body's ecliptic longitude
 *      and the Sun's ecliptic longitude, both as seen from the center of the Earth.
 *      This angle measures around the plane of the Earth's orbit (the ecliptic),
 *      and ignores how far above or below that plane the body is.
 *      The ecliptic separation is measured in degrees and is always in the range [0, 180].
 *
 * @see {@link Elongation}
 */
class ElongationEvent {
    constructor(time, visibility, elongation, ecliptic_separation) {
        this.time = time;
        this.visibility = visibility;
        this.elongation = elongation;
        this.ecliptic_separation = ecliptic_separation;
    }
}
exports.ElongationEvent = ElongationEvent;
/**
 * @brief Calculates the viewing conditions of a body relative to the Sun.
 *
 * Calculates angular separation of a body from the Sun as seen from the Earth
 * and the relative ecliptic longitudes between that body and the Earth as seen from the Sun.
 * See the return type {@link ElongationEvent} for details.
 *
 * This function is helpful for determining how easy
 * it is to view a planet away from the Sun's glare on a given date.
 * It also determines whether the object is visible in the morning or evening;
 * this is more important the smaller the elongation is.
 * It is also used to determine how far a planet is from opposition, conjunction, or quadrature.
 *
 * @param {Body} body
 *      The name of the observed body. Not allowed to be `Body.Earth`.
 *
 * @param {FlexibleDateTime} date
 *      The date and time of the observation.
 *
 * @returns {ElongationEvent}
 */
function Elongation(body, date) {
    let time = MakeTime(date);
    let lon = PairLongitude(body, Body.Sun, time);
    let vis;
    if (lon > 180) {
        vis = 'morning';
        lon = 360 - lon;
    }
    else {
        vis = 'evening';
    }
    let angle = AngleFromSun(body, time);
    return new ElongationEvent(time, vis, angle, lon);
}
exports.Elongation = Elongation;
/**
 * @brief Finds the next time Mercury or Venus reaches maximum elongation.
 *
 * Searches for the next maximum elongation event for Mercury or Venus
 * that occurs after the given start date. Calling with other values
 * of `body` will result in an exception.
 * Maximum elongation occurs when the body has the greatest
 * angular separation from the Sun, as seen from the Earth.
 * Returns an `ElongationEvent` object containing the date and time of the next
 * maximum elongation, the elongation in degrees, and whether
 * the body is visible in the morning or evening.
 *
 * @param {Body} body
 *      Either `Body.Mercury` or `Body.Venus`.
 *
 * @param {FlexibleDateTime} startDate
 *      The date and time after which to search for the next maximum elongation event.
 *
 * @returns {ElongationEvent}
 */
function SearchMaxElongation(body, startDate) {
    const dt = 0.01;
    function neg_slope(t) {
        // The slope de/dt goes from positive to negative at the maximum elongation event.
        // But Search() is designed for functions that ascend through zero.
        // So this function returns the negative slope.
        const t1 = t.AddDays(-dt / 2);
        const t2 = t.AddDays(+dt / 2);
        let e1 = AngleFromSun(body, t1);
        let e2 = AngleFromSun(body, t2);
        let m = (e1 - e2) / dt;
        return m;
    }
    let startTime = MakeTime(startDate);
    const table = {
        Mercury: { s1: 50.0, s2: 85.0 },
        Venus: { s1: 40.0, s2: 50.0 }
    };
    const planet = table[body];
    if (!planet)
        throw 'SearchMaxElongation works for Mercury and Venus only.';
    let iter = 0;
    while (++iter <= 2) {
        // Find current heliocentric relative longitude between the
        // inferior planet and the Earth.
        let plon = EclipticLongitude(body, startTime);
        let elon = EclipticLongitude(Body.Earth, startTime);
        let rlon = LongitudeOffset(plon - elon); // clamp to (-180, +180]
        // The slope function is not well-behaved when rlon is near 0 degrees or 180 degrees
        // because there is a cusp there that causes a discontinuity in the derivative.
        // So we need to guard against searching near such times.
        let rlon_lo, rlon_hi, adjust_days;
        if (rlon >= -planet.s1 && rlon < +planet.s1) {
            // Seek to the window [+s1, +s2].
            adjust_days = 0;
            // Search forward for the time t1 when rel lon = +s1.
            rlon_lo = +planet.s1;
            // Search forward for the time t2 when rel lon = +s2.
            rlon_hi = +planet.s2;
        }
        else if (rlon >= +planet.s2 || rlon < -planet.s2) {
            // Seek to the next search window at [-s2, -s1].
            adjust_days = 0;
            // Search forward for the time t1 when rel lon = -s2.
            rlon_lo = -planet.s2;
            // Search forward for the time t2 when rel lon = -s1.
            rlon_hi = -planet.s1;
        }
        else if (rlon >= 0) {
            // rlon must be in the middle of the window [+s1, +s2].
            // Search BACKWARD for the time t1 when rel lon = +s1.
            adjust_days = -SynodicPeriod(body) / 4;
            rlon_lo = +planet.s1;
            rlon_hi = +planet.s2;
            // Search forward from t1 to find t2 such that rel lon = +s2.
        }
        else {
            // rlon must be in the middle of the window [-s2, -s1].
            // Search BACKWARD for the time t1 when rel lon = -s2.
            adjust_days = -SynodicPeriod(body) / 4;
            rlon_lo = -planet.s2;
            // Search forward from t1 to find t2 such that rel lon = -s1.
            rlon_hi = -planet.s1;
        }
        let t_start = startTime.AddDays(adjust_days);
        let t1 = SearchRelativeLongitude(body, rlon_lo, t_start);
        let t2 = SearchRelativeLongitude(body, rlon_hi, t1);
        // Now we have a time range [t1,t2] that brackets a maximum elongation event.
        // Confirm the bracketing.
        let m1 = neg_slope(t1);
        if (m1 >= 0)
            throw `SearchMaxElongation: internal error: m1 = ${m1}`;
        let m2 = neg_slope(t2);
        if (m2 <= 0)
            throw `SearchMaxElongation: internal error: m2 = ${m2}`;
        // Use the generic search algorithm to home in on where the slope crosses from negative to positive.
        let tx = Search(neg_slope, t1, t2, { init_f1: m1, init_f2: m2, dt_tolerance_seconds: 10 });
        if (!tx)
            throw `SearchMaxElongation: failed search iter ${iter} (t1=${t1.toString()}, t2=${t2.toString()})`;
        if (tx.tt >= startTime.tt)
            return Elongation(body, tx);
        // This event is in the past (earlier than startDate).
        // We need to search forward from t2 to find the next possible window.
        // We never need to search more than twice.
        startTime = t2.AddDays(1);
    }
    throw `SearchMaxElongation: failed to find event after 2 tries.`;
}
exports.SearchMaxElongation = SearchMaxElongation;
/**
 * @brief Searches for the date and time Venus will next appear brightest as seen from the Earth.
 *
 * @param {Body} body
 *      Currently only `Body.Venus` is supported.
 *      Mercury's peak magnitude occurs at superior conjunction, when it is impossible to see from Earth,
 *      so peak magnitude events have little practical value for that planet.
 *      The Moon reaches peak magnitude very close to full moon, which can be found using
 *      {@link SearchMoonQuarter} or {@link SearchMoonPhase}.
 *      The other planets reach peak magnitude very close to opposition,
 *      which can be found using {@link SearchRelativeLongitude}.
 *
 * @param {FlexibleDateTime} startDate
 *      The date and time after which to find the next peak magnitude event.
 *
 * @returns {IlluminationInfo}
 */
function SearchPeakMagnitude(body, startDate) {
    if (body !== Body.Venus)
        throw 'SearchPeakMagnitude currently works for Venus only.';
    const dt = 0.01;
    function slope(t) {
        // The Search() function finds a transition from negative to positive values.
        // The derivative of magnitude y with respect to time t (dy/dt)
        // is negative as an object gets brighter, because the magnitude numbers
        // get smaller. At peak magnitude dy/dt = 0, then as the object gets dimmer,
        // dy/dt > 0.
        const t1 = t.AddDays(-dt / 2);
        const t2 = t.AddDays(+dt / 2);
        const y1 = Illumination(body, t1).mag;
        const y2 = Illumination(body, t2).mag;
        const m = (y2 - y1) / dt;
        return m;
    }
    let startTime = MakeTime(startDate);
    // s1 and s2 are relative longitudes within which peak magnitude of Venus can occur.
    const s1 = 10.0;
    const s2 = 30.0;
    let iter = 0;
    while (++iter <= 2) {
        // Find current heliocentric relative longitude between the
        // inferior planet and the Earth.
        let plon = EclipticLongitude(body, startTime);
        let elon = EclipticLongitude(Body.Earth, startTime);
        let rlon = LongitudeOffset(plon - elon); // clamp to (-180, +180]
        // The slope function is not well-behaved when rlon is near 0 degrees or 180 degrees
        // because there is a cusp there that causes a discontinuity in the derivative.
        // So we need to guard against searching near such times.
        let rlon_lo, rlon_hi, adjust_days;
        if (rlon >= -s1 && rlon < +s1) {
            // Seek to the window [+s1, +s2].
            adjust_days = 0;
            // Search forward for the time t1 when rel lon = +s1.
            rlon_lo = +s1;
            // Search forward for the time t2 when rel lon = +s2.
            rlon_hi = +s2;
        }
        else if (rlon >= +s2 || rlon < -s2) {
            // Seek to the next search window at [-s2, -s1].
            adjust_days = 0;
            // Search forward for the time t1 when rel lon = -s2.
            rlon_lo = -s2;
            // Search forward for the time t2 when rel lon = -s1.
            rlon_hi = -s1;
        }
        else if (rlon >= 0) {
            // rlon must be in the middle of the window [+s1, +s2].
            // Search BACKWARD for the time t1 when rel lon = +s1.
            adjust_days = -SynodicPeriod(body) / 4;
            rlon_lo = +s1;
            // Search forward from t1 to find t2 such that rel lon = +s2.
            rlon_hi = +s2;
        }
        else {
            // rlon must be in the middle of the window [-s2, -s1].
            // Search BACKWARD for the time t1 when rel lon = -s2.
            adjust_days = -SynodicPeriod(body) / 4;
            rlon_lo = -s2;
            // Search forward from t1 to find t2 such that rel lon = -s1.
            rlon_hi = -s1;
        }
        let t_start = startTime.AddDays(adjust_days);
        let t1 = SearchRelativeLongitude(body, rlon_lo, t_start);
        let t2 = SearchRelativeLongitude(body, rlon_hi, t1);
        // Now we have a time range [t1,t2] that brackets a maximum magnitude event.
        // Confirm the bracketing.
        let m1 = slope(t1);
        if (m1 >= 0)
            throw `SearchPeakMagnitude: internal error: m1 = ${m1}`;
        let m2 = slope(t2);
        if (m2 <= 0)
            throw `SearchPeakMagnitude: internal error: m2 = ${m2}`;
        // Use the generic search algorithm to home in on where the slope crosses from negative to positive.
        let tx = Search(slope, t1, t2, { init_f1: m1, init_f2: m2, dt_tolerance_seconds: 10 });
        if (!tx)
            throw `SearchPeakMagnitude: failed search iter ${iter} (t1=${t1.toString()}, t2=${t2.toString()})`;
        if (tx.tt >= startTime.tt)
            return Illumination(body, tx);
        // This event is in the past (earlier than startDate).
        // We need to search forward from t2 to find the next possible window.
        // We never need to search more than twice.
        startTime = t2.AddDays(1);
    }
    throw `SearchPeakMagnitude: failed to find event after 2 tries.`;
}
exports.SearchPeakMagnitude = SearchPeakMagnitude;
/**
 * @brief The two kinds of apsis: pericenter (closest) and apocenter (farthest).
 *
 * `Pericenter`: The body is at its closest distance to the object it orbits.
 * `Apocenter`:  The body is at its farthest distance from the object it orbits.
 *
 * @enum {number}
 */
var ApsisKind;
(function (ApsisKind) {
    ApsisKind[ApsisKind["Pericenter"] = 0] = "Pericenter";
    ApsisKind[ApsisKind["Apocenter"] = 1] = "Apocenter";
})(ApsisKind = exports.ApsisKind || (exports.ApsisKind = {}));
/**
 * @brief A closest or farthest point in a body's orbit around its primary.
 *
 * For a planet orbiting the Sun, apsis is a perihelion or aphelion, respectively.
 * For the Moon orbiting the Earth, apsis is a perigee or apogee, respectively.
 *
 * @property {AstroTime} time
 *      The date and time of the apsis.
 *
 * @property {ApsisKind} kind
 *      For a closest approach (perigee or perihelion), `kind` is `ApsisKind.Pericenter`.
 *      For a farthest distance event (apogee or aphelion), `kind` is `ApsisKind.Apocenter`.
 *
 * @property {number} dist_au
 *      The distance between the centers of the two bodies in astronomical units (AU).
 *
 * @property {number} dist_km
 *      The distance between the centers of the two bodies in kilometers.
 *
 * @see {@link SearchLunarApsis}
 * @see {@link NextLunarApsis}
 * @see {@link SearchPlanetApsis}
 * @see {@link NextPlanetApsis}
 */
class Apsis {
    constructor(time, kind, dist_au) {
        this.time = time;
        this.kind = kind;
        this.dist_au = dist_au;
        this.dist_km = dist_au * exports.KM_PER_AU;
    }
}
exports.Apsis = Apsis;
/**
 * @brief Finds the next perigee or apogee of the Moon.
 *
 * Finds the next perigee (closest approach) or apogee (farthest remove) of the Moon
 * that occurs after the specified date and time.
 *
 * @param {FlexibleDateTime} startDate
 *      The date and time after which to find the next perigee or apogee.
 *
 * @returns {Apsis}
 */
function SearchLunarApsis(startDate) {
    const dt = 0.001;
    function distance_slope(t) {
        let t1 = t.AddDays(-dt / 2);
        let t2 = t.AddDays(+dt / 2);
        let r1 = CalcMoon(t1).distance_au;
        let r2 = CalcMoon(t2).distance_au;
        let m = (r2 - r1) / dt;
        return m;
    }
    function negative_distance_slope(t) {
        return -distance_slope(t);
    }
    // Check the rate of change of the distance dr/dt at the start time.
    // If it is positive, the Moon is currently getting farther away,
    // so start looking for apogee.
    // Conversely, if dr/dt < 0, start looking for perigee.
    // Either way, the polarity of the slope will change, so the product will be negative.
    // Handle the crazy corner case of exactly touching zero by checking for m1*m2 <= 0.
    let t1 = MakeTime(startDate);
    let m1 = distance_slope(t1);
    const increment = 5; // number of days to skip in each iteration
    for (var iter = 0; iter * increment < 2 * MEAN_SYNODIC_MONTH; ++iter) {
        let t2 = t1.AddDays(increment);
        let m2 = distance_slope(t2);
        if (m1 * m2 <= 0) {
            // The time range [t1, t2] contains an apsis.
            // Figure out whether it is perigee or apogee.
            if (m1 < 0 || m2 > 0) {
                // We found a minimum distance event: perigee.
                // Search the time range [t1, t2] for the time when the slope goes
                // from negative to positive.
                let tx = Search(distance_slope, t1, t2, { init_f1: m1, init_f2: m2 });
                if (!tx)
                    throw 'SearchLunarApsis INTERNAL ERROR: perigee search failed!';
                let dist = CalcMoon(tx).distance_au;
                return new Apsis(tx, 0, dist);
            }
            if (m1 > 0 || m2 < 0) {
                // We found a maximum distance event: apogee.
                // Search the time range [t1, t2] for the time when the slope goes
                // from positive to negative.
                let tx = Search(negative_distance_slope, t1, t2, { init_f1: -m1, init_f2: -m2 });
                if (!tx)
                    throw 'SearchLunarApsis INTERNAL ERROR: apogee search failed!';
                let dist = CalcMoon(tx).distance_au;
                return new Apsis(tx, 1, dist);
            }
            // This should never happen; it should not be possible for consecutive
            // times t1 and t2 to both have zero slope.
            throw 'SearchLunarApsis INTERNAL ERROR: cannot classify apsis event!';
        }
        t1 = t2;
        m1 = m2;
    }
    // It should not be possible to fail to find an apsis within 2 synodic months.
    throw 'SearchLunarApsis INTERNAL ERROR: could not find apsis within 2 synodic months of start date.';
}
exports.SearchLunarApsis = SearchLunarApsis;
/**
 * @brief Finds the next lunar apsis (perigee or apogee) in a series.
 *
 * Given a lunar apsis returned by an initial call to {@link SearchLunarApsis},
 * or a previous call to `NextLunarApsis`, finds the next lunar apsis.
 * If the given apsis is a perigee, this function finds the next apogee, and vice versa.
 *
 * @param {Apsis} apsis
 *      A lunar perigee or apogee event.
 *
 * @returns {Apsis}
 *      The successor apogee for the given perigee, or the successor perigee for the given apogee.
 */
function NextLunarApsis(apsis) {
    const skip = 11; // number of days to skip to start looking for next apsis event
    let next = SearchLunarApsis(apsis.time.AddDays(skip));
    if (next.kind + apsis.kind !== 1)
        throw `NextLunarApsis INTERNAL ERROR: did not find alternating apogee/perigee: prev=${apsis.kind} @ ${apsis.time.toString()}, next=${next.kind} @ ${next.time.toString()}`;
    return next;
}
exports.NextLunarApsis = NextLunarApsis;
function PlanetExtreme(body, kind, start_time, dayspan) {
    const direction = (kind === ApsisKind.Apocenter) ? +1.0 : -1.0;
    const npoints = 10;
    for (;;) {
        const interval = dayspan / (npoints - 1);
        // iterate until uncertainty is less than one minute
        if (interval < 1.0 / 1440.0) {
            const apsis_time = start_time.AddDays(interval / 2.0);
            const dist_au = HelioDistance(body, apsis_time);
            return new Apsis(apsis_time, kind, dist_au);
        }
        let best_i = -1;
        let best_dist = 0.0;
        for (let i = 0; i < npoints; ++i) {
            const time = start_time.AddDays(i * interval);
            const dist = direction * HelioDistance(body, time);
            if (i == 0 || dist > best_dist) {
                best_i = i;
                best_dist = dist;
            }
        }
        /* Narrow in on the extreme point. */
        start_time = start_time.AddDays((best_i - 1) * interval);
        dayspan = 2.0 * interval;
    }
}
function BruteSearchPlanetApsis(body, startTime) {
    /*
        Neptune is a special case for two reasons:
        1. Its orbit is nearly circular (low orbital eccentricity).
        2. It is so distant from the Sun that the orbital period is very long.
        Put together, this causes wobbling of the Sun around the Solar System Barycenter (SSB)
        to be so significant that there are 3 local minima in the distance-vs-time curve
        near each apsis. Therefore, unlike for other planets, we can't use an optimized
        algorithm for finding dr/dt = 0.
        Instead, we use a dumb, brute-force algorithm of sampling and finding min/max
        heliocentric distance.

        There is a similar problem in the TOP2013 model for Pluto:
        Its position vector has high-frequency oscillations that confuse the
        slope-based determination of apsides.
    */
    /*
        Rewind approximately 30 degrees in the orbit,
        then search forward for 270 degrees.
        This is a very cautious way to prevent missing an apsis.
        Typically we will find two apsides, and we pick whichever
        apsis is ealier, but after startTime.
        Sample points around this orbital arc and find when the distance
        is greatest and smallest.
    */
    const npoints = 100;
    const t1 = startTime.AddDays(Planet[body].OrbitalPeriod * (-30 / 360));
    const t2 = startTime.AddDays(Planet[body].OrbitalPeriod * (+270 / 360));
    let t_min = t1;
    let t_max = t1;
    let min_dist = -1.0;
    let max_dist = -1.0;
    const interval = (t2.ut - t1.ut) / (npoints - 1);
    for (let i = 0; i < npoints; ++i) {
        const time = t1.AddDays(i * interval);
        const dist = HelioDistance(body, time);
        if (i === 0) {
            max_dist = min_dist = dist;
        }
        else {
            if (dist > max_dist) {
                max_dist = dist;
                t_max = time;
            }
            if (dist < min_dist) {
                min_dist = dist;
                t_min = time;
            }
        }
    }
    const perihelion = PlanetExtreme(body, 0, t_min.AddDays(-2 * interval), 4 * interval);
    const aphelion = PlanetExtreme(body, 1, t_max.AddDays(-2 * interval), 4 * interval);
    if (perihelion.time.tt >= startTime.tt) {
        if (aphelion.time.tt >= startTime.tt && aphelion.time.tt < perihelion.time.tt)
            return aphelion;
        return perihelion;
    }
    if (aphelion.time.tt >= startTime.tt)
        return aphelion;
    throw 'Internal error: failed to find Neptune apsis.';
}
/**
 * @brief Finds the next perihelion or aphelion of a planet.
 *
 * Finds the date and time of a planet's perihelion (closest approach to the Sun)
 * or aphelion (farthest distance from the Sun) after a given time.
 *
 * Given a date and time to start the search in `startTime`, this function finds the
 * next date and time that the center of the specified planet reaches the closest or farthest point
 * in its orbit with respect to the center of the Sun, whichever comes first
 * after `startTime`.
 *
 * The closest point is called *perihelion* and the farthest point is called *aphelion*.
 * The word *apsis* refers to either event.
 *
 * To iterate through consecutive alternating perihelion and aphelion events,
 * call `SearchPlanetApsis` once, then use the return value to call
 * {@link NextPlanetApsis}. After that, keep feeding the previous return value
 * from `NextPlanetApsis` into another call of `NextPlanetApsis`
 * as many times as desired.
 *
 * @param {Body} body
 *      The planet for which to find the next perihelion/aphelion event.
 *      Not allowed to be `Body.Sun` or `Body.Moon`.
 *
 * @param {FlexibleDateTime} startTime
 *      The date and time at which to start searching for the next perihelion or aphelion.
 *
 * @returns {Apsis}
 *      The next perihelion or aphelion that occurs after `startTime`.
 */
function SearchPlanetApsis(body, startTime) {
    startTime = MakeTime(startTime);
    if (body === Body.Neptune || body === Body.Pluto)
        return BruteSearchPlanetApsis(body, startTime);
    function positive_slope(t) {
        const dt = 0.001;
        let t1 = t.AddDays(-dt / 2);
        let t2 = t.AddDays(+dt / 2);
        let r1 = HelioDistance(body, t1);
        let r2 = HelioDistance(body, t2);
        let m = (r2 - r1) / dt;
        return m;
    }
    function negative_slope(t) {
        return -positive_slope(t);
    }
    const orbit_period_days = Planet[body].OrbitalPeriod;
    const increment = orbit_period_days / 6.0;
    let t1 = startTime;
    let m1 = positive_slope(t1);
    for (let iter = 0; iter * increment < 2.0 * orbit_period_days; ++iter) {
        const t2 = t1.AddDays(increment);
        const m2 = positive_slope(t2);
        if (m1 * m2 <= 0.0) {
            /* There is a change of slope polarity within the time range [t1, t2]. */
            /* Therefore this time range contains an apsis. */
            /* Figure out whether it is perihelion or aphelion. */
            let slope_func;
            let kind;
            if (m1 < 0.0 || m2 > 0.0) {
                /* We found a minimum-distance event: perihelion. */
                /* Search the time range for the time when the slope goes from negative to positive. */
                slope_func = positive_slope;
                kind = ApsisKind.Pericenter;
            }
            else if (m1 > 0.0 || m2 < 0.0) {
                /* We found a maximum-distance event: aphelion. */
                /* Search the time range for the time when the slope goes from positive to negative. */
                slope_func = negative_slope;
                kind = ApsisKind.Apocenter;
            }
            else {
                /* This should never happen. It should not be possible for both slopes to be zero. */
                throw "Internal error with slopes in SearchPlanetApsis";
            }
            const search = Search(slope_func, t1, t2);
            if (!search)
                throw "Failed to find slope transition in planetary apsis search.";
            const dist = HelioDistance(body, search);
            return new Apsis(search, kind, dist);
        }
        /* We have not yet found a slope polarity change. Keep searching. */
        t1 = t2;
        m1 = m2;
    }
    throw "Internal error: should have found planetary apsis within 2 orbital periods.";
}
exports.SearchPlanetApsis = SearchPlanetApsis;
/**
 * @brief Finds the next planetary perihelion or aphelion event in a series.
 *
 * This function requires an {@link Apsis} value obtained from a call
 * to {@link SearchPlanetApsis} or `NextPlanetApsis`.
 * Given an aphelion event, this function finds the next perihelion event, and vice versa.
 * See {@link SearchPlanetApsis} for more details.
 *
 * @param {Body} body
 *      The planet for which to find the next perihelion/aphelion event.
 *      Not allowed to be `Body.Sun` or `Body.Moon`.
 *      Must match the body passed into the call that produced the `apsis` parameter.
 *
 * @param {Apsis} apsis
 *      An apsis event obtained from a call to {@link SearchPlanetApsis} or `NextPlanetApsis`.
 *
 * @returns {Apsis}
 *      Same as the return value for {@link SearchPlanetApsis}.
 */
function NextPlanetApsis(body, apsis) {
    if (apsis.kind !== ApsisKind.Pericenter && apsis.kind !== ApsisKind.Apocenter)
        throw `Invalid apsis kind: ${apsis.kind}`;
    /* skip 1/4 of an orbit before starting search again */
    const skip = 0.25 * Planet[body].OrbitalPeriod;
    const time = apsis.time.AddDays(skip);
    const next = SearchPlanetApsis(body, time);
    /* Verify that we found the opposite apsis from the previous one. */
    if (next.kind + apsis.kind !== 1)
        throw `Internal error: previous apsis was ${apsis.kind}, but found ${next.kind} for next apsis.`;
    return next;
}
exports.NextPlanetApsis = NextPlanetApsis;
/**
 * @brief Calculates the inverse of a rotation matrix.
 *
 * Given a rotation matrix that performs some coordinate transform,
 * this function returns the matrix that reverses that transform.
 *
 * @param {RotationMatrix} rotation
 *      The rotation matrix to be inverted.
 *
 * @returns {RotationMatrix}
 *      The inverse rotation matrix.
 */
function InverseRotation(rotation) {
    return new RotationMatrix([
        [rotation.rot[0][0], rotation.rot[1][0], rotation.rot[2][0]],
        [rotation.rot[0][1], rotation.rot[1][1], rotation.rot[2][1]],
        [rotation.rot[0][2], rotation.rot[1][2], rotation.rot[2][2]]
    ]);
}
exports.InverseRotation = InverseRotation;
/**
 * @brief Creates a rotation based on applying one rotation followed by another.
 *
 * Given two rotation matrices, returns a combined rotation matrix that is
 * equivalent to rotating based on the first matrix, followed by the second.
 *
 * @param {RotationMatrix} a
 *      The first rotation to apply.
 *
 * @param {RotationMatrix} b
 *      The second rotation to apply.
 *
 * @returns {RotationMatrix}
 *      The combined rotation matrix.
 */
function CombineRotation(a, b) {
    /*
        Use matrix multiplication: c = b*a.
        We put 'b' on the left and 'a' on the right because,
        just like when you use a matrix M to rotate a vector V,
        you put the M on the left in the product M*V.
        We can think of this as 'b' rotating all the 3 column vectors in 'a'.
    */
    return new RotationMatrix([
        [
            b.rot[0][0] * a.rot[0][0] + b.rot[1][0] * a.rot[0][1] + b.rot[2][0] * a.rot[0][2],
            b.rot[0][1] * a.rot[0][0] + b.rot[1][1] * a.rot[0][1] + b.rot[2][1] * a.rot[0][2],
            b.rot[0][2] * a.rot[0][0] + b.rot[1][2] * a.rot[0][1] + b.rot[2][2] * a.rot[0][2]
        ],
        [
            b.rot[0][0] * a.rot[1][0] + b.rot[1][0] * a.rot[1][1] + b.rot[2][0] * a.rot[1][2],
            b.rot[0][1] * a.rot[1][0] + b.rot[1][1] * a.rot[1][1] + b.rot[2][1] * a.rot[1][2],
            b.rot[0][2] * a.rot[1][0] + b.rot[1][2] * a.rot[1][1] + b.rot[2][2] * a.rot[1][2]
        ],
        [
            b.rot[0][0] * a.rot[2][0] + b.rot[1][0] * a.rot[2][1] + b.rot[2][0] * a.rot[2][2],
            b.rot[0][1] * a.rot[2][0] + b.rot[1][1] * a.rot[2][1] + b.rot[2][1] * a.rot[2][2],
            b.rot[0][2] * a.rot[2][0] + b.rot[1][2] * a.rot[2][1] + b.rot[2][2] * a.rot[2][2]
        ]
    ]);
}
exports.CombineRotation = CombineRotation;
/**
 * @brief Creates an identity rotation matrix.
 *
 * Returns a rotation matrix that has no effect on orientation.
 * This matrix can be the starting point for other operations,
 * such as using a series of calls to {@link Pivot} to
 * create a custom rotation matrix.
 *
 * @returns {RotationMatrix}
 *      The identity matrix.
 */
function IdentityMatrix() {
    return new RotationMatrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]);
}
exports.IdentityMatrix = IdentityMatrix;
/**
* @brief Re-orients a rotation matrix by pivoting it by an angle around one of its axes.
*
* Given a rotation matrix, a selected coordinate axis, and an angle in degrees,
* this function pivots the rotation matrix by that angle around that coordinate axis.
*
* For example, if you have rotation matrix that converts ecliptic coordinates (ECL)
* to horizontal coordinates (HOR), but you really want to convert ECL to the orientation
* of a telescope camera pointed at a given body, you can use `Astronomy_Pivot` twice:
* (1) pivot around the zenith axis by the body's azimuth, then (2) pivot around the
* western axis by the body's altitude angle. The resulting rotation matrix will then
* reorient ECL coordinates to the orientation of your telescope camera.
*
* @param {RotationMatrix} rotation
*      The input rotation matrix.
*
* @param {number} axis
*      An integer that selects which coordinate axis to rotate around:
*      0 = x, 1 = y, 2 = z. Any other value will cause an exception.
*
* @param {number} angle
*      An angle in degrees indicating the amount of rotation around the specified axis.
*      Positive angles indicate rotation counterclockwise as seen from the positive
*      direction along that axis, looking towards the origin point of the orientation system.
*      Any finite number of degrees is allowed, but best precision will result from
*      keeping `angle` in the range [-360, +360].
*
* @returns {RotationMatrix}
*      A pivoted matrix object.
*/
function Pivot(rotation, axis, angle) {
    // Check for an invalid coordinate axis.
    if (axis !== 0 && axis !== 1 && axis !== 2)
        throw `Invalid axis ${axis}. Must be [0, 1, 2].`;
    const radians = VerifyNumber(angle) * exports.DEG2RAD;
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    /*
        We need to maintain the "right-hand" rule, no matter which
        axis was selected. That means we pick (i, j, k) axis order
        such that the following vector cross product is satisfied:
        i x j = k
    */
    const i = (axis + 1) % 3;
    const j = (axis + 2) % 3;
    const k = axis;
    let rot = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    rot[i][i] = c * rotation.rot[i][i] - s * rotation.rot[i][j];
    rot[i][j] = s * rotation.rot[i][i] + c * rotation.rot[i][j];
    rot[i][k] = rotation.rot[i][k];
    rot[j][i] = c * rotation.rot[j][i] - s * rotation.rot[j][j];
    rot[j][j] = s * rotation.rot[j][i] + c * rotation.rot[j][j];
    rot[j][k] = rotation.rot[j][k];
    rot[k][i] = c * rotation.rot[k][i] - s * rotation.rot[k][j];
    rot[k][j] = s * rotation.rot[k][i] + c * rotation.rot[k][j];
    rot[k][k] = rotation.rot[k][k];
    return new RotationMatrix(rot);
}
exports.Pivot = Pivot;
/**
 * @brief Converts spherical coordinates to Cartesian coordinates.
 *
 * Given spherical coordinates and a time at which they are valid,
 * returns a vector of Cartesian coordinates. The returned value
 * includes the time, as required by `AstroTime`.
 *
 * @param {Spherical} sphere
 *      Spherical coordinates to be converted.
 *
 * @param {FlexibleDateTime} time
 *      The time that should be included in the returned vector.
 *
 * @returns {Vector}
 *      The vector form of the supplied spherical coordinates.
 */
function VectorFromSphere(sphere, time) {
    time = MakeTime(time);
    const radlat = sphere.lat * exports.DEG2RAD;
    const radlon = sphere.lon * exports.DEG2RAD;
    const rcoslat = sphere.dist * Math.cos(radlat);
    return new Vector(rcoslat * Math.cos(radlon), rcoslat * Math.sin(radlon), sphere.dist * Math.sin(radlat), time);
}
exports.VectorFromSphere = VectorFromSphere;
/**
 * @brief Given an equatorial vector, calculates equatorial angular coordinates.
 *
 * @param {Vector} vec
 *      A vector in an equatorial coordinate system.
 *
 * @returns {EquatorialCoordinates}
 *      Angular coordinates expressed in the same equatorial system as `vec`.
 */
function EquatorFromVector(vec) {
    const sphere = SphereFromVector(vec);
    return new EquatorialCoordinates(sphere.lon / 15, sphere.lat, sphere.dist, vec);
}
exports.EquatorFromVector = EquatorFromVector;
/**
 * @brief Converts Cartesian coordinates to spherical coordinates.
 *
 * Given a Cartesian vector, returns latitude, longitude, and distance.
 *
 * @param {Vector} vector
 *      Cartesian vector to be converted to spherical coordinates.
 *
 * @returns {Spherical}
 *      Spherical coordinates that are equivalent to the given vector.
 */
function SphereFromVector(vector) {
    const xyproj = vector.x * vector.x + vector.y * vector.y;
    const dist = Math.sqrt(xyproj + vector.z * vector.z);
    let lat, lon;
    if (xyproj === 0.0) {
        if (vector.z === 0.0)
            throw 'Zero-length vector not allowed.';
        lon = 0.0;
        lat = (vector.z < 0.0) ? -90.0 : +90.0;
    }
    else {
        lon = exports.RAD2DEG * Math.atan2(vector.y, vector.x);
        if (lon < 0.0)
            lon += 360.0;
        lat = exports.RAD2DEG * Math.atan2(vector.z, Math.sqrt(xyproj));
    }
    return new Spherical(lat, lon, dist);
}
exports.SphereFromVector = SphereFromVector;
function ToggleAzimuthDirection(az) {
    az = 360.0 - az;
    if (az >= 360.0)
        az -= 360.0;
    else if (az < 0.0)
        az += 360.0;
    return az;
}
/**
 * @brief Converts Cartesian coordinates to horizontal coordinates.
 *
 * Given a horizontal Cartesian vector, returns horizontal azimuth and altitude.
 *
 * *IMPORTANT:* This function differs from {@link SphereFromVector} in two ways:
 * - `SphereFromVector` returns a `lon` value that represents azimuth defined counterclockwise
 *   from north (e.g., west = +90), but this function represents a clockwise rotation
 *   (e.g., east = +90). The difference is because `SphereFromVector` is intended
 *   to preserve the vector "right-hand rule", while this function defines azimuth in a more
 *   traditional way as used in navigation and cartography.
 * - This function optionally corrects for atmospheric refraction, while `SphereFromVector` does not.
 *
 * The returned object contains the azimuth in `lon`.
 * It is measured in degrees clockwise from north: east = +90 degrees, west = +270 degrees.
 *
 * The altitude is stored in `lat`.
 *
 * The distance to the observed object is stored in `dist`,
 * and is expressed in astronomical units (AU).
 *
 * @param {Vector} vector
 *      Cartesian vector to be converted to horizontal coordinates.
 *
 * @param {string} refraction
 *      `"normal"`: correct altitude for atmospheric refraction (recommended).
 *      `"jplhor"`: for JPL Horizons compatibility testing only; not recommended for normal use.
 *      `null`: no atmospheric refraction correction is performed.
 *
 * @returns {Spherical}
 */
function HorizonFromVector(vector, refraction) {
    const sphere = SphereFromVector(vector);
    sphere.lon = ToggleAzimuthDirection(sphere.lon);
    sphere.lat += Refraction(refraction, sphere.lat);
    return sphere;
}
exports.HorizonFromVector = HorizonFromVector;
/**
 * @brief Given apparent angular horizontal coordinates in `sphere`, calculate horizontal vector.
 *
 * @param {Spherical} sphere
 *      A structure that contains apparent horizontal coordinates:
 *      `lat` holds the refracted altitude angle,
 *      `lon` holds the azimuth in degrees clockwise from north,
 *      and `dist` holds the distance from the observer to the object in AU.
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the observation. This is needed because the returned
 *      vector object requires a valid time value when passed to certain other functions.
 *
 * @param {string} refraction
 *      `"normal"`: correct altitude for atmospheric refraction (recommended).
 *      `"jplhor"`: for JPL Horizons compatibility testing only; not recommended for normal use.
 *      `null`: no atmospheric refraction correction is performed.
 *
 * @returns {Vector}
 *      A vector in the horizontal system: `x` = north, `y` = west, and `z` = zenith (up).
 */
function VectorFromHorizon(sphere, time, refraction) {
    time = MakeTime(time);
    /* Convert azimuth from clockwise-from-north to counterclockwise-from-north. */
    const lon = ToggleAzimuthDirection(sphere.lon);
    /* Reverse any applied refraction. */
    const lat = sphere.lat + InverseRefraction(refraction, sphere.lat);
    const xsphere = new Spherical(lat, lon, sphere.dist);
    return VectorFromSphere(xsphere, time);
}
exports.VectorFromHorizon = VectorFromHorizon;
/**
 * @brief Calculates the amount of "lift" to an altitude angle caused by atmospheric refraction.
 *
 * Given an altitude angle and a refraction option, calculates
 * the amount of "lift" caused by atmospheric refraction.
 * This is the number of degrees higher in the sky an object appears
 * due to the lensing of the Earth's atmosphere.
 * This function works best near sea level.
 * To correct for higher elevations, call {@link Atmosphere} for that
 * elevation and multiply the refraction angle by the resulting relative density.
 *
 * @param {string} refraction
 *      `"normal"`: correct altitude for atmospheric refraction (recommended).
 *      `"jplhor"`: for JPL Horizons compatibility testing only; not recommended for normal use.
 *      `null`: no atmospheric refraction correction is performed.
 *
 * @param {number} altitude
 *      An altitude angle in a horizontal coordinate system. Must be a value between -90 and +90.
 *
 * @returns {number}
 *      The angular adjustment in degrees to be added to the altitude angle to correct for atmospheric lensing.
 */
function Refraction(refraction, altitude) {
    let refr;
    VerifyNumber(altitude);
    if (altitude < -90.0 || altitude > +90.0)
        return 0.0; /* no attempt to correct an invalid altitude */
    if (refraction === 'normal' || refraction === 'jplhor') {
        // http://extras.springer.com/1999/978-1-4471-0555-8/chap4/horizons/horizons.pdf
        // JPL Horizons says it uses refraction algorithm from
        // Meeus "Astronomical Algorithms", 1991, p. 101-102.
        // I found the following Go implementation:
        // https://github.com/soniakeys/meeus/blob/master/v3/refraction/refract.go
        // This is a translation from the function "Saemundsson" there.
        // I found experimentally that JPL Horizons clamps the angle to 1 degree below the horizon.
        // This is important because the 'refr' formula below goes crazy near hd = -5.11.
        let hd = altitude;
        if (hd < -1.0)
            hd = -1.0;
        refr = (1.02 / Math.tan((hd + 10.3 / (hd + 5.11)) * exports.DEG2RAD)) / 60.0;
        if (refraction === 'normal' && altitude < -1.0) {
            // In "normal" mode we gradually reduce refraction toward the nadir
            // so that we never get an altitude angle less than -90 degrees.
            // When horizon angle is -1 degrees, the factor is exactly 1.
            // As altitude approaches -90 (the nadir), the fraction approaches 0 linearly.
            refr *= (altitude + 90.0) / 89.0;
        }
    }
    else if (!refraction) {
        // The caller does not want refraction correction.
        refr = 0.0;
    }
    else {
        throw `Invalid refraction option: ${refraction}`;
    }
    return refr;
}
exports.Refraction = Refraction;
/**
 * @brief Calculates the inverse of an atmospheric refraction angle.
 *
 * Given an observed altitude angle that includes atmospheric refraction,
 * calculates the negative angular correction to obtain the unrefracted
 * altitude. This is useful for cases where observed horizontal
 * coordinates are to be converted to another orientation system,
 * but refraction first must be removed from the observed position.
 *
 * @param {string} refraction
 *      `"normal"`: correct altitude for atmospheric refraction (recommended).
 *      `"jplhor"`: for JPL Horizons compatibility testing only; not recommended for normal use.
 *      `null`: no atmospheric refraction correction is performed.
 *
 * @param {number} bent_altitude
 *      The apparent altitude that includes atmospheric refraction.
 *
 * @returns {number}
 *      The angular adjustment in degrees to be added to the
 *      altitude angle to correct for atmospheric lensing.
 *      This will be less than or equal to zero.
 */
function InverseRefraction(refraction, bent_altitude) {
    if (bent_altitude < -90.0 || bent_altitude > +90.0)
        return 0.0; /* no attempt to correct an invalid altitude */
    /* Find the pre-adjusted altitude whose refraction correction leads to 'altitude'. */
    let altitude = bent_altitude - Refraction(refraction, bent_altitude);
    for (;;) {
        /* See how close we got. */
        let diff = (altitude + Refraction(refraction, altitude)) - bent_altitude;
        if (Math.abs(diff) < 1.0e-14)
            return altitude - bent_altitude;
        altitude -= diff;
    }
}
exports.InverseRefraction = InverseRefraction;
/**
 * @brief Applies a rotation to a vector, yielding a rotated vector.
 *
 * This function transforms a vector in one orientation to a vector
 * in another orientation.
 *
 * @param {RotationMatrix} rotation
 *      A rotation matrix that specifies how the orientation of the vector is to be changed.
 *
 * @param {Vector} vector
 *      The vector whose orientation is to be changed.
 *
 * @returns {Vector}
 *      A vector in the orientation specified by `rotation`.
 */
function RotateVector(rotation, vector) {
    return new Vector(rotation.rot[0][0] * vector.x + rotation.rot[1][0] * vector.y + rotation.rot[2][0] * vector.z, rotation.rot[0][1] * vector.x + rotation.rot[1][1] * vector.y + rotation.rot[2][1] * vector.z, rotation.rot[0][2] * vector.x + rotation.rot[1][2] * vector.y + rotation.rot[2][2] * vector.z, vector.t);
}
exports.RotateVector = RotateVector;
/**
 * @brief Applies a rotation to a state vector, yielding a rotated vector.
 *
 * This function transforms a state vector in one orientation to a vector
 * in another orientation.
 *
 * @param {RotationMatrix} rotation
 *      A rotation matrix that specifies how the orientation of the state vector is to be changed.
 *
 * @param {StateVector} state
 *      The state vector whose orientation is to be changed.
 *      Both the position and velocity components are transformed.
 *
 * @return {StateVector}
 *      A state vector in the orientation specified by `rotation`.
 */
function RotateState(rotation, state) {
    return new StateVector(rotation.rot[0][0] * state.x + rotation.rot[1][0] * state.y + rotation.rot[2][0] * state.z, rotation.rot[0][1] * state.x + rotation.rot[1][1] * state.y + rotation.rot[2][1] * state.z, rotation.rot[0][2] * state.x + rotation.rot[1][2] * state.y + rotation.rot[2][2] * state.z, rotation.rot[0][0] * state.vx + rotation.rot[1][0] * state.vy + rotation.rot[2][0] * state.vz, rotation.rot[0][1] * state.vx + rotation.rot[1][1] * state.vy + rotation.rot[2][1] * state.vz, rotation.rot[0][2] * state.vx + rotation.rot[1][2] * state.vy + rotation.rot[2][2] * state.vz, state.t);
}
exports.RotateState = RotateState;
/**
 * @brief Calculates a rotation matrix from J2000 mean equator (EQJ) to J2000 mean ecliptic (ECL).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQJ = equatorial system, using equator at J2000 epoch.
 * Target: ECL = ecliptic system, using equator at J2000 epoch.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQJ to ECL.
 */
function Rotation_EQJ_ECL() {
    /* ob = mean obliquity of the J2000 ecliptic = 0.40909260059599012 radians. */
    const c = 0.9174821430670688; /* cos(ob) */
    const s = 0.3977769691083922; /* sin(ob) */
    return new RotationMatrix([
        [1, 0, 0],
        [0, +c, -s],
        [0, +s, +c]
    ]);
}
exports.Rotation_EQJ_ECL = Rotation_EQJ_ECL;
/**
 * @brief Calculates a rotation matrix from J2000 mean ecliptic (ECL) to J2000 mean equator (EQJ).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: ECL = ecliptic system, using equator at J2000 epoch.
 * Target: EQJ = equatorial system, using equator at J2000 epoch.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts ECL to EQJ.
 */
function Rotation_ECL_EQJ() {
    /* ob = mean obliquity of the J2000 ecliptic = 0.40909260059599012 radians. */
    const c = 0.9174821430670688; /* cos(ob) */
    const s = 0.3977769691083922; /* sin(ob) */
    return new RotationMatrix([
        [1, 0, 0],
        [0, +c, +s],
        [0, -s, +c]
    ]);
}
exports.Rotation_ECL_EQJ = Rotation_ECL_EQJ;
/**
 * @brief Calculates a rotation matrix from J2000 mean equator (EQJ) to equatorial of-date (EQD).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQJ = equatorial system, using equator at J2000 epoch.
 * Target: EQD = equatorial system, using equator of the specified date/time.
 *
 * @param {FlexibleDateTime} time
 *      The date and time at which the Earth's equator defines the target orientation.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQJ to EQD at `time`.
 */
function Rotation_EQJ_EQD(time) {
    time = MakeTime(time);
    const prec = precession_rot(time, PrecessDirection.From2000);
    const nut = nutation_rot(time, PrecessDirection.From2000);
    return CombineRotation(prec, nut);
}
exports.Rotation_EQJ_EQD = Rotation_EQJ_EQD;
/**
 * @brief Calculates a rotation matrix from J2000 mean equator (EQJ) to true ecliptic of date (ECT).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQJ = equatorial system, using equator at J2000 epoch.
 * Target: ECT = ecliptic system, using true equinox of the specified date/time.
 *
 * @param {FlexibleDateTime} time
 *      The date and time at which the Earth's equator defines the target orientation.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQJ to ECT at `time`.
 */
function Rotation_EQJ_ECT(time) {
    const t = MakeTime(time);
    const rot = Rotation_EQJ_EQD(t);
    const step = Rotation_EQD_ECT(t);
    return CombineRotation(rot, step);
}
exports.Rotation_EQJ_ECT = Rotation_EQJ_ECT;
/**
 * @brief Calculates a rotation matrix from true ecliptic of date (ECT) to J2000 mean equator (EQJ).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: ECT = ecliptic system, using true equinox of the specified date/time.
 * Target: EQJ = equatorial system, using equator at J2000 epoch.
 *
 * @param {FlexibleDateTime} time
 *      The date and time at which the Earth's equator defines the target orientation.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts ECT to EQJ at `time`.
 */
function Rotation_ECT_EQJ(time) {
    const t = MakeTime(time);
    const rot = Rotation_ECT_EQD(t);
    const step = Rotation_EQD_EQJ(t);
    return CombineRotation(rot, step);
}
exports.Rotation_ECT_EQJ = Rotation_ECT_EQJ;
/**
 * @brief Calculates a rotation matrix from equatorial of-date (EQD) to J2000 mean equator (EQJ).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQD = equatorial system, using equator of the specified date/time.
 * Target: EQJ = equatorial system, using equator at J2000 epoch.
 *
 * @param {FlexibleDateTime} time
 *      The date and time at which the Earth's equator defines the source orientation.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQD at `time` to EQJ.
 */
function Rotation_EQD_EQJ(time) {
    time = MakeTime(time);
    const nut = nutation_rot(time, PrecessDirection.Into2000);
    const prec = precession_rot(time, PrecessDirection.Into2000);
    return CombineRotation(nut, prec);
}
exports.Rotation_EQD_EQJ = Rotation_EQD_EQJ;
/**
 * @brief Calculates a rotation matrix from equatorial of-date (EQD) to horizontal (HOR).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQD = equatorial system, using equator of the specified date/time.
 * Target: HOR = horizontal system.
 *
 * Use `HorizonFromVector` to convert the return value
 * to a traditional altitude/azimuth pair.
 *
 * @param {FlexibleDateTime} time
 *      The date and time at which the Earth's equator applies.
 *
 * @param {Observer} observer
 *      A location near the Earth's mean sea level that defines the observer's horizon.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQD to HOR at `time` and for `observer`.
 *      The components of the horizontal vector are:
 *      x = north, y = west, z = zenith (straight up from the observer).
 *      These components are chosen so that the "right-hand rule" works for the vector
 *      and so that north represents the direction where azimuth = 0.
 */
function Rotation_EQD_HOR(time, observer) {
    time = MakeTime(time);
    const sinlat = Math.sin(observer.latitude * exports.DEG2RAD);
    const coslat = Math.cos(observer.latitude * exports.DEG2RAD);
    const sinlon = Math.sin(observer.longitude * exports.DEG2RAD);
    const coslon = Math.cos(observer.longitude * exports.DEG2RAD);
    const uze = [coslat * coslon, coslat * sinlon, sinlat];
    const une = [-sinlat * coslon, -sinlat * sinlon, coslat];
    const uwe = [sinlon, -coslon, 0];
    const spin_angle = -15 * sidereal_time(time);
    const uz = spin(spin_angle, uze);
    const un = spin(spin_angle, une);
    const uw = spin(spin_angle, uwe);
    return new RotationMatrix([
        [un[0], uw[0], uz[0]],
        [un[1], uw[1], uz[1]],
        [un[2], uw[2], uz[2]],
    ]);
}
exports.Rotation_EQD_HOR = Rotation_EQD_HOR;
/**
 * @brief Calculates a rotation matrix from horizontal (HOR) to equatorial of-date (EQD).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: HOR = horizontal system (x=North, y=West, z=Zenith).
 * Target: EQD = equatorial system, using equator of the specified date/time.
 *
 * @param {FlexibleDateTime} time
 *      The date and time at which the Earth's equator applies.
 *
 * @param {Observer} observer
 *      A location near the Earth's mean sea level that defines the observer's horizon.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts HOR to EQD at `time` and for `observer`.
 */
function Rotation_HOR_EQD(time, observer) {
    const rot = Rotation_EQD_HOR(time, observer);
    return InverseRotation(rot);
}
exports.Rotation_HOR_EQD = Rotation_HOR_EQD;
/**
 * @brief Calculates a rotation matrix from horizontal (HOR) to J2000 equatorial (EQJ).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: HOR = horizontal system (x=North, y=West, z=Zenith).
 * Target: EQJ = equatorial system, using equator at the J2000 epoch.
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the observation.
 *
 * @param {Observer} observer
 *      A location near the Earth's mean sea level that defines the observer's horizon.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts HOR to EQJ at `time` and for `observer`.
 */
function Rotation_HOR_EQJ(time, observer) {
    time = MakeTime(time);
    const hor_eqd = Rotation_HOR_EQD(time, observer);
    const eqd_eqj = Rotation_EQD_EQJ(time);
    return CombineRotation(hor_eqd, eqd_eqj);
}
exports.Rotation_HOR_EQJ = Rotation_HOR_EQJ;
/**
 * @brief Calculates a rotation matrix from J2000 mean equator (EQJ) to horizontal (HOR).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQJ = equatorial system, using the equator at the J2000 epoch.
 * Target: HOR = horizontal system.
 *
 * Use {@link HorizonFromVector} to convert the return value
 * to a traditional altitude/azimuth pair.
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the desired horizontal orientation.
 *
 * @param {Observer} observer
 *      A location near the Earth's mean sea level that defines the observer's horizon.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQJ to HOR at `time` and for `observer`.
 *      The components of the horizontal vector are:
 *      x = north, y = west, z = zenith (straight up from the observer).
 *      These components are chosen so that the "right-hand rule" works for the vector
 *      and so that north represents the direction where azimuth = 0.
 */
function Rotation_EQJ_HOR(time, observer) {
    const rot = Rotation_HOR_EQJ(time, observer);
    return InverseRotation(rot);
}
exports.Rotation_EQJ_HOR = Rotation_EQJ_HOR;
/**
 * @brief Calculates a rotation matrix from equatorial of-date (EQD) to J2000 mean ecliptic (ECL).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQD = equatorial system, using equator of date.
 * Target: ECL = ecliptic system, using equator at J2000 epoch.
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the source equator.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQD to ECL.
 */
function Rotation_EQD_ECL(time) {
    const eqd_eqj = Rotation_EQD_EQJ(time);
    const eqj_ecl = Rotation_EQJ_ECL();
    return CombineRotation(eqd_eqj, eqj_ecl);
}
exports.Rotation_EQD_ECL = Rotation_EQD_ECL;
/**
 * @brief Calculates a rotation matrix from J2000 mean ecliptic (ECL) to equatorial of-date (EQD).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: ECL = ecliptic system, using equator at J2000 epoch.
 * Target: EQD = equatorial system, using equator of date.
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the desired equator.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts ECL to EQD.
 */
function Rotation_ECL_EQD(time) {
    const rot = Rotation_EQD_ECL(time);
    return InverseRotation(rot);
}
exports.Rotation_ECL_EQD = Rotation_ECL_EQD;
/**
 * @brief Calculates a rotation matrix from J2000 mean ecliptic (ECL) to horizontal (HOR).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: ECL = ecliptic system, using equator at J2000 epoch.
 * Target: HOR = horizontal system.
 *
 * Use {@link HorizonFromVector} to convert the return value
 * to a traditional altitude/azimuth pair.
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the desired horizontal orientation.
 *
 * @param {Observer} observer
 *      A location near the Earth's mean sea level that defines the observer's horizon.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts ECL to HOR at `time` and for `observer`.
 *      The components of the horizontal vector are:
 *      x = north, y = west, z = zenith (straight up from the observer).
 *      These components are chosen so that the "right-hand rule" works for the vector
 *      and so that north represents the direction where azimuth = 0.
 */
function Rotation_ECL_HOR(time, observer) {
    time = MakeTime(time);
    const ecl_eqd = Rotation_ECL_EQD(time);
    const eqd_hor = Rotation_EQD_HOR(time, observer);
    return CombineRotation(ecl_eqd, eqd_hor);
}
exports.Rotation_ECL_HOR = Rotation_ECL_HOR;
/**
 * @brief Calculates a rotation matrix from horizontal (HOR) to J2000 mean ecliptic (ECL).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: HOR = horizontal system.
 * Target: ECL = ecliptic system, using equator at J2000 epoch.
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the horizontal observation.
 *
 * @param {Observer} observer
 *      The location of the horizontal observer.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts HOR to ECL.
 */
function Rotation_HOR_ECL(time, observer) {
    const rot = Rotation_ECL_HOR(time, observer);
    return InverseRotation(rot);
}
exports.Rotation_HOR_ECL = Rotation_HOR_ECL;
/**
 * @brief Calculates a rotation matrix from J2000 mean equator (EQJ) to galactic (GAL).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQJ = equatorial system, using the equator at the J2000 epoch.
 * Target: GAL = galactic system (IAU 1958 definition).
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQJ to GAL.
 */
function Rotation_EQJ_GAL() {
    // This rotation matrix was calculated by the following script
    // in this same source code repository:
    // demo/python/galeqj_matrix.py
    return new RotationMatrix([
        [-0.0548624779711344, +0.4941095946388765, -0.8676668813529025],
        [-0.8734572784246782, -0.4447938112296831, -0.1980677870294097],
        [-0.4838000529948520, +0.7470034631630423, +0.4559861124470794]
    ]);
}
exports.Rotation_EQJ_GAL = Rotation_EQJ_GAL;
/**
 * @brief Calculates a rotation matrix from galactic (GAL) to J2000 mean equator (EQJ).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: GAL = galactic system (IAU 1958 definition).
 * Target: EQJ = equatorial system, using the equator at the J2000 epoch.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts GAL to EQJ.
 */
function Rotation_GAL_EQJ() {
    // This rotation matrix was calculated by the following script
    // in this same source code repository:
    // demo/python/galeqj_matrix.py
    return new RotationMatrix([
        [-0.0548624779711344, -0.8734572784246782, -0.4838000529948520],
        [+0.4941095946388765, -0.4447938112296831, +0.7470034631630423],
        [-0.8676668813529025, -0.1980677870294097, +0.4559861124470794]
    ]);
}
exports.Rotation_GAL_EQJ = Rotation_GAL_EQJ;
/**
 * @brief Calculates a rotation matrix from true ecliptic of date (ECT) to equator of date (EQD).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: ECT = true ecliptic of date
 * Target: EQD = equator of date
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the ecliptic/equator conversion.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts ECT to EQD.
 */
function Rotation_ECT_EQD(time) {
    const et = e_tilt(MakeTime(time));
    const tobl = et.tobl * exports.DEG2RAD;
    const c = Math.cos(tobl);
    const s = Math.sin(tobl);
    return new RotationMatrix([
        [1.0, 0.0, 0.0],
        [0.0, +c, +s],
        [0.0, -s, +c]
    ]);
}
exports.Rotation_ECT_EQD = Rotation_ECT_EQD;
/**
 * @brief Calculates a rotation matrix from equator of date (EQD) to true ecliptic of date (ECT).
 *
 * This is one of the family of functions that returns a rotation matrix
 * for converting from one orientation to another.
 * Source: EQD = equator of date
 * Target: ECT = true ecliptic of date
 *
 * @param {FlexibleDateTime} time
 *      The date and time of the equator/ecliptic conversion.
 *
 * @returns {RotationMatrix}
 *      A rotation matrix that converts EQD to ECT.
 */
function Rotation_EQD_ECT(time) {
    const et = e_tilt(MakeTime(time));
    const tobl = et.tobl * exports.DEG2RAD;
    const c = Math.cos(tobl);
    const s = Math.sin(tobl);
    return new RotationMatrix([
        [1.0, 0.0, 0.0],
        [0.0, +c, -s],
        [0.0, +s, +c]
    ]);
}
exports.Rotation_EQD_ECT = Rotation_EQD_ECT;
const ConstelNames = [
    ['And', 'Andromeda'] //  0
    ,
    ['Ant', 'Antila'] //  1
    ,
    ['Aps', 'Apus'] //  2
    ,
    ['Aql', 'Aquila'] //  3
    ,
    ['Aqr', 'Aquarius'] //  4
    ,
    ['Ara', 'Ara'] //  5
    ,
    ['Ari', 'Aries'] //  6
    ,
    ['Aur', 'Auriga'] //  7
    ,
    ['Boo', 'Bootes'] //  8
    ,
    ['Cae', 'Caelum'] //  9
    ,
    ['Cam', 'Camelopardis'] // 10
    ,
    ['Cap', 'Capricornus'] // 11
    ,
    ['Car', 'Carina'] // 12
    ,
    ['Cas', 'Cassiopeia'] // 13
    ,
    ['Cen', 'Centaurus'] // 14
    ,
    ['Cep', 'Cepheus'] // 15
    ,
    ['Cet', 'Cetus'] // 16
    ,
    ['Cha', 'Chamaeleon'] // 17
    ,
    ['Cir', 'Circinus'] // 18
    ,
    ['CMa', 'Canis Major'] // 19
    ,
    ['CMi', 'Canis Minor'] // 20
    ,
    ['Cnc', 'Cancer'] // 21
    ,
    ['Col', 'Columba'] // 22
    ,
    ['Com', 'Coma Berenices'] // 23
    ,
    ['CrA', 'Corona Australis'] // 24
    ,
    ['CrB', 'Corona Borealis'] // 25
    ,
    ['Crt', 'Crater'] // 26
    ,
    ['Cru', 'Crux'] // 27
    ,
    ['Crv', 'Corvus'] // 28
    ,
    ['CVn', 'Canes Venatici'] // 29
    ,
    ['Cyg', 'Cygnus'] // 30
    ,
    ['Del', 'Delphinus'] // 31
    ,
    ['Dor', 'Dorado'] // 32
    ,
    ['Dra', 'Draco'] // 33
    ,
    ['Equ', 'Equuleus'] // 34
    ,
    ['Eri', 'Eridanus'] // 35
    ,
    ['For', 'Fornax'] // 36
    ,
    ['Gem', 'Gemini'] // 37
    ,
    ['Gru', 'Grus'] // 38
    ,
    ['Her', 'Hercules'] // 39
    ,
    ['Hor', 'Horologium'] // 40
    ,
    ['Hya', 'Hydra'] // 41
    ,
    ['Hyi', 'Hydrus'] // 42
    ,
    ['Ind', 'Indus'] // 43
    ,
    ['Lac', 'Lacerta'] // 44
    ,
    ['Leo', 'Leo'] // 45
    ,
    ['Lep', 'Lepus'] // 46
    ,
    ['Lib', 'Libra'] // 47
    ,
    ['LMi', 'Leo Minor'] // 48
    ,
    ['Lup', 'Lupus'] // 49
    ,
    ['Lyn', 'Lynx'] // 50
    ,
    ['Lyr', 'Lyra'] // 51
    ,
    ['Men', 'Mensa'] // 52
    ,
    ['Mic', 'Microscopium'] // 53
    ,
    ['Mon', 'Monoceros'] // 54
    ,
    ['Mus', 'Musca'] // 55
    ,
    ['Nor', 'Norma'] // 56
    ,
    ['Oct', 'Octans'] // 57
    ,
    ['Oph', 'Ophiuchus'] // 58
    ,
    ['Ori', 'Orion'] // 59
    ,
    ['Pav', 'Pavo'] // 60
    ,
    ['Peg', 'Pegasus'] // 61
    ,
    ['Per', 'Perseus'] // 62
    ,
    ['Phe', 'Phoenix'] // 63
    ,
    ['Pic', 'Pictor'] // 64
    ,
    ['PsA', 'Pisces Austrinus'] // 65
    ,
    ['Psc', 'Pisces'] // 66
    ,
    ['Pup', 'Puppis'] // 67
    ,
    ['Pyx', 'Pyxis'] // 68
    ,
    ['Ret', 'Reticulum'] // 69
    ,
    ['Scl', 'Sculptor'] // 70
    ,
    ['Sco', 'Scorpius'] // 71
    ,
    ['Sct', 'Scutum'] // 72
    ,
    ['Ser', 'Serpens'] // 73
    ,
    ['Sex', 'Sextans'] // 74
    ,
    ['Sge', 'Sagitta'] // 75
    ,
    ['Sgr', 'Sagittarius'] // 76
    ,
    ['Tau', 'Taurus'] // 77
    ,
    ['Tel', 'Telescopium'] // 78
    ,
    ['TrA', 'Triangulum Australe'] // 79
    ,
    ['Tri', 'Triangulum'] // 80
    ,
    ['Tuc', 'Tucana'] // 81
    ,
    ['UMa', 'Ursa Major'] // 82
    ,
    ['UMi', 'Ursa Minor'] // 83
    ,
    ['Vel', 'Vela'] // 84
    ,
    ['Vir', 'Virgo'] // 85
    ,
    ['Vol', 'Volans'] // 86
    ,
    ['Vul', 'Vulpecula'] // 87
];
const ConstelBounds = [
    [83, 0, 8640, 2112] // UMi
    ,
    [83, 2880, 5220, 2076] // UMi
    ,
    [83, 7560, 8280, 2068] // UMi
    ,
    [83, 6480, 7560, 2064] // UMi
    ,
    [15, 0, 2880, 2040] // Cep
    ,
    [10, 3300, 3840, 1968] // Cam
    ,
    [15, 0, 1800, 1920] // Cep
    ,
    [10, 3840, 5220, 1920] // Cam
    ,
    [83, 6300, 6480, 1920] // UMi
    ,
    [33, 7260, 7560, 1920] // Dra
    ,
    [15, 0, 1263, 1848] // Cep
    ,
    [10, 4140, 4890, 1848] // Cam
    ,
    [83, 5952, 6300, 1800] // UMi
    ,
    [15, 7260, 7440, 1800] // Cep
    ,
    [10, 2868, 3300, 1764] // Cam
    ,
    [33, 3300, 4080, 1764] // Dra
    ,
    [83, 4680, 5952, 1680] // UMi
    ,
    [13, 1116, 1230, 1632] // Cas
    ,
    [33, 7350, 7440, 1608] // Dra
    ,
    [33, 4080, 4320, 1596] // Dra
    ,
    [15, 0, 120, 1584] // Cep
    ,
    [83, 5040, 5640, 1584] // UMi
    ,
    [15, 8490, 8640, 1584] // Cep
    ,
    [33, 4320, 4860, 1536] // Dra
    ,
    [33, 4860, 5190, 1512] // Dra
    ,
    [15, 8340, 8490, 1512] // Cep
    ,
    [10, 2196, 2520, 1488] // Cam
    ,
    [33, 7200, 7350, 1476] // Dra
    ,
    [15, 7393.2, 7416, 1462] // Cep
    ,
    [10, 2520, 2868, 1440] // Cam
    ,
    [82, 2868, 3030, 1440] // UMa
    ,
    [33, 7116, 7200, 1428] // Dra
    ,
    [15, 7200, 7393.2, 1428] // Cep
    ,
    [15, 8232, 8340, 1418] // Cep
    ,
    [13, 0, 876, 1404] // Cas
    ,
    [33, 6990, 7116, 1392] // Dra
    ,
    [13, 612, 687, 1380] // Cas
    ,
    [13, 876, 1116, 1368] // Cas
    ,
    [10, 1116, 1140, 1368] // Cam
    ,
    [15, 8034, 8232, 1350] // Cep
    ,
    [10, 1800, 2196, 1344] // Cam
    ,
    [82, 5052, 5190, 1332] // UMa
    ,
    [33, 5190, 6990, 1332] // Dra
    ,
    [10, 1140, 1200, 1320] // Cam
    ,
    [15, 7968, 8034, 1320] // Cep
    ,
    [15, 7416, 7908, 1316] // Cep
    ,
    [13, 0, 612, 1296] // Cas
    ,
    [50, 2196, 2340, 1296] // Lyn
    ,
    [82, 4350, 4860, 1272] // UMa
    ,
    [33, 5490, 5670, 1272] // Dra
    ,
    [15, 7908, 7968, 1266] // Cep
    ,
    [10, 1200, 1800, 1260] // Cam
    ,
    [13, 8232, 8400, 1260] // Cas
    ,
    [33, 5670, 6120, 1236] // Dra
    ,
    [62, 735, 906, 1212] // Per
    ,
    [33, 6120, 6564, 1212] // Dra
    ,
    [13, 0, 492, 1200] // Cas
    ,
    [62, 492, 600, 1200] // Per
    ,
    [50, 2340, 2448, 1200] // Lyn
    ,
    [13, 8400, 8640, 1200] // Cas
    ,
    [82, 4860, 5052, 1164] // UMa
    ,
    [13, 0, 402, 1152] // Cas
    ,
    [13, 8490, 8640, 1152] // Cas
    ,
    [39, 6543, 6564, 1140] // Her
    ,
    [33, 6564, 6870, 1140] // Dra
    ,
    [30, 6870, 6900, 1140] // Cyg
    ,
    [62, 600, 735, 1128] // Per
    ,
    [82, 3030, 3300, 1128] // UMa
    ,
    [13, 60, 312, 1104] // Cas
    ,
    [82, 4320, 4350, 1080] // UMa
    ,
    [50, 2448, 2652, 1068] // Lyn
    ,
    [30, 7887, 7908, 1056] // Cyg
    ,
    [30, 7875, 7887, 1050] // Cyg
    ,
    [30, 6900, 6984, 1044] // Cyg
    ,
    [82, 3300, 3660, 1008] // UMa
    ,
    [82, 3660, 3882, 960] // UMa
    ,
    [8, 5556, 5670, 960] // Boo
    ,
    [39, 5670, 5880, 960] // Her
    ,
    [50, 3330, 3450, 954] // Lyn
    ,
    [0, 0, 906, 882] // And
    ,
    [62, 906, 924, 882] // Per
    ,
    [51, 6969, 6984, 876] // Lyr
    ,
    [62, 1620, 1689, 864] // Per
    ,
    [30, 7824, 7875, 864] // Cyg
    ,
    [44, 7875, 7920, 864] // Lac
    ,
    [7, 2352, 2652, 852] // Aur
    ,
    [50, 2652, 2790, 852] // Lyn
    ,
    [0, 0, 720, 840] // And
    ,
    [44, 7920, 8214, 840] // Lac
    ,
    [44, 8214, 8232, 828] // Lac
    ,
    [0, 8232, 8460, 828] // And
    ,
    [62, 924, 978, 816] // Per
    ,
    [82, 3882, 3960, 816] // UMa
    ,
    [29, 4320, 4440, 816] // CVn
    ,
    [50, 2790, 3330, 804] // Lyn
    ,
    [48, 3330, 3558, 804] // LMi
    ,
    [0, 258, 507, 792] // And
    ,
    [8, 5466, 5556, 792] // Boo
    ,
    [0, 8460, 8550, 770] // And
    ,
    [29, 4440, 4770, 768] // CVn
    ,
    [0, 8550, 8640, 752] // And
    ,
    [29, 5025, 5052, 738] // CVn
    ,
    [80, 870, 978, 736] // Tri
    ,
    [62, 978, 1620, 736] // Per
    ,
    [7, 1620, 1710, 720] // Aur
    ,
    [51, 6543, 6969, 720] // Lyr
    ,
    [82, 3960, 4320, 696] // UMa
    ,
    [30, 7080, 7530, 696] // Cyg
    ,
    [7, 1710, 2118, 684] // Aur
    ,
    [48, 3558, 3780, 684] // LMi
    ,
    [29, 4770, 5025, 684] // CVn
    ,
    [0, 0, 24, 672] // And
    ,
    [80, 507, 600, 672] // Tri
    ,
    [7, 2118, 2352, 672] // Aur
    ,
    [37, 2838, 2880, 672] // Gem
    ,
    [30, 7530, 7824, 672] // Cyg
    ,
    [30, 6933, 7080, 660] // Cyg
    ,
    [80, 690, 870, 654] // Tri
    ,
    [25, 5820, 5880, 648] // CrB
    ,
    [8, 5430, 5466, 624] // Boo
    ,
    [25, 5466, 5820, 624] // CrB
    ,
    [51, 6612, 6792, 624] // Lyr
    ,
    [48, 3870, 3960, 612] // LMi
    ,
    [51, 6792, 6933, 612] // Lyr
    ,
    [80, 600, 690, 600] // Tri
    ,
    [66, 258, 306, 570] // Psc
    ,
    [48, 3780, 3870, 564] // LMi
    ,
    [87, 7650, 7710, 564] // Vul
    ,
    [77, 2052, 2118, 548] // Tau
    ,
    [0, 24, 51, 528] // And
    ,
    [73, 5730, 5772, 528] // Ser
    ,
    [37, 2118, 2238, 516] // Gem
    ,
    [87, 7140, 7290, 510] // Vul
    ,
    [87, 6792, 6930, 506] // Vul
    ,
    [0, 51, 306, 504] // And
    ,
    [87, 7290, 7404, 492] // Vul
    ,
    [37, 2811, 2838, 480] // Gem
    ,
    [87, 7404, 7650, 468] // Vul
    ,
    [87, 6930, 7140, 460] // Vul
    ,
    [6, 1182, 1212, 456] // Ari
    ,
    [75, 6792, 6840, 444] // Sge
    ,
    [59, 2052, 2076, 432] // Ori
    ,
    [37, 2238, 2271, 420] // Gem
    ,
    [75, 6840, 7140, 388] // Sge
    ,
    [77, 1788, 1920, 384] // Tau
    ,
    [39, 5730, 5790, 384] // Her
    ,
    [75, 7140, 7290, 378] // Sge
    ,
    [77, 1662, 1788, 372] // Tau
    ,
    [77, 1920, 2016, 372] // Tau
    ,
    [23, 4620, 4860, 360] // Com
    ,
    [39, 6210, 6570, 344] // Her
    ,
    [23, 4272, 4620, 336] // Com
    ,
    [37, 2700, 2811, 324] // Gem
    ,
    [39, 6030, 6210, 308] // Her
    ,
    [61, 0, 51, 300] // Peg
    ,
    [77, 2016, 2076, 300] // Tau
    ,
    [37, 2520, 2700, 300] // Gem
    ,
    [61, 7602, 7680, 300] // Peg
    ,
    [37, 2271, 2496, 288] // Gem
    ,
    [39, 6570, 6792, 288] // Her
    ,
    [31, 7515, 7578, 284] // Del
    ,
    [61, 7578, 7602, 284] // Peg
    ,
    [45, 4146, 4272, 264] // Leo
    ,
    [59, 2247, 2271, 240] // Ori
    ,
    [37, 2496, 2520, 240] // Gem
    ,
    [21, 2811, 2853, 240] // Cnc
    ,
    [61, 8580, 8640, 240] // Peg
    ,
    [6, 600, 1182, 238] // Ari
    ,
    [31, 7251, 7308, 204] // Del
    ,
    [8, 4860, 5430, 192] // Boo
    ,
    [61, 8190, 8580, 180] // Peg
    ,
    [21, 2853, 3330, 168] // Cnc
    ,
    [45, 3330, 3870, 168] // Leo
    ,
    [58, 6570, 6718.4, 150] // Oph
    ,
    [3, 6718.4, 6792, 150] // Aql
    ,
    [31, 7500, 7515, 144] // Del
    ,
    [20, 2520, 2526, 132] // CMi
    ,
    [73, 6570, 6633, 108] // Ser
    ,
    [39, 5790, 6030, 96] // Her
    ,
    [58, 6570, 6633, 72] // Oph
    ,
    [61, 7728, 7800, 66] // Peg
    ,
    [66, 0, 720, 48] // Psc
    ,
    [73, 6690, 6792, 48] // Ser
    ,
    [31, 7308, 7500, 48] // Del
    ,
    [34, 7500, 7680, 48] // Equ
    ,
    [61, 7680, 7728, 48] // Peg
    ,
    [61, 7920, 8190, 48] // Peg
    ,
    [61, 7800, 7920, 42] // Peg
    ,
    [20, 2526, 2592, 36] // CMi
    ,
    [77, 1290, 1662, 0] // Tau
    ,
    [59, 1662, 1680, 0] // Ori
    ,
    [20, 2592, 2910, 0] // CMi
    ,
    [85, 5280, 5430, 0] // Vir
    ,
    [58, 6420, 6570, 0] // Oph
    ,
    [16, 954, 1182, -42] // Cet
    ,
    [77, 1182, 1290, -42] // Tau
    ,
    [73, 5430, 5856, -78] // Ser
    ,
    [59, 1680, 1830, -96] // Ori
    ,
    [59, 2100, 2247, -96] // Ori
    ,
    [73, 6420, 6468, -96] // Ser
    ,
    [73, 6570, 6690, -96] // Ser
    ,
    [3, 6690, 6792, -96] // Aql
    ,
    [66, 8190, 8580, -96] // Psc
    ,
    [45, 3870, 4146, -144] // Leo
    ,
    [85, 4146, 4260, -144] // Vir
    ,
    [66, 0, 120, -168] // Psc
    ,
    [66, 8580, 8640, -168] // Psc
    ,
    [85, 5130, 5280, -192] // Vir
    ,
    [58, 5730, 5856, -192] // Oph
    ,
    [3, 7200, 7392, -216] // Aql
    ,
    [4, 7680, 7872, -216] // Aqr
    ,
    [58, 6180, 6468, -240] // Oph
    ,
    [54, 2100, 2910, -264] // Mon
    ,
    [35, 1770, 1830, -264] // Eri
    ,
    [59, 1830, 2100, -264] // Ori
    ,
    [41, 2910, 3012, -264] // Hya
    ,
    [74, 3450, 3870, -264] // Sex
    ,
    [85, 4260, 4620, -264] // Vir
    ,
    [58, 6330, 6360, -280] // Oph
    ,
    [3, 6792, 7200, -288.8] // Aql
    ,
    [35, 1740, 1770, -348] // Eri
    ,
    [4, 7392, 7680, -360] // Aqr
    ,
    [73, 6180, 6570, -384] // Ser
    ,
    [72, 6570, 6792, -384] // Sct
    ,
    [41, 3012, 3090, -408] // Hya
    ,
    [58, 5856, 5895, -438] // Oph
    ,
    [41, 3090, 3270, -456] // Hya
    ,
    [26, 3870, 3900, -456] // Crt
    ,
    [71, 5856, 5895, -462] // Sco
    ,
    [47, 5640, 5730, -480] // Lib
    ,
    [28, 4530, 4620, -528] // Crv
    ,
    [85, 4620, 5130, -528] // Vir
    ,
    [41, 3270, 3510, -576] // Hya
    ,
    [16, 600, 954, -585.2] // Cet
    ,
    [35, 954, 1350, -585.2] // Eri
    ,
    [26, 3900, 4260, -588] // Crt
    ,
    [28, 4260, 4530, -588] // Crv
    ,
    [47, 5130, 5370, -588] // Lib
    ,
    [58, 5856, 6030, -590] // Oph
    ,
    [16, 0, 600, -612] // Cet
    ,
    [11, 7680, 7872, -612] // Cap
    ,
    [4, 7872, 8580, -612] // Aqr
    ,
    [16, 8580, 8640, -612] // Cet
    ,
    [41, 3510, 3690, -636] // Hya
    ,
    [35, 1692, 1740, -654] // Eri
    ,
    [46, 1740, 2202, -654] // Lep
    ,
    [11, 7200, 7680, -672] // Cap
    ,
    [41, 3690, 3810, -700] // Hya
    ,
    [41, 4530, 5370, -708] // Hya
    ,
    [47, 5370, 5640, -708] // Lib
    ,
    [71, 5640, 5760, -708] // Sco
    ,
    [35, 1650, 1692, -720] // Eri
    ,
    [58, 6030, 6336, -720] // Oph
    ,
    [76, 6336, 6420, -720] // Sgr
    ,
    [41, 3810, 3900, -748] // Hya
    ,
    [19, 2202, 2652, -792] // CMa
    ,
    [41, 4410, 4530, -792] // Hya
    ,
    [41, 3900, 4410, -840] // Hya
    ,
    [36, 1260, 1350, -864] // For
    ,
    [68, 3012, 3372, -882] // Pyx
    ,
    [35, 1536, 1650, -888] // Eri
    ,
    [76, 6420, 6900, -888] // Sgr
    ,
    [65, 7680, 8280, -888] // PsA
    ,
    [70, 8280, 8400, -888] // Scl
    ,
    [36, 1080, 1260, -950] // For
    ,
    [1, 3372, 3960, -954] // Ant
    ,
    [70, 0, 600, -960] // Scl
    ,
    [36, 600, 1080, -960] // For
    ,
    [35, 1392, 1536, -960] // Eri
    ,
    [70, 8400, 8640, -960] // Scl
    ,
    [14, 5100, 5370, -1008] // Cen
    ,
    [49, 5640, 5760, -1008] // Lup
    ,
    [71, 5760, 5911.5, -1008] // Sco
    ,
    [9, 1740, 1800, -1032] // Cae
    ,
    [22, 1800, 2370, -1032] // Col
    ,
    [67, 2880, 3012, -1032] // Pup
    ,
    [35, 1230, 1392, -1056] // Eri
    ,
    [71, 5911.5, 6420, -1092] // Sco
    ,
    [24, 6420, 6900, -1092] // CrA
    ,
    [76, 6900, 7320, -1092] // Sgr
    ,
    [53, 7320, 7680, -1092] // Mic
    ,
    [35, 1080, 1230, -1104] // Eri
    ,
    [9, 1620, 1740, -1116] // Cae
    ,
    [49, 5520, 5640, -1152] // Lup
    ,
    [63, 0, 840, -1156] // Phe
    ,
    [35, 960, 1080, -1176] // Eri
    ,
    [40, 1470, 1536, -1176] // Hor
    ,
    [9, 1536, 1620, -1176] // Cae
    ,
    [38, 7680, 7920, -1200] // Gru
    ,
    [67, 2160, 2880, -1218] // Pup
    ,
    [84, 2880, 2940, -1218] // Vel
    ,
    [35, 870, 960, -1224] // Eri
    ,
    [40, 1380, 1470, -1224] // Hor
    ,
    [63, 0, 660, -1236] // Phe
    ,
    [12, 2160, 2220, -1260] // Car
    ,
    [84, 2940, 3042, -1272] // Vel
    ,
    [40, 1260, 1380, -1276] // Hor
    ,
    [32, 1380, 1440, -1276] // Dor
    ,
    [63, 0, 570, -1284] // Phe
    ,
    [35, 780, 870, -1296] // Eri
    ,
    [64, 1620, 1800, -1296] // Pic
    ,
    [49, 5418, 5520, -1296] // Lup
    ,
    [84, 3042, 3180, -1308] // Vel
    ,
    [12, 2220, 2340, -1320] // Car
    ,
    [14, 4260, 4620, -1320] // Cen
    ,
    [49, 5100, 5418, -1320] // Lup
    ,
    [56, 5418, 5520, -1320] // Nor
    ,
    [32, 1440, 1560, -1356] // Dor
    ,
    [84, 3180, 3960, -1356] // Vel
    ,
    [14, 3960, 4050, -1356] // Cen
    ,
    [5, 6300, 6480, -1368] // Ara
    ,
    [78, 6480, 7320, -1368] // Tel
    ,
    [38, 7920, 8400, -1368] // Gru
    ,
    [40, 1152, 1260, -1380] // Hor
    ,
    [64, 1800, 1980, -1380] // Pic
    ,
    [12, 2340, 2460, -1392] // Car
    ,
    [63, 0, 480, -1404] // Phe
    ,
    [35, 480, 780, -1404] // Eri
    ,
    [63, 8400, 8640, -1404] // Phe
    ,
    [32, 1560, 1650, -1416] // Dor
    ,
    [56, 5520, 5911.5, -1440] // Nor
    ,
    [43, 7320, 7680, -1440] // Ind
    ,
    [64, 1980, 2160, -1464] // Pic
    ,
    [18, 5460, 5520, -1464] // Cir
    ,
    [5, 5911.5, 5970, -1464] // Ara
    ,
    [18, 5370, 5460, -1526] // Cir
    ,
    [5, 5970, 6030, -1526] // Ara
    ,
    [64, 2160, 2460, -1536] // Pic
    ,
    [12, 2460, 3252, -1536] // Car
    ,
    [14, 4050, 4260, -1536] // Cen
    ,
    [27, 4260, 4620, -1536] // Cru
    ,
    [14, 4620, 5232, -1536] // Cen
    ,
    [18, 4860, 4920, -1560] // Cir
    ,
    [5, 6030, 6060, -1560] // Ara
    ,
    [40, 780, 1152, -1620] // Hor
    ,
    [69, 1152, 1650, -1620] // Ret
    ,
    [18, 5310, 5370, -1620] // Cir
    ,
    [5, 6060, 6300, -1620] // Ara
    ,
    [60, 6300, 6480, -1620] // Pav
    ,
    [81, 7920, 8400, -1620] // Tuc
    ,
    [32, 1650, 2370, -1680] // Dor
    ,
    [18, 4920, 5310, -1680] // Cir
    ,
    [79, 5310, 6120, -1680] // TrA
    ,
    [81, 0, 480, -1800] // Tuc
    ,
    [42, 1260, 1650, -1800] // Hyi
    ,
    [86, 2370, 3252, -1800] // Vol
    ,
    [12, 3252, 4050, -1800] // Car
    ,
    [55, 4050, 4920, -1800] // Mus
    ,
    [60, 6480, 7680, -1800] // Pav
    ,
    [43, 7680, 8400, -1800] // Ind
    ,
    [81, 8400, 8640, -1800] // Tuc
    ,
    [81, 270, 480, -1824] // Tuc
    ,
    [42, 0, 1260, -1980] // Hyi
    ,
    [17, 2760, 4920, -1980] // Cha
    ,
    [2, 4920, 6480, -1980] // Aps
    ,
    [52, 1260, 2760, -2040] // Men
    ,
    [57, 0, 8640, -2160] // Oct
];
let ConstelRot;
let Epoch2000;
/**
 * @brief Reports the constellation that a given celestial point lies within.
 *
 * @property {string} symbol
 *      3-character mnemonic symbol for the constellation, e.g. "Ori".
 *
 * @property {string} name
 *      Full name of constellation, e.g. "Orion".
 *
 * @property {number} ra1875
 *      Right ascension expressed in B1875 coordinates.
 *
 * @property {number} dec1875
 *      Declination expressed in B1875 coordinates.
 */
class ConstellationInfo {
    constructor(symbol, name, ra1875, dec1875) {
        this.symbol = symbol;
        this.name = name;
        this.ra1875 = ra1875;
        this.dec1875 = dec1875;
    }
}
exports.ConstellationInfo = ConstellationInfo;
/**
 * @brief Determines the constellation that contains the given point in the sky.
 *
 * Given J2000 equatorial (EQJ) coordinates of a point in the sky,
 * determines the constellation that contains that point.
 *
 * @param {number} ra
 *      The right ascension (RA) of a point in the sky, using the J2000 equatorial system.
 *
 * @param {number} dec
 *      The declination (DEC) of a point in the sky, using the J2000 equatorial system.
 *
 * @returns {ConstellationInfo}
 *      An object that contains the 3-letter abbreviation and full name
 *      of the constellation that contains the given (ra,dec), along with
 *      the converted B1875 (ra,dec) for that point.
 */
function Constellation(ra, dec) {
    VerifyNumber(ra);
    VerifyNumber(dec);
    if (dec < -90 || dec > +90)
        throw 'Invalid declination angle. Must be -90..+90.';
    // Clamp right ascension to [0, 24) sidereal hours.
    ra %= 24.0;
    if (ra < 0.0)
        ra += 24.0;
    // Lazy-initialize rotation matrix.
    if (!ConstelRot) {
        // Need to calculate the B1875 epoch. Based on this:
        // https://en.wikipedia.org/wiki/Epoch_(astronomy)#Besselian_years
        // B = 1900 + (JD - 2415020.31352) / 365.242198781
        // I'm interested in using TT instead of JD, giving:
        // B = 1900 + ((TT+2451545) - 2415020.31352) / 365.242198781
        // B = 1900 + (TT + 36524.68648) / 365.242198781
        // TT = 365.242198781*(B - 1900) - 36524.68648 = -45655.741449525
        // But the AstroTime constructor wants UT, not TT.
        // Near that date, I get a historical correction of ut-tt = 3.2 seconds.
        // That gives UT = -45655.74141261017 for the B1875 epoch,
        // or 1874-12-31T18:12:21.950Z.
        ConstelRot = Rotation_EQJ_EQD(new AstroTime(-45655.74141261017));
        Epoch2000 = new AstroTime(0);
    }
    // Convert coordinates from J2000 to B1875.
    const sph2000 = new Spherical(dec, 15.0 * ra, 1.0);
    const vec2000 = VectorFromSphere(sph2000, Epoch2000);
    const vec1875 = RotateVector(ConstelRot, vec2000);
    const equ1875 = EquatorFromVector(vec1875);
    // Search for the constellation using the B1875 coordinates.
    const fd = 10 / (4 * 60); // conversion factor from compact units to DEC degrees
    const fr = fd / 15; // conversion factor from compact units to RA  sidereal hours
    for (let b of ConstelBounds) {
        // Convert compact angular units to RA in hours, DEC in degrees.
        const dec = b[3] * fd;
        const ra_lo = b[1] * fr;
        const ra_hi = b[2] * fr;
        if (dec <= equ1875.dec && ra_lo <= equ1875.ra && equ1875.ra < ra_hi) {
            const c = ConstelNames[b[0]];
            return new ConstellationInfo(c[0], c[1], equ1875.ra, equ1875.dec);
        }
    }
    // This should never happen!
    throw 'Unable to find constellation for given coordinates.';
}
exports.Constellation = Constellation;
/**
 * @brief The different kinds of lunar/solar eclipses..
 *
 * `Penumbral`: A lunar eclipse in which only the Earth's penumbra falls on the Moon. (Never used for a solar eclipse.)
 * `Partial`: A partial lunar/solar eclipse.
 * `Annular`: A solar eclipse in which the entire Moon is visible against the Sun, but the Sun appears as a ring around the Moon. (Never used for a lunar eclipse.)
 * `Total`: A total lunar/solar eclipse.
 *
 * @enum {string}
 */
var EclipseKind;
(function (EclipseKind) {
    EclipseKind["Penumbral"] = "penumbral";
    EclipseKind["Partial"] = "partial";
    EclipseKind["Annular"] = "annular";
    EclipseKind["Total"] = "total";
})(EclipseKind = exports.EclipseKind || (exports.EclipseKind = {}));
/**
 * @brief Returns information about a lunar eclipse.
 *
 * Returned by {@link SearchLunarEclipse} or {@link NextLunarEclipse}
 * to report information about a lunar eclipse event.
 * When a lunar eclipse is found, it is classified as penumbral, partial, or total.
 * Penumbral eclipses are difficult to observe, because the Moon is only slightly dimmed
 * by the Earth's penumbra; no part of the Moon touches the Earth's umbra.
 * Partial eclipses occur when part, but not all, of the Moon touches the Earth's umbra.
 * Total eclipses occur when the entire Moon passes into the Earth's umbra.
 *
 * The `kind` field thus holds one of the enum values `EclipseKind.Penumbral`, `EclipseKind.Partial`,
 * or `EclipseKind.Total`, depending on the kind of lunar eclipse found.
 *
 * The `obscuration` field holds a value in the range [0, 1] that indicates what fraction
 * of the Moon's apparent disc area is covered by the Earth's umbra at the eclipse's peak.
 * This indicates how dark the peak eclipse appears. For penumbral eclipses, the obscuration
 * is 0, because the Moon does not pass through the Earth's umbra. For partial eclipses,
 * the obscuration is somewhere between 0 and 1. For total lunar eclipses, the obscuration is 1.
 *
 * Field `peak` holds the date and time of the peak of the eclipse, when it is at its peak.
 *
 * Fields `sd_penum`, `sd_partial`, and `sd_total` hold the semi-duration of each phase
 * of the eclipse, which is half of the amount of time the eclipse spends in each
 * phase (expressed in minutes), or 0 if the eclipse never reaches that phase.
 * By converting from minutes to days, and subtracting/adding with `peak`, the caller
 * may determine the date and time of the beginning/end of each eclipse phase.
 *
 * @property {EclipseKind} kind
 *      The type of lunar eclipse found.
 *
 * @property {number} obscuration
 *      The peak fraction of the Moon's apparent disc that is covered by the Earth's umbra.
 *
 * @property {AstroTime} peak
 *      The time of the eclipse at its peak.
 *
 * @property {number} sd_penum
 *      The semi-duration of the penumbral phase in minutes.
 *
 * @property {number} sd_partial
 *      The semi-duration of the penumbral phase in minutes, or 0.0 if none.
 *
 * @property {number} sd_total
 *      The semi-duration of the penumbral phase in minutes, or 0.0 if none.
 *
 */
class LunarEclipseInfo {
    constructor(kind, obscuration, peak, sd_penum, sd_partial, sd_total) {
        this.kind = kind;
        this.obscuration = obscuration;
        this.peak = peak;
        this.sd_penum = sd_penum;
        this.sd_partial = sd_partial;
        this.sd_total = sd_total;
    }
}
exports.LunarEclipseInfo = LunarEclipseInfo;
/**
 * @ignore
 *
 * @brief Represents the relative alignment of the Earth and another body, and their respective shadows.
 *
 * This is an internal data structure used to assist calculation of
 * lunar eclipses, solar eclipses, and transits of Mercury and Venus.
 *
 * Definitions:
 *
 * casting body = A body that casts a shadow of interest, possibly striking another body.
 *
 * receiving body = A body on which the shadow of another body might land.
 *
 * shadow axis = The line passing through the center of the Sun and the center of the casting body.
 *
 * shadow plane = The plane passing through the center of a receiving body,
 * and perpendicular to the shadow axis.
 *
 * @property {AstroTime} time
 *      The time associated with the shadow calculation.
 *
 * @property {number} u
 *      The distance [au] between the center of the casting body and the shadow plane.
 *
 * @property {number} r
 *      The distance [km] between center of receiving body and the shadow axis.
 *
 * @property {number} k
 *      The umbra radius [km] at the shadow plane.
 *
 * @property {number} p
 *      The penumbra radius [km] at the shadow plane.
 *
 * @property {Vector} target
 *      The location in space where we are interested in determining how close a shadow falls.
 *      For example, when calculating lunar eclipses, `target` would be the center of the Moon
 *      expressed in geocentric coordinates. Then we can evaluate how far the center of the Earth's
 *      shadow cone approaches the center of the Moon.
 *      The vector components are expressed in [au].
 *
 * @property {Vector} dir
 *      The direction in space that the shadow points away from the center of a shadow-casting body.
 *      This vector lies on the shadow axis and points away from the Sun.
 *      In other words: the direction light from the Sun would be traveling,
 *      except that the center of a body (Earth, Moon, Mercury, or Venus) is blocking it.
 *      The distance units do not matter, because the vector will be normalized.
 */
class ShadowInfo {
    constructor(time, u, r, k, p, target, dir) {
        this.time = time;
        this.u = u;
        this.r = r;
        this.k = k;
        this.p = p;
        this.target = target;
        this.dir = dir;
    }
}
function CalcShadow(body_radius_km, time, target, dir) {
    const u = (dir.x * target.x + dir.y * target.y + dir.z * target.z) / (dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
    const dx = (u * dir.x) - target.x;
    const dy = (u * dir.y) - target.y;
    const dz = (u * dir.z) - target.z;
    const r = exports.KM_PER_AU * Math.hypot(dx, dy, dz);
    const k = +SUN_RADIUS_KM - (1.0 + u) * (SUN_RADIUS_KM - body_radius_km);
    const p = -SUN_RADIUS_KM + (1.0 + u) * (SUN_RADIUS_KM + body_radius_km);
    return new ShadowInfo(time, u, r, k, p, target, dir);
}
function EarthShadow(time) {
    // Light-travel and aberration corrected vector from the Earth to the Sun.
    const s = GeoVector(Body.Sun, time, true);
    // The vector e = -s is thus the path of sunlight through the center of the Earth.
    const e = new Vector(-s.x, -s.y, -s.z, s.t);
    // Geocentric moon.
    const m = GeoMoon(time);
    return CalcShadow(EARTH_ECLIPSE_RADIUS_KM, time, m, e);
}
function MoonShadow(time) {
    const s = GeoVector(Body.Sun, time, true);
    const m = GeoMoon(time); // geocentric Moon
    // Calculate lunacentric Earth.
    const e = new Vector(-m.x, -m.y, -m.z, m.t);
    // Convert geocentric moon to heliocentric Moon.
    m.x -= s.x;
    m.y -= s.y;
    m.z -= s.z;
    return CalcShadow(MOON_MEAN_RADIUS_KM, time, e, m);
}
function LocalMoonShadow(time, observer) {
    // Calculate observer's geocentric position.
    const pos = geo_pos(time, observer);
    // Calculate light-travel and aberration corrected Sun.
    const s = GeoVector(Body.Sun, time, true);
    // Calculate geocentric Moon.
    const m = GeoMoon(time); // geocentric Moon
    // Calculate lunacentric location of an observer on the Earth's surface.
    const o = new Vector(pos[0] - m.x, pos[1] - m.y, pos[2] - m.z, time);
    // Convert geocentric moon to heliocentric Moon.
    m.x -= s.x;
    m.y -= s.y;
    m.z -= s.z;
    return CalcShadow(MOON_MEAN_RADIUS_KM, time, o, m);
}
function PlanetShadow(body, planet_radius_km, time) {
    // Calculate light-travel-corrected vector from Earth to planet.
    const g = GeoVector(body, time, true);
    // Calculate light-travel-corrected vector from Earth to Sun.
    const e = GeoVector(Body.Sun, time, true);
    // Deduce light-travel-corrected vector from Sun to planet.
    const p = new Vector(g.x - e.x, g.y - e.y, g.z - e.z, time);
    // Calcluate Earth's position from the planet's point of view.
    e.x = -g.x;
    e.y = -g.y;
    e.z = -g.z;
    return CalcShadow(planet_radius_km, time, e, p);
}
function ShadowDistanceSlope(shadowfunc, time) {
    const dt = 1.0 / 86400.0;
    const t1 = time.AddDays(-dt);
    const t2 = time.AddDays(+dt);
    const shadow1 = shadowfunc(t1);
    const shadow2 = shadowfunc(t2);
    return (shadow2.r - shadow1.r) / dt;
}
function PlanetShadowSlope(body, planet_radius_km, time) {
    const dt = 1.0 / 86400.0;
    const shadow1 = PlanetShadow(body, planet_radius_km, time.AddDays(-dt));
    const shadow2 = PlanetShadow(body, planet_radius_km, time.AddDays(+dt));
    return (shadow2.r - shadow1.r) / dt;
}
function PeakEarthShadow(search_center_time) {
    const window = 0.03; /* initial search window, in days, before/after given time */
    const t1 = search_center_time.AddDays(-window);
    const t2 = search_center_time.AddDays(+window);
    const tx = Search((time) => ShadowDistanceSlope(EarthShadow, time), t1, t2);
    if (!tx)
        throw 'Failed to find peak Earth shadow time.';
    return EarthShadow(tx);
}
function PeakMoonShadow(search_center_time) {
    const window = 0.03; /* initial search window, in days, before/after given time */
    const t1 = search_center_time.AddDays(-window);
    const t2 = search_center_time.AddDays(+window);
    const tx = Search((time) => ShadowDistanceSlope(MoonShadow, time), t1, t2);
    if (!tx)
        throw 'Failed to find peak Moon shadow time.';
    return MoonShadow(tx);
}
function PeakPlanetShadow(body, planet_radius_km, search_center_time) {
    // Search for when the body's shadow is closest to the center of the Earth.
    const window = 1.0; // days before/after inferior conjunction to search for minimum shadow distance.
    const t1 = search_center_time.AddDays(-window);
    const t2 = search_center_time.AddDays(+window);
    const tx = Search((time) => PlanetShadowSlope(body, planet_radius_km, time), t1, t2);
    if (!tx)
        throw 'Failed to find peak planet shadow time.';
    return PlanetShadow(body, planet_radius_km, tx);
}
function PeakLocalMoonShadow(search_center_time, observer) {
    // Search for the time near search_center_time that the Moon's shadow comes
    // closest to the given observer.
    const window = 0.2;
    const t1 = search_center_time.AddDays(-window);
    const t2 = search_center_time.AddDays(+window);
    function shadowfunc(time) {
        return LocalMoonShadow(time, observer);
    }
    const time = Search((time) => ShadowDistanceSlope(shadowfunc, time), t1, t2);
    if (!time)
        throw `PeakLocalMoonShadow: search failure for search_center_time = ${search_center_time}`;
    return LocalMoonShadow(time, observer);
}
function ShadowSemiDurationMinutes(center_time, radius_limit, window_minutes) {
    // Search backwards and forwards from the center time until shadow axis distance crosses radius limit.
    const window = window_minutes / (24.0 * 60.0);
    const before = center_time.AddDays(-window);
    const after = center_time.AddDays(+window);
    const t1 = Search((time) => -(EarthShadow(time).r - radius_limit), before, center_time);
    const t2 = Search((time) => +(EarthShadow(time).r - radius_limit), center_time, after);
    if (!t1 || !t2)
        throw 'Failed to find shadow semiduration';
    return (t2.ut - t1.ut) * ((24.0 * 60.0) / 2.0); // convert days to minutes and average the semi-durations.
}
function MoonEclipticLatitudeDegrees(time) {
    const moon = CalcMoon(time);
    return exports.RAD2DEG * moon.geo_eclip_lat;
}
function Obscuration(a, // radius of first disc
b, // radius of second disc
c // distance between the centers of the discs
) {
    if (a <= 0.0)
        throw 'Radius of first disc must be positive.';
    if (b <= 0.0)
        throw 'Radius of second disc must be positive.';
    if (c < 0.0)
        throw 'Distance between discs is not allowed to be negative.';
    if (c >= a + b) {
        // The discs are too far apart to have any overlapping area.
        return 0.0;
    }
    if (c == 0.0) {
        // The discs have a common center. Therefore, one disc is inside the other.
        return (a <= b) ? 1.0 : (b * b) / (a * a);
    }
    const x = (a * a - b * b + c * c) / (2 * c);
    const radicand = a * a - x * x;
    if (radicand <= 0.0) {
        // The circumferences do not intersect, or are tangent.
        // We already ruled out the case of non-overlapping discs.
        // Therefore, one disc is inside the other.
        return (a <= b) ? 1.0 : (b * b) / (a * a);
    }
    // The discs overlap fractionally in a pair of lens-shaped areas.
    const y = Math.sqrt(radicand);
    // Return the overlapping fractional area.
    // There are two lens-shaped areas, one to the left of x, the other to the right of x.
    // Each part is calculated by subtracting a triangular area from a sector's area.
    const lens1 = a * a * Math.acos(x / a) - x * y;
    const lens2 = b * b * Math.acos((c - x) / b) - (c - x) * y;
    // Find the fractional area with respect to the first disc.
    return (lens1 + lens2) / (Math.PI * a * a);
}
function SolarEclipseObscuration(hm, // heliocentric Moon
lo // lunacentric observer
) {
    // Find heliocentric observer.
    const ho = new Vector(hm.x + lo.x, hm.y + lo.y, hm.z + lo.z, hm.t);
    // Calculate the apparent angular radius of the Sun for the observer.
    const sun_radius = Math.asin(SUN_RADIUS_AU / ho.Length());
    // Calculate the apparent angular radius of the Moon for the observer.
    const moon_radius = Math.asin(MOON_POLAR_RADIUS_AU / lo.Length());
    // Calculate the apparent angular separation between the Sun's center and the Moon's center.
    const sun_moon_separation = AngleBetween(lo, ho);
    // Find the fraction of the Sun's apparent disc area that is covered by the Moon.
    const obscuration = Obscuration(sun_radius, moon_radius, sun_moon_separation * exports.DEG2RAD);
    // HACK: In marginal cases, we need to clamp obscuration to less than 1.0.
    // This function is never called for total eclipses, so it should never return 1.0.
    return Math.min(0.9999, obscuration);
}
/**
 * @brief Searches for a lunar eclipse.
 *
 * This function finds the first lunar eclipse that occurs after `startTime`.
 * A lunar eclipse may be penumbral, partial, or total.
 * See {@link LunarEclipseInfo} for more information.
 * To find a series of lunar eclipses, call this function once,
 * then keep calling {@link NextLunarEclipse} as many times as desired,
 * passing in the `peak` value returned from the previous call.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for starting the search for a lunar eclipse.
 *
 * @returns {LunarEclipseInfo}
 */
function SearchLunarEclipse(date) {
    const PruneLatitude = 1.8; /* full Moon's ecliptic latitude above which eclipse is impossible */
    let fmtime = MakeTime(date);
    for (let fmcount = 0; fmcount < 12; ++fmcount) {
        /* Search for the next full moon. Any eclipse will be near it. */
        const fullmoon = SearchMoonPhase(180, fmtime, 40);
        if (!fullmoon)
            throw 'Cannot find full moon.';
        /*
            Pruning: if the full Moon's ecliptic latitude is too large,
            a lunar eclipse is not possible. Avoid needless work searching for
            the minimum moon distance.
        */
        const eclip_lat = MoonEclipticLatitudeDegrees(fullmoon);
        if (Math.abs(eclip_lat) < PruneLatitude) {
            /* Search near the full moon for the time when the center of the Moon */
            /* is closest to the line passing through the centers of the Sun and Earth. */
            const shadow = PeakEarthShadow(fullmoon);
            if (shadow.r < shadow.p + MOON_MEAN_RADIUS_KM) {
                /* This is at least a penumbral eclipse. We will return a result. */
                let kind = EclipseKind.Penumbral;
                let obscuration = 0.0;
                let sd_total = 0.0;
                let sd_partial = 0.0;
                let sd_penum = ShadowSemiDurationMinutes(shadow.time, shadow.p + MOON_MEAN_RADIUS_KM, 200.0);
                if (shadow.r < shadow.k + MOON_MEAN_RADIUS_KM) {
                    /* This is at least a partial eclipse. */
                    kind = EclipseKind.Partial;
                    sd_partial = ShadowSemiDurationMinutes(shadow.time, shadow.k + MOON_MEAN_RADIUS_KM, sd_penum);
                    if (shadow.r + MOON_MEAN_RADIUS_KM < shadow.k) {
                        /* This is a total eclipse. */
                        kind = EclipseKind.Total;
                        obscuration = 1.0;
                        sd_total = ShadowSemiDurationMinutes(shadow.time, shadow.k - MOON_MEAN_RADIUS_KM, sd_partial);
                    }
                    else {
                        obscuration = Obscuration(MOON_MEAN_RADIUS_KM, shadow.k, shadow.r);
                    }
                }
                return new LunarEclipseInfo(kind, obscuration, shadow.time, sd_penum, sd_partial, sd_total);
            }
        }
        /* We didn't find an eclipse on this full moon, so search for the next one. */
        fmtime = fullmoon.AddDays(10);
    }
    /* This should never happen because there are always at least 2 full moons per year. */
    throw 'Failed to find lunar eclipse within 12 full moons.';
}
exports.SearchLunarEclipse = SearchLunarEclipse;
/**
 * @brief Reports the time and geographic location of the peak of a solar eclipse.
 *
 * Returned by {@link SearchGlobalSolarEclipse} or {@link NextGlobalSolarEclipse}
 * to report information about a solar eclipse event.
 *
 * The eclipse is classified as partial, annular, or total, depending on the
 * maximum amount of the Sun's disc obscured, as seen at the peak location
 * on the surface of the Earth.
 *
 * The `kind` field thus holds one of the values `EclipseKind.Partial`, `EclipseKind.Annular`, or `EclipseKind.Total`.
 * A total eclipse is when the peak observer sees the Sun completely blocked by the Moon.
 * An annular eclipse is like a total eclipse, but the Moon is too far from the Earth's surface
 * to completely block the Sun; instead, the Sun takes on a ring-shaped appearance.
 * A partial eclipse is when the Moon blocks part of the Sun's disc, but nobody on the Earth
 * observes either a total or annular eclipse.
 *
 * If `kind` is `EclipseKind.Total` or `EclipseKind.Annular`, the `latitude` and `longitude`
 * fields give the geographic coordinates of the center of the Moon's shadow projected
 * onto the daytime side of the Earth at the instant of the eclipse's peak.
 * If `kind` has any other value, `latitude` and `longitude` are undefined and should
 * not be used.
 *
 * For total or annular eclipses, the `obscuration` field holds the fraction (0, 1]
 * of the Sun's apparent disc area that is blocked from view by the Moon's silhouette,
 * as seen by an observer located at the geographic coordinates `latitude`, `longitude`
 * at the darkest time `peak`. The value will always be 1 for total eclipses, and less than
 * 1 for annular eclipses.
 * For partial eclipses, `obscuration` is undefined and should not be used.
 * This is because there is little practical use for an obscuration value of
 * a partial eclipse without supplying a particular observation location.
 * Developers who wish to find an obscuration value for partial solar eclipses should therefore use
 * {@link SearchLocalSolarEclipse} and provide the geographic coordinates of an observer.
 *
 * @property {EclipseKind} kind
 *     One of the following enumeration values: `EclipseKind.Partial`, `EclipseKind.Annular`, `EclipseKind.Total`.
 *
 * @property {number | undefined} obscuration
 *      The peak fraction of the Sun's apparent disc area obscured by the Moon (total and annular eclipses only)
 *
 * @property {AstroTime} peak
 *     The date and time when the solar eclipse is darkest.
 *     This is the instant when the axis of the Moon's shadow cone passes closest to the Earth's center.
 *
 * @property {number} distance
 *     The distance in kilometers between the axis of the Moon's shadow cone
 *     and the center of the Earth at the time indicated by `peak`.
 *
 * @property {number | undefined} latitude
 *     If `kind` holds `EclipseKind.Total`, the geographic latitude in degrees
 *     where the center of the Moon's shadow falls on the Earth at the
 *     time indicated by `peak`; otherwise, `latitude` holds `undefined`.
 *
 * @property {number | undefined} longitude
 *     If `kind` holds `EclipseKind.Total`, the geographic longitude in degrees
 *     where the center of the Moon's shadow falls on the Earth at the
 *     time indicated by `peak`; otherwise, `longitude` holds `undefined`.
 */
class GlobalSolarEclipseInfo {
    constructor(kind, obscuration, peak, distance, latitude, longitude) {
        this.kind = kind;
        this.obscuration = obscuration;
        this.peak = peak;
        this.distance = distance;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
exports.GlobalSolarEclipseInfo = GlobalSolarEclipseInfo;
function EclipseKindFromUmbra(k) {
    // The umbra radius tells us what kind of eclipse the observer sees.
    // If the umbra radius is positive, this is a total eclipse. Otherwise, it's annular.
    // HACK: I added a tiny bias (14 meters) to match Espenak test data.
    return (k > 0.014) ? EclipseKind.Total : EclipseKind.Annular;
}
function GeoidIntersect(shadow) {
    let kind = EclipseKind.Partial;
    let peak = shadow.time;
    let distance = shadow.r;
    let latitude; // left undefined for partial eclipses
    let longitude; // left undefined for partial eclipses
    // We want to calculate the intersection of the shadow axis with the Earth's geoid.
    // First we must convert EQJ (equator of J2000) coordinates to EQD (equator of date)
    // coordinates that are perfectly aligned with the Earth's equator at this
    // moment in time.
    const rot = Rotation_EQJ_EQD(shadow.time);
    const v = RotateVector(rot, shadow.dir); // shadow-axis vector in equator-of-date coordinates
    const e = RotateVector(rot, shadow.target); // lunacentric Earth in equator-of-date coordinates
    // Convert all distances from AU to km.
    // But dilate the z-coordinates so that the Earth becomes a perfect sphere.
    // Then find the intersection of the vector with the sphere.
    // See p 184 in Montenbruck & Pfleger's "Astronomy on the Personal Computer", second edition.
    v.x *= exports.KM_PER_AU;
    v.y *= exports.KM_PER_AU;
    v.z *= exports.KM_PER_AU / EARTH_FLATTENING;
    e.x *= exports.KM_PER_AU;
    e.y *= exports.KM_PER_AU;
    e.z *= exports.KM_PER_AU / EARTH_FLATTENING;
    // Solve the quadratic equation that finds whether and where
    // the shadow axis intersects with the Earth in the dilated coordinate system.
    const R = EARTH_EQUATORIAL_RADIUS_KM;
    const A = v.x * v.x + v.y * v.y + v.z * v.z;
    const B = -2.0 * (v.x * e.x + v.y * e.y + v.z * e.z);
    const C = (e.x * e.x + e.y * e.y + e.z * e.z) - R * R;
    const radic = B * B - 4 * A * C;
    let obscuration;
    if (radic > 0.0) {
        // Calculate the closer of the two intersection points.
        // This will be on the day side of the Earth.
        const u = (-B - Math.sqrt(radic)) / (2 * A);
        // Convert lunacentric dilated coordinates to geocentric coordinates.
        const px = u * v.x - e.x;
        const py = u * v.y - e.y;
        const pz = (u * v.z - e.z) * EARTH_FLATTENING;
        // Convert cartesian coordinates into geodetic latitude/longitude.
        const proj = Math.hypot(px, py) * EARTH_FLATTENING_SQUARED;
        if (proj == 0.0)
            latitude = (pz > 0.0) ? +90.0 : -90.0;
        else
            latitude = exports.RAD2DEG * Math.atan(pz / proj);
        // Adjust longitude for Earth's rotation at the given UT.
        const gast = sidereal_time(peak);
        longitude = (exports.RAD2DEG * Math.atan2(py, px) - (15 * gast)) % 360.0;
        if (longitude <= -180.0)
            longitude += 360.0;
        else if (longitude > +180.0)
            longitude -= 360.0;
        // We want to determine whether the observer sees a total eclipse or an annular eclipse.
        // We need to perform a series of vector calculations...
        // Calculate the inverse rotation matrix, so we can convert EQD to EQJ.
        const inv = InverseRotation(rot);
        // Put the EQD geocentric coordinates of the observer into the vector 'o'.
        // Also convert back from kilometers to astronomical units.
        let o = new Vector(px / exports.KM_PER_AU, py / exports.KM_PER_AU, pz / exports.KM_PER_AU, shadow.time);
        // Rotate the observer's geocentric EQD back to the EQJ system.
        o = RotateVector(inv, o);
        // Convert geocentric vector to lunacentric vector.
        o.x += shadow.target.x;
        o.y += shadow.target.y;
        o.z += shadow.target.z;
        // Recalculate the shadow using a vector from the Moon's center toward the observer.
        const surface = CalcShadow(MOON_POLAR_RADIUS_KM, shadow.time, o, shadow.dir);
        // If we did everything right, the shadow distance should be very close to zero.
        // That's because we already determined the observer 'o' is on the shadow axis!
        if (surface.r > 1.0e-9 || surface.r < 0.0)
            throw `Unexpected shadow distance from geoid intersection = ${surface.r}`;
        kind = EclipseKindFromUmbra(surface.k);
        obscuration = (kind === EclipseKind.Total) ? 1.0 : SolarEclipseObscuration(shadow.dir, o);
    }
    else {
        // This is a partial solar eclipse. It does not make practical sense to calculate obscuration.
        // Anyone who wants obscuration should use Astronomy.SearchLocalSolarEclipse for a specific location on the Earth.
        obscuration = undefined;
    }
    return new GlobalSolarEclipseInfo(kind, obscuration, peak, distance, latitude, longitude);
}
/**
 * @brief Searches for the next lunar eclipse in a series.
 *
 * After using {@link SearchLunarEclipse} to find the first lunar eclipse
 * in a series, you can call this function to find the next consecutive lunar eclipse.
 * Pass in the `peak` value from the {@link LunarEclipseInfo} returned by the
 * previous call to `SearchLunarEclipse` or `NextLunarEclipse`
 * to find the next lunar eclipse.
 *
 * @param {FlexibleDateTime} prevEclipseTime
 *      A date and time near a full moon. Lunar eclipse search will start at the next full moon.
 *
 * @returns {LunarEclipseInfo}
 */
function NextLunarEclipse(prevEclipseTime) {
    prevEclipseTime = MakeTime(prevEclipseTime);
    const startTime = prevEclipseTime.AddDays(10);
    return SearchLunarEclipse(startTime);
}
exports.NextLunarEclipse = NextLunarEclipse;
/**
 * @brief Searches for a solar eclipse visible anywhere on the Earth's surface.
 *
 * This function finds the first solar eclipse that occurs after `startTime`.
 * A solar eclipse may be partial, annular, or total.
 * See {@link GlobalSolarEclipseInfo} for more information.
 * To find a series of solar eclipses, call this function once,
 * then keep calling {@link NextGlobalSolarEclipse} as many times as desired,
 * passing in the `peak` value returned from the previous call.
 *
 * @param {FlexibleDateTime} startTime
 *      The date and time for starting the search for a solar eclipse.
 *
 * @returns {GlobalSolarEclipseInfo}
 */
function SearchGlobalSolarEclipse(startTime) {
    startTime = MakeTime(startTime);
    const PruneLatitude = 1.8; // Moon's ecliptic latitude beyond which eclipse is impossible
    // Iterate through consecutive new moons until we find a solar eclipse visible somewhere on Earth.
    let nmtime = startTime;
    let nmcount;
    for (nmcount = 0; nmcount < 12; ++nmcount) {
        // Search for the next new moon. Any eclipse will be near it.
        const newmoon = SearchMoonPhase(0.0, nmtime, 40.0);
        if (!newmoon)
            throw 'Cannot find new moon';
        // Pruning: if the new moon's ecliptic latitude is too large, a solar eclipse is not possible.
        const eclip_lat = MoonEclipticLatitudeDegrees(newmoon);
        if (Math.abs(eclip_lat) < PruneLatitude) {
            // Search near the new moon for the time when the center of the Earth
            // is closest to the line passing through the centers of the Sun and Moon.
            const shadow = PeakMoonShadow(newmoon);
            if (shadow.r < shadow.p + EARTH_MEAN_RADIUS_KM) {
                // This is at least a partial solar eclipse visible somewhere on Earth.
                // Try to find an intersection between the shadow axis and the Earth's oblate geoid.
                return GeoidIntersect(shadow);
            }
        }
        // We didn't find an eclipse on this new moon, so search for the next one.
        nmtime = newmoon.AddDays(10.0);
    }
    // Safety valve to prevent infinite loop.
    // This should never happen, because at least 2 solar eclipses happen per year.
    throw 'Failed to find solar eclipse within 12 full moons.';
}
exports.SearchGlobalSolarEclipse = SearchGlobalSolarEclipse;
/**
 * @brief Searches for the next global solar eclipse in a series.
 *
 * After using {@link SearchGlobalSolarEclipse} to find the first solar eclipse
 * in a series, you can call this function to find the next consecutive solar eclipse.
 * Pass in the `peak` value from the {@link GlobalSolarEclipseInfo} returned by the
 * previous call to `SearchGlobalSolarEclipse` or `NextGlobalSolarEclipse`
 * to find the next solar eclipse.
 *
 * @param {FlexibleDateTime} prevEclipseTime
 *      A date and time near a new moon. Solar eclipse search will start at the next new moon.
 *
 * @returns {GlobalSolarEclipseInfo}
 */
function NextGlobalSolarEclipse(prevEclipseTime) {
    prevEclipseTime = MakeTime(prevEclipseTime);
    const startTime = prevEclipseTime.AddDays(10.0);
    return SearchGlobalSolarEclipse(startTime);
}
exports.NextGlobalSolarEclipse = NextGlobalSolarEclipse;
/**
 * @brief Holds a time and the observed altitude of the Sun at that time.
 *
 * When reporting a solar eclipse observed at a specific location on the Earth
 * (a "local" solar eclipse), a series of events occur. In addition
 * to the time of each event, it is important to know the altitude of the Sun,
 * because each event may be invisible to the observer if the Sun is below
 * the horizon.
 *
 * If `altitude` is negative, the event is theoretical only; it would be
 * visible if the Earth were transparent, but the observer cannot actually see it.
 * If `altitude` is positive but less than a few degrees, visibility will be impaired by
 * atmospheric interference (sunrise or sunset conditions).
 *
 * @property {AstroTime} time
 *      The date and time of the event.
 *
 * @property {number} altitude
 *      The angular altitude of the center of the Sun above/below the horizon, at `time`,
 *      corrected for atmospheric refraction and expressed in degrees.
 */
class EclipseEvent {
    constructor(time, altitude) {
        this.time = time;
        this.altitude = altitude;
    }
}
exports.EclipseEvent = EclipseEvent;
/**
 * @brief Information about a solar eclipse as seen by an observer at a given time and geographic location.
 *
 * Returned by {@link SearchLocalSolarEclipse} or {@link NextLocalSolarEclipse}
 * to report information about a solar eclipse as seen at a given geographic location.
 *
 * When a solar eclipse is found, it is classified by setting `kind`
 * to `EclipseKind.Partial`, `EclipseKind.Annular`, or `EclipseKind.Total`.
 * A partial solar eclipse is when the Moon does not line up directly enough with the Sun
 * to completely block the Sun's light from reaching the observer.
 * An annular eclipse occurs when the Moon's disc is completely visible against the Sun
 * but the Moon is too far away to completely block the Sun's light; this leaves the
 * Sun with a ring-like appearance.
 * A total eclipse occurs when the Moon is close enough to the Earth and aligned with the
 * Sun just right to completely block all sunlight from reaching the observer.
 *
 * The `obscuration` field reports what fraction of the Sun's disc appears blocked
 * by the Moon when viewed by the observer at the peak eclipse time.
 * This is a value that ranges from 0 (no blockage) to 1 (total eclipse).
 * The obscuration value will be between 0 and 1 for partial eclipses and annular eclipses.
 * The value will be exactly 1 for total eclipses. Obscuration gives an indication
 * of how dark the eclipse appears.
 *
 * There are 5 "event" fields, each of which contains a time and a solar altitude.
 * Field `peak` holds the date and time of the center of the eclipse, when it is at its peak.
 * The fields `partial_begin` and `partial_end` are always set, and indicate when
 * the eclipse begins/ends. If the eclipse reaches totality or becomes annular,
 * `total_begin` and `total_end` indicate when the total/annular phase begins/ends.
 * When an event field is valid, the caller must also check its `altitude` field to
 * see whether the Sun is above the horizon at the time indicated by the `time` field.
 * See {@link EclipseEvent} for more information.
 *
 * @property {EclipseKind} kind
 *      The type of solar eclipse found: `EclipseKind.Partial`, `EclipseKind.Annular`, or `EclipseKind.Total`.
 *
 * @property {number} obscuration
 *      The fraction of the Sun's apparent disc area obscured by the Moon at the eclipse peak.
 *
 * @property {EclipseEvent} partial_begin
 *      The time and Sun altitude at the beginning of the eclipse.
 *
 * @property {EclipseEvent | undefined} total_begin
 *      If this is an annular or a total eclipse, the time and Sun altitude when annular/total phase begins; otherwise undefined.
 *
 * @property {EclipseEvent} peak
 *      The time and Sun altitude when the eclipse reaches its peak.
 *
 * @property {EclipseEvent | undefined} total_end
 *      If this is an annular or a total eclipse, the time and Sun altitude when annular/total phase ends; otherwise undefined.
 *
 * @property {EclipseEvent} partial_end
 *      The time and Sun altitude at the end of the eclipse.
 */
class LocalSolarEclipseInfo {
    constructor(kind, obscuration, partial_begin, total_begin, peak, total_end, partial_end) {
        this.kind = kind;
        this.obscuration = obscuration;
        this.partial_begin = partial_begin;
        this.total_begin = total_begin;
        this.peak = peak;
        this.total_end = total_end;
        this.partial_end = partial_end;
    }
}
exports.LocalSolarEclipseInfo = LocalSolarEclipseInfo;
function local_partial_distance(shadow) {
    return shadow.p - shadow.r;
}
function local_total_distance(shadow) {
    // Must take the absolute value of the umbra radius 'k'
    // because it can be negative for an annular eclipse.
    return Math.abs(shadow.k) - shadow.r;
}
function LocalEclipse(shadow, observer) {
    const PARTIAL_WINDOW = 0.2;
    const TOTAL_WINDOW = 0.01;
    const peak = CalcEvent(observer, shadow.time);
    let t1 = shadow.time.AddDays(-PARTIAL_WINDOW);
    let t2 = shadow.time.AddDays(+PARTIAL_WINDOW);
    const partial_begin = LocalEclipseTransition(observer, +1.0, local_partial_distance, t1, shadow.time);
    const partial_end = LocalEclipseTransition(observer, -1.0, local_partial_distance, shadow.time, t2);
    let total_begin;
    let total_end;
    let kind;
    if (shadow.r < Math.abs(shadow.k)) { // take absolute value of 'k' to handle annular eclipses too.
        t1 = shadow.time.AddDays(-TOTAL_WINDOW);
        t2 = shadow.time.AddDays(+TOTAL_WINDOW);
        total_begin = LocalEclipseTransition(observer, +1.0, local_total_distance, t1, shadow.time);
        total_end = LocalEclipseTransition(observer, -1.0, local_total_distance, shadow.time, t2);
        kind = EclipseKindFromUmbra(shadow.k);
    }
    else {
        kind = EclipseKind.Partial;
    }
    const obscuration = (kind === EclipseKind.Total) ? 1.0 : SolarEclipseObscuration(shadow.dir, shadow.target);
    return new LocalSolarEclipseInfo(kind, obscuration, partial_begin, total_begin, peak, total_end, partial_end);
}
function LocalEclipseTransition(observer, direction, func, t1, t2) {
    function evaluate(time) {
        const shadow = LocalMoonShadow(time, observer);
        return direction * func(shadow);
    }
    const search = Search(evaluate, t1, t2);
    if (!search)
        throw "Local eclipse transition search failed.";
    return CalcEvent(observer, search);
}
function CalcEvent(observer, time) {
    const altitude = SunAltitude(time, observer);
    return new EclipseEvent(time, altitude);
}
function SunAltitude(time, observer) {
    const equ = Equator(Body.Sun, time, observer, true, true);
    const hor = Horizon(time, observer, equ.ra, equ.dec, 'normal');
    return hor.altitude;
}
/**
 * @brief Searches for a solar eclipse visible at a specific location on the Earth's surface.
 *
 * This function finds the first solar eclipse that occurs after `startTime`.
 * A solar eclipse may be partial, annular, or total.
 * See {@link LocalSolarEclipseInfo} for more information.
 *
 * To find a series of solar eclipses, call this function once,
 * then keep calling {@link NextLocalSolarEclipse} as many times as desired,
 * passing in the `peak` value returned from the previous call.
 *
 * IMPORTANT: An eclipse reported by this function might be partly or
 * completely invisible to the observer due to the time of day.
 * See {@link LocalSolarEclipseInfo} for more information about this topic.
 *
 * @param {FlexibleDateTime} startTime
 *      The date and time for starting the search for a solar eclipse.
 *
 * @param {Observer} observer
 *      The geographic location of the observer.
 *
 * @returns {LocalSolarEclipseInfo}
 */
function SearchLocalSolarEclipse(startTime, observer) {
    startTime = MakeTime(startTime);
    VerifyObserver(observer);
    const PruneLatitude = 1.8; /* Moon's ecliptic latitude beyond which eclipse is impossible */
    /* Iterate through consecutive new moons until we find a solar eclipse visible somewhere on Earth. */
    let nmtime = startTime;
    for (;;) {
        /* Search for the next new moon. Any eclipse will be near it. */
        const newmoon = SearchMoonPhase(0.0, nmtime, 40.0);
        if (!newmoon)
            throw 'Cannot find next new moon';
        /* Pruning: if the new moon's ecliptic latitude is too large, a solar eclipse is not possible. */
        const eclip_lat = MoonEclipticLatitudeDegrees(newmoon);
        if (Math.abs(eclip_lat) < PruneLatitude) {
            /* Search near the new moon for the time when the observer */
            /* is closest to the line passing through the centers of the Sun and Moon. */
            const shadow = PeakLocalMoonShadow(newmoon, observer);
            if (shadow.r < shadow.p) {
                /* This is at least a partial solar eclipse for the observer. */
                const eclipse = LocalEclipse(shadow, observer);
                /* Ignore any eclipse that happens completely at night. */
                /* More precisely, the center of the Sun must be above the horizon */
                /* at the beginning or the end of the eclipse, or we skip the event. */
                if (eclipse.partial_begin.altitude > 0.0 || eclipse.partial_end.altitude > 0.0)
                    return eclipse;
            }
        }
        /* We didn't find an eclipse on this new moon, so search for the next one. */
        nmtime = newmoon.AddDays(10.0);
    }
}
exports.SearchLocalSolarEclipse = SearchLocalSolarEclipse;
/**
 * @brief Searches for the next local solar eclipse in a series.
 *
 * After using {@link SearchLocalSolarEclipse} to find the first solar eclipse
 * in a series, you can call this function to find the next consecutive solar eclipse.
 * Pass in the `peak` value from the {@link LocalSolarEclipseInfo} returned by the
 * previous call to `SearchLocalSolarEclipse` or `NextLocalSolarEclipse`
 * to find the next solar eclipse.
 * This function finds the first solar eclipse that occurs after `startTime`.
 * A solar eclipse may be partial, annular, or total.
 * See {@link LocalSolarEclipseInfo} for more information.
 *
 * @param {FlexibleDateTime} prevEclipseTime
 *      The date and time for starting the search for a solar eclipse.
 *
 * @param {Observer} observer
 *      The geographic location of the observer.
 *
 * @returns {LocalSolarEclipseInfo}
 */
function NextLocalSolarEclipse(prevEclipseTime, observer) {
    prevEclipseTime = MakeTime(prevEclipseTime);
    const startTime = prevEclipseTime.AddDays(10.0);
    return SearchLocalSolarEclipse(startTime, observer);
}
exports.NextLocalSolarEclipse = NextLocalSolarEclipse;
/**
 * @brief Information about a transit of Mercury or Venus, as seen from the Earth.
 *
 * Returned by {@link SearchTransit} or {@link NextTransit} to report
 * information about a transit of Mercury or Venus.
 * A transit is when Mercury or Venus passes between the Sun and Earth so that
 * the other planet is seen in silhouette against the Sun.
 *
 * The calculations are performed from the point of view of a geocentric observer.
 *
 * @property {AstroTime} start
 *      The date and time at the beginning of the transit.
 *      This is the moment the planet first becomes visible against the Sun in its background.
 *
 * @property {AstroTime} peak
 *      When the planet is most aligned with the Sun, as seen from the Earth.
 *
 * @property {AstroTime} finish
 *      The date and time at the end of the transit.
 *      This is the moment the planet is last seen against the Sun in its background.
 *
 * @property {number} separation
 *      The minimum angular separation, in arcminutes, between the centers of the Sun and the planet.
 *      This angle pertains to the time stored in `peak`.
 */
class TransitInfo {
    constructor(start, peak, finish, separation) {
        this.start = start;
        this.peak = peak;
        this.finish = finish;
        this.separation = separation;
    }
}
exports.TransitInfo = TransitInfo;
function PlanetShadowBoundary(time, body, planet_radius_km, direction) {
    const shadow = PlanetShadow(body, planet_radius_km, time);
    return direction * (shadow.r - shadow.p);
}
function PlanetTransitBoundary(body, planet_radius_km, t1, t2, direction) {
    // Search for the time the planet's penumbra begins/ends making contact with the center of the Earth.
    const tx = Search((time) => PlanetShadowBoundary(time, body, planet_radius_km, direction), t1, t2);
    if (!tx)
        throw 'Planet transit boundary search failed';
    return tx;
}
/**
 * @brief Searches for the first transit of Mercury or Venus after a given date.
 *
 * Finds the first transit of Mercury or Venus after a specified date.
 * A transit is when an inferior planet passes between the Sun and the Earth
 * so that the silhouette of the planet is visible against the Sun in the background.
 * To continue the search, pass the `finish` time in the returned structure to
 * {@link NextTransit}.
 *
 * @param {Body} body
 *      The planet whose transit is to be found. Must be `Body.Mercury` or `Body.Venus`.
 *
 * @param {FlexibleDateTime} startTime
 *      The date and time for starting the search for a transit.
 *
 * @returns {TransitInfo}
 */
function SearchTransit(body, startTime) {
    startTime = MakeTime(startTime);
    const threshold_angle = 0.4; // maximum angular separation to attempt transit calculation
    const dt_days = 1.0;
    // Validate the planet and find its mean radius.
    let planet_radius_km;
    switch (body) {
        case Body.Mercury:
            planet_radius_km = 2439.7;
            break;
        case Body.Venus:
            planet_radius_km = 6051.8;
            break;
        default:
            throw `Invalid body: ${body}`;
    }
    let search_time = startTime;
    for (;;) {
        // Search for the next inferior conjunction of the given planet.
        // This is the next time the Earth and the other planet have the same
        // ecliptic longitude as seen from the Sun.
        const conj = SearchRelativeLongitude(body, 0.0, search_time);
        // Calculate the angular separation between the body and the Sun at this time.
        const conj_separation = AngleFromSun(body, conj);
        if (conj_separation < threshold_angle) {
            // The planet's angular separation from the Sun is small enough
            // to consider it a transit candidate.
            // Search for the moment when the line passing through the Sun
            // and planet are closest to the Earth's center.
            const shadow = PeakPlanetShadow(body, planet_radius_km, conj);
            if (shadow.r < shadow.p) { // does the planet's penumbra touch the Earth's center?
                // Find the beginning and end of the penumbral contact.
                const time_before = shadow.time.AddDays(-dt_days);
                const start = PlanetTransitBoundary(body, planet_radius_km, time_before, shadow.time, -1.0);
                const time_after = shadow.time.AddDays(+dt_days);
                const finish = PlanetTransitBoundary(body, planet_radius_km, shadow.time, time_after, +1.0);
                const min_separation = 60.0 * AngleFromSun(body, shadow.time);
                return new TransitInfo(start, shadow.time, finish, min_separation);
            }
        }
        // This inferior conjunction was not a transit. Try the next inferior conjunction.
        search_time = conj.AddDays(10.0);
    }
}
exports.SearchTransit = SearchTransit;
/**
 * @brief Searches for the next transit of Mercury or Venus in a series.
 *
 * After calling {@link SearchTransit} to find a transit of Mercury or Venus,
 * this function finds the next transit after that.
 * Keep calling this function as many times as you want to keep finding more transits.
 *
 * @param {Body} body
 *      The planet whose transit is to be found. Must be `Body.Mercury` or `Body.Venus`.
 *
 * @param {FlexibleDateTime} prevTransitTime
 *      A date and time near the previous transit.
 *
 * @returns {TransitInfo}
 */
function NextTransit(body, prevTransitTime) {
    prevTransitTime = MakeTime(prevTransitTime);
    const startTime = prevTransitTime.AddDays(100.0);
    return SearchTransit(body, startTime);
}
exports.NextTransit = NextTransit;
/**
 * @brief Indicates whether a crossing through the ecliptic plane is ascending or descending.
 *
 * `Invalid` is a placeholder for an unknown or missing node.
 * `Ascending` indicates a body passing through the ecliptic plane from south to north.
 * `Descending` indicates a body passing through the ecliptic plane from north to south.
 *
 * @enum {number}
 */
var NodeEventKind;
(function (NodeEventKind) {
    NodeEventKind[NodeEventKind["Invalid"] = 0] = "Invalid";
    NodeEventKind[NodeEventKind["Ascending"] = 1] = "Ascending";
    NodeEventKind[NodeEventKind["Descending"] = -1] = "Descending";
})(NodeEventKind = exports.NodeEventKind || (exports.NodeEventKind = {}));
/**
 * @brief Information about an ascending or descending node of a body.
 *
 * This object is returned by {@link SearchMoonNode} and {@link NextMoonNode}
 * to report information about the center of the Moon passing through the ecliptic plane.
 *
 * @property {NodeEventKind} kind   Whether the node is ascending (south to north) or descending (north to south).
 * @property {AstroTime} time       The time when the body passes through the ecliptic plane.
 */
class NodeEventInfo {
    constructor(kind, time) {
        this.kind = kind;
        this.time = time;
    }
}
exports.NodeEventInfo = NodeEventInfo;
const MoonNodeStepDays = +10.0; // a safe number of days to step without missing a Moon node
/**
 * @brief Searches for a time when the Moon's center crosses through the ecliptic plane.
 *
 * Searches for the first ascending or descending node of the Moon after `startTime`.
 * An ascending node is when the Moon's center passes through the ecliptic plane
 * (the plane of the Earth's orbit around the Sun) from south to north.
 * A descending node is when the Moon's center passes through the ecliptic plane
 * from north to south. Nodes indicate possible times of solar or lunar eclipses,
 * if the Moon also happens to be in the correct phase (new or full, respectively).
 * Call `SearchMoonNode` to find the first of a series of nodes.
 * Then call {@link NextMoonNode} to find as many more consecutive nodes as desired.
 *
 * @param {FlexibleDateTime} startTime
 *      The date and time for starting the search for an ascending or descending node of the Moon.
 *
 * @returns {NodeEventInfo}
 */
function SearchMoonNode(startTime) {
    // Start at the given moment in time and sample the Moon's ecliptic latitude.
    // Step 10 days at a time, searching for an interval where that latitude crosses zero.
    let time1 = MakeTime(startTime);
    let eclip1 = EclipticGeoMoon(time1);
    for (;;) {
        const time2 = time1.AddDays(MoonNodeStepDays);
        const eclip2 = EclipticGeoMoon(time2);
        if (eclip1.lat * eclip2.lat <= 0.0) {
            // There is a node somewhere inside this closed time interval.
            // Figure out whether it is an ascending node or a descending node.
            const kind = (eclip2.lat > eclip1.lat) ? NodeEventKind.Ascending : NodeEventKind.Descending;
            const result = Search(t => kind * EclipticGeoMoon(t).lat, time1, time2);
            if (!result)
                throw `Could not find moon node.`; // should never happen
            return new NodeEventInfo(kind, result);
        }
        time1 = time2;
        eclip1 = eclip2;
    }
}
exports.SearchMoonNode = SearchMoonNode;
/**
 * @brief Searches for the next time when the Moon's center crosses through the ecliptic plane.
 *
 * Call {@link SearchMoonNode} to find the first of a series of nodes.
 * Then call `NextMoonNode` to find as many more consecutive nodes as desired.
 *
 * @param {NodeEventInfo} prevNode
 *      The previous node found from calling {@link SearchMoonNode} or `NextMoonNode`.
 *
 * @returns {NodeEventInfo}
 */
function NextMoonNode(prevNode) {
    const time = prevNode.time.AddDays(MoonNodeStepDays);
    const node = SearchMoonNode(time);
    switch (prevNode.kind) {
        case NodeEventKind.Ascending:
            if (node.kind !== NodeEventKind.Descending)
                throw `Internal error: previous node was ascending, but this node was: ${node.kind}`;
            break;
        case NodeEventKind.Descending:
            if (node.kind !== NodeEventKind.Ascending)
                throw `Internal error: previous node was descending, but this node was: ${node.kind}`;
            break;
        default:
            throw `Previous node has an invalid node kind: ${prevNode.kind}`;
    }
    return node;
}
exports.NextMoonNode = NextMoonNode;
/**
 * @brief Information about a body's rotation axis at a given time.
 *
 * This structure is returned by {@link RotationAxis} to report
 * the orientation of a body's rotation axis at a given moment in time.
 * The axis is specified by the direction in space that the body's north pole
 * points, using angular equatorial coordinates in the J2000 system (EQJ).
 *
 * Thus `ra` is the right ascension, and `dec` is the declination, of the
 * body's north pole vector at the given moment in time. The north pole
 * of a body is defined as the pole that lies on the north side of the
 * [Solar System's invariable plane](https://en.wikipedia.org/wiki/Invariable_plane),
 * regardless of the body's direction of rotation.
 *
 * The `spin` field indicates the angular position of a prime meridian
 * arbitrarily recommended for the body by the International Astronomical
 * Union (IAU).
 *
 * The fields `ra`, `dec`, and `spin` correspond to the variables
 * α0, δ0, and W, respectively, from
 * [Report of the IAU Working Group on Cartographic Coordinates and Rotational Elements: 2015](https://astropedia.astrogeology.usgs.gov/download/Docs/WGCCRE/WGCCRE2015reprint.pdf).
 * The field `north` is a unit vector pointing in the direction of the body's north pole.
 * It is expressed in the J2000 mean equator system (EQJ).
 *
 * @property {number} ra
 *      The J2000 right ascension of the body's north pole direction, in sidereal hours.
 *
 * @property {number} dec
 *      The J2000 declination of the body's north pole direction, in degrees.
 *
 * @property {number} spin
 *      Rotation angle of the body's prime meridian, in degrees.
 *
 * @property {Vector} north
 *      A J2000 dimensionless unit vector pointing in the direction of the body's north pole.
 */
class AxisInfo {
    constructor(ra, dec, spin, north) {
        this.ra = ra;
        this.dec = dec;
        this.spin = spin;
        this.north = north;
    }
}
exports.AxisInfo = AxisInfo;
function EarthRotationAxis(time) {
    // Unlike the other planets, we have a model of precession and nutation
    // for the Earth's axis that provides a north pole vector.
    // So calculate the vector first, then derive the (RA,DEC) angles from the vector.
    // Start with a north pole vector in equator-of-date coordinates: (0,0,1).
    // Convert the vector into J2000 coordinates.
    const pos2 = nutation([0, 0, 1], time, PrecessDirection.Into2000);
    const nvec = precession(pos2, time, PrecessDirection.Into2000);
    const north = new Vector(nvec[0], nvec[1], nvec[2], time);
    // Derive angular values: right ascension and declination.
    const equ = EquatorFromVector(north);
    // Use a modified version of the era() function that does not trim to 0..360 degrees.
    // This expression is also corrected to give the correct angle at the J2000 epoch.
    const spin = 190.41375788700253 + (360.9856122880876 * time.ut);
    return new AxisInfo(equ.ra, equ.dec, spin, north);
}
/**
 * @brief Calculates information about a body's rotation axis at a given time.
 * Calculates the orientation of a body's rotation axis, along with
 * the rotation angle of its prime meridian, at a given moment in time.
 *
 * This function uses formulas standardized by the IAU Working Group
 * on Cartographics and Rotational Elements 2015 report, as described
 * in the following document:
 *
 * https://astropedia.astrogeology.usgs.gov/download/Docs/WGCCRE/WGCCRE2015reprint.pdf
 *
 * See {@link AxisInfo} for more detailed information.
 *
 * @param {Body} body
 *      One of the following values:
 *      `Body.Sun`, `Body.Moon`, `Body.Mercury`, `Body.Venus`, `Body.Earth`, `Body.Mars`,
 *      `Body.Jupiter`, `Body.Saturn`, `Body.Uranus`, `Body.Neptune`, `Body.Pluto`.
 *
 * @param {FlexibleDateTime} date
 *      The time at which to calculate the body's rotation axis.
 *
 * @returns {AxisInfo}
 */
function RotationAxis(body, date) {
    const time = MakeTime(date);
    const d = time.tt;
    const T = d / 36525.0;
    let ra, dec, w;
    switch (body) {
        case Body.Sun:
            ra = 286.13;
            dec = 63.87;
            w = 84.176 + (14.1844 * d);
            break;
        case Body.Mercury:
            ra = 281.0103 - (0.0328 * T);
            dec = 61.4155 - (0.0049 * T);
            w = (329.5988
                + (6.1385108 * d)
                + (0.01067257 * Math.sin(exports.DEG2RAD * (174.7910857 + 4.092335 * d)))
                - (0.00112309 * Math.sin(exports.DEG2RAD * (349.5821714 + 8.184670 * d)))
                - (0.00011040 * Math.sin(exports.DEG2RAD * (164.3732571 + 12.277005 * d)))
                - (0.00002539 * Math.sin(exports.DEG2RAD * (339.1643429 + 16.369340 * d)))
                - (0.00000571 * Math.sin(exports.DEG2RAD * (153.9554286 + 20.461675 * d))));
            break;
        case Body.Venus:
            ra = 272.76;
            dec = 67.16;
            w = 160.20 - (1.4813688 * d);
            break;
        case Body.Earth:
            return EarthRotationAxis(time);
        case Body.Moon:
            // See page 8, Table 2 in:
            // https://astropedia.astrogeology.usgs.gov/alfresco/d/d/workspace/SpacesStore/28fd9e81-1964-44d6-a58b-fbbf61e64e15/WGCCRE2009reprint.pdf
            const E1 = exports.DEG2RAD * (125.045 - 0.0529921 * d);
            const E2 = exports.DEG2RAD * (250.089 - 0.1059842 * d);
            const E3 = exports.DEG2RAD * (260.008 + 13.0120009 * d);
            const E4 = exports.DEG2RAD * (176.625 + 13.3407154 * d);
            const E5 = exports.DEG2RAD * (357.529 + 0.9856003 * d);
            const E6 = exports.DEG2RAD * (311.589 + 26.4057084 * d);
            const E7 = exports.DEG2RAD * (134.963 + 13.0649930 * d);
            const E8 = exports.DEG2RAD * (276.617 + 0.3287146 * d);
            const E9 = exports.DEG2RAD * (34.226 + 1.7484877 * d);
            const E10 = exports.DEG2RAD * (15.134 - 0.1589763 * d);
            const E11 = exports.DEG2RAD * (119.743 + 0.0036096 * d);
            const E12 = exports.DEG2RAD * (239.961 + 0.1643573 * d);
            const E13 = exports.DEG2RAD * (25.053 + 12.9590088 * d);
            ra = (269.9949 + 0.0031 * T
                - 3.8787 * Math.sin(E1)
                - 0.1204 * Math.sin(E2)
                + 0.0700 * Math.sin(E3)
                - 0.0172 * Math.sin(E4)
                + 0.0072 * Math.sin(E6)
                - 0.0052 * Math.sin(E10)
                + 0.0043 * Math.sin(E13));
            dec = (66.5392 + 0.0130 * T
                + 1.5419 * Math.cos(E1)
                + 0.0239 * Math.cos(E2)
                - 0.0278 * Math.cos(E3)
                + 0.0068 * Math.cos(E4)
                - 0.0029 * Math.cos(E6)
                + 0.0009 * Math.cos(E7)
                + 0.0008 * Math.cos(E10)
                - 0.0009 * Math.cos(E13));
            w = (38.3213 + (13.17635815 - 1.4e-12 * d) * d
                + 3.5610 * Math.sin(E1)
                + 0.1208 * Math.sin(E2)
                - 0.0642 * Math.sin(E3)
                + 0.0158 * Math.sin(E4)
                + 0.0252 * Math.sin(E5)
                - 0.0066 * Math.sin(E6)
                - 0.0047 * Math.sin(E7)
                - 0.0046 * Math.sin(E8)
                + 0.0028 * Math.sin(E9)
                + 0.0052 * Math.sin(E10)
                + 0.0040 * Math.sin(E11)
                + 0.0019 * Math.sin(E12)
                - 0.0044 * Math.sin(E13));
            break;
        case Body.Mars:
            ra = (317.269202 - 0.10927547 * T
                + 0.000068 * Math.sin(exports.DEG2RAD * (198.991226 + 19139.4819985 * T))
                + 0.000238 * Math.sin(exports.DEG2RAD * (226.292679 + 38280.8511281 * T))
                + 0.000052 * Math.sin(exports.DEG2RAD * (249.663391 + 57420.7251593 * T))
                + 0.000009 * Math.sin(exports.DEG2RAD * (266.183510 + 76560.6367950 * T))
                + 0.419057 * Math.sin(exports.DEG2RAD * (79.398797 + 0.5042615 * T)));
            dec = (54.432516 - 0.05827105 * T
                + 0.000051 * Math.cos(exports.DEG2RAD * (122.433576 + 19139.9407476 * T))
                + 0.000141 * Math.cos(exports.DEG2RAD * (43.058401 + 38280.8753272 * T))
                + 0.000031 * Math.cos(exports.DEG2RAD * (57.663379 + 57420.7517205 * T))
                + 0.000005 * Math.cos(exports.DEG2RAD * (79.476401 + 76560.6495004 * T))
                + 1.591274 * Math.cos(exports.DEG2RAD * (166.325722 + 0.5042615 * T)));
            w = (176.049863 + 350.891982443297 * d
                + 0.000145 * Math.sin(exports.DEG2RAD * (129.071773 + 19140.0328244 * T))
                + 0.000157 * Math.sin(exports.DEG2RAD * (36.352167 + 38281.0473591 * T))
                + 0.000040 * Math.sin(exports.DEG2RAD * (56.668646 + 57420.9295360 * T))
                + 0.000001 * Math.sin(exports.DEG2RAD * (67.364003 + 76560.2552215 * T))
                + 0.000001 * Math.sin(exports.DEG2RAD * (104.792680 + 95700.4387578 * T))
                + 0.584542 * Math.sin(exports.DEG2RAD * (95.391654 + 0.5042615 * T)));
            break;
        case Body.Jupiter:
            const Ja = exports.DEG2RAD * (99.360714 + 4850.4046 * T);
            const Jb = exports.DEG2RAD * (175.895369 + 1191.9605 * T);
            const Jc = exports.DEG2RAD * (300.323162 + 262.5475 * T);
            const Jd = exports.DEG2RAD * (114.012305 + 6070.2476 * T);
            const Je = exports.DEG2RAD * (49.511251 + 64.3000 * T);
            ra = (268.056595 - 0.006499 * T
                + 0.000117 * Math.sin(Ja)
                + 0.000938 * Math.sin(Jb)
                + 0.001432 * Math.sin(Jc)
                + 0.000030 * Math.sin(Jd)
                + 0.002150 * Math.sin(Je));
            dec = (64.495303 + 0.002413 * T
                + 0.000050 * Math.cos(Ja)
                + 0.000404 * Math.cos(Jb)
                + 0.000617 * Math.cos(Jc)
                - 0.000013 * Math.cos(Jd)
                + 0.000926 * Math.cos(Je));
            w = 284.95 + 870.536 * d;
            break;
        case Body.Saturn:
            ra = 40.589 - 0.036 * T;
            dec = 83.537 - 0.004 * T;
            w = 38.90 + 810.7939024 * d;
            break;
        case Body.Uranus:
            ra = 257.311;
            dec = -15.175;
            w = 203.81 - 501.1600928 * d;
            break;
        case Body.Neptune:
            const N = exports.DEG2RAD * (357.85 + 52.316 * T);
            ra = 299.36 + 0.70 * Math.sin(N);
            dec = 43.46 - 0.51 * Math.cos(N);
            w = 249.978 + 541.1397757 * d - 0.48 * Math.sin(N);
            break;
        case Body.Pluto:
            ra = 132.993;
            dec = -6.163;
            w = 302.695 + 56.3625225 * d;
            break;
        default:
            throw `Invalid body: ${body}`;
    }
    // Calculate the north pole vector using the given angles.
    const radlat = dec * exports.DEG2RAD;
    const radlon = ra * exports.DEG2RAD;
    const rcoslat = Math.cos(radlat);
    const north = new Vector(rcoslat * Math.cos(radlon), rcoslat * Math.sin(radlon), Math.sin(radlat), time);
    return new AxisInfo(ra / 15, dec, w, north);
}
exports.RotationAxis = RotationAxis;
/**
 * @brief Calculates one of the 5 Lagrange points for a pair of co-orbiting bodies.
 *
 * Given a more massive "major" body and a much less massive "minor" body,
 * calculates one of the five Lagrange points in relation to the minor body's
 * orbit around the major body. The parameter `point` is an integer that
 * selects the Lagrange point as follows:
 *
 * 1 = the Lagrange point between the major body and minor body.
 * 2 = the Lagrange point on the far side of the minor body.
 * 3 = the Lagrange point on the far side of the major body.
 * 4 = the Lagrange point 60 degrees ahead of the minor body's orbital position.
 * 5 = the Lagrange point 60 degrees behind the minor body's orbital position.
 *
 * The function returns the state vector for the selected Lagrange point
 * in J2000 mean equator coordinates (EQJ), with respect to the center of the
 * major body.
 *
 * To calculate Sun/Earth Lagrange points, pass in `Body.Sun` for `major_body`
 * and `Body.EMB` (Earth/Moon barycenter) for `minor_body`.
 * For Lagrange points of the Sun and any other planet, pass in that planet
 * (e.g. `Body.Jupiter`) for `minor_body`.
 * To calculate Earth/Moon Lagrange points, pass in `Body.Earth` and `Body.Moon`
 * for the major and minor bodies respectively.
 *
 * In some cases, it may be more efficient to call {@link LagrangePointFast},
 * especially when the state vectors have already been calculated, or are needed
 * for some other purpose.
 *
 * @param {number} point
 *      An integer 1..5 that selects which of the Lagrange points to calculate.
 *
 * @param {FlexibleDateTime} date
 *      The time at which the Lagrange point is to be calculated.
 *
 * @param {Body} major_body
 *      The more massive of the co-orbiting bodies: `Body.Sun` or `Body.Earth`.
 *
 * @param {Body} minor_body
 *      The less massive of the co-orbiting bodies. See main remarks.
 *
 * @returns {StateVector}
 *      The position and velocity of the selected Lagrange point with respect to the major body's center.
 */
function LagrangePoint(point, date, major_body, minor_body) {
    const time = MakeTime(date);
    const major_mass = MassProduct(major_body);
    const minor_mass = MassProduct(minor_body);
    let major_state;
    let minor_state;
    // Calculate the state vectors for the major and minor bodies.
    if (major_body === Body.Earth && minor_body === Body.Moon) {
        // Use geocentric calculations for more precision.
        // The Earth's geocentric state is trivial.
        major_state = new StateVector(0, 0, 0, 0, 0, 0, time);
        minor_state = GeoMoonState(time);
    }
    else {
        major_state = HelioState(major_body, time);
        minor_state = HelioState(minor_body, time);
    }
    return LagrangePointFast(point, major_state, major_mass, minor_state, minor_mass);
}
exports.LagrangePoint = LagrangePoint;
/**
 * @brief Calculates one of the 5 Lagrange points from body masses and state vectors.
 *
 * Given a more massive "major" body and a much less massive "minor" body,
 * calculates one of the five Lagrange points in relation to the minor body's
 * orbit around the major body. The parameter `point` is an integer that
 * selects the Lagrange point as follows:
 *
 * 1 = the Lagrange point between the major body and minor body.
 * 2 = the Lagrange point on the far side of the minor body.
 * 3 = the Lagrange point on the far side of the major body.
 * 4 = the Lagrange point 60 degrees ahead of the minor body's orbital position.
 * 5 = the Lagrange point 60 degrees behind the minor body's orbital position.
 *
 * The caller passes in the state vector and mass for both bodies.
 * The state vectors can be in any orientation and frame of reference.
 * The body masses are expressed as GM products, where G = the universal
 * gravitation constant and M = the body's mass. Thus the units for
 * `major_mass` and `minor_mass` must be au^3/day^2.
 * Use {@link MassProduct} to obtain GM values for various solar system bodies.
 *
 * The function returns the state vector for the selected Lagrange point
 * using the same orientation as the state vector parameters `major_state` and `minor_state`,
 * and the position and velocity components are with respect to the major body's center.
 *
 * Consider calling {@link LagrangePoint}, instead of this function, for simpler usage in most cases.
 *
 * @param {number} point
 *      A value 1..5 that selects which of the Lagrange points to calculate.
 *
 * @param {StateVector} major_state
 *      The state vector of the major (more massive) of the pair of bodies.
 *
 * @param {number} major_mass
 *      The mass product GM of the major body.
 *
 * @param {StateVector} minor_state
 *      The state vector of the minor (less massive) of the pair of bodies.
 *
 * @param {number} minor_mass
 *      The mass product GM of the minor body.
 *
 * @returns {StateVector}
 *      The position and velocity of the selected Lagrange point with respect to the major body's center.
 */
function LagrangePointFast(point, major_state, major_mass, minor_state, minor_mass) {
    const cos_60 = 0.5;
    const sin_60 = 0.8660254037844386; /* sqrt(3) / 2 */
    if (point < 1 || point > 5)
        throw `Invalid lagrange point ${point}`;
    if (!Number.isFinite(major_mass) || major_mass <= 0.0)
        throw 'Major mass must be a positive number.';
    if (!Number.isFinite(minor_mass) || minor_mass <= 0.0)
        throw 'Minor mass must be a negative number.';
    // Find the relative position vector <dx, dy, dz>.
    let dx = minor_state.x - major_state.x;
    let dy = minor_state.y - major_state.y;
    let dz = minor_state.z - major_state.z;
    const R2 = (dx * dx + dy * dy + dz * dz);
    // R = Total distance between the bodies.
    const R = Math.sqrt(R2);
    // Find the relative velocity vector <vx, vy, vz>.
    const vx = minor_state.vx - major_state.vx;
    const vy = minor_state.vy - major_state.vy;
    const vz = minor_state.vz - major_state.vz;
    let p;
    if (point === 4 || point === 5) {
        // For L4 and L5, we need to find points 60 degrees away from the
        // line connecting the two bodies and in the instantaneous orbital plane.
        // Define the instantaneous orbital plane as the unique plane that contains
        // both the relative position vector and the relative velocity vector.
        // Take the cross product of position and velocity to find a normal vector <nx, ny, nz>.
        const nx = dy * vz - dz * vy;
        const ny = dz * vx - dx * vz;
        const nz = dx * vy - dy * vx;
        // Take the cross product normal*position to get a tangential vector <ux, uy, uz>.
        let ux = ny * dz - nz * dy;
        let uy = nz * dx - nx * dz;
        let uz = nx * dy - ny * dx;
        // Convert the tangential direction vector to a unit vector.
        const U = Math.sqrt(ux * ux + uy * uy + uz * uz);
        ux /= U;
        uy /= U;
        uz /= U;
        // Convert the relative position vector into a unit vector.
        dx /= R;
        dy /= R;
        dz /= R;
        // Now we have two perpendicular unit vectors in the orbital plane: 'd' and 'u'.
        // Create new unit vectors rotated (+/-)60 degrees from the radius/tangent directions.
        const vert = (point == 4) ? +sin_60 : -sin_60;
        // Rotated radial vector
        const Dx = cos_60 * dx + vert * ux;
        const Dy = cos_60 * dy + vert * uy;
        const Dz = cos_60 * dz + vert * uz;
        // Rotated tangent vector
        const Ux = cos_60 * ux - vert * dx;
        const Uy = cos_60 * uy - vert * dy;
        const Uz = cos_60 * uz - vert * dz;
        // Calculate L4/L5 positions relative to the major body.
        const px = R * Dx;
        const py = R * Dy;
        const pz = R * Dz;
        // Use dot products to find radial and tangential components of the relative velocity.
        const vrad = vx * dx + vy * dy + vz * dz;
        const vtan = vx * ux + vy * uy + vz * uz;
        // Calculate L4/L5 velocities.
        const pvx = vrad * Dx + vtan * Ux;
        const pvy = vrad * Dy + vtan * Uy;
        const pvz = vrad * Dz + vtan * Uz;
        p = new StateVector(px, py, pz, pvx, pvy, pvz, major_state.t);
    }
    else {
        // Calculate the distances of each body from their mutual barycenter.
        // r1 = negative distance of major mass from barycenter (e.g. Sun to the left of barycenter)
        // r2 = positive distance of minor mass from barycenter (e.g. Earth to the right of barycenter)
        const r1 = -R * (minor_mass / (major_mass + minor_mass));
        const r2 = +R * (major_mass / (major_mass + minor_mass));
        // Calculate the square of the angular orbital speed in [rad^2 / day^2].
        const omega2 = (major_mass + minor_mass) / (R2 * R);
        // Use Newton's Method to numerically solve for the location where
        // outward centrifugal acceleration in the rotating frame of reference
        // is equal to net inward gravitational acceleration.
        // First derive a good initial guess based on approximate analysis.
        let scale, numer1, numer2;
        if (point === 1 || point === 2) {
            scale = (major_mass / (major_mass + minor_mass)) * Math.cbrt(minor_mass / (3.0 * major_mass));
            numer1 = -major_mass; // The major mass is to the left of L1 and L2.
            if (point == 1) {
                scale = 1.0 - scale;
                numer2 = +minor_mass; // The minor mass is to the right of L1.
            }
            else {
                scale = 1.0 + scale;
                numer2 = -minor_mass; // The minor mass is to the left of L2.
            }
        }
        else if (point === 3) {
            scale = ((7.0 / 12.0) * minor_mass - major_mass) / (minor_mass + major_mass);
            numer1 = +major_mass; // major mass is to the right of L3.
            numer2 = +minor_mass; // minor mass is to the right of L3.
        }
        else {
            throw `Invalid Langrage point ${point}. Must be an integer 1..5.`;
        }
        // Iterate Newton's Method until it converges.
        let x = R * scale - r1;
        let deltax;
        do {
            const dr1 = x - r1;
            const dr2 = x - r2;
            const accel = omega2 * x + numer1 / (dr1 * dr1) + numer2 / (dr2 * dr2);
            const deriv = omega2 - 2 * numer1 / (dr1 * dr1 * dr1) - 2 * numer2 / (dr2 * dr2 * dr2);
            deltax = accel / deriv;
            x -= deltax;
        } while (Math.abs(deltax / R) > 1.0e-14);
        scale = (x - r1) / R;
        p = new StateVector(scale * dx, scale * dy, scale * dz, scale * vx, scale * vy, scale * vz, major_state.t);
    }
    return p;
}
exports.LagrangePointFast = LagrangePointFast;
/**
 * @brief A simulation of zero or more small bodies moving through the Solar System.
 *
 * This class calculates the movement of arbitrary small bodies,
 * such as asteroids or comets, that move through the Solar System.
 * It does so by calculating the gravitational forces on the small bodies
 * from the Sun and planets. The user of this class supplies a
 * list of initial positions and velocities for the small bodies.
 * Then the class can update the positions and velocities over small
 * time steps.
 */
class GravitySimulator {
    /**
     * @brief Creates a gravity simulation object.
     *
     * @param {Body} originBody
     *      Specifies the origin of the reference frame.
     *      All position vectors and velocity vectors will use `originBody`
     *      as the origin of the coordinate system.
     *      This origin applies to all the input vectors provided in the
     *      `bodyStates` parameter of this function, along with all
     *      output vectors returned by {@link GravitySimulator#Update}.
     *      Most callers will want to provide one of the following:
     *      `Body.Sun` for heliocentric coordinates,
     *      `Body.SSB` for solar system barycentric coordinates,
     *      or `Body.Earth` for geocentric coordinates. Note that the
     *      gravity simulator does not correct for light travel time;
     *      all state vectors are tied to a Newtonian "instantaneous" time.
     *
     * @param {FlexibleDateTime} date
     *      The initial time at which to start the simulation.
     *
     * @param {StateVector[]} bodyStates
     *      An array of zero or more initial state vectors (positions and velocities)
     *      of the small bodies to be simulated.
     *      The caller must know the positions and velocities of the small bodies at an initial moment in time.
     *      Their positions and velocities are expressed with respect to `originBody`, using equatorial
     *      J2000 orientation (EQJ).
     *      Positions are expressed in astronomical units (AU).
     *      Velocities are expressed in AU/day.
     *      All the times embedded within the state vectors must exactly match `date`,
     *      or this constructor will throw an exception.
     */
    constructor(originBody, date, bodyStates) {
        const time = MakeTime(date);
        this.originBody = originBody;
        // Verify that the state vectors have matching times.
        for (let b of bodyStates) {
            if (b.t.tt !== time.tt) {
                throw 'Inconsistent times in bodyStates';
            }
        }
        // Create a stub list that we append to later.
        // We just need the stub to put into `this.curr`.
        const smallBodyList = [];
        // Calculate the states of the Sun and planets.
        const largeBodyDict = GravitySimulator.CalcSolarSystem(time);
        this.curr = new GravSimEndpoint(time, largeBodyDict, smallBodyList);
        // Convert origin-centric bodyStates vectors into barycentric body_grav_calc_t array.
        const o = this.InternalBodyState(originBody);
        for (let b of bodyStates) {
            const r = new TerseVector(b.x + o.r.x, b.y + o.r.y, b.z + o.r.z);
            const v = new TerseVector(b.vx + o.v.x, b.vy + o.v.y, b.vz + o.v.z);
            const a = TerseVector.zero();
            smallBodyList.push(new body_grav_calc_t(time.tt, r, v, a));
        }
        // Calculate the net acceleration experienced by the small bodies.
        this.CalcBodyAccelerations();
        // To prepare for a possible swap operation, duplicate the current state into the previous state.
        this.prev = this.Duplicate();
    }
    /**
     * @brief The body that was selected as the coordinate origin when this simulator was created.
     */
    get OriginBody() {
        return this.originBody;
    }
    /**
     * @brief The time represented by the current step of the gravity simulation.
     */
    get Time() {
        return this.curr.time;
    }
    /**
     * Advances the gravity simulation by a small time step.
     *
     * Updates the simulation of the user-supplied small bodies
     * to the time indicated by the `date` parameter.
     * Returns an array of state vectors for the simulated bodies.
     * The array is in the same order as the original array that
     * was used to construct this simulator object.
     * The positions and velocities in the returned array are
     * referenced to the `originBody` that was used to construct
     * this simulator.
     *
     * @param {FlexibleDateTime} date
     *      A time that is a small increment away from the current simulation time.
     *      It is up to the developer to figure out an appropriate time increment.
     *      Depending on the trajectories, a smaller or larger increment
     *      may be needed for the desired accuracy. Some experimentation may be needed.
     *      Generally, bodies that stay in the outer Solar System and move slowly can
     *      use larger time steps. Bodies that pass into the inner Solar System and
     *      move faster will need a smaller time step to maintain accuracy.
     *      The `date` value may be after or before the current simulation time
     *      to move forward or backward in time.
     *
     * @return {StateVector[]}
     *      An array of state vectors, one for each simulated small body.
     */
    Update(date) {
        const time = MakeTime(date);
        const dt = time.tt - this.curr.time.tt;
        if (dt === 0.0) {
            // Special case: the time has not changed, so skip the usual physics calculations.
            // This allows another way for the caller to query the current body states.
            // It is also necessary to avoid dividing by `dt` if `dt` is zero.
            // To prepare for a possible swap operation, duplicate the current state into the previous state.
            this.prev = this.Duplicate();
        }
        else {
            // Exchange the current state with the previous state. Then calculate the new current state.
            this.Swap();
            // Update the current time.
            this.curr.time = time;
            // Calculate the positions and velocities of the Sun and planets at the given time.
            this.curr.gravitators = GravitySimulator.CalcSolarSystem(time);
            // Estimate the positions of the small bodies as if their existing
            // accelerations apply across the whole time interval.
            for (let i = 0; i < this.curr.bodies.length; ++i) {
                const p = this.prev.bodies[i];
                this.curr.bodies[i].r = UpdatePosition(dt, p.r, p.v, p.a);
            }
            // Calculate the acceleration experienced by the small bodies at
            // their respective approximate next locations.
            this.CalcBodyAccelerations();
            for (let i = 0; i < this.curr.bodies.length; ++i) {
                // Calculate the average of the acceleration vectors
                // experienced by the previous body positions and
                // their estimated next positions.
                // These become estimates of the mean effective accelerations
                // over the whole interval.
                const p = this.prev.bodies[i];
                const c = this.curr.bodies[i];
                const acc = p.a.mean(c.a);
                // Refine the estimates of position and velocity at the next time step,
                // using the mean acceleration as a better approximation of the
                // continuously changing acceleration acting on each body.
                c.tt = time.tt;
                c.r = UpdatePosition(dt, p.r, p.v, acc);
                c.v = UpdateVelocity(dt, p.v, acc);
            }
            // Re-calculate accelerations experienced by each body.
            // These will be needed for the next simulation step (if any).
            // Also, they will be potentially useful if some day we add
            // a function to query the acceleration vectors for the bodies.
            this.CalcBodyAccelerations();
        }
        // Translate our internal calculations of body positions and velocities
        // into state vectors that the caller can understand.
        // We have to convert the internal type body_grav_calc_t to the public type StateVector.
        // Also convert from barycentric coordinates to coordinates based on the selected origin body.
        const bodyStates = [];
        const ostate = this.InternalBodyState(this.originBody);
        for (let bcalc of this.curr.bodies) {
            bodyStates.push(new StateVector(bcalc.r.x - ostate.r.x, bcalc.r.y - ostate.r.y, bcalc.r.z - ostate.r.z, bcalc.v.x - ostate.v.x, bcalc.v.y - ostate.v.y, bcalc.v.z - ostate.v.z, time));
        }
        return bodyStates;
    }
    /**
     * Exchange the current time step with the previous time step.
     *
     * Sometimes it is helpful to "explore" various times near a given
     * simulation time step, while repeatedly returning to the original
     * time step. For example, when backdating a position for light travel
     * time, the caller may wish to repeatedly try different amounts of
     * backdating. When the backdating solver has converged, the caller
     * wants to leave the simulation in its original state.
     *
     * This function allows a single "undo" of a simulation, and does so
     * very efficiently.
     *
     * Usually this function will be called immediately after a matching
     * call to {@link GravitySimulator#Update}. It has the effect of rolling
     * back the most recent update. If called twice in a row, it reverts
     * the swap and thus has no net effect.
     *
     * The constructor initializes the current state and previous
     * state to be identical. Both states represent the `time` parameter that was
     * passed into the constructor. Therefore, `Swap` will
     * have no effect from the caller's point of view when passed a simulator
     * that has not yet been updated by a call to {@link GravitySimulator#Update}.
     */
    Swap() {
        const swap = this.curr;
        this.curr = this.prev;
        this.prev = swap;
    }
    /**
     * Get the position and velocity of a Solar System body included in the simulation.
     *
     * In order to simulate the movement of small bodies through the Solar System,
     * the simulator needs to calculate the state vectors for the Sun and planets.
     *
     * If an application wants to know the positions of one or more of the planets
     * in addition to the small bodies, this function provides a way to obtain
     * their state vectors. This is provided for the sake of efficiency, to avoid
     * redundant calculations.
     *
     * The state vector is returned relative to the position and velocity
     * of the `originBody` parameter that was passed to this object's constructor.
     *
     * @param {Body} body
     *      The Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, or Neptune.
     */
    SolarSystemBodyState(body) {
        const bstate = this.InternalBodyState(body);
        const ostate = this.InternalBodyState(this.originBody);
        return ExportState(bstate.sub(ostate), this.curr.time);
    }
    InternalBodyState(body) {
        if (body === Body.SSB)
            return new body_state_t(this.curr.time.tt, TerseVector.zero(), TerseVector.zero());
        const bstate = this.curr.gravitators[body];
        if (bstate)
            return bstate;
        throw `Invalid body: ${body}`;
    }
    static CalcSolarSystem(time) {
        const dict = {};
        // Start with the SSB at zero position and velocity.
        const ssb = new body_state_t(time.tt, TerseVector.zero(), TerseVector.zero());
        // Calculate the heliocentric position of each planet, and adjust the SSB
        // based each planet's pull on the Sun.
        dict[Body.Mercury] = AdjustBarycenterPosVel(ssb, time.tt, Body.Mercury, MERCURY_GM);
        dict[Body.Venus] = AdjustBarycenterPosVel(ssb, time.tt, Body.Venus, VENUS_GM);
        dict[Body.Earth] = AdjustBarycenterPosVel(ssb, time.tt, Body.Earth, EARTH_GM + MOON_GM);
        dict[Body.Mars] = AdjustBarycenterPosVel(ssb, time.tt, Body.Mars, MARS_GM);
        dict[Body.Jupiter] = AdjustBarycenterPosVel(ssb, time.tt, Body.Jupiter, JUPITER_GM);
        dict[Body.Saturn] = AdjustBarycenterPosVel(ssb, time.tt, Body.Saturn, SATURN_GM);
        dict[Body.Uranus] = AdjustBarycenterPosVel(ssb, time.tt, Body.Uranus, URANUS_GM);
        dict[Body.Neptune] = AdjustBarycenterPosVel(ssb, time.tt, Body.Neptune, NEPTUNE_GM);
        // Convert planet states from heliocentric to barycentric.
        for (let body in dict) {
            dict[body].r.decr(ssb.r);
            dict[body].v.decr(ssb.v);
        }
        // Convert heliocentric SSB to barycentric Sun.
        dict[Body.Sun] = new body_state_t(time.tt, ssb.r.neg(), ssb.v.neg());
        return dict;
    }
    CalcBodyAccelerations() {
        // Calculate the gravitational acceleration experienced by the simulated small bodies.
        for (let b of this.curr.bodies) {
            b.a = TerseVector.zero();
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Sun].r, SUN_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Mercury].r, MERCURY_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Venus].r, VENUS_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Earth].r, EARTH_GM + MOON_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Mars].r, MARS_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Jupiter].r, JUPITER_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Saturn].r, SATURN_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Uranus].r, URANUS_GM);
            GravitySimulator.AddAcceleration(b.a, b.r, this.curr.gravitators[Body.Neptune].r, NEPTUNE_GM);
        }
    }
    static AddAcceleration(acc, smallPos, majorPos, gm) {
        const dx = majorPos.x - smallPos.x;
        const dy = majorPos.y - smallPos.y;
        const dz = majorPos.z - smallPos.z;
        const r2 = dx * dx + dy * dy + dz * dz;
        const pull = gm / (r2 * Math.sqrt(r2));
        acc.x += dx * pull;
        acc.y += dy * pull;
        acc.z += dz * pull;
    }
    Duplicate() {
        // Copy the current state into the previous state, so that both become the same moment in time.
        const gravitators = {};
        for (let body in this.curr.gravitators) {
            gravitators[body] = this.curr.gravitators[body].clone();
        }
        const bodies = [];
        for (let b of this.curr.bodies) {
            bodies.push(b.clone());
        }
        return new GravSimEndpoint(this.curr.time, gravitators, bodies);
    }
}
exports.GravitySimulator = GravitySimulator;
class GravSimEndpoint {
    constructor(time, gravitators, bodies) {
        this.time = time;
        this.gravitators = gravitators;
        this.bodies = bodies;
    }
}

},{}]},{},[1])(1)
});
