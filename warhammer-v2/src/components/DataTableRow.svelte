<script>
  /**
   * DataTableRow - Lightweight row component for virtualized table
   *
   * @prop {Object} item - Row data object
   * @prop {Array} columns - Column definitions
   * @prop {boolean} hasSelection - Whether table has row selection
   * @prop {boolean} selected - Whether row is selected
   * @prop {Function} onSelect - Selection handler
   * @prop {Function} onClick - Row click handler
   * @prop {number} index - Row index (for aria-rowindex)
   */

  let {
    item = {},
    columns = [],
    hasSelection = false,
    selected = false,
    onSelect = () => {},
    onClick = () => {},
    index = 0
  } = $props();

  /**
   * Handle row selection
   */
  function handleSelect(event) {
    event.stopPropagation();
    onSelect(item, !selected);
  }

  /**
   * Handle row click
   */
  function handleClick() {
    onClick(item);
  }

  /**
   * Format cell value based on column configuration
   */
  function formatCellValue(item, column) {
    const value = item[column.key];

    if (value === null || value === undefined) {
      return '';
    }

    // Apply custom formatter if provided
    if (column.formatter && typeof column.formatter === 'function') {
      return column.formatter(value, item);
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // Handle objects
    if (typeof value === 'object') {
      return value.name || value.label || JSON.stringify(value);
    }

    return String(value);
  }
</script>

<tr
  class="datatable-row"
  class:datatable-row--selected={selected}
  class:datatable-row--clickable={onClick !== null}
  onclick={handleClick}
  role="row"
  aria-rowindex={index + 2}
  aria-selected={selected}
>
  {#if hasSelection}
    <td class="datatable-cell datatable-cell--checkbox" onclick|stopPropagation>
      <label class="datatable-checkbox-label">
        <input
          type="checkbox"
          class="datatable-checkbox"
          checked={selected}
          onchange={handleSelect}
          aria-label="Select row"
        />
        <span class="datatable-checkbox-custom"></span>
      </label>
    </td>
  {/if}

  {#each columns as column (column.key)}
    <td
      class="datatable-cell"
      class:datatable-cell--truncate={column.truncate !== false}
      style:width={column.width || 'auto'}
      title={column.truncate !== false ? formatCellValue(item, column) : undefined}
    >
      {formatCellValue(item, column)}
    </td>
  {/each}
</tr>

<style>
  .datatable-row {
    height: 48px; /* Fixed height for virtual scrolling calculations */
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: background-color 0.15s ease;
  }

  .datatable-row:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }

  .datatable-row--selected {
    background-color: rgba(139, 46, 31, 0.15);
  }

  .datatable-row--selected:hover {
    background-color: rgba(139, 46, 31, 0.2);
  }

  .datatable-row--clickable {
    cursor: pointer;
  }

  .datatable-cell {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    color: var(--color-text-primary, #e8e0d5);
    font-size: 0.875rem;
    vertical-align: middle;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .datatable-cell:last-child {
    border-right: none;
  }

  .datatable-cell--checkbox {
    text-align: center;
    padding: var(--spacing-sm, 0.5rem);
    width: 48px;
  }

  .datatable-cell--truncate {
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Checkbox styling - must match header */
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
    .datatable-cell {
      padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
      font-size: 0.75rem;
    }

    .datatable-row {
      height: 44px; /* Slightly smaller on mobile while maintaining touch targets */
    }
  }
</style>
