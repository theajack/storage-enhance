/*
 * @Author: tackchen
 * @Date: 2022-01-08 15:32:27
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-08 22:59:29
 * @FilePath: /storage-enhance/test/cases/api.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 keys',
    test ({storage}) {
        const value = 'value';
        storage.clear();
        storage.set({key: 'k1', value});
        storage.set({key: 'k2', value, path: '/p1'});
        return [storage.keys().sort(), storage.keys({path: '/p1'})];
    },
    expect: [['k1', 'k2'].sort(), ['k2']],
}, {
    name: '测试 length',
    test ({storage}) {
        const value = 'value';
        storage.clear();
        storage.set({key: 'k1', value});
        storage.set({key: 'k2', value});
        return storage.length();
    },
    expect: 2
}, {
    name: '测试 clear',
    test ({storage}) {
        const value = 'value';
        storage.set({key: 'k1', value});
        storage.set({key: 'k2', value});
        storage.clear();
        return storage.length();
    },
    expect: 0
}, {
    name: '测试 remove',
    test ({storage}) {
        const key = 'k1';
        const value = 'value';
        storage.set({key, value, path: '/p1'});
        storage.remove({key});
        return storage.get({key});
    },
    expect ({storage}) {
        return storage.EMPTY;
    }
}, {
    name: '测试 exist',
    test ({storage}) {
        const key = 'k1';
        const value = 'value';
        storage.clear();
        storage.set({key, value});
        storage.set({key: 'k2', value, path: '/p1'});
        return [storage.exist({key}), storage.exist({key: 'k2'})];
    },
    expect: [true, false]
}];