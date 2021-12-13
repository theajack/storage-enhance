/*
 * @Author: tackchen
 * @Date: 2021-12-12 14:39:48
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-12 14:39:50
 * @FilePath: /storage-enhance/src/type/util.d.ts
 * @Description: Coding something
 */

export interface IJson<T=any> {
    [prop: string]: T;
}