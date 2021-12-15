module.exports = {
    name: '测试times参数',
    test ({storage}) {
        console.log(storage);
        return [1, 2];
    },
    expect: [1, 2],
};