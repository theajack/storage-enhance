/*
 * @Author: tackchen
 * @Date: 2021-12-12 16:25:06
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-12 17:05:02
 * @FilePath: /storage-enhance/src/temp/temp-storage.ts
 * @Description: Coding something
 */

import {deepClone} from 'src/util';
import {
    IStorage,
} from '../type/storage';
import {IJson} from '../type/util';

let storageMap: IJson = {};

export const TempStorege: IStorage = {
    type: 'temp',
    length () {
        return Object.keys(storageMap).length;
    },
    exist ({key}) {
        return storageMap.hasOwnProperty(key);
    },
    get ({key}) {
        return this.exist({key}) ? deepClone(storageMap[key]) : null;
    },
    set ({key, value}) {
        storageMap[key] = deepClone(value);
        return true;
    },
    remove ({key}) {
        delete storageMap[key];
        return true;
    },
    all () {return deepClone(storageMap);},
    clear () {
        storageMap = {};
        return true;
    }
};