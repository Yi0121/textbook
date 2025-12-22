
import React, { useRef, useEffect } from 'react';
import { useEditor } from '../../../context/EditorContext';
import { useContent, useCurrentChapterContent } from '../../../context/ContentContext';

import { useSelectionActions } from '../../../hooks/useSelectionActions';
import { useCanvasInteraction } from '../../../hooks/useCanvasInteraction';
import { useAIActions } from '../../../hooks/useAIActions';
import { useViewportZoom } from '../../../hooks/useViewportZoom';


import TextbookEditor from '../../canvas/TextbookEditor';
import DrawingLayer from '../../canvas/DrawingLayer';
import DraggableMindMap from '../../canvas/DraggableMindMap';
import AIMemoCard from '../../canvas/AIMemoCard';
import DraggableText from '../../canvas/DraggableText';
import FabricPageEditor from '../../canvas/FabricPageEditor';
import PageContainer from '../../canvas/PageContainer';
import SkeletonCanvas from '../../ui/SkeletonCanvas';
import SelectionFloatingMenu from '../../canvas/SelectionFloatingMenu';

const MemoizedTextbook = React.memo(TextbookEditor);

import { type UserRole } from '../../../config/toolConfig';

interface ClassroomCanvasProps {
    userRole: UserRole;
}

export default function ClassroomCanvas({ userRole }: ClassroomCanvasProps) {
    const { state: editorState, dispatch: editorDispatch } = useEditor();
    const { state: contentState, dispatch: contentDispatch } = useContent();
    const currentContent = useCurrentChapterContent();


    // ==================== Viewport Adapter ====================
    const viewport = editorState.viewport;
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

    // ==================== Hooks & Refs ====================
    const {
        selectionBox,
        selectionMenuPos,
        updateSelectionBox: setSelectionBox,
        updateMenuPosition: setSelectionMenuPos,
        setSelectedText
    } = useSelectionActions();

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const previewPathRef = useRef<SVGPathElement>(null);

    const interaction = useCanvasInteraction({
        viewport,
        setViewport,
        canvasRef,
        previewPathRef,
        setSelectionBox,
        setSelectionMenuPos
    });

    const aiActions = useAIActions({ viewport });
    useViewportZoom({ containerRef, setViewport });

    // ==================== Effects ====================
    // 模擬載入 (Simulated Loading)
    useEffect(() => {
        const timer = setTimeout(() => {
            contentDispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
        }, 1500);
        return () => clearTimeout(timer);
    }, [contentDispatch]);

    // ==================== Helper ====================
    const isEditMode = editorState.isEditMode;
    const currentTool = editorState.currentTool;

    return (
        <>
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
            </div>

            {/* Selection Menu */}
            <SelectionFloatingMenu
                position={selectionMenuPos}
                onClose={() => aiActions.clearSelection()}
                userRole={userRole}
                onExplain={aiActions.handleAIExplain}
                onMindMap={aiActions.handleAIMindMap}
                onGenerateQuiz={aiActions.handleGenerateQuiz}
                onLessonPlan={aiActions.handleLessonPlan}
            />
        </>
    );
}
