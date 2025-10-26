/**
 * Theme Store
 *
 * Centralized store for theme management.
 * Provides reactive theme state that can be used across components.
 */

import { writable } from 'svelte/store';

// Theme preference key for localStorage
const THEME_KEY = 'warhammer-theme';

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme() {
  // Server-side rendering guard
  if (typeof window === 'undefined') {
    return 'dark';
  }

  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'dark'; // Default to dark theme
}

/**
 * Create theme store with custom methods
 */
function createThemeStore() {
  const { subscribe, set, update } = writable(getInitialTheme());

  return {
    subscribe,

    /**
     * Toggle between dark and light themes
     */
    toggle: () => {
      update(current => {
        const newTheme = current === 'dark' ? 'light' : 'dark';

        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(THEME_KEY, newTheme);
          applyTheme(newTheme);

          // Dispatch event for non-Svelte components
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
        }

        return newTheme;
      });
    },

    /**
     * Set a specific theme
     * @param {'dark' | 'light'} newTheme
     */
    set: (newTheme) => {
      if (newTheme !== 'dark' && newTheme !== 'light') {
        console.warn(`Invalid theme: ${newTheme}. Using 'dark' instead.`);
        newTheme = 'dark';
      }

      set(newTheme);

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);

        // Dispatch event for non-Svelte components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
      }
    },

    /**
     * Initialize theme from localStorage/system and set up listeners
     */
    init: () => {
      if (typeof window === 'undefined') return;

      const initialTheme = getInitialTheme();
      set(initialTheme);
      applyTheme(initialTheme, false);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMediaChange = (e) => {
        // Only update if no saved preference
        if (!localStorage.getItem(THEME_KEY)) {
          const newTheme = e.matches ? 'dark' : 'light';
          set(newTheme);
          applyTheme(newTheme);
        }
      };

      mediaQuery.addEventListener('change', handleMediaChange);

      // Listen for storage events (theme changes in other tabs)
      const handleStorageChange = (e) => {
        if (e.key === THEME_KEY && e.newValue) {
          set(e.newValue);
          applyTheme(e.newValue);
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Return cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  };
}

/**
 * Apply theme to document element
 * @param {'dark' | 'light'} theme
 * @param {boolean} animate - Whether to animate the transition
 */
function applyTheme(theme, animate = true) {
  if (typeof window === 'undefined') return;

  if (animate) {
    // Add transitioning class to prevent flash
    document.body.classList.add('theme-transitioning');
  }

  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  if (animate) {
    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300);
  }
}

// Export the store instance
export const theme = createThemeStore();
