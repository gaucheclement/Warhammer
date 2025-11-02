# Analysis: Character Creation & Management

## Executive Summary

This task implements a complete character creation and management system for a Warhammer Fantasy RPG application. The system includes a multi-step wizard for creating characters, character sheet views, character list management, and full CRUD operations with IndexedDB persistence.

**Total Effort:** 20-24 hours
**Parallel Execution:** Yes (4-6 concurrent streams possible)
**Dependencies:** Task 15 (data stores), Task 17 (UI components)

## Codebase Analysis

### Existing Infrastructure

**Database Layer (`src/lib/db.js`):**
- IndexedDB setup via Dexie.js
- Characters table already defined: `characters: '++id, name, species, career, created, updated'`
- Helper functions available: `getAllFromTable`, `searchByName`, `getById`

**Data Operations (`src/lib/dataOperations.js`):**
- Character CRUD operations already implemented:
  - `createCharacter(characterData)` - Creates with auto-incrementing ID
  - `updateCharacter(id, updates)` - Updates with timestamp
  - `deleteCharacter(id)` - Hard delete
  - `duplicateCharacter(id, newName)` - Clone character
- Operations update both IndexedDB and Svelte stores

**Data Stores (`src/stores/data.js`):**
- `characters` writable store already exists
- `loadCharacters()` function loads from IndexedDB
- `mergedData` store provides access to all game data (species, careers, skills, talents, etc.)

**Existing Wizard Pattern (`src/routes/Creator.svelte`):**
- 7-step wizard UI already implemented (placeholder)
- Progress bar, step indicators, navigation buttons
- Form patterns for species/career selection
- Responsive design for mobile

**Validation (`src/lib/validation.js`):**
- Schema validation for entity types
- Character schema exists with required fields: `['name']`
- Optional fields: species, career, characteristics, skills, talents, trappings

**Form Schemas (`src/lib/formSchemas.js`):**
- Comprehensive form definitions for all entity types
- Field types, validation rules, help text
- Characteristics list: WS, BS, S, T, I, Ag, Dex, Int, WP, Fel

### Gaps to Fill

1. **Character Data Model:** Need proper TypeScript-style structure with validation
2. **Wizard Steps:** Current wizard has placeholders; need full implementation of all 16 steps
3. **Character Sheet View:** Need read-only and editable modes
4. **Character List:** Need list/grid view with search/filter/sort
5. **Export/Import:** Need JSON export/import with validation
6. **Random Generation:** Need character generator logic
7. **Auto-save/Draft:** Need localStorage-based draft management
8. **Character Advancement:** Need XP tracking and leveling system

## Work Stream Breakdown

### Stream 1: Character Data Model & Core Operations

**Agent:** general-purpose
**Can Start:** Immediately
**Dependencies:** None
**Estimated Time:** 4-5 hours

**Files to Create:**
- `src/lib/characterModel.js` - Character data structure and factory functions
- `src/lib/characterValidation.js` - Character-specific validation logic
- `src/lib/characterCalculations.js` - Stat calculations, derived values

**Files to Modify:**
- `src/lib/validation.js` - Extend character schema with detailed validation

**Scope:**
1. Define comprehensive character data structure:
   ```javascript
   {
     id: number (auto-increment from IndexedDB),
     name: string (required),
     species: { id, name } (required),
     career: { id, name, level } (required),
     characteristics: { M, WS, BS, S, T, I, Ag, Dex, Int, WP, Fel },
     skills: [{ id, name, advances, characteristic }],
     talents: [{ id, name, times, description }],
     spells: [{ id, name, cn, range }],
     trappings: [{ id, name, quantity, equipped }],
     experience: { total, spent, available },
     wounds: { current, max },
     fate: { current, max },
     resilience: { current, max },
     notes: string,
     appearance: { eyes, hair, distinguishing },
     created: timestamp,
     updated: timestamp,
     isDraft: boolean
   }
   ```

