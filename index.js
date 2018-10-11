'use strict';

const is = require('is-type-of');
const array = require('./lib/array');
const crypto = require('./lib/crypto');
const date = require('./lib/date');
const func = require('./lib/function');
const json = require('./lib/json');
const number = require('./lib/number');
const object = require('./lib/object');
const stack = require('./lib/stack');
const string = require('./lib/string');
const web = require('./lib/web');
const file = require('./lib/file');

const Timing = require('./lib/timing');

const lodash = require('lodash');
const isGlob = require('is-glob');
const micromatch = require('micromatch');

const fs = require('fs-extra');

module.exports = {
    ...lodash,
    is,
    fs,

    Timing,
    isGlob, micromatch,

    ...crypto,
    ...array,
    ...date,
    ...func,
    ...json,
    ...number,
    ...object,
    ...stack,
    ...string,
    ...web,
    ...file,
};
