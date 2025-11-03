---
issue: 38
stream: Navigation Store Foundation
agent: general-purpose
started: 2025-11-02T08:59:30Z
status: in_progress
---

# Stream A: Navigation Store Foundation

## Scope
Core navigation logic and state management

## Files
- `warhammer-v2/src/stores/navigation.js` (new file)

## Tasks
- Create Svelte writable store for navigation state
- Implement history stack (max 50 items, FIFO)
- Core functions: `navigateToEntity(type, id)`, `navigateBack()`, `navigateForward()`
- History format: `[{type, id, label, timestamp}, ...]`
- Circular navigation detection
- Export store and navigation functions
- Unit tests for core logic

## Progress
- Starting implementation