2. Create factory functions:
   - `createEmptyCharacter()` - Initialize new character with defaults
   - `createCharacterFromSpecies(species)` - Apply species modifiers
   - `applyCareerToCharacter(character, career)` - Apply career bonuses
   - `calculateDerivedStats(character)` - Calculate wounds, movement, etc.

3. Validation functions:
   - `validateCharacterName(name)` - Check length, uniqueness
   - `validateCharacteristics(characteristics)` - Ensure valid ranges (0-100)
   - `validateSkillSelection(skills, career)` - Check career skill requirements
   - `validateTalentPrerequisites(talents, character)` - Check talent requirements
   - `validateCompleteCharacter(character)` - Full validation before save

4. Calculation utilities:
   - `calculateWounds(T, S, WP, talents)` - Calculate max wounds
   - `calculateMovement(M, encumbrance)` - Calculate movement rate
   - `calculateInitiative(I, Ag)` - Calculate initiative bonus
   - `calculateEncumbrance(trappings)` - Calculate total encumbrance

**Testing Requirements:**
- Unit tests for factory functions
- Validation edge cases (empty names, invalid ranges)
- Calculation accuracy tests

**Deliverables:**
- Character data model with full type definitions
- Factory and calculation functions
- Comprehensive validation logic
- Unit tests (>80% coverage)

---

### Stream 2: Character Creator Wizard (Steps 1-8)

**Agent:** general-purpose
**Can Start:** After Stream 1 completes (needs character model)
**Dependencies:** Stream 1
**Estimated Time:** 7-8 hours

**Files to Create:**
- `src/components/wizard/WizardStep1Details.svelte` - Name and appearance
- `src/components/wizard/WizardStep2Species.svelte` - Species selection
- `src/components/wizard/WizardStep3Career.svelte` - Career selection
- `src/components/wizard/WizardStep4Characteristics.svelte` - Stat generation
- `src/components/wizard/WizardStep5Skills.svelte` - Skill selection
- `src/components/wizard/WizardStep6Talents.svelte` - Talent selection
- `src/components/wizard/WizardStep7Spells.svelte` - Spell selection (conditional)
- `src/components/wizard/WizardStep8Equipment.svelte` - Equipment selection
- `src/components/wizard/WizardNavigation.svelte` - Back/Next/Save buttons
- `src/components/wizard/WizardProgress.svelte` - Progress indicator

**Files to Modify:**
- `src/routes/Creator.svelte` - Replace placeholder steps with actual components

**Scope:**

**Step 1 - Details:**
- Character name input (required, validation)
- Species selection preview
- Eye color dropdown
- Hair color dropdown
- Distinguishing features textarea

**Step 2 - Species:**
- Display all species from `$mergedData.species`
- Show species characteristics modifiers
- Show species talents/skills
- Selection updates character model
- Auto-populate base characteristics

**Step 3 - Career:**
- Display careers filtered by selected species (if applicable)
- Show career class grouping
- Display career skills, talents, trappings
- Career level selection (1-4)
- Show status tier

**Step 4 - Characteristics:**
- Display 11 characteristics (M, WS, BS, S, T, I, Ag, Dex, Int, WP, Fel)
- Show base values from species
- Options:
  - Manual entry (with validation 0-100)
  - Random roll (2d10+20 per stat)
  - Point buy system (100 points to distribute)
- Real-time validation
- Show derived stats (wounds, movement calculated live)

**Step 5 - Skills:**
- Display career skills (highlighted)
- Display all available skills from `$mergedData.skills`
- Multi-select checkboxes
- Show characteristic for each skill
- Track skill advances (basic or advanced)
- Show skill descriptions on hover

**Step 6 - Talents:**
- Display career talents (highlighted)
- Display all talents from `$mergedData.talents`
- Multi-select with prerequisite checking
- Show talent max rank
- Show talent descriptions
- Validate prerequisites before allowing selection

**Step 7 - Spells (Conditional):**
- Only show if career has spellcasting ability
- Filter spells by career lore/domain
- Show spell CN, range, duration
- Respect spell limits by career level
- Show spell descriptions

