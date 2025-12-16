# Interactive Textbook Editor - 系統架構優化計畫

## 現況總覽

| 指標 | 數值 | 評估 |
|------|------|------|
| 總代碼行數 | ~2,313 行 | 中型專案 |
| 組件數量 | 22 個 | 適中 |
| Context 數量 | 4 個 | 適中 |
| App.tsx 行數 | ~~621~~ → **535 行** | ⚠️ 仍需優化 |
| 架構評分 | ~~5.4/10~~ → **6.8/10** | 已有改善 |

---

## � 實施進度追蹤

> [!NOTE]
> 本節紀錄 plan.md 各項目的實際完成狀態（更新於 2024-12-16）

### 階段 1: 狀態管理統一

| 項目 | 狀態 | 說明 |
|------|:----:|------|
| 1.1 統一選取狀態 | ✅ 完成 | 已透過 `useSelectionActions` hook 統一管理 `selectionBox`, `selectionMenuPos`, `selectedText`，App.tsx 不再有本地重複狀態 |
| 1.2 消除內容冗餘 | ✅ 完成 | 已建立 `useCurrentChapterContent()` 衍生 hook，優先取用 EPUB 章節內容 |
| 1.3 持久化用戶 ID | ✅ 完成 | `CollaborationContext.tsx` 已使用 `getOrCreateUserId()` 搭配 localStorage 持久化 |

### 階段 2: 提取業務邏輯到 Custom Hooks

| 項目 | 狀態 | 說明 |
|------|:----:|------|
| 2.1 建立 useAIActions hook | ✅ 完成 | 包含 `handleToggleAITutor`, `handleAIExplain`, `handleAIMindMap`, `handleGenerateQuiz`, `handleLessonPlan`, `clearSelection` |
| 2.2 建立 useSelectionActions hook | ✅ 完成 | 封裝所有選取操作，App.tsx 直接解構使用 |

### 階段 3: 組件分拆

| 項目 | 狀態 | 說明 |
|------|:----:|------|
| 3.1 分拆 RightSidePanel | ✅ 完成 | `ContextAnalysisPanel`, `ChatPanel`, `MaterialLibraryPanel`, `ReviewPanel` 皆已獨立至 `components/panels/`，並有 barrel file |
| 3.2 提取 EditorToolbar | ✅ 完成 | `EditorToolbar.tsx` 已獨立存在於 `components/canvas/` |
| 3.3 簡化 FixedToolbar Props | ✅ 完成 | 從 16 個 Props 減至 5 個，內部透過 `useEditor()` 與 `useUI()` 取得狀態 |

### 階段 4: 類型定義強化

| 項目 | 狀態 | 說明 |
|------|:----:|------|
| 4.1 定義核心資料結構 | ⚠️ 部分完成 | `types/index.ts` 已定義完整型別（Stroke, MindMapData, AIMemo 等），**但 Context 仍使用 `any`** |

### 階段 5: 目錄結構優化

| 項目 | 狀態 | 說明 |
|------|:----:|------|
| 5.1 按功能域重組 | ❌ 未執行 | 維持現有結構，可視專案規模再評估 |

---

## ✅ P0-P3 已完成（2024-12-16）

### P0: Context 型別修復 ✅

**已修復**：
- `EditorContext.tsx`：`strokes`, `mindMaps`, `aiMemos`, `textObjects`, `laserPath`, `selectionBox`, `selectionMenuPos` 皆已套用強型別
- `ContentContext.tsx`：`textbookContent`, `epubMetadata`, `epubChapters` 皆已套用 `TiptapContent`, `EPUBMetadata`, `EPUBChapter` 型別
- `types/index.ts`：修正 `TextObject.color` 與 `TextObject.fontSize` 為 required
- `SelectionFloatingMenu.tsx`：統一 position 型別為 `{ x, y }`

---

### P1: 新增 Error Boundary ✅

**已建立**：`src/components/ErrorBoundary.tsx`
- 捕獲子組件的 JavaScript 錯誤
- 顯示使用者友善的錯誤頁面
- 支援「嘗試恢復」與「重新載入」操作
- 開發模式下顯示 componentStack

**已整合**：`src/main.tsx` 中包裹 `AppProviders`

---

### P1: 移動 services 檔案 ✅

**已重組**：
```
src/
├── services/
│   └── ai/
│       └── mockLLMService.ts  ← 從 utils/ 移入
├── utils/
│   ├── epubParser.ts
│   └── geometry.ts
```

**已更新**：`App.tsx` 的 import 路徑

---

### P2: 建立 Barrel Files ✅

**已建立**：
- `src/components/ui/index.ts`
- `src/components/canvas/index.ts`
- `src/hooks/index.ts`
- `src/context/index.ts`

---

### P3: 更新 README.md ✅

**新內容**：
- 專案描述與功能特色
- 安裝與啟動指令
- 專案結構說明
- 快捷鍵一覽表
- 技術棧說明

---

### P4: 測試架構（低優先）

**問題**：沒有任何 `*.test.ts` 或 `*.spec.ts` 檔案

**建議**：
1. 安裝 Vitest：`npm install -D vitest @testing-library/react`
2. 為關鍵 hooks 撰寫單元測試（`useAIActions`, `useSelectionActions`）
3. 為 Context reducers 撰寫測試

---

## ✅ 已完成項目總結

| 完成項目 | 效果 |
|----------|------|
| `useAIActions` hook | App.tsx 減少 ~60 行 AI 邏輯 |
| `useSelectionActions` hook | 消除選取狀態重複 |
| `useCurrentChapterContent` hook | 消除內容冗餘 |
| `getOrCreateUserId()` | 修復協作 userId 持久化 |
| RightSidePanel 分拆 | 4 個子組件 + barrel file |
| FixedToolbar Props 簡化 | 從 16 個減至 5 個 |
| `types/index.ts` 型別定義 | 完整但 Context 未使用 |

---

## 📊 優化前後對比

| 指標 | 計畫前 | 目前狀態 | 目標 |
|------|--------|----------|------|
| App.tsx 行數 | 621 | **535** | ~350 |
| 最大組件行數 | 297 | **273** (FixedToolbar) | ~150 |
| Props drilling 深度 | 3 層 | **1-2 層** | ✅ 達成 |
| 重複狀態數 | 4 處 | **0 處** | ✅ 達成 |
| 架構評分 | 5.4/10 | **6.8/10** | 7.5+/10 |

---

## 下一步行動

1. **[立即]** 修復 Context 中的 `any` 型別
2. **[本週]** 新增 `ErrorBoundary` 組件
3. **[本週]** 重組 services 目錄
4. **[視需求]** 進一步拆分 App.tsx（可考慮建立 `EditorPage.tsx`）
