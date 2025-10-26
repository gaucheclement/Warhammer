<script>
  /**
   * EditMode Component
   *
   * Toggle button to enable/disable global edit mode
   * When enabled, all data entries show edit buttons for inline modification
   */

  import { getIcon } from '$lib/icons.js';
  import { editModeEnabled, toggleEditMode } from '../stores/editMode.js';

  /**
   * Toggle edit mode on button click
   */
  function handleToggle() {
    toggleEditMode();
  }

  /**
   * Get the aria-label for the toggle button
   */
  $: ariaLabel = $editModeEnabled ? 'Disable edit mode' : 'Enable edit mode';
  $: buttonText = $editModeEnabled ? 'Edit Mode: ON' : 'Edit Mode: OFF';
</script>

<button
  class="edit-mode-toggle"
  class:enabled={$editModeEnabled}
  on:click={handleToggle}
  aria-label={ariaLabel}
  aria-pressed={$editModeEnabled}
  title={ariaLabel}
>
  <span class="icon" aria-hidden="true">
    {@html getIcon('edit', 'icon-svg', 20)}
  </span>
  <span class="label">{buttonText}</span>
  {#if $editModeEnabled}
    <span class="status-indicator" aria-hidden="true"></span>
  {/if}
</button>

<style>
  .edit-mode-toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    border-radius: var(--radius-md, 6px);
    background-color: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid var(--color-border, #ddd);
    cursor: pointer;
    font-family: var(--font-ui, sans-serif);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text-primary, #333);
    transition:
      background-color var(--transition-fast, 0.15s),
      border-color var(--transition-fast, 0.15s),
      color var(--transition-fast, 0.15s),
      transform var(--transition-fast, 0.15s);
  }

  .edit-mode-toggle:hover {
    background-color: var(--color-bg-tertiary, #e5e5e5);
    border-color: var(--color-border-strong, #999);
    transform: translateY(-1px);
  }

  .edit-mode-toggle:active {
    transform: translateY(0);
  }

  .edit-mode-toggle:focus-visible {
    outline: var(--focus-ring-width, 2px) solid var(--color-border-focus, #0066cc);
    outline-offset: var(--focus-ring-offset, 2px);
  }

  /* Enabled state */
  .edit-mode-toggle.enabled {
    background-color: var(--color-warning-bg, #fff7e6);
    border-color: var(--color-warning, #ff9800);
    color: var(--color-warning, #ff9800);
  }

  .edit-mode-toggle.enabled:hover {
    background-color: var(--color-warning-bg-hover, #fff3d6);
    border-color: var(--color-warning-hover, #f57c00);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .icon :global(.icon-svg) {
    display: block;
    width: 20px;
    height: 20px;
  }

  .label {
    font-weight: var(--font-weight-semibold, 600);
    letter-spacing: 0.025em;
  }

  /* Animated status indicator when enabled */
  .status-indicator {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background-color: var(--color-warning, #ff9800);
    border: 2px solid var(--color-bg-primary, #fff);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .edit-mode-toggle {
      border-width: 3px;
      font-weight: var(--font-weight-bold, 700);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .edit-mode-toggle {
      transition: none;
    }

    .status-indicator {
      animation: none;
    }

    .edit-mode-toggle:hover {
      transform: none;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .edit-mode-toggle {
      padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
      font-size: var(--font-size-xs, 0.75rem);
    }

    .icon :global(.icon-svg) {
      width: 16px;
      height: 16px;
    }
  }
</style>
