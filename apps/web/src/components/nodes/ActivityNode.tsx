import React, { useCallback } from 'react';
import { Activity } from '@story-mapper/shared';
import { Handle, NodeProps, Position } from 'reactflow';
import { useStoryMapStore } from '../../stores/story-map-store';

export type ActivityNodeData = Activity & { storyCount?: number };

export const ActivityNode: React.FC<NodeProps<ActivityNodeData>> = ({ data, selected }) => {
  const storyCount = useStoryMapStore(
    useCallback(
      (state) => data.storyCount ?? state.stories.filter((story) => story.activityId === data.id).length,
      [data.id, data.storyCount]
    )
  );

  return (
    <div
      className={`relative w-[280px] rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${
        selected ? 'ring-2 ring-indigo-500' : ''
      }`}
      data-testid="activity-node"
    >
      <Handle type="target" position={Position.Top} data-testid="target-handle" />
      <div className="space-y-2">
        <div className="text-base font-semibold text-gray-900">{data.title}</div>
        <div className="text-sm text-gray-600">{data.description}</div>
        <div className="flex items-center gap-2 text-sm text-gray-700" data-testid="activity-story-count">
          <span aria-hidden="true">📋</span>
          <span>
            {storyCount} {storyCount === 1 ? 'story' : 'stories'}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} data-testid="source-handle" />
    </div>
  );
};
