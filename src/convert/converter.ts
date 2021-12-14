/*
 * @Author: tackchen
 * @Date: 2021-12-13 08:24:30
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-14 08:54:59
 * @FilePath: /storage-enhance/src/convert/converter.ts
 * @Description: Coding something
 */

import {TStorageType} from '../type/constant';
import {IStorageData} from '../type/storage';
import {storageTypeOf} from './storage-type';
import {convertValue} from './value-convert';

export function setDataConvert ({
    value, type
}: {
    value: any,
    type: TStorageType,
}): IStorageData {
    const dataType = storageTypeOf(value);
    return {
        type: dataType,
        value: type === 'temp' ?
            value :
            convertValue({dataType, value, oprate: 'set'})
    };
}

export function getDataConvert ({
    value, type
}: {
    value: IStorageData,
    type: TStorageType,
}): any {
    return type === 'temp' ?
        value.value :
        convertValue({
            dataType: value.type,
            value: value.value,
            oprate: 'get'
        });
}

