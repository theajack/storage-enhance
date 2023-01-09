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

<h3>🚀 Multi-terminal support, powerful Storage</h3>

**[中文](https://github.com/theajack/storage-enhance/blob/master/README.cn.md) | [Changelog](https://github.com/theajack/storage-enhance/blob/master/helper/version.md) | [Feedback Errors/Missing Points](https://github.com/theajack/storage-enhance/issues/new) | [Gitee](https://gitee.com/theajack/storage-enhance)**

---

### 1.characteristic

1. Typescript writing
2. Multi-terminal (web, mini program, nodejs) support, and keep the API consistent
3. Support custom plug-ins to customize the access process
4. Support final mode, stored data cannot be modified again
5. Support protect mode, protect data will not be deleted by remove and clear in normal mode
6. Support times mode to limit the number of data access operations
7. Support expires mode to set the data expiration time
8. Support time monitoring for access deletion operations
9. Support settings to use temp mode, only stored in memory, not written to disk

### 2.Quick to use

#### 2.1 npm installation

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

For details, please refer to [index.d.ts](https://github.com/theajack/storage-enhance/blob/master/src/index.d.ts)

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


### 4 Basic read methods

#### 4.1 set stores data

```js
storage.set('key', 'value', options);
storage.set(options);
storage.set([options, options]);
```

Options is used to pass in some optional configurations

The set method has the following options

```ts
interface IStorageSetOption {
    key?: string;
    value?: any;
    onGet?: string | IEvent;
    onSet?: string | IEvent;
    onRemove?: string | IEvent;
    expires?: number; Expiration datetime
    once?: boolean; Whether it is a one-time or not
    times?: number; Number of readable times
    path?: string;
    final?: boolean; Whether it is immutable
    protect?: boolean; Whether it can be deleted
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
    Cookie?: { // is only valid when type=cookies are enabled in the web environment
        secure?: boolean;  default: false
        sameSite?: ICookieSameSite;  default: Lax
        priority?: ICookiePriority;  default: Medium
        sameParty?: boolean;  default: false
        expires?: Date | number;  default is session
        path?: string;  default
    };
}
```

#### 4.2 get read data

```js
storage.get('key', options);
storage.get(options);
storage.get([options, options]);
```

Options is used to pass in some optional configurations

The get method has the following options

```ts
interface IStorageGetOption{
    key?: string;
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
    detail?: boolean; Whether data details need to be presented
}
```

#### 4.3 remove Delete data

```js
storage.remove('key', options);
storage.remove(options);
```

Options is used to pass in some optional configurations

The remove method has the following options

```ts
interface IStorageRemoveOption{
    key?: string;
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
    protect?: boolean; Whether to delete the protect type
    cookie?: {
        path?: string;
        domain?: string;
    }
}
```

#### 4.4 Clear Clear data

```js
storage.clear();
storage.clear(options);
```

Options is used to pass in some optional configurations

The clear method has the following options

```ts
interface IStorageClearOption{
    protect?: boolean; Whether to delete the protect type
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
    cookie?: {
        path?: string;
        domain?: string;
    }
}
```

#### 4.5 keys Get all data keys

```js
storage.keys();
storage.keys(options);
```

Options is used to pass in some optional configurations

The keys method has the following options

```ts
interface IStorageKeysOption{
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
}
```

#### 4.6 count Get the number of data

```js
storage.count();
storage.count(options);
```

Options is used to pass in some optional configurations

The count method has the following options

```ts
interface IStorageCountOption{
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
}
```

#### 4.7 exist Check if a key exists

```js
storage.exist(key, options);
storage.exist(options);
```

Options is used to pass in some optional configurations

The exist method has the following options

```ts
interface IStorageExistOption {
    key?: string;
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
}
```

#### 4.8 all get all the data

```js
storage.all();
storage.all(options);
```

Options is used to pass in some optional configurations

The all method has the following options

```ts
interface IStorageExistOption {
    type?: 'local' | 'session' | 'temp' | 'cookie'; What type the current operation uses
}
```

### 5 plugin mechanism

storage-enhance can be plug-in to customize third-party users to modify the data access process

#### 5.1 Plugin definition

The following is the interface of a plug-in

For details, please refer to [plugin.d.ts](https://github.com/theajack/storage-enhance/blob/master/src/type/plugin.d.ts)

```ts
interface IStoragePlugin {
    name: TPluginName;
    beforeGet? (options: IPluginBeforeGetOptions): IStorageGetOption;
    get? (options: IPluginGetOptions): IStorageData | symbol;
    set? (options: IPluginSetOptions): IStorageData | boolean;
    remove? (options: IPluginRemoveOptions): boolean;
}
```

The following is an example of a plugin that adds a 'test' prefix to each key

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

For other examples, see [plugins](https://github.com/theajack/storage-enhance/tree/master/src/plugins)

#### 5.2 Use plugins

```js
import storage from 'storage-enhance';
storage.use(TestPlugin);

storage.plugins(); Gets the installed plug-ins
```

### 6 Other interfaces

#### 6.1 type attribute

```js
storage.type = 'cookie'; Use cookies instead of localStorage
storage.type = 'session'; Use session instead of localStorage
Optional value: 'local' | 'session' | 'temp' | 'cookie';

storage.TYPE.LOCAL; // 
```

#### 6.2 EMPTY attribute

```js
storage.EMPTY; Represents a null value, of type symbol
```

#### 6.3 scope

scope is used to register globally unique methods or properties, and is mainly used in plug-in mechanisms to avoid duplicate registration methods

```js
storage.registScope('testAttr', () => 1);
storage.registScope('testAttr', () => 2);

storage.scope().testAttr(); //  2
```


