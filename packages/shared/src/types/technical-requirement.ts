import { z } from 'zod';

export type TechnicalRequirementCategory =
  | 'api'
  | 'database'
  | 'frontend'
  | 'infrastructure'
  | 'integration'
  | 'security';

export type RequirementPriority = 'high' | 'medium' | 'low';

export interface TechnicalRequirement {
  id: string;
  storyMapId: string;
  sourceStoryIds: string[];
  title: string;
  description: string;
  category: TechnicalRequirementCategory;
  priority: RequirementPriority;
  createdAt: string;
  updatedAt: string;
}

const baseTechnicalRequirementSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  sourceStoryIds: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  category: z.enum(['api', 'database', 'frontend', 'infrastructure', 'integration', 'security']),
  priority: z.enum(['high', 'medium', 'low']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const TechnicalRequirementSchema = baseTechnicalRequirementSchema.strict();

export type CreateTechnicalRequirement = Omit<
  TechnicalRequirement,
  'id' | 'createdAt' | 'updatedAt'
>;
export const CreateTechnicalRequirementSchema = TechnicalRequirementSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export type UpdateTechnicalRequirement = Partial<CreateTechnicalRequirement>;
export const UpdateTechnicalRequirementSchema = CreateTechnicalRequirementSchema.partial();
