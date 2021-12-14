/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-14 08:56:25
 * @FilePath: /storage-enhance/src/clients/web/web-storage.ts
 * @Description: Coding something
 */

import {TempStorege} from 'src/temp/temp-storage';
import {TStorageType} from 'src/type/constant';
import {IStorage, IStorageTypeArg} from '../../type/storage';


export const WebStorege: IStorage = {
    type: 'local',
    length ({type} = {}) {
        return getStorageType(type).length;
    },
    get ({key, type}) {
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