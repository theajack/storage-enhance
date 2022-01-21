/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-09 18:42:59
 * @FilePath: /storage-enhance/src/utils/util.ts
 * @Description: Coding something
 */

import {IStorageData, IStorageKeyArg, TGetReturn} from 'src/type/storage';
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

export function buildPathStorageKey ({key, path}: IStorageKeyArg) {
    if (!path || path === '/') {path = '';}
    return `${path}/${encodeURIComponent(key)}`;
}

export function formatStorageKeys (keys: string[]) {
    return keys.map(key => formatStorageKey(key));
}

export function formatStorageKey (key: string) {
    return key.substring(key.lastIndexOf('/') + 1);
}

export function countExpiresWithMs (ms: number): number {
    return Date.now() + ms;
}

export function parseStorageValue (value: symbol | string | null): TGetReturn {
    if (value === null || typeof value === 'symbol') return EMPTY;
    const data = parseJSON(value);
    if (data === null) return value;
    return data as IStorageData;
}

export function addIntoAllData ({
    data,
    key,
    storageData,
}: {
    data: IJson<TGetReturn>;
    key: string;
    storageData: TGetReturn;
}) {
    if (typeof data[key] !== 'undefined' && typeof storageData === 'object') {
        if (typeof storageData.path === 'undefined' || storageData.path === '/') {
            debugger;
            const pathKey = `${(data[key] as IStorageData).path}/${key}`;
            data[pathKey] = data[key]; // ! 如果是跟目录且被占用了 则 将根目录交换出来
        } else {
            key = `${storageData.path}/${key}`;
        }
    }
    data[key] = storageData;
}