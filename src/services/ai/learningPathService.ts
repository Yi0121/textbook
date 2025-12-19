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

  let yOffset = 100;
  let prevNodeId: string | null = null;

  // 為每個弱點生成學習路徑
  weakNodes.forEach((weak, index) => {
    // 1. 章節複習節點
    const chapterNodeId = `chapter-${Date.now()}-${index}`;
    nodes.push({
      id: chapterNodeId,
      type: 'chapter',
      position: { x: 200, y: yOffset },
      data: {
        label: `複習：${weak.nodeName}`,
        description: `錯誤率 ${(weak.errorRate * 100).toFixed(0)}%`,
        content: {
          chapterTitle: weak.nodeName,
        },
        isRequired: true,
        aiGenerated: true,
        knowledgeNodeIds: [weak.nodeId],
      },
    });

    if (prevNodeId) {
      edges.push({
        id: `edge-${prevNodeId}-${chapterNodeId}`,
        source: prevNodeId,
        target: chapterNodeId,
        type: 'default',
      });
    }

    // 2. 練習題節點
    const exerciseNodeId = `exercise-${Date.now()}-${index}`;
    nodes.push({
      id: exerciseNodeId,
      type: 'exercise',
      position: { x: 200, y: yOffset + 150 },
      data: {
        label: `${weak.nodeName} 練習`,
        content: {
          questionIds: weak.relatedQuestions,
          passingScore: 70,
        },
        completionCriteria: {
          type: 'score',
          threshold: 70,
        },
        isRequired: true,
        aiGenerated: true,
        knowledgeNodeIds: [weak.nodeId],
      },
    });

    edges.push({
      id: `edge-${chapterNodeId}-${exerciseNodeId}`,
      source: chapterNodeId,
      target: exerciseNodeId,
      type: 'default',
    });

    // 3. 選修：AI 家教節點
    const aiTutorNodeId = `ai-tutor-${Date.now()}-${index}`;
    nodes.push({
      id: aiTutorNodeId,
      type: 'ai_tutor',
      position: { x: 450, y: yOffset + 150 },
      data: {
        label: `AI 輔導：${weak.nodeName}`,
        content: {
          aiPrompt: `請協助學生理解「${weak.nodeName}」的概念`,
          focusTopics: [weak.nodeName],
        },
        isRequired: false,
        aiGenerated: true,
      },
    });

    edges.push({
      id: `edge-${chapterNodeId}-${aiTutorNodeId}`,
      source: chapterNodeId,
      target: aiTutorNodeId,
      type: 'optional',
      data: {
        label: '選修',
        style: {
          strokeDasharray: '5,5',
          stroke: '#9ca3af',
        },
      },
    });

    prevNodeId = exerciseNodeId;
    yOffset += 300;
  });

  // 4. 最終綜合測驗節點
  const finalQuizId = `quiz-${Date.now()}`;
  nodes.push({
    id: finalQuizId,
    type: 'quiz',
    position: { x: 200, y: yOffset },
    data: {
      label: '綜合測驗',
      description: '驗收學習成果',
      content: {
        passingScore: 80,
      },
      completionCriteria: {
        type: 'score',
        threshold: 80,
      },
      isRequired: true,
      aiGenerated: true,
    },
  });

  if (prevNodeId) {
    edges.push({
      id: `edge-${prevNodeId}-${finalQuizId}`,
      source: prevNodeId,
      target: finalQuizId,
      type: 'default',
    });
  }

  // AI 推薦摘要
  const recommendation = {
    summary: `針對 ${record.studentName} 的學習弱點（${weakNodes.map((w) => w.nodeName).join('、')}），建議進行系統性複習與練習。`,
    focusAreas: weakNodes.map((w) => w.nodeName),
    estimatedDuration: nodes.length * 15,
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
