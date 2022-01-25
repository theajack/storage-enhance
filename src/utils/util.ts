/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-24 09:13:31
 * @FilePath: /storage-enhance/src/utils/util.ts
 * @Description: Coding something
 */

import {IStorageData, TGetReturn, TStorageOriginData} from 'src/type/storage';
import {IJson} from '../type/util';
import {EMPTY} from './constant';

export const isWeb = (() => {
    return typeof window === 'object' && !!window && !isUndf(window.localStorage);
})();

export const isMiniApp = (() => {
    return typeof wx === 'object' && !!wx;
})();

export function isUndf (v: any) {
    return typeof v === 'undefined';
}

export function deepClone (value: any) {
    if (value === null || typeof value !== 'object') return value;
    const objClone: IJson = Array.isArray(value) ? [] : {};
    for (const key in value) {
        if (value.hasOwnProperty(key)) {
            objClone[key] = deepClone(value[key]);
        }
    }
    return objClone;
}

export function parseJSON (value: string) : object | null {
    try {
        return JSON.parse(value);
    } catch (e) {
        return null;
    }
}

export function countExpiresWithMs (ms: number): number {
    return Date.now() + ms;
}

export function parseStorageValue (value: TStorageOriginData): TGetReturn {
    if (value === null || typeof value === 'symbol') return EMPTY;
    const data = parseJSON(value);
    if (data === null) return value;
    return data as IStorageData;
}

export function isValidStorageData (data: TGetReturn) {
    return typeof data === 'object';
}