/*
 * @Author: tackchen
 * @Date: 2021-12-17 18:50:16
 * @LastEditors: tackchen
 * @FilePath: /storage-enhance/src/options/event.ts
 * @Description: Coding something
 */

import {IStoragePlugin} from '../type/plugin';
import {convertValue} from '../convert/value-convert';
import {getScope} from '../utils/scope';

function stringifyEvent (evt: string | Function): string {
    if (typeof evt === 'string') {
        return `@:${evt}`;
    }
    return convertValue({
        data: evt,
        type: 'function',
        oprate: 'set'
    });
}

export function parseEvnet (eventStr: string) {
    if (eventStr.indexOf('@:') === 0) {
        const eventName = eventStr.substring(2);
        const scope = getScope();
        if (typeof scope[eventName] === 'function') {
            return scope[eventName];
        }
        return null;
    } else {
        return (new Function(eventStr))();
    }
}

export const EventPlugin: IStoragePlugin = {
    name: 'event',
    get ({data, onFinalData}) {
        if (!data.onGet) return data;
        onFinalData((finalData) => {
            trigEvent(data.onGet as string, finalData);
        });
        return data;
    },
    set ({options, data, prevData}) {
        if (options.onGet) {
            data.onGet = stringifyEvent(options.onGet);
        }
        if (typeof prevData === 'object') { // 触发前一次onSet事件
            trigEvent(prevData.onSet, data.value);
        }
        if (options.onSet) {
            data.onSet = stringifyEvent(options.onSet);
            trigEvent(data.onSet, data.value);
        }
        return data;
    },
    remove ({prevData}) {
        if (typeof prevData === 'object') {
            trigEvent(prevData.onRemove, prevData.value);
        }
        return true;
    },
};

function trigEvent (eventStr: string | undefined, data: any) {
    if (typeof eventStr === 'undefined') return;
    const event = parseEvnet(eventStr);
    if (event === null) {
        console.warn('Invalid event:', eventStr);
        return;
    }
    event({scope: getScope(), data});
}