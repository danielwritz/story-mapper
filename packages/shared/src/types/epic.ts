import { z } from 'zod';

export interface Epic {
  id: string;
  storyMapId: string;
  title: string;
  description: string;
  color: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const hexColorPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const EpicSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  color: z.string().regex(hexColorPattern, 'Invalid hex color'),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

export type CreateEpic = Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateEpicSchema = EpicSchema.omit({ id: true, createdAt: true, updatedAt: true }).strict();

export type UpdateEpic = Partial<CreateEpic>;
export const UpdateEpicSchema = CreateEpicSchema.partial().strict();
