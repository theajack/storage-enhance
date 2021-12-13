/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-13 08:10:08
 * @FilePath: /storage-enhance/src/web/web-storage.ts
 * @Description: Coding something
 */

import {TempStorege} from 'src/temp/temp-storage';
import {TStorageType} from 'src/type/constant';
import {IStorage, IStorageTypeArg} from '../type/storage';


export const WebStorege: IStorage = {
    type: 'local',
    length ({type} = {}) {
        if (type === 'temp') {
            return TempStorege.length();
        }
        return getStorageType(type).length;
    },
    get ({key, type}) {
        if (type === 'temp') {
            return TempStorege.get({key});
        }
        return getStorageType(type).getItem(key);
    },

    // get(arg?: IStorageKeyArg): any;
    // set(arg?: IStorageValueArg): boolean;
    // remove(arg?: IStorageKeyArg): boolean;
    // all(arg?: IStorageTypeArg): IJson;
    // clear(arg?: IStorageTypeArg): boolean;
};

function getStorageType (type: TStorageType = WebStorege.type): Storage {
    return type === 'local' ? window.localStorage : window.sessionStorage;
}