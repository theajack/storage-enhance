/*
 * @Author: tackchen
 * @Date: 2021-12-14 08:34:06
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-22 22:52:48
 * @FilePath: /storage-enhance/src/convert/storage-type.ts
 * @Description: Coding something
 */
import {TStorageType} from 'src/type/constant';
import {TStorageDataType} from '../type/storage';
import {isUndf} from '../utils/util';
import {StorageEnv} from './storage-env';

let GlobalType: TStorageType = 'local';

export function setGlobalType (type: TStorageType) {
    GlobalType = type;
}

export function globalType () {
    return GlobalType;
}

const StorageTypeMap:{
    [prop in TStorageDataType]?: any
} = {
    date: Date,
    reg: RegExp,
};

if (StorageEnv === 'web') {
    StorageTypeMap.html = HTMLElement;
}

function storageTypeOfObject (value: object): TStorageDataType | '' {
    if (!value) {
        return 'null';
    }

    for (const type in StorageTypeMap) {
        const dataType = type as TStorageDataType;
        const Obj = StorageTypeMap[dataType];
        if (
            !isUndf(Obj) && value instanceof Obj
        ) {
            return dataType;
        }
    }

    return '';
}

export function storageTypeOf (value: any): TStorageDataType {
    const type = typeof value;
    if (type === 'object') {
        const dataType = storageTypeOfObject(value);
        if (dataType) return dataType;
    }
    return type;
}