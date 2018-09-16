'use strict';

const fs = require('mz/fs');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * JSON 解析
 * @param {String} str JSON字符串
 * @return {Object} 对象
 * @public
 */
exports.strictJSONParse = function(str) {
    const obj = JSON.parse(str);
    if (!obj || typeof obj !== 'object') {
        throw new Error('JSON string is not object');
    }
    return obj;
};

/**
 * 同步读取 JSON 文件
 * @param {String} filepath json文件绝对路径
 * @return {Object} 对象
 * @public
 */
exports.readJSONSync = function(filepath) {
    if (!fs.existsSync(filepath)) {
        throw new Error(filepath + ' is not found');
    }
    return exports.strictJSONParse(fs.readFileSync(filepath));
};

/**
 * 同步写 JSON 文件
 *
 * @param {String} filepath json文件绝对路径
 * @param {String} str json内容
 * @param {Object} options 参数
 *  replacer (key: string, value: any)， A function that transforms the results.
 *  space， Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 * @public
 */
exports.writeJSONSync = function(filepath, str, options) {
    options = options || {};
    if (!('space' in options)) {
        options.space = 2;
    }

    mkdirp.sync(path.dirname(filepath));
    if (typeof str === 'object') {
        str = JSON.stringify(str, options.replacer, options.space) + '\n';
    }

    fs.writeFileSync(filepath, str);
};

/**
 * 读取 JSON 文件
 * @param {String} filepath json文件绝对路径
 * @return {Object} 对象
 * @public
 */
exports.readJSON = function(filepath) {
    return fs.exists(filepath)
        .then(function(exists) {
            if (!exists) {
                throw new Error(filepath + ' is not found');
            }
            return fs.readFile(filepath);
        })
        .then(function(buf) {
            return exports.strictJSONParse(buf);
        });
};

/**
 * 写 JSON 文件
 * @param {String} filepath json文件绝对路径
 * @param {String} str json内容
 * @param {Object} options 参数
 * @return {Promise} promise
 * @public
 */
exports.writeJSON = function(filepath, str, options) {
    options = options || {};
    if (!('space' in options)) {
        options.space = 2;
    }

    if (typeof str === 'object') {
        str = JSON.stringify(str, options.replacer, options.space) + '\n';
    }

    return mkdir(path.dirname(filepath))
        .then(function() {
            return fs.writeFile(filepath, str);
        });
};

function mkdir(dir) {
    return new Promise(function(resolve, reject) {
        mkdirp(dir, function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
