'use strict';

const path = require('path');
const fs = require('mz').fs;

exports.loadFile = function loadFile(filepath) {
    try {
        // if not js module, just return content buffer
        const extname = path.extname(filepath);
        if (extname && !require.extensions[extname]) {
            return fs.readFileSync(filepath);
        }
        // require js module
        const obj = require(filepath);
        if (!obj) return obj;
        // it's es module
        if (obj.__esModule) return 'default' in obj ? obj.default : obj;
        return obj;
    } catch (err) {
        err.message = `[app-core] load file: ${filepath}, error: ${err.message}`;
        throw err;
    }
};

/**
 * 深度遍历获取目录+文件
 *
 * @param {String} rootPath 根目录
 * @param {Array|String} [ignore] 忽略的文件
 * @return {Array} files
 */
exports.mapDirs = function mapDirs(rootPath, ignore) {
    const temp = [];
    const result = [];
    while (rootPath && fs.existsSync(rootPath)) {
        const stat = fs.statSync(rootPath);
        if (stat.isFile()) {
            result.push(rootPath);
        } else if (stat.isDirectory()) {
            const fileList = fs.readdirSync(rootPath);

            fileList.filter(file => {
                if (ignore) {
                    if (Array.isArray(ignore) && ignore.includes(file)) {
                        return false;
                    }
                    return ignore === file;
                }
                return true;
            }).map(file => path.join(rootPath, file))
                .forEach(filePath => result.push(filePath));
            break;
        }
        rootPath = temp.shift();
    }
    return result;
};


/**
 * 深度遍历获取目录下的文件
 *
 * @param {String} rootPath 根目录
 * @param {Boolean} [deep=false] 深度
 * @param {Array|String} [ignore] 忽略的文件
 * @return {Array} files
 */
exports.mapDirsFileDepth = function mapDirsFileDepth(rootPath, deep = false, ignore) {
    if (fs.existsSync(rootPath)) {
        const stat = fs.statSync(rootPath);
        if (stat.isDirectory()) {
            const fileList = fs.readdirSync(rootPath);
            if (!deep) {
                return fileList.filter(file => {
                    if (ignore) {
                        if (Array.isArray(ignore) && ignore.includes(file)) {
                            return false;
                        }
                        return ignore === file;
                    }
                    return true;
                }).map(file => {
                    return path.join(rootPath, file);
                }).filter(filePath => {
                    return fs.statSync(filePath).isFile();
                });
            }
            return fileList.reduce((arr, file) => {
                if (ignore) {
                    if (Array.isArray(ignore) && ignore.includes(file) || ignore === file) {
                        return arr;
                    }
                }
                return Array.prototype.concat.call(arr, mapDirsFileDepth(path.join(rootPath, file), deep));
            }, []);
        } else if (stat.isFile()) {
            return rootPath;
        }
    }
    return [];
};

/**
 * 广度遍历获取目录下的文件
 *
 * @param {String} rootPath 根目录
 * @param {Boolean} [deep=false] 深度
 * @param {Array|String} [ignore] 忽略的文件
 * @return {Array} files
 */
exports.mapDirsFileBreadth = function mapDirsFileBreadth(rootPath, deep = false, ignore) {
    const temp = [];
    const result = [];
    while (rootPath && fs.existsSync(rootPath)) {
        const stat = fs.statSync(rootPath);
        if (stat.isFile()) {
            result.push(rootPath);
        } else if (stat.isDirectory()) {
            const fileList = fs.readdirSync(rootPath);

            if (!deep) {
                fileList.filter(file => {
                    if (ignore) {
                        if (Array.isArray(ignore) && ignore.includes(file)) {
                            return false;
                        }
                        return ignore === file;
                    }
                    return true;
                }).map(file => path.join(rootPath, file))
                    .filter(filePath => fs.statSync(filePath).isFile())
                    .forEach(filePath => result.push(filePath));
                break;
            }

            const len = fileList.length;
            for (let i = 0; i < len; i++) {
                const file = fileList[i];
                if (ignore) {
                    if (Array.isArray(ignore) && ignore.includes(file) || ignore === file) {
                        continue;
                    }
                }
                temp.push(path.join(rootPath, file));
            }
        }
        rootPath = temp.shift();
    }
    return result;
};

