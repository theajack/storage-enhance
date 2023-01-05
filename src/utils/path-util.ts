/*
 * @Author: tackchen
 * @Date: 2022-01-22 22:24:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-29 12:57:17
 * @FilePath: /storage-enhance/src/utils/path-util.ts
 * @Description: Coding something
 */

import {IJson} from 'src/type/util';
import {IsWeb} from '../convert/storage-env';
import {globalType} from '../convert/storage-type';
import {TStorageType} from '../type/constant';
import {IKeyPathPair} from '../type/storage';

export const RootPathName = '/';

const PathName = (() => {
    if (IsWeb) {
        let pathName = location.pathname;
        if (pathName[pathName.length - 1] !== '/') {
            pathName += '/';
        }
        return pathName;
    }
    return '/';
})();

export const IsRootPath = PathName === RootPathName;

export const buildPathName = (enablePath?: boolean) => enablePath ? PathName : RootPathName;

export const buildFinalKeyMap = ({
    key,
    path,
    isSet = false
}: {
    key: string;
    path?: string;
    isSet?: boolean;
}) => {
    path = buildStoragePath({path, isSet});
    return {
        key,
        storagePath: path,
        storageKey: buildStorageKey({key, path})
    };
};

export function buildStoragePath ({
    path,
    isSet = false
}: {
    path?: string;
    isSet?: boolean;
}) {
    return path || (isSet ? RootPathName : PathName);
    // 如果是设置的话 接受传入的path 默认使用根目录
    // ! 如果是获取的话 cookie情况下 无需传入path 传入 / 即可
    // 否则使用传入的path 默认使用当前页面路径
}

// 根据key path拼接最终的storageKey
export function buildStorageKey ({key, path}: IKeyPathPair): string {
    if (path === '') path = '/';
    else if (path[path.length - 1] !== '/') path += '/';
    return `${path}${key}`;
}

export function isWebNotCookie (type: TStorageType = globalType()) {
    return IsWeb && type !== 'cookie';
}

export function formatStorageKeys (keys: string[]): IKeyPathPair[] {
    return keys.map(key => formatStorageKey(key));
}

export function formatStorageKey (key: string): IKeyPathPair {
    const index = key.lastIndexOf('/');
    let path = key.substring(0, index);
    if (!path && index >= 0) path = '/';
    return {
        key: key.substring(index + 1),
        path
    };
}

export function filterKeyItemsWithPath<T = any> ({
    data,
    type,
    enablePath = false,
}: {
    data: T[],
    type?: TStorageType,
    enablePath?: boolean,
}): T[] {
    if (data.length === 0) return data;
    const isKeyObject = typeof data[0] === 'object';
    if (!IsRootPath && enablePath && isWebNotCookie(type)) {
        return data.filter(item => isKeyReachable(isKeyObject ? (item as IJson).key : item));
    }
    return data;
}

export function isKeyReachable (key: string) {
    const {path} = formatStorageKey(key);
    return PathName.indexOf(path) === 0;
}