# AI 驅動學習流程編排系統 - 實作計劃

## 📊 實作進度總覽

**最後更新**：2025-12-20

### 階段完成狀況

| Phase | 狀態 | 完成度 | 說明 |
|-------|------|--------|------|
| Phase 1 | ✅ 完成 | 100% | 基礎架構與 Mock 資料 |
| Phase 2 | ✅ 完成 | 100% | React Flow 整合 - 全部節點/邊已完成 |
| Phase 3 | ✅ 完成 | 100% | Dashboard 整合與 AI 推薦 |
| Phase 4 | ✅ 完成 | 100% | 節點編輯、儲存、Undo/Redo、快捷鍵 |
| Phase 5 | ⏳ 待開始 | 0% | 進階功能與優化 |

### Phase 1 ✅ 完成檔案清單

1. ✅ `src/types/learning-path.ts` (282 行) - 完整型別系統
2. ✅ `src/context/LearningPathContext.tsx` (479 行) - Context + Reducer (13 種 Actions)
3. ✅ `src/services/ai/learningPathService.ts` (222 行) - AI Mock 服務
4. ✅ `src/mocks/learningPathMocks.ts` (501 行) - 3 位學生 Mock 資料
5. ✅ `src/types/index.ts` - 匯出新型別
6. ✅ `src/context/IndexContext.tsx` - 整合 LearningPathProvider
7. ✅ `src/components/features/learning-path/LearningPathTest.tsx` - 測試組件
8. ✅ `src/App.tsx` - 整合測試組件

**驗證結果**：
- ✅ TypeScript 編譯無錯誤
- ✅ Context dispatch 正常運作
- ✅ Mock AI 分析回傳正確結構
- ✅ 測試組件成功顯示 Context 狀態

### Phase 2 ✅ 完成檔案清單

**已完成**：
1. ✅ React Flow 安裝 (`@xyflow/react` v12)
2. ✅ `src/components/features/learning-path/WorkflowEditor.tsx` - 流程編輯器
3. ✅ `src/components/features/learning-path/NodePalette.tsx` - 節點拖曳面板
4. ✅ `src/components/features/learning-path/nodes/BaseNodeWrapper.tsx` - 節點基礎包裝器
5. ✅ `src/components/features/learning-path/nodes/ChapterNode.tsx` - 章節節點
6. ✅ `src/components/features/learning-path/nodes/ExerciseNode.tsx` - 練習題節點
7. ✅ `src/components/features/learning-path/nodes/VideoNode.tsx` - 影片節點
8. ✅ `src/components/features/learning-path/nodes/AITutorNode.tsx` - AI 家教節點
9. ✅ `src/components/features/learning-path/nodes/QuizNode.tsx` - 測驗節點
10. ✅ `src/components/features/learning-path/nodes/CollaborationNode.tsx` - 協作節點
11. ✅ `src/components/features/learning-path/edges/OptionalEdge.tsx` - 選修邊
12. ✅ `src/components/features/learning-path/edges/ConditionalEdge.tsx` - 條件邊
13. ✅ `src/utils/layout.ts` - Dagre 自動佈局工具

**驗證標準進度**：
- ✅ 可從 NodePalette 拖曳新增節點
- ✅ 可連接節點建立邊
- ✅ 可刪除節點和邊
- ✅ 節點狀態正確反映在樣式上
- ✅ 自動佈局功能正常運作

### Phase 3 ✅ 完成檔案清單

**已完成**：
1. ✅ `src/components/features/dashboard/LearningPathTab.tsx` - Dashboard AI 學習路徑分頁
2. ✅ `src/components/features/Dashboard.tsx` - 已整合「AI 學習路徑」Tab

**驗證標準進度**：
- ✅ 點擊「AI 分析」正確生成流程圖
- ✅ AI 推薦面板顯示正確
- ✅ 學生清單與選擇功能正常

### Phase 4 ✅ 完成檔案清單

**已完成**：
1. ✅ `src/components/features/learning-path/NodeDetailModal.tsx` - 節點屬性編輯面板
2. ✅ `src/hooks/useLearningPathActions.ts` - 學習路徑操作 Hook
3. ✅ `src/utils/learningPathStorage.ts` - LocalStorage 儲存
4. ✅ Undo/Redo 復原重做功能
5. ✅ 手動儲存功能（儲存至 LocalStorage）
6. ✅ 自動儲存功能（Debounce 2 秒）
7. ✅ 鍵盤快捷鍵（Ctrl+Z/Y/S）