**Step 8 - Equipment:**
- Display career trappings (auto-added)
- Browse all trappings from `$mergedData.trappings`
- Add custom equipment
- Quantity input
- Equipped checkbox
- Calculate encumbrance (if enabled)

**Navigation:**
- Back/Next buttons with validation
- Can't proceed if step incomplete
- Save Draft button (always visible)
- Progress indicator shows current step / total steps

**Testing Requirements:**
- Each step validates correctly
- Navigation works forward/backward
- Draft saves to localStorage
- Species/career selection applies modifiers correctly

**Deliverables:**
- 8 wizard step components
- Navigation component
- Progress indicator
- Integrated into Creator.svelte
- Validation at each step

---

### Stream 3: Character Creator Wizard (Steps 9-16) & Finalization

**Agent:** general-purpose
**Can Start:** After Stream 2 completes
**Dependencies:** Stream 1, Stream 2
**Estimated Time:** 6-7 hours

**Files to Create:**
- `src/components/wizard/WizardStep9Fate.svelte` - Fate and Resilience
- `src/components/wizard/WizardStep10Ambitions.svelte` - Character motivations
- `src/components/wizard/WizardStep11Party.svelte` - Party sheet info
- `src/components/wizard/WizardStep12Experience.svelte` - Starting XP
- `src/components/wizard/WizardStep13Notes.svelte` - Character notes
- `src/components/wizard/WizardStep14Psychology.svelte` - Psychologies/conditions
- `src/components/wizard/WizardStep15Review.svelte` - Final review
- `src/components/wizard/WizardStep16Complete.svelte` - Success confirmation

**Files to Modify:**
- `src/routes/Creator.svelte` - Add remaining steps
- `src/lib/characterOperations.js` - Add finalize character logic

**Scope:**

**Step 9 - Fate & Resilience:**
- Calculate fate points based on species/career
- Calculate resilience points
- Display starting values
- Allow manual override (with validation)

**Step 10 - Ambitions:**
- Short-term ambition textarea
- Long-term ambition textarea
- Optional field

**Step 11 - Party Sheet:**
- Party name input (optional)
- Party member role selection
- Party notes

**Step 12 - Experience:**
- Starting XP (default 0 or from campaign setting)
- XP spent during creation (auto-calculated)
- XP available after creation

**Step 13 - Notes:**
- Character background textarea
- GM notes section
- Rich text formatting (optional)

**Step 14 - Psychology:**
- Select psychologies from `$mergedData.psychologies`
- Select conditions from `$mergedData.etats`
- Track current conditions

**Step 15 - Review:**
- Display complete character summary
- All sections collapsible/expandable
- Edit buttons to jump back to specific steps
- Validation check (show errors if incomplete)
- "Create Character" button

**Step 16 - Complete:**
- Success message
- Character ID display
- Options:
  - "View Character Sheet" (navigate to sheet)
  - "Create Another Character" (reset wizard)
  - "Go to Character List" (navigate to list)

**Finalization Logic:**
- Clear draft from localStorage
- Save to IndexedDB via `createCharacter()`
- Update characters store
- Navigate to success page

**Testing Requirements:**
- Complete wizard flow end-to-end
- Draft restoration works correctly
- Final character saves to IndexedDB
- Navigation to character sheet works

**Deliverables:**
- 8 additional wizard steps
- Complete wizard integration
- Finalization logic
- Success page

---

### Stream 4: Character Sheet View

**Agent:** general-purpose
**Can Start:** After Stream 1 completes (needs character model)
**Dependencies:** Stream 1
**Estimated Time:** 5-6 hours

**Files to Create:**
- `src/routes/CharacterSheet.svelte` - Main character sheet page
- `src/components/character/CharacterHeader.svelte` - Name, species, career
- `src/components/character/CharacteristicsBlock.svelte` - Stats grid
- `src/components/character/SkillsBlock.svelte` - Skills list with advances
- `src/components/character/TalentsBlock.svelte` - Talents list
- `src/components/character/SpellsBlock.svelte` - Spells list (conditional)
- `src/components/character/EquipmentBlock.svelte` - Equipment/trappings
- `src/components/character/NotesBlock.svelte` - Character notes
- `src/components/character/AdvancementBlock.svelte` - XP tracking

