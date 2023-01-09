/*
 * @Author: tackchen
 * @Date: 2022-01-02 08:00:18
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-29 10:33:36
 * @FilePath: /storage-enhance/test/cases/remove.js
 * @Description: Coding something
 */
module.exports = [{
    name: '测试 remove',
    test ({storage}) {
        const key = 'remove-k1';
        const value = this.expect;
        storage.set({key, value, protect: false});
        storage.remove({key});
        return storage.get({key});
    },
    expect ({storage}) {
        return storage.EMPTY;
    },
}];