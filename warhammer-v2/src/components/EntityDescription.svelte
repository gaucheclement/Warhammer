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

  // Validation: ensure required props are provided
  $: isValid = entityType && entityId;
  $: if (!isValid && !loading) {
    error = 'Entity type and ID are required';
  }

  // TODO STREAM B: Add loadDescription() function here
  // This function should:
  // - Set loading = true
  // - Call generateDescription(entityType, entityId) from db-descriptions.js
  // - Set descriptionData and descriptionHtml from the result
  // - Handle errors appropriately
  // - Set loading = false
  // - Implement caching to avoid redundant fetches

  // TODO STREAM B: Add reactive statement to reload when props change
  // $: if (entityType && entityId) {
  //   loadDescription();
  // }

  // TODO STREAM C: Add handleCrossReferenceClick(e) function here
  // This function should:
  // - Listen for clicks on elements with class 'showHelp'
  // - Parse data-type and data-id attributes
  // - Emit 'navigate' event with parsed entity info
  // - Prevent default link behavior
  // - Use event delegation on the content container

  // TODO STREAM D: Add switchTab(tabName) function here
  // This function should:
  // - Update currentTab state
  // - Handle tab visibility and active state
  // - Support entities with multiple sections/tabs

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
        {:else}
          <!-- TODO STREAM B: Display entity label from descriptionData -->
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
  <div class="entity-description__content">
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
        <!-- Placeholder for description content -->
        <p class="entity-description__placeholder">
          Description content will be rendered here by Stream B and C.
        </p>
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

  /* TODO STREAM D: Add tab navigation styles here */
  /* .entity-description__tabs { ... }
     .entity-description__tab { ... }
     .entity-description__tab--active { ... } */

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

  /* TODO STREAM D: Add responsive breakpoints here */
  /* @media (max-width: 768px) { ... } */
  /* @media (max-width: 480px) { ... } */

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
