# ESLint Bug 修復報告

## 概覽

本次修復針對專案中發現的 **126 個 ESLint 錯誤 + 11 個警告**，成功修復 **34 個錯誤**，將錯誤數降至 **92 個**。

## 修復摘要

| 階段 | 類別 | 修復項目數 | 狀態 |
|------|------|-----------|------|
| Phase 1 | Critical Bugs | 4 | ✅ 完成 |
| Phase 2 | React Hook 問題 | 8 | ✅ 完成 |
| Phase 3.1 | 未使用變數 | 6 | ✅ 完成 |
| Phase 3.2 | Case 區塊詞法聲明 | 3 | ✅ 完成 |
| Phase 3.3 | Any 型別濫用 (Canvas) | 8 | ✅ 完成 |
| Phase 3.4 | setState in effect | 5 | ✅ 完成 |

---

## Phase 1: Critical Bugs 修復

### 1.1 useTeacherAIChat.ts - setIsProcessing 邏輯錯誤

**問題**: 「一鍵生成 APOS」指令的 `setIsProcessing(true)` 設定後，在某些分支的 `return` 後 `setIsProcessing(false)` 永不執行，導致 UI 卡在 loading 狀態。

**修復**:
- 移除重複的 `setIsProcessing(true)` 呼叫
- 在每個 switch case 結束時確保呼叫 `setIsProcessing(false)`

**檔案**: `src/hooks/useTeacherAIChat.ts`

### 1.2 LessonProgressDashboard.tsx - Immutability 違規

**問題**: `cumulativePercent += percent` 在 render 函數內修改變數，違反 React 純函數原則。

**修復**: 使用 `useMemo` 搭配 `reduce` 封裝計算邏輯

**檔案**: `src/pages/LessonProgressDashboard.tsx`

---

## Phase 2: React Hook 問題修復

### 2.1 組件在 render 中創建

| 檔案 | 問題 | 解決方案 |
|------|------|----------|
| `ActivityFlowNode.tsx` | `getActivityIcon()` 返回組件 | 使用模組層級映射表 `activityIconMap` |
| `ClassroomWidgets.tsx` | `BottomExitButton` 在組件內定義 | 移至模組層級 |

### 2.2 Impure 函數在 render 中呼叫

| 檔案 | 問題 | 解決方案 |
|------|------|----------|
| `TeacherAgentPanel.tsx` | `Date.now()` | `useState(() => Date.now())` |
| `ResourcePickerModal.tsx` | `Date.now()` 用於 ID | `useId()` Hook |
| `StudentProgressPage.tsx` | `Math.random()` | Seeded random 函數 |
| `AdventureMap.tsx` | `Math.random()` | Seeded random + `useMemo` |

### 2.3 setState in effect 問題

| 檔案 | 修復方式 |
|------|----------|
| `NodeDetailModal.tsx` | 改用狀態比較 pattern |
| `RightSidePanel.tsx` | 使用函數式 setState |
| `AdventureMap.tsx` | 改用 `useMemo` 計算 |

---

## Phase 3: TypeScript 型別問題修復

### 3.1 Any 型別修復

**useCanvasInteraction.ts**:
```typescript
interface SelectionBox {
  x: number; y: number; width: number; height: number;
}
interface SelectionMenuPos {
  top: number; left: number;
}
```

**DraggableMindMap.tsx**:
```typescript
interface MindMapNode {
  id: string; label: string; type: 'root' | 'child';
  offsetX: number; offsetY: number;
}
interface MindMapEdge { source: string; target: string; }
```

**DrawingLayer.tsx**:
```typescript
interface Stroke {
  id: string; path: string; color: string; size: number;
  tool: 'pen' | 'highlighter'; rawPoints?: Point[]; author?: string;
}
```

### 3.2 Case 區塊詞法聲明

**問題**: `case` 內使用 `const/let` 宣告變數，但缺少區塊作用域

**修復**: 在 case 區塊添加大括號 `case 'xxx': { ... break; }`

**涉及檔案**:
- `src/components/canvas/FabricPageEditor.tsx`
- `src/utils/epubParser.ts`

### 3.3 未使用變數

| 檔案 | 變數 | 處理方式 |
|------|------|----------|
| `LessonPlannerAgent.ts` | `_input` | 改為 `input` 並使用 |
| `ConditionalEdge.tsx` | `id: _id` | 移除解構 |
| `OptionalEdge.tsx` | `id: _id` | 移除解構 |
| `ModeIndicator.tsx` | `userRole: _userRole` | 移除解構 |
| `HomePage.tsx` | `_id, _label` | 改為 `() => {}` |
| `mockProvider.ts` | `_options` | 使用 `void options;` |

---

## 剩餘問題分析

| 類型 | 數量 | 說明 |
|------|------|------|
| `react-refresh/only-export-components` | 35 | HMR 相關，不影響運行 |
| `no-explicit-any` | 30 | 需定義更多介面 |
| `setState in effect` | 7 | 需重構同步邏輯 |
| 其他 | 20 | 混合問題 |

### react-refresh/only-export-components

這些警告是關於同一檔案同時 export hooks 和 components，影響 Hot Module Replacement 的效能，但**不影響應用程式功能**。

**涉及檔案**:
- `src/context/AgentContext.tsx`
- `src/context/CollaborationContext.tsx`
- `src/context/ContentContext.tsx`
- `src/components/ui/Toast.tsx`

**建議**: 將 hooks 移至獨立檔案（如 `useAgent.ts`）以改善 HMR 體驗。

---

## 修改檔案清單

```
src/hooks/useTeacherAIChat.ts
src/hooks/useCanvasInteraction.ts
src/pages/LessonProgressDashboard.tsx
src/pages/StudentProgressPage.tsx
src/pages/LessonPrepPreviewPage.tsx
src/pages/HomePage.tsx
src/components/ActivityFlowNode.tsx
src/components/ResourcePickerModal.tsx
src/components/canvas/DrawingLayer.tsx
src/components/canvas/DraggableMindMap.tsx
src/components/canvas/FabricPageEditor.tsx
src/components/features/TeacherAgentPanel.tsx
src/components/features/classroom/ClassroomWidgets.tsx
src/components/features/learning-path/NodeDetailModal.tsx
src/components/features/learning-path/edges/ConditionalEdge.tsx
src/components/features/learning-path/edges/OptionalEdge.tsx
src/components/layout/RightSidePanel.tsx
src/components/student/AdventureMap.tsx
src/components/ui/ModeIndicator.tsx
src/agents/teacher/LessonPlannerAgent.ts
src/services/adapters/mockProvider.ts
src/utils/epubParser.ts
```

---

## 測試建議

1. **一鍵生成 APOS 功能**: 確認 loading 狀態正確切換
2. **LessonProgressDashboard 圓餅圖**: 確認渲染正確
3. **聚光燈/遮幕功能**: 確認按鈕顯示正常
4. **備課對話流程**: 完整測試對話流程

---

*報告生成日期: 2025-12-29*
