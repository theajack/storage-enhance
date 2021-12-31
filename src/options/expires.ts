/*
 * @Author: tackchen
 * @Date: 2021-12-17 18:50:16
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/options/expires.ts
 * @Description: Coding something
 */
/*
 * @Author: tackchen
 * @Date: 2021-12-21 11:12:05
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/options/times.ts
 * @Description: Coding something
 */

import {EMPTY} from '../utils/constant';
import {IStoragePlugin} from '../type/plugin';

function isDateTimeExpire (time: number) {
    return time < Date.now();
}

export const ExpiresPlugin: IStoragePlugin = {
    name: 'expires',
    get ({options, data, storage}) {
        if (storage.name === 'cookie') return data;
        
        if (typeof data.expires !== 'number') return data;
        if (isDateTimeExpire(data.expires)) {
            storage.remove(options);
            return EMPTY;
        }
        return data;
    },
    set ({options, data, storage}) {
        if (storage.name === 'cookie') {
            if (typeof options.expires === 'number') {
                if (typeof options.cookie === 'object') {
                    options.cookie.expires = options.expires;
                } else {
                    options.cookie = {expires: options.expires};
                }
            }
            return data;
        };

        if (typeof options.expires === 'number') {
            if (isDateTimeExpire(options.expires)) {
                return false;
            }
            data.expires = options.expires;
        }
        return data;
    }
};