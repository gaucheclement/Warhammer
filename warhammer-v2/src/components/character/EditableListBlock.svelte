<script>
  export let title = ''
  export let items = []
  export let isEditMode = false
  export let emptyMessage = 'No items yet'
  export let addButtonText = 'Add'

  let showAddForm = false

  function toggleAddForm() {
    showAddForm = !showAddForm
  }

  function closeAddForm() {
    showAddForm = false
  }

  function removeItem(index) {
    items = items.filter((_, i) => i !== index)
  }
</script>

<div class="editable-list-block">
  <div class="block-header">
    <h2 class="block-title">{title}</h2>
    {#if isEditMode}
      <button class="btn-add" on:click={toggleAddForm}>
        {showAddForm ? 'Cancel' : `+ ${addButtonText}`}
      </button>
    {/if}
  </div>

  {#if showAddForm && isEditMode}
    <div class="add-form">
      <slot name="add-form" {closeAddForm} />
    </div>
  {/if}

  {#if items.length === 0}
    <p class="empty-message">{emptyMessage}</p>
  {:else}
    <div class="items-list">
      {#each items as item, index}
        <slot name="item" {item} {index} {isEditMode} {removeItem} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .editable-list-block {
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
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--color-bg-primary, #fff);
    border-radius: 6px;
  }

  .empty-message {
    color: var(--color-text-secondary, #999);
    font-style: italic;
    margin: 0;
    text-align: center;
    padding: 1rem;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.editable-list-block .items-list.with-gap) {
    gap: 0.75rem;
  }

  @media print {
    .editable-list-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .btn-add {
      display: none;
    }
  }
</style>
