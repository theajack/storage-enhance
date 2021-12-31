/*
 * @Author: tackchen
 * @Date: 2021-12-12 16:25:06
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-17 18:15:38
 * @FilePath: /storage-enhance/src/temp/temp-storage.ts
 * @Description: Coding something
 */

import {deepClone} from '../utils/util';
import {
    IBaseStorage, TTempMapOprateType,
} from '../type/storage';
import {IJson} from '../type/util';

let storageMap: IJson = {};

function oprateStorageMap (path: string = '', type: TTempMapOprateType = 'get'): IJson | boolean {
    if (!path || path === '/') {
        if (type === 'get' || type === 'set') {
            return storageMap;
        } else if (type === 'clear') {
            storageMap = {};
            return true;
        }
    };

    const arr = path.split('/');
    let map: IJson = storageMap;
    for (let i = 0, length = arr.length; i < length; i++) {
        const name = arr[i];
        if (!name) {continue;}
        if (!map[name]) {
            if (type === 'set') {
                map[name] = {};
            } else if (type === 'get') {
                return map;
            } else if (type === 'clear') {
                return false;
            }
        };
        if (type === 'clear' && i === length - 1) {
            delete map[name];
            return true;
        } else {
            map = map[name];
        }
    }
    return map;
}

export const TempStorege: IBaseStorage = {
    name: 'temp',
    length ({path} = {}) {
        return this.keys({path}).length;
    },
    keys ({path} = {}) {
        return Object.keys(oprateStorageMap(path));
    },
    exist ({key, path}) {
        return oprateStorageMap(path).hasOwnProperty(key);
    },
    get ({key, path}) {
        return this.exist({key}) ? deepClone((oprateStorageMap(path) as IJson)[key]) : null;
    },
    set ({key, value, path}) {
        (oprateStorageMap(path, 'set') as IJson)[key] = deepClone(value);
        return true;
    },
    remove ({key, path}) {
        delete (oprateStorageMap(path) as IJson)[key];
        return true;
    },
    all ({path} = {}) {return deepClone(oprateStorageMap(path));},
    clear ({path} = {}) {
        return oprateStorageMap(path, 'clear') as boolean;
    }
};