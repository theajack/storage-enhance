/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-17 17:53:29
 * @FilePath: /storage-enhance/src/clients/web/web-storage.ts
 * @Description: Coding something
 */

import {globalType} from '../../convert/storage-type';
import {TStorageType} from '../../type/constant';
import {IJson} from '../../type/util';
import {IBaseStorage} from '../../type/storage';
import {buildPathStorageKey, formatStorageKeys} from '../../utils/util';


export const WebStorage: IBaseStorage = {
    length ({type, path} = {}) {
        const storage = getStorageType(type);
        if (!path)
            return storage.length;
        return Object.keys(storage).filter(key => key.indexOf(path) === 0).length;
    },
    keys ({type, path} = {}) {
        const keys = Object.keys(getStorageType(type));
        if (!path) return formatStorageKeys(keys);
        return formatStorageKeys(keys.filter(key => key.indexOf(path) === 0));
    },
    get ({key, type, path}) {
        key = buildPathStorageKey({key, path});
        return getStorageType(type).getItem(key);
    },
    set ({key, value, type, path}) {
        try {
            key = buildPathStorageKey({key, path});
            getStorageType(type).setItem(key, value);
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
                    this.remove({key: keys[i], type});
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    all ({type, path} = {}) {
        const data: IJson<string | null> = {};
        const storage = getStorageType(type);
        const keys = this.keys({type, path});
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            data[key] = storage.getItem(key);
        }
        return data;
    },
    exist ({key, type, path}) {
        key = buildPathStorageKey({key, path});
        return getStorageType(type).hasOwnProperty(key);
    }
};

function getStorageType (type: TStorageType = globalType()): Storage {
    return type === 'local' ? window.localStorage : window.sessionStorage;
}