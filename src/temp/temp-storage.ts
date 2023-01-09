/*
 * @Author: tackchen
 * @Date: 2021-12-12 16:25:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 17:28:24
 * @FilePath: /storage-enhance/src/temp/temp-storage.ts
 * @Description: Coding something
 */

import {deepClone} from '../utils/util';
import {IBaseStorage} from '../type/storage';
import {IJson} from '../type/util';
import {EMPTY} from '../utils/constant';

let storageMap: IJson = {};

export const TempStorage: IBaseStorage = {
    name: 'temp',
    count () {
        return this.keys().length;
    },
    keys () {
        return Object.keys(storageMap);
    },
    exist ({key}) {
        return storageMap.hasOwnProperty(key);
    },
    get ({key}) {
        return this.exist({key}) ? deepClone(storageMap[key]) : EMPTY;
    },
    set ({key, value}) {
        storageMap[key] = deepClone(value);
        return true;
    },
    remove ({key}) {
        delete storageMap[key];
        return true;
    },
    all () {
        return deepClone(storageMap);
    },
    clear () {
        storageMap = {};
        return true;
    }
};