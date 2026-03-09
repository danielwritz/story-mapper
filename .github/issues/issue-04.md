## Summary
Define the core domain types and Zod validation schemas in `packages/shared`. These types represent the fundamental data model: Story Maps, Epics, Activities, Stories, Releases, and generated Requirements. All frontend and backend code will import these types.

## Who This Is For
**Founder perspective**: This defines WHAT our data looks like — the building blocks of a story map. Epics at the top, activities underneath, stories at the bottom, organized into releases. Plus the requirements that get generated from them.
**Agent perspective**: Create TypeScript interfaces and Zod schemas in `packages/shared/src/types/` for the entire domain model. Export everything from the package index.

## Acceptance Criteria
- [ ] All domain types are defined as TypeScript interfaces in `packages/shared/src/types/`
- [ ] Corresponding Zod schemas exist for runtime validation of each type
- [ ] Types are exported from `packages/shared/src/index.ts`
- [ ] Zod is installed as a dependency of `packages/shared`
- [ ] All IDs use UUIDs (string type)
- [ ] All entities have `createdAt` and `updatedAt` ISO date strings
- [ ] Types compile with zero TypeScript errors
- [ ] Zod schemas match their TypeScript interfaces exactly

## Technical Specification

### Domain Model

#### StoryMap
The top-level container for an entire story mapping session.
```ts
interface StoryMap {
  id: string;              // UUID
  title: string;           // User-given name
  description: string;     // Optional description
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

#### Epic
Top row of the story map — represents a large user goal or theme.
```ts
interface Epic {
  id: string;
  storyMapId: string;      // FK to StoryMap
  title: string;
  description: string;
  color: string;           // Hex color for visual grouping, e.g., "#6366f1"
  sortOrder: number;       // Horizontal position (left to right)
  createdAt: string;
  updatedAt: string;
}
```

#### Activity
Second row — user activities that fall under an epic.
```ts
interface Activity {
  id: string;
  epicId: string;          // FK to Epic
  storyMapId: string;      // FK to StoryMap
  title: string;
  description: string;
  sortOrder: number;       // Horizontal position within the epic
  createdAt: string;
  updatedAt: string;
}
```

#### Story
Individual user story card — the core unit of the map.
```ts
interface Story {
  id: string;
  activityId: string;      // FK to Activity
  storyMapId: string;      // FK to StoryMap
  releaseId: string | null; // FK to Release (null = unassigned)
  title: string;
  description: string;     // "As a [user], I want [goal], so that [benefit]"
  acceptanceCriteria: string; // Markdown-formatted criteria
  priority: 'must' | 'should' | 'could' | 'wont'; // MoSCoW
  storyPoints: number | null;
  sortOrder: number;       // Vertical position within the activity column
  createdAt: string;
  updatedAt: string;
}
```

#### Release
Horizontal swim lane representing a release/iteration.
```ts
interface Release {
  id: string;
  storyMapId: string;      // FK to StoryMap
  title: string;           // e.g., "v1.0", "MVP", "Sprint 3"
  description: string;
  sortOrder: number;       // Vertical position (top = highest priority)
  createdAt: string;
  updatedAt: string;
}
```

#### TechnicalRequirement
Auto-generated technical requirement from stories.
```ts
interface TechnicalRequirement {
  id: string;
  storyMapId: string;
  sourceStoryIds: string[]; // Which stories this was derived from
  title: string;
  description: string;     // Detailed technical specification
  category: 'api' | 'database' | 'frontend' | 'infrastructure' | 'integration' | 'security';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}
```

#### FunctionalRequirement
Auto-generated functional/user requirement.
```ts
interface FunctionalRequirement {
  id: string;
  storyMapId: string;
  sourceStoryIds: string[];
  title: string;
  description: string;     // User-facing requirement description
  userRole: string;        // Which user role this applies to
  category: 'usability' | 'functionality' | 'performance' | 'accessibility' | 'data';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}
```

### Create/Update DTOs
For each entity, create corresponding `Create*` and `Update*` types that omit `id`, `createdAt`, `updatedAt` (and make fields optional for updates):

```ts
type CreateStoryMap = Omit<StoryMap, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateStoryMap = Partial<CreateStoryMap>;
// ... same pattern for all entities
```

### File Organization
```
packages/shared/src/
├── types/
│   ├── story-map.ts           # StoryMap type + schema
│   ├── epic.ts                # Epic type + schema
│   ├── activity.ts            # Activity type + schema
│   ├── story.ts               # Story type + schema
│   ├── release.ts             # Release type + schema
│   ├── technical-requirement.ts
│   ├── functional-requirement.ts
│   └── index.ts               # Re-exports all types
├── index.ts                   # Package entry point
```

## Test Requirements

### Test: Zod schema validation
```
File: packages/shared/src/types/story-map.test.ts

Test: "StoryMapSchema validates a correct story map"
- Create a valid StoryMap object
- Assert StoryMapSchema.safeParse(validMap).success === true

Test: "StoryMapSchema rejects missing title"
- Create object without title
- Assert safeParse fails with appropriate error

Test: "CreateStoryMapSchema omits id and timestamps"
- Assert CreateStoryMapSchema validates { title: 'Test', description: '' }
- Assert it rejects objects with an id field as extra (use .strict())
```

```
File: packages/shared/src/types/story.test.ts

Test: "StorySchema validates a correct story"
- Include all required fields with valid values
- Assert parse succeeds

Test: "StorySchema validates priority enum"
- Assert 'must', 'should', 'could', 'wont' all pass
- Assert 'invalid' fails

Test: "StorySchema allows null releaseId"
- Create story with releaseId: null
- Assert parse succeeds

Test: "StorySchema requires activityId"
- Omit activityId
- Assert parse fails
```

```
File: packages/shared/src/types/epic.test.ts

Test: "EpicSchema validates a correct epic"
Test: "EpicSchema validates color as hex string"
- Assert '#6366f1' passes
- Assert 'not-a-color' fails (require hex pattern)
Test: "CreateEpicSchema works without id/timestamps"
```

```
File: packages/shared/src/types/release.test.ts

Test: "ReleaseSchema validates a correct release"
Test: "CreateReleaseSchema omits auto-generated fields"
```

```
File: packages/shared/src/types/technical-requirement.test.ts

Test: "TechnicalRequirementSchema validates category enum"
- Assert all 6 categories pass
- Assert 'invalid' fails

Test: "sourceStoryIds is an array of strings"
- Assert [] passes
- Assert ['id1', 'id2'] passes  
- Assert [123] fails
```

```
File: packages/shared/src/types/functional-requirement.test.ts

Test: "FunctionalRequirementSchema validates all fields"
Test: "category enum validation"
- Assert all 5 categories pass
```

## Dependencies
- Requires Issue #1 (monorepo setup)

## Files to Create/Modify
- `packages/shared/package.json` (modify — add zod dependency)
- `packages/shared/src/types/story-map.ts` (create)
- `packages/shared/src/types/epic.ts` (create)
- `packages/shared/src/types/activity.ts` (create)  
- `packages/shared/src/types/story.ts` (create)
- `packages/shared/src/types/release.ts` (create)
- `packages/shared/src/types/technical-requirement.ts` (create)
- `packages/shared/src/types/functional-requirement.ts` (create)
- `packages/shared/src/types/index.ts` (create)
- `packages/shared/src/index.ts` (modify — re-export types)
- All corresponding `.test.ts` files (create)
