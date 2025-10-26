<script>
  /**
   * CharacterSort.svelte
   *
   * Sort controls for the character list.
   * Allows sorting by name, created date, updated date, and level.
   */
  import { createEventDispatcher } from 'svelte'
  import { getIcon } from '../../lib/icons.js'

  export let sortBy = 'updated'
  export let sortOrder = 'desc'

  const dispatch = createEventDispatcher()

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'created', label: 'Created' },
    { value: 'updated', label: 'Updated' },
    { value: 'level', label: 'Level' }
  ]

  // Notify parent of sort changes
  function handleSortChange() {
    dispatch('change', { sortBy, sortOrder })
  }

  // Toggle sort order
  function toggleSortOrder() {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    handleSortChange()
  }
</script>

<div class="character-sort">
  <div class="sort-group">
    <label for="sort-by" class="sort-label">
      {@html getIcon('sort', 'icon-svg', 16)}
      <span>Sort by</span>
    </label>
    <select
      id="sort-by"
      bind:value={sortBy}
      on:change={handleSortChange}
      class="sort-select"
    >
      {#each sortOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <button
    class="sort-order-btn"
    on:click={toggleSortOrder}
    title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
    aria-label={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
  >
    {#if sortOrder === 'asc'}
      {@html getIcon('chevronUp', 'icon-svg', 20)}
    {:else}
      {@html getIcon('chevronDown', 'icon-svg', 20)}
    {/if}
  </button>
</div>

<style>
  .character-sort {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .sort-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .sort-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .sort-label :global(.icon-svg) {
    flex-shrink: 0;
  }

  .sort-select {
    min-width: 120px;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .sort-select:hover {
    border-color: var(--color-border-strong);
  }

  .sort-select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(139, 46, 31, 0.1);
  }

  .sort-order-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--color-text-secondary);
  }

  .sort-order-btn:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
    color: var(--color-text-primary);
  }

  .sort-order-btn:active {
    transform: scale(0.95);
  }

  .sort-order-btn :global(.icon-svg) {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .sort-label span {
      display: none;
    }

    .sort-select {
      min-width: 100px;
    }
  }
</style>
