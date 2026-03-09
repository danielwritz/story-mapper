import React from 'react';
import { Background, Controls, MiniMap, ReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { useStoryMapStore } from '../stores/story-map-store';
import { nodeTypes } from './nodes/node-types';

export const Canvas: React.FC = () => {
  const nodes = useStoryMapStore((state) => state.getNodes());
  const edges = useStoryMapStore((state) => state.getEdges());

  return (
    <div className="h-full w-full" data-testid="canvas-container">
      <ReactFlow
        className="h-full w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" />
        <MiniMap position="bottom-right" />
        <Controls />
      </ReactFlow>
    </div>
  );
};
