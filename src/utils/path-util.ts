/*
 * @Author: tackchen
 * @Date: 2022-01-22 22:24:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-25 09:17:20
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
    enablePath
}: {
    key: string;
    path?: string;
    enablePath?: boolean;
}) => {
    if (typeof path === 'undefined') {
        path = buildPathName(enablePath);
    }
    return {
        key,
        path,
        storageKey: buildPathStorageKey({key, path})
    };
};

export function buildPathStorageKey ({key, path}: IKeyPathPair): string {
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