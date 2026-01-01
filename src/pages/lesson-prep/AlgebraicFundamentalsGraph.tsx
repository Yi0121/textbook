import { memo, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    type Node,
    type Edge,
    MarkerType,
    type NodeProps,
    Handle,
    Position,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    type OnConnect,
    type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
    Bell,
    Video,
    Cpu,
    Zap,
    Users,
    Megaphone,
    ClipboardCheck,
    BarChart,
    Pill,
    Flag,
    RotateCw,
    BrainCircuit
} from 'lucide-react';

// ----------------------------------------------------------------------
// 1. Styling & Config
// ----------------------------------------------------------------------

interface VariantStyle {
    bg: string;
    border: string;
    handle: string;
    text: string;
    label: string;
    shadow?: string;
    header: string;
    accent: string;
    icon: any;
    lightBg: string;
    dashed?: boolean;
    shape?: 'rect' | 'diamond' | 'pill';
}

const VARIANTS: Record<string, VariantStyle> = {
    start: {
        bg: 'bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900',
        border: 'border-slate-700',
        text: 'text-white',
        label: 'text-slate-200',
        handle: 'bg-slate-500',
        header: 'bg-slate-800 text-slate-100',
        accent: 'ring-slate-400',
        shadow: 'shadow-2xl shadow-indigo-500/20',
        icon: Bell,
        lightBg: 'bg-slate-900/5',
        shape: 'pill'
    },
    media: {
        bg: 'bg-white',
        border: 'border-fuchsia-200',
        shadow: 'shadow-[0_4px_12px_-2px_rgba(192,38,211,0.12)]',
        header: 'bg-fuchsia-50 text-fuchsia-700',
        accent: 'ring-fuchsia-500',
        handle: 'bg-fuchsia-400',
        text: 'text-fuchsia-900',
        label: 'text-fuchsia-600',
        icon: Video,
        lightBg: 'bg-fuchsia-50/20'
    },
    apos: {
        bg: 'bg-white',
        border: 'border-amber-200',
        shadow: 'shadow-[0_4px_12px_-2px_rgba(245,158,11,0.15)]',
        header: 'bg-amber-50 text-amber-700',
        accent: 'ring-amber-500',
        handle: 'bg-amber-400',
        text: 'text-amber-900',
        label: 'text-amber-600',
        icon: Cpu, // Default APOS icon if not specified
        lightBg: 'bg-amber-50/20'
    },
    logic: {
        bg: 'bg-white',
        border: 'border-slate-300',
        shadow: 'shadow-md',
        header: 'bg-slate-100 text-slate-700',
        accent: 'ring-slate-400',
        handle: 'bg-slate-500',
        text: 'text-slate-800',
        label: 'text-slate-500',
        icon: BrainCircuit,
        lightBg: 'bg-slate-50',
        shape: 'diamond'
    },
    group: {
        bg: 'bg-white',
        border: 'border-blue-200',
        shadow: 'shadow-[0_4px_12px_-2px_rgba(59,130,246,0.12)]',
        header: 'bg-blue-50 text-blue-700',
        accent: 'ring-blue-500',
        handle: 'bg-blue-400',
        text: 'text-blue-900',
        label: 'text-blue-600',
        icon: Users,
        lightBg: 'bg-blue-50/20'
    },
    assessment: {
        bg: 'bg-white',
        border: 'border-rose-200',
        shadow: 'shadow-[0_4px_12px_-2px_rgba(225,29,72,0.12)]',
        header: 'bg-rose-50 text-rose-700',
        accent: 'ring-rose-500',
        handle: 'bg-rose-400',
        text: 'text-rose-900',
        label: 'text-rose-600',
        icon: ClipboardCheck,
        lightBg: 'bg-rose-50/20',
        shape: 'rect'
    },
    remedial: {
        bg: 'bg-gradient-to-br from-teal-100 to-cyan-100',
        border: 'border-teal-400 border-l-4 border-l-teal-600',
        shadow: 'shadow-md',
        header: 'bg-teal-100 text-teal-700',
        accent: 'ring-teal-500',
        handle: 'bg-teal-400',
        text: 'text-teal-900',
        label: 'text-teal-600',
        icon: Pill,
        lightBg: 'bg-teal-50',
        dashed: true
    },
    end: {
        bg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
        border: 'border-emerald-500',
        header: 'bg-emerald-700 text-white',
        accent: 'ring-emerald-500',
        handle: 'bg-emerald-400',
        text: 'text-white',
        label: 'text-emerald-100',
        shadow: 'shadow-2xl shadow-emerald-500/30',
        icon: Flag,
        lightBg: 'bg-emerald-800',
        shape: 'pill'
    }
};

