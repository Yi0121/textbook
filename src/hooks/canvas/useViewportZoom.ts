// hooks/useViewportZoom.ts
import { useEffect, useCallback, type RefObject } from 'react';
import type { Viewport } from '../../types';

interface UseViewportZoomProps {
    containerRef: RefObject<HTMLDivElement | null>;
    setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
    minScale?: number;
    maxScale?: number;
    sensitivity?: number;
}

/**
 * 處理畫布的滾輪縮放功能
 * - 按住 Ctrl/Cmd + 滾輪 可進行縮放
 * - 支援自訂縮放範圍與靈敏度
 */
export function useViewportZoom({
    containerRef,
    setViewport,
    minScale = 0.5,
    maxScale = 3,
    sensitivity = 0.002,
}: UseViewportZoomProps) {

    const handleWheel = useCallback((e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setViewport((prev: Viewport) => {
                const delta = -e.deltaY * sensitivity;
                const newScale = Math.min(Math.max(minScale, prev.scale + delta), maxScale);
                return { ...prev, scale: newScale };
            });
        }
    }, [setViewport, minScale, maxScale, sensitivity]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [containerRef, handleWheel]);
}
