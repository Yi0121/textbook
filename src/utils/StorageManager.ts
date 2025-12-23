/**
 * StorageManager - 統一 localStorage 存取管理
 * 
 * 功能：
 * - 型別安全的存取操作
 * - 統一的錯誤處理
 * - 儲存容量監控
 * - 可選的序列化/反序列化策略
 */

// ==================== Types ====================

interface StorageOptions {
    /** 儲存前綴，用於命名空間隔離 */
    prefix?: string;
    /** 是否在錯誤時靜默（不拋出例外） */
    silent?: boolean;
}

// ==================== StorageManager Class ====================

class StorageManagerClass {
    private prefix: string;
    private silent: boolean;

    constructor(options: StorageOptions = {}) {
        this.prefix = options.prefix || 'textbook';
        this.silent = options.silent ?? true;
    }

    /**
     * 組合完整的 key
     */
    private getFullKey(key: string): string {
        return `${this.prefix}:${key}`;
    }

    /**
     * 取得資料
     */
    get<T>(key: string, defaultValue?: T): T | null {
        try {
            const fullKey = this.getFullKey(key);
            const data = localStorage.getItem(fullKey);

            if (data === null) {
                return defaultValue ?? null;
            }

            return JSON.parse(data) as T;
        } catch (error) {
            if (!this.silent) {
                console.error(`[StorageManager] Failed to get key "${key}":`, error);
            }
            return defaultValue ?? null;
        }
    }

    /**
     * 設定資料
     */
    set<T>(key: string, value: T): boolean {
        try {
            const fullKey = this.getFullKey(key);
            const serialized = JSON.stringify(value);
            localStorage.setItem(fullKey, serialized);
            return true;
        } catch (error) {
            if (!this.silent) {
                console.error(`[StorageManager] Failed to set key "${key}":`, error);
            }
            return false;
        }
    }

    /**
     * 移除資料
     */
    remove(key: string): boolean {
        try {
            const fullKey = this.getFullKey(key);
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            if (!this.silent) {
                console.error(`[StorageManager] Failed to remove key "${key}":`, error);
            }
            return false;
        }
    }

    /**
     * 檢查 key 是否存在
     */
    has(key: string): boolean {
        const fullKey = this.getFullKey(key);
        return localStorage.getItem(fullKey) !== null;
    }

    /**
     * 取得所有符合前綴的 keys
     */
    keys(): string[] {
        const result: string[] = [];
        const prefixWithColon = `${this.prefix}:`;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(prefixWithColon)) {
                result.push(key.slice(prefixWithColon.length));
            }
        }

        return result;
    }

    /**
     * 清除所有符合前綴的資料
     */
    clear(): number {
        const keys = this.keys();
        keys.forEach(key => this.remove(key));
        return keys.length;
    }

    /**
     * 取得儲存資訊
     */
    getStorageInfo(): {
        itemCount: number;
        totalBytes: number;
        formattedSize: string;
    } {
        const keys = this.keys();
        let totalBytes = 0;

        keys.forEach(key => {
            const fullKey = this.getFullKey(key);
            const data = localStorage.getItem(fullKey);
            if (data) {
                // UTF-16 每個字元 2 bytes
                totalBytes += data.length * 2;
            }
        });

        const kb = totalBytes / 1024;
        const formattedSize = kb < 1
            ? `${totalBytes} B`
            : kb < 1024
                ? `${kb.toFixed(1)} KB`
                : `${(kb / 1024).toFixed(2)} MB`;

        return {
            itemCount: keys.length,
            totalBytes,
            formattedSize,
        };
    }
}

// ==================== Singleton Instance ====================

/**
 * 預設的 StorageManager 實例
 * 使用 'textbook' 作為前綴
 */
export const storageManager = new StorageManagerClass({
    prefix: 'textbook',
    silent: true,
});

/**
 * 學習路徑專用的 StorageManager
 * 使用 'learning-path' 作為前綴
 */
export const learningPathStorage = new StorageManagerClass({
    prefix: 'learning-path',
    silent: true,
});

// ==================== Export ====================

export { StorageManagerClass };
export type { StorageOptions };
