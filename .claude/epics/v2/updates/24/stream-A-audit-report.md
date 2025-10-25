# V1 Wizard Audit Report

## Executive Summary
All V1 wizard components are **COMPLETE and FUNCTIONAL**. The system uses a sophisticated state management pattern with 925 lines of character state logic. The wizard supports two modes (random with XP bonuses, manual selection), has comprehensive validation, and uses remote Google Apps Script persistence. Architecture is production-ready but jQuery-dependent with direct DOM manipulation. Port complexity: **MEDIUM-HIGH** due to state complexity and talent application logic.

---

## Character.html (State Management) - PRIORITY 1
**Lines**: 925
**Status**: Working
**Port Complexity**: Complex

**Key Methods**:
- `createNewCharacter()`: Factory function creates character object with nested methods
- `applyTalent()`: Critical logic (lines 464-541) - manages talent effects on characteristics, spells, and skills
- `save()/load()`: State serialization/deserialization for persistence
- `search()`: Generic search for characteristics/skills/talents by id/spec/origin
- `createTalent/Skill/Characteristic()`: Factory methods creating reactive nested objects

**Critical Logic to Preserve**:
- Talent application cascade: talents → characteristics → spells → skills (lines 464-541)
- XP calculation system with career vs non-career costs (lines 744-825)
- Characteristic calculations: base + roll + talent + star + advance (lines 305-318)
- Skill/Talent origin tracking for career validation
- Random state preservation for XP bonus calculations
- Species-specific formulas (Wounds, Corruption, Chance, Determination)

**Dependencies**: CharGen (orchestrator), Helper (utilities), Data objects (species, careers, etc.)

---

## CharacterGenerator.html (Orchestrator) - PRIORITY 1
**Status**: Working
**Port Complexity**: Simple

**Key Functions**:
- `stepList[]`: Array of 9 wizard steps initialized in order (line 8-20)
- `showPanel(i, el)`: Renders step UI, manages button states, calls step lifecycle methods
- `nextStep(i)`: Advances wizard, updates stepIndex tracker
- `saveDatabaseCharacter()`: Remote persistence via Google Apps Script fetch (lines 199-233)
- `loadDataAndDisplay()`: Initializes data and displays main menu

**Navigation**: Linear progression (species → careers → characteristics → talents → skills → trappings → details → experience → resume), allows jumping back to menu between steps

**Critical Logic**:
- Step lifecycle: `initAction()` → `show()` → `saveAction()` → validation
- Button management: cancel/validate/random/other with conditional visibility
- Character state tracking via `stepIndex` (allows resume from any step)
- Mode detection: `characterOnCreation()` vs progression mode

---

## Step Files Summary

### StepSpecies.html
**Status**: Working | **Complexity**: Medium
**Key Logic**:
- Random roll (d100) with species probability ranges
- XP bonus: 20 for accepting first random, 0 for manual choice
- Two-tier display: species group → individual species
- Random state: `imposedSpecie[]` for dice roll results

**Critical**: Dice animation system, species-specific data (refDetail, refCareer, refChar)

---

### StepCareers.html
**Status**: Working | **Complexity**: Medium
**Key Logic**:
- Species-filtered career tables (rand[specie.refCareer])
- XP bonuses: 50 (first roll accepted), 25 (one of 3 rolls), 0 (manual)
- Three-level hierarchy: Class → Career → Career Level (only level 1 in creation)
- Two modes: creation (choose career) vs final (advance career level)

**Critical**: Career-level advancement logic, species compatibility filtering

---

### StepCharacteristics.html
**Status**: Working | **Complexity**: Complex
**Key Logic**:
- Three-phase process: Roll (10 characteristics 2d10) → Career (5 advances) → Extra (Fate/Resilience distribution)
- Random modes: accept rolls (+50 XP), swap rolls (+25 XP), manual allocation (0 XP)
- Manual mode: 100 points total, 4-18 per characteristic
- Career phase: 5 advances among career characteristics
- Extra phase: Fate/Resilience points from species

**Critical**: Move up/down for roll swapping, complex validation for point allocation, species-specific characteristic formulas

---

### StepTalents.html
**Status**: Working | **Complexity**: Complex
**Key Logic**:
- Species talents (3-8) + career talents (4) + star talent (optional) + random talents
- Specialization popins for talents requiring specs (weapons, skills, magic)
- Magic talent cascade: selecting magic talent opens spell selection
- Random talent table (d100) with exclusion logic