**Files to Modify:**
- `src/lib/router.js` - Add route `/character/:id`

**Scope:**

**Read-Only Mode:**
- Display character data in clean, readable format
- Sections:
  - **Header:** Name, species, career, level, portrait placeholder
  - **Characteristics:** Grid layout (11 stats with labels)
  - **Derived Stats:** Wounds, Fate, Resilience, Movement, Initiative
  - **Skills:** Table with skill name, characteristic, advances
  - **Talents:** List with descriptions
  - **Spells:** Table with CN, range, duration (if applicable)
  - **Equipment:** List with quantity, encumbrance
  - **Notes:** Background and GM notes
  - **Advancement:** XP total/spent/available, advancement log

**Edit Mode:**
- Toggle button to enter edit mode
- Inline editing for fields:
  - Name (text input)
  - Characteristics (number inputs with validation)
  - Skills (add/remove, adjust advances)
  - Talents (add/remove)
  - Spells (add/remove)
  - Equipment (add/remove, adjust quantity)
  - Notes (textarea)
  - XP (adjust total)
- Save button triggers `updateCharacter()`
- Cancel button reverts changes

**Actions:**
- Export to JSON button
- Duplicate character button
- Delete character button (with confirmation)
- Print-friendly CSS (media query for @media print)

**Responsive Design:**
- Mobile: Stack sections vertically
- Tablet: 2-column grid for some sections
- Desktop: 3-column layout for characteristics

**Testing Requirements:**
- Character loads correctly by ID
- Edit mode saves changes to IndexedDB
- Export downloads valid JSON
- Print stylesheet works
- Mobile layout tested

**Deliverables:**
- Complete character sheet view
- Read-only and editable modes
- Print-friendly stylesheet
- Export/duplicate/delete actions
- Responsive design

---

### Stream 5: Character List & Management

**Agent:** general-purpose
**Can Start:** After Stream 1 completes (needs character model)
**Dependencies:** Stream 1
**Estimated Time:** 4-5 hours

**Files to Create:**
- `src/routes/CharacterList.svelte` - Main character list page
- `src/components/character/CharacterCard.svelte` - Grid card view
- `src/components/character/CharacterTableRow.svelte` - Table row view
- `src/components/character/CharacterFilters.svelte` - Filter controls
- `src/components/character/CharacterSort.svelte` - Sort controls

**Files to Modify:**
- `src/lib/router.js` - Add route `/characters`
- `src/lib/search.js` - Add character search function (if needed)

**Scope:**

**List View:**
- Display all characters from `$characters` store
- Two view modes:
  - **Grid:** Card-based layout (like Browse.svelte)
  - **Table:** Tabular layout with columns

**Grid View (Card):**
- Character name (heading)
- Species icon/name
- Career name
- Level indicator
- Last updated timestamp
- Quick actions: View, Edit, Duplicate, Delete

**Table View:**
- Columns: Name, Species, Career, Level, Created, Updated, Actions
- Sortable columns (click header to sort)
- Pagination (50 per page)

**Search:**
- Search bar filters by character name (fuzzy search)
- Real-time filtering as user types
- Clear button

**Filters:**
- Filter by species (dropdown)
- Filter by career (dropdown)
- Filter by level (1-4)
- "Show drafts" checkbox (if draft system implemented)

**Sort:**
- Sort by name (A-Z, Z-A)
- Sort by created date (newest/oldest)
- Sort by updated date (recent first)
- Sort by level (1-4)

**Actions:**
- **View:** Navigate to character sheet
- **Edit:** Navigate to character sheet in edit mode
- **Duplicate:** Call `duplicateCharacter()`, show success toast
- **Delete:** Confirm dialog, then call `deleteCharacter()`
- **Export:** Download character as JSON

**Empty State:**
- Show "No characters yet" message
- "Create Character" button

**Performance:**
- Handle 100+ characters without lag
- Virtual scrolling if list exceeds 200 items (optional enhancement)

