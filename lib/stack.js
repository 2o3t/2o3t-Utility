'use strict';

const path = require('path');

/**
 * 获取堆栈信息
 *
 * @param {Boolean} withLine 是否带行号
 * @return {String} fileName
 */
exports.getCalleeFromStack = function(withLine) {
    const limit = Error.stackTraceLimit;
    const prep = Error.prepareStackTrace;

    Error.prepareStackTrace = prepareObjectStackTrace;
    Error.stackTraceLimit = 4;

    // capture the stack
    const obj = {};
    Error.captureStackTrace(obj);
    let callSite = obj.stack;
    let fileName;
    /* istanbul ignore else */
    if (callSite && callSite.length > 0) {
        callSite = Array.prototype.filter.call(callSite, site => {
            const fileName = site.getFileName();
            return !/^module\.js/igm.test(fileName)
            && !/^bootstrap_node\.js/igm.test(fileName)
            && !/^events\.js/igm.test(fileName)
            && /[\/|\\]/igm.test(fileName)
            && !site.isNative()
            && !fileName.endsWith('2o3t-Core/lib/app.js')
            ;
        });
        callSite = callSite.reverse()[0];
        fileName = callSite.getFileName();
    } else {
        callSite = null;
    }

    Error.prepareStackTrace = prep;
    Error.stackTraceLimit = limit;

    /* istanbul ignore if */
    if (!callSite || !fileName) return '<anonymous>';
    if (!withLine) return fileName;
    return `${fileName}:${callSite.getLineNumber()}:${callSite.getColumnNumber()}`;
};

/**
 * 获取堆栈信息组
 *
 * @param {Boolean} withLine 是否带行号
 * @param {Number} num 大小
 * @return {String} fileName
 */
exports.getCalleeFromStacks = function(withLine, num = 4) {
    const limit = Error.stackTraceLimit;
    const prep = Error.prepareStackTrace;

    Error.prepareStackTrace = prepareObjectStackTrace;
    Error.stackTraceLimit = num;

    // capture the stack
    const obj = {};
    Error.captureStackTrace(obj);
    let callSites = obj.stack;
    let fileNames;
    /* istanbul ignore else */
    if (callSites && callSites.length > 0) {
        callSites = Array.prototype.filter.call(callSites, site => {
            const fileName = site.getFileName();
            return !/^module\.js/igm.test(fileName)
            && !/^bootstrap_node\.js/igm.test(fileName)
            && !/^events\.js/igm.test(fileName)
            && /[\/|\\]/igm.test(fileName)
            && !site.isNative()
            ;
        });

        fileNames = callSites.map(site => {
            return site.getFileName();
        });
    } else {
        callSites = null;
    }

    Error.prepareStackTrace = prep;
    Error.stackTraceLimit = limit;

    /* istanbul ignore if */
    if (!callSites || !fileNames) return [ '<anonymous>' ];
    if (!withLine) return fileNames.reverse();

    return callSites.map(site => {
        const fileName = site.getFileName();
        return `${fileName}:${site.getLineNumber()}:${site.getColumnNumber()}`;
    }).reverse();
};

/**
 * 截取相对路径
 *
 * @param {String} filepath 文件路径
 * @param {String} baseDir 根
 * @return {String} 相对路径
 */
exports.getResolvedFilename = function(filepath, baseDir) {
    const reg = /[/\\]/g;
    return filepath.replace(baseDir + path.sep, '').replace(reg, '/');
};

/**
 * Capture call site stack from v8.
 * https://github.com/v8/v8/wiki/Stack-Trace-API
 */

function prepareObjectStackTrace(obj, stack) {
    return stack;
}
