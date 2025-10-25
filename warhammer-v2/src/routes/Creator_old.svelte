<script>
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { mergedData } from '../stores/data.js'
  import { createEmptyCharacter } from '../lib/characterModel.js'
  import { validateCharacterName } from '../lib/characterValidation.js'

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

  let currentStep = 1
  const totalSteps = 8

  // Initialize character with proper model
  let character = createEmptyCharacter()

  let validationErrors = []
  let canProceed = true

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

  function nextStep() {
    validateCurrentStep()
    if (canProceed && currentStep < totalSteps) {
      currentStep++
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

  function handleSave() {
    alert('Character creation will be fully implemented in future tasks.\n\nThis is a placeholder for the character creator workflow.')
  }

  function handleCancel() {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      localStorage.removeItem('characterDraft')
      window.location.hash = '#/'
    }
  }

  // Load draft on mount if available
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
    {/if}
  </div>

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
