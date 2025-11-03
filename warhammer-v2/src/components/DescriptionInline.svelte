<script>
  /**
   * DescriptionInline Component
   *
   * Inline accordion-style wrapper for EntityDescription that embeds directly
   * in list item flow with smooth expand/collapse animation.
   *
   * Features:
   * - Embeds directly in list item flow
   * - Smooth height animation (expand/collapse)
   * - Compact layout optimized for inline context
   * - Click to toggle expand/collapse
   * - No backdrop or overlay
   * - Responsive behavior maintains list layout
   * - Esc key to collapse
   *
   * @prop {string} entityType - Entity type (talent, skill, spell, career, etc.)
   * @prop {string} entityId - Entity ID to display
   * @prop {boolean} expanded - Whether the inline description is expanded (default: false)
   *
   * @event toggle - Fired when user toggles expand/collapse
   *   detail: { expanded: boolean }
   * @event navigate - Forwarded from EntityDescription when user clicks cross-reference
   *   detail: { entityType: string, entityId: string }
   */

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import EntityDescription from './EntityDescription.svelte';
  import { navigateToEntity } from '../stores/navigation.js';

  // Props
  export let entityType = '';
  export let entityId = '';
  export let expanded = false;

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Internal state
  let contentElement;
  let containerElement;
  let contentHeight = 0;
  let isAnimating = false;
  let resizeObserver;

  /**
   * Toggle expanded state
   */
  function toggle() {
    expanded = !expanded;
    dispatch('toggle', { expanded });
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeydown(event) {
    // Esc key to collapse (only if expanded)
    if (event.key === 'Escape' && expanded) {
      event.preventDefault();
      expanded = false;
      dispatch('toggle', { expanded: false });
    }
  }

  /**
   * Handle navigation event from EntityDescription
   * @param {CustomEvent} event - Navigation event
   */
  function handleNavigate(event) {
    const { entityType: navType, entityId: navId } = event.detail;

    // Update navigation store
    navigateToEntity(navType, navId);

    // Forward the event
    dispatch('navigate', event.detail);
  }

  /**
   * Measure content height for smooth animation
   */
  function measureHeight() {
    if (contentElement) {
      const newHeight = contentElement.scrollHeight;
      if (newHeight !== contentHeight) {
        contentHeight = newHeight;
      }
    }
  }

  /**
   * Update container height when expanded
   */
  function updateContainerHeight() {
    if (!containerElement) return;

    if (expanded) {
      // Measure the content height
      measureHeight();
      // Set explicit height for animation
      containerElement.style.height = `${contentHeight}px`;
    } else {
      // Collapse to 0
      containerElement.style.height = '0';
    }
  }

  // Measure height when expanded changes or content loads
  $: if (expanded && contentElement) {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      measureHeight();
      updateContainerHeight();
    });
  } else if (!expanded && containerElement) {
    updateContainerHeight();
  }

  // Set up keyboard listener and resize observer on mount
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

    // Use ResizeObserver to automatically update height when content changes
    if (typeof ResizeObserver !== 'undefined' && contentElement) {
      resizeObserver = new ResizeObserver(() => {
        if (expanded) {
          measureHeight();
          updateContainerHeight();
        }
      });
      resizeObserver.observe(contentElement);
    }

    // Initial height measurement
    if (expanded) {
      measureHeight();
      updateContainerHeight();
    }
  });

  // Clean up on destroy
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  /**
   * Handle animation start
   */
  function handleTransitionStart() {
    isAnimating = true;
  }

  /**
   * Handle animation end
   */
  function handleTransitionEnd() {
    isAnimating = false;
    // After animation completes, if expanded, set height to 'auto' for flexibility
    if (expanded && containerElement) {
      containerElement.style.height = 'auto';
    }
  }
</script>

