import storage from  '../src/index';
declare global {
    interface Window{
        [prop: string]: any;
    }
}

window.storage = storage;

// storage.set({key: 'aa', value: {a: 1}});

// window.getStorage = (key: string) => storage.get({key});