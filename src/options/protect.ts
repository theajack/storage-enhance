/*
 * @Author: tackchen
 * @Date: 2021-12-30 09:10:48
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-30 19:03:17
 * @FilePath: /storage-enhance/src/options/protect.ts
 * @Description: Coding something
 */

import {IStoragePlugin} from '../type/plugin';

export const ProtectPlugin: IStoragePlugin = {
    name: 'protect',
    set ({options, data}) {
        if (typeof options.protect === 'boolean') {
            data.protect  = options.protect;
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
