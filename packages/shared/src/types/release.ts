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

const baseReleaseSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  sortOrder: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const ReleaseSchema = baseReleaseSchema.strict();

export type CreateRelease = Omit<Release, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateReleaseSchema = ReleaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export type UpdateRelease = Partial<CreateRelease>;
export const UpdateReleaseSchema = CreateReleaseSchema.partial();
