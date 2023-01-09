/*
 * @Author: tackchen
 * @Date: 2021-12-21 11:12:05
 * @LastEditors: Please set LastEditors
 * @FilePath: /storage-enhance/src/plugins/times.ts
 * @Description: Coding something
 */

import {EMPTY} from '../utils/constant';
import {IStoragePlugin} from '../type/plugin';
import {Storage} from '../adapter';

export const TimesPlugin: IStoragePlugin = {
    name: 'times',
    get ({options, data, storage, key}) {
        if (typeof data.times !== 'number') return data;
        if (data.times <= 1) {
            Storage.remove(options);
            if (data.times < 1) {
                return EMPTY;
            }
        } else {
            data.times -= 1;
            storage.set({
                key,
                value: data
            });
        }
        return data;
    },
    set ({options, data}) {
        if (options.once) {options.times = 1;}
        const {times} = options;

        if (typeof times === 'number') {
            if (times === 0) {
                return false;
            }
            data.times = times;
        }
        return data;
    }
};