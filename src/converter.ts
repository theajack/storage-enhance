/*
 * @Author: tackchen
 * @Date: 2021-12-13 08:24:30
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-13 08:43:45
 * @FilePath: /storage-enhance/src/converter.ts
 * @Description: Coding something
 */

import {TStorageEnv, TStorageType} from './type/constant';
import {IJson} from './type/util';

export function setDataConvert ({
    key, value, type, env
}: {
    key: string | number,
    value: any,
    type: TStorageType,
    env: TStorageEnv,
}) {
    const data: IJson = {};
    const valueType = typeof value;
    if (env === 'temp') {
        data.value = value;
        data.type = valueType;
        return data;
    }
    if (valueType === 'function') { // 存储函数
        return `return ${valueType.toString()};`;
    }


    if (env === 'miniapp') { // 小程序可以的直接存储对象
        return value;
    }

    if (env === 'web' && value instanceof HTMLElement) {
        return;
    }

    if (env === 'node') {

    }
}

export function getDataConvert ({
    key, value, type, env
}: {
    key: string | number,
    value: number,
    type: TStorageType,
    env: TStorageEnv,
}) {
    
    if (env === 'temp') return value;
    const valueType = typeof value;
    if (valueType === 'function') { // 存储函数
        return `return ${valueType.toString()};`;
    }
    if (env === 'miniapp') { // 小程序可以的直接存储对象
        return value;
    }

    if (env === node) {

    }
}

export function formatKey (key: string | number) {
    return typeof key === 'number' ? key.toString() : key;
}
