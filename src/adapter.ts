/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:14
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-25 08:57:51
 * @FilePath: /storage-enhance/src/adapter.ts
 * @Description: Coding something
 */

// import {MiniAppStorage} from './clients/miniapp/miniapp-storage';
import {WebStorage} from './clients/web/web-storage';
// import {NodeStorege} from './clients/node/node-storage';
import {getDataConvert, setDataConvert} from './convert/converter';
import {StorageEnv} from './convert/storage-env';
import {globalType, setGlobalType} from './convert/storage-type';
// import {TempStorege} from './temp/temp-storage';
import {TStorageType} from './type/constant';
import {IAdapterStorageKeyArg, IBaseStorage, IKeyPathValuePair, IStorage, IStorageCommonSetOption, IStorageData} from './type/storage';
import {EMPTY} from './utils/constant';
import {executePluginsGet, executePluginsRemove, executePluginsSet, getPlugins, usePlugin} from './plugin';
import {TimesPlugin} from './plugins/times';
// import {CookieStorage} from './clients/web/cookie-storage';
import {ExpiresPlugin} from './plugins/expires';
import {EventPlugin} from './plugins/event';
import {getScope, registScope} from './utils/scope';
import {FinalPlugin} from './plugins/final';
import {ProtectPlugin} from './plugins/protect';
import {buildFinalKeyMap, filterKeyItemsWithPath, formatStorageKeys, IsRootPath} from './utils/path-util';
import {isValidStorageData, parseStorageValue} from './utils/util';

// const StorageMap: {
//     [prod in TStorageEnv]: IBaseStorage
// } = {
//     'web': WebStorage,
//     'miniapp': MiniAppStorage,
//     'node': NodeStorege,
// };

// const BaseStorage: IBaseStorage = StorageMap[StorageEnv];

const BaseStorage: IBaseStorage = WebStorage;

function getFinalBaseStorage (type: TStorageType = globalType()): IBaseStorage {
    console.log(type);
    return BaseStorage;
    // if (StorageEnv === 'web' && type === 'cookie') return CookieStorage;
    // return (type === 'temp' || (StorageEnv !== 'web' && type !== 'local')) ? TempStorege : BaseStorage; // ??????web?????? session ?????? temp ??????
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
    length ({type, enablePath} = {}) {
        const storage = getFinalBaseStorage(type);
        if (!enablePath || IsRootPath) return storage.length({type});
        return filterKeyItemsWithPath<string>({
            data: storage.keys({type}), type, enablePath
        }).length;
    },
    keys ({type, enablePath} = {}) {
        const storage = getFinalBaseStorage(type);
        const keys = filterKeyItemsWithPath({
            data: storage.keys({type}),
            type,
            enablePath
        });
        return formatStorageKeys(keys);
    },
    clear (options = {}) {
        const {type, protect, enablePath} = options;

        if (!enablePath && !protect) {
            const storage = getFinalBaseStorage(type);
            return storage.clear(options);
        }

        const keys = this.keys({type, enablePath});

        let result = true;
        for (const item of keys) {
            if (!this.remove({...options, key: item.key})) {
                result = false;
            }
        }
        return result;
    },
    remove: (options) => {
        const {key, type, enablePath} = options;
        if (key === '') {return true;}
        const storage = getFinalBaseStorage(type);

        const {storageKey} = buildFinalKeyMap({key, enablePath});

        const prevData = storage.get({...options, key: storageKey});

        console.warn('[prev]', prevData, options, options);
        const result = executePluginsRemove({options, storage, prevData});

        if (result === false) return false;
        
        return storage.remove({...options, key: storageKey});
    },
    exist: ({key, type, enablePath}) => {
        const {storageKey} = buildFinalKeyMap({key, enablePath});
        return getFinalBaseStorage(type).exist({key: storageKey, type});
    },
    
    set (options) {
         
        const {key, value, type, path, enablePath} = options;

        if (key === '') {return false;}
        const data = setDataConvert({data: value, storageType: type, path});
        const storage = getFinalBaseStorage(type);

        const {storageKey} = buildFinalKeyMap({key, enablePath, path});

        const originData = storage.get({key: storageKey, type});
        const prevData = parseStorageValue(originData);
        
        const setResult = executePluginsSet({options, data, storage, prevData});
        if (typeof setResult === 'boolean') return setResult;

        console.log('executePluginsSet result', data);
        return storage.set({...options, key: storageKey, value: setResult});
    },
    setWithString (key, value) {
        const options: IStorageCommonSetOption = {key, value};
        return this.set(options);
    },
    setWithArray (array) {
        let result: boolean = true;
        for (const options of array) {
            if (!this.set(options)) result = false;
        }
        return result;
    },

    getWithArray (array) {
        const result: IKeyPathValuePair[] = [];
        for (const k in array) {
            result.push(this.get(array[k]));
        }
        return result;
    },
    getWithString (key) {
        const options: IAdapterStorageKeyArg = {key};
        return this.get(options);
    },
    get (options) {
        const {key, type, detail, enablePath} = options;

        const {path, storageKey} = buildFinalKeyMap({key, enablePath});

        const buildGetReturn = (value: any = EMPTY): IKeyPathValuePair => ({value, key, path});

        if (key === '') {return buildGetReturn();}

        const storage = getFinalBaseStorage(type);
        const originData = storage.get({key: storageKey, type});
        // console.log('BaseStorage', data);

        let data = parseStorageValue(originData);

        if (!isValidStorageData(data)) {return buildGetReturn();}

        data = data as IStorageData;
        const {onFinalData, trigFinalData} = buildFinalCallback();
        data = executePluginsGet({options, data, storage, onFinalData});

        if (typeof data === 'symbol') {return buildGetReturn();}

        const finalData = getDataConvert({storageType: options.type, data});
        trigFinalData(finalData);

        return buildGetReturn(detail ? data : finalData);

    },
    all ({type, detail, enablePath} = {}) {
        const keys = this.keys({type, enablePath});
        return keys.map(({key}) => {
            return this.get({key, type, detail, enablePath});
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