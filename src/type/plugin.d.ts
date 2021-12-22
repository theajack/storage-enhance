/*
 * @Author: tackchen
 * @Date: 2021-12-21 11:12:33
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/type/plugin.d.ts
 * @Description: Coding something
 */
import {
    IStorageTypeArg, IStorageKeyArg, IStorageSetValueArg, IStorageData, IBaseStorage,
} from './storage';
import {IJson} from './util';

export type TPluginName = 'times' | 'onget' | 'onset' | 'onremove' | 'compress' | 'encode';

interface IPluginGetOptions {
    options: IStorageKeyArg;
    data: IStorageData;
    storage: IBaseStorage;
}

interface IPluginSetOptions {
    options: IStorageSetValueArg;
    data: IStorageData;
    storage: IBaseStorage;
}

export interface IStoragePlugin {
    name: TPluginName;
    length?(options?: IStorageTypeArg): number;
    keys?(options?: IStorageTypeArg): string[];
    all?(options?: IStorageTypeArg): IJson;
    clear?(options?: IStorageTypeArg): boolean;
    get?(options: IPluginGetOptions): IStorageData | symbol;
    remove?(options: IStorageKeyArg): boolean;
    exist?(options: IStorageKeyArg): boolean;
    set?(options: IPluginSetOptions): IStorageData | boolean;
}