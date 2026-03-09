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

const categoryEnum = z.enum(['usability', 'functionality', 'performance', 'accessibility', 'data']);
const priorityEnum = z.enum(['high', 'medium', 'low']);

export const FunctionalRequirementSchema = z.object({
  id: z.string().uuid(),
  storyMapId: z.string().uuid(),
  sourceStoryIds: z.array(z.string()),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  userRole: z.string(),
  category: categoryEnum,
  priority: priorityEnum,
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

export type CreateFunctionalRequirement = Omit<FunctionalRequirement, 'id' | 'createdAt' | 'updatedAt'>;
export const CreateFunctionalRequirementSchema = FunctionalRequirementSchema.omit({ id: true, createdAt: true, updatedAt: true }).strict();

export type UpdateFunctionalRequirement = Partial<CreateFunctionalRequirement>;
export const UpdateFunctionalRequirementSchema = CreateFunctionalRequirementSchema.partial().strict();
