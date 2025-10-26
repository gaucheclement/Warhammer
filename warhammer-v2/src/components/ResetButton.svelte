<script>
  /**
   * ResetButton Component
   *
   * Button for resetting custom modifications back to official data.
   * Supports three variants:
   * - individual: Reset a single entity
   * - type: Reset all entities of a specific type
   * - all: Reset all modifications (nuclear option)
   *
   * @prop {string} variant - Reset variant: 'individual' | 'type' | 'all'
   * @prop {string} [entityType] - Type of entity (required for individual and type variants)
   * @prop {string|number} [entityId] - Entity ID (required for individual variant)
   * @prop {Object} [entity] - Entity object (optional, for getting name in confirmation)
   * @prop {boolean} [compact=false] - Show compact button (icon only)
   * @prop {boolean} [disabled=false] - Disable the button
   * @prop {Function} [onReset] - Callback function after successful reset
   */

  import { getIcon } from '$lib/icons.js';
  import { toasts } from '$lib/toastStore.js';
  import {
    resetEntity,
    resetEntityType,
    resetAll,
    getResetConfirmationMessage,
    getResetTypeConfirmationMessage,
    getResetAllConfirmationMessage,
    getModificationCount,
    getTotalModificationCount,
    canResetEntity
  } from '$lib/resetUtils.js';

  export let variant = 'individual'; // 'individual' | 'type' | 'all'
  export let entityType = null;
  export let entityId = null;
  export let entity = null;
  export let compact = false;
  export let disabled = false;
  export let onReset = null;

  let showConfirmDialog = false;
  let isResetting = false;

  // Computed properties
  $: canReset = variant === 'all' || variant === 'type' || (entity && canResetEntity(entity));
  $: modificationCount =
    variant === 'all'
      ? getTotalModificationCount()
      : variant === 'type'
        ? getModificationCount(entityType)
        : 1;

  /**
   * Get button label based on variant
   */
  function getButtonLabel() {
    if (compact) return '';

    switch (variant) {
      case 'individual':
        return 'Reset to Official';
      case 'type':
        return `Reset All ${entityType || 'Modifications'}`;
      case 'all':
        return 'Reset All Modifications';
      default:
        return 'Reset';
    }
  }

  /**
   * Get button icon based on variant
   */
  function getButtonIcon() {
    return variant === 'all' || variant === 'type' ? 'trash' : 'refresh';
  }

  /**
   * Get confirmation message based on variant
   */
  function getConfirmationMessage() {
    switch (variant) {
      case 'individual':
        return getResetConfirmationMessage(entity, entityType);
      case 'type':
        return getResetTypeConfirmationMessage(entityType, modificationCount);
      case 'all':
        return getResetAllConfirmationMessage(modificationCount);
      default:
        return 'Are you sure you want to reset?';
    }
  }

  /**
   * Handle reset button click
   */
  function handleResetClick() {
    if (!canReset || disabled || isResetting) return;

    // Show confirmation dialog
    showConfirmDialog = true;
  }

  /**
   * Handle confirmation
   */
  async function handleConfirm() {
    if (isResetting) return;

    isResetting = true;
    showConfirmDialog = false;

    try {
      let result;

      switch (variant) {
        case 'individual':
          if (!entityType || !entityId) {
            throw new Error('entityType and entityId are required for individual reset');
          }
          result = resetEntity(entityType, entityId);
          break;

        case 'type':
          if (!entityType) {
            throw new Error('entityType is required for type reset');
          }
          result = resetEntityType(entityType);
          break;

        case 'all':
          result = resetAll();
          break;

        default:
          throw new Error(`Unknown variant: ${variant}`);
      }

      if (result.success) {
        toasts.success(result.message);

        // Call onReset callback if provided
        if (onReset) {
          onReset(result);
        }
      } else {
        toasts.error(result.message || 'Failed to reset');
      }
    } catch (error) {
      console.error('Reset error:', error);
      toasts.error(`Reset failed: ${error.message}`);
    } finally {
      isResetting = false;
    }
  }

  /**
   * Handle cancel
   */
  function handleCancel() {
    showConfirmDialog = false;
  }

  /**
   * Handle keyboard events for confirmation dialog
   */
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      handleCancel();
    } else if (event.key === 'Enter') {
      handleConfirm();
    }
  }
</script>

<button
  type="button"
  class="reset-button"
  class:compact
  class:variant-individual={variant === 'individual'}
  class:variant-type={variant === 'type'}
  class:variant-all={variant === 'all'}
  disabled={disabled || !canReset || isResetting}
  on:click={handleResetClick}
  title={getButtonLabel() || 'Reset'}
  aria-label={getButtonLabel() || 'Reset'}
