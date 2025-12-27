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
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[0], AVAILABLE_TOOLS[2]],
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
            agent: findAgentById('multi-solution'),
            selectedTools: [AVAILABLE_TOOLS[3]],
            generatedContent: {
                materials: ['範例題組 3題'],
                exercises: 8,
                interactions: ['多重解題策略展示'],
            },
            isConditional: true,
            conditions: {
                learnedPath: 'node-3',
                notLearnedPath: 'node-2-补强',
                assessmentCriteria: '完成度 ≥ 75% 且理解度評分 ≥ 70%',
            },
        },
        {
            id: 'node-2-补强',
            title: '基礎運算補強',
            order: 3,
            agent: findAgentById('conjecture'),
            selectedTools: [AVAILABLE_TOOLS[6]],
            generatedContent: {
                materials: ['互動式引導對話'],
                exercises: 5,
                interactions: ['蘇格拉底提問', '概念重建'],
            },
            nextNodeId: 'node-3',
        },
        {
            id: 'node-3',
            title: 'GeoGebra 互動練習',
            order: 4,
            agent: findAgentById('technical-support'),
            selectedTools: [AVAILABLE_TOOLS[1], AVAILABLE_TOOLS[4]],
            generatedContent: {
                materials: ['GeoGebra 互動元件 2個'],
                exercises: 5,
                interactions: ['動態操作', '即時反饋'],
            },
        },
        {
            id: 'node-4',
            title: '綜合評量',
            order: 5,
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 15,
            },
        },
    ],
};

// ==================== 差異化教學範例 ====================

export const MOCK_DIFFERENTIATED_LESSON: LessonPlan = {
    id: 'lesson-math-002',
    title: '四則運算 - 教學流程圖',
    topic: '四則混合運算',
    objectives: '理解運算順序規則\\n能正確計算混合運算\\n應用於生活情境問題',
    difficulty: 'intermediate',
    status: 'draft',
    createdAt: new Date(),
    nodes: [
        // 步驟 1: 課程導入
        {
            id: 'step1',
            title: '1. 認識運算符號',
            order: 1,
            nodeType: 'material',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['加減乘除符號教學'],
            },
            // 三選一：使用特殊的 multiPath 來表示多個並行選項
            isConditional: true,
            conditions: {
                learnedPath: 'step2-video',      // 選項A
                notLearnedPath: 'step2-game',    // 選項B
                advancedPath: 'step2-reading',   // 選項C
                assessmentCriteria: '選擇教學方式',
                branchType: 'multi-choice',
            },
        },

        // 步驟 2: 教學（三選一）- 平行路徑從 step1 出發，都指向 step3
        {
            id: 'step2-video',
            title: '2A. 影片：先乘除後加減',
            order: 2,
            nodeType: 'video',
            branchLevel: 'standard',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['運算順序動畫'],
            },
            nextNodeId: 'step3', // 指向步驟3
        },

        {
            id: 'step2-game',
            title: '2B. 遊戲：運算大冒險',
            order: 2,
            nodeType: 'external',
            branchLevel: 'standard',
            agent: findAgentById('technical-support'),
            selectedTools: [AVAILABLE_TOOLS[1]],
            generatedContent: {
                materials: ['互動遊戲'],
            },
            nextNodeId: 'step3', // 指向步驟3
        },

        {
            id: 'step2-reading',
            title: '2C. 閱讀：運算規則圖解',
            order: 2,
            nodeType: 'material',
            branchLevel: 'standard',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[0]],
            generatedContent: {
                materials: ['圖解教材'],
            },
            nextNodeId: 'step3', // 指向步驟3
        },

        // 步驟 3: 練習
        {
            id: 'step3',
            title: '3. 基礎練習',
            order: 3,
            nodeType: 'worksheet',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 5,
                materials: ['5題基礎運算'],
            },
        },

        // 步驟 4: 測驗（檢查點）
        {
            id: 'step4-test',
            title: '4. 學習檢測',
            order: 4,
            nodeType: 'worksheet',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 10,
                materials: ['10題混合運算'],
            },
            isConditional: true,
            conditions: {
                learnedPath: 'step5', // ✓ 80分以上 → 繼續
                notLearnedPath: 'remedial1', // ✗ 未達標 → 補救
                assessmentCriteria: '80分以上',
                branchType: 'remedial',
            },
        },

        // 補救教學分支
        {
            id: 'remedial1',
            title: '補救：個別指導',
            order: 5,
            nodeType: 'material',
            branchLevel: 'remedial',
            agent: findAgentById('conjecture'),
            selectedTools: [AVAILABLE_TOOLS[6]],
            generatedContent: {
                materials: ['AI一對一輔導'],
            },
            nextNodeId: 'remedial-test',
        },

        {
            id: 'remedial-test',
            title: '補救：再次測驗',
            order: 6,
            nodeType: 'worksheet',
            branchLevel: 'remedial',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 5,
                materials: ['簡化版測驗'],
            },
            isConditional: true,
            conditions: {
                learnedPath: 'step5', // ✓ 達標 → 繼續
                notLearnedPath: 'remedial1', // ✗ 再補救
                assessmentCriteria: '70分以上',
                branchType: 'remedial',
            },
        },

        // 步驟 5: 進階應用
        {
            id: 'step5',
            title: '5. 括號運算',
            order: 7,
            nodeType: 'material',
            agent: findAgentById('multi-solution'),
            selectedTools: [AVAILABLE_TOOLS[3]],
            generatedContent: {
                materials: ['括號優先規則'],
            },
        },

        // 步驟 6: 應用題
        {
            id: 'step6',
            title: '6. 生活應用題',
            order: 8,
            nodeType: 'video',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['購物情境題'],
            },
        },

        // 步驟 7: 總測驗
        {
            id: 'step7',
            title: '7. 總評量',
            order: 9,
            nodeType: 'worksheet',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 15,
                materials: ['綜合測驗'],
            },
            isConditional: true,
            conditions: {
                learnedPath: 'finish', // ✓ 完成
                notLearnedPath: 'remedial2', // ✗ 應用題補救
                assessmentCriteria: '75分以上',
                branchType: 'remedial',
            },
        },

        // 應用題補救
        {
            id: 'remedial2',
            title: '補救：應用題加強',
            order: 10,
            nodeType: 'external',
            branchLevel: 'remedial',
            agent: findAgentById('technical-support'),
            selectedTools: [AVAILABLE_TOOLS[1]],
            generatedContent: {
                materials: ['互動情境練習'],
            },
            nextNodeId: 'step7',
        },

        // 完成
        {
            id: 'finish',
            title: '✓ 課程完成',
            order: 11,
            nodeType: 'material',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['學習成果總結'],
            },
        },
    ],
};
