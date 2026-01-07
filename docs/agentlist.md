# MCP & Agentic AI System Architecture: Modules, Agents, and Tools
# 系統架構：模組、代理人與 MCP 工具列表

**Date:** 2026-01-07
**Description:** 本文件定義了數學 AI 教科書系統的三大核心模組，以及各模組下的 Agent 職責與所使用的 MCP 工具配置。

---

## 1. 教師助教模組 (Teaching Assistant Module)

本模組主要負責課程設計、教材生成與教學輔助。

### 1.1 Curriculum Design Agent (課程設計 Agent)
負責整合數學運算、視覺辨識與知識管理工具來設計課程。

* **1. 數學工具 (Mathematical Tools)**
    * **Microsoft Math Solver MCP**: 調用微軟引擎提供算式解答、分步步驟與練習題建議。
    * **mcp-server-mathematics**: 提供基礎運算、符號代數推導與科學計算功能。
    * **GeoGebra MCP Tool**: 開源工具，用於動態生成幾何圖形、函數影像與數學模型。
    * **Wolfram Alpha MCP**: 開源連接器，執行高階數學求解。

* **2. 視覺與手寫辨識 (Visual & OCR)**
    * **Mistral OCR MCP**: 利用視覺模型將平板手寫算式與草圖精準轉為 Markdown 或 LaTeX。
    * **MarkItDown (Microsoft)**: 將 OCR 辨識結果與 PDF/Office 教材統一格式，確保數據一致性。
    * **Filesystem MCP**: 官方工具，負責讀寫本地端或平板上傳的截圖、教案與作業檔案。

* **3. 知識管理與邏輯推理 (Knowledge & Logic)**
    * **Knowledge Graph (server-memory)**: 官方工具，以圖形結構紀錄學生對各項知識點的掌握關係。
    * **Sequential Thinking**: 官方工具，引導 Agent 進行多步驟推理分析，確保解題邏輯嚴謹。
    * **Neo4j / Memory.jsonl**: 專門儲存大型教學大綱與學生歷程錯誤分佈的知識圖譜。

* **4. 資料庫與數據存取 (Database & Data Access)**
    * **PostgreSQL MCP**: 強大開源資料庫，適合儲存大規模學生學習行為日誌與數據分析。
    * **SQLite MCP**: 輕量級本地資料庫，適合存放個人錯題集或平板離線學習紀錄。
    * **MongoDB MCP**: 官方 NoSQL 工具，適合處理與儲存手寫辨識後的非結構化教材內容。
    * **MindsDB MCP**: 整合引擎，能跨庫查詢不同資料庫並具備自然語言轉 SQL 能力。

* **5. 協作、進度與筆記工具 (Collaboration & Notes)**
    * **Google Drive / OneDrive**: 自動讀寫雲端教學文件，如教案、講義與學生答案檔。
    * **Obsidian / Notion MCP**: 直接讀取筆記內容，適合作為動態教材庫或學生數位筆記本。

### 1.2 Content Generation Agent (內容生成 Agent)
*(待補充具體工具)*

### 1.3 Mathematical Flexible Thinking Agent (數學變通性思考 Agent)
*(待補充具體工具)*

### 1.4 Agentic Collaborative Grouping Agent (協作分組 Agent)
*(待補充具體工具)*

### 1.5 APOS Mathematical Construction Agent (APOS 數學建構 Agent)
*(待補充具體工具)*

---

## 2. 學習家教模組 (Learning Tutor Module)

本模組負責學生端的適性引導、合作解題與即時回饋。

### 2.1 Collaborative Problem Solving Agent (CPS Agent, 合作問題解決導學 Agent)
* 負責協調小組合作流程。

### 2.2 Mathematical Flexible Thinking Tutoring Agent (數學變通性思考導學 Agent)
* 引導學生進行多角度思考。

### 2.3 APOS Mathematical Tutoring Agent (APOS 數學導學 Agent)
* 基於 APOS 理論進行概念引導。

### 2.4 Technical Support Agent (技術工具 Agent)
* 協助解決平台使用問題。

### 2.5 Automated Assessment Agent (自動評分 Agent)
* 即時批改與評量。

### 2.6 Learning Behavior Observer Agent (學習行為觀測 Agent)
* 監控學習專注度與行為模式。

### 2.7 Virtual Collaborative Facilitator Agent (合作 AI 組員 Agent)
* 模擬組員角色進行互動。

### 2.8 Multi-Strategy Problem-Solving Advisor (多重解題策略即時建議 Agent)
* 提供不同的解題路徑建議。

### 2.9 CPS Real-time Advisory Agent (合作問題解決導學輔助 Agent)
* 即時介入合作過程中的溝通障礙。

### 2.10 Math Self-Regulated Learning Agent (數學 SRL Agent)
* 支援自主學習循環（目標設定、策略監控、反思）。

---

## 3. 學習分析模組 (Learning Analytics Module)

本模組負責數據處理、模型分析與決策建議。

### 3.1 Data Cleaning Agent (資料清理 Agent)
* **Tools**:
    * **Dataplex**: Google Cloud 智慧資料結構化與品質管理工具。

### 3.2 Labeling Agent (資料標籤 Agent)
* **Tools**:
    * **Codebook Generation**: 自動生成編碼簿與標籤定義。

### 3.3 Multimodal Data Analytics Agent (多模態資料分析 Agent)
*(待補充具體工具)*

### 3.4 Adaptive Teaching Recommendation Agent (適性教學建議 Agent)
負責分析班級與學生狀態，提供教學策略建議。

* **Statistical Modeling Tools (統計建模工具)**:
    * **IRT**: `mirt` (R package) - 試題反應理論分析。
    * **SEM**: `lavaan` (R package) - 結構方程模型分析。
    * **BKT**: `pyBKT` (Python library) - 貝氏知識追蹤。
* **Network Analysis Tools (網絡分析工具)**:
    * **SNA**: `igraph` (R package) - 社會網絡分析。
    * **ONA**: `ona` (R package) - 組織網絡分析。
    * **ENA**: `rENA` (R package) - 認識網絡分析 (Epistemic Network Analysis)。
* **Sequence Analysis Tools (序列分析工具)**:
    * **FOMM**: `pMineR` (R package) - 流程挖掘與序列模型。
    * **LSA**: `TraMineR` (R package) - 潛在序列分析。

### 3.5 Adaptive Learning Recommendation Agent (適性學習建議 Agent)
*(待補充具體工具)*

### 3.6 Viz Agent (視覺化 Agent)
*(待補充具體工具)*