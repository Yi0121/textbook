import { useEffect, useRef, useState } from 'react';
import type { Stroke, Point } from '../../types/canvas';
import { getStroke } from 'perfect-freehand';

// Helper to generate SVG path from perfect-freehand points
function getSvgPathFromStroke(stroke: number[][]) {
    if (!stroke.length) return "";
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );
    d.push("Z");
    return d.join(" ");
}

interface CanvasReplayProps {
    strokes: Stroke[];
    width?: number;
    height?: number;
    speed?: number; // 1x, 2x, etc.
    loop?: boolean;
    onComplete?: () => void;
}

export default function CanvasReplay({
    strokes,
    width = 800,
    height = 600,
    speed = 1,
    loop = false,
    onComplete
}: CanvasReplayProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 1
    const [renderedStrokes, setRenderedStrokes] = useState<Stroke[]>([]);

    const startTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);
    const totalDurationRef = useRef<number>(0);

    // Calculate total duration based on timestamps
    useEffect(() => {
        if (!strokes.length) return;

        // Find earliest and latest timestamp across all strokes
        let minTime = Infinity;
        let maxTime = -Infinity;

        strokes.forEach(s => {
            if (s.rawPoints && s.rawPoints.length) {
                const start = s.rawPoints[0].timestamp || 0;
                const end = s.rawPoints[s.rawPoints.length - 1].timestamp || 0;
                if (start < minTime) minTime = start;
                if (end > maxTime) maxTime = end;
            } else if (s.timestamp) {
                // Fallback for older strokes without rawPoints timestamps
                if (s.timestamp < minTime) minTime = s.timestamp;
                if (s.timestamp > maxTime) maxTime = s.timestamp;
            }
        });

        if (minTime === Infinity) totalDurationRef.current = 1000; // Default 1s
        else totalDurationRef.current = maxTime - minTime;

        // Add a buffer at the end
        totalDurationRef.current += 500;

    }, [strokes]);

    const play = () => {
        setIsPlaying(true);
        startTimeRef.current = Date.now() - (progress * totalDurationRef.current) / speed;
        animate();
    };

    const pause = () => {
        setIsPlaying(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const reset = () => {
        setIsPlaying(false);
        setProgress(0);
        setRenderedStrokes([]);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const animate = () => {
        const now = Date.now();
        const elapsed = (now - startTimeRef.current) * speed;
        let currentProgress = elapsed / totalDurationRef.current;

        if (currentProgress >= 1) {
            currentProgress = 1;
            if (loop) {
                startTimeRef.current = Date.now();
                currentProgress = 0;
                // Don't stop, just loop
            } else {
                setIsPlaying(false);
                if (onComplete) onComplete();
                // Stop here
            }
        }

        setProgress(currentProgress);

        // Update rendered strokes based on progress
        updateRenderedStrokes(currentProgress);

        if (currentProgress < 1 || loop) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    };

    const updateRenderedStrokes = (prog: number) => {
        // This is a naive implementation: it shows full strokes that "should" appear by this time
        // A better one would progressively reveal points within a stroke

        if (!strokes.length) return;

        const effectiveTime = prog * totalDurationRef.current;

        // We need the relative start time (minTime from above logic)
        let minTime = Infinity;
        strokes.forEach(s => {
            if (s.rawPoints && s.rawPoints.length) {
                if ((s.rawPoints[0].timestamp || 0) < minTime) minTime = s.rawPoints[0].timestamp || 0;
            } else if (s.timestamp) {
                if (s.timestamp < minTime) minTime = s.timestamp;
            }
        });
        if (minTime === Infinity) minTime = 0;

        const currentAbsTime = minTime + effectiveTime;

        // Filter and construct partial strokes
        const currentStrokes: Stroke[] = [];

        strokes.forEach(stroke => {
            if (!stroke.rawPoints) {
                // Simple visibility check for legacy strokes
                if ((stroke.timestamp || 0) <= currentAbsTime) {
                    currentStrokes.push(stroke);
                }
                return;
            }

            // For rawPoints, we filter the points that have occurred
            const visiblePoints = stroke.rawPoints.filter((p: Point) => (p.timestamp || 0) <= currentAbsTime);

            if (visiblePoints.length > 0) {
                // Re-generate path for partial stroke
                const strokePoints = getStroke(
                    visiblePoints.map(p => [p.x, p.y, p.pressure || 0.5]),
                    {
                        size: stroke.size,
                        thinning: 0.5,
                        smoothing: 0.5,
                        streamline: 0.5,
                    }
                );
                const path = getSvgPathFromStroke(strokePoints);

                currentStrokes.push({
                    ...stroke,
                    path: path
                });
            }
        });

        setRenderedStrokes(currentStrokes);
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // Also update on initial load or manual progress change if not playing
    useEffect(() => {
        if (!isPlaying) {
            updateRenderedStrokes(progress);
        }
    }, [progress, isPlaying, strokes]);

    // Calculate bounding box to auto-fit content
    const [viewBox, setViewBox] = useState(`0 0 ${width} ${height}`);

    useEffect(() => {
        if (!strokes.length) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        strokes.forEach(s => {
            if (s.rawPoints) {
                s.rawPoints.forEach(p => {
                    if (p.x < minX) minX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y > maxY) maxY = p.y;
                });
            } else {
                // Fallback for parsing path string if rawPoints missing (simplistic)
                // Truly implementing path parsing is complex, skipping for rawPoints priority
            }
        });

        if (minX !== Infinity) {
            const padding = 50;
            const contentWidth = maxX - minX + padding * 2;
            const contentHeight = maxY - minY + padding * 2;
            setViewBox(`${minX - padding} ${minY - padding} ${contentWidth} ${contentHeight}`);
        }
    }, [strokes]);

    return (
        <div className="flex flex-col gap-4">
            <div className="border rounded-xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden relative" style={{ width, height }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={viewBox}
                    className="absolute inset-0"
                    style={{ touchAction: 'none' }}
                >
                    {renderedStrokes.map(stroke => (
                        <path
                            key={stroke.id}
                            d={stroke.path}
                            fill={stroke.color}
                        />
                    ))}
                </svg>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg">
                <button
                    onClick={isPlaying ? pause : play}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                    {isPlaying ? '暫停' : '播放'}
                </button>
                <button
                    onClick={reset}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                    重置
                </button>

                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500 flex justify-between">
                        <span>進度</span>
                        <span>{Math.round(progress * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={progress}
                        onChange={(e) => {
                            pause();
                            setProgress(parseFloat(e.target.value));
                        }}
                        className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="text-sm font-mono text-gray-500 w-16 text-right">
                    {(progress * (totalDurationRef.current / 1000)).toFixed(1)}s
                </div>
            </div>
        </div>
    );
}
