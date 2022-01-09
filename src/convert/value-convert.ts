/*
 * @Author: tackchen
 * @Date: 2021-12-14 08:36:01
 * @LastEditors: tackchen
 * @LastEditTime: 2022-01-08 11:55:10
 * @FilePath: /storage-enhance/src/convert/value-convert.ts
 * @Description: Coding something
 */
import {IValueConverter, TOprate, TStorageDataType} from '../type/storage';


const ValueConvertMap: {
    [prop in TStorageDataType]?: IValueConverter
} = {
    'function': {
        set: (v) => `return (${v.toString()});`,
        get: (v) => ((new Function(v))()),
    },
    'reg': {
        set: (v) => (v.toString()),
        get: (v) => (new Function(`return ${v}`))(),
    },
    'html': {
        set: (v: HTMLElement) => (v.outerHTML),
        get: (v) => {
            const div = document.createElement('div');
            div.innerHTML = v;
            return div.children[0];
        },
    },
    'date': {
        set: (v: Date) => (v.getTime()),
        get: (v) => new Date(v),
    },
    'symbol': {
        set: (v: Symbol) => (v.toString()),
        get: (v) => (v.toString()),
    }
};

export function convertValue ({
    type, data, oprate
}:{
    type: TStorageDataType;
    data: any
    oprate: TOprate
}) {
    const converter = ValueConvertMap[type];
    if (!converter) return data;
    return converter[oprate](data);
}
