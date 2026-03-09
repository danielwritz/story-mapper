import { z } from 'zod';

const priorityEnum = z.enum(['must', 'should', 'could', 'wont']);

export const StorySchema = z
  .object({
    id: z.string().uuid(),
    activityId: z.string().uuid(),
    storyMapId: z.string().uuid(),
    releaseId: z.string().uuid().nullable(),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    acceptanceCriteria: z.string().optional().default(''),
    priority: priorityEnum,
    storyPoints: z.number().int().nullable(),
    sortOrder: z.number().int(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type Story = z.infer<typeof StorySchema>;

export const CreateStorySchema = StorySchema.pick({
  activityId: true,
  storyMapId: true,
  releaseId: true,
  title: true,
  description: true,
  acceptanceCriteria: true,
  priority: true,
  storyPoints: true,
  sortOrder: true,
}).strict();

export type CreateStory = z.infer<typeof CreateStorySchema>;

export const UpdateStorySchema = CreateStorySchema.partial().strict();

export type UpdateStory = z.infer<typeof UpdateStorySchema>;
