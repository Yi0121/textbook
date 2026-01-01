import { memo, useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    User,
    Bot,
    GraduationCap,
    Presentation,
    Users,
    ClipboardList,
    BrainCircuit,
    Pencil,
    Video,
    MessageSquare,
    BarChart3,
    Flag,
    Play,
    Settings,
    Database,
    Search,
    Calculator,
    FileText,
    Brain,
    Laptop,
    Vote,
    Share2,
    CheckCircle
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
    lightBg: string; // Not used in all, but kept for compatibility
}

// Colors based on MMD: 
// Teacher: fill:#FFFACD (LemonChiffon), stroke:#DAA520 (GoldenRod)
// Student: fill:#E0FFFF (LightCyan), stroke:#008B8B (DarkCyan)
// AI: fill:#FFF0F5 (LavenderBlush), stroke:#DB7093 (PaleVioletRed)

const VARIANTS: Record<string, VariantStyle> = {
    teacher: {
        bg: 'bg-[#FFFACD]',
        border: 'border-[#DAA520]',
        handle: 'bg-[#DAA520]',
        text: 'text-[#B8860B]',
        label: 'text-[#B8860B]',
        header: 'bg-[#EEE8AA] text-[#8B4513]',
        accent: 'ring-[#DAA520]',
        shadow: 'shadow-md shadow-yellow-500/10',
        icon: User,
        lightBg: 'bg-[#FFFACD]/50',
    },
    student: {
        bg: 'bg-[#E0FFFF]',
        border: 'border-[#008B8B]',
        handle: 'bg-[#008B8B]',
        text: 'text-[#006666]',
        label: 'text-[#006666]',
        header: 'bg-[#AFEEEE] text-[#008B8B]',
        accent: 'ring-[#008B8B]',
        shadow: 'shadow-md shadow-cyan-500/10',
        icon: GraduationCap,
        lightBg: 'bg-[#E0FFFF]/50',
    },
    ai: {
        bg: 'bg-[#FFF0F5]',
        border: 'border-[#DB7093]',
        handle: 'bg-[#DB7093]',
        text: 'text-[#C71585]',
        label: 'text-[#C71585]',
        header: 'bg-[#FFC0CB] text-[#C71585]',
        accent: 'ring-[#DB7093]',
        shadow: 'shadow-md shadow-pink-500/10',
        icon: Bot,
        lightBg: 'bg-[#FFF0F5]/50',
    }
};

type NodeData = {
    label: string;
    subLabel?: string;
    variant: 'teacher' | 'student' | 'ai';
    icon?: any;
    groupLabel?: string;
    tools?: string[];
};

// ----------------------------------------------------------------------
// 2. Custom Node Components
// ----------------------------------------------------------------------

// Event Helper
const dispatchSettingsEvent = (nodeId: string) => {
    const event = new CustomEvent('open-node-settings', { detail: { nodeId } });
    window.dispatchEvent(event);
};

const dispatchPlayEvent = (nodeId: string) => {
    const event = new CustomEvent('play-node-action', { detail: { nodeId } });
    window.dispatchEvent(event);
};

