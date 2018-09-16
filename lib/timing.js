'use strict';

const assert = require('assert');
const MAP = Symbol('Timing#map');
const LIST = Symbol('Timing#list');
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
        this[LIST] = [];
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
            index: this[LIST].length,
        };
        this[MAP].set(name, item);
        this[LIST].push(item);
        return item;
    }

    end(name) {
        if (!name) return;
        assert(this[MAP].has(name), `should run timing.start('${name}') first`);

        const item = this[MAP].get(name);
        item.end = Date.now();
        item.duration = item.end - item.start;

        if (this[LOGGER] && this[LOGGER].test) {
            this[LOGGER].test(`[Timing(${item.index}): ${item.name}] PID: ${item.pid}, Duration: ${item.duration}ms`);
        }

        return item;
    }

    /**
     * Inspect implementation.
     *
     * @return {Object} json
     * @api public
     */
    inspect() {
        return this.toJSON();
    }

    toJSON() {
        return this[LIST];
    }
}

module.exports = Timing;
