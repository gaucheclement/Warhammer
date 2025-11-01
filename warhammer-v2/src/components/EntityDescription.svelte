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

  import { createEventDispatcher } from 'svelte';
  import { generateDescription } from '../lib/db-descriptions.js';
  import { getEntityLabel } from '../lib/db-relations.js';
  import { db } from '../lib/db.js';

  // Props
  export let entityType = '';
  export let entityId = '';
  export let displayMode = 'modal';

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Internal state
  let loading = false;
  let error = null;
  let currentTab = 'main';
  let descriptionData = null;
  let descriptionHtml = '';
  let entityLabel = '';

  // Cache for loaded descriptions to avoid redundant fetches
  const descriptionCache = new Map();

  // Validation: ensure required props are provided
  $: isValid = entityType && entityId;
  $: if (!isValid && !loading) {
    error = 'Entity type and ID are required';
  }

  // STREAM B: Load description from db-descriptions.js generators
  /**
   * Load entity description from the database
   * Implements caching to avoid redundant fetches
   */
  async function loadDescription() {
    if (!entityType || !entityId) {
      error = 'Entity type and ID are required';
      return;
    }

    // Create cache key from entityType and entityId
    const cacheKey = `${entityType}:${entityId}`;

    // Check cache first
    if (descriptionCache.has(cacheKey)) {
      const cached = descriptionCache.get(cacheKey);
      descriptionData = cached.data;
      descriptionHtml = cached.html;
      entityLabel = cached.label;
      error = null;
      return;
    }

    // Set loading state
    loading = true;
    error = null;
    descriptionData = null;
    descriptionHtml = '';
    entityLabel = '';

    try {
      // Fetch entity to get label
      const tableName = entityType === 'specie' || entityType === 'species' ? 'species' : entityType + 's';
      let entity = null;

      if (db[tableName]) {
        entity = await db[tableName].get(entityId);
      }

      if (!entity) {
        throw new Error(`Entity not found: ${entityType} with ID "${entityId}"`);
      }

      // Get entity label
      entityLabel = getEntityLabel(entity);

      // Generate description using the description generators
      const result = await generateDescription(entityType, entityId);

      if (!result) {
        throw new Error(`Failed to generate description for ${entityType}: ${entityId}`);
      }

      // Handle different return types
      if (typeof result === 'string') {
        // Simple string description
        descriptionData = { Info: result };
        descriptionHtml = result;
      } else if (typeof result === 'object') {
        // Object with sections (Info, Accès, etc.)
        descriptionData = result;

        // For now, just use the first section or 'Info' section as HTML
        // Stream D will handle multi-tab rendering
        if (result.Info) {
          descriptionHtml = result.Info;
        } else {
          // Get first available section
          const firstKey = Object.keys(result)[0];
          descriptionHtml = result[firstKey] || '';
        }
      }

      // Cache the result
      descriptionCache.set(cacheKey, {
        data: descriptionData,
        html: descriptionHtml,
        label: entityLabel
      });

      // Clear error on success
      error = null;
    } catch (err) {
      console.error('Error loading description:', err);
      error = err.message || 'Failed to load description';
      descriptionData = null;
      descriptionHtml = '';
      entityLabel = '';
    } finally {
      loading = false;
    }
  }

  // STREAM B: Reactive statement to reload when props change
  $: if (entityType && entityId) {
    loadDescription();
  }

  // TODO STREAM C: Add handleCrossReferenceClick(e) function here
  // This function should:
  // - Listen for clicks on elements with class 'showHelp'
  // - Parse data-type and data-id attributes
  // - Emit 'navigate' event with parsed entity info
  // - Prevent default link behavior
  // - Use event delegation on the content container

  /**
   * Switch to a different tab
   * @param {string} tabName - Name of the tab to switch to
   */
  function switchTab(tabName) {
    currentTab = tabName;
  }

  /**
   * Get available tabs from description data
   * @returns {Array<string>} Array of tab names
   */
  function getTabs() {
    if (!descriptionData || typeof descriptionData !== 'object') {
      return [];
    }
    return Object.keys(descriptionData);
  }

  /**
   * Check if entity has multiple tabs
   * @returns {boolean} True if entity has tabs
   */
  function hasTabs() {
    const tabs = getTabs();
    return tabs.length > 1;
  }

  /**
   * Get HTML content for current tab
   * @returns {string} HTML content
   */
  function getCurrentTabContent() {
    if (!descriptionData) return '';

    // If descriptionData is a string, return it directly
    if (typeof descriptionData === 'string') {
      return descriptionData;
    }

    // If descriptionData is an object with tabs
    const tabs = getTabs();
    if (tabs.length === 0) return '';

    // Ensure currentTab exists, otherwise use first tab
    if (!descriptionData[currentTab]) {
      currentTab = tabs[0];
    }

    return descriptionData[currentTab] || '';
  }

  // Reactive statement to reset to first tab when description changes
  $: if (descriptionData) {
    const tabs = getTabs();
    if (tabs.length > 0 && !descriptionData[currentTab]) {
      currentTab = tabs[0];
    }
  }

  /**
   * Handle close button click
   */
  function handleClose() {
    dispatch('close');
  }

  /**
   * Get BEM class name with modifiers
   */
  function getClassName(base, modifiers = {}) {
    const classes = [base];
    for (const [key, value] of Object.entries(modifiers)) {
      if (value) {
        classes.push(`${base}--${key}`);
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
    }
    return classes.join(' ');
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
      {#if entityType}
        <span class="entity-description__type-badge">{entityType}</span>
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

  <!-- TODO STREAM D: Add tab navigation UI here -->
  <!-- This section should:
    - Conditionally render based on whether entity has multiple tabs
    - Display tabs with active state
    - Call switchTab(tabName) on click
    - Use BEM class naming: entity-description__tabs, entity-description__tab, entity-description__tab--active
  -->

  <!-- Content Area -->
  <div class="entity-description__content" role="tabpanel" id="entity-content-{currentTab}" aria-labelledby="entity-tab-{currentTab}">
    {#if loading}
      <!-- Loading State -->
      <div class="entity-description__loading">
        <div class="entity-description__spinner" aria-label="Loading description">
          <div class="entity-description__spinner-circle"></div>
        </div>
        <p class="entity-description__loading-text">Loading description...</p>
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="entity-description__error">
        <div class="entity-description__error-icon" aria-hidden="true">⚠</div>
        <p class="entity-description__error-message">{error}</p>
        {#if !isValid}
          <p class="entity-description__error-details">
            Please provide both entity type and ID.
          </p>
        {/if}
      </div>
    {:else}
      <!-- TODO STREAM C: Add HTML content rendering here -->
      <!-- This section should:
        - Use {@html descriptionHtml} to render content safely
        - Add click event handler for cross-reference links
        - Handle delegation from the container element
        - Example: <div on:click={handleCrossReferenceClick}>
      -->
      <div class="entity-description__html-content">
        {#if descriptionHtml}
          {@html descriptionHtml}
        {:else}
          <!-- Placeholder when no description available -->
          <p class="entity-description__placeholder">
            No description available for this entity.
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

  /* TODO STREAM C: Add HTML content rendering styles here */
  .entity-description__html-content {
    line-height: 1.6;
  }

  /* TODO STREAM C: Add cross-reference link styles here */
  /* .entity-description__html-content :global(.showHelp) { ... } */

  .entity-description__placeholder {
    color: var(--color-text-secondary);
    font-style: italic;
    text-align: center;
    padding: var(--spacing-xl) 0;
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
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .entity-description {
      border: 2px solid currentColor;
    }

    .entity-description__type-badge {
      border-width: 2px;
    }
  }
</style>
