import { z } from 'zod';

export type StoryPriority = 'must' | 'should' | 'could' | 'wont';

export interface Story {
  id: string;
  activityId: string;
  storyMapId: string;
  releaseId: string | null;
  title: string;
  description: string;
  acceptanceCriteria: string;
  priority: StoryPriority;
  storyPoints: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const baseStorySchema = z.object({
  id: z.string().uuid(),
  activityId: z.string().uuid(),
  storyMapId: z.string().uuid(),
  releaseId: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.string(),
  priority: z.enum(['must', 'should', 'could', 'wont']),
  storyPoints: z.number().nullable(),
  sortOrder: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const StorySchema = baseStorySchema.strict();

export type CreateStory = Omit<Story, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateStorySchema = StorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export type UpdateStory = Partial<CreateStory>;
export const UpdateStorySchema = CreateStorySchema.partial();
