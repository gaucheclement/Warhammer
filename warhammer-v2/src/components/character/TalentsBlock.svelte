<script>
  import EditableListBlock from './EditableListBlock.svelte'
  import './editable-list-styles.css'

  export let talents = []
  export let isEditMode = false

  let newTalentName = ''
  let newTalentDescription = ''
  let newTalentTimes = 1

  function addTalent(closeAddForm) {
    if (newTalentName.trim()) {
      talents = [...talents, {
        id: `custom-${Date.now()}`,
        name: newTalentName.trim(),
        description: newTalentDescription.trim(),
        times: newTalentTimes
      }]
      resetAddForm()
      closeAddForm()
    }
  }

  function resetAddForm() {
    newTalentName = ''
    newTalentDescription = ''
    newTalentTimes = 1
  }
</script>

<EditableListBlock
  title="Talents"
  bind:items={talents}
  {isEditMode}
  emptyMessage="No talents yet"
  addButtonText="Add"
>
  <div slot="add-form" let:closeAddForm class="form-layout-vertical">
    <input
      type="text"
      bind:value={newTalentName}
      placeholder="Talent name"
      class="form-input"
    />
    <input
      type="number"
      bind:value={newTalentTimes}
      placeholder="Times"
      class="form-input tiny"
      min="1"
    />
    <textarea
      bind:value={newTalentDescription}
      placeholder="Description (optional)"
      class="form-textarea"
      rows="2"
    ></textarea>
    <button class="btn-save" on:click={() => addTalent(closeAddForm)}>Add</button>
  </div>

  <div slot="item" let:item let:index let:isEditMode let:removeItem class="item-card">
    <div class="item-header">
      <div class="item-name-row">
        <div class="item-name">{item.name}</div>
        {#if item.times > 1}
          <div class="item-badge">×{item.times}</div>
        {/if}
      </div>
      {#if isEditMode}
        <button class="btn-remove" on:click={() => removeItem(index)}>×</button>
      {/if}
    </div>
    {#if item.description}
      <div class="item-description">{item.description}</div>
    {/if}
  </div>
</EditableListBlock>

<style>
  /* Component-specific styles only */
  :global(.talents-block .items-list) {
    gap: 0.75rem;
  }
</style>
