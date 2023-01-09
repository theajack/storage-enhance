"use strict";
exports.__esModule = true;
exports.IsWeb = exports.StorageEnv = void 0;
var util_1 = require("../utils/util");
exports.StorageEnv = (function () {
    if (util_1.isWeb)
        return 'web';
    if (util_1.isMiniApp)
        return 'miniapp';
    return 'node';
})();
if (exports.StorageEnv === 'web') {
    if (typeof require !== 'function') {
        window.require = (function () { });
    }
}
exports.IsWeb = exports.StorageEnv === 'web';
