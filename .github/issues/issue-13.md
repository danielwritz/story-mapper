## Summary
Implement CRUD API routes for Story Maps. This is the top-level resource — users can create, list, read, update, and delete story maps. Each story map is a complete workspace containing epics, activities, stories, and releases.

## Who This Is For
**Founder perspective**: Users need to create new story maps, see a list of their existing ones, open one, rename it, or delete it. This is the "file management" layer of the app.
**Agent perspective**: Create Express routes under `/api/story-maps` for full CRUD. Use better-sqlite3 for data access. Validate request bodies with Zod schemas from `@story-mapper/shared`. Return proper HTTP status codes.

## Acceptance Criteria
- [ ] `POST /api/story-maps` — creates a new story map, returns 201 with the created map
- [ ] `GET /api/story-maps` — lists all story maps (id, title, description, timestamps), returns 200
- [ ] `GET /api/story-maps/:id` — returns a single story map with ALL its children (epics, activities, stories, releases), returns 200
- [ ] `PUT /api/story-maps/:id` — updates title/description, returns 200 with updated map
- [ ] `DELETE /api/story-maps/:id` — deletes the map and all children (cascade), returns 204
- [ ] All routes validate input with Zod — invalid input returns 400 with error details
- [ ] Non-existent `:id` returns 404 with `{ error: "Story map not found" }`
- [ ] IDs are generated server-side as UUIDs
- [ ] `updatedAt` is set to current time on every update
- [ ] GET list response includes story/epic/activity counts for each map

## Technical Specification

### Route File
```
apps/api/src/routes/story-maps.ts
```

### Route Definitions
```ts
const router = express.Router();

// POST /api/story-maps
router.post('/', (req, res) => {
  // Validate body with CreateStoryMapSchema
  // Generate UUID
  // INSERT into story_maps
  // Return 201 with full story map object
});

// GET /api/story-maps
router.get('/', (req, res) => {
  // SELECT all story maps
  // For each, count epics, activities, stories
  // Return 200 with array
});

// GET /api/story-maps/:id
router.get('/:id', (req, res) => {
  // SELECT story map by id
  // 404 if not found
  // SELECT all epics, activities, stories, releases for this map
  // Return 200 with full nested data
});

// PUT /api/story-maps/:id  
router.put('/:id', (req, res) => {
  // Validate body with UpdateStoryMapSchema
  // UPDATE story_maps SET ... WHERE id = :id
  // 404 if not found
  // Return 200 with updated map
});

// DELETE /api/story-maps/:id
router.delete('/:id', (req, res) => {
  // DELETE FROM story_maps WHERE id = :id (cascade handles children)
  // 404 if not found
  // Return 204
});
```

### Response Shapes
```ts
// GET /api/story-maps (list)
[{
  id: string,
  title: string,
  description: string,
  epicCount: number,
  activityCount: number,
  storyCount: number,
  createdAt: string,
  updatedAt: string
}]

// GET /api/story-maps/:id (detail)
{
  id: string,
  title: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  epics: Epic[],
  activities: Activity[],
  stories: Story[],
  releases: Release[]
}
```

### Register Routes
```ts
// apps/api/src/server.ts (modify)
import { storyMapsRouter } from './routes/story-maps';
app.use('/api/story-maps', storyMapsRouter);
```

## Test Requirements

### Test: POST /api/story-maps
```
File: apps/api/src/routes/story-maps.test.ts

Test: "creates a story map and returns 201"
- POST with { title: 'My Map', description: 'Test' }
- Assert status 201
- Assert body has id, title, description, createdAt, updatedAt
- Assert title === 'My Map'

Test: "returns 400 for missing title"
- POST with { description: 'No title' }
- Assert status 400
- Assert body has error details

Test: "returns 400 for empty title"
- POST with { title: '', description: '' }
- Assert status 400

Test: "generates UUID for id"
- Create a map
- Assert id matches UUID v4 pattern
```

### Test: GET /api/story-maps
```
Test: "returns empty array when no maps exist"
- GET /api/story-maps
- Assert status 200
- Assert body is []

Test: "returns all maps with counts"
- Create 2 maps, add epics/stories to one
- GET /api/story-maps
- Assert body has length 2
- Assert epicCount, storyCount are present

Test: "maps are sorted by updatedAt descending (most recent first)"
```

### Test: GET /api/story-maps/:id
```
Test: "returns full story map with all children"
- Create map, add epic, activity, story, release
- GET /api/story-maps/:id
- Assert body includes all nested arrays

Test: "returns 404 for non-existent id"
- GET /api/story-maps/non-existent-uuid
- Assert status 404
- Assert body.error includes 'not found'
```

### Test: PUT /api/story-maps/:id
```
Test: "updates title and returns updated map"
- Create map, then PUT with new title
- Assert status 200
- Assert body.title === new title
- Assert updatedAt changed

Test: "returns 404 for non-existent id"

Test: "returns 400 for invalid body"
```

### Test: DELETE /api/story-maps/:id
```
Test: "deletes map and returns 204"
- Create map, DELETE it
- Assert status 204
- GET the map → 404

Test: "cascade deletes children"
- Create map with epic, activity, story
- DELETE map
- Assert all children are gone from database

Test: "returns 404 for non-existent id"
```

## Dependencies
- Requires Issue #3 (Express API setup)
- Requires Issue #4 (shared types + Zod schemas)
- Requires Issue #12 (database schema)

## Files to Create/Modify
- `apps/api/src/routes/story-maps.ts` (create)
- `apps/api/src/routes/story-maps.test.ts` (create)
- `apps/api/src/server.ts` (modify — register routes)
