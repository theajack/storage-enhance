/*
 * @Author: tackchen
 * @Date: 2021-12-30 08:43:38
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-30 08:58:16
 * @FilePath: /storage-enhance/src/options/final.ts
 * @Description: Coding something
 */

import {IStoragePlugin} from '../type/plugin';

export const FinalPlugin: IStoragePlugin = {
    name: 'final',
    set ({options, data, prevData}) {
        if (typeof prevData === 'object') {
            if (prevData.final === true) {
                console.warn(`Final 类型禁止设置新的值：${options.key}`);
                return false;
            }
        }
        if (typeof options.final === 'boolean') {
            data.final  = options.final;
        }
        return data;
    },
};
