/*
 * @Author: tackchen
 * @Date: 2021-12-21 11:12:33
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/type/plugin.d.ts
 * @Description: Coding something
 */
import {
    IStorageTypeArg, IStorageKeyArg, IStorageData, IBaseStorage, IStorageCommonSetOption, TGetReturn, IStorageRemoveArg,
} from './storage';
import {IJson} from './util';

export type TPluginName = 'times' | 'expires' | 'event' | 'compress' | 'encode' | 'final' | 'protect';

interface IPluginGetOptions {
    options: IStorageKeyArg;
    data: IStorageData;
    storage: IBaseStorage;
    onFinalData(
        callback: (data: any)=>void
    ): void;
}

interface IPluginSetOptions {
    options: IStorageCommonSetOption;
    data: IStorageData;
    storage: IBaseStorage;
    prevData: TGetReturn;
}

interface IPluginRemoveOptions {
    options: IStorageRemoveArg;
    storage: IBaseStorage;
    prevData: TGetReturn;
}

export interface IStoragePlugin {
    name: TPluginName;
    length?(options?: IStorageTypeArg): number;
    keys?(options?: IStorageTypeArg): string[];
    all?(options?: IStorageTypeArg): IJson;
    clear?(options?: IStorageTypeArg): boolean;
    get?(options: IPluginGetOptions): IStorageData | symbol;
    remove?(options: IPluginRemoveOptions): boolean;
    exist?(options: IStorageKeyArg): boolean;
    set?(options: IPluginSetOptions): IStorageData | boolean;
}