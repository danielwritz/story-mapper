## Summary
Implement CRUD API routes for Epics, Activities, Stories, and Releases — all scoped to a parent story map. These are the detailed resource endpoints that the frontend will call when users create, edit, move, or delete cards on the canvas.

## Who This Is For
**Founder perspective**: Every action on the canvas (add a card, edit it, drag it to a new spot, delete it) calls these APIs to persist the change. Without these, nothing saves.
**Agent perspective**: Create Express routes for nested CRUD operations under `/api/story-maps/:mapId/epics`, `.../activities`, `.../stories`, `.../releases`. Validate all inputs, handle re-parenting (moveStory), and return proper responses.

## Acceptance Criteria

### Epic Routes (`/api/story-maps/:mapId/epics`)
- [ ] `POST` — creates epic, validates with CreateEpicSchema, returns 201
- [ ] `PUT /:id` — updates epic fields, returns 200
- [ ] `DELETE /:id` — deletes epic + cascading children, returns 204

### Activity Routes (`/api/story-maps/:mapId/activities`)
- [ ] `POST` — creates activity under specified epicId (in body), returns 201
- [ ] `PUT /:id` — updates activity fields, returns 200
- [ ] `DELETE /:id` — deletes activity + child stories, returns 204

### Story Routes (`/api/story-maps/:mapId/stories`)
- [ ] `POST` — creates story under specified activityId (in body), returns 201
- [ ] `PUT /:id` — updates story fields (title, description, priority, points, etc.), returns 200
- [ ] `PATCH /:id/move` — moves story to different activity and/or release, returns 200
- [ ] `DELETE /:id` — deletes story, returns 204

### Release Routes (`/api/story-maps/:mapId/releases`)
- [ ] `POST` — creates release, returns 201
- [ ] `PUT /:id` — updates release fields, returns 200
- [ ] `DELETE /:id` — deletes release, nullifies releaseId on stories, returns 204

### Cross-cutting
- [ ] All routes verify the `:mapId` exists — 404 if not
- [ ] All PUT/DELETE routes verify the `:id` exists — 404 if not
- [ ] All routes validate request bodies with Zod schemas — 400 on validation failure
- [ ] Sort order is managed automatically: new items get `max(sort_order) + 1`
- [ ] PATCH move endpoint accepts `{ activityId?, releaseId?, sortOrder? }`

## Technical Specification

### Route Files
```
apps/api/src/routes/
├── story-maps.ts          # (existing from Issue #13)
├── epics.ts               # Epic CRUD
├── activities.ts          # Activity CRUD
├── stories.ts             # Story CRUD + move
├── releases.ts            # Release CRUD
```

### Route Registration
```ts
// server.ts
app.use('/api/story-maps', storyMapsRouter);
app.use('/api/story-maps/:mapId/epics', epicsRouter);
app.use('/api/story-maps/:mapId/activities', activitiesRouter);
app.use('/api/story-maps/:mapId/stories', storiesRouter);
app.use('/api/story-maps/:mapId/releases', releasesRouter);
```

### Move Story Endpoint
```
PATCH /api/story-maps/:mapId/stories/:id/move
Body: {
  activityId?: string,    // New parent activity
  releaseId?: string | null,  // New release (null = backlog)
  sortOrder?: number      // New position
}
```
This handles drag-and-drop re-parenting on the canvas. Any omitted field is left unchanged.

### Sort Order Auto-increment
When creating a new entity without explicit sortOrder:
```sql
SELECT COALESCE(MAX(sort_order), -1) + 1 FROM stories WHERE activity_id = ?
```

## Test Requirements

### Test: Epic routes
```
File: apps/api/src/routes/epics.test.ts

Test: "POST creates an epic under the story map"
- POST /api/story-maps/:mapId/epics with { title: 'Auth', description: 'Authentication', color: '#6366f1' }
- Assert 201, body has id, title, storyMapId === mapId

Test: "POST returns 404 for non-existent mapId"
Test: "POST returns 400 for missing title"

Test: "PUT updates epic title and color"
- PUT /api/story-maps/:mapId/epics/:id with { title: 'Updated' }
- Assert 200, title changed

Test: "DELETE removes epic and cascading children"
- Create epic → activity → story
- DELETE epic
- Assert 204
- Assert activity and story are also deleted from DB

Test: "auto-assigns sort_order on creation"
- Create 3 epics
- Assert sort_orders are 0, 1, 2
```

### Test: Activity routes
```
File: apps/api/src/routes/activities.test.ts

Test: "POST creates activity linked to an epic"
- POST with { title: 'Login', epicId: '<valid>' }
- Assert 201, epicId matches

Test: "POST returns 400 when epicId is missing"
Test: "DELETE cascades to stories"
```

### Test: Story routes
```
File: apps/api/src/routes/stories.test.ts

Test: "POST creates a story with default priority 'could'"
Test: "PUT updates priority and story points"
Test: "PATCH move changes activityId"
- Create story under activity A
- PATCH with { activityId: B }
- Assert activityId is now B

Test: "PATCH move changes releaseId"
- PATCH with { releaseId: release1 }
- Assert releaseId updated

Test: "PATCH move with releaseId null removes from release"
Test: "DELETE removes only the story"
```

### Test: Release routes
```
File: apps/api/src/routes/releases.test.ts

Test: "POST creates a release"
Test: "DELETE nullifies releaseId on assigned stories"
- Create release, assign 2 stories
- DELETE release
- Assert both stories still exist with releaseId = null

Test: "PUT updates release title"
```

## Dependencies
- Requires Issue #3 (Express setup)
- Requires Issue #4 (shared types + Zod schemas)
- Requires Issue #12 (database schema)
- Requires Issue #13 (story maps routes — provides the parent resource)

## Files to Create/Modify
- `apps/api/src/routes/epics.ts` (create)
- `apps/api/src/routes/epics.test.ts` (create)
- `apps/api/src/routes/activities.ts` (create)
- `apps/api/src/routes/activities.test.ts` (create)
- `apps/api/src/routes/stories.ts` (create)
- `apps/api/src/routes/stories.test.ts` (create)
- `apps/api/src/routes/releases.ts` (create)
- `apps/api/src/routes/releases.test.ts` (create)
- `apps/api/src/server.ts` (modify — register all new routes)
