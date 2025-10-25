---
issue: 23
title: GitHub Issues to Create
date: 2025-10-25
total_issues: 8
---

# GitHub Issues to Create

Based on the comprehensive feature comparison audit, the following GitHub issues need to be created for missing or unverified features in warhammer-v2.

## Priority 0 (Critical - Blocking)

### Issue 1: Verify and Complete Character Generation Pipeline
**Title**: Verify 8-step character generation pipeline in V2

**Priority**: P0 - Critical
**Estimated Effort**: 3-5 days
**Labels**: `epic:v2`, `priority:critical`, `verification`

**Description**:
The root project has a complete 8-step character generation pipeline. V2 has all HTML files (StepSpecies, StepCareers, etc.) but implementation status is unknown.

**Current State (Root)**:
- Complete 8-step wizard: Species → Careers → Characteristics → Stars → Talents → Skills → Trappings → Detail → Experience → Resume
- CharacterGenerator.html orchestrates the flow
- Character.html manages state
- Each step has validation and transitions

**Target State (V2)**:
- All 8 steps functional
- Data flows correctly to IndexedDB
- Validation works at each step
- Navigation between steps works
- Character state persists

**Acceptance Criteria**:
- [ ] Verify each step loads correctly
- [ ] Test data flow from each step to character state
- [ ] Validate step transitions (next/previous)
- [ ] Confirm character state persistence
- [ ] Test complete end-to-end character creation
- [ ] Document any missing implementations
- [ ] Fix or implement any gaps found

**Related Analysis**:
- Stream B: UI Components & Pages Analysis
- Section: Wizard Steps

---

### Issue 2: Implement Character Creation Modes (Normal, Free, Random)
**Title**: Implement and verify character creation modes with XP bonus system

**Priority**: P0 - Critical
**Estimated Effort**: 2-3 days
**Labels**: `epic:v2`, `priority:critical`, `feature`

**Description**:
Root project supports three character creation modes: Normal (guided with XP bonuses), Free (unrestricted), and Random (instant). V2 needs to implement or verify these modes.

**Current State (Root)**:
- **Normal Mode**: Guided creation with XP bonuses for accepting random rolls
  - Species: +20 XP for first roll
  - Career: +50 XP for first roll, +25 XP for second roll
  - Characteristics: +50 XP for keeping rolls, +25 XP for swapping
- **Free Mode**: Unrestricted manual point allocation, bypass restrictions
- **Random Mode**: Fully automated instant character generation

**Target State (V2)**:
- All three modes selectable from MainMenu
- Normal mode awards XP bonuses correctly
- Free mode allows unrestricted choices
- Random mode generates complete character instantly
- Mode selection persists with character

**Acceptance Criteria**:
- [ ] MainMenu allows mode selection
- [ ] Normal mode implements XP bonus system
- [ ] Dice roll acceptance awards correct XP
- [ ] Free mode bypasses step restrictions
- [ ] Free mode allows manual point allocation
- [ ] Random mode generates full character
- [ ] XP totals calculate correctly
- [ ] Character saves include mode information

**Related Analysis**:
- Stream A: Backend Features - Character Generation
- Stream B: UI Features - Character Creation Modes

---

### Issue 3: Implement Specialization Selection System
**Title**: Implement skill, talent, and magic specialization system

**Priority**: P0 - Critical
**Estimated Effort**: 2-3 days
**Labels**: `epic:v2`, `priority:critical`, `feature`

**Description**:
Many skills and talents require specializations (e.g., "Language (Reikspiel)", "Weapon Training (Swords)"). Root has a complete modal-based specialization system.

**Current State (Root)**:
- `Helper.showSpecialisationPopin()`: Modal for specialization selection
- `Helper.randomSpecialisation()`: Auto-assign specs
- Skills: Combat, Language, Lore, Trade, etc.
- Talents: Weapon Training, Etiquette, etc.
- Magic: Spell selection, God selection, Magic color

**Target State (V2)**:
- Modal opens when skill/talent needs specialization
- User can select from available options
- Random assignment for random mode
- Specializations save with character
- Magic talents trigger appropriate selection (spells, gods, colors)

**Acceptance Criteria**:
- [ ] Skill specialization modal works
- [ ] Talent specialization modal works
- [ ] Available specs list correctly
- [ ] User selection saves to character
- [ ] Random mode auto-assigns specs
- [ ] Magic talents trigger spell/god/color selection
- [ ] Specialization displays in character sheet