const FlowNode = memo(({ id, data, selected }: NodeProps<Node<NodeData>>) => {
    const style = VARIANTS[data.variant] || VARIANTS.student;
    const Icon = data.icon || style.icon;

    return (
        <div className={`
            relative flex flex-col w-[200px] rounded-xl transition-all duration-300 group
            ${style.bg} 
            border-2 ${selected ? `${style.border} ring-4 ring-offset-2 ${style.accent}/20` : style.border}
            ${style.shadow || ''}
            hover:scale-[1.02] hover:shadow-lg
        `}>
            {/* Optional Group Label Badge */}
            {data.groupLabel && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap z-10">
                    {data.groupLabel}
                </div>
            )}

            {/* Hover Actions (n8n style) */}
            <div className="absolute -top-3 -right-2 flex gap-1 transform scale-90 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                <button
                    className="p-1.5 rounded-full bg-white shadow-md border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 text-slate-500 transition-colors"
                    title="執行/預覽"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatchPlayEvent(id);
                    }}
                >
                    <Play size={14} fill="currentColor" className="opacity-80" />
                </button>
                <button
                    className="p-1.5 rounded-full bg-white shadow-md border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 text-slate-500 transition-colors"
                    title="設定"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatchSettingsEvent(id);
                    }}
                >
                    <Settings size={14} />
                </button>
            </div>

            <Handle type="target" position={Position.Left} className={`!w-3 !h-3 !-left-1.5 !border-2 !border-white ${style.handle} transition-transform hover:scale-125`} />
            <Handle type="target" position={Position.Top} className={`!w-3 !h-3 !-top-1.5 !border-2 !border-white ${style.handle} transition-transform hover:scale-125`} id="top" />

            <div className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`p-2 rounded-full ${style.header} bg-opacity-30`}>
                    <Icon size={24} strokeWidth={2} />
                </div>
                <div>
                    <div className={`text-sm font-bold leading-tight ${style.text}`}>
                        {data.label}
                    </div>
                </div>

                {/* MCP Tools Section */}
                {data.tools && data.tools.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-black/5 w-full">
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {data.tools.map((tool, idx) => (
                                <div key={idx} className="flex items-center gap-1 px-1.5 py-0.5 bg-white/60 rounded text-[10px] font-medium text-slate-600 border border-black/5">
                                    {/* Icon Mapping based on tool name keyword */}
                                    {tool.includes('Search') && <Search size={10} />}
                                    {tool.includes('DB') && <Database size={10} />}
                                    {tool.includes('CMS') && <FileText size={10} />}
                                    {tool.includes('Video') && <Video size={10} />}
                                    {tool.includes('Quiz') && <CheckCircle size={10} />}
                                    {tool.includes('GeoGebra') && <Calculator size={10} />}
                                    {tool.includes('Math') && <Calculator size={10} />}
                                    {tool.includes('Whiteboard') && <Laptop size={10} />}
                                    {tool.includes('Bot') && <MessageSquare size={10} />}
                                    {tool.includes('Agent') && <Brain size={10} />}
                                    {tool.includes('Analysis') && <BarChart3 size={10} />}
                                    {tool.includes('Vote') && <Vote size={10} />}
                                    {tool.includes('Share') && <Share2 size={10} />}
                                    {tool}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Right} className={`!w-3 !h-3 !-right-1.5 !border-2 !border-white ${style.handle} transition-transform hover:scale-125`} />
            <Handle type="source" position={Position.Bottom} className={`!w-3 !h-3 !-bottom-1.5 !border-2 !border-white ${style.handle} transition-transform hover:scale-125`} id="bottom" />
        </div>
    );
});

const nodeTypes = {
    custom: FlowNode,
};


// ----------------------------------------------------------------------
// 3. Graph Logic & Data
// ----------------------------------------------------------------------

interface CPSGraphProps {
    isSidebarOpen: boolean;
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
    onDrop?: (event: React.DragEvent) => void;
    triggerDeleteNodeId?: string | null;
}

