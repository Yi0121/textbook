import { Layers, Bot, Search, ChevronLeft, Video, FileText, CheckSquare, Wrench } from 'lucide-react';
import { DraggableResource } from './DraggableResource';
import { AVAILABLE_AGENTS } from '../../types/agents';

interface ResourceSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function ResourceSidebar({
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    searchQuery,
    setSearchQuery
}: ResourceSidebarProps) {
    const SIDEBAR_TABS = [
        { id: 'agents', label: 'AI Agent', icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'video', label: '影片', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
        { id: 'material', label: '教材', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'worksheet', label: '練習', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 'external', label: '工具', icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="flex h-full z-30">
            {/* Icon Rail */}
            <div className="w-14 bg-white border-r border-gray-100 flex flex-col items-center pt-20 pb-6 gap-3 z-40 shadow-sm">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
                    <Layers size={24} />
                </div>
                {SIDEBAR_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(true); }}
                        className={`
                                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group
                                ${activeTab === tab.id ? `${tab.bg} ${tab.color} shadow-sm` : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
                            `}
                    >
                        <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />

                        {/* Tooltip */}
                        <div className="absolute left-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                            {tab.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Drawer Panel */}
            <div className={`${isSidebarOpen ? 'w-60 translate-x-0' : 'w-0 -translate-x-full opacity-0'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col relative pt-16`}>
                <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-bold text-gray-800 text-lg">
                        {SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
                    </h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft size={18} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="搜尋元件..."
                            className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-panel">
                    {/* Agents Content */}
                    {activeTab === 'agents' && AVAILABLE_AGENTS
                        .filter(a => a.name.includes(searchQuery))
                        .map(agent => (
                            <div
                                key={agent.id}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('application/reactflow', 'agent');
                                    e.dataTransfer.setData('agentId', agent.id);
                                }}
                                className="p-3 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 cursor-move transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                        <Bot size={16} />
                                    </div>
                                    <div className="font-bold text-gray-800 text-sm">{agent.name}</div>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{agent.description}</p>
                            </div>
                        ))
                    }

                    {/* Other Resources */}
                    {activeTab === 'video' && (
                        <>
                            <DraggableResource id="v1" title="四則運算基礎" desc="3min 動畫講解" source="YouTube" color="red" resourceType="video" />
                            <DraggableResource id="v2" title="進階應用範例" desc="生活情境題" source="Khan Academy" color="red" resourceType="video" />
                        </>
                    )}
                    {activeTab === 'material' && (
                        <>
                            <DraggableResource id="m1" title="教學簡報 PDF" desc="共 15 頁" source="Local" color="blue" resourceType="material" />
                        </>
                    )}
                    {activeTab === 'worksheet' && (
                        <>
                            <DraggableResource id="w1" title="基礎練習卷" desc="20 題選擇" source="ExamSystem" color="green" resourceType="worksheet" />
                        </>
                    )}
                    {activeTab === 'external' && (
                        <>
                            <DraggableResource id="e1" title="GeoGebra 画板" desc="互動幾何" source="GGB" color="purple" resourceType="external" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
