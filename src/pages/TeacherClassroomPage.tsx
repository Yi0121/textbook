import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { LayoutDashboard, Sparkles, Mic, X, MessageSquarePlus } from 'lucide-react';

// --- Components Imports ---
import FixedToolbar from '../components/tools/Toolbar';
import RightSidePanel from '../components/layout/RightSidePanel';
import Modal from '../components/ui/Modal';
import ClassroomCanvas from '../components/teacher/classroom/ClassroomCanvas';

// Features
import DashboardContent from '../components/teacher/dashboard/Dashboard';
import ClassroomWidgets from '../components/teacher/classroom/ClassroomWidgets';
import LuckyDraw from '../components/teacher/classroom/LuckyDraw';
import FullScreenTimer from '../components/ui/FullScreenTimer';
import NavigationOverlay from '../components/ui/NavigationOverlay';
import KeyboardShortcutsHelp from '../components/ui/KeyboardShortcutsHelp';
import WelcomeTour from '../components/ui/WelcomeTour';
import Whiteboard from '../components/collaboration/Whiteboard';
import EPUBImporter from '../components/features/EPUBImporter';
import ChapterNavigator, { ChapterNavigatorTrigger, PageNavigationButtons } from '../components/features/ChapterNavigator';
import ModeIndicator from '../components/ui/ModeIndicator';

// Context Hooks
import { useEditor } from '../context/EditorContext';
import { useContent } from '../context/ContentContext';
import { useUI } from '../context/UIContext';

// Custom Hooks
import { useKeyboardShortcuts } from '../hooks/common/useKeyboardShortcuts';
import { useAIActions } from '../hooks/ai/useAIActions';
import { useAppShortcuts } from '../hooks/common/useAppShortcuts';
import { useContentImport } from '../hooks/common/useContentImport';
import { useWhiteboardControl } from '../hooks/canvas/useWhiteboardControl';
import { useOnboarding } from '../hooks/common/useOnboarding';

// Config
import { NAV_ZONES } from '../config/constants';
import { type UserRole } from '../config/toolConfig';

interface OutletContextType {
    userRole: UserRole;
    setUserRole: (role: 'teacher' | 'student') => void;
}

