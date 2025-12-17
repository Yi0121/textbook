// hooks/useOnboarding.ts
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'hasCompletedTour';

/**
 * 處理新手引導 (Onboarding Tour) 狀態
 * - 使用 localStorage 記住是否已完成引導
 * - 提供完成和跳過引導的方法
 */
export function useOnboarding() {
    const [showWelcomeTour, setShowWelcomeTour] = useState(() => {
        const hasCompletedTour = localStorage.getItem(STORAGE_KEY);
        return hasCompletedTour !== 'true';
    });

    const handleCompleteTour = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setShowWelcomeTour(false);
    }, []);

    const handleSkipTour = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setShowWelcomeTour(false);
    }, []);

    // 重設引導狀態（供開發/測試用）
    const resetTour = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setShowWelcomeTour(true);
    }, []);

    return {
        showWelcomeTour,
        handleCompleteTour,
        handleSkipTour,
        resetTour,
    };
}
