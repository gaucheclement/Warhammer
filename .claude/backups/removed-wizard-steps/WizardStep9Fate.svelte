<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { calculateDefaultFate, calculateDefaultResilience } from '../../lib/characterCalculations.js'

  export let character = {}

  const dispatch = createEventDispatcher()

  let fateMax = 0
  let resilienceMax = 0
  let manualOverride = false

  // Calculate default values based on species
  function calculateDefaults() {
    if (character.species && character.species.name) {
      const defaultFate = calculateDefaultFate(character.species.name)
      const defaultResilience = calculateDefaultResilience(character.species.name)

      // Only set defaults if not already set (or if 0)
      if (!character.fate) {
        character.fate = { current: 0, max: 0 }
      }
      if (!character.resilience) {
        character.resilience = { current: 0, max: 0 }
      }

      if (character.fate.max === 0 && !manualOverride) {
        fateMax = defaultFate
        character.fate.max = defaultFate
        character.fate.current = defaultFate
      } else {
        fateMax = character.fate.max
      }

      if (character.resilience.max === 0 && !manualOverride) {
        resilienceMax = defaultResilience
        character.resilience.max = defaultResilience
        character.resilience.current = defaultResilience
      } else {
        resilienceMax = character.resilience.max
      }
    }
  }

  function handleFateChange() {
    character.fate.max = fateMax
    character.fate.current = fateMax
    manualOverride = true
    dispatch('change', character)
  }

  function handleResilienceChange() {
    character.resilience.max = resilienceMax
    character.resilience.current = resilienceMax
    manualOverride = true
    dispatch('change', character)
  }

  function resetToDefaults() {
    manualOverride = false
    calculateDefaults()
    dispatch('change', character)
  }

  onMount(() => {
    calculateDefaults()
    dispatch('validate', { valid: true, errors: [] })
  })

  $: if (character.species) {
    if (!manualOverride) {
      calculateDefaults()
    }
  }
</script>

<div class="wizard-step step-fate">
  <div class="step-header">
    <h2>Fate & Resilience</h2>
    <p class="step-description">
      Fate points allow you to re-roll dice or avoid death. Resilience points help you recover from
      mental trauma and corruption. These values are typically determined by your species.
    </p>
  </div>

  <div class="step-content">
    <div class="info-box">
      <strong>Species: </strong>{character.species?.name || 'None selected'}
      <p class="info-text">
        Default values for this species have been calculated automatically.
        You can override these values if needed.
      </p>
    </div>

    <div class="form-section">
      <div class="form-row">
        <div class="form-group">
          <label for="fate-max">Fate Points</label>
          <input
            id="fate-max"
            type="number"
            bind:value={fateMax}
            on:change={handleFateChange}
            min="0"
            max="10"
            class="form-input"
          />
          <div class="help-text">
            Maximum fate points. Typically 0-3 depending on species.
          </div>
        </div>

        <div class="form-group">
          <label for="resilience-max">Resilience Points</label>
          <input
            id="resilience-max"
            type="number"
            bind:value={resilienceMax}
            on:change={handleResilienceChange}
            min="0"
            max="10"
            class="form-input"
          />
          <div class="help-text">
            Maximum resilience points. Typically 0-2 depending on species.
          </div>
        </div>
      </div>

      {#if manualOverride}
        <div class="form-group">
          <button type="button" on:click={resetToDefaults} class="btn-secondary">
            Reset to Species Defaults
          </button>
        </div>
      {/if}
    </div>

    <div class="form-section">
      <h3>About Fate & Resilience</h3>
      <div class="info-panel">
        <div class="info-item">
          <h4>Fate Points</h4>
          <p>
            Fate points can be spent to:
          </p>
          <ul>
            <li>Re-roll any test</li>
            <li>Avoid a killing blow</li>
            <li>Perform heroic actions</li>
          </ul>
          <p class="note">
            Fate points are precious and should be used sparingly. Once spent, they can only
            be regained through exceptional circumstances.
          </p>
        </div>

        <div class="info-item">
          <h4>Resilience Points</h4>
          <p>
            Resilience points can be spent to:
          </p>
          <ul>
            <li>Remove a corruption point</li>
            <li>Ignore a mental condition</li>
            <li>Resist supernatural influences</li>
          </ul>
          <p class="note">
            Resilience represents your character's mental fortitude and resistance to the
            dark forces of the Old World.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .wizard-step {
    max-width: 800px;
    margin: 0 auto;
  }

  .step-header {
    margin-bottom: 2rem;
  }

  .step-header h2 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    font-size: 1.75rem;
  }

  .step-description {
    color: var(--color-text-secondary, #666);
    margin: 0;
    line-height: 1.5;
  }

  .step-content {
    background: var(--color-bg-primary, white);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid var(--color-border, #ddd);
  }

  .info-box {
    background: var(--color-bg-info, #e3f2fd);
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 2rem;
    border-left: 4px solid var(--color-accent, #8b2e1f);
  }

  .info-box strong {
    color: var(--color-text-primary, #333);
  }

  .info-text {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .form-section:last-child {
    margin-bottom: 0;
  }

  .form-section h3 {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
    transition: border-color 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: var(--color-bg-primary, white);
    border-color: var(--color-accent, #8b2e1f);
  }

  .info-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .info-item h4 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .info-item p {
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
  }

  .info-item ul {
    margin: 0 0 0.75rem 1.25rem;
    padding: 0;
  }

  .info-item li {
    margin-bottom: 0.25rem;
  }

  .note {
    font-size: 0.875rem;
    font-style: italic;
    color: var(--color-text-secondary, #666);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .form-row,
    .info-panel {
      grid-template-columns: 1fr;
    }
  }
</style>
