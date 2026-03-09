## Summary
Implement the base interactive canvas using React Flow in the web app. This is the core visual surface where all story mapping happens — users will see nodes (cards) and edges (connections) on an infinite pannable, zoomable canvas.

## Who This Is For
**Founder perspective**: This is THE canvas — the main workspace where story maps are built. Think Miro/FigJam but purpose-built for story mapping. Users can pan around, zoom in/out, and see a minimap for orientation.
**Agent perspective**: Install React Flow v12, create a `Canvas` component wrapping `ReactFlow`, configure it with zoom/pan controls, a minimap, a background grid, and integrate it into `App.tsx` as the main view.

## Acceptance Criteria
- [ ] React Flow v12 (`@xyflow/react`) is installed in `apps/web`
- [ ] `Canvas` component renders a full-viewport React Flow instance
- [ ] Canvas has pan (mouse drag) and zoom (scroll wheel) enabled
- [ ] Minimap is visible in the bottom-right corner
- [ ] Background shows a dot grid pattern
- [ ] Controls panel (zoom in, zoom out, fit view) is visible
- [ ] Canvas fills the entire viewport (100vw x 100vh minus any toolbar)
- [ ] A top toolbar/header bar shows the app name "Story Mapper" and is 48px tall
- [ ] Canvas occupies remaining vertical space below the toolbar
- [ ] Component is exported as named export from `apps/web/src/components/Canvas.tsx`
- [ ] App.tsx renders the Canvas as the main content

## Technical Specification

### Dependencies to Install (apps/web)
```
Production: @xyflow/react
```

### Component Structure
```
apps/web/src/
├── components/
│   ├── Canvas.tsx           # Main React Flow canvas
│   ├── Canvas.test.tsx      # Canvas tests
│   ├── Toolbar.tsx          # Top toolbar/header
│   └── Toolbar.test.tsx     # Toolbar tests
├── App.tsx                  # Updated to render Toolbar + Canvas
└── App.test.tsx             # Updated tests
```

### `Canvas.tsx` Implementation Notes
```tsx
// Uses ReactFlow with:
// - <Background variant={BackgroundVariant.Dots} />
// - <Controls />  
// - <MiniMap />
// - fitView on initial load
// - Default empty nodes/edges arrays
// - proOptions={{ hideAttribution: true }} to hide watermark
// - Proper container div with h-full w-full
```

### `Toolbar.tsx` Implementation Notes
```tsx
// Simple fixed header bar
// - 48px height, dark background  
// - "Story Mapper" title on the left
// - data-testid="toolbar"
```

### Layout
```tsx
// App.tsx layout:
<div className="h-screen w-screen flex flex-col">
  <Toolbar />
  <div className="flex-1">
    <Canvas />
  </div>
</div>
```

## Test Requirements

### Test: Canvas component
```
File: apps/web/src/components/Canvas.test.tsx

Test: "renders the React Flow canvas"
- Render <Canvas /> inside a ReactFlowProvider
- Assert the React Flow container element is in the document
  (look for class 'react-flow' or data attribute)

Test: "renders the minimap"
- Render <Canvas />
- Assert an element with class 'react-flow__minimap' exists

Test: "renders the controls panel"
- Render <Canvas />
- Assert an element with class 'react-flow__controls' exists

Test: "renders the background grid"
- Render <Canvas />
- Assert an element with class 'react-flow__background' exists

Test: "canvas fills its container"
- Render <Canvas /> in a container with known dimensions
- Assert the canvas wrapper has proper sizing styles
```

### Test: Toolbar component
```
File: apps/web/src/components/Toolbar.test.tsx

Test: "renders the app title"
- Render <Toolbar />
- Assert screen.getByText('Story Mapper') is present

Test: "has correct test id"
- Render <Toolbar />
- Assert screen.getByTestId('toolbar') exists

Test: "toolbar has fixed height styling"
- Render <Toolbar />
- Assert the toolbar element has height-related class (h-12)
```

### Test: Updated App
```
File: apps/web/src/App.test.tsx

Test: "renders toolbar and canvas"
- Render <App />
- Assert toolbar is present
- Assert canvas container is present

Test: "app fills the viewport"
- Render <App />
- Assert root container has h-screen w-screen classes
```

## Dependencies
- Requires Issue #1 (monorepo setup)
- Requires Issue #2 (Vite + React + Tailwind setup)

## Files to Create/Modify
- `apps/web/package.json` (modify — add @xyflow/react)
- `apps/web/src/components/Canvas.tsx` (create)
- `apps/web/src/components/Canvas.test.tsx` (create)
- `apps/web/src/components/Toolbar.tsx` (create)
- `apps/web/src/components/Toolbar.test.tsx` (create)
- `apps/web/src/App.tsx` (modify)
- `apps/web/src/App.test.tsx` (modify)
