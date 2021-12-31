/*
 * @Author: tackchen
 * @Date: 2021-12-12 15:58:46
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-22 22:45:37
 * @FilePath: /storage-enhance/src/type/constant.d.ts
 * @Description: Coding something
 */

export type TStorageType = 'local' | 'session' | 'temp' | 'cookie';

export type TStorageEnv = 'web' | 'node' | 'miniapp';

export type TStorageName = TStorageEnv | 'cookie' | 'temp';