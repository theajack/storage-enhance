/*
 * @Author: tackchen
 * @Date: 2022-01-22 22:24:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-22 23:02:25
 * @FilePath: /storage-enhance/src/utils/path-strict.ts
 * @Description: Coding something
 */

import {StorageEnv} from '../convert/storage-env';
import {globalType} from '../convert/storage-type';
import {TStorageType} from '../type/constant';
import {IStorageTypeArg} from '../type/storage';


export function isWebNotCookie (type: TStorageType = globalType()) {
    return StorageEnv === 'web' && type !== 'cookie';
}

function getPathName () {
    let pathName = location.pathname;
    if (pathName[pathName.length - 1] !== '/') {
        pathName += '/';
    }
    return pathName;
}

function isPathAvailable (path: string) {
    const pathName = getPathName();
    return path.indexOf(pathName) === 0;
}

// web
export function checkPathStrictOptions ({
    type,
    path = '/',
    pathStrict
}: IStorageTypeArg) {
    if (isWebNotCookie(type) && pathStrict) {
        return isPathAvailable(path);
    }
    return true;
}

export function filterItemsOfPathStrict<T extends {path: string}> ({
    type,
    data,
    pathStrict
}:{
    type?: TStorageType,
    data: T[],
    pathStrict?: boolean
}): T[] {
    if (isWebNotCookie(type) && pathStrict) {
        return data.filter(item => isPathAvailable(item.path));
    }
    return data;
}

