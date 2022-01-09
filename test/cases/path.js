/*
 * @Author: tackchen
 * @Date: 2022-01-08 12:38:55
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-08 12:42:24
 * @FilePath: /storage-enhance/test/cases/path.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 path',
    test ({storage}) {
        const key = 'path-k1';
        const value = this.expect[0];
        const path = '/path/test';
        storage.set({key, value, path});
        return [storage.get({key, path}), storage.get({key})];
    },
    expect ({storage}) {
        return ['storage path test', storage.EMPTY];
    },
}];