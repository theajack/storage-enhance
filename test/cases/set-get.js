module.exports = {
    name: '测试times参数',
    test ({storage}) {
        storage.set({key: 'aaa', value: {a: 1}});
        return storage.get({key: 'aaa'});
    },
    expect: {a: 1},
};