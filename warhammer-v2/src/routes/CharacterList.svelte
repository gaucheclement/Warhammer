<script>
  /**
   * CharacterList.svelte
   *
   * Main character list page with search, filter, sort, and management actions.
   * Supports both grid (cards) and table view modes.
   */
  import { onMount } from 'svelte'
  import { link } from 'svelte-spa-router'
  import { characters, mergedData } from '../stores/data.js'
  import { search } from '../lib/search.js'
  import { duplicateCharacter, deleteCharacter } from '../lib/dataOperations.js'
  import { toasts } from '../lib/toastStore.js'
  import { getIcon } from '../lib/icons.js'
  import { exportAndDownloadCharacter, exportAndDownloadAllCharacters } from '../lib/characterExport.js'
  import { generateRandomCharacter } from '../lib/characterGenerator.js'
  import { createCharacter } from '../lib/dataOperations.js'
  import ImportCharacter from '../components/character/ImportCharacter.svelte'
  import CharacterCard from '../components/character/CharacterCard.svelte'
  import CharacterTableRow from '../components/character/CharacterTableRow.svelte'
  import CharacterFilters from '../components/character/CharacterFilters.svelte'
  import CharacterSort from '../components/character/CharacterSort.svelte'

  // View mode: 'grid' or 'table'
  let viewMode = 'grid'

  // Search query
  let searchQuery = ''

  // Filter states
  let filters = {
    species: 'all',
    career: 'all',
    level: 'all'
  }

  // Sort state
  let sortBy = 'updated'
  let sortOrder = 'desc'

  // Pagination
  let currentPage = 1
  let itemsPerPage = 50

  // Filtered and sorted characters
  let filteredCharacters = []
  let paginatedCharacters = []
  let totalPages = 1

  // Character to delete (for confirmation)
  let characterToDelete = null
  let showDeleteConfirm = false
  let showImportDialog = false

  // Load view mode from localStorage
  onMount(() => {
    const savedViewMode = localStorage.getItem('characterListViewMode')
    if (savedViewMode) {
      viewMode = savedViewMode
    }
  })

  // Save view mode to localStorage when it changes
  $: {
    if (typeof window !== 'undefined') {
      localStorage.setItem('characterListViewMode', viewMode)
    }
  }

  // Apply filters, search, and sort
  $: {
    let result = [...$characters]

    // Apply search
    if (searchQuery.trim().length >= 2) {
      const searchResults = search('characters', $characters, searchQuery, {
        limit: 100
      })
      result = searchResults.map(r => r.item)
    }

    // Apply species filter
    if (filters.species !== 'all') {
      result = result.filter(char => {
        if (!char.species) return false
        const speciesName = typeof char.species === 'object' ? char.species.name : char.species
        return speciesName === filters.species
      })
    }

    // Apply career filter
    if (filters.career !== 'all') {
      result = result.filter(char => {
        if (!char.career) return false
        const careerName = typeof char.career === 'object' ? char.career.name : char.career
        return careerName === filters.career
      })
    }

    // Apply level filter
    if (filters.level !== 'all') {
      result = result.filter(char => {
        const level = char.career?.level || 1
        return level === parseInt(filters.level)
      })
    }

    // Apply sort
    result.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = (a.name || '').toLowerCase()
          bValue = (b.name || '').toLowerCase()
          break
        case 'created':
          aValue = new Date(a.created || 0)
          bValue = new Date(b.created || 0)
          break
        case 'updated':
          aValue = new Date(a.updated || 0)
          bValue = new Date(b.updated || 0)
          break
        case 'level':
          aValue = a.career?.level || 1
          bValue = b.career?.level || 1
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    filteredCharacters = result

    // Calculate pagination
    totalPages = Math.ceil(filteredCharacters.length / itemsPerPage)
    if (currentPage > totalPages) {
      currentPage = Math.max(1, totalPages)
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    paginatedCharacters = filteredCharacters.slice(startIndex, endIndex)
  }

  // Get unique species from characters for filter dropdown
  $: uniqueSpecies = [...new Set($characters
    .map(char => {
      if (!char.species) return null
      return typeof char.species === 'object' ? char.species.name : char.species
    })
    .filter(Boolean)
  )].sort()

  // Get unique careers from characters for filter dropdown
  $: uniqueCareers = [...new Set($characters
    .map(char => {
      if (!char.career) return null
      return typeof char.career === 'object' ? char.career.name : char.career
    })
    .filter(Boolean)
  )].sort()

  /**
   * Handle view mode change
   */
  function toggleViewMode() {
    viewMode = viewMode === 'grid' ? 'table' : 'grid'
  }

  /**
   * Handle filter change
   */
  function handleFilterChange(event) {
    filters = event.detail
    currentPage = 1 // Reset to first page
  }

  /**
   * Handle sort change
   */
  function handleSortChange(event) {
    sortBy = event.detail.sortBy
    sortOrder = event.detail.sortOrder
  }

  /**
   * Handle character duplicate
   */
  async function handleDuplicate(character) {
    try {
      const result = await duplicateCharacter(character.id)
      if (result.success) {
        toasts.success(`Duplicated "${character.name}"`)
      } else {
        toasts.error(`Failed to duplicate character: ${result.error}`)
      }
    } catch (error) {
      toasts.error(`Error duplicating character: ${error.message}`)
    }
  }

  /**
   * Show delete confirmation dialog
   */
  function confirmDelete(character) {
    characterToDelete = character
    showDeleteConfirm = true
  }

  /**
   * Handle character delete
   */
  async function handleDelete() {
    if (!characterToDelete) return

    try {
      const result = await deleteCharacter(characterToDelete.id)
      if (result.success) {
        toasts.success(`Deleted "${characterToDelete.name}"`)
        characterToDelete = null
        showDeleteConfirm = false
      } else {
        toasts.error(`Failed to delete character: ${result.error}`)
      }
    } catch (error) {
      toasts.error(`Error deleting character: ${error.message}`)
    }
  }

  /**
   * Handle character export
   */
  function handleExport(character) {
    try {
      const json = JSON.stringify(character, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `character-${character.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toasts.success(`Exported "${character.name}"`)
    } catch (error) {
      toasts.error(`Error exporting character: ${error.message}`)
    }
  }

  /**
   * Clear search
   */
  function clearSearch() {
    searchQuery = ''
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    filters = {
      species: 'all',
      career: 'all',
      level: 'all'
    }
    searchQuery = ''
    currentPage = 1
  }

  /**
   * Change page
   */
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
</script>

<div class="character-list-page">
  <header class="page-header">
    <div class="header-content">
      <div>
        <h1>Characters</h1>
        <p class="description">Manage your Warhammer characters</p>
      </div>
      <div class="header-actions">
        <button
          type="button"
          on:click={() => showImportDialog = true}
          class="btn btn-secondary"
        >
          {@html getIcon('upload', 'icon-svg', 20)}
          <span>Import</span>
        </button>

        <button
          type="button"
          on:click={handleQuickRandom}
          class="btn btn-secondary"
        >
          {@html getIcon('dice', 'icon-svg', 20)}
          <span>Quick Random</span>
        </button>

        {#if $characters.length > 0}
          <button
            type="button"
            on:click={handleExportAll}
            class="btn btn-secondary"
          >
            {@html getIcon('download', 'icon-svg', 20)}
            <span>Export All</span>
          </button>
        {/if}

        <a href="#/creator" use:link class="btn btn-primary">
          {@html getIcon('plus', 'icon-svg', 20)}
          <span>Create Character</span>
        </a>
      </div>
    </div>
  </header>

  <div class="controls">
    <!-- Search Bar -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        {@html getIcon('search', 'search-icon', 20)}
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search characters by name..."
          class="search-input"
        />
        {#if searchQuery}
          <button class="clear-btn" on:click={clearSearch} aria-label="Clear search">
            {@html getIcon('close', 'icon-svg', 16)}
          </button>
        {/if}
      </div>
    </div>

    <!-- Filters and Sort -->
    <div class="controls-row">
      <CharacterFilters
        bind:filters
        {uniqueSpecies}
        {uniqueCareers}
        on:change={handleFilterChange}
      />

      <div class="controls-right">
        <CharacterSort
          bind:sortBy
          bind:sortOrder
          on:change={handleSortChange}
        />

        <button
          class="view-toggle"
          on:click={toggleViewMode}
          aria-label="Toggle view mode"
          title={viewMode === 'grid' ? 'Switch to table view' : 'Switch to grid view'}
        >
          {@html getIcon(viewMode === 'grid' ? 'filter' : 'sort', 'icon-svg', 20)}
        </button>
      </div>
    </div>

    <!-- Active Filters Info -->
    {#if searchQuery || filters.species !== 'all' || filters.career !== 'all' || filters.level !== 'all'}
      <div class="active-filters">
        <span class="filter-label">Active filters:</span>
        {#if searchQuery}
          <span class="filter-tag">Search: {searchQuery}</span>
        {/if}
        {#if filters.species !== 'all'}
          <span class="filter-tag">Species: {filters.species}</span>
        {/if}
        {#if filters.career !== 'all'}
          <span class="filter-tag">Career: {filters.career}</span>
        {/if}
        {#if filters.level !== 'all'}
          <span class="filter-tag">Level: {filters.level}</span>
        {/if}
        <button class="clear-filters-btn" on:click={clearFilters}>
          Clear all
        </button>
      </div>
    {/if}
  </div>

  <!-- Results Info -->
  <div class="results-info">
    <p>
      Showing {paginatedCharacters.length} of {filteredCharacters.length} characters
      {#if filteredCharacters.length !== $characters.length}
        (filtered from {$characters.length} total)
      {/if}
    </p>
  </div>

  <!-- Character List -->
  {#if $characters.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        {@html getIcon('users', 'icon-svg', 64)}
      </div>
      <h2>No characters yet</h2>
      <p>Create your first character to get started with your Warhammer adventures.</p>
      <a href="#/creator" use:link class="btn btn-primary btn-large">
        {@html getIcon('plus', 'icon-svg', 20)}
        <span>Create Character</span>
      </a>
    </div>
  {:else if paginatedCharacters.length === 0}
    <div class="empty-state">
      <div class="empty-icon">
        {@html getIcon('search', 'icon-svg', 64)}
      </div>
      <h2>No characters found</h2>
      <p>Try adjusting your search or filters.</p>
      <button class="btn btn-secondary" on:click={clearFilters}>
        Clear Filters
      </button>
    </div>
  {:else if viewMode === 'grid'}
    <div class="characters-grid">
      {#each paginatedCharacters as character (character.id)}
        <CharacterCard
          {character}
          on:duplicate={() => handleDuplicate(character)}
          on:delete={() => confirmDelete(character)}
          on:export={() => handleExport(character)}
        />
      {/each}
    </div>
  {:else}
    <div class="characters-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Species</th>
            <th>Career</th>
            <th>Level</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedCharacters as character (character.id)}
            <CharacterTableRow
              {character}
              on:duplicate={() => handleDuplicate(character)}
              on:delete={() => confirmDelete(character)}
              on:export={() => handleExport(character)}
            />
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="pagination">
      <button
        class="pagination-btn"
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        {@html getIcon('chevronLeft', 'icon-svg', 20)}
      </button>

      <div class="pagination-info">
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <button
        class="pagination-btn"
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        {@html getIcon('chevronRight', 'icon-svg', 20)}
      </button>
    </div>
  {/if}
</div>

<!-- Import Character Dialog -->
<ImportCharacter
  bind:isOpen={showImportDialog}
  existingCharacters={$characters}
  on:import={handleImportSuccess}
  on:error={handleImportError}
  on:close={() => showImportDialog = false}
/>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && characterToDelete}
  <div
    class="modal-backdrop"
    role="presentation"
    on:click={() => showDeleteConfirm = false}
    on:keydown={(e) => e.key === 'Escape' && (showDeleteConfirm = false)}
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      on:click|stopPropagation
      on:keydown={(e) => e.stopPropagation()}
    >
      <div class="modal-header">
        <h2 id="delete-modal-title">Delete Character</h2>
        <button class="modal-close" on:click={() => showDeleteConfirm = false} aria-label="Close">
          {@html getIcon('close', 'icon-svg', 20)}
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete <strong>{characterToDelete.name}</strong>?</p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" on:click={() => showDeleteConfirm = false}>
          Cancel
        </button>
        <button class="btn btn-danger" on:click={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .character-list-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .page-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary);
    font-family: var(--font-heading, serif);
  }

  .description {
    color: var(--color-text-secondary);
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    border: none;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-accent-dark, #6d2418);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary);
  }

  .btn-danger {
    background: var(--color-error, #dc3545);
    color: white;
  }

  .btn-danger:hover {
    background: var(--color-error-dark, #c82333);
  }

  .btn-large {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
  }

  .controls {
    margin-bottom: 2rem;
  }

  .search-bar {
    margin-bottom: 1rem;
  }

  .search-input-wrapper {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }

  .search-input-wrapper :global(.search-icon) {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 3rem;
    font-size: 1rem;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  .clear-btn {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-btn:hover {
    color: var(--color-text-primary);
  }

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .controls-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .view-toggle {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .view-toggle:hover {
    background: var(--color-bg-tertiary);
  }

  .active-filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-radius: 8px;
    margin-top: 1rem;
  }

  .filter-label {
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .filter-tag {
    padding: 0.25rem 0.75rem;
    background: var(--color-accent);
    color: white;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .clear-filters-btn {
    margin-left: auto;
    padding: 0.25rem 0.75rem;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }

  .clear-filters-btn:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  .results-info {
    margin-bottom: 1rem;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
  }

  .empty-icon {
    margin-bottom: 1.5rem;
    color: var(--color-text-secondary);
    opacity: 0.5;
  }

  .empty-state h2 {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary);
  }

  .empty-state p {
    margin: 0 0 2rem 0;
    color: var(--color-text-secondary);
  }

  .characters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .characters-table {
    overflow-x: auto;
    background: var(--color-bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: var(--color-bg-tertiary);
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--color-text-primary);
    border-bottom: 2px solid var(--color-border);
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .pagination-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-btn:not(:disabled):hover {
    background: var(--color-bg-tertiary);
  }

  .pagination-info {
    padding: 0 1rem;
    color: var(--color-text-secondary);
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: var(--color-bg-primary);
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .modal-header h2 {
    margin: 0;
    color: var(--color-text-primary);
  }

  .modal-close {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    color: var(--color-text-primary);
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-body p {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary);
  }

  .warning-text {
    color: var(--color-error);
    font-weight: 500;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 768px) {
    .character-list-page {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 1.5rem;
    }

    .header-content {
      flex-direction: column;
      align-items: stretch;
    }

    .controls-row {
      flex-direction: column;
      align-items: stretch;
    }

    .controls-right {
      width: 100%;
      justify-content: space-between;
    }

    .characters-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
