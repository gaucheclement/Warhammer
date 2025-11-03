<script>
  /**
   * ResetButton Component
   *
   * Button for resetting custom modifications back to official data.
   * Supports three variants:
   * - individual: Reset a single entity
   * - type: Reset all entities of a specific type
   * - all: Reset all modifications (nuclear option)
   */

  import ActionButton from './ActionButton.svelte';
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

  // Button configuration
  $: buttonVariant = variant === 'individual' ? 'info' : variant === 'type' ? 'warning' : 'error';
  $: buttonIcon = variant === 'all' || variant === 'type' ? 'trash' : 'refresh';
  $: buttonLabel = getButtonLabel();

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
   * Get modal title based on variant
   */
  function getModalTitle() {
    return variant === 'all' ? 'Reset All Modifications?' : 'Confirm Reset';
  }

  /**
   * Handle reset button click
   */
  function handleResetClick() {
    if (!canReset || disabled || isResetting) return;
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
</script>

<ActionButton
  variant={buttonVariant}
  size={compact ? 'small' : 'medium'}
  icon={buttonIcon}
  label={buttonLabel}
  {compact}
  disabled={disabled || !canReset || isResetting}
  loading={isResetting}
  showModal={showConfirmDialog}
  modalConfig={{
    title: getModalTitle(),
    confirmLabel: 'Reset',
    cancelLabel: 'Cancel',
    confirmVariant: 'error'
  }}
  onClick={handleResetClick}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
>
  {#if !compact && modificationCount > 1 && variant !== 'individual'}
    <span class="button-count" aria-label="{modificationCount} modifications">
      ({modificationCount})
    </span>
  {/if}

  <svelte:fragment slot="modal-body">
    <p class="dialog-message">
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

    <p class="dialog-note">This action cannot be undone.</p>
  </svelte:fragment>
</ActionButton>

<style>
  .button-count {
    font-size: var(--font-size-xs);
    opacity: 0.8;
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
</style>
