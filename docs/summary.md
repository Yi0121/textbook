# Project Summary: MCP & Agentic AI-based Mathematics Textbook System
# 以 MCP 及 Agentic AI 為基礎的高層次數學 AI 教科書系統

**Date:** 2026-01-07
**Domain:** EdTech, System Architecture, AI Agents
**Key Technologies:** Model Context Protocol (MCP), Agentic RAG, Graph RAG, Multi-modal Analytics

---

## 1. System Architecture (系統架構設計)

本計畫旨在解決生成式 AI 在教育應用中缺乏結構性與正確性的問題。核心架構建立在 **Model Context Protocol (MCP)** 之上，採用 **Agentic RAG** 技術，將單一 AI 模型拆解為多個專職代理人。

### 1.1 Core Framework (核心框架)

* **基礎協定 (Protocol)**: Model Context Protocol (MCP)。
* **核心技術 (Core Tech)**: Agentic AI + Graph RAG (結合知識圖譜的檢索增強生成)。
* **設計邏輯 (Design Logic)**:
    * **結構化表徵**: 利用 Graph RAG 明確定義「概念 (Concept) — 先備知識 (Prerequisites) — 課程單元 (Units)」之關聯。
    * **避免幻覺**: 解決傳統 RAG 僅依賴語意相似度導致的「跳單元」或「先備知識錯置」問題。
    * **功能分離**: 將「檢索」、「推論」、「教學設計」與「學習分析」模組化分離。

### 1.2 Multi-Agent System (多代理人系統)

系統在 MCP 架構下分為三種主要 Agent 角色：

| Agent Role | 職責描述 (Responsibilities) |
| :--- | :--- |
| **Teaching Assistant Agent**<br>(教學助教代理人) | 1. 負責與學生互動，提供創造力與自主學習 (SRL) 教材。<br>2. 執行互動反饋機制。 |
| **Learning Tutor Agent**<br>(學習家教代理人) | 1. 引導適性教學活動。<br>2. 在合作解題 (CPS) 中提供即時鷹架 (Scaffolding) 與策略引導。<br>3. 依據分析結果決定提示 (Hint) 的層級。 |
| **Learning Analytic Agent**<br>(學習分析代理人) | 1. 蒐集並分析單模態與多模態資料。<br>2. 判斷學習者狀態，將資訊傳遞給其他 Agent 以調整策略。 |

---

## 2. Dashboard & Database Design (儀表板與資料庫設計)

本系統強調 **多模態資料 (Multi-modal Data)** 的應用，支援差異化教學與自主學習調節。

### 2.1 Data Architecture (資料架構)

資料庫涵蓋三類主要數據，用於 AI 訓練與即時分析：

1.  **Retrieval Data (檢索資料)**: 系統從知識庫提取的教材內容與教學策略紀錄。
2.  **Dialog Data (對話資料)**: 學生與 AI (Teaching Assistant/Tutor) 的自然語言互動紀錄。
3.  **Operation Data (操作/歷程資料)**:
    * 個人的解題行為、滑鼠點擊、步驟軌跡。
    * 合作解題情境下的互動行為數據。

### 2.2 Analysis Modules (分析模組)

* **單模態分析**: 針對單一類型數據（如僅操作軌跡）進行基礎分析。
* **多模態分析**: 整合對話、操作與檢索數據，評估高層次能力（創造力、CPS、SRL）。
* **理論基礎 (Theoretical Basis)**:
    * **Knowledge Tracing & Learning Progression**: 追蹤知識點掌握度與學習進程。
    * **APOS Theory**: 引入 Action, Process, Object, Schema 作為認知分析框架。

### 2.3 Dashboard Visualization (視覺化儀表板)

儀表板由 Agentic AI 動態生成，分為兩大介面：

#### A. Student Dashboard (學生學習儀表板)
* **目標**: 支援自主學習 (SRL)。
* **功能**: 提供視覺化的學習歷程回饋，促進策略反思、錯誤修正與後設認知監控。
* **關鍵指標**: 數學變通性、策略多樣性、自我調整能力。

#### B. Teacher Dashboard (教師教學儀表板)
* **目標**: 支援適性教學決策與差異化教學。
* **功能**: 呈現學生個別與小組的學習狀態、偵測迷思概念。
* **Agentic 介入**: 系統不只呈現數據，還會**主動推薦「差異化教學建議」** (Actionable Insights)。

---

## 3. Technical & Educational Integration (技術與教育整合重點)

* **AI Reliability (可靠性)**:
    * 透過 RAG 結合已驗證的教科書結構知識庫，解決 LLM 產生數學內容幻覺的問題。
* **Pedagogical Alignment (教育理論對齊)**:
    * 系統架構依據 **SRL (自主學習)** 與 **CPS (合作問題解決)** 理論設計。
    * 強調「人機共學」與「人際協作」的平衡，而非單純的技術堆疊。