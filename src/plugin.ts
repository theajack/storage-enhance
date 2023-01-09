/*
 * @Author: tackchen
 * @Date: 2021-12-21 11:38:45
 * @LastEditors: Please set LastEditors
 * @FilePath: /storage-enhance/src/plugin.ts
 * @Description: Coding something
 */
import {IPluginBeforeGetOptions, IPluginGetOptions, IPluginRemoveOptions, IPluginSetOptions, IStoragePlugin} from './type/plugin';
import {EMPTY} from './utils/constant';

const plugins: IStoragePlugin[] = [];

export function getPlugins () {
    return plugins;
}

export function usePlugin (...plugin: IStoragePlugin[]) {
    plugins.push(...plugin);
}

export function executePluginsBeforeGet ({options, storage}: IPluginBeforeGetOptions) {
    for (const plugin of plugins) {
        if (typeof plugin.beforeGet === 'function') {
            options = plugin.beforeGet({options, storage});
        }
    }
    return options;
}

export function executePluginsGet (options: IPluginGetOptions) {
    for (const plugin of plugins) {
        if (typeof plugin.get === 'function') {
            debugger;
            const data = plugin.get(options);
            if (typeof data === 'symbol') return EMPTY;
            options.data = data;
        }
    }
    return options.data;
}

export function executePluginsSet (options: IPluginSetOptions) {
    for (const plugin of plugins) {
        if (typeof plugin.set === 'function') {
            const data = plugin.set(options);
            if (typeof data === 'boolean') return data;
            options.data = data;
        }
    }
    return options.data;
}

export function executePluginsRemove (options: IPluginRemoveOptions) {
    for (const plugin of plugins) {
        if (typeof plugin.remove === 'function') {
            const data = plugin.remove(options);
            if (data === false) return false;
        }
    }
    return true;
}