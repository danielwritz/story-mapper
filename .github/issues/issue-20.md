## Summary
Implement comprehensive Playwright end-to-end tests covering all critical user flows of the Story Mapper application. These tests verify the entire system works together: frontend + backend + database + AI integration.

## Who This Is For
**Founder perspective**: These are the "does it actually work?" tests. They simulate a real user: open the app in a browser, click buttons, drag cards, generate requirements, export documents. If these pass, we know the app works end-to-end.
**Agent perspective**: Set up Playwright in the project, create E2E test files that cover the main user journeys. Tests should start the dev server, navigate in a real browser, and assert visible outcomes. Mock the OpenAI API for deterministic tests.

## Acceptance Criteria
- [ ] Playwright is installed and configured in the project root
- [ ] `npm run test:e2e` command runs all Playwright tests
- [ ] Tests automatically start the dev server (web + api) before running
- [ ] Tests use a fresh database for each test run (isolated, no shared state)
- [ ] OpenAI API is mocked for requirement generation tests (deterministic)
- [ ] All 8 critical user flows have passing tests (listed below)
- [ ] Tests run in headless mode by default, with headed mode available via flag
- [ ] CI-ready: tests can run in GitHub Actions
- [ ] Screenshots are captured on test failure for debugging

## Technical Specification

### Playwright Setup
```
# Root level
playwright.config.ts
e2e/
├── fixtures/
│   ├── test-data.ts           # Factory functions for test data
│   └── mock-openai.ts         # OpenAI API mock
├── story-map-crud.spec.ts     # Flow 1-2
├── canvas-interaction.spec.ts # Flow 3-4
├── card-management.spec.ts    # Flow 5-6
├── requirements.spec.ts       # Flow 7
├── export.spec.ts             # Flow 8
└── global-setup.ts            # Start servers
```

### `playwright.config.ts`
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev --workspace=apps/api',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev --workspace=apps/web',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

### Test Database Isolation
```ts
// Before each test: set API env to use a temp database
// After each test: delete the temp database
```

## Critical User Flows to Test

### Flow 1: Create and view a story map
```
1. Open the app → see Story Map List
2. Click "Create New Story Map"
3. Enter title "My Product Roadmap"
4. Story map opens on the canvas
5. Navigate back to list → map appears in the list
```

### Flow 2: Delete a story map
```
1. Create a story map
2. Go back to list
3. Delete the map
4. Assert it's gone from the list
```

### Flow 3: Build a story map on the canvas
```
1. Open a story map
2. Click "Add Epic" → epic appears on canvas
3. Double-click epic → edit title to "User Authentication"
4. Click the epic → click "Add Activity" → activity appears
5. Edit activity title to "Login Flow"
6. Click the activity → click "Add Story"
7. Edit story: title="Login with email", priority=MUST, points=5
8. Add 2 more stories under the same activity
9. Assert 1 epic, 1 activity, 3 stories visible on canvas
```

### Flow 4: Drag and drop stories
```
1. Build a map with 2 activities, each with 2 stories
2. Drag a story from activity 1 to activity 2
3. Assert the story is now under activity 2
4. Verify the move persisted (refresh page, check same state)
```

### Flow 5: Release planning
```
1. Build a story map with 5 stories
2. Click "Add Release" → release lane appears
3. Edit release title to "v1.0 - MVP"
4. Drag 3 stories into the release lane
5. Add another release "v1.1"
6. Drag remaining 2 stories into v1.1
7. Assert stories are in correct lanes
```

### Flow 6: Edit and delete cards
```
1. Create an epic with 2 activities and 4 stories
2. Double-click a story → edit all fields → save
3. Verify edits persisted
4. Right-click a story → Delete → confirm
5. Assert story is gone
6. Delete entire epic → confirm cascade warning
7. Assert epic + all children are gone
```

### Flow 7: Generate requirements (mocked AI)
```
1. Build a map with 1 epic, 2 activities, 4 stories (with descriptions)
2. Click "Generate Requirements" → "Technical Requirements"
3. Wait for generation to complete
4. Assert Requirements panel opens with grouped requirements
5. Click "Functional" tab
6. Click "Generate" for functional
7. Assert functional requirements appear grouped by user role
```

### Flow 8: Export document
```
1. Build a map and generate requirements
2. Click "Export" → "Full Document"
3. Assert a file download was triggered
4. (Optional) Read downloaded file content and assert it contains expected headers
```

## Test Requirements

### Test: Story Map CRUD (Flow 1-2)
```
File: e2e/story-map-crud.spec.ts

Test: "user can create a new story map"
Test: "new story map appears in the list"
Test: "user can open an existing story map"
Test: "user can delete a story map"
Test: "deleted map is removed from the list"
```

### Test: Canvas Interaction (Flow 3-4)
```
File: e2e/canvas-interaction.spec.ts

Test: "user can build a complete story map hierarchy"
Test: "story map persists across page refreshes"
Test: "user can drag story to different activity"
Test: "drag-drop changes persist after refresh"
```

### Test: Card Management (Flow 5-6)
```
File: e2e/card-management.spec.ts

Test: "user can create and assign stories to releases"
Test: "user can edit all fields of a story card"
Test: "user can delete a story with confirmation"
Test: "deleting an epic cascades to children with warning"
```

### Test: Requirements Generation (Flow 7)
```
File: e2e/requirements.spec.ts

Test: "user can generate technical requirements"
Test: "requirements are grouped by category in the panel"
Test: "user can switch to functional requirements tab"
Test: "user can regenerate requirements"
```

### Test: Export (Flow 8)
```
File: e2e/export.spec.ts

Test: "user can export full document as markdown"
Test: "exported file has correct filename format"
```

## Dependencies
- Requires ALL previous issues to be completed (this is the final integration test)
- Issues #1-18 must be working

## Files to Create/Modify
- `package.json` (modify — add playwright dev dependency and test:e2e script)
- `playwright.config.ts` (create)
- `e2e/fixtures/test-data.ts` (create)
- `e2e/fixtures/mock-openai.ts` (create)
- `e2e/global-setup.ts` (create)
- `e2e/story-map-crud.spec.ts` (create)
- `e2e/canvas-interaction.spec.ts` (create)
- `e2e/card-management.spec.ts` (create)
- `e2e/requirements.spec.ts` (create)
- `e2e/export.spec.ts` (create)
