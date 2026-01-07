# MCP & Agentic AI System Architecture: Modules, Agents, and Tools
# 系統架構：模組、代理人與 MCP 工具列表

**Date:** 2026-01-07
**Description:** 本文件定義了數學 AI 教科書系統的三大核心模組，以及各模組下的 Agent 職責與所使用的 MCP 工具配置。

---

## 系統概覽

| 模組 | Agent 數量 | 狀態 |
|------|-----------|------|
| 教師助教模組 | 4 | ✅ 已實作 |
| 學習家教模組 | 9 | ✅ 已實作 |
| 學習分析模組 | 8 | ✅ 已實作 |
| **總計** | **21** | - |

---

## 1. 教師助教模組 (Teaching Assistant Module)

本模組主要負責課程設計、教材生成與教學輔助。

### 1.1 Curriculum Design Agent (課程設計 Agent)
**Agent ID:** `curriculum-design`

負責整合數學運算、視覺辨識與知識管理工具來設計課程。

**實作 Tools:**
- `create_lesson_plan` - 建立教案工作流
- `edit_lesson_flow` - 編輯教學流程
- `assign_activities` - 指派學習活動
- `schedule_content` - 排程內容發布

**MCP 工具:**
* **Microsoft Math Solver MCP**: 調用微軟引擎提供算式解答、分步步驟與練習題建議。
* **mcp-server-mathematics**: 提供基礎運算、符號代數推導與科學計算功能。
* **GeoGebra MCP Tool**: 開源工具，用於動態生成幾何圖形、函數影像與數學模型。
* **Wolfram Alpha MCP**: 開源連接器，執行高階數學求解。
* **Knowledge Graph (server-memory)**: 官方工具，以圖形結構紀錄學生對各項知識點的掌握關係。
* **Sequential Thinking**: 官方工具，引導 Agent 進行多步驟推理分析。

### 1.2 Content Generation Agent (內容生成 Agent)
**Agent ID:** `content-generator`

負責利用 MCP 驅動繪圖與運算工具，產製多模態教材、試題與互動式數學元件。

**實作 Tools:**
- `generate_text_material` - 生成文字教材
- `generate_exercise` - 產生練習題
- `generate_quiz` - 建立測驗
- `generate_geogebra_component` - 生成 GeoGebra 互動元件
- `generate_multimedia` - 製作多媒體素材
- `get_learning_path` - 取得學習路徑
- `generate_learning_suggestions` - 生成學習建議

### 1.3 Mathematical Flexible Thinking Agent (數學變通性思考 Agent)
**Agent ID:** `math-flexible-thinking`

產生多元解題題目與解法，培養數學變通性思考。

**實作 Tools:**
- `generate_multi_strategies` - 為問題生成多種解題策略
- `suggest_alternative_paths` - 建議替代解法路徑
- `assess_flexibility` - 評估數學變通性能力

### 1.4 Agentic Collaborative Grouping Agent (協作分組 Agent)
**Agent ID:** `collaborative-grouping`

根據學生能力畫像與社交特質，自動執行異質或同質分組，優化協作基礎。

**實作 Tools:**
- `auto_group_students` - 自動分組學生
- `adjust_groups` - 手動調整分組
- `get_group_analytics` - 取得分組分析報告

---

## 2. 學習家教模組 (Learning Tutor Module)

本模組負責學生端的適性引導、合作解題與即時回饋。

### 2.1 APOS Mathematical Construction Agent (APOS 數學建構 Agent)
**Agent ID:** `apos-construction`

採用啟發式對話與蘇格拉底提問，引導學生完成 APOS 理論之心理建構歷程。

**實作 Tools:**
- `socratic_dialogue` - 蘇格拉底式對話引導
- `apos_scaffolding` - APOS 階段鷹架支援
- `assess_apos_level` - 評估 APOS 認知層級

### 2.2 Technical Support Agent (技術工具 Agent)
**Agent ID:** `technical-support`

提供 GeoGebra、Wolfram Alpha 等動態工具支援。

**實作 Tools:**
- `get_geogebra_state` - 取得 GeoGebra 畫布狀態
- `solve_algebra` - 代數求解
- `recognize_handwriting` - 手寫辨識
- `provide_technical_hint` - 技術操作提示

### 2.3 Collaborative Problem Solving Agent (CPS Agent, 合作問題解決 Agent)
**Agent ID:** `cps-agent`

協調小組合作流程，確保共同目標達成。

**實作 Tools:**
- `guide_shared_understanding` - 引導建立共同理解
- `coordinate_collaboration` - 協調合作流程
- `assess_cps_skill` - 評估 CPS 能力

### 2.4 Scaffolding Agent (鷹架切換 Agent)
**Agent ID:** `scaffolding`

切換鷹架模式（臆測/推論/CPS/創造力）。

**實作 Tools:**
- `switch_scaffold_mode` - 切換鷹架模式
- `provide_hint` - 提供提示
- `adjust_difficulty` - 調整難度
- `launch_geogebra` - 啟動 GeoGebra
- `enable_handwriting` - 啟用手寫板

### 2.5 Automated Assessment Agent (自動評分 Agent)
**Agent ID:** `automated-assessment`

針對學生的解題正確性、邏輯品質與操作行為進行多維度的即時診斷與評價。

**實作 Tools:**
- `auto_grade` - 自動評分
- `check_answer` - 檢查答案
- `provide_feedback` - 提供回饋
- `calculate_scores` - 計算成績
- `get_current_learning_path` - 取得目前學習路徑

### 2.6 Learning Behavior Observer Agent (學習行為觀測 Agent)
**Agent ID:** `learning-behavior-observer`

