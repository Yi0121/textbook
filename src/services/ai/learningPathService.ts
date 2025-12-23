/**
 * AI 學習路徑服務
 *
 * 職責：
 * - 分析學生作答記錄
 * - 生成個性化學習路徑推薦
 * - 基於知識節點生成補充內容
 */

import type {
  StudentLearningRecord,
  StudentLearningPath,
  LearningPathNode,
  LearningPathEdge,
} from '../../types';

/**
 * AI 分析學生作答記錄，生成學習路徑推薦
 * 
 * 生成結構：
 * [診斷] → [學習1] → [學習2] → [學習3] → [測驗OK?] → [Got it!] → [分組] → [協作] → [總結]
 *                                            ↓ Not OK
 *                                        [Detour] ←──────────────────────┘
 *
 * @param record 學生學習記錄
 * @returns 學習路徑節點、邊、AI 推薦摘要
 */
export async function analyzeStudentAndGeneratePath(
  record: StudentLearningRecord
): Promise<{
  nodes: LearningPathNode[];
  edges: LearningPathEdge[];
  recommendation: StudentLearningPath['aiRecommendation'];
}> {
  // Mock AI 處理延遲
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 分析弱點（取前 3 個）
  const weakNodes = record.weakKnowledgeNodes.slice(0, 3);

  // 生成節點與邊
  const nodes: LearningPathNode[] = [];
  const edges: LearningPathEdge[] = [];

  const spacing = 320; // 水平間距
  let xOffset = 100;
  const mainY = 300; // 主線 Y 座標
  const detourY = 550; // 迴路 Y 座標

  // ========== 1. 起始：AI 診斷節點 ==========
  const diagnosisNodeId = `ai-diagnosis-${Date.now()}`;
  nodes.push({
    id: diagnosisNodeId,
    type: 'ai_diagnosis',
    position: { x: xOffset, y: mainY },
    data: {
      label: '🧠 學習診斷',
      description: 'SRL Analyst 分析學習狀態',
      content: {
        analysisType: 'comprehensive',
        targetMetrics: ['srl', 'knowledge_gaps'],
      },
      isRequired: true,
      aiGenerated: true,
    },
  });
  let prevNodeId = diagnosisNodeId;
  xOffset += spacing;

  // ========== 2. 學習階段 (Part 1, 2, 3...) ==========
  const learningNodeIds: string[] = [];
  weakNodes.forEach((weak, index) => {
    // 章節學習節點
    const chapterNodeId = `chapter-${Date.now()}-${index}`;
    nodes.push({
      id: chapterNodeId,
      type: 'chapter',
      position: { x: xOffset, y: mainY },
      data: {
        label: `📖 Part ${index + 1}`,
        description: weak.nodeName,
        content: { chapterTitle: weak.nodeName },
        isRequired: true,
        aiGenerated: true,
        knowledgeNodeIds: [weak.nodeId],
      },
    });

    edges.push({
      id: `edge-${prevNodeId}-${chapterNodeId}`,
      source: prevNodeId,
      target: chapterNodeId,
      type: 'default',
    });

    learningNodeIds.push(chapterNodeId);
    prevNodeId = chapterNodeId;
    xOffset += spacing;
  });

  // ========== 3. 測驗節點 (OK? 決策點) ==========
  const quizNodeId = `quiz-${Date.now()}`;
  nodes.push({
    id: quizNodeId,
    type: 'quiz',
    position: { x: xOffset, y: mainY },
    data: {
      label: '❓ OK?',
      description: '檢核學習成效',
      content: { passingScore: 70 },
      completionCriteria: { type: 'score', threshold: 70 },
      isRequired: true,
      aiGenerated: true,
    },
  });

  edges.push({
    id: `edge-${prevNodeId}-${quizNodeId}`,
    source: prevNodeId,
    target: quizNodeId,
    type: 'default',
  });
  xOffset += spacing;

  // ========== 4. Got it! 節點 (通過時) ==========
  const gotItNodeId = `gotit-${Date.now()}`;
  nodes.push({
    id: gotItNodeId,
    type: 'learning_analytics',
    position: { x: xOffset, y: mainY },
    data: {
      label: '✅ Got it!',
      description: '學習成效達標',
      content: {
        analysisType: 'success',
        targetMetrics: ['mastery_confirmed'],
      },
      isRequired: true,
      aiGenerated: true,
    },
  });

  // OK 路徑 (實線)
  edges.push({
    id: `edge-${quizNodeId}-${gotItNodeId}-ok`,
    source: quizNodeId,
    target: gotItNodeId,
    type: 'conditional',
    data: {
      label: 'OK ✓',
      condition: { type: 'score', operator: '>=', value: 70 },
      style: { stroke: '#10b981', strokeWidth: 2 },
    },
  });
  xOffset += spacing;

  // ========== 5. Detour 節點 (未通過時的迴路) ==========
  const detourNodeId = `detour-${Date.now()}`;
  nodes.push({
    id: detourNodeId,
    type: 'adaptive_exercise',
    position: { x: xOffset - spacing * 2, y: detourY },
    data: {
      label: '🔄 Detour',
      description: '補救練習 (Content Generator)',
      content: {
        difficulty: 'easy',
        questionIds: weakNodes.flatMap(w => w.relatedQuestions),
      },
      isRequired: false,
      aiGenerated: true,
    },
  });

  // Not OK 路徑 (虛線向下到 Detour)
  edges.push({
    id: `edge-${quizNodeId}-${detourNodeId}-notok`,
    source: quizNodeId,
    target: detourNodeId,
    type: 'conditional',
    data: {
      label: 'Not OK',
      condition: { type: 'score', operator: '<', value: 70 },
      style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '8,4' },
    },
  });

  // Detour 迴路回到第一個學習節點 (虛線)
  if (learningNodeIds.length > 0) {
    edges.push({
      id: `edge-${detourNodeId}-${learningNodeIds[0]}-loop`,
      source: detourNodeId,
      target: learningNodeIds[0],
      type: 'conditional',
      data: {
        label: '重新學習',
        style: { stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '5,5' },
      },
    });
  }

  // ========== 6. 分組節點 ==========
  const groupingNodeId = `ai-grouping-${Date.now()}`;
  nodes.push({
    id: groupingNodeId,
    type: 'ai_grouping',
    position: { x: xOffset, y: mainY },
    data: {
      label: '👥 智慧分組',
      description: 'Grouping Agent 異質分組',
      content: { groupSize: 4, groupingStrategy: 'mixed' },
      isRequired: true,
      aiGenerated: true,
    },
  });

  edges.push({
    id: `edge-${gotItNodeId}-${groupingNodeId}`,
    source: gotItNodeId,
    target: groupingNodeId,
    type: 'default',
  });
  xOffset += spacing;

  // ========== 7. 協作節點 ==========
  const collaborationNodeId = `collaboration-${Date.now()}`;
  nodes.push({
    id: collaborationNodeId,
    type: 'collaboration',
    position: { x: xOffset, y: mainY },
    data: {
      label: '🤝 小組協作',
      description: '團隊合作完成任務',
      content: { groupSize: 4, discussionTopic: '綜合應用' },
      isRequired: true,
      aiGenerated: true,
    },
  });

  edges.push({
    id: `edge-${groupingNodeId}-${collaborationNodeId}`,
    source: groupingNodeId,
    target: collaborationNodeId,
    type: 'default',
  });
  xOffset += spacing;

  // ========== 8. 結尾：學習分析節點 ==========
  const analyticsNodeId = `learning-analytics-${Date.now()}`;
  nodes.push({
    id: analyticsNodeId,
    type: 'learning_analytics',
    position: { x: xOffset, y: mainY },
    data: {
      label: '📊 成效分析',
      description: 'Process Analyst 產出報告',
      content: {
        analysisType: 'progress_report',
        targetMetrics: ['completion', 'growth'],
      },
      isRequired: true,
      aiGenerated: true,
    },
  });

  edges.push({
    id: `edge-${collaborationNodeId}-${analyticsNodeId}`,
    source: collaborationNodeId,
    target: analyticsNodeId,
    type: 'default',
  });

  // AI 推薦摘要
  const recommendation = {
    summary: `🤖 AI Agent 驅動的循環學習路徑：診斷 → 學習 → 檢核 → OK繼續/Not OK補救迴路 → 協作 → 分析`,
    focusAreas: weakNodes.map((w) => w.nodeName),
    estimatedDuration: nodes.length * 10,
    difficulty:
      record.averageScore >= 70
        ? ('medium' as const)
        : ('hard' as const),
  };

  return { nodes, edges, recommendation };
}

