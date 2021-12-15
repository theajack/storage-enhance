/*
 * @Author: tackchen
 * @Date: 2021-12-15 15:28:33
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/public/node-storage.js
 * @Description: Coding something
 */

const fs = require('fs');
const path = require('path');
// const md5 = require('./md5');

const homePath = process.env.HOME || process.env.USERPROFILE;
console.log(homePath);

const storeDir = '/storage-enhance-node';

const storeDirPath = path.resolve(homePath, `.${storeDir}`);

if (!fs.existsSync(storeDirPath)) {
    fs.mkdirSync(storeDirPath);
}

function buildFilePath ({key, path: filePath = ''}) {
    if (filePath.indexOf('.') !== -1) {
        filePath.replace(/\./g, '');
    }
    if (filePath) {
        const pathArr = filePath.split('/');
        let mkdir = '';
        for (let i = 0; i < pathArr.length; i++) {
            if (!pathArr[i]) {continue;}
            mkdir += `/${pathArr[i]}`;
            const mkdirPath = path.resolve(homePath, `.${storeDir}${mkdir}`);
            if (!fs.existsSync(mkdirPath)) {
                fs.mkdirSync(mkdirPath);
            }
        }
    }

    const file = key ? `/${encodeURIComponent(key)}.json` : '';
    return path.resolve(homePath, `.${storeDir}${filePath}${file}`);
}

function writeData ({key, path, value}) {
    const filePath = buildFilePath({key, path});
    
    fs.writeFileSync(filePath, JSON.stringify(value));
}

// writeData({key: 'aaaa', path: '/aa/bb', value: {a: 2}});

function readData ({key, path}) {
    const filePath = buildFilePath({key, path});
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return null;
}

function removeData ({key, path}) {
    const filePath = buildFilePath({key, path});
    if (fs.existsSync(filePath)) {
        try {
            fs.rmSync(filePath);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

function removePath ({path}) {
    const filePath = buildFilePath({key: '', path});
    if (fs.existsSync(filePath)) {
        try {
            fs.rmdirSync(filePath);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}
function resolvePath (key, filePath = '') {
    return path.resolve(homePath, `.${storeDir}${filePath}${key}.json`);
}

function findKeys ({path}) {
    const filePath = buildFilePath({key: '', path});
    return findKeysBase('', filePath, []);
}

function findKeysBase (base, filePath, keys) {
    const fileList = fs.readdirSync(filePath);
    for (let i = 0, length = fileList.length; i < length; i++) {
        const fileName = fileList[i];
        const index = fileName.lastIndexOf('.json');
        if (index !== -1) { // 可以用.json 来判断是否是文件 是因为path中的点都没替换成空了
            keys.push(`${base}/${fileName.substring(0, index)}`);
        } else {
            findKeysBase(`${base}/${fileName}`, path.resolve(filePath, fileName), keys);
        }
    }
    return keys;
}

function exist ({key, path}) {
    const filePath = buildFilePath({key, path});
    return fs.existsSync(filePath);
}
// console.log(exist({key: 'b4', path: '/aa/bb'}));

// console.log(findKeys({path: '/aa/bb'}));


const key = (findKeys({path: '/aa/bb'}))[0];
console.log(resolvePath(key, '/aa/bb'));
console.log(fs.readFileSync(resolvePath(key, '/aa/bb'), 'utf-8'));

// console.log(removeData({key: 'aaaa', path: '/aa/bb', value: {a: 2}}));
// console.log(removePath({path: '/aa/bb'}));

// console.log(readData({key: 'aaaa', path: '/aa/bb'}));
// fs.mkdirSync(path.resolve(homePath, `./aa`));
// fs.mkdirSync(path.resolve(homePath, `./aa/bb`));

// console.log(encodeURIComponent(' 2 #@!%$%$@$#^$-\\/1'));

// console.log(fs.existsSync(path.resolve(homePath, `./aa/bb`)));
// console.log(path.resolve(homePath, `./`));
