import { z } from 'zod';

export interface Release {
  id: string;
  storyMapId: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const ReleaseSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

export type CreateRelease = Omit<Release, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateReleaseSchema = ReleaseSchema.omit({ id: true, createdAt: true, updatedAt: true }).strict();

export type UpdateRelease = Partial<CreateRelease>;
export const UpdateReleaseSchema = CreateReleaseSchema.partial().strict();
