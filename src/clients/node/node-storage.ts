/*
 * @Author: tackchen
 * @Date: 2021-12-15 14:57:03
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/clients/node/node-storage.ts
 * @Description: Coding something
 */
import {StorageEnv} from '../../convert/storage-env';
import {IBaseStorage, IStorageKeyArg} from '../../type/storage';
import {IFS, IPath} from '../../type/node';
import {EMPTY} from '../../utils/constant';

let fs: IFS = {} as IFS;
let path: IPath = {} as IPath;
if (StorageEnv === 'node') {
    fs = require('fs');
    path = require('path');
}

const StoreDir = '/storage-enhance-node';
const HomePath = StorageEnv === 'node' ? (process.env.HOME || process.env.USERPROFILE || '') : '';

const storeDirPath = StorageEnv === 'node' ? path.resolve(HomePath, `.${StoreDir}`) : '';

if (StorageEnv === 'node') {
    if (!fs.existsSync(storeDirPath)) {
        fs.mkdirSync(storeDirPath);
    }
}

export const NodeStorege: IBaseStorage = {
    length ({path} = {}) {
        return this.keys({path}).length;
    },
    keys ({path} = {}) {
        const filePath = buildFilePath({key: '', path});
        return findKeysBase('', filePath, []);
    },
    exist ({key, path}) {
        const filePath = buildFilePath({key, path});
        return fs.existsSync(filePath);
    },
    get ({key, path}) {
        return readFileBase({key, path});
    },
    set ({key, value, path}) {
        const filePath = buildFilePath({key, path});
        fs.writeFileSync(filePath, JSON.stringify(value));
        return true;
    },
    remove ({key, path}) {
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
    },
    all ({path} = {}) {
        const keys = this.keys({path});
        return keys.map(key => {
            return readFileBase({key, check: false, filePath: resolvePath(key, path)});
        });
    },
    clear ({path} = {}) {
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
};

function resolvePath (key: string, filePath: string = '') {
    return path.resolve(HomePath, `.${StoreDir}${filePath}${key}.json`);
}

function readFileBase ({
    key, path, check = true, filePath
}: IStorageKeyArg & {check?: boolean, filePath?: string}) {
    filePath = filePath || buildFilePath({key, path});
    if (!check || fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return EMPTY;
}

function findKeysBase (base: string, filePath: string, keys: string[]) {
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

function buildFilePath ({key, path: filePath = ''}: IStorageKeyArg): string {
    key = encodeURIComponent(key);
    if (filePath) {
        const pathArr = filePath.split('/');
        let mkdir = '';
        for (let i = 0; i < pathArr.length; i++) {
            if (!pathArr[i]) {continue;}
            mkdir += `/${pathArr[i]}`;
            const mkdirPath = path.resolve(HomePath, `.${StoreDir}${mkdir}`);
            if (!fs.existsSync(mkdirPath)) {
                fs.mkdirSync(mkdirPath);
            }
        }
    }
    return path.resolve(HomePath, `.${StoreDir}${filePath}/${key}.json`);
}