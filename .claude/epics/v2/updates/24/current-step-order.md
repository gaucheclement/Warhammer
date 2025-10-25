# Issue #24 Stream 1: Current Step Order Analysis

**Created**: 2025-10-25
**Worktree**: epic-v2
**Status**: Analysis Complete

## Current Step Order (V2 - INCORRECT)

| Current Step # | Name | Component File | Status |
|----------------|------|----------------|--------|
| 1 | Details | WizardStep1Details.svelte | WRONG - Should be after Species |
| 2 | Species | WizardStep2Species.svelte | WRONG - Should be FIRST |
| 3 | Career | WizardStep3Career.svelte | OK |
| 4 | Characteristics | WizardStep4Characteristics.svelte | OK |
| 5 | Skills | WizardStep5Skills.svelte | OK |
| 6 | Talents | WizardStep6Talents.svelte | OK |
| 7 | Spells | WizardStep7Spells.svelte | Extra (not in V1) |
| 8 | Equipment | WizardStep8Equipment.svelte | OK |
| 9 | Fate | WizardStep9Fate.svelte | Should be in Characteristics |
| 10 | Ambitions | WizardStep10Ambitions.svelte | Post-creation (not in V1) |
| 11 | Party | WizardStep11Party.svelte | Post-creation (not in V1) |
| 12 | Experience | WizardStep12Experience.svelte | OK |
| 13 | Notes | WizardStep13Notes.svelte | Post-creation (not in V1) |
| 14 | Psychology | WizardStep14Psychology.svelte | Post-creation (not in V1) |
| 15 | Review | WizardStep15Review.svelte | OK |
| 16 | Complete | WizardStep16Complete.svelte | OK |

## Critical Problem

**Step 1 (Details) runs BEFORE Step 2 (Species)**

This is blocking because:
- Details generation needs `character.species.refDetail` for race-specific tables (eyes, hair, etc.)
- Without Species selected first, Details cannot access the correct racial appearance tables
- This breaks the V1 logic where Details is Step 7 (after Species is established)

## Target Step Order (V1 - CORRECT)

| Target Step # | Name | Component File | Change Required |
|---------------|------|----------------|-----------------|
| 1 | Species | WizardStep1Species.svelte | RENAME from Step2 |
| 2 | Career | WizardStep2Career.svelte | RENAME from Step3 |
| 3 | Characteristics | WizardStep3Characteristics.svelte | RENAME from Step4 |
| 4 | Skills | WizardStep4Skills.svelte | RENAME from Step5 |
| 5 | Talents | WizardStep5Talents.svelte | RENAME from Step6 |
| 6 | Equipment | WizardStep6Equipment.svelte | RENAME from Step8 |
| 7 | Details | WizardStep7Details.svelte | RENAME from Step1 |
| 8 | Spells | WizardStep8Spells.svelte | RENAME from Step7 |
| 9 | Fate | WizardStep9Fate.svelte | NO CHANGE |
| 10 | Ambitions | WizardStep10Ambitions.svelte | NO CHANGE |
| 11 | Party | WizardStep11Party.svelte | NO CHANGE |
| 12 | Experience | WizardStep12Experience.svelte | NO CHANGE |
| 13 | Notes | WizardStep13Notes.svelte | NO CHANGE |
| 14 | Psychology | WizardStep14Psychology.svelte | NO CHANGE |
| 15 | Review | WizardStep15Review.svelte | NO CHANGE |
| 16 | Complete | WizardStep16Complete.svelte | NO CHANGE |

## File Rename Mapping

### Files to Rename (Critical Path)

