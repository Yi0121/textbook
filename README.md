# Interactive Textbook Editor 互動式教科書編輯器

一個現代化的互動式教科書編輯平台，結合 AI 輔助功能、協作白板與豐富的課堂工具，專為教師與學生打造。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)

## ✨ 功能特色

### 📚 教科書編輯
- **EPUB 匯入**：直接匯入 EPUB 格式教科書，自動解析章節結構
- **富文本編輯**：基於 Tiptap 的所見即所得編輯器
- **畫布繪圖**：支援畫筆、螢光筆、橡皮擦等繪圖工具
- **心智圖**：拖曳式心智圖元件，整理知識結構

### 🤖 AI 輔助功能
- **AI 解釋**：選取文字後自動生成白話文解析
- **心智圖生成**：AI 自動整理關聯節點
- **隨堂測驗**：針對段落自動出題
- **備課引導**：教學重點與延伸閱讀建議

### 👥 協作功能
- **電子白板**：即時協作白板
- **角色切換**：教師/學生雙模式
- **課堂工具**：計時器、抽籤、儀表板

---

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 建置專案
```bash
npm run build
```

### 程式碼檢查
```bash
npm run lint
```

---

## 📁 專案結構

```
src/
├── components/           # React 元件
│   ├── canvas/          # 畫布相關 (TextbookEditor, DrawingLayer, ...)
│   ├── collaboration/   # 協作功能 (Whiteboard)
│   ├── features/        # 功能模組 (Dashboard, EPUBImporter, ...)
│   ├── layout/          # 佈局 (TopNavigation, RightSidePanel)
│   ├── panels/          # 側邊面板 (ChatPanel, ContextAnalysisPanel, ...)
│   ├── tools/           # 工具列 (FixedToolbar)
│   └── ui/              # 通用 UI (Modal, ThemeToggle, ...)
├── context/             # React Context 狀態管理
│   ├── EditorContext    # 編輯器狀態 (工具、筆跡、選取)
│   ├── ContentContext   # 內容狀態 (章節、EPUB)
│   ├── UIContext        # UI 狀態 (側邊欄、彈窗)
│   └── CollaborationContext # 協作狀態 (白板、參與者)
├── hooks/               # 自訂 Hooks
│   ├── useAIActions     # AI 功能操作
│   ├── useCanvasInteraction # 畫布互動邏輯
│   ├── useKeyboardShortcuts # 快捷鍵管理
│   └── useSelectionActions  # 選取狀態操作
├── services/            # 服務層
│   └── ai/              # AI 相關服務
├── types/               # TypeScript 型別定義
└── utils/               # 工具函式
```

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
| `Ctrl + 0` | 重置縮放 |
| `?` | 顯示快捷鍵說明 |

---

## 🛠️ 技術棧

- **Frontend**: React 19, TypeScript 5.9
- **Build Tool**: Vite (Rolldown)
- **Styling**: TailwindCSS 3.4
- **Rich Text Editor**: Tiptap
- **Icons**: Lucide React
- **EPUB Parsing**: epubjs

---

## 📄 授權

本專案僅供學習與教育用途。
