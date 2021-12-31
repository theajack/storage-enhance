/*
 * @Author: tackchen
 * @Date: 2021-12-21 11:38:45
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/plugin.ts
 * @Description: Coding something
 */
import {IPluginGetOptions, IPluginRemoveOptions, IPluginSetOptions, IStoragePlugin} from './type/plugin';
import {EMPTY} from './utils/constant';

const plugins: IStoragePlugin[] = [];

export function getPlugins () {
    return plugins;
}

export function usePlugin (...plugin: IStoragePlugin[]) {
    plugins.push(...plugin);
}

export function executePluginsGet (options: IPluginGetOptions) {
    for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        if (typeof plugin.get === 'function') {
            const data = plugin.get(options);
            if (typeof data === 'symbol') {
                return EMPTY;
            } else {
                options.data = data;
            }
        }
    }
    return options.data;
}

export function executePluginsSet (options: IPluginSetOptions) {
    for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        if (typeof plugin.set === 'function') {
            const data = plugin.set(options);
            if (typeof data === 'boolean') {
                return data;
            } else {
                options.data = data;
            }
        }
    }
    return options.data;
}

export function executePluginsRemove (options: IPluginRemoveOptions) {
    for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        if (typeof plugin.remove === 'function') {
            const data = plugin.remove(options);
            if (data === false) {
                return false;
            }
        }
    }
    return true;
}