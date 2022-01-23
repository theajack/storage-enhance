/*
 * @Author: tackchen
 * @Date: 2022-01-08 12:38:55
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-22 22:51:12
 * @FilePath: /storage-enhance/test/cases/path.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 path',
    test ({storage, isWebCookie}) {
        const key = 'path-k1';
        if (isWebCookie()) {
            // ! cookie 获取不到其他path下的数据
            return [this.expect[0], storage.get({key})];
        }
        const value = this.expect[0];
        const path = '/path/test';
        storage.set({key, value, path});
        return [storage.get({key, path}), storage.get({key})];
    },
    expect ({storage}) {
        return ['storage path test', storage.EMPTY];
    },
}, {
    name: '测试 pathStrict',
    test ({storage}) {
        const key = 'path-k2';
        const value = 'storage pathStrict test';
        const path = '/path/test';
        storage.set({key, value, path});
        return storage.get({key, path, pathStrict: true});
    },
    expect ({storage}) {
        return storage.EMPTY;
    },
}, {
    name: '测试 pathStrict',
    test ({storage}) {
        storage.clear({protect: true});
        const key = 'path-k2';
        const value = 'storage pathStrict test';
        const path = '/path/test';
        storage.set({key, value});
        storage.set({key, value, path});
        return storage.keys({key, path, pathStrict: true});
    },
    expect ({storage}) {
        return storage.EMPTY;
    },
}];