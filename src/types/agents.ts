/**
 * Agent 定義
 * 
 * 基於 Agent List.csv 定義的正式 Agent 名稱
 * [Refactored] 從 types/lessonPlan.ts 移入
 */

export type AgentCategory = 'content' | 'scaffolding' | 'assessment' | 'analytics';

export interface Agent {
    id: string;
    name: string;
    nameEn: string;
    category: AgentCategory;
    description: string;
    availableTools: string[];
}

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

/** 根據 ID 查找 Agent */
export const findAgentById = (id: string) => AVAILABLE_AGENTS.find(a => a.id === id) || AVAILABLE_AGENTS[0];
