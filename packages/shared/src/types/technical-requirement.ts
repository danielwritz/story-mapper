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

const categoryEnum = z.enum(['api', 'database', 'frontend', 'infrastructure', 'integration', 'security']);
const priorityEnum = z.enum(['high', 'medium', 'low']);

export const TechnicalRequirementSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  sourceStoryIds: z.array(z.string()),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  category: categoryEnum,
  priority: priorityEnum,
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

export type CreateTechnicalRequirement = Omit<TechnicalRequirement, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateTechnicalRequirementSchema = TechnicalRequirementSchema.omit({ id: true, createdAt: true, updatedAt: true }).strict();

export type UpdateTechnicalRequirement = Partial<CreateTechnicalRequirement>;
export const UpdateTechnicalRequirementSchema = CreateTechnicalRequirementSchema.partial().strict();
