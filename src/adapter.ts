/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:14
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-15 15:01:49
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
import {IBaseStorage, IStorage, IStorageData} from './type/storage';
import {IJson} from './type/util';
import {paserJSON} from './utils/util';

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
    env: StorageEnv,
    type: (type) => {
        if (type) {
            setGlobalType(type);
        } else {
            return globalType();
        }
    },
    length: ({type} = {}) => getFinalBaseStorage(type).length({type}),
    clear: ({type} = {}) => getFinalBaseStorage(type).clear({type}),
    keys: ({type} = {}) => getFinalBaseStorage(type).keys({type}),
    remove: ({key, type}) => getFinalBaseStorage(type).remove({key, type}),
    exist: ({key, type}) => getFinalBaseStorage(type).exist({key, type}),
    
    get ({key, type}) {
        const storage = getFinalBaseStorage(type);
        const value = storage.get({key, type});
        if (type === 'temp' || StorageEnv === 'miniapp') { // 这两种都可以直接存储对象
            return getDataConvert({storageType: type, data: value});
        } else {
            const data = paserJSON(value) as (IStorageData | null);
            if (!data) {
                return value;
            }
            return getDataConvert({storageType: type, data});
        }
    },
    set ({key, value, type = 'local'}) {
        const storageValue = setDataConvert({data: value, storageType: type});
        const storage = getFinalBaseStorage(type);
        if (type === 'temp' || StorageEnv === 'miniapp') { // 这两种都可以直接存储对象
            return storage.set({key, value: storageValue, type});
        } else {
            return storage.set({key, value: JSON.stringify(storageValue), type});
        }
    },
    all ({type} = {}) {
        const keys = this.keys({type});
        const data:IJson = {};
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            data[key] = this.get({key, type});
        }
        return data;
    },
};