**Testing Requirements:**
- List loads all characters
- Search filters correctly
- Sort changes order
- Actions work (view, edit, duplicate, delete)
- Pagination works (if implemented)

**Deliverables:**
- Character list page with grid/table views
- Search, filter, sort functionality
- Character card and table row components
- Actions (view, edit, duplicate, delete, export)
- Empty state

---

### Stream 6: Export, Import & Random Generation

**Agent:** general-purpose
**Can Start:** After Stream 1 completes (needs character model)
**Dependencies:** Stream 1
**Estimated Time:** 4-5 hours

**Files to Create:**
- `src/lib/characterExport.js` - Export character to JSON
- `src/lib/characterImport.js` - Import and validate JSON
- `src/lib/characterGenerator.js` - Random character generation
- `src/components/character/ImportCharacter.svelte` - Import dialog

**Files to Modify:**
- `src/routes/CharacterList.svelte` - Add import button
- `src/routes/Creator.svelte` - Add "Random Generate" button
- `src/lib/validation.js` - Add character import validation schema

**Scope:**

**Export Functionality:**
1. `exportCharacter(character)` function:
   - Serialize character to JSON
   - Include metadata: `{ _exported: timestamp, _version: '1.0' }`
   - Trigger browser download
   - Filename: `character-{name}-{date}.json`

2. `exportAllCharacters()` function:
   - Export all characters as single JSON file
   - Filename: `characters-{date}.json`

**Import Functionality:**
1. File upload dialog
2. `importCharacter(jsonString)` function:
   - Parse JSON
   - Validate schema (required fields present)
   - Check for ID conflicts
   - Options:
     - "Replace if ID exists"
     - "Create new (assign new ID)"
   - Sanitize data (prevent XSS)
   - Insert into IndexedDB

3. Import validation:
   - Check JSON syntax
   - Validate character structure
   - Check species/career IDs exist in game data
   - Warn if skills/talents don't exist
   - Show preview before import

4. Error handling:
   - Show clear error messages
   - Allow user to fix and retry
   - Partial import (skip invalid, import valid)

**Random Character Generation:**
1. `generateRandomCharacter()` function:
   - Random species selection
   - Random career selection (filtered by species)
   - Random characteristics (2d10+20 per stat, apply species modifiers)
   - Random skills from career skills (50% chance per skill)
   - Random talents from career talents (50% chance per talent)
   - Random trappings from career trappings (all included)
   - Random name generation (from name tables if available)
   - Random appearance (eyes, hair, distinguishing features)

2. Integration:
   - "Generate Random" button in character creator
   - Fills wizard with random values
   - User can still edit before saving
   - "Quick Random Character" button on list page (creates instantly)

**Testing Requirements:**
- Export creates valid JSON
- Import validates correctly
- Import handles malformed JSON gracefully
- Random generation creates valid characters
- ID conflict resolution works

**Deliverables:**
- Export to JSON functionality
- Import from JSON with validation
- Random character generator
- Import dialog component
- Error handling and user feedback

---

### Stream 7: Auto-save, Drafts & Character Advancement

**Agent:** general-purpose
**Can Start:** After Stream 1 and Stream 2 complete
**Dependencies:** Stream 1, Stream 2
**Estimated Time:** 3-4 hours

**Files to Create:**
- `src/lib/draftManager.js` - Draft save/restore logic
- `src/lib/characterAdvancement.js` - XP and leveling system
- `src/components/character/AdvancementDialog.svelte` - Level up interface

**Files to Modify:**
- `src/routes/Creator.svelte` - Add auto-save and draft restoration
- `src/routes/CharacterSheet.svelte` - Add advancement UI

**Scope:**

**Auto-save & Drafts:**
1. `saveDraft(character)` function:
   - Save character to localStorage key `characterDraft`
   - Include timestamp
   - Triggered every 30 seconds during character creation
   - Triggered on field blur

