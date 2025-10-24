<script>
  export let spells = []
  export let isEditMode = false

  let showAddSpell = false
  let newSpellName = ''
  let newSpellCN = ''
  let newSpellRange = ''
  let newSpellLore = ''

  function addSpell() {
    if (newSpellName.trim()) {
      spells = [...spells, {
        id: `custom-${Date.now()}`,
        name: newSpellName.trim(),
        cn: newSpellCN.trim(),
        range: newSpellRange.trim(),
        lore: newSpellLore.trim()
      }]
      resetAddForm()
    }
  }

  function removeSpell(index) {
    spells = spells.filter((_, i) => i !== index)
  }

  function resetAddForm() {
    newSpellName = ''
    newSpellCN = ''
    newSpellRange = ''
    newSpellLore = ''
    showAddSpell = false
  }
</script>

<div class="spells-block">
  <div class="block-header">
    <h2 class="block-title">Spells</h2>
    {#if isEditMode}
      <button class="btn-add" on:click={() => showAddSpell = !showAddSpell}>
        {showAddSpell ? 'Cancel' : '+ Add'}
      </button>
    {/if}
  </div>

  {#if showAddSpell && isEditMode}
    <div class="add-form">
      <input
        type="text"
        bind:value={newSpellName}
        placeholder="Spell name"
        class="form-input"
      />
      <input
        type="text"
        bind:value={newSpellCN}
        placeholder="CN"
        class="form-input tiny"
      />
      <input
        type="text"
        bind:value={newSpellRange}
        placeholder="Range"
        class="form-input small"
      />
      <input
        type="text"
        bind:value={newSpellLore}
        placeholder="Lore (optional)"
        class="form-input small"
      />
      <button class="btn-save" on:click={addSpell}>Add</button>
    </div>
  {/if}

  {#if spells.length === 0}
    <p class="empty-message">No spells yet</p>
  {:else}
    <div class="spells-list">
      {#each spells as spell, index}
        <div class="spell-item">
          <div class="spell-header">
            <div class="spell-name">{spell.name}</div>
            {#if isEditMode}
              <button class="btn-remove" on:click={() => removeSpell(index)}>×</button>
            {/if}
          </div>
          <div class="spell-details">
            {#if spell.cn}
              <span class="spell-detail"><strong>CN:</strong> {spell.cn}</span>
            {/if}
            {#if spell.range}
              <span class="spell-detail"><strong>Range:</strong> {spell.range}</span>
            {/if}
            {#if spell.lore}
              <span class="spell-detail"><strong>Lore:</strong> {spell.lore}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .spells-block {
    background: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
  }

  .block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--color-border, #ddd);
  }

  .block-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    margin: 0;
  }

  .btn-add {
    padding: 0.5rem 1rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .btn-add:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .add-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--color-bg-primary, #fff);
    border-radius: 6px;
    flex-wrap: wrap;
  }

  .form-input {
    flex: 1;
    min-width: 150px;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.95rem;
  }

  .form-input.small {
    flex: 0 1 auto;
    min-width: 100px;
  }

  .form-input.tiny {
    flex: 0 1 auto;
    width: 60px;
    min-width: 60px;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .btn-save {
    padding: 0.5rem 1.5rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  .btn-save:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .empty-message {
    color: var(--color-text-secondary, #999);
    font-style: italic;
    margin: 0;
    text-align: center;
    padding: 1rem;
  }

  .spells-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .spell-item {
    padding: 1rem;
    background: var(--color-bg-primary, #fff);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
  }

  .spell-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .spell-name {
    color: var(--color-text-primary, #333);
    font-weight: 600;
    font-size: 1.05rem;
  }

  .spell-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.9rem;
  }

  .spell-detail {
    color: var(--color-text-secondary, #666);
  }

  .spell-detail strong {
    color: var(--color-text-primary, #333);
  }

  .btn-remove {
    width: 28px;
    height: 28px;
    padding: 0;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .btn-remove:hover {
    background: #c82333;
  }

  @media print {
    .spells-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .btn-add,
    .btn-remove {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .add-form {
      flex-direction: column;
    }

    .form-input,
    .form-input.small,
    .form-input.tiny {
      width: 100%;
      min-width: 100%;
    }

    .spell-item {
      padding: 0.75rem;
    }

    .spell-name {
      font-size: 1rem;
    }

    .spell-details {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
</style>
