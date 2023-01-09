"use strict";
/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-24 09:13:31
 * @FilePath: /storage-enhance/src/utils/util.ts
 * @Description: Coding something
 */
exports.__esModule = true;
exports.isValidStorageData = exports.parseStorageValue = exports.countExpiresWithMs = exports.parseJSON = exports.deepClone = exports.isUndf = exports.isMiniApp = exports.isWeb = void 0;
var constant_1 = require("./constant");
exports.isWeb = (function () {
    return typeof window === 'object' && !!window && !isUndf(window.localStorage);
})();
exports.isMiniApp = (function () {
    return typeof wx === 'object' && !!wx;
})();
function isUndf(v) {
    return typeof v === 'undefined';
}
exports.isUndf = isUndf;
function deepClone(value) {
    if (value === null || typeof value !== 'object')
        return value;
    var objClone = Array.isArray(value) ? [] : {};
    for (var key in value) {
        if (value.hasOwnProperty(key)) {
            objClone[key] = deepClone(value[key]);
        }
    }
    return objClone;
}
exports.deepClone = deepClone;
function parseJSON(value) {
    try {
        return JSON.parse(value);
    }
    catch (e) {
        return null;
    }
}
exports.parseJSON = parseJSON;
function countExpiresWithMs(ms) {
    return Date.now() + ms;
}
exports.countExpiresWithMs = countExpiresWithMs;
function parseStorageValue(value) {
    if (value === null || typeof value === 'symbol')
        return constant_1.EMPTY;
    var data = parseJSON(value);
    if (data === null)
        return value;
    return data;
}
exports.parseStorageValue = parseStorageValue;
function isValidStorageData(data) {
    return typeof data === 'object';
}
exports.isValidStorageData = isValidStorageData;