```bash
# Step 1 Details → Step 7 Details
WizardStep1Details.svelte → WizardStep7Details.svelte

# Step 2 Species → Step 1 Species
WizardStep2Species.svelte → WizardStep1Species.svelte

# Step 3 Career → Step 2 Career
WizardStep3Career.svelte → WizardStep2Career.svelte

# Step 4 Characteristics → Step 3 Characteristics
WizardStep4Characteristics.svelte → WizardStep3Characteristics.svelte

# Step 5 Skills → Step 4 Skills
WizardStep5Skills.svelte → WizardStep4Skills.svelte

# Step 6 Talents → Step 5 Talents
WizardStep6Talents.svelte → WizardStep5Talents.svelte

# Step 7 Spells → Step 8 Spells
WizardStep7Spells.svelte → WizardStep8Spells.svelte

# Step 8 Equipment → Step 6 Equipment
WizardStep8Equipment.svelte → WizardStep6Equipment.svelte
```

### Files NOT Changed (Steps 9-16)
- WizardStep9Fate.svelte
- WizardStep10Ambitions.svelte
- WizardStep11Party.svelte
- WizardStep12Experience.svelte
- WizardStep13Notes.svelte
- WizardStep14Psychology.svelte
- WizardStep15Review.svelte
- WizardStep16Complete.svelte

## Rename Strategy

### Option 1: Sequential Rename (SAFE)
To avoid file name conflicts, use temporary names:

```bash
# Phase 1: Move to temp names
git mv WizardStep1Details.svelte WizardStepTEMP1.svelte
git mv WizardStep2Species.svelte WizardStepTEMP2.svelte
git mv WizardStep3Career.svelte WizardStepTEMP3.svelte
git mv WizardStep4Characteristics.svelte WizardStepTEMP4.svelte
git mv WizardStep5Skills.svelte WizardStepTEMP5.svelte
git mv WizardStep6Talents.svelte WizardStepTEMP6.svelte
git mv WizardStep7Spells.svelte WizardStepTEMP7.svelte
git mv WizardStep8Equipment.svelte WizardStepTEMP8.svelte

# Phase 2: Rename to final names
git mv WizardStepTEMP2.svelte WizardStep1Species.svelte
git mv WizardStepTEMP3.svelte WizardStep2Career.svelte
git mv WizardStepTEMP4.svelte WizardStep3Characteristics.svelte
git mv WizardStepTEMP5.svelte WizardStep4Skills.svelte
git mv WizardStepTEMP6.svelte WizardStep5Talents.svelte
git mv WizardStepTEMP8.svelte WizardStep6Equipment.svelte
git mv WizardStepTEMP1.svelte WizardStep7Details.svelte
git mv WizardStepTEMP7.svelte WizardStep8Spells.svelte
```

## Import Updates Required

In `Creator.svelte`, lines 14-29 need to be updated:

```javascript
// BEFORE (Current - INCORRECT)
import WizardStep1Details from '../components/wizard/WizardStep1Details.svelte'
import WizardStep2Species from '../components/wizard/WizardStep2Species.svelte'
import WizardStep3Career from '../components/wizard/WizardStep3Career.svelte'
import WizardStep4Characteristics from '../components/wizard/WizardStep4Characteristics.svelte'
import WizardStep5Skills from '../components/wizard/WizardStep5Skills.svelte'
import WizardStep6Talents from '../components/wizard/WizardStep6Talents.svelte'
import WizardStep7Spells from '../components/wizard/WizardStep7Spells.svelte'
import WizardStep8Equipment from '../components/wizard/WizardStep8Equipment.svelte'

// AFTER (Target - CORRECT)
import WizardStep1Species from '../components/wizard/WizardStep1Species.svelte'
import WizardStep2Career from '../components/wizard/WizardStep2Career.svelte'
import WizardStep3Characteristics from '../components/wizard/WizardStep3Characteristics.svelte'
import WizardStep4Skills from '../components/wizard/WizardStep4Skills.svelte'
import WizardStep5Talents from '../components/wizard/WizardStep5Talents.svelte'
import WizardStep6Equipment from '../components/wizard/WizardStep6Equipment.svelte'
import WizardStep7Details from '../components/wizard/WizardStep7Details.svelte'
import WizardStep8Spells from '../components/wizard/WizardStep8Spells.svelte'
```

