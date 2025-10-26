---
issue: 34
created: 2025-10-26T07:33:49Z
---

# Work Stream Analysis: Issue #34

## Overview

This issue requires fixing the database schema v2 conformity across multiple files. The main problem is that the code uses `name` instead of `label` for entity names. This work can be parallelized into independent streams that don't conflict with each other.

## Parallel Work Streams

### Stream A: UI Components (Browse & Character)
**Agent**: general-purpose
**Priority**: HIGH
**Dependencies**: None
**Files**:
- `../epic-v2/warhammer-v2/src/routes/Browse.svelte`
- `../epic-v2/warhammer-v2/src/routes/Character.svelte`

**Work**:
1. Replace all `item.name` with `item.label` in Browse.svelte (lines 193, 200)
2. Replace all `item.name` with `item.label` in Character.svelte (line 145)
3. Test that entity names display correctly
4. Commit: "Issue #34: Fix name→label in Browse and Character"

**Can start immediately**: Yes

---

### Stream B: Backend Services (db.js & search.js)
**Agent**: general-purpose
**Priority**: HIGH
**Dependencies**: None
**Files**:
- `../epic-v2/warhammer-v2/src/lib/db.js`
- `../epic-v2/warhammer-v2/src/lib/search.js`

**Work**:
1. Update `searchByName` function in db.js (line 177)
2. Update search suggestions in search.js (lines 286-287)
3. Consider renaming `searchByName` to `searchByLabel` for clarity
4. Test search functionality
5. Commit: "Issue #34: Fix name→label in db and search services"

**Can start immediately**: Yes

---

### Stream C: Test Files
**Agent**: general-purpose
**Priority**: MEDIUM
**Dependencies**: Wait for Streams A & B to complete
**Files**:
- `../epic-v2/warhammer-v2/src/lib/search.test.js`
- `../epic-v2/warhammer-v2/src/lib/__tests__/dataLayer.test.js`
- Any other test files that reference `item.name`

**Work**:
1. Find all test assertions using `item.name`
2. Update to use `item.label`
3. Run tests to verify they pass
4. Commit: "Issue #34: Update tests for label field"

**Can start immediately**: No (wait for A & B)

---

### Stream D: Creator & Wizard Components
**Agent**: general-purpose
**Priority**: MEDIUM
**Dependencies**: None
**Files**:
- `../epic-v2/warhammer-v2/src/routes/Creator.svelte`
- `../epic-v2/warhammer-v2/src/components/wizard/*.svelte`

**Work**:
1. Audit Creator.svelte for any `name` field usage
2. Check all wizard step components
3. Replace with `label` where needed
4. Test character creation flow
5. Commit: "Issue #34: Fix name→label in Creator and wizard"

**Can start immediately**: Yes

---

### Stream E: Admin Enhancements (Optional)
**Agent**: general-purpose
**Priority**: LOW
**Dependencies**: Wait for all other streams
**Files**:
- `../epic-v2/warhammer-v2/src/routes/Admin.svelte`

**Work**:
1. Add detailed entity view in Admin
2. Display metadata fields (book, page, folder)
3. This is enhancement work, not critical bug fix
4. Commit: "Issue #34: Enhance Admin with entity metadata display"

**Can start immediately**: No (optional enhancement)

---

## Execution Strategy

### Phase 1: Immediate Start (Parallel)
Launch these streams immediately in parallel:
- Stream A: UI Components
- Stream B: Backend Services
- Stream D: Creator & Wizard

### Phase 2: After Phase 1 Completes
- Stream C: Test Files (depends on A & B)

### Phase 3: Optional Enhancement
- Stream E: Admin Enhancements (if time permits)

---

## Coordination Rules

1. **No file conflicts**: Each stream works on different files
2. **Integration point**: All streams merge back to main when complete
3. **Testing**: Each stream tests their own changes before committing
4. **Communication**: Use progress files to track status

---

## Success Criteria

- [ ] All UI components use `label` instead of `name`
- [ ] Search and DB functions work with `label`
- [ ] All tests pass with updated schema
- [ ] No regressions in existing functionality
- [ ] Character creation and browsing work correctly

---

## Estimated Timeline

- Stream A: 30 minutes
- Stream B: 30 minutes
- Stream D: 45 minutes
- Stream C: 30 minutes (after A & B)
- Stream E: 60 minutes (optional)

**Total**: ~2-3 hours for critical fixes
