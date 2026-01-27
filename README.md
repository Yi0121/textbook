# Interactive Textbook Editor 互動式教科書編輯器

現代化互動式教科書編輯平台，結合 AI Agent 系統、協作白板與豐富課堂工具，專為教師與學生打造。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)

---

## ✨ 功能特色

### 📚 教科書編輯
- **EPUB 匯入**：匯入 EPUB 格式教科書，自動解析章節結構
- **富文本編輯**：基於 Tiptap 的所見即所得編輯器
- **畫布繪圖**：畫筆、螢光筆、橡皮擦等繪圖工具
- **心智圖**：拖曳式心智圖元件，整理知識結構

### 🤖 AI Agent 系統
- **多 Agent 協作**：教師、學生、分析三類 Agent 協同工作
- **Orchestrator 架構**：統一路由與管理所有 Agent
- **Tool 擴展**：每個 Agent 可定義多個 Tools，支援 Mock 與真實實作

### 🛤️ AI 學習路徑系統
- **視覺化編輯**：基於 React Flow 的拖曳式流程編輯器
- **6 種節點類型**：章節、練習、影片、測驗、AI 家教、協作
- **AI 推薦**：根據學生作答記錄自動生成個人化學習路徑
- **自動佈局**：Dagre 演算法自動排列節點
- **Undo/Redo**：完整的復原/重做功能

### 👥 協作功能
- **電子白板**：即時協作白板
- **角色切換**：教師/學生雙模式
- **課堂工具**：計時器、抽籤、儀表板

---

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  Pages (21) │ Components (130+) │ Hooks (24+)               │
├─────────────────────────────────────────────────────────────┤
│                     State Layer                             │
│  AgentContext │ EditorContext │ ContentContext │ UIContext  │
│  CollaborationContext │ LearningPathContext │ Zustand       │
├─────────────────────────────────────────────────────────────┤
│                    Agent Layer                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Orchestrator                       │    │
│  │  ┌─────────────┬─────────────┬───────────────────┐  │    │
│  │  │ Teacher     │ Student     │ Analytics         │  │    │
│  │  │ Agents (4)  │ Agents (9)  │ Agents (4)        │  │    │
│  │  └─────────────┴─────────────┴───────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                   Service Layer                             │
│  AI Services │ Adapters │ Repositories │ Mock Data          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置專案
npm run build

# 程式碼檢查
npm run lint

