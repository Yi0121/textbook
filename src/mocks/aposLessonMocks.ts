/**
 * 代數式基本運算 - APOS 課程 Mock 資料
 * 
 * 基於研究論文「體現動態視覺化對中學生學習代數式基本運算的影響」
 * 套用 APOS 理論框架（Action, Process, Object, Schema）
 * 
 * 課程主題：代數式基本運算（加減乘除、合併同類項、乘法公式）
 * 適用對象：國中七年級學生
 * 
 * [Refactored] 從 types/algebraAposLesson.ts 移入
 */

import type { LessonPlan, APOSStageNode, ActivityNode, ResourceBinding } from '../types/lessonPlan';
import { AVAILABLE_AGENTS } from '../types/agents';
import { AVAILABLE_TOOLS } from '../types/tools';

// ===== 輔助函數 =====
const createResource = (
    id: string,
    resourceType: ResourceBinding['resourceType'],
    agentId: string,
    isDefault: boolean = false,
    content?: Partial<ResourceBinding['generatedContent']>,
    tools?: ResourceBinding['tools']
): ResourceBinding => ({
    id,
    resourceType,
    agent: AVAILABLE_AGENTS.find(a => a.id === agentId) || AVAILABLE_AGENTS[0],
    tools: tools || [],
    isDefault,
    generatedContent: content,
});

// ===== Action 階段：具體操作代數式 =====
const actionStage: APOSStageNode = {
    id: 'stage-action',
    stage: 'A',
    goal: '透過動態視覺化工具，讓學生以具體操作的方式體驗代數式的組成與運算',
    description: '操作代數磚虛擬教具，理解代數式的基本組成',
    activities: [
        {
            id: 'action-intro',
            type: 'intro',
            title: '情境導入：代數式在生活中',
            description: '展示生活中需要用到代數式的情境，引起學習動機',
            estimatedMinutes: 8,
            order: 1,
            resources: [
                createResource('action-intro-video', 'video', 'video-tutor', true, {
                    materials: ['生活中的代數式：購物折扣計算動畫'],
                }),
            ],
        },
        {
            id: 'action-manipulate',
            type: 'teaching',
            title: '動態視覺化：操作代數磚',
            description: '使用動態代數磚虛擬教具，讓學生透過拖曳和排列來理解代數式的組成',
            estimatedMinutes: 15,
            order: 2,
            resources: [
                createResource('action-manipulate-interactive', 'interactive', 'teaching-agent', true, {
                    materials: ['代數磚虛擬操作介面'],
                    exercises: 5,
                }, [AVAILABLE_TOOLS.find(t => t.id === 'simulation')!]),
                createResource('action-manipulate-video', 'video', 'video-tutor', false, {
                    materials: ['代數磚操作示範影片'],
                }),
            ],
        },
        {
            id: 'action-practice',
            type: 'practice',
            title: '操作練習：排列代數式',
            description: '學生自行操作代數磚，完成指定的代數式排列任務',
            estimatedMinutes: 10,
            order: 3,
            resources: [
                createResource('action-practice-worksheet', 'worksheet', 'exercise-agent', true, {
                    materials: ['代數式排列練習'],
                    exercises: 8,
                }),
            ],
        },
        {
            id: 'action-checkpoint',
            type: 'checkpoint',
            title: 'Action 階段學習檢核',
            description: '確認學生能正確操作代數磚並理解代數式的基本組成',
            estimatedMinutes: 8,
            order: 4,
            resources: [
                createResource('action-checkpoint-quiz', 'worksheet', 'exercise-agent', true, {
                    materials: ['代數式辨識測驗'],
                    exercises: 5,
                }),
            ],
            flowControl: {
                type: 'checkpoint',
                criteria: '正確率 ≥ 80%',
                paths: [
                    { id: 'action-pass', label: '✓ 掌握操作', nextActivityId: 'process-intro' },
                    { id: 'action-fail', label: '✗ 需補強', nextActivityId: 'action-remedial' },
                ],
            },
        },
        {
            id: 'action-remedial',
            type: 'remedial',
            title: 'Action 補救：具象操作重練',
            description: '透過更多具體操作練習，強化對代數式組成的理解',
            estimatedMinutes: 12,
            order: 5,
            resources: [
                createResource('action-remedial-interactive', 'interactive', 'teaching-agent', true, {
                    materials: ['代數磚分步引導練習'],
                    exercises: 6,
                }),
            ],
            flowControl: {
                type: 'checkpoint',
                paths: [
                    { id: 'action-remedial-retry', label: '↻ 回到檢核點', nextActivityId: 'action-checkpoint' },
                ],
            },
        },
    ],
};

