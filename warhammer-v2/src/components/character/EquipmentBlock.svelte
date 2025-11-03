<script>
  import EditableListBlock from './EditableListBlock.svelte'
  import './editable-list-styles.css'

  export let trappings = []
  export let isEditMode = false

  let newTrappingName = ''
  let newTrappingQuantity = 1
  let newTrappingEquipped = false

  function addTrapping(closeAddForm) {
    if (newTrappingName.trim()) {
      trappings = [...trappings, {
        id: `custom-${Date.now()}`,
        name: newTrappingName.trim(),
        quantity: newTrappingQuantity,
        equipped: newTrappingEquipped
      }]
      resetAddForm()
      closeAddForm()
    }
  }

  function resetAddForm() {
    newTrappingName = ''
    newTrappingQuantity = 1
    newTrappingEquipped = false
  }
</script>

<EditableListBlock
  title="Equipment"
  bind:items={trappings}
  {isEditMode}
  emptyMessage="No equipment yet"
  addButtonText="Add"
>
  <div slot="add-form" let:closeAddForm class="form-layout-horizontal">
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
    <button class="btn-save" on:click={() => addTrapping(closeAddForm)}>Add</button>
  </div>

  <div slot="item" let:item let:index let:isEditMode let:removeItem
       class="item-inline equipment-item" class:equipped={item.equipped}>
    <div class="equipment-main">
      {#if isEditMode}
        <label class="checkbox">
          <input
            type="checkbox"
            bind:checked={item.equipped}
          />
        </label>
      {:else if item.equipped}
        <span class="equipped-indicator">✓</span>
      {/if}
      <div class="item-name">{item.name}</div>
    </div>
    <div class="equipment-right">
      {#if isEditMode}
        <input
          type="number"
          bind:value={item.quantity}
          class="quantity-input"
          min="1"
        />
        <button class="btn-remove" on:click={() => removeItem(index)}>×</button>
      {:else}
        <div class="equipment-quantity">×{item.quantity}</div>
      {/if}
    </div>
  </div>
</EditableListBlock>

<style>
  .equipment-item {
    border-left: 1px solid var(--color-border, #ddd);
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

  @media print {
    .checkbox {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .item-name {
      font-size: 0.9rem;
    }
  }
</style>
