<script>
  /**
   * UpdateNotification Component
   * Displays a toast notification when a new app version is available
   * Triggered by Service Worker update detection
   */

  import { fade, fly } from 'svelte/transition'

  let showUpdate = false

  /**
   * Show the update notification
   * Called from Service Worker registration when update is detected
   */
  export function show() {
    showUpdate = true
  }

  /**
   * Hide the update notification
   */
  function dismiss() {
    showUpdate = false
  }

  /**
   * Reload the page to activate the new version
   */
  function updateNow() {
    window.location.reload()
  }
</script>

{#if showUpdate}
  <div
    class="update-notification"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    transition:fly={{ y: 20, duration: 300 }}
  >
    <div class="update-content">
      <div class="update-icon" aria-hidden="true">↻</div>
      <div class="update-message">
        <strong>Update Available</strong>
        <p>A new version of the app is ready to install.</p>
      </div>
    </div>
    <div class="update-actions">
      <button
        class="btn btn-primary update-btn"
        on:click={updateNow}
        aria-label="Update application now"
      >
        Update Now
      </button>
      <button
        class="btn btn-secondary dismiss-btn"
        on:click={dismiss}
        aria-label="Dismiss update notification"
      >
        Later
      </button>
    </div>
  </div>
{/if}

<style>
  .update-notification {
    position: fixed;
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
    z-index: var(--z-toast);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-md);
    max-width: 400px;
    min-width: 300px;
  }

  .update-content {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .update-icon {
    font-size: var(--font-size-2xl);
    flex-shrink: 0;
    line-height: 1;
    color: var(--color-accent);
  }

  .update-message {
    flex: 1;
  }

  .update-message strong {
    display: block;
    font-family: var(--font-heading);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .update-message p {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: 1.4;
  }

  .update-actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
  }

  .update-btn,
  .dismiss-btn {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs) var(--spacing-md);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .update-notification {
      bottom: var(--spacing-md);
      right: var(--spacing-md);
      left: var(--spacing-md);
      max-width: none;
      min-width: 0;
    }

    .update-actions {
      flex-direction: column-reverse;
    }

    .update-btn,
    .dismiss-btn {
      width: 100%;
    }
  }

  /* Accessibility: High contrast mode */
  @media (prefers-contrast: high) {
    .update-notification {
      border-width: 2px;
    }
  }

  /* Accessibility: Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .update-notification {
      animation: none;
    }
  }
</style>
