---
issue: 24
epic: v2
analyzed: 2025-10-25T07:21:42Z
streams: 4
parallel: true
---

# Issue #24 Analysis: Verify 8-step Character Generation Pipeline

## Executive Summary

The V1 (root) codebase has a **fully functional** 8-step character generation wizard with 925 lines of state management logic. All 10 wizard step HTML files exist and are complete. However, the system currently uses remote server persistence (Google Apps Script) instead of IndexedDB.

The V2 (epic-v2) codebase has complete IndexedDB infrastructure via Dexie but **no wizard implementation yet**. The gap is bridging V1's working wizard with V2's data layer.

## Current State Analysis

### V1 Wizard Components (Root Directory)
**Status**: ✅ All Complete

| Component | File | Lines | Status |
|-----------|------|-------|--------|
| Species Selection | StepSpecies.html | ~150 | ✅ Complete |
| Career Selection | StepCareers.html | ~200 | ✅ Complete |
| Characteristics | StepCharacteristics.html | ~180 | ✅ Complete |
| Stars (Optional) | StepStars.html | ~100 | ✅ Complete (commented out) |
| Talents | StepTalents.html | ~160 | ✅ Complete |
| Skills | StepSkills.html | ~200 | ✅ Complete |
| Trappings | StepTrappings.html | ~120 | ✅ Complete |
| Details | StepDetail.html | ~140 | ✅ Complete |
| Experience | StepExperience.html | ~180 | ✅ Complete |
| Resume | StepResume.html | ~220 | ✅ Complete |
| **Orchestrator** | CharacterGenerator.html | ~250 | ✅ Complete |
| **State Management** | Character.html | **925** | ✅ Complete |

### V2 Data Infrastructure
**Status**: ✅ Ready, No Wizard Yet

- `dataStore.js`: Complete IndexedDB for official game data (23 entity types)
- `customModifications.js`: Complete IndexedDB for user content
- **Missing**: Character persistence schema
- **Missing**: Wizard UI components

## Parallel Work Streams

### Stream A: Audit V1 Wizard Functionality (Can start immediately)
**Priority**: P0 - Must verify what works before porting
**Duration**: 1 day
**Agent**: general-purpose
**Dependencies**: None

#### Scope
Systematically test each wizard step in V1 to document:
1. What works correctly
2. What's broken/missing
3. Current data flow
4. Validation logic
5. State persistence behavior

#### Files to Test
```
StepSpecies.html
StepCareers.html
StepCharacteristics.html
StepTalents.html
StepSkills.html
StepTrappings.html
StepDetail.html
StepExperience.html
StepResume.html
CharacterGenerator.html
Character.html
```

#### Deliverables
- Functional status report for each step
- List of bugs/issues found
- Data flow diagram
- State management analysis
- Recommendation for V2 porting approach

#### Success Criteria
- [ ] Each wizard step tested manually
- [ ] State transitions verified
- [ ] Data persistence tested
- [ ] Bug list documented
- [ ] Port recommendations created

---

### Stream B: Create Character Persistence Layer (Can start immediately)
**Priority**: P0 - Required for wizard integration
**Duration**: 1.5 days
**Agent**: general-purpose
**Dependencies**: None

#### Scope
Add character persistence to V2's IndexedDB infrastructure using existing Dexie setup.

#### Files to Modify
```
warhammer-v2/src/stores/dataStore.js          (add character table)
warhammer-v2/src/stores/customModifications.js (character CRUD)
```

#### Files to Create
```
warhammer-v2/src/stores/characterStore.js     (new store for characters)
warhammer-v2/src/utils/characterSchema.js     (character data schema)
```

#### Tasks
1. **Define Character Schema**
   - Port V1 Character.html state structure
   - Add IndexedDB-specific fields (id, created, updated)
   - Include all wizard data: species, career, characteristics, skills, talents, trappings

2. **Create Character Store**
   - CRUD operations: create, read, update, delete, list
   - Character validation
   - Auto-save functionality
   - Character search/filtering

3. **Integration Points**
   - Connect to existing dataStore for game data lookup
   - Support custom modifications from customModifications store
   - Handle character versioning

4. **Migration Support**
   - Import from V1 format (remote server JSON)
   - Export to/from JSON for backup

#### Deliverables
- Working character persistence layer
- Unit tests for CRUD operations
- Migration utilities
- API documentation

#### Success Criteria
- [ ] Character schema defined and documented
- [ ] characterStore.js created with full CRUD
- [ ] Integration with existing stores working
- [ ] Can save/load complete character state
- [ ] Migration from V1 format works

---

### Stream C: Port Wizard Steps to V2 (Depends on A)
**Priority**: P0 - Core wizard functionality
**Duration**: 2.5 days
**Agent**: general-purpose
**Dependencies**: Stream A (need audit results)

#### Scope
Convert V1 HTML wizard steps to V2 Svelte components while preserving all business logic.

#### Files to Create
```
warhammer-v2/src/routes/character-generator/+page.svelte  (orchestrator)
warhammer-v2/src/lib/components/wizard/StepSpecies.svelte
warhammer-v2/src/lib/components/wizard/StepCareers.svelte
warhammer-v2/src/lib/components/wizard/StepCharacteristics.svelte
warhammer-v2/src/lib/components/wizard/StepTalents.svelte
warhammer-v2/src/lib/components/wizard/StepSkills.svelte
warhammer-v2/src/lib/components/wizard/StepTrappings.svelte
warhammer-v2/src/lib/components/wizard/StepDetail.svelte
warhammer-v2/src/lib/components/wizard/StepExperience.svelte
warhammer-v2/src/lib/components/wizard/StepResume.svelte
warhammer-v2/src/lib/components/wizard/WizardNavigation.svelte
warhammer-v2/src/lib/stores/wizardState.js  (wizard flow state)
```

