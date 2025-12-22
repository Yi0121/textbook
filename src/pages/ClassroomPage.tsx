/**
 * ClassroomPage - 上課頁面
 * 
 * 整合原有的 TextbookEditor 功能
 * 包含：教材編輯器、繪圖層、工具列、側邊欄等
 */

import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LayoutDashboard, Sparkles } from 'lucide-react';

// --- Components Imports ---
import TopNavigation from '../components/layout/TopNavigation';
import FixedToolbar from '../components/tools/Toolbar';
import RightSidePanel from '../components/layout/RightSidePanel';
import Modal from '../components/ui/Modal';
import SelectionFloatingMenu from '../components/canvas/SelectionFloatingMenu';

// Canvas Components
import TextbookEditor from '../components/canvas/TextbookEditor';
import DrawingLayer from '../components/canvas/DrawingLayer';
import DraggableMindMap from '../components/canvas/DraggableMindMap';
import AIMemoCard from '../components/canvas/AIMemoCard';
import DraggableText from '../components/canvas/DraggableText';
import FabricPageEditor from '../components/canvas/FabricPageEditor';
import PageContainer from '../components/canvas/PageContainer';
import DashboardContent from '../components/features/Dashboard';
import ClassroomWidgets from '../components/features/classroom/ClassroomWidgets';
import LuckyDraw from '../components/features/classroom/LuckyDraw';
import FullScreenTimer from '../components/ui/FullScreenTimer';
import NavigationOverlay from '../components/ui/NavigationOverlay';
import KeyboardShortcutsHelp from '../components/ui/KeyboardShortcutsHelp';
import WelcomeTour from '../components/ui/WelcomeTour';
import SkeletonCanvas from '../components/ui/SkeletonCanvas';
import Whiteboard from '../components/collaboration/Whiteboard';
import EPUBImporter from '../components/features/EPUBImporter';
import ChapterNavigator, { ChapterNavigatorTrigger, PageNavigationButtons } from '../components/features/ChapterNavigator';
import ModeIndicator from '../components/ui/ModeIndicator';

// Context Hooks
import { useEditor } from '../context/EditorContext';
import { useContent, useCurrentChapterContent } from '../context/ContentContext';
import { useUI } from '../context/UIContext';

// Custom Hooks
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAIActions } from '../hooks/useAIActions';
import { useSelectionActions } from '../hooks/useSelectionActions';
import { useAppShortcuts } from '../hooks/useAppShortcuts';
import { useViewportZoom } from '../hooks/useViewportZoom';
import { useContentImport } from '../hooks/useContentImport';
import { useWhiteboardControl } from '../hooks/useWhiteboardControl';
import { useOnboarding } from '../hooks/useOnboarding';

// Config
import { NAV_ZONES } from '../config/constants';
import { type UserRole } from '../config/toolConfig';

const MemoizedTextbook = React.memo(TextbookEditor);

interface OutletContextType {
    userRole: UserRole;
    setUserRole: (role: 'teacher' | 'student') => void;
}

