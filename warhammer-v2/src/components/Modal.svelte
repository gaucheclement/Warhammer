<script>
  /**
   * ThemeToggle Component
   *
   * Provides a button to toggle between dark and light themes.
   * Uses the centralized theme store for state management.
   */

  import { onMount } from 'svelte';
  import { getIcon } from '$lib/icons.js';
  import { theme } from '../stores/theme.js';

  let mounted = false;
  let cleanup;

  /**
   * Initialize theme system on mount
   */
  onMount(() => {
    cleanup = theme.init();
    mounted = true;

    return () => {
      if (cleanup) cleanup();
    };
  });

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    theme.toggle();
  }

  /**
   * Get the aria-label for the toggle button
   */
  $: ariaLabel = $theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
</script>

<button
  class="theme-toggle"
  on:click={toggleTheme}
  aria-label={ariaLabel}
  title={ariaLabel}
  class:mounted
>
  <span class="icon" class:visible={$theme === 'dark'}>
    {@html getIcon('moon', 'icon-svg', 20)}
  </span>
  <span class="icon" class:visible={$theme === 'light'}>
    {@html getIcon('sun', 'icon-svg', 20)}
  </span>
  <span class="sr-only">{ariaLabel}</span>
</button>

<style>
  .theme-toggle {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      transform var(--transition-fast);
    overflow: hidden;
  }

  .theme-toggle:hover {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
    transform: scale(1.05);
  }

  .theme-toggle:active {
    transform: scale(0.95);
  }

  .theme-toggle:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  /* Hide until mounted to avoid flash */
  .theme-toggle:not(.mounted) {
    opacity: 0;
    pointer-events: none;
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition:
      transform var(--transition-base),
      opacity var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-primary);
  }

  .icon.visible {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  .icon :global(.icon-svg) {
    display: block;
  }

  /* Screen reader only text */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .theme-toggle {
      border-width: 2px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .theme-toggle,
    .icon {
      transition: none;
    }
  }
</style>