# 執行測試
npm run test
```

---

## 📁 專案結構

```
textbook/
├── src/
│   ├── agents/                    # AI Agent 系統
│   │   ├── BaseAgent.ts           # Agent 抽象基類
│   │   ├── Orchestrator.ts        # Agent 總控服務
│   │   ├── types.ts               # Agent/Tool 型別定義
│   │   ├── teacher/               # 教師模組 (4 Agents)
│   │   │   ├── LessonPlannerAgent.ts        # 課程規劃
│   │   │   ├── ContentGeneratorAgent.ts     # 內容生成
│   │   │   ├── GroupingAgent.ts             # 分組策略
│   │   │   └── MathFlexibleThinkingAgent.ts # 數學思維引導
│   │   ├── student/               # 學生模組 (9 Agents)
│   │   │   ├── ScaffoldingAgent.ts          # 鷹架輔助
│   │   │   ├── RealtimeHintAgent.ts         # 即時提示
│   │   │   ├── CPSAgent.ts                  # 協作問題解決
│   │   │   ├── SRLAgent.ts                  # 自主學習調控
│   │   │   ├── GraderAgent.ts               # 評分
│   │   │   ├── APOSConstructionAgent.ts     # APOS 建構
│   │   │   ├── PeerFacilitatorAgent.ts      # 同儕引導
│   │   │   ├── LearningObserverAgent.ts     # 學習觀察
│   │   │   └── TechnicalSupportAgent.ts     # 技術支援
│   │   ├── analytics/             # 分析模組 (4 Agents)
│   │   │   ├── AnalystAgents.ts             # 分析引擎
│   │   │   ├── DashboardAgent.ts            # 儀表板資料
│   │   │   ├── DataStewardAgent.ts          # 資料管理
│   │   │   └── SynthesisAgent.ts            # 綜合報告
│   │   └── mcp/                   # MCP 協議擴展
│   │
│   ├── components/                # React 元件
│   │   ├── index.ts               # Barrel Export
│   │   ├── common/                # 共用元件
│   │   │   └── AIAssistantModal, canvas, chat, etc.
│   │   ├── collaboration/         # 協作元件 (Whiteboard)
│   │   ├── features/              # 功能模組
│   │   │   ├── lesson-prep/       # 課程編輯器 (12 組件)
│   │   │   ├── quiz/              # 測驗系統 (6 組件)
│   │   │   ├── ChapterNavigator.tsx
│   │   │   └── EPUBImporter.tsx
│   │   ├── layout/                # 佈局元件
│   │   │   ├── AppLayout.tsx      # 主佈局容器
│   │   │   ├── AppSidebar.tsx     # 側邊導航
│   │   │   └── Navigation.tsx
│   │   ├── panels/                # 側邊面板
│   │   ├── student/               # 學生視角元件
│   │   │   ├── learning-path/     # 學習路徑 (17 組件)
│   │   │   ├── cps/               # CPS 協作介面
│   │   │   ├── AdventureMap.tsx   # 冒險地圖
│   │   │   └── LessonTaskGrid.tsx
│   │   ├── teacher/               # 教師視角元件
│   │   │   ├── analytics/         # 數據分析 (8 組件)
│   │   │   ├── dashboard/         # 儀表板 (7 組件)
│   │   │   ├── classroom/         # 課堂管理
│   │   │   ├── TeacherAgentPanel.tsx
│   │   │   └── LessonNode.tsx
│   │   ├── tools/                 # 工具列 (8 組件)
│   │   └── ui/                    # 通用 UI (24 組件)
│   │       ├── Modal.tsx, Button.tsx, Progress.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── context/                   # React Context (8 個)
│   │   ├── AgentContext.tsx       # AI Agent 狀態
│   │   ├── AIChatContext.tsx      # AI 對話狀態
│   │   ├── CollaborationContext.tsx
│   │   ├── ContentContext.tsx     # 教科書內容
│   │   ├── EditorContext.tsx      # 編輯器狀態
│   │   ├── LearningPathContext.tsx
│   │   ├── UIContext.tsx          # UI 狀態（側邊欄、Modal）
│   │   └── IndexContext.tsx
│   │
│   ├── hooks/                     # 自訂 Hooks (24+)
│   │   ├── index.ts               # Barrel Export
│   │   ├── ai/                    # AI 相關 (6 hooks)
│   │   ├── canvas/                # Canvas 繪圖 (3 hooks)
│   │   ├── common/                # 通用功能 (6 hooks)
│   │   ├── data/                  # 資料操作 (7 hooks)
│   │   └── lesson/                # 課程相關 (2 hooks)
│   │
│   ├── pages/                     # 頁面元件 (21 頁)
│   │   ├── HomePage.tsx                     # 首頁儀表板
│   │   │
│   │   ├── # ===== 教師端 (Teacher) =====
│   │   ├── TeacherClassroomPage.tsx         # 課堂管理
│   │   ├── TeacherLessonPrepPage.tsx        # 備課介面
│   │   ├── TeacherLessonChatPage.tsx        # 對話式備課
│   │   ├── TeacherLessonFlowPage.tsx        # 課程流程編輯（全螢幕）
│   │   ├── TeacherLessonProgressPage.tsx    # 課程進度監控
│   │   ├── TeacherAssignmentPage.tsx        # 作業管理
│   │   ├── TeacherClassAnalyticsPage.tsx    # 班級分析
│   │   ├── TeacherClassSetupPage.tsx        # 班級設定
│   │   ├── TeacherStudentOverviewPage.tsx   # 學生總覽
│   │   ├── TeacherGroupMonitorPage.tsx      # 分組監控
│   │   ├── TeacherDivisionExplorationPage.tsx # 除法探究
│   │   ├── TeachingSuggestionsPage.tsx      # 教學建議
│   │   │
│   │   ├── # ===== 學生端 (Student) =====
│   │   ├── StudentAnalyticsPage.tsx         # 個人學習分析
│   │   ├── StudentLearningPathPage.tsx      # 個人學習路徑
│   │   ├── StudentConversationsPage.tsx     # AI 對話紀錄
│   │   ├── StudentSuggestionsPage.tsx       # 學習建議
│   │   ├── StudentQuizPage.tsx              # 測驗作答
│   │   ├── CPSStudentView.tsx               # CPS 協作視圖
│   │   │
│   │   ├── AnalyticsDashboard.tsx           # 分析儀表板
│   │   ├── ComingSoonPage.tsx               # 即將推出
│   │   │
│   │   ├── assignment/                      # 作業頁面子組件
│   │   ├── division-exploration/            # 除法探究子頁面
│   │   └── learning-path/                   # 學習路徑子組件
│   │
│   ├── services/                  # 服務層
│   │   ├── index.ts               # Barrel Export
│   │   ├── adapters/              # 外部服務適配器
│   │   ├── ai/                    # AI 服務整合
│   │   ├── api/                   # API 客戶端
│   │   └── repositories/          # 資料存取層 (7 repos)
│   │
│   ├── stores/                    # Zustand 狀態管理
│   │   ├── useLearningPathStore.ts         # 學習路徑
│   │   └── useLessonUIStore.ts             # 課程 UI
│   │
│   ├── types/                     # TypeScript 型別 (8 檔)
│   │   ├── agents.ts              # Agent 型別
│   │   ├── canvas.ts              # Canvas 型別
│   │   ├── learning-path.ts       # 學習路徑型別
│   │   ├── lessonPlan.ts          # 課程計畫型別
│   │   ├── studentProgress.ts     # 學生進度型別
│   │   ├── suggestion.ts          # 建議型別
│   │   └── tools.ts               # 工具型別
│   │
│   ├── utils/                     # 工具函式
│   │   ├── index.ts               # Barrel Export
│   │   ├── epubParser.ts          # EPUB 解析
│   │   ├── epubExporter.ts        # EPUB 匯出
│   │   ├── aposConverter.ts       # APOS 轉換
│   │   ├── StorageManager.ts      # 本地儲存
│   │   ├── learningPathStorage.ts # 學習路徑存取
│   │   ├── layout.ts              # 佈局計算
│   │   ├── nodeStyles.ts          # 節點樣式
│   │   ├── progressHelpers.ts     # 進度計算
│   │   └── geometry.ts            # 幾何工具
│   │
│   ├── mocks/                     # Mock 資料 (8 檔)
│   │   ├── analyticsData.ts       # 分析數據
│   │   ├── aposLessonMocks.ts     # APOS 課程
│   │   ├── dashboardMocks.ts      # 儀表板
│   │   ├── learningPathMocks.ts   # 學習路徑
│   │   ├── lessonPlanMocks.ts     # 課程計畫
│   │   └── studentProgressMocks.ts # 學生進度
│   │
│   ├── config/                    # 設定檔
│   │   ├── constants.ts           # 全域常數
│   │   ├── env.ts                 # 環境變數
│   │   ├── queryClient.tsx        # React Query
│   │   ├── toolConfig.ts          # 工具設定
│   │   └── workflowTemplates.ts   # 工作流程模板
│   │
│   ├── router.tsx                 # 路由設定 (React Router)
│   ├── main.tsx                   # 應用程式進入點
│   └── index.css                  # 全域樣式
│
├── public/                        # 靜態資源
├── docs/                          # 文件
├── image/                         # 圖片資源
│
├── # ===== 設定檔 =====
├── package.json                   # 依賴與腳本
├── tsconfig.json                  # TypeScript 設定
├── vite.config.ts                 # Vite 設定
├── vitest.config.ts               # Vitest 測試設定
├── tailwind.config.js             # TailwindCSS 設定
├── postcss.config.js              # PostCSS 設定
├── eslint.config.js               # ESLint 設定
└── .env.example                   # 環境變數範例
```

---

## 🗺️ 路由結構

| 路徑 | 頁面 | 說明 |
|------|------|------|
| `/` | `HomePage` | 首頁儀表板 |
| **教師端** |||
| `/teacher/classroom` | `TeacherClassroomPage` | 課堂管理主頁 |
| `/teacher/lesson-prep` | `TeacherLessonPrepPage` | 備課介面 |
| `/teacher/lesson-prep/chat` | `TeacherLessonChatPage` | 對話式備課（獨立佈局）|
| `/teacher/lesson-prep/preview/:lessonId` | `TeacherLessonFlowPage` | 課程流程編輯（全螢幕）|
| `/teacher/lesson-progress/:lessonId` | `TeacherLessonProgressPage` | 課程進度監控 |
| `/teacher/assignment` | `TeacherAssignmentPage` | 作業管理 |
| `/teacher/class-analytics` | `TeacherClassAnalyticsPage` | 班級數據分析 |
| `/teacher/class-setup` | `TeacherClassSetupPage` | 班級設定 |
| `/teacher/student-overview/:lessonId/:studentId` | `TeacherStudentOverviewPage` | 學生總覽 |
| `/teacher/groups` | `TeacherGroupMonitorPage` | 分組監控 |
| `/teacher/division-exploration` | `TeacherDivisionExplorationPage` | 除法探究 |
| `/teacher/suggestions` | `TeachingSuggestionsPage` | 教學建議 |
| **學生端** |||
| `/student/dashboard` | `StudentAnalyticsPage` | 個人學習分析 |
| `/student/path/:lessonId` | `StudentLearningPathPage` | 個人學習路徑 |
| `/student/conversations` | `StudentConversationsPage` | AI 對話紀錄 |
| `/student/suggestions` | `StudentSuggestionsPage` | 學習建議 |
| `/student/quiz/:assignmentId` | `StudentQuizPage` | 測驗作答 |
| `/student/cps-view` | `CPSStudentView` | CPS 協作視圖（獨立佈局）|
| `/analytics` | `AnalyticsDashboard` | 統一分析入口 |

---

## 🤖 AI Agent 系統

### 架構概覽

```
Orchestrator (路由中心)
    ├── Teacher Agents (教師端)
    │   ├── LessonPlannerAgent      # 課程規劃與備課
    │   ├── ContentGeneratorAgent   # 教材內容生成
    │   ├── GroupingAgent           # 智慧分組策略
    │   └── MathFlexibleThinkingAgent # 數學彈性思維引導
    │
    ├── Student Agents (學生端)
    │   ├── ScaffoldingAgent        # 學習鷹架輔助
    │   ├── RealtimeHintAgent       # 即時提示系統
    │   ├── CPSAgent                # 協作問題解決
    │   ├── SRLAgent                # 自主學習調控
    │   ├── GraderAgent             # 自動評分
    │   ├── APOSConstructionAgent   # APOS 理論建構
    │   ├── PeerFacilitatorAgent    # 同儕學習引導
    │   ├── LearningObserverAgent   # 學習行為觀察
    │   └── TechnicalSupportAgent   # 技術問題支援
    │
    └── Analytics Agents (分析端)
        ├── AnalystAgents           # 數據分析引擎
        ├── DashboardAgent          # 儀表板資料提供
        ├── DataStewardAgent        # 資料品質管理
        └── SynthesisAgent          # 綜合報告生成
