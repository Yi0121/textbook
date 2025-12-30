/**
 * StudentLearningPathPage - 學生學習路徑頁面
 * 
 * 學生視角：
 * - 看得到：任務、學習內容、進度（闘關式）
 * - 看不到：Agent、Tools、教學設計細節
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALGEBRA_APOS_LESSON, getAllActivitiesFromAlgebra, MOCK_DIFFERENTIATED_LESSON, MOCK_DIFFERENTIATED_STUDENT_PROGRESS } from '../mocks';
import { AVAILABLE_AGENTS } from '../types/lessonPlan';
import type { LessonPlan, LessonNode } from '../types/lessonPlan';
import type { StudentProgress } from '../types/studentProgress';
import { getNodeProgress, getNodeStatus } from '../utils/progressHelpers';
import StepProgress, { type Step } from '../components/ui/StepProgress';
import CircularProgress from '../components/ui/CircularProgress';
import StudentPathCanvas from '../components/student/StudentPathCanvas';
import { BookOpen, Award, Play, CheckCircle, X, RotateCw, Zap } from 'lucide-react';

// === APOS 課程專用進度資料 (模擬：檢測點未通過 → AI 推薦補救) ===
const MOCK_APOS_STUDENT_PROGRESS: StudentProgress = {
    studentId: 'student-apos-demo',
    studentName: '學生範例',
    lessonId: 'lesson-apos-001',
    currentNodeId: 'action-remedial', // AI 推薦去補救！
    overallProgress: 22,
    lastActiveAt: new Date(),
    nodeProgress: [
        { nodeId: 'action-intro', completed: true, score: 95, timeSpent: 300 },
        { nodeId: 'action-manipulate', completed: true, score: 88, timeSpent: 600 },
        { nodeId: 'action-practice', completed: true, score: 82, timeSpent: 480 },
        // 檢測點：嘗試過但未通過（需要補救後重考）
        { nodeId: 'action-checkpoint', completed: false, score: 65, passedCheckpoint: false, pathTaken: 'remedial', timeSpent: 420 },
        { nodeId: 'action-remedial', completed: false, timeSpent: 120 }, // 正在補救中
    ],
};



// === Dashboard Progress Ring (Local) ===
const DashboardProgressRing = ({ percentage, size = 60 }: { percentage: number; size?: number }) => {
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-purple-100" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#progressGradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#d8b4fe" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700">{percentage}%</span>
            </div>
        </div>
    );
};

// Helper to convert APOS ActivityNode to LessonNode for the Grid
const convertAposToLessonNodes = (aposLesson: LessonPlan): LessonNode[] => {
    if (!aposLesson.stages) return [];

    let globalOrder = 1;
    const allActivities = getAllActivitiesFromAlgebra(aposLesson);

    return allActivities.map(act => {
        // Map Conditions
        const conditions: LessonNode['conditions'] = {};
        let isConditional = false;

        if (act.flowControl) {
            isConditional = true;
            conditions.branchType =
                act.flowControl.type === 'differentiation' ? 'differentiated' :
                    act.flowControl.type === 'checkpoint' ? 'remedial' : undefined;

            act.flowControl.paths.forEach(p => {
                const label = p.label.toLowerCase();
                // Heuristic mapping based on label or ID
                if (label.includes('補救') || p.id.includes('remedial') || p.id.includes('fail')) {
                    conditions.notLearnedPath = p.nextActivityId;
                } else if (label.includes('進階') || p.id.includes('advanced')) {
                    conditions.advancedPath = p.nextActivityId;
                } else {
                    conditions.learnedPath = p.nextActivityId;
                }
            });

            if (act.flowControl.criteria) {
                conditions.assessmentCriteria = act.flowControl.criteria;
            }
        }

        // Determine Branch Level
        let branchLevel: LessonNode['branchLevel'] = 'standard';
        let multiBranchOptions: LessonNode['multiBranchOptions'] = undefined;

        if (act.type === 'remedial') branchLevel = 'remedial';
        if (act.id.includes('advanced')) branchLevel = 'advanced';

        // Handle multi-choice specific logic
        if (act.flowControl?.type === 'multi-choice' && act.flowControl.paths) {
            multiBranchOptions = act.flowControl.paths.map(p => ({
                id: p.id,
                label: p.label,
                nextNodeId: p.nextActivityId
            }));
        }

        // Find stage
        const stageNode = aposLesson.stages?.find(s => s.activities.some(a => a.id === act.id));

        return {
            id: act.id,
            title: act.title,
            order: globalOrder++, // Simple sequential order
            nodeType: act.resources?.[0]?.resourceType || 'worksheet',
            agent: act.resources?.[0]?.agent || AVAILABLE_AGENTS[0],
            selectedTools: [],
            stage: stageNode?.stage,
            isConditional,
            conditions,
            branchLevel,
            multiBranchOptions,
            generatedContent: {
                materials: [act.description || ''],
            }
        };
    });
};

export default function StudentLearningPathPage() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();

    // 根據 ID 選擇課程資料
    const lesson = useMemo(() => {
        if (lessonId === 'lesson-apos-001') {
            // Convert real APOS lesson to flat nodes
            const convertedNodes = convertAposToLessonNodes(ALGEBRA_APOS_LESSON);
            return { ...ALGEBRA_APOS_LESSON, nodes: convertedNodes };
        }
        return MOCK_DIFFERENTIATED_LESSON; // 預設
    }, [lessonId]);

    // 使用對應課程的進度資料
    const studentProgress = lessonId === 'lesson-apos-001'
        ? MOCK_APOS_STUDENT_PROGRESS
        : MOCK_DIFFERENTIATED_STUDENT_PROGRESS[0];

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // 主流程節點 (排除補救分支和平行選項中未選擇的)
    const getMainPathNodes = () => {
        // [Fix]: APOS Lesson logic
        if (lessonId === 'lesson-apos-001') {
            // For the visual grid, we pass ALL nodes to LessonTaskGrid
            // The Grid itself handles filtering and layout (Main vs Remedial vs Advanced)
            // But here we might want to filter what "visibleNodes" means for the step progress bar?
            // Actually LessonTaskGrid takes `nodes` prop.
            return lesson.nodes || [];
        }

        // Default Differentiated Lesson logic
        const mainSteps = ['step1', 'step3', 'step4-test', 'step5', 'step6', 'step7', 'finish'];

        const studentPath = studentProgress.nodeProgress.map(np => np.nodeId);

        // 找到學生選擇的步驟2
        const step2Choice = studentPath.find(id => id.startsWith('step2-'));

        return (lesson.nodes || []).filter(node => {
            // 主流程節點
            if (mainSteps.includes(node.id)) return true;
            // 學生選擇的步驟2
            if (node.id === step2Choice) return true;
            // 補救路徑中學生有進度的
            if (node.branchLevel === 'remedial' && studentPath.includes(node.id)) return true;
            return false;
        });
    };

    const visibleNodes = getMainPathNodes();

    // 將 lesson nodes 轉換為 Step format
    const steps: Step[] = visibleNodes.map(node => {
        const progress = getNodeProgress(studentProgress.nodeProgress, node.id);
        return {
            id: node.id,
            title: node.title,
            status: getNodeStatus(node, studentProgress.nodeProgress, studentProgress.currentNodeId),
            score: progress?.score,
            isCheckpoint: node.isConditional,
        };
    });

    // [Enhancement] Clean up titles for student view
    const getCleanTitle = (title: string) => {
        return title
            .replace(/(Action|Process|Object|Schema)\s*[:：]?\s*/gi, '') // Remove APOS prefixes (flexible)
            .replace(/📋 |🔢 |🧪 |⚙️ |✏️ |📦 |🔧 |🧠 |🌍 |📝 |✓ /g, '') // Remove old emojis
            .trim();
    };

    // Unused legacy variables - keep node id for modal
    // const selectedNode = (lesson.nodes || []).find(n => n.id === selectedNodeId);
    // const selectedProgress = selectedNodeId ? getNodeProgress(studentProgress.nodeProgress, selectedNodeId) : undefined;

    return (
        <div className="h-full bg-slate-50 text-slate-900 font-sans overflow-hidden relative">
            {/* Dynamic Animated Mesh Gradient Background (Light Mode) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-200/40 rounded-full blur-[100px] animate-pulse delay-700" />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-200/30 rounded-full blur-[80px] animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-100 mix-blend-overlay pointer-events-none" />
            </div>

            <div className="relative z-10 h-screen flex flex-col">
                {/* 頭部 (Standard Mode) - keeping as is for non-APOS lessons */}
                {lessonId !== 'lesson-apos-001' && (
                    <div className="max-w-6xl mx-auto w-full p-6">
                        {/* ... (Existing Standard Header content) ... */}
                    </div>
                )}
                {lessonId !== 'lesson-apos-001' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h1>

                                {/* 統計數據 */}
                                {(() => {
                                    // 只計算 visibleNodes 中有進度的節點
                                    const visibleNodeIds = visibleNodes.map(n => n.id);
                                    const relevantProgress = studentProgress.nodeProgress.filter(np =>
                                        visibleNodeIds.includes(np.nodeId)
                                    );
                                    const completedCount = relevantProgress.filter(n => n.completed).length;
                                    const scoredProgress = relevantProgress.filter(n => n.score !== undefined);
                                    const avgScore = scoredProgress.length > 0
                                        ? Math.round(scoredProgress.reduce((acc, n) => acc + (n.score || 0), 0) / scoredProgress.length)
                                        : 0;
                                    const totalTime = Math.round(relevantProgress.reduce((acc, n) => acc + (n.timeSpent || 0), 0) / 60);

                                    return (
                                        <>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-indigo-50 rounded-xl p-4">
                                                    <div className="text-sm text-indigo-600 font-medium mb-1">已完成</div>
                                                    <div className="text-2xl font-bold text-indigo-900">
                                                        {completedCount} / {visibleNodes.length}
                                                    </div>
                                                    <div className="text-xs text-indigo-600 mt-1">個學習節點</div>
                                                </div>

                                                <div className="bg-purple-50 rounded-xl p-4">
                                                    <div className="text-sm text-purple-600 font-medium mb-1">平均分數</div>
                                                    <div className="text-2xl font-bold text-purple-900">
                                                        {avgScore || '-'}
                                                    </div>
                                                    <div className="text-xs text-purple-600 mt-1">分</div>
                                                </div>

                                                <div className="bg-blue-50 rounded-xl p-4">
                                                    <div className="text-sm text-blue-600 font-medium mb-1">學習時間</div>
                                                    <div className="text-2xl font-bold text-blue-900">
                                                        {totalTime}
                                                    </div>
                                                    <div className="text-xs text-blue-600 mt-1">分鐘</div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* 圓形進度圖 */}
                            {(() => {
                                const visibleNodeIds = visibleNodes.map(n => n.id);
                                const relevantProgress = studentProgress.nodeProgress.filter(np =>
                                    visibleNodeIds.includes(np.nodeId)
                                );
                                const completedCount = relevantProgress.filter(n => n.completed).length;
                                const overallProgress = Math.round((completedCount / visibleNodes.length) * 100);

                                return (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-sm text-gray-500">整體進度</div>
                                        <CircularProgress
                                            progress={overallProgress}
                                            size="xl"
                                            color="text-indigo-600"
                                        />
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* [Adventure Mode HUD] 僅在冒險模式顯示 */}
                {lessonId === 'lesson-apos-001' && (
                    <div className="flex-1 flex flex-col min-h-0 animate-slide-up">
                        {/* ====== Unified Header Bar ====== */}
                        <div className="flex-shrink-0 absolute top-4 left-8 right-8 z-20">
                            <div className="bg-white/85 backdrop-blur-xl rounded-2xl px-6 py-3 border border-purple-200/50 flex items-center justify-between shadow-xl">
                                {/* Left: Title + Subtitle */}
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                                            {lesson.title}
                                        </h1>
                                        <p className="text-xs text-slate-500">第一單元 · 共 {lesson.nodes?.filter(n => n.branchLevel !== 'remedial').length || 0} 個學習任務</p>
                                    </div>
                                </div>

                                {/* Right: Progress HUD */}
                                <div className="flex items-center gap-4">
                                    {(() => {
                                        const totalTasks = lesson.nodes?.filter(n => n.branchLevel !== 'remedial').length || 0;
                                        const completedTasks = studentProgress.nodeProgress.filter(np => np.completed && visibleNodes.some(n => n.id === np.nodeId)).length;
                                        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                                        // Find next task
                                        const mainNodes = lesson.nodes?.filter(n => n.branchLevel !== 'remedial' && n.branchLevel !== 'advanced').sort((a, b) => a.order - b.order) || [];
                                        const nextTask = mainNodes.find(n => !studentProgress.nodeProgress.find(p => p.nodeId === n.id)?.completed);

                                        return (
                                            <>
                                                <div className="flex items-center gap-3 border-r border-purple-200/50 pr-4">
                                                    <DashboardProgressRing percentage={progressPercentage} size={44} />
                                                    <div className="flex flex-col text-sm">
                                                        <div className="text-purple-900 font-bold text-xs">學習進度</div>
                                                        <div className="text-xs text-purple-600 font-medium">{completedTasks} / {totalTasks} 完成</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => nextTask && setSelectedNodeId(nextTask.id)}
                                                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white rounded-xl px-5 py-2.5 shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 text-sm font-bold"
                                                >
                                                    <Zap className="w-4 h-4 fill-current" />
                                                    開始挑戰
                                                </button>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Task Grid View - Full Width Scrolling */}
                        <div className="flex-1 overflow-hidden relative pt-16">
                            <StudentPathCanvas
                                nodes={lesson.nodes || []}
                                completedNodeIds={studentProgress.nodeProgress.filter(n => n.completed).map(n => n.nodeId)}
                                failedNodeIds={studentProgress.nodeProgress.filter(n => n.passedCheckpoint === false && !n.completed).map(n => n.nodeId)}
                                currentNodeId={studentProgress.currentNodeId}
                                onNodeSelect={(nodeId) => setSelectedNodeId(nodeId)}
                            />
                        </div>
                    </div>
                )}

                {/* [Standard Mode Content] */}
                {lessonId !== 'lesson-apos-001' && (
                    <>
                        {/* 傳統 Step Progress */}
                        {/* 闖關式學習路徑 */}
                        <div className={`
                            rounded-2xl shadow-lg mb-6 overflow-hidden
                            ${lessonId === 'lesson-apos-001' ? 'bg-[#e0f7fa]' : 'bg-white p-6'}
                        `}>
                            {lessonId !== 'lesson-apos-001' && <h2 className="text-xl font-bold text-gray-900 mb-6">學習路徑</h2>}

                            {/* Adventure Map (Deprecated/Hidden for this Lesson) */}
                            {/* {lessonId === 'lesson-apos-001' ? (
                                <div className="py-10">
                                    <AdventureMap
                                        nodes={visibleNodes.map(n => ({ ...n, title: getCleanTitle(n.title) }))}
                                        progressMap={
                                            visibleNodes.reduce((acc, node) => ({
                                                ...acc,
                                                [node.id]: getNodeStatus(node, studentProgress.nodeProgress, studentProgress.currentNodeId) === 'locked' ? 'upcoming' : getNodeStatus(node, studentProgress.nodeProgress, studentProgress.currentNodeId)
                                            }), {})
                                        }
                                        onNodeSelect={(id) => setSelectedNodeId(id)}
                                    />
                                </div>
                            ) : ( */}
                            <StepProgress
                                steps={steps}
                                onStepClick={(step) => setSelectedNodeId(step.id)}
                            />
                            {/* Node Detail Modal */}
                            {selectedNodeId && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedNodeId(null)} />

                                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-slide-up z-10 mx-auto">
                                        {(() => {
                                            const node = lesson.nodes?.find(n => n.id === selectedNodeId);
                                            if (!node) return null;
                                            // const isLocked = !studentProgress.nodeProgress.find(p => p.nodeId === node.id)?.unlocked; // REMOVED LOCK
                                            const isCompleted = studentProgress.nodeProgress.find(p => p.nodeId === node.id)?.completed;

                                            return (
                                                <>
                                                    {/* Modal Header */}
                                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
                                                        <button
                                                            onClick={() => setSelectedNodeId(null)}
                                                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>

                                                        <div className="flex items-start gap-4 relative z-10">
                                                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
                                                                {node.nodeType === 'video' && <Play className="w-8 h-8 text-white" />}
                                                                {node.nodeType === 'worksheet' && <BookOpen className="w-8 h-8 text-white" />}
                                                                {(!node.nodeType || (node.nodeType !== 'video' && node.nodeType !== 'worksheet')) && <Award className="w-8 h-8 text-white" />}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1 opacity-90">
                                                                    <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded text-white border border-white/20">Task {node.order}</span>
                                                                    <span className="text-sm font-medium tracking-wide uppercas flex items-center gap-1">
                                                                        {node.nodeType === 'video' ? 'Video Concept' : node.nodeType === 'worksheet' ? 'Exercise' : 'Interactive'}
                                                                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-300" />}
                                                                    </span>
                                                                </div>
                                                                <h2 className="text-3xl font-bold leading-tight">{getCleanTitle(node.title)}</h2>
                                                                {node.generatedContent?.materials && (
                                                                    <p className="mt-2 text-indigo-100 text-sm line-clamp-1">{node.generatedContent.materials[0]}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Modal Content */}
                                                    <div className="p-8">
                                                        {/* Materials Section */}
                                                        {node.generatedContent?.materials && (
                                                            <div className="mb-8">
                                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Learning Materials</h3>
                                                                <ul className="space-y-3">
                                                                    {node.generatedContent.materials.map((m, i) => (
                                                                        <li key={i} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                                                                            <div className="mt-0.5 bg-indigo-100 text-indigo-600 p-1 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                                                <BookOpen className="w-4 h-4" />
                                                                            </div>
                                                                            <span className="leading-relaxed">{m}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Action Button */}
                                                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                                                            <button
                                                                onClick={() => navigate(`/lesson/${lessonId}/node/${node.id}`)}
                                                                className={`
                                                        px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg hover:-translate-y-1 transition-all duration-300
                                                        ${isCompleted
                                                                        ? 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                                                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200'}
                                                    `}
                                                            >
                                                                {isCompleted ? (
                                                                    <>
                                                                        <RotateCw className="w-5 h-5" />
                                                                        Review Lesson
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Play className="w-5 h-5 fill-current" />
                                                                        Start Learning
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* 補強提示（如果學生正在補強路徑上）*/}
                {(studentProgress.currentNodeId === 'remedial1' || studentProgress.currentNodeId === 'remedial-test' || studentProgress.currentNodeId === 'remedial2') && (
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 animate-fadeIn">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-orange-900 mb-2">💪 加強練習</h3>
                                <p className="text-orange-700 mb-3">
                                    別擔心！我們準備了額外的練習來幫助你更好地理解這個概念。
                                </p>
                                <div className="bg-white rounded-lg p-4 border border-orange-200">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {getCleanTitle((lesson.nodes || []).find(n => n.id === studentProgress.currentNodeId)?.title || '補救教學')}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {(lesson.nodes || []).find(n => n.id === studentProgress.currentNodeId)?.generatedContent?.materials?.join(' • ') || 'AI 個別輔導 • 概念重建'}
                                    </p>
                                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                                        開始補強練習
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
