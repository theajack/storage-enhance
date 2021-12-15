/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-15 15:23:56
 * @FilePath: /storage-enhance/src/clients/miniapp/miniapp-storage.ts
 * @Description: Coding something
 */

import {IJson} from '../../type/util';
import {IBaseStorage} from '../../type/storage';

export const MiniAppStorage: IBaseStorage = {
    length () {
        return this.keys().length;
    },
    keys () {
        return wx.getStorageInfoSync().keys;
    },
    get ({key}) {
        return wx.getStorageSync(key);
    },
    set ({key, value}) {
        try {
            wx.setStorageSync(key, value);
            return true;
        } catch (e) {
            return false;
        }
    },
    remove ({key}) {
        try {
            wx.removeStorageSync(key);
            return true;
        } catch (e) {
            return false;
        }
    },
    clear () {
        try {
            wx.clearStorageSync();
            return true;
        } catch (e) {
            return false;
        }
    },
    all () {
        const data: IJson<string | null> = {};
        const keys = this.keys();
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            data[key] = this.get({key});
        }
        return data;
    },
    exist ({key}) {
        return this.keys().indexOf(key) !== -1;
    }
};