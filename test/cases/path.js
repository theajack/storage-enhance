/*
 * @Author: tackchen
 * @Date: 2022-01-08 12:38:55
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-29 11:13:13
 * @FilePath: /storage-enhance/test/cases/path.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 path',
    test ({storage, isWebCookie}) {
        const key = 'path-k1';
        if (isWebCookie()) {
            // ! cookie 获取不到其他path下的数据
            return this.expect[0];
        }
        const value = this.expect[0];
        const path = '/path/test';
        storage.set({key, value, path});
        return storage.get({key}).value;
    },
    expect ({storage}) {
        return storage.EMPTY;
    },
}, {
    name: '测试 enablePath',
    test ({storage, isWebCookie}) {
        const key = 'path-k2';
        const value = this.expect;
        if (isWebCookie()) {
            return value;
        }
        const path = '/path/test';
        storage.set({key, value, path});
        return storage.get({key, path, enablePath: true}).value;
    },
    expect: 'storage pathStrict test'
}];