// ===== Process 階段：內化運算過程 =====
const processStage: APOSStageNode = {
    id: 'stage-process',
    stage: 'P',
    goal: '將具體操作內化為心智過程，理解代數式運算的步驟與規則',
    description: '同類項合併與代數式加減法',
    activities: [
        {
            id: 'process-intro',
            type: 'intro',
            title: '動態視覺化：合併同類項',
            description: '透過動畫展示同類項合併的過程，建立運算心像',
            estimatedMinutes: 10,
            order: 1,
            resources: [
                createResource('process-intro-video', 'video', 'video-tutor', true, {
                    materials: ['同類項合併動態演示'],
                }),
            ],
        },
        {
            id: 'process-teaching',
            type: 'teaching',
            title: '代數式加減運算教學',
            description: '教授代數式加減法的規則與步驟',
            estimatedMinutes: 15,
            order: 2,
            resources: [
                createResource('process-teaching-material', 'material', 'teaching-agent', true, {
                    materials: ['代數式加減法講義'],
                }),
                createResource('process-teaching-video', 'video', 'video-tutor', false, {
                    materials: ['代數式加減法解題影片'],
                }),
                createResource('process-teaching-interactive', 'interactive', 'teaching-agent', false, {
                    materials: ['互動式加減法練習'],
                    exercises: 10,
                }),
            ],
            flowControl: {
                type: 'multi-choice',
                criteria: '選擇適合的學習資源',
                paths: [
                    { id: 'choice-material', label: '選項A：講義自學', nextActivityId: 'process-practice' },
                    { id: 'choice-video', label: '選項B：影片學習', nextActivityId: 'process-practice' },
                    { id: 'choice-interactive', label: '選項C：互動練習', nextActivityId: 'process-practice' },
                ],
            },
        },
        {
            id: 'process-practice',
            type: 'practice',
            title: '運算練習：同類項合併',
            description: '練習識別同類項並進行合併運算',
            estimatedMinutes: 12,
            order: 3,
            resources: [
                createResource('process-practice-worksheet', 'worksheet', 'exercise-agent', true, {
                    materials: ['同類項合併練習卷'],
                    exercises: 12,
                }),
            ],
        },
        {
            id: 'process-checkpoint',
            type: 'checkpoint',
            title: 'Process 階段學習檢核',
            description: '確認學生能正確進行代數式加減運算',
            estimatedMinutes: 10,
            order: 4,
            resources: [
                createResource('process-checkpoint-quiz', 'worksheet', 'exercise-agent', true, {
                    materials: ['代數式加減法測驗'],
                    exercises: 8,
                }),
            ],
            flowControl: {
                type: 'checkpoint',
                criteria: '正確率 ≥ 75%',
                paths: [
                    { id: 'process-pass', label: '✓ 內化完成', nextActivityId: 'object-intro' },
                    { id: 'process-fail', label: '✗ 需補強', nextActivityId: 'process-remedial' },
                ],
            },
        },
        {
            id: 'process-remedial',
            type: 'remedial',
            title: 'Process 補救：運算過程強化',
            description: '針對錯誤類型提供個別化補救練習',
            estimatedMinutes: 15,
            order: 5,
            resources: [
                createResource('process-remedial-adaptive', 'interactive', 'teaching-agent', true, {
                    materials: ['適性化錯誤診斷與練習'],
                    exercises: 10,
                }),
            ],
            flowControl: {
                type: 'checkpoint',
                paths: [
                    { id: 'process-remedial-retry', label: '↻ 回到檢核點', nextActivityId: 'process-checkpoint' },
                ],
            },
        },
    ],
};

