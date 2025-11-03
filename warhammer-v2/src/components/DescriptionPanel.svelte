<script>
  /**
   * DescriptionPanel Component
   *
   * A slide-out side panel for persistent reference viewing of entity descriptions.
   * Features resizable width with drag handle, keyboard shortcuts, and localStorage persistence.
   *
   * @component
   */

  import { onMount, onDestroy } from 'svelte';
  import EntityDescription from './EntityDescription.svelte';
  import {
    descriptionPanelOpen,
    descriptionPanelWidth,
    descriptionPanelEntity,
    closeDescriptionPanel,
    setDescriptionPanelWidth,
    openDescriptionPanel
  } from '../stores/ui.js';

  // Component state
  let isResizing = false;
  let panelElement;
  let resizeHandleElement;

  // Subscribe to stores
  $: isOpen = $descriptionPanelOpen;
  $: panelWidth = $descriptionPanelWidth;
  $: currentEntity = $descriptionPanelEntity;

  /**
   * Handle navigation events from EntityDescription
   * @param {CustomEvent} event - Navigation event with entityType and entityId
   */
  function handleNavigate(event) {
    const { entityType, entityId } = event.detail;
    openDescriptionPanel(entityType, entityId);
  }

  /**
   * Handle close button click
   */
  function handleClose() {
    closeDescriptionPanel();
  }

  /**
   * Handle Escape key press
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeDescriptionPanel();
    }
  }

  /**
   * Start resizing operation
   * @param {MouseEvent} event - Mouse event
   */
  function startResize(event) {
    event.preventDefault();
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  /**
   * Handle mouse move during resize
   * @param {MouseEvent} event - Mouse event
   */
  function handleMouseMove(event) {
    if (!isResizing) return;

    // Calculate new width based on distance from right edge of viewport
    const newWidth = window.innerWidth - event.clientX;
    setDescriptionPanelWidth(newWidth);
  }

  /**
   * Stop resizing operation
   */
  function stopResize() {
    if (!isResizing) return;

    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  /**
   * Handle touch start for mobile resize
   * @param {TouchEvent} event - Touch event
   */
  function handleTouchStart(event) {
    event.preventDefault();
    isResizing = true;
  }

  /**
   * Handle touch move during resize
   * @param {TouchEvent} event - Touch event
   */
  function handleTouchMove(event) {
    if (!isResizing || event.touches.length === 0) return;

    const touch = event.touches[0];
    const newWidth = window.innerWidth - touch.clientX;
    setDescriptionPanelWidth(newWidth);
  }

  /**
   * Stop touch resize
   */
  function handleTouchEnd() {
    stopResize();
  }

  // Setup event listeners on mount
  onMount(() => {
    // Add global event listeners for resize
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Add keyboard listener for Escape key
    window.addEventListener('keydown', handleKeydown);
  });

  // Cleanup on destroy
  onDestroy(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('keydown', handleKeydown);

    // Reset cursor if component unmounts during resize
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
</script>

<!-- Panel backdrop (for mobile overlay) -->
{#if isOpen}
  <div
    class="description-panel-backdrop"
    on:click={handleClose}
    role="presentation"
    aria-hidden="true"
  ></div>
{/if}

<!-- Side panel -->
<aside
  bind:this={panelElement}
  class="description-panel"
  class:description-panel--open={isOpen}
  style="--panel-width: {panelWidth}px"
  role="complementary"
  aria-label="Entity Description Panel"
  aria-hidden={!isOpen}
>
  <!-- Resize handle -->
  <div
    bind:this={resizeHandleElement}
    class="description-panel__resize-handle"
    on:mousedown={startResize}
    on:touchstart={handleTouchStart}
    role="separator"
    aria-label="Resize panel"
    aria-orientation="vertical"
    aria-valuenow={panelWidth}
    aria-valuemin={300}
    aria-valuemax={800}
    tabindex="0"
  >
    <div class="description-panel__resize-indicator"></div>
  </div>

  <!-- Panel content -->
  <div class="description-panel__content">
    {#if currentEntity}
      <EntityDescription
        entityType={currentEntity.type}
        entityId={currentEntity.id}
        displayMode="panel"
        on:navigate={handleNavigate}
        on:close={handleClose}
      />
    {:else}
      <!-- Empty state -->
      <div class="description-panel__empty">
        <p class="description-panel__empty-text">
          Select an entity to view its description
        </p>
      </div>
    {/if}
  </div>
</aside>

<style>
  /* ========================================================================
     BEM Component: description-panel
     ======================================================================== */

  /* Panel backdrop (mobile overlay) */
  .description-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-backdrop);
    z-index: calc(var(--z-fixed) - 1);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-base);
  }

  @media (max-width: 768px) {
    .description-panel-backdrop {
      opacity: 1;
      pointer-events: auto;
    }
  }

  /* Main panel container */
  .description-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--panel-width);
    background-color: var(--color-bg-primary);
    border-left: 1px solid var(--color-border);
    box-shadow: -4px 0 12px var(--color-shadow);
    z-index: var(--z-fixed);
    transform: translateX(100%);
    transition: transform var(--transition-base);
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  /* Open state with slide-in animation */
  .description-panel--open {
    transform: translateX(0);
  }

  /* Resize handle */
  .description-panel__resize-handle {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 8px;
    cursor: ew-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background: transparent;
    transition: background-color var(--transition-fast);
  }

  .description-panel__resize-handle:hover,
  .description-panel__resize-handle:focus-visible {
    background-color: var(--color-border);
  }

  .description-panel__resize-handle:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: -2px;
  }

  .description-panel__resize-indicator {
    width: 2px;
    height: 40px;
    background-color: var(--color-border-strong);
    border-radius: var(--radius-full);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .description-panel__resize-handle:hover .description-panel__resize-indicator,
  .description-panel__resize-handle:focus-visible .description-panel__resize-indicator {
    opacity: 1;
  }

  /* Panel content */
  .description-panel__content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: 8px; /* Space for resize handle */
    display: flex;
    flex-direction: column;
  }

  /* Empty state */
  .description-panel__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    text-align: center;
  }

  .description-panel__empty-text {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    font-style: italic;
  }

  /* Responsive: Mobile (full width overlay) */
  @media (max-width: 768px) {
    .description-panel {
      width: 100% !important;
      max-width: 100vw;
      border-left: none;
    }

    .description-panel__resize-handle {
      display: none;
    }

    .description-panel__content {
      margin-left: 0;
    }
  }

  /* Responsive: Tablet (max width constraint) */
  @media (max-width: 1024px) and (min-width: 769px) {
    .description-panel {
      max-width: 500px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .description-panel,
    .description-panel-backdrop {
      transition: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .description-panel {
      border-left-width: 2px;
    }

    .description-panel__resize-indicator {
      background-color: currentColor;
      opacity: 1;
    }
  }

  /* Print styles (hide panel) */
  @media print {
    .description-panel,
    .description-panel-backdrop {
      display: none;
    }
  }
</style>
