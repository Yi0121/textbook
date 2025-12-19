import dagre from 'dagre';
import { type Node, type Edge, Position } from '@xyflow/react';

// Dagre 需要的節點尺寸（預設值，因為 React Flow 節點大小可能隨內容變動）
const NODE_WIDTH = 250;
const NODE_HEIGHT = 100;

/**
 * 使用 Dagre 演算法自動計算節點位置
 * 
 * @param nodes 節點列表
 * @param edges 邊列表
 * @param direction 排版方向 'TB' (Top-Bottom) | 'LR' (Left-Right)
 * @returns 帶有新位置的節點與原始邊
 */
export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = 'TB'
) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    // 1. 加入節點到 Dagre Graph
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    // 2. 加入邊到 Dagre Graph
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // 3. 執行 Layout 計算
    dagre.layout(dagreGraph);

    // 4. 將計算結果寫回節點位置
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // Dagre 回傳的是中心點，React Flow 需要左上角座標
        // 我們需要根據節點大小進行微調
        // 注意：因為我們在 setNode 時用了固定大小，這裡直接用回該大小計算
        // 如果需要更精確，需要讓 React Flow 先渲染一次取得實際大小 (較複雜)
        // 這裡採用簡易方案：假設所有卡片大小相似

        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            position: {
                x: nodeWithPosition.x - NODE_WIDTH / 2,
                y: nodeWithPosition.y - NODE_HEIGHT / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};
