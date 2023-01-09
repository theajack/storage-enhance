/*
 * @Author: tackchen
 * @Date: 2021-12-30 08:54:45
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-29 10:25:17
 * @FilePath: /storage-enhance/test/cases/protect.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 protect',
    test ({storage}) {
        const key = 'protect-k1';
        const value = this.expect;
        storage.set({key, value, protect: true});
        storage.remove({key});
        return storage.get({key});
    },
    expect: 'test protect result',
}];