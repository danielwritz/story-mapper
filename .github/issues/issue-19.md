## Summary
Implement undo/redo functionality for all canvas operations. Every action (create, edit, delete, move) can be undone and redone using Ctrl+Z / Ctrl+Shift+Z or toolbar buttons.

## Who This Is For
**Founder perspective**: Mistakes happen! Accidentally delete a card? Ctrl+Z. Drag something to the wrong place? Undo. This is table-stakes for any editor/canvas tool.
**Agent perspective**: Implement an undo/redo stack in the Zustand store. Each action pushes a snapshot or command to the history stack. Undo pops and reverts, Redo replays. Wire keyboard shortcuts and add toolbar buttons.

## Acceptance Criteria
- [ ] Ctrl+Z triggers undo
- [ ] Ctrl+Shift+Z (or Ctrl+Y) triggers redo
- [ ] Undo button in toolbar (disabled when nothing to undo)
- [ ] Redo button in toolbar (disabled when nothing to redo)
- [ ] All CRUD operations are undoable: create, update, delete for all entity types
- [ ] Move/reorder operations are undoable
- [ ] Undo reverts the canvas to its previous state
- [ ] Redo replays the last undone action
- [ ] A new action after undoing clears the redo stack
- [ ] History stack holds up to 50 entries (older entries are dropped)
- [ ] Undo/redo also syncs with the API (sends the reverting API call)

## Technical Specification

### History Stack Design
Use a command pattern: each action records the forward and backward operations.

```ts
interface HistoryEntry {
  description: string;  // Human readable: "Added Epic 'Auth'"
  undo: () => void;     // Function to revert
  redo: () => void;     // Function to replay
}

interface HistoryState {
  past: HistoryEntry[];      // Undo stack
  future: HistoryEntry[];    // Redo stack
  
  pushHistory: (entry: HistoryEntry) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

### Integration Pattern
Wrap each store action to automatically push history:

```ts
// Before: 
addEpic: (data) => { /* insert epic */ }

// After:
addEpic: (data) => {
  const epic = createEpic(data);
  pushHistory({
    description: `Added Epic '${data.title}'`,
    undo: () => removeEpicInternal(epic.id),
    redo: () => addEpicInternal(epic),
  });
}
```

### Keyboard Shortcuts
```ts
// apps/web/src/hooks/use-keyboard-shortcuts.ts
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      store.undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || e.key === 'y')) {
      e.preventDefault();
      store.redo();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

## Test Requirements

### Test: History stack
```
File: apps/web/src/stores/history.test.ts

Test: "pushHistory adds entry to past"
- Push an entry
- Assert past has length 1

Test: "undo moves entry from past to future"
- Push entry, call undo
- Assert past is empty
- Assert future has length 1
- Assert undo function was called

Test: "redo moves entry from future to past"
- Push, undo, redo
- Assert past has length 1
- Assert future is empty
- Assert redo function was called

Test: "new action after undo clears future"
- Push A, push B, undo (removes B), push C
- Assert future is empty
- Assert past has A, C

Test: "stack limit of 50"
- Push 60 entries
- Assert past has length 50

Test: "canUndo/canRedo computed correctly"
- Initially: canUndo=false, canRedo=false
- After push: canUndo=true, canRedo=false
- After undo: canUndo=false, canRedo=true
```

### Test: Undo/redo integration with store
```
File: apps/web/src/stores/story-map-store.test.ts (add to existing)

Test: "undo addEpic removes the epic"
- addEpic, assert 1 epic
- undo, assert 0 epics

Test: "redo addEpic restores the epic"
- addEpic, undo (0 epics), redo
- Assert 1 epic with same data

Test: "undo updateStory reverts to previous values"
- addStory, updateStory title to 'New'
- undo
- Assert title is back to original

Test: "undo deleteStory restores the story"
- addStory, deleteStory
- undo
- Assert story is back

Test: "undo moveStory reverts activityId"
```

### Test: Keyboard shortcuts
```
File: apps/web/src/hooks/use-keyboard-shortcuts.test.ts

Test: "Ctrl+Z calls undo"
- Fire keydown with ctrl+z
- Assert store.undo was called

Test: "Ctrl+Shift+Z calls redo"
- Fire keydown with ctrl+shift+z
- Assert store.redo was called

Test: "regular Z key does not trigger undo"
- Fire keydown with just 'z' (no ctrl)
- Assert undo was NOT called
```

### Test: Toolbar undo/redo buttons
```
File: apps/web/src/components/Toolbar.test.tsx (add to existing)

Test: "undo button is disabled when nothing to undo"
Test: "redo button is disabled when nothing to redo"
Test: "undo button calls store.undo"
Test: "redo button calls store.redo"
```

## Dependencies
- Requires Issue #6 (Zustand store)
- Requires Issue #5 (Canvas + Toolbar)

## Files to Create/Modify
- `apps/web/src/stores/story-map-store.ts` (modify — wrap actions with history)
- `apps/web/src/stores/history.test.ts` (create)
- `apps/web/src/hooks/use-keyboard-shortcuts.ts` (create)
- `apps/web/src/hooks/use-keyboard-shortcuts.test.ts` (create)
- `apps/web/src/components/Toolbar.tsx` (modify — add undo/redo buttons)
- `apps/web/src/components/Toolbar.test.tsx` (modify)
