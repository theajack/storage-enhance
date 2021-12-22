/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:14
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-22 09:15:41
 * @FilePath: /storage-enhance/src/adapter.ts
 * @Description: Coding something
 */

import {MiniAppStorage} from './clients/miniapp/miniapp-storage';
import {WebStorage} from './clients/web/web-storage';
import {NodeStorege} from './clients/node/node-storage';
import {getDataConvert, setDataConvert} from './convert/converter';
import {StorageEnv} from './convert/storage-env';
import {globalType, setGlobalType} from './convert/storage-type';
import {TempStorege} from './temp/temp-storage';
import {TStorageEnv, TStorageType} from './type/constant';
import {IBaseStorage, IStorage} from './type/storage';
import {IJson} from './type/util';
import {EMPTY} from './utils/constant';
import {executePluginsGet, executePluginsSet, getPlugins, usePlugin} from './plugin';
import {TimesPlugin} from './options/times';

const StorageMap: {
    [prod in TStorageEnv]: IBaseStorage
} = {
    'web': WebStorage,
    'miniapp': MiniAppStorage,
    'node': NodeStorege,
};

const BaseStorage: IBaseStorage = StorageMap[StorageEnv];

function getFinalBaseStorage (type: TStorageType = globalType()): IBaseStorage {
    return (type === 'temp' || (StorageEnv !== 'web' && type !== 'local')) ? TempStorege : BaseStorage; // 除了web之外 session 采用 temp 替代
}

export const Storage: IStorage = {
    use: usePlugin,
    plugins: getPlugins,
    env: StorageEnv,
    type: (type) => {
        if (type) {
            setGlobalType(type);
        } else {
            return globalType();
        }
    },
    length: ({type, path} = {}) => getFinalBaseStorage(type).length({type, path}),
    clear: ({type, path} = {}) => getFinalBaseStorage(type).clear({type, path}),
    keys: ({type, path} = {}) => getFinalBaseStorage(type).keys({type, path}),
    remove: ({key, type, path}) => {
        if (key === '') {return true;}
        return getFinalBaseStorage(type).remove({key, type, path});
    },
    exist: ({key, type, path}) => {
        if (key === '') {return false;}
        return getFinalBaseStorage(type).exist({key, type, path});
    },
    
    get (options) {
        const {key, path, type = 'local'} = options;

        if (key === '') {return EMPTY;}
        const storage = getFinalBaseStorage(type);
        let data = storage.get({key, type, path});
        if (typeof data === 'string' || typeof data === 'symbol') return data;
        
        data = executePluginsGet({options, data, storage});
        if (typeof data === 'symbol') return EMPTY;

        return getDataConvert({storageType: type, data});
    },
    set (options) {
        const {key, value, path, type = 'local'} = options;

        if (key === '') {return false;}
        let data = setDataConvert({data: value, storageType: type});
        const storage = getFinalBaseStorage(type);

        const setResult = executePluginsSet({options, data, storage});
        if (typeof setResult === 'boolean') return setResult;
        data = setResult;

        return storage.set({key, value: data, path, type});
    },
    all ({type, path} = {}) {
        const keys = this.keys({type, path});
        const data:IJson = {};
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            data[key] = this.get({key, type, path});
        }
        return data;
    },
};

Storage.use(TimesPlugin);