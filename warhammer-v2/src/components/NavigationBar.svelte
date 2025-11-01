<script>
  /**
   * NavigationBar Component
   *
   * Provides navigation controls including back/forward buttons, breadcrumb trail,
   * and history dropdown. Works with the navigation store to manage navigation state.
   *
   * Features:
   * - Back/Forward navigation buttons with disabled states
   * - Breadcrumb trail showing last 5 navigation steps
   * - History dropdown showing recent 10 items
   * - Keyboard shortcuts support (Alt+Left/Right handled by store)
   * - Consistent styling with existing components
   *
   * @prop {boolean} showBreadcrumbs - Show breadcrumb trail (default: true)
   * @prop {boolean} showHistory - Show history dropdown (default: true)
   *
   * @event navigate - Fired when user navigates to a history item
   *   detail: { type: string, id: string }
   */

  import { getIcon } from '$lib/icons.js';
  import { onMount, onDestroy } from 'svelte';

  // Props
  export let showBreadcrumbs = true;
  export let showHistory = true;

  // Navigation state (will be connected to actual store once Stream A completes)
  // For now, we work with the interface contract defined in the analysis
  let navigationHistory = [];
  let currentIndex = -1;
  let historyDropdownOpen = false;

  // Mock store interface for development (to be replaced with actual store import)
  // import { navigationHistory, currentIndex, navigateBack, navigateForward, navigateToIndex } from '../stores/navigation.js';

  // Reactive computations
  $: canGoBack = currentIndex > 0;
  $: canGoForward = currentIndex < navigationHistory.length - 1;
  $: breadcrumbs = getBreadcrumbs(navigationHistory, currentIndex);
  $: recentHistory = getRecentHistory(navigationHistory, currentIndex);

  /**
   * Get breadcrumb items (last 5 steps)
   * @param {Array} history - Full navigation history
   * @param {number} index - Current index in history
   * @returns {Array} Breadcrumb items
   */
  function getBreadcrumbs(history, index) {
    if (!history || history.length === 0 || index < 0) {
      return [];
    }

    // Get up to 5 items ending at current index
    const start = Math.max(0, index - 4);
    const end = index + 1;
    return history.slice(start, end).map((item, i) => ({
      ...item,
      historyIndex: start + i,
      isCurrent: start + i === index
    }));
  }

  /**
   * Get recent history items for dropdown (last 10 items)
   * @param {Array} history - Full navigation history
   * @param {number} index - Current index in history
   * @returns {Array} Recent history items
   */
  function getRecentHistory(history, index) {
    if (!history || history.length === 0 || index < 0) {
      return [];
    }

    // Get up to 10 most recent items (including current)
    const start = Math.max(0, index - 9);
    const end = index + 1;
    return history.slice(start, end).reverse().map((item, i) => ({
      ...item,
      historyIndex: index - i,
      isCurrent: index - i === index
    }));
  }

  /**
   * Handle back navigation
   */
  function handleBack() {
    if (!canGoBack) return;

    // TODO: Call actual store function once Stream A is complete
    // navigateBack();

    // Mock implementation for now
    if (currentIndex > 0) {
      currentIndex--;
      console.log('Navigate back to:', navigationHistory[currentIndex]);
    }
  }

  /**
   * Handle forward navigation
   */
  function handleForward() {
    if (!canGoForward) return;

    // TODO: Call actual store function once Stream A is complete
    // navigateForward();

    // Mock implementation for now
    if (currentIndex < navigationHistory.length - 1) {
      currentIndex++;
      console.log('Navigate forward to:', navigationHistory[currentIndex]);
    }
  }

  /**
   * Navigate to a specific history index
   * @param {number} index - History index to navigate to
   */
  function navigateToIndex(index) {
    if (index < 0 || index >= navigationHistory.length) return;

    // TODO: Call actual store function once Stream A is complete
    // navigateToIndex(index);

    // Mock implementation for now
    currentIndex = index;
    historyDropdownOpen = false;
    console.log('Navigate to index', index, ':', navigationHistory[index]);
  }

  /**
   * Toggle history dropdown
   */
  function toggleHistoryDropdown() {
    historyDropdownOpen = !historyDropdownOpen;
  }

  /**
   * Close dropdown when clicking outside
   * @param {MouseEvent} event - Click event
   */
  function handleClickOutside(event) {
    const dropdown = event.target.closest('.navigation-bar__history');
    if (!dropdown) {
      historyDropdownOpen = false;
    }
  }

  /**
   * Format timestamp for display
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted time
   */
  function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && historyDropdownOpen) {
      event.preventDefault();
      historyDropdownOpen = false;
    }
  }

  // Mount lifecycle
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);

    // TODO: Subscribe to navigation store once Stream A is complete
    // const unsubscribe = navigationHistory.subscribe(value => {
    //   navigationHistory = value.history;
    //   currentIndex = value.currentIndex;
    // });

    // For now, set up mock data for testing
    navigationHistory = [
      { type: 'talent', id: 'talent1', label: 'Marksman', timestamp: Date.now() - 300000 },
      { type: 'skill', id: 'skill1', label: 'Ranged (Bow)', timestamp: Date.now() - 240000 },
      { type: 'career', id: 'career1', label: 'Soldier', timestamp: Date.now() - 180000 },
      { type: 'spell', id: 'spell1', label: 'Fireball', timestamp: Date.now() - 120000 },
      { type: 'talent', id: 'talent2', label: 'Warrior Born', timestamp: Date.now() - 60000 }
    ];
    currentIndex = 4;
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);

    // TODO: Unsubscribe from store
    // if (unsubscribe) unsubscribe();
  });
