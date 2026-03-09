import { Activity, CreateActivity, CreateEpic, CreateRelease, CreateStory, Epic, Release, Story, StoryMap, UpdateActivity, UpdateEpic, UpdateRelease, UpdateStory, UpdateStoryMap } from '@story-mapper/shared';
import { Edge, Node } from 'reactflow';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const now = () => new Date().toISOString();
const STORY_Y_OFFSET = 300;
const ACTIVITY_Y = 150;
const EPIC_Y = 0;
const X_SPACING = 300;
const STORY_VERTICAL_SPACING = 120;

const dataReset = {
  storyMap: null as StoryMap | null,
  epics: [] as Epic[],
  activities: [] as Activity[],
  stories: [] as Story[],
  releases: [] as Release[],
  selectedNodeId: null as string | null
};

export interface StoryMapState extends typeof dataReset {
  setStoryMap: (map: StoryMap) => void;
  updateStoryMap: (updates: UpdateStoryMap) => void;
  addEpic: (data: CreateEpic) => Epic;
  updateEpic: (id: string, updates: UpdateEpic) => void;
  removeEpic: (id: string) => void;
  addActivity: (data: CreateActivity) => Activity;
  updateActivity: (id: string, updates: UpdateActivity) => void;
  removeActivity: (id: string) => void;
  addStory: (data: CreateStory) => Story;
  updateStory: (id: string, updates: UpdateStory) => void;
  removeStory: (id: string) => void;
  moveStory: (storyId: string, newActivityId: string, newSortOrder: number) => void;
  moveStoryToRelease: (storyId: string, releaseId: string | null) => void;
  addRelease: (data: CreateRelease) => Release;
  updateRelease: (id: string, updates: UpdateRelease) => void;
  removeRelease: (id: string) => void;
  selectNode: (id: string) => void;
  clearSelection: () => void;
  loadStoryMap: (data: {
    storyMap: StoryMap;
    epics: Epic[];
    activities: Activity[];
    stories: Story[];
    releases: Release[];
  }) => void;
  clearAll: () => void;
  getNodes: () => Node[];
  getEdges: () => Edge[];
}

const touchStoryMap = (state: StoryMapState, timestamp: string) => {
  if (state.storyMap) {
    state.storyMap.updatedAt = timestamp;
  }
};

