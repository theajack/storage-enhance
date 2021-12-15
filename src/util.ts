/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:32
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-15 08:01:21
 * @FilePath: /storage-enhance/src/util.ts
 * @Description: Coding something
 */
import './type/wx.d';
import {IJson} from './type/util';

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

export function paserJSON (value: string) : object | null {
    try {
        return JSON.parse(value);
    } catch (e) {
        return null;
    }
}