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

export type CreateEpic = Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEpic = Partial<CreateEpic>;

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export const EpicSchema = z
  .object({
    id: z.string().uuid(),
    storyMapId: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    color: z.string().regex(hexColorPattern, { message: 'Invalid hex color' }),
    sortOrder: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict();

export const CreateEpicSchema = EpicSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export const UpdateEpicSchema = CreateEpicSchema.partial().strict();
