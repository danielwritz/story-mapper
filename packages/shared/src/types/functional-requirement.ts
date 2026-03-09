import { z } from 'zod';

const priorityEnum = z.enum(['high', 'medium', 'low']);

export const FunctionalRequirementSchema = z
  .object({
    id: z.string().uuid(),
    storyMapId: z.string().uuid(),
    sourceStoryIds: z.array(z.string().uuid()),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    userRole: z.string().min(1),
    category: z.enum(['usability', 'functionality', 'performance', 'accessibility', 'data']),
    priority: priorityEnum,
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type FunctionalRequirement = z.infer<typeof FunctionalRequirementSchema>;

export const CreateFunctionalRequirementSchema = FunctionalRequirementSchema.pick({
  storyMapId: true,
  sourceStoryIds: true,
  title: true,
  description: true,
  userRole: true,
  category: true,
  priority: true,
}).strict();

export type CreateFunctionalRequirement = z.infer<typeof CreateFunctionalRequirementSchema>;

export const UpdateFunctionalRequirementSchema = CreateFunctionalRequirementSchema.partial().strict();

export type UpdateFunctionalRequirement = z.infer<typeof UpdateFunctionalRequirementSchema>;
