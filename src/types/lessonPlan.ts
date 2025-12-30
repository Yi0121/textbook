/**
 * Agent 與 Tools 資料結構
 * 
 * 基於 Agent List.csv 定義的正式 Agent 名稱
 */

// ==================== Agent 定義 ====================

export type AgentCategory = 'content' | 'scaffolding' | 'assessment' | 'analytics';

export interface Agent {
    id: string;
    name: string;
    nameEn: string;
    category: AgentCategory;
    description: string;
    availableTools: string[];
}

// ==================== Tool 定義 ====================

export interface Tool {
    id: string;
    name: string;
    description: string;
    category: '教材' | '互動' | '評量' | '分析';
}

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

// ==================== Mock Agents (基於 Agent List.csv) ====================

export const AVAILABLE_AGENTS: Agent[] = [
    // ==================== A. 教師備課模組 ====================
    {
        id: 'curriculum-architect',
        name: '課程設計',
        nameEn: 'Curriculum Architect Agent',
        category: 'content',
        description: '根據 108 課綱與 APOS 等數學理論，將知識點解構並規劃為動態教學路徑與教案塊',
        availableTools: ['generate_lesson_workflow', 'infer_curriculum_unit'],
    },
    {
        id: 'content-generator',
        name: '內容生成',
        nameEn: 'Content Generation Agent',
        category: 'content',
        description: '利用 MCP 驅動繪圖與運算工具，產製多模態教材、試題與互動式數學元件',
        availableTools: ['gen_structured_problem', 'gen_ggb_script', 'gen_multimodal_content'],
    },
    {
        id: 'multi-solution',
        name: '多重解題策略',
        nameEn: 'Mathematical Multi-Solution Strategy Agent',
        category: 'content',
        description: '產生多元解題題目與解法，培養數學變通性思考',
        availableTools: ['gen_multi_strategies', 'suggest_alternative_paths'],
    },
    {
        id: 'collaborative-grouping',
        name: '協作分組',
        nameEn: 'Collaborative Grouping Agent',
        category: 'analytics',
        description: '根據學生能力畫像與社交特質，自動執行異質或同質分組，優化協作基礎',
        availableTools: ['query_profiles', 'run_clustering'],
    },

    // ==================== B. 學生學習模組 - Scaffolding ====================
    {
        id: 'conjecture',
        name: '數學臆測',
        nameEn: 'Mathematical Conjecturing Agent',
        category: 'scaffolding',
        description: '引導學生觀察規律、提出初步假設 (What if?)',
        availableTools: ['scaffold_conjecture'],
    },
    {
        id: 'reasoning',
        name: '數學推論',
        nameEn: 'Mathematical Reasoning Agent',
        category: 'scaffolding',
        description: '引導學生進行邏輯論證、演繹與證明 (Why?)',
        availableTools: ['verify_logical_steps'],
    },
    {
        id: 'cps-agent',
        name: '合作問題解決',
        nameEn: 'Collaborative Problem Solving Agent',
        category: 'scaffolding',
        description: '協調成員意見，確保共同目標達成',
        availableTools: ['guide_shared_understanding'],
    },
    {
        id: 'creativity',
        name: '數學創造力',
        nameEn: 'Mathematical Creativity Agent',
        category: 'scaffolding',
        description: '鼓勵跳脫框架，提供多元解題視角',
        availableTools: ['suggest_multi_strategies'],
    },
    {
        id: 'apos-construction',
        name: 'APOS 數學建構',
        nameEn: 'APOS Mathematical Construction Agent',
        category: 'scaffolding',
        description: '採用啟發式對話與蘇格拉底提問，引導學生完成 APOS 理論之心理建構歷程',
        availableTools: ['socratic_dialogue', 'apos_scaffolding'],
    },
    {
        id: 'technical-support',
        name: '技術工具',
        nameEn: 'Technical Support Agent',
        category: 'scaffolding',
        description: '提供 GeoGebra、Wolfram Alpha 等動態工具支援',
        availableTools: ['get_ggb_state', 'solve_algebra', 'recognize_handwriting', 'provide_hint'],
    },

    // ==================== 評量與觀測 ====================
    {
        id: 'grader',
        name: '自動評分',
        nameEn: 'Automated Assessment Agent',
        category: 'assessment',
        description: '針對學生的解題正確性、邏輯品質與操作行為進行多維度的即時診斷與評價',
        availableTools: ['compute_score', 'grade_ggb_construction', 'grade_proof_process', 'evaluate_discourse_quality'],
    },
    {
        id: 'learning-observer',
        name: '學習行為觀測',
        nameEn: 'Learning Behavior Observer',
        category: 'analytics',
        description: '將學生所有操作、對話串流至 LRS，自動識別學習節點',
        availableTools: ['stream_realtime_log', 'detect_session_event'],
    },
    {
        id: 'peer-facilitator',
        name: '虛擬協作引導',
        nameEn: 'Virtual Collaborative Facilitator',
        category: 'scaffolding',
        description: '在小組互動中扮演「智慧夥伴」角色，根據教師設定扮演不同角色',
        availableTools: ['draw_on_whiteboard', 'analyze_sentiment', 'broadcast_msg'],
    },
    {
        id: 'realtime-advisor',
        name: '解題策略即時建議',
        nameEn: 'Strategic Problem-Solving Advisor',
        category: 'scaffolding',
        description: '根據學習觀測紀錄，即時回饋介入建議',
        availableTools: ['suggest_strategy', 'analyze_progress'],
    },
    {
        id: 'srl-agent',
        name: '數學 SRL',
        nameEn: 'Math Self-Regulated Learning Agent',
        category: 'scaffolding',
        description: '支援學生自我調節學習，包含目標設定、策略選擇與自我評價',
        availableTools: ['calc_calibration', 'log_reflection'],
    },

    // ==================== C. 系統分析模組 ====================
    {
        id: 'data-steward',
        name: '數據治理',
        nameEn: 'Data Governance Agent',
        category: 'analytics',
        description: '執行數據去識別化、格式對齊與初步過濾',
        availableTools: ['clean_raw_logs'],
    },
    {
        id: 'sna-analyst',
        name: 'SNA 社交網絡分析',
        nameEn: 'SNA Analytics Agent',
        category: 'analytics',
        description: '分析成員間互動頻率、中心性與社會關係結構',
        availableTools: ['label_interaction_target', 'run_sna_metrics'],
    },
    {
        id: 'ena-analyst',
        name: 'ENA 認知網絡分析',
        nameEn: 'ENA Analytics Agent',
        category: 'analytics',
        description: '分析數學概念間的聯結強度與認知結構轉化歷程',
        availableTools: ['label_epistemic_code', 'run_ena_projection'],
    },
    {
        id: 'synthesis',
        name: '策略整合',
        nameEn: 'Strategic Synthesis Agent',
        category: 'analytics',
        description: '彙整多源分析數據，生成教學與學習建議',
        availableTools: ['aggregate_mining_results', 'update_student_profile', 'gen_pedagogical_feedback'],
    },
    {
        id: 'dashboard',
        name: '教學洞察儀表板',
        nameEn: 'Insight Dashboard Agent',
        category: 'analytics',
        description: '視覺化呈現學習分析結果，提供自然語言建議',
        availableTools: ['render_interactive_chart', 'interpret_insight', 'recommend_next_task'],
    },
];

