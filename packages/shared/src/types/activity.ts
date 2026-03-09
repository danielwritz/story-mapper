import { z } from 'zod';

export const ActivitySchema = z
  .object({
    id: z.string().uuid(),
    epicId: z.string().uuid(),
    storyMapId: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    sortOrder: z.number().int(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type Activity = z.infer<typeof ActivitySchema>;

export const CreateActivitySchema = ActivitySchema.pick({
  epicId: true,
  storyMapId: true,
  title: true,
  description: true,
  sortOrder: true,
}).strict();

export type CreateActivity = z.infer<typeof CreateActivitySchema>;

export const UpdateActivitySchema = CreateActivitySchema.partial().strict();

export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;
