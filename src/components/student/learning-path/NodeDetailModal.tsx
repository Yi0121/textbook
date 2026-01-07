import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, CheckCircle, AlertCircle, BookOpen, PenTool, Youtube, Users, Sparkles, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import Modal from '../../ui/Modal';
import { type LearningPathNode, type LearningNodeType } from '../../../types';
import ResourceSelector, { type Resource } from '../../features/lesson-prep/ResourceSelector';

interface NodeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    node: LearningPathNode | null; // 這裡接收的是完整的 LearningPathNode (含 data)
    onSave: (nodeId: string, updates: Partial<LearningPathNode['data']>) => void;
    onDelete: (nodeId: string) => void;
}

// 根據節點標籤/類型取得對應頁面路徑
const getNodeNavigationPath = (node: LearningPathNode): string | null => {
    const label = node.data.label?.toLowerCase() || '';
    const type = node.type;

    // 根據 label 關鍵字匹配
    if (label.includes('dashboard') || label.includes('儀表板')) return '/teacher/class-analytics';
    if (label.includes('lesson planner') || label.includes('課程設計') || label.includes('備課')) return '/teacher/lesson-prep';
    if (label.includes('teaching') || label.includes('教學建議')) return '/teacher/suggestions';
    if (label.includes('learning') || label.includes('學習建議')) return '/student/suggestions';
    if (label.includes('class') || label.includes('上課') || label.includes('教材')) return '/teacher/classroom';

    // 根據節點類型匹配
    if (type === 'learning_analytics') return '/teacher/class-analytics';
    if (type === 'ai_grouping') return '/groups';
    if (type === 'collaboration') return '/groups';
    if (type === 'quiz' || type === 'exercise') return '/assignments';

    return null; // 無對應頁面
};

// 根據類型取得圖示
const getTypeIcon = (type: LearningNodeType) => {
    switch (type) {
        case 'chapter': return <BookOpen className="w-5 h-5" />;
        case 'exercise': return <PenTool className="w-5 h-5" />;
        case 'video': return <Youtube className="w-5 h-5" />;
        case 'collaboration': return <Users className="w-5 h-5" />;
        case 'ai_tutor': return <Sparkles className="w-5 h-5" />;
        case 'quiz': return <CheckCircle className="w-5 h-5" />;
        default: return <AlertCircle className="w-5 h-5" />;
    }
};

const getTypeLabel = (type: LearningNodeType) => {
    switch (type) {
        case 'chapter': return '章節閱讀';
        case 'exercise': return '練習題';
        case 'video': return '教學影片';
        case 'collaboration': return '小組討論';
        case 'ai_tutor': return 'AI 家教';
        case 'quiz': return '測驗';
        default: return '未知節點';
    }
};

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
    isOpen,
    onClose,
    node,
    onSave,
    onDelete,
}) => {
    const navigate = useNavigate();
    // 本地狀態用來暫存編輯內容，使用 node.id 作為 key 來重置狀態
    const [formData, setFormData] = useState<Partial<LearningPathNode['data']>>(() =>
        node ? { ...node.data } : {}
    );
    const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
    const [showResourceSelector, setShowResourceSelector] = useState(false);
    // 記錄當前處理的 node id，用於檢測 node 變化
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(node?.id || null);

    // 當 node 改變時，更新 form data（使用狀態比較而非 useEffect）
    if (node && node.id !== currentNodeId) {
        setCurrentNodeId(node.id);
        setFormData({ ...node.data });
    }

    if (!node) return null;

    const navigationPath = getNodeNavigationPath(node);

    const handleNavigate = () => {
        if (navigationPath) {
            onClose();
            navigate(navigationPath);
        }
    };

    const handleSave = () => {
        onSave(node.id, formData);
        onClose();
    };

    const handleDelete = () => {
        if (confirm('確定要刪除此節點嗎？這將同時刪除連接的線路。')) {
            onDelete(node.id);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${getTypeLabel(node.type)} - 詳細設定`}
            icon={getTypeIcon(node.type)}
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">

                    {/* 基本資訊 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                節點名稱
                            </label>
                            <input
                                type="text"
                                value={formData.label || ''}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="輸入節點名稱..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                描述 / 備註
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="輸入描述..."
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 外部資源選擇 */}
                    <div className="space-y-4">
                        <div
                            className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setShowResourceSelector(!showResourceSelector)}
                        >
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-600" />
                                外部資源
                                {selectedResources.length > 0 && (
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                        已選 {selectedResources.length} 項
                                    </span>
                                )}
                            </h4>
                            {showResourceSelector ?
                                <ChevronDown className="w-5 h-5 text-gray-500" /> :
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            }
                        </div>

                        {showResourceSelector && (
                            <div className="animate-fadeIn">
                                <ResourceSelector
                                    onResourcesSelected={setSelectedResources}
                                />
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* 類型特定欄位 */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-indigo-600" />
                            屬性設定
                        </h4>

                        {node.type === 'exercise' || node.type === 'quiz' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    及格分數 (Passing Score)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={formData.content?.passingScore || 60}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            content: { ...formData.content, passingScore: parseInt(e.target.value) }
                                        })}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <span className="text-sm text-gray-500">分</span>
                                </div>
                            </div>
                        ) : null}

                        {node.type === 'video' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        影片連結 (URL)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.content?.videoUrl || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            content: { ...formData.content, videoUrl: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        影片時長 (分鐘)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={1}
                                            value={formData.content?.videoDuration || 10}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                content: { ...formData.content, videoDuration: parseInt(e.target.value) }
                                            })}
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <span className="text-sm text-gray-500">mins</span>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {node.type === 'collaboration' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    小組人數限制
                                </label>
                                <input
                                    type="number"
                                    min={2}
                                    max={10}
                                    value={formData.content?.groupSize || 4}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        content: { ...formData.content, groupSize: parseInt(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        討論主題
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.content?.discussionTopic || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            content: { ...formData.content, discussionTopic: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="輸入討論主題..."
                                    />
                                </div>
                            </div>
                        ) : null}

                        {node.type === 'ai_tutor' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    AI 提示詞 / 角色設定 (Prompt)
                                </label>
                                <textarea
                                    value={formData.content?.aiPrompt || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        content: { ...formData.content, aiPrompt: e.target.value }
                                    })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                                    placeholder="設定 AI 的教學行為..."
                                />
                            </div>
                        ) : null}

                    </div>

                    <hr className="border-gray-100" />

                    {/* 狀態設定 */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isRequired"
                                checked={formData.isRequired !== false} // Default true
                                onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="isRequired" className="text-sm text-gray-700">設為必修</label>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            <label className="text-sm text-gray-700">狀態:</label>
                            <select
                                value={formData.status || 'pending'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="text-sm border-gray-300 rounded-md focus:ring-indigo-500"
                            >
                                <option value="pending">未開始</option>
                                <option value="in_progress">進行中</option>
                                <option value="completed">已完成</option>
                                <option value="failed">未通過</option>
                            </select>
                        </div>
                    </div>

                </div>

                {/* 底部按鈕 */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            刪除
                        </button>

                        {navigationPath && (
                            <button
                                onClick={handleNavigate}
                                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                前往 Agent 頁面
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            儲存變更
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