>
  <span class="button-icon" aria-hidden="true">
    {@html getIcon(getButtonIcon(), 'icon-svg', compact ? 16 : 18)}
  </span>
  {#if !compact}
    <span class="button-label">{getButtonLabel()}</span>
  {/if}
  {#if modificationCount > 1 && !compact && variant !== 'individual'}
    <span class="button-count" aria-label="{modificationCount} modifications">
      ({modificationCount})
    </span>
  {/if}
</button>

{#if showConfirmDialog}
  <div
    class="confirmation-dialog-overlay"
    on:click={handleCancel}
    on:keydown={handleKeydown}
    role="presentation"
  >
    <div
      class="confirmation-dialog"
      on:click|stopPropagation
      role="alertdialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div class="dialog-header">
        <h3 id="dialog-title" class="dialog-title">
          {variant === 'all' ? 'Reset All Modifications?' : 'Confirm Reset'}
        </h3>
        <button
          type="button"
          class="dialog-close"
          on:click={handleCancel}
          aria-label="Close dialog"
        >
          {@html getIcon('close', 'icon-svg', 20)}
        </button>
      </div>

      <div class="dialog-content">
        <p id="dialog-message" class="dialog-message">
          {getConfirmationMessage()}
        </p>

        {#if modificationCount > 1}
          <p class="dialog-warning">
            <span class="warning-icon" aria-hidden="true">
              {@html getIcon('alert', 'icon-svg', 20)}
            </span>
            <span>This will affect {modificationCount} modification{modificationCount !== 1 ? 's' : ''}.</span>
          </p>
        {/if}

        <p class="dialog-note">
          This action cannot be undone.
        </p>
      </div>

      <div class="dialog-actions">
        <button
          type="button"
          class="dialog-button button-cancel"
          on:click={handleCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          class="dialog-button button-confirm"
          on:click={handleConfirm}
          disabled={isResetting}
        >
          {isResetting ? 'Resetting...' : 'Reset'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Reset Button Styles */
  .reset-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    font-family: var(--font-ui);
    line-height: 1;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast),
      transform var(--transition-fast);
    white-space: nowrap;
  }

  .reset-button.compact {
    padding: var(--spacing-sm);
    border-radius: var(--radius-full);
  }

  .reset-button:hover:not(:disabled) {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-hover);
    transform: translateY(-1px);
  }

  .reset-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .reset-button:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .reset-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Variant styles */
  .reset-button.variant-individual {
    border-color: var(--color-info);
    color: var(--color-info);
  }

  .reset-button.variant-individual:hover:not(:disabled) {
    background-color: var(--color-info-bg);
    border-color: var(--color-info);
  }

  .reset-button.variant-type {
    border-color: var(--color-warning);
    color: var(--color-warning);
  }

  .reset-button.variant-type:hover:not(:disabled) {
    background-color: var(--color-warning-bg);
    border-color: var(--color-warning);
  }

  .reset-button.variant-all {
    border-color: var(--color-error);
    color: var(--color-error);
  }

  .reset-button.variant-all:hover:not(:disabled) {
    background-color: var(--color-error-bg);
    border-color: var(--color-error);
  }

  .button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .button-icon :global(.icon-svg) {
    display: block;
  }

  .button-label {
    font-size: var(--font-size-sm);
  }

  .button-count {
    font-size: var(--font-size-xs);
    opacity: 0.8;
  }

  /* Confirmation Dialog Styles */
  .confirmation-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: var(--spacing-lg);
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .confirmation-dialog {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow: auto;
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
  }

  .dialog-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0;
  }

  .dialog-close {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xs);
    border: none;
    background: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-fast);
  }

  .dialog-close:hover {
    background-color: var(--color-surface-hover);
  }

  .dialog-close:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .dialog-content {
    padding: var(--spacing-lg);
  }

  .dialog-message {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text);
    font-size: var(--font-size-base);
    line-height: 1.6;
  }

  .dialog-warning {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin: var(--spacing-md) 0;
    padding: var(--spacing-md);
    background-color: var(--color-warning-bg);
    border: 1px solid var(--color-warning);
    border-radius: var(--radius-md);
    color: var(--color-warning);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .warning-icon {
    display: flex;
    flex-shrink: 0;
  }

  .dialog-note {
    margin: var(--spacing-md) 0 0 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-style: italic;
  }

  .dialog-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
  }

  .dialog-button {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    font-family: var(--font-ui);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast);
  }

  .dialog-button:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .dialog-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-cancel {
    background-color: var(--color-surface);
    color: var(--color-text);
  }

  .button-cancel:hover:not(:disabled) {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-hover);
  }

  .button-confirm {
    background-color: var(--color-error);
    border-color: var(--color-error);
    color: white;
  }

  .button-confirm:hover:not(:disabled) {
    background-color: var(--color-error-dark);
    border-color: var(--color-error-dark);
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .confirmation-dialog-overlay,
    .confirmation-dialog {
      animation: none;
    }

    .reset-button {
      transition: none;
    }

    .reset-button:hover:not(:disabled) {
      transform: none;
    }
  }

  @media (prefers-contrast: high) {
    .reset-button {
      border-width: 2px;
      font-weight: var(--font-weight-bold);
    }

    .confirmation-dialog {
      border-width: 2px;
    }
  }
</style>
