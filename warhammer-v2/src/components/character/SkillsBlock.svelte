<script>
  import EditableListBlock from './EditableListBlock.svelte'
  import './editable-list-styles.css'

  export let skills = []
  export let isEditMode = false

  let newSkillName = ''
  let newSkillCharacteristic = ''
  let newSkillAdvances = 0

  function addSkill(closeAddForm) {
    if (newSkillName.trim()) {
      skills = [...skills, {
        id: `custom-${Date.now()}`,
        name: newSkillName.trim(),
        characteristic: newSkillCharacteristic,
        advances: newSkillAdvances
      }]
      resetAddForm()
      closeAddForm()
    }
  }

  function resetAddForm() {
    newSkillName = ''
    newSkillCharacteristic = ''
    newSkillAdvances = 0
  }
</script>

<EditableListBlock
  title="Skills"
  bind:items={skills}
  {isEditMode}
  emptyMessage="No skills yet"
  addButtonText="Add"
>
  <div slot="add-form" let:closeAddForm class="form-layout-horizontal">
    <input
      type="text"
      bind:value={newSkillName}
      placeholder="Skill name"
      class="form-input"
    />
    <input
      type="text"
      bind:value={newSkillCharacteristic}
      placeholder="Characteristic (e.g., Ag, Int)"
      class="form-input small"
    />
    <input
      type="number"
      bind:value={newSkillAdvances}
      placeholder="Advances"
      class="form-input tiny"
      min="0"
    />
    <button class="btn-save" on:click={() => addSkill(closeAddForm)}>Add</button>
  </div>

  <div slot="item" let:item let:index let:isEditMode let:removeItem class="item-inline">
    <div class="skill-main">
      <div class="item-name">{item.name}</div>
      {#if item.characteristic}
        <div class="skill-char">({item.characteristic})</div>
      {/if}
    </div>
    <div class="skill-right">
      {#if isEditMode}
        <input
          type="number"
          bind:value={item.advances}
          class="advances-input"
          min="0"
          max="60"
        />
        <button class="btn-remove" on:click={() => removeItem(index)}>×</button>
      {:else}
        <div class="skill-advances">{item.advances || 0}</div>
      {/if}
    </div>
  </div>
</EditableListBlock>

<style>
  .skill-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .skill-char {
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .skill-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .skill-advances {
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
    font-size: 1.1rem;
    min-width: 30px;
    text-align: right;
  }

  .advances-input {
    width: 60px;
    padding: 0.25rem 0.5rem;
    text-align: center;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-weight: bold;
    font-size: 1rem;
  }

  .advances-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  @media (max-width: 768px) {
    .item-name {
      font-size: 0.9rem;
    }
  }
</style>
