'use strict';

/**
 * 数组中随机抽取指定数量.
 *
 * @param {Array} arr 数组
 * @param {Number} num, 新数组长度.
 * @return {Array} 新数组
 */
exports.randomSlice = function randomSlice(arr, num) {
    if (!num || num >= arr.length) {
        return arr.slice();
    }
    const index = Math.floor(Math.random() * arr.length);
    const a = [];
    for (let i = 0, j = index; i < num; i++) {
        a.push(arr[j++]);
        if (j === arr.length) {
            j = 0;
        }
    }
    return a;
};

/**
 * 从数组中移除一个存在的元素
 *
 * @param {Array} arr 数组
 * @param  {Number} index - remove element index
 * @return {Array} the array instance
 */
exports.spliceOne = function spliceOne(arr, index) {
    if (index < 0) {
        index = arr.length + index;
        // still negative, not found element
        if (index < 0) {
            return arr;
        }
    }

    // don't touch
    if (index >= arr.length) {
        return arr;
    }

    for (let i = index, k = i + 1, n = arr.length; k < n; i += 1, k += 1) {
        arr[i] = arr[k];
    }
    arr.pop();
    return arr;
};

/**
 * 数组去重复
 * @param {Array} array arr
 * @return {Array} new array
 */
exports.dedupeArray = function(array) {
    return Array.from(new Set(array));
};
