<script>
  /**
   * ImportButton Component
   *
   * Provides a button to import custom modifications from JSON files.
   * Handles file selection, validation, conflict detection, and resolution workflow.
   */

  import ActionButton from './ActionButton.svelte';
  import { getIcon } from '../lib/icons.js';
  import { toasts } from '../lib/toastStore.js';
  import {
    validateImportFile,
    detectConflicts,
    importModifications,
    getImportSummary,
    rollbackImport
  } from '../lib/importModifications.js';
  import ConflictResolver from './ConflictResolver.svelte';

  export let variant = 'primary';
  export let size = 'medium';

  // State management
  let fileInput;
  let isProcessing = false;
  let currentStep = 'idle'; // idle | validating | preview | conflicts | importing | complete
  let importData = null;
  let importSummary = null;
  let conflicts = null;
  let selectedFile = null;
  let importBackup = null;

  // Modal states
  let showPreviewModal = false;
  let showConflictModal = false;

  $: buttonLabel = isProcessing
    ? currentStep === 'validating'
      ? 'Validating...'
      : currentStep === 'importing'
        ? 'Importing...'
        : 'Processing...'
    : 'Import Modifications';

  /**
   * Handle file selection
   */
  async function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    selectedFile = file;
    currentStep = 'validating';
    isProcessing = true;

    try {
      const validation = await validateImportFile(file);

      if (!validation.valid) {
        toasts.error(`Import failed: ${validation.error}`, { duration: 7000 });
        resetState();
        return;
      }

      importData = validation.data;
      importSummary = getImportSummary(importData);
      conflicts = detectConflicts(importData);

      if (conflicts.hasConflicts) {
        currentStep = 'conflicts';
        showConflictModal = true;
      } else {
        currentStep = 'preview';
        showPreviewModal = true;
      }
    } catch (error) {
      console.error('Error processing import file:', error);
      toasts.error(`Import failed: ${error.message}`, { duration: 7000 });
      resetState();
    } finally {
      isProcessing = false;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  /**
   * Handle import confirmation (no conflicts)
   */
  async function handleConfirmImport() {
    currentStep = 'importing';
    isProcessing = true;
    showPreviewModal = false;

    try {
      const result = importModifications(importData, {});

      if (result.success) {
        importBackup = result.backup;
        toasts.success(
          `Successfully imported ${result.imported} modification${result.imported !== 1 ? 's' : ''}`,
          { duration: 5000 }
        );
        currentStep = 'complete';
        resetState();
      } else {
        toasts.error(`Import failed: ${result.error}`, { duration: 7000 });
        resetState();
      }
    } catch (error) {
      console.error('Error importing modifications:', error);
      toasts.error(`Import failed: ${error.message}`, { duration: 7000 });
      resetState();
    } finally {
      isProcessing = false;
    }
  }

  /**
   * Handle conflict resolution
   */
  function handleConflictResolution(resolutions) {
    currentStep = 'importing';
    isProcessing = true;
    showConflictModal = false;

    try {
      const result = importModifications(importData, resolutions);

      if (result.success) {
        importBackup = result.backup;
        const message = `Successfully imported ${result.imported} modification${result.imported !== 1 ? 's' : ''}`;
        const keepMessage = result.kept > 0 ? ` (kept ${result.kept} existing)` : '';
        toasts.success(message + keepMessage, { duration: 5000 });
        currentStep = 'complete';
        resetState();
      } else {
        toasts.error(`Import failed: ${result.error}`, { duration: 7000 });
        resetState();
      }
    } catch (error) {
      console.error('Error importing modifications:', error);
      toasts.error(`Import failed: ${error.message}`, { duration: 7000 });
      resetState();
    } finally {
      isProcessing = false;
    }
  }

  /**
   * Cancel import workflow
   */
  function handleCancel() {
    showPreviewModal = false;
    showConflictModal = false;
    resetState();
  }

  /**
   * Undo last import
   */
  function handleUndo() {
    if (importBackup) {
      const success = rollbackImport(importBackup);
      if (success) {
        toasts.success('Import undone successfully', { duration: 3000 });
        importBackup = null;
      } else {
        toasts.error('Failed to undo import', { duration: 5000 });
      }
    }
  }

  /**
   * Reset state
   */
  function resetState() {
    currentStep = 'idle';
    importData = null;
    importSummary = null;
    conflicts = null;
    selectedFile = null;
    isProcessing = false;
  }

  /**
   * Trigger file input click
   */
  function triggerFileInput() {
    fileInput?.click();
  }

  /**
   * Format file size
   */
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Format date
   */
  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
</script>

<!-- Hidden file input -->
<input
  type="file"
  accept=".json,application/json"
  bind:this={fileInput}
  on:change={handleFileSelect}
  style="display: none;"
  aria-label="Select import file"
/>

<!-- Import Button -->
<ActionButton
  {variant}
  {size}
  icon="upload"
  label={buttonLabel}
  disabled={isProcessing}
  loading={isProcessing}
  showModal={showPreviewModal}
  modalConfig={{
    title: 'Import Preview',
    confirmLabel: 'Import',
    cancelLabel: 'Cancel',
    confirmVariant: 'primary'
  }}
  onClick={triggerFileInput}
  onConfirm={handleConfirmImport}
  onCancel={handleCancel}
>
  <svelte:fragment slot="modal-body">
    {#if selectedFile}
      <div class="file-info">
        <div class="file-info-row">
          <span class="file-info-label">File:</span>
          <span class="file-info-value">{selectedFile.name}</span>
        </div>
        <div class="file-info-row">
          <span class="file-info-label">Size:</span>
          <span class="file-info-value">{formatFileSize(selectedFile.size)}</span>
        </div>
      </div>
    {/if}

    {#if importSummary}
      <div class="import-summary">
        <h3>Import Details</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">{importSummary.totalCount}</div>
            <div class="summary-label">Total Modifications</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{importSummary.customCount}</div>
            <div class="summary-label">Custom Entries</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{importSummary.modifiedCount}</div>
            <div class="summary-label">Modified Entries</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{importSummary.entityTypeCount}</div>
            <div class="summary-label">Entity Types</div>
          </div>
        </div>

        {#if importSummary.author}
          <div class="author-info">
            <span class="author-label">Author:</span>
            <span class="author-value">{importSummary.author}</span>
          </div>
        {/if}

        {#if importSummary.exported}
          <div class="export-date">
            <span class="date-label">Exported:</span>
            <span class="date-value">{formatDate(importSummary.exported)}</span>
          </div>
        {/if}
      </div>

      {#if Object.keys(importSummary.typeBreakdown).length > 0}
        <div class="type-breakdown">
          <h3>Breakdown by Type</h3>
          <div class="type-list">
            {#each Object.entries(importSummary.typeBreakdown) as [entityType, counts]}
              <div class="type-item">
                <span class="type-name">{entityType}</span>
                <span class="type-count">
                  {counts.total} total
                  {#if counts.custom > 0}
                    ({counts.custom} custom
                  {/if}
                  {#if counts.modified > 0}
                    {counts.custom > 0 ? ', ' : '('}{counts.modified} modified)
                  {:else if counts.custom > 0}
                    )
                  {/if}
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="import-notice">
        <div class="notice-icon">
          {@html getIcon('info', 'icon-svg', 20)}
        </div>
        <div class="notice-text">
          No conflicts detected. All modifications will be added to your collection.
        </div>
      </div>
    {/if}
  </svelte:fragment>
</ActionButton>

<!-- Undo Button (shown after successful import) -->
{#if importBackup && currentStep === 'complete'}
  <button class="undo-button" on:click={handleUndo} title="Undo last import" aria-label="Undo import">
    {@html getIcon('refresh', 'icon-svg', 16)}
    <span>Undo Import</span>
  </button>
{/if}

<!-- Conflict Modal -->
{#if showConflictModal && conflicts}
  <div class="modal-backdrop conflict-backdrop" aria-hidden="true"></div>
  <div class="modal conflict-modal" role="dialog" aria-modal="true">
    <ConflictResolver {conflicts} onResolve={handleConflictResolution} onCancel={handleCancel} />
  </div>
{/if}

<style>
  /* File Info */
  .file-info {
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-lg);
  }

  .file-info-row {
    display: flex;
    gap: var(--spacing-sm);
    padding: var(--spacing-xs) 0;
  }

  .file-info-label {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    min-width: 80px;
  }

  .file-info-value {
    color: var(--color-text-primary);
  }

  /* Import Summary */
  .import-summary {
    margin-bottom: var(--spacing-lg);
  }

  .import-summary h3 {
    margin: 0 0 var(--spacing-md);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    text-align: center;
  }

  .summary-value {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
  }

  .summary-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }

  .author-info,
  .export-date {
    display: flex;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0;
    font-size: var(--font-size-sm);
  }

  .author-label,
  .date-label {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }

  .author-value,
  .date-value {
    color: var(--color-text-primary);
  }

  /* Type Breakdown */
  .type-breakdown {
    margin-bottom: var(--spacing-lg);
  }

  .type-breakdown h3 {
    margin: 0 0 var(--spacing-md);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .type-list {
    display: grid;
    gap: var(--spacing-xs);
  }

  .type-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-sm);
  }

  .type-name {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .type-count {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  /* Import Notice */
  .import-notice {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-info-bg);
    border: 1px solid var(--color-info);
    border-radius: var(--radius-md);
    color: var(--color-info);
  }

  .notice-icon {
    display: flex;
    flex-shrink: 0;
  }

  .notice-text {
    flex: 1;
    font-size: var(--font-size-sm);
    line-height: 1.5;
  }

  /* Undo Button */
  .undo-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    margin-left: var(--spacing-sm);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .undo-button:hover {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
    color: var(--color-text-primary);
  }

  /* Conflict Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.2s ease-out;
  }

  .conflict-backdrop {
    z-index: 1001;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    animation: slideIn 0.3s ease-out;
  }

  .conflict-modal {
    max-width: 1000px;
    z-index: 1002;
  }

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

  /* Responsive */
  @media (max-width: 768px) {
    .summary-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .type-item {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs);
    }
  }
</style>
