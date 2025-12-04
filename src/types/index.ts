// src/types/index.ts

export interface Point {
  x: number;
  y: number;
  timestamp?: number;
}

export interface Stroke {
  path: string;
  color: string;
  size: number;
  tool: string;
  rawPoints?: Point[];
}

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

export interface MemoData {
  id: number;
  x: number;
  y: number;
  keyword: string;
  content: string;
}

export interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}