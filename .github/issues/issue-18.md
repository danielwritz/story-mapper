## Summary
Implement export functionality to generate requirements documents in Markdown format. Users can export the full story map, technical requirements, functional requirements, or a combined document as downloadable Markdown files.

## Who This Is For
**Founder perspective**: You need to share requirements with stakeholders, put them in a wiki, or attach them to project management tools. Export gives you clean, formatted Markdown documents you can copy-paste or share as files. The combined export produces a full PRD-style document.
**Agent perspective**: Create backend endpoints that render requirements data into well-structured Markdown documents. Create a frontend Export button with format/scope options that triggers downloads.

## Acceptance Criteria
- [ ] "Export" button in the toolbar opens an export options dropdown
- [ ] Export options: "Story Map Overview", "Technical Requirements", "Functional Requirements", "Full Document (All)"
- [ ] Backend endpoint: `GET /api/story-maps/:mapId/export/:type` returns Markdown content
- [ ] Story Map Overview export includes: title, description, all epics with their activities and stories, releases
- [ ] Technical Requirements export: grouped by category, includes priority, linked stories
- [ ] Functional Requirements export: grouped by user role, includes category and priority
- [ ] Full Document export combines all three sections into one cohesive document
- [ ] Export includes a table of contents with anchor links
- [ ] Export includes metadata header: title, generated date, story count, release count
- [ ] Markdown renders cleanly in GitHub, Notion, and standard Markdown viewers
- [ ] Frontend triggers a file download with appropriate filename: `{map-title}-{type}-{date}.md`
- [ ] Support exporting only stories within a specific release

## Technical Specification

### Export Service
```
apps/api/src/services/export-service.ts
```

```ts
type ExportType = 'overview' | 'technical' | 'functional' | 'full';

function exportStoryMap(storyMap: StoryMapDetail, type: ExportType, options?: { releaseId?: string }): string {
  // Returns formatted Markdown string
}
```

### Markdown Document Structure (Full)
```markdown
# {Story Map Title} — Requirements Document

> Generated on {date} | {epicCount} Epics | {storyCount} Stories | {releaseCount} Releases

## Table of Contents
- [Story Map Overview](#story-map-overview)
- [Release Plan](#release-plan)
- [Technical Requirements](#technical-requirements)
- [Functional Requirements](#functional-requirements)

---

## Story Map Overview

### Epic: {Epic Title}
{description}

#### Activity: {Activity Title}
{description}

| # | Story | Priority | Points | Release |
|---|-------|----------|--------|---------|
| 1 | {title} | MUST | 5 | v1.0 |

---

## Release Plan

### {Release Title}
{description}

Stories in this release:
- {story title} (MUST, 5pts) — under {Activity} > {Epic}

---

## Technical Requirements

### API Requirements
| ID | Requirement | Priority | Source Stories |
|----|------------|----------|--------------|
| TR-001 | {title} | High | #1, #3, #5 |

{detailed description}

### Database Requirements
...

---

## Functional Requirements

### Product Owner
| ID | Requirement | Category | Priority |
|----|------------|----------|----------|
| FR-001 | {title} | Functionality | High |

{detailed description}
```

### API Route
```ts
// apps/api/src/routes/export.ts

router.get('/api/story-maps/:mapId/export/:type', (req, res) => {
  // type = 'overview' | 'technical' | 'functional' | 'full'
  // Optional query: ?releaseId=xxx to scope to a release
  // Load all data, generate markdown, return as text/markdown
  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(markdown);
});
```

### Frontend Export Button
```tsx
// apps/web/src/components/ExportMenu.tsx
// Dropdown with export options
// On click: fetch the markdown, trigger browser download
```

### File Download Helper
```ts
function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

## Test Requirements

### Test: Export service
```
File: apps/api/src/services/export-service.test.ts

Test: "overview export includes all epics and stories"
- Generate overview for a map with 2 epics, 3 activities, 5 stories
- Assert markdown contains all epic titles
- Assert markdown contains all story titles
- Assert markdown has a table of stories

Test: "technical export groups requirements by category"
- Generate with requirements in 3 categories
- Assert each category has its own section header

Test: "functional export groups by user role"
- Generate with requirements for 2 user roles
- Assert each role has its own section

Test: "full export includes all sections"
- Assert markdown contains 'Story Map Overview'
- Assert markdown contains 'Technical Requirements'
- Assert markdown contains 'Functional Requirements'
- Assert markdown contains 'Table of Contents'

Test: "export includes metadata header"
- Assert markdown starts with story map title
- Assert it includes generated date
- Assert it includes counts

Test: "release-scoped export only includes stories in that release"
- Pass releaseId option
- Assert only stories in that release appear

Test: "handles empty story map gracefully"
- Export a map with no stories
- Assert it produces valid markdown with "no stories" message
```

### Test: Export endpoint
```
File: apps/api/src/routes/export.test.ts

Test: "GET /export/full returns markdown content type"
- Assert Content-Type is text/markdown
- Assert Content-Disposition has filename

Test: "GET /export/overview returns story map overview"
Test: "GET /export/technical returns technical requirements"
Test: "GET /export/functional returns functional requirements"

Test: "returns 404 for non-existent map"
Test: "returns 400 for invalid export type"
Test: "supports releaseId query parameter"
```

### Test: ExportMenu component
```
File: apps/web/src/components/ExportMenu.test.tsx

Test: "renders export button"
Test: "clicking button shows dropdown with options"
- Assert 4 export options are visible

Test: "clicking an option triggers download"
- Mock the API and URL.createObjectURL
- Click "Full Document"
- Assert fetch was called with /export/full
- Assert download was triggered
```

## Dependencies
- Requires Issue #13 (story maps API)
- Requires Issue #16 (technical requirements)
- Requires Issue #17 (functional requirements)

## Files to Create/Modify
- `apps/api/src/services/export-service.ts` (create)
- `apps/api/src/services/export-service.test.ts` (create)
- `apps/api/src/routes/export.ts` (create)
- `apps/api/src/routes/export.test.ts` (create)
- `apps/api/src/server.ts` (modify — register export routes)
- `apps/web/src/components/ExportMenu.tsx` (create)
- `apps/web/src/components/ExportMenu.test.tsx` (create)
- `apps/web/src/components/Toolbar.tsx` (modify — add Export button)
