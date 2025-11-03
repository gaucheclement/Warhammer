---
issue: 48
title: Unify Data Layer Architecture - Merge data.js and dataStore.js
analyzed: 2025-11-02T16:04:47Z
estimated_hours: 20
parallelization_factor: 2.0
---

# Parallel Work Analysis: Issue #48

## Overview

This issue unifies two parallel data layer implementations by integrating Issue #47's `transformData` pipeline and EntityReference parsing into the active `data.js` store, then porting utilities from the dormant `dataStore.js`. This eliminates code duplication, enables entity reference parsing across the application, and provides data quality validation.

## Parallel Streams

### Stream A: Core Integration (CRITICAL PATH)
**Scope**: Integrate Issue #47's `transformData` pipeline into `data.js`
**Files**:
- `src/stores/data.js` (main modification)
**Agent Type**: fullstack-specialist
**Can Start**: immediately
**Estimated Hours**: 8
**Dependencies**: none

**Key Tasks**:
1. Import `transformData`, `loadIntoIndexedDB`, `formatReport` from `lib/db-loader.js`
2. Update `seedIndexedDB()` to use full transformation pipeline
3. Replace simple `generateIdsForEntities` with `transformData` call
4. Update `loadOfficialData()` to handle EntityReference objects
5. Add validation error handling
6. Add data quality report logging

**Acceptance Criteria**:
- All entities loaded via `transformData` pipeline
- Entity references are EntityReference objects (have `.id`, `.label`, `.entityType`)
- Validation report logged on startup
- No regression in existing functionality

---

### Stream B: Port Utilities (MEDIUM PRIORITY)
**Scope**: Add `dataQueries` and optimization features from `dataStore.js`
**Files**:
- `src/stores/data.js` (add dataQueries export)
- `src/stores/navigation.js` (update import)
**Agent Type**: fullstack-specialist
**Can Start**: after Stream A completes
**Estimated Hours**: 4
**Dependencies**: Stream A (needs unified data.js to be functional first)

**Key Tasks**:
1. Port `dataQueries` object to `data.js`:
   - `getEntity(entityType, entityId)`
   - `getEntitiesByType(entityType)`
   - `searchEntities(entityType, query)`
   - `getCount(entityType)`
   - `getAllStats()`
2. Add `optimizedMergedData` derived store
3. Update `navigation.js` import from `stores/dataStore.js` to `stores/data.js`

**Acceptance Criteria**:
- `dataQueries` utility available and exported from `data.js`
- `navigation.js` successfully uses unified data layer
- Entity labels resolved correctly in navigation history

---

### Stream C: Testing and Validation (HIGH PRIORITY)
**Scope**: Comprehensive testing of unified data layer
**Files**:
- `src/lib/__tests__/unified-data-layer.test.js` (new)
- Run existing test suites
**Agent Type**: test-runner
**Can Start**: after Stream A completes
**Estimated Hours**: 6
**Dependencies**: Stream A (needs implementation to test)

**Key Tasks**:
1. Run all existing tests:
   - `npm test -- db-loader.test.js`
   - `npm test -- db-id-generator.test.js`
   - `npm test -- db-relations.test.js`
   - `npm test -- db-descriptions-new.test.js`
2. Create integration test for unified data layer
3. Manual testing checklist:
   - Load app and verify validation report in console
   - Browse entities: verify IDs are strings (e.g., "humains-reiklander")
   - Click entity: verify description modal loads
   - Check entity references in descriptions are clickable
   - Create custom modification: verify merge works
   - Navigate between entities: verify history works
4. Document validation report format

**Acceptance Criteria**:
- All automated tests pass (100%)
- Manual testing checklist complete
- No console errors on startup
- Entity navigation works end-to-end
- Integration test created and passing

---

### Stream D: Cleanup and Documentation (LOW PRIORITY)
**Scope**: Remove deprecated code and update documentation
**Files**:
- `src/stores/dataStore.js` -> `dataStore.js.bak` (archive)
- `docs/ARCHITECTURE.md` (update)
- `.claude/epics/description/48-migration-guide.md` (new)
**Agent Type**: general-purpose
**Can Start**: after Streams A, B, and C complete
**Estimated Hours**: 2
**Dependencies**: Streams A, B, C (cleanup only after everything works)

**Key Tasks**:
1. Archive `dataStore.js` -> `dataStore.js.bak`
2. Add comment explaining it's superseded by unified `data.js`
3. Remove any remaining references to `initData.js`
4. Update architecture documentation:
   - Document EntityReference format
   - Document validation report format
   - Document dataQueries API
5. Add JSDoc comments for new functions
6. Create migration guide for future contributors