// ===== Object 階段：概念物件化 =====
const objectStage: APOSStageNode = {
    id: 'stage-object',
    stage: 'O',
    goal: '將運算過程封裝為可操作的數學物件，理解代數式的結構性質',
    description: '乘法公式與因式分解',
    activities: [
        {
            id: 'object-intro',
            type: 'intro',
            title: '動態視覺化：代數式即物件',
            description: '展示如何將整個代數式視為一個可操作的物件',
            estimatedMinutes: 8,
            order: 1,
            resources: [
                createResource('object-intro-video', 'video', 'video-tutor', true, {
                    materials: ['代數式物件化概念動畫'],
                }),
            ],
        },
        {
            id: 'object-teaching',
            type: 'teaching',
            title: '乘法公式教學',
            description: '教授 (a+b)²、(a-b)²、(a+b)(a-b) 等乘法公式',
            estimatedMinutes: 20,
            order: 2,
            resources: [
                createResource('object-teaching-visual', 'interactive', 'teaching-agent', true, {
                    materials: ['乘法公式面積圖解'],
                }, [AVAILABLE_TOOLS.find(t => t.id === 'simulation')!]),
                createResource('object-teaching-material', 'material', 'teaching-agent', false, {
                    materials: ['乘法公式推導講義'],
                }),
            ],
        },
        {
            id: 'object-practice',
            type: 'practice',
            title: '乘法公式應用練習',
            description: '運用乘法公式進行代數式展開與因式分解',
            estimatedMinutes: 15,
            order: 3,
            resources: [
                createResource('object-practice-worksheet', 'worksheet', 'exercise-agent', true, {
                    materials: ['乘法公式練習卷'],
                    exercises: 15,
                }),
            ],
        },
        {
            id: 'object-checkpoint',
            type: 'checkpoint',
            title: 'Object 階段學習檢核',
            description: '確認學生能正確應用乘法公式',
            estimatedMinutes: 12,
            order: 4,
            resources: [
                createResource('object-checkpoint-quiz', 'worksheet', 'exercise-agent', true, {
                    materials: ['乘法公式綜合測驗'],
                    exercises: 10,
                }),
            ],
            flowControl: {
                type: 'differentiation',
                criteria: '依據學習表現分流',
                paths: [
                    { id: 'object-advanced', label: '進階：挑戰題', nextActivityId: 'object-advanced' },
                    { id: 'object-standard', label: '標準：進入 Schema', nextActivityId: 'schema-intro' },
                    { id: 'object-remedial', label: '補救：基礎強化', nextActivityId: 'object-remedial' },
                ],
            },
        },
        {
            id: 'object-advanced',
            type: 'practice',
            title: '進階挑戰：複雜乘法公式',
            description: '運用乘法公式解決較複雜的代數問題',
            estimatedMinutes: 15,
            order: 5,
            resources: [
                createResource('object-advanced-worksheet', 'worksheet', 'exercise-agent', true, {
                    materials: ['乘法公式進階挑戰'],
                    exercises: 8,
                }),
            ],
            flowControl: {
                type: 'checkpoint',
                paths: [
                    { id: 'object-advanced-next', label: '→ 進入 Schema', nextActivityId: 'schema-intro' },
                ],
            },
        },
        {
            id: 'object-remedial',
            type: 'remedial',
            title: 'Object 補救：公式理解強化',
            description: '透過視覺化重新理解乘法公式的幾何意義',
            estimatedMinutes: 12,
            order: 6,
            resources: [
                createResource('object-remedial-visual', 'interactive', 'teaching-agent', true, {
                    materials: ['乘法公式面積模型操作'],
                    exercises: 6,
                }),
            ],
            flowControl: {
                type: 'checkpoint',
                paths: [
                    { id: 'object-remedial-retry', label: '↻ 回到檢核點', nextActivityId: 'object-checkpoint' },
                ],
            },
        },
    ],
};