2. `loadDraft()` function:
   - Check for draft in localStorage on Creator.svelte mount
   - Show modal: "Found unsaved draft. Restore?"
   - Options: "Restore Draft" or "Start Fresh"
   - If restore, populate wizard with draft data

3. `clearDraft()` function:
   - Remove from localStorage
   - Called after successful character creation
   - Called if user chooses "Start Fresh"

4. Draft indicator:
   - Show "Draft auto-saved" message with timestamp
   - Visual indicator that changes aren't permanent yet

**Character Advancement System:**
1. XP Tracking:
   - Track total XP earned
   - Track XP spent (on advances)
   - Calculate available XP (total - spent)

2. `spendXP(character, type, target)` function:
   - **type:** 'characteristic', 'skill', 'talent'
   - **target:** specific characteristic/skill/talent ID
   - Calculate XP cost based on type and current level
   - Deduct from available XP
   - Update character model
   - Save to IndexedDB

3. XP Costs (based on WFRPG 4e rules):
   - Characteristics: 25 XP × current advance
   - Skills (basic): 10 XP × current advance
   - Skills (advanced): 15 XP × current advance
   - Talents: 100 XP per rank

4. Career Progression:
   - Track current career level (1-4)
   - `advanceCareerLevel(character)` function
   - Unlock new skills/talents at higher levels
   - Update status tier

5. Advancement Dialog:
   - Modal showing advancement options
   - Show XP available
   - Show advancement costs
   - Preview changes before committing
   - "Spend XP" button with confirmation

6. Advancement Log:
   - Track history of XP expenditures
   - Display in character sheet
   - Format: "2025-10-24: +5 WS (25 XP)"

**Testing Requirements:**
- Draft saves and restores correctly
- Auto-save doesn't interrupt user input
- XP calculations are accurate
- Career level advancement unlocks correctly
- Advancement log persists

**Deliverables:**
- Auto-save functionality (every 30 seconds)
- Draft save/restore system
- Draft restoration modal
- XP tracking and spending system
- Career level advancement
- Advancement dialog component
- Advancement history log

---

## Coordination Strategy

### Execution Order

**Phase 1 (Start Immediately):**
- Stream 1: Character Data Model & Core Operations

**Phase 2 (After Stream 1):**
- Stream 2: Character Creator Wizard (Steps 1-8)
- Stream 4: Character Sheet View (parallel)
- Stream 5: Character List & Management (parallel)
- Stream 6: Export, Import & Random Generation (parallel)

**Phase 3 (After Stream 2):**
- Stream 3: Character Creator Wizard (Steps 9-16) & Finalization
- Stream 7: Auto-save, Drafts & Character Advancement (parallel with Stream 3)

### Critical Path
Stream 1 → Stream 2 → Stream 3 → Complete

### Parallel Opportunities
- Streams 4, 5, 6 can all run in parallel after Stream 1
- Stream 7 can run in parallel with Stream 3

### Data Dependencies
- All streams depend on Stream 1 for character data model
- Stream 3 depends on Stream 2 for wizard foundation
- Stream 7 depends on Stream 2 for wizard integration

### Integration Points
1. **Character Model (Stream 1)** provides the contract for all other streams
2. **Creator Wizard (Streams 2 & 3)** creates characters used by other features
3. **Character Sheet (Stream 4)** displays characters created by wizard
4. **Character List (Stream 5)** manages characters and links to sheet
5. **Export/Import (Stream 6)** works with complete character model
6. **Drafts (Stream 7)** integrates with wizard from Stream 2

### Conflict Avoidance
- Different files per stream (minimal overlap)
- Stream 1 completes first to establish model
- Wizard split into two sequential streams (2 & 3) to avoid conflicts
- Sheets/List/Export all work on different components

## Testing Strategy

### Unit Tests (Per Stream)

**Stream 1:**
- Character factory functions create valid objects
- Calculation functions return correct values
- Validation catches invalid data

**Stream 2 & 3:**
- Each wizard step component validates correctly
- Navigation logic works (back/next/skip)
- Species/career modifiers apply correctly

**Stream 4:**
- Character sheet loads by ID
- Edit mode saves changes
- Export generates valid JSON

