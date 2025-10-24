# Issue #10 - Manual Integration Guide

## ⚠️ IMPORTANT: Files are locked by dev server
Stop the dev server before making these edits, or edit files while server is stopped.

## Task 1: Extend Character Model

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/lib/characterModel.js`

### Step 1.1: Update Character typedef (line ~114)

Find this line:
```javascript
 * @property {CharacterAppearance} appearance - Physical appearance
 * @property {string} created - Creation timestamp (ISO string)
```

**Replace with:**
```javascript
 * @property {CharacterAppearance} appearance - Physical appearance
 * @property {Object} ambitions - Character ambitions
 * @property {string} ambitions.shortTerm - Short-term ambition
 * @property {string} ambitions.longTerm - Long-term ambition
 * @property {Object} party - Party information
 * @property {string} party.name - Party name
 * @property {string} party.role - Character's role in party
 * @property {string} party.notes - Party notes
 * @property {string[]} psychologies - Active psychologies
 * @property {string[]} conditions - Active conditions
 * @property {string} gmNotes - GM-only notes
 * @property {string} created - Creation timestamp (ISO string)
```

### Step 1.2: Update createEmptyCharacter() function (line ~171)

Find this section:
```javascript
    appearance: {
      eyes: '',
      hair: '',
      distinguishing: ''
    },
    created: new Date().toISOString(),
```

**Replace with:**
```javascript
    appearance: {
      eyes: '',
      hair: '',
      distinguishing: ''
    },
    ambitions: {
      shortTerm: '',
      longTerm: ''
    },
    party: {
      name: '',
      role: '',
      notes: ''
    },
    psychologies: [],
    conditions: [],
    gmNotes: '',
    created: new Date().toISOString(),
```

---

## Task 2: Integrate Wizard Steps 9-16 into Creator.svelte

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/routes/Creator.svelte`

### Step 2.1: Add imports (line ~8-18)

Find this section:
```javascript
  import WizardStep8Equipment from '../components/wizard/WizardStep8Equipment.svelte'

  let currentStep = 1
  const totalSteps = 8
```

**Replace with:**
```javascript
  import WizardStep8Equipment from '../components/wizard/WizardStep8Equipment.svelte'
  import WizardStep9Fate from '../components/wizard/WizardStep9Fate.svelte'
  import WizardStep10Ambitions from '../components/wizard/WizardStep10Ambitions.svelte'
  import WizardStep11Party from '../components/wizard/WizardStep11Party.svelte'
  import WizardStep12Experience from '../components/wizard/WizardStep12Experience.svelte'
  import WizardStep13Notes from '../components/wizard/WizardStep13Notes.svelte'
  import WizardStep14Psychology from '../components/wizard/WizardStep14Psychology.svelte'
  import WizardStep15Review from '../components/wizard/WizardStep15Review.svelte'
  import WizardStep16Complete from '../components/wizard/WizardStep16Complete.svelte'

  let currentStep = 1
  const totalSteps = 16
```

### Step 2.2: Update steps array (line ~29-38)

Find this section:
```javascript
  const steps = [
    { id: 1, name: 'Details' },
    { id: 2, name: 'Species' },
    { id: 3, name: 'Career' },
    { id: 4, name: 'Characteristics' },
    { id: 5, name: 'Skills' },
    { id: 6, name: 'Talents' },
    { id: 7, name: 'Spells' },
    { id: 8, name: 'Equipment' }
  ]
```

**Replace with:**
```javascript
  const steps = [
    { id: 1, name: 'Details' },
    { id: 2, name: 'Species' },
    { id: 3, name: 'Career' },
    { id: 4, name: 'Characteristics' },
    { id: 5, name: 'Skills' },
    { id: 6, name: 'Talents' },
    { id: 7, name: 'Spells' },
    { id: 8, name: 'Equipment' },
    { id: 9, name: 'Fate' },
    { id: 10, name: 'Ambitions' },
    { id: 11, name: 'Party' },
    { id: 12, name: 'Experience' },
    { id: 13, name: 'Notes' },
    { id: 14, name: 'Psychology' },
    { id: 15, name: 'Review' },
    { id: 16, name: 'Complete' }
  ]
```

