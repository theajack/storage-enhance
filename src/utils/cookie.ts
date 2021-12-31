/*
 * @Author: tackchen
 * @Date: 2021-12-22 10:40:04
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/utils/cookie.ts
 * @Description: Coding something
 *
 * samesite设置成None 前置条件 secure = true
 * sameParty=true 前置条件 secure = true
 * httpOnly js没办法设置
 */

import {ICookieGetOptions, ICookieRemoveOptions, ICookieSetOptions} from '../type/cookie';
import {EMPTY} from './constant';
import {countExpiresWithMs} from './util';

function getCookie ({key}: ICookieGetOptions) {
    const cookie = document.cookie;
    const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
    const arr = cookie.match(reg);
    if (arr) {
        return unescape(arr[2]);
    }
    return EMPTY;
}

function setCookie ({
    key, value, expires, path, domain, secure, sameSite, sameParty, priority
}: ICookieSetOptions) {
    let cookieStr = `${key}=${escape(value)};`;
    if (expires) {
        const expiresStr = ((typeof expires === 'number') ? new Date(expires) : expires).toUTCString();
        cookieStr += `expires=${expiresStr};`;
    }
    if (path) cookieStr += `path=${path};`;
    if (domain) cookieStr += `domain=${domain};`;
    if (secure) cookieStr += 'secure;';
    if (sameSite) {
        if (sameSite !== 'None' || secure)
            cookieStr += `sameSite=${sameSite};`;
        else
            console.warn('设置sameSite=None时必须设置secure=true');
    }
    if (sameParty) {
        if (secure)
            cookieStr += 'sameParty;';
        else
            console.warn('设置sameParty=true时必须设置secure=true');
    }
    if (priority) cookieStr += `priority=${priority};`;
    try {
        document.cookie = cookieStr;
        return true;
    } catch (e) {
        console.warn(e);
        return false;
    }
}

function removeCookie (options: ICookieRemoveOptions) {
    const setOptions = options as ICookieSetOptions;
    setOptions.expires = countExpiresWithMs(-1000);
    return setCookie(setOptions);
}

function checkPath (path: string = '') {
    if (!path) return true;

    console.warn(`Cookie 操作无效: path与当前pathname不一致; ${path} - ${location.pathname}`);
    return path === location.pathname;
}

export const Cookie = {
    get: getCookie,
    set: setCookie,
    remove: removeCookie,
    checkPath
};