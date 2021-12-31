/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:30:47
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-31 09:07:29
 * @FilePath: /storage-enhance/src/type/storage.d.ts
 * @Description: Coding something
 */
import {TStorageEnv, TStorageName, TStorageType} from './constant';
import {ICookieDomain, ICookieOption} from './cookie';
import {IStoragePlugin} from './plugin';
import {IJson} from './util';

export type TStorageKey = string;

export interface IStorageTypeArg {
    type?: TStorageType;
    path?: string;
}

export interface IStorageClearArg extends IStorageTypeArg, ICookieDomain {
}

export interface IStorageKeyArg extends IStorageTypeArg {
    key: TStorageKey;
}

export interface IStorageRemoveArg extends IStorageKeyArg, ICookieDomain {
}

export interface IBaseStorageSetValueArg extends IStorageKeyArg {
    value: IStorageData;
    cookie?: ICookieOption;
}

export interface IBaseStorageFuncs {
    length(options?: IStorageTypeArg): number;
    keys(options?: IStorageTypeArg): string[];
    all(options?: IStorageTypeArg): IJson<TGetReturn>;
    clear(options?: IStorageClearArg): boolean;
    get(options: IStorageKeyArg): TGetReturn;
    remove(options: IStorageRemoveArg): boolean;
    exist(options: IStorageKeyArg): boolean;
    set(options: IBaseStorageSetValueArg): boolean;
}

export interface IBaseStorage extends IBaseStorageFuncs {
    name: TStorageName;
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
    final?: boolean; // 是否是不可改变的
    protect?: boolean; // 不可以被删除的
}

export interface IStorageData extends IStorageBaseOption {
    type: TStorageDataType;
    onGet?: string;
    onSet?: string;
    onRemove?: string;
}

export type TGetReturn = IStorageData | string | symbol;

export interface IStorageCommonSetOption extends IStorageBaseOption, IStorageKeyArg {
    cookie?: ICookieOption;
    onGet?: string | Function;
    onSet?: string | Function;
    onRemove?: string | Function;
}

export interface IValueConverter {
    get(v: any): any;
    set(v: any): any;
}

export type TOprate = 'get' | 'set';

export interface IStorage extends IBaseStorageFuncs {
    env: TStorageEnv;
    registScope(arg1: string | IJson, arg2?: any): void;
    scope(): void;
    type(type?: TStorageType): TStorageType | void;
    set(options: string | IStorageCommonSetOption | IStorageCommonSetOption[], value?: any): boolean;
    get(options: string | IStorageKeyArg | IStorageKeyArg[]): any;
    use(...plugins: IStoragePlugin[]): void;
    plugins(): IStoragePlugin[];
}

export type TTempMapOprateType = TOprate | 'clear';