/*
 * @Author: tackchen
 * @Date: 2021-12-14 08:34:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-23 23:14:31
 * @FilePath: /storage-enhance/src/convert/storage-env.ts
 * @Description: Coding something
 */
import {TStorageEnv} from '../type/constant';
import {isWeb, isMiniApp} from '../utils/util';

export const StorageEnv: TStorageEnv = (() => {
    if (isWeb) return 'web';
    if (isMiniApp) return 'miniapp';
    return 'node';
})();

if (StorageEnv === 'web') {
    if (typeof require !== 'function') {
        window.require = (() => {})as any;
    }
}

export const IsWeb = StorageEnv === 'web';