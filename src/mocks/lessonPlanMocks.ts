/**
 * 差異化教學課程 Mock 資料
 * 
 * 用於展示學習路徑分支、補救教學、多選一資源等差異化功能
 * 
 * [Refactored] 從 types/lessonPlan.ts 移入
 */

import type { LessonPlan } from '../types/lessonPlan';
import { AVAILABLE_TOOLS } from '../types/tools';
import { findAgentById } from '../agents/types';

// ==================== 差異化教學範例 ====================

export const MOCK_DIFFERENTIATED_LESSON: LessonPlan = {
    id: 'lesson-math-002',
    title: '分數加減法',
    topic: '分數加減法',
    objectives: '掌握多項式基本概念\\n能熟練運算乘法公式\\n應用於實際問題',
    difficulty: 'intermediate',
    status: 'draft',
    createdAt: new Date(),
    nodes: [
        // 步驟 1: 課程導入
        {
            id: 'step1',
            title: '1. 代數式基礎回顧',
            order: 1,
            nodeType: 'material',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['代數式名詞定義：係數、次數、常數項'],
            },
            // 三選一：多重學習路徑
            isConditional: true,
            conditions: {
                learnedPath: 'step2-video',      // 選項A
                notLearnedPath: 'step2-game',    // 選項B
                advancedPath: 'step2-reading',   // 選項C
                assessmentCriteria: '選擇學習方式',
                branchType: 'multi-choice',
            },
        },

        // 步驟 2: 教學（三選一）
        {
            id: 'step2-video',
            title: '2A. 影片：同類項合併',
            order: 2,
            nodeType: 'video',
            branchLevel: 'standard',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['同類項合併教學動畫 (5分鐘)'],
            },
            nextNodeId: 'step3', // 指向步驟3
        },

        {
            id: 'step2-game',
            title: '2B. 遊戲：水果分類',
            order: 2,
            nodeType: 'external',
            branchLevel: 'standard',
            agent: findAgentById('technical-support'),
            selectedTools: [AVAILABLE_TOOLS[1]],
            generatedContent: {
                materials: ['分類遊戲：將 xs 和 ys 分類'],
            },
            nextNodeId: 'step3', // 指向步驟3
        },

        {
            id: 'step2-reading',
            title: '2C. 講義：運算規則',
            order: 2,
            nodeType: 'material',
            branchLevel: 'standard',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[0]],
            generatedContent: {
                materials: ['圖解代數運算規則'],
            },
            nextNodeId: 'step3', // 指向步驟3
        },

        // 步驟 3: 練習
        {
            id: 'step3',
            title: '3. 基礎運算練習',
            order: 3,
            nodeType: 'worksheet',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 5,
                materials: ['5題基礎化簡題'],
            },
        },

        // 步驟 4: 測驗（檢查點）
        {
            id: 'step4-test',
            title: '4. 能力檢測',
            order: 4,
            nodeType: 'worksheet',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 10,
                materials: ['10題綜合運算測驗'],
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
            title: '補救：去括號法則',
            order: 5,
            nodeType: 'material',
            branchLevel: 'remedial',
            agent: findAgentById('conjecture'),
            selectedTools: [AVAILABLE_TOOLS[6]],
            generatedContent: {
                materials: ['AI 個別化去括號引導'],
            },
            nextNodeId: 'remedial-test',
        },

        {
            id: 'remedial-test',
            title: '補救：再次評量',
            order: 6,
            nodeType: 'worksheet',
            branchLevel: 'remedial',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 5,
                materials: ['基礎去括號練習'],
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
            title: '5. 多元解法探索',
            order: 7,
            nodeType: 'material',
            agent: findAgentById('multi-solution'),
            selectedTools: [AVAILABLE_TOOLS[3]],
            generatedContent: {
                materials: ['乘法公式的幾何意義'],
            },
        },

        // 步驟 6: 應用題
        {
            id: 'step6',
            title: '6. 實際問題應用',
            order: 8,
            nodeType: 'video',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['生活情境題：土地面積計算'],
            },
        },

        // 步驟 7: 總測驗
        {
            id: 'step7',
            title: '7. 總結性評量',
            order: 9,
            nodeType: 'worksheet',
            agent: findAgentById('grader'),
            selectedTools: [AVAILABLE_TOOLS[8]],
            generatedContent: {
                exercises: 15,
                materials: ['綜合能力測驗'],
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
            title: '補救：應用題解題',
            order: 10,
            nodeType: 'external',
            branchLevel: 'remedial',
            agent: findAgentById('technical-support'),
            selectedTools: [AVAILABLE_TOOLS[1]],
            generatedContent: {
                materials: ['圖解面積公式'],
            },
            nextNodeId: 'step7',
        },

        // 完成
        {
            id: 'finish',
            title: '✓ 學習路徑完成',
            order: 11,
            nodeType: 'material',
            agent: findAgentById('content-generator'),
            selectedTools: [AVAILABLE_TOOLS[2]],
            generatedContent: {
                materials: ['個人化學習成果報告'],
            },
        },
    ],
};
