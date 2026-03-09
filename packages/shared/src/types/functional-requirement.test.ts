import { describe, expect, it } from 'vitest';
import { FunctionalRequirementSchema } from './functional-requirement';

describe('FunctionalRequirementSchema', () => {
  const base = {
    id: '723e4567-e89b-12d3-a456-426614174000',
    storyMapId: '223e4567-e89b-12d3-a456-426614174000',
    sourceStoryIds: [],
    title: 'Requirement',
    description: 'User-facing requirement',
    userRole: 'admin',
    category: 'usability' as const,
    priority: 'medium' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('validates all fields', () => {
    expect(FunctionalRequirementSchema.safeParse(base).success).toBe(true);
  });

  it('validates category enum', () => {
    const categories = ['usability', 'functionality', 'performance', 'accessibility', 'data'] as const;
    categories.forEach(category => {
      expect(FunctionalRequirementSchema.safeParse({ ...base, category }).success).toBe(true);
    });
    expect(FunctionalRequirementSchema.safeParse({ ...base, category: 'invalid' as never }).success).toBe(false);
  });
});
