# 狀態管理策略指南

本專案同時使用 **React Context** 與 **Zustand** 進行狀態管理。
本文件定義兩者的使用邊界與最佳實踐。

---

## 使用邊界

### React Context 適用場景

| 場景 | 範例 |
|-----|------|
| **服務註冊** | AgentContext、Provider 初始化 |
| **全域配置** | 主題設定、使用者偏好 |
| **低頻更新狀態** | 使用者角色、登入狀態 |
| **跨元件依賴注入** | Orchestrator 實例 |

**現有 Context**：
- `AgentContext` - Agent 系統存取
- `EditorContext` - 編輯器工具狀態
- `ContentContext` - EPUB 內容
- `UIContext` - UI 開關狀態
- `CollaborationContext` - 協作參與者
- `LearningPathContext` - 學習路徑狀態

---

### Zustand 適用場景

| 場景 | 範例 |
|-----|------|
| **高頻更新狀態** | 表單輸入、拖曳位置 |
| **細粒度訂閱** | 僅監聽特定欄位變化 |
| **跨元件共享但不需 Provider** | 全域 UI 狀態 |
| **非同步狀態管理** | API 資料快取 |

**使用指引**：
```typescript
// ✅ 使用 Zustand
const useFormStore = create((set) => ({
  formData: {},
  setField: (key, value) => set((state) => ({ 
    formData: { ...state.formData, [key]: value } 
  })),
}));

// ❌ 避免：Context 高頻更新
const [inputValue, setInputValue] = useState(''); // 每次輸入都重渲染整個 Provider 子樹
```

---

## 決策流程

```
需要共享狀態？
    │
    ├─ 需要 Provider 包裹？ ─── 是 ──→ React Context
    │                              (服務注入、認證狀態)
    │
    ├─ 更新頻率高？ ──────────── 是 ──→ Zustand
    │                              (表單、編輯器游標)
    │
    └─ 需要細粒度訂閱？ ──────── 是 ──→ Zustand
                                   (避免不必要的重渲染)
```

---

## 遷移建議

### 保持現狀（Context）
- `EditorContext` - 工具選擇為低頻操作
- `UIContext` - 側邊欄開關為低頻操作
- `AgentContext` - 服務註冊，初始化後不變

### 觀察評估（可能遷移）
- `LearningPathContext` - 若節點拖曳造成效能問題，考慮遷移高頻操作至 Zustand
