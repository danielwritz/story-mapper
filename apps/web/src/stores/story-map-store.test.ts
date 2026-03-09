import { beforeEach, describe, expect, it } from 'vitest';
import { Story } from '@story-mapper/shared';
import { useStoryMapStore } from './story-map-store';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resetStore = () =>
  useStoryMapStore.setState({
    storyMap: null,
    epics: [],
    activities: [],
    stories: [],
    releases: [],
    selectedNodeId: null
  });

const createStoryPayload = (
  activityId: string,
  storyMapId: string,
  overrides: Partial<Omit<Story, 'id' | 'createdAt' | 'updatedAt'>> = {}
) => ({
  activityId,
  storyMapId,
  releaseId: null,
  title: 'Story',
  description: 'desc',
  acceptanceCriteria: 'criteria',
  priority: 'must' as const,
  storyPoints: 1,
  sortOrder: 0,
  ...overrides
});

const createStoryMap = () => ({
  id: crypto.randomUUID(),
  title: 'Demo Map',
  description: 'Demo',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const setupStoryMap = () => {
  const map = createStoryMap();
  useStoryMapStore.getState().setStoryMap(map);
  return map.id;
};

beforeEach(() => {
  resetStore();
});

describe('initialization', () => {
  it('initializes with null story map and empty arrays', () => {
    const state = useStoryMapStore.getState();
    expect(state.storyMap).toBeNull();
    expect(state.epics).toEqual([]);
    expect(state.activities).toEqual([]);
    expect(state.stories).toEqual([]);
    expect(state.releases).toEqual([]);
    expect(state.selectedNodeId).toBeNull();
  });
});

describe('Epic CRUD', () => {
  it('addEpic creates an epic with UUID and timestamps', () => {
    const storyMapId = setupStoryMap();
    const epic = useStoryMapStore.getState().addEpic({
      storyMapId,
      title: 'User Management',
      description: 'Manage users',
      color: '#123456',
      sortOrder: 0
    });

    const state = useStoryMapStore.getState();
    expect(state.epics).toHaveLength(1);
    expect(epic.id).toMatch(uuidPattern);
    expect(epic.createdAt).toBeTruthy();
    expect(epic.updatedAt).toBeTruthy();
  });

  it('updateEpic modifies the epic and updates timestamp', async () => {
    const storyMapId = setupStoryMap();
    const { addEpic, updateEpic } = useStoryMapStore.getState();
    const epic = addEpic({
      storyMapId,
      title: 'Old',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const previousUpdatedAt = useStoryMapStore.getState().epics[0].updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 10));
    updateEpic(epic.id, { title: 'Updated' });
    const updatedEpic = useStoryMapStore.getState().epics[0];

    expect(updatedEpic.title).toBe('Updated');
    expect(updatedEpic.updatedAt).not.toBe(previousUpdatedAt);
  });

  it('removeEpic deletes the epic and cascades to activities and stories', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    store.addStory({
      activityId: activity.id,
      storyMapId,
      releaseId: null,
      title: 'Story',
      description: '',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: null,
      sortOrder: 0
    });

    store.removeEpic(epic.id);
    const state = useStoryMapStore.getState();
    expect(state.epics).toHaveLength(0);
    expect(state.activities).toHaveLength(0);
    expect(state.stories).toHaveLength(0);
  });
});

describe('Activity CRUD', () => {
  it('addActivity creates an activity linked to an epic', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });

    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 1
    });

    expect(activity.epicId).toBe(epic.id);
    expect(useStoryMapStore.getState().activities).toHaveLength(1);
  });

  it('removeActivity cascades to stories', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    store.addStory({
      activityId: activity.id,
      storyMapId,
      releaseId: null,
      title: 'Story',
      description: '',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: null,
      sortOrder: 0
    });

    store.removeActivity(activity.id);
    const state = useStoryMapStore.getState();
    expect(state.activities).toHaveLength(0);
    expect(state.stories).toHaveLength(0);
    expect(state.epics).toHaveLength(1);
  });
});

describe('Story CRUD', () => {
  it('addStory creates a story with null releaseId by default', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });

    const story = store.addStory(createStoryPayload(activity.id, storyMapId, { releaseId: null }));

    expect(story.releaseId).toBeNull();
    expect(useStoryMapStore.getState().stories).toHaveLength(1);
  });

  it('updateStory modifies story fields', async () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    const story = store.addStory(createStoryPayload(activity.id, storyMapId));
    const previousUpdatedAt = story.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 10));
    store.updateStory(story.id, { title: 'Updated Story' });
    const updatedStory = useStoryMapStore.getState().stories[0];

    expect(updatedStory.title).toBe('Updated Story');
    expect(updatedStory.updatedAt).not.toBe(previousUpdatedAt);
  });

  it('removeStory deletes only the target story', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    const story1 = store.addStory(createStoryPayload(activity.id, storyMapId));
    store.addStory(createStoryPayload(activity.id, storyMapId, { title: 'Second Story', sortOrder: 1 }));

    store.removeStory(story1.id);
    const stories = useStoryMapStore.getState().stories;
    expect(stories).toHaveLength(1);
    expect(stories[0].title).toBe('Second Story');
  });

  it('moveStory changes activityId and sortOrder', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity1 = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity 1',
      description: '',
      sortOrder: 0
    });
    const activity2 = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity 2',
      description: '',
      sortOrder: 1
    });
    const story = store.addStory(createStoryPayload(activity1.id, storyMapId, { sortOrder: 0 }));

    store.moveStory(story.id, activity2.id, 5);
    const updatedStory = useStoryMapStore.getState().stories[0];
    expect(updatedStory.activityId).toBe(activity2.id);
    expect(updatedStory.sortOrder).toBe(5);
  });

  it('moveStoryToRelease assigns story to a release', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    const story = store.addStory(createStoryPayload(activity.id, storyMapId, { releaseId: null }));
    const release = store.addRelease({
      storyMapId,
      title: 'Release 1',
      description: '',
      sortOrder: 0
    });

    store.moveStoryToRelease(story.id, release.id);
    expect(useStoryMapStore.getState().stories[0].releaseId).toBe(release.id);
  });

  it('moveStoryToRelease with null unassigns from release', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    const story = store.addStory(createStoryPayload(activity.id, storyMapId, { releaseId: null }));
    const release = store.addRelease({
      storyMapId,
      title: 'Release 1',
      description: '',
      sortOrder: 0
    });

    store.moveStoryToRelease(story.id, release.id);
    store.moveStoryToRelease(story.id, null);
    expect(useStoryMapStore.getState().stories[0].releaseId).toBeNull();
  });
});

