<script>
  /**
   * Badge Component
   *
   * Visual indicator for content modification status
   * Used to distinguish official, custom, modified, and deleted content
   *
   * @prop {string} type - Badge type: 'official' | 'custom' | 'modified' | 'deleted'
   * @prop {boolean} minimal - Show minimal badge (icon only) or full badge with text
   */

  import { getIcon } from '$lib/icons.js';

  export let type = 'official';
  export let minimal = false;

  /**
   * Configuration for each badge type
   */
  const badgeConfig = {
    official: {
      label: 'Official',
      icon: 'checkCircle',
      className: 'badge-official',
      ariaLabel: 'Official content'
    },
    custom: {
      label: 'Custom',
      icon: 'plus',
      className: 'badge-custom',
      ariaLabel: 'Custom content'
    },
    modified: {
      label: 'Modified',
      icon: 'edit',
      className: 'badge-modified',
      ariaLabel: 'Modified content'
    },
    deleted: {
      label: 'Deleted',
      icon: 'close',
      className: 'badge-deleted',
      ariaLabel: 'Deleted content'
    }
  };

  // Get the configuration for the current type
  $: config = badgeConfig[type] || badgeConfig.official;
  $: showBadge = type !== 'official'; // Don't show badge for official content by default
</script>

{#if showBadge}
  <span
    class="badge {config.className}"
    class:minimal
    role="status"
    aria-label={config.ariaLabel}
    title={config.label}
  >
    <span class="badge-icon" aria-hidden="true">
      {@html getIcon(config.icon, 'icon-svg', 16)}
    </span>
    {#if !minimal}
      <span class="badge-label">{config.label}</span>
    {/if}
  </span>
{/if}

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    font-family: var(--font-ui);
    line-height: 1;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      transform var(--transition-fast);
    white-space: nowrap;
  }

  .badge.minimal {
    padding: var(--spacing-xs);
    border-radius: var(--radius-full);
  }

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .badge-icon :global(.icon-svg) {
    display: block;
    width: 16px;
    height: 16px;
  }

  .badge-label {
    font-size: var(--font-size-xs);
    letter-spacing: 0.025em;
  }

  /* Official badge - Green (typically hidden) */
  .badge-official {
    background-color: var(--color-success-bg);
    color: var(--color-success);
    border: 1px solid var(--color-success);
  }

  /* Custom badge - Blue */
  .badge-custom {
    background-color: var(--color-info-bg);
    color: var(--color-info);
    border: 1px solid var(--color-info);
  }

  /* Modified badge - Orange/Gold */
  .badge-modified {
    background-color: var(--color-warning-bg);
    color: var(--color-warning);
    border: 1px solid var(--color-warning);
  }

  /* Deleted badge - Red */
  .badge-deleted {
    background-color: var(--color-error-bg);
    color: var(--color-error);
    border: 1px solid var(--color-error);
  }

  /* Hover effects */
  .badge:hover {
    transform: scale(1.05);
  }

  /* Focus visible for accessibility */
  .badge:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .badge {
      border-width: 2px;
      font-weight: var(--font-weight-bold);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .badge {
      transition: none;
    }

    .badge:hover {
      transform: none;
    }
  }

  /* Dark theme adjustments - already handled by CSS variables */
  /* Light theme adjustments - already handled by CSS variables */
</style>