```

### 核心類別

- **`BaseAgent`**：所有 Agent 的抽象基類，定義 `think()`、`act()` 流程
- **`Orchestrator`**：統一入口，根據 Intent 路由到對應 Agent
- **`types.ts`**：定義 `AgentConfig`、`Tool`、`AgentResponse` 等型別

---

## ⌨️ 快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `V` | 選取工具 |
| `P` | 畫筆工具 |
| `H` | 螢光筆工具 |
| `E` | 橡皮擦工具 |
| `T` | 文字工具 |
| `G` | 開啟章節導航 |
| `Ctrl + E` | 切換編輯模式 (教師) |
| `Ctrl + K` | 開啟 AI 對話 |
| `Ctrl + Z` | 復原 |
| `Ctrl + Y` | 重做 |
| `Ctrl + S` | 儲存 |
| `Ctrl + 0` | 重置縮放 |
| `?` | 顯示快捷鍵說明 |

---

## 🛠️ 技術棧

| 類別 | 技術 | 用途 |
|-----|------|------|
| **Frontend** | React 19, TypeScript 5.9 | 核心框架 |
| **Build** | Vite (Rolldown) | 高效能打包 |
| **Styling** | TailwindCSS 3.4 | 樣式系統 |
| **State** | React Context + Zustand | 狀態管理 |
| **Data Fetching** | TanStack Query | 資料取得與快取 |
| **Flow Editor** | @xyflow/react | 學習路徑編輯 |
| **Rich Text** | Tiptap | 富文本編輯 |
| **Canvas** | Fabric.js | 畫布繪圖 |
| **Layout** | dagre | 自動佈局演算法 |
| **Animation** | Framer Motion | 動畫效果 |
| **Icons** | lucide-react | 圖示庫 |
| **EPUB** | epubjs | EPUB 解析 |
| **Charts** | Recharts | 資料圖表 |
| **Testing** | Vitest | 單元/整合測試 |

---

## 📦 主要依賴

```json
{
  "react": "^19.2.0",
  "typescript": "~5.9.3",
  "@xyflow/react": "^12.10.0",
  "@tiptap/react": "^3.13.0",
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.90.16",
  "fabric": "^6.9.1",
  "framer-motion": "^12.23.26",
  "react-router-dom": "^7.11.0",
  "recharts": "^3.6.0",
  "epubjs": "^0.3.93"
}
```

---

## 🔧 環境設定

複製 `.env.example` 為 `.env` 並設定：

```bash
# AI 服務設定
VITE_OPENAI_API_KEY=your-api-key
VITE_AI_SERVICE_URL=https://api.example.com

# 功能開關
VITE_ENABLE_MOCK=true
```

---

## 📄 授權

本專案僅供學習與教育用途。