// 模擬語音助手組件
const VoiceAssistant = () => {
    const [state, setState] = React.useState<'idle' | 'listening' | 'processing' | 'result'>('idle');
    const [transcript, setTranscript] = React.useState('');
    const [showResult, setShowResult] = React.useState(false);

    const startListening = () => {
        setState('listening');
        setTranscript('正在聆聽...');

        // 模擬語音識別過程
        setTimeout(() => {
            setTranscript('「出一題二元一次方程式的應用題」');
            setState('processing');

            // 模擬 AI 處理過程
            setTimeout(() => {
                setState('idle');
                setShowResult(true);
            }, 1500);
        }, 2000);
    };

    return (
        <>
            {/* 語音觸發按鈕 */}
            <div className="absolute bottom-24 right-6 z-40">
                <button
                    onClick={startListening}
                    className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:shadow-rose-500/30 transition-all text-white"
                    title="語音指令 (Mock)"
                >
                    <Mic className="w-6 h-6" />
                </button>
            </div>

            {/* 聆聽中 Overlay */}
            {(state === 'listening' || state === 'processing') && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 flex flex-col items-center gap-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${state === 'listening' ? 'bg-rose-100 text-rose-500' : 'bg-indigo-100 text-indigo-500'}`}>
                            {state === 'listening' ? (
                                <Mic className="w-10 h-10 animate-pulse" />
                            ) : (
                                <Sparkles className="w-10 h-10 animate-spin" />
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {state === 'listening' ? '請說出指令...' : 'AI 正在思考...'}
                            </h3>
                            <p className="text-lg text-gray-600 font-medium min-h-[1.5rem] transition-all">
                                {transcript}
                            </p>
                        </div>

                        {state === 'listening' && (
                            <div className="flex gap-1 h-3 items-center">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-1 bg-rose-400 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 結果展示 (題目卡片) */}
            {showResult && (
                <div className="fixed top-24 right-6 z-40 w-80 animate-in slide-in-from-right fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
                        <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <MessageSquarePlus className="w-5 h-5" />
                                <span className="font-bold">AI 生成題目</span>
                            </div>
                            <button onClick={() => setShowResult(false)} className="hover:bg-white/20 p-1 rounded-full text-white/50 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="text-sm font-bold text-indigo-600 mb-2">應用題 - 代數</div>
                            <h4 className="text-gray-900 font-medium mb-3 leading-relaxed">
                                小明的錢包裡有 10 元和 50 元硬幣共 20 枚，總金額為 600 元。請問 10 元和 50 元硬幣各有多少枚？
                            </h4>
                            <div className="space-y-2 mb-4">
                                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                                    A. 10元 10枚，50元 10枚
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                                    B. 10元 12枚，50元 8枚
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                    投放給全班
                                </button>
                                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                    加入題庫
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default function ClassroomPage() {
    // ==================== Context ====================
    const { userRole } = useOutletContext<OutletContextType>();
    const { state: editorState, dispatch: editorDispatch } = useEditor();
    const { state: contentState, dispatch: _contentDispatch } = useContent();
    const ui = useUI();

    // ==================== Local State ====================
    const [showShortcutsHelp, setShowShortcutsHelp] = React.useState(false);
    const [showEPUBImporter, setShowEPUBImporter] = React.useState(false);
    const [showChapterNav, setShowChapterNav] = React.useState(false);

    // ==================== State Adapter ====================
    // 使用 Context 中的 Viewport
    const viewport = editorState.viewport;

    // 建立一個相容舊 API (useState setter) 的 wrapper
    const setViewport = React.useCallback((value: { x: number; y: number; scale: number } | ((prev: { x: number; y: number; scale: number }) => { x: number; y: number; scale: number })) => {
        let newViewport;
        if (typeof value === 'function') {
            newViewport = value(editorState.viewport);
        } else {
            newViewport = value;
        }
        if (
            newViewport.x !== editorState.viewport.x ||
            newViewport.y !== editorState.viewport.y ||
            newViewport.scale !== editorState.viewport.scale
        ) {
            editorDispatch({ type: 'SET_VIEWPORT', payload: newViewport });
        }
    }, [editorState.viewport, editorDispatch]);

    // Helper 函式
    const isEditMode = editorState.isEditMode;
    const setIsEditMode = (value: boolean) => editorDispatch({ type: 'SET_EDIT_MODE', payload: value });
    const currentTool = editorState.currentTool;
    const setCurrentTool = (tool: string) => editorDispatch({ type: 'SET_CURRENT_TOOL', payload: tool });

    // ==================== Hooks ====================
    const { showWelcomeTour, handleCompleteTour, handleSkipTour } = useOnboarding();
    const { handleOpenWhiteboard, handleCloseWhiteboard, currentWhiteboardId } = useWhiteboardControl();

    // AI Actions (主要用於 Shortcuts 和 Toolbar)
    const aiActions = useAIActions({ viewport });

    // Content Import
    const { handleEPUBImport } = useContentImport({
        setViewport,
        setShowEPUBImporter,
    });

    // Navigation
    const handleQuickNav = (targetX: number, targetY: number) => {
        setViewport({ x: -targetX, y: -targetY, scale: 1.0 });
        ui.setShowNavGrid(false);
    };

    // ==================== Keyboard Shortcuts ====================
    const shortcuts = useAppShortcuts({
        userRole,
        isEditMode,
        showShortcutsHelp,
        setIsEditMode,
        setCurrentTool,
        setViewport,
        setShowShortcutsHelp,
        ui,
        aiActions,
    });

    useKeyboardShortcuts({
        shortcuts,
        enabled: true,
        userRole
    });

    // ==================== Render ====================
    return (
        <div className="h-full w-full bg-slate-50 dark:bg-gray-900 overflow-hidden flex flex-col select-none overscroll-none transition-colors">

            {/* AI 思考動畫 */}
            {contentState.aiState === 'thinking' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-indigo-200 flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="text-indigo-700 font-medium text-sm">AI 正在分析教材與筆跡...</span>
                    </div>
                </div>
            )}

            {/* Canvas Area */}
            <ClassroomCanvas userRole={userRole} />

            {/* 底部工具列 */}
            <FixedToolbar
                userRole={userRole}
                zoomLevel={viewport.scale}
                setZoomLevel={(s) => setViewport(prev => ({ ...prev, scale: typeof s === 'function' ? s(prev.scale) : s }))}
                onToggleAITutor={aiActions.handleToggleAITutor}
                onToggleWhiteboard={handleOpenWhiteboard}
            />

            {/* 模式指示器 */}
            <ModeIndicator
                isEditMode={isEditMode}
                currentTool={currentTool}
                userRole={userRole}
            />

            {/* 彈窗與 Widgets */}
            <LuckyDraw isOpen={ui.isLuckyDrawOpen} onClose={() => ui.setLuckyDrawOpen(false)} />
            <ClassroomWidgets mode={ui.widgetMode} onClose={() => ui.setWidgetMode('none')} />
            <NavigationOverlay
                isOpen={ui.showNavGrid} onClose={() => ui.setShowNavGrid(false)}
                zones={NAV_ZONES} onNavigate={handleQuickNav}
            />
            <FullScreenTimer isOpen={ui.isTimerOpen} onClose={() => ui.setTimerOpen(false)} />

            <RightSidePanel
                isOpen={ui.isQuizPanelOpen}
                onClose={() => { ui.setQuizPanelOpen(false); ui.setSidebarOpen(false) }}
                // Note: selectedText needs to be lifted if RightSidePanel uses it. 
                // But selectedText is in editorState (Global) now, so RightSidePanel should use Context? 
                // Let's check RightSidePanel props. It takes selectedText.
                // We need selectedText here.
                selectedText={editorState.selectedText}
                userRole={userRole}
                initialTab={ui.sidebarInitialTab}
            />

            <Modal isOpen={ui.isDashboardOpen} onClose={() => ui.setDashboardOpen(false)} title="學習數據儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth>
                <DashboardContent />
            </Modal>

            <KeyboardShortcutsHelp
                isOpen={showShortcutsHelp}
                onClose={() => setShowShortcutsHelp(false)}
                shortcuts={shortcuts}
            />

            {showWelcomeTour && (
                <WelcomeTour
                    userRole={userRole}
                    onComplete={handleCompleteTour}
                    onSkip={handleSkipTour}
                />
            )}

            {currentWhiteboardId && (
                <Whiteboard onClose={handleCloseWhiteboard} />
            )}

            <EPUBImporter
                isOpen={showEPUBImporter}
                onClose={() => setShowEPUBImporter(false)}
                onImport={handleEPUBImport}
            />

            <PageNavigationButtons />
            <ChapterNavigatorTrigger onClick={() => setShowChapterNav(true)} />
            <ChapterNavigator
                isOpen={showChapterNav}
                onClose={() => setShowChapterNav(false)}
            />

            <VoiceAssistant />
        </div>
    );
}
