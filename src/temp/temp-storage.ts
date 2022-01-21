/*
 * @Author: tackchen
 * @Date: 2021-12-12 16:25:06
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-09 18:25:47
 * @FilePath: /storage-enhance/src/temp/temp-storage.ts
 * @Description: Coding something
 */

import {addIntoAllData, deepClone} from '../utils/util';
import {
    IBaseStorage, IStorageData, TTempMapOprateType,
} from '../type/storage';
import {IJson} from '../type/util';
import {EMPTY} from '../utils/constant';

const PathSymbol = Symbol('path');

// 存储 tempStorage 的data
// /aa/bb/key => storageMap.aa.bb.key
let storageMap: IJson = {};

window.tempMap = storageMap;

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
                map[name] = {[PathSymbol]: true};
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

// 获取某个map里的所有key
function keysOfMap (map: IJson): string[] {
    const keys: string[] = [];
    traverseMap({
        map,
        callback: ({key}) => {
            keys.push(key);
        }
    });
    return keys;
}

function itemsOfMap (map: IJson): IJson<IStorageData> {
    const result: IJson<IStorageData> = {};
    traverseMap({
        map,
        callback: ({key, value}) => {
            addIntoAllData({data: result, key, storageData: value});
        },
    });
    return result;
}

function traverseMap ({
    map, callback
}: {
    map: IJson;
    callback: (opt:{key: string, value: any})=>void;
}) {
    const mapKeys = Object.keys(map);
    for (let i = 0, n = mapKeys.length; i < n; i++ ) {
        const key = mapKeys[i];
        if (isPathMap(map[key])) { // 如果是路径目录
            traverseMap({map: map[key], callback});
        } else {
            callback({key, value: map[key]});
        }
    }
}

function isPathMap (map: any): boolean {
    return !!map[PathSymbol];
}

export const TempStorege: IBaseStorage = {
    name: 'temp',
    length ({path} = {}) {
        return this.keys({path}).length;
    },
    keys ({path} = {}) {
        return keysOfMap(oprateStorageMap(path) as IJson);
    },
    exist ({key, path}) {
        const map = oprateStorageMap(path);
        return map.hasOwnProperty(key) && !isPathMap((map as IJson)[key]);
    },
    get ({key, path}) {
        return this.exist({key}) ? deepClone((oprateStorageMap(path) as IJson)[key]) : EMPTY;
    },
    set ({key, value, path}) {
        (oprateStorageMap(path, 'set') as IJson)[key] = deepClone(value);
        return true;
    },
    remove ({key, path}) {
        delete (oprateStorageMap(path) as IJson)[key];
        return true;
    },
    all ({path} = {}) {
        const map = oprateStorageMap(path) as IJson;
        return deepClone(itemsOfMap(map));
    },
    clear ({path} = {}) {
        return oprateStorageMap(path, 'clear') as boolean;
    }
};

window.TempStorege = TempStorege;