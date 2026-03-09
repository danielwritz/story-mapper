## Summary
Implement the Zustand state management store for the story map. This store holds ALL client-side state: the current story map, all epics, activities, stories, releases, and selection state. It is the single source of truth for the canvas.

## Who This Is For
**Founder perspective**: This is the "brain" of the frontend — it keeps track of everything on the canvas: what cards exist, where they are, what's selected, what's been modified. Every action (create, edit, move, delete) flows through this store.
**Agent perspective**: Create a Zustand store in `apps/web/src/stores/` that manages the entire story map state with CRUD operations for all entity types, selection state, and computed React Flow nodes/edges.

## Acceptance Criteria
- [ ] Zustand is installed in `apps/web`
- [ ] `useStoryMapStore` is the main store exported from `apps/web/src/stores/story-map-store.ts`
- [ ] Store manages: current StoryMap metadata, arrays of Epics, Activities, Stories, Releases
- [ ] CRUD actions exist for each entity type (add, update, remove)
- [ ] Selection state: `selectedNodeId: string | null` with `selectNode` and `clearSelection` actions
- [ ] `getNodes()` computed selector returns React Flow nodes derived from store data
- [ ] `getEdges()` computed selector returns React Flow edges (epic → activity, activity → story)
- [ ] `moveStory(storyId, newActivityId, newSortOrder)` action for drag-and-drop re-parenting
- [ ] `moveStoryToRelease(storyId, releaseId)` action for release assignment
- [ ] All mutations update `updatedAt` timestamps
- [ ] Store uses immer middleware for immutable updates (via zustand/middleware/immer)
- [ ] UUID generation for new entities uses `crypto.randomUUID()`

## Technical Specification

### Dependencies to Install (apps/web)
```
Production: zustand, immer
```

### Store Shape
```ts
interface StoryMapState {
  // Data
  storyMap: StoryMap | null;
  epics: Epic[];
  activities: Activity[];
  stories: Story[];
  releases: Release[];
  
  // UI State
  selectedNodeId: string | null;
  
  // Story Map Actions
  setStoryMap: (map: StoryMap) => void;
  updateStoryMap: (updates: UpdateStoryMap) => void;
  
  // Epic Actions  
  addEpic: (data: CreateEpic) => Epic;
  updateEpic: (id: string, updates: UpdateEpic) => void;
  removeEpic: (id: string) => void;
  
  // Activity Actions
  addActivity: (data: CreateActivity) => Activity;
  updateActivity: (id: string, updates: UpdateActivity) => void;
  removeActivity: (id: string) => void;
  
  // Story Actions
  addStory: (data: CreateStory) => Story;
  updateStory: (id: string, updates: UpdateStory) => void;
  removeStory: (id: string) => void;
  moveStory: (storyId: string, newActivityId: string, newSortOrder: number) => void;
  moveStoryToRelease: (storyId: string, releaseId: string | null) => void;
  
  // Release Actions
  addRelease: (data: CreateRelease) => Release;
  updateRelease: (id: string, updates: UpdateRelease) => void;
  removeRelease: (id: string) => void;
  
  // Selection
  selectNode: (id: string) => void;
  clearSelection: () => void;
  
  // Bulk
  loadStoryMap: (data: { storyMap: StoryMap; epics: Epic[]; activities: Activity[]; stories: Story[]; releases: Release[] }) => void;
  clearAll: () => void;
}
```

### React Flow Node Conversion
Epics become nodes positioned in a top row (y=0), activities in second row (y=150), stories in columns below their activity (y=300+).

Each node has:
```ts
{
  id: entity.id,
  type: 'epic' | 'activity' | 'story',
  position: { x: calculated, y: calculated },
  data: { ...entity }
}
```

### Cascade Deletes
- Removing an Epic → removes all its Activities → removes all their Stories
- Removing an Activity → removes all its Stories
- Removing a Release → sets `releaseId = null` on affected stories (does NOT delete stories)

## Test Requirements

### Test: Store initialization
```
File: apps/web/src/stores/story-map-store.test.ts

Test: "initializes with null story map and empty arrays"
- Get store state
- Assert storyMap === null
- Assert epics, activities, stories, releases are empty arrays
- Assert selectedNodeId === null
```

### Test: Epic CRUD
```
Test: "addEpic creates an epic with UUID and timestamps"
- Call addEpic({ title: 'User Management', ... })
- Assert epics array has length 1
- Assert the epic has a valid UUID id
- Assert createdAt and updatedAt are set

Test: "updateEpic modifies the epic and updates timestamp"
- Add an epic, note its updatedAt
- Call updateEpic(id, { title: 'Updated' })
- Assert title changed
- Assert updatedAt changed

Test: "removeEpic deletes the epic and cascades to activities and stories"
- Add epic → add activity under it → add story under activity
- Call removeEpic(epicId)
- Assert epics array is empty
- Assert activities array is empty
- Assert stories array is empty
```

### Test: Activity CRUD
```
Test: "addActivity creates an activity linked to an epic"
Test: "removeActivity cascades to stories"
```

### Test: Story CRUD
```
Test: "addStory creates a story with null releaseId by default"
Test: "updateStory modifies story fields"
Test: "removeStory deletes only the target story"
Test: "moveStory changes activityId and sortOrder"
Test: "moveStoryToRelease assigns story to a release"
Test: "moveStoryToRelease with null unassigns from release"
```

### Test: Release CRUD
```
Test: "addRelease creates a release"
Test: "removeRelease nullifies releaseId on assigned stories"
```

### Test: Selection
```
Test: "selectNode sets selectedNodeId"
Test: "clearSelection resets to null"
```

### Test: Bulk operations
```
Test: "loadStoryMap populates all arrays"
Test: "clearAll resets everything to initial state"
```

## Dependencies
- Requires Issue #1 (monorepo setup)
- Requires Issue #4 (shared types — imports Create*/Update* types)

## Files to Create/Modify
- `apps/web/package.json` (modify — add zustand, immer)
- `apps/web/src/stores/story-map-store.ts` (create)
- `apps/web/src/stores/story-map-store.test.ts` (create)
