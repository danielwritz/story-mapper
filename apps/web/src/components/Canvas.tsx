import React from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const EMPTY_NODES: Node[] = [];
const EMPTY_EDGES: Edge[] = [];

export const Canvas: React.FC = () => (
  <div className="h-full w-full" data-testid="canvas-container">
    <ReactFlow
      className="h-full w-full"
      nodes={EMPTY_NODES}
      edges={EMPTY_EDGES}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap position="bottom-right" />
      <Controls />
    </ReactFlow>
  </div>
);
