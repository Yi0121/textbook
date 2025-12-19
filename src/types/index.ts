// src/types/index.ts

// ==================== 基礎類型 ====================

export interface Point {
  x: number;
  y: number;
  timestamp?: number;
}

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ==================== 繪圖類型 ====================

export type DrawingTool = 'cursor' | 'pen' | 'highlighter' | 'eraser' | 'text' | 'laser';

export interface Stroke {
  id?: string;
  path: string;
  color: string;
  size: number;
  tool: DrawingTool | string;
  rawPoints?: Point[];
  author?: string;
  timestamp?: number;
}

// ==================== 心智圖類型 ====================

export interface MindMapNode {
  id: string;
  x?: number; // 絕對座標
  y?: number;
  offsetX?: number; // 相對座標
  offsetY?: number;
  label: string;
  type: 'root' | 'child';
}

export interface MindMapEdge {
  source: string;
  target: string;
}

export interface MindMapData {
  id: number;
  x: number;
  y: number;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

// ==================== AI 便利貼類型 ====================

export type AIMemoType = 'explain' | 'quiz' | 'plan' | 'summary';

export interface AIMemo {
  id: number;
  x: number;
  y: number;
  keyword: string;
  content: string;
  type?: AIMemoType;
  createdAt?: Date;
}

// 舊的 MemoData 別名（向後兼容）
export type MemoData = AIMemo;

// ==================== 文字物件類型 ====================

export interface TextObject {
  id: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

// ==================== Tiptap 內容類型 ====================

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
}

export interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

// ==================== EPUB 類型 ====================

export interface EPUBMetadata {
  title: string;
  author: string;
  publisher?: string;
  description?: string;
  cover?: string;
  isbn?: string;
  version?: string;
  lastModified?: string;
  tags?: string[];
}

export interface EPUBChapter {
  id: string;
  title: string;
  content: TiptapContent | string;
  order: number;
}

// ==================== 協作類型 ====================

export interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  cursorPosition?: Point;
  isActive: boolean;
}

export interface WhiteboardStroke extends Stroke {
  participantId: string;
}

// ==================== 檔案元資料類型 ====================

export interface FileMeta {
  title: string;
  version: string;
  lastModified: string;
  tags: string[];
}

// ==================== Fabric.js 頁面類型 ====================

/**
 * Fabric.js 頁面 - 代表無限畫布上的一個頁面
 */
export interface FabricPage {
  id: string;
  x: number;           // 在無限畫布上的位置
  y: number;
  width: number;
  height: number;
  sourceId: string;    // EPUB 來源 ID (或 'manual' 表示手動建立)
  title: string;
  canvasJSON: string;  // Fabric.js 序列化內容
  order: number;
}

/**
 * EPUB 來源記錄 - 記錄每個匯入的 EPUB
 */
export interface EPUBSource {
  id: string;
  metadata: EPUBMetadata;
  importedAt: number;
  pageIds: string[];
  basePosition: { x: number; y: number };
}