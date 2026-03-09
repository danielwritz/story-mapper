## Summary
Create custom React Flow node components for Epics, Activities, and Stories. Each card type has a distinct visual style and displays relevant information. These are the visual building blocks of the story map canvas.

## Who This Is For
**Founder perspective**: These are the actual cards users see on the canvas. Epics are bold colored headers at the top, Activities are medium cards underneath, and Stories are detailed cards at the bottom with priority indicators and story points.
**Agent perspective**: Create three custom React Flow node types (`EpicNode`, `ActivityNode`, `StoryNode`) registered with React Flow. Each has display mode showing title + metadata, visual distinction through colors/sizing, and connection handles.

## Acceptance Criteria
- [ ] `EpicNode` component renders with colored header bar (using epic's `color` property), title, and description preview
- [ ] `ActivityNode` component renders with title, description preview, and a count of child stories
- [ ] `StoryNode` component renders with title, priority badge (MoSCoW), story points, and description preview
- [ ] Each node type has React Flow `Handle` components for connections (source bottom, target top)
- [ ] Selected nodes show a highlighted border (ring/outline)
- [ ] Nodes use the `data` prop to access their entity data
- [ ] All three node types are registered with React Flow via `nodeTypes` prop
- [ ] Cards have consistent width (280px) but flexible height
- [ ] Priority is visualized with color-coded badges: must=red, should=orange, could=blue, wont=gray
- [ ] Each node has `data-testid` attributes for testing

## Technical Specification

### Node Component Files
```
apps/web/src/components/nodes/
├── EpicNode.tsx
├── EpicNode.test.tsx
├── ActivityNode.tsx
├── ActivityNode.test.tsx
├── StoryNode.tsx
├── StoryNode.test.tsx
├── node-types.ts          # Registry: { epic: EpicNode, activity: ActivityNode, story: StoryNode }
└── index.ts               # Re-exports
```

### EpicNode Layout
```
┌──────────────────────────────┐
│ ████████ COLORED HEADER ████ │  ← epic.color background
│ Epic Title                   │
│ Description preview...       │
│ ● 3 activities               │  ← count from store
└──────────────────────────────┘
          ⬇ (source handle)
```

### ActivityNode Layout
```
     ⬆ (target handle)
┌──────────────────────────────┐
│ Activity Title               │
│ Description preview...       │
│ 📋 5 stories                 │  ← count from store
└──────────────────────────────┘
          ⬇ (source handle)
```

### StoryNode Layout
```
     ⬆ (target handle)
┌──────────────────────────────┐
│ Story Title          [MUST]  │  ← priority badge
│ Description preview...       │
│ ─────────────────────────    │
│ 📊 5 pts                     │  ← story points
└──────────────────────────────┘
```

### Integration with Canvas
```tsx
// Canvas.tsx update:
import { nodeTypes } from './nodes/node-types';

<ReactFlow
  nodeTypes={nodeTypes}
  nodes={nodes}
  edges={edges}
  ...
/>
```

## Test Requirements

### Test: EpicNode
```
File: apps/web/src/components/nodes/EpicNode.test.tsx

Test: "renders epic title"
- Render EpicNode with data={{ title: 'User Management', color: '#6366f1', description: 'Handle users' }}
- Assert 'User Management' is visible

Test: "renders colored header with epic color"
- Render with color '#6366f1'
- Assert header element has background-color style matching the color

Test: "renders description preview"
- Assert description text is visible

Test: "has source handle at bottom"
- Assert handle element exists with type="source"
```

### Test: ActivityNode
```
File: apps/web/src/components/nodes/ActivityNode.test.tsx

Test: "renders activity title"
Test: "renders story count"
- Render with data that includes storyCount: 5
- Assert '5 stories' text is visible

Test: "has both source and target handles"
```

### Test: StoryNode
```
File: apps/web/src/components/nodes/StoryNode.test.tsx

Test: "renders story title"
Test: "renders priority badge with correct color"
- Render with priority 'must'
- Assert badge shows 'MUST' with red styling
- Render with priority 'could'
- Assert badge shows 'COULD' with blue styling

Test: "renders story points when present"
- Render with storyPoints: 8
- Assert '8 pts' is visible

Test: "hides story points when null"
- Render with storyPoints: null
- Assert no points display

Test: "has target handle at top"
```

### Test: Node type registry
```
File: apps/web/src/components/nodes/node-types.test.ts

Test: "exports all three node types"
- Import nodeTypes
- Assert nodeTypes.epic is defined
- Assert nodeTypes.activity is defined
- Assert nodeTypes.story is defined
```

## Dependencies
- Requires Issue #2 (React + Tailwind setup)
- Requires Issue #4 (shared types for Epic, Activity, Story)
- Requires Issue #5 (Canvas with React Flow)

## Files to Create/Modify
- `apps/web/src/components/nodes/EpicNode.tsx` (create)
- `apps/web/src/components/nodes/EpicNode.test.tsx` (create)
- `apps/web/src/components/nodes/ActivityNode.tsx` (create)
- `apps/web/src/components/nodes/ActivityNode.test.tsx` (create)
- `apps/web/src/components/nodes/StoryNode.tsx` (create)
- `apps/web/src/components/nodes/StoryNode.test.tsx` (create)
- `apps/web/src/components/nodes/node-types.ts` (create)
- `apps/web/src/components/nodes/index.ts` (create)
- `apps/web/src/components/Canvas.tsx` (modify — register nodeTypes)
