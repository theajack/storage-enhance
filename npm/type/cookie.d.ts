/*
 * @Author: tackchen
 * @Date: 2021-12-22 10:39:56
 * @LastEditors: Please set LastEditors
 * @FilePath: /storage-enhance/src/type/cookie.d.ts
 * @Description: Coding something
 */
export type ICookieSameSite = 'Lax' | 'Strict' | 'None';

export type ICookiePriority = 'Low' | 'Medium' | 'High';

export interface ICookieRemoveOption { // cookie 特有的属性n
    domain?: string; // default: location.host
    path?: string;
}
export interface ICookieOption extends ICookieRemoveOption { // cookie 特有的属性
    secure?: boolean; // default: false
    sameSite?: ICookieSameSite; // default: Lax
    priority?: ICookiePriority; // default: Medium
    sameParty?: boolean; // default: false
    expires?: Date | number; // default is session
}

export interface ICookieGetOptions {
    key: string;
}

export interface ICookieRemoveOptions extends ICookieGetOptions, ICookieRemoveOption {
}

export interface ICookieSetOptions extends ICookieRemoveOptions, ICookieOption {
    value: string | any;
    // httpOnly js 没办法设置
}