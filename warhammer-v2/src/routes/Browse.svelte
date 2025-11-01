<script>
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { mergedData, modifyEntity } from '../stores/data.js'
  import { search, searchAll } from "../lib/search.js"
  import { editModeEnabled, currentlyEditing, startEditing } from '../stores/editMode.js'
  import { getIcon } from '../lib/icons.js'
  import Badge from '../components/Badge.svelte'
  import { getBadgeType } from '../lib/badgeUtils.js'
  import EditMode from '../components/EditMode.svelte'
  import EntityEditor from '../components/EntityEditor.svelte'
  import DescriptionModal from '../components/DescriptionModal.svelte'

  export let params = {}

  let category = params.category || 'all'
  let searchQuery = ''
  let items = []
  let filteredItems = []
  let loading = true
  let showDescriptionModal = false
  let selectedEntity = { type: '', id: '' }

  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'species', name: 'Species', icon: '🧝' },
    { id: 'careers', name: 'Careers', icon: '⚔️' },
    { id: 'skills', name: 'Skills', icon: '🎯' },
    { id: 'talents', name: 'Talents', icon: '⭐' },
    { id: 'spells', name: 'Spells', icon: '✨' },
    { id: 'traits', name: 'Traits', icon: '🦁' },
    { id: 'trappings', name: 'Trappings', icon: '🎒' }
  ]

  $: {
    category = params.category || 'all'
    loadCategory()
  }

  $: {
    if (searchQuery.trim()) {
      performSearchQuery()
    } else {
      filteredItems = items
    }
  }

  onMount(() => {
    loadCategory()
  })

  function loadCategory() {
    loading = true
    const data = $mergedData

    if (category === 'all') {
      // Show summary of all categories
      items = []
    } else if (category === 'species') {
      items = data.species || []
    } else if (category === 'careers') {
      items = data.careers || []
    } else if (category === 'skills') {
      items = data.skills || []
    } else if (category === 'talents') {
      items = data.talents || []
    } else if (category === 'spells') {
      items = data.spells || []
    } else if (category === 'traits') {
      items = data.traits || []
    } else if (category === 'trappings') {
      items = data.trappings || []
    } else {
      items = []
    }

    filteredItems = items
    loading = false
  }

  function performSearchQuery() {
    if (!searchQuery.trim() || category === 'all') {
      filteredItems = items
      return
    }

    const data = $mergedData
    const results = search(category, data[category] || [], searchQuery, {
      limit: 100
    })

    // Extract items from Fuse.js results (Fuse returns {item, score, matches})
    filteredItems = results.map(r => r.item)
  }

  function getCategoryIcon(cat) {
    const found = categories.find(c => c.id === cat)
    return found ? found.icon : '📄'
  }

  function getCategoryName(cat) {
    const found = categories.find(c => c.id === cat)
    return found ? found.name : cat
  }

  /**
   * Handle edit button click
   */
  function handleEdit(item, itemCategory) {
    startEditing(itemCategory, item)
  }

  /**
   * Handle save from entity editor
   */
  function handleSave(event) {
    const { entityType, entityId, modifiedFields } = event.detail
    modifyEntity(entityType, entityId, modifiedFields)
    console.log('Saved modifications:', entityType, entityId)
  }

  /**
   * Handle entity card click to open description modal
   */
  function handleEntityClick(entityType, entity) {
    // Convert plural category names to singular entity types
    const typeMap = {
      'species': 'specie',
      'careers': 'career',
      'skills': 'skill',
      'talents': 'talent',
      'spells': 'spell',
      'traits': 'trait',
      'trappings': 'trapping'
    }

    const singularType = typeMap[entityType] || entityType

    // Species use index as ID (numeric), others use string IDs
    // This is because species are stored with numeric IDs (0, 1, 2...) in IndexedDB
    let entityId
    if (entityType === 'species') {
      entityId = entity.index !== null && entity.index !== undefined ? entity.index : entity.id
    } else {
      entityId = entity.id !== null && entity.id !== undefined ? entity.id : (entity.name || entity.label)
    }

    console.log('Opening entity:', { type: singularType, id: entityId })

    if (entityId === undefined || entityId === null) {
      console.error('No ID found for entity!', entity)
      return
    }

    selectedEntity = {
      type: singularType,
      id: entityId
    }
    showDescriptionModal = true
  }

  /**
   * Handle modal close
   */
  function handleModalClose() {
    showDescriptionModal = false
  }

  /**
   * Handle navigation within modal (when clicking related entities)
   */
  function handleModalNavigate(newType, newId) {
    selectedEntity = { type: newType, id: newId }
    // Modal stays open, content updates
  }
</script>