<div class="description-inline" class:expanded class:animating={isAnimating}>
  <!-- Toggle Button -->
  <button
    class="description-inline__toggle"
    on:click={toggle}
    aria-expanded={expanded}
    aria-label={expanded ? 'Collapse description' : 'Expand description'}
    title={expanded ? 'Collapse description' : 'Expand description'}
  >
    <span class="description-inline__toggle-icon" aria-hidden="true">
      {expanded ? '▼' : '▶'}
    </span>
    <span class="description-inline__toggle-text">
      {expanded ? 'Hide' : 'Show'} Description
    </span>
  </button>

  <!-- Expandable Content Container -->
  <div
    class="description-inline__container"
    bind:this={containerElement}
    on:transitionstart={handleTransitionStart}
    on:transitionend={handleTransitionEnd}
  >
    <div
      class="description-inline__content"
      bind:this={contentElement}
    >
      {#if expanded}
        <EntityDescription
          {entityType}
          {entityId}
          displayMode="inline"
          on:navigate={handleNavigate}
          on:close={() => {
            expanded = false;
            dispatch('toggle', { expanded: false });
          }}
        />
      {/if}
    </div>
  </div>
</div>

<style>
  /* ========================================================================
     BEM Component: description-inline
     ======================================================================== */

  .description-inline {
    display: block;
    width: 100%;
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: border-color var(--transition-fast);
  }

  .description-inline.expanded {
    border-color: var(--color-border-strong);
  }

  /* Toggle Button */
  .description-inline__toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border: none;
    cursor: pointer;
    font-family: var(--font-ui);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    text-align: left;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
    min-height: var(--touch-target-min);
  }

  .description-inline__toggle:hover {
    background-color: var(--color-bg-tertiary);
  }

  .description-inline__toggle:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: calc(-1 * var(--focus-ring-width));
  }

  .description-inline__toggle:active {
    background-color: var(--color-bg-active);
  }

  .description-inline__toggle-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    font-size: 12px;
    color: var(--color-text-secondary);
    transition: transform var(--transition-base);
    flex-shrink: 0;
  }

  .expanded .description-inline__toggle-icon {
    transform: rotate(0deg);
  }

  .description-inline__toggle-text {
    flex: 1;
  }

  /* Expandable Container */
  .description-inline__container {
    height: 0;
    overflow: hidden;
    transition: height var(--transition-base) ease-in-out;
    will-change: height;
  }

  .description-inline.animating .description-inline__container {
    overflow: hidden;
  }

  .description-inline:not(.animating).expanded .description-inline__container {
    overflow: visible;
  }

  .description-inline__content {
    width: 100%;
  }

  /* Compact layout for inline context */
  .description-inline :global(.entity-description) {
    border: none;
    border-radius: 0;
    background-color: transparent;
  }

  .description-inline :global(.entity-description__header) {
    padding: var(--spacing-md);
    background-color: var(--color-bg-primary);
  }

  .description-inline :global(.entity-description__title) {
    font-size: var(--font-size-lg);
  }

  .description-inline :global(.entity-description__content) {
    padding: var(--spacing-md);
    min-height: auto;
  }

  /* Responsive Breakpoints */
  @media (max-width: 768px) {
    .description-inline__toggle {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
    }

    .description-inline :global(.entity-description__header) {
      padding: var(--spacing-sm);
    }

    .description-inline :global(.entity-description__title) {
      font-size: var(--font-size-base);
    }

    .description-inline :global(.entity-description__content) {
      padding: var(--spacing-sm);
    }
  }

  @media (max-width: 480px) {
    .description-inline__toggle {
      padding: var(--spacing-xs);
    }

    .description-inline__toggle-icon {
      width: 14px;
      height: 14px;
      font-size: 10px;
    }

    .description-inline :global(.entity-description__header) {
      padding: var(--spacing-xs) var(--spacing-sm);
      flex-wrap: wrap;
    }

    .description-inline :global(.entity-description__title) {
      font-size: var(--font-size-sm);
    }

    .description-inline :global(.entity-description__content) {
      padding: var(--spacing-xs) var(--spacing-sm);
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .description-inline__container {
      transition: none;
    }

    .description-inline__toggle-icon {
      transition: none;
    }

    .description-inline__toggle {
      transition: none;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .description-inline {
      border-width: 2px;
    }

    .description-inline__toggle {
      border-bottom: 2px solid var(--color-border);
    }
  }
</style>