</script>

<nav class="navigation-bar" aria-label="Entity navigation">
  <div class="navigation-bar__controls">
    <!-- Back Button -->
    <button
      class="navigation-bar__btn navigation-bar__btn--back"
      on:click={handleBack}
      disabled={!canGoBack}
      aria-label="Navigate back"
      title="Go back (Alt+Left)"
    >
      <span class="navigation-bar__btn-icon" aria-hidden="true">
        {@html getIcon('chevronLeft', 'icon-svg', 20)}
      </span>
    </button>

    <!-- Forward Button -->
    <button
      class="navigation-bar__btn navigation-bar__btn--forward"
      on:click={handleForward}
      disabled={!canGoForward}
      aria-label="Navigate forward"
      title="Go forward (Alt+Right)"
    >
      <span class="navigation-bar__btn-icon" aria-hidden="true">
        {@html getIcon('chevronRight', 'icon-svg', 20)}
      </span>
    </button>

    <!-- Breadcrumb Trail -->
    {#if showBreadcrumbs && breadcrumbs.length > 0}
      <div class="navigation-bar__breadcrumbs" role="navigation" aria-label="Breadcrumb trail">
        {#each breadcrumbs as crumb, index}
          {#if index > 0}
            <span class="navigation-bar__breadcrumb-separator" aria-hidden="true">
              {@html getIcon('chevronRight', 'icon-svg', 14)}
            </span>
          {/if}
          <button
            class="navigation-bar__breadcrumb"
            class:navigation-bar__breadcrumb--current={crumb.isCurrent}
            on:click={() => navigateToIndex(crumb.historyIndex)}
            disabled={crumb.isCurrent}
            title="{crumb.label} ({crumb.type})"
          >
            <span class="navigation-bar__breadcrumb-label">{crumb.label}</span>
            <span class="navigation-bar__breadcrumb-type">{crumb.type}</span>
          </button>
        {/each}
      </div>
    {/if}

    <!-- History Dropdown -->
    {#if showHistory && recentHistory.length > 0}
      <div class="navigation-bar__history">
        <button
          class="navigation-bar__btn navigation-bar__btn--history"
          on:click={toggleHistoryDropdown}
          aria-label="Show navigation history"
          aria-expanded={historyDropdownOpen}
          title="Navigation history"
        >
          <span class="navigation-bar__btn-icon" aria-hidden="true">
            {@html getIcon('chevronDown', 'icon-svg', 20)}
          </span>
        </button>

        {#if historyDropdownOpen}
          <div class="navigation-bar__dropdown" role="menu">
            <div class="navigation-bar__dropdown-header">Recent History</div>
            <div class="navigation-bar__dropdown-list">
              {#each recentHistory as item}
                <button
                  class="navigation-bar__dropdown-item"
                  class:navigation-bar__dropdown-item--current={item.isCurrent}
                  on:click={() => navigateToIndex(item.historyIndex)}
                  role="menuitem"
                  disabled={item.isCurrent}
                >
                  <div class="navigation-bar__dropdown-item-main">
                    <span class="navigation-bar__dropdown-item-label">{item.label}</span>
                    <span class="navigation-bar__dropdown-item-type">{item.type}</span>
                  </div>
                  <span class="navigation-bar__dropdown-item-time">
                    {formatTime(item.timestamp)}
                  </span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</nav>

<style>
  /* ========================================================================
     BEM Component: navigation-bar
     ======================================================================== */

  .navigation-bar {
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-ui);
    gap: var(--spacing-sm);
  }

  .navigation-bar__controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
    min-width: 0;
  }

  /* Navigation Buttons */
  .navigation-bar__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    min-width: 36px;
    padding: 0;
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast),
      opacity var(--transition-fast);
    flex-shrink: 0;
  }

  .navigation-bar__btn:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
  }

  .navigation-bar__btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .navigation-bar__btn:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .navigation-bar__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .navigation-bar__btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
  }

  .navigation-bar__btn-icon :global(.icon-svg) {
    display: block;
  }

  /* Breadcrumbs */
  .navigation-bar__breadcrumbs {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    padding: var(--spacing-xs) 0;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }

  .navigation-bar__breadcrumbs::-webkit-scrollbar {
    height: 4px;
  }

  .navigation-bar__breadcrumbs::-webkit-scrollbar-track {
    background: transparent;
  }

  .navigation-bar__breadcrumbs::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--radius-full);
  }

  .navigation-bar__breadcrumb-separator {
    display: flex;
    align-items: center;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
  }

  .navigation-bar__breadcrumb-separator :global(.icon-svg) {
    display: block;
  }

  .navigation-bar__breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-primary);
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast);
    white-space: nowrap;
    flex-shrink: 0;
    max-width: 200px;
  }

  .navigation-bar__breadcrumb:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
    color: var(--color-text-primary);
  }

  .navigation-bar__breadcrumb:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .navigation-bar__breadcrumb--current {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-text-primary);
    cursor: default;
    font-weight: var(--font-weight-medium);
  }

  .navigation-bar__breadcrumb-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .navigation-bar__breadcrumb-type {
    display: inline-flex;
    padding: 2px var(--spacing-xs);
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    text-transform: capitalize;
    flex-shrink: 0;
  }

  .navigation-bar__breadcrumb--current .navigation-bar__breadcrumb-type {
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* History Dropdown */
  .navigation-bar__history {
    position: relative;
    flex-shrink: 0;
  }

  .navigation-bar__dropdown {
    position: absolute;
    top: calc(100% + var(--spacing-xs));
    right: 0;
    min-width: 280px;
    max-width: 320px;
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
  }

  .navigation-bar__dropdown-header {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }

  .navigation-bar__dropdown-list {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .navigation-bar__dropdown-list::-webkit-scrollbar {
    width: 8px;
  }

  .navigation-bar__dropdown-list::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
  }

  .navigation-bar__dropdown-list::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--radius-full);
  }

  .navigation-bar__dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    background-color: transparent;
    color: var(--color-text-primary);
    text-align: left;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    gap: var(--spacing-sm);
  }

  .navigation-bar__dropdown-item:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
  }

  .navigation-bar__dropdown-item:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: calc(-1 * var(--focus-ring-width));
  }

  .navigation-bar__dropdown-item:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
  }

  .navigation-bar__dropdown-item--current {
    background-color: var(--color-accent);
    color: var(--color-text-primary);
    cursor: default;
    font-weight: var(--font-weight-medium);
  }

  .navigation-bar__dropdown-item--current:hover {
    background-color: var(--color-accent);
  }

  .navigation-bar__dropdown-item-main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
    min-width: 0;
  }

  .navigation-bar__dropdown-item-label {
    font-size: var(--font-size-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .navigation-bar__dropdown-item-type {
    display: inline-flex;
    align-items: center;
    padding: 2px var(--spacing-xs);
    background-color: var(--color-info-bg);
    color: var(--color-info);
    border: 1px solid var(--color-info);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    text-transform: capitalize;
    width: fit-content;
  }

  .navigation-bar__dropdown-item--current .navigation-bar__dropdown-item-type {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    color: inherit;
  }

  .navigation-bar__dropdown-item-time {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .navigation-bar__dropdown-item--current .navigation-bar__dropdown-item-time {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .navigation-bar {
      padding: var(--spacing-sm);
      gap: var(--spacing-xs);
    }

    .navigation-bar__controls {
      gap: var(--spacing-xs);
    }

    .navigation-bar__btn {
      width: 32px;
      height: 32px;
      min-width: 32px;
    }

    .navigation-bar__breadcrumbs {
      gap: 4px;
    }

    .navigation-bar__breadcrumb {
      padding: 4px var(--spacing-xs);
      font-size: var(--font-size-xs);
      max-width: 150px;
    }

    .navigation-bar__breadcrumb-type {
      display: none;
    }

    .navigation-bar__dropdown {
      min-width: 240px;
      right: auto;
      left: 0;
    }
  }

  @media (max-width: 480px) {
    .navigation-bar {
      flex-wrap: wrap;
      padding: var(--spacing-xs);
    }

    .navigation-bar__breadcrumbs {
      order: 3;
      width: 100%;
      margin-top: var(--spacing-xs);
      padding: var(--spacing-xs);
      background-color: var(--color-bg-primary);
      border-radius: var(--radius-md);
    }

    .navigation-bar__breadcrumb {
      font-size: 0.75rem;
      padding: 2px var(--spacing-xs);
      max-width: 120px;
    }

    .navigation-bar__dropdown {
      position: fixed;
      top: auto;
      right: var(--spacing-sm);
      left: var(--spacing-sm);
      bottom: var(--spacing-sm);
      min-width: auto;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .navigation-bar__btn,
    .navigation-bar__breadcrumb {
      border-width: 2px;
    }

    .navigation-bar__dropdown {
      border-width: 2px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .navigation-bar__btn,
    .navigation-bar__breadcrumb,
    .navigation-bar__dropdown-item {
      transition: none;
    }

    .navigation-bar__btn:active:not(:disabled) {
      transform: none;
    }
  }

  /* Dark Theme Adjustments - handled by CSS variables */
</style>
