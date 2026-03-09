import { z } from 'zod';

export interface Story {
  id: string;
  activityId: string;
  storyMapId: string;
  releaseId: string | null;
  title: string;
  description: string;
  acceptanceCriteria: string;
  priority: 'must' | 'should' | 'could' | 'wont';
  storyPoints: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const priorityEnum = z.enum(['must', 'should', 'could', 'wont']);

export const StorySchema = z.object({
  id: z.string().uuid(),
  activityId: z.string().uuid(),
  storyMapId: z.string().uuid(),
  releaseId: z.string().uuid().nullable(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  acceptanceCriteria: z.string(),
  priority: priorityEnum,
  storyPoints: z.number().int().nullable(),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

export type CreateStory = Omit<Story, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateStorySchema = StorySchema.omit({ id: true, createdAt: true, updatedAt: true }).strict();

export type UpdateStory = Partial<CreateStory>;
export const UpdateStorySchema = CreateStorySchema.partial().strict();
