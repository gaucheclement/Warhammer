<script>
  /**
   * CharacterFilters.svelte
   *
   * Filter controls for the character list.
   * Allows filtering by species, career, and level.
   */
  import { createEventDispatcher } from 'svelte'
  import { getIcon } from '../../lib/icons.js'

  export let filters = {
    species: 'all',
    career: 'all',
    level: 'all'
  }
  export let uniqueSpecies = []
  export let uniqueCareers = []

  const dispatch = createEventDispatcher()

  // Notify parent of filter changes
  function handleFilterChange() {
    dispatch('change', filters)
  }

  // Check if any filters are active
  $: hasActiveFilters = filters.species !== 'all' || filters.career !== 'all' || filters.level !== 'all'
</script>

<div class="character-filters">
  <div class="filter-group">
    <label for="species-filter" class="filter-label">
      {@html getIcon('filter', 'icon-svg', 16)}
      <span>Species</span>
    </label>
    <select
      id="species-filter"
      bind:value={filters.species}
      on:change={handleFilterChange}
      class="filter-select"
    >
      <option value="all">All Species</option>
      {#each uniqueSpecies as species}
        <option value={species}>{species}</option>
      {/each}
    </select>
  </div>

  <div class="filter-group">
    <label for="career-filter" class="filter-label">
      {@html getIcon('filter', 'icon-svg', 16)}
      <span>Career</span>
    </label>
    <select
      id="career-filter"
      bind:value={filters.career}
      on:change={handleFilterChange}
      class="filter-select"
    >
      <option value="all">All Careers</option>
      {#each uniqueCareers as career}
        <option value={career}>{career}</option>
      {/each}
    </select>
  </div>

  <div class="filter-group">
    <label for="level-filter" class="filter-label">
      {@html getIcon('filter', 'icon-svg', 16)}
      <span>Level</span>
    </label>
    <select
      id="level-filter"
      bind:value={filters.level}
      on:change={handleFilterChange}
      class="filter-select"
    >
      <option value="all">All Levels</option>
      <option value="1">Level 1</option>
      <option value="2">Level 2</option>
      <option value="3">Level 3</option>
      <option value="4">Level 4</option>
    </select>
  </div>

  {#if hasActiveFilters}
    <div class="filter-indicator">
      <span class="indicator-badge">{
        [filters.species !== 'all', filters.career !== 'all', filters.level !== 'all']
          .filter(Boolean).length
      }</span>
    </div>
  {/if}
</div>

<style>
  .character-filters {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    position: relative;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .filter-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .filter-label :global(.icon-svg) {
    flex-shrink: 0;
  }

  .filter-select {
    min-width: 150px;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-select:hover {
    border-color: var(--color-border-strong);
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(139, 46, 31, 0.1);
  }

  .filter-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .indicator-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: var(--color-accent);
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .character-filters {
      width: 100%;
    }

    .filter-group {
      flex: 1;
      min-width: 0;
    }

    .filter-select {
      min-width: 0;
      width: 100%;
    }

    .filter-label span {
      display: none;
    }
  }
</style>
