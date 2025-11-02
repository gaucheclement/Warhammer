---
issue: 39
title: Build Display Mode Wrapper Components
analyzed: 2025-11-01T16:19:17Z
estimated_hours: 16
parallelization_factor: 3.0
---

# Parallel Work Analysis: Issue #39

## Overview
Create three independent wrapper components (Modal, Panel, Inline) that each integrate the EntityDescription viewer with different display contexts. These wrappers have minimal overlap and can be built simultaneously by different work streams.

## Parallel Streams

### Stream A: Modal Wrapper
**Scope**: Full-screen overlay modal for entity descriptions
**Files**:
- `warhammer-v2/src/components/DescriptionModal.svelte` (create)
- `warhammer-v2/src/stores/ui.js` (extend openModal API if needed)
**Agent Type**: frontend-specialist
**Can Start**: immediately
**Estimated Hours**: 5 hours
**Dependencies**: none
**Implementation Details**:
- Full viewport overlay with dark backdrop
- Centered content area
- Close button and Esc keyboard shortcut
- Integration with EntityDescription component
- Responsive on mobile (320px+)
- Uses existing Modal base component pattern from ui.js

### Stream B: Side Panel Wrapper
**Scope**: Resizable slide-out panel for persistent reference viewing
**Files**:
- `warhammer-v2/src/components/DescriptionPanel.svelte` (create)
- `warhammer-v2/src/stores/ui.js` (add panel state: open/closed, width)
**Agent Type**: frontend-specialist
**Can Start**: immediately
**Estimated Hours**: 6 hours
**Dependencies**: none
**Implementation Details**:
- Fixed to right side of viewport
- Default width: 400px
- Resizable: 300-800px range with drag handle
- Slide-in animation from right
- Esc to close keyboard shortcut
- Stores width preference in localStorage via ui.js
- Panel state persists across navigation
- Z-index layering to stay above content but below modals

### Stream C: Inline Accordion Wrapper
**Scope**: Expandable inline viewer embedded in list items
**Files**:
- `warhammer-v2/src/components/DescriptionInline.svelte` (create)
**Agent Type**: frontend-specialist
**Can Start**: immediately
**Estimated Hours**: 5 hours
**Dependencies**: none
**Implementation Details**:
- Embeds directly in list item flow
- Smooth height animation (expand/collapse)
- Compact layout optimized for inline context
- Click to toggle expand/collapse
- No backdrop or overlay
- Responsive behavior maintains list layout
- Optional: Esc to collapse keyboard shortcut

## Coordination Points

### Shared Files
Limited sharing - good for parallel work:
- `warhammer-v2/src/stores/ui.js` - Streams A & B may extend (coordinate store structure)
  - Stream A: May enhance modal API
  - Stream B: Adds panel state management (panelOpen, panelWidth)
  - Low conflict risk: different store slices

### Shared Dependencies
All streams depend on:
- EntityDescription component (Task 37) - COMPLETED
- Navigation system (Task 38) - COMPLETED
- Modal.svelte base component - EXISTS in codebase

### Sequential Requirements
None - all streams can complete independently. Integration testing happens after all complete.

## Conflict Risk Assessment
**Low Risk**:
- Each stream works in its own component file
- Minimal ui.js overlap (different store properties)
- No shared styling (each mode has distinct layout needs)
- EntityDescription is read-only dependency (no modifications)

## Parallelization Strategy

**Recommended Approach**: parallel

**Execution Plan**:
1. Launch Streams A, B, C simultaneously
2. Each stream creates its wrapper component independently
3. Stream B also adds panel state to ui.js (panelOpen, panelWidth stores)
4. Stream A may enhance modal API in ui.js if needed (minimal)
5. After all complete: Integration testing across all three modes
6. Final: Manual testing checklist (responsive, keyboard shortcuts, animations)

**Why Parallel Works**:
- Components are isolated (no file conflicts)
- Each wrapper has unique layout requirements
- EntityDescription API is stable (Tasks 37 & 38 complete)
- UI store extensions are in different namespaces

## Expected Timeline

With parallel execution:
- Wall time: 6 hours (longest stream = Stream B)
- Total work: 16 hours (5 + 6 + 5)
- Efficiency gain: 62% time savings (parallel vs sequential)

Without parallel execution:
- Wall time: 16 hours (sequential completion)

## Testing Strategy

### Per-Stream Testing
Each stream should test:
- Component renders with EntityDescription
- Keyboard shortcuts work (Esc)
- Responsive behavior on mobile (320px+)
- Animations smooth (no jank)
- Integration with navigation system

### Integration Testing (Post-Completion)
After all streams complete:
- Switch between display modes seamlessly
- No z-index conflicts between modal/panel
- State management doesn't leak between modes
- Keyboard shortcuts work in all contexts
- Performance: All modes render < 100ms

### Manual Testing Checklist
- [ ] Modal: Full-screen overlay works, Esc closes
- [ ] Panel: Resizable, persists width, slide animation smooth
- [ ] Inline: Expands/collapses smoothly in list context
- [ ] Mobile: All modes functional on 320px+ width
- [ ] Navigation: Back/forward works in all modes
- [ ] Accessibility: Keyboard nav, focus management, ARIA labels

## Notes

**Architectural Decisions**:
- **Composition over Inheritance**: Each wrapper composes EntityDescription rather than extending it
- **Mode Detection**: EntityDescription receives `displayMode` prop to adjust layout/behavior
- **State Management**: Each mode manages its own open/close state independently
- **Styling Isolation**: Each wrapper has mode-specific styles (no shared CSS conflicts)

**Performance Considerations**:
- Modal: Backdrop uses CSS transform for smooth fade
- Panel: ResizeObserver for smooth drag interactions
- Inline: CSS height transitions with overflow management

**Accessibility Requirements**:
- Focus trap in modal when open
- Panel announce open/close to screen readers
- Inline expansion announced (aria-expanded)
- All keyboard shortcuts documented in navigation bar

**Future Enhancements** (Out of Scope):
- Multiple panels open simultaneously
- Split-screen mode (two entities side-by-side)
- Picture-in-picture floating window
- Customizable panel position (left/right/bottom)

**Integration Points**:
- Modal: Called via `openModal('description', {type, id})` from ui.js
- Panel: Toggled via new `toggleDescriptionPanel(type, id)` function
- Inline: Used directly in list components with expand/collapse binding
