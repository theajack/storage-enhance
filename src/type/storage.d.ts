import {TStorageEnv, TStorageType} from './constant';
import {IJson} from './util';

/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:30:47
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-17 18:04:38
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

export interface IStorageValueArg extends IStorageKeyArg {
    value: any;
}

export interface IBaseStorage {
    length(arg?: IStorageTypeArg): number;
    keys(arg?: IStorageTypeArg): string[];
    all(arg?: IStorageTypeArg): IJson;
    clear(arg?: IStorageTypeArg): boolean;
    get(arg: IStorageKeyArg): any;
    remove(arg: IStorageKeyArg): boolean;
    exist(arg: IStorageKeyArg): boolean;
    set(arg: IStorageValueArg): boolean;
}

export type TStorageDataType = 'string' | 'bigint' | 'number' | 'boolean' | 'symbol' |
    'undefined' | 'object' | 'function' |
    'html' | 'date' | 'null' | 'reg';


export interface IStorageBaseOption {
    value: string | any;
    expires?: number; // 过期时间 datetime
    once?: boolean; // 是否是一次性的
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
    set(arg: IStorageCommonSetOption): boolean;
}

export type TTempMapOprateType = 'get' | 'set' | 'clear';