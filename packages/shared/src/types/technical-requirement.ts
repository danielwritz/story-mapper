import { z } from 'zod';

export interface TechnicalRequirement {
  id: string;
  storyMapId: string;
  sourceStoryIds: string[];
  title: string;
  description: string;
  category: 'api' | 'database' | 'frontend' | 'infrastructure' | 'integration' | 'security';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export type CreateTechnicalRequirement = Omit<TechnicalRequirement, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTechnicalRequirement = Partial<CreateTechnicalRequirement>;

export const TechnicalRequirementSchema = z
  .object({
    id: z.string().uuid(),
    storyMapId: z.string().uuid(),
    sourceStoryIds: z.array(z.string().uuid()),
    title: z.string(),
    description: z.string(),
    category: z.enum(['api', 'database', 'frontend', 'infrastructure', 'integration', 'security']),
    priority: z.enum(['high', 'medium', 'low']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict();

export const CreateTechnicalRequirementSchema = TechnicalRequirementSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export const UpdateTechnicalRequirementSchema = CreateTechnicalRequirementSchema.partial().strict();
