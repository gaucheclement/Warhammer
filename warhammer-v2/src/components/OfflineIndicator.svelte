<script>
  import { onMount, onDestroy } from 'svelte'

  let isOnline = true
  let show = false

  function updateOnlineStatus() {
    const wasOnline = isOnline
    isOnline = navigator.onLine

    // Show banner when going offline
    if (!isOnline && wasOnline) {
      show = true
    }
    // Hide banner when coming back online
    else if (isOnline && !wasOnline) {
      show = false
    }
  }

  function handleOnline() {
    updateOnlineStatus()
  }

  function handleOffline() {
    updateOnlineStatus()
  }

  onMount(() => {
    // Check initial status
    isOnline = navigator.onLine
    show = !isOnline

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onDestroy(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })
</script>

{#if show}
  <div
    class="offline-banner"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="offline-banner-content">
      <svg
        class="offline-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <span class="offline-message">
        You are offline. All data is saved locally and will sync when you reconnect.
      </span>
    </div>
  </div>
{/if}

<style>
  .offline-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-toast);
    animation: slideInDown var(--transition-base);
  }

  .offline-banner-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-warning-bg);
    border-bottom: 2px solid var(--color-warning);
    color: var(--color-warning);
    font-family: var(--font-ui);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .offline-icon {
    flex-shrink: 0;
  }

  .offline-message {
    line-height: var(--line-height-normal);
  }

  @media (prefers-reduced-motion: reduce) {
    .offline-banner {
      animation: none;
    }
  }

  @media (max-width: 768px) {
    .offline-banner-content {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
    }

    .offline-icon {
      width: 16px;
      height: 16px;
    }
  }
</style>
