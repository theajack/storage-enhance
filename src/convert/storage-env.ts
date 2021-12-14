/*
 * @Author: tackchen
 * @Date: 2021-12-14 08:34:32
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-14 08:57:33
 * @FilePath: /storage-enhance/src/convert/storage-env.ts
 * @Description: Coding something
 */
import {TStorageEnv} from '../type/constant';
import {isWeb, isMiniApp} from '../util';

export const StorageEnv: TStorageEnv = (() => {
    if (isWeb) return 'web';
    if (isMiniApp) return 'miniapp';
    return 'node';
})();