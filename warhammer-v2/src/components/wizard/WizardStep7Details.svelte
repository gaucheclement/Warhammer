<script>
  import { createEventDispatcher } from 'svelte'
  import { validateCharacterName } from '../../lib/characterValidation.js'

  export let character = {}
  export let existingCharacters = []

  const dispatch = createEventDispatcher()

  let nameError = ''
  let nameWarning = ''

  const eyeColors = [
    'Blue', 'Brown', 'Green', 'Grey', 'Hazel', 'Amber', 'Violet', 'Black'
  ]

  const hairColors = [
    'Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Grey', 'White', 'Bald'
  ]

  function validateName() {
    const validation = validateCharacterName(character.name, existingCharacters)
    nameError = validation.errors.join(', ')
    nameWarning = validation.warnings.join(', ')

    dispatch('validate', {
      valid: validation.valid,
      errors: validation.errors
    })

    return validation.valid
  }

  function handleNameBlur() {
    validateName()
  }

  function handleChange() {
    dispatch('change', character)
  }

  $: if (character.name !== undefined) {
    validateName()
  }
</script>

<div class="wizard-step step-details">
  <div class="step-header">
    <h2>Character Details</h2>
    <p class="step-description">
      Start by giving your character a name and defining their appearance.
      Choose a name that fits the grim and perilous world of Warhammer Fantasy.
    </p>
  </div>

  <div class="step-content">
    <div class="form-section">
      <div class="form-group">
        <label for="char-name" class="required">Character Name</label>
        <input
          id="char-name"
          type="text"
          bind:value={character.name}
          on:blur={handleNameBlur}
          on:input={handleChange}
          placeholder="Enter character name"
          class="form-input"
          class:error={nameError}
          maxlength="100"
          required
        />
        {#if nameError}
          <div class="error-message">{nameError}</div>
        {/if}
        {#if nameWarning && !nameError}
          <div class="warning-message">{nameWarning}</div>
        {/if}
        <div class="help-text">
          Must be at least 2 characters long. Choose something memorable!
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3>Appearance</h3>

      <div class="form-row">
        <div class="form-group">
          <label for="eye-color">Eye Color</label>
          <select
            id="eye-color"
            bind:value={character.appearance.eyes}
            on:change={handleChange}
            class="form-select"
          >
            <option value="">Select eye color</option>
            {#each eyeColors as color}
              <option value={color}>{color}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="hair-color">Hair Color</label>
          <select
            id="hair-color"
            bind:value={character.appearance.hair}
            on:change={handleChange}
            class="form-select"
          >
            <option value="">Select hair color</option>
            {#each hairColors as color}
              <option value={color}>{color}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="distinguishing">Distinguishing Features</label>
        <textarea
          id="distinguishing"
          bind:value={character.appearance.distinguishing}
          on:input={handleChange}
          placeholder="Scars, tattoos, unusual markings, or other notable features..."
          class="form-textarea"
          rows="4"
          maxlength="500"
        ></textarea>
        <div class="help-text">
          Optional. Describe any scars, tattoos, or other distinctive features.
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

  .form-group label.required::after {
    content: ' *';
    color: #dc3545;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
    transition: border-color 0.2s;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .form-input.error {
    border-color: #dc3545;
  }

  .form-textarea {
    resize: vertical;
    font-family: inherit;
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .error-message {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #dc3545;
    font-weight: 500;
  }

  .warning-message {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #ffc107;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
