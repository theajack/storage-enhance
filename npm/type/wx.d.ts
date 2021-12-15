
declare interface WX {
    getStorageInfoSync(): {
        keys: Array<string>;
        currentSize: number;
        limitSize: number;
    };

    clearStorageSync(): void;

    removeStorageSync(key: string): void;

    setStorageSync(key: string, data: any): void;

    getStorageSync(key: string): any;
}

declare const wx: WX;