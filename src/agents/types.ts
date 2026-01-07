/**
 * Multi-Agent 系統型別定義
 * 
 * 定義 Agent、Tool、請求/回應的核心介面
 */

// ==================== Agent 分類 ====================

/**
 * Agent 模組分類
 */
export type AgentCategory = 'teacher' | 'student' | 'analytics';

/**
 * Agent 識別碼 - 對應 18 個 Agent
 */
export type AgentId =
    // A. 教師備課模組
    | 'curriculum-design'
    | 'content-generator'
    | 'math-flexible-thinking'
    | 'collaborative-grouping'
    // B. 學生學習模組
    | 'apos-construction'
    | 'technical-support'
    | 'cps-agent'
    | 'automated-assessment'
    | 'learning-behavior-observer'
    | 'virtual-collaborative-facilitator'
    | 'multi-strategy-advisor'
    | 'math-srl'
    // C. 系統分析模組
    | 'data-cleaning'
    | 'sna-analyst'
    | 'ena-analyst'
    | 'synthesis'
    | 'viz'
    // 總控
    | 'orchestrator'
    // Legacy / Others (Subject to removal)
    | 'scaffolding'
    | 'srl-analyst'
    | 'process-analyst'
    | 'math-problem-analyst';

// ==================== Tool 介面 ====================

/**
 * Agent Tool 輸入參數
 */
export interface ToolInput {
    [key: string]: unknown;
}

/**
 * Agent Tool 輸出結果
 */
export interface ToolOutput {
    success: boolean;
    data?: unknown;
    error?: string;
}

/**
 * Agent Tool 定義
 * 
 * 注意：為了保持型別靈活性，execute 函數使用寬鬆型別。
 * 各 Agent 實作時可自行定義具體的輸入輸出型別。
 */
