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

module.exports = {
    Timing,
    is,
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
