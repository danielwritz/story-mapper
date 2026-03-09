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

export type CreateStory = Omit<Story, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStory = Partial<CreateStory>;

export const StorySchema = z
  .object({
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
  })
  .strict();

export const CreateStorySchema = StorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export const UpdateStorySchema = CreateStorySchema.partial().strict();
