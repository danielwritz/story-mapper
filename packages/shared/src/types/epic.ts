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

const hexColorRegex = /^#[0-9a-fA-F]{6}$/;

const baseEpicSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  color: z.string().regex(hexColorRegex),
  sortOrder: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const EpicSchema = baseEpicSchema.strict();

export type CreateEpic = Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateEpicSchema = EpicSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export type UpdateEpic = Partial<CreateEpic>;
export const UpdateEpicSchema = CreateEpicSchema.partial();
