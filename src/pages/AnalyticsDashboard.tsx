import React, { useMemo } from 'react';
import { useEditor } from '../context/EditorContext';
import CanvasReplay from '../components/canvas/CanvasReplay';
import { Clock, PenTool, Hash, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
    const { state: editorState } = useEditor();
    const { strokes } = editorState;

    // Calculate Metrics
    const metrics = useMemo(() => {
        if (!strokes.length) return { duration: 0, length: 0, count: 0, avgSpeed: 0 };

        let totalLength = 0;
        let minTime = Infinity;
        let maxTime = -Infinity;

        strokes.forEach(s => {
            // Count

            // Time
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
            } else {
                // Estimate for legacy? (skip for now)
            }
        });

        const duration = (maxTime - minTime) / 1000; // seconds

        return {
            duration: duration > 0 ? duration : 0,
            length: Math.round(totalLength),
            count: strokes.length,
            avgSpeed: duration > 0 ? Math.round(totalLength / duration) : 0
        };
    }, [strokes]);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">筆跡數據分析儀表板</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    icon={<Clock className="w-6 h-6 text-blue-500" />}
                    title="總耗時"
                    value={`${metrics.duration.toFixed(1)}s`}
                    desc="從第一筆到最後一筆的時間"
                />
                <MetricCard
                    icon={<PenTool className="w-6 h-6 text-purple-500" />}
                    title="總筆畫數"
                    value={metrics.count}
                    desc="所有筆畫的總數量"
                />
                <MetricCard
                    icon={<Hash className="w-6 h-6 text-green-500" />}
                    title="筆跡總長度"
                    value={`${metrics.length}px`}
                    desc="累計所有筆畫長度"
                />
                <MetricCard
                    icon={<Activity className="w-6 h-6 text-orange-500" />}
                    title="平均速度"
                    value={`${metrics.avgSpeed} px/s`}
                    desc="總長度 / 總耗時"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">筆跡回放</h2>
                <div className="border rounded-lg bg-slate-50 p-4 flex justify-center">
                    <CanvasReplay
                        strokes={strokes}
                        width={editorState.viewport ? 800 : 800} // Mock width
                        height={600}
                        speed={1}
                    />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, title, value, desc }: { icon: React.ReactNode, title: string, value: string | number, desc: string }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
            </div>
        </div>
    );
}
