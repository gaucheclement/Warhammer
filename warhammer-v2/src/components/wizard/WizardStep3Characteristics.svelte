<script>
  import { createEventDispatcher } from 'svelte'
  import { validateCharacteristics } from '../../lib/characterValidation.js'
  import { rollAllCharacteristics, calculateCharacteristicBonus, calculateWounds, calculateDefaultFate, calculateDefaultResilience } from '../../lib/characterCalculations.js'
  import { calculateDerivedStats, addXPBonus } from '../../lib/characterModel.js'
  import RandomButton from '../common/RandomButton.svelte'

  export let character = {}

  const dispatch = createEventDispatcher()

  let generationMethod = 'manual' // manual, random, pointbuy
  let validationErrors = []
  let rolledCharacteristics = null
  let showRandomUI = true
  let fateMax = 0
  let resilienceMax = 0
  let manualOverride = false

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

  /**
   * Roll 2d10 for all characteristics
   */
  function rollCharacteristicsForDisplay() {
    const speciesModifiers = {}

    // Extract species modifiers if available
    if (character.species && character.species.name) {
      // Species modifiers are already in character.characteristics
      // For now, use empty modifiers and roll pure 2d10
    }

    const rolled = rollAllCharacteristics(speciesModifiers)
    rolledCharacteristics = rolled

    // Format result for display
    const resultText = Object.entries(rolled)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')

    return resultText
  }

  /**
   * Accept rolled characteristics and gain +50 XP
   */
  function acceptRolledCharacteristics() {
    if (!rolledCharacteristics) return

    // Apply rolled values to character
    for (const [key, value] of Object.entries(rolledCharacteristics)) {
      character.characteristics[key] = value
    }

    // Add XP bonus for accepting rolls
    addXPBonus(character, 'characteristic', 50, 1)

    showRandomUI = false
    handleCharacteristicChange()
  }

  /**
   * Choose characteristics manually (no XP bonus)
   */
  function chooseManually() {
    character.randomState.characteristic = -1
    showRandomUI = false
    generationMethod = 'manual'
  }

  function rollRandomCharacteristics() {
    const speciesModifiers = {}

    const rolled = rollAllCharacteristics(speciesModifiers)

    // Add current species modifiers to rolled values
    for (const [key, value] of Object.entries(rolled)) {
      character.characteristics[key] = value
    }

    handleCharacteristicChange()
  }

  function updateDerivedStats() {
    calculateDerivedStats(character)
    calculateFateAndResilience()
  }

  function getCharacteristicBonus(value) {
    return calculateCharacteristicBonus(value)
  }

  // Calculate default Fate and Resilience based on species
  function calculateFateAndResilience() {
    if (character.species && character.species.name) {
      const defaultFate = calculateDefaultFate(character.species.name)
      const defaultResilience = calculateDefaultResilience(character.species.name)

      // Initialize fate/resilience if not set
      if (!character.fate) {
        character.fate = { current: 0, max: 0 }
      }
      if (!character.resilience) {
        character.resilience = { current: 0, max: 0 }
      }

      // Set defaults if not already set (or if 0 and not manually overridden)
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

  function resetFateToDefaults() {
    manualOverride = false
    calculateFateAndResilience()
    dispatch('change', character)
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

  // Auto-calculate Fate and Resilience when species changes
  $: if (character.species) {
    if (!manualOverride) {
      calculateFateAndResilience()
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
    <!-- Random Generation with XP Bonus -->
    {#if showRandomUI && character.randomState.characteristic === 0}
      <div class="random-section-highlight">
        <h3>Random Generation</h3>
        <p class="random-description">
          Roll the dice to randomly generate all characteristics (2d10 each) and earn <strong>+50 XP bonus</strong>!
          Or choose to enter them manually if you prefer.
        </p>
        <RandomButton
          label="Roll All Characteristics"
          xpBonus={50}
          rollFunction={rollCharacteristicsForDisplay}
          on:accept={acceptRolledCharacteristics}
          on:manual={chooseManually}
        />
      </div>
    {/if}

    <!-- Manual Entry Section -->
    {#if !showRandomUI || character.randomState.characteristic !== 0}
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

    <!-- Fate & Resilience Section -->
    <div class="fate-section">
      <h3>Fate & Resilience</h3>
      <div class="info-box">
        <p>
          <strong>Species: </strong>{character.species?.name || 'None selected'}
        </p>
        <p class="info-text">
          Default values for this species have been calculated automatically.
          You can override these values if needed.
        </p>
      </div>

      <div class="fate-grid">
        <div class="fate-item">
          <label for="fate-max">Fate Points</label>
          <input
            id="fate-max"
            type="number"
            bind:value={fateMax}
            on:change={handleFateChange}
            min="0"
            max="10"
            class="fate-input"
          />
          <div class="help-text">
            Maximum fate points. Typically 0-3 depending on species.
          </div>
        </div>

        <div class="fate-item">
          <label for="resilience-max">Resilience Points</label>
          <input
            id="resilience-max"
            type="number"
            bind:value={resilienceMax}
            on:change={handleResilienceChange}
            min="0"
            max="10"
            class="fate-input"
          />
          <div class="help-text">
            Maximum resilience points. Typically 0-2 depending on species.
          </div>
        </div>
      </div>

      {#if manualOverride}
        <div class="reset-section">
          <button type="button" on:click={resetFateToDefaults} class="btn-secondary">
            Reset to Species Defaults
          </button>
        </div>
      {/if}

      <div class="fate-info">
        <div class="info-panel">
          <div class="info-item">
            <h4>Fate Points</h4>
            <p>Fate points can be spent to:</p>
            <ul>
              <li>Re-roll any test</li>
              <li>Avoid a killing blow</li>
              <li>Perform heroic actions</li>
            </ul>
          </div>

          <div class="info-item">
            <h4>Resilience Points</h4>
            <p>Resilience points can be spent to:</p>
            <ul>
              <li>Remove a corruption point</li>
              <li>Ignore a mental condition</li>
              <li>Resist supernatural influences</li>
            </ul>
          </div>
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

  .random-section-highlight {
    max-width: 600px;
    margin: 0 auto 2rem;
    padding: 2rem;
    background: var(--color-bg-primary, white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .random-section-highlight h3 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    font-size: 1.5rem;
    text-align: center;
  }

  .random-description {
    text-align: center;
    color: var(--color-text-secondary, #666);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .random-description strong {
    color: gold;
    font-weight: 700;
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

  /* Fate & Resilience Section */
  .fate-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .fate-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: var(--color-text-primary, #333);
  }

  .info-box {
    background: var(--color-bg-info, #e3f2fd);
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    border-left: 4px solid var(--color-accent, #8b2e1f);
  }

  .info-box p {
    margin: 0.5rem 0;
  }

  .info-box strong {
    color: var(--color-text-primary, #333);
  }

  .info-text {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .fate-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .fate-item label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .fate-input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
    transition: border-color 0.2s;
  }

  .fate-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .reset-section {
    margin-bottom: 1.5rem;
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

  .fate-info {
    margin-top: 1.5rem;
  }

  .info-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 1rem;
    border-radius: 6px;
  }

  .info-item h4 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .info-item p {
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
    color: var(--color-text-secondary, #666);
  }

  .info-item ul {
    margin: 0 0 0.75rem 1.25rem;
    padding: 0;
  }

  .info-item li {
    margin-bottom: 0.25rem;
    color: var(--color-text-secondary, #666);
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

    .fate-grid,
    .info-panel {
      grid-template-columns: 1fr;
    }
  }
</style>
