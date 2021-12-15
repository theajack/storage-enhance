/*
 * @Author: tackchen
 * @Date: 2021-12-13 08:24:30
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-15 09:01:56
 * @FilePath: /storage-enhance/src/convert/converter.ts
 * @Description: Coding something
 */

import {TStorageType} from '../type/constant';
import {IStorageData} from '../type/storage';
import {storageTypeOf} from './storage-type';
import {convertValue} from './value-convert';

export function setDataConvert ({
    value, storageType = 'local'
}: {
    value: any,
    storageType?: TStorageType,
}): IStorageData {
    const type = storageTypeOf(value);
    return {
        type,
        value: storageType === 'temp' ?
            value :
            convertValue({type, value, oprate: 'set'})
    };
}

export function getDataConvert ({
    value, storageType = 'local'
}: {
    value: IStorageData,
    storageType?: TStorageType,
}): any {
    return storageType === 'temp' ?
        value.value :
        convertValue({
            type: value.type,
            value: value.value,
            oprate: 'get'
        });
}

