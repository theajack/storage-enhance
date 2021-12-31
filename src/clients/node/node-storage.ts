/*
 * @Author: tackchen
 * @Date: 2021-12-15 14:57:03
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/clients/node/node-storage.ts
 * @Description: Coding something
 */
import {StorageEnv} from '../../convert/storage-env';
import {IBaseStorage, IStorageKeyArg, TGetReturn} from '../../type/storage';
import {IFS, IPath} from '../../type/node';
import {EMPTY} from '../../utils/constant';
import {parseStorageValue} from '../../utils/util';
import {IJson} from 'src/type/util';

let fs: IFS = {} as IFS;
let path: IPath = {} as IPath;
if (StorageEnv === 'node') {
    fs = require('fs');
    path = require('path');
}

const StoreDir = '/storage-enhance-node';
const HomePath = process.env.HOME || process.env.USERPROFILE || '/';

if (StorageEnv === 'node') {
    const storeDirPath = path.resolve(HomePath, `.${StoreDir}`);
    if (!fs.existsSync(storeDirPath)) {
        fs.mkdirSync(storeDirPath);
    }
}

export const NodeStorege: IBaseStorage = {
    name: 'node',
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
        const value = readFileBase({key, path});
        return parseStorageValue(value);
    },
    set ({key, value, path}) {
        const filePath = buildFilePath({key, path});
        console.log(filePath);
        fs.writeFileSync(filePath, JSON.stringify(value));
        return true;
    },
    remove ({key, path}) {
        const filePath = buildFilePath({key, path});
        if (fs.existsSync(filePath)) {
            try {
                fs.rmSync(checkRemoveFilePath(filePath));
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    },
    all ({path} = {}) {
        const keys = this.keys({path});
        const data: IJson<TGetReturn> = {};
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            data[key] = parseStorageValue(
                readFileBase({key, check: false, filePath: resolvePath(key, path)})
            );
        }
        return data;
    },
    clear ({path} = {}) {
        const filePath = buildFilePath({key: '', path});
        if (fs.existsSync(filePath)) {
            try {
                console.log(filePath);
                removeDir(filePath);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }
        console.log(filePath);
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
    if (key) {key = `/${key}.json`;}
    return path.resolve(HomePath, `.${StoreDir}${filePath}${key}`);
}

function removeDir (dirPath: string) {
    const fileList = fs.readdirSync(dirPath);
    for (let i = 0, length = fileList.length; i < length; i++) {
        const fileName = fileList[i];
        const index = fileName.lastIndexOf('.json');
        const filePath = `${dirPath}/${fileName}`;
        if (index !== -1) { // 可以用.json 来判断是否是文件 是因为path中的点都没替换成空了
            fs.rmSync(checkRemoveFilePath(filePath));
        } else {
            removeDir(filePath);
            fs.rmdirSync(checkRemoveFilePath(filePath));
        }
    }
}

function checkRemoveFilePath (filePath: string) {
    if (filePath.indexOf(StoreDir) === -1) {
        throw new Error(`Invaild Removed FilePath:${filePath}`);
    }
    return filePath;
}