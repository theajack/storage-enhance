/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:30:47
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-25 08:41:26
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
}

export interface IStoragePathArg {
    path?: string;
}

export interface IStoragePathEnableArg {
    enablePath?: boolean;
}

export interface IStorageTypePathArg extends IStorageTypeArg, IStoragePathArg {
}

export interface IStorageDetailArg {
    detail?: boolean;
}

export interface IStorageClearArg extends IStorageTypeArg, ICookieDomain, IStorageProtectType {
}

export interface IStorageKeyArg extends IStorageTypeArg {
    key: TStorageKey;
}

export interface IAdapterStorageKeyArg extends
    IStorageKeyArg,
    IStorageDetailArg,
    IStoragePathEnableArg {
}

export interface IStorageRemoveArg extends IStorageKeyArg, ICookieDomain, IStorageProtectType {
}

export interface IBaseStorageSetValueArg extends IStorageKeyArg {
    value: IStorageData;
    cookie?: ICookieOption;
}

export interface IKeyPathPair {
    key: TStorageKey;
    path: string;
}
export interface IKeyOriginValuePair {
    key: TStorageKey;
    value: TStorageOriginData;
}

export interface IBaseStorageFuncs {
    length(options?: IStorageTypeArg): number;
    clear(options?: IStorageClearArg): boolean;
    get(options: IStorageKeyArg): TStorageOriginData;
    remove(options: IStorageRemoveArg): boolean;
    exist(options: IStorageKeyArg): boolean;
    set(options: IBaseStorageSetValueArg): boolean;
}

export interface IBaseStorage extends IBaseStorageFuncs {
    name: TStorageName;
    keys(options?: IStorageTypeArg): string[];
    all(options?: IStorageTypeArg): IKeyOriginValuePair[];
}
export interface IStorage extends IBaseStorageFuncs {
    env: TStorageEnv;
    length(options?: IStorageTypeArg & IStoragePathEnableArg): number;
    keys(options?: IStorageTypeArg & IStoragePathEnableArg): IKeyPathPair[];
    clear(options?: IStorageClearArg & IStoragePathEnableArg): boolean;
    exist(options: IStorageKeyArg & IStoragePathEnableArg): boolean;
    remove(options: IStorageRemoveArg & IStoragePathEnableArg): boolean;

    set(options: IStorageCommonSetOption & IStoragePathEnableArg): boolean;
    setWithString(key: string, value: any): boolean;
    setWithArray(array: (IStorageCommonSetOption & IStoragePathEnableArg)[]): boolean;
    
    get(options: IAdapterStorageKeyArg): IKeyPathValuePair;
    getWithString(key: string): IKeyPathValuePair;
    getWithArray(array: IAdapterStorageKeyArg[]): IKeyPathValuePair[];

    all(options?: IStorageTypeArg & IStorageDetailArg & IStoragePathEnableArg): IKeyPathValuePair[];
    use(...plugins: IStoragePlugin[]): void;
    plugins(): IStoragePlugin[];
    registScope(arg1: string | IJson<IEvent | any>, arg2?: IEvent | any): void;
    scope(): void;
    type(type?: TStorageType): TStorageType | void;
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
    path?: string;
    final?: boolean; // 是否是不可改变的
}


export interface IStorageData extends IStorageBaseOption {
    type: TStorageDataType;
    path?: string;
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

export interface IStorageCommonSetOption extends IStorageBaseOption, IStorageKeyArg {
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