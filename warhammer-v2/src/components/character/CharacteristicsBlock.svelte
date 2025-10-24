<script>
  export let characteristics
  export let isEditMode = false

  const characteristicsList = [
    { key: 'WS', label: 'Weapon Skill' },
    { key: 'BS', label: 'Ballistic Skill' },
    { key: 'S', label: 'Strength' },
    { key: 'T', label: 'Toughness' },
    { key: 'I', label: 'Initiative' },
    { key: 'Ag', label: 'Agility' },
    { key: 'Dex', label: 'Dexterity' },
    { key: 'Int', label: 'Intelligence' },
    { key: 'WP', label: 'Willpower' },
    { key: 'Fel', label: 'Fellowship' }
  ]

  function calculateBonus(value) {
    return Math.floor(value / 10)
  }
</script>

<div class="characteristics-block">
  <h2 class="block-title">Characteristics</h2>

  <div class="characteristics-grid">
    {#each characteristicsList as char}
      <div class="characteristic-item">
        <div class="char-label" title={char.label}>{char.key}</div>
        {#if isEditMode}
          <input
            type="number"
            bind:value={characteristics[char.key]}
            class="char-input"
            min="0"
            max="100"
          />
        {:else}
          <div class="char-value">{characteristics[char.key] || 0}</div>
        {/if}
        <div class="char-bonus">
          Bonus: {calculateBonus(characteristics[char.key] || 0)}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .characteristics-block {
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

  .characteristics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
  }

  .characteristic-item {
    background: var(--color-bg-primary, #fff);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    padding: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .char-label {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .char-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
    line-height: 1;
  }

  .char-input {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
    text-align: center;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 4px;
    padding: 0.25rem;
    width: 100%;
  }

  .char-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .char-bonus {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #999);
    font-weight: 500;
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
    .characteristics-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  @media (max-width: 768px) {
    .characteristics-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
    }

    .characteristic-item {
      padding: 0.75rem 0.5rem;
    }

    .char-label {
      font-size: 0.75rem;
    }

    .char-value,
    .char-input {
      font-size: 1.5rem;
    }

    .char-bonus {
      font-size: 0.7rem;
    }
  }
</style>