// ===== Schema 階段：建構知識網絡 =====
const schemaStage: APOSStageNode = {
    id: 'stage-schema',
    stage: 'S',
    goal: '整合所學內容，建構代數式運算的完整知識架構',
    description: '綜合應用與學習反思',
    activities: [
        {
            id: 'schema-intro',
            type: 'intro',
            title: '知識整合：代數式運算全景圖',
            description: '呈現代數式運算的知識架構，幫助學生看見概念間的連結',
            estimatedMinutes: 10,
            order: 1,
            resources: [
                createResource('schema-intro-map', 'material', 'teaching-agent', true, {
                    materials: ['代數式運算知識地圖'],
                }),
            ],
        },
        {
            id: 'schema-integration',
            type: 'teaching',
            title: '綜合應用：多步驟運算',
            description: '整合加減乘除與乘法公式，進行複合運算練習',
            estimatedMinutes: 20,
            order: 2,
            resources: [
                createResource('schema-integration-material', 'material', 'teaching-agent', true, {
                    materials: ['多步驟代數式運算講義'],
                }),
                createResource('schema-integration-video', 'video', 'video-tutor', false, {
                    materials: ['複合運算解題示範'],
                }),
            ],
        },
        {
            id: 'schema-practice',
            type: 'practice',
            title: '情境應用：實際問題解題',
            description: '運用代數式運算解決生活情境問題',
            estimatedMinutes: 15,
            order: 3,
            resources: [
                createResource('schema-practice-worksheet', 'worksheet', 'exercise-agent', true, {
                    materials: ['生活情境應用題'],
                    exercises: 6,
                }),
            ],
        },
        {
            id: 'schema-assessment',
            type: 'checkpoint',
            title: '總結性評量',
            description: '完整評估學生對代數式基本運算的掌握程度',
            estimatedMinutes: 20,
            order: 4,
            resources: [
                createResource('schema-assessment-exam', 'worksheet', 'exercise-agent', true, {
                    materials: ['代數式運算總結性評量'],
                    exercises: 20,
                }),
            ],
        },
        {
            id: 'schema-reflection',
            type: 'application',
            title: '學習反思與延伸',
            description: '引導學生反思學習歷程，預告下一單元內容',
            estimatedMinutes: 8,
            order: 5,
            resources: [
                createResource('schema-reflection-material', 'material', 'teaching-agent', true, {
                    materials: ['學習歷程回顧與反思單'],
                }),
            ],
        },
    ],
};

// ===== 完整 APOS 課程 =====
export const ALGEBRA_APOS_LESSON: LessonPlan = {
    id: 'algebra-operations-apos',
    title: '代數式基本運算',
    topic: '代數式運算',
    objectives: '理解代數式組成、掌握同類項合併與加減法、應用乘法公式解題',
    difficulty: 'intermediate',
    stages: [actionStage, processStage, objectStage, schemaStage],
    createdAt: new Date(),
    status: 'draft',
};

// 別名匯出，保持向後相容
export const MOCK_APOS_LESSON = ALGEBRA_APOS_LESSON;

// ===== 輔助函數 =====
export const getAllActivitiesFromAlgebra = (lesson: LessonPlan): ActivityNode[] => {
    if (!lesson.stages) return [];
    return lesson.stages.flatMap(stage => stage.activities);
};

export const findAlgebraStageByActivityId = (lesson: LessonPlan, activityId: string): APOSStageNode | undefined => {
    if (!lesson.stages) return undefined;
    return lesson.stages.find(stage =>
        stage.activities.some(a => a.id === activityId)
    );
};

export const findAlgebraActivityById = (lesson: LessonPlan, activityId: string): ActivityNode | undefined => {
    return getAllActivitiesFromAlgebra(lesson).find(a => a.id === activityId);
};
