import React, { } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LayoutDashboard, Sparkles } from 'lucide-react';

// --- Components Imports ---
import FixedToolbar from '../components/tools/Toolbar';
import RightSidePanel from '../components/layout/RightSidePanel';
import Modal from '../components/ui/Modal';
import ClassroomCanvas from '../components/features/classroom/ClassroomCanvas';

// Features
import DashboardContent from '../components/features/Dashboard';
import ClassroomWidgets from '../components/features/classroom/ClassroomWidgets';
import LuckyDraw from '../components/features/classroom/LuckyDraw';
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
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAIActions } from '../hooks/useAIActions';
import { useAppShortcuts } from '../hooks/useAppShortcuts';
import { useContentImport } from '../hooks/useContentImport';
import { useWhiteboardControl } from '../hooks/useWhiteboardControl';
import { useOnboarding } from '../hooks/useOnboarding';

// Config
import { NAV_ZONES } from '../config/constants';
import { type UserRole } from '../config/toolConfig';

interface OutletContextType {
    userRole: UserRole;
    setUserRole: (role: 'teacher' | 'student') => void;
}

export default function ClassroomPage() {
    // ==================== Context ====================
    const { userRole } = useOutletContext<OutletContextType>();
    const { state: editorState, dispatch: editorDispatch } = useEditor();
    const { state: contentState, dispatch: contentDispatch } = useContent();
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
        </div>
    );
}
