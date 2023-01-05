/*
 * @Author: tackchen
 * @Date: 2022-01-08 12:30:57
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-29 10:34:15
 * @FilePath: /storage-enhance/test/cases/times.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 once',
    test ({storage}) {
        const key = 'times-k1';
        const value = this.expect[0];
        storage.set({key, value, once: true});
        return [storage.get({key}).value, storage.get({key}).value];
    },
    expect ({storage}) {
        return ['storage onces test', storage.EMPTY];
    },
}, {
    name: '测试 times',
    test ({storage}) {
        const key = 'times-k2';
        const value = this.expect[0];
        storage.set({key, value, times: 3});
        storage.get({key});
        storage.get({key});
        return [storage.get({key}).value, storage.get({key}).value];
    },
    expect ({storage}) {
        return ['storage times test', storage.EMPTY];
    },
}];