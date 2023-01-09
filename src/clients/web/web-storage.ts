/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 18:37:56
 * @FilePath: /storage-enhance/src/clients/web/web-storage.ts
 * @Description: Coding something
 */

import {globalType} from '../../convert/storage-type';
import {TStorageType} from '../../type/constant';
import {IKeyOriginValuePair, IStorageTypeArg} from '../../type/storage';
import {IBaseStorage} from '../../type/storage';

export const WebStorage: IBaseStorage = {
    name: 'web',
    count ({type} = {}) {
        return getStorageType(type).length;
    },
    keys ({type} = {}) {
        return getWebStorageKeys({type});
    },
    get ({key, type}) {
        return getStorageType(type).getItem(key);
    },
    set ({key, value, type}) {
        try {
            getStorageType(type).setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    remove ({key, type}) {
        try {
            getStorageType(type).removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },
    clear ({type} = {}) {
        try {
            getStorageType(type).clear();
            return true;
        } catch (e) {
            return false;
        }
    },
    all ({type} = {}) {
        const data: IKeyOriginValuePair[] = [];
        const keys = getWebStorageKeys({type});
        const storage = getStorageType(type);
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            data.push({
                key,
                value: storage.getItem(key)
            });
        }
        return data;
    },
    exist ({key, type}) {
        return getStorageType(type).hasOwnProperty(key);
    }
};

function getStorageType (type: TStorageType = globalType()): Storage {
    return type === 'local' ? window.localStorage : window.sessionStorage;
}

function getWebStorageKeys ({type}: IStorageTypeArg): string[] {
    return Object.keys(getStorageType(type));
}