export interface AgentTool {
    /** Tool 名稱，用於識別與呼叫 */
    name: string;
    /** Tool 描述，說明功能用途 */
    description: string;
    /** Tool 執行函數 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (input: any) => Promise<any>;
}

// ==================== Agent 請求/回應 ====================

/**
 * Agent 執行上下文
 */
export interface AgentContext {
    /** 當前學生 ID */
    studentId?: string;
    /** 當前班級 ID */
    classId?: string;
    /** 當前教師 ID */
    teacherId?: string;
    /** 請求時間戳 */
    timestamp: number;
    /** 額外 metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Agent 請求
 */
export interface AgentRequest<T extends ToolInput = ToolInput> {
    /** 要執行的 action (對應 Tool name) */
    action: string;
    /** 請求參數 */
    payload: T;
    /** 執行上下文 */
    context?: AgentContext;
}

/**
 * Agent 回應
 */
export interface AgentResponse<T = unknown> {
    /** 是否成功 */
    success: boolean;
    /** 回傳資料 */
    data?: T;
    /** 錯誤訊息 */
    error?: string;
    /** 執行時間 (ms) */
    duration?: number;
}

// ==================== Agent 介面 ====================

/**
 * Agent 基礎介面
 */
export interface IAgent {
    /** Agent 唯一識別碼 */
    id: AgentId;
    /** Agent 顯示名稱 */
    name: string;
    /** Agent 所屬分類 */
    category: AgentCategory;
    /** Agent 提供的 Tools */
    tools: AgentTool[];
    /** 執行請求 */
    execute: (request: AgentRequest) => Promise<AgentResponse>;
    /** 取得 Tool 列表 */
    getToolNames: () => string[];
}

// ==================== Agent 註冊資訊 ====================

/**
 * Agent 註冊資訊 (用於 Orchestrator)
 */
export interface AgentRegistration {
    id: AgentId;
    name: string;
    category: AgentCategory;
    toolNames: string[];
    description: string;
}

// ==================== Orchestrator 介面 ====================

/**
 * Orchestrator 路由請求
 */
export interface OrchestratorRequest {
    /** 目標 Agent ID */
    targetAgent: AgentId;
    /** Agent 請求 */
    request: AgentRequest;
}

/**
 * Orchestrator 回應
 */
export interface OrchestratorResponse extends AgentResponse {
    /** 處理此請求的 Agent ID */
    handledBy: AgentId;
}

// ==================== UI 層 Agent 定義 ====================

/**
 * UI 層 Agent 類別 (用於前端顯示)
 */
export type UIAgentCategory = 'content' | 'scaffolding' | 'assessment' | 'analytics';

/**
 * UI 層 Agent 介面 (用於前端元件)
 */
export interface UIAgent {
    id: string;
    name: string;
    nameEn: string;
    category: UIAgentCategory;
    description: string;
    availableTools: string[];
}

/**
 * 可用的 Agent 列表 (基於 Agent List.csv)
 */
export const AVAILABLE_AGENTS: UIAgent[] = [
    // ==================== A. 教師備課模組 ====================
    {
        id: 'curriculum-design',
        name: '課程設計',
        nameEn: 'Curriculum Design Agent',
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
        id: 'math-flexible-thinking',
        name: '數學變通性思考',
        nameEn: 'Mathematical Flexible Thinking Agent',
        category: 'content',
        description: '產生多元解題題目與解法，培養數學變通性思考',
        availableTools: ['gen_multi_strategies', 'suggest_alternative_paths'],
    },
    {
        id: 'collaborative-grouping',
        name: '協作分組',
        nameEn: 'Agentic Collaborative Grouping Agent',
        category: 'analytics',
        description: '根據學生能力畫像與社交特質，自動執行異質或同質分組，優化協作基礎',
        availableTools: ['query_profiles', 'run_clustering'],
    },

    // ==================== B. 學生學習模組 - Scaffolding ====================
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
    {
        id: 'cps-agent',
        name: '合作問題解決',
        nameEn: 'Collaborative Problem Solving Agent',
        category: 'scaffolding',
        description: '協調小組合作流程，確保共同目標達成',
        availableTools: ['guide_shared_understanding'],
    },

    // ==================== 評量與觀測 ====================
    {
        id: 'automated-assessment',
        name: '自動評分',
        nameEn: 'Automated Assessment Agent',
        category: 'assessment',
        description: '針對學生的解題正確性、邏輯品質與操作行為進行多維度的即時診斷與評價',
        availableTools: ['compute_score', 'grade_ggb_construction', 'grade_proof_process', 'evaluate_discourse_quality'],
    },
    {
        id: 'learning-behavior-observer',
        name: '學習行為觀測',
        nameEn: 'Learning Behavior Observer Agent',
        category: 'analytics',
        description: '將學生所有操作、對話串流至 LRS，自動識別學習節點',
        availableTools: ['stream_realtime_log', 'detect_session_event'],
    },
    {
        id: 'virtual-collaborative-facilitator',
        name: '虛擬協作引導',
        nameEn: 'Virtual Collaborative Facilitator Agent',
        category: 'scaffolding',
        description: '在小組互動中扮演「智慧夥伴」角色，根據教師設定扮演不同角色',
        availableTools: ['draw_on_whiteboard', 'analyze_sentiment', 'broadcast_msg'],
    },
    {
        id: 'multi-strategy-advisor',
        name: '多重解題策略即時建議',
        nameEn: 'Multi-Strategy Problem-Solving Advisor',
        category: 'scaffolding',
        description: '根據學習觀測紀錄，即時回饋介入建議',
        availableTools: ['suggest_strategy', 'analyze_progress'],
    },
    {
        id: 'math-srl',
        name: '數學 SRL',
        nameEn: 'Math Self-Regulated Learning Agent',
        category: 'scaffolding',
        description: '支援學生自我調節學習，包含目標設定、策略監控、反思',
        availableTools: ['calc_calibration', 'log_reflection'],
    },

    // ==================== C. 學習分析模組 ====================
    {
        id: 'data-cleaning',
        name: '資料清理',
        nameEn: 'Data Cleaning Agent',
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
        id: 'viz',
        name: '視覺化',
        nameEn: 'Viz Agent',
        category: 'analytics',
        description: '視覺化呈現學習分析結果，提供自然語言建議',
        availableTools: ['render_interactive_chart', 'interpret_insight', 'recommend_next_task'],
    },
];

/**
 * 根據 ID 查找 Agent
 */
export const findAgentById = (id: string): UIAgent | undefined =>
    AVAILABLE_AGENTS.find(a => a.id === id);

/**
 * @deprecated 使用 UIAgent 代替
 */
export type Agent = UIAgent;
