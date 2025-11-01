<script>
  /**
   * Modal Component
   *
   * A reusable modal dialog component that provides:
   * - Full viewport overlay with dark backdrop
   * - Centered content area
   * - Close button and keyboard shortcuts (Esc)
   * - Click-outside to close
   * - Responsive design for mobile
   *
   * @prop {string} title - Modal title (optional)
   * @prop {function} onClose - Callback function when modal is closed
   * @prop {boolean} closeOnBackdrop - Whether clicking backdrop closes modal (default: true)
   * @prop {boolean} closeOnEscape - Whether Esc key closes modal (default: true)
   * @prop {string} size - Modal size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
   */

  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  // Props
  export let title = '';
  export let onClose = null;
  export let closeOnBackdrop = true;
  export let closeOnEscape = true;
  export let size = 'md';

  const dispatch = createEventDispatcher();

  // Handle Escape key press
  function handleKeydown(event) {
    if (closeOnEscape && event.key === 'Escape') {
      close();
    }
  }

  // Handle backdrop click
  function handleBackdropClick(event) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      close();
    }
  }

  // Close the modal
  function close() {
    if (onClose) {
      onClose();
    }
    dispatch('close');
  }

  // Set up keyboard listener on mount
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = '';
    };
  });

  // Clean up on destroy
  onDestroy(() => {
    document.body.style.overflow = '';
  });
</script>

<div class="modal-backdrop" on:click={handleBackdropClick} role="presentation">
  <div class="modal-container modal-container--{size}" role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
    {#if title}
      <div class="modal-header">
        <h2 id="modal-title" class="modal-title">{title}</h2>
        <button
          class="modal-close-btn"
          on:click={close}
          aria-label="Close modal"
          title="Close"
        >
          <span class="modal-close-icon" aria-hidden="true">&times;</span>
        </button>
      </div>
    {/if}

    <div class="modal-body">
      <slot />
    </div>
  </div>
</div>

<style>
  /* ========================================================================
     Modal Backdrop and Container
     ======================================================================== */

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md, 1rem);
    z-index: 1000;
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

  .modal-container {
    background-color: var(--color-bg-primary, #ffffff);
    border-radius: var(--radius-lg, 12px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Size variants */
  .modal-container--sm {
    width: 100%;
    max-width: 400px;
  }

  .modal-container--md {
    width: 100%;
    max-width: 600px;
  }

  .modal-container--lg {
    width: 100%;
    max-width: 800px;
  }

  .modal-container--xl {
    width: 100%;
    max-width: 1200px;
  }

  /* Modal Header */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg, 1.5rem);
    border-bottom: 1px solid var(--color-border, #e5e7eb);
    background-color: var(--color-bg-secondary, #f9fafb);
    flex-shrink: 0;
  }

  .modal-title {
    margin: 0;
    font-size: var(--font-size-xl, 1.25rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #111827);
    line-height: 1.2;
  }

  .modal-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: var(--color-text-secondary, #6b7280);
    cursor: pointer;
    border-radius: var(--radius-md, 8px);
    transition:
      background-color var(--transition-fast, 0.15s),
      color var(--transition-fast, 0.15s);
    flex-shrink: 0;
  }

  .modal-close-btn:hover {
    background-color: var(--color-bg-tertiary, #f3f4f6);
    color: var(--color-text-primary, #111827);
  }

  .modal-close-btn:focus-visible {
    outline: var(--focus-ring-width, 2px) solid var(--color-border-focus, #3b82f6);
    outline-offset: var(--focus-ring-offset, 2px);
  }

  .modal-close-icon {
    font-size: 28px;
    line-height: 1;
    font-weight: var(--font-weight-normal, 400);
  }

  /* Modal Body */
  .modal-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Responsive Breakpoints */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: var(--spacing-sm, 0.5rem);
    }

    .modal-container {
      max-height: 95vh;
    }

    .modal-header {
      padding: var(--spacing-md, 1rem);
    }

    .modal-title {
      font-size: var(--font-size-lg, 1.125rem);
    }
  }

  @media (max-width: 480px) {
    .modal-backdrop {
      padding: 0;
    }

    .modal-container {
      max-height: 100vh;
      border-radius: 0;
      width: 100%;
      max-width: 100%;
    }

    .modal-header {
      padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
    }

    .modal-title {
      font-size: var(--font-size-base, 1rem);
    }

    .modal-close-btn {
      width: 32px;
      height: 32px;
    }

    .modal-close-icon {
      font-size: 24px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .modal-backdrop,
    .modal-container {
      animation: none;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .modal-container {
      border: 2px solid currentColor;
    }

    .modal-header {
      border-bottom-width: 2px;
    }
  }
</style>
