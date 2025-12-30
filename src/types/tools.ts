/**
 * Tool 定義
 * 
 * [Refactored] 從 types/lessonPlan.ts 移入
 */

export interface Tool {
    id: string;
    name: string;
    description: string;
    category: '教材' | '互動' | '評量' | '分析';
}

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

/** 根據 ID 查找 Tool */
export const findToolById = (id: string) => AVAILABLE_TOOLS.find(t => t.id === id);
