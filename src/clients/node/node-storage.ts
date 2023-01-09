/*
 * @Author: tackchen
 * @Date: 2021-12-15 14:57:03
 * @LastEditors: Please set LastEditors
 * @FilePath: /storage-enhance/src/clients/node/node-storage.ts
 * @Description: Coding something
 */
import {StorageEnv} from '../../convert/storage-env';
import {IBaseStorage, IKeyValuePair} from '../../type/storage';
import {IFS, IPath} from '../../type/node';
import {EMPTY} from '../../utils/constant';
import {parseStorageValue} from '../../utils/util';

let fs: IFS = {} as IFS;
let path: IPath = {} as IPath;
let os: any = {};
if (StorageEnv === 'node') {
    fs = require('fs');
    path = require('path');
    os = require('os');
}


const StoreDir = '/storage-enhance-data';
let HomePath = '';
if (StorageEnv === 'node') {
    HomePath = os.homedir();
    const storeDirPath = path.resolve(HomePath, `.${StoreDir}`);
    if (!fs.existsSync(storeDirPath)) {
        fs.mkdirSync(storeDirPath);
    }
}

export const NodeStorage: IBaseStorage = {
    name: 'node',
    count () {
        return this.keys().length;
    },
    keys () {
        const filePath = buildFilePath();
        console.log(filePath);
        const fileList = fs.readdirSync(filePath);
        console.log(fileList);
        const keys: string[] = [];
        for (const item of fileList) {
            const index = item.lastIndexOf('.json');
            if (index !== -1) { // 可以用.json 来判断是否是文件 是因为path中的点都没替换成空了
                keys.push(item.substring(0, index));
            }
        }
        return keys;
    },
    exist ({key}) {
        const filePath = buildFilePath(key);
        return fs.existsSync(filePath);
    },
    get ({key}) {
        const value = readFileBase(key);
        return parseStorageValue(value);
    },
    set ({key, value}) {
        const filePath = buildFilePath(key);
        console.log(filePath);
        fs.writeFileSync(filePath, JSON.stringify(value));
        return true;
    },
    remove ({key}) {
        const filePath = buildFilePath(key);
        if (fs.existsSync(filePath)) {
            try {
                fs.rmSync(filePath);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    },
    all () {
        const keys = this.keys();
        const data: IKeyValuePair[] = [];
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            const storageData = parseStorageValue(readFileBase(key));
            data.push({
                key,
                value: storageData
            });
        }
        return data;
    },
    clear () {
        const filePath = buildFilePath();
        fs.rmdirSync(filePath);
        fs.mkdirSync(filePath);
        return true;
    }
};

function readFileBase (key: string) {
    const filePath = buildFilePath(key);
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(buildFilePath(key), 'utf-8');
    }
    return EMPTY;
}

function buildFilePath (key: string = ''): string {
    if (key) {key = `/${key}.json`;}
    return path.resolve(HomePath, `.${StoreDir}${key}`);
}
