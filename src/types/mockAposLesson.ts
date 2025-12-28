/**
 * 新架構的 APOS 教學流程 Mock Data
 * 採用三層設計：Stage → Activity → Resource
 */

import type { LessonPlan, Tool, APOSStageNode, ActivityNode, ResourceBinding } from './lessonPlan';
import { findAgentById, findToolById } from './lessonPlan';

/**
 * 新架構的 APOS 教學流程範例
 * 展示三層設計的完整結構
 */
export const MOCK_APOS_LESSON: LessonPlan = {
    id: 'lesson-apos-new-001',
    title: '二元一次方程式 - APOS 教學流程（新架構）',
    topic: '二元一次方程式',
    objectives: '理解二元一次方程式的意義\n能用代入消去法或加減消去法解聯立方程\n應用於生活情境問題',
    difficulty: 'intermediate',
    status: 'draft',
    createdAt: new Date(),

    stages: [
        // ============ Stage 1: Action (行動階段) ============
        {
            id: 'stage-action',
            stage: 'A',
            goal: '透過具體操作理解二元一次方程式的概念',
            description: '學生透過動手操作與具體範例理解數學概念',
            estimatedMinutes: 40,
            activities: [
                {
                    id: 'action-intro',
                    type: 'intro',
                    title: '情境導入：雞兔同籠問題',
                    order: 1,
                    estimatedMinutes: 10,
                    resources: [
                        {
                            id: 'res-intro-video',
                            resourceType: 'video',
                            agent: findAgentById('content-generator'),
                            tools: [findToolById('gen_multimodal_content')!].filter(Boolean) as Tool[],
                            generatedContent: {
                                materials: ['3分鐘動畫：雞兔同籠問題'],
                                interactions: ['實際情境引導'],
                            },
                            isDefault: true,
                        },
                    ],
                },
                {
                    id: 'action-explore',
                    type: 'teaching',
                    title: '具體操作：變數探索',
                    order: 2,
                    estimatedMinutes: 20,
                    resources: [
                        {
                            id: 'res-explore-ggb',
                            resourceType: 'interactive',
                            agent: findAgentById('technical-support'),
                            tools: [findToolById('gen_ggb_script')!, findToolById('get_ggb_state')!].filter(Boolean) as Tool[],
                            generatedContent: {
                                materials: ['GeoGebra 互動元件：變數滑桿'],
                                exercises: 3,
                                interactions: ['拖曳滑桿調整 x, y 值'],
                            },
                            isDefault: true,
                        },
                    ],
                },
                {
                    id: 'action-checkpoint',
                    type: 'checkpoint',
                    title: 'Action 檢查點',
                    order: 3,
                    estimatedMinutes: 10,
                    resources: [
                        {
                            id: 'res-checkpoint-ws',
                            resourceType: 'worksheet',
                            agent: findAgentById('grader'),
                            tools: [findToolById('compute_score')!].filter(Boolean) as Tool[],
                            generatedContent: { exercises: 5, materials: ['代入數值驗證題'] },
                            isDefault: true,
                        },
                    ],
                    flowControl: {
                        type: 'checkpoint',
                        criteria: '正確率 ≥ 70%',
                        paths: [
                            { id: 'path-action-pass', label: '✓ 學會', nextActivityId: 'process-explain', condition: '正確率 ≥ 70%' },
                            { id: 'path-action-remedial', label: '✗ 需補強', nextActivityId: 'action-remedial', condition: '正確率 < 70%' },
                        ],
                    },
                },
                {
                    id: 'action-remedial',
                    type: 'remedial',
                    title: 'Action 補強',
                    order: 4,
                    estimatedMinutes: 15,
                    resources: [
                        {
                            id: 'res-remedial-ai',
                            resourceType: 'material',
                            agent: findAgentById('conjecture'),
                            tools: [findToolById('scaffold_conjecture')!].filter(Boolean) as Tool[],
                            generatedContent: { materials: ['AI 一對一重新引導'], interactions: ['蘇格拉底提問'] },
                            isDefault: true,
                        },
                    ],
                    flowControl: {
                        type: 'checkpoint',
                        paths: [{ id: 'path-remedial-retry', label: '回到檢查點', nextActivityId: 'action-checkpoint' }],
                    },
                },
            ],
        },

        // ============ Stage 2: Process (過程階段) ============
        {
            id: 'stage-process',
            stage: 'P',
            goal: '內化解題步驟為可重複的心智程序',
            description: '引導學生將操作步驟內化為可重複的心智程序',
            estimatedMinutes: 50,
            activities: [
                {
                    id: 'process-explain',
                    type: 'teaching',
                    title: '代入消去法教學',
                    order: 5,
                    estimatedMinutes: 15,
                    description: '提供三種教學方式供選擇',
                    resources: [
                        { id: 'res-process-video', resourceType: 'video', agent: findAgentById('apos-construction'), tools: [], generatedContent: { materials: ['代入消去法動畫 5分鐘'] }, isDefault: true },
                        { id: 'res-process-game', resourceType: 'interactive', agent: findAgentById('technical-support'), tools: [], generatedContent: { materials: ['互動式步驟演示'] } },
                        { id: 'res-process-read', resourceType: 'material', agent: findAgentById('content-generator'), tools: [], generatedContent: { materials: ['圖解步驟說明'] } },
                    ],
                    flowControl: {
                        type: 'multi-choice',
                        criteria: '選擇教學方式',
                        paths: [
                            { id: 'path-video', label: '選項A：影片', nextActivityId: 'process-practice' },
                            { id: 'path-game', label: '選項B：互動', nextActivityId: 'process-practice' },
                            { id: 'path-read', label: '選項C：閱讀', nextActivityId: 'process-practice' },
                        ],
                    },
                },
                {
                    id: 'process-practice',
                    type: 'practice',
                    title: '解題練習',
                    order: 6,
                    estimatedMinutes: 25,
                    resources: [
                        { id: 'res-practice', resourceType: 'worksheet', agent: findAgentById('multi-solution'), tools: [], generatedContent: { exercises: 8, materials: ['代入法練習 4題', '加減消去法練習 4題'] }, isDefault: true },
                    ],
                },
                {
                    id: 'process-checkpoint',
                    type: 'checkpoint',
                    title: 'Process 檢查點',
                    order: 7,
                    estimatedMinutes: 10,
                    resources: [
                        { id: 'res-process-check', resourceType: 'worksheet', agent: findAgentById('grader'), tools: [], generatedContent: { exercises: 6 }, isDefault: true },
                    ],
                    flowControl: {
                        type: 'checkpoint',
                        criteria: '正確率 ≥ 75%',
                        paths: [
                            { id: 'path-process-pass', label: '✓ 學會', nextActivityId: 'object-abstract', condition: '正確率 ≥ 75%' },
                            { id: 'path-process-fail', label: '✗ 需補強', nextActivityId: 'process-remedial', condition: '正確率 < 75%' },
                        ],
                    },
                },
                {
                    id: 'process-remedial',
                    type: 'remedial',
                    title: 'Process 補強',
                    order: 8,
                    estimatedMinutes: 15,
                    resources: [
                        { id: 'res-process-remedial', resourceType: 'material', agent: findAgentById('reasoning'), tools: [], generatedContent: { materials: ['逐步推論引導'] }, isDefault: true },
                    ],
                    flowControl: { type: 'checkpoint', paths: [{ id: 'path-process-retry', label: '回到檢查點', nextActivityId: 'process-checkpoint' }] },
                },
            ],
        },

        // ============ Stage 3: Object (物件階段) ============
        {
            id: 'stage-object',
            stage: 'O',
            goal: '將方程式視為可操作的整體對象',
            description: '將數學過程視為可操作的整體對象並進行變換',
            estimatedMinutes: 45,
            activities: [
                {
                    id: 'object-abstract',
                    type: 'teaching',
                    title: '方程式作為物件',
                    order: 9,
                    estimatedMinutes: 15,
                    resources: [
                        { id: 'res-object-concept', resourceType: 'video', agent: findAgentById('apos-construction'), tools: [], generatedContent: { materials: ['方程式物件化概念'] }, isDefault: true },
                    ],
                },
                {
                    id: 'object-transform',
                    type: 'practice',
                    title: '方程式變換練習',
                    order: 10,
                    estimatedMinutes: 20,
                    resources: [
                        { id: 'res-object-transform', resourceType: 'interactive', agent: findAgentById('technical-support'), tools: [], generatedContent: { exercises: 5, materials: ['GeoGebra 代數視窗'] }, isDefault: true },
                    ],
                },
                {
                    id: 'object-checkpoint',
                    type: 'checkpoint',
                    title: 'Object 檢查點',
                    order: 11,
                    estimatedMinutes: 10,
                    resources: [
                        { id: 'res-object-check', resourceType: 'worksheet', agent: findAgentById('grader'), tools: [], generatedContent: { exercises: 5 }, isDefault: true },
                    ],
                    flowControl: {
                        type: 'checkpoint',
                        criteria: '正確率 ≥ 80%',
                        paths: [
                            { id: 'path-object-pass', label: '✓ 學會', nextActivityId: 'schema-integrate', condition: '正確率 ≥ 80%' },
                            { id: 'path-object-fail', label: '✗ 需補強', nextActivityId: 'object-remedial', condition: '正確率 < 80%' },
                        ],
                    },
                },
                {
                    id: 'object-remedial',
                    type: 'remedial',
                    title: 'Object 補強',
                    order: 12,
                    estimatedMinutes: 15,
                    resources: [
                        { id: 'res-object-remedial', resourceType: 'material', agent: findAgentById('conjecture'), tools: [], generatedContent: { materials: ['物件觀點重建'] }, isDefault: true },
                    ],
                    flowControl: { type: 'checkpoint', paths: [{ id: 'path-object-retry', label: '回到檢查點', nextActivityId: 'object-checkpoint' }] },
                },
            ],
        },

        // ============ Stage 4: Schema (基模階段) ============
        {
            id: 'stage-schema',
            stage: 'S',
            goal: '整合概念形成結構化的知識網絡',
            description: '整合多個概念形成結構化的知識網絡與應用',
            estimatedMinutes: 50,
            activities: [
                {
                    id: 'schema-integrate',
                    type: 'teaching',
                    title: '概念整合',
                    order: 13,
                    estimatedMinutes: 15,
                    resources: [
                        { id: 'res-schema-concept', resourceType: 'material', agent: findAgentById('apos-construction'), tools: [], generatedContent: { materials: ['心智圖：聯立方程式知識結構'] }, isDefault: true },
                    ],
                },
                {
                    id: 'schema-apply',
                    type: 'application',
                    title: '生活應用',
                    order: 14,
                    estimatedMinutes: 25,
                    resources: [
                        { id: 'res-schema-apply', resourceType: 'worksheet', agent: findAgentById('creativity'), tools: [], generatedContent: { exercises: 5, materials: ['雞兔同籠問題', '購物找零問題'] }, isDefault: true },
                    ],
                },
                {
                    id: 'schema-final',
                    type: 'checkpoint',
                    title: '總評量',
                    order: 15,
                    estimatedMinutes: 10,
                    resources: [
                        { id: 'res-schema-final', resourceType: 'worksheet', agent: findAgentById('grader'), tools: [], generatedContent: { exercises: 15, materials: ['綜合能力測驗'] }, isDefault: true },
                    ],
                    flowControl: {
                        type: 'checkpoint',
                        criteria: '總分 ≥ 80 分',
                        paths: [
                            { id: 'path-complete', label: '✓ 完成', nextActivityId: 'complete', condition: '總分 ≥ 80' },
                            { id: 'path-schema-fail', label: '✗ 需加強', nextActivityId: 'schema-remedial', condition: '總分 < 80' },
                        ],
                    },
                },
                {
                    id: 'schema-remedial',
                    type: 'remedial',
                    title: '弱點加強',
                    order: 16,
                    estimatedMinutes: 15,
                    resources: [
                        { id: 'res-schema-remedial', resourceType: 'material', agent: findAgentById('realtime-advisor'), tools: [], generatedContent: { materials: ['AI 推薦複習路徑'] }, isDefault: true },
                    ],
                    flowControl: { type: 'checkpoint', paths: [{ id: 'path-schema-retry', label: '回到總評量', nextActivityId: 'schema-final' }] },
                },
                {
                    id: 'complete',
                    type: 'intro',
                    title: '學習完成',
                    order: 17,
                    estimatedMinutes: 5,
                    resources: [
                        { id: 'res-complete', resourceType: 'material', agent: findAgentById('content-generator'), tools: [], generatedContent: { materials: ['學習成果總結', '能力Badge獲得'] }, isDefault: true },
                    ],
                },
            ],
        },
    ],
};

// ==================== 輔助函數 ====================

/**
 * 從新架構的 LessonPlan 中取得所有 Activities（扁平化）
 */
export function getAllActivities(lesson: LessonPlan): ActivityNode[] {
    if (!lesson.stages) return [];
    return lesson.stages.flatMap(stage => stage.activities);
}

/**
 * 根據 Activity ID 找到該 Activity 所屬的 Stage
 */
export function findStageByActivityId(lesson: LessonPlan, activityId: string): APOSStageNode | undefined {
    if (!lesson.stages) return undefined;
    return lesson.stages.find(stage =>
        stage.activities.some(activity => activity.id === activityId)
    );
}

/**
 * 根據 Activity ID 取得該 Activity
 */
export function findActivityById(lesson: LessonPlan, activityId: string): ActivityNode | undefined {
    if (!lesson.stages) return undefined;
    for (const stage of lesson.stages) {
        const activity = stage.activities.find(a => a.id === activityId);
        if (activity) return activity;
    }
    return undefined;
}

/**
 * 取得 Activity 的預設 Resource
 */
export function getDefaultResource(activity: ActivityNode): ResourceBinding | undefined {
    return activity.resources.find(r => r.isDefault) || activity.resources[0];
}