### Bug 修復記錄

- ✅ 2025-12-20: 修復「清空畫布」未同步 Context 的問題
- ✅ 2025-12-20: 修復 AI 推薦路徑連續按多次產生無數節點問題
- ✅ 2025-12-20: 修復 Undo/Redo 不更新 UI 的問題（使用展開運算符創建新陣列）

### 內容更新記錄

- ✅ 2025-12-20: 將所有生物內容替換為數學內容（一元二次方程式、判別式、二次函數等）
- ✅ 2025-12-20: 修改 Workflow 排版方向為水平（左→右）
- ✅ 2025-12-20: 移除學生選擇功能，改為全班共用路徑

---

## 課堂流程工作流架構設計 (未來規劃)

### 核心模組

| 模組 | 工具/AI | 說明 |
|------|---------|------|
| **課程教材** | AI Agent | 內容生成、教材檢測 |
| **教學** | 識別 AI + GeoGebra | 行為識別 + 數學互動 |
| **學習分析** | LA AI | Learning Analytics |
| **儀表板** | Dashboard | 數據視覺化、進度追蹤 |
| **評估 SRL** | MSRL AI | 自主學習評估 |

### 與現有系統整合

| 現有元件 | 對應模組 |
|----------|----------|
| `Dashboard.tsx` | 儀表板模組 |
| `WorkflowEditor` | 工作流編輯器 |
| 學習路徑節點 | 各模組內部元件 |

### 實作路線

- **Phase A**: 模組節點 UI (1 週) - 建立 ModuleNode 自定義節點
- **Phase B**: 工作流連接 (1 週) - 模組間連接邏輯
- **Phase C**: AI 整合 (依模組) - 各模組 AI 服務對接

---

## 專案概述

為 Interactive Textbook Editor 新增「AI 驅動學習流程編排系統」，讓教師能夠：
1. 針對任何學生手動觸發 AI 分析
2. AI 根據學生作答記錄推薦個性化學習路徑
3. 使用類似 n8n 的視覺化流程圖編輯學習路徑
4. 每位學生擁有獨立的學習路徑
5. 支援多種學習節點類型（章節、練習、影片、協作、AI 輔導等）

---

## 技術選型決策

### ✅ 推薦方案：React Flow (@xyflow/react v12)

**決策理由**：
- **開發效率**：2-4 週 vs 自建需 6-8 週
- **功能完整**：內建虛擬化、邊重新連接、連接點系統
- **可維護性**：活躍社群、完整 TypeScript 支援
- **擴展性**：支援自定義節點/邊、節點嵌套、自動佈局

**Trade-offs**：
| 維度 | React Flow | 擴展現有系統 |
|------|-----------|------------|
| 依賴大小 | +200KB (gzipped ~50KB) | 0 |
| 開發時間 | 2-4 週 | 6-8 週 |
| 功能完整性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 長期維護 | 社群支援 | 自行維護 |

---

## 核心資料結構設計

### 1. 學習路徑節點類型

```typescript
// src/types/learning-path.ts

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

export interface LearningPathNode {
  id: string;
  type: LearningNodeType;
  position: { x: number; y: number };

  data: {
    label: string;
    description?: string;
    content?: any;  // 根據類型有不同結構
    completionCriteria?: {
      type: 'time' | 'score' | 'manual';
      threshold?: number;
    };
    status?: 'pending' | 'in_progress' | 'completed' | 'failed';
    aiGenerated?: boolean;
    isRequired?: boolean;
    knowledgeNodeIds?: string[];
  };
}

export interface LearningPathEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'conditional' | 'optional';
  data?: {
    condition?: any;
    label?: string;
    style?: any;
  };
}

export interface StudentLearningPath {
  id: string;
  studentId: string;
  studentName: string;
  nodes: LearningPathNode[];
  edges: LearningPathEdge[];
  viewport: { x: number; y: number; zoom: number };
  createdAt: number;
  createdBy: string;
  lastModified: number;
  aiRecommendation?: {
    summary: string;
    focusAreas: string[];
    estimatedDuration: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  progress: {
    totalNodes: number;
    completedNodes: number;
    currentNodeId?: string;
  };
}
```

### 2. 學生作答記錄

