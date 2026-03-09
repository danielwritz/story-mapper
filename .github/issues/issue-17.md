## Summary
Implement AI-powered functional (user) requirements generation. This complements technical requirements by producing user-facing, role-based functional requirements — the "what the system should do from the user's perspective" document.

## Who This Is For
**Founder perspective**: While technical requirements tell engineers WHAT to build, functional requirements tell stakeholders what the system DOES. "The system shall allow administrators to..." style documents. Click a button and get a professional functional requirements document generated from your story map.
**Agent perspective**: Create a service similar to technical requirements generation but with a different prompt targeting functional/user requirements. Output `FunctionalRequirement` objects organized by user role and functional category.

## Acceptance Criteria
- [ ] Backend endpoint: `POST /api/story-maps/:mapId/generate/functional` triggers functional requirement generation
- [ ] The AI receives all stories including their user role context (parsed from "As a [role]..." format)
- [ ] AI response is parsed into structured `FunctionalRequirement` objects
- [ ] Each requirement specifies a `userRole` (e.g., "Product Owner", "Developer", "Admin")
- [ ] Each requirement is categorized: usability, functionality, performance, accessibility, data
- [ ] Generated requirements are saved to the database
- [ ] The Requirements Panel has a toggle between "Technical" and "Functional" tabs
- [ ] Functional requirements are grouped by user role, then by category
- [ ] "Generate All" button generates both technical AND functional requirements in sequence
- [ ] GET endpoint returns existing functional requirements

## Technical Specification

### Backend Service
```ts
// apps/api/src/services/functional-requirements-generator.ts

async function generateFunctionalRequirements(options: GenerateOptions): Promise<FunctionalRequirement[]>
```

### OpenAI Prompt
```
You are a business analyst creating functional requirements from user stories.

Given the following story map:
[Formatted stories with "As a [role]" patterns highlighted]

Generate functional user requirements. For each requirement:
- Identify the user role it applies to
- Categorize as: usability, functionality, performance, accessibility, or data
- Assign priority: high, medium, low
- Write clear, testable requirement descriptions using "The system shall..." format
- Reference source story IDs

Format each as: "FR-XXX: The system shall [action] so that [user role] can [benefit]."

Respond with JSON array: { title, description, userRole, category, priority, sourceStoryIds }
```

### API Routes
```ts
// apps/api/src/routes/requirements.ts (extend)

router.post('/api/story-maps/:mapId/generate/functional', async (req, res) => { ... });
router.get('/api/story-maps/:mapId/requirements/functional', (req, res) => { ... });
router.post('/api/story-maps/:mapId/generate/all', async (req, res) => {
  // Generate both technical and functional in parallel
});
```

### Frontend Updates
```tsx
// RequirementsPanel.tsx updates:
// - Tab switcher: "Technical" | "Functional"
// - Functional tab groups by userRole then category
// - "Generate All" button alongside individual generate buttons
```

## Test Requirements

### Test: Functional requirements generator
```
File: apps/api/src/services/functional-requirements-generator.test.ts

Test: "formats stories with user role extraction"
- Stories include "As a product owner, I want..."
- Assert prompt highlights user roles

Test: "parses valid response into FunctionalRequirement objects"
- Mock OpenAI response
- Assert each item has userRole, category, priority

Test: "handles stories without 'As a' format"
- Stories with plain descriptions
- Assert generation still succeeds with default role

Test: "saves to database and clears previous"
```

### Test: Functional requirements endpoint
```
File: apps/api/src/routes/requirements.test.ts (extend)

Test: "POST /generate/functional returns functional requirements"
Test: "GET /requirements/functional returns saved requirements"
Test: "POST /generate/all generates both types"
- Assert response contains both technical and functional arrays
Test: "returns 400 when fewer than 3 stories"
```

### Test: Requirements panel with tabs
```
File: apps/web/src/components/RequirementsPanel.test.tsx (extend)

Test: "renders tab switcher between Technical and Functional"
- Assert both tab buttons are visible

Test: "switching to Functional tab shows functional requirements"
- Click "Functional" tab
- Assert functional requirements are displayed
- Assert they are grouped by userRole

Test: "Generate All button triggers both generation endpoints"
- Click "Generate All"
- Assert both API endpoints were called

Test: "functional requirements show user role labels"
- Assert each requirement card shows its userRole
```

## Dependencies
- Requires Issue #4 (shared types — FunctionalRequirement)
- Requires Issue #12 (database schema)
- Requires Issue #16 (technical requirements — extends the same routes/panel)

## Files to Create/Modify
- `apps/api/src/services/functional-requirements-generator.ts` (create)
- `apps/api/src/services/functional-requirements-generator.test.ts` (create)
- `apps/api/src/routes/requirements.ts` (modify — add functional endpoints)
- `apps/api/src/routes/requirements.test.ts` (modify — add functional tests)
- `apps/web/src/components/RequirementsPanel.tsx` (modify — add tabs)
- `apps/web/src/components/RequirementsPanel.test.tsx` (modify)
