/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:47:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 18:31:47
 * @FilePath: /storage-enhance/src/clients/miniapp/miniapp-storage.ts
 * @Description: Coding something
 */

import {IBaseStorage, IKeyValuePair} from '../../type/storage';

export const MiniAppStorage: IBaseStorage = {
    name: 'miniapp',
    count () {
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
        const data: IKeyValuePair[] = [];
        const keys = this.keys();
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            const storageData = this.get({key});
            data.push({
                key,
                value: storageData
            });
        }
        return data;
    },
    exist ({key}) {
        return this.keys().indexOf(key) !== -1;
    }
};