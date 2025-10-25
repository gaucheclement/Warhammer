<script>
  /**
   * Character Generator - V1 Wizard Port
   *
   * This is a port of the V1 character generation wizard to V2 Svelte architecture.
   * It preserves all business logic, validation rules, and game mechanics from V1.
   *
   * V1 Reference: CharacterGenerator.html
   * Architecture: Orchestrator pattern with step components
   */

  import { onMount, onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { mergedData } from '../stores/data.js'
  import {
    currentCharacter,
    setCurrentCharacter,
    updateCurrentCharacter,
    createCharacter,
    saveNow
  } from '../stores/characterStore.js'
  import { createEmptyCharacter } from '../utils/characterSchema.js'
  import {
    WIZARD_STEPS,
    currentStep,
    maxStepReached,
    isWizardActive,
    validationErrors,
    canProceed,
    wizardMode,
    startWizard,
    endWizard,
    nextStep as wizardNextStep,
    previousStep as wizardPreviousStep,
    jumpToStep,
    setStepValidation,
    cancelWizard,
    currentStepInfo,
    isFirstStep,
    isLastStep,
    canGoBack,
    canGoForward,
    progressPercentage
  } from '../stores/wizardState.js'

  // Wizard navigation components (to be created)
  import WizardProgress from '../components/wizard/WizardProgress.svelte'
  import WizardNavigation from '../components/wizard/WizardNavigation.svelte'

  // Step components (to be created in phases)
  // These will be created incrementally as we port each step
  // import StepSpecies from '../components/wizard/StepSpecies.svelte'
  // import StepCareers from '../components/wizard/StepCareers.svelte'
  // import StepCharacteristics from '../components/wizard/StepCharacteristics.svelte'
  // import StepTalents from '../components/wizard/StepTalents.svelte'
  // import StepSkills from '../components/wizard/StepSkills.svelte'
  // import StepTrappings from '../components/wizard/StepTrappings.svelte'
  // import StepDetail from '../components/wizard/StepDetail.svelte'
  // import StepExperience from '../components/wizard/StepExperience.svelte'
  // import StepResume from '../components/wizard/StepResume.svelte'

  // Local state
  let character = null
  let dataReady = false

  /**
   * Initialize wizard
   * V1 Reference: CharacterGenerator.html showPanel()
   */
  onMount(async () => {
    // Wait for game data to load
    const unsubscribe = mergedData.subscribe(data => {
      if (data && Object.keys(data).length > 0) {
        dataReady = true
      }
    })

    // Create new character
    character = createEmptyCharacter()
    character.mode = 'creation'
    character.stepIndex = 0
    setCurrentCharacter(character)

    // Start wizard
    startWizard()

    // Cleanup subscription
    return () => {
      unsubscribe()
    }
  })

  /**
   * Cleanup on unmount
   */
  onDestroy(() => {
    if ($isWizardActive) {
      endWizard()
    }
  })

  /**
   * Handle next step navigation
   * V1 Reference: CharacterGenerator.html nextStep()
   */
  async function handleNext() {
    const success = wizardNextStep()
    if (!success) {
      console.warn('Failed to advance to next step')
    }
  }

  /**
   * Handle previous step navigation
   */
  function handlePrevious() {
    const success = wizardPreviousStep()
    if (!success) {
      console.warn('Failed to go back to previous step')
    }
  }

  /**
   * Handle step jump (from progress indicator)
   */
  function handleJumpToStep(event) {
    const stepIndex = event.detail.stepIndex
    jumpToStep(stepIndex)
  }

  /**
   * Handle wizard cancellation
   * V1 Reference: CharacterGenerator.html defaultAction.cancel
   */
  function handleCancel() {
    const confirmed = confirm(
      'Are you sure you want to cancel? All progress will be lost.'
    )
    if (confirmed) {
      cancelWizard()
      push('/') // Return to home
    }
  }

  /**
   * Handle final save (on resume step)
   * V1 Reference: CharacterGenerator.html saveDatabaseCharacter()
   */
  async function handleSave() {
    try {
      const char = $currentCharacter
      if (!char) {
        throw new Error('No character to save')
      }

      // Mark as complete
      char.stepIndex = -1 // V1 uses -1 to indicate completion

      // Save to IndexedDB
      const id = await createCharacter(char)

      console.log('Character saved successfully:', id)

      // Navigate to character sheet
      push(`/character/${id}`)
    } catch (error) {
      console.error('Failed to save character:', error)
      alert('Failed to save character: ' + error.message)
    }
  }

  /**
   * Reactive updates from store
   */
  $: if ($currentCharacter) {
    character = $currentCharacter
  }

  /**
   * Get current step component info
   */
  $: stepInfo = $currentStepInfo
</script>

<div class="character-generator">
  <!-- Header -->
  <header class="generator-header">
    <h1>Character Generator</h1>
    <p class="subtitle">Create a Warhammer Fantasy character (V1 wizard port)</p>
  </header>

  {#if !dataReady}
    <!-- Loading state -->
    <div class="loading-state">
      <p>Loading game data...</p>
    </div>
  {:else}
    <!-- Wizard Progress -->
    <WizardProgress
      steps={WIZARD_STEPS}
      currentStep={$currentStep}
      maxStepReached={$maxStepReached}
      on:jumpToStep={handleJumpToStep}
    />

    <!-- Wizard Content -->
    <div class="wizard-content">
      {#if stepInfo}
        <div class="step-container">
          <div class="step-header">
            <h2>Step {$currentStep + 1}: {stepInfo.name}</h2>
          </div>

          <div class="step-body">
            {#if $currentStep === 0}
              <!-- StepSpecies - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Species Selection</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 1}
              <!-- StepCareers - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Career Selection</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 2}
              <!-- StepCharacteristics - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Characteristics</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 3}
              <!-- StepTalents - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Talents</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 4}
              <!-- StepSkills - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Skills</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 5}
              <!-- StepTrappings - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Trappings</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 6}
              <!-- StepDetail - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Character Details</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 7}
              <!-- StepExperience - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Experience Spending</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
              </div>
            {:else if $currentStep === 8}
              <!-- StepResume - To be implemented -->
              <div class="placeholder-step">
                <p>Step: Character Resume</p>
                <p>Component to be implemented</p>
                <button on:click={() => setStepValidation(true, [])}>
                  Mark as Valid (Testing)
                </button>
                <button on:click={handleSave} class="save-button">
                  Save Character
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- Wizard Navigation -->
    <WizardNavigation
      isFirstStep={$isFirstStep}
      isLastStep={$isLastStep}
      canGoBack={$canGoBack}
      canGoForward={$canGoForward}
      validationErrors={$validationErrors}
      on:next={handleNext}
      on:previous={handlePrevious}
      on:cancel={handleCancel}
    />
  {/if}
</div>

<style>
  .character-generator {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .generator-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .generator-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-secondary, #666);
  }

  .wizard-content {
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    padding: 2rem;
    min-height: 400px;
    margin-bottom: 2rem;
  }

  .step-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .step-header {
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--color-border, #ddd);
    padding-bottom: 1rem;
  }

  .step-header h2 {
    margin: 0;
    color: var(--color-text-primary, #333);
  }

  .step-body {
    padding: 1rem 0;
  }

  /* Placeholder styling (remove when steps are implemented) */
  .placeholder-step {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--color-bg-primary, #fff);
    border-radius: 6px;
    border: 2px dashed var(--color-border, #ddd);
  }

  .placeholder-step p {
    margin: 0.5rem 0;
    color: var(--color-text-secondary, #666);
  }

  .placeholder-step button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .placeholder-step button:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .save-button {
    margin-left: 1rem;
    background: var(--color-success, #28a745) !important;
  }

  .save-button:hover {
    background: var(--color-success-hover, #218838) !important;
  }

  @media (max-width: 768px) {
    .character-generator {
      padding: 1rem;
    }

    .generator-header h1 {
      font-size: 1.5rem;
    }

    .wizard-content {
      padding: 1rem;
    }
  }
</style>
