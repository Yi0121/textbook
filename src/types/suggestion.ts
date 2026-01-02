/**
 * Suggestion 類型定義
 *
 * 共用的建議類型基底介面與擴充版本
 */

import type { LucideIcon } from 'lucide-react';

/**
 * 基礎建議介面 - 學生與教師共用欄位
 */
export interface BaseSuggestion {
    /** 唯一識別碼 */
    id: string;
    /** 分類標籤 */
    category: string;
    /** 建議標題 */
    title: string;
    /** 建議描述 */
    description: string;
    /** 圖示組件 */
    icon: LucideIcon;
}

/**
 * 學生建議類型
 */
export type StudentSuggestionType = 'improve' | 'strength' | 'goal';

export interface StudentSuggestion extends BaseSuggestion {
    /** 建議類型：待加強 / 強項 / 目標 */
    type: StudentSuggestionType;
}

/**
 * 教師建議類型
 */
export type TeacherSuggestionTimeScope = 'unit' | 'next-lesson' | 'today' | 'week';
export type TeacherSuggestionPriority = 'high' | 'medium' | 'low';

export interface TeacherSuggestion extends BaseSuggestion {
    /** 時間範圍 */
    timeScope: TeacherSuggestionTimeScope;
    /** 優先級 */
    priority: TeacherSuggestionPriority;
    /** 相關單元 */
    relatedUnit?: string;
    /** 目標日期 */
    targetDate?: string;
}
