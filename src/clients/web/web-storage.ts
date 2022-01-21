/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-21 09:02:31
 * @FilePath: /storage-enhance/src/clients/web/web-storage.ts
 * @Description: Coding something
 */

import {globalType} from '../../convert/storage-type';
import {TStorageType} from '../../type/constant';
import {IKeyPathPair, IKeyPathReturnPair, IStorageTypeArg} from '../../type/storage';
import {IBaseStorage} from '../../type/storage';
import {buildFinalKey, buildPathStorageKey, formatStorageKeys, parseStorageValue} from '../../utils/util';

function getWebStorageKeys ({type, path}: IStorageTypeArg): IKeyPathPair[] {
    const keys = Object.keys(getStorageType(type));
    if (!path) return formatStorageKeys(keys);
    const originKeys = keys.filter(key => (key.indexOf(path as string) === 0));
    return formatStorageKeys(originKeys);
}

export const WebStorage: IBaseStorage = {
    name: 'web',
    length ({type, path} = {}) {
        const storage = getStorageType(type);
        if (!path)
            return storage.length;
        return Object.keys(storage).filter(key => key.indexOf(path) === 0).length;
    },
    keys ({type, path} = {}) {
        return getWebStorageKeys({type, path});
    },
    get ({key, type, path}) {
        key = buildPathStorageKey({key, path});
        const value = getStorageType(type).getItem(key);
        return parseStorageValue(value);
    },
    set ({key, value, type, path}) {
        try {
            key = buildPathStorageKey({key, path});
            getStorageType(type).setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    remove ({key, type, path}) {
        try {
            key = buildPathStorageKey({key, path});
            getStorageType(type).removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },
    clear ({type, path} = {}) {
        try {
            if (!path) {
                getStorageType(type).clear();
            } else {
                const keys = this.keys({path, type});
                for (let i = 0, length = keys.length; i < length; i++) {
                    const {key, path} = keys[i];
                    this.remove({key, path, type});
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    all ({type, path} = {}) {
        const data: IKeyPathReturnPair[] = [];
        const keys = getWebStorageKeys({type, path});

        const storage = getStorageType(type);
        for (let i = 0, length = keys.length; i < length; i++) {
            const {key, path} = keys[i];
            const finalKey = buildFinalKey({key, path});
            const value = storage.getItem(finalKey);
            const storageData = parseStorageValue(value);

            data.push({
                key,
                path,
                value: storageData
            });
        }
        return data;
    },
    exist ({key, type, path}) {
        key = buildPathStorageKey({key, path});
        return getStorageType(type).hasOwnProperty(key);
    }
};

window.wstorage = WebStorage;

function getStorageType (type: TStorageType = globalType()): Storage {
    return type === 'local' ? window.localStorage : window.sessionStorage;
}