### Step 2.3: Add imports for data operations (line ~6)

Add these imports:
```javascript
  import { createCharacter } from '../lib/dataOperations.js'
  import { toasts } from '../lib/toastStore.js'
```

### Step 2.4: Replace handleSave function (line ~109-111)

Find:
```javascript
  function handleSave() {
    alert('Character creation will be fully implemented in future tasks.\n\nThis is a placeholder for the character creator workflow.')
  }
```

**Replace with:**
```javascript
  async function handleSave() {
    try {
      const result = await createCharacter(character)
      if (result.success) {
        // Move to completion step
        currentStep = 16
        // Clear draft
        localStorage.removeItem('characterDraft')
      } else {
        alert(`Failed to save character: ${result.error}`)
      }
    } catch (error) {
      alert(`Error saving character: ${error.message}`)
    }
  }
```

### Step 2.5: Update nextStep function (line ~72-78)

Find:
```javascript
  function nextStep() {
    validateCurrentStep()
    if (canProceed && currentStep < totalSteps) {
      currentStep++
      validateCurrentStep()
    }
  }
```

**Replace with:**
```javascript
  async function nextStep() {
    validateCurrentStep()
    if (canProceed && currentStep < totalSteps) {
      // If moving from review to complete, save the character
      if (currentStep === 15) {
        await handleSave()
      } else {
        currentStep++
        validateCurrentStep()
      }
    }
  }
```

### Step 2.6: Add jumpToStep function (after nextStep)

Add this new function:
```javascript
  function jumpToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      currentStep = stepNumber
      validateCurrentStep()
    }
  }
```

### Step 2.7: Add handleCreateAnother function (after jumpToStep)

Add this new function:
```javascript
  function handleCreateAnother() {
    character = createEmptyCharacter()
    currentStep = 1
    localStorage.removeItem('characterDraft')
  }
```

### Step 2.8: Add wizard step components to template (line ~220, after WizardStep8Equipment)

Add these sections AFTER the WizardStep8Equipment block:
```svelte
    {:else if currentStep === 9}
      <WizardStep9Fate
        bind:character
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 10}
      <WizardStep10Ambitions
        bind:character
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 11}
      <WizardStep11Party
        bind:character
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 12}
      <WizardStep12Experience
        bind:character
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 13}
      <WizardStep13Notes
        bind:character
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 14}
      <WizardStep14Psychology
        bind:character
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 15}
      <WizardStep15Review
        {character}
        on:jumpToStep={(e) => jumpToStep(e.detail.step)}
      />
    {:else if currentStep === 16}
      <WizardStep16Complete
        {character}
        on:createAnother={handleCreateAnother}
      />
```

### Step 2.9: Hide navigation on step 16

Find the WizardNavigation component (line ~223):
```svelte
  <WizardNavigation
```

**Wrap it with a conditional:**
```svelte
  {#if currentStep !== 16}
    <WizardNavigation
      {currentStep}
      {totalSteps}
      {canProceed}
      {validationErrors}
      isFirstStep={currentStep === 1}
      isLastStep={currentStep === totalSteps}
      on:back={prevStep}
      on:next={nextStep}
      on:saveDraft={handleSaveDraft}
      on:cancel={handleCancel}
      on:validate={validateCurrentStep}
    />
  {/if}
```

---

## Task 3: Add Auto-save to Creator.svelte

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/routes/Creator.svelte`

### Step 3.1: Import draftManager (line ~6)

Add this import:
```javascript
  import { saveDraft, loadDraft, clearDraft, hasDraft, getDraftMetadata, formatDraftTimestamp } from '../lib/draftManager.js'
```

### Step 3.2: Add draft state variables (line ~27)

Add these variables:
```javascript
  let autoSaveInterval
  let lastSaved = null
  let showRestoreModal = false
  let draftMetadata = null