#### Porting Strategy
1. **Extract Business Logic**: Copy validation/calculation logic from V1 HTML
2. **Create Svelte Components**: Build reactive UI using Svelte patterns
3. **Maintain Behavior**: Keep all existing features (random/manual, XP bonus, etc.)
4. **Modern Patterns**: Use Svelte stores for state, no direct DOM manipulation

#### Per-Step Porting Checklist
For each wizard step:
- [ ] Extract V1 logic from HTML file
- [ ] Create Svelte component structure
- [ ] Implement initAction(), show(), saveAction(), resetAction()
- [ ] Add validation logic
- [ ] Connect to dataStore for game data
- [ ] Add unit tests
- [ ] Manual testing

#### Deliverables
- 9 wizard step Svelte components
- Wizard orchestrator page
- Navigation component
- Wizard state management store
- Component tests

#### Success Criteria
- [ ] All wizard steps ported to Svelte
- [ ] Business logic preserved from V1
- [ ] Components follow V2 architecture patterns
- [ ] Navigation between steps works
- [ ] Validation works at each step

---

### Stream D: Integration & End-to-End Testing (Depends on B, C)
**Priority**: P0 - Verify everything works together
**Duration**: 1 day
**Agent**: test-runner
**Dependencies**: Streams B and C complete

#### Scope
Connect wizard components to character persistence and test full character creation pipeline.

#### Integration Tasks
1. **Connect Wizard to Character Store**
   - Wire wizard state to characterStore.js
   - Implement auto-save on step completion
   - Add character loading for editing mode

2. **Data Flow Integration**
   - Connect wizard to dataStore for game data
   - Integrate custom modifications support
   - Handle talent application (magic, skills, characteristics)

3. **State Management**
   - Persist wizard progress (resume partial character)
   - Handle browser refresh/navigation
   - Implement proper cleanup on cancel

#### Testing Tasks
1. **Unit Tests**
   - Each wizard component
   - Character store operations
   - Validation logic

2. **Integration Tests**
   - Complete character creation flow
   - Data persistence across steps
   - Edit existing character
   - Cancel/reset behavior

3. **E2E Tests**
   - Full character creation (species → resume)
   - Character saving to IndexedDB
   - Character loading from IndexedDB
   - Multiple character management

#### Files to Modify
```
warhammer-v2/src/routes/character-generator/+page.svelte  (connect stores)
warhammer-v2/src/lib/stores/wizardState.js               (add persistence)
```

#### Files to Create
```
warhammer-v2/tests/unit/wizard/*.test.js                 (unit tests)
warhammer-v2/tests/integration/characterCreation.test.js (integration)
warhammer-v2/tests/e2e/wizard.spec.js                    (e2e tests)
```

#### Deliverables
- Integrated wizard + persistence
- Full test suite
- Bug fixes from testing
- Performance optimization
- Documentation

#### Success Criteria
- [ ] All wizard steps save to IndexedDB
- [ ] Complete character creation works end-to-end
- [ ] Can edit existing characters
- [ ] State persists across browser refresh
- [ ] All tests passing
- [ ] No data loss scenarios
- [ ] Performance acceptable (<100ms step transitions)

---

## Risk Analysis

### High Risk
1. **Business Logic Complexity**: V1 Character.html has 925 lines of state logic
   - *Mitigation*: Thorough audit in Stream A, port incrementally with tests

2. **Talent Application Logic**: Complex interactions (lines 464-541 in Character.html)
   - *Mitigation*: Port this logic first, add comprehensive tests

### Medium Risk
1. **State Management Differences**: V1 uses direct object manipulation, V2 needs Svelte stores
   - *Mitigation*: Create adapter layer if needed

2. **Data Format Changes**: V1 uses localStorage format, V2 uses IndexedDB
   - *Mitigation*: Build migration utilities in Stream B

### Low Risk
1. **UI Porting**: Converting HTML to Svelte is straightforward
2. **IndexedDB Integration**: Dexie infrastructure already proven in V2

## Dependencies

```
Stream A (Audit) ────────────────→ Stream C (Port Wizard)
                                          ↓
Stream B (Persistence) ──────────→ Stream D (Integration)
                                          ↑
Stream C (Port Wizard) ───────────────────┘
```

- **Parallel Immediately**: A + B
- **After A completes**: C
- **After B + C complete**: D

## Timeline

```
Day 1:    Stream A (audit) + Stream B (persistence layer)
Day 2:    Stream B (cont.) + Stream C starts (first 3 steps)
Day 3:    Stream C (cont.) (next 3 steps)
Day 4:    Stream C (cont.) (final 3 steps + orchestrator)
Day 5:    Stream D (integration + testing)
```

**Total Estimate**: 5 days (assuming no major blockers)

## Notes

- V1 wizard is production-quality; don't redesign, just port
- Keep all XP bonus/random roll mechanics
- Preserve validation rules exactly
- Stars step is optional (commented out in V1)
- Focus on feature parity first, enhancements later
