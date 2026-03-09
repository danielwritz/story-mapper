import { NodeTypes } from 'reactflow';
import { ActivityNode } from './ActivityNode';
import { EpicNode } from './EpicNode';
import { StoryNode } from './StoryNode';

export const nodeTypes: NodeTypes = {
  epic: EpicNode,
  activity: ActivityNode,
  story: StoryNode
};
