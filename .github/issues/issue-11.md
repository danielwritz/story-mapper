## Summary
Implement release swim lanes — horizontal rows below the story backbone that represent releases or iterations. Users can drag stories into release lanes to plan what goes into each release.

## Who This Is For
**Founder perspective**: This is the planning power of story mapping. Below the backbone (epics → activities → stories), you draw horizontal lines representing releases. "Everything above this line is v1.0, everything between the lines is v1.1." Users drag stories up and down between lanes to prioritize what ships when.
**Agent perspective**: Add horizontal swim lane components to the canvas rendered as React Flow group nodes or HTML overlays. Add a "Add Release" button. Connect lane assignment to the `moveStoryToRelease` store action. Visually separate lanes with labeled dividers.

## Acceptance Criteria
- [ ] Release swim lanes render as horizontal bands across the full width of the canvas
- [ ] Each lane has a label on the left side showing the release title (e.g., "v1.0 - MVP")
- [ ] "Add Release" button in the toolbar creates a new swim lane below existing ones
- [ ] Stories can be dragged into release lanes, updating their `releaseId`
- [ ] Stories visually snap to the correct vertical position within their assigned lane
- [ ] Unassigned stories (releaseId=null) live in a "Backlog" area below all release lanes
- [ ] Release lanes can be reordered by dragging their label
- [ ] Release title is editable by double-clicking the label
- [ ] Releases can be deleted via context menu (stories move to backlog, not deleted)
- [ ] Lane backgrounds alternate in subtle colors for visual distinction
- [ ] The backbone row (epics + activities) is always pinned at the top, above all release lanes

## Technical Specification

### Release Lane Component
```
apps/web/src/components/ReleaseLane.tsx
```

Each lane is rendered as a full-width horizontal overlay on the canvas:
```tsx
interface ReleaseLaneProps {
  release: Release;
  y: number;       // vertical position on canvas
  height: number;  // calculated from number of story rows
  width: number;   // total canvas width
}
```

### Layout Engine Updates
Extend the layout engine from Issue #10 to account for releases:

```ts
// Stories are positioned within their release lane's y range
// Lane height = max(minHeight, storyCount * storyHeight + padding)
// Backlog lane is always at the bottom

interface LaneLayout {
  releaseId: string | null; // null = backlog
  y: number;
  height: number;
}

function calculateLaneLayout(releases: Release[], stories: Story[]): LaneLayout[]
```

### Story Positioning Within Lanes
Stories maintain their activity column (x) but adjust their y position based on the release lane they belong to.

### Visual Design
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ EPICS ROW                                    │  ← y=0
│ ACTIVITIES ROW                               │  ← y=200  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ v1.0 - MVP │   [Story] [Story]  [Story]      │  ← Lane 1
│            │   [Story]          [Story]      │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ v1.1       │   [Story]          [Story]      │  ← Lane 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ Backlog    │   [Story] [Story]               │  ← Auto lane
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Test Requirements

### Test: ReleaseLane component
```
File: apps/web/src/components/ReleaseLane.test.tsx

Test: "renders release title"
- Render with release title 'v1.0 - MVP'
- Assert 'v1.0 - MVP' is visible

Test: "renders with correct vertical position"
- Render with y=400
- Assert the lane container has top: 400px or equivalent positioning

Test: "title is editable on double-click"
- Double-click the title
- Assert an input appears
- Type new title and press Enter
- Assert store has updated release title

Test: "lane has alternating background color"
- Render two lanes
- Assert they have different background classes/styles
```

### Test: Story-to-release assignment
```
File: apps/web/src/components/Canvas.test.tsx (add to existing)

Test: "dragging story into release lane updates releaseId"
- Set up store with one release and one unassigned story
- Simulate dropping story within the release lane's y range
- Assert story.releaseId === release.id

Test: "dragging story out of all lanes sets releaseId to null (backlog)"
- Story is in a release lane
- Drag below all lanes
- Assert story.releaseId === null
```

### Test: Release CRUD from UI
```
File: apps/web/src/components/Toolbar.test.tsx (add to existing)

Test: "Add Release button creates a new release lane"
- Click "Add Release"
- Assert store.releases has length 1
- Assert new release has default title "New Release"

Test: "deleting release moves stories to backlog"
- Add release, assign stories to it
- Delete release
- Assert all stories have releaseId === null
```

### Test: Lane layout calculation
```
File: apps/web/src/utils/layout-engine.test.ts (add to existing)

Test: "calculates lane positions based on story counts"
- 2 releases: R1 has 3 stories, R2 has 1 story
- Assert R1 lane height > R2 lane height
- Assert R2.y === R1.y + R1.height

Test: "backlog lane is always last"
- Any layout
- Assert backlog lane has the highest y position
```

## Dependencies
- Requires Issue #6 (Zustand store — moveStoryToRelease action)
- Requires Issue #7 (Node components)
- Requires Issue #10 (Drag-and-drop + layout engine)

## Files to Create/Modify
- `apps/web/src/components/ReleaseLane.tsx` (create)
- `apps/web/src/components/ReleaseLane.test.tsx` (create)
- `apps/web/src/utils/layout-engine.ts` (modify — add lane calculations)
- `apps/web/src/utils/layout-engine.test.ts` (modify)
- `apps/web/src/components/Canvas.tsx` (modify — render lanes, handle lane drops)
- `apps/web/src/components/Toolbar.tsx` (modify — add "Add Release" button)
- `apps/web/src/components/Toolbar.test.tsx` (modify)
