'use strict';

/**
 * 随机生成字符串
 *
 * @param  {Number} length 长度
 * @param  {String} [charSet] 可用字符串组
 * @return {String} 新字符串
 */
exports.randomString = function randomString(length, charSet) {
    const result = [];
    length = length || 16;
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    while (length--) {
        result.push(charSet[Math.floor(Math.random() * charSet.length)]);
    }
    return result.join('');
};

/**
 * split string to array
 * 增强分割，可去空
 *
 * @param  {String} str 字符串
 * @param  {String} [sep] 分隔符 default is ','
 * @return {Array} 新数组
 */
exports.split = function split(str, sep) {
    str = str || '';
    sep = sep || ',';
    const items = str.split(sep);
    const needs = [];
    for (let i = 0; i < items.length; i++) {
        const s = items[i].trim();
        if (s.length > 0) {
            needs.push(s);
        }
    }
    return needs;
};

/**
 * always optimized
 * split string to array
 * 增强分割，可去空
 *
 * @param  {String} str 字符串
 * @param  {String} [sep] 分隔符 default is ','
 * @return {Array} 新数组
 */
exports.splitAlwaysOptimized = function splitAlwaysOptimized() {
    let str = '';
    let sep = ',';
    if (arguments.length === 1) {
        str = arguments[0] || '';
    } else if (arguments.length === 2) {
        str = arguments[0] || '';
        sep = arguments[1] || ',';
    }
    const items = str.split(sep);
    const needs = [];
    for (let i = 0; i < items.length; i++) {
        const s = items[i].trim();
        if (s.length > 0) {
            needs.push(s);
        }
    }
    return needs;
};

/**
 * Replace string
 *
 * @param  {String} str, 字符串
 * @param  {String|RegExp} substr, 待替换字符
 * @param  {String|Function} newSubstr, 替换为字符
 * @return {String} 新字符串
 */
exports.replace = function replace(str, substr, newSubstr) {
    let replaceFunction = newSubstr;
    if (typeof replaceFunction !== 'function') {
        replaceFunction = function() {
            return newSubstr;
        };
    }
    return str.replace(substr, replaceFunction);
};

// original source https://github.com/nodejs/node/blob/v7.5.0/lib/_http_common.js#L300
/**
 * True if val contains an invalid field-vchar
 *  field-value    = *( field-content / obs-fold )
 *  field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 *  field-vchar    = VCHAR / obs-text
 *
 * checkInvalidHeaderChar() is currently designed to be inlinable by v8,
 * so take care when making changes to the implementation so that the source
 * code size does not exceed v8's default max_inlined_source_size setting.
 **/
const validHdrChars = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, // 0 - 15
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 32 - 47
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 48 - 63
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 80 - 95
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 112 - 127
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 128 ...
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // ... 255
];

/**
 * Replace invalid http header characters with replacement
 * 替换无效的 Http 头字符
 *
 * @param  {String} val 头字符
 * @param  {String|Function} replacement - can be `function(char)`
 * @return {Object} 结果集
 */
exports.replaceInvalidHttpHeaderChar = function replaceInvalidHttpHeaderChar(val, replacement) {
    replacement = replacement || ' ';
    let invalid = false;

    if (!val || typeof val !== 'string') {
        return {
            val,
            invalid,
        };
    }

    const replacementType = typeof replacement;
    let chars;
    for (let i = 0; i < val.length; ++i) {
        if (!validHdrChars[val.charCodeAt(i)]) {
            // delay create chars
            chars = chars || val.split('');
            if (replacementType === 'function') {
                chars[i] = replacement(chars[i]);
            } else {
                chars[i] = replacement;
            }
        }
    }

    if (chars) {
        val = chars.join('');
        invalid = true;
    }

    return {
        val,
        invalid,
    };
};

/**
 * Detect invalid http header characters in a string
 * 检测无效的 Http 头字符
 *
 * @param {String} val 头字符
 * @return {Boolean} true-有无效，false-没有
 */
exports.includesInvalidHttpHeaderChar = function includesInvalidHttpHeaderChar(val) {
    if (!val || typeof val !== 'string') {
        return false;
    }

    for (let i = 0; i < val.length; ++i) {
        if (!validHdrChars[val.charCodeAt(i)]) {
            return true;
        }
    }

    return false;
};

/**
 * 重复叠加字符串
 *
 * @param {String} str 字符串
 * @param {Number} n 叠加次数
 * @return {String} 字符串
 */
exports.strTimes = function(str, n) {
    return Array.prototype.join.call({ length: n + 1 }, str);
};
