/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-21 08:46:45
 * @FilePath: /storage-enhance/src/clients/miniapp/miniapp-storage.ts
 * @Description: Coding something
 */

import {IBaseStorage, IKeyPathReturnPair} from '../../type/storage';
import {buildPathStorageKey, formatStorageKeys} from '../../utils/util';

export const MiniAppStorage: IBaseStorage = {
    name: 'miniapp',
    length ({path} = {}) {
        return this.keys({path}).length;
    },
    keys ({path} = {}) {
        const keys = wx.getStorageInfoSync().keys;
        if (!path) return formatStorageKeys(keys);
        return formatStorageKeys(keys.filter(key => key.indexOf(path) === 0));
    },
    get ({key, path}) {
        key = buildPathStorageKey({key, path});
        return wx.getStorageSync(key);
    },
    set ({key, value, path}) {
        try {
            key = buildPathStorageKey({key, path});
            wx.setStorageSync(key, value);
            return true;
        } catch (e) {
            return false;
        }
    },
    remove ({key, path}) {
        try {
            key = buildPathStorageKey({key, path});
            wx.removeStorageSync(key);
            return true;
        } catch (e) {
            return false;
        }
    },
    clear ({path} = {}) {
        try {
            if (!path) {
                wx.clearStorageSync();
            } else {
                const keys = this.keys({path});
                for (let i = 0, length = keys.length; i < length; i++) {
                    const {key, path} = keys[i];
                    this.remove({key, path});
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    all ({path} = {}) {
        const data: IKeyPathReturnPair[] = [];
        const keys = this.keys({path});
        for (let i = 0, length = keys.length; i < length; i++) {
            const {key, path} = keys[i];
            const storageData = this.get({key, path});
            data.push({
                key,
                path,
                value: storageData
            });
        }
        return data;
    },
    exist ({key, path}) {
        const keys = this.keys({path}).map(item => item.key);
        return keys.indexOf(key) !== -1;
    }
};