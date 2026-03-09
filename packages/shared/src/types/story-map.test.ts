import { describe, expect, it } from 'vitest';
import { CreateStoryMapSchema, StoryMapSchema } from './story-map';

describe('StoryMapSchema', () => {
  it('validates a correct story map', () => {
    const valid = {
      id: crypto.randomUUID(),
      title: 'Test Map',
      description: 'Sample description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    expect(StoryMapSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing title', () => {
    const invalid = {
      id: crypto.randomUUID(),
      description: 'Missing title',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    expect(StoryMapSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('CreateStoryMapSchema', () => {
  it('omits id and timestamps', () => {
    const valid = {
      title: 'Test',
      description: ''
    };

    expect(CreateStoryMapSchema.safeParse(valid).success).toBe(true);
    expect(
      CreateStoryMapSchema.safeParse({
        ...valid,
        id: crypto.randomUUID()
      }).success
    ).toBe(false);
  });
});