// ==================== Mock Tools ====================

export const AVAILABLE_TOOLS: Tool[] = [
    { id: 'gen_structured_problem', name: '題目生成器', description: '基於 RAG 生成結構化數學題目', category: '教材' },
    { id: 'gen_ggb_script', name: 'GeoGebra 腳本生成', description: '自動生成 GGB 互動元件', category: '互動' },
    { id: 'gen_multimodal_content', name: '多模態內容生成', description: '生成圖片、影音教材 (DALL-E/TTS)', category: '教材' },
    { id: 'gen_multi_strategies', name: '多重解法生成', description: '提供同一問題的多種解題策略', category: '教材' },
    { id: 'get_ggb_state', name: 'GeoGebra 狀態讀取', description: '讀取學生 GGB 操作狀態', category: '互動' },
    { id: 'solve_algebra', name: 'Wolfram 代數求解', description: '調用 Wolfram Alpha 進行運算', category: '互動' },
    { id: 'scaffold_conjecture', name: '臆測鷹架引導', description: '引導學生提出數學猜想', category: '互動' },
    { id: 'verify_logical_steps', name: '邏輯步驟驗證', description: '檢查證明過程的邏輯正確性', category: '評量' },
    { id: 'compute_score', name: '自動計分', description: '基於 Rubrics 計算學習成績', category: '評量' },
    { id: 'grade_ggb_construction', name: 'GGB 作圖評分', description: '評估幾何作圖的正確性', category: '評量' },
];

// ==================== 查找輔助函數 ====================

/** 根據 ID 查找 Agent */
export const findAgentById = (id: string) => AVAILABLE_AGENTS.find(a => a.id === id) || AVAILABLE_AGENTS[0];

/** 根據 ID 查找 Tool */
export const findToolById = (id: string) => AVAILABLE_TOOLS.find(t => t.id === id);

// ==================== Mock 資料 ====================
// [Refactored] Mock 資料已移至 src/mocks/ 目錄
// - MOCK_GENERATED_LESSON → 已刪除（改用 ALGEBRA_APOS_LESSON）
// - MOCK_DIFFERENTIATED_LESSON → mocks/lessonPlanMocks.ts
// 使用方式：import { MOCK_DIFFERENTIATED_LESSON } from '../mocks';

