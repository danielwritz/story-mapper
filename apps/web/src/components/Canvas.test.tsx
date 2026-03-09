import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './Canvas';

const renderCanvas = () =>
  render(
    <ReactFlowProvider>
      <div style={{ width: '800px', height: '600px' }}>
        <Canvas />
      </div>
    </ReactFlowProvider>,
  );

describe('Canvas', () => {
  it('renders the React Flow canvas', () => {
    const { container } = renderCanvas();
    expect(container.querySelector('.react-flow')).toBeInTheDocument();
  });

  it('renders the minimap', () => {
    const { container } = renderCanvas();
    expect(container.querySelector('.react-flow__minimap')).toBeInTheDocument();
  });

  it('renders the controls panel', () => {
    const { container } = renderCanvas();
    expect(container.querySelector('.react-flow__controls')).toBeInTheDocument();
  });

  it('renders the background grid', () => {
    const { container } = renderCanvas();
    expect(container.querySelector('.react-flow__background')).toBeInTheDocument();
  });

  it('canvas fills its container', () => {
    renderCanvas();
    const canvasWrapper = screen.getByTestId('canvas-container');
    expect(canvasWrapper).toHaveClass('h-full');
    expect(canvasWrapper).toHaveClass('w-full');
  });
});
