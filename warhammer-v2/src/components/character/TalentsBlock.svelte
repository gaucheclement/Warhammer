<script>
  export let talents = []
  export let isEditMode = false

  let showAddTalent = false
  let newTalentName = ''
  let newTalentDescription = ''
  let newTalentTimes = 1

  function addTalent() {
    if (newTalentName.trim()) {
      talents = [...talents, {
        id: `custom-${Date.now()}`,
        name: newTalentName.trim(),
        description: newTalentDescription.trim(),
        times: newTalentTimes
      }]
      resetAddForm()
    }
  }

  function removeTalent(index) {
    talents = talents.filter((_, i) => i !== index)
  }

  function resetAddForm() {
    newTalentName = ''
    newTalentDescription = ''
    newTalentTimes = 1
    showAddTalent = false
  }
</script>

<div class="talents-block">
  <div class="block-header">
    <h2 class="block-title">Talents</h2>
    {#if isEditMode}
      <button class="btn-add" on:click={() => showAddTalent = !showAddTalent}>
        {showAddTalent ? 'Cancel' : '+ Add'}
      </button>
    {/if}
  </div>

  {#if showAddTalent && isEditMode}
    <div class="add-form">
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
      <button class="btn-save" on:click={addTalent}>Add</button>
    </div>
  {/if}

  {#if talents.length === 0}
    <p class="empty-message">No talents yet</p>
  {:else}
    <div class="talents-list">
      {#each talents as talent, index}
        <div class="talent-item">
          <div class="talent-header">
            <div class="talent-name-row">
              <div class="talent-name">{talent.name}</div>
              {#if talent.times > 1}
                <div class="talent-times">×{talent.times}</div>
              {/if}
            </div>
            {#if isEditMode}
              <button class="btn-remove" on:click={() => removeTalent(index)}>×</button>
            {/if}
          </div>
          {#if talent.description}
            <div class="talent-description">{talent.description}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .talents-block {
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
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--color-bg-primary, #fff);
    border-radius: 6px;
  }

  .form-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.95rem;
  }

  .form-input.tiny {
    width: 80px;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .form-textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
  }

  .btn-save {
    align-self: flex-start;
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

  .talents-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .talent-item {
    padding: 1rem;
    background: var(--color-bg-primary, #fff);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
  }

  .talent-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .talent-name-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .talent-name {
    color: var(--color-text-primary, #333);
    font-weight: 600;
    font-size: 1.05rem;
  }

  .talent-times {
    background: var(--color-accent, #8b2e1f);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .talent-description {
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-top: 0.5rem;
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
    .talents-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .btn-add,
    .btn-remove {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .talent-item {
      padding: 0.75rem;
    }

    .talent-name {
      font-size: 1rem;
    }
  }
</style>
