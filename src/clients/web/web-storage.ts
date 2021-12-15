/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-15 08:52:09
 * @FilePath: /storage-enhance/src/clients/web/web-storage.ts
 * @Description: Coding something
 */

import {TStorageType} from 'src/type/constant';
import {IJson} from 'src/type/util';
import {IBaseStorage} from '../../type/storage';


export const WebStorage: IBaseStorage = {
    type: 'local',
    length ({type} = {}) {
        return getStorageType(type).length;
    },
    get ({key, type}) {
        return getStorageType(type).getItem(key);
    },
    set ({key, value, type}) {
        try {
            getStorageType(type).setItem(key, value);
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
        const data: IJson<string | null> = {};
        const storage = getStorageType(type);
        for (let i = 0, length = this.length({type}); i < length; i++) {
            const key = storage.key(i) || '';
            data[key] = storage.getItem(key);
        }
        return data;
    },
    exist ({key, type}) {
        return getStorageType(type).hasOwnProperty(key);
    }
};

function getStorageType (type: TStorageType = WebStorage.type): Storage {
    return type === 'local' ? window.localStorage : window.sessionStorage;
}