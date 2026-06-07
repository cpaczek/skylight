# Changelog

## 5.0.0 (2023-01-06)

- Errors in calculations are fixed, WGS72 is used instead of WGS84 (#107).
- Dependencies are upgraded.

## 4.1.4 (2022-07-18)

- TypeScript definition for `ecfToEci` function is added. 

## 4.1.3 (2020-12-18)

- Fixed calculation of Doppler effect (`dopplerFactor`).

## 4.1.2 (2020-10-13)

- Expose `error` in TypeScript definition of `SatRec`.
- Fix TypeScript definition for `PositionAndVelocity` to allow error handling.

## 4.1.1 (2020-09-15)

- Fix TypeScript definition for `gstime` (#73).
- Fix documentation and TypeScript definition for `degreesLong` and `degreesLat` (#74).

## 4.1.0 (2020-09-14)

- TypeScript support is added via new TypeScript definitions file (#71).
- Rollup and some other dependencies are upgraded.

## 4.0.0 (2020-01-21)

- Node.js 12 support is added. Node.js 6 and Node.js 8 support is dropped (breaking change).
- Mocha, Chai and Istanbul are replaced by [Jest](https://jestjs.io/).
- Dependencies are upgraded.

## 3.0.1 (2019-03-14)

- Unnecessary calculations in `sgp4` function are reduced (#47).
- `vkmpersec` calculation is moved to constants (#50).
- `degreesToRadians` function is used in docs instead of `deg2rad` constant (#53).
- Typos' fixes (#54).

## 3.0.0 (2018-11-26)

- Node.js 4 support is dropped (breaking change).
- Deprecated functions `gstimeFromJday` and `gstimeFromDate` are removed (breaking change).
- New transformation functions are added: `radiansToDegrees`, `degreesToRadians`, `radiansLat`, `radiansLong`.

## 2.0.3 (2018-09-15)

- `satrec` object is not cloned in `sgp4` and `sgp4init` functions due to [performance reasons](https://github.com/shashwatak/satellite-js/issues/45).

## 2.0.2 (2018-04-16)

- [Wrong predictions for Molniya 3-47 orbits](https://github.com/shashwatak/satellite-js/issues/43) are fixed. Special thanks to [@nhamer](https://github.com/nhamer).

## 2.0.1 (2018-03-01)

- `sgp4` function's call result is used in `sgp4init`.
- Longitude of `eciToGeodetic` result is in [-PI; PI] range now.

## 2.0.0 (2017-12-23)

- Library became ES and Common.js compatible.
- Source code is reorganized to match [original Python library](https://pypi.python.org/pypi/sgp4/).
- `degreesLat` and `degreesLong` don't adjust input radians value and throw `RangeError` if it's out of bounds (breaking change).
- `invjday` function is added.
- [Julian day calculations take account of milliseconds](https://github.com/shashwatak/satellite-js/issues/31)
([#38](https://github.com/shashwatak/satellite-js/pull/38)).
- [Incorrect position and velocity bug](https://github.com/shashwatak/satellite-js/issues/26) for times not close to TLE epoch is fixed ([#37](https://github.com/shashwatak/satellite-js/pull/37)).
- Continuous integration and test coverage are provided.
- [Bower support is dropped](https://github.com/shashwatak/satellite-js/issues/40).
