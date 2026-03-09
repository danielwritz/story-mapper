import { z } from 'zod';

export const ReleaseSchema = z
  .object({
    id: z.string().uuid(),
    storyMapId: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    sortOrder: z.number().int(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type Release = z.infer<typeof ReleaseSchema>;

export const CreateReleaseSchema = ReleaseSchema.pick({
  storyMapId: true,
  title: true,
  description: true,
  sortOrder: true,
}).strict();

export type CreateRelease = z.infer<typeof CreateReleaseSchema>;

export const UpdateReleaseSchema = CreateReleaseSchema.partial().strict();

export type UpdateRelease = z.infer<typeof UpdateReleaseSchema>;
