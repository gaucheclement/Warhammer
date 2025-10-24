<script>
  /**
   * DataTable - Virtualized table component for efficiently rendering large datasets
   *
   * Features:
   * - Virtual scrolling (only renders visible rows + buffer)
   * - Column sorting
   * - Row selection
   * - Configurable row height
   * - Performance optimized for 60fps with 1000+ rows
   *
   * @prop {Array} data - Array of data items to display
   * @prop {Array} columns - Column definitions [{key, label, sortable, width, formatter, truncate}]
   * @prop {number} rowHeight - Height of each row in pixels (default: 48)
   * @prop {number} overscan - Number of extra rows to render (default: 5)
   * @prop {boolean} enableSelection - Enable row selection (default: false)
   * @prop {Array} selectedItems - Array of selected item IDs
   * @prop {Function} onSelectionChange - Selection change handler (selectedItems)
   * @prop {Function} onRowClick - Row click handler (item)
   * @prop {string} sortKey - Current sort column key
   * @prop {string} sortDirection - Sort direction ('asc' or 'desc')
   * @prop {Function} onSort - Sort handler (key)
   * @prop {string} emptyMessage - Message to show when no data (default: 'No data available')
   * @prop {string} height - Container height (default: '600px')
   */

  import { onMount, onDestroy } from 'svelte';
  import { calculateVisibleRange, createRAFScrollHandler } from '../lib/virtualScroll.js';
  import DataTableHeader from './DataTableHeader.svelte';
  import DataTableRow from './DataTableRow.svelte';

  let {
    data = [],
    columns = [],
    rowHeight = 48,
    overscan = 5,
    enableSelection = false,
    selectedItems = [],
    onSelectionChange = () => {},
    onRowClick = null,
    sortKey = null,
    sortDirection = 'asc',
    onSort = () => {},
    emptyMessage = 'No data available',
    height = '600px'
  } = $props();

  let containerElement = $state(null);
  let scrollTop = $state(0);
  let containerHeight = $state(0);
  let visibleRange = $state({ startIndex: 0, endIndex: 0, offsetY: 0, totalHeight: 0 });

  // Track selected items as a Set for O(1) lookup
  let selectedSet = $derived(new Set(selectedItems));

  // Calculate visible range reactively
  $effect(() => {
    visibleRange = calculateVisibleRange({
      scrollTop,
      containerHeight,
      rowHeight,
      totalItems: data.length,
      overscan
    });
  });

  // Slice visible data
  let visibleData = $derived(data.slice(visibleRange.startIndex, visibleRange.endIndex));

  // Check if all visible items are selected
  let allSelected = $derived(
    enableSelection && data.length > 0 && selectedItems.length === data.length
  );

  /**
   * Handle scroll events with RAF optimization
   */
  let scrollHandler;
  $effect(() => {
    if (containerElement) {
      scrollHandler = createRAFScrollHandler((newScrollTop) => {
        scrollTop = newScrollTop;
      });
    }
  });

  /**
   * Update container height on mount and resize
   */
  function updateContainerHeight() {
    if (containerElement) {
      containerHeight = containerElement.clientHeight;
    }
  }

  onMount(() => {
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
  });

  onDestroy(() => {
    window.removeEventListener('resize', updateContainerHeight);
  });

  /**
   * Handle sort
   */
  function handleSort(key) {
    if (sortKey === key) {
      // Toggle direction
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(key, newDirection);
    } else {
      // New column, default to ascending
      onSort(key, 'asc');
    }
  }

  /**
   * Handle select all
   */
  function handleSelectAll(checked) {
    if (checked) {
      // Select all items
      const allIds = data.map((item, index) => item.id || index);
      onSelectionChange(allIds);
    } else {
      // Deselect all
      onSelectionChange([]);
    }
  }

  /**
   * Handle single row selection
   */
  function handleRowSelect(item, isSelected) {
    const itemId = item.id || data.indexOf(item);
    let newSelected;

    if (isSelected) {
      // Add to selection
      newSelected = [...selectedItems, itemId];
    } else {
      // Remove from selection
      newSelected = selectedItems.filter(id => id !== itemId);
    }

    onSelectionChange(newSelected);
  }

  /**
   * Handle row click
   */
  function handleRowClick(item) {
    if (onRowClick) {
      onRowClick(item);
    }
  }

  /**
   * Get item ID for selection tracking
   */
  function getItemId(item, index) {
    return item.id || index;
  }

  /**
   * Check if item is selected
   */
  function isItemSelected(item, index) {
    const itemId = getItemId(item, index);
    return selectedSet.has(itemId);
  }
