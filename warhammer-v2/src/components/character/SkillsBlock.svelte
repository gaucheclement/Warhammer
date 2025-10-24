<script>
  export let skills = []
  export let isEditMode = false

  let showAddSkill = false
  let newSkillName = ''
  let newSkillCharacteristic = ''
  let newSkillAdvances = 0

  function addSkill() {
    if (newSkillName.trim()) {
      skills = [...skills, {
        id: `custom-${Date.now()}`,
        name: newSkillName.trim(),
        characteristic: newSkillCharacteristic,
        advances: newSkillAdvances
      }]
      resetAddForm()
    }
  }

  function removeSkill(index) {
    skills = skills.filter((_, i) => i !== index)
  }

  function resetAddForm() {
    newSkillName = ''
    newSkillCharacteristic = ''
    newSkillAdvances = 0
    showAddSkill = false
  }
</script>

<div class="skills-block">
  <div class="block-header">
    <h2 class="block-title">Skills</h2>
    {#if isEditMode}
      <button class="btn-add" on:click={() => showAddSkill = !showAddSkill}>
        {showAddSkill ? 'Cancel' : '+ Add'}
      </button>
    {/if}
  </div>

  {#if showAddSkill && isEditMode}
    <div class="add-form">
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
      <button class="btn-save" on:click={addSkill}>Add</button>
    </div>
  {/if}

  {#if skills.length === 0}
    <p class="empty-message">No skills yet</p>
  {:else}
    <div class="skills-list">
      {#each skills as skill, index}
        <div class="skill-item">
          <div class="skill-main">
            <div class="skill-name">{skill.name}</div>
            {#if skill.characteristic}
              <div class="skill-char">({skill.characteristic})</div>
            {/if}
          </div>
          <div class="skill-right">
            {#if isEditMode}
              <input
                type="number"
                bind:value={skill.advances}
                class="advances-input"
                min="0"
                max="60"
              />
              <button class="btn-remove" on:click={() => removeSkill(index)}>×</button>
            {:else}
              <div class="skill-advances">{skill.advances || 0}</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .skills-block {
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
    min-width: 120px;
  }

  .form-input.tiny {
    flex: 0 1 auto;
    width: 80px;
    min-width: 80px;
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

  .skills-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .skill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--color-bg-primary, #fff);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    gap: 1rem;
  }

  .skill-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .skill-name {
    color: var(--color-text-primary, #333);
    font-weight: 500;
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
    .skills-block {
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

    .skill-item {
      padding: 0.5rem 0.75rem;
    }

    .skill-name {
      font-size: 0.9rem;
    }
  }
</style>
