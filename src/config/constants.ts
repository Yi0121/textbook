// config/constants.ts

/**
 * 導航區域配置
 */
export interface NavZone {
    id: number;
    label: string;
    description: string;
    x: number;
    y: number;
    color: string;
}

export const NAV_ZONES: NavZone[] = [
    { id: 1, label: '課程大綱', description: '本章節學習重點與目標', x: 0, y: 0, color: 'bg-blue-500' },
    { id: 2, label: '核心觀念', description: '粒線體與細胞呼吸作用', x: 1200, y: 0, color: 'bg-green-500' },
    { id: 3, label: '實驗數據', description: 'ATP 生成效率分析圖表', x: 0, y: 800, color: 'bg-orange-500' },
    { id: 4, label: '課後練習', description: '隨堂測驗與重點複習', x: 1200, y: 800, color: 'bg-purple-500' },
];

/**
 * 預設 Viewport 設定
 */
export const DEFAULT_VIEWPORT = {
    x: 0,
    y: 0,
    scale: 1,
} as const;

/**
 * Viewport 縮放範圍
 */
export const VIEWPORT_LIMITS = {
    minScale: 0.5,
    maxScale: 3,
    zoomSensitivity: 0.002,
} as const;

/**
 * LocalStorage Keys
 */
export const STORAGE_KEYS = {
    hasCompletedTour: 'hasCompletedTour',
    userId: 'textbook_user_id',
} as const;
