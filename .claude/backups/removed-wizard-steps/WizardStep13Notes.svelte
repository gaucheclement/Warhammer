<script>
  import { createEventDispatcher, onMount } from 'svelte'

  export let character = {}

  const dispatch = createEventDispatcher()

  // Initialize notes if not present
  if (!character.notes) {
    character.notes = ''
  }
  if (!character.gmNotes) {
    character.gmNotes = ''
  }

  function handleChange() {
    dispatch('change', character)
  }

  onMount(() => {
    dispatch('validate', { valid: true, errors: [] })
  })
</script>

<div class="wizard-step step-notes">
  <div class="step-header">
    <h2>Character Notes</h2>
    <p class="step-description">
      Record your character's background story, personality traits, important events,
      or any other notes that help bring your character to life.
    </p>
  </div>

  <div class="step-content">
    <div class="form-section">
      <div class="form-group">
        <label for="char-notes">Character Background & Notes</label>
        <textarea
          id="char-notes"
          bind:value={character.notes}
          on:input={handleChange}
          placeholder="Write your character's background story, personality, motivations, important relationships, past events, etc."
          class="form-textarea large"
          rows="10"
        />
        <div class="help-text">
          Optional. This field is visible to both you and your GM.
        </div>
      </div>

      <div class="form-group">
        <label for="gm-notes">GM Notes</label>
        <textarea
          id="gm-notes"
          bind:value={character.gmNotes}
          on:input={handleChange}
          placeholder="Private notes for the GM about plot hooks, secrets, or special considerations for this character."
          class="form-textarea"
          rows="6"
        />
        <div class="help-text">
          Optional. Use this for information you want to share specifically with your GM.
        </div>
      </div>
    </div>

    <div class="tip-box">
      <strong>Tip:</strong> A good character background doesn't need to be lengthy. A few paragraphs
      covering who your character is, where they came from, and what drives them is often enough
      to make them memorable and give your GM material to work with.
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

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
    transition: border-color 0.2s;
    resize: vertical;
    font-family: inherit;
    line-height: 1.6;
  }

  .form-textarea.large {
    min-height: 250px;
  }

  .form-textarea:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .tip-box {
    background: var(--color-bg-info, #e8f5e9);
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid var(--color-success, #4caf50);
    margin-top: 1.5rem;
  }

  .tip-box strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary, #333);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }
  }
</style>
