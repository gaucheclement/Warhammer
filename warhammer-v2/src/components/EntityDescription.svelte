<script>
  /**
   * EntityDescription Component
   *
   * A unified viewer component that renders entity descriptions for any entity type
   * (talents, skills, spells, careers, etc.) in any display mode (modal, panel, inline).
   *
   * Features:
   * - Fetches descriptions from the description generator registry
   * - Handles cross-reference navigation with clickable entity links
   * - Manages tab state for multi-section entities
   * - Provides loading and error states
   * - Responsive design for all device sizes
   *
   * @prop {string} entityType - Entity type (talent, skill, spell, career, etc.)
   * @prop {string} entityId - Entity ID to display
   * @prop {string} displayMode - Display mode: 'modal' | 'panel' | 'inline' (default: 'modal')
   *
   * @event navigate - Fired when user clicks a cross-reference link
   *   detail: { entityType: string, entityId: string }
   * @event close - Fired when user closes the description viewer
   */

  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { generateDescription } from '../lib/db-descriptions.js';
  import { getEntityLabel, getEntityUsage } from '../lib/db-relations.js';
  import { db } from '../lib/db.js';
  import { globalDescriptionCache } from '../lib/description-cache.js';
  import DataTable from './DataTable.svelte';
  import NavigationBar from './NavigationBar.svelte';
  import DescriptionRenderer from './descriptions/DescriptionRenderer.svelte';
  import {
    navigationState,
    currentEntry,
    navigateToEntity,
    navigateBack,
    navigateForward,
    clearHistory
  } from '../stores/navigation.js';

  // Props
  export let entityType = '';
  export let entityId = '';
  export let displayMode = 'modal';

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Internal state for navigation
  let currentEntityType = entityType;
  let currentEntityId = entityId;

  // Internal state
  let loading = false;
  let error = null;
  let currentTab = 'description'; // Either 'description' or 'related'
  let descriptionData = null;
  let entityLabel = '';
  let relatedEntities = null;
  let loadingRelated = false;

  // Use global LRU cache with TTL for descriptions
  // Related entities use separate cache (less critical, simpler Map)
  const relatedCache = new Map();

  // Performance tracking
  let lastRenderTime = 0;

  // Validation: ensure required props are provided
  $: isValid = currentEntityType && (currentEntityId !== null && currentEntityId !== undefined);
  $: if (!isValid && !loading) {
    error = 'Entity type and ID are required';
  }

  // Initialize navigation when props change
  $: if (entityType && (entityId !== null && entityId !== undefined)) {
    currentEntityType = entityType;
    currentEntityId = entityId;
    // Add to navigation history on initial load
    navigateToEntity(entityType, entityId);
  }

  // Listen to navigation state changes to update current entity
  // This triggers when back/forward/history jump happens
  $: if ($currentEntry && $currentEntry.type && ($currentEntry.id !== null && $currentEntry.id !== undefined)) {
    // Force update even if values look the same (might be different after normalization)
    const newType = $currentEntry.type;
    const newId = $currentEntry.id;

    // Only update if actually different
    if (newType !== currentEntityType || newId !== currentEntityId) {
      console.log(`Navigation state changed: ${newType}:${newId}`);
      currentEntityType = newType;
      currentEntityId = newId;
    }
  }

  // STREAM B: Load description from db-descriptions.js generators
  /**
   * Load entity description from the database
   * Implements caching to avoid redundant fetches
   */
  async function loadDescription() {
    if (!currentEntityType || currentEntityId === null || currentEntityId === undefined) {
      error = 'Entity type and ID are required';
      return;
    }

    // Start performance measurement
    const perfStart = performance.now();

    // Check LRU cache first
    const cached = globalDescriptionCache.get(currentEntityType, currentEntityId);
    if (cached) {
      descriptionData = cached.data;
      entityLabel = cached.label;
      error = null;
      lastRenderTime = performance.now() - perfStart;
      console.log(`[Cache HIT] ${currentEntityType}:${currentEntityId} - ${lastRenderTime.toFixed(2)}ms`);
      logCacheStats();
      return;
    }

    // Set loading state
    loading = true;
    error = null;
    descriptionData = null;
    entityLabel = '';

    try {
      // Fetch entity to get label
      const tableName = currentEntityType === 'specie' || currentEntityType === 'species' ? 'species' : currentEntityType + 's';
      let entity = null;

      if (db[tableName]) {
        // Direct ID lookup
        entity = await db[tableName].get(currentEntityId);
      }


      if (!entity) {
        throw new Error(`Entity not found: ${currentEntityType} with ID "${currentEntityId}"`);
      }

      // Get entity label
      entityLabel = getEntityLabel(entity);

      // Generate description using the description generators
      const result = await generateDescription(currentEntityType, currentEntityId);

      if (!result) {
        throw new Error(`Failed to generate description for ${currentEntityType}: ${currentEntityId}`);
      }

      // Store structured data directly
      descriptionData = result;

      // Cache the result using LRU cache
      globalDescriptionCache.set(currentEntityType, currentEntityId, {
        data: descriptionData,
        label: entityLabel
      });

      // Clear error on success
      error = null;

      // Log performance
      lastRenderTime = performance.now() - perfStart;
      console.log(`[Cache MISS] ${currentEntityType}:${currentEntityId} - ${lastRenderTime.toFixed(2)}ms`);
      logCacheStats();
    } catch (err) {
      console.error('Error loading description:', err);
      error = err.message || 'Failed to load description';
      descriptionData = null;
      entityLabel = '';
    } finally {
      loading = false;
    }
  }

  // STREAM B: Reactive statement to reload when current entity changes
  // Accept entityId of 0 as valid
  $: if (currentEntityType && (currentEntityId !== null && currentEntityId !== undefined)) {
    loadDescription();
    loadRelatedEntities();
  }

  /**
   * Load related entities using the "Where Used" system
   * Shows all entities that reference this entity
   */
  async function loadRelatedEntities() {
    if (!currentEntityType || (currentEntityId === null || currentEntityId === undefined)) return;

    // Create cache key
    const cacheKey = `${currentEntityType}:${currentEntityId}`;

    // Check cache first
    if (relatedCache.has(cacheKey)) {
      relatedEntities = relatedCache.get(cacheKey);
      return;
    }

    // Reset related entities when loading new ones
    relatedEntities = null;
    loadingRelated = true;

    // Convert singular entity type to plural for getEntityUsage
    // getEntityUsage expects plural form (skills, talents, etc.)
    const pluralType = currentEntityType === 'specie' || currentEntityType === 'species' ? 'species' : currentEntityType + 's';

    try {
      // Get entity usage (where is this entity used?)
      // NOTE: This may return empty if data structure doesn't match ENTITY_RELATIONSHIP_CONFIG
      // See issue #41 for Related entities system improvements
      const usage = await getEntityUsage(pluralType, currentEntityId);

      // Transform usage data into a format suitable for display
      const related = {};

      for (const [tableName, entities] of Object.entries(usage)) {
        if (entities && entities.length > 0) {
          // Add labels to entities
          const entitiesWithLabels = entities.map(entity => ({
            ...entity,
            label: getEntityLabel(entity),
            entityType: tableName.replace(/s$/, '') // Remove trailing 's' for entity type
          }));

          related[tableName] = entitiesWithLabels;
        }
      }

      relatedEntities = related;
      relatedCache.set(cacheKey, related);
    } catch (err) {
      console.error('Error loading related entities:', err);
      relatedEntities = {};
    } finally {
      loadingRelated = false;
    }
  }

  /**
   * Handle navigation from DescriptionRenderer
   * @param {CustomEvent} event - Navigation event with {type, id}
   */
  function handleDescriptionNavigate(event) {
    const { type, id } = event.detail;
    navigateToEntity(type, id);
  }

  /**
   * Handle cross-reference link clicks for legacy HTML content
   * (Still needed for {@html} content that uses .showHelp spans)
   * @param {MouseEvent} e - Click event
   */
  function handleCrossReferenceClick(e) {
    // Find the closest .showHelp element (supports nested clicks)
    const target = e.target.closest('.showHelp');

    if (!target) {
      return; // Not a cross-reference link
    }

    // Prevent default link behavior
    e.preventDefault();
    e.stopPropagation();

    // Parse entity information from data attributes
    const clickedType = target.getAttribute('data-type');
    let clickedId = target.getAttribute('data-id');

    // Validate that we have the required data
    if (!clickedType || (clickedId === null || clickedId === undefined)) {
      console.warn('Cross-reference link missing data-type or data-id attributes', target);
      return;
    }

    // Navigate to the entity (adds to history and updates current entity)
    navigateToEntity(clickedType, clickedId);
  }


  /**
   * Switch to a different tab
   * @param {string} tabName - 'description' or 'related'
   */
  function switchTab(tabName) {
    currentTab = tabName;
  }

  /**
   * Handle close button click
   */
  function handleClose() {
    // Clear navigation history when modal closes
    clearHistory();
    dispatch('close');
  }

  /**
   * Handle navigation from related entities
   */
  function handleRelatedEntityClick(clickedType, clickedId) {
    navigateToEntity(clickedType, clickedId);
  }

  // Clean up on destroy
  onDestroy(() => {
    clearHistory();
  });

  /**
   * Get BEM class name with modifiers
   */
  function getClassName(base, modifiers = {}) {
    const classes = [base];
    for (const [key, value] of Object.entries(modifiers)) {
      if (value) {
        classes.push(`${base}--${key}`);
      }
    }
    return classes.join(' ');
  }

  /**
   * Handle keyboard navigation for tabs
   * @param {KeyboardEvent} event - Keyboard event
   * @param {string} tabName - Name of the tab
   */
  function handleTabKeydown(event, tabName) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      switchTab(tabName);
    }
  }

  /**
   * Log cache statistics to console (for development/monitoring)
   */
  function logCacheStats() {
    const stats = globalDescriptionCache.getStats();

    // Only log when hit rate monitoring is meaningful (>10 requests)
    if (stats.hits + stats.misses >= 10) {
      console.log(`[Cache Stats] Hit Rate: ${stats.hitRatePercent}% | Size: ${stats.size}/${stats.maxSize} (${stats.utilizationPercent}% full)`);

      // Warning if hit rate is below target (70%)
      if (stats.hitRate < 0.7 && stats.hits + stats.misses >= 20) {
        console.warn(`[Cache] Hit rate below target: ${stats.hitRatePercent}% (target: ≥70%)`);
      }
    }
  }

  /**
   * Expose cache stats for debugging (window.getDescriptionCacheStats())
   */
  if (typeof window !== 'undefined') {
    window.getDescriptionCacheStats = () => {
      const stats = globalDescriptionCache.getStats();
      console.table(stats);
      return stats;
    };
  }
