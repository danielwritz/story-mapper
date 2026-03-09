import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReactFlowProvider, type NodeProps } from 'reactflow';
import { EpicNode, type EpicNodeData } from './EpicNode';

const createEpicData = (overrides: Partial<EpicNodeData> = {}): EpicNodeData => ({
  id: 'epic-1',
  storyMapId: 'map-1',
  title: 'User Management',
  description: 'Handle users',
  color: '#6366f1',
  sortOrder: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides
});

const createProps = (data: EpicNodeData, overrides: Partial<NodeProps<EpicNodeData>> = {}): NodeProps<EpicNodeData> => ({
  id: data.id,
  data,
  selected: false,
  dragging: false,
  isConnectable: true,
  xPos: 0,
  yPos: 0,
  zIndex: 0,
  type: 'epic',
  ...overrides
});

const renderEpicNode = (data: EpicNodeData = createEpicData()) =>
  render(
    <ReactFlowProvider>
      <EpicNode {...createProps(data)} />
    </ReactFlowProvider>
  );

describe('EpicNode', () => {
  it('renders epic title', () => {
    renderEpicNode();
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('renders colored header with epic color', () => {
    const data = createEpicData({ color: '#6366f1' });
    renderEpicNode(data);
    expect(screen.getByTestId('epic-header')).toHaveStyle({ backgroundColor: '#6366f1' });
  });

  it('renders description preview', () => {
    renderEpicNode();
    expect(screen.getByText('Handle users')).toBeInTheDocument();
  });

  it('has source handle at bottom', () => {
    renderEpicNode();
    expect(screen.getByTestId('source-handle')).toBeInTheDocument();
  });
});
