# Issue #13 Analysis: Custom Content & Modifications

## Overview
Implement a comprehensive system for users to modify official Warhammer data and create custom content locally. This includes edit mode, custom content creation, visual indicators, and export/import functionality.

## Work Streams

### Stream 1: Data Store & Infrastructure
**Agent Type:** general-purpose
**Can Start:** Yes
**Dependencies:** None

**Scope:**
- Create `src/stores/customModifications.js` - Core data store for modifications
- Define data model with metadata (_meta fields)
- Implement merge logic to combine official + custom data
- Add persistence layer (IndexedDB integration)

**Files:**
- `src/stores/customModifications.js` (new)
- `src/stores/dataStore.js` (modify to integrate custom mods)

**Estimated Time:** 4-5 hours

---

### Stream 2: Visual Indicators & Badge System
**Agent Type:** general-purpose
**Can Start:** Yes (parallel with Stream 1)
**Dependencies:** None

**Scope:**
- Create reusable `<Badge>` component for official/custom/modified indicators
- Implement visual styling (colors, icons)
- Create utility functions to determine badge type
- Add to existing data display components

**Files:**
- `src/components/Badge.svelte` (new)
- `src/lib/badgeUtils.js` (new)
- CSS/styling files

**Estimated Time:** 2-3 hours

---

### Stream 3: Edit Mode System
**Agent Type:** general-purpose
**Can Start:** After Stream 1 completes (needs data store)
**Dependencies:** Stream 1

**Scope:**
- Create `EditMode.svelte` component with toggle
- Add inline edit buttons to existing data entries
- Create edit forms for different entity types
- Implement save logic to `customModifications` store
- Add "Modified" badge integration

**Files:**
- `src/components/EditMode.svelte` (new)
- `src/components/EntityEditor.svelte` (new)
- Existing entity display components (modify)

**Estimated Time:** 4-5 hours

---

### Stream 4: Custom Content Creator
**Agent Type:** general-purpose
**Can Start:** After Stream 1 completes (needs data store)
**Dependencies:** Stream 1

**Scope:**
- Create `CustomContentCreator.svelte` page
- Dynamic form generation based on entity type
- Field validation (required fields, types)
- Preview pane functionality
- Save to `customModifications` with `isCustom: true`

**Files:**
- `src/pages/CustomContentCreator.svelte` (new)
- `src/lib/formSchemas.js` (new - define forms for 23 entity types)
- `src/lib/validators.js` (new)

**Estimated Time:** 6-7 hours

---

### Stream 5: Export Functionality
**Agent Type:** general-purpose
**Can Start:** After Stream 1 completes (needs data store)
**Dependencies:** Stream 1

**Scope:**
- Create export utility to generate JSON patch file
- Include only modified/custom entries (not full dataset)
- Add metadata (version, timestamp, author)
- Trigger file download
- Create export button/UI

**Files:**
- `src/lib/exportModifications.js` (new)
- `src/components/ExportButton.svelte` (new)

**Estimated Time:** 2-3 hours

---

### Stream 6: Import & Conflict Resolution
**Agent Type:** general-purpose
**Can Start:** After Streams 1 & 5 complete (needs data store + export format)
**Dependencies:** Stream 1, Stream 5

**Scope:**
- Create import utility with JSON validation
- Detect conflicts with existing modifications
- Create `ConflictResolver.svelte` component
- Side-by-side comparison UI
- Preview before applying
- Merge logic for conflict resolution

**Files:**
- `src/lib/importModifications.js` (new)
- `src/components/ConflictResolver.svelte` (new)
- `src/components/ImportButton.svelte` (new)

**Estimated Time:** 4-5 hours

---

### Stream 7: Reset Functionality
**Agent Type:** general-purpose
**Can Start:** After Stream 1 completes (needs data store)
**Dependencies:** Stream 1

**Scope:**
- Individual reset button for modified entries
- Bulk reset all modifications with confirmation
- Remove from `customModifications` store
- Revert to official data

**Files:**
- `src/lib/resetUtils.js` (new)
- `src/components/ResetButton.svelte` (new)
- Add reset UI to existing components

**Estimated Time:** 2 hours

---

### Stream 8: Testing & Integration
**Agent Type:** general-purpose
**Can Start:** After all other streams complete
**Dependencies:** All streams (1-7)

**Scope:**
- Write unit tests for import/export
- Test conflict resolution scenarios
- End-to-end testing of edit mode
- Test data persistence across reloads
- Integration testing with all 23 entity types
- Edge case testing (invalid data, corrupted files, etc.)

**Files:**
- `tests/customModifications.test.js` (new)
- `tests/exportImport.test.js` (new)
- `tests/conflictResolution.test.js` (new)

**Estimated Time:** 4-5 hours

---

## Parallel Execution Plan

**Phase 1 (Immediate Start):**
- Stream 1: Data Store & Infrastructure
- Stream 2: Visual Indicators & Badge System

**Phase 2 (After Stream 1):**
- Stream 3: Edit Mode System
- Stream 4: Custom Content Creator
- Stream 5: Export Functionality
- Stream 7: Reset Functionality

**Phase 3 (After Streams 1 & 5):**
- Stream 6: Import & Conflict Resolution

**Phase 4 (Final):**
- Stream 8: Testing & Integration

## Total Estimated Time
28-35 hours (with parallel execution: ~16-20 hours calendar time)

## Key Technical Considerations

1. **Data Integrity:** All custom content must be validated to prevent broken references
2. **Performance:** Merge logic should be efficient (don't re-merge entire dataset on every change)
3. **Versioning:** Export format must include version for future compatibility
4. **Conflict Resolution:** Must not lose user data during imports
5. **UX Clarity:** Must be obvious what's official vs custom vs modified

## Coordination Notes

- Streams 3, 4, 5, 7 can work in parallel after Stream 1 is complete
- Stream 2 is fully independent and can be integrated into other streams as they complete
- Stream 6 must wait for both Stream 1 (data store) and Stream 5 (export format definition)
- Stream 8 requires all previous streams to be substantially complete
