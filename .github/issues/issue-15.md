## Summary
Connect the React frontend to the Express API. Implement an API client service layer and data-fetching hooks so the canvas loads story maps from the server, and all create/edit/delete/move actions persist to the database.

## Who This Is For
**Founder perspective**: Now the app actually saves your work! Open a story map, add cards, close the browser, come back — everything is still there. The frontend talks to the backend and everything is persisted.
**Agent perspective**: Create an API client module with fetch-based functions for all endpoints. Create React hooks that integrate the API client with the Zustand store. Handle loading states, error states, and optimistic updates.

## Acceptance Criteria
- [ ] API client module with typed functions for all CRUD endpoints
- [ ] `useStoryMap(id)` hook loads a story map and populates the Zustand store
- [ ] Creating an epic/activity/story/release calls the API AND updates the store
- [ ] Editing any entity calls the API AND updates the store
- [ ] Deleting any entity calls the API AND updates the store
- [ ] Moving a story (drag-drop) calls the PATCH move endpoint AND updates the store
- [ ] Loading state is tracked — canvas shows a spinner while initial data loads
- [ ] Error state is tracked — failed API calls show an error toast/notification
- [ ] The app shows a "Story Map List" view when no map is selected
- [ ] Clicking a story map in the list loads it on the canvas
- [ ] "New Story Map" button creates one via API and opens it

## Technical Specification

### API Client
```
apps/web/src/api/client.ts
```

```ts
const API_BASE = 'http://localhost:3001/api';

export const api = {
  storyMaps: {
    list: (): Promise<StoryMapSummary[]> => fetch(`${API_BASE}/story-maps`).then(handleResponse),
    get: (id: string): Promise<StoryMapDetail> => ...,
    create: (data: CreateStoryMap): Promise<StoryMap> => ...,
    update: (id: string, data: UpdateStoryMap): Promise<StoryMap> => ...,
    delete: (id: string): Promise<void> => ...,
  },
  epics: {
    create: (mapId: string, data: CreateEpic): Promise<Epic> => ...,
    update: (mapId: string, id: string, data: UpdateEpic): Promise<Epic> => ...,
    delete: (mapId: string, id: string): Promise<void> => ...,
  },
  activities: { ... },
  stories: {
    ...crud,
    move: (mapId: string, id: string, data: MoveStory): Promise<Story> => ...,
  },
  releases: { ... },
};
```

### Data Fetching Hook
```ts
// apps/web/src/hooks/use-story-map.ts

function useStoryMap(id: string | null) {
  const store = useStoryMapStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.storyMaps.get(id)
      .then(data => store.loadStoryMap(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { isLoading, error };
}
```

### Store-API Integration Actions
Update the Zustand store actions to call API endpoints:
```ts
// The store actions should:
// 1. Optimistically update local state
// 2. Call the API
// 3. On failure: revert local state and show error
```

### Story Map List Page
```
apps/web/src/components/StoryMapList.tsx
```
- Shows a grid/list of existing story maps
- Each card shows title, description, updated date, story count
- "Create New" button
- Click a map → sets the active map ID → canvas loads it

### App Routing
Simple client-side state routing (no react-router needed for v1):
```ts
// App.tsx
const [activeMapId, setActiveMapId] = useState<string | null>(null);

if (!activeMapId) return <StoryMapList onSelect={setActiveMapId} />;
return <Canvas mapId={activeMapId} onBack={() => setActiveMapId(null)} />;
```

## Test Requirements

### Test: API client
```
File: apps/web/src/api/client.test.ts

Test: "storyMaps.list fetches from correct URL"
- Mock fetch
- Call api.storyMaps.list()
- Assert fetch was called with '{API_BASE}/story-maps'
- Assert it returns parsed JSON

Test: "storyMaps.create sends POST with body"
- Mock fetch
- Call api.storyMaps.create({ title: 'Test' })
- Assert fetch method === 'POST'
- Assert body contains the data

Test: "stories.move sends PATCH to correct URL"
- Mock fetch
- Call api.stories.move(mapId, storyId, { activityId: 'new' })
- Assert URL includes '/move'
- Assert method === 'PATCH'

Test: "handles 400 errors with message"
- Mock fetch to return 400 with error body
- Assert the function throws with the error message

Test: "handles 404 errors"
Test: "handles network errors"
```

### Test: useStoryMap hook
```
File: apps/web/src/hooks/use-story-map.test.ts

Test: "loads story map data into store"
- Mock API to return test data
- Render hook with a map ID
- Assert store is populated with the data

Test: "sets loading state while fetching"
- Render hook
- Assert isLoading is true initially
- Wait for fetch to complete
- Assert isLoading is false

Test: "sets error state on API failure"
- Mock API to reject
- Render hook
- Assert error is set with message

Test: "does nothing when id is null"
- Render hook with null id
- Assert API was not called
```

### Test: StoryMapList
```
File: apps/web/src/components/StoryMapList.test.tsx

Test: "renders list of story maps"
- Mock API to return 3 maps
- Render StoryMapList
- Assert 3 map cards are visible

Test: "clicking a map calls onSelect with its id"
- Render, click first map
- Assert onSelect was called with correct id

Test: "Create New button creates a map and selects it"
- Click Create New
- Assert API create was called
- Assert onSelect was called with new map's id

Test: "shows loading spinner while fetching"
Test: "shows empty state when no maps exist"
```

## Dependencies
- Requires Issue #2 (React setup)
- Requires Issue #5 (Canvas)
- Requires Issue #6 (Zustand store)
- Requires Issue #13 (Story map API routes)
- Requires Issue #14 (Entity API routes)

## Files to Create/Modify
- `apps/web/src/api/client.ts` (create)
- `apps/web/src/api/client.test.ts` (create)
- `apps/web/src/hooks/use-story-map.ts` (create)
- `apps/web/src/hooks/use-story-map.test.ts` (create)
- `apps/web/src/components/StoryMapList.tsx` (create)
- `apps/web/src/components/StoryMapList.test.tsx` (create)
- `apps/web/src/App.tsx` (modify — add list/canvas toggle)
- `apps/web/src/stores/story-map-store.ts` (modify — integrate API calls)
