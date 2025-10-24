<script>
  import { createEventDispatcher } from 'svelte'
  import { validateCharacteristics } from '../../lib/characterValidation.js'
  import { rollAllCharacteristics, calculateCharacteristicBonus, calculateWounds } from '../../lib/characterCalculations.js'
  import { calculateDerivedStats } from '../../lib/characterModel.js'

  export let character = {}

  const dispatch = createEventDispatcher()

  let generationMethod = 'manual' // manual, random, pointbuy
  let validationErrors = []

  const characteristicLabels = {
    M: 'Movement',
    WS: 'Weapon Skill',
    BS: 'Ballistic Skill',
    S: 'Strength',
    T: 'Toughness',
    I: 'Initiative',
    Ag: 'Agility',
    Dex: 'Dexterity',
    Int: 'Intelligence',
    WP: 'Willpower',
    Fel: 'Fellowship'
  }

  function handleCharacteristicChange() {
    validateCurrentCharacteristics()
    updateDerivedStats()
    dispatch('change', character)
  }

  function validateCurrentCharacteristics() {
    const validation = validateCharacteristics(character.characteristics)
    validationErrors = validation.errors

    dispatch('validate', {
      valid: validation.valid,
      errors: validation.errors
    })
  }

  function rollRandomCharacteristics() {
    const speciesModifiers = {}

    // Extract species modifiers (already applied, so we need base values)
    // For simplicity, we'll roll new values and add species modifiers
    if (character.species && character.species.name) {
      // Get species data if available
      // For now, we'll use current values as base
    }

    const rolled = rollAllCharacteristics(speciesModifiers)

    // Add current species modifiers to rolled values
    for (const [key, value] of Object.entries(rolled)) {
      character.characteristics[key] = value
    }

    handleCharacteristicChange()
  }

  function updateDerivedStats() {
    calculateDerivedStats(character)
  }

  function getCharacteristicBonus(value) {
    return calculateCharacteristicBonus(value)
  }

  $: derivedWounds = calculateWounds(
    character.characteristics.T || 0,
    character.characteristics.S || 0,
    character.characteristics.WP || 0,
    character.talents || []
  )

  // Update wounds when characteristics change
  $: if (character.characteristics.T || character.characteristics.S || character.characteristics.WP) {
    character.wounds.max = derivedWounds
    if (character.wounds.current === 0) {
      character.wounds.current = derivedWounds
    }
  }
</script>

<div class="wizard-step step-characteristics">
  <div class="step-header">
    <h2>Characteristics</h2>
    <p class="step-description">
      Set your character's characteristics. These core attributes determine your
      character's physical and mental capabilities. Choose a generation method below.
    </p>
  </div>

  <div class="step-content">
    <div class="method-selector">
      <label>
        <input
          type="radio"
          bind:group={generationMethod}
          value="manual"
        />
        <span>Manual Entry</span>
      </label>
      <label>
        <input
          type="radio"
          bind:group={generationMethod}
          value="random"
        />
        <span>Random Roll (2d10 per stat)</span>
      </label>
      <label>
        <input
          type="radio"
          bind:group={generationMethod}
          value="pointbuy"
        />
        <span>Point Buy (Coming Soon)</span>
      </label>
    </div>

    {#if generationMethod === 'random'}
      <div class="random-section">
        <button class="btn btn-primary" on:click={rollRandomCharacteristics}>
          Roll All Characteristics
        </button>
        <p class="help-text">
          This will roll 2d10 for each characteristic and add your species modifiers.
        </p>
      </div>
    {/if}

    {#if generationMethod === 'pointbuy'}
      <div class="pointbuy-notice">
        <p>Point buy system coming in a future update!</p>
        <p>For now, please use Manual Entry or Random Roll.</p>
      </div>
    {/if}

    <div class="characteristics-grid">
      {#each Object.entries(characteristicLabels) as [key, label]}
        <div class="characteristic-item">
          <label for="char-{key}">
            <span class="char-label">{label}</span>
            <span class="char-key">({key})</span>
          </label>
          <div class="input-group">
            <input
              id="char-{key}"
              type="number"
              bind:value={character.characteristics[key]}
              on:input={handleCharacteristicChange}
              min="0"
              max="100"
              class="char-input"
              disabled={generationMethod === 'pointbuy'}
            />
            <span class="bonus-display">
              Bonus: {getCharacteristicBonus(character.characteristics[key] || 0)}
            </span>
          </div>
        </div>
      {/each}
    </div>

    <div class="derived-stats">
      <h3>Derived Statistics</h3>
      <div class="derived-grid">
        <div class="derived-item">
          <span class="derived-label">Maximum Wounds:</span>
          <span class="derived-value">{character.wounds.max || 0}</span>
        </div>
        <div class="derived-item">
          <span class="derived-label">Movement:</span>
          <span class="derived-value">{character.characteristics.M || 0}</span>
        </div>
        <div class="derived-item">
          <span class="derived-label">Initiative Bonus:</span>
          <span class="derived-value">
            {getCharacteristicBonus(character.characteristics.I || 0) +
              getCharacteristicBonus(character.characteristics.Ag || 0)}
          </span>
        </div>
      </div>
    </div>

    {#if validationErrors.length > 0}
      <div class="validation-errors">
        <strong>Validation Errors:</strong>
        <ul>
          {#each validationErrors as error}
            <li>{error}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style>
  .wizard-step {
    max-width: 1000px;
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

  .method-selector {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .method-selector label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
  }

  .method-selector input[type="radio"] {
    cursor: pointer;
  }

  .random-section {
    margin-bottom: 2rem;
    padding: 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
  }

  .pointbuy-notice {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 6px;
    text-align: center;
  }

  .pointbuy-notice p {
    margin: 0.5rem 0;
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

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .characteristics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .characteristic-item label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .char-key {
    color: var(--color-text-secondary, #666);
    font-weight: 400;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .char-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
  }

  .char-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .char-input:disabled {
    background: var(--color-bg-secondary, #f5f5f5);
    cursor: not-allowed;
  }

  .bonus-display {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #666);
    font-weight: 500;
  }

  .derived-stats {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .derived-stats h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: var(--color-text-primary, #333);
  }

  .derived-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .derived-item {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 1rem;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .derived-label {
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .derived-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
  }

  .validation-errors {
    margin-top: 1rem;
    padding: 1rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 6px;
    color: #856404;
  }

  .validation-errors ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.5rem;
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .method-selector {
      flex-direction: column;
      gap: 1rem;
    }

    .characteristics-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
