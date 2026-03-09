import { z } from 'zod';

import type { RequirementPriority } from './technical-requirement';

export type FunctionalRequirementCategory =
  | 'usability'
  | 'functionality'
  | 'performance'
  | 'accessibility'
  | 'data';

export interface FunctionalRequirement {
  id: string;
  storyMapId: string;
  sourceStoryIds: string[];
  title: string;
  description: string;
  userRole: string;
  category: FunctionalRequirementCategory;
  priority: RequirementPriority;
  createdAt: string;
  updatedAt: string;
}

const baseFunctionalRequirementSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  sourceStoryIds: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  userRole: z.string(),
  category: z.enum(['usability', 'functionality', 'performance', 'accessibility', 'data']),
  priority: z.enum(['high', 'medium', 'low']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const FunctionalRequirementSchema = baseFunctionalRequirementSchema.strict();

export type CreateFunctionalRequirement = Omit<
  FunctionalRequirement,
  'id' | 'createdAt' | 'updatedAt'
>;
export const CreateFunctionalRequirementSchema = FunctionalRequirementSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strict();

export type UpdateFunctionalRequirement = Partial<CreateFunctionalRequirement>;
export const UpdateFunctionalRequirementSchema = CreateFunctionalRequirementSchema.partial();