**Related Analysis**:
- Stream D: Helper Functions - showSpecialisationPopin
- Stream B: UI Features - Specialization System

---

### Issue 4: Implement Character Save/Load with Unique Codes
**Title**: Implement save/load system with unique character codes

**Priority**: P0 - Critical
**Estimated Effort**: 1-2 days
**Labels**: `epic:v2`, `priority:critical`, `feature`

**Description**:
Root generates unique codes for saving and loading characters. V2 has IndexedDB but code generation system status is unknown.

**Current State (Root)**:
- `save(key, save)`: Saves character to 'Save' sheet with unique key
- `load(key)`: Loads character by key from 'Save' sheet
- Key generation: Auto-generates if empty, user can specify
- MainMenu: Input field to load by code

**Target State (V2)**:
- Generate unique save codes (e.g., UUID or short code)
- Save complete character state to IndexedDB
- Load character by entering code
- List saved characters
- Continue in-progress character

**Acceptance Criteria**:
- [ ] Generate unique codes on save
- [ ] Save all character state to IndexedDB
- [ ] Load character by code from MainMenu
- [ ] List all saved characters
- [ ] Continue button loads last character
- [ ] Delete saved characters
- [ ] Export/import saved characters

**Related Analysis**:
- Stream A: Backend Features - Character save/load
- Stream B: UI Features - Save/Load

