import React, { useMemo } from 'react';
import { Story } from '@story-mapper/shared';
import { Handle, NodeProps, Position } from 'reactflow';

type Priority = Story['priority'];
type PriorityStyles = Record<Priority, { badge: string }>;

const priorityStyles: PriorityStyles = {
  must: { badge: 'bg-red-100 text-red-800 border-red-300' },
  should: { badge: 'bg-orange-100 text-orange-800 border-orange-300' },
  could: { badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  wont: { badge: 'bg-gray-100 text-gray-700 border-gray-300' }
};

export const StoryNode: React.FC<NodeProps<Story>> = ({ data, selected }) => {
  const badgeClassName = useMemo(
    () =>
      `inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold uppercase ${
        priorityStyles[data.priority].badge
      }`,
    [data.priority]
  );

  return (
    <div
      className={`relative w-[280px] rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${
        selected ? 'ring-2 ring-indigo-500' : ''
      }`}
      data-testid="story-node"
    >
      <Handle type="target" position={Position.Top} data-testid="target-handle" />
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="text-base font-semibold text-gray-900">{data.title}</div>
          <span className={badgeClassName} data-testid="priority-badge">
            {data.priority.toUpperCase()}
          </span>
        </div>
        <div className="text-sm text-gray-600">{data.description}</div>
        <div className="my-2 border-t border-gray-200" aria-hidden="true" />
        {data.storyPoints !== null && (
          <div className="flex items-center gap-2 text-sm text-gray-700" data-testid="story-points">
            <span aria-hidden="true">📊</span>
            <span>{data.storyPoints} pts</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} data-testid="source-handle" />
    </div>
  );
};
