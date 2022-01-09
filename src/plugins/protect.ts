/*
 * @Author: tackchen
 * @Date: 2021-12-30 09:10:48
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-08 23:19:11
 * @FilePath: /storage-enhance/src/plugins/protect.ts
 * @Description: Coding something
 */

import {IStoragePlugin} from '../type/plugin';

export const ProtectPlugin: IStoragePlugin = {
    name: 'protect',
    set ({options, data}) {
        if (typeof options.protect === 'boolean') {
            data.protect = options.protect;
        }
        return data;
    },

    remove ({prevData}) {
        if (typeof prevData === 'object') {
            return prevData.protect !== true;
        }
        return true;
    },
};
