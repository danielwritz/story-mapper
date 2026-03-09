import { z } from 'zod';

export interface StoryMap {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const StoryMapSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

export type CreateStoryMap = Omit<StoryMap, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateStoryMapSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().default('')
}).strict();

export type UpdateStoryMap = Partial<CreateStoryMap>;
export const UpdateStoryMapSchema = CreateStoryMapSchema.partial().strict();
