import { z } from 'zod';

const technicalCategoryEnum = z.enum([
  'api',
  'database',
  'frontend',
  'infrastructure',
  'integration',
  'security',
]);

const priorityEnum = z.enum(['high', 'medium', 'low']);

export const TechnicalRequirementSchema = z
  .object({
    id: z.string().uuid(),
    storyMapId: z.string().uuid(),
    sourceStoryIds: z.array(z.string().uuid()),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    category: technicalCategoryEnum,
    priority: priorityEnum,
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type TechnicalRequirement = z.infer<typeof TechnicalRequirementSchema>;

export const CreateTechnicalRequirementSchema = TechnicalRequirementSchema.pick({
  storyMapId: true,
  sourceStoryIds: true,
  title: true,
  description: true,
  category: true,
  priority: true,
}).strict();

export type CreateTechnicalRequirement = z.infer<typeof CreateTechnicalRequirementSchema>;

export const UpdateTechnicalRequirementSchema = CreateTechnicalRequirementSchema.partial().strict();

export type UpdateTechnicalRequirement = z.infer<typeof UpdateTechnicalRequirementSchema>;