**Acceptance Criteria**:
- `dataStore.js` archived with explanatory comment
- No references to old data systems
- Documentation updated and accurate
- Migration guide created

## Coordination Points

### Shared Files
**`src/stores/data.js`** - Modified by both Stream A and Stream B:
- **Strategy**: Sequential execution (B waits for A to complete)
- **Reasoning**: Stream B builds on Stream A's transformData integration
- Stream A establishes the foundation, Stream B adds utilities on top

### Sequential Requirements
Critical path dependencies:
1. **Stream A MUST complete first**: Core integration is foundational
2. **Streams B & C can run in parallel after A**: Once data.js is unified, both utilities porting and testing can proceed independently
3. **Stream D MUST be last**: Cleanup only after everything is verified working

## Conflict Risk Assessment

**Overall Risk: LOW**

- **Stream A**: Works exclusively on data.js core functionality
- **Stream B**: Works on different sections of data.js (utilities) and navigation.js
- **Stream C**: Read-only operations (testing), creates new test file
- **Stream D**: Archive and documentation only, no active code paths

**Mitigation**:
- Sequential execution for A -> B eliminates main conflict risk
- B & C can safely run in parallel (different concerns)
- D is cleanup phase, runs alone at the end

## Parallelization Strategy

**Recommended Approach**: Hybrid Sequential-Parallel

**Phase 1**: Stream A (Critical Path)
- **Duration**: 8 hours
- **Why sequential**: Everything depends on core integration succeeding

**Phase 2**: Streams B & C in Parallel
- **Duration**: 6 hours (max of 4h and 6h)
- **Why parallel**: Independent concerns (utilities vs testing)
- B adds query utilities (4h)
- C runs comprehensive tests (6h)

**Phase 3**: Stream D (Cleanup)
- **Duration**: 2 hours
- **Why sequential**: Only safe to clean up after verification

## Expected Timeline

**With parallel execution (recommended)**:
- Phase 1 (Stream A): 8 hours
- Phase 2 (Streams B & C parallel): 6 hours
- Phase 3 (Stream D): 2 hours
- **Wall time: 16 hours**
- **Total work: 20 hours**
- **Efficiency gain: 20%**

**Without parallel execution (sequential)**:
- Stream A: 8 hours
- Stream B: 4 hours
- Stream C: 6 hours
- Stream D: 2 hours
- **Wall time: 20 hours**

**Efficiency Factor**: 2.0x reduction in critical sections through parallelization

## Risk Analysis

### Technical Risks

1. **EntityReference format compatibility** (Medium Risk, High Impact)
   - Some code may depend on plain string/number references
   - **Mitigation**: Comprehensive testing in Stream C, maintain backward compatibility

2. **Performance regression** (Low Risk, Medium Impact)
   - transformData adds processing overhead
   - **Mitigation**: Already tested in Issue #47, proven performant

3. **Breaking existing imports** (Low Risk, High Impact)
   - 23+ files import from data.js
   - **Mitigation**: Maintain all existing exports, add new ones

### Process Risks

1. **Stream A failure blocks everything** (Medium Risk, High Impact)
   - Critical path dependency
   - **Mitigation**: Thorough code review before starting B & C, have rollback plan

2. **Test failures in Stream C** (Medium Risk, Medium Impact)
   - May discover issues late in process
   - **Mitigation**: Run smoke tests early, iterate quickly

## Success Metrics

Quantitative:
- Zero duplicate data loading systems
- 100% of entity references are EntityReference objects
- Validation report shows <5% unresolved references
- All 23+ dependent files work without modification
- All automated tests pass (100%)

Qualitative:
- Navigation history shows entity labels (not just IDs)
- No console errors on application startup
- Code is more maintainable (single source of truth)
- Data quality is visible and measurable

## Notes

- **This is foundational work**: Gets the architecture right for future development
- **EntityReference objects unlock features**: Auto-linking, validation, relationship mapping
- **Technical debt elimination**: Removes confusion about which data system to use
- **Data quality visibility**: Validation reports show what's working and what needs attention

## Rollback Plan

If critical issues arise during Stream A:
1. Revert `data.js` changes via git
2. Re-enable simple `generateIdsForEntities`
3. Clear browser IndexedDB: `indexedDB.deleteDatabase('WarhammerDB')`
4. Reload application

If issues found in Stream C testing:
1. Keep changes in feature branch
2. Fix issues iteratively
3. Don't merge until all tests pass

## Next Steps

1. Ensure epic worktree exists: `/pm:epic-start description`
2. Start implementation: `/pm:issue-start 48`
3. Monitor progress: `/pm:epic-status description`
4. Sync updates: `/pm:issue-sync 48`
