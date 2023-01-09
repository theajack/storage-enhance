/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 23:39:01
 * @FilePath: /storage-enhance/src/adapter.ts
 * @Description: Coding something
 */

import {MiniAppStorage} from './clients/miniapp/miniapp-storage';
import {WebStorage} from './clients/web/web-storage';
import {NodeStorage} from './clients/node/node-storage';
import {getDataConvert, setDataConvert} from './convert/converter';
import {StorageEnv} from './convert/storage-env';
import {globalType, setGlobalType} from './convert/storage-type';
import {TempStorage} from './temp/temp-storage';
import {TStorageEnv, TStorageType} from './type/constant';
import {IStorageGetOption, IBaseStorage, IKeyValuePair, IStorage, IStorageData, IStorageSetOption, IStorageRemoveArg, IStorageKeyArg} from './type/storage';
import {EMPTY, STORAGE_TYPE} from './utils/constant';
import {executePluginsBeforeGet, executePluginsGet, executePluginsRemove, executePluginsSet, getPlugins, usePlugin} from './plugin';
import {TimesPlugin} from './plugins/times';
import {CookieStorage} from './clients/web/cookie-storage';
import {ExpiresPlugin} from './plugins/expires';
import {EventPlugin} from './plugins/event';
import {getScope, registScope} from './utils/scope';
import {FinalPlugin} from './plugins/final';
import {ProtectPlugin} from './plugins/protect';
import {isValidStorageData, parseStorageValue} from './utils/util';

const StorageMap: {
    [prod in TStorageEnv]: IBaseStorage
} = {
    'web': WebStorage,
    'miniapp': MiniAppStorage,
    'node': NodeStorage,
};

const BaseStorage: IBaseStorage = StorageMap[StorageEnv];

function getFinalBaseStorage (type: TStorageType = globalType()): IBaseStorage {
    // console.log(type);
    // return BaseStorage;
    if (StorageEnv === 'web' && type === 'cookie') return CookieStorage;
    return (type === 'temp' || (StorageEnv !== 'web' && type !== 'local')) ? TempStorage : BaseStorage; // 除了web之外 session 采用 temp 替代
}

function buildFinalCallback () {
    let finalCallback: null | Function = null;
    const onFinalData = (callback: Function) => {
        finalCallback = callback;
    };

    return {
        onFinalData,
        trigFinalData (finalData: any) {
            if (typeof finalCallback === 'function') (finalCallback as Function)(finalData);
        }
    };
}

export const Storage: IStorage = {
    EMPTY,
    use: usePlugin,
    plugins: getPlugins,
    registScope,
    scope: getScope,
    env: StorageEnv,
    TYPE: STORAGE_TYPE,
    get type () {return globalType();},
    set type (type) {setGlobalType(type);},
    count ({type} = {}) {
        const storage = getFinalBaseStorage(type);
        if (storage.name === 'cookie') return storage.count({type});
        return storage.keys({type}).length;
    },
    keys ({type} = {}) {
        return getFinalBaseStorage(type).keys({type});
    },
    clear (options = {}) {
        const {type, protect} = options;

        if (!protect) {
            const storage = getFinalBaseStorage(type);
            return storage.clear(options);
        }

        const keys = this.keys({type});

        let result = true;
        for (const key of keys) {
            if (!this.remove(key, options as any)) {
                result = false;
            }
        }
        return result;
    },
    remove: (key: string | IStorageRemoveArg, options: IStorageRemoveArg = {key: ''}) => {
        if (typeof key === 'object') {
            return Storage.remove(key.key, key);
        }
        const {type} = options;
        if (key === '') {return true;}
        options.key = key;
        const storage = getFinalBaseStorage(type);

        options = executePluginsBeforeGet({storage, options});
        key = options.key;

        const originData = storage.get({...options, key});
        debugger;
        const prevData = parseStorageValue(originData);

        if (typeof prevData !== 'string') {
            if (typeof prevData === 'symbol') {
                return true;
            }
            console.warn('[prev]', prevData, options, options);
            const result = executePluginsRemove({options, storage, prevData});
            if (result === false) return false;
        }
        return storage.remove({...options, key});
    },
    exist (arg: string | IStorageKeyArg, options: IStorageKeyArg = {key: ''}) {
        if (typeof arg === 'object') {
            return this.exist(arg.key, arg);
        }
        const {key, type} = options;
        return getFinalBaseStorage(type).exist({key, type});
    },
    
    set (
        arg: string|IStorageSetOption|IStorageSetOption[],
        value?: any,
        options: IStorageSetOption = {value: '', key: ''}
    ) {
        if (typeof arg === 'string') {
            const {type, cookie} = options;
            const key = arg;

            options.key = key;
    
            if (key === '') {return false;}
            const data = setDataConvert({data: value, storageType: type, ...cookie});
            const storage = getFinalBaseStorage(type);
    
            const originData = storage.get({key, type});
            const prevData = parseStorageValue(originData);
            
            const setResult = executePluginsSet({options, data, storage, prevData});
            if (typeof setResult === 'boolean') return setResult;
    
            console.log('executePluginsSet result', data);
            return storage.set({...options, key: options.key, value: setResult});
        }

        if (Array.isArray(arg)) {
            let result: boolean = true;
            for (const options of arg) {
                if (!this.set(options)) result = false;
            }
            return result;
        }
        
        if (typeof arg === 'object') {
            const {key, value} = arg;
            return this.set(key, value, arg);
        }

        throw new Error('Invalid set');
    },

    get (
        arg: string | IStorageGetOption | IStorageGetOption[]
    ) {
        if (Array.isArray(arg)) {
            const result: IKeyValuePair[] = [];
            for (const item of arg) {
                result.push(this.get(item));
            }
            return result;
        }
        if (typeof arg === 'object') {

            const {type, detail} = arg;
            if (arg.key === '') {return EMPTY;}

            const storage = getFinalBaseStorage(type);

            arg = executePluginsBeforeGet({storage, options: arg});

            const key = arg.key;

            const originData = storage.get({key, type});
            // console.log('BaseStorage', data);

            let data = parseStorageValue(originData);

            if (!isValidStorageData(data)) {return EMPTY;}

            data = data as IStorageData;
            const {onFinalData, trigFinalData} = buildFinalCallback();
            data = executePluginsGet({options: arg, data, storage, key, onFinalData});

            if (typeof data === 'symbol') {return EMPTY;}

            const finalData = getDataConvert({storageType: arg.type, data});
            trigFinalData(finalData);

            return detail ? data : finalData;
        }
        return this.get({key: arg});
    },
    all ({type, detail} = {}) {
        const keys = this.keys({type});
        return keys.map((key) => {
            return this.get({key, type, detail});
        });
    },
};

Storage.use(
    FinalPlugin,
    ProtectPlugin,
    TimesPlugin,
    ExpiresPlugin,
    EventPlugin
);