type NodeData = {
    label: string;
    subLabel?: string;
    variant: string;
    icon?: any;
    customShape?: 'rect' | 'diamond' | 'pill';
    isAposTheory?: boolean;
};

// ----------------------------------------------------------------------
// 2. Custom Node Components
// ----------------------------------------------------------------------

const FlowNode = memo(({ data, selected }: NodeProps<Node<NodeData>>) => {
    const style = VARIANTS[data.variant] || VARIANTS.apos;
    const Icon = data.icon || style.icon;
    const shape = data.customShape || style.shape || 'rect';

    if (shape === 'pill') {
        return (
            <div className={`
                flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transition-transform duration-200
                ${style.bg} ${style.border} border-2
                ${selected ? 'ring-4 ring-offset-2 ' + style.accent + '/30' : ''}
                hover:scale-105
            `}>
                <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-current opacity-0" />
                <Icon size={20} className={style.text} />
                <div className={`font-black text-sm ${style.text}`}>{data.label}</div>
                <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-current opacity-0" />
            </div>
        );
    }

    if (shape === 'diamond') {
        return (
            <div className="relative w-[180px] h-[100px] flex items-center justify-center group">
                <div className={`
                    absolute inset-0 rotate-45 rounded-2xl shadow-md border-2 transition-all duration-300
                    ${style.bg} ${style.border}
                    ${selected ? 'ring-4 ring-offset-2 ' + style.accent + '/30 scale-105' : ''}
                    group-hover:shadow-xl group-hover:border-slate-400 group-hover:scale-110
                    before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity
                `} />
                <div className="relative z-10 flex flex-col items-center text-center p-2">
                    <Icon size={24} className={`${style.text} mb-1 group-hover:scale-110 transition-transform`} />
                    <div className={`text-xs font-bold leading-tight ${style.text}`}>{data.label}</div>
                    {data.subLabel && <div className="text-[9px] opacity-70 mt-1">{data.subLabel}</div>}
                </div>
                <Handle type="target" position={Position.Left} className={`!w-2 !h-2 !-translate-x-3 ${style.handle}`} />
                <Handle type="target" position={Position.Top} className={`!w-2 !h-2 !-translate-y-3 ${style.handle}`} id="top" />
                <Handle type="source" position={Position.Right} className={`!w-2 !h-2 !translate-x-3 ${style.handle}`} />
                <Handle type="source" position={Position.Bottom} className={`!w-2 !h-2 !translate-y-3 ${style.handle}`} id="bottom" />
            </div>
        );
    }

    return (
        <div className={`
            relative flex flex-col w-[220px] rounded-2xl transition-all duration-300
            ${style.bg} 
            border-2 ${selected ? `${style.border} ring-4 ring-offset-2 ${style.accent}/20` : style.border}
            ${style.shadow || ''}
            ${style.dashed ? 'border-dashed' : 'border-solid'}
            hover:scale-[1.02] hover:shadow-md
        `}>
            {/* Header Badge (optional ID equivalent) */}
            <div className={`absolute -top-3 left-4 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border ${style.header} border-inherit`}>
                {data.variant.toUpperCase()}
            </div>

            <Handle type="target" position={Position.Left} className={`!w-2 !h-2 !-left-1 !border-2 !border-white ${style.handle} transition-transform hover:scale-150`} />
            <Handle type="target" position={Position.Top} className={`!w-2 !h-2 !-top-1 !left-1/2 !-translate-x-1/2 !border-2 !border-white ${style.handle} transition-transform hover:scale-150`} id="top" />

            <div className="p-4 pt-5">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${style.header} bg-opacity-50`}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold leading-tight ${style.text}`}>
                            {data.label}
                        </div>
                        {data.subLabel && (
                            <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                                {data.subLabel}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className={`!w-2 !h-2 !-right-1 !border-2 !border-white ${style.handle} transition-transform hover:scale-150`} />
            <Handle type="source" position={Position.Bottom} className={`!w-2 !h-2 !-bottom-1 !left-2/3 !-translate-x-1/2 !border-2 !border-white ${style.handle} transition-transform hover:scale-150`} id="bottom" />

            {/* Extra Target Handlers for flexible routing */}
            <Handle type="target" position={Position.Bottom} className={`!w-2 !h-2 !-bottom-1 !left-1/3 !-translate-x-1/2 !border-2 !border-white ${style.handle} transition-transform hover:scale-150`} id="target-bottom" />
            <Handle type="source" position={Position.Left} className={`!w-2 !h-2 !-left-1 !top-2/3 !-translate-y-1/2 !border-2 !border-white ${style.handle} transition-transform hover:scale-150`} id="source-left" />
        </div>
    );
});

const GroupNode = memo(({ data, width, height }: NodeProps<Node<NodeData>>) => {
    if (data.isAposTheory) {
        return (
            <div
                className="relative w-full h-full bg-white group transition-transform duration-300"
                style={{
                    // Use standard bordering for perfect alignment
                    borderRadius: '24px',
                }}
            >
                {/* 
                    Layer 1: The Main Card Structure 
                    - Border-amber-400 is the single frame
                    - Removed black ring and offsets
                */}
                <div className="absolute inset-0 rounded-[24px] border-[4px] border-amber-400 bg-white/80 backdrop-blur-sm shadow-[0_20px_50px_-12px_rgba(245,158,11,0.3)] z-20 flex items-center justify-center overflow-hidden">

                    {/* Background decoration grid - Subtle */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    <img
                        src="/images/apos-theory-diagram.png"
                        alt="APOS Mathematical Construction Agent"
                        className="w-full h-full object-contain p-6 mix-blend-multiply opacity-100 relative z-10"
                    />
                </div>

                {/* Left connection point */}
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-4 !h-4 !bg-amber-500 !border-[3px] !border-white !rounded-full shadow-lg z-50 -translate-x-2 transition-transform hover:scale-125"
                />

                {/* Floating Title Pill */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg border-[4px] border-white transition-transform group-hover:-translate-y-1">
                        <BrainCircuit size={18} className="text-white" />
                        <span className="text-sm font-black text-white uppercase tracking-widest whitespace-nowrap drop-shadow-sm">
                            {data.label}
                        </span>
                    </div>
                </div>

                {/* Right connection point */}
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-4 !h-4 !bg-amber-500 !border-[3px] !border-white !rounded-full shadow-lg z-50 translate-x-2 transition-transform hover:scale-125"
                />
            </div>
        );
    }

    // Default group node style
    return (
        <div
            className="relative rounded-[2rem] border-2 border-dashed border-amber-200 bg-amber-50/10 transition-all duration-500"
            style={{ width, height }}
        >
            <div className="absolute -top-4 left-6 px-4 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-black text-amber-600 uppercase tracking-widest shadow-sm flex items-center gap-2">
                <RotateCw size={14} className="animate-spin-slow" />
                {data.label}
            </div>
        </div>
    );
});

const nodeTypes = {
    custom: FlowNode,
    group: GroupNode
};


// ----------------------------------------------------------------------
// 3. Graph Logic & Data
// ----------------------------------------------------------------------

interface AlgebraicFundamentalsGraphProps {
    isSidebarOpen: boolean;
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
    onDrop?: (event: React.DragEvent) => void;
    triggerDeleteNodeId?: string | null;
}

const AlgebraicFundamentalsGraph = ({ onNodeClick, onDrop, triggerDeleteNodeId }: AlgebraicFundamentalsGraphProps) => {

    const createEdge = (source: string, target: string, label?: string, type: 'default' | 'smoothstep' | 'bezier' | 'straight' = 'smoothstep', animated = false, color = '#64748b'): Edge => ({
        id: `e-${source}-${target}`, // Simplified ID for uniqueness
        source,
        target,
        type,
        animated,
        label,
        labelStyle: { fill: color, fontWeight: 700, fontSize: 11 },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
        style: { stroke: color, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color },
    });

    const initialNodes: Node[] = [
        // 1. Start & Intro
        {
            id: 'Start', type: 'custom',
            position: { x: 100, y: 280 },
            data: { label: '課程開始', variant: 'start', icon: Bell }
        },
        {
            id: 'Video', type: 'custom',
            position: { x: 300, y: 260 },
            data: { label: '課程自學', subLabel: '影片引入: 生活中的未知數情境', variant: 'media', icon: Video }
        },


        // 2. APOS Theory Diagram (Static Image - Optimized Size)
        {
            id: 'APOS_Group', type: 'group',
            position: { x: 600, y: 150 },
            style: { width: 520, height: 320 },
            data: { label: 'APOS Mathematical Construction Agent', isAposTheory: true }
        },

        // 3. Diagnostic
        {
            id: 'Diagnostic', type: 'custom',
            position: { x: 1280, y: 250 },
            data: { label: '學習分析 AI', subLabel: '程度診斷', variant: 'logic', customShape: 'diamond', icon: Zap }
        },


        // 4. Groups
        {
            id: 'Group_Adv', type: 'custom',
            position: { x: 1200, y: 350 },
            data: { label: '小組討論 (進階)', subLabel: '任務: 設計一道代數應用題', variant: 'group', icon: Users }
        },
        {
            id: 'Group_Basic', type: 'custom',
            position: { x: 1200, y: 600 },
            data: { label: '小組討論 (基礎)', subLabel: '任務: 完成同類項配對學習單', variant: 'group', icon: Users }
        },

        // 5. Share & Quiz (垂直對齊優化)
        {
            id: 'Share', type: 'custom',
            position: { x: 1500, y: 465 },
            data: { label: '成果發表與統整', variant: 'logic', customShape: 'rect', icon: Megaphone }
        },
        {
            id: 'Quiz', type: 'custom',
            position: { x: 1780, y: 465 },
            data: { label: '單元診斷測驗', variant: 'assessment', icon: ClipboardCheck }
        },

        // 6. Final Result (同步對齊)
        {
            id: 'Result', type: 'custom',
            position: { x: 2050, y: 475 },
            data: { label: '學習分析 AI', subLabel: '達標判定', variant: 'logic', customShape: 'diamond', icon: BarChart }
        },

        // 7. Remedial & End
        {
            id: 'Remedial', type: 'custom',
            position: { x: 1950, y: 700 },
            data: { label: '補救路徑', subLabel: '觀看解題影片 + 類題練習', variant: 'remedial', icon: Pill }
        },
        {
            id: 'End', type: 'custom',
            position: { x: 2300, y: 500 },
            data: { label: '單元結束', variant: 'end', icon: Flag }
        },
    ];


    const initialEdges: Edge[] = [
        createEdge('Start', 'Video', undefined, 'default'),
        createEdge('Video', 'APOS_Group', undefined, 'bezier', true, '#c026d3'), // Media to APOS with curve

        // APOS to Diagnostic (exit APOS to next phase) - emphasized connection
        {
            ...createEdge('APOS_Group', 'Diagnostic', undefined, 'smoothstep', true, '#f59e0b'),
            style: { stroke: '#f59e0b', strokeWidth: 2.5 }
        },

        // Split (綠色 = 精熟/成功, 橙色 = 待加強/需協助)
        createEdge('Diagnostic', 'Group_Adv', '精熟 (A)', 'smoothstep', false, '#10b981'),
        createEdge('Diagnostic', 'Group_Basic', '待加強 (B)', 'smoothstep', false, '#f97316'),

        // Merge to Share
        createEdge('Group_Adv', 'Share', undefined, 'smoothstep'),
        createEdge('Group_Basic', 'Share', undefined, 'smoothstep'),

        // Quiz
        createEdge('Share', 'Quiz', undefined, 'default'),
        createEdge('Quiz', 'Result', undefined, 'default'),

        // Result Logic
        createEdge('Result', 'End', '通過 (Pass)', 'straight', false, '#10b981'), // Green for pass
        {
            ...createEdge('Result', 'Remedial', '未通過 (Fail)', 'smoothstep', true, '#f43f5e'), // Red for fail
            sourceHandle: 'bottom',
            targetHandle: 'top' // Enter Remedial from Top to avoid conflict with exit on Left
        },

        // Remedial Loop back to Quiz (強化視覺效果)
        {
            ...createEdge('Remedial', 'Quiz', '補救後重測', 'smoothstep', true, '#f43f5e'),
            sourceHandle: 'source-left', // Leaving from left of Remedial (using new handle)
            targetHandle: 'target-bottom', // Entering bottom of Quiz
            style: {
                stroke: '#f43f5e',
                strokeWidth: 3.5,
                strokeDasharray: '8,6',
                filter: 'drop-shadow(0 2px 4px rgba(244,63,94,0.3))'
            }
        }
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sync external delete trigger
    useEffect(() => {
        if (triggerDeleteNodeId) {
            setNodes((nds) => nds.filter((n) => n.id !== triggerDeleteNodeId));
        }
    }, [triggerDeleteNodeId, setNodes]);

    const onConnect: OnConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Handle Drop to add new nodes to the internal state
    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        // Call external handler if provided (optional)
        if (onDrop) onDrop(event);

        const type = event.dataTransfer.getData('application/reactflow');
        const reactFlowBounds = (event.target as HTMLElement).getBoundingClientRect();

        // Calculate position relative to the flow pane
        // Note: Simple calculation, might vary with zoom/pan but good enough for demo
        const position = {
            x: event.clientX - reactFlowBounds.left - 100,
            y: event.clientY - reactFlowBounds.top - 50,
        };

        let newNode: Node | null = null;
        const id = `new-node-${Date.now()}`;

        if (type === 'agent') {
            const agentId = event.dataTransfer.getData('agentId');
            newNode = {
                id,
                type: 'custom',
                position,
                data: { label: 'New Agent', subLabel: agentId, variant: 'group', icon: Users }
            };
        } else if (type === 'resource') {
            const resourceTitle = event.dataTransfer.getData('resourceTitle');
            const resourceType = event.dataTransfer.getData('resourceType');
            newNode = {
                id,
                type: 'custom',
                position,
                data: { label: resourceTitle, subLabel: resourceType, variant: 'media', icon: Video }
            };
        }

        if (newNode) {
            setNodes((nds) => nds.concat(newNode!));
        }
    }, [onDrop, setNodes]);

    return (
        <div className="w-full h-full bg-slate-50 relative font-sans">


            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onDragOver={onDragOver}
                onDrop={handleDrop}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.1 }}
                minZoom={0.1}
            >
                <Background color="#cbd5e1" gap={24} size={1} variant={BackgroundVariant.Dots} />
                <Controls className="bg-white p-1 rounded-xl border border-slate-200 shadow-xl" />
                <MiniMap
                    position="bottom-right"
                    className="!bg-white !shadow-lg !rounded-xl !border-slate-100 !m-8"
                    nodeColor={(n: Node) => {
                        const v = n.data?.variant as string;
                        if (v === 'media') return '#e879f9';
                        if (v === 'apos') return '#fbbf24';
                        if (v === 'logic') return '#94a3b8';
                        if (v === 'group') return '#60a5fa';
                        return '#cbd5e1';
                    }}
                />
            </ReactFlow>

            {/* Legend (固定於螢幕底部中央) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white/90 backdrop-blur border border-slate-200/60 p-3 rounded-2xl shadow-lg flex gap-4 items-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Flow Type</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-sm" />
                        <span className="text-xs font-medium text-slate-600">Media</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                        <span className="text-xs font-medium text-slate-600">APOS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm" />
                        <span className="text-xs font-medium text-slate-600">Group</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" />
                        <span className="text-xs font-medium text-slate-600">Test</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlgebraicFundamentalsGraph;
