<script>
  export let experience = { total: 0, spent: 0, available: 0 }
  export let isEditMode = false

  // Recalculate available XP when total or spent changes
  $: if (isEditMode) {
    experience.available = experience.total - experience.spent
  }
</script>

<div class="advancement-block">
  <h2 class="block-title">Experience</h2>

  <div class="xp-grid">
    <div class="xp-item">
      <div class="xp-label">Total XP</div>
      {#if isEditMode}
        <input
          type="number"
          bind:value={experience.total}
          class="xp-input"
          min="0"
        />
      {:else}
        <div class="xp-value">{experience.total || 0}</div>
      {/if}
    </div>

    <div class="xp-item">
      <div class="xp-label">Spent XP</div>
      {#if isEditMode}
        <input
          type="number"
          bind:value={experience.spent}
          class="xp-input"
          min="0"
          max={experience.total}
        />
      {:else}
        <div class="xp-value">{experience.spent || 0}</div>
      {/if}
    </div>

    <div class="xp-item highlight">
      <div class="xp-label">Available XP</div>
      <div class="xp-value available">{experience.available || 0}</div>
    </div>
  </div>

  <div class="xp-info">
    <p class="info-text">
      Experience points are earned through play and can be spent on improving characteristics,
      learning new skills and talents, and advancing your career.
    </p>
  </div>
</div>

<style>
  .advancement-block {
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

  .xp-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .xp-item {
    background: var(--color-bg-primary, #fff);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    padding: 1rem;
    text-align: center;
  }

  .xp-item.highlight {
    border-color: var(--color-accent, #8b2e1f);
    background: linear-gradient(135deg, #fff 0%, #fef5f4 100%);
  }

  .xp-label {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .xp-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-text-primary, #333);
    line-height: 1;
  }

  .xp-value.available {
    color: var(--color-accent, #8b2e1f);
    font-size: 2.5rem;
  }

  .xp-input {
    width: 100%;
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-text-primary, #333);
    text-align: center;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 4px;
    padding: 0.25rem;
  }

  .xp-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .xp-info {
    background: var(--color-bg-primary, #fff);
    border-left: 4px solid var(--color-accent, #8b2e1f);
    padding: 1rem;
    border-radius: 4px;
  }

  .info-text {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.5;
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
    .advancement-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .xp-info {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .xp-grid {
      grid-template-columns: 1fr;
    }

    .xp-item {
      padding: 0.75rem;
    }

    .xp-value {
      font-size: 1.75rem;
    }

    .xp-value.available {
      font-size: 2rem;
    }

    .xp-input {
      font-size: 1.75rem;
    }

    .info-text {
      font-size: 0.85rem;
    }
  }
</style>
