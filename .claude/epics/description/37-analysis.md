---
issue: 37
title: Create EntityDescription Unified Viewer Component
analyzed: 2025-11-01T13:57:01Z
estimated_hours: 16
parallelization_factor: 2.5
---

# Parallel Work Analysis: Issue #37

## Overview
Create a unified `EntityDescription.svelte` component that renders entity descriptions for any entity type (talents, skills, spells, etc.) in any display mode (modal, panel, inline). This is the foundational viewer component that will be integrated into the modal system and other UI contexts. The component needs to fetch descriptions from the generator registry, handle cross-reference navigation, manage tab state, and provide proper loading/error states.

## Parallel Streams

### Stream A: Core Component Structure & Props
**Scope**: Build the foundational Svelte component with props, basic structure, and type definitions
**Files**:
- `warhammer-v2/src/components/EntityDescription.svelte` (new file)
- Component scaffold with props interface
- Basic HTML structure (wrapper, content area, tab navigation placeholder)
**Agent Type**: frontend-specialist
**Can Start**: immediately
**Estimated Hours**: 4 hours
**Dependencies**: none

**Details**:
- Set up component with props: `entityType`, `entityId`, `displayMode`
- Define event dispatchers for `navigate` and `close` events
- Create basic component structure with BEM class naming
- Add prop validation and default values
- Set up internal state variables (currentTab, loading, error)

### Stream B: Description Loading & Generator Integration
**Scope**: Implement the description fetching logic using the db-descriptions.js generators
**Files**:
- `warhammer-v2/src/components/EntityDescription.svelte` (loadDescription function)
- Integration with `warhammer-v2/src/lib/db-descriptions.js`
**Agent Type**: fullstack-specialist
**Can Start**: after Stream A completes (needs component structure)
**Estimated Hours**: 5 hours
**Dependencies**: Stream A

**Details**:
- Implement `loadDescription()` async function
- Call `generateDescription(entityType, entityId)` from db-descriptions
- Handle loading state (show spinner during fetch)
- Handle error state (entity not found, invalid type, network errors)
- Implement description caching to avoid redundant fetches
- Add reactive statement to reload when props change

### Stream C: HTML Rendering & Cross-Reference Handling
**Scope**: Render HTML content safely and handle interactive cross-reference links
**Files**:
- `warhammer-v2/src/components/EntityDescription.svelte` (rendering & click handlers)
- HTML sanitization if needed
**Agent Type**: frontend-specialist
**Can Start**: after Stream A completes (needs component structure)
**Estimated Hours**: 4 hours
**Dependencies**: Stream A

**Details**:
- Use `{@html}` to render description HTML content
- Implement `handleCrossReferenceClick(e)` event handler
- Parse `data-type` and `data-id` attributes from clicked `.showHelp` elements
- Emit `navigate` event with parsed entity info
- Prevent default link behavior
- Add click delegation to content container

### Stream D: Tab Navigation & Styling
**Scope**: Implement tab UI for multi-section entities and apply responsive styling
**Files**:
- `warhammer-v2/src/components/EntityDescription.svelte` (tab logic & styles)
**Agent Type**: frontend-specialist
**Can Start**: after Stream A completes (needs component structure)
**Estimated Hours**: 3 hours
**Dependencies**: Stream A

**Details**:
- Implement `switchTab(tabName)` function
- Build tab navigation UI (conditional render based on entity type)
- Parse tab structure from description HTML or metadata
- Apply BEM methodology for CSS classes
- Responsive breakpoints for mobile/tablet/desktop
- Match existing component styling patterns from project
- Handle display modes (modal/panel/inline) with appropriate styling

## Coordination Points

### Shared Files
- `warhammer-v2/src/components/EntityDescription.svelte` - All streams modify this file
  - Stream A creates the scaffold first
  - Streams B, C, D add their respective functions/logic after A completes
  - Use clear code sections with comments to delineate each stream's work

### Sequential Requirements
1. **Stream A must complete first** - Provides component structure for all other streams
2. **Streams B, C, D can run in parallel** - They work on independent functions/sections within the component
3. **Final integration** - Once all streams complete, test the integrated component

### Integration Notes
- Stream A creates the file with TODO comments marking where B, C, D will add code
- Each subsequent stream adds to their designated section
- All streams should add descriptive comments for their additions

## Conflict Risk Assessment
- **Medium Risk**: All streams modify the same file (EntityDescription.svelte)
  - Mitigated by: Stream A completes first and marks insertion points
  - Streams B, C, D work on clearly separated functions/blocks
  - Clear commenting prevents overlap

## Parallelization Strategy

**Recommended Approach**: hybrid

**Phase 1 - Sequential** (4 hours):
- Launch Stream A to create component scaffold
- Wait for completion and commit

**Phase 2 - Parallel** (5 hours max):
- Launch Streams B, C, D simultaneously
- Each works on independent functions within the component
- Streams coordinate through comments and designated code sections

## Expected Timeline

With parallel execution:
- Wall time: 9 hours (4h + max(5h, 4h, 3h))
- Total work: 16 hours
- Efficiency gain: 44%

Without parallel execution:
- Wall time: 16 hours

## Notes

**Important Considerations**:
1. This task depends on Task #36 (description generators) being completed - the `generateDescription()` function must exist in `db-descriptions.js`
2. Entity registry mentioned in requirements may need to be stubbed if not yet implemented
3. Component should follow existing Svelte patterns in the codebase (similar to Modal, DataTable components)
4. The `.showHelp` class and `data-type`/`data-id` pattern is already established in the description generators
5. Testing should include at least 3 entity types: talent, skill, spell (to verify generator integration)

**Testing Strategy**:
- Manual testing after Stream B completes (can load and display descriptions)
- Manual testing after Stream C completes (can click cross-references)
- Manual testing after Stream D completes (full component functionality)
- Final integration test with multiple entity types and display modes
