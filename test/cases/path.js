/*
 * @Author: tackchen
 * @Date: 2022-01-08 12:38:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 19:12:04
 * @FilePath: /storage-enhance/test/cases/path.js
 * @Description: Coding something
 */

module.exports = [];

// module.exports = [{
//     name: '测试 path',
//     test ({storage, isWebCookie}) {
//         const key = 'path-k1';
//         if (isWebCookie()) {
//             // ! cookie 获取不到其他path下的数据
//             return this.expect[0];
//         }
//         const value = this.expect[0];
//         const path = '/path/test';
//         storage.set({key, value, path});
//         return storage.get({key});
//     },
//     expect ({storage}) {
//         return storage.EMPTY;
//     },
// }, {
//     name: '测试 enablePath',
//     test ({storage, isWebCookie}) {
//         const key = 'path-k2';
//         const value = this.expect;
//         if (isWebCookie()) {
//             return value;
//         }
//         const path = '/path/test';
//         storage.set({key, value, path});
//         return storage.get({key, path, enablePath: true});
//     },
//     expect: 'storage pathStrict test'
// }];