**Critical**: `applyTalent()` called after changes, specialization handling, god/magic domain selection, talent-granted skills

---

### StepSkills.html
**Status**: Working | **Complexity**: Medium
**Key Logic**:
- Two-phase: Species (3×5 advances + 3×3 advances) → Career (40 advances, max 10/skill)
- Specialization popins for grouped skills (Language, Lore, Trade, etc.)
- Display only career skills in career phase (free mode shows all)
- Advances tracked separately: specie vs career

**Critical**: Point allocation validation (separate pools), specialization selection, characteristic-based skill calculations

---

### StepTrappings.html
**Status**: Working | **Complexity**: Simple
**Key Logic**:
- Parse career trappings string (comma-separated)
- Handle "X ou Y" choices (either/or items)
- Sequential selection: choose from options one by one
- Auto-assign single-option items

**Critical**: String parsing logic ("ou" separator), trapping lookup in data tables

---

### StepDetail.html
**Status**: Working | **Complexity**: Simple
**Key Logic**:
- Form inputs for: Name, Age, Eyes, Hair, Height, Motivation, Short-term, Long-term ambitions
- Random generation: dice rolls for age/height, d100 tables for eyes/hair (species-specific)
- Simple text inputs, no validation

**Critical**: Species-specific random tables (age, height, eyes, hair formulas)

---

### StepExperience.html
**Status**: Working | **Complexity**: Complex
**Key Logic**:
- XP spending: characteristics/skills/talents from earned bonus XP
- Cost calculation: `Helper.getXPCost(elem, oldVal, newVal)` × (career ? 1 : 2)
- Two modes: creation (spend creation bonuses) vs final (spend earned XP)
- Career advancement: skills/talents from current career level only (creation mode)
- Real-time XP balance tracking with validation

**Critical**: XP cost formulas (cumulative by level), career vs non-career multiplier, talent max rank validation, specialization handling

---

### StepResume.html
**Status**: Working | **Complexity**: Medium
**Key Logic**:
- Read-only character sheet display with jQuery UI tabs
- Tabs: Perso, Skills/Talents, Possessions, Spells, Experience
- Comprehensive stat display: characteristics, movement, fate/resilience, wounds, corruption
- Equipment categorization: armor, weapons by type
- Spells grouped by magic type (Blessed, Petty, Arcane, Chaos)
- XP history log display

**Critical**: Tab-based layout, complete character summary, save functionality (generates save code via Google Apps Script)

---

## Porting Recommendations

1. **Start with Character.html state → Svelte store**: Port character factory to reactive store with derived values
2. **Extract applyTalent() logic first**: Most critical and complex, needs comprehensive tests
3. **Use Svelte reactive statements**: Replace manual getTotal() methods with `$:` reactive declarations
4. **Split Helper utilities**: Separate UI helpers from pure logic functions
5. **Replace jQuery DOM manipulation**: Use Svelte component composition and bindings
6. **Maintain XP bonus system**: Random vs manual choice with state tracking essential for game balance
7. **Preserve validation rules exactly**: All point allocations, XP costs, and advancement limits
8. **Create reusable specialization component**: Used across talents, skills, magic - single modal component
9. **Implement step lifecycle hooks**: `initAction`, `show`, `saveAction`, `resetAction` as component lifecycle
10. **Test talent application thoroughly**: Cascade effects are complex and error-prone

---

## Critical Findings

**No blocking bugs found**. System is production-ready but note:

1. **Hardcoded Google Apps Script URL**: Need IndexedDB replacement for V2
2. **jQuery dependency**: All DOM manipulation uses jQuery - full rewrite needed
3. **Global state**: Character stored in CharGen.character - needs proper state management
4. **No TypeScript**: Type safety would help during port (specs, origins, IDs)
5. **Complex nested objects**: Character methods create nested objects with functions - needs Svelte store pattern
6. **Magic talent complexity**: Talent→Spell cascading requires careful state management
7. **No error handling**: Fetch calls and data access lack try-catch blocks

**All features work correctly**. The V1 wizard is sophisticated and battle-tested. Focus on preserving business logic exactly while modernizing architecture.
