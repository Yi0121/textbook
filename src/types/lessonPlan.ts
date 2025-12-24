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

// ==================== 課程節點 ====================

export type NodeType = 'agent' | 'video' | 'material' | 'worksheet' | 'external';

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
    // 條件分支（用於學習檢查點）
    isConditional?: boolean;
    conditions?: {
        learnedPath?: string; // 學會後的下一個節點 ID
        notLearnedPath?: string; // 未學會的補強節點 ID
        assessmentCriteria?: string; // 評估標準
    };
    // 明確指定下一個節點（用於補強後返回主流程）
    nextNodeId?: string;
}

export interface LessonPlan {
    id: string;
    title: string;
    topic: string;
    objectives: string;
    difficulty: 'basic' | 'intermediate' | 'advanced';
    nodes: LessonNode[];
    createdAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published';
}

// ==================== Mock Agents (基於 Agent List.csv) ====================

export const AVAILABLE_AGENTS: Agent[] = [
    // A. 教師備課模組
    {
        id: 'curriculum-architect',
        name: 'Agentic Curriculum Architect Agent',
        nameEn: '課程設計',
        category: 'content',
        description: '根據 108 課綱與 APOS 等數學理論，將知識點解構並規劃為動態教學路徑與教案塊',
        availableTools: ['generate_lesson_workflow', 'infer_curriculum_unit'],
    },
    {
        id: 'content-generator',
        name: 'Content Generator Agent',
        nameEn: '內容生成',
        category: 'content',
        description: '利用 MCP 驅動繪圖與運算工具，產製多模態教材、試題與互動式數學元件',
        availableTools: ['gen_structured_problem', 'gen_ggb_script', 'gen_multimodal_content'],
    },
    {
        id: 'multi-solution',
        name: 'Mathematical Multi-Solution Strategy Agent',
        nameEn: '多重解題策略',
        category: 'content',
        description: '產生多元解題題目與解法，培養數學變通性思考',
        availableTools: ['gen_multi_strategies', 'suggest_alternative_paths'],
    },
    {
        id: 'collaborative-grouping',
        name: 'Agentic Collaborative Grouping Agent',
        nameEn: '協作分組',
        category: 'analytics',
        description: '根據學生能力畫像與社交特質，自動執行異質或同質分組，優化協作基礎',
        availableTools: ['query_profiles', 'run_clustering'],
    },

    // B. 學生學習模組 - Scaffolding Agent Cluster
    {
        id: 'conjecture',
        name: 'Mathematical Conjecturing Agent',
        nameEn: '數學臆測',
        category: 'scaffolding',
        description: '引導學生觀察規律、提出初步假設 (What if?)',
        availableTools: ['scaffold_conjecture'],
    },
    {
        id: 'reasoning',
        name: 'Mathematical Reasoning Agent',
        nameEn: '數學推論',
        category: 'scaffolding',
        description: '引導學生進行邏輯論證、演繹與證明 (Why?)',
        availableTools: ['verify_logical_steps'],
    },
    {
        id: 'cps-agent',
        name: 'Collaborative Problem Solving Agent',
        nameEn: '合作問題解決',
        category: 'scaffolding',
        description: '協調成員意見，確保共同目標達成',
        availableTools: ['guide_shared_understanding'],
    },
    {
        id: 'apos-construction',
        name: 'APOS Mathematical Construction Agent',
        nameEn: 'APOS數學建構',
        category: 'scaffolding',
        description: '採用啟發式對話與蘇格拉底提問，專責引導學生在數學探究中完成 APOS 理論之心理建構歷程',
        availableTools: ['socratic_dialogue', 'apos_scaffolding'],
    },
    {
        id: 'technical-support',
        name: 'Technical Support Agent',
        nameEn: '技術工具',
        category: 'scaffolding',
        description: '提供 GeoGebra、Wolfram Alpha 等動態工具支援',
        availableTools: ['get_ggb_state', 'solve_algebra', 'recognize_handwriting', 'provide_hint'],
    },

    // 評量與觀測
    {
        id: 'grader',
        name: 'Automated Assessment Agent',
        nameEn: '自動評分',
        category: 'assessment',
        description: '針對學生的解題正確性、邏輯品質與操作行為進行多維度的即時診斷與評價',
        availableTools: ['compute_score', 'grade_ggb_construction', 'grade_proof_process', 'evaluate_discourse_quality'],
    },
    {
        id: 'learning-observer',
        name: 'Learning Behavior Observer',
        nameEn: '學習行為觀測',
        category: 'analytics',
        description: '將學生所有操作、對話串流至 LRS，自動識別學習節點',
        availableTools: ['stream_realtime_log', 'detect_session_event'],
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

// ==================== Mock 生成的課程 ====================

export const MOCK_GENERATED_LESSON: LessonPlan = {
    id: 'lesson-math-001',
    title: '國小五年級四則運算',
    topic: '國小五年級四則運算',
    objectives: '理解加減乘除運算順序\n能正確計算混合運算\n解決生活中的數學問題',
    difficulty: 'intermediate',
    status: 'draft',
    createdAt: new Date(),
    nodes: [
        {
            id: 'node-1',
            title: '基礎運算複習',
            order: 1,
            agent: AVAILABLE_AGENTS[1], // Content Generator
            selectedTools: [AVAILABLE_TOOLS[0], AVAILABLE_TOOLS[2]], // 題目生成、多模態內容
            generatedContent: {
                materials: ['教學影片 3分鐘', '圖解說明 5張'],
                exercises: 10,
                interactions: ['AI 對話輔導'],
            },
        },
        {
            id: 'node-2',
            title: '混合運算順序',
            order: 2,
            agent: AVAILABLE_AGENTS[2], // Multi-Solution
            selectedTools: [AVAILABLE_TOOLS[3]], // 多重解法
            generatedContent: {
                materials: ['範例題組 3題'],
                exercises: 8,
                interactions: ['多重解題策略展示'],
            },
            // 設為學習檢查點
            isConditional: true,
            conditions: {
                learnedPath: 'node-3', // 學會 → GeoGebra 互動
                notLearnedPath: 'node-2-补强', // 未學會 → 補強
                assessmentCriteria: '完成度 ≥ 75% 且理解度評分 ≥ 70%',
            },
        },
        {
            id: 'node-2-补强',
            title: '基礎運算補強',
            order: 2.5,
            agent: AVAILABLE_AGENTS[7], // APOS Construction
            selectedTools: [AVAILABLE_TOOLS[6]], // 臆測鷹架
            generatedContent: {
                materials: ['互動式引導對話'],
                exercises: 5,
                interactions: ['蘇格拉底提問', '概念重建'],
            },
            // 補強完成後，回到主流程
            nextNodeId: 'node-3',
        },
        {
            id: 'node-3',
            title: 'GeoGebra 互動練習',
            order: 3,
            agent: AVAILABLE_AGENTS[8], // Technical Support
            selectedTools: [AVAILABLE_TOOLS[1], AVAILABLE_TOOLS[4]], // GGB 腳本、狀態讀取
            generatedContent: {
                materials: ['GeoGebra 互動元件 2個'],
                exercises: 5,
                interactions: ['動態操作', '即時反饋'],
            },
        },
        {
            id: 'node-4',
            title: '綜合評量',
            order: 4,
            agent: AVAILABLE_AGENTS[9], // Grader
            selectedTools: [AVAILABLE_TOOLS[8]], // 自動計分
            generatedContent: {
                exercises: 15,
            },
        },
    ],
};
