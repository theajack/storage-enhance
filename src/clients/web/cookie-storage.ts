/*
 * @Author: tackchen
 * @Date: 2021-12-22 09:21:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-05 09:08:44
 * @FilePath: /storage-enhance/src/clients/web/cookie-storage.ts
 * @Description: Coding something
 */

import {Cookie} from '../../utils/cookie';
import {parseStorageValue} from '../../utils/util';
import {IBaseStorage, IKeyValuePair} from '../../type/storage';

export const CookieStorage: IBaseStorage = {
    name: 'cookie',
    length () {
        return Cookie.getCookieValuePairs().length;
    },
    keys () {
        return Cookie.getCookieValuePairs().map(pair => {
            return pair.split('=')[0].trim();
        });
    },
    get ({key}) {
        const value = Cookie.get({key});
        return parseStorageValue(value);
    },
    set ({key, value, path, cookie}) {
        try {
            Cookie.set({key, value: JSON.stringify(value), path, ...cookie});
            return true;
        } catch (e) {
            return false;
        }
    },
    remove ({key, domain}) {
        return Cookie.remove({key, domain});
    },
    clear ({domain} = {}) {
        const keys = this.keys();
        for (let i = 0, length = keys.length; i < length; i++) {
            const {key, path} = keys[i];
            this.remove({key, path, domain});
        }
        return true;
    },
    all () {
        const data: IKeyValuePair[] = [];
        Cookie.getCookieValuePairs().forEach(pair => {
            const pairArr = pair.split('=');
            data.push({
                key: pairArr[0].trim(),
                value: parseStorageValue(decodeURIComponent(pairArr[1]))
            });
        });
        return data;
    },
    exist ({key}) {
        const keys = this.keys();
        return keys.indexOf(key) !== -1;
    }
};