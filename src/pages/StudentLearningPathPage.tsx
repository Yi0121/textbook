/**
 * StudentLearningPathPage - 學生學習路徑頁面
 * 
 * 學生視角：
 * - 看得到：任務、學習內容、進度（闖關式）
 * - 看不到：Agent、Tools、教學設計細節
 */

import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Award, Clock } from 'lucide-react';
import { MOCK_DIFFERENTIATED_LESSON, MOCK_GENERATED_LESSON } from '../types/lessonPlan';
import { MOCK_DIFFERENTIATED_STUDENT_PROGRESS } from '../types/studentProgress';
import { getNodeProgress, getNodeStatus, formatDuration } from '../utils/progressHelpers';
import StepProgress, { type Step } from '../components/ui/StepProgress';
import CircularProgress from '../components/ui/CircularProgress';

import AdventureMap from '../components/student/AdventureMap';

export default function StudentLearningPathPage() {
    const { lessonId } = useParams<{ lessonId: string }>();

    // 根據 ID 選擇課程資料
    const lesson = useMemo(() => {
        if (lessonId === 'lesson-apos-001') return MOCK_GENERATED_LESSON; // 對應 APOS 範例
        return MOCK_DIFFERENTIATED_LESSON; // 預設
    }, [lessonId]);

    const studentProgress = MOCK_DIFFERENTIATED_STUDENT_PROGRESS[0]; // 模擬當前學生是張小明

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // 主流程節點 (排除補救分支和平行選項中未選擇的)
    // 主流程節點 (排除補救分支和平行選項中未選擇的)
    const getMainPathNodes = () => {
        // [Fix]: APOS Lesson logic
        if (lessonId === 'lesson-apos-001') {
            const studentPath = studentProgress.nodeProgress.map(np => np.nodeId);
            return (lesson.nodes || []).filter(node => {
                // Show all main nodes (not remedial)
                if (!node.branchLevel || node.branchLevel === 'standard' || node.branchLevel === 'advanced') return true;
                // Show remedial nodes only if student has visited them
                if (node.branchLevel === 'remedial' && studentPath.includes(node.id)) return true;
                return false;
            });
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

    const selectedNode = (lesson.nodes || []).find(n => n.id === selectedNodeId);
    const selectedProgress = selectedNodeId ? getNodeProgress(studentProgress.nodeProgress, selectedNodeId) : undefined;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* 頭部 (Standard Mode) */}
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
                {/* [Adventure Mode HUD] 僅在冒險模式顯示 */}
                {lessonId === 'lesson-apos-001' && (
                    <div className="flex items-center justify-between mb-4 animate-slide-up">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
                        </div>

                        {/* Gamified HUD: Points & Gems */}
                        {(() => {
                            // Calculate Score and Gems (Score > 90 = Gem)
                            const relevantProgress = studentProgress.nodeProgress;
                            const totalScore = relevantProgress.reduce((acc, curr) => acc + (curr.score || 0), 0);
                            const gemCount = relevantProgress.filter(np => (np.score || 0) >= 90).length;

                            return (
                                <div className="flex gap-4">
                                    {/* 累積代幣 (Tokens) */}
                                    <div className="bg-white/90 backdrop-blur px-5 py-2.5 rounded-xl shadow-sm border border-indigo-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center border border-yellow-100">
                                            <div className="text-lg">🪙</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider">學習代幣</div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-gray-800 leading-none">{totalScore}</span>
                                                <span className="text-xs text-yellow-600 font-bold">枚</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 榮譽寶石 (Gems/High Scores) */}
                                    <div className="bg-white/90 backdrop-blur px-5 py-2.5 rounded-xl shadow-sm border border-indigo-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
                                            <div className="text-lg">💎</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">榮譽寶石</div>
                                            <div className="text-xl font-black text-gray-800 leading-none">{gemCount}<span className="text-gray-400 text-sm font-medium">/5</span></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 闖關式學習路徑 */}
                <div className={`
                    rounded-2xl shadow-lg mb-6 overflow-hidden
                    ${lessonId === 'lesson-apos-001' ? 'bg-[#e0f7fa]' : 'bg-white p-6'}
                `}>
                    {lessonId !== 'lesson-apos-001' && <h2 className="text-xl font-bold text-gray-900 mb-6">學習路徑</h2>}

                    {lessonId === 'lesson-apos-001' ? (
                        <div className="py-10">
                            <AdventureMap
                                nodes={visibleNodes}
                                progressMap={
                                    visibleNodes.reduce((acc, node) => ({
                                        ...acc,
                                        [node.id]: getNodeStatus(node, studentProgress.nodeProgress, studentProgress.currentNodeId) === 'locked' ? 'upcoming' : getNodeStatus(node, studentProgress.nodeProgress, studentProgress.currentNodeId)
                                    }), {})
                                }
                                onNodeSelect={(id) => setSelectedNodeId(id)}
                            />
                        </div>
                    ) : (
                        <StepProgress
                            steps={steps}
                            onStepClick={(step) => setSelectedNodeId(step.id)}
                        />
                    )}
                </div>

                {/* 節點詳細資訊（當選中時顯示）*/}
                {selectedNode && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    {selectedNode.title}
                                    {selectedNode.isConditional && (
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
                                            檢查點
                                        </span>
                                    )}
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedNodeId(null)}
                                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* 學習內容 */}
                        {selectedNode.generatedContent && (
                            <div className="space-y-3 mb-6">
                                {selectedNode.generatedContent.materials && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <BookOpen className="w-5 h-5 text-indigo-600" />
                                        <span className="font-medium">教材：</span>
                                        <span>{selectedNode.generatedContent.materials.join(', ')}</span>
                                    </div>
                                )}
                                {selectedNode.generatedContent.exercises && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Award className="w-5 h-5 text-yellow-600" />
                                        <span className="font-medium">練習題：</span>
                                        <span>{selectedNode.generatedContent.exercises} 題</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 進度資訊 */}
                        {selectedProgress && (
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                                {selectedProgress.score !== undefined && (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-indigo-600">{selectedProgress.score}</div>
                                        <div className="text-sm text-gray-600">得分</div>
                                    </div>
                                )}
                                {selectedProgress.timeSpent && (
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-lg font-bold text-gray-900">
                                            <Clock className="w-5 h-5" />
                                            {formatDuration(selectedProgress.timeSpent)}
                                        </div>
                                        <div className="text-sm text-gray-600">學習時間</div>
                                    </div>
                                )}
                                {selectedProgress.retryCount !== undefined && (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">{selectedProgress.retryCount}</div>
                                        <div className="text-sm text-gray-600">重試次數</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 行動按鈕 */}
                        <div className="mt-6 flex gap-3">
                            {getNodeStatus(selectedNode, studentProgress.nodeProgress, studentProgress.currentNodeId) === 'current' && (
                                <button className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
                                    繼續學習
                                </button>
                            )}
                            {getNodeStatus(selectedNode, studentProgress.nodeProgress, studentProgress.currentNodeId) === 'completed' && (
                                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                    複習
                                </button>
                            )}
                            {getNodeStatus(selectedNode, studentProgress.nodeProgress, studentProgress.currentNodeId) === 'locked' && (
                                <div className="flex-1 px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-medium text-center">
                                    🔒 完成前面的關卡以解鎖
                                </div>
                            )}
                        </div>
                    </div>
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
                                        {(lesson.nodes || []).find(n => n.id === studentProgress.currentNodeId)?.title || '補救教學'}
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