```typescript
export interface StudentAnswer {
  id: string;
  studentId: string;
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  score: number;
  timeSpent: number;
  knowledgeNodeIds: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  answeredAt: number;
  attemptCount: number;
}

export interface StudentLearningRecord {
  studentId: string;
  studentName: string;
  answers: StudentAnswer[];
  totalQuestions: number;
  correctCount: number;
  averageScore: number;
  weakKnowledgeNodes: Array<{
    nodeId: string;
    nodeName: string;
    errorRate: number;
    relatedQuestions: string[];
  }>;
  lastUpdated: number;
}
```

---

## Context 架構擴展

### 新增 LearningPathContext

**檔案位置**：`src/context/LearningPathContext.tsx`

**職責分離理由**：
- 學習路徑管理與編輯器狀態、內容狀態不同
- 獨立 Context 更容易測試與擴展
- 不影響現有穩定的 EditorContext 和 ContentContext

**State 結構**：
```typescript
interface LearningPathState {
  studentPaths: Map<string, StudentLearningPath>;
  currentStudentId: string | null;
  learningRecords: Map<string, StudentLearningRecord>;
  isEditorOpen: boolean;
  isGenerating: boolean;
  nodeTemplates: Array<{
    type: LearningNodeType;
    label: string;
    icon: string;
    defaultData: any;
  }>;
}
```

**主要 Actions**：
- `CREATE_PATH` - 建立新學習路徑
- `ADD_NODE` / `UPDATE_NODE` / `DELETE_NODE` - 節點 CRUD
- `ADD_EDGE` / `DELETE_EDGE` - 邊管理
- `UPDATE_PROGRESS` - 更新學生進度
- `SET_AI_RECOMMENDATION` - 儲存 AI 推薦
- `OPEN_EDITOR` / `CLOSE_EDITOR` - 編輯器狀態

---

## 組件架構設計

### 組件樹結構

```
LearningPathWorkflow (容器)
├── WorkflowToolbar
│   ├── NodePalette (拖曳節點選擇)
│   ├── AIAnalyzeButton
│   └── SaveButton
│
├── WorkflowEditor (React Flow)
│   ├── CustomNodes
│   │   ├── ChapterNode
│   │   ├── ExerciseNode
│   │   ├── VideoNode
│   │   ├── CollaborationNode
│   │   ├── AITutorNode
│   │   └── QuizNode
│   │
│   ├── CustomEdges
│   │   ├── DefaultEdge
│   │   ├── ConditionalEdge
│   │   └── OptionalEdge
│   │
│   └── Controls (React Flow 內建)
│
└── WorkflowSidebar
    ├── StudentInfo
    ├── AIRecommendationPanel
    ├── ProgressTracker
    └── NodePropertiesPanel
```

### 自定義節點範例 (ChapterNode)

**檔案位置**：`src/components/features/learning-path/nodes/ChapterNode.tsx`

**設計規範**：
- 使用 React Flow Handle 作為連接點
- 根據 `status` 顯示不同樣式（pending/completed）
- 顯示 AI 推薦標記
- 支援選中高亮

---

## AI 服務擴展

### 新增 learningPathService.ts

**檔案位置**：`src/services/ai/learningPathService.ts`

**核心函數**：

```typescript
/**
 * AI 分析學生作答記錄，生成學習路徑推薦
 */
async function analyzeStudentAndGeneratePath(
  record: StudentLearningRecord
): Promise<{
  nodes: LearningPathNode[];
  edges: LearningPathEdge[];
  recommendation: StudentLearningPath['aiRecommendation'];
}>
```

**AI 推薦邏輯**（Mock 實作）：
1. 分析 `weakKnowledgeNodes` 取前 3 個弱點
2. 為每個弱點生成：
   - 章節複習節點
   - 練習題節點
   - 選修 AI 家教節點
3. 最後加入綜合測驗節點
4. 自動連接邊，選修路徑使用虛線

**真實資料整合點**：
- 從 `knowledgeNodeIds` 取得真實知識節點資料
- 使用 `generateContentForKnowledgeNode()` 動態生成補充內容

---

## UI/UX 流程設計

### 1. 觸發方式：Dashboard Tab 整合

在 `Dashboard.tsx` 新增第 5 個 Tab：「AI 學習路徑」

**LearningPathTab 組件流程**：
```
顯示學生清單
  ↓ 點擊「AI 分析路徑」按鈕
  ↓ SET_GENERATING(true)
  ↓ 載入學生作答記錄
  ↓ AI 分析 (analyzeStudentAndGeneratePath)
  ↓ CREATE_PATH + 批次 ADD_NODE + ADD_EDGE
  ↓ SET_GENERATING(false)
  ↓ OPEN_EDITOR (全螢幕 Modal)
```

