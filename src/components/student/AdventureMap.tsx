import { useMemo } from 'react';
import type { LessonNode } from '../../types/lessonPlan';
import AdventureNode from './AdventureNode';

interface AdventureMapProps {
    nodes: LessonNode[];
    progressMap: Record<string, 'locked' | 'current' | 'completed' | 'upcoming'>;
    onNodeSelect: (nodeId: string) => void;
}

// 使用 seeded random 來生成確定性的隨機數
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// 預定義的地圖路徑座標 (Snake pattern for horizontal scrolling)
const generatePathPoints = (count: number) => {
    const points = [];
    for (let i = 0; i < count; i++) {
        // Horizontal Zig-Zag Logic
        // Progress X steadily
        const x = 10 + i * 20; // 10%, 30%, 50%... but we might need pixels or scaled % if container is wide

        // Oscillate Y up and down
        let y = 50;
        if (i % 2 === 0) {
            y = 30; // Up
        } else {
            y = 70; // Down
        }

        // Add some organic randomness (使用 seeded random 確保確定性)
        const randomOffsetX = (seededRandom(i * 2 + 1) - 0.5) * 5;
        const randomOffsetY = (seededRandom(i * 2 + 2) - 0.5) * 10;

        points.push({
            x: x + randomOffsetX,
            y: y + randomOffsetY
        });
    }
    return points;
};

export default function AdventureMap({ nodes, progressMap, onNodeSelect }: AdventureMapProps) {
    // 使用 useMemo 計算路徑點，避免在 effect 中設置 state
    const pathPoints = useMemo(() => generatePathPoints(nodes.length), [nodes.length]);

    // 生成 SVG Path D 字串 (Cubic Bezier)
    const generateSvgPath = () => {
        if (pathPoints.length < 2) return '';

        // Scale coordinates to SVG viewbox
        // In this horizontal layout, 'x' in pathPoints corresponds to relative progress
        // We will map 0..100 logic to the actual wide viewbox

        const getSvgX = (pt: { x: number }) => pt.x; // Already generated as progressive X
        const getSvgY = (pt: { y: number }) => pt.y;

        let d = `M ${getSvgX(pathPoints[0])} ${getSvgY(pathPoints[0])}`;

        for (let i = 0; i < pathPoints.length - 1; i++) {
            const current = pathPoints[i];
            const next = pathPoints[i + 1];

            // Horizontal curve control points
            const cp1x = current.x + (next.x - current.x) / 2;
            const cp1y = current.y;
            const cp2x = next.x - (next.x - current.x) / 2;
            const cp2y = next.y;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }

        return d;
    };

    // Dynamic Width based on node count to ensure they aren't cramped
    // Each node takes about 250px width in the scrolling container
    const containerWidth = Math.max(100, nodes.length * 20 + 20); // Virtual width units for SVG
    const realContainerWidth = Math.max(800, nodes.length * 250); // Pixel width for CSS

    return (
        <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
            <div
                className="relative h-[500px] bg-[#e0f7fa] rounded-3xl shadow-inner mx-auto"
                style={{ width: `${realContainerWidth}px`, minWidth: '100%' }}
            >
                {/* Ambient Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden rounded-3xl">
                    <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-300 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[20%] left-[40%] w-96 h-96 bg-purple-300 rounded-full blur-[100px]" />
                    <div className="absolute top-[30%] right-[10%] w-80 h-80 bg-green-200 rounded-full blur-[100px]" />
                </div>

                {/* Cloud Decoration (Animated horizontally?) */}
                <div className="absolute top-10 left-10 text-white/40 animate-pulse text-6xl">☁️</div>
                <div className="absolute bottom-20 left-1/3 text-white/30 animate-pulse delay-1000 text-8xl">☁️</div>
                <div className="absolute top-16 right-20 text-white/40 animate-pulse delay-700 text-6xl">☁️</div>

                {/* SVG Path Layer */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    viewBox={`0 0 ${containerWidth} 100`}
                    preserveAspectRatio="none"
                >
                    {/* Background Path (Gray) */}
                    <path
                        d={generateSvgPath()}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="1 1" // Dotted line for academic feel
                        className="opacity-60"
                    />

                    {/* Active Path (Gradient) */}
                    <path
                        d={generateSvgPath()}
                        fill="none"
                        stroke="url(#gradientPathH)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="gradientPathH" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4fd1c5" />
                            <stop offset="50%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Nodes Layer */}
                <div className="relative w-full h-full">
                    {nodes.map((node, index) => (
                        pathPoints[index] && (
                            <AdventureNode
                                key={node.id}
                                node={node}
                                status={progressMap[node.id] || 'locked'}
                                onClick={() => onNodeSelect(node.id)}
                                // Map internal path units to % of container
                                x={(pathPoints[index].x / containerWidth) * 100}
                                y={(pathPoints[index].y / 100) * 100}
                            />
                        )
                    ))}
                </div>

                {/* Start Banner - Positioned at start of path */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full shadow-sm text-indigo-900 font-bold border border-white/50 text-sm z-20">
                    🚩 起點
                </div>
            </div>
        </div>
    );
}

// Override logic for AdventureNode positioning in the loop above to match standard CSS top/left
// We need to pass the exact % or pixel top.
// Since containerHeight is dynamic, let's pass exact coords.
