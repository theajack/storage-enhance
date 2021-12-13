/*
 * @Author: tackchen
 * @Date: 2021-12-12 15:56:05
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-12 16:03:41
 * @FilePath: /storage-enhance/src/constant.ts
 * @Description: Coding something
 */
import {TStorageEnv, TStorageType} from './type/constant';

export const STORAGE_TYPE: {
    [prop: string]: TStorageType
} = {
    LOCAL: 'local',
    SESSION: 'session',
    TEMP: 'temp',
};

export const STORAGE_ENV: {
    [prop: string]: TStorageEnv
} = {
    WEB: 'web',
    NODE: 'node',
    MINIAPP: 'miniapp',
    TEMP: 'temp',
};