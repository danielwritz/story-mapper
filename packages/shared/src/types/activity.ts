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

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  epicId: z.string().uuid(),
  storyMapId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

export type CreateActivity = Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateActivitySchema = ActivitySchema.omit({ id: true, createdAt: true, updatedAt: true }).strict();

export type UpdateActivity = Partial<CreateActivity>;
export const UpdateActivitySchema = CreateActivitySchema.partial().strict();
