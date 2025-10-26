# Integration Guide - Stream 6: Export, Import & Random Generation

## Completed Components

### Core Libraries
1. `src/lib/characterExport.js` - Export characters to JSON
2. `src/lib/characterImport.js` - Import and validate characters from JSON
3. `src/lib/characterGenerator.js` - Generate random characters

### UI Components
1. `src/components/character/ImportCharacter.svelte` - Import dialog component

## Integration Required

### 1. CharacterList.svelte Integration

**File:** `src/routes/CharacterList.svelte`

**Add Imports:**
```javascript
import { exportAndDownloadCharacter, exportAndDownloadAllCharacters } from '../lib/characterExport.js'
import { generateRandomCharacter } from '../lib/characterGenerator.js'
import { createCharacter } from '../lib/dataOperations.js'
import ImportCharacter from '../components/character/ImportCharacter.svelte'
```

**Add State:**
```javascript
// Import dialog state
let showImportDialog = false
```

**Add Handlers:**
```javascript
/**
 * Handle character export (replace existing handleExport function)
 */
function handleExport(character) {
  try {
    exportAndDownloadCharacter(character)
    toasts.success(`Exported "${character.name}"`)
  } catch (error) {
    toasts.error(`Error exporting character: ${error.message}`)
  }
}

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
 * Handle character import
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

**Add Buttons to Header:**
```svelte
<div class="header-actions">
  <!-- Add before "Create Character" button -->
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

**Add Import Dialog:**
```svelte
<!-- Add before closing </div> of character-list-page -->
<ImportCharacter
  bind:isOpen={showImportDialog}
  existingCharacters={$characters}
  on:import={handleImportSuccess}
  on:error={handleImportError}
  on:close={() => showImportDialog = false}
/>
```

### 2. Creator.svelte Integration

**File:** `src/routes/Creator.svelte`

**Add Imports:**
```javascript
import { generateRandomCharacter } from '../lib/characterGenerator.js'
import { createCharacter } from '../lib/dataOperations.js'
```

**Add Handlers:**
```javascript
/**
 * Generate random character and fill wizard
 */
async function handleGenerateRandom() {
  if (confirm('Generate a random character? This will replace any current selections.')) {
    try {
      const randomCharacter = generateRandomCharacter($mergedData)

      // Map to wizard format
      character = {
        name: randomCharacter.name,
        species: randomCharacter.species,
        class: null, // Class will be derived from career if needed
        career: randomCharacter.career,
        characteristics: randomCharacter.characteristics,
        skills: randomCharacter.skills,
        talents: randomCharacter.talents,
        equipment: randomCharacter.trappings
      }

      // Move to review step
      currentStep = totalSteps
    } catch (error) {
      alert(`Failed to generate random character: ${error.message}`)
    }
  }
}

/**
 * Quick random character (create and save instantly)
 */
async function handleQuickRandom() {
  if (confirm('Generate and save a random character instantly?')) {
    try {
      const randomCharacter = generateRandomCharacter($mergedData)
      const result = await createCharacter(randomCharacter)

      if (result.success) {
        alert(`Random character "${randomCharacter.name}" created successfully!`)
        window.location.hash = '#/'
      } else {
        alert(`Failed to create character: ${result.error}`)
      }
    } catch (error) {
      alert(`Failed to generate random character: ${error.message}`)
    }
  }
}
```

**Add Button to Header:**
```svelte
<header class="creator-header">
  <h1>Character Creator</h1>
  <p class="subtitle">Create a new Warhammer Fantasy character</p>
  <!-- Add this button -->
  <div class="header-actions" style="margin-top: 1rem;">
    <button
      type="button"
      on:click={handleGenerateRandom}
      class="btn btn-secondary"
    >
      Generate Random
    </button>
  </div>
</header>
```

## Usage Examples

### Exporting a Character
```javascript
import { exportAndDownloadCharacter } from '../lib/characterExport.js'

// Export single character
exportAndDownloadCharacter(character)
// Creates file: character-{name}-{date}.json

// Export all characters
import { exportAndDownloadAllCharacters } from '../lib/characterExport.js'
exportAndDownloadAllCharacters(characters)
// Creates file: characters-{date}.json
```

### Importing Characters
```javascript
import { importCharacter, parseCharacterJSON } from '../lib/characterImport.js'

// Parse and validate JSON
const parseResult = parseCharacterJSON(jsonString)
if (parseResult.success) {
  const { characters } = parseResult.data

  // Import with options
  const result = await importCharacter(characters[0], {
    assignNewId: true,  // Assign new ID (recommended)
    replaceIfExists: false,
    validateData: true,
    existingCharacters: $characters,
    mergedData: $mergedData
  })
}
```

### Generating Random Characters
```javascript
import { generateRandomCharacter } from '../lib/characterGenerator.js'

// Generate random character
const character = generateRandomCharacter($mergedData)

// Generate with specific species
const humanCharacter = generateRandomCharacter($mergedData, {
  species: $mergedData.species.find(s => s.name === 'Human')
})

// Generate with specific career
const wizardCharacter = generateRandomCharacter($mergedData, {
  career: $mergedData.careers.find(c => c.name === 'Wizard')
})

// Custom probabilities
const character = generateRandomCharacter($mergedData, {
  skillProbability: 0.75,  // 75% chance per skill
  talentProbability: 0.75  // 75% chance per talent
})
```

## Testing

### Manual Testing Checklist

1. **Export Functionality:**
   - [ ] Export single character
   - [ ] Export all characters
   - [ ] Verify JSON format is valid
   - [ ] Verify filename format is correct

2. **Import Functionality:**
   - [ ] Import single character file
   - [ ] Import batch character file
   - [ ] Import with ID conflicts
   - [ ] Import with validation errors
   - [ ] Import with missing species/career

3. **Random Generation:**
   - [ ] Generate random character in wizard
   - [ ] Quick random character creation
   - [ ] Verify all fields are populated
   - [ ] Verify characteristics are within range
   - [ ] Verify species modifiers are applied

4. **Import Dialog:**
   - [ ] File selection works
   - [ ] Preview shows validation status
   - [ ] Import options work correctly
   - [ ] Error handling displays properly

## Notes

- All export files include metadata (`_exported`, `_version`, `_type`)
- Import validates against character schema
- Sanitization prevents XSS attacks
- ID conflicts can be handled by assigning new IDs or replacing
- Random generation uses 2d10 for characteristics (WFRP 4e standard)
- Species modifiers are automatically applied
- Fate and resilience are set based on species

## Future Enhancements

Consider for future streams:
- Import from other formats (CSV, XML)
- Export to PDF character sheets
- Batch import/export from cloud storage
- Random party generation (multiple characters at once)
- Name generation from extended name tables
- Import validation with auto-fix suggestions