<div class="browse-page">
  <header class="page-header">
    <div class="header-content">
      <div>
        <h1>Browse {getCategoryName(category)}</h1>
        <p class="description">Explore the Warhammer Fantasy Roleplay database</p>
      </div>
      <div class="header-actions">
        <EditMode />
      </div>
    </div>
  </header>

  <div class="browse-controls">
    <div class="category-tabs">
      {#each categories as cat}
        <a
          href="#/browse/{cat.id}"
          use:link
          class="category-tab"
          class:active={category === cat.id}
        >
          <span class="tab-icon">{cat.icon}</span>
          <span class="tab-name">{cat.name}</span>
        </a>
      {/each}
    </div>

    <div class="search-bar">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search {getCategoryName(category)}..."
        class="search-input"
      />
      {#if searchQuery}
        <button class="clear-btn" on:click={() => searchQuery = ''}>✕</button>
      {/if}
    </div>
  </div>

  <div class="browse-content">
    {#if loading}
      <div class="loading-state">
        <p>Loading...</p>
      </div>
    {:else if category === 'all'}
      <div class="category-overview">
        {#each categories.filter(c => c.id !== 'all') as cat}
          <a href="#/browse/{cat.id}" use:link class="overview-card">
            <div class="card-icon">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p class="count">
              {$mergedData[cat.id]?.length || 0} items
            </p>
          </a>
        {/each}
      </div>
    {:else if filteredItems.length === 0}
      <div class="empty-state">
        <p>No {getCategoryName(category).toLowerCase()} found.</p>
        {#if searchQuery}
          <p class="hint">Try adjusting your search query.</p>
        {/if}
      </div>
    {:else}
      <div class="results-info">
        <p>Showing {filteredItems.length} {getCategoryName(category).toLowerCase()}</p>
      </div>
      <div class="items-grid">
        {#each filteredItems as item}
          <div
            class="item-card"
            on:click={() => handleEntityClick(category, item)}
            on:keydown={(e) => e.key === 'Enter' && handleEntityClick(category, item)}
            role="button"
            tabindex="0"
          >
            <div class="item-header">
              <h3 class="item-name">{item.label || item.title || 'Unnamed'}</h3>
              <div class="item-badges">
                <Badge type={getBadgeType(item)} />
                {#if $editModeEnabled}
                  <button
                    class="edit-button"
                    on:click|stopPropagation={() => handleEdit(item, category)}
                    aria-label="Edit {item.label || 'item'}"
                    title="Edit this {category.slice(0, -1)}"
                  >
                    {@html getIcon('edit', 'icon-svg', 16)}
                  </button>
                {/if}
              </div>
            </div>
            {#if item.description}
              <p class="item-description">{item.description.substring(0, 150)}{item.description.length > 150 ? '...' : ''}</p>
            {/if}
            {#if category === 'species' && item.characteristics}
              <div class="item-meta">Species base characteristics</div>
            {:else if category === 'careers' && item.class}
              <div class="item-meta">Class: {item.class}</div>
            {:else if category === 'spells' && item.cn}
              <div class="item-meta">CN: {item.cn}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Description Modal -->
{#if showDescriptionModal}
  <DescriptionModal
    entityType={selectedEntity.type}
    entityId={selectedEntity.id}
    onClose={handleModalClose}
    onNavigate={handleModalNavigate}
  />
{/if}

<!-- Entity Editor Modal -->
{#if $currentlyEditing}
  <EntityEditor
    editingData={$currentlyEditing}
    on:save={handleSave}
    on:close={() => {}}
  />
{/if}

<style>
  .browse-page {
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

  .header-content > div:first-child {
    text-align: center;
    flex: 1;
  }

  .page-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .description {
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .header-actions {
    flex-shrink: 0;
  }

  .browse-controls {
    margin-bottom: 2rem;
  }

  .category-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .category-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid transparent;
    border-radius: 8px;
    text-decoration: none;
    color: var(--color-text-primary, #333);
    white-space: nowrap;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  .category-tab:hover {
    background: var(--color-bg-tertiary, #e5e5e5);
  }

  .category-tab.active {
    background: var(--color-accent, #8b2e1f);
    color: white;
    border-color: var(--color-accent, #8b2e1f);
  }

  .tab-icon {
    font-size: 1.2rem;
  }

  .search-bar {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
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
    color: var(--color-text-secondary, #666);
    font-size: 1.2rem;
  }

  .clear-btn:hover {
    color: var(--color-text-primary, #333);
  }

  .browse-content {
    min-height: 400px;
  }

  .loading-state,
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .hint {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .results-info {
    margin-bottom: 1rem;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .category-overview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .overview-card {
    display: block;
    text-align: center;
    padding: 2rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .overview-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .overview-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
  }

  .count {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .item-card {
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }

  .item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .item-card:focus {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: 2px;
  }

  .item-card:active {
    transform: translateY(0);
  }

  .item-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .item-name {
    margin: 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
    flex: 1;
  }

  .item-badges {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .edit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0.5rem;
    background-color: var(--color-warning-bg, #fff7e6);
    border: 1px solid var(--color-warning, #ff9800);
    border-radius: var(--radius-md, 6px);
    cursor: pointer;
    color: var(--color-warning, #ff9800);
    transition: all 0.15s;
  }

  .edit-button:hover {
    background-color: var(--color-warning, #ff9800);
    color: white;
    transform: scale(1.1);
  }

  .edit-button:focus-visible {
    outline: 2px solid var(--color-border-focus, #0066cc);
    outline-offset: 2px;
  }

  .edit-button :global(.icon-svg) {
    width: 16px;
    height: 16px;
  }

  .item-description {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.5;
    clear: both;
  }

  .item-meta {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #999);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .browse-page {
      padding: 1rem;
    }

    .header-content {
      flex-direction: column;
      gap: 1rem;
    }

    .header-content > div:first-child {
      text-align: center;
    }

    .page-header h1 {
      font-size: 1.5rem;
    }

    .category-tabs {
      flex-wrap: nowrap;
    }

    .items-grid {
      grid-template-columns: 1fr;
    }

    .overview-card {
      padding: 1.5rem;
    }

    .item-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .item-badges {
      width: 100%;
      justify-content: flex-start;
    }
  }
</style>