**Stream 5:**
- List loads all characters
- Search/filter/sort functions work
- Actions (view/edit/delete) execute correctly

**Stream 6:**
- Export creates valid JSON
- Import validates and imports correctly
- Random generation creates valid characters

**Stream 7:**
- Draft saves and restores
- XP calculations are accurate
- Advancement updates character correctly

### Integration Tests (Cross-Stream)

1. **Create → View → Edit flow:**
   - Create character in wizard (Stream 2 & 3)
   - View in character sheet (Stream 4)
   - Edit and save changes (Stream 4)
   - Verify changes in list (Stream 5)

2. **Export → Import flow:**
   - Create character (Stream 2 & 3)
   - Export to JSON (Stream 6)
   - Delete original character (Stream 5)
   - Import from JSON (Stream 6)
   - Verify character restored (Stream 4 & 5)

3. **Draft → Restore flow:**
   - Start character creation (Stream 2)
   - Auto-save creates draft (Stream 7)
   - Close browser tab
   - Reopen creator (Stream 2)
   - Restore draft (Stream 7)
   - Verify data preserved

4. **Random → Advance flow:**
   - Generate random character (Stream 6)
   - Save character (Stream 2 & 3)
   - Add XP to character (Stream 7)
   - Spend XP on advancement (Stream 7)
   - Verify updated stats (Stream 4)

### Manual Testing

1. **Mobile character creation:**
   - Test full wizard flow on mobile device
   - Verify forms are usable with touch input
   - Check responsive layouts

2. **100+ characters performance:**
   - Seed database with 100+ characters
   - Test list page load time (< 2 seconds)
   - Test search/filter responsiveness

3. **Character creation speed:**
   - Time complete wizard flow with experienced user
   - Target: < 10 minutes for basic character
   - Target: < 5 minutes with random generation

4. **Print character sheet:**
   - View character sheet
   - Print to PDF
   - Verify layout is print-friendly
   - Check no cut-off content

5. **Data loss prevention:**
   - Start character creation
   - Fill partial data
   - Close browser without saving
   - Reopen creator
   - Verify draft restoration prompt appears

### End-to-End Test Scenarios

**Scenario 1: New player creates first character**
1. Navigate to character list (empty state)
2. Click "Create Character"
3. Complete all 16 wizard steps
4. Save character
5. View character sheet
6. Export character to JSON
7. Return to character list
8. Verify character appears

**Scenario 2: Import shared character**
1. Receive character JSON file from friend
2. Navigate to character list
3. Click "Import Character"
4. Upload JSON file
5. Review import preview
6. Confirm import
7. View imported character sheet
8. Verify all data correct

**Scenario 3: Random character for one-shot**
1. Navigate to character list
2. Click "Quick Random Character"
3. Character created instantly
4. View character sheet
5. Make minor edits (name, notes)
6. Save changes
7. Start playing

**Scenario 4: Level up existing character**
1. View character sheet
2. Click "Advancement"
3. Review available XP
4. Spend XP on characteristic advance
5. Spend XP on new talent
6. Confirm advancement
7. Verify stats updated
8. Check advancement log

## Risk Assessment

### High Risk

1. **Data Model Changes:**
   - **Risk:** Stream 1 model doesn't meet all needs
   - **Mitigation:** Complete Stream 1 first, review thoroughly before starting others
   - **Contingency:** Early iteration on model before other streams start

2. **Wizard Complexity:**
   - **Risk:** 16 steps too many, user confusion
   - **Mitigation:** Clear progress indicator, save drafts, allow skipping optional steps
   - **Contingency:** Reduce to core steps (species, career, characteristics, review)

### Medium Risk

1. **Performance with 100+ Characters:**
   - **Risk:** List page slow with many characters
   - **Mitigation:** Implement pagination, virtual scrolling
   - **Contingency:** Limit display to 50, add "Load More" button

2. **Mobile Wizard UX:**
   - **Risk:** Wizard difficult to use on mobile
   - **Mitigation:** Responsive design, touch-friendly controls
   - **Contingency:** Simplify mobile wizard (fewer options per screen)

