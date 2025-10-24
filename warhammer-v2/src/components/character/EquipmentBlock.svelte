<script>
  export let trappings = []
  export let isEditMode = false

  let showAddTrapping = false
  let newTrappingName = ''
  let newTrappingQuantity = 1
  let newTrappingEquipped = false

  function addTrapping() {
    if (newTrappingName.trim()) {
      trappings = [...trappings, {
        id: `custom-${Date.now()}`,
        name: newTrappingName.trim(),
        quantity: newTrappingQuantity,
        equipped: newTrappingEquipped
      }]
      resetAddForm()
    }
  }

  function removeTrapping(index) {
    trappings = trappings.filter((_, i) => i !== index)
  }

  function resetAddForm() {
    newTrappingName = ''
    newTrappingQuantity = 1
    newTrappingEquipped = false
    showAddTrapping = false
  }
</script>

<div class="equipment-block">
  <div class="block-header">
    <h2 class="block-title">Equipment</h2>
    {#if isEditMode}
      <button class="btn-add" on:click={() => showAddTrapping = !showAddTrapping}>
        {showAddTrapping ? 'Cancel' : '+ Add'}
      </button>
    {/if}
  </div>

  {#if showAddTrapping && isEditMode}
    <div class="add-form">
      <input
        type="text"
        bind:value={newTrappingName}
        placeholder="Item name"
        class="form-input"
      />
      <input
        type="number"
        bind:value={newTrappingQuantity}
        placeholder="Qty"
        class="form-input tiny"
        min="1"
      />
      <label class="checkbox-label">
        <input
          type="checkbox"
          bind:checked={newTrappingEquipped}
        />
        <span>Equipped</span>
      </label>
      <button class="btn-save" on:click={addTrapping}>Add</button>
    </div>
  {/if}

  {#if trappings.length === 0}
    <p class="empty-message">No equipment yet</p>
  {:else}
    <div class="equipment-list">
      {#each trappings as trapping, index}
        <div class="equipment-item" class:equipped={trapping.equipped}>
          <div class="equipment-main">
            {#if isEditMode}
              <label class="checkbox">
                <input
                  type="checkbox"
                  bind:checked={trapping.equipped}
                />
              </label>
            {:else if trapping.equipped}
              <span class="equipped-indicator">✓</span>
            {/if}
            <div class="equipment-name">{trapping.name}</div>
          </div>
          <div class="equipment-right">
            {#if isEditMode}
              <input
                type="number"
                bind:value={trapping.quantity}
                class="quantity-input"
                min="1"
              />
              <button class="btn-remove" on:click={() => removeTrapping(index)}>×</button>
            {:else}
              <div class="equipment-quantity">×{trapping.quantity}</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .equipment-block {
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
    align-items: center;
  }

  .form-input {
    flex: 1;
    min-width: 150px;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.95rem;
  }

  .form-input.tiny {
    flex: 0 1 auto;
    width: 70px;
    min-width: 70px;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-label input[type="checkbox"] {
    cursor: pointer;
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

  .equipment-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .equipment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--color-bg-primary, #fff);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    gap: 1rem;
  }

  .equipment-item.equipped {
    border-left: 4px solid var(--color-accent, #8b2e1f);
  }

  .equipment-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  .checkbox {
    display: flex;
    align-items: center;
  }

  .checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .equipped-indicator {
    color: var(--color-accent, #8b2e1f);
    font-weight: bold;
    font-size: 1.2rem;
  }

  .equipment-name {
    color: var(--color-text-primary, #333);
    font-weight: 500;
  }

  .equipment-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .equipment-quantity {
    color: var(--color-text-secondary, #666);
    font-weight: 500;
    min-width: 40px;
    text-align: right;
  }

  .quantity-input {
    width: 60px;
    padding: 0.25rem 0.5rem;
    text-align: center;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-weight: 500;
  }

  .quantity-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
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
    .equipment-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .btn-add,
    .btn-remove,
    .checkbox {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .add-form {
      flex-direction: column;
      align-items: stretch;
    }

    .form-input,
    .form-input.tiny {
      width: 100%;
      min-width: 100%;
    }

    .checkbox-label {
      padding: 0.5rem 0;
    }

    .equipment-item {
      padding: 0.5rem 0.75rem;
    }

    .equipment-name {
      font-size: 0.9rem;
    }
  }
</style>
