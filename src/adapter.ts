/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:14
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-08 23:26:23
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
import {IBaseStorage, IStorage, IStorageCommonSetOption, IStorageData, IStorageKeyArg, IStorageRemoveArg, TGetReturn} from './type/storage';
import {EMPTY} from './utils/constant';
import {executePluginsGet, executePluginsRemove, executePluginsSet, getPlugins, usePlugin} from './plugin';
import {TimesPlugin} from './plugins/times';
import {CookieStorage} from './clients/web/cookie-storage';
import {ExpiresPlugin} from './plugins/expires';
import {EventPlugin} from './plugins/event';
import {getScope, registScope} from './utils/scope';
import {FinalPlugin} from './plugins/final';
import {ProtectPlugin} from './plugins/protect';
import {IJson} from './type/util';

const StorageMap: {
    [prod in TStorageEnv]: IBaseStorage
} = {
    'web': WebStorage,
    'miniapp': MiniAppStorage,
    'node': NodeStorege,
};

const BaseStorage: IBaseStorage = StorageMap[StorageEnv];

function getFinalBaseStorage (type: TStorageType = globalType()): IBaseStorage {
    if (StorageEnv === 'web' && type === 'cookie') return CookieStorage;
    return (type === 'temp' || (StorageEnv !== 'web' && type !== 'local')) ? TempStorege : BaseStorage; // 除了web之外 session 采用 temp 替代
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
    type: (type) => {
        if (type) {
            setGlobalType(type);
        } else {
            return globalType();
        }
    },
    length: ({type, path} = {}) => getFinalBaseStorage(type).length({type, path}),
    clear (options = {}) {
        const {type, path, domain} = options;
        const storage = getFinalBaseStorage(type);

        const keys = this.keys(options);
        const protects: IJson<IStorageData> = {};
        for (let i = 0, length = keys.length; i < length; i++) { // 执行remove插件
            const key = keys[i];
            const {result, prevData} = onRemoveData({
                getOption: {key, type, path},
                storage,
                removeOption: {key, domain}
            });
            if (result === false && typeof prevData === 'object') {
                protects[key] = prevData;
            };
        }

        const clearResult = storage.clear({type, path, domain});

        for (const key in protects) { // 对remove失败的重新写入
            this.set({key, value: protects[key].value, type, path});
        }

        return clearResult;
    },
    keys: ({type, path} = {}) => getFinalBaseStorage(type).keys({type, path}),
    remove: (options) => {
        const {key, type, path, domain} = options;
        if (key === '') {return true;}
        const storage = getFinalBaseStorage(type);

        const {result} = onRemoveData({
            getOption: {key, type, path},
            storage,
            removeOption: options
        });
        if (result === false) return false;
        
        return storage.remove({key, type, path, domain});
    },
    exist: ({key, type, path}) => {
        if (key === '') {return false;}
        return getFinalBaseStorage(type).exist({key, type, path});
    },
    set (arg1, arg2) {
        if (arg1 instanceof Array) {
            let result: boolean = true;
            for (const k in arg1) {
                if (!this.set(arg1[k])) result = false;
            }
            return result;
        }
        
        const options: IStorageCommonSetOption =
         (typeof arg1 === 'object') ? arg1 : {key: arg1, value: arg2};
         
        const {key, value, type, path} = options;

        if (key === '') {return false;}
        const data = setDataConvert({data: value, storageType: type});
        const storage = getFinalBaseStorage(type);

        const prevData = storage.get({key, type, path});
        const setResult = executePluginsSet({options, data, storage, prevData});
        if (typeof setResult === 'boolean') return setResult;
        options.value = setResult;
        console.log('executePluginsSet result', data);

        return storage.set(options);
    },
    
    get (arg) {
        if (arg instanceof Array) {
            const result: any[] = [];
            for (const k in arg) {
                result.push(this.get(arg[k]));
            }
            return result;
        }
        const options: IStorageKeyArg = (typeof arg === 'object') ? arg : {key: arg};
        const {key, type, path} = options;
        if (key === '') {return EMPTY;}
        const storage = getFinalBaseStorage(type);
        const data = storage.get({key, type, path});

        return onGetSingleData({options, data, storage});
    },
    all ({type, path} = {}) {
        const storage = getFinalBaseStorage(type);
        const data = storage.all({type, path});
        for (const key in data) {
            if (typeof data[key] === 'object') {
                const storageData = (data[key] as IStorageData);

                data[key] = onGetSingleData({
                    options: {key, type, path},
                    data: storageData,
                    storage,
                });
            }
        }
        return data;
    },
};

function onGetSingleData ({ // 复用 get 方法触发事件的逻辑和转换finalData的逻辑 供 get与all方法复用
    options, data, storage
}:{
    options: IStorageKeyArg;
    data: TGetReturn;
    storage: IBaseStorage;
}): TGetReturn {
    if (typeof data === 'string' || typeof data === 'symbol') return data;

    const {onFinalData, trigFinalData} = buildFinalCallback();
    data = executePluginsGet({options, data, storage, onFinalData});
    if (typeof data === 'symbol') return EMPTY;
    const finalData = getDataConvert({storageType: options.type, data});
    trigFinalData(finalData);
    return finalData;
}

function onRemoveData ({
    getOption,
    storage,
    removeOption
}: {
    getOption: IStorageKeyArg;
    storage: IBaseStorage;
    removeOption: IStorageRemoveArg;
}) {
    const prevData = storage.get(getOption);
    console.warn('[prev]', prevData, getOption, removeOption);
    const result = executePluginsRemove({options: removeOption, storage, prevData});
    return {result, prevData};
}

Storage.use(
    FinalPlugin,
    ProtectPlugin,
    TimesPlugin,
    ExpiresPlugin,
    EventPlugin
);