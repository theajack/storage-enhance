/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:30:47
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-22 15:31:26
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
    pathStrict?: boolean; // 其他模式是否参照cookie使用严格隔离path默认 只能写 不可读 默认为false
}

export interface IStorageDetailArg {
    detail?: boolean;
}

export interface IStorageClearArg extends IStorageTypeArg, ICookieDomain, IStorageProtectType {
}

export interface IStorageKeyArg extends IStorageTypeArg {
    key: TStorageKey;
}

export interface IAdapterStorageKeyArg extends IStorageKeyArg, IStorageDetailArg {
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

export interface IBaseStorageFuncs {
    length(options?: IStorageTypeArg): number;
    keys(options?: IStorageTypeArg): IKeyPathPair[];
    clear(options?: IStorageClearArg): boolean;
    get(options: IStorageKeyArg): TGetReturn;
    remove(options: IStorageRemoveArg): boolean;
    exist(options: IStorageKeyArg): boolean;
    set(options: IBaseStorageSetValueArg): boolean;
}

export interface IBaseStorage extends IBaseStorageFuncs {
    name: TStorageName;
    all(options?: IStorageTypeArg): IKeyPathReturnPair[];
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

export type TGetReturn = IStorageData | string | symbol;

export interface IKeyPathReturnPair extends IKeyPathPair {
    value: TGetReturn;
}

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
export interface IStorage extends IBaseStorageFuncs {
    env: TStorageEnv;
    registScope(arg1: string | IJson<IEvent | any>, arg2?: IEvent | any): void;
    scope(): void;
    type(type?: TStorageType): TStorageType | void;
    set(options: string | IStorageCommonSetOption | IStorageCommonSetOption[], value?: any): boolean;
    get(options: string | IAdapterStorageKeyArg | IAdapterStorageKeyArg[]): any;
    all(options?: IStorageTypeArg & IStorageDetailArg): IKeyPathValuePair[];
    use(...plugins: IStoragePlugin[]): void;
    plugins(): IStoragePlugin[];
    EMPTY: Symbol;
}

export type TTempMapOprateType = TOprate | 'clear';