<script>
  export let currentStep = 1
  export let totalSteps = 8
  export let steps = []
  export let character = null

  $: progressPercentage = (currentStep / totalSteps) * 100
  $: bonusXP = character?.xp?.max || 0
  $: usedXP = character?.xp?.used || 0
  $: availableXP = bonusXP - usedXP
</script>

<div class="wizard-progress">
  <div class="progress-header">
    <span class="step-label">Step {currentStep} of {totalSteps}</span>
    <span class="step-name">{steps[currentStep - 1]?.name || ''}</span>

    <!-- XP Display -->
    {#if character && bonusXP > 0}
      <div class="xp-display" class:updated={bonusXP > 0}>
        <span class="xp-icon">⚡</span>
        <span class="xp-label">Bonus XP:</span>
        <span class="xp-value">{bonusXP}</span>
        {#if usedXP > 0}
          <span class="xp-used">(-{usedXP})</span>
        {/if}
      </div>
    {/if}
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
    flex-wrap: wrap;
    gap: 0.75rem;
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

  /* XP Display */
  .xp-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-radius: 2rem;
    font-weight: 600;
    color: #333;
    box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
    transition: all 0.3s ease;
  }

  .xp-display.updated {
    animation: pulse 0.5s ease-in-out;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
    }
  }

  .xp-icon {
    font-size: 1.2rem;
  }

  .xp-label {
    font-size: 0.875rem;
  }

  .xp-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #d4af37;
  }

  .xp-used {
    font-size: 0.875rem;
    color: #b8860b;
    font-weight: 500;
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
