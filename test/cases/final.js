/*
 * @Author: tackchen
 * @Date: 2021-12-30 08:54:45
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-30 08:56:32
 * @FilePath: /storage-enhance/test/cases/final.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试final',
    test ({storage}) {
        const key = 'final-k1';
        const value = this.expect;
        storage.set({key, value, final: true});
        storage.set({key, value: 'new value'});
        return storage.get({key});
    },
    expect: 'event final test',
}];