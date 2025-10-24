<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { calculateTotalXPSpent } from '../../lib/characterCalculations.js'

  export let character = {}
  export let skills = []

  const dispatch = createEventDispatcher()

  // Initialize experience if not present
  if (!character.experience) {
    character.experience = {
      total: 0,
      spent: 0,
      available: 0
    }
  }

  let startingXP = character.experience.total || 0

  // Calculate XP spent during character creation
  $: xpSpent = calculateTotalXPSpent(character, skills)
  $: availableXP = startingXP - xpSpent

  function handleXPChange() {
    character.experience.total = startingXP
    character.experience.spent = xpSpent
    character.experience.available = availableXP
    dispatch('change', character)
  }

  onMount(() => {
    handleXPChange()
    dispatch('validate', { valid: true, errors: [] })
  })

  $: if (startingXP !== undefined) {
    handleXPChange()
  }
</script>

<div class="wizard-step step-experience">
  <div class="step-header">
    <h2>Starting Experience</h2>
    <p class="step-description">
      Set your character's starting experience points (XP). Most new characters start with 0 XP,
      but your GM may grant additional XP for experienced campaigns or special circumstances.
    </p>
  </div>

  <div class="step-content">
    <div class="form-section">
      <div class="form-group">
        <label for="starting-xp">Starting XP</label>
        <input
          id="starting-xp"
          type="number"
          bind:value={startingXP}
          on:input={handleXPChange}
          min="0"
          step="25"
          class="form-input"
        />
        <div class="help-text">
          Enter the total XP your character starts with. Default is 0 for new characters.
        </div>
      </div>
    </div>

    <div class="xp-summary">
      <h3>Experience Summary</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">Total XP</div>
          <div class="summary-value">{startingXP}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">XP Spent</div>
          <div class="summary-value">{xpSpent}</div>
        </div>
        <div class="summary-item {availableXP < 0 ? 'negative' : ''}">
          <div class="summary-label">Available XP</div>
          <div class="summary-value">{availableXP}</div>
        </div>
      </div>

      {#if availableXP < 0}
        <div class="warning-box">
          <strong>Warning:</strong> You have spent more XP than available! This typically occurs
          when you've allocated skill advances and talents during character creation. You may need
          to increase your starting XP or reduce your advances.
        </div>
      {/if}
    </div>

    <div class="form-section">
      <h3>XP Spending Breakdown</h3>
      <div class="breakdown-info">
        <p>Experience points spent during character creation include:</p>
        <ul>
          <li><strong>Skills:</strong> 10 XP per advance for basic skills, 15 XP for advanced skills</li>
          <li><strong>Talents:</strong> 100 XP per talent</li>
          <li><strong>Characteristics:</strong> 25 XP per advance (if using characteristic advancement)</li>
        </ul>
        <p class="note">
          Note: The XP spent calculation is based on advances made during character creation.
          Species and career starting skills/talents typically don't cost XP.
        </p>
      </div>
    </div>

    <div class="form-section">
      <h3>Common Starting XP Levels</h3>
      <div class="xp-levels">
        <div class="xp-level">
          <strong>0 XP - Fresh Character</strong>
          <p>Brand new adventurer just starting their journey.</p>
        </div>
        <div class="xp-level">
          <strong>500-1000 XP - Experienced</strong>
          <p>Character with some adventuring experience.</p>
        </div>
        <div class="xp-level">
          <strong>2000+ XP - Veteran</strong>
          <p>Seasoned adventurer with significant experience.</p>
        </div>
        <div class="xp-level">
          <strong>5000+ XP - Hero</strong>
          <p>Renowned hero with legendary accomplishments.</p>
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

  .xp-summary {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .xp-summary h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: var(--color-text-primary, #333);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .summary-item {
    background: var(--color-bg-primary, white);
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    border: 2px solid var(--color-border, #ddd);
  }

  .summary-item.negative {
    border-color: var(--color-error, #dc3545);
    background: #fff5f5;
  }

  .summary-label {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .summary-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text-primary, #333);
  }

  .summary-item.negative .summary-value {
    color: var(--color-error, #dc3545);
  }

  .warning-box {
    background: #fff3cd;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid var(--color-warning, #ffc107);
    margin-top: 1rem;
  }

  .warning-box strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary, #333);
  }

  .breakdown-info {
    background: var(--color-bg-info, #e3f2fd);
    padding: 1rem;
    border-radius: 6px;
  }

  .breakdown-info p {
    margin: 0 0 0.75rem 0;
  }

  .breakdown-info ul {
    margin: 0 0 0.75rem 1.25rem;
    padding: 0;
  }

  .breakdown-info li {
    margin-bottom: 0.5rem;
  }

  .note {
    font-size: 0.875rem;
    font-style: italic;
    color: var(--color-text-secondary, #666);
    margin-bottom: 0;
  }

  .xp-levels {
    display: grid;
    gap: 1rem;
  }

  .xp-level {
    padding: 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
    border-left: 4px solid var(--color-accent, #8b2e1f);
  }

  .xp-level strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary, #333);
  }

  .xp-level p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .summary-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
