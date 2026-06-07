/*!
 * satellite-js v5.0.0
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = sgp4;
var _constants = require("../constants");
var _dpper = _interopRequireDefault(require("./dpper"));
var _dspace = _interopRequireDefault(require("./dspace"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*----------------------------------------------------------------------------
 *
 *                             procedure sgp4
 *
 *  this procedure is the sgp4 prediction model from space command. this is an
 *    updated and combined version of sgp4 and sdp4, which were originally
 *    published separately in spacetrack report //3. this version follows the
 *    methodology from the aiaa paper (2006) describing the history and
 *    development of the code.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    satrec  - initialised structure from sgp4init() call.
 *    tsince  - time since epoch (minutes)
 *
 *  outputs       :
 *    r           - position vector                     km
 *    v           - velocity                            km/sec
 *  return code - non-zero on error.
 *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
 *                   2 - mean motion less than 0.0
 *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
 *                   4 - semi-latus rectum < 0.0
 *                   5 - epoch elements are sub-orbital
 *                   6 - satellite has decayed
 *
 *  locals        :
 *    am          -
 *    axnl, aynl        -
 *    betal       -
 *    cosim   , sinim   , cosomm  , sinomm  , cnod    , snod    , cos2u   ,
 *    sin2u   , coseo1  , sineo1  , cosi    , sini    , cosip   , sinip   ,
 *    cosisq  , cossu   , sinsu   , cosu    , sinu
 *    delm        -
 *    delomg      -
 *    dndt        -
 *    eccm        -
 *    emsq        -
 *    ecose       -
 *    el2         -
 *    eo1         -
 *    eccp        -
 *    esine       -
 *    argpm       -
 *    argpp       -
 *    omgadf      -
 *    pl          -
 *    r           -
 *    rtemsq      -
 *    rdotl       -
 *    rl          -
 *    rvdot       -
 *    rvdotl      -
 *    su          -
 *    t2  , t3   , t4    , tc
 *    tem5, temp , temp1 , temp2  , tempa  , tempe  , templ
 *    u   , ux   , uy    , uz     , vx     , vy     , vz
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    nodem       - right asc of ascending node
 *    xinc        -
 *    xincp       -
 *    xl          -
 *    xlm         -
 *    mp          -
 *    xmdf        -
 *    xmx         -
 *    xmy         -
 *    nodedf      -
 *    xnode       -
 *    nodep       -
 *    np          -
 *
 *  coupling      :
 *    getgravconst-
 *    dpper
 *    dspace
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report //3 1980
 *    hoots, norad spacetrack report //6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function sgp4(satrec, tsince) {
  /* eslint-disable no-param-reassign */

  var coseo1;
  var sineo1;
  var cosip;
  var sinip;
  var cosisq;
  var delm;
  var delomg;
  var eo1;
  var argpm;
  var argpp;
  var su;
  var t3;
  var t4;
  var tc;
  var tem5;
  var temp;
  var tempa;
  var tempe;
  var templ;
  var inclm;
  var mm;
  var nm;
  var nodem;
  var xincp;
  var xlm;
  var mp;
  var nodep;

  /* ------------------ set mathematical constants --------------- */
  // sgp4fix divisor for divide by zero check on inclination
  // the old check used 1.0 + cos(pi-1.0e-9), but then compared it to
  // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

  var temp4 = 1.5e-12;

  // --------------------- clear sgp4 error flag -----------------
  satrec.t = tsince;
  satrec.error = 0;

  //  ------- update for secular gravity and atmospheric drag -----
  var xmdf = satrec.mo + satrec.mdot * satrec.t;
  var argpdf = satrec.argpo + satrec.argpdot * satrec.t;
  var nodedf = satrec.nodeo + satrec.nodedot * satrec.t;
  argpm = argpdf;
  mm = xmdf;
  var t2 = satrec.t * satrec.t;
  nodem = nodedf + satrec.nodecf * t2;
  tempa = 1.0 - satrec.cc1 * satrec.t;
  tempe = satrec.bstar * satrec.cc4 * satrec.t;
  templ = satrec.t2cof * t2;
  if (satrec.isimp !== 1) {
    delomg = satrec.omgcof * satrec.t;
    //  sgp4fix use mutliply for speed instead of pow
    var delmtemp = 1.0 + satrec.eta * Math.cos(xmdf);
    delm = satrec.xmcof * (delmtemp * delmtemp * delmtemp - satrec.delmo);
    temp = delomg + delm;
    mm = xmdf + temp;
    argpm = argpdf - temp;
    t3 = t2 * satrec.t;
    t4 = t3 * satrec.t;
    tempa = tempa - satrec.d2 * t2 - satrec.d3 * t3 - satrec.d4 * t4;
    tempe += satrec.bstar * satrec.cc5 * (Math.sin(mm) - satrec.sinmao);
    templ = templ + satrec.t3cof * t3 + t4 * (satrec.t4cof + satrec.t * satrec.t5cof);
  }
  nm = satrec.no;
  var em = satrec.ecco;
  inclm = satrec.inclo;
  if (satrec.method === 'd') {
    tc = satrec.t;
    var dspaceOptions = {
      irez: satrec.irez,
      d2201: satrec.d2201,
      d2211: satrec.d2211,
      d3210: satrec.d3210,
      d3222: satrec.d3222,
      d4410: satrec.d4410,
      d4422: satrec.d4422,
      d5220: satrec.d5220,
      d5232: satrec.d5232,
      d5421: satrec.d5421,
      d5433: satrec.d5433,
      dedt: satrec.dedt,
      del1: satrec.del1,
      del2: satrec.del2,
      del3: satrec.del3,
      didt: satrec.didt,
      dmdt: satrec.dmdt,
      dnodt: satrec.dnodt,
      domdt: satrec.domdt,
      argpo: satrec.argpo,
      argpdot: satrec.argpdot,
      t: satrec.t,
      tc: tc,
      gsto: satrec.gsto,
      xfact: satrec.xfact,
      xlamo: satrec.xlamo,
      no: satrec.no,
      atime: satrec.atime,
      em: em,
      argpm: argpm,
      inclm: inclm,
      xli: satrec.xli,
      mm: mm,
      xni: satrec.xni,
      nodem: nodem,
      nm: nm
    };
    var dspaceResult = (0, _dspace["default"])(dspaceOptions);
    em = dspaceResult.em;
    argpm = dspaceResult.argpm;
    inclm = dspaceResult.inclm;
    mm = dspaceResult.mm;
    nodem = dspaceResult.nodem;
    nm = dspaceResult.nm;
  }
  if (nm <= 0.0) {
    // printf("// error nm %f\n", nm);
    satrec.error = 2;
    // sgp4fix add return
    return [false, false];
  }
  var am = Math.pow(_constants.xke / nm, _constants.x2o3) * tempa * tempa;
  nm = _constants.xke / Math.pow(am, 1.5);
  em -= tempe;

  // fix tolerance for error recognition
  // sgp4fix am is fixed from the previous nm check
  if (em >= 1.0 || em < -0.001) {
    // || (am < 0.95)
    // printf("// error em %f\n", em);
    satrec.error = 1;
    // sgp4fix to return if there is an error in eccentricity
    return [false, false];
  }

  //  sgp4fix fix tolerance to avoid a divide by zero
  if (em < 1.0e-6) {
    em = 1.0e-6;
  }
  mm += satrec.no * templ;
  xlm = mm + argpm + nodem;
  nodem %= _constants.twoPi;
  argpm %= _constants.twoPi;
  xlm %= _constants.twoPi;
  mm = (xlm - argpm - nodem) % _constants.twoPi;

  // ----------------- compute extra mean quantities -------------
  var sinim = Math.sin(inclm);
  var cosim = Math.cos(inclm);

  // -------------------- add lunar-solar periodics --------------
  var ep = em;
  xincp = inclm;
  argpp = argpm;
  nodep = nodem;
  mp = mm;
  sinip = sinim;
  cosip = cosim;
  if (satrec.method === 'd') {
    var dpperParameters = {
      inclo: satrec.inclo,
      init: 'n',
      ep: ep,
      inclp: xincp,
      nodep: nodep,
      argpp: argpp,
      mp: mp,
      opsmode: satrec.operationmode
    };
    var dpperResult = (0, _dpper["default"])(satrec, dpperParameters);
    ep = dpperResult.ep;
    nodep = dpperResult.nodep;
    argpp = dpperResult.argpp;
    mp = dpperResult.mp;
    xincp = dpperResult.inclp;
    if (xincp < 0.0) {
      xincp = -xincp;
      nodep += _constants.pi;
      argpp -= _constants.pi;
    }
    if (ep < 0.0 || ep > 1.0) {
      //  printf("// error ep %f\n", ep);
      satrec.error = 3;
      //  sgp4fix add return
      return [false, false];
    }
  }

  //  -------------------- long period periodics ------------------
  if (satrec.method === 'd') {
    sinip = Math.sin(xincp);
    cosip = Math.cos(xincp);
    satrec.aycof = -0.5 * _constants.j3oj2 * sinip;

    //  sgp4fix for divide by zero for xincp = 180 deg
    if (Math.abs(cosip + 1.0) > 1.5e-12) {
      satrec.xlcof = -0.25 * _constants.j3oj2 * sinip * (3.0 + 5.0 * cosip) / (1.0 + cosip);
    } else {
      satrec.xlcof = -0.25 * _constants.j3oj2 * sinip * (3.0 + 5.0 * cosip) / temp4;
    }
  }
  var axnl = ep * Math.cos(argpp);
  temp = 1.0 / (am * (1.0 - ep * ep));
  var aynl = ep * Math.sin(argpp) + temp * satrec.aycof;
  var xl = mp + argpp + nodep + temp * satrec.xlcof * axnl;

  // --------------------- solve kepler's equation ---------------
  var u = (xl - nodep) % _constants.twoPi;
  eo1 = u;
  tem5 = 9999.9;
  var ktr = 1;

  //    sgp4fix for kepler iteration
  //    the following iteration needs better limits on corrections
  while (Math.abs(tem5) >= 1.0e-12 && ktr <= 10) {
    sineo1 = Math.sin(eo1);
    coseo1 = Math.cos(eo1);
    tem5 = 1.0 - coseo1 * axnl - sineo1 * aynl;
    tem5 = (u - aynl * coseo1 + axnl * sineo1 - eo1) / tem5;
    if (Math.abs(tem5) >= 0.95) {
      if (tem5 > 0.0) {
        tem5 = 0.95;
      } else {
        tem5 = -0.95;
      }
    }
    eo1 += tem5;
    ktr += 1;
  }

  //  ------------- short period preliminary quantities -----------
  var ecose = axnl * coseo1 + aynl * sineo1;
  var esine = axnl * sineo1 - aynl * coseo1;
  var el2 = axnl * axnl + aynl * aynl;
  var pl = am * (1.0 - el2);
  if (pl < 0.0) {
    //  printf("// error pl %f\n", pl);
    satrec.error = 4;
    //  sgp4fix add return
    return [false, false];
  }
  var rl = am * (1.0 - ecose);
  var rdotl = Math.sqrt(am) * esine / rl;
  var rvdotl = Math.sqrt(pl) / rl;
  var betal = Math.sqrt(1.0 - el2);
  temp = esine / (1.0 + betal);
  var sinu = am / rl * (sineo1 - aynl - axnl * temp);
  var cosu = am / rl * (coseo1 - axnl + aynl * temp);
  su = Math.atan2(sinu, cosu);
  var sin2u = (cosu + cosu) * sinu;
  var cos2u = 1.0 - 2.0 * sinu * sinu;
  temp = 1.0 / pl;
  var temp1 = 0.5 * _constants.j2 * temp;
  var temp2 = temp1 * temp;

  // -------------- update for short period periodics ------------
  if (satrec.method === 'd') {
    cosisq = cosip * cosip;
    satrec.con41 = 3.0 * cosisq - 1.0;
    satrec.x1mth2 = 1.0 - cosisq;
    satrec.x7thm1 = 7.0 * cosisq - 1.0;
  }
  var mrt = rl * (1.0 - 1.5 * temp2 * betal * satrec.con41) + 0.5 * temp1 * satrec.x1mth2 * cos2u;

  // sgp4fix for decaying satellites
  if (mrt < 1.0) {
    // printf("// decay condition %11.6f \n",mrt);
    satrec.error = 6;
    return {
      position: false,
      velocity: false
    };
  }
  su -= 0.25 * temp2 * satrec.x7thm1 * sin2u;
  var xnode = nodep + 1.5 * temp2 * cosip * sin2u;
  var xinc = xincp + 1.5 * temp2 * cosip * sinip * cos2u;
  var mvt = rdotl - nm * temp1 * satrec.x1mth2 * sin2u / _constants.xke;
  var rvdot = rvdotl + nm * temp1 * (satrec.x1mth2 * cos2u + 1.5 * satrec.con41) / _constants.xke;

  // --------------------- orientation vectors -------------------
  var sinsu = Math.sin(su);
  var cossu = Math.cos(su);
  var snod = Math.sin(xnode);
  var cnod = Math.cos(xnode);
  var sini = Math.sin(xinc);
  var cosi = Math.cos(xinc);
  var xmx = -snod * cosi;
  var xmy = cnod * cosi;
  var ux = xmx * sinsu + cnod * cossu;
  var uy = xmy * sinsu + snod * cossu;
  var uz = sini * sinsu;
  var vx = xmx * cossu - cnod * sinsu;
  var vy = xmy * cossu - snod * sinsu;
  var vz = sini * cossu;

  // --------- position and velocity (in km and km/sec) ----------
  var r = {
    x: mrt * ux * _constants.earthRadius,
    y: mrt * uy * _constants.earthRadius,
    z: mrt * uz * _constants.earthRadius
  };
  var v = {
    x: (mvt * ux + rvdot * vx) * _constants.vkmpersec,
    y: (mvt * uy + rvdot * vy) * _constants.vkmpersec,
    z: (mvt * uz + rvdot * vz) * _constants.vkmpersec
  };
  return {
    position: r,
    velocity: v
  };

  /* eslint-enable no-param-reassign */
}