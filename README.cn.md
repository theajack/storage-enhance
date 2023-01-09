# [storage-enhance](https://www.github.com/theajack/storage-enhance)

<p>
    <a href="https://www.github.com/theajack/storage-enhance"><img src="https://img.shields.io/github/stars/theajack/storage-enhance.svg?style=social" alt="star"></a>
    <a href="https://theajack.gitee.io"><img src="https://img.shields.io/badge/author-theajack-blue.svg?style=social" alt="Author"></a>
</p> 

<p>
    <a href="https://www.npmjs.com/package/storage-enhance"><img src="https://img.shields.io/npm/v/storage-enhance.svg" alt="Version"></a>
    <a href="https://npmcharts.com/compare/storage-enhance?minimal=true"><img src="https://img.shields.io/npm/dm/storage-enhance.svg" alt="Downloads"></a>
    <a href="https://cdn.jsdelivr.net/npm/storage-enhance/storage-enhance.min.js"><img src="https://img.shields.io/bundlephobia/minzip/storage-enhance.svg" alt="Size"></a>
    <a href="https://github.com/theajack/storage-enhance/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/storage-enhance.svg" alt="License"></a>
    <a href="https://github.com/theajack/storage-enhance/search?l=typescript"><img src="https://img.shields.io/github/languages/top/theajack/storage-enhance.svg" alt="TopLang"></a>
    <a href="https://github.com/theajack/storage-enhance/issues"><img src="https://img.shields.io/github/issues-closed/theajack/storage-enhance.svg" alt="issue"></a>
    <a href="https://github.com/theajack/storage-enhance/blob/master/test/test-report.txt"><img src="https://img.shields.io/badge/test-passed-44BB44" alt="test"></a>
</p>

<h3>🚀 多端支持、功能强大的 Storage</h3>

