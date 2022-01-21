/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-21 09:04:02
 * @FilePath: /storage-enhance/src/utils/util.ts
 * @Description: Coding something
 */

import {IKeyPathPair, IStorageData, IStorageKeyArg, TGetReturn} from 'src/type/storage';
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

export function formatStorageKeys (keys: string[]): IKeyPathPair[] {
    return keys.map(key => formatStorageKey(key));
}

export function formatStorageKey (key: string): IKeyPathPair {
    const index = key.lastIndexOf('/');
    let path = key.substring(0, index);
    if (!path && index >= 0) path = '/';
    return {
        key: key.substring(index + 1),
        path
    };
}

export function buildFinalKey ({key, path}: IKeyPathPair): string {
    if (path === '/') return `/${key}`;
    if (path === '') return key;
    return `${path}/${key}`;
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
