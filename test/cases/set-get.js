/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-07 15:04:29
 * @Description: Coding something
 */

function buildGetSetCommonCase (name, expect, {resultHandle, expectHandle} = {}) {
    return {
        name,
        test ({storage}) {
            const key = 'set-get-key';
            storage.set({key, value: expect});
            const result = storage.get({key});
            if (resultHandle) {
                return resultHandle(result);
            }
            return result;
        },
        expect: expectHandle ? expectHandle(expect) : expect,
    };
}

const isWeb = typeof window !== 'undefined';

const cases = [
    buildGetSetCommonCase('测试 string', 'string test'),
    buildGetSetCommonCase('测试 number', 100),
    buildGetSetCommonCase('测试 boolean', true),
    buildGetSetCommonCase('测试 object', {a: 11}),
    buildGetSetCommonCase('测试 array', [1, 2, 3]),
    buildGetSetCommonCase('测试 symbol', Symbol('aa'), {
        expectHandle: expect => expect?.toString()
    }),
    buildGetSetCommonCase('测试 Date', new Date()),
    buildGetSetCommonCase('测试 func', function add (x, y) {return x + y;}, {
        resultHandle: result => typeof result === 'function' ? result(4, 6) : null,
        expectHandle: expect => typeof expect === 'function' ? expect(3, 7) : null,
    }),
    buildGetSetCommonCase('测试 reg', /a[b|c]/g),
];

isWeb && buildGetSetCommonCase('测试 HTML', document.createElement('div'));

module.exports = cases;