import {
    Video, FileText, Wrench, Bot,
    CheckSquare, Split, type LucideIcon
} from 'lucide-react';
import type { LessonNode } from '../types/lessonPlan';

export interface NodeStyleConfig {
    bg: string;
    border: string;
    borderSelected: string;
    iconBg: string;
    iconColor: string;
    icon: LucideIcon;
    headerGradient: string;
    label: string;
}

export const getNodeStyleConfig = (node: LessonNode): NodeStyleConfig => {
    if (node.isConditional) {
        return {
            bg: 'bg-white',
            border: 'border-orange-300',
            borderSelected: 'border-orange-500 ring-4 ring-orange-100',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            icon: Split,
            headerGradient: 'from-orange-400 to-amber-500',
            label: '檢查點'
        };
    }

    switch (node.nodeType) {
        case 'video':
            return {
                bg: 'bg-white',
                border: 'border-red-200',
                borderSelected: 'border-red-500 ring-4 ring-red-100',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                icon: Video,
                headerGradient: 'from-red-400 to-pink-500',
                label: '影片'
            };
        case 'material':
            return {
                bg: 'bg-white',
                border: 'border-blue-200',
                borderSelected: 'border-blue-500 ring-4 ring-blue-100',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                icon: FileText,
                headerGradient: 'from-blue-400 to-cyan-500',
                label: '教材'
            };
        case 'worksheet':
            return {
                bg: 'bg-white',
                border: 'border-green-200',
                borderSelected: 'border-green-500 ring-4 ring-green-100',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                icon: CheckSquare,
                headerGradient: 'from-green-400 to-emerald-500',
                label: '練習'
            };
        case 'external':
            return {
                bg: 'bg-white',
                border: 'border-purple-200',
                borderSelected: 'border-purple-500 ring-4 ring-purple-100',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
                icon: Wrench,
                headerGradient: 'from-purple-400 to-fuchsia-500',
                label: '工具'
            };
        case 'agent':
        default:
            return {
                bg: 'bg-white',
                border: 'border-indigo-200',
                borderSelected: 'border-indigo-500 ring-4 ring-indigo-100',
                iconBg: 'bg-indigo-100',
                iconColor: 'text-indigo-600',
                icon: Bot,
                headerGradient: 'from-indigo-500 to-violet-600',
                label: 'AI Agent'
            };
    }
};
