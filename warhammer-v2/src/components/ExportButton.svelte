<script>
  /**
   * ExportButton Component
   *
   * Provides a button to export custom modifications as a JSON file.
   * Shows the count of modifications to export and allows optional author name input.
   */

  import ActionButton from './ActionButton.svelte';
  import { customModifications } from '../stores/data.js';
  import {
    exportModifications,
    getExportSummary
  } from '../lib/exportModifications.js';
  import { toasts } from '../lib/toastStore.js';

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
</script>

<ActionButton
  {variant}
  {size}
  icon="download"
  label={buttonLabel}
  disabled={!hasModifications || isExporting}
  loading={isExporting}
  {showModal}
  modalConfig={{
    title: 'Export Modifications',
    confirmLabel: 'Export',
    cancelLabel: 'Cancel',
    confirmVariant: 'primary'
  }}
  onClick={handleExportClick}
  onConfirm={handleModalExport}
  onCancel={closeModal}
>
  <svelte:fragment slot="modal-body">
    <p class="modal-description">
      You're about to export {summary.totalCount} modification{summary.totalCount !== 1
        ? 's'
        : ''}.
    </p>

    {#if showAuthorInput}
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
    {/if}

    <div class="export-details">
      <h3>Export Details:</h3>
      <ul>
        <li>{summary.customCount} custom entries</li>
        <li>{summary.modifiedCount} modified entries</li>
        <li>{summary.entityTypeCount} entity type{summary.entityTypeCount !== 1 ? 's' : ''}</li>
      </ul>
    </div>
  </svelte:fragment>
</ActionButton>

{#if hasModifications && summary.entityTypeCount > 0}
  <div class="export-summary">
    <span class="summary-text">
      {summary.customCount} custom, {summary.modifiedCount} modified
      across {summary.entityTypeCount} type{summary.entityTypeCount !== 1 ? 's' : ''}
    </span>
  </div>
{/if}

<style>
  /* Export Summary */
  .export-summary {
    margin-top: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-family: var(--font-ui);
  }

  /* Modal Specific Styles */
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
</style>
