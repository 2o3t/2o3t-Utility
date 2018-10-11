'use strict';

const assert = require('assert');
const MAP = Symbol('Timing#map');
const INDEX = Symbol('Timing#index');
const LOGGER = Symbol('Timing#logger');

class Timing {

    /**
     * Creates an instance of Timing.
     * @param {string} [name='unknow'] 名称 key
     * @param {Logger} logger 日志对象
     * @memberof Timing
     */
    constructor(name = 'unknow', logger) {
        this.name = name;
        this[MAP] = new Map();
        this[INDEX] = 0;
        this[LOGGER] = logger;
    }

    start(name) {
        if (!name) return;

        if (this[MAP].has(name)) this.end(name);

        const start = Date.now();
        const item = {
            name,
            start,
            end: undefined,
            duration: undefined,
            pid: process.pid,
            index: this[INDEX].length,
        };
        this[MAP].set(name, item);
        this[INDEX]++;
        return item;
    }

    end(name) {
        if (!name) return;
        assert(this[MAP].has(name), `should run timing.start('${name}') first`);

        const item = this[MAP].get(name);
        item.end = Date.now();
        item.duration = item.end - item.start;

        const _self = this;
        item.toString = function() {
            const str = `[${_self.name}][Timing(${this.index}): ${this.name}] PID: ${this.pid}, Duration: ${this.duration}ms`;
            if (_self[LOGGER] && _self[LOGGER].test) {
                _self[LOGGER].test(str);
            }
            return str;
        };

        if (this[MAP].has(name)) {
            this[MAP].delete(name);
        }

        return item;
    }

    /**
     * Inspect implementation.
     *
     * @return {Object} json
     * @api private
     */
    inspect() {
        return this.toJSON();
    }

    toJSON() {
        return this[MAP];
    }
}

module.exports = Timing;