```

### Step 3.3: Update onMount to check for draft (line ~121-136)

Find:
```javascript
  onMount(() => {
    try {
      const draft = localStorage.getItem('characterDraft')
      if (draft) {
        const shouldRestore = confirm('Found an unsaved draft. Would you like to restore it?')
        if (shouldRestore) {
          character = JSON.parse(draft)
        } else {
          localStorage.removeItem('characterDraft')
        }
      }
    } catch (e) {
      console.error('Failed to load draft:', e)
    }
    validateCurrentStep()
  })
```

**Replace with:**
```javascript
  onMount(() => {
    // Check for draft
    if (hasDraft()) {
      draftMetadata = getDraftMetadata()
      showRestoreModal = true
    }

    // Start auto-save interval (every 30 seconds)
    autoSaveInterval = setInterval(() => {
      if (character.name) {
        const result = saveDraft(character)
        if (result.success) {
          lastSaved = result.timestamp
        }
      }
    }, 30000)

    validateCurrentStep()

    // Cleanup on unmount
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval)
      }
    }
  })
```

### Step 3.4: Add restore modal component (before closing </div> of creator-page)

Add this modal before the closing `</div>` tag:
```svelte
<!-- Restore Draft Modal -->
{#if showRestoreModal && draftMetadata}
  <div class="modal-backdrop" on:click={() => showRestoreModal = false}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Restore Draft</h2>
      </div>
      <div class="modal-body">
        <p>Found an unsaved draft from {formatDraftTimestamp(draftMetadata.timestamp)}.</p>
        <p>Would you like to restore it?</p>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" on:click={() => {
          clearDraft()
          showRestoreModal = false
        }}>
          Discard Draft
        </button>
        <button class="btn btn-primary" on:click={() => {
          const draft = loadDraft()
          if (draft) {
            character = draft.character
          }
          showRestoreModal = false
        }}>
          Restore Draft
        </button>
      </div>
    </div>
  </div>
{/if}
```

### Step 3.5: Add draft indicator to header (line ~150)

Find:
```svelte
  <header class="creator-header">
    <h1>Character Creator</h1>
    <p class="subtitle">Create a new Warhammer Fantasy character</p>
  </header>
