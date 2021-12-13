
declare namespace wx {
    function getStorageInfoSync(): {
        keys: Array<string>;
        currentSize: number;
        limitSize: number;
    };

    function clearStorageSync(): void;

    function removeStorageSync(key: string): void;

    function setStorageSync(key: string, data: any): void;

    function getStorageSync(key: string): any;
}