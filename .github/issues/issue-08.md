## Summary
Implement inline editing for all card types (Epic, Activity, Story) on the canvas. Users can double-click any card to enter edit mode, modify fields, and press Enter/Escape or click away to save/cancel.

## Who This Is For
**Founder perspective**: Users need to be able to quickly edit cards right on the canvas without opening a separate dialog. Double-click a card, type your changes, done. Fast and fluid.
**Agent perspective**: Add edit mode to each node component. On double-click, switch to an editable form view. On blur/Enter, commit changes to the Zustand store. On Escape, cancel. Use controlled inputs bound to local state that syncs to store on save.

## Acceptance Criteria
- [ ] Double-clicking any node enters edit mode for that node
- [ ] Edit mode shows editable text inputs/textareas for title and description
- [ ] For StoryNode: edit mode also shows priority select and story points input
- [ ] For EpicNode: edit mode shows a color picker for the epic color
- [ ] Pressing Enter saves changes and exits edit mode
- [ ] Pressing Escape cancels changes and exits edit mode  
- [ ] Clicking outside the node saves changes and exits edit mode
- [ ] Changes are committed to the Zustand store (updateEpic, updateActivity, updateStory)
- [ ] Node stops being draggable while in edit mode (prevents accidental moves)
- [ ] Only one node can be in edit mode at a time
- [ ] Empty titles are not allowed — revert to previous value if title is empty on save

## Technical Specification

### Edit Mode State
Add to the Zustand store:
```ts
editingNodeId: string | null;
startEditing: (id: string) => void;
stopEditing: () => void;
```

### Node Component Pattern
Each node component follows the pattern:
```tsx
function EpicNode({ data, id }: NodeProps<EpicNodeData>) {
  const isEditing = useStoryMapStore(s => s.editingNodeId === id);
  const startEditing = useStoryMapStore(s => s.startEditing);
  
  if (isEditing) return <EpicEditForm data={data} id={id} />;
  return <EpicDisplay data={data} id={id} onDoubleClick={() => startEditing(id)} />;
}
```

### Form Components
```
apps/web/src/components/nodes/
├── EpicEditForm.tsx
├── ActivityEditForm.tsx
├── StoryEditForm.tsx
```

### StoryEditForm Fields
- Title (text input, required)
- Description (textarea)
- Acceptance Criteria (textarea)
- Priority (select: must/should/could/wont)
- Story Points (number input, optional)

### Preventing Drag During Edit
Use React Flow's `nodeDragThreshold` or set `draggable: false` on the node data when editing.

## Test Requirements

### Test: Edit mode toggle
```
File: apps/web/src/components/nodes/EpicNode.test.tsx (add to existing)

Test: "enters edit mode on double-click"
- Render EpicNode
- Fire doubleClick event
- Assert input fields appear (title input, description textarea)

Test: "exits edit mode on Enter key"
- Enter edit mode
- Change title
- Press Enter
- Assert display mode returns with updated title

Test: "cancels edit on Escape"
- Enter edit mode
- Change title to 'New Title'
- Press Escape
- Assert display mode returns with ORIGINAL title

Test: "saves on blur (click outside)"
- Enter edit mode
- Change title
- Fire blur event on the form
- Assert changes are saved
```

### Test: StoryNode editing
```
File: apps/web/src/components/nodes/StoryNode.test.tsx (add to existing)

Test: "edit mode shows priority selector"
- Enter edit mode
- Assert a select/dropdown with MoSCoW options is present

Test: "edit mode shows story points input"
- Enter edit mode
- Assert a number input for story points exists

Test: "priority change is saved"
- Enter edit mode
- Change priority from 'could' to 'must'
- Save
- Assert store has updated priority

Test: "empty title reverts to previous value"
- Enter edit mode
- Clear the title input
- Press Enter
- Assert title reverts to original value
```

### Test: Single edit mode
```
File: apps/web/src/stores/story-map-store.test.ts (add to existing)

Test: "startEditing sets editingNodeId"
- Call startEditing('node-1')
- Assert editingNodeId === 'node-1'

Test: "startEditing on a new node replaces previous"
- Call startEditing('node-1')
- Call startEditing('node-2')
- Assert editingNodeId === 'node-2'

Test: "stopEditing clears editingNodeId"
- Call startEditing('node-1')
- Call stopEditing()
- Assert editingNodeId === null
```

## Dependencies
- Requires Issue #6 (Zustand store)
- Requires Issue #7 (Node components)

## Files to Create/Modify
- `apps/web/src/stores/story-map-store.ts` (modify — add editingNodeId, startEditing, stopEditing)
- `apps/web/src/components/nodes/EpicNode.tsx` (modify — add edit mode)
- `apps/web/src/components/nodes/EpicEditForm.tsx` (create)
- `apps/web/src/components/nodes/ActivityNode.tsx` (modify)
- `apps/web/src/components/nodes/ActivityEditForm.tsx` (create)
- `apps/web/src/components/nodes/StoryNode.tsx` (modify)
- `apps/web/src/components/nodes/StoryEditForm.tsx` (create)
- All corresponding test files (modify/create)
