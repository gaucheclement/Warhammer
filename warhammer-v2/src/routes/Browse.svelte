<script>
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { mergedData } from '../stores/data.js'
  import { searchIndex, search as performSearch } from '../lib/search.js'

  export let params = {}

  let category = params.category || 'all'
  let searchQuery = ''
  let items = []
  let filteredItems = []
  let loading = true

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

    const results = performSearch(searchQuery, {
      category: category === 'all' ? null : category,
      limit: 100
    })

    // Map search results back to full items
    const resultIds = new Set(results.map(r => r.id))
    filteredItems = items.filter(item => resultIds.has(item.id))
  }

  function getCategoryIcon(cat) {
    const found = categories.find(c => c.id === cat)
    return found ? found.icon : '📄'
  }

  function getCategoryName(cat) {
    const found = categories.find(c => c.id === cat)
    return found ? found.name : cat
  }
</script>

<div class="browse-page">
  <header class="page-header">
    <h1>Browse {getCategoryName(category)}</h1>
    <p class="description">Explore the Warhammer Fantasy Roleplay database</p>
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
          <div class="item-card">
            <h3 class="item-name">{item.name || item.title || 'Unnamed'}</h3>
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

<style>
  .browse-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
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

  .item-name {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .item-description {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.5;
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
  }
</style>
