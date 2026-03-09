## Summary
Implement drag-and-drop functionality for re-ordering and re-parenting cards on the canvas. Users can drag stories between activities, reorder stories within an activity, and reorder epics/activities horizontally.

## Who This Is For
**Founder perspective**: The whole point of a canvas is moving things around! Users drag story cards from one column to another, reorder the priority of stories top-to-bottom, and rearrange epics left-to-right. The map is a living, breathing layout.
**Agent perspective**: Wire React Flow's `onNodeDragStop` event to update the Zustand store. Implement snap-to-grid positioning, re-parenting logic (when a story is dragged to a different activity column), and sort order recalculation.

## Acceptance Criteria
- [ ] Epics can be dragged horizontally to reorder (y-position locked to row 0)
- [ ] Activities can be dragged horizontally within their epic's column space
- [ ] Stories can be dragged vertically to reorder within their activity column
- [ ] Stories can be dragged horizontally to a different activity column (re-parenting)
- [ ] When a story is dropped on a different activity's column, its `activityId` is updated
- [ ] Sort orders are recalculated after every drop
- [ ] Nodes snap to a 20px grid for clean alignment
- [ ] Visual drop zones highlight when dragging a story over a valid activity column
- [ ] Dragging is smooth with no jank (use React Flow's built-in drag handling)
- [ ] After drop, the canvas auto-repositions nodes to maintain clean layout

## Technical Specification

### Layout Engine
Create a layout utility that calculates positions for all nodes based on the hierarchy:

```ts
// apps/web/src/utils/layout-engine.ts

interface LayoutConfig {
  epicY: 0;
  activityY: 200;
  storyStartY: 400;
  columnWidth: 320;
  storyHeight: 160;
  gap: 20;
}

function calculateLayout(
  epics: Epic[],
  activities: Activity[],
  stories: Story[]
): Map<string, { x: number; y: number }>
```

Layout logic:
- Epics are placed left-to-right at y=0, separated by total column width of their activities
- Activities are placed left-to-right under their parent epic at y=200
- Stories stack vertically under their parent activity starting at y=400

### Drop Zone Detection
When dragging a story, determine which activity column it's being dragged over:
```ts
function findTargetActivity(
  dropX: number,
  activities: Activity[],
  layout: Map<string, { x: number; y: number }>
): string | null
```

### onNodeDragStop Handler
```ts
const onNodeDragStop = useCallback((event, node) => {
  const nodeType = node.type; // 'epic' | 'activity' | 'story'
  
  if (nodeType === 'story') {
    const targetActivityId = findTargetActivity(node.position.x, ...);
    if (targetActivityId !== node.data.activityId) {
      store.moveStory(node.id, targetActivityId, newSortOrder);
    } else {
      // Reorder within same activity based on y position
      store.reorderStory(node.id, calculateNewOrder(node.position.y));
    }
  }
  
  // Recalculate layout after any drop
  recalculateLayout();
}, []);
```

### Store Additions
```ts
// Add to store:
reorderEpics: (epicId: string, newSortOrder: number) => void;
reorderActivities: (activityId: string, newSortOrder: number) => void;
reorderStory: (storyId: string, newSortOrder: number) => void;
```

## Test Requirements

### Test: Layout engine
```
File: apps/web/src/utils/layout-engine.test.ts

Test: "positions single epic at origin"
- One epic, no activities
- Assert epic position: { x: 0, y: 0 }

Test: "positions two epics side by side"
- Two epics each with one activity
- Assert second epic x > first epic x + columnWidth

Test: "positions activities under their parent epic"
- Epic at x=0, two activities
- Assert both activities have y=200
- Assert activities are at x=0 and x=320

Test: "positions stories vertically under their activity"
- Activity at x=0, three stories
- Assert stories have increasing y values starting at y=400
- Assert stories share the same x as their activity

Test: "complex layout with multiple epics and varying story counts"
- 2 epics, 3 activities, 7 stories spread across activities
- Assert all positions are non-overlapping
- Assert parent-child relationships are visually maintained
```

### Test: Drop zone detection
```
File: apps/web/src/utils/layout-engine.test.ts (same file)

Test: "findTargetActivity returns correct activity for drop position"
- Set up layout with 3 activity columns
- Assert dropX=50 → first activity
- Assert dropX=370 → second activity
- Assert dropX=690 → third activity

Test: "findTargetActivity returns null for position outside all columns"
- Assert dropX=-100 → null
- Assert dropX=10000 → null
```

### Test: Drag and drop integration
```
File: apps/web/src/components/Canvas.test.tsx (add to existing)

Test: "story re-parents when dragged to different activity column"
- Set up store with 2 activities and a story under activity 1
- Simulate node drag stop at activity 2's column x position
- Assert story.activityId changed to activity 2

Test: "epic reorder updates sortOrder"
- Set up store with 3 epics
- Simulate dragging epic 3 to position of epic 1
- Assert sort orders are recalculated

Test: "layout recalculates after drop"
- Perform any drag-drop operation
- Assert all node positions match the layout engine output
```

## Dependencies
- Requires Issue #5 (Canvas with React Flow)
- Requires Issue #6 (Zustand store)
- Requires Issue #7 (Node components)

## Files to Create/Modify
- `apps/web/src/utils/layout-engine.ts` (create)
- `apps/web/src/utils/layout-engine.test.ts` (create)
- `apps/web/src/components/Canvas.tsx` (modify — add drag handlers)
- `apps/web/src/stores/story-map-store.ts` (modify — add reorder actions)
- `apps/web/src/stores/story-map-store.test.ts` (modify — add reorder tests)