describe('Release CRUD', () => {
  it('addRelease creates a release', () => {
    const storyMapId = setupStoryMap();
    const release = useStoryMapStore.getState().addRelease({
      storyMapId,
      title: 'Release 1',
      description: 'First',
      sortOrder: 0
    });

    expect(release.id).toMatch(uuidPattern);
    expect(useStoryMapStore.getState().releases).toHaveLength(1);
  });

  it('removeRelease nullifies releaseId on assigned stories', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    const release = store.addRelease({
      storyMapId,
      title: 'Release 1',
      description: '',
      sortOrder: 0
    });
    store.addStory(createStoryPayload(activity.id, storyMapId, { releaseId: release.id }));

    store.removeRelease(release.id);
    expect(useStoryMapStore.getState().stories[0].releaseId).toBeNull();
  });
});

describe('Selection', () => {
  it('selectNode sets selectedNodeId', () => {
    useStoryMapStore.getState().selectNode('node-1');
    expect(useStoryMapStore.getState().selectedNodeId).toBe('node-1');
  });

  it('clearSelection resets to null', () => {
    useStoryMapStore.getState().selectNode('node-1');
    useStoryMapStore.getState().clearSelection();
    expect(useStoryMapStore.getState().selectedNodeId).toBeNull();
  });
});

describe('Bulk operations', () => {
  it('loadStoryMap populates all arrays', () => {
    const storyMap = createStoryMap();
    const epic = {
      id: crypto.randomUUID(),
      storyMapId: storyMap.id,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const activity = {
      id: crypto.randomUUID(),
      epicId: epic.id,
      storyMapId: storyMap.id,
      title: 'Activity',
      description: '',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const story = {
      id: crypto.randomUUID(),
      activityId: activity.id,
      storyMapId: storyMap.id,
      releaseId: null as string | null,
      title: 'Story',
      description: '',
      acceptanceCriteria: '',
      priority: 'must' as const,
      storyPoints: null,
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const release = {
      id: crypto.randomUUID(),
      storyMapId: storyMap.id,
      title: 'Release',
      description: '',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    useStoryMapStore.getState().loadStoryMap({
      storyMap,
      epics: [epic],
      activities: [activity],
      stories: [story],
      releases: [release]
    });

    const state = useStoryMapStore.getState();
    expect(state.storyMap).toEqual(storyMap);
    expect(state.epics).toHaveLength(1);
    expect(state.activities).toHaveLength(1);
    expect(state.stories).toHaveLength(1);
    expect(state.releases).toHaveLength(1);
    expect(state.selectedNodeId).toBeNull();
  });

  it('clearAll resets everything to initial state', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    store.addStory({
      activityId: activity.id,
      storyMapId,
      releaseId: null,
      title: 'Story',
      description: '',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: null,
      sortOrder: 0
    });

    store.clearSelection();
    store.clearAll();

    const state = useStoryMapStore.getState();
    expect(state.storyMap).toBeNull();
    expect(state.epics).toHaveLength(0);
    expect(state.activities).toHaveLength(0);
    expect(state.stories).toHaveLength(0);
    expect(state.releases).toHaveLength(0);
    expect(state.selectedNodeId).toBeNull();
  });
});

describe('React Flow data', () => {
  it('getNodes returns epics, activities, and stories with positions', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 1
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 2
    });
    const story = store.addStory({
      activityId: activity.id,
      storyMapId,
      releaseId: null,
      title: 'Story',
      description: '',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: null,
      sortOrder: 3
    });

    const nodes = useStoryMapStore.getState().getNodes();
    expect(nodes.map((node) => node.id)).toEqual([epic.id, activity.id, story.id]);
    expect(nodes.find((node) => node.id === epic.id)?.position.y).toBe(0);
    expect(nodes.find((node) => node.id === activity.id)?.position.y).toBe(150);
    expect(nodes.find((node) => node.id === story.id)?.position.y).toBeGreaterThanOrEqual(300);
  });

  it('getEdges returns epic->activity and activity->story edges', () => {
    const storyMapId = setupStoryMap();
    const store = useStoryMapStore.getState();
    const epic = store.addEpic({
      storyMapId,
      title: 'Epic',
      description: '',
      color: '#123456',
      sortOrder: 0
    });
    const activity = store.addActivity({
      epicId: epic.id,
      storyMapId,
      title: 'Activity',
      description: '',
      sortOrder: 0
    });
    const story = store.addStory({
      activityId: activity.id,
      storyMapId,
      releaseId: null,
      title: 'Story',
      description: '',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: null,
      sortOrder: 0
    });

    const edges = useStoryMapStore.getState().getEdges();
    expect(edges).toEqual([
      { id: `edge-epic-${activity.id}`, source: epic.id, target: activity.id },
      { id: `edge-activity-${story.id}`, source: activity.id, target: story.id }
    ]);
  });
});
