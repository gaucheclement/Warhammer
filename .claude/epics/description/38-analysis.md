---
issue: 38
title: Implement Navigation and History System
analyzed: 2025-11-01T14:26:07Z
estimated_hours: 16
parallelization_factor: 1.5
---

# Parallel Work Analysis: Issue #38

## Overview
Implement a complete navigation system with history stack management, breadcrumb trails, back/forward navigation, browser history API integration, and keyboard shortcuts (Alt+Left/Right). This builds on the completed EntityDescription component from Task #37 to enable seamless navigation between entity views.

## Parallel Streams

### Stream A: Navigation Store Foundation
**Scope**: Core navigation logic and state management
**Files**:
- `warhammer-v2/src/stores/navigation.js` (new file)
**Agent Type**: frontend-specialist
**Can Start**: immediately
**Estimated Hours**: 6 hours
**Dependencies**: none

**Details**:
- Create Svelte writable store for navigation state
- Implement history stack (max 50 items, FIFO)
- Core functions: `navigateToEntity(type, id)`, `navigateBack()`, `navigateForward()`
- History format: `[{type, id, label, timestamp}, ...]`
- Circular navigation detection
- Export store and navigation functions
- Unit tests for core logic

### Stream B: Navigation UI Components
**Scope**: Visual components for navigation controls
**Files**:
- `warhammer-v2/src/components/NavigationBar.svelte` (new file)
**Agent Type**: frontend-specialist
**Can Start**: immediately (parallel with A)
**Estimated Hours**: 6 hours
**Dependencies**: none (can work with mocked store interface)

**Details**:
- NavigationBar component with back/forward buttons
- Breadcrumb trail display (last 5 items)
- History dropdown (recent 10 items)
- Disabled state handling for buttons
- Styling consistent with existing components (Badge.svelte, SearchBar.svelte patterns)
- Component can be built with interface contract, integrated once store is ready

### Stream C: Browser & Keyboard Integration
**Scope**: Browser history API and keyboard shortcuts
**Files**:
- `warhammer-v2/src/stores/navigation.js` (enhance)
- `warhammer-v2/src/App.svelte` (add keyboard listeners)
**Agent Type**: frontend-specialist
**Can Start**: after Stream A completes (needs working store)
**Estimated Hours**: 4 hours
**Dependencies**: Stream A (core store must exist)

**Details**:
- URL hash format: `#/entity/:type/:id`
- Browser `hashchange` event listener
- Sync navigation store with URL changes
- Keyboard shortcuts: Alt+Left (back), Alt+Right (forward)
- `window.addEventListener('keydown')` integration
- Browser back/forward button support
- Integration testing with router.js

## Coordination Points

### Shared Files
- `warhammer-v2/src/stores/navigation.js`:
  - Stream A creates the file
  - Stream C enhances with browser integration
  - **Coordination**: Stream C must wait for Stream A to complete

- `warhammer-v2/src/App.svelte`:
  - Stream C adds keyboard event listeners
  - Low conflict risk (just adding event listeners at mount)

### Sequential Requirements
1. **Stream A must complete first** - Creates the navigation store foundation
2. **Streams B and C can then proceed**:
   - Stream B integrates NavigationBar with completed store
   - Stream C adds browser/keyboard integration to completed store
3. **Final integration** - Connect NavigationBar to App.svelte layout

### Interface Contract (Enables Parallel Work)
Stream B can develop against this interface while Stream A implements it:

```javascript
// navigation.js expected exports
export const navigationHistory = writable([])
export const currentDescription = derived(...)
export function navigateToEntity(type, id) { }
export function navigateBack() { }
export function navigateForward() { }
```

## Conflict Risk Assessment
- **Low Risk**: Streams work on separate files
- **Medium Risk**: Stream C modifies navigation.js after Stream A (manageable with coordination)
- **Low Risk**: App.svelte changes are additive (keyboard listeners only)

## Parallelization Strategy

**Recommended Approach**: Hybrid (parallel + sequential)

**Phase 1 (Parallel)**: Launch Streams A and B simultaneously
- Stream A: Build navigation store
- Stream B: Build NavigationBar component with mocked store

**Phase 2 (Sequential)**: After Stream A completes
- Stream C: Add browser/keyboard integration
- Stream B: Integrate NavigationBar with real store

**Phase 3 (Integration)**:
- Add NavigationBar to Layout.svelte
- Final testing and edge case handling

## Expected Timeline

**With parallel execution**:
- Phase 1: 6 hours (A and B in parallel)
- Phase 2: 4 hours (C sequential, B integration)
- Integration: 2 hours
- **Total wall time**: ~12 hours

**Without parallel execution**:
- Sequential: 16 hours
- **Efficiency gain**: 25% faster (4 hours saved)

## Notes

### Architecture Decisions
- Uses Svelte stores pattern (consistent with existing dataStore.js, ui.js)
- Hash-based routing (consistent with svelte-spa-router usage)
- Session-only persistence (history clears on reload per requirements)

### Testing Strategy
- Unit tests for navigation store logic (circular detection, FIFO)
- Component tests for NavigationBar
- Integration tests for browser/keyboard shortcuts
- Manual testing: 50+ navigation events for memory leak verification

### Edge Cases to Handle
- Circular navigation (A→B→A→B) detection
- History at maximum (50 items, FIFO behavior)
- Invalid entity types/IDs
- Browser back/forward when history is empty
- Keyboard shortcuts conflicting with browser defaults

### Integration Points
- Must work with existing svelte-spa-router setup (router.js)
- May need entity label lookup from dataStore.js for breadcrumbs
- NavigationBar placement in Layout.svelte

### Future Considerations
- Could add history persistence to localStorage (not in requirements)
- Could add navigation animation transitions
- Could integrate with search functionality for "navigate to search result"