將學生所有操作、對話串流至 LRS，自動識別學習節點。

**實作 Tools:**
- `track_behavior` - 追蹤學習行為
- `record_interaction` - 記錄互動
- `detect_struggle` - 偵測困難點
- `monitor_engagement` - 監測投入度

### 2.7 Virtual Collaborative Facilitator Agent (虛擬協作引導 Agent)
**Agent ID:** `virtual-collaborative-facilitator`

在小組互動中扮演「智慧夥伴」角色，根據教師設定扮演不同角色。

**實作 Tools:**
- `join_whiteboard` - 加入白板
- `send_message` - 發送訊息
- `provide_ai_guidance` - AI 引導
- `suggest_collaboration` - 協作建議

### 2.8 Multi-Strategy Problem-Solving Advisor (多重解題策略即時建議 Agent)
**Agent ID:** `multi-strategy-advisor`

根據學習觀測紀錄，即時回饋介入建議。

**實作 Tools:**
- `suggest_strategy` - 提供解題策略建議
- `suggest_cps_strategy` - 提供 CPS 建議

### 2.9 Math Self-Regulated Learning Agent (數學 SRL Agent)
**Agent ID:** `math-srl`

支援學生自我調節學習，包含目標設定、策略監控、反思。

**實作 Tools:**
- `assess_srl_state` - 評估 SRL 狀態
- `prompt_metacognition` - 促進後設認知
- `suggest_srl_strategies` - 建議 SRL 策略

---

## 3. 學習分析模組 (Learning Analytics Module)

本模組負責數據處理、模型分析與決策建議。

### 3.1 Data Cleaning Agent (資料清理 Agent)
**Agent ID:** `data-cleaning`

執行數據去識別化、格式對齊與初步過濾。

**實作 Tools:**
- `collect_raw_data` - 收集原始資料
- `clean_data` - 清洗資料
- `store_data` - 儲存資料
- `export_data` - 匯出資料
- `load_learning_path` - 載入學習路徑
- `save_learning_path` - 儲存學習路徑
- `load_all_paths` - 載入所有路徑

**MCP 工具:**
- **Dataplex**: Google Cloud 智慧資料結構化與品質管理工具。

### 3.2 SNA Analytics Agent (社會網絡分析 Agent)
**Agent ID:** `sna-analyst`

分析成員間互動頻率、中心性與社會關係結構。

**實作 Tools:**
- `analyze_network` - 分析網絡結構
- `identify_clusters` - 識別社群群組
- `calculate_centrality` - 計算中心性指標

### 3.3 ENA Analytics Agent (認知網絡分析 Agent)
**Agent ID:** `ena-analyst`

分析數學概念間的聯結強度與認知結構轉化歷程。

**實作 Tools:**
- `analyze_epistemic_network` - 分析認知網絡
- `identify_connections` - 識別概念連結
- `compare_learning_patterns` - 比較學習模式

### 3.4 SRL Analytics Agent (自主學習分析 Agent)
**Agent ID:** `srl-analyst`

分析學生自主學習模式與自我調節能力。

**實作 Tools:**
- `analyze_srl_patterns` - 分析 SRL 模式
- `measure_self_regulation` - 測量自我調節
- `identify_srl_weaknesses` - 識別 SRL 弱點

### 3.5 Process Analytics Agent (歷程分析 Agent)
**Agent ID:** `process-analyst`

分析學習軌跡、識別瓶頸、測量進度。

**實作 Tools:**
- `analyze_learning_trajectory` - 分析學習軌跡
- `identify_bottlenecks` - 識別學習瓶頸
- `measure_progress` - 測量學習進度

### 3.6 Math Problem Analytics Agent (數學解題分析 Agent)
**Agent ID:** `math-problem-analyst`

分析解題歷程、識別迷思概念、追蹤解題路徑。

**實作 Tools:**
- `analyze_problem_solving` - 分析解題歷程
- `identify_misconceptions` - 識別迷思概念
- `track_solution_path` - 追蹤解題路徑

### 3.7 Strategic Synthesis Agent (策略整合 Agent)
**Agent ID:** `synthesis`

彙整多源分析數據，生成教學與學習建議。

**實作 Tools:**
- `aggregate_insights` - 彙整分析結果
- `generate_recommendations` - 生成教學建議
- `prioritize_interventions` - 優先排序介入措施

### 3.8 Viz Agent (視覺化 Agent)
**Agent ID:** `viz`

視覺化呈現學習分析結果，提供自然語言建議。

**實作 Tools:**
- `render_student_dashboard` - 渲染學生儀表板
- `render_class_dashboard` - 渲染班級儀表板
- `render_network_graph` - 渲染網絡圖
- `generate_report` - 生成報告
- `render_progress_chart` - 渲染進度圖表

---

## 附錄：統計建模與網絡分析工具

### Statistical Modeling Tools (統計建模工具)
- **IRT**: `mirt` (R package) - 試題反應理論分析
- **SEM**: `lavaan` (R package) - 結構方程模型分析
- **BKT**: `pyBKT` (Python library) - 貝氏知識追蹤

### Network Analysis Tools (網絡分析工具)
- **SNA**: `igraph` (R package) - 社會網絡分析
- **ONA**: `ona` (R package) - 組織網絡分析
- **ENA**: `rENA` (R package) - 認識網絡分析 (Epistemic Network Analysis)

### Sequence Analysis Tools (序列分析工具)
- **FOMM**: `pMineR` (R package) - 流程挖掘與序列模型
- **LSA**: `TraMineR` (R package) - 潛在序列分析
