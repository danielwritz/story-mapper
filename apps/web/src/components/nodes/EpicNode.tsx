import React, { useCallback } from 'react';
import { Epic } from '@story-mapper/shared';
import { Handle, NodeProps, Position } from 'reactflow';
import { useStoryMapStore } from '../../stores/story-map-store';

export type EpicNodeData = Epic & { activityCount?: number };

export const EpicNode: React.FC<NodeProps<EpicNodeData>> = ({ data, selected }) => {
  const activityCount = useStoryMapStore(
    useCallback(
      (state) => data.activityCount ?? state.activities.filter((activity) => activity.epicId === data.id).length,
      [data.activityCount, data.id]
    )
  );

  return (
    <div
      className={`relative w-[280px] rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${
        selected ? 'ring-2 ring-indigo-500' : ''
      }`}
      data-testid="epic-node"
    >
      <div
        className="mb-3 h-2 rounded-md"
        style={{ backgroundColor: data.color }}
        data-testid="epic-header"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <div className="text-base font-semibold text-gray-900">{data.title}</div>
        <div className="text-sm text-gray-600">{data.description}</div>
        <div className="flex items-center gap-2 text-sm text-gray-700" data-testid="epic-activity-count">
          <span aria-hidden="true">●</span>
          <span>
            {activityCount} {activityCount === 1 ? 'activity' : 'activities'}
          </span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} data-testid="target-handle" />
      <Handle type="source" position={Position.Bottom} data-testid="source-handle" />
    </div>
  );
};
