/**
 * LessonPrepPage - 備課工作台
 * 
 * 提供兩種備課入口：
 * 1. 快速開始：輸入主題 + 選擇資源，AI 生成課程
 * 2. 查看現有課程
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, ChevronLeft, Rocket, Library, Signal, Lightbulb, X, Clock, Edit } from 'lucide-react';
import ResourceSelector, { type Resource } from '../components/features/lesson-prep/ResourceSelector';

// Mock 最近草稿資料
const RECENT_DRAFTS = [
    { id: 'd1', title: '四則運算基礎', subject: '數學', grade: '五年級', lastEdited: '10 分鐘前', progress: 80 },
    { id: 'd2', title: '分數加減法', subject: '數學', grade: '四年級', lastEdited: '昨天', progress: 45 },
    { id: 'd3', title: '幾何圖形辨識', subject: '數學', grade: '三年級', lastEdited: '3 天前', progress: 20 },
];

export default function LessonPrepPage() {
    const navigate = useNavigate();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showResourceSelector, setShowResourceSelector] = useState(false);
    const [topic, setTopic] = useState('');
    const [objectives, setObjectives] = useState('');
    const [difficulty, setDifficulty] = useState<'basic' | 'intermediate' | 'advanced'>('intermediate');
    const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleContinueToResources = () => {
        if (!topic.trim()) {
            alert('請輸入課程主題');
            return;
        }
        setShowResourceSelector(true);
    };

    const handleQuickStart = () => {
        setIsGenerating(true);

        // 模擬 AI 生成過程
        setTimeout(() => {
            setIsGenerating(false);
            // 導航到視覺化編輯器
            navigate('/teacher/lesson-prep/preview/lesson-apos-001'); // 暫時導向示範課程
        }, 2000);
    };

    const handleResourcesSelected = (resources: Resource[]) => {
        setSelectedResources(resources);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* 頁面標題 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">備課工作台</h1>
                    </div>
                    <p className="text-gray-600">設計與編輯您的 AI 驅動課程</p>
                </div>

                {!showCreateForm ? (
                    /* 選擇入口 */
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 快速開始 */}
                            <button
                                onClick={() => navigate('/teacher/lesson-prep/chat')}
                                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-300 text-left group"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><Rocket className="w-5 h-5 text-indigo-600" /> AI 對話備課</h2>
                                <p className="text-gray-600 mb-4">
                                    透過 AI 對話，快速設定課程主題、章節、教學法，自動規劃教學流程
                                </p>
                                <div className="flex items-center gap-2 text-indigo-600 font-medium">
                                    立即開始 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            {/* 查看示範課程 */}
                            <button
                                onClick={() => navigate('/teacher/lesson-prep/preview/lesson-apos-001?demo=differentiated')}
                                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300 text-left group"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Library className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">查看示範課程</h2>
                                <p className="text-gray-600 mb-4">
                                    四則運算 — 展示差異化教學分支路徑
                                </p>
                                <div className="flex items-center gap-2 text-purple-600 font-medium">
                                    前往查看 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        </div>

                        {/* 最近草稿區塊 */}
                        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    最近草稿
                                </h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    查看全部
                                </button>
                            </div>
                            <div className="space-y-3">
                                {RECENT_DRAFTS.map((draft) => (
                                    <div
                                        key={draft.id}
                                        onClick={() => navigate('/teacher/lesson-prep/preview/lesson-math-001')}
                                        className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl cursor-pointer transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">{draft.title}</div>
                                            <div className="text-xs text-gray-500">{draft.subject} • {draft.grade}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 mb-1">{draft.lastEdited}</div>
                                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${draft.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : !showResourceSelector ? (
                    /* 步驟 1：快速開始表單 */
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">課程基本資訊</h2>
                            </div>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="關閉"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* 課程主題 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    課程主題 *
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="例：國小五年級四則運算"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* 教學目標 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    教學目標（選填）
                                </label>
                                <textarea
                                    value={objectives}
                                    onChange={(e) => setObjectives(e.target.value)}
                                    placeholder="例：&#10;- 理解加減乘除運算順序&#10;- 能正確計算混合運算&#10;- 解決生活中的數學問題"
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* 難度 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    難度
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'basic', label: '基礎', level: 1 },
                                        { value: 'intermediate', label: '中階', level: 2 },
                                        { value: 'advanced', label: '進階', level: 3 },
                                    ].map((item) => (
                                        <button
                                            key={item.value}
                                            onClick={() => setDifficulty(item.value as any)}
                                            className={`px-4 py-3 rounded-xl font-medium transition-all ${difficulty === item.value
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Signal className={`w-4 h-4 mr-2 ${difficulty === item.value ? 'text-white' : 'text-gray-500'}`} />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 按鈕 */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleContinueToResources}
                                    disabled={!topic.trim()}
                                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${!topic.trim()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                                        }`}
                                >
                                    下一步：選擇資源
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 步驟 2：資源選擇 */
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">選擇教學資源</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowResourceSelector(false);
                                    setShowCreateForm(false);
                                }}
                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="關閉"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 課程資訊摘要 */}
                        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                            <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {topic}</h3>
                            <div className="text-sm text-indigo-700">
                                難度：{difficulty === 'basic' ? '基礎' : difficulty === 'intermediate' ? '中階' : '進階'}
                            </div>
                        </div>

                        {/* 資源選擇器 */}
                        <ResourceSelector onResourcesSelected={handleResourcesSelected} className="mb-6" />

                        {/* 按鈕 */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setShowResourceSelector(false)}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                上一步
                            </button>
                            <button
                                onClick={handleQuickStart}
                                disabled={isGenerating}
                                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isGenerating
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                                    }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        AI 規劃中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        開始 AI 規劃課程
                                        {selectedResources.length > 0 && (
                                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                                                已選 {selectedResources.length} 項
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* 提示 */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-blue-800 flex items-center gap-1">
                                <Lightbulb className="w-4 h-4" /> <span className="font-medium">AI 將為您：</span>
                            </p>
                            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-6 list-disc">
                                <li>根據選擇的資源，整合到課程流程中</li>
                                <li>分析課程主題，拆解知識點</li>
                                <li>選擇適合的 AI Agents 和工具</li>
                                <li>規劃符合 APOS 理論的學習路徑</li>
                                <li>設計互動練習與評量節點</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
