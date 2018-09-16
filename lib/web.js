'use strict';

/**
 * Escape the given string of `html`.
 * 转义 html
 * var html = escapeHtml('foo & bar');
 * -> foo &amp; bar
 *
 * @param {String} html
 * @return {String}
 * @public
 */
exports.escape = require('escape-html');


/**
 * Unescape the given string from html
 * 转回 html
 * decode('&lt;div&gt;abc&lt;/div&gt;');
 * => '<div>abc</div>'
 *
 * @param {String} html
 * @param {String} type
 * @return {String}
 * @public
 */
exports.unescape = require('unescape');

/**
 * Safe encodeURIComponent, won't throw any error.
 * If `encodeURIComponent` error happen, just return the original value.
 *
 * @param {String} text url
 * @return {String} URL encode string.
 */
exports.encodeURIComponent = function encodeURIComponent_(text) {
    try {
        return encodeURIComponent(text);
    } catch (e) {
        return text;
    }
};

/**
 * Safe decodeURIComponent, won't throw any error.
 * If `decodeURIComponent` error happen, just return the original value.
 *
 * @param {String} encodeText URL encode string.
 * @return {String} URL decode original string.
 */
exports.decodeURIComponent = function decodeURIComponent_(encodeText) {
    try {
        return decodeURIComponent(encodeText);
    } catch (e) {
        return encodeText;
    }
};
