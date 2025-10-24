<script>
  import { createEventDispatcher } from 'svelte'

  export let currentStep = 1
  export let totalSteps = 8
  export let canProceed = true
  export let isFirstStep = false
  export let isLastStep = false
  export let validationErrors = []
  export let showSaveDraft = true

  const dispatch = createEventDispatcher()

  function handleBack() {
    dispatch('back')
  }

  function handleNext() {
    if (!canProceed) {
      dispatch('validate')
      return
    }
    dispatch('next')
  }

  function handleSaveDraft() {
    dispatch('saveDraft')
  }

  function handleCancel() {
    dispatch('cancel')
  }
</script>

<div class="wizard-navigation">
  {#if validationErrors.length > 0}
    <div class="validation-errors">
      <div class="error-header">
        <strong>Please fix the following errors:</strong>
      </div>
      <ul>
        {#each validationErrors as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="nav-buttons">
    <div class="left-buttons">
      <button class="btn btn-secondary" on:click={handleCancel}>
        Cancel
      </button>
      {#if showSaveDraft}
        <button class="btn btn-outline" on:click={handleSaveDraft}>
          Save Draft
        </button>
      {/if}
    </div>

    <div class="right-buttons">
      {#if !isFirstStep}
        <button class="btn btn-secondary" on:click={handleBack}>
          ← Back
        </button>
      {/if}

      <button
        class="btn btn-primary"
        on:click={handleNext}
        disabled={!canProceed && validationErrors.length > 0}
      >
        {isLastStep ? 'Review' : 'Next →'}
      </button>
    </div>
  </div>
</div>

<style>
  .wizard-navigation {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .validation-errors {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .error-header {
    color: #856404;
    margin-bottom: 0.5rem;
  }

  .validation-errors ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #856404;
  }

  .validation-errors li {
    margin: 0.25rem 0;
  }

  .nav-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .left-buttons,
  .right-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
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

  .btn-outline {
    background: transparent;
    color: var(--color-accent, #8b2e1f);
    border: 1px solid var(--color-accent, #8b2e1f);
  }

  .btn-outline:hover {
    background: var(--color-accent-light, #fef5f4);
  }

  @media (max-width: 768px) {
    .nav-buttons {
      flex-direction: column;
    }

    .left-buttons,
    .right-buttons {
      width: 100%;
    }

    .left-buttons {
      order: 2;
    }

    .right-buttons {
      order: 1;
    }

    .btn {
      flex: 1;
    }
  }
</style>
