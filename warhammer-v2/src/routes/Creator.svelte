<script>
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { mergedData } from '../stores/data.js'
  import { createEmptyCharacter } from '../lib/characterModel.js'
  import { validateCharacterName } from '../lib/characterValidation.js'
  import { createCharacter } from '../lib/dataOperations.js'
  import { toasts } from '../lib/toastStore.js'
  import { saveDraft, loadDraft, clearDraft, hasDraft, getDraftMetadata, formatDraftTimestamp } from '../lib/draftManager.js'

  // Import wizard components
  import WizardProgress from '../components/wizard/WizardProgress.svelte'
  import WizardNavigation from '../components/wizard/WizardNavigation.svelte'
  import WizardStep1Details from '../components/wizard/WizardStep1Details.svelte'
  import WizardStep2Species from '../components/wizard/WizardStep2Species.svelte'
  import WizardStep3Career from '../components/wizard/WizardStep3Career.svelte'
  import WizardStep4Characteristics from '../components/wizard/WizardStep4Characteristics.svelte'
  import WizardStep5Skills from '../components/wizard/WizardStep5Skills.svelte'
  import WizardStep6Talents from '../components/wizard/WizardStep6Talents.svelte'
  import WizardStep7Spells from '../components/wizard/WizardStep7Spells.svelte'
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

  // Initialize character with proper model
  let character = createEmptyCharacter()

  let validationErrors = []
  let canProceed = true
  let autoSaveInterval
  let lastSaved = null
  let showRestoreModal = false
  let draftMetadata = null

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

  function validateCurrentStep() {
    validationErrors = []
    canProceed = true

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
      case 4: // Characteristics
        // Validation handled by component
        break
      default:
        canProceed = true
    }
  }

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

  function jumpToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      currentStep = stepNumber
      validateCurrentStep()
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--
      validateCurrentStep()
    }
  }

  function handleValidate(event) {
    if (event.detail) {
      canProceed = event.detail.valid
      validationErrors = event.detail.errors || []
    }
  }

  function handleChange(event) {
    // Character data updated by components
    validateCurrentStep()
  }

  function handleSaveDraft() {
    // Save to localStorage
    try {
      localStorage.setItem('characterDraft', JSON.stringify(character))
      alert('Draft saved successfully!')
    } catch (e) {
      alert('Failed to save draft: ' + e.message)
    }
  }

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

  function handleCancel() {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      localStorage.removeItem('characterDraft')
      window.location.hash = '#/'
    }
  }

  function handleCreateAnother() {
    character = createEmptyCharacter()
    currentStep = 1
    localStorage.removeItem('characterDraft')
  }

  // Load draft on mount if available
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

  // Reactive validation
  $: if (character) {
    validateCurrentStep()
  }

  $: selectedCareer = character.career?.id
    ? $mergedData.careers?.find(c => c.id === character.career.id)
    : null
</script>

<div class="creator-page">
  <header class="creator-header">
    <h1>Character Creator</h1>
    <p class="subtitle">Create a new Warhammer Fantasy character</p>
    {#if lastSaved}
      <p class="draft-indicator">Draft auto-saved {formatDraftTimestamp(lastSaved)}</p>
    {/if}
  </header>

  <WizardProgress
    {currentStep}
    {totalSteps}
    {steps}
  />

  <div class="creator-content">
    {#if currentStep === 1}
      <WizardStep1Details
        bind:character
        existingCharacters={[]}
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 2}
      <WizardStep2Species
        bind:character
        species={$mergedData.species || []}
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 3}
      <WizardStep3Career
        bind:character
        careers={$mergedData.careers || []}
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 4}
      <WizardStep4Characteristics
        bind:character
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 5}
      <WizardStep5Skills
        bind:character
        skills={$mergedData.skills || []}
        career={selectedCareer}
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 6}
      <WizardStep6Talents
        bind:character
        talents={$mergedData.talents || []}
        career={selectedCareer}
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 7}
      <WizardStep7Spells
        bind:character
        spells={$mergedData.spells || []}
        career={selectedCareer}
        on:change={handleChange}
        on:validate={handleValidate}
      />
    {:else if currentStep === 8}
      <WizardStep8Equipment
        bind:character
        trappings={$mergedData.trappings || []}
        career={selectedCareer}
        on:change={handleChange}
        on:validate={handleValidate}
      />
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
    {/if}
  </div>

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
</div>

<style>
  .creator-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .creator-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .creator-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .creator-content {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 2rem;
    border-radius: 8px;
    min-height: 500px;
    margin-bottom: 2rem;
  }

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

  @media (max-width: 768px) {
    .creator-page {
      padding: 1rem;
    }

    .creator-header h1 {
      font-size: 1.5rem;
    }

    .creator-content {
      padding: 1rem;
    }
  }
</style>
