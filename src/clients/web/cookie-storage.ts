/*
 * @Author: tackchen
 * @Date: 2021-12-22 09:21:03
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-22 22:02:15
 * @FilePath: /storage-enhance/src/clients/web/cookie-storage.ts
 * @Description: Coding something
 */

import {EMPTY} from '../../utils/constant';
import {Cookie} from '../../utils/cookie';
import {parseStorageValue} from '../../utils/util';
import {IBaseStorage, IKeyPathReturnPair} from '../../type/storage';

export const CookieStorage: IBaseStorage = {
    name: 'cookie',
    length ({path} = {}) {
        if (!Cookie.checkPath(path)) return 0;
        return Cookie.getCookieValuePairs().length;
    },
    keys ({path} = {}) {
        if (!Cookie.checkPath(path)) return [];
        return Cookie.getCookieValuePairs().map(pair => {
            return {key: pair.split('=')[0].trim(), path: path || '/'};
        });
    },
    get ({key, path}) {
        if (!Cookie.checkPath(path)) return EMPTY; // ! cookie获取不到其他path的数据
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
    remove ({key, path, domain}) {
        return Cookie.remove({key, path, domain});
    },
    clear ({path, domain} = {}) {
        const keys = this.keys({path});
        for (let i = 0, length = keys.length; i < length; i++) {
            const {key, path} = keys[i];
            this.remove({key, path, domain});
        }
        return true;
    },
    all ({path} = {}) {
        const data: IKeyPathReturnPair[] = [];
        if (!Cookie.checkPath(path)) return data;
        Cookie.getCookieValuePairs().forEach(pair => {
            const pairArr = pair.split('=');
            data.push({
                key: pairArr[0].trim(),
                path: path || '/',
                value: parseStorageValue(decodeURIComponent(pairArr[1]))
            });
        });
        return data;
    },
    exist ({key}) {
        const keys = this.keys().map(item => item.key);
        return keys.indexOf(key) !== -1;
    }
};