/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-05 09:10:06
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
import {IAdapterStorageKeyArg, IBaseStorage, IKeyPathValuePair, IStorage, IStorageData} from './type/storage';
import {EMPTY} from './utils/constant';
import {executePluginsGet, executePluginsRemove, executePluginsSet, getPlugins, usePlugin} from './plugin';
import {TimesPlugin} from './plugins/times';
// import {CookieStorage} from './clients/web/cookie-storage';
import {ExpiresPlugin} from './plugins/expires';
import {EventPlugin} from './plugins/event';
import {getScope, registScope} from './utils/scope';
import {FinalPlugin} from './plugins/final';
import {ProtectPlugin} from './plugins/protect';
import {buildFinalKeyMap, filterKeyItemsWithPath, formatStorageKeys} from './utils/path-util';
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
    // return (type === 'temp' || (StorageEnv !== 'web' && type !== 'local')) ? TempStorege : BaseStorage; // 除了web之外 session 采用 temp 替代
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
    length ({type} = {}) {
        const storage = getFinalBaseStorage(type);
        if (storage.name === 'cookie') return storage.length({type});
        return filterKeyItemsWithPath<string>({
            data: storage.keys({type}), type
        }).length;
    },
    keys ({type} = {}) {
        const storage = getFinalBaseStorage(type);
        const keys = filterKeyItemsWithPath({
            data: storage.keys({type}),
            type,
        });
        return formatStorageKeys(keys);
    },
    clear (options = {}) {
        const {type, protect} = options;

        if (!protect) {
            const storage = getFinalBaseStorage(type);
            return storage.clear(options);
        }

        const keys = this.keys({type});

        let result = true;
        for (const item of keys) {
            if (!this.remove({...options, key: item.key})) {
                result = false;
            }
        }
        return result;
    },
    remove: (options) => {
        const {key, type} = options;
        if (key === '') {return true;}
        const storage = getFinalBaseStorage(type);

        const {storageKey} = buildFinalKeyMap({key});

        const originData = storage.get({...options, key: storageKey});
        const prevData = parseStorageValue(originData);

        if (typeof prevData !== 'string') {
            if (typeof prevData === 'symbol') {
                return true;
            }
            console.warn('[prev]', prevData, options, options);
            const result = executePluginsRemove({options, storage, prevData});
    
            if (result === false) return false;
        }
        
        return storage.remove({...options, key: storageKey});
    },
    exist: ({key, type}) => {
        const {storageKey} = buildFinalKeyMap({key});
        return getFinalBaseStorage(type).exist({key: storageKey, type});
    },
    
    set (key, value, options = {value: '', key: ''}) {
         
        const {type, path} = options;

        if (key === '') {return false;}
        const data = setDataConvert({data: value, storageType: type, path});
        const storage = getFinalBaseStorage(type);

        const originData = storage.get({key, type});
        const prevData = parseStorageValue(originData);
        
        const setResult = executePluginsSet({options, data, storage, prevData});
        if (typeof setResult === 'boolean') return setResult;

        console.log('executePluginsSet result', data);
        return storage.set({...options, key, value: setResult});
    },
    setWithOptions (options) {
        const {key, value} = options;
        return this.set(key, value, options);
    },
    setWithArray (array) {
        let result: boolean = true;
        for (const options of array) {
            if (!this.setWithOptions(options)) result = false;
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
        const {key, type, detail} = options;

        const {storagePath, storageKey} = buildFinalKeyMap({key});

        const buildGetReturn = (value: any = EMPTY): IKeyPathValuePair => ({value, key, path: storagePath});

        if (key === '') {return buildGetReturn();}

        const storage = getFinalBaseStorage(type);
        const originData = storage.get({key: storageKey, type});
        // console.log('BaseStorage', data);

        let data = parseStorageValue(originData);

        if (!isValidStorageData(data)) {return buildGetReturn();}

        data = data as IStorageData;
        const {onFinalData, trigFinalData} = buildFinalCallback();
        data = executePluginsGet({options, data, storage, storageKey, onFinalData});

        if (typeof data === 'symbol') {return buildGetReturn();}

        const finalData = getDataConvert({storageType: options.type, data});
        trigFinalData(finalData);

        return buildGetReturn(detail ? data : finalData);

    },
    all ({type, detail} = {}) {
        const keys = this.keys({type});
        return keys.map(({key}) => {
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