import { z } from 'zod';

export interface Activity {
  id: string;
  epicId: string;
  storyMapId: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateActivity = Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateActivity = Partial<CreateActivity>;

export const ActivitySchema = z
  .object({
    id: z.string().uuid(),
    epicId: z.string().uuid(),
    storyMapId: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    sortOrder: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict();

export const CreateActivitySchema = ActivitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export const UpdateActivitySchema = CreateActivitySchema.partial().strict();