### 2. 流程圖呈現：全螢幕 Modal

使用現有的 `Modal` 組件，設定 `size="fullscreen"`：
- 優點：足夠編輯空間，不干擾主畫布
- 內嵌 `LearningPathWorkflow` 組件

### 3. 教師編輯流程

1. **新增節點**：從 NodePalette 拖曳到畫布
2. **連接節點**：拖曳 Handle 建立邊
3. **編輯屬性**：點擊節點，在 Sidebar 編輯
4. **刪除**：選中後按 Delete 鍵
5. **儲存**：點擊儲存按鈕，更新 Context

### 4. 進度追蹤

在 WorkflowSidebar 顯示：
- 總節點數 / 已完成節點數
- 進度條
- 當前節點
- 預估剩餘時間

---

## 實作步驟 (分 5 個 Phase)

### Phase 1: 基礎架構與 Mock 資料 (第 1-2 週)

**新增檔案**：
1. `src/types/learning-path.ts` - 型別定義
2. `src/context/LearningPathContext.tsx` - Context & Reducer
3. `src/services/ai/learningPathService.ts` - AI Mock 服務
4. `src/mocks/learningPathMocks.ts` - Mock 學生資料

**修改檔案**：
5. `src/types/index.ts` - 匯出新型別
6. `src/App.tsx` - 新增 LearningPathProvider

**驗證標準**：
- ✅ 型別定義無 TypeScript 錯誤
- ✅ Context dispatch 正常運作
- ✅ Mock AI 分析回傳正確結構

---

### Phase 2: React Flow 整合與核心組件 (第 3-4 週)

**安裝依賴**：
```bash
npm install @xyflow/react
```

**新增檔案**：
7. `src/components/features/learning-path/LearningPathWorkflow.tsx`
8. `src/components/features/learning-path/WorkflowEditor.tsx`
9. `src/components/features/learning-path/NodePalette.tsx`
10. `src/components/features/learning-path/WorkflowSidebar.tsx`
11-16. `src/components/features/learning-path/nodes/*.tsx` (6 種節點)
17-19. `src/components/features/learning-path/edges/*.tsx` (3 種邊)

**實作步驟**：
1. 實作基礎 WorkflowEditor（顯示節點和邊）
2. 實作 6 種自定義節點（統一樣式）
3. 實作 NodePalette（拖曳新增）
4. 整合 LearningPathContext
5. 實作節點/邊刪除功能

**驗證標準**：
- ✅ 可從 NodePalette 拖曳新增節點
- ✅ 可連接節點建立邊
- ✅ 可刪除節點和邊
- ✅ 節點狀態正確反映在樣式上

---

### Phase 3: Dashboard 整合與 AI 推薦 (第 5-6 週)

**新增檔案**：
20. `src/components/features/dashboard/LearningPathTab.tsx`
21. `src/components/features/learning-path/AIRecommendationPanel.tsx`
22. `src/components/features/learning-path/ProgressTracker.tsx`

**修改檔案**：
23. `src/components/features/Dashboard.tsx` - 新增 Tab

**實作步驟**：
1. Dashboard 新增「AI 學習路徑」Tab
2. 實作學生清單 + AI 分析按鈕
3. 實作 AI 分析流程（Loading → 生成 → 開啟編輯器）
4. 實作 AIRecommendationPanel（弱點分析、推薦摘要）
5. 實作 ProgressTracker（進度條、統計）

**驗證標準**：
- ✅ 點擊「AI 分析」正確生成流程圖
- ✅ AI 推薦面板顯示正確
- ✅ 進度追蹤正確計算

---

### Phase 4: 節點編輯與儲存 (第 7-8 週)

**新增檔案**：
24. `src/components/features/learning-path/NodePropertiesPanel.tsx`
25. `src/hooks/useLearningPathActions.ts`
26. `src/utils/learningPathStorage.ts`

**實作步驟**：
1. 實作 NodePropertiesPanel（根據節點類型顯示表單）
2. 實作節點屬性即時更新
3. 實作 WorkflowToolbar（儲存、匯出、復原/重做）
4. 實作 LocalStorage 儲存（自動 + 手動）
5. 實作載入已儲存路徑

**驗證標準**：
- ✅ 點擊節點顯示屬性面板
- ✅ 編輯屬性即時更新畫布
- ✅ 重新整理後可載入之前路徑

---

