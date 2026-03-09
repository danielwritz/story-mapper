import { z } from 'zod';

export interface StoryMap {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateStoryMap = Omit<StoryMap, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStoryMap = Partial<CreateStoryMap>;

export const StoryMapSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict();

export const CreateStoryMapSchema = StoryMapSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export const UpdateStoryMapSchema = CreateStoryMapSchema.partial().strict();
