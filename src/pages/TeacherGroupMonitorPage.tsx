import { useState, useEffect } from 'react';
import {
    Clock, Play, Pause,
    MonitorPlay, Lock, Send,
    Lightbulb, FileText, Image as ImageIcon,
    ArrowRight, CheckCircle2, MoreHorizontal
} from 'lucide-react';

// Mock Data for Groups (LoiLo Style)
const MOCK_GROUPS = [
    {
        id: 'g1',
        name: '第一組',
        status: 'submitted', // submitted, working
        cards: [
            { id: 1, type: 'text', content: '長方形面積', color: 'bg-[#FFF9C4]', x: 20, y: 20 }, // Yellow (Text)
            { id: 2, type: 'image', content: '算式.jpg', color: 'bg-[#E1F5FE]', x: 120, y: 50 }, // Blue (Web/Image)
            { id: 3, type: 'think', content: '長寬互質?', color: 'bg-[#FFEBEE]', x: 60, y: 120 }, // Pink (Thinking)
        ],
        connections: [
            { from: 1, to: 3 },
            { from: 2, to: 3 }
        ]
    },
    {
        id: 'g2',
        name: '第二組',
        status: 'working',
        cards: [
            { id: 1, type: 'text', content: '題目分析', color: 'bg-[#FFF9C4]', x: 30, y: 30 },
            { id: 2, type: 'think', content: '切割圖形?', color: 'bg-[#FFEBEE]', x: 140, y: 40 },
        ],
        connections: [
            { from: 1, to: 2 }
        ]
    },
    {
        id: 'g3',
        name: '第三組',
        status: 'working',
        cards: [
            { id: 1, type: 'image', content: '草稿', color: 'bg-[#E1F5FE]', x: 40, y: 40 },
            { id: 2, type: 'text', content: '無法理解', color: 'bg-[#FFF9C4]', x: 150, y: 100 },
        ],
        connections: []
    },
    {
        id: 'g4',
        name: '第四組',
        status: 'submitted',
        cards: [
            { id: 1, type: 'text', content: '公式推導', color: 'bg-[#FFF9C4]', x: 20, y: 20 },
            { id: 2, type: 'think', content: '驗證', color: 'bg-[#FFEBEE]', x: 180, y: 30 },
            { id: 3, type: 'text', content: '結論', color: 'bg-[#FFF9C4]', x: 100, y: 110 },
        ],
        connections: [
            { from: 1, to: 2 },
            { from: 2, to: 3 }
        ]
    },
];

