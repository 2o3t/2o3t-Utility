'use strict';

/**
 * Module dependencies.
 *
 * @param {Object} [obj] - object
 * @param {String} [prop] - prop
 * @return {Boolean} true-Y, false-N
 */
exports.hasProp = function has(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

/**
 * generate a real map object(clean object), no constructor, no __proto__
 *
 * @param {Object} [obj] - init object, optional
 * @param {String|Array} [keys] - props
 * @return {Object} clean object
 */
exports.mapCleanObject = function mapCleanObject(obj, keys) {
    const map = new EmptyObject();
    if (!obj) {
        return map;
    }

    if (!keys) {
        for (const key in obj) {
            map[key] = obj[key];
        }
        return map;
    }

    if (typeof keys === 'string') keys = keys.split(/ +/);
    return keys.reduce(function(ret, key) {
        if (obj[key] == null) return ret;
        ret[key] = obj[key];
        return ret;
    }, map);
};


// faster way like `Object.create(null)` to get a 'clean' empty object
// https://github.com/nodejs/node/blob/master/lib/events.js#L5
// https://cnodejs.org/topic/571e0c445a26c4a841ecbcf1
function EmptyObject() {}
EmptyObject.prototype = Object.create(null);


/**
 * arguments to array
 *
 * @param {arguments} args - arguments
 * @param {Number} [start] - 开始索引
 * @return {Array} array
 */
exports.argumentsToArray = function argumentsToArray(args, start) {
    if (isNaN(start)) {
        start = 0;
    }
    return Array.prototype.slice.apply(args, start);
};

/**
 * copy Object
 * Forked from node-extend, the difference is overriding array as primitive when deep clone.
 *
 * @param {Boolean} deep - deep
 * @param {...Object} [object] - object
 * @return {Object} object
 */
exports.extend = require('./extend');


/**
 * 创建只读属性
 * @param {Object} obj o
 * @param {String|Number|Symbol} prop p
 * @param {*} value v
 * @param {Boolean} [enumerable=true] 是否可枚举
 * @return {*} v
 */
exports.createReadOnlyProp = function(obj, prop, value, enumerable = true) {
    return Object.defineProperty(obj, prop, {
        value,
        writable: false,
        configurable: false,
        enumerable,
    });
};


/**
 * avoid if (a && a.b && a.b.c)
 * 深挖对象
 *
 * @param {Object} obj 对象
 * @param {...String} keys 深挖参数
 * @return {Object} new
 */
exports.dig = function(obj) {
    if (!obj) {
        return;
    }
    if (arguments.length <= 1) {
        return obj;
    }

    let value = obj[arguments[1]];
    for (let i = 2; i < arguments.length; i++) {
        if (!value) {
            break;
        }
        value = value[arguments[i]];
    }

    return value;
};