3. **Import Validation:**
   - **Risk:** Malformed JSON crashes app
   - **Mitigation:** Comprehensive validation, error handling
   - **Contingency:** Show clear error messages, allow retry

### Low Risk

1. **Print Stylesheet:**
   - **Risk:** Character sheet doesn't print well
   - **Mitigation:** Test early with print preview
   - **Contingency:** Offer "Export to PDF" option

2. **Draft Conflicts:**
   - **Risk:** Multiple drafts cause confusion
   - **Mitigation:** Only store one draft at a time
   - **Contingency:** Add draft management (list/delete old drafts)

## Success Criteria

### Functional Requirements
- ✓ Character creation wizard completes all 16 steps without errors
- ✓ Characters save to IndexedDB and appear in character list
- ✓ Character sheet displays all character attributes correctly
- ✓ Character list loads 100+ characters without lag (< 2 seconds)
- ✓ Export creates valid JSON files
- ✓ Import validates and imports characters successfully
- ✓ Random generation creates valid, playable characters
- ✓ Auto-save prevents data loss (draft restored after browser close)
- ✓ Character advancement system tracks and spends XP correctly

### Performance Requirements
- ✓ Character creation time < 10 minutes for experienced users
- ✓ Character list loads in < 2 seconds with 100+ characters
- ✓ Character sheet loads in < 1 second
- ✓ Search/filter response time < 500ms

### Quality Requirements
- ✓ Unit test coverage > 70% for character operations
- ✓ All wizard steps validate input correctly
- ✓ Mobile character creation tested on real device (responsive design works)
- ✓ Print stylesheet produces readable character sheet
- ✓ No console errors during normal operation

### User Experience Requirements
- ✓ Wizard progress is clear (step X of 16)
- ✓ Validation errors are helpful and actionable
- ✓ Draft restoration prompt is clear
- ✓ Character list empty state encourages creation
- ✓ Export/import provides clear feedback

## Deliverables Summary

### Code Artifacts
1. Character data model and validation (Stream 1)
2. 16 wizard step components (Streams 2 & 3)
3. Character sheet page with edit mode (Stream 4)
4. Character list with search/filter/sort (Stream 5)
5. Export/import/random generation (Stream 6)
6. Auto-save and advancement systems (Stream 7)

### Documentation
1. Character data model documentation
2. Wizard step descriptions
3. API documentation for character operations
4. User guide for character creation

### Tests
1. Unit tests for all character operations
2. Integration tests for create/view/edit flow
3. Manual test results for mobile and performance
4. End-to-end test scenarios

## Technical Debt & Future Enhancements

### Known Technical Debt
1. Character portraits not implemented (placeholder only)
2. Encumbrance system simplified (not fully rule-accurate)
3. Virtual scrolling not implemented (may need if > 200 characters)
4. Rich text editor for notes not implemented (plain textarea)

### Future Enhancement Ideas
1. **Character Templates:** Save common builds for quick creation
2. **Party Management:** Group characters into parties, shared resources
3. **Combat Tracker:** Track initiative, wounds, conditions during combat
4. **Dice Roller:** Integrated dice rolling with character stats
5. **Character Sharing:** Share characters via URL or QR code
6. **Backup/Sync:** Cloud backup and sync across devices
7. **Character Comparison:** Compare stats between characters
8. **Printable Character Sheet:** Custom PDF generation
9. **Character History:** Track session-by-session changes
10. **NPC Generator:** Quick NPC creation for GMs

## Conclusion

This work stream breakdown provides a clear roadmap for implementing the character creation and management system. By splitting the work into 7 parallel-capable streams with clear dependencies, the team can work efficiently while minimizing conflicts.

The critical path (Stream 1 → Stream 2 → Stream 3) ensures the core character creation wizard is built on a solid foundation, while parallel streams deliver additional features like the character sheet, list, and import/export.

Total estimated time is 20-24 hours with potential to reduce through parallelization. The phased approach allows for iterative testing and validation at each stage.
