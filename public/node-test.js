/*
 * @Author: tackchen
 * @Date: 2021-12-17 15:47:29
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/public/node-test.js
 * @Description: Coding something
 */

const storage = require('./node-dev.min');
const log = console.log;

// eslint-disable-next-line quotes
// const data = JSON.parse("{\"type\":\"string\",\"value\":\"1111\"}");

// console.log('------', data, typeof data);

// console.log(storage);

// storage.set({key: 'bb', value: '1111'});

// console.log(storage.get({key: 'bb'}));


// log(storage.get({key: 'bb'}));
// log(storage.clear());

// log(storage.get({key: 'bb'}));

storage.set({key: 'bb', value: 2121, path: '/b1'});