/**
 * 基於知識節點生成補充內容
 *
 * @param nodeId 知識節點 ID
 * @param nodeName 知識節點名稱
 * @returns 補充資源（影片、練習題、AI 提示）
 */
export async function generateContentForKnowledgeNode(
  nodeId: string,
  nodeName: string
): Promise<{
  videoUrl?: string;
  exercises: string[];
  aiTutorPrompt: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    videoUrl: `https://example.com/videos/${nodeId}`,
    exercises: [`${nodeName}-Q1`, `${nodeName}-Q2`, `${nodeName}-Q3`],
    aiTutorPrompt: `請用簡單的例子解釋「${nodeName}」的核心概念`,
  };
}

/**
 * 根據測驗分數決定下一步路徑
 *
 * @param score 測驗分數
 * @param nodeId 當前節點 ID
 * @returns 下一個節點 ID
 */
export function decideNextPathBasedOnScore(
  score: number,
  nodeId: string
): string | null {
  if (score >= 80) {
    return `${nodeId}-next-success`;
  } else if (score >= 60) {
    return `${nodeId}-next-review`;
  } else {
    return `${nodeId}-next-retry`;
  }
}

/**
 * 生成備課工作流程 (Lesson Prep Workflow)
 * 
 * 使用預設模板生成，可透過 templateId 選擇不同流程複雜度
 * - 'simple': 極簡 4 節點流程
 * - 'standard': 標準 5 節點流程（含診斷）
 */
export async function generateLessonPrepWorkflow(
  templateId: 'simple' | 'standard' = 'simple'
): Promise<{
  nodes: LearningPathNode[];
  edges: LearningPathEdge[];
}> {
  // 模擬 AI 處理延遲
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 從設定檔載入模板
  const { generateFromTemplate, WORKFLOW_TEMPLATES } = await import('../../config/workflowTemplates');

  const template = WORKFLOW_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Unknown template: ${templateId}`);
  }

  return generateFromTemplate(template);
}

