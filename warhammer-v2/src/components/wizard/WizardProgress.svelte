<script>
  export let currentStep = 1
  export let totalSteps = 8
  export let steps = []

  $: progressPercentage = (currentStep / totalSteps) * 100
</script>

<div class="wizard-progress">
  <div class="progress-header">
    <span class="step-label">Step {currentStep} of {totalSteps}</span>
    <span class="step-name">{steps[currentStep - 1]?.name || ''}</span>
  </div>

  <div class="progress-bar">
    <div class="progress-fill" style="width: {progressPercentage}%"></div>
  </div>

  <div class="step-indicators">
    {#each steps as step, index}
      <div
        class="step-indicator"
        class:active={index + 1 === currentStep}
        class:completed={index + 1 < currentStep}
      >
        <div class="step-number">
          {#if index + 1 < currentStep}
            <span class="checkmark">✓</span>
          {:else}
            {index + 1}
          {/if}
        </div>
        <div class="step-text">{step.name}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .wizard-progress {
    margin-bottom: 2rem;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .step-label {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    font-weight: 600;
  }

  .step-name {
    font-size: 0.875rem;
    color: var(--color-accent, #8b2e1f);
    font-weight: 600;
  }

  .progress-bar {
    height: 8px;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 4px;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-accent, #8b2e1f);
    transition: width 0.3s ease;
    border-radius: 4px;
  }

  .step-indicators {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
  }

  .step-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .step-indicator.active,
  .step-indicator.completed {
    opacity: 1;
  }

  .step-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border-radius: 50%;
    font-weight: bold;
    font-size: 0.875rem;
    border: 2px solid transparent;
    transition: all 0.2s;
  }

  .step-indicator.active .step-number {
    background: var(--color-accent, #8b2e1f);
    color: white;
    border-color: var(--color-accent, #8b2e1f);
  }

  .step-indicator.completed .step-number {
    background: var(--color-success, #4caf50);
    color: white;
    border-color: var(--color-success, #4caf50);
  }

  .checkmark {
    font-size: 1rem;
  }

  .step-text {
    font-size: 0.75rem;
    text-align: center;
    color: var(--color-text-secondary, #666);
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .step-indicator.active .step-text {
    color: var(--color-text-primary, #333);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .step-indicators {
      grid-template-columns: repeat(4, 1fr);
      gap: 0.25rem;
    }

    .step-text {
      font-size: 0.65rem;
      max-width: 60px;
    }

    .step-number {
      width: 28px;
      height: 28px;
      font-size: 0.75rem;
    }
  }
</style>
