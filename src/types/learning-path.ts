/**
 * 學習路徑系統型別定義
 * AI 驅動的個性化學習流程編排
 */

// ==================== 學習節點類型 ====================

/**
 * 學習路徑節點類型
 */
export type LearningNodeType =
  | 'chapter'        // 章節閱讀
  | 'exercise'       // 練習題
  | 'video'          // 影片教材
  | 'collaboration'  // 小組討論
  | 'ai_tutor'       // AI 家教
  | 'quiz'           // 測驗
  | 'review'         // 複習
  | 'project'        // 專題
  | 'custom';        // 自定義內容

/**
 * 節點完成條件類型
 */
export type CompletionCriteriaType = 'time' | 'score' | 'manual';

/**
 * 節點狀態
 */
export type NodeStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/**
 * 學習路徑節點 - 使用 React Flow Node 格式
 */
export interface LearningPathNode {
  id: string;
  type: LearningNodeType;
  position: { x: number; y: number };

  data: {
    label: string;
    description?: string;

    // 不同類型的專屬資料
    content?: {
      // chapter
      chapterId?: string;
      chapterTitle?: string;

      // exercise / quiz
      questionIds?: string[];
      passingScore?: number;

      // video
      videoUrl?: string;
      videoDuration?: number;

      // collaboration
      groupSize?: number;
      discussionTopic?: string;

      // ai_tutor
      aiPrompt?: string;
      focusTopics?: string[];

      // custom
      customContent?: unknown;
    };

    // 完成條件
    completionCriteria?: {
      type: CompletionCriteriaType;
      threshold?: number;  // 分鐘數或分數
    };

    // 節點狀態
    status?: NodeStatus;
    aiGenerated?: boolean;  // 是否為 AI 推薦
    isRequired?: boolean;   // 是否必修

    // 關聯知識節點
    knowledgeNodeIds?: string[];
  };
}

// ==================== 學習路徑邊 ====================

/**
 * 邊的類型
 */
export type EdgeType = 'default' | 'conditional' | 'optional';

/**
 * 條件運算子
 */
export type ConditionOperator = '>' | '<' | '=' | '>=' | '<=';

/**
 * 條件類型
 */
export type ConditionType = 'score' | 'time' | 'answer';

/**
 * 學習路徑邊 - 使用 React Flow Edge 格式
 */
export interface LearningPathEdge {
  id: string;
  source: string;      // 來源節點 ID
  target: string;      // 目標節點 ID
  type?: EdgeType;

  // 條件式路徑
  data?: {
    condition?: {
      type: ConditionType;
      operator: ConditionOperator;
      value: number | string;
    };
    label?: string;

    // 樣式
    style?: {
      stroke?: string;
      strokeWidth?: number;
      strokeDasharray?: string;  // 虛線表示選修
    };
  };
}

// ==================== 學生學習路徑 ====================

/**
 * AI 推薦摘要
 */
export interface AIRecommendation {
  summary: string;
  focusAreas: string[];
  estimatedDuration: number;  // 預估完成時間（分鐘）
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * 學習進度
 */
export interface LearningProgress {
  totalNodes: number;
  completedNodes: number;
  currentNodeId?: string;
  startedAt?: number;
  completedAt?: number;
}

/**
 * 完整的學生學習路徑
 */
export interface StudentLearningPath {
  id: string;
  studentId: string;
  studentName: string;

  // 流程圖資料
  nodes: LearningPathNode[];
  edges: LearningPathEdge[];

  // React Flow viewport 狀態
  viewport: { x: number; y: number; zoom: number };

  // 後設資料
  createdAt: number;
  createdBy: string;          // 教師 ID
  lastModified: number;
  aiAnalysisVersion?: string; // AI 分析版本

  // AI 推薦摘要
  aiRecommendation?: AIRecommendation;

  // 進度追蹤
  progress: LearningProgress;
}

// ==================== 學生作答記錄 ====================

/**
 * 題目難度
 */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

/**
 * 學生作答記錄 - 用於 AI 分析學習弱點
 */
export interface StudentAnswer {
  id: string;
  studentId: string;
  questionId: string;

  // 作答內容
  answer: string | string[];       // 單選/多選/簡答
  isCorrect: boolean;
  score: number;                   // 0-100
  timeSpent: number;               // 秒數

  // 知識追蹤
  knowledgeNodeIds: string[];      // 關聯的知識節點
  difficulty: QuestionDifficulty;

  // 後設資料
  answeredAt: number;              // timestamp
  attemptCount: number;            // 第幾次作答
}

/**
 * 知識節點弱點分析
 */
export interface WeakKnowledgeNode {
  nodeId: string;
  nodeName: string;
  errorRate: number;               // 0-1
  relatedQuestions: string[];
}

/**
 * 學生學習記錄彙整
 */
export interface StudentLearningRecord {
  studentId: string;
  studentName: string;

  // 作答記錄
  answers: StudentAnswer[];

  // 統計資料
  totalQuestions: number;
  correctCount: number;
  averageScore: number;
  averageTimeSpent: number;

  // 弱點分析（由 AI 生成）
  weakKnowledgeNodes: WeakKnowledgeNode[];

  // 最後更新
  lastUpdated: number;
}

// ==================== 知識節點 ====================

/**
 * 知識節點 - 對應教材的知識點
 */
export interface KnowledgeNode {
  id: string;
  name: string;
  description?: string;

  // 知識圖譜
  parentNodeId?: string;
  childNodeIds: string[];
  relatedNodeIds: string[];  // 相關概念

  // 關聯資源
  chapterIds: string[];      // 對應章節
  questionIds: string[];     // 相關題目
  videoIds: string[];        // 教學影片

  // 難度與重要性
  difficulty: QuestionDifficulty;
  importance: number;        // 1-10

  // 標籤
  tags: string[];
}

// ==================== 節點模板 ====================

/**
 * 節點模板 - 用於節點選擇面板
 */
export interface NodeTemplate {
  type: LearningNodeType;
  label: string;
  icon: string;  // Lucide icon 名稱
  defaultData: Partial<LearningPathNode['data']>;
}
