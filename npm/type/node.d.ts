/*
 * @Author: tackchen
 * @Date: 2021-12-16 02:21:37
 * @LastEditors: tackchen
 * @LastEditTime: 2021-12-16 02:31:27
 * @FilePath: /storage-enhance/src/type/node.d.ts
 * @Description: 简易版声明 直接引入 @types/node 会导致浏览器 require 方法报错
 */

export interface IFS {
    existsSync(path: string): boolean;
    mkdirSync(path: string): void;
    writeFileSync(path: string, value: string): void;
    rmSync(path: string): void;
    rmdirSync(path: string): void;
    readFileSync(path: string, encode: string): string;
    readdirSync(path: string): string[];
}

export interface IPath {
    resolve(base: string, path: string): string;
}