export default function TeacherGroupMonitorPage() {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [groups] = useState(MOCK_GROUPS);

    // Simulated Time
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-screen flex flex-col bg-[#2C3E50] font-sans text-white overflow-hidden relative">

            {/* 1. LoiLo Top Bar */}
            <header className="h-16 bg-[#34495E] flex items-center justify-between px-4 shadow-md border-b border-[#4e6479] shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                            <MonitorPlay className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-wide">4年級數學：面積</h1>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">進行中</span>
                                <span>12:45 - 13:30</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Timer */}
                    <div className="bg-[#2C3E50] px-4 py-1.5 rounded-full border border-gray-600 flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-xl font-bold text-white tracking-widest">{formatTime(currentTime)}</span>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center transition-colors"
                        >
                            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>
                    </div>

                    {/* LoiLo Teacher Controls */}
                    <div className="flex items-center gap-2">
                        <button className="flex flex-col items-center gap-1 group px-2">
                            <div className="w-10 h-10 rounded-xl bg-[#E74C3C] group-hover:bg-[#ff6b5b] flex items-center justify-center shadow-lg transition-all">
                                <Lock className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">鎖定</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group px-2">
                            <div className="w-10 h-10 rounded-xl bg-[#27AE60] group-hover:bg-[#2ecc71] flex items-center justify-center shadow-lg transition-all">
                                <Send className="w-5 h-5 ml-0.5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">傳送</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group px-2">
                            <div className="w-10 h-10 rounded-xl bg-[#F1C40F] group-hover:bg-[#f3ce37] flex items-center justify-center shadow-lg transition-all">
                                <Lightbulb className="w-5 h-5 text-black/70" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">比較</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Main Grid (Monitoring View) */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#253238]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                    {groups.map(group => (
                        <div key={group.id} className="flex flex-col gap-2 group cursor-pointer">

                            {/* Header Label */}
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white text-[#2C3E50] font-black flex items-center justify-center text-xs border-2 border-indigo-500">
                                        {group.id.replace('g', '')}
                                    </div>
                                    <span className="font-bold text-gray-300 group-hover:text-white">{group.name}</span>
                                </div>
                                {group.status === 'submitted' && (
                                    <span className="bg-[#27AE60] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                        <CheckCircle2 size={10} /> 提出
                                    </span>
                                )}
                            </div>

                            {/* Mini Desktop Preview (The LoiLo Canvas) */}
                            <div className="aspect-[4/3] bg-[#546E7A] rounded-2xl relative shadow-lg overflow-hidden border-2 border-transparent group-hover:border-indigo-400 transition-all hover:scale-[1.02]">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{ backgroundImage: 'linear-gradient(#CFD8DC 1px, transparent 1px), linear-gradient(90deg, #CFD8DC 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                />

                                {/* Mini Cards */}
                                {group.cards.map(card => (
                                    <div
                                        key={card.id}
                                        className={`absolute w-24 h-16 rounded-lg p-2 shadow-sm flex flex-col gap-1 items-center justify-center text-center
                                            ${card.color} text-[#333] border border-black/10`}
                                        style={{ left: card.x, top: card.y }}
                                    >
                                        <div className="opacity-50">
                                            {card.type === 'text' && <FileText size={12} />}
                                            {card.type === 'image' && <ImageIcon size={12} />}
                                            {card.type === 'think' && <Lightbulb size={12} />}
                                        </div>
                                        <span className="text-[8px] leading-tight font-bold line-clamp-2">{card.content}</span>
                                    </div>
                                ))}

                                {/* Simple SVG Connections Simulation */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                                            <polygon points="0 0, 6 2, 0 4" fill="#90A4AE" />
                                        </marker>
                                    </defs>
                                    {group.connections.map((conn, idx) => {
                                        const fromCard = group.cards.find(c => c.id === conn.from);
                                        const toCard = group.cards.find(c => c.id === conn.to);
                                        if (!fromCard || !toCard) return null;

                                        // Simple center-to-center coords (approximate for mock)
                                        const x1 = fromCard.x + 48; // half width
                                        const y1 = fromCard.y + 32; // half height
                                        const x2 = toCard.x + 48;
                                        const y2 = toCard.y + 32;

                                        return (
                                            <line
                                                key={idx}
                                                x1={x1} y1={y1} x2={x2} y2={y2}
                                                stroke="#90A4AE"
                                                strokeWidth="2"
                                                markerEnd="url(#arrowhead)"
                                            />
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* Toolbar under each screen */}
                            <div className="flex justify-end gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 bg-[#455A64] rounded hover:bg-white hover:text-[#2C3E50] text-gray-300">
                                    <MonitorPlay size={14} />
                                </button>
                                <button className="p-1.5 bg-[#455A64] rounded hover:bg-white hover:text-[#2C3E50] text-gray-300">
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Add Group */}
                    <div className="flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-6 h-6 rounded-full bg-transparent border-2 border-dashed border-gray-500 text-gray-500 font-bold flex items-center justify-center text-xs">
                                +
                            </div>
                            <span className="font-bold text-gray-500">新增小組</span>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-600 bg-transparent flex flex-col items-center justify-center text-gray-500 gap-2">
                            <MonitorPlay size={32} />
                            <span className="text-sm font-bold">點擊新增</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. Bottom Action Bar (LoiLo Style Footer) */}
            <div className="h-14 bg-[#34495E] flex items-center justify-center gap-8 border-t border-[#4e6479]">
                <div className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer px-4 py-1 rounded-lg hover:bg-white/5 transition-all">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="font-bold text-sm">需要協助 (0)</span>
                </div>
                <div className="w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-1 text-white cursor-pointer px-4 py-1 rounded-lg bg-white/10 border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="font-bold text-sm">已提出 (2/4)</span>
                    <ArrowRight size={14} className="ml-1" />
                </div>
            </div>

        </div>
    );
}
