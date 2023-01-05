/*
 * @Author: tackchen
 * @Date: 2021-12-30 08:54:45
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-08 22:53:22
 * @FilePath: /storage-enhance/test/cases/expires.js
 * @Description: Coding something
 */
const {delay} = require('../lib');

module.exports = [{
    name: '测试 expires',
    test ({storage}) {
        const key = 'expires-k1';
        const value = 'storage expires test';
        storage.set({key, value, expires: Date.now() + 300});
        return new Promise(resolve => {
            delay(400).then(() => {
                resolve(storage.get({key}).value);
            });
        });
    },
    expect ({storage}) {
        return storage.EMPTY;
    },
}];