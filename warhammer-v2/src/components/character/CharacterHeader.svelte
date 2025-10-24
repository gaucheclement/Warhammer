<script>
  export let character
  export let isEditMode = false

  $: wounds = character.wounds || { current: 0, max: 0 }
  $: fate = character.fate || { current: 0, max: 0 }
  $: resilience = character.resilience || { current: 0, max: 0 }
</script>

<div class="character-header">
  <div class="header-main">
    <div class="name-section">
      {#if isEditMode}
        <input
          type="text"
          bind:value={character.name}
          class="name-input"
          placeholder="Character Name"
        />
      {:else}
        <h1 class="character-name">{character.name}</h1>
      {/if}
    </div>

    <div class="info-section">
      <div class="info-item">
        <span class="info-label">Species:</span>
        <span class="info-value">{character.species?.name || 'Unknown'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Career:</span>
        <span class="info-value">
          {character.career?.name || 'Unknown'}
          {#if character.career?.level}
            (Level {character.career.level})
          {/if}
        </span>
      </div>
    </div>
  </div>

  <div class="header-stats">
    <!-- Wounds -->
    <div class="stat-block">
      <div class="stat-label">Wounds</div>
      <div class="stat-value">
        {#if isEditMode}
          <input
            type="number"
            bind:value={wounds.current}
            class="stat-input small"
            min="0"
            max={wounds.max}
          />
          <span class="stat-separator">/</span>
          <input
            type="number"
            bind:value={wounds.max}
            class="stat-input small"
            min="0"
          />
        {:else}
          <span class="stat-current">{wounds.current}</span>
          <span class="stat-separator">/</span>
          <span class="stat-max">{wounds.max}</span>
        {/if}
      </div>
    </div>

    <!-- Fate -->
    <div class="stat-block">
      <div class="stat-label">Fate</div>
      <div class="stat-value">
        {#if isEditMode}
          <input
            type="number"
            bind:value={fate.current}
            class="stat-input small"
            min="0"
            max={fate.max}
          />
          <span class="stat-separator">/</span>
          <input
            type="number"
            bind:value={fate.max}
            class="stat-input small"
            min="0"
          />
        {:else}
          <span class="stat-current">{fate.current}</span>
          <span class="stat-separator">/</span>
          <span class="stat-max">{fate.max}</span>
        {/if}
      </div>
    </div>

    <!-- Resilience -->
    <div class="stat-block">
      <div class="stat-label">Resilience</div>
      <div class="stat-value">
        {#if isEditMode}
          <input
            type="number"
            bind:value={resilience.current}
            class="stat-input small"
            min="0"
            max={resilience.max}
          />
          <span class="stat-separator">/</span>
          <input
            type="number"
            bind:value={resilience.max}
            class="stat-input small"
            min="0"
          />
        {:else}
          <span class="stat-current">{resilience.current}</span>
          <span class="stat-separator">/</span>
          <span class="stat-max">{resilience.max}</span>
        {/if}
      </div>
    </div>

    <!-- Movement -->
    <div class="stat-block">
      <div class="stat-label">Movement</div>
      <div class="stat-value">
        {#if isEditMode}
          <input
            type="number"
            bind:value={character.characteristics.M}
            class="stat-input"
            min="0"
          />
        {:else}
          <span class="stat-single">{character.characteristics?.M || 0}</span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .character-header {
    background: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .header-main {
    margin-bottom: 1.5rem;
  }

  .name-section {
    margin-bottom: 1rem;
  }

  .character-name {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    margin: 0;
    line-height: 1.2;
  }

  .name-input {
    font-size: 2.5rem;
    font-weight: bold;
    font-family: var(--font-heading, serif);
    padding: 0.5rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    width: 100%;
    background: var(--color-bg-primary, #fff);
  }

  .name-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .info-section {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .info-item {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }

  .info-label {
    color: var(--color-text-secondary, #666);
    font-weight: 500;
  }

  .info-value {
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .header-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .stat-block {
    text-align: center;
    background: var(--color-bg-primary, #fff);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    padding: 0.75rem;
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .stat-value {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
  }

  .stat-current {
    color: var(--color-accent, #8b2e1f);
  }

  .stat-separator {
    color: var(--color-text-secondary, #999);
  }

  .stat-max {
    color: var(--color-text-secondary, #666);
  }

  .stat-single {
    color: var(--color-accent, #8b2e1f);
  }

  .stat-input {
    width: 60px;
    padding: 0.25rem;
    text-align: center;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .stat-input.small {
    width: 50px;
    font-size: 1.1rem;
  }

  .stat-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  /* Remove number input arrows */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  @media print {
    .character-header {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  @media (max-width: 768px) {
    .character-name,
    .name-input {
      font-size: 2rem;
    }

    .info-section {
      flex-direction: column;
      gap: 0.5rem;
    }

    .header-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .stat-block {
      padding: 0.5rem;
    }

    .stat-label {
      font-size: 0.75rem;
    }

    .stat-value {
      font-size: 1.25rem;
    }

    .stat-input {
      width: 50px;
      font-size: 1.1rem;
    }

    .stat-input.small {
      width: 40px;
      font-size: 1rem;
    }
  }
</style>
