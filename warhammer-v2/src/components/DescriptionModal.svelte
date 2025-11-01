<script>
  /**
   * DescriptionModal Component
   *
   * A modal wrapper for displaying entity descriptions in a full-screen overlay.
   * Integrates the EntityDescription viewer with the Modal base component.
   *
   * Features:
   * - Full viewport overlay with dark backdrop
   * - Centered content area
   * - Close button and Esc keyboard shortcut
   * - Integration with EntityDescription component
   * - Navigation support for cross-reference links
   * - Responsive on mobile (320px+)
   *
   * @prop {string} entityType - Entity type (talent, skill, spell, career, etc.)
   * @prop {string} entityId - Entity ID to display
   * @prop {function} onClose - Callback when modal is closed
   * @prop {function} onNavigate - Callback when user navigates to another entity
   *   Signature: (entityType: string, entityId: string) => void
   */

  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import EntityDescription from './EntityDescription.svelte';

  // Props
  export let entityType = '';
  export let entityId = '';
  export let onClose = null;
  export let onNavigate = null;

  const dispatch = createEventDispatcher();

  /**
   * Handle close event from modal or EntityDescription
   */
  function handleClose() {
    if (onClose) {
      onClose();
    }
    dispatch('close');
  }

  /**
   * Handle navigation event from EntityDescription
   * @param {CustomEvent} event - Event with detail: { entityType, entityId }
   */
  function handleNavigate(event) {
    const { entityType: newType, entityId: newId } = event.detail;

    if (onNavigate) {
      onNavigate(newType, newId);
    }

    dispatch('navigate', {
      entityType: newType,
      entityId: newId
    });
  }
</script>

<Modal
  size="lg"
  onClose={handleClose}
  closeOnBackdrop={true}
  closeOnEscape={true}
>
  <div class="description-modal">
    <EntityDescription
      {entityType}
      {entityId}
      displayMode="modal"
      on:navigate={handleNavigate}
      on:close={handleClose}
    />
  </div>
</Modal>

<style>
  /* ========================================================================
     DescriptionModal Wrapper Styles
     ======================================================================== */

  .description-modal {
    /* Remove any default padding since EntityDescription handles its own layout */
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Ensure EntityDescription fills the modal */
  .description-modal :global(.entity-description) {
    height: 100%;
    max-height: none;
    border-radius: 0;
  }

  /* Override EntityDescription header styles for better modal integration */
  .description-modal :global(.entity-description__header) {
    border-top-left-radius: var(--radius-lg, 12px);
    border-top-right-radius: var(--radius-lg, 12px);
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .description-modal :global(.entity-description__header) {
      border-radius: 0;
    }
  }
</style>
