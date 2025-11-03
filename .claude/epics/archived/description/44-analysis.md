---
issue: 44
title: Add Entity Description Modal to Browse and Creator Pages
analyzed: 2025-11-01T19:55:40Z
estimated_hours: 3
parallelization_factor: 1.0
---

# Parallel Work Analysis: Issue #44

## Overview
Simple UI integration task to make entity cards clickable in Browse and Creator pages, opening the EntityDescription modal to enable manual testing of the Related tab feature from Issue #41.

## Parallel Streams

### Stream A: UI Integration (Single Stream)
**Scope**: Add click handlers and modal integration to Browse and Creator pages

**Files**:
- `warhammer-v2/src/routes/Browse.svelte` (add modal integration)
- `warhammer-v2/src/routes/Creator.svelte` (add modal integration)

**Agent Type**: frontend-specialist

**Can Start**: immediately (Issue #41 complete)

**Estimated Hours**: 3 hours

**Dependencies**: Issue #41 (EntityDescription component with Related tab)

**Tasks**:
1. Browse.svelte modifications:
   - Import DescriptionModal component
   - Add state for modal (entityType, entityId, showModal)
   - Add click handler to item-card elements
   - Add keyboard navigation (Enter key)
   - Render DescriptionModal conditionally
   - Handle modal close and navigation events
   - Update CSS for cursor and focus styles

2. Creator.svelte modifications:
   - Import DescriptionModal component
   - Add state for modal
   - Add click handlers to skill/talent/spell selection lists
   - Render DescriptionModal conditionally
   - Handle modal interactions

3. Testing:
   - Test Browse page entity card clicks
   - Test modal opens with correct entity
   - Test Related tab is visible and functional
   - Test navigation between entities via Related tab
   - Test modal close (Esc, close button)
   - Test Creator page integration
   - Test keyboard navigation
   - Verify no console errors

## Coordination Points

### Shared Files
None - Browse and Creator are independent routes

### Sequential Requirements
1. Issue #41 must be complete (EntityDescription with Related tab)
2. Single stream - no parallel work needed
3. Simple straightforward implementation

### Integration Points
- Uses existing DescriptionModal component
- Uses existing EntityDescription component
- No new components needed

## Conflict Risk Assessment
**No Risk**: Single stream, independent files, existing components

## Parallelization Strategy

**Recommended Approach**: Single stream (no parallelization needed)

**Reasoning**:
- Very small task (3 hours)
- Two similar files with same pattern
- Not worth overhead of coordination
- Faster to do sequentially

**Execution Plan**:
1. Modify Browse.svelte first (~1.5 hours)
2. Modify Creator.svelte second (~1 hour)
3. Manual testing (~30 minutes)

## Expected Timeline

**Total time**: 3 hours

**No parallelization needed** - task is too small and simple

## Notes

### Purpose
This task exists to enable manual testing of the Related tab feature from Issue #41. The EntityDescription component with Related tab is complete and tested, but users cannot currently open it from the UI.

### Implementation Pattern
Both files will follow the same pattern:
1. Import DescriptionModal
2. Add state (showModal, selectedEntity)
3. Add click handler
4. Render modal conditionally
5. Handle navigation events

### Testing Focus
The main goal is to enable users to:
- Click an entity in Browse → See description with Related tab
- Click a related entity → Navigate to its description
- Test the full Related tab functionality from Issue #41

### Future Work
This is a temporary solution for manual testing. A more comprehensive entity navigation system may be built later as part of the broader UX design.

### CSS Considerations
- Entity cards need cursor: pointer
- Cards need focus styles for keyboard navigation
- Cards need role="button" and tabindex for accessibility