### Phase 5: 進階功能與優化 (第 9-10 週)

**新增檔案**：
27. `src/components/features/learning-path/PathTemplateLibrary.tsx`
28. `src/components/features/learning-path/StudentProgressView.tsx`

**實作步驟**：
1. 路徑模板功能（教師儲存常用路徑）
2. 學生端進度視圖（只讀模式）
3. 條件式邊（根據分數自動跳轉）
4. 效能優化（React.memo、虛擬化）
5. 鍵盤快捷鍵（Ctrl+S、Ctrl+Z）
6. 匯出功能（PDF、PNG、JSON）

**驗證標準**：
- ✅ 路徑模板可正確套用
- ✅ 學生端可查看進度
- ✅ 大型流程圖（50+ 節點）流暢運作

---

## 與現有系統整合點

### 1. Dashboard 整合
- **檔案**：`src/components/features/Dashboard.tsx`
- **方式**：新增 `learning-path` Tab + `LearningPathTab` 組件

### 2. AI 服務整合
- **檔案**：`src/services/ai/mockLLMService.ts`（擴充）
- **檔案**：`src/services/ai/learningPathService.ts`（新增）
- **方式**：使用現有 AI 模擬模式

### 3. 學生資料整合
- **檔案**：`src/mocks/dashboardMocks.ts`（擴充）
- **方式**：為現有學生建立 StudentLearningRecord

### 4. Context 整合
- **檔案**：`src/App.tsx`
- **方式**：在 Provider 樹新增 LearningPathProvider

```typescript
<EditorProvider>
  <ContentProvider>
    <UIProvider>
      <CollaborationProvider>
        <LearningPathProvider>  {/* 新增 */}
          {/* 現有組件 */}
        </LearningPathProvider>
      </CollaborationProvider>
    </UIProvider>
  </ContentProvider>
</EditorProvider>
```

### 5. 知識節點整合（未來）
- **方式**：從 `ContentContext.epubChapters` 提取知識節點
- **工具**：建立 `knowledgeNodeExtractor.ts`

---

## 關鍵檔案清單

**實作此系統最關鍵的 5 個檔案**：

1. **`src/context/LearningPathContext.tsx`**
   - 核心狀態管理，所有組件依賴此 Context
   - 定義 Reducer Actions 與 State 結構

2. **`src/components/features/learning-path/WorkflowEditor.tsx`**
   - React Flow 核心編輯器
   - 整合自定義節點/邊、拖曳邏輯、事件處理

3. **`src/services/ai/learningPathService.ts`**
   - AI 分析與路徑生成邏輯
   - Mock 實作與未來接真實 LLM 的介面

4. **`src/types/index.ts`**
   - 擴充完整型別定義
   - TypeScript 型別是系統的設計契約

5. **`src/components/features/dashboard/LearningPathTab.tsx`**
   - 使用者入口點
   - 連接 Dashboard 與學習路徑系統的橋樑

---

## 技術風險與緩解策略

### 風險 1: React Flow 學習曲線
**緩解**：
- 參考官方 Custom Nodes 範例
- 先實作 ChapterNode，確立模式後複製

### 風險 2: Mock 資料與真實資料差異
**緩解**：
- 定義清楚介面（StudentLearningRecord、KnowledgeNode）
- TypeScript 強型別確保結構一致
- 預留 `knowledgeNodeIds` 欄位

### 風險 3: 效能問題（大型流程圖）
**緩解**：
- React Flow 內建虛擬化
- 使用 React.memo 包裹自定義節點
- 限制初始生成節點數量（≤ 15 個）

### 風險 4: 學生進度追蹤實作複雜
**緩解**：
- Phase 1-3 聚焦教師端編輯功能
- Phase 5 才實作學生端進度視圖
- 使用簡單 `status` 欄位

---

## 總結

此計劃提供完整的「AI 驅動學習流程編排系統」實作路徑：

1. **技術選型**：React Flow - 平衡開發效率與功能完整性
2. **資料結構**：清晰型別系統，支援多種學習節點與條件式路徑
3. **架構設計**：獨立 LearningPathContext，保持關注點分離
4. **組件設計**：模組化組件樹，6 種節點 + 可擴展邊類型
5. **實作步驟**：分 5 個 Phase，每階段有明確驗證標準
6. **整合方案**：與現有 Dashboard、AI 服務、Context 無縫整合

**預估總開發時間**：8-10 週
**核心價值**：個性化學習路徑推薦，視覺化學習流程管理

