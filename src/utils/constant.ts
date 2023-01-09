/*
 * @Author: tackchen
 * @Date: 2021-12-12 15:56:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 17:14:23
 * @FilePath: /storage-enhance/src/utils/constant.ts
 * @Description: Coding something
 */
import {IJson} from '../type/util';
import {TStorageEnv, TStorageType} from '../type/constant';

export const EMPTY = Symbol('storage-empty');

export const STORAGE_TYPE: IJson<TStorageType> = {
    LOCAL: 'local',
    SESSION: 'session',
    TEMP: 'temp',
    COOKIE: 'cookie',
};

export const STORAGE_ENV: {
    [prop: string]: TStorageEnv
} = {
    WEB: 'web',
    NODE: 'node',
    MINIAPP: 'miniapp',
};