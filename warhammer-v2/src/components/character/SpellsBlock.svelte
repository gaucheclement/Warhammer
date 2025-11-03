<script>
  import EditableListBlock from './EditableListBlock.svelte'
  import './editable-list-styles.css'

  export let spells = []
  export let isEditMode = false

  let newSpellName = ''
  let newSpellCN = ''
  let newSpellRange = ''
  let newSpellLore = ''

  function addSpell(closeAddForm) {
    if (newSpellName.trim()) {
      spells = [...spells, {
        id: `custom-${Date.now()}`,
        name: newSpellName.trim(),
        cn: newSpellCN.trim(),
        range: newSpellRange.trim(),
        lore: newSpellLore.trim()
      }]
      resetAddForm()
      closeAddForm()
    }
  }

  function resetAddForm() {
    newSpellName = ''
    newSpellCN = ''
    newSpellRange = ''
    newSpellLore = ''
  }
</script>

<EditableListBlock
  title="Spells"
  bind:items={spells}
  {isEditMode}
  emptyMessage="No spells yet"
  addButtonText="Add"
>
  <div slot="add-form" let:closeAddForm class="form-layout-horizontal">
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
    <button class="btn-save" on:click={() => addSpell(closeAddForm)}>Add</button>
  </div>

  <div slot="item" let:item let:index let:isEditMode let:removeItem class="item-card">
    <div class="item-header">
      <div class="item-name">{item.name}</div>
      {#if isEditMode}
        <button class="btn-remove" on:click={() => removeItem(index)}>×</button>
      {/if}
    </div>
    <div class="item-details">
      {#if item.cn}
        <span class="item-detail"><strong>CN:</strong> {item.cn}</span>
      {/if}
      {#if item.range}
        <span class="item-detail"><strong>Range:</strong> {item.range}</span>
      {/if}
      {#if item.lore}
        <span class="item-detail"><strong>Lore:</strong> {item.lore}</span>
      {/if}
    </div>
  </div>
</EditableListBlock>

<style>
  /* Component-specific styles */
  :global(.spells-block .items-list) {
    gap: 0.75rem;
  }
</style>
