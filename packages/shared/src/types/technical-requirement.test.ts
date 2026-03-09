import { describe, expect, it } from 'vitest';
import { TechnicalRequirementSchema } from './technical-requirement';

describe('TechnicalRequirementSchema', () => {
  const base = {
    id: '623e4567-e89b-12d3-a456-426614174000',
    storyMapId: '223e4567-e89b-12d3-a456-426614174000',
    sourceStoryIds: [],
    title: 'API requirement',
    description: 'Do something',
    category: 'api' as const,
    priority: 'medium' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('validates category enum', () => {
    const categories = ['api', 'database', 'frontend', 'infrastructure', 'integration', 'security'] as const;
    categories.forEach(category => {
      expect(TechnicalRequirementSchema.safeParse({ ...base, category }).success).toBe(true);
    });
    expect(TechnicalRequirementSchema.safeParse({ ...base, category: 'invalid' as never }).success).toBe(false);
  });

  it('validates sourceStoryIds as array of strings', () => {
    expect(TechnicalRequirementSchema.safeParse({ ...base, sourceStoryIds: ['id1', 'id2'] }).success).toBe(true);
    expect(TechnicalRequirementSchema.safeParse({ ...base, sourceStoryIds: [123] as never }).success).toBe(false);
  });
});
