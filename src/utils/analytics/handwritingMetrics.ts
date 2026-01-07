import type { Stroke } from '../../types/canvas';

export interface BasicMetrics {
    duration: number;   // seconds
    length: number;     // pixels
    count: number;      // stroke count
    avgSpeed: number;   // pixels/second
}

export interface PressureMetrics {
    avgPressure: number; // 0.0 to 1.0
}

/**
 * Calculate basic stroke metrics
 */
export function calculateBasicMetrics(strokes: Stroke[]): BasicMetrics {
    if (!strokes.length) return { duration: 0, length: 0, count: 0, avgSpeed: 0 };

    let totalLength = 0;
    let minTime = Infinity;
    let maxTime = -Infinity;

    strokes.forEach(s => {
        if (s.rawPoints && s.rawPoints.length) {
            const start = s.rawPoints[0].timestamp || 0;
            const end = s.rawPoints[s.rawPoints.length - 1].timestamp || 0;
            if (start < minTime) minTime = start;
            if (end > maxTime) maxTime = end;

            // Length
            for (let i = 0; i < s.rawPoints.length - 1; i++) {
                const p1 = s.rawPoints[i];
                const p2 = s.rawPoints[i + 1];
                const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                totalLength += dist;
            }
        } else if (s.timestamp) {
            // Fallback for timestamp only strokes
            if (s.timestamp < minTime) minTime = s.timestamp;
            if (s.timestamp > maxTime) maxTime = s.timestamp;
        }
    });

    // Safe guard for single point or instant strokes
    if (minTime === Infinity) minTime = 0;
    if (maxTime === -Infinity) maxTime = 0;

    const duration = (maxTime - minTime) / 1000; // seconds

    return {
        duration: duration > 0 ? duration : 0,
        length: Math.round(totalLength),
        count: strokes.length,
        avgSpeed: duration > 0 ? Math.round(totalLength / duration) : 0
    };
}

/**
 * Calculate pressure metrics
 */
export function calculatePressureMetrics(strokes: Stroke[]): PressureMetrics {
    if (!strokes.length) return { avgPressure: 0 };

    let totalPressure = 0;
    let pointCount = 0;

    strokes.forEach(s => {
        if (s.rawPoints) {
            s.rawPoints.forEach(p => {
                // p.pressure might be undefined for mouse, default to 0.5 effectively but here we just skip or count
                if (typeof p.pressure === 'number') {
                    totalPressure += p.pressure;
                    pointCount++;
                }
            });
        }
    });

    return {
        avgPressure: pointCount > 0 ? parseFloat((totalPressure / pointCount).toFixed(2)) : 0
    };
}
