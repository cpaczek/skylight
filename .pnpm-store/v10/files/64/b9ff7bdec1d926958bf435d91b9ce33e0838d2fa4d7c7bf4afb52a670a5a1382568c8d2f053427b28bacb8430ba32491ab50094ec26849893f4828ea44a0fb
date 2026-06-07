# satellite.js

[![NPM version](https://img.shields.io/npm/v/satellite.js.svg)](https://www.npmjs.com/package/satellite.js)
[![Downloads/month](https://img.shields.io/npm/dm/satellite.js.svg)](https://www.npmjs.com/package/satellite.js)
[![Build Status](https://img.shields.io/travis/shashwatak/satellite-js/develop.svg)](https://travis-ci.org/shashwatak/satellite-js)
[![Coverage Status](https://img.shields.io/coveralls/github/shashwatak/satellite-js/develop.svg)](https://coveralls.io/github/shashwatak/satellite-js?branch=develop)
[![Gitter chat](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/satellite-js/Lobby)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE.md)

## Introduction

A library to make satellite propagation via TLEs possible in the web.
Provides the functions necessary for SGP4/SDP4 calculations, as callable javascript. Also provides
functions for coordinate transforms.

The internals of this library are nearly identical to
[Brandon Rhode's sgp4 python library](https://pypi.python.org/pypi/sgp4/). However, it is encapsulated in a
standard JS library (self executing function), and exposes only the functionality needed to track satellites and
propagate paths. The only changes I made to Brandon Rhode's code was to change the positional parameters of
functions to key:value objects. This reduces the complexity of functions that require 50+ parameters,
and doesn't require the parameters to be placed in the exact order.

Special thanks to all contributors for improving usability and bug fixes :)

- [ezze (Dmitriy Pushkov)](https://github.com/ezze)
- [davidcalhoun (David Calhoun)](https://github.com/davidcalhoun)
- [tikhonovits (Nikos Sagias)](https://github.com/tikhonovits)
- [dangodev (Drew Powers)](https://github.com/dangodev)
- [thkruz (Theodore Kruczek)](https://github.com/thkruz)
- [bakercp (Christopher Baker)](https://github.com/bakercp)
- [kylegmaxwell (Kyle G. Maxwell)](https://github.com/kylegmaxwell)
- [iamthechad (Chad Johnston)](https://github.com/iamthechad)
- [drom (Aliaksei Chapyzhenka)](https://github.com/drom)
- [PeterDaveHello (Peter Dave Hello)](https://github.com/PeterDaveHello)
- [Alesha72003](https://github.com/Alesha72003)
- [nhamer](https://github.com/nhamer)
- [owntheweb](https://github.com/owntheweb)
- [Zigone](https://github.com/Zigone)

If you want to contribute to the project please read the [Contributing](#contributing) section first.

Sites using the library can be found [here](https://github.com/shashwatak/satellite-js/wiki/Sites-using-satellite.js).

**Start Here:**

- [TS Kelso's Columns for Satellite Times](http://celestrak.com/columns/), Orbital Propagation Parts I and II a must!
- [Wikipedia: Simplified Perturbations Model](http://en.wikipedia.org/wiki/Simplified_perturbations_models)
- [SpaceTrack Report #3, by Hoots and Roehrich](http://celestrak.com/NORAD/documentation/spacetrk.pdf).

The javascript in this library is heavily based (straight copied) from:

- The python [sgp4 1.1 by Brandon Rhodes](https://pypi.python.org/pypi/sgp4/)
- The C++ code by [David Vallado, et al](http://www.celestrak.com/publications/AIAA/2006-6753/)

I've included the original PKG-INFO file from the python library.

The coordinate transforms are based off T.S. Kelso's columns:

- [Part I](http://celestrak.com/columns/v02n01/)
- [Part II](http://celestrak.com/columns/v02n02/)
- [Part III](http://celestrak.com/columns/v02n03/)

And the coursework for UC Boulder's ASEN students
- [Coodinate Transforms @ UC Boulder](http://ccar.colorado.edu/ASEN5070/handouts/coordsys.doc)

I would recommend anybody interested in satellite tracking or orbital propagation to read
[all of TS Kelso's columns](http://celestrak.com/columns/). Without his work, this project would not be possible.

Get a free [Space Track account](https://www.space-track.org/auth/login) and download your own up to date TLEs
for use with this library.

## Installation

Install the library with [NPM](https://www.npmjs.com/):

```bash
npm install satellite.js
```

Install the library with [Yarn](https://yarnpkg.com/):

```bash
yarn add satellite.js
```

Install the library with [Bower](http://bower.io/):

```bash
bower install satellite.js
```

**Warning!**

`satellite.js` version 1.3.0 is the latest one for Bower since it has been deprecated.

## Usage

### Common.js ([Node.js](https://nodejs.org))

```js
var satellite = require('satellite.js');
...
var positionAndVelocity = satellite.sgp4(satrec, time);
```

### ES ([Babel.js](https://babeljs.io/))

```js
import { sgp4 } from 'satellite.js';
...
const positionAndVelocity = sgp4(satrec, time);
```

### AMD ([Require.js](http://requirejs.org/))

```js
define(['path/to/dist/satellite'], function(satellite) {
    ...
    var positionAndVelocity = satellite.sgp4(satrec, time);
});
```

[Here is a repo](https://github.com/solarpatrol/satellite-requirejs) showing basic library usage with Require.js.

### Script tag

Include `dist/satellite.min.js` as a script in your html:

```html
<script src="path/to/dist/satellite.min.js"></script>
```

`satellite` object will be available in global scope:

```js
var positionAndVelocity = satellite.sgp4(satrec, time);
```

## Sample Usage
    
```js
// Sample TLE
var tleLine1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
    tleLine2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';    

// Initialize a satellite record
var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

//  Propagate satellite using time since epoch (in minutes).
var positionAndVelocity = satellite.sgp4(satrec, timeSinceTleEpochMinutes);

//  Or you can use a JavaScript Date
var positionAndVelocity = satellite.propagate(satrec, new Date());

// The position_velocity result is a key-value pair of ECI coordinates.
// These are the base results from which all other coordinates are derived.
var positionEci = positionAndVelocity.position,
    velocityEci = positionAndVelocity.velocity;

// Set the Observer at 122.03 West by 36.96 North, in RADIANS
var observerGd = {
    longitude: satellite.degreesToRadians(-122.0308),
    latitude: satellite.degreesToRadians(36.9613422),
    height: 0.370
};

// You will need GMST for some of the coordinate transforms.
// http://en.wikipedia.org/wiki/Sidereal_time#Definition
var gmst = satellite.gstime(new Date());

// You can get ECF, Geodetic, Look Angles, and Doppler Factor.
var positionEcf   = satellite.eciToEcf(positionEci, gmst),
    observerEcf   = satellite.geodeticToEcf(observerGd),
    positionGd    = satellite.eciToGeodetic(positionEci, gmst),
    lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf),
    dopplerFactor = satellite.dopplerFactor(observerCoordsEcf, positionEcf, velocityEcf);

// The coordinates are all stored in key-value pairs.
// ECI and ECF are accessed by `x`, `y`, `z` properties.
var satelliteX = positionEci.x,
    satelliteY = positionEci.y,
    satelliteZ = positionEci.z;

// Look Angles may be accessed by `azimuth`, `elevation`, `range_sat` properties.
var azimuth   = lookAngles.azimuth,
    elevation = lookAngles.elevation,
    rangeSat  = lookAngles.rangeSat;

// Geodetic coords are accessed via `longitude`, `latitude`, `height`.
var longitude = positionGd.longitude,
    latitude  = positionGd.latitude,
    height    = positionGd.height;

//  Convert the RADIANS to DEGREES.
var longitudeDeg = satellite.degreesLong(longitude),
    latitudeDeg  = satellite.degreesLat(latitude);
```
    
## Contributing

This repo follows [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).
Before starting a work on new [pull request](https://github.com/shashwatak/satellite-js/compare), please, checkout your
feature or bugfix branch from `develop` branch:

```bash
git checkout develop
git fetch origin
git merge origin/develop
git checkout -b my-feature
```

Make sure that your changes don't break the existing code by running

```bash
npm test
```

and that your code follows [Airbnb](https://www.npmjs.com/package/eslint-config-airbnb-base) style

```bash
npm run lint
npm run lint:test
```

Implementing new functions or features, please, if possible, provide tests to cover them and mention your works in
[Changelog](CHANGELOG.md). Please don't change version number in `package.json` and don't add it to `CHANGELOG.md`.
All these things should be done later with [raise-version](https://github.com/ezze/node-raise-version) when
merging to `master`:

```bash
npm run raise major
```

or

```bash
npm run raise minor
```

or

```bash
npm run raise patch
```

In order to get test code coverage run the following:

```bash
npm run test:coverage
```

## Building

The source code is organized as Common.js modules and uses [ES6 syntax](http://es6-features.org/).

In order to build the library follow these steps:

- install [Node.js](https://nodejs.org/) and [Node Package Manager](https://www.npmjs.com/);

- install all required packages with NPM by running the following command from repository's root directory:

    ```bash
    npm install
    ```

- run the following NPM script to build everything:

    ```bash
    npm run build
    ```

- run the following NPM script to run test specs `test/*.spec.js` files with [Mocha](https://mochajs.org/):

    ```bash
    npm test
    ```

These is a full list of all available NPM scripts:

- `build`           builds everything;
- `transpile`       transpiles ES source files located in `src` directory to Common.js compatible modules and saves
                    the resulting files in `lib` directory;
- `dist`            builds ES and UMD modules in `dist` directory;
- `dist:es`         builds ES module in `dist` directory;
- `dist:umd`        builds [UMD](https://github.com/umdjs/umd) module in `dist` directory (both non-compressed and
                    compressed versions);
- `dist:umd:dev`    builds non-compressed version of UMD module in `dist` directory;
- `dist:umd:prod`   builds compressed version of UMD module in `dist` directory; 
- `watch:es`        watches for changes in `src` directory and automatically rebuilds ES module;
- `copy`            copies built library from `dist` to [SGP4 verification](#benchmarking) application's directory;
- `lint`            lints sources code located in `src` directory with [ESLint](http://eslint.org/) with
                    [Airbnb shared configuration]((https://www.npmjs.com/package/eslint-config-airbnb));
- `lint:test`       lints tests located in `test` directory with ESLint;
- `test`            runs tests;
- `test:coverage`   runs tests with [Istanbul](https://github.com/gotwarlost/istanbul) coverage summary;
- `test:coveralls`  runs tests with Istanbul coverage summary and aggregates the results by
                    [Coveralls](https://coveralls.io/github/shashwatak/satellite-js); in order to run it locally
                    `COVERALLS_REPO_TOKEN` is required:
                    
    ```
    COVERALLS_REPO_TOKEN=<token> npm run test:coveralls
    ```

## ES5 and satellite.min.js

Some people are confused that they can't just download a single satellite.js or satellite.min.js file. That is because satellite.js is not written in plain old JavaScript (ES5) anymore but ported to latter JavaScript versions ES6+.

Only the "src" directory is included in the Git repository, "dist" and "lib" directories are ignored. It's done intentionally to retain the size of the repository as small as possible. A full detailed explanation of why is located [here](https://github.com/shashwatak/satellite-js/issues/80#issuecomment-749225324).

You should install satellite.js with your package manager (npm or yarn) and then find satellite.js and satellite.min.js in node_modules/satellite.js/dist directory.

## TODO

Optional functions that utilize Worker Threads

## Exposed Objects

### satrec

The `satrec` object comes from the original code by Rhodes as well as Vallado. It is immense and complex, but the
most important values it contains are the Keplerian Elements and the other values pulled from the TLEs. I do not
suggest that anybody try to simplify it unless they have absolute understanding of Orbital Mechanics.

- `satnum`      Unique satellite number given in the TLE file.
- `epochyr`     Full four-digit year of this element set's epoch moment.
- `epochdays`   Fractional days into the year of the epoch moment.
- `jdsatepoch`  Julian date of the epoch (computed from `epochyr` and `epochdays`).
- `ndot`        First time derivative of the mean motion (ignored by SGP4).
- `nddot`       Second time derivative of the mean motion (ignored by SGP4).
- `bstar`       Ballistic drag coefficient B* in inverse earth radii.
- `inclo`       Inclination in radians.
- `nodeo`       Right ascension of ascending node in radians.
- `ecco`        Eccentricity.
- `argpo`       Argument of perigee in radians.
- `mo`          Mean anomaly in radians.
- `no`          Mean motion in radians per minute.

## Exposed Functions

### Initialization

```js
var satrec = satellite.twoline2satrec(longstr1, longstr2);
```

returns satrec object, created from the TLEs passed in. The satrec object is vastly complicated, but you don't have
to do anything with it, except pass it around.

NOTE! You are responsible for providing TLEs. [Get your free Space Track account here.](https://www.space-track.org/auth/login)
longstr1 and longstr2 are the two lines of the TLE, properly formatted by NASA and NORAD standards. if you use
Space Track, there should be no problem.

### Propagation

Both `propagate()` and `sgp4()` functions return position and velocity as a dictionary of the form:

```json
{
  "position": { "x" : 1, "y" : 1, "z" : 1 },
  "velocity": { "x" : 1, "y" : 1, "z" : 1 }
}
```

position is in km, velocity is in km/s, both the ECI coordinate frame.

```js
var positionAndVelocity = satellite.propagate(satrec, new Date());
```

Returns position and velocity, given a satrec and the calendar date. Is merely a wrapper for `sgp4()`, converts the
calendar day to Julian time since satellite epoch. Sometimes it's better to ask for position and velocity given
a specific date.

```js
var positionAndVelocity = satellite.sgp4(satrec, timeSinceTleEpochMinutes);
```

Returns position and velocity, given a satrec and the time in minutes since epoch. Sometimes it's better to ask for
position and velocity given the time elapsed since epoch.

### Doppler

You can get the satellites current Doppler factor, relative to your position, using the `dopplerFactor()` function.
Use either ECI or ECF coordinates, but don't mix them.

```js
var dopplerFactor = satellite.dopplerFactor(observer, position, velocity);
```

See the section on Coordinate Transforms to see how to get ECF/ECI/Geodetic coordinates.

### Coordinate Transforms

#### Greenwich Mean Sidereal Time

You'll need to provide some of the coordinate transform functions with your current GMST aka GSTIME. You can use
Julian Day:

```js
var gmst = satellite.gstime(julianDay);
```

or a JavaScript Date:

```js
var gmst = satellite.gstime(new Date());
```

#### Transforms

Most of these are self explanatory from their names. Coords are arrays of three floats EX: [1.1, 1.2, 1.3] in
kilometers. Once again, read the following first.

The coordinate transforms are based off T.S. Kelso's columns:
* [Part I](http://celestrak.com/columns/v02n01/)
* [Part II](http://celestrak.com/columns/v02n02/)
* [Part III](http://celestrak.com/columns/v02n03/)

And the coursework for UC Boulder's ASEN students
* [Coodinate Transforms @ UC Boulder](http://ccar.colorado.edu/ASEN5070/handouts/coordsys.doc)

These four are used to convert between ECI, ECF, and Geodetic, as you need them. ECI and ECF coordinates are in
km or km/s. Geodetic coords are in radians.

```js
var ecfCoords = satellite.eciToEcf(eciCoords, gmst);
```

```js
var eciCoords = satellite.ecfToEci(ecfCoords, gmst);
```

```js
var geodeticCoords = satellite.eciToGeodetic(eciCoords, gmst);
```

```js
var ecfCoords = satellite.geodeticToEcf(geodeticCoords);
```

These function is used to compute the look angle, from your geodetic position to a satellite in ECF coordinates.
Make sure you convert the ECI output from sgp4() and propagate() to ECF first.

```js
var lookAngles = satellite.ecfToLookAngles(observerGeodetic, satelliteEcf);
```

#### Latitude and Longitude

These two functions will return human readable Latitude or Longitude strings (Ex: "125.35W" or "45.565N")
from `geodeticCoords`:

```js
var latitudeStr = satellite.degreesLat(geodeticRadians),
    longitudeStr = satellite.degreesLong(geodeticRadians);
```

## Note about Code Conventions

Like Brandon Rhodes before me, I chose to maintain as little difference between this implementation and the prior
works. This is to make adapting future changes suggested by Vallado much simpler. Thus, some of the conventions
used in this library are very weird.

## How this was written

I took advantage of the fact that Python and JavaScript are nearly semantically identical. Most of the code is
just copied straight from Python. Brandon Rhodes did me the favor of including semi-colons on most of the lines of
code. JavaScript doesn't support multiple values returned per statement, so I had to rewrite the function calls.
Absolutely none of the mathematical logic had to be rewritten.

## Benchmarking

I've included a small testing app, that provides some benchmarking tools and verifies SGP4 and SDP4 using the
Test Criteria provided by SpaceTrack Report #3, and is based off
[System Benchmarking](http://celestrak.com/columns/v02n04/) by TS Kelso.

The testing app is a Chrome Packaged App that uses the `angular.js` framework.

Before running the app build the library and copy resulting files from `dist` directory to app's directory with
the following command:

```bash
npm run copy
```

To run the test, open up Chrome, go to the extensions page, and check "Developer Mode". Then, click "Load Unpacked App",
and select the `sgp4_verification` folder. Then run the app from within Chrome. The test file is located within
the `sgp4_verification` directory, as a JSON file called `spacetrack-report-3.json`.

## Acknowledgments

Major thanks go to Brandon Rhodes, TS Kelso, and David Vallado's team. Also, I'd like to thank Professor Steve
Petersen (AC6P) of UCSC for pointing me in the correct directions.

## License

All files marked with the License header at the top are Licensed. Any files unmarked by me or others are
unlicensed, and are kept only as a resource for [Shashwat Kandadai and other developers] for testing.

I chose the [MIT License](LICENSE.md) because this library is a derivative work off
[Brandon Rhodes sgp4](https://pypi.python.org/pypi/sgp4/), and that is licensed with MIT. It just seemed simpler
this way, sub-licensing freedoms notwithstanding.

I worked in the Dining Hall at UCSC for a month, which means I signed a form that gives UCSC partial ownership of
anything I make while under their aegis, so I included them as owners of the copyright.

Please email all complaints to help@ucsc.edu