```

**Replace with:**
```svelte
  <header class="creator-header">
    <h1>Character Creator</h1>
    <p class="subtitle">Create a new Warhammer Fantasy character</p>
    {#if lastSaved}
      <p class="draft-indicator">Draft auto-saved {formatDraftTimestamp(lastSaved)}</p>
    {/if}
  </header>
```

### Step 3.6: Add styles for modal and draft indicator (in <style> section)

Add these styles:
```css
  .draft-indicator {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    font-style: italic;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: var(--color-bg-primary, #fff);
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .modal-header h2 {
    margin: 0;
    color: var(--color-text-primary, #333);
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-body p {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1.5rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .btn-secondary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border: 1px solid var(--color-border, #ddd);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary, #e5e5e5);
  }
```

### Step 3.7: Update handleSave to clear draft

Update the handleSave function to include clearing the draft:
```javascript
  async function handleSave() {
    try {
      const result = await createCharacter(character)
      if (result.success) {
        // Clear draft and auto-save
        clearDraft()
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval)
        }
        lastSaved = null
        // Move to completion step
        currentStep = 16
      } else {
        alert(`Failed to save character: ${result.error}`)
      }
    } catch (error) {
      alert(`Error saving character: ${error.message}`)
    }
  }
```

---

## Task 4: Add Advancement UI to CharacterSheet.svelte

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/routes/CharacterSheet.svelte`

### Step 4.1: Add imports (line ~3)

Add these imports:
```javascript
  import AdvancementDialog from '../components/character/AdvancementDialog.svelte'
  import { advanceCharacteristic, advanceSkill, purchaseTalent, advanceCareerLevel } from '../lib/characterAdvancement.js'
```

### Step 4.2: Add state variables (line ~29)

Add these variables:
```javascript
  let showAdvancementDialog = false
```

### Step 4.3: Add Advancement button to actions bar (line ~198, after Edit button block)

Find this section in the actions bar (NOT in edit mode):
```svelte
            <button class="btn btn-secondary" on:click={enterEditMode}>
              Edit
            </button>
```

**Add after it:**
```svelte
            <button class="btn btn-secondary" on:click={() => showAdvancementDialog = true}>
              Advancement
            </button>
```

### Step 4.4: Add advancement handler (after saveCharacter function)

Add this new function:
```javascript
  async function handleAdvancement(event) {
    const { type, data } = event.detail

    // Apply advancement based on type
    let result
    switch (type) {
      case 'characteristic':
        result = advanceCharacteristic(character, data.characteristic)
        break
      case 'skill':
        result = advanceSkill(character, data.skillId, data.isAdvanced)
        break
      case 'talent':
        result = purchaseTalent(character, data.talent)
        break
      case 'career':
        result = advanceCareerLevel(character)
        break
      default:
        console.error('Unknown advancement type:', type)
        return
    }

    if (result.success) {
      // Save to database
      const saveResult = await updateCharacter(characterId, result.character)
      if (saveResult.success) {
        character = saveResult.data
        editableCharacter = JSON.parse(JSON.stringify(character))
      } else {
        error = saveResult.error || 'Failed to save advancement'
      }
    } else {
      error = result.error || 'Advancement failed'
    }
  }
```

### Step 4.5: Add AdvancementDialog component (before closing </div> of character-sheet-page)

Add this before the Duplicate Modal:
```svelte
<!-- Advancement Dialog -->
{#if showAdvancementDialog && character}
  <AdvancementDialog
    bind:isOpen={showAdvancementDialog}
    {character}
    on:advance={handleAdvancement}
    on:close={() => showAdvancementDialog = false}
  />
{/if}
```

---

## Task 5: Add Import/Random Buttons to CharacterList.svelte

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/routes/CharacterList.svelte`

### Step 5.1: Add imports (line ~14)

Add these imports:
```javascript
  import { exportAndDownloadCharacter, exportAndDownloadAllCharacters } from '../lib/characterExport.js'
  import { generateRandomCharacter } from '../lib/characterGenerator.js'
  import { createCharacter } from '../lib/dataOperations.js'
  import ImportCharacter from '../components/character/ImportCharacter.svelte'
```

### Step 5.2: Add state variables (line ~48)

Add this variable:
```javascript
  let showImportDialog = false
```

### Step 5.3: Replace handleExport function (line ~236-252)

Find:
```javascript
  function handleExport(character) {
    try {
      const json = JSON.stringify(character, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `character-${character.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toasts.success(`Exported "${character.name}"`)
    } catch (error) {
      toasts.error(`Error exporting character: ${error.message}`)
    }
  }
```

**Replace with:**
```javascript
  function handleExport(character) {
    try {
      exportAndDownloadCharacter(character)
      toasts.success(`Exported "${character.name}"`)
    } catch (error) {
      toasts.error(`Error exporting character: ${error.message}`)
    }
  }
```

### Step 5.4: Add new handler functions (after handleExport)

Add these new functions:
```javascript
  /**
   * Handle export all characters
   */
  function handleExportAll() {
    try {
      exportAndDownloadAllCharacters($characters)
      toasts.success(`Exported ${$characters.length} characters`)
    } catch (error) {
      toasts.error(`Error exporting characters: ${error.message}`)
    }
  }

  /**
   * Handle quick random character creation
   */
  async function handleQuickRandom() {
    try {
      const randomCharacter = generateRandomCharacter($mergedData)
      const result = await createCharacter(randomCharacter)

      if (result.success) {
        toasts.success(`Random character "${randomCharacter.name}" created`)
      } else {
        toasts.error(`Failed to create character: ${result.error}`)
      }
    } catch (error) {
      toasts.error(`Error generating character: ${error.message}`)
    }
  }

  /**
   * Handle character import success
   */
  function handleImportSuccess(event) {
    const { characters: importedChars, count } = event.detail
    toasts.success(`Imported ${count} character(s)`)
    showImportDialog = false
  }

  /**
   * Handle import error
   */
  function handleImportError(event) {
    const { message, errors } = event.detail
    toasts.error(message)
    if (errors && errors.length > 0) {
      console.error('Import errors:', errors)
    }
  }
```

### Step 5.5: Add buttons to header (line ~292-296)

Find:
```svelte
      <div class="header-actions">
        <a href="#/creator" use:link class="btn btn-primary">
          {@html getIcon('plus', 'icon-svg', 20)}
          <span>Create Character</span>
        </a>
      </div>
```

**Replace with:**
```svelte
      <div class="header-actions">
        <button
          type="button"
          on:click={() => showImportDialog = true}
          class="btn btn-secondary"
        >
          {@html getIcon('upload', 'icon-svg', 20)}
          <span>Import</span>
        </button>

        <button
          type="button"
          on:click={handleQuickRandom}
          class="btn btn-secondary"
        >
          {@html getIcon('dice', 'icon-svg', 20)}
          <span>Quick Random</span>
        </button>

        {#if $characters.length > 0}
          <button
            type="button"
            on:click={handleExportAll}
            class="btn btn-secondary"
          >
            {@html getIcon('download', 'icon-svg', 20)}
            <span>Export All</span>
          </button>
        {/if}

        <a href="#/creator" use:link class="btn btn-primary">
          {@html getIcon('plus', 'icon-svg', 20)}
          <span>Create Character</span>
        </a>
      </div>
```

### Step 5.6: Add ImportCharacter component (before closing </div> of character-list-page)

Add this before the Delete Confirmation Modal:
```svelte
<!-- Import Character Dialog -->
<ImportCharacter
  bind:isOpen={showImportDialog}
  existingCharacters={$characters}
  on:import={handleImportSuccess}
  on:error={handleImportError}
  on:close={() => showImportDialog = false}
/>
```

---

## Testing Checklist

After completing all integrations:

### Character Model
- [ ] New character fields (ambitions, party, psychologies, conditions, gmNotes) are present
- [ ] Characters can be created with new fields
- [ ] Existing characters still load correctly

### Creator Wizard
- [ ] All 16 steps are visible in progress bar
- [ ] Can navigate through all steps
- [ ] Step 9 (Fate) allows setting fate/resilience points
- [ ] Step 10 (Ambitions) allows setting short/long term ambitions
- [ ] Step 11 (Party) allows setting party info
- [ ] Step 12 (Experience) allows setting XP
- [ ] Step 13 (Notes) allows adding notes
- [ ] Step 14 (Psychology) allows adding psychologies/conditions
- [ ] Step 15 (Review) shows all character data and allows jumping to steps
- [ ] Step 16 (Complete) shows success message and "Create Another" button
- [ ] Character is saved to database after step 15
- [ ] Draft is auto-saved every 30 seconds
- [ ] Draft restore modal appears if draft exists
- [ ] Draft indicator shows last save time

### Character Sheet
- [ ] Advancement button appears in actions bar
- [ ] Advancement dialog opens
- [ ] Can advance characteristics (costs XP)
- [ ] Can advance skills (costs XP)
- [ ] Can purchase talents (costs XP)
- [ ] XP updates correctly
- [ ] Changes are saved to database

### Character List
- [ ] Import button appears in header
- [ ] Quick Random button appears in header
- [ ] Export All button appears when characters exist
- [ ] Import dialog opens and works
- [ ] Quick random creates a character
- [ ] Export All downloads JSON file
- [ ] Single character export still works

---

## Commit Strategy

After completing all integrations and testing:

```bash
# In Warhammer directory
git add .claude/epics/v2/updates/10/
git commit -m "Issue #10: Integration - Create progress documentation"

# In epic-v2 directory (after manually editing files)
cd C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2

git add src/lib/characterModel.js
git commit -m "Issue #10: Integration - Extend character model with new fields"

git add src/routes/Creator.svelte
git commit -m "Issue #10: Integration - Add wizard steps 9-16 and auto-save"

git add src/routes/CharacterSheet.svelte
git commit -m "Issue #10: Integration - Add advancement UI"

git add src/routes/CharacterList.svelte
git commit -m "Issue #10: Integration - Add import/random buttons"

git commit -m "Issue #10: Complete all UI integrations"
```
