/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-17 17:53:41
 * @FilePath: /storage-enhance/src/clients/miniapp/miniapp-storage.ts
 * @Description: Coding something
 */

import {IJson} from '../../type/util';
import {IBaseStorage} from '../../type/storage';
import {buildPathStorageKey, formatStorageKeys} from '../../utils/util';

export const MiniAppStorage: IBaseStorage = {
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
                    this.remove({key: keys[i]});
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    all ({path} = {}) {
        const data: IJson<string | null> = {};
        const keys = this.keys({path});
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            data[key] = this.get({key});
        }
        return data;
    },
    exist ({key, path}) {
        return this.keys({path}).indexOf(key) !== -1;
    }
};