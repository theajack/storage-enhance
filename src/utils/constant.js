"use strict";
exports.__esModule = true;
exports.STORAGE_ENV = exports.STORAGE_TYPE = exports.EMPTY = void 0;
exports.EMPTY = Symbol('storage-empty');
exports.STORAGE_TYPE = {
    LOCAL: 'local',
    SESSION: 'session',
    TEMP: 'temp',
    COOKIE: 'cookie'
};
exports.STORAGE_ENV = {
    WEB: 'web',
    NODE: 'node',
    MINIAPP: 'miniapp'
};