/**
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @return {Object} keys and values from src
*/
exports.parseKeyValue = function(src) {
    const obj = {};

    // convert Buffers before splitting into lines and processing
    src.toString().split('\n').forEach(function(line) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        // matched?
        if (keyValueArr != null) {
            const key = keyValueArr[1];

            // default undefined or missing values to empty string
            let value = keyValueArr[2] || '';

            // expand newlines in quoted values
            const len = value ? value.length : 0;
            if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
                value = value.replace(/\\n/gm, '\n');
            }

            // remove any surrounding quotes and extra spaces
            value = value.replace(/(^['"]|['"]$)/g, '').trim();

            obj[key] = value;
        }
    });

    return obj;
};

/**
 * 从数组中过滤返回存在的路径
 *
 * @param {Array|String} paths - 路径数组
 * @param {String} [baseDir] - 根路径
 * @return {Array|String} 绝对路径
*/
exports.existsSync = function(paths = [], baseDir = process.cwd()) {
    if (!Array.isArray(paths)) {
        const rp = path.join(baseDir, paths);
        return fs.existsSync(rp);
    }
    const filters = paths.map(p => {
        return path.join(baseDir, p);
    }).filter(rp => {
        return fs.existsSync(rp);
    });
    return filters;
};

/**
 * 从数组中过滤返回存在的文件路径
 *
 * @param {Array|String} paths - 路径数组
 * @param {String} [baseDir] - 根路径
 * @return {Array|String} 绝对的文件路径
*/
exports.existsFileSync = function(paths = [], baseDir = process.cwd()) {
    const rp = exports.existsSync(paths, baseDir);
    if (!Array.isArray(rp)) {
        if (fs.statSync(rp).isFile()) {
            return rp;
        }
        return null;
    }
    const filters = rp.filter(p => {
        return fs.statSync(p).isFile();
    });
    return filters;
};

/**
 * 判断处理名称字符，并返回处理后的数组
 *
 * @param {String} filepath - 路径名称
 * @param {String} [caseStyle=camel] - 风格（upper, lower, camel, modules）
 * @return {Array} 处理后的路径数组
*/
exports.defaultCamelize = function(filepath, caseStyle) {
    if (filepath.lastIndexOf('.') > 0) {
        filepath = filepath.substring(0, filepath.lastIndexOf('.'));
    }
    const properties = filepath.split('/');
    return properties.map(property => {
        if (caseStyle !== 'modules') {
            if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
                throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
            }
        } else {
            if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
                property = '$' + property;
            }
        }

        // use default camelize, will capitalize the first letter
        // foo_bar.js > FooBar
        // fooBar.js  > FooBar
        // FooBar.js  > FooBar
        // FooBar.js  > FooBar
        // FooBar.js  > fooBar (if lowercaseFirst is true)
        property = property.replace(/[_-][a-zA-Z]/ig, s => s.substring(1).toUpperCase());
        let first = property[0];
        switch (caseStyle) {
        case 'lower':
        case 'camel':
            first = first.toLowerCase();
            break;
        case 'upper':
            first = first.toUpperCase();
            break;
        case 'modules':
            first = first.toLowerCase();
            break;
        default:
            break;
        }
        return first + property.substring(1);
    });

};

/**
 * 判断处理名称字符，并返回处理后字符串
 *
 * @param {String} filePath - 路径名称
 * @param {String} [caseStyle=camel] - 风格（upper, lower, camel）
 * @param {String} [sep='_'] - 分隔符
 * @return {String} 处理后的字符串
*/
exports.defaultCamelize2Str = function(filePath, caseStyle, sep = '_') {
    const arr = exports.defaultCamelize(filePath, caseStyle);
    return arr.join(sep);
};
