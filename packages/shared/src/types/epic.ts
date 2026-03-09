import { z } from 'zod';

const hexColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export const EpicSchema = z
  .object({
    id: z.string().uuid(),
    storyMapId: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    color: z.string().regex(hexColor),
    sortOrder: z.number().int(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type Epic = z.infer<typeof EpicSchema>;

export const CreateEpicSchema = EpicSchema.pick({
  storyMapId: true,
  title: true,
  description: true,
  color: true,
  sortOrder: true,
}).strict();

export type CreateEpic = z.infer<typeof CreateEpicSchema>;

export const UpdateEpicSchema = CreateEpicSchema.partial().strict();

export type UpdateEpic = z.infer<typeof UpdateEpicSchema>;
