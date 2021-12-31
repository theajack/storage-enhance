/*
 * @Author: tackchen
 * @Date: 2021-12-23 17:04:22
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/test/cases/event.js
 * @Description: Coding something
 */
module.exports = [{
    name: '测试onGet名称',
    test ({storage}) {
        const key = 'onget-k1';
        const value = this.expect;
        storage.set({key, value, onGet: 'onGet'});
        return new Promise((resolve) => {
            storage.registScope('onGet', ({data}) => {
                resolve(data);
            });
            storage.get({key});
        });
    },
    expect: 'event get test',
}, {
    name: '测试onGet方法',
    test ({storage}) {
        const key = 'onget-k2';
        const value = this.expect;
        return new Promise((resolve) => {
            storage.registScope('onGet', (data) => {
                resolve(data);
            });
            storage.set({key, value, onGet: ({scope, data}) => {
                scope.onGet(data);
            }});
            storage.get({key});
        });
    },
    expect: 'event get function test',
}, {
    name: '测试onGet方法2',
    test ({storage}) {
        const key = 'onget-k3';
        const value = this.expect;
        storage.set({key, value, onGet: ({scope, data}) => {
            scope.k3 = data;
        }});
        storage.get({key});
        return storage.scope().k3;
    },
    expect: 'event get function test',
}, {
    name: '测试all onGet方法',
    test ({storage}) {
        const key = 'onget-k4';
        const value = this.expect;
        storage.set({key, value, onGet: ({scope, data}) => {
            scope.k4 = data;
        }});
        storage.all();
        return storage.scope().k4;
    },
    expect: 'event get all function test',
}];