export const useStoryMapStore = create<StoryMapState>()(
  immer((set, get) => ({
    ...dataReset,
    setStoryMap: (map) =>
      set((state) => {
        state.storyMap = { ...map, updatedAt: now() };
      }),
    updateStoryMap: (updates) =>
      set((state) => {
        if (!state.storyMap) return;
        Object.assign(state.storyMap, updates);
        state.storyMap.updatedAt = now();
      }),
    addEpic: (data) => {
      const timestamp = now();
      const epic: Epic = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp
      };

      set((state) => {
        state.epics.push(epic);
        touchStoryMap(state, timestamp);
      });

      return epic;
    },
    updateEpic: (id, updates) =>
      set((state) => {
        const epic = state.epics.find((item) => item.id === id);
        if (!epic) return;
        Object.assign(epic, updates);
        epic.updatedAt = now();
        touchStoryMap(state, epic.updatedAt);
      }),
    removeEpic: (id) =>
      set((state) => {
        const removedActivityIds = state.activities.filter((activity) => activity.epicId === id).map((activity) => activity.id);
        state.epics = state.epics.filter((epic) => epic.id !== id);
        state.activities = state.activities.filter((activity) => activity.epicId !== id);
        state.stories = state.stories.filter((story) => !removedActivityIds.includes(story.activityId));
        touchStoryMap(state, now());
      }),
    addActivity: (data) => {
      const timestamp = now();
      const activity: Activity = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp
      };

      set((state) => {
        state.activities.push(activity);
        touchStoryMap(state, timestamp);
      });

      return activity;
    },
    updateActivity: (id, updates) =>
      set((state) => {
        const activity = state.activities.find((item) => item.id === id);
        if (!activity) return;
        Object.assign(activity, updates);
        activity.updatedAt = now();
        touchStoryMap(state, activity.updatedAt);
      }),
    removeActivity: (id) =>
      set((state) => {
        state.activities = state.activities.filter((activity) => activity.id !== id);
        state.stories = state.stories.filter((story) => story.activityId !== id);
        touchStoryMap(state, now());
      }),
    addStory: (data) => {
      const timestamp = now();
      const story: Story = {
        ...data,
        id: crypto.randomUUID(),
        releaseId: data.releaseId ?? null,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      set((state) => {
        state.stories.push(story);
        touchStoryMap(state, timestamp);
      });

      return story;
    },
    updateStory: (id, updates) =>
      set((state) => {
        const story = state.stories.find((item) => item.id === id);
        if (!story) return;
        Object.assign(story, updates);
        story.updatedAt = now();
        touchStoryMap(state, story.updatedAt);
      }),
    removeStory: (id) =>
      set((state) => {
        state.stories = state.stories.filter((story) => story.id !== id);
        touchStoryMap(state, now());
      }),
    moveStory: (storyId, newActivityId, newSortOrder) =>
      set((state) => {
        const story = state.stories.find((item) => item.id === storyId);
        if (!story) return;
        story.activityId = newActivityId;
        story.sortOrder = newSortOrder;
        story.updatedAt = now();
        touchStoryMap(state, story.updatedAt);
      }),
    moveStoryToRelease: (storyId, releaseId) =>
      set((state) => {
        const story = state.stories.find((item) => item.id === storyId);
        if (!story) return;
        story.releaseId = releaseId;
        story.updatedAt = now();
        touchStoryMap(state, story.updatedAt);
      }),
    addRelease: (data) => {
      const timestamp = now();
      const release: Release = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp
      };

      set((state) => {
        state.releases.push(release);
        touchStoryMap(state, timestamp);
      });

      return release;
    },
    updateRelease: (id, updates) =>
      set((state) => {
        const release = state.releases.find((item) => item.id === id);
        if (!release) return;
        Object.assign(release, updates);
        release.updatedAt = now();
        touchStoryMap(state, release.updatedAt);
      }),
    removeRelease: (id) =>
      set((state) => {
        const timestamp = now();
        state.releases = state.releases.filter((release) => release.id !== id);
        state.stories = state.stories.map((story) => {
          if (story.releaseId === id) {
            return { ...story, releaseId: null, updatedAt: timestamp };
          }
          return story;
        });
        touchStoryMap(state, timestamp);
      }),
    selectNode: (id) =>
      set((state) => {
        state.selectedNodeId = id;
      }),
    clearSelection: () =>
      set((state) => {
        state.selectedNodeId = null;
      }),
    loadStoryMap: (data) =>
      set((state) => {
        state.storyMap = data.storyMap;
        state.epics = data.epics;
        state.activities = data.activities;
        state.stories = data.stories;
        state.releases = data.releases;
        state.selectedNodeId = null;
      }),
    clearAll: () =>
      set((state) => {
        state.storyMap = null;
        state.epics = [];
        state.activities = [];
        state.stories = [];
        state.releases = [];
        state.selectedNodeId = null;
      }),
    getNodes: () => {
      const { epics, activities, stories } = get();
      const nodes: Node[] = [];

      const sortedEpics = [...epics].sort((a, b) => a.sortOrder - b.sortOrder);
      const sortedActivities = [...activities].sort((a, b) => a.sortOrder - b.sortOrder);
      const sortedStories = [...stories].sort((a, b) => a.sortOrder - b.sortOrder);

      const activityXById = new Map<string, number>();

      for (const epic of sortedEpics) {
        const x = epic.sortOrder * X_SPACING;
        nodes.push({
          id: epic.id,
          type: 'epic',
          position: { x, y: EPIC_Y },
          data: { ...epic }
        });
      }

      for (const activity of sortedActivities) {
        const x = activity.sortOrder * X_SPACING;
        activityXById.set(activity.id, x);
        nodes.push({
          id: activity.id,
          type: 'activity',
          position: { x, y: ACTIVITY_Y },
          data: { ...activity }
        });
      }

      for (const story of sortedStories) {
        const x = activityXById.get(story.activityId) ?? 0;
        nodes.push({
          id: story.id,
          type: 'story',
          position: { x, y: STORY_Y_OFFSET + story.sortOrder * STORY_VERTICAL_SPACING },
          data: { ...story }
        });
      }

      return nodes;
    },
    getEdges: () => {
      const { activities, stories } = get();
      const edges: Edge[] = [];

      for (const activity of activities) {
        edges.push({
          id: `edge-epic-${activity.id}`,
          source: activity.epicId,
          target: activity.id
        });
      }

      for (const story of stories) {
        edges.push({
          id: `edge-activity-${story.id}`,
          source: story.activityId,
          target: story.id
        });
      }

      return edges;
    }
  }))
);