**[English](https://github.com/theajack/storage-enhance/blob/master/README.md) | [更新日志](https://github.com/theajack/storage-enhance/blob/master/helper/version.md) | [反馈错误/缺漏](https://github.com/theajack/storage-enhance/issues/new) | [Gitee](https://gitee.com/theajack/storage-enhance)**

---

### 1. 特性

1. typescript 编写
2. 多端(web、小程序、nodejs)支持，且保持api一致
3. 支持自定义插件，对存取过程进行自定义操作
4. 支持 final 模式，存储的数据不能被再次修改
5. 支持 protect 模式，保护数据不会被普通模式的remove和clear删除
6. 支持 times 模式，对存取数据操作进行次数限制
7. 支持 expires 模式，设置数据过期时间
8. 支持对存取删除操作进行事件监听
9. 支持设置使用 temp 模式，仅存储在内存中，不写入磁盘

### 2. 快速使用

#### 2.1 npm 安装

```
npm i storage-enhance
```

```js
import storage from 'storage-enhance';
storage.set('key', 'value');
```

#### 2.2 cdn


```html
<script src="https://cdn.jsdelivr.net/npm/storage-enhance"></script>
<script>
    StorageEnhance.set('key', 'value');
</script>
```

### 3 api

详情请参考 [index.d.ts](https://github.com/theajack/storage-enhance/blob/master/src/index.d.ts)

```ts
export interface IStorage extends IBaseStorageFuncs {
    env: TStorageEnv;
    TYPE: IJson<TStorageType>;
    count(options?: IStorageTypeArg): number;
    keys(options?: IStorageTypeArg): string[];
    clear(options?: IStorageClearArg): boolean;
    exist(key: string, options: IStorageKeyArg): boolean;
    remove(key: string, options: IStorageRemoveArg): boolean;

    set(key: string, value: any, options?: IStorageSetOption): boolean;
    set(options: IStorageSetOption): boolean;
    set(array: (IStorageSetOption)[]): boolean;
    
    get(key: string): any;
    get(options: IStorageGetOption): any;
    get(array: IStorageGetOption[]): any[];

    all(options?: IStorageTypeArg & IStorageDetailArg): IKeyPathValuePair[];
    use(...plugins: IStoragePlugin[]): void;
    plugins(): IStoragePlugin[];
    registScope(arg1: string | IJson<IEvent | any>, arg2?: IEvent | any): void;
    scope(): void;
    type: TStorageType;
    EMPTY: Symbol;
}
```

### 4 基础读取方法

#### 4.1 set 存储数据

```js
storage.set('key', 'value', options);
storage.set(options);
storage.set([options, options]);
```

options 用于传入一些可选配置

set方法有以下 options

```ts
interface IStorageSetOption {
    key?: string;
    value?: any;
    onGet?: string | IEvent;
    onSet?: string | IEvent;
    onRemove?: string | IEvent;
    expires?: number; // 过期时间 datetime
    once?: boolean; // 是否是一次性的
    times?: number; // 可读取次数
    path?: string;
    final?: boolean; // 是否是不可改变的
    protect?: boolean; // 是否可以被删除的
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
    cookie?: { // 仅对 web环境下 启用 type=cookie时有效
        secure?: boolean; // default: false
        sameSite?: ICookieSameSite; // default: Lax
        priority?: ICookiePriority; // default: Medium
        sameParty?: boolean; // default: false
        expires?: Date | number; // default is session
        path?: string; // default
    };
}
```

#### 4.2 get 读取数据

```js
storage.get('key', options);
storage.get(options);
storage.get([options, options]);
```

options 用于传入一些可选配置

get方法有以下 options

```ts
interface IStorageGetOption{
    key?: string;
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
    detail?: boolean; // 是否需要展示数据详细信息
}
```

#### 4.3 remove 删除数据

```js
storage.remove('key', options);
storage.remove(options);
```

options 用于传入一些可选配置

remove方法有以下 options

```ts
interface IStorageRemoveOption{
    key?: string;
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
    protect?: boolean; // 是否删除protect类型
    cookie?: {
        path?: string;
        domain?: string;
    }
}
```

#### 4.4 clear 清空数据

```js
storage.clear();
storage.clear(options);
```

options 用于传入一些可选配置

clear 方法有以下 options

```ts
interface IStorageClearOption{
    protect?: boolean; // 是否删除protect类型
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
    cookie?: {
        path?: string;
        domain?: string;
    }
}
```

#### 4.5 keys 获取所有的数据key

```js
storage.keys();
storage.keys(options);
```

options 用于传入一些可选配置

keys 方法有以下 options

```ts
interface IStorageKeysOption{
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
}
```

#### 4.6 count 获取数据个数

```js
storage.count();
storage.count(options);
```

options 用于传入一些可选配置

count 方法有以下 options

```ts
interface IStorageCountOption{
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
}
```

#### 4.7 exist 检查某key是否存在

```js
storage.exist(key, options);
storage.exist(options);
```

options 用于传入一些可选配置

exist 方法有以下 options

```ts
interface IStorageExistOption {
    key?: string;
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
}
```

#### 4.8 all 获取所有数据

```js
storage.all();
storage.all(options);
```

options 用于传入一些可选配置

all 方法有以下 options

```ts
interface IStorageExistOption {
    type?: 'local' | 'session' | 'temp' | 'cookie'; // 当前操作使用什么类型
}
```

### 5 插件机制

storage-enhance 可以接入第三方用户的自定义插件来修改数据存取过程

#### 5.1 插件定义

以下是一个插件的接口

详情请参考 [plugin.d.ts](https://github.com/theajack/storage-enhance/blob/master/src/type/plugin.d.ts)

```ts
interface IStoragePlugin {
    name: TPluginName;
    beforeGet?(options: IPluginBeforeGetOptions): IStorageGetOption;
    get?(options: IPluginGetOptions): IStorageData | symbol;
    set?(options: IPluginSetOptions): IStorageData | boolean;
    remove?(options: IPluginRemoveOptions): boolean;
}
```

以下是一个给每个键增加一个 'test' 前缀的插件示例

```ts

export const TestPlugin: IStoragePlugin = {
    name: 'add-test',
    beforeGet ({options}) {
        options.key = `test_${options.key}`;
        return options;
    },
    set ({options, data, prevData}) {
        options.key = `test_${options.key}`;
        return data;
    },
};
```

其他示例可以参考[plugins](https://github.com/theajack/storage-enhance/tree/master/src/plugins)

#### 5.2 使用插件

```js
import storage from 'storage-enhance';
storage.use(TestPlugin);

storage.plugins(); // 获取已安装插件
```

### 6 其他接口

#### 6.1 type 属性

```js
storage.type = 'cookie'; // 使用cookie代替localStorage
storage.type = 'session'; // 使用session代替localStorage
// 可选值： 'local' | 'session' | 'temp' | 'cookie';

storage.TYPE.LOCAL; // 
```

#### 6.2 EMPTY 属性

```js
storage.EMPTY; // 表示空值，symbol类型
```


#### 6.3 scope

scope 用于注册全局唯一的方法或属性，主要用于插件机制中以规避重复注册方法的出现

```js
storage.registScope('testAttr', () => 1);
storage.registScope('testAttr', () => 2);

storage.scope().testAttr(); // 2
```

