/**
 * StepProgress - 闖關式步驟進度條組件
 * 
 * 用於學生學習路徑，顯示水平的闖關式進度
 * 支援完成/進行中/未開始三種狀態
 */

import { CheckCircle, Circle, Lock } from 'lucide-react';
import { useState } from 'react';

export interface Step {
    id: string;
    title: string;
    status: 'completed' | 'current' | 'locked';
    description?: string;
    score?: number;
    isCheckpoint?: boolean;
}

interface StepProgressProps {
    steps: Step[];
    onStepClick?: (step: Step) => void;
    className?: string;
}

export default function StepProgress({ steps, onStepClick, className = '' }: StepProgressProps) {
    const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

    const handleStepClick = (step: Step) => {
        // 如果是 locked 狀態，不允許點擊
        if (step.status === 'locked') return;

        // 切換展開/收合
        setExpandedStepId(expandedStepId === step.id ? null : step.id);

        // 觸發父組件的回調
        onStepClick?.(step);
    };

    const getStepColor = (status: Step['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500 border-green-500';
            case 'current':
                return 'bg-indigo-600 border-indigo-600';
            case 'locked':
                return 'bg-gray-300 border-gray-300';
        }
    };

    const getLineColor = (currentStatus: Step['status'], nextStatus?: Step['status']) => {
        if (currentStatus === 'completed') {
            return 'bg-green-500';
        }
        if (currentStatus === 'current' && nextStatus) {
            return 'bg-gradient-to-r from-indigo-600 to-gray-300';
        }
        return 'bg-gray-300';
    };

    return (
        <div className={`w-full ${className}`}>
            {/* 步驟進度條 - 水平滾動容器 */}
            <div className="relative overflow-x-auto pb-4">
                <div className="flex items-center justify-start min-w-max px-4">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        const nextStep = !isLast ? steps[index + 1] : undefined;

                        return (
                            <div key={step.id} className="flex items-center">
                                {/* 步驟節點 */}
                                <div className="flex flex-col items-center">
                                    {/* 圓形節點 */}
                                    <button
                                        onClick={() => handleStepClick(step)}
                                        disabled={step.status === 'locked'}
                                        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${getStepColor(step.status)} ${step.status === 'locked'
                                            ? 'cursor-not-allowed opacity-60'
                                            : 'cursor-pointer hover:scale-110 hover:shadow-lg'
                                            } ${step.status === 'current' ? 'animate-pulse shadow-xl' : ''}`}
                                    >
                                        {step.status === 'completed' && (
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        )}
                                        {step.status === 'current' && (
                                            <Circle className="w-8 h-8 text-white fill-white" />
                                        )}
                                        {step.status === 'locked' && (
                                            <Lock className="w-7 h-7 text-gray-500" />
                                        )}

                                        {/* 檢查點標記 */}
                                        {step.isCheckpoint && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                                                ✓
                                            </div>
                                        )}
                                    </button>

                                    {/* 標題 */}
                                    <div className="mt-3 text-center max-w-[120px]">
                                        <div className={`text-sm font-semibold ${step.status === 'locked' ? 'text-gray-400' : 'text-gray-900'
                                            }`}>
                                            {step.title}
                                        </div>
                                        {step.score !== undefined && step.status === 'completed' && (
                                            <div className="text-xs text-green-600 font-medium mt-1">
                                                {step.score} 分
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 連接線 */}
                                {!isLast && (
                                    <div className={`h-1 w-24 mx-2 rounded-full transition-all duration-500 ${getLineColor(step.status, nextStep?.status)}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 展開的詳細資訊 */}
            {expandedStepId && (
                <div className="mt-6 animate-fadeIn">
                    {steps.filter(s => s.id === expandedStepId).map(step => (
                        <div
                            key={step.id}
                            className={`bg-white rounded-xl shadow-lg p-6 border-2 ${step.status === 'completed'
                                ? 'border-green-300'
                                : 'border-indigo-300'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {step.title}
                                        {step.isCheckpoint && (
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                                檢查點
                                            </span>
                                        )}
                                    </h3>
                                    {step.description && (
                                        <p className="text-gray-600 mt-2">{step.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setExpandedStepId(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>

                            {/* 狀態提示 */}
                            {step.status === 'completed' && (
                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>已完成</span>
                                    {step.score !== undefined && <span className="ml-2">得分：{step.score} 分</span>}
                                </div>
                            )}
                            {step.status === 'current' && (
                                <div className="mt-4">
                                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
                                        繼續學習
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
