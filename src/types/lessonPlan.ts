/**
 * Lesson Plan Types
 * 
 * Defines the structure for lesson plans, APOS stages, activities, and resources.
 * Agent and Tool definitions have been moved to types/agents.ts and types/tools.ts.
 */

import type { Agent } from './agents';
import type { Tool } from './tools';

// ==================== 新架構：三層教學設計系統 ====================

/**
 * Layer 3: 教學資源綁定（最底層）
 * 定義具體的教學資源與生成該資源的 AI Agent
 */
export interface ResourceBinding {
    id: string;
    resourceType: 'video' | 'material' | 'worksheet' | 'interactive' | 'external';
    agent: Agent;
    tools: Tool[];
    generatedContent?: {
        materials?: string[];
        exercises?: number;
        interactions?: string[];
    };
    isDefault?: boolean;  // 是否為預設資源選項
}

/**
 * 條件分支流程控制
 * 三種明確的分支語意：
 * - checkpoint: 學習檢查點（學會/未學會 → 補救後回歸）
 * - multi-choice: 多選一教學資源（選項匯流到同一節點）
 * - differentiation: 能力分組（不同路徑有不同終點）
 */
export type FlowControlType = 'checkpoint' | 'multi-choice' | 'differentiation';

export interface FlowPath {
    id: string;
    label: string;              // 例如：「✓ 學會」、「選項A：影片」、「基礎組」
    nextActivityId: string;     // 指向下一個 Activity 的 ID
    condition?: string;         // 條件描述（checkpoint 和 differentiation 使用）
}

export interface ConditionalFlow {
    type: FlowControlType;
    criteria?: string;          // 評估標準（例如：「正確率 ≥ 80%」）
    paths: FlowPath[];          // 所有可能的分支路徑
}

/**
 * Layer 2: 教學活動節點（中階）
 * 定義課程中的具體教學活動（導入、教學、練習、評量等）
 */
export type ActivityType = 'intro' | 'teaching' | 'practice' | 'checkpoint' | 'remedial' | 'application';

export interface ActivityNode {
    id: string;
    type: ActivityType;
    title: string;
    order: number;
    resources: ResourceBinding[];    // 可配置多個資源選項（例如：影片、遊戲、閱讀材料）
    flowControl?: ConditionalFlow;   // 條件分支控制（可選）
    estimatedMinutes?: number;       // 預估活動時間
    description?: string;            // 活動說明
}

/**
 * Layer 1: APOS 階段節點（頂層）
 * 代表高階的認知發展階段（Action, Process, Object, Schema）
 */
export interface APOSStageNode {
    id: string;
    stage: 'A' | 'P' | 'O' | 'S';
    goal: string;                    // 該階段的認知目標
    description: string;             // 階段說明
    activities: ActivityNode[];      // 包含的所有教學活動
    estimatedMinutes?: number;       // 預估總時間
}

// ==================== 舊架構（保留相容性）====================

/**
 * @deprecated 請使用新的三層架構：APOSStageNode → ActivityNode → ResourceBinding
 * 此型別保留用於向後相容，未來版本將移除
 */
export type NodeType = 'agent' | 'video' | 'material' | 'worksheet' | 'external' | 'project' | 'interactive';

/**
 * @deprecated 請使用新的三層架構：APOSStageNode → ActivityNode → ResourceBinding
 * 此型別保留用於向後相容，未來版本將移除
 */
export interface LessonNode {
    id: string;
    title: string;
    order: number;
    nodeType?: NodeType; // 節點類型：agent（預設）、video、material、worksheet、external
    agent: Agent;
    selectedTools: Tool[];
    generatedContent?: {
        materials?: string[];
        exercises?: number;
        interactions?: string[];
    };
    // APOS 階段標記（用於階層式導航）
    stage?: 'A' | 'P' | 'O' | 'S';  // Action, Process, Object, Schema
    // 條件分支（用於學習檢查點）
    isConditional?: boolean;
    conditions?: {
        learnedPath?: string; // 學會後的下一個節點 ID（標準流程）
        notLearnedPath?: string; // 未學會的補強節點 ID
        advancedPath?: string; // 進階路徑（用於差異化教學 - 高分組）
        assessmentCriteria?: string; // 評估標準
        branchType?: 'remedial' | 'differentiated' | 'multi-choice'; // 'remedial' = 補救教學, 'differentiated' = 差異化教學, 'multi-choice' = 多選一
    };
    // 明確指定下一個節點（用於補強後返回主流程）
    nextNodeId?: string;
    // 分支類型標記（用於視覺區分）
    branchLevel?: 'advanced' | 'standard' | 'remedial';
    // 多選分支選項
    multiBranchOptions?: {
        id: string;
        label: string;
        nextNodeId: string;
    }[];
}

export interface LessonPlan {
    id: string;
    title: string;
    topic: string;
    objectives: string;
    difficulty: 'basic' | 'intermediate' | 'advanced';

    // 新架構：使用 APOS 階段組織（推薦）
    stages?: APOSStageNode[];

    // 舊架構：平鋪式節點列表（保留相容性）
    /** @deprecated 請使用 stages 欄位，採用新的三層架構 */
    nodes?: LessonNode[];

    createdAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published';
}

// ==================== APOS 階段定義 ====================

export interface APOSStage {
    id: 'A' | 'P' | 'O' | 'S';
    name: string;
    nameZh: string;
    description: string;
    color: string;
    icon: string;
}

export const APOS_STAGES: Record<'A' | 'P' | 'O' | 'S', APOSStage> = {
    A: {
        id: 'A',
        name: 'Action',
        nameZh: '行動階段',
        description: '學生透過動手操作與具體範例理解數學概念',
        color: 'red',
        icon: '🏃'
    },
    P: {
        id: 'P',
        name: 'Process',
        nameZh: '過程階段',
        description: '引導學生將操作步驟內化為可重複的心智程序',
        color: 'blue',
        icon: '⚙️'
    },
    O: {
        id: 'O',
        name: 'Object',
        nameZh: '物件階段',
        description: '將數學過程視為可操作的整體對象並進行變換',
        color: 'green',
        icon: '📦'
    },
    S: {
        id: 'S',
        name: 'Schema',
        nameZh: '基模階段',
        description: '整合多個概念形成結構化的知識網絡與應用',
        color: 'purple',
        icon: '🧠'
    },
};



// ==================== Mock 資料 ====================
// [Refactored] Mock 資料已移至 src/mocks/ 目錄
// - MOCK_GENERATED_LESSON → 已刪除（改用 ALGEBRA_APOS_LESSON）
// - MOCK_DIFFERENTIATED_LESSON → mocks/lessonPlanMocks.ts
// 使用方式：import { MOCK_DIFFERENTIATED_LESSON } from '../mocks';

