/*
 * @Author: tackchen
 * @Date: 2021-12-22 09:21:03
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-09 18:27:56
 * @FilePath: /storage-enhance/src/clients/web/cookie-storage.ts
 * @Description: Coding something
 */

import {IJson} from '../../type/util';
import {EMPTY} from '../../utils/constant';
import {Cookie} from '../../utils/cookie';
import {parseStorageValue} from '../../utils/util';
import {IBaseStorage, TGetReturn} from '../../type/storage';

export const CookieStorage: IBaseStorage = {
    name: 'cookie',
    length ({path} = {}) {
        if (!Cookie.checkPath(path)) return 0;
        return document.cookie.split(';').length;
    },
    keys ({path} = {}) {
        if (!Cookie.checkPath(path)) return [];
        return document.cookie.split(';').map(pair => {
            return pair.split('=')[0].trim();
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
        const keys = this.keys();
        for (let i = 0, length = keys.length; i < length; i++) {
            this.remove({key: keys[i], path, domain});
        }
        return true;
    },
    all ({path} = {}) {
        const data: IJson<TGetReturn> = {};
        if (!Cookie.checkPath(path)) return data;
        document.cookie.split(';').forEach(pair => {
            const pairArr = pair.split('=');
            data[pairArr[0].trim()] = parseStorageValue(pairArr[1]);
        });
        return data;
    },
    exist ({key}) {
        return this.keys().indexOf(key) !== -1;
    }
};