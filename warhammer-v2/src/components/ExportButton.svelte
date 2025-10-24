<script>
  /**
   * ExportButton Component
   *
   * Provides a button to export custom modifications as a JSON file.
   * Shows the count of modifications to export and allows optional author name input.
   *
   * Features:
   * - Displays count of modifications to export
   * - Optional modal for entering author name
   * - Disabled state when no modifications exist
   * - Success notification after export
   * - Error handling for export failures
   */

  import { onMount } from 'svelte';
  import { customModifications } from '../stores/data.js';
  import {
    exportModifications,
    getExportSummary
  } from '../lib/exportModifications.js';
  import { toasts } from '../lib/toastStore.js';
  import { getIcon } from '../lib/icons.js';

  export let showAuthorInput = false; // Whether to show author name input
  export let variant = 'primary'; // Button variant: 'primary' | 'secondary'
  export let size = 'medium'; // Button size: 'small' | 'medium' | 'large'

  let summary = {
    totalCount: 0,
    customCount: 0,
    modifiedCount: 0,
    entityTypeCount: 0
  };
  let isExporting = false;
  let showModal = false;
  let authorName = '';

  // Update summary when customModifications changes
  $: if ($customModifications) {
    summary = getExportSummary();
  }

  $: hasModifications = summary.totalCount > 0;
  $: buttonLabel = hasModifications
    ? `Export ${summary.totalCount} modification${summary.totalCount !== 1 ? 's' : ''}`
    : 'No modifications to export';

  /**
   * Handle export button click
   */
  function handleExportClick() {
    if (!hasModifications) {
      return;
    }

    if (showAuthorInput) {
      showModal = true;
    } else {
      performExport();
    }
  }

  /**
   * Perform the export operation
   */
  function performExport(author = '') {
    isExporting = true;

    try {
      const result = exportModifications(author);

      if (result.success) {
        toasts.success(
          `Successfully exported ${result.count} modification${result.count !== 1 ? 's' : ''} to ${result.filename}`,
          { duration: 5000 }
        );
        closeModal();
      } else {
        toasts.error(`Export failed: ${result.error}`, { duration: 7000 });
      }
    } catch (error) {
      console.error('Export error:', error);
      toasts.error(`Export failed: ${error.message}`, { duration: 7000 });
    } finally {
      isExporting = false;
    }
  }

  /**
   * Handle modal export confirmation
   */
  function handleModalExport() {
    performExport(authorName.trim());
  }

  /**
   * Close the modal
   */
  function closeModal() {
    showModal = false;
    authorName = '';
  }

  /**
   * Handle escape key in modal
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && showModal) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<button
  class="export-button"
  class:variant-primary={variant === 'primary'}
  class:variant-secondary={variant === 'secondary'}
  class:size-small={size === 'small'}
  class:size-medium={size === 'medium'}
  class:size-large={size === 'large'}
  disabled={!hasModifications || isExporting}
  on:click={handleExportClick}
  title={hasModifications ? 'Export your custom modifications' : 'No modifications to export'}
  aria-label={buttonLabel}
>
  <span class="icon" aria-hidden="true">
    {@html getIcon('download', 'icon-svg', size === 'small' ? 16 : 20)}
  </span>
  <span class="label">{buttonLabel}</span>
  {#if isExporting}
    <span class="spinner" aria-hidden="true"></span>
  {/if}
</button>

{#if hasModifications && summary.entityTypeCount > 0}
  <div class="export-summary">
    <span class="summary-text">
      {summary.customCount} custom, {summary.modifiedCount} modified
      across {summary.entityTypeCount} type{summary.entityTypeCount !== 1 ? 's' : ''}
    </span>
  </div>
{/if}

{#if showModal}
  <div class="modal-backdrop" on:click={closeModal} aria-hidden="true"></div>
  <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Export Modifications</h2>
        <button
          class="modal-close"
          on:click={closeModal}
          aria-label="Close modal"
          title="Close"
        >
          {@html getIcon('close', 'icon-svg', 20)}
        </button>
      </div>

      <div class="modal-body">
        <p class="modal-description">
          You're about to export {summary.totalCount} modification{summary.totalCount !== 1
            ? 's'
            : ''}.
        </p>

        <div class="form-group">
          <label for="author-name">
            Author Name (Optional)
            <span class="label-hint">Your name or username for attribution</span>
          </label>
          <input
            id="author-name"
            type="text"
            class="form-input"
            bind:value={authorName}
            placeholder="e.g., Your Name or @username"
            maxlength="100"
          />
        </div>

        <div class="export-details">
          <h3>Export Details:</h3>
          <ul>
            <li>{summary.customCount} custom entries</li>
            <li>{summary.modifiedCount} modified entries</li>
            <li>{summary.entityTypeCount} entity type{summary.entityTypeCount !== 1 ? 's' : ''}</li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button class="button button-secondary" on:click={closeModal} disabled={isExporting}>
          Cancel
        </button>
        <button
          class="button button-primary"
          on:click={handleModalExport}
          disabled={isExporting}
        >
          {#if isExporting}
            Exporting...
          {:else}
            Export
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Export Button */
  .export-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-family: var(--font-ui);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
    cursor: pointer;
    border: 1px solid transparent;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      transform var(--transition-fast),
      opacity var(--transition-fast);
  }

  .export-button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .export-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .export-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .export-button:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  /* Button Variants */
  .variant-primary {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
  }

  .variant-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }

  .variant-secondary {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border-color: var(--color-border);
  }

  .variant-secondary:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
  }

  /* Button Sizes */
  .size-small {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
    gap: var(--spacing-xs);
  }

  .size-medium {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
    gap: var(--spacing-sm);
  }

  .size-large {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
    gap: var(--spacing-sm);
  }

  /* Icon */
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Export Summary */
  .export-summary {
    margin-top: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-family: var(--font-ui);
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.2s ease-out;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
    animation: slideIn 0.3s ease-out;
  }

  .modal-content {
    background-color: var(--color-bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    font-family: var(--font-ui);
  }

  .modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
  }

  .modal-close:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .modal-description {
    margin: 0 0 var(--spacing-lg);
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    line-height: 1.5;
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .label-hint {
    display: block;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-secondary);
    margin-top: var(--spacing-xs);
  }

  .form-input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-family: var(--font-ui);
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .form-input:hover {
    border-color: var(--color-border-strong);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px var(--color-border-focus-soft);
  }

  .export-details {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
  }

  .export-details h3 {
    margin: 0 0 var(--spacing-sm);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .export-details ul {
    margin: 0;
    padding-left: var(--spacing-lg);
    list-style: disc;
  }

  .export-details li {
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
  }

  .button {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-family: var(--font-ui);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    border: 1px solid transparent;
    transition: all var(--transition-fast);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-primary {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
  }

  .button-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }

  .button-secondary {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    border-color: var(--color-border);
  }

  .button-secondary:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .modal {
      width: 95%;
      max-width: none;
    }

    .export-button .label {
      display: none;
    }

    .size-small .label,
    .size-medium .label,
    .size-large .label {
      display: inline;
    }
  }
</style>
