module.exports = [{
    name: '测试string',
    test ({storage}) {
        const key = 'k1';
        const value = 'string test';
        storage.set({key, value});
        return storage.get({key});
    },
    expect: 'string test',
}, {
    name: '测试boolean',
    test ({storage}) {
        const key = 'k2';
        const value = true;
        storage.set({key, value});
        return storage.get({key});
    },
    expect: true,
}, {
    name: '测试boolean',
    test ({storage}) {
        const key = 'k2';
        const value = true;
        storage.set({key, value});
        return storage.get({key});
    },
    expect: true,
}];