</script>

<div class="datatable-container" style:height={height}>
  {#if data.length === 0}
    <div class="datatable-empty">
      <p class="datatable-empty-message">{emptyMessage}</p>
    </div>
  {:else}
    <div
      class="datatable-scroll-container"
      bind:this={containerElement}
      onscroll={scrollHandler}
      role="region"
      aria-label="Data table"
      tabindex="0"
    >
      <table class="datatable" role="table">
        <DataTableHeader
          {columns}
          {sortKey}
          {sortDirection}
          hasSelection={enableSelection}
          {allSelected}
          onSort={handleSort}
          onSelectAll={handleSelectAll}
        />
        <tbody class="datatable-body" role="rowgroup">
          <!-- Spacer before visible rows -->
          {#if visibleRange.offsetY > 0}
            <tr style:height={`${visibleRange.offsetY}px`} aria-hidden="true"></tr>
          {/if}

          <!-- Render only visible rows -->
          {#each visibleData as item, i (getItemId(item, visibleRange.startIndex + i))}
            <DataTableRow
              {item}
              {columns}
              hasSelection={enableSelection}
              selected={isItemSelected(item, visibleRange.startIndex + i)}
              onSelect={handleRowSelect}
              onClick={onRowClick}
              index={visibleRange.startIndex + i}
            />
          {/each}

          <!-- Spacer after visible rows -->
          {#if visibleRange.totalHeight - (visibleRange.offsetY + (visibleRange.endIndex - visibleRange.startIndex) * rowHeight) > 0}
            <tr
              style:height={`${visibleRange.totalHeight - (visibleRange.offsetY + (visibleRange.endIndex - visibleRange.startIndex) * rowHeight)}px`}
              aria-hidden="true"
            ></tr>
          {/if}
        </tbody>
      </table>
    </div>

    <!-- Status info for screen readers -->
    <div class="datatable-status" role="status" aria-live="polite" aria-atomic="true">
      Showing {visibleRange.startIndex + 1} to {Math.min(visibleRange.endIndex, data.length)} of {data.length} rows
      {#if enableSelection && selectedItems.length > 0}
        , {selectedItems.length} selected
      {/if}
    </div>
  {/if}
</div>

<style>
  .datatable-container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    background-color: var(--color-bg-primary, #1a1410);
    overflow: hidden;
  }

  .datatable-scroll-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    position: relative;
    /* Enable hardware acceleration */
    will-change: scroll-position;
    /* Enable smooth scrolling */
    scroll-behavior: smooth;
  }

  .datatable-scroll-container:focus {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: -2px;
  }

  .datatable {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    /* Optimize rendering */
    contain: layout style paint;
  }

  .datatable-body {
    position: relative;
  }

  .datatable-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: var(--spacing-xl, 2rem);
  }

  .datatable-empty-message {
    color: var(--color-text-secondary, #b8a89a);
    font-size: 1rem;
    margin: 0;
  }

  .datatable-status {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.75rem;
    color: var(--color-text-secondary, #b8a89a);
    background-color: var(--color-bg-secondary, #2a221a);
  }

  /* Custom scrollbar styling */
  .datatable-scroll-container::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  .datatable-scroll-container::-webkit-scrollbar-track {
    background-color: var(--color-bg-secondary, #2a221a);
  }

  .datatable-scroll-container::-webkit-scrollbar-thumb {
    background-color: var(--color-accent, #8b2e1f);
    border-radius: 6px;
    border: 2px solid var(--color-bg-secondary, #2a221a);
  }

  .datatable-scroll-container::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-accent-hover, #a63728);
  }

  /* Firefox scrollbar */
  .datatable-scroll-container {
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent, #8b2e1f) var(--color-bg-secondary, #2a221a);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .datatable-status {
      font-size: 0.625rem;
      padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    }
  }

  /* Performance optimizations */
  @media (prefers-reduced-motion: reduce) {
    .datatable-scroll-container {
      scroll-behavior: auto;
    }
  }
</style>
