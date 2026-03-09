## Summary
Implement card creation — users can add new Epics, Activities, and Stories to the canvas via a toolbar and context menu. New cards appear on the canvas with default values that can be immediately edited.

## Who This Is For
**Founder perspective**: Users need a fast way to add new cards. A toolbar with "Add Epic" / "Add Activity" / "Add Story" buttons, plus right-click context menu on the canvas. New cards pop in and the user can immediately start typing.
**Agent perspective**: Add creation buttons to the Toolbar, implement a context menu on the canvas, wire both to the Zustand store's add* actions, position new nodes appropriately, and auto-enter edit mode on newly created cards.

## Acceptance Criteria
- [ ] Toolbar has "Add Epic", "Add Activity", "Add Story" buttons
- [ ] "Add Epic" creates a new epic at the next available horizontal position in the top row
- [ ] "Add Activity" is only enabled when an epic is selected — creates activity under selected epic
- [ ] "Add Story" is only enabled when an activity is selected — creates story under selected activity
- [ ] Right-clicking on empty canvas space shows a context menu with "Add Epic" option
- [ ] Right-clicking on an Epic node shows context menu with "Add Activity" and "Delete Epic"
- [ ] Right-clicking on an Activity node shows "Add Story" and "Delete Activity"
- [ ] Right-clicking on a Story node shows "Delete Story"
- [ ] Newly created cards auto-enter edit mode so users can immediately type a title
- [ ] New Epics get a random pastel color from a predefined palette
- [ ] New cards have sensible default titles: "New Epic", "New Activity", "New Story"
- [ ] Delete actions show a confirmation dialog before removing

## Technical Specification

### Toolbar Updates
```tsx
// Toolbar.tsx additions:
// - "Add Epic" button (always enabled)
// - "Add Activity" button (enabled when selectedNodeId is an epic)
// - "Add Story" button (enabled when selectedNodeId is an activity)
// - Visual disabled state (opacity + cursor)
```

### Context Menu Component
```
apps/web/src/components/ContextMenu.tsx
```
- Positioned at mouse coordinates
- Renders menu items based on what was right-clicked
- Closes on click outside or Escape
- Uses a portal to avoid z-index issues within React Flow

### Color Palette for Epics
```ts
const EPIC_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet  
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
];
```

### Auto-positioning Logic
- New Epics: placed at `x = lastEpic.x + 320` (or x=0 if first), `y = 0`
- New Activities: placed at `x = lastActivityInEpic.x + 320` (or aligned under parent epic), `y = 200`
- New Stories: placed at `x = parentActivity.x`, `y = lastStoryInActivity.y + 180` (or y=400 if first)

### Confirmation Dialog
```tsx
// Simple modal component for delete confirmation
// "Are you sure you want to delete [Epic/Activity/Story] '[title]'?"
// "This will also delete [N] child items." (for cascading deletes)
// [Cancel] [Delete] buttons
```

## Test Requirements

### Test: Toolbar creation buttons
```
File: apps/web/src/components/Toolbar.test.tsx (add to existing)

Test: "Add Epic button is always enabled"
- Render Toolbar
- Assert "Add Epic" button is not disabled

Test: "Add Activity button is disabled when nothing selected"
- Render Toolbar with no selection
- Assert "Add Activity" button is disabled

Test: "Add Activity button is enabled when epic is selected"
- Set store selectedNodeId to an epic id
- Assert "Add Activity" button is enabled

Test: "Add Story button is enabled when activity is selected"
- Set store selectedNodeId to an activity id
- Assert "Add Story" button is enabled

Test: "clicking Add Epic creates an epic in the store"
- Click "Add Epic"
- Assert store.epics has length 1
- Assert the new epic has a generated title and color
```

### Test: Context menu
```
File: apps/web/src/components/ContextMenu.test.tsx

Test: "shows Add Epic on empty canvas right-click"
- Fire contextmenu event on canvas
- Assert "Add Epic" menu item is visible

Test: "shows Add Activity and Delete when right-clicking an epic"
- Right-click on an epic node
- Assert "Add Activity" and "Delete Epic" are visible

Test: "context menu closes on Escape"
- Open context menu
- Press Escape
- Assert menu is no longer visible

Test: "context menu closes on click outside"
- Open context menu
- Click elsewhere
- Assert menu is gone
```

### Test: Delete confirmation
```
File: apps/web/src/components/ConfirmDialog.test.tsx

Test: "shows confirmation message with item title"
Test: "Cancel button closes dialog without deleting"
Test: "Delete button removes item and closes dialog"
Test: "shows cascade warning when deleting epic with children"
```

### Test: Auto-edit mode on creation
```
File: apps/web/src/components/Toolbar.test.tsx (add to existing)

Test: "new epic auto-enters edit mode"
- Click "Add Epic"
- Assert store.editingNodeId === the new epic's id
```

## Dependencies
- Requires Issue #6 (Zustand store with add/remove actions)
- Requires Issue #7 (Node components)
- Requires Issue #8 (Inline editing — so new cards can auto-enter edit mode)

## Files to Create/Modify
- `apps/web/src/components/Toolbar.tsx` (modify — add creation buttons)
- `apps/web/src/components/Toolbar.test.tsx` (modify)
- `apps/web/src/components/ContextMenu.tsx` (create)
- `apps/web/src/components/ContextMenu.test.tsx` (create)
- `apps/web/src/components/ConfirmDialog.tsx` (create)
- `apps/web/src/components/ConfirmDialog.test.tsx` (create)
- `apps/web/src/components/Canvas.tsx` (modify — add context menu handler)