const CPSGraph = ({ onNodeClick, onDrop, triggerDeleteNodeId }: CPSGraphProps) => {

    const navigate = useNavigate();
    const [configNodeId, setConfigNodeId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'all' | 'student'>('all');

    const createEdge = (source: string, target: string, label?: string, type: 'default' | 'smoothstep' | 'straight' = 'smoothstep', dashed = false, double = false): Edge => ({
        id: `e-${source}-${target}`,
        source,
        target,
        type,
        label,
        animated: dashed, // Using animated for dashed effect in simple cases, or custom style
        style: {
            stroke: '#94a3b8',
            strokeWidth: 2,
            strokeDasharray: dashed ? '5,5' : undefined
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
        markerStart: double ? { type: MarkerType.ArrowClosed, color: '#94a3b8' } : undefined,
    });

    const initialNodes = useMemo<Node<NodeData>[]>(() => [
        // S1: 備課階段
        {
            id: 'A1', type: 'custom',
            position: { x: 0, y: 100 },
            data: { label: '備課 AI', variant: 'ai', groupLabel: '備課階段', icon: BrainCircuit, tools: ['Web Search', 'Curriculum DB'] }
        },
        {
            id: 'T1', type: 'custom',
            position: { x: 0, y: 350 },
            data: { label: '教師準備', variant: 'teacher', groupLabel: '備課階段', icon: User, tools: ['CMS', 'Editor'] }
        },

        // S2: 課前自學
        {
            id: 'ST1', type: 'custom',
            position: { x: 300, y: 350 },
            data: { label: '學生: 影片/前測', variant: 'student', groupLabel: '課前自學', icon: Video, tools: ['Video Player', 'Quiz Engine'] }
        },

        // S3: 個人解題
        {
            id: 'ST2', type: 'custom',
            position: { x: 600, y: 350 },
            data: { label: '個人白板/GGB', variant: 'student', groupLabel: '個人解題', icon: Pencil, tools: ['GeoGebra', 'Whiteboard'] }
        },
        {
            id: 'AI_Ind', type: 'custom',
            position: { x: 600, y: 600 },
            data: { label: 'AI 輔助解題', variant: 'ai', groupLabel: '個人解題', icon: Bot, tools: ['Math Solver', 'Hint Gen'] }
        },

        // S4: 組內共學
        {
            id: 'G1', type: 'custom',
            position: { x: 900, y: 350 },
            data: { label: '分工發表 A1/A2', variant: 'student', groupLabel: '組內共學', icon: Users, tools: ['Share'] }
        },
        {
            id: 'G2', type: 'custom',
            position: { x: 1200, y: 350 },
            data: { label: '討論共識 B/C', variant: 'student', groupLabel: '組內共學', icon: MessageSquare, tools: ['Vote', 'Whiteboard'] }
        },
        {
            id: 'AI_Co', type: 'custom',
            position: { x: 1200, y: 100 },
            data: { label: 'TeamTutor CPS Agent', variant: 'ai', groupLabel: '組內共學', icon: Bot, tools: ['RAG Knowledge', 'Facilitator Bot'] }
        },
        {
            id: 'AI_Bot', type: 'custom',
            position: { x: 1200, y: 600 },
            data: { label: '虛擬組員 Agent', variant: 'ai', groupLabel: '組內共學', icon: Bot, tools: ['Persona Bot'] }
        },

        // S5: 組間互學
        {
            id: 'G3', type: 'custom',
            position: { x: 1550, y: 350 },
            data: { label: '解說員發表 D1', variant: 'student', groupLabel: '組間互學', icon: Presentation, tools: ['Screen Share'] }
        },
        {
            id: 'G4', type: 'custom',
            position: { x: 1850, y: 350 },
            data: { label: '評分員互評 D2', variant: 'student', groupLabel: '組間互學', icon: ClipboardList, tools: ['Rubric Form'] }
        },
        {
            id: 'G5', type: 'custom',
            position: { x: 2150, y: 350 },
            data: { label: '個人自評 D3', variant: 'student', groupLabel: '組間互學', icon: ClipboardList, tools: ['Reflection Form'] }
        },
        {
            id: 'AI_Inter', type: 'custom',
            position: { x: 1550, y: 100 },
            data: { label: 'CPS 導學 Agent', variant: 'ai', groupLabel: '組間互學', icon: Bot, tools: ['Summary Gen', 'Feedback Bot'] }
        },
        {
            id: 'AI_Ana', type: 'custom',
            position: { x: 1850, y: 600 },
            data: { label: '學習分析 AI', variant: 'ai', groupLabel: '組間互學', icon: BarChart3, tools: ['Data Analysis'] }
        },

        // S6: 總結與課後
        {
            id: 'T2', type: 'custom',
            position: { x: 2500, y: 350 },
            data: { label: '教師導學/反饋', variant: 'teacher', groupLabel: '總結與課後', icon: GraduationCap, tools: ['Dashboard'] }
        },
        {
            id: 'AI_Final', type: 'custom',
            position: { x: 2500, y: 100 },
            data: { label: '學習分析統整', variant: 'ai', groupLabel: '總結與課後', icon: BarChart3, tools: ['Report Gen'] }
        },
        {
            id: 'ST3', type: 'custom',
            position: { x: 2800, y: 350 },
            data: { label: '後測/完成', variant: 'student', groupLabel: '總結與課後', icon: Flag, tools: ['Final Quiz'] }
        },
    ], []);


    const initialEdges = useMemo<Edge[]>(() => [
        // S1
        createEdge('A1', 'T1', '生成教案/題目'),

        // S1 -> S2
        createEdge('T1', 'ST1', '發布內容'),

        // S2 -> S3
        createEdge('ST1', 'ST2'),

        // S3 Internal
        createEdge('AI_Ind', 'ST2', undefined, 'smoothstep', true), // Dotted

        // S3 -> S4
        createEdge('ST2', 'G1'),

        // S4 Internal
        createEdge('G1', 'G2'),
        createEdge('AI_Co', 'G2', undefined, 'smoothstep', false, true), // Double headed
        createEdge('AI_Bot', 'G2', undefined, 'smoothstep', true), // Dotted

        // S4 -> S5
        createEdge('G2', 'G3'),

        // S5 Internal
        createEdge('G3', 'G4'),
        createEdge('G4', 'G5'),
        createEdge('AI_Inter', 'G3', undefined, 'smoothstep', false, true), // Double headed
        createEdge('AI_Ana', 'G4', undefined, 'smoothstep', true), // Dotted

        // S5 -> S6
        createEdge('G5', 'T2'),

        // S6 Internal
        createEdge('AI_Final', 'T2'),
        createEdge('T2', 'ST3'),
    ], []);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sync external delete trigger
    useEffect(() => {
        if (triggerDeleteNodeId) {
            setNodes((nds) => nds.filter((n) => n.id !== triggerDeleteNodeId));
        }
    }, [triggerDeleteNodeId, setNodes]);

    // View Mode Filter Effect
    useEffect(() => {
        if (viewMode === 'student') {
            const studentNodes = initialNodes.filter(n => n.data.variant === 'student');
            const studentNodeIds = new Set(studentNodes.map(n => n.id));
            const studentEdges = initialEdges.filter(e =>
                studentNodeIds.has(e.source) && studentNodeIds.has(e.target)
            );
            setNodes(studentNodes);
            setEdges(studentEdges);
        } else {
            setNodes(initialNodes);
            setEdges(initialEdges);
        }
    }, [viewMode, initialNodes, initialEdges, setNodes, setEdges]);

    // Listener for settings & play
    useEffect(() => {
        const handleSettingsEvent = (e: Event) => {
            const customEvent = e as CustomEvent;
            setConfigNodeId(customEvent.detail.nodeId);
        };
        const handlePlayEvent = () => {
            navigate('/student/quiz/assign-002');
        };

        window.addEventListener('open-node-settings', handleSettingsEvent);
        window.addEventListener('play-node-action', handlePlayEvent);

        return () => {
            window.removeEventListener('open-node-settings', handleSettingsEvent);
            window.removeEventListener('play-node-action', handlePlayEvent);
        };
    }, [navigate]);

    const onConnect: OnConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        if (onDrop) onDrop(event);
        // ... (simplified drop logic for now, similar to original if needed)
    }, [onDrop]);

    const activeNode = nodes.find(n => n.id === configNodeId);

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
                        if (v === 'teacher') return '#FCD34D';
                        if (v === 'student') return '#22D3EE';
                        if (v === 'ai') return '#F472B6';
                        return '#cbd5e1';
                    }}
                />
            </ReactFlow>

            {/* Legend & Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-4 items-center">

                {/* View Mode Toggle */}
                <div className="bg-white/90 backdrop-blur border border-slate-200/60 p-1 rounded-xl shadow-lg flex gap-1 items-center">
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'all'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                            }`}
                    >
                        <Users size={14} />
                        All Roles
                    </button>
                    <button
                        onClick={() => setViewMode('student')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'student'
                            ? 'bg-[#22D3EE] text-[#006666] shadow-md'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                            }`}
                    >
                        <GraduationCap size={14} />
                        Student Path
                    </button>
                </div>

                <div className="bg-white/90 backdrop-blur border border-slate-200/60 p-3 rounded-2xl shadow-lg flex gap-4 items-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Roles</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FCD34D] shadow-sm" />
                        <span className="text-xs font-medium text-slate-600">Teacher</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] shadow-sm" />
                        <span className="text-xs font-medium text-slate-600">Student</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F472B6] shadow-sm" />
                        <span className="text-xs font-medium text-slate-600">AI Agent</span>
                    </div>
                </div>
            </div>

            {/* Config Panel */}
            {activeNode && (
                <CPSSettingsPanel node={activeNode} onClose={() => setConfigNodeId(null)} />
            )}
        </div>
    );
};

