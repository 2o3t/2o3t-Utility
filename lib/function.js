'use strict';

const is = require('is-type-of');
const co = require('co');

/**
 * A empty function. 空方法
 *
 * @public
 */
exports.noop = function noop() {};

/**
 * Get a function parameter's names. 获取方法的形参
 *
 * @param {Function} func 方法
 * @param {Boolean} [useCache], default is true
 * @return {Array} names
 */
exports.getParamNames = function getParamNames(func, useCache) {
    const cache = useCache !== false;
    if (cache && func.__cache_names) {
        return func.__cache_names;
    }
    const str = func.toString();
    const names = str.slice(str.indexOf('(') + 1, str.indexOf(')')).match(/([^\s,]+)/g) || [];
    func.__cache_names = names;
    return names;
};

/**
 * 异步封装
 *
 * @param {Function} fn 方法
 * @param {Array} args 参数
 * @param {Object} ctx 上下文
 * @return {Promise} function
 */
exports.callFn = async function(fn, args, ctx) {
    args = args || [];
    if (!is.function(fn)) return;
    if (is.generatorFunction(fn)) fn = co.wrap(fn);
    return ctx ? fn.call(ctx, ...args) : fn(...args);
};
