<script>
  export let notes = ''
  export let appearance = { eyes: '', hair: '', distinguishing: '' }
  export let isEditMode = false
</script>

<div class="notes-block">
  <h2 class="block-title">Notes & Appearance</h2>

  <div class="appearance-section">
    <h3 class="section-subtitle">Appearance</h3>
    <div class="appearance-grid">
      <div class="appearance-field">
        <label class="field-label">Eyes:</label>
        {#if isEditMode}
          <input
            type="text"
            bind:value={appearance.eyes}
            class="field-input"
            placeholder="Eye color"
          />
        {:else}
          <div class="field-value">{appearance.eyes || 'Not specified'}</div>
        {/if}
      </div>

      <div class="appearance-field">
        <label class="field-label">Hair:</label>
        {#if isEditMode}
          <input
            type="text"
            bind:value={appearance.hair}
            class="field-input"
            placeholder="Hair color"
          />
        {:else}
          <div class="field-value">{appearance.hair || 'Not specified'}</div>
        {/if}
      </div>
    </div>

    <div class="appearance-field full-width">
      <label class="field-label">Distinguishing Features:</label>
      {#if isEditMode}
        <textarea
          bind:value={appearance.distinguishing}
          class="field-textarea"
          placeholder="Scars, tattoos, or other notable features..."
          rows="2"
        ></textarea>
      {:else}
        <div class="field-value">{appearance.distinguishing || 'None noted'}</div>
      {/if}
    </div>
  </div>

  <div class="notes-section">
    <h3 class="section-subtitle">Character Notes</h3>
    {#if isEditMode}
      <textarea
        bind:value={notes}
        class="notes-textarea"
        placeholder="Background, personality, goals, relationships, campaign notes..."
        rows="8"
      ></textarea>
    {:else}
      {#if notes}
        <div class="notes-content">{notes}</div>
      {:else}
        <p class="empty-message">No notes yet</p>
      {/if}
    {/if}
  </div>
</div>

<style>
  .notes-block {
    background: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
  }

  .block-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    margin: 0 0 1rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--color-border, #ddd);
  }

  .appearance-section,
  .notes-section {
    margin-bottom: 1.5rem;
  }

  .notes-section {
    margin-bottom: 0;
  }

  .section-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
    margin: 0 0 0.75rem 0;
  }

  .appearance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .appearance-field {
    background: var(--color-bg-primary, #fff);
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--color-border, #ddd);
  }

  .appearance-field.full-width {
    grid-column: 1 / -1;
  }

  .field-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-secondary, #666);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .field-value {
    color: var(--color-text-primary, #333);
    font-size: 0.95rem;
  }

  .field-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;
  }

  .field-input:focus,
  .field-textarea:focus,
  .notes-textarea:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .field-textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
  }

  .notes-textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    font-size: 0.95rem;
    font-family: inherit;
    line-height: 1.6;
    resize: vertical;
    background: var(--color-bg-primary, #fff);
  }

  .notes-content {
    background: var(--color-bg-primary, #fff);
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid var(--color-border, #ddd);
    color: var(--color-text-primary, #333);
    font-size: 0.95rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .empty-message {
    color: var(--color-text-secondary, #999);
    font-style: italic;
    margin: 0;
    text-align: center;
    padding: 1rem;
    background: var(--color-bg-primary, #fff);
    border-radius: 6px;
    border: 1px solid var(--color-border, #ddd);
  }

  @media print {
    .notes-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  @media (max-width: 768px) {
    .appearance-grid {
      grid-template-columns: 1fr;
    }

    .notes-textarea {
      font-size: 0.9rem;
    }
  }
</style>
