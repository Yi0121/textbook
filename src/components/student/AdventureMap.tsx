import { useMemo } from 'react';
import type { LessonNode } from '../../types/lessonPlan';
import AdventureNode from './AdventureNode';

interface AdventureMapProps {
    nodes: LessonNode[];
    progressMap: Record<string, 'locked' | 'current' | 'completed' | 'upcoming'>;
    onNodeSelect: (nodeId: string) => void;
}



export default function AdventureMap({ nodes, progressMap, onNodeSelect }: AdventureMapProps) {
    // [Refactor] Group nodes by Stage for Island Layout
    const pathPoints = useMemo(() => {
        const points: { x: number; y: number }[] = [];
        const stageGroups: Record<string, number> = { A: 0, P: 0, O: 0, S: 0 };

        // Count nodes per stage to center them within islands
        nodes.forEach(n => {
            const s = n.stage || 'A';
            stageGroups[s] = (stageGroups[s] || 0) + 1;
        });

        // 定義島嶼座標 (Base Coordinate for each Island)
        const stageConfig = {
            'A': { baseX: 150, baseY: 60, width: 250 }, // Action: 探索島 (Low)
            'P': { baseX: 550, baseY: 30, width: 250 }, // Process: 試煉島 (High)
            'O': { baseX: 950, baseY: 50, width: 250 }, // Object: 寶藏島 (Mid)
            'S': { baseX: 1350, baseY: 40, width: 250 }, // Schema: 天空城 (High)
        };

        const currentStageCounts: Record<string, number> = { A: 0, P: 0, O: 0, S: 0 };

        nodes.forEach((node) => {
            const stage = (node.stage || 'A') as keyof typeof stageConfig;
            const config = stageConfig[stage] || stageConfig['A'];
            const indexInStage = currentStageCounts[stage]++;
            const totalInStage = stageGroups[stage];

            // Calculate local position within the island (Zig-zag or Arc)
            const xOffset = (config.width / (totalInStage + 1)) * (indexInStage + 1) - (config.width / 2);

            // Add some "organic" random-looking vertical variation
            const yOffset = Math.sin(indexInStage * 1.5) * 20;

            points.push({
                x: config.baseX + xOffset,
                y: config.baseY + yOffset
            });
        });

        return points;
    }, [nodes]);

    // Generate SVG path for connecting lines
    // We want to draw continuous lines within islands, but "bridges" between them
    const generateSvgPath = () => {
        if (pathPoints.length === 0) return '';

        let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;

        for (let i = 0; i < pathPoints.length - 1; i++) {
            const curr = pathPoints[i];
            const next = pathPoints[i + 1];
            const currNode = nodes[i];
            const nextNode = nodes[i + 1];

            // If jumping stages, draw a curved "Bridge"
            if (currNode.stage !== nextNode.stage) {
                const midX = (curr.x + next.x) / 2;
                const midY = (curr.y + next.y) / 2 - 50; // Arch up for the bridge
                d += ` Q ${midX} ${midY}, ${next.x} ${next.y}`;
            } else {
                // Within island: Organic curve
                const midX = (curr.x + next.x) / 2;
                const midY = (curr.y + next.y) / 2;
                d += ` Q ${curr.x + 20} ${curr.y}, ${midX} ${midY} T ${next.x} ${next.y}`;
            }
        }
        return d;
    };

    // Dynamic Width based on node count to ensure they aren't cramped
    // Each node takes about 320px width for the island aesthetic
    const containerWidth = 1500; // Fixed virtual width for the islands map
    const realContainerWidth = 1500; // Pixel width

    return (
        <div className="w-full overflow-x-auto pb-12 pt-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
            <div
                className="relative h-[600px] bg-[#dbeafe] rounded-[40px] shadow-2xl mx-auto overflow-hidden border-4 border-white"
                style={{ width: `${realContainerWidth}px`, minWidth: '100%' }}
            >
                {/* === Sky Background Layer === */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-indigo-100">
                    {/* Clouds */}
                    <div className="absolute top-20 left-20 text-white/40 text-9xl blur-sm animate-[pulse_8s_ease-in-out_infinite]">☁️</div>
                    <div className="absolute top-40 left-1/2 text-white/30 text-[10rem] blur-md animate-[pulse_10s_ease-in-out_infinite_1s]">☁️</div>
                    <div className="absolute bottom-32 right-40 text-white/50 text-8xl blur-xs animate-[pulse_12s_ease-in-out_infinite_2s]">☁️</div>

                    {/* Floating Particles */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white/40 rounded-full blur-[1px]"
                            style={{
                                width: Math.random() * 10 + 5 + 'px',
                                height: Math.random() * 10 + 5 + 'px',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animation: `float ${Math.random() * 5 + 5}s infinite ease-in-out ${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* === SVG Path Layer === */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                    viewBox={`0 0 ${containerWidth} 100`}
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="gradientPathH" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                            <stop offset="20%" stopColor="#fff" />
                            <stop offset="80%" stopColor="#fff" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Connecting Energy Beam */}
                    <path
                        d={generateSvgPath()}
                        fill="none"
                        stroke="url(#gradientPathH)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                        filter="url(#glow)"
                        className="opacity-60"
                    />

                    {/* Solid core line */}
                    <path
                        d={generateSvgPath()}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        className="opacity-40"
                    />
                </svg>

                {/* === Island Labels === */}
                <div className="absolute top-10 left-[150px] text-emerald-600/50 font-black text-4xl tracking-widest pointer-events-none select-none">ACTION</div>
                <div className="absolute bottom-10 left-[550px] text-amber-600/50 font-black text-4xl tracking-widest pointer-events-none select-none">PROCESS</div>
                <div className="absolute top-10 left-[900px] text-indigo-600/50 font-black text-4xl tracking-widest pointer-events-none select-none">OBJECT</div>
                <div className="absolute bottom-10 left-[1250px] text-purple-600/50 font-black text-4xl tracking-widest pointer-events-none select-none">SCHEMA</div>

                {/* === Nodes Layer === */}
                <div className="relative w-full h-full z-10">
                    {nodes.map((node, index) => (
                        pathPoints[index] && (
                            <AdventureNode
                                key={node.id}
                                node={node}
                                status={progressMap[node.id] || 'locked'}
                                onClick={() => onNodeSelect(node.id)}
                                x={(pathPoints[index].x / containerWidth) * 100}
                                y={(pathPoints[index].y / 100) * 100}
                                delay={0.1 * index}
                            />
                        )
                    ))}
                </div>

                {/* === Start Banner === */}
                <div className="absolute top-[45%] left-6 z-20 animate-bounce">
                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border-2 border-indigo-100 flex items-center gap-2 transform -rotate-6 hover:rotate-0 transition-transform cursor-default">
                        <span className="text-2xl">🚩</span>
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start</div>
                            <div className="text-sm font-black text-indigo-900 leading-none">冒險起點</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animation for particles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}

