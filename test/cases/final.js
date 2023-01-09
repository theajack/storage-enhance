/*
 * @Author: tackchen
 * @Date: 2021-12-30 08:54:45
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-29 10:25:07
 * @FilePath: /storage-enhance/test/cases/final.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 final',
    test ({storage}) {
        const key = 'final-k1';
        const value = this.expect;
        storage.set({key, value, final: true});
        storage.set({key, value: 'new value'});
        return storage.get({key});
    },
    expect: 'storage final test',
}];