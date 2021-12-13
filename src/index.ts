/*
 * @Author: tackchen
 * @Date: 2021-12-12 13:58:00
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-12 16:53:12
 * @FilePath: /storage-enhance/src/index.ts
 * @Description: Coding something
 */
import {deepClone} from './util';

declare global {
    interface Window{
        [prop: string]: any;
    }
}

window.deepClone = deepClone;
