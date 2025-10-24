<script>
  /**
   * DataTableHeader - Table header with sortable columns
   *
   * @prop {Array} columns - Column definitions [{key, label, sortable, width}]
   * @prop {string|null} sortKey - Current sort column key
   * @prop {string} sortDirection - Sort direction ('asc' or 'desc')
   * @prop {boolean} hasSelection - Whether table has row selection
   * @prop {boolean} allSelected - Whether all rows are selected
   * @prop {Function} onSort - Sort handler (key)
   * @prop {Function} onSelectAll - Select all handler
   */

  let {
    columns = [],
    sortKey = null,
    sortDirection = 'asc',
    hasSelection = false,
    allSelected = false,
    onSort = () => {},
    onSelectAll = () => {}
  } = $props();

  /**
   * Handle column header click
   */
  function handleSort(column) {
    if (column.sortable !== false) {
      onSort(column.key);
    }
  }

  /**
   * Handle select all checkbox
   */
  function handleSelectAll(event) {
    onSelectAll(event.target.checked);
  }
</script>

<thead class="datatable-header">
  <tr>
    {#if hasSelection}
      <th class="datatable-header-cell datatable-header-cell--checkbox" style="width: 48px;">
        <label class="datatable-checkbox-label">
          <input
            type="checkbox"
            class="datatable-checkbox"
            checked={allSelected}
            onchange={handleSelectAll}
            aria-label="Select all rows"
          />
          <span class="datatable-checkbox-custom"></span>
        </label>
      </th>
    {/if}

    {#each columns as column (column.key)}
      <th
        class="datatable-header-cell"
        class:datatable-header-cell--sortable={column.sortable !== false}
        class:datatable-header-cell--sorted={sortKey === column.key}
        style:width={column.width || 'auto'}
        onclick={() => handleSort(column)}
        role={column.sortable !== false ? 'button' : undefined}
        tabindex={column.sortable !== false ? 0 : undefined}
        aria-sort={
          sortKey === column.key
            ? sortDirection === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'
        }
      >
        <div class="datatable-header-content">
          <span class="datatable-header-label">{column.label}</span>
          {#if column.sortable !== false}
            <span class="datatable-sort-icon" aria-hidden="true">
              {#if sortKey === column.key}
                {#if sortDirection === 'asc'}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 4L12 10H4L8 4Z" fill="currentColor"/>
                  </svg>
                {:else}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 12L4 6H12L8 12Z" fill="currentColor"/>
                  </svg>
                {/if}
              {:else}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 4L12 10H4L8 4Z" fill="currentColor" opacity="0.3"/>
                  <path d="M8 12L4 6H12L8 12Z" fill="currentColor" opacity="0.3"/>
                </svg>
              {/if}
            </span>
          {/if}
        </div>
      </th>
    {/each}
  </tr>
</thead>

<style>
  .datatable-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--color-bg-secondary, #2a221a);
    border-bottom: 2px solid var(--color-accent, #8b2e1f);
  }

  .datatable-header-cell {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    text-align: left;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-primary, #e8e0d5);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    user-select: none;
  }

  .datatable-header-cell:last-child {
    border-right: none;
  }

  .datatable-header-cell--checkbox {
    text-align: center;
    padding: var(--spacing-sm, 0.5rem);
  }

  .datatable-header-cell--sortable {
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .datatable-header-cell--sortable:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .datatable-header-cell--sortable:focus {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: -2px;
  }

  .datatable-header-cell--sorted {
    background-color: rgba(139, 46, 31, 0.1);
  }

  .datatable-header-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.25rem);
    min-height: 24px;
  }

  .datatable-header-label {
    flex: 1;
    min-width: 0;
  }

  .datatable-sort-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: var(--color-accent, #8b2e1f);
  }

  .datatable-header-cell--sortable:hover .datatable-sort-icon {
    opacity: 1;
  }

  /* Checkbox styling */
  .datatable-checkbox-label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
  }

  .datatable-checkbox {
    position: absolute;
    opacity: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .datatable-checkbox-custom {
    display: block;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-text-secondary, #b8a89a);
    border-radius: 3px;
    background-color: transparent;
    transition: all 0.15s ease;
    position: relative;
  }

  .datatable-checkbox:checked + .datatable-checkbox-custom {
    background-color: var(--color-accent, #8b2e1f);
    border-color: var(--color-accent, #8b2e1f);
  }

  .datatable-checkbox:checked + .datatable-checkbox-custom::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .datatable-checkbox:focus + .datatable-checkbox-custom {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: 2px;
  }

  .datatable-checkbox-label:hover .datatable-checkbox-custom {
    border-color: var(--color-accent, #8b2e1f);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .datatable-header-cell {
      padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
      font-size: 0.75rem;
    }

    .datatable-header-content {
      min-height: 20px;
    }

    .datatable-sort-icon svg {
      width: 14px;
      height: 14px;
    }
  }
</style>
