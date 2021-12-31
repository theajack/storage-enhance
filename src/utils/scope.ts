/*
 * @Author: tackchen
 * @Date: 2021-12-24 07:46:38
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-24 08:02:24
 * @FilePath: /storage-enhance/src/utils/scope.ts
 * @Description: Coding something
 */

import {IJson} from '../type/util';

const scope: IJson = {};

export function registScope (arg1: IJson | string, arg2?: any) {
    if (typeof arg1 === 'string') {
        scope[arg1] = arg2;
    } else {
        Object.assign(scope, arg1);
    }
}

export function getScope () {
    return scope;
}