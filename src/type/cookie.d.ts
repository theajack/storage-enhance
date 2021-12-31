/*
 * @Author: tackchen
 * @Date: 2021-12-22 10:39:56
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/type/cookie.d.ts
 * @Description: Coding something
 */
export type ICookieSameSite = 'Lax' | 'Strict' | 'None';

export type ICookiePriority = 'Low' | 'Medium' | 'High';


export interface ICookieDomain {
    domain?: string; // default: location.host
}

export interface ICookieOption extends ICookieDomain { // cookie 特有的属性
    secure?: boolean; // default: false
    sameSite?: ICookieSameSite; // default: Lax
    priority?: ICookiePriority; // default: Medium
    sameParty?: boolean; // default: false
    expires?: Date | number; // default is session
}

export interface ICookieGetOptions {
    key: string;
}

export interface ICookieRemoveOptions extends ICookieGetOptions, ICookieDomain {
    path?: string; // default: /
}

export interface ICookieSetOptions extends ICookieRemoveOptions, ICookieOption {
    value: string | any;
    // httpOnly js 没办法设置
}