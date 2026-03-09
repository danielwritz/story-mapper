import { z } from 'zod';

export const StoryMapSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type StoryMap = z.infer<typeof StoryMapSchema>;

export const CreateStoryMapSchema = StoryMapSchema.pick({
  title: true,
  description: true,
}).strict();

export type CreateStoryMap = z.infer<typeof CreateStoryMapSchema>;

export const UpdateStoryMapSchema = CreateStoryMapSchema.partial().strict();

export type UpdateStoryMap = z.infer<typeof UpdateStoryMapSchema>;
