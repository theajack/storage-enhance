import {TStorageEnv, TStorageType} from './constant';
import {IStoragePlugin} from './plugin';
import {IJson} from './util';

/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:30:47
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-22 09:15:53
 * @FilePath: /storage-enhance/src/type/storage.d.ts
 * @Description: Coding something
 */
export type TStorageKey = string;

export interface IStorageTypeArg {
    type?: TStorageType;
    path?: string;
}

export interface IStorageKeyArg extends IStorageTypeArg {
    key: TStorageKey;
}

export interface IStorageSetValueArg extends IStorageKeyArg {
    value: any;
    times?: number;
    once?: boolean;
}

export interface IBaseStorageSetValueArg extends IStorageSetValueArg {
    value: IStorageData;
}

export interface IBaseStorage {
    length(options?: IStorageTypeArg): number;
    keys(options?: IStorageTypeArg): string[];
    all(options?: IStorageTypeArg): IJson;
    clear(options?: IStorageTypeArg): boolean;
    get(options: IStorageKeyArg): IStorageData | string | symbol;
    remove(options: IStorageKeyArg): boolean;
    exist(options: IStorageKeyArg): boolean;
    set(options: IBaseStorageSetValueArg): boolean;
}

export type TStorageDataType = 'string' | 'bigint' | 'number' | 'boolean' | 'symbol' |
    'undefined' | 'object' | 'function' |
    'html' | 'date' | 'null' | 'reg';


export interface IStorageBaseOption {
    value: string | any;
    expires?: number; // 过期时间 datetime
    once?: boolean; // 是否是一次性的
    times?: number; // 可读取次数
    compress?: boolean; // 是否压缩存储
    encrypt?: boolean; // 是否为加密存储
    path?: string;
}

export interface IStorageData extends IStorageBaseOption {
    type: TStorageDataType;
}

export interface IStorageCommonSetOption extends IStorageBaseOption, IStorageKeyArg {
    onSet?(): void;
    onGet?(): void;
    onRemove?(): void;
}

export interface IValueConverter {
    get(v: any): any;
    set(v: any): any;
}

export type TOprate = 'get' | 'set';

export interface IStorage extends IBaseStorage {
    env: TStorageEnv;
    type(type?: TStorageType): TStorageType | void;
    set(options: IStorageCommonSetOption): boolean;
    get(options: IStorageKeyArg): any;
    use(...plugins: IStoragePlugin[]): void;
    plugins(): IStoragePlugin[];
}

export type TTempMapOprateType = TOprate | 'clear';