import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';

export const App: React.FC = () => (
  <div className="flex h-screen w-screen flex-col bg-slate-900 text-slate-50">
    <Toolbar />
    <div className="flex-1 min-h-0">
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </div>
  </div>
);