**Dependencies**:
- Requires character state to be complete (#1)

---

## Priority 1 (High - Important)

### Issue 5: Port Testing Framework from Root to V2
**Title**: Implement comprehensive test suite for character generation

**Priority**: P1 - High
**Estimated Effort**: 3-4 days
**Labels**: `epic:v2`, `priority:high`, `testing`

**Description**:
Root has a comprehensive testing framework with 5 test suites. V2 needs equivalent testing adapted for its architecture.

**Current State (Root)**:
Root has:
- **runUnitTests()**: 5 automated tests
  - Test 1: Basic character generation
  - Test 2: Multiple generation consistency
  - Test 3: Performance test (5 generations)
  - Test 4: Data validation test
  - Test 5: Stability test (10 generations)
- **testFullCharacterCreation()**: Comprehensive step-by-step test
- **runDeepValidationTest()**: Advanced validation with character capture
- **debugSkills()**: Skill system debugging

**Target State (V2)**:
- Jest or Vitest test suite
- Unit tests for data layer (dataMerger, dataOperations)
- Integration tests for character generation
- Performance tests
- Validation tests

**Acceptance Criteria**:
- [ ] Set up test framework (Jest/Vitest)
- [ ] Port unit tests for basic generation
- [ ] Port consistency tests
- [ ] Port performance tests (5 generations)
- [ ] Port data validation tests
- [ ] Port stability tests (10 generations)
- [ ] Add tests for V2-specific features (merge, search)
- [ ] Set up CI/CD integration
- [ ] Achieve 80%+ code coverage on critical paths

**Related Analysis**:
- Stream A: Backend Features - Testing Functions

---

### Issue 6: Implement Random Character Generation
**Title**: Implement fully automated random character generation

**Priority**: P1 - High
**Estimated Effort**: 1-2 days
**Labels**: `epic:v2`, `priority:high`, `feature`

**Description**:
Root has a "Random" button that generates a complete character instantly. V2 needs to implement this feature.

**Current State (Root)**:
- `random(code)`: Full character generation pipeline
- Loads all 30+ HTML modules
- Executes all 8 creation steps automatically
- Makes random choices at each step
- Returns complete character (optionally exports to Foundry)

**Target State (V2)**:
- "New (Random)" button in MainMenu
- Generates complete character in one click
- All choices made automatically
- Character immediately viewable in resume
- Can save generated character

**Acceptance Criteria**:
- [ ] Add random generation button to MainMenu
- [ ] Implement automated species selection
- [ ] Implement automated career selection
- [ ] Implement automated characteristic rolls
- [ ] Implement automated skill allocation
- [ ] Implement automated talent selection
- [ ] Implement automated trapping selection
- [ ] Implement automated detail generation
- [ ] Display complete character sheet
- [ ] Allow saving random character

**Related Analysis**:
- Stream A: Backend Features - random(code) function
- Stream B: UI Features - Random mode

**Dependencies**:
- Requires character generation pipeline (#1)
- Requires specialization system (#3)

---

### Issue 7: Implement Magic Specialization System
**Title**: Implement magic talent specialization (spells, gods, colors)

**Priority**: P1 - High
**Estimated Effort**: 1-2 days
**Labels**: `epic:v2`, `priority:high`, `feature`

**Description**:
Magic talents require special handling: spell selection for casters, god selection for priests, magic color for arcane magic.

**Current State (Root)**:
- `showSpells()`: Spell selection interface (filtered by lore/type)
- `showGods()`: God selection for Bless talent
- `showMagicColor()`: Arcane magic color selection
- `showMagicSpecialisation()`: Router to appropriate modal
- `randomMagicTalent()`: Auto-assign for random mode

**Target State (V2)**:
- Magic talent selection triggers appropriate modal
- Petty Magic: Select petty spells
- Arcane Magic: Select magic color + spells from lore
- Divine Magic (Bless): Select deity + miracles
- Chaos Magic: Select chaos spells
- Auto-assign for random mode

**Acceptance Criteria**:
- [ ] Detect magic talents during talent selection
- [ ] Show spell selection modal for arcane casters
- [ ] Show god selection modal for Bless talent
- [ ] Show magic color selection for arcane magic
- [ ] Filter spells by lore/type correctly
- [ ] Save selected spells/gods with character
- [ ] Random mode auto-assigns magic choices
- [ ] Display spells in character sheet

**Related Analysis**:
- Stream D: Helper Functions - Magic System (5 functions)
- Stream B: UI Features - Magic specializations

**Dependencies**:
- Requires specialization system (#3)

---

## Priority 2 (Medium - Nice to Have)

### Issue 8: Implement Foundry VTT Export
**Title**: Port Foundry VTT export functionality to V2

**Priority**: P2 - Medium
**Estimated Effort**: 2-3 days
**Labels**: `epic:v2`, `priority:medium`, `feature`, `integration`

**Description**:
Root has Foundry VTT export functionality. V2 should provide equivalent export for users of the Foundry VTT platform.

**Current State (Root)**:
- `random(code)` returns Foundry VTT export
- `doGet()` with 'foundryExport' parameter triggers export
- FoundryHelper module formats data
- Maps game data to Foundry actor format

**Target State (V2)**:
- Export button in character sheet (StepResume)
- Generates Foundry-compatible JSON
- Download as .json file
- Import instructions provided

**Acceptance Criteria**:
- [ ] Port FoundryHelper module logic
- [ ] Map character data to Foundry format
- [ ] Map skills to Foundry skills
- [ ] Map talents to Foundry talents
- [ ] Map equipment to Foundry items
- [ ] Generate download link
- [ ] Test import in Foundry VTT
- [ ] Document import process
- [ ] Handle edge cases (spells, traits)

**Related Analysis**:
- Stream A: Backend Features - Foundry VTT integration

**Dependencies**:
- Requires complete character generation (#1)

---

## Summary

### By Priority
- **P0 (Critical)**: 4 issues - Must implement for V2 to be functional
- **P1 (High)**: 3 issues - Important for quality and user experience
- **P2 (Medium)**: 1 issue - Nice to have integration

### Total Estimated Effort
- **P0 Issues**: 8-13 days
- **P1 Issues**: 5-8 days
- **P2 Issues**: 2-3 days
- **Total**: 15-24 days (3-5 weeks with one developer)

### Implementation Order
1. **Issue #1**: Verify character generation pipeline (foundational)
2. **Issue #3**: Implement specialization system (needed by generation)
3. **Issue #2**: Implement creation modes (uses pipeline + specs)
4. **Issue #4**: Implement save/load (persistence layer)
5. **Issue #6**: Implement random generation (uses all above)
6. **Issue #7**: Implement magic system (specialized workflow)
7. **Issue #5**: Port testing framework (quality assurance)
8. **Issue #8**: Implement Foundry export (integration)

### Critical Path
The critical path for V2 functionality is:
```
Issue #1 (Pipeline) → Issue #3 (Specializations) → Issue #2 (Modes) → Issue #4 (Save/Load)
```

Once these 4 issues are complete, V2 will have **functional character creation**. The remaining issues add quality (testing) and enhancements (random, magic, Foundry).
