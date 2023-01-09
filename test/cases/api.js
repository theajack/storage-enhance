/*
 * @Author: tackchen
 * @Date: 2022-01-08 15:32:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 22:33:54
 * @FilePath: /storage-enhance/test/cases/api.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试 keys',
    test ({storage}) {
        const value = 'value';
        storage.clear({protect: true});
        storage.set({key: 'k1', value});
        storage.set({key: 'k2', value});

        return storage.keys().sort();
    },
    expect: ['k1', 'k2']
}, {
    name: '测试 count',
    test ({storage}) {
        const value = 'value';
        storage.clear({protect: true});
        storage.set({key: 'k1', value});
        storage.set({key: 'k2', value});
        return storage.count();
    },
    expect: 2
}, {
    name: '测试 clear',
    test ({storage}) {
        const value = 'value';
        storage.set({key: 'k1', value});
        storage.set({key: 'k2', value});
        storage.clear({protect: true});
        return storage.count();
    },
    expect: 0
}, {
    name: '测试 remove',
    test ({storage}) {
        const key = 'k1';
        const value = 'value';
        storage.set({key, value});
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
        storage.set({key: 'k2', value});
        return [storage.exist({key}), storage.exist({key: 'k2'})];
    },
    expect: [true, true]
}];