import { z } from 'zod';

export interface FunctionalRequirement {
  id: string;
  storyMapId: string;
  sourceStoryIds: string[];
  title: string;
  description: string;
  userRole: string;
  category: 'usability' | 'functionality' | 'performance' | 'accessibility' | 'data';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export type CreateFunctionalRequirement = Omit<FunctionalRequirement, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFunctionalRequirement = Partial<CreateFunctionalRequirement>;

export const FunctionalRequirementSchema = z
  .object({
    id: z.string().uuid(),
    storyMapId: z.string().uuid(),
    sourceStoryIds: z.array(z.string().uuid()),
    title: z.string(),
    description: z.string(),
    userRole: z.string(),
    category: z.enum(['usability', 'functionality', 'performance', 'accessibility', 'data']),
    priority: z.enum(['high', 'medium', 'low']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict();

export const CreateFunctionalRequirementSchema = FunctionalRequirementSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export const UpdateFunctionalRequirementSchema = CreateFunctionalRequirementSchema.partial().strict();
