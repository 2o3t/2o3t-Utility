'use strict';

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// only set once.
let TIMEZONE = ' ';
let _hourOffset = parseInt(-(new Date().getTimezoneOffset()) / 60, 10);
if (_hourOffset >= 0) {
    TIMEZONE += '+';
} else {
    TIMEZONE += '-';
}
_hourOffset = Math.abs(_hourOffset);
if (_hourOffset < 10) {
    _hourOffset = '0' + _hourOffset;
}
TIMEZONE += _hourOffset + '00';

/**
 * Access log format date. format: `moment().format('DD/MMM/YYYY:HH:mm:ss ZZ')`
 *
 * @param {Date} d, 日期
 * @return {String} 'DD/MMM/YYYY:HH:mm:ss ZZ'
 */
exports.accessLogDate = function(d) {
    // 16/Apr/2013:16:40:09 +0800
    d = d || new Date();
    let date = d.getDate();
    if (date < 10) {
        date = '0' + date;
    }
    let hours = d.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    let mintues = d.getMinutes();
    if (mintues < 10) {
        mintues = '0' + mintues;
    }
    let seconds = d.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return date + '/' + MONTHS[d.getMonth()] + '/' + d.getFullYear() +
    ':' + hours + ':' + mintues + ':' + seconds + TIMEZONE;
};

/**
 * Normal log format date. format: `moment().format('YYYY-MM-DD HH:mm:ss.SSS')`
 *
 * @param {Date} d, 日期
 * @param {String} msSep, 毫秒的分隔符
 * @return {String} YYYY-MM-DD HH:mm:ss.SSS
 */
exports.logDate = exports.YYYYMMDDHHmmssSSS = function(d, msSep) {
    if (typeof d === 'string') {
    // logDate(msSep)
        msSep = d;
        d = new Date();
    } else {
    // logDate(d, msSep)
        d = d || new Date();
    }
    let date = d.getDate();
    if (date < 10) {
        date = '0' + date;
    }
    let month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let hours = d.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    let mintues = d.getMinutes();
    if (mintues < 10) {
        mintues = '0' + mintues;
    }
    let seconds = d.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    let milliseconds = d.getMilliseconds();
    if (milliseconds < 10) {
        milliseconds = '00' + milliseconds;
    } else if (milliseconds < 100) {
        milliseconds = '0' + milliseconds;
    }
    return d.getFullYear() + '-' + month + '-' + date + ' ' +
    hours + ':' + mintues + ':' + seconds + (msSep || '.') + milliseconds;
};

/**
 * `moment().format('YYYY-MM-DD HH:mm:ss')` format date string.
 *
 * @param {Date} d, 日期
 * @param {Object} options, { dateSep, timeSep } 分隔符
 * @return {String} YYYY-MM-DD HH:mm:ss
 */
exports.YYYYMMDDHHmmss = function(d, options) {
    d = d || new Date();
    if (!(d instanceof Date)) {
        d = new Date(d);
    }

    let dateSep = '-';
    let timeSep = ':';
    if (options) {
        if (options.dateSep) {
            dateSep = options.dateSep;
        }
        if (options.timeSep) {
            timeSep = options.timeSep;
        }
    }
    let date = d.getDate();
    if (date < 10) {
        date = '0' + date;
    }
    let month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let hours = d.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    let mintues = d.getMinutes();
    if (mintues < 10) {
        mintues = '0' + mintues;
    }
    let seconds = d.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return d.getFullYear() + dateSep + month + dateSep + date + ' ' +
    hours + timeSep + mintues + timeSep + seconds;
};

/**
 * `moment().format('YYYY-MM-DD')` format date string.
 *
 * @param {Date} d, 日期
 * @param {String} sep, 分隔符
 * @return {String} YYYY-MM-DD
 */
exports.YYYYMMDD = function YYYYMMDD(d, sep) {
    if (typeof d === 'string') {
    // YYYYMMDD(sep)
        sep = d;
        d = new Date();
    } else {
    // YYYYMMDD(d, sep)
        d = d || new Date();
        if (typeof sep !== 'string') {
            sep = '-';
        }
    }
    let date = d.getDate();
    if (date < 10) {
        date = '0' + date;
    }
    let month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    return d.getFullYear() + sep + month + sep + date;
};

/**
 * return datetime struct.
 *
 * @param {Date} now, 时间（选填）
 * @return {Object} date
 *  - {Number} YYYYMMDD, 20130401
 *  - {Number} H, 0, 1, 9, 12, 23
 */
exports.datestruct = function(now) {
    now = now || new Date();
    return {
        YYYYMMDD: now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate(),
        H: now.getHours(),
    };
};

/**
 * Get Unix's timestamp in seconds.
 *
 * @param {String|Number} t, 时间戳转日期（选填）
 * @return {Number} Unix's timestamp
 */
exports.timestamp = function timestamp(t) {
    if (t) {
        let v = t;
        if (typeof v === 'string') {
            v = Number(v);
        }
        if (String(t).length === 10) {
            v *= 1000;
        }
        return new Date(v);
    }
    return Math.round(Date.now() / 1000);
};
