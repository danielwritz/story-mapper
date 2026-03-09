import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReactFlowProvider, type NodeProps } from 'reactflow';
import { StoryNode } from './StoryNode';
import type { Story } from '@story-mapper/shared';

const createStoryData = (overrides: Partial<Story> = {}): Story => ({
  id: 'story-1',
  activityId: 'activity-1',
  storyMapId: 'map-1',
  releaseId: null,
  title: 'As a user I can log in',
  description: 'Implement login functionality',
  acceptanceCriteria: 'AC',
  priority: 'must',
  storyPoints: 5,
  sortOrder: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides
});

const createProps = (data: Story, overrides: Partial<NodeProps<Story>> = {}): NodeProps<Story> => ({
  id: data.id,
  data,
  selected: false,
  dragging: false,
  isConnectable: true,
  xPos: 0,
  yPos: 0,
  zIndex: 0,
  type: 'story',
  ...overrides
});

const renderStoryNode = (data: Story = createStoryData()) =>
  render(
    <ReactFlowProvider>
      <StoryNode {...createProps(data)} />
    </ReactFlowProvider>
  );

describe('StoryNode', () => {
  it('renders story title', () => {
    renderStoryNode();
    expect(screen.getByText('As a user I can log in')).toBeInTheDocument();
  });

  it('renders priority badge with correct color', () => {
    const { rerender } = renderStoryNode(createStoryData({ priority: 'must' }));
    expect(screen.getByTestId('priority-badge')).toHaveClass('bg-red-100');

    rerender(
      <ReactFlowProvider>
        <StoryNode {...createProps(createStoryData({ priority: 'could' }))} />
      </ReactFlowProvider>
    );
    expect(screen.getByTestId('priority-badge')).toHaveClass('bg-blue-100');
  });

  it('renders story points when present', () => {
    renderStoryNode(createStoryData({ storyPoints: 8 }));
    expect(screen.getByText('8 pts')).toBeInTheDocument();
  });

  it('hides story points when null', () => {
    renderStoryNode(createStoryData({ storyPoints: null }));
    expect(screen.queryByText(/pts/)).not.toBeInTheDocument();
  });

  it('has target handle at top', () => {
    renderStoryNode();
    expect(screen.getByTestId('target-handle')).toBeInTheDocument();
  });
});
