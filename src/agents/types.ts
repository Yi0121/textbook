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
    | 'lesson-planner'
    | 'content-generator'
    | 'grouping'
    // B. 學生學習模組
    | 'scaffolding'
    | 'grader'
    | 'learning-observer'
    | 'peer-facilitator'
    | 'realtime-hint'
    | 'srl'
    // C. 系統分析模組
    | 'data-steward'
    | 'sna-analyst'
    | 'ena-analyst'
    | 'srl-analyst'
    | 'process-analyst'
    | 'math-problem-analyst'
    | 'synthesis'
    | 'dashboard'
    // 總控
    | 'orchestrator';

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
