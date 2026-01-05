import { useCallback } from 'react';
import {
    ReactFlow, Background, Controls,
    type Node, type Edge, type OnNodesChange, type OnEdgesChange, type Connection,
    type NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface GraphCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;
    onNodeClick: (event: React.MouseEvent, node: Node) => void;
    onDrop: (event: React.DragEvent) => void;
    nodeTypes: NodeTypes;
}

export function GraphCanvas({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onDrop,
    nodeTypes
}: GraphCanvasProps) {

    // Prevent default behavior for drag over to allow dropping
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div className="flex-1 relative h-full bg-slate-50">
            <div
                className="absolute inset-y-0 left-0 right-0"
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    fitView
                    fitViewOptions={{
                        padding: 0.25,
                        includeHiddenNodes: false,
                        minZoom: 0.3,
                        maxZoom: 1.2
                    }}
                    attributionPosition="bottom-right"
                    minZoom={0.2}
                    maxZoom={1.5}
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={true}
                    nodesConnectable={true}
                    snapToGrid={true}
                    snapGrid={[16, 16]}
                >
                    <Background color="#e2e8f0" gap={24} size={1} />
                    <Controls
                        position="bottom-center"
                        showInteractive={false}
                    />
                </ReactFlow>
            </div>
        </div>
    );
}
