## Summary
Implement AI-powered technical requirements generation. Given a story map with its stories, use OpenAI's API to analyze the stories and generate a set of categorized technical requirements (API, database, frontend, infrastructure, integration, security).

## Who This Is For
**Founder perspective**: This is the MAGIC feature. Click "Generate Technical Requirements" and AI reads all your user stories, then produces a list of technical specifications: what APIs need to be built, what database tables are needed, what frontend components to create, security considerations, etc. It turns user stories into an engineering plan.
**Agent perspective**: Create a backend service that takes a story map's stories, formats them as a prompt, calls OpenAI's chat completions API, parses the structured response into `TechnicalRequirement` objects, stores them in the database, and returns them.

## Acceptance Criteria
- [ ] "Generate Requirements" button in the toolbar triggers generation
- [ ] Backend endpoint: `POST /api/story-maps/:mapId/generate/technical` triggers technical requirement generation
- [ ] The AI receives all stories in the map as context (title, description, acceptance criteria, priority)
- [ ] AI response is parsed into structured `TechnicalRequirement` objects
- [ ] Each requirement is categorized: api, database, frontend, infrastructure, integration, security
- [ ] Each requirement has linked `sourceStoryIds` — which stories it came from
- [ ] Generated requirements are saved to the database
- [ ] A "Requirements" side panel shows the generated technical requirements grouped by category
- [ ] User can regenerate requirements (replaces previous generation)
- [ ] Loading state shown during generation (can take 10-30 seconds)
- [ ] OpenAI API key is configured via `OPENAI_API_KEY` environment variable
- [ ] Graceful error handling: if OpenAI is unavailable, show a user-friendly error
- [ ] Minimum 3 stories required to generate — show validation message otherwise

## Technical Specification

### Backend Service
```
apps/api/src/services/requirements-generator.ts
```

```ts
interface GenerateOptions {
  storyMapId: string;
  stories: Story[];
  epics: Epic[];
  activities: Activity[];
}

async function generateTechnicalRequirements(options: GenerateOptions): Promise<TechnicalRequirement[]> {
  // 1. Format stories into a prompt
  // 2. Call OpenAI API (gpt-4o-mini for cost efficiency)
  // 3. Parse JSON response into TechnicalRequirement[]
  // 4. Validate with Zod schema
  // 5. Save to database
  // 6. Return requirements
}
```

### OpenAI Prompt
```
You are a senior software architect analyzing user stories to produce technical requirements.

Given the following story map:
[Formatted list of epics → activities → stories with full details]

Generate a comprehensive list of technical requirements. For each requirement:
- Categorize it as: api, database, frontend, infrastructure, integration, or security
- Assign a priority: high, medium, or low
- Reference which story IDs it derives from
- Write a detailed technical description

Respond with a JSON array of objects: { title, description, category, priority, sourceStoryIds }
```

### API Route
```ts
// apps/api/src/routes/requirements.ts

router.post('/api/story-maps/:mapId/generate/technical', async (req, res) => {
  // 1. Load story map with all children
  // 2. Validate minimum 3 stories
  // 3. Delete existing technical requirements for this map
  // 4. Call generateTechnicalRequirements()
  // 5. Return 200 with generated requirements
});

router.get('/api/story-maps/:mapId/requirements/technical', (req, res) => {
  // Return existing technical requirements for the map
});
```

### Frontend Panel
```
apps/web/src/components/RequirementsPanel.tsx
```
- Slide-out panel from the right side (400px wide)
- "Technical Requirements" header
- Grouped by category with collapsible sections
- Each requirement shows: title, description, priority badge, linked story count
- "Regenerate" button at the top

### Dependencies
```
apps/api: openai (npm package)
```

## Test Requirements

### Test: Requirements generator service
```
File: apps/api/src/services/requirements-generator.test.ts

Test: "formats stories into proper prompt"
- Call with mock stories
- Capture the prompt sent to OpenAI (mock the client)
- Assert prompt contains story titles and descriptions
- Assert prompt includes story IDs for reference

Test: "parses valid OpenAI response into TechnicalRequirement objects"
- Mock OpenAI to return a valid JSON response
- Assert returned array has correct shape
- Assert each item has required fields

Test: "validates response with Zod schema"
- Mock OpenAI response with invalid category
- Assert it filters out/fixes invalid items

Test: "handles OpenAI API errors gracefully"
- Mock OpenAI to throw
- Assert function throws a descriptive error

Test: "saves requirements to database"
- Mock successful generation
- Assert requirements are inserted into technical_requirements table

Test: "clears previous requirements before saving new ones"
- Generate twice
- Assert only the second batch exists in DB
```

### Test: Generate endpoint
```
File: apps/api/src/routes/requirements.test.ts

Test: "POST returns 200 with generated requirements"
- Mock the generator service
- POST /api/story-maps/:mapId/generate/technical
- Assert 200, body is array of requirements

Test: "returns 400 when fewer than 3 stories"
- Create map with only 2 stories
- POST generate
- Assert 400 with validation message

Test: "returns 404 for non-existent map"

Test: "GET returns existing requirements"
- Generate requirements, then GET
- Assert the same requirements are returned
```

### Test: RequirementsPanel component
```
File: apps/web/src/components/RequirementsPanel.test.tsx

Test: "renders requirements grouped by category"
- Provide mock requirements with mixed categories
- Assert category headers are visible
- Assert requirements are under correct categories

Test: "shows loading state during generation"
- Trigger generate
- Assert spinner/loading indicator is visible

Test: "shows error message on generation failure"
- Mock API to fail
- Assert error message is displayed

Test: "Regenerate button triggers new generation"
- Click Regenerate
- Assert API was called again

Test: "shows priority badges on requirements"
- Assert 'high' priority shows red badge
- Assert 'medium' shows yellow, 'low' shows green
```

## Dependencies
- Requires Issue #4 (shared types)
- Requires Issue #12 (database schema — requirements tables)
- Requires Issue #13 (story maps routes)
- Requires Issue #14 (entity routes — to load stories)

## Files to Create/Modify
- `apps/api/package.json` (modify — add openai dependency)
- `apps/api/src/services/requirements-generator.ts` (create)
- `apps/api/src/services/requirements-generator.test.ts` (create)
- `apps/api/src/routes/requirements.ts` (create)
- `apps/api/src/routes/requirements.test.ts` (create)
- `apps/api/src/server.ts` (modify — register routes)
- `apps/web/src/components/RequirementsPanel.tsx` (create)
- `apps/web/src/components/RequirementsPanel.test.tsx` (create)
- `apps/web/src/components/Toolbar.tsx` (modify — add Generate button)
