import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReactFlowProvider, type NodeProps } from 'reactflow';
import { ActivityNode, type ActivityNodeData } from './ActivityNode';

const createActivityData = (overrides: Partial<ActivityNodeData> = {}): ActivityNodeData => ({
  id: 'activity-1',
  epicId: 'epic-1',
  storyMapId: 'map-1',
  title: 'Authentication',
  description: 'Login and registration',
  sortOrder: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides
});

const createProps = (
  data: ActivityNodeData,
  overrides: Partial<NodeProps<ActivityNodeData>> = {}
): NodeProps<ActivityNodeData> => ({
  id: data.id,
  data,
  selected: false,
  dragging: false,
  isConnectable: true,
  xPos: 0,
  yPos: 0,
  zIndex: 0,
  type: 'activity',
  ...overrides
});

const renderActivityNode = (data: ActivityNodeData = createActivityData()) =>
  render(
    <ReactFlowProvider>
      <ActivityNode {...createProps(data)} />
    </ReactFlowProvider>
  );

describe('ActivityNode', () => {
  it('renders activity title', () => {
    renderActivityNode();
    expect(screen.getByText('Authentication')).toBeInTheDocument();
  });

  it('renders story count', () => {
    renderActivityNode(createActivityData({ storyCount: 5 }));
    expect(screen.getByText('5 stories')).toBeInTheDocument();
  });

  it('has both source and target handles', () => {
    renderActivityNode();
    expect(screen.getByTestId('target-handle')).toBeInTheDocument();
    expect(screen.getByTestId('source-handle')).toBeInTheDocument();
  });
});
