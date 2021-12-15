/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:04:14
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-15 09:08:59
 * @FilePath: /storage-enhance/src/adapter.ts
 * @Description: Coding something
 */

import {WebStorage} from './clients/web/web-storage';
import {getDataConvert, setDataConvert} from './convert/converter';
import {StorageEnv} from './convert/storage-env';
import {TempStorege} from './temp/temp-storage';
import {TStorageType} from './type/constant';
import {IBaseStorage, IStorage} from './type/storage';

const BaseStorage: IBaseStorage = WebStorage;

function getFinalBaseStorage(type: TStorageType = 'local'): IBaseStorage{
    return (type === 'temp') ? TempStorege: BaseStorage;
}

export const Storage: IStorage = {
    type: 'local',
    
    length: ({type} = {}) => getFinalBaseStorage(type).length({type}),
    clear: ({type} = {}) => getFinalBaseStorage(type).clear({type}),
    remove: ({key, type}) => getFinalBaseStorage(type).remove({key, type}),
    exist: ({key, type}) => getFinalBaseStorage(type).exist({key, type}),
    
    get ({key, type}) {
        const value = BaseStorage.get({key, type});
        return getDataConvert({value, storageType: type});
    },
    set ({key, value, type}) {
        const storageValue = setDataConvert({value, storageType: type});
        
        const data = {};

        if(StorageEnv === '')
    },
    all ({type} = {}) {
        const data: IJson<string | null> = {};
        const storage = getStorageType(type);
        for (let i = 0, length = this.length({type}); i < length; i++) {
            const key = storage.key(i) || '';
            data[key] = storage.getItem(key);
        }
        return data;
    },
};