export default function ClassroomPage() {
    // ==================== Context ====================
    const { userRole, setUserRole } = useOutletContext<OutletContextType>();
    const { state: editorState, dispatch: editorDispatch } = useEditor();
    const { state: contentState, dispatch: contentDispatch } = useContent();
    const currentContent = useCurrentChapterContent();
    const ui = useUI();

    // ==================== Local State ====================
    const [viewport, setViewport] = React.useState({ x: 0, y: 0, scale: 1 });
    const [showShortcutsHelp, setShowShortcutsHelp] = React.useState(false);
    const [showEPUBImporter, setShowEPUBImporter] = React.useState(false);
    const [showChapterNav, setShowChapterNav] = React.useState(false);

    // Helper 函式
    const isEditMode = editorState.isEditMode;
    const setIsEditMode = (value: boolean) => editorDispatch({ type: 'SET_EDIT_MODE', payload: value });
    const currentTool = editorState.currentTool;
    const setCurrentTool = (tool: string) => editorDispatch({ type: 'SET_CURRENT_TOOL', payload: tool });

    // ==================== Hooks ====================
    const {
        selectionBox,
        selectionMenuPos,
        selectedText,
        updateSelectionBox: setSelectionBox,
        updateMenuPosition: setSelectionMenuPos,
        setSelectedText
    } = useSelectionActions();

    const { showWelcomeTour, handleCompleteTour, handleSkipTour } = useOnboarding();
    const { handleOpenWhiteboard, handleCloseWhiteboard, currentWhiteboardId } = useWhiteboardControl();

    // ==================== Refs ====================
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const previewPathRef = useRef<SVGPathElement>(null);
    const prevStrokeCountRef = useRef(0);

    // ==================== Interaction Hook ====================
    const interaction = useCanvasInteraction({
        viewport,
        setViewport,
        canvasRef,
        previewPathRef,
        setSelectionBox,
        setSelectionMenuPos
    });

    const aiActions = useAIActions({ viewport });

    // ==================== Effects ====================
    // Stroke 日誌
    useEffect(() => {
        if (editorState.strokes.length > prevStrokeCountRef.current) {
            const lastStroke = editorState.strokes[editorState.strokes.length - 1];
            console.log('%c 🎨 新增筆跡', 'background: #22c55e; color: #fff; padding: 2px 4px; border-radius: 4px;');
            console.log('作者:', lastStroke.author, '工具:', lastStroke.tool);
        } else if (editorState.strokes.length < prevStrokeCountRef.current) {
            console.log('%c 🧹 橡皮擦刪除', 'background: #cbd5e1; color: #334155; padding: 2px 4px;');
        }
        prevStrokeCountRef.current = editorState.strokes.length;
    }, [editorState.strokes]);

    // 模擬載入
    useEffect(() => {
        const timer = setTimeout(() => {
            contentDispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
        }, 1500);
        return () => clearTimeout(timer);
    }, [contentDispatch]);

    // Viewport Zoom
    useViewportZoom({ containerRef, setViewport });

    // Content Import
    const { handleImportContent, handleEPUBImport } = useContentImport({
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

            {/* 導覽列 */}
            <TopNavigation
                isSidebarOpen={ui.isSidebarOpen || ui.isQuizPanelOpen}
                toggleSidebar={() => { ui.setSidebarOpen(!ui.isSidebarOpen); ui.setQuizPanelOpen(!ui.isQuizPanelOpen) }}
                onShowShortcuts={() => setShowShortcutsHelp(true)}
                userRole={userRole}
                setUserRole={setUserRole}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                onImportContent={handleImportContent}
            />

            {/* AI 思考動畫 */}
            {contentState.aiState === 'thinking' && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-indigo-200 flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="text-indigo-700 font-medium text-sm">AI 正在分析教材與筆跡...</span>
                    </div>
                </div>
            )}

            {/* 主畫布容器 */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-gray-800 touch-none transition-colors"
                onMouseDown={interaction.handleMouseDown}
                onMouseMove={interaction.handleMouseMove}
                onMouseUp={interaction.handleMouseUp}
                onMouseLeave={interaction.handleMouseUp}
                style={{
                    cursor: interaction.isPanning.current || interaction.isSpacePressed.current
                        ? 'grabbing'
                        : currentTool === 'cursor' ? 'default' : 'crosshair'
                }}
            >
                {/* 背景網格 */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-50"
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`,
                        backgroundPosition: `${viewport.x}px ${viewport.y}px`
                    }}
                />

                {/* 可縮放區域 */}
                {contentState.isLoading ? (
                    <SkeletonCanvas />
                ) : (
                    <div
                        className="w-full h-full origin-top-left will-change-transform"
                        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}
                    >
                        {/* Fabric.js 頁面層 */}
                        {contentState.fabricPages.map(page => (
                            <PageContainer
                                key={page.id}
                                page={page}
                                isSelected={page.id === contentState.currentPageId}
                                scale={viewport.scale}
                                onSelect={(id) => contentDispatch({ type: 'SET_CURRENT_PAGE', payload: id })}
                                onMove={(id, x, y) => contentDispatch({ type: 'MOVE_FABRIC_PAGE', payload: { id, x, y } })}
                                onDelete={(id) => contentDispatch({ type: 'DELETE_FABRIC_PAGE', payload: id })}
                            >
                                <FabricPageEditor
                                    page={page}
                                    isSelected={page.id === contentState.currentPageId}
                                    scale={viewport.scale}
                                    isEditMode={isEditMode}
                                    currentTool={currentTool}
                                    penColor={editorState.penColor}
                                    penSize={editorState.penSize}
                                    onUpdate={(id, canvasJSON) => contentDispatch({ type: 'UPDATE_FABRIC_PAGE', payload: { id, changes: { canvasJSON } } })}
                                    onSelect={(id) => contentDispatch({ type: 'SET_CURRENT_PAGE', payload: id })}
                                />
                            </PageContainer>
                        ))}

                        {/* 無 Fabric 頁面時顯示 Tiptap 編輯器 */}
                        {contentState.fabricPages.length === 0 && (
                            <div className="flex justify-center py-20">
                                <div className="relative bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 rounded-2xl select-text" ref={canvasRef} style={{ width: 1000, minHeight: 1400 }}>
                                    <MemoizedTextbook
                                        initialContent={currentContent}
                                        isEditable={isEditMode && userRole === 'teacher'}
                                        currentTool={currentTool}
                                        onTextSelected={(data: any) => setSelectedText(data.text)}
                                        fileMeta={{
                                            title: "Unit 3: Cellular Respiration",
                                            version: isEditMode ? "v2.5 (Draft)" : "v2.4 (Published)",
                                            lastModified: new Date().toLocaleDateString(),
                                            tags: userRole === 'teacher' ? ["Teacher Edition", "Private"] : ["Student Edition"]
                                        }}
                                        clearSelection={() => { }}
                                    />

                                    {/* 繪圖層 */}
                                    <DrawingLayer
                                        ref={previewPathRef}
                                        active={true}
                                        strokes={editorState.strokes}
                                        penColor={editorState.penColor}
                                        penSize={editorState.penSize}
                                        currentTool={currentTool}
                                        selectionBox={selectionBox}
                                        laserPath={editorState.laserPath}
                                    />

                                    {/* 物件層 */}
                                    <div className={`absolute inset-0 z-10 ${(['pen', 'highlighter', 'eraser', 'laser'].includes(currentTool) || isEditMode) ? 'pointer-events-none' : ''}`}>
                                        {editorState.mindMaps.map(map => (
                                            <DraggableMindMap key={map.id} data={map} scale={viewport.scale}
                                                onUpdate={(id, dx, dy) => editorDispatch({ type: 'UPDATE_MIND_MAP', payload: { id, dx, dy } })}
                                                onDelete={(id) => editorDispatch({ type: 'DELETE_MIND_MAP', payload: id })}
                                            />
                                        ))}
                                        {editorState.aiMemos.map(memo => (
                                            <AIMemoCard key={memo.id} data={memo} scale={viewport.scale}
                                                onUpdate={(id, dx, dy) => editorDispatch({ type: 'UPDATE_AI_MEMO', payload: { id, dx, dy } })}
                                                onDelete={() => editorDispatch({ type: 'DELETE_AI_MEMO', payload: memo.id })}
                                            />
                                        ))}
                                        {editorState.textObjects.map(text => (
                                            <DraggableText key={text.id} data={text} scale={viewport.scale}
                                                onUpdate={(id, d) => editorDispatch({ type: 'UPDATE_TEXT_OBJECT', payload: { id, data: d } })}
                                                onDelete={(id) => editorDispatch({ type: 'DELETE_TEXT_OBJECT', payload: id })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

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
            </div>

            {/* 彈窗與 Widgets */}
            <LuckyDraw isOpen={ui.isLuckyDrawOpen} onClose={() => ui.setLuckyDrawOpen(false)} />
            <ClassroomWidgets mode={ui.widgetMode} onClose={() => ui.setWidgetMode('none')} />
            <NavigationOverlay
                isOpen={ui.showNavGrid} onClose={() => ui.setShowNavGrid(false)}
                zones={NAV_ZONES} onNavigate={handleQuickNav}
            />
            <FullScreenTimer isOpen={ui.isTimerOpen} onClose={() => ui.setTimerOpen(false)} />

            <SelectionFloatingMenu
                position={selectionMenuPos}
                onClose={() => aiActions.clearSelection()}
                userRole={userRole}
                onExplain={aiActions.handleAIExplain}
                onMindMap={aiActions.handleAIMindMap}
                onGenerateQuiz={aiActions.handleGenerateQuiz}
                onLessonPlan={aiActions.handleLessonPlan}
            />

            <RightSidePanel
                isOpen={ui.isQuizPanelOpen}
                onClose={() => { ui.setQuizPanelOpen(false); ui.setSidebarOpen(false) }}
                selectedText={selectedText}
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
