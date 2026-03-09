import { describe, expect, it } from 'vitest';
import { exportStoryMap } from './export-service';
import type { StoryMapDetail } from '@story-mapper/shared';

const baseStoryMap: StoryMapDetail = {
  id: '11111111-1111-4111-8111-111111111111',
  title: 'Payment Platform',
  description: 'Manage payments and subscriptions',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  epics: [
    {
      id: 'e1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      title: 'Checkout',
      description: 'Purchase flow',
      color: '#ff0000',
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'e2',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      title: 'Billing',
      description: 'Manage billing',
      color: '#00ff00',
      sortOrder: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  activities: [
    {
      id: 'a1',
      epicId: 'e1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      title: 'Cart',
      description: 'Manage cart items',
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'a2',
      epicId: 'e1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      title: 'Payment',
      description: 'Collect payment details',
      sortOrder: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'a3',
      epicId: 'e2',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      title: 'Invoices',
      description: 'Generate invoices',
      sortOrder: 3,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  stories: [
    {
      id: 's1',
      activityId: 'a1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      releaseId: 'r1',
      title: 'Add item to cart',
      description: 'As a user I can add items',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: 3,
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 's2',
      activityId: 'a1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      releaseId: 'r2',
      title: 'Remove item from cart',
      description: 'As a user I can remove items',
      acceptanceCriteria: '',
      priority: 'should',
      storyPoints: 2,
      sortOrder: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 's3',
      activityId: 'a2',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      releaseId: 'r1',
      title: 'Enter card details',
      description: 'Collect card info',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: 5,
      sortOrder: 3,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 's4',
      activityId: 'a3',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      releaseId: 'r2',
      title: 'View invoices',
      description: 'View invoice history',
      acceptanceCriteria: '',
      priority: 'could',
      storyPoints: 3,
      sortOrder: 4,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 's5',
      activityId: 'a2',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      releaseId: null,
      title: 'Save card for later',
      description: 'Tokenize card',
      acceptanceCriteria: '',
      priority: 'wont',
      storyPoints: null,
      sortOrder: 5,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  releases: [
    {
      id: 'r1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      title: 'v1.0',
      description: 'MVP release',
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'r2',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      title: 'v1.1',
      description: 'Follow up',
      sortOrder: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  technicalRequirements: [
    {
      id: 'tr-1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      sourceStoryIds: ['s1', 's2'],
      title: 'Cart API',
      description: 'API endpoints for cart operations',
      category: 'api',
      priority: 'high',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'tr-2',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      sourceStoryIds: ['s3'],
      title: 'Payments DB schema',
      description: 'Table design for payments',
      category: 'database',
      priority: 'medium',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'tr-3',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      sourceStoryIds: ['s4'],
      title: 'Invoice UI',
      description: 'Frontend invoice listing',
      category: 'frontend',
      priority: 'low',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  functionalRequirements: [
    {
      id: 'fr-1',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      sourceStoryIds: ['s1', 's2'],
      title: 'Users manage cart',
      description: 'Users can add/remove items',
      userRole: 'Shopper',
      category: 'functionality',
      priority: 'high',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'fr-2',
      storyMapId: '11111111-1111-4111-8111-111111111111',
      sourceStoryIds: ['s3'],
      title: 'Payment security',
      description: 'PCI compliance',
      userRole: 'Admin',
      category: 'security',
      priority: 'medium',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

const testDate = new Date('2026-03-09T00:00:00.000Z');

describe('exportStoryMap', () => {
  it('overview export includes all epics and stories', () => {
    const markdown = exportStoryMap(baseStoryMap, 'overview', { date: testDate });
    expect(markdown).toContain('### Epic: Checkout');
    expect(markdown).toContain('### Epic: Billing');
    expect(markdown).toContain('Add item to cart');
    expect(markdown).toContain('Remove item from cart');
    expect(markdown).toContain('| # | Story | Priority | Points | Release |');
  });

  it('technical export groups requirements by category', () => {
    const markdown = exportStoryMap(baseStoryMap, 'technical', { date: testDate });
    expect(markdown).toContain('### Api Requirements');
    expect(markdown).toContain('### Database Requirements');
    expect(markdown).toContain('### Frontend Requirements');
  });

  it('functional export groups by user role', () => {
    const markdown = exportStoryMap(baseStoryMap, 'functional', { date: testDate });
    expect(markdown).toContain('### Shopper');
    expect(markdown).toContain('### Admin');
    expect(markdown).toContain('Users manage cart');
  });

  it('full export includes all sections', () => {
    const markdown = exportStoryMap(baseStoryMap, 'full', { date: testDate });
    expect(markdown).toContain('Story Map Overview');
    expect(markdown).toContain('Technical Requirements');
    expect(markdown).toContain('Functional Requirements');
    expect(markdown).toContain('Table of Contents');
  });

  it('export includes metadata header', () => {
    const markdown = exportStoryMap(baseStoryMap, 'overview', { date: testDate });
    expect(markdown.startsWith('# Payment Platform — Requirements Document')).toBe(true);
    expect(markdown).toContain('Generated on 2026-03-09');
    expect(markdown).toContain('5 Stories');
    expect(markdown).toContain('2 Releases');
  });

  it('release-scoped export only includes stories in that release', () => {
    const markdown = exportStoryMap(baseStoryMap, 'overview', { releaseId: 'r1', date: testDate });
    expect(markdown).toContain('Add item to cart');
    expect(markdown).toContain('Enter card details');
    expect(markdown).not.toContain('Remove item from cart');
    expect(markdown).not.toContain('View invoices');
    expect(markdown).not.toContain('Save card for later');
  });

  it('handles empty story map gracefully', () => {
    const emptyMap: StoryMapDetail = {
      ...baseStoryMap,
      epics: [],
      activities: [],
      stories: [],
      releases: [],
      technicalRequirements: [],
      functionalRequirements: [],
    };
    const markdown = exportStoryMap(emptyMap, 'full', { date: testDate });
    expect(markdown).toContain('No stories available');
    expect(markdown).toContain('No releases defined');
    expect(markdown).toContain('No technical requirements available');
    expect(markdown).toContain('No functional requirements available');
  });
});