## Steps Array Update Required

In `Creator.svelte`, lines 44-61 need to be updated:

```javascript
// BEFORE (Current - INCORRECT)
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

// AFTER (Target - CORRECT)
const steps = [
  { id: 1, name: 'Species' },
  { id: 2, name: 'Career' },
  { id: 3, name: 'Characteristics' },
  { id: 4, name: 'Skills' },
  { id: 5, name: 'Talents' },
  { id: 6, name: 'Equipment' },
  { id: 7, name: 'Details' },
  { id: 8, name: 'Spells' },
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

## Component Rendering Update Required

In `Creator.svelte`, lines 231-336 need to be updated to match new step numbers:

```javascript
// BEFORE (Current)
{#if currentStep === 1}
  <WizardStep1Details ... />
{:else if currentStep === 2}
  <WizardStep2Species ... />
{:else if currentStep === 3}
  <WizardStep3Career ... />
// ... etc

// AFTER (Target)
{#if currentStep === 1}
  <WizardStep1Species ... />
{:else if currentStep === 2}
  <WizardStep2Career ... />
{:else if currentStep === 3}
  <WizardStep3Characteristics ... />
// ... etc
```

## Validation Update Required

In `Creator.svelte`, lines 67-92 (validateCurrentStep function):

```javascript
// BEFORE (Current)
switch (currentStep) {
  case 1: // Details
    const nameValidation = validateCharacterName(character.name)
    if (!nameValidation.valid) {
      validationErrors = nameValidation.errors
      canProceed = false
    }
    break
  case 2: // Species
    if (!character.species || !character.species.id) {
      validationErrors = ['Please select a species']
      canProceed = false
    }
    break
  case 3: // Career
    if (!character.career || !character.career.id) {
      validationErrors = ['Please select a career']
      canProceed = false
    }
    break
  // ...
}

// AFTER (Target)
switch (currentStep) {
  case 1: // Species
    if (!character.species || !character.species.id) {
      validationErrors = ['Please select a species']
      canProceed = false
    }
    break
  case 2: // Career
    if (!character.career || !character.career.id) {
      validationErrors = ['Please select a career']
      canProceed = false
    }
    break
  case 3: // Characteristics
    // Validation handled by component
    break
  case 7: // Details
    const nameValidation = validateCharacterName(character.name)
    if (!nameValidation.valid) {
      validationErrors = nameValidation.errors
      canProceed = false
    }
    break
  // ...
}
```

## Implementation Checklist

- [ ] Create analysis document (this file)
- [ ] Rename component files (Phase 1: temp names)
- [ ] Rename component files (Phase 2: final names)
- [ ] Update imports in Creator.svelte
- [ ] Update steps array in Creator.svelte
- [ ] Update component rendering blocks
- [ ] Update validation switch cases
- [ ] Test navigation forward/backward
- [ ] Test that Species is step 1
- [ ] Test that Details is step 7
- [ ] Verify no import errors
- [ ] Verify no console errors
- [ ] Commit changes

## Expected Outcome

After these changes:
1. Species will be the first step in the wizard
2. Details will be step 7 (after Species is selected)
3. Details component can safely access `character.species.refDetail` for race-specific appearance generation
4. Navigation will work correctly through all 16 steps
5. All imports and references will be updated

## Testing Notes

When testing, verify:
- Step 1 now shows Species selection
- Step 7 now shows Details (name, appearance)
- Details component can access species.refDetail
- Navigation buttons work (previous/next)
- Progress bar shows correct step names
- No JavaScript errors in console

## Time Tracking

- Analysis: 30 minutes (estimated)
- Renaming: 30 minutes (estimated)
- Updates: 30 minutes (estimated)
- Testing: 15 minutes (estimated)
- **Total: ~2 hours**
