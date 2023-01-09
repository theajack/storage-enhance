/*
 * @Author: tackchen
 * @Date: 2021-12-13 08:24:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 22:12:35
 * @FilePath: /storage-enhance/src/convert/converter.ts
 * @Description: Coding something
 */

import {TStorageType} from '../type/constant';
import {IStorageData} from '../type/storage';
import {storageTypeOf} from './storage-type';
import {convertValue} from './value-convert';

export function setDataConvert ({
    data, storageType = 'local'
}: {
    data: any;
    storageType?: TStorageType;
}): IStorageData {
    const type = storageTypeOf(data);
    const storageData: IStorageData = {
        type,
        value: storageType === 'temp' ?
            data :
            convertValue({type, data, oprate: 'set'})
    };
    return storageData;
}

export function getDataConvert ({
    data, storageType = 'local'
}: {
    data: IStorageData,
    storageType?: TStorageType,
}): any {
    return storageType === 'temp' ?
        data.value :
        convertValue({
            type: data.type,
            data: data.value,
            oprate: 'get'
        });
}