</script>

<div class={getClassName('entity-description', { [displayMode]: true })}>
  <!-- Header -->
  <div class="entity-description__header">
    <div class="entity-description__title-wrapper">
      <h2 class="entity-description__title">
        {#if loading}
          Loading...
        {:else if error}
          Error
        {:else if entityLabel}
          {entityLabel}
        {:else}
          Entity Description
        {/if}
      </h2>
      {#if currentEntityType}
        <span class="entity-description__type-badge">{currentEntityType}</span>
      {/if}
    </div>

    {#if displayMode === 'modal'}
      <button
        class="entity-description__close-btn"
        on:click={handleClose}
        aria-label="Close description"
        title="Close"
      >
        <span class="entity-description__close-icon" aria-hidden="true">&times;</span>
      </button>
    {/if}
  </div>

  <!-- Navigation Bar -->
  {#if !loading && !error && $navigationState.history.length > 0}
    <NavigationBar showBreadcrumbs={true} showHistory={true} />
  {/if}

  <!-- Tab Navigation -->
  {#if !loading && !error}
    <div class="entity-description__tabs" role="tablist" aria-label="Entity information tabs">
      <!-- Description Tab -->
      <button
        class="entity-description__tab"
        class:entity-description__tab--active={currentTab === 'description'}
        role="tab"
        aria-selected={currentTab === 'description'}
        aria-controls="entity-content-description"
        id="entity-tab-description"
        on:click={() => switchTab('description')}
        on:keydown={(e) => handleTabKeydown(e, 'description')}
        tabindex={currentTab === 'description' ? 0 : -1}
      >
        Description
      </button>

      <!-- Related Tab -->
      <button
        class="entity-description__tab"
        class:entity-description__tab--active={currentTab === 'related'}
        role="tab"
        aria-selected={currentTab === 'related'}
        aria-controls="entity-content-related"
        id="entity-tab-related"
        on:click={() => switchTab('related')}
        on:keydown={(e) => handleTabKeydown(e, 'related')}
        tabindex={currentTab === 'related' ? 0 : -1}
      >
        Related
        {#if relatedEntities && Object.keys(relatedEntities).length > 0}
          <span class="entity-description__tab-badge">
            {Object.values(relatedEntities).reduce((sum, arr) => sum + arr.length, 0)}
          </span>
        {/if}
      </button>
    </div>
  {/if}

  <!-- Content Area -->
  <div class="entity-description__content" role="tabpanel" id="entity-content-{currentTab}" aria-labelledby="entity-tab-{currentTab}">
    {#if loading}
      <!-- Loading State -->
      <div class="entity-description__loading" role="status" aria-live="polite" aria-busy="true">
        <div class="entity-description__spinner" aria-label="Loading description">
          <div class="entity-description__spinner-circle" aria-hidden="true"></div>
        </div>
        <p class="entity-description__loading-text">Loading description...</p>
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="entity-description__error" role="alert" aria-live="assertive">
        <div class="entity-description__error-icon" aria-hidden="true">⚠</div>
        <p class="entity-description__error-message">{error}</p>
        {#if !isValid}
          <p class="entity-description__error-details">
            Please provide both entity type and ID.
          </p>
        {/if}
      </div>
    {:else if currentTab === 'description'}
      <!-- Description tab: Use DescriptionRenderer -->
      <div
        class="entity-description__description-content"
        on:click={handleCrossReferenceClick}
        role="article"
      >
        {#if descriptionData}
          <DescriptionRenderer
            entityType={currentEntityType}
            data={descriptionData}
            on:navigate={handleDescriptionNavigate}
          />
        {:else}
          <!-- Placeholder when no description available -->
          <p class="entity-description__placeholder">
            No description available.
          </p>
        {/if}
      </div>
    {:else if currentTab === 'related'}
      <!-- Related Tab: Show entities that reference this one -->
      <div class="entity-description__related-content">
        {#if loadingRelated}
          <div class="entity-description__loading" role="status" aria-live="polite" aria-busy="true">
            <div class="entity-description__spinner" aria-label="Loading related entities">
              <div class="entity-description__spinner-circle" aria-hidden="true"></div>
            </div>
            <p class="entity-description__loading-text">Loading related entities...</p>
          </div>
        {:else if relatedEntities && Object.keys(relatedEntities).length > 0}
          <!-- Show related entities grouped by type -->
          {#each Object.entries(relatedEntities) as [tableName, entities]}
            <div class="entity-description__related-section">
              <h3 class="entity-description__related-heading">
                {tableName.charAt(0).toUpperCase() + tableName.slice(1)}
                <span class="entity-description__related-count">({entities.length})</span>
              </h3>

              {#if entities.length <= 100}
                <!-- Small lists (<= 100 items): render directly -->
                <ul class="entity-description__related-list" role="list">
                  {#each entities as entity}
                    <li class="entity-description__related-item" role="listitem">
                      <button
                        class="entity-description__related-link"
                        on:click={() => handleRelatedEntityClick(entity.entityType, entity.id)}
                        aria-label="Navigate to {entity.label || entity.name || entity.id}"
                      >
                        {entity.label || entity.name || entity.id}
                      </button>
                    </li>
                  {/each}
                </ul>
              {:else}
                <!-- Large lists (> 100 items): use DataTable with virtualization -->
                <div class="entity-description__related-table">
                  <DataTable
                    data={entities}
                    columns={[
                      { key: 'label', label: 'Name', sortable: true, width: '100%' }
                    ]}
                    rowHeight={48}
                    height="400px"
                    onRowClick={(item) => handleRelatedEntityClick(item.entityType, item.id)}
                    emptyMessage="No related entities found"
                  />
                </div>
              {/if}
            </div>
          {/each}
        {:else}
          <p class="entity-description__placeholder">
            This entity is not referenced by any other entities.
          </p>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* ========================================================================
     BEM Component: entity-description
     ======================================================================== */

  .entity-description {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    font-family: var(--font-ui);
  }

  /* Display Mode Variants */
  .entity-description--modal {
    max-height: 80vh;
    width: 100%;
    max-width: 800px;
  }

  .entity-description--panel {
    height: 100%;
    max-height: none;
    border-radius: 0;
  }

  .entity-description--inline {
    border: 1px solid var(--color-border);
  }

  /* Header */
  .entity-description__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
    flex-shrink: 0;
  }

  .entity-description__title-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex: 1;
    min-width: 0;
  }

  .entity-description__title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    line-height: 1.2;
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entity-description__type-badge {
    display: inline-flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--color-info-bg);
    color: var(--color-info);
    border: 1px solid var(--color-info);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    text-transform: capitalize;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .entity-description__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
    flex-shrink: 0;
  }

  .entity-description__close-btn:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  .entity-description__close-btn:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .entity-description__close-icon {
    font-size: 28px;
    line-height: 1;
    font-weight: var(--font-weight-normal);
  }

  /* Tab Navigation */
  .entity-description__tabs {
    display: flex;
    gap: var(--spacing-xs);
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .entity-description__tab {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-primary);
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast);
    white-space: nowrap;
    min-height: var(--touch-target-min);
    display: flex;
    align-items: center;
  }

  .entity-description__tab:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-color: var(--color-border-strong);
  }

  .entity-description__tab:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .entity-description__tab--active {
    background-color: var(--color-accent);
    color: var(--color-text-primary);
    border-color: var(--color-accent);
  }

  .entity-description__tab--active:hover {
    background-color: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }

  /* Content Area */
  .entity-description__content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
    min-height: 200px;
  }

  /* Loading State */
  .entity-description__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl) 0;
    gap: var(--spacing-md);
  }

  .entity-description__spinner {
    position: relative;
    width: 48px;
    height: 48px;
  }

  .entity-description__spinner-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .entity-description__loading-text {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-md);
  }

  /* Error State */
  .entity-description__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl) var(--spacing-lg);
    gap: var(--spacing-sm);
    text-align: center;
  }

  .entity-description__error-icon {
    font-size: 48px;
    color: var(--color-error);
    line-height: 1;
  }

  .entity-description__error-message {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-error);
  }

  .entity-description__error-details {
    margin: 0;
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
  }

  /* Description Content Rendering */
  .entity-description__description-content {
    line-height: 1.6;
  }

  /* Cross-Reference Link Styles (for legacy {@html} content) */
  .entity-description__description-content :global(.showHelp) {
    color: var(--color-primary);
    text-decoration: underline;
    cursor: pointer;
    transition: color var(--transition-fast);
  }

  .entity-description__description-content :global(.showHelp):hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }

  .entity-description__description-content :global(.showHelp):focus {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
    border-radius: var(--radius-sm);
  }

  .entity-description__description-content :global(.showHelp):active {
    color: var(--color-primary-darker);
  }

  .entity-description__placeholder {
    color: var(--color-text-secondary);
    font-style: italic;
    text-align: center;
    padding: var(--spacing-xl) 0;
  }

  /* Tab Badge (count indicator) */
  .entity-description__tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 var(--spacing-xs);
    margin-left: var(--spacing-xs);
    background-color: var(--color-accent);
    color: var(--color-text-primary);
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold);
    line-height: 1;
  }

  /* Related Content Styles */
  .entity-description__related-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .entity-description__related-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .entity-description__related-heading {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .entity-description__related-count {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-secondary);
  }

  .entity-description__related-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .entity-description__related-item {
    display: flex;
    align-items: center;
  }

  .entity-description__related-link {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-primary);
    font-size: var(--font-size-md);
    text-align: left;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast);
  }

  .entity-description__related-link:hover {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
    color: var(--color-primary-dark);
  }

  .entity-description__related-link:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .entity-description__related-link:active {
    background-color: var(--color-accent);
    color: var(--color-text-primary);
  }

  .entity-description__related-table {
    width: 100%;
    margin-top: var(--spacing-sm);
  }

  /* Responsive Breakpoints */
  @media (max-width: 768px) {
    .entity-description--modal {
      max-height: 90vh;
      max-width: 95vw;
    }

    .entity-description__header {
      padding: var(--spacing-md);
    }

    .entity-description__title {
      font-size: var(--font-size-lg);
    }

    .entity-description__tabs {
      padding: var(--spacing-sm) var(--spacing-md);
      gap: var(--spacing-xs);
    }

    .entity-description__tab {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
    }

    .entity-description__content {
      padding: var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .entity-description--modal {
      max-height: 95vh;
      max-width: 100vw;
      border-radius: 0;
    }

    .entity-description__header {
      padding: var(--spacing-sm) var(--spacing-md);
      flex-wrap: wrap;
    }

    .entity-description__title-wrapper {
      gap: var(--spacing-sm);
    }

    .entity-description__title {
      font-size: var(--font-size-base);
    }

    .entity-description__type-badge {
      font-size: 0.625rem;
      padding: 2px var(--spacing-xs);
    }

    .entity-description__tabs {
      padding: var(--spacing-xs) var(--spacing-sm);
      overflow-x: auto;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
    }

    .entity-description__tab {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    .entity-description__content {
      padding: var(--spacing-sm) var(--spacing-md);
      min-height: 150px;
    }

    .entity-description__close-btn {
      width: 32px;
      height: 32px;
    }

    .entity-description__close-icon {
      font-size: 24px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .entity-description__spinner-circle {
      animation: none;
    }

    .entity-description__close-btn {
      transition: none;
    }

    .entity-description__description-content :global(.showHelp) {
      transition: none;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .entity-description {
      border: 2px solid currentColor;
    }

    .entity-description__type-badge {
      border-width: 2px;
    }

    .entity-description__description-content :global(.showHelp) {
      text-decoration: underline;
      font-weight: var(--font-weight-bold);
    }
  }
</style>
