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

/**
 * 格式化 json
 * @param {Object} json json对象
 * @param {Object} [options] 参数 {newlineAfterColonIfBeforeBraceOrBracket, spaceAfterColon}
 * @param {Boolean} [options.newlineAfterColonIfBeforeBraceOrBracket] 参数
 * @param {Boolean} [options.spaceAfterColon] 参数
 * @return {String} text
 */
exports.formatJson = function(json, options) {
    let reg = null,
        formatted = '',
        pad = 0;
    const PADDING = '    '; // one can also use '\t' or a different number of spaces
    // optional settings
    options = options || {};
    // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true);
    // use a space after a colon
    options.spaceAfterColon = options.spaceAfterColon !== false;

    // begin formatting...
    const replace = function(k, v) {
        if (typeof v === 'function') {
            const name = Object.prototype.toString.call(v)
                .replace('object ', '')
                .replace('[', '<')
                .replace(']', '>');
            if (v.name) {
                return name.replace('>', `:${v.name}>`);
            }
            return name;
        } else if (v === undefined) {
            return 'undefined';
        }
        return v;
    };

    // make sure we start with the JSON as a string
    if (typeof json !== 'string') {
        json = JSON.stringify(json, replace);
    }
    // parse and stringify in order to remove extra whitespace
    json = JSON.parse(json);
    json = JSON.stringify(json, replace);

    // add newline before and after curly braces
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline before and after square brackets
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline after comma
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');

    // remove multiple newlines
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');

    // remove newlines before commas
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');

    // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ': ');
    }

    Array.prototype.forEach.call(json.split('\r\n'), function(node, index) {
        let i = 0,
            indent = 0,
            padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }
        formatted += padding + node + '\r\n';
        pad += indent;
    });
    return formatted;
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
