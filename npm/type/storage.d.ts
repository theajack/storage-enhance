/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:30:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-07 23:48:43
 * @FilePath: /storage-enhance/src/type/storage.d.ts
 * @Description: Coding something
 */
import {TStorageEnv, TStorageName, TStorageType} from './constant';
import {ICookieOption, ICookieRemoveOption} from './cookie';
import {IStoragePlugin} from './plugin';
import {IJson} from './util';

export type TStorageKey = string;

export interface IStorageTypeArg {
    type?: TStorageType;
}

export interface IStorageTypePathArg extends IStorageTypeArg {
}

export interface IStorageDetailArg {
    detail?: boolean;
}

export interface IStorageClearArg extends IStorageTypeArg, IStorageProtectType, ICookieRemoveOption {
    cookie?: ICookieRemoveOption;
}

export interface IStorageKeyArg extends IStorageTypeArg {
    key: TStorageKey;
    type?: TStorageType;
}

export interface IStorageGetOption extends
    IStorageKeyArg,
    IStorageDetailArg {
    cookie?: ICookieRemoveOption;
}

export interface IStorageRemoveArg extends IStorageKeyArg, IStorageProtectType {
    cookie?: ICookieRemoveOption;
}

export interface IBaseStorageSetValueArg extends IStorageKeyArg {
    value: IStorageData;
    cookie?: ICookieOption;
}

export interface IKeyPathPair {
    key: TStorageKey;
    path: string;
}
export interface IKeyValuePair {
    key: TStorageKey;
    value: any;
}
export interface IKeyOriginValuePair {
    key: TStorageKey;
    value: TStorageOriginData;
}

export interface IBaseStorageFuncs {
    count(options?: IStorageTypeArg): number;
    clear(options?: IStorageClearArg): boolean;
}

export interface IBaseStorage extends IBaseStorageFuncs {
    name: TStorageName;
    keys(options?: IStorageTypeArg): string[];
    all(options?: IStorageTypeArg): IKeyOriginValuePair[];
    set(options: IBaseStorageSetValueArg): boolean;
    get(options: IStorageKeyArg): TStorageOriginData;
    remove(options: IStorageRemoveArg): boolean;
    exist(options: IStorageKeyArg): boolean;
}

export interface IStorage extends IBaseStorageFuncs {
    env: TStorageEnv;
    TYPE: IJson<TStorageType>;
    count(options?: IStorageTypeArg): number;
    keys(options?: IStorageTypeArg): string[];
    clear(options?: IStorageClearArg): boolean;
    
    exist(key: string, options: IStorageKeyArg): boolean;
    exist(options: IStorageKeyArg): boolean;
    
    remove(key: string, options: IStorageRemoveArg): boolean;
    remove(options: IStorageRemoveArg): boolean;

    set(key: string, value: any, options?: IStorageSetOption): boolean;
    set(options: IStorageSetOption): boolean;
    set(array: (IStorageSetOption)[]): boolean;
    
    get(key: string): any;
    get(options: IStorageGetOption): any;
    get(array: IStorageGetOption[]): any[];

    all(options?: IStorageTypeArg & IStorageDetailArg): IKeyPathValuePair[];
    use(...plugins: IStoragePlugin[]): void;
    plugins(): IStoragePlugin[];
    registScope(arg1: string | IJson<IEvent | any>, arg2?: IEvent | any): void;
    scope(): IJson;
    type: TStorageType;
    EMPTY: Symbol;
}

export type TStorageDataType = 'string' | 'bigint' | 'number' | 'boolean' | 'symbol' |
    'undefined' | 'object' | 'function' |
    'html' | 'date' | 'null' | 'reg';

export interface IStorageProtectType {
    protect?: boolean; // 不可以被删除的
}
export interface IStorageBaseOption extends IStorageProtectType {
    value: string | any;
    expires?: number; // 过期时间 datetime
    once?: boolean; // 是否是一次性的
    times?: number; // 可读取次数
    // compress?: boolean; // 是否压缩存储
    // encrypt?: boolean; // 是否为加密存储
    final?: boolean; // 是否是不可改变的
}


export interface IStorageData extends IStorageBaseOption {
    type: TStorageDataType;
    onGet?: string;
    onSet?: string;
    onRemove?: string;
}

export type TStorageOriginData = any;

export type TGetReturn = IStorageData | string | symbol;


export interface IEventOption {
    scope: IJson<any>;
    data: any;
    prevData?: any;
}

export interface IEvent {
    (options: IEventOption): void;
}

export interface IStorageSetOption extends IStorageBaseOption, IStorageKeyArg {
    cookie?: ICookieOption;
    onGet?: string | IEvent;
    onSet?: string | IEvent;
    onRemove?: string | IEvent;
}

export interface IValueConverter {
    get(v: any): any;
    set(v: any): any;
}

export type TOprate = 'get' | 'set';

export interface IKeyPathValuePair extends IKeyPathPair {
    value: any;
}

export type TTempMapOprateType = TOprate | 'clear';