// ----------------------------------------------------------------------
// 4. Settings Panel Component
// ----------------------------------------------------------------------

const CPSSettingsPanel = ({ node, onClose }: { node: Node<NodeData>, onClose: () => void }) => {
    const style = VARIANTS[node.data.variant] || VARIANTS.student;
    const Icon = node.data.icon || style.icon;

    return (
        <div className="absolute top-4 right-4 bottom-4 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className={`p-6 border-b border-gray-100 ${style.bg} bg-opacity-30`}>
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-xl ${style.header} shadow-sm`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{node.data.label}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.header} uppercase tracking-wider`}>
                                    {node.data.variant}
                                </span>
                                {node.data.groupLabel && (
                                    <span className="text-xs text-gray-500 font-medium">
                                        • {node.data.groupLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors text-gray-500">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* MCP Tools Config */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Database size={14} className="text-indigo-600" />
                            Active MCP Tools
                        </h4>
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                            + Add Tool
                        </button>
                    </div>

                    <div className="space-y-3">
                        {node.data.tools?.map((tool, idx) => (
                            <div key={idx} className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {/* Dynamic Icon Logic based on name */}
                                        {tool.includes('Search') ? <Search size={16} /> :
                                            tool.includes('DB') ? <Database size={16} /> :
                                                tool.includes('Bot') ? <Bot size={16} /> :
                                                    <Calculator size={16} />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{tool}</div>
                                        <div className="text-[10px] text-gray-500 font-medium font-mono mt-0.5">mcp-server-{tool.toLowerCase().replace(' ', '-')}</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50">
                                        <Settings size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {(!node.data.tools || node.data.tools.length === 0) && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                                <p className="text-sm text-gray-400">No tools configured</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Configuration Form */}
                <section className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <Settings size={14} className="text-indigo-600" />
                        Parameters
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Model</label>
                            <select className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-700">
                                <option>gemini-2.0-flash-exp</option>
                                <option>gpt-4-turbo</option>
                                <option>claude-3-opus</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Temperature</label>
                            <div className="flex items-center gap-4">
                                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                                <span className="text-sm font-mono font-bold text-gray-600 w-8">0.7</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">System Prompt</label>
                            <textarea
                                rows={4}
                                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-gray-600"
                                defaultValue={`You are a helpful assistant for ${node.data.label}. Please help the user with...`}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">
                    Test Run
                </button>
                <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all text-sm">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default CPSGraph;

