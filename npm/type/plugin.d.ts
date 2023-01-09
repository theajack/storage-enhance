/*
 * @Author: tackchen
 * @Date: 2021-12-21 11:12:33
 * @LastEditors: Please set LastEditors
 * @FilePath: /storage-enhance/src/type/plugin.d.ts
 * @Description: Coding something
 */
import {
    IStorageKeyArg, IStorageData, IBaseStorage, IStorageSetOption, TGetReturn, IStorageRemoveArg, IStorageGetOption,
} from './storage';
// import {IJson} from './util';

export type TPluginName = 'times' | 'expires' | 'event' | 'compress' | 'encode' | 'final' | 'protect';

interface IPluginBeforeGetOptions {
    options: IStorageGetOption;
    storage: IBaseStorage;
}

interface IPluginGetOptions {
    options: IStorageKeyArg;
    data: IStorageData;
    storage: IBaseStorage;
    key: string;
    onFinalData(
        callback: (data: any)=>void
    ): void;
}

interface IPluginSetOptions {
    options: IStorageSetOption;
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
    beforeGet?(options: IPluginBeforeGetOptions): IStorageGetOption;
    get?(options: IPluginGetOptions): IStorageData | symbol;
    set?(options: IPluginSetOptions): IStorageData | boolean;
    remove?(options: IPluginRemoveOptions): boolean;

    // // 初代版本暂时不实现下面的
    // exist?(options: IStorageKeyArg): boolean;
    // count?(options?: IStorageTypeArg): number;
    // keys?(options?: IStorageTypeArg): string[];
    // all?(options?: IStorageTypeArg): IJson<IStorageData>;
    // clear?(options?: IStorageTypeArg): boolean;
}