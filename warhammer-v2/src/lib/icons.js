/**
 * SVG Icon Sprite System
 *
 * This module provides a collection of SVG icons as inline sprites
 * for use throughout the application.
 *
 * Usage in Svelte components:
 * <script>
 *   import { getIcon } from '$lib/icons.js';
 * </script>
 * {@html getIcon('search', 'icon-class')}
 */

/**
 * Icon definitions - SVG paths and viewBox for each icon
 */
export const icons = {
  // Navigation & UI
  menu: {
    viewBox: '0 0 24 24',
    path: '<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  close: {
    viewBox: '0 0 24 24',
    path: '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  search: {
    viewBox: '0 0 24 24',
    path: '<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  chevronDown: {
    viewBox: '0 0 24 24',
    path: '<path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  chevronUp: {
    viewBox: '0 0 24 24',
    path: '<path d="m18 15-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  chevronLeft: {
    viewBox: '0 0 24 24',
    path: '<path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  chevronRight: {
    viewBox: '0 0 24 24',
    path: '<path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },

  // Actions
  plus: {
    viewBox: '0 0 24 24',
    path: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  minus: {
    viewBox: '0 0 24 24',
    path: '<path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  edit: {
    viewBox: '0 0 24 24',
    path: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  trash: {
    viewBox: '0 0 24 24',
    path: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  copy: {
    viewBox: '0 0 24 24',
    path: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  download: {
    viewBox: '0 0 24 24',
    path: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  upload: {
    viewBox: '0 0 24 24',
    path: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  refresh: {
    viewBox: '0 0 24 24',
    path: '<path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  save: {
    viewBox: '0 0 24 24',
    path: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },

  // Status & Feedback
  check: {
    viewBox: '0 0 24 24',
    path: '<path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  checkCircle: {
    viewBox: '0 0 24 24',
    path: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  alert: {
    viewBox: '0 0 24 24',
    path: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0v0zM12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  alertCircle: {
    viewBox: '0 0 24 24',
    path: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  info: {
    viewBox: '0 0 24 24',
    path: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  help: {
    viewBox: '0 0 24 24',
    path: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },

  // Interface elements
  settings: {
    viewBox: '0 0 24 24',
    path: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24 4.24 4.24M1 12h6m6 0h6m-16.36.36 4.24-4.24m4.24-4.24 4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  filter: {
    viewBox: '0 0 24 24',
    path: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  },
  sort: {
    viewBox: '0 0 24 24',
    path: '<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  eye: {
    viewBox: '0 0 24 24',
    path: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>'
  },
  eyeOff: {
    viewBox: '0 0 24 24',
    path: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },

  // Theme
  sun: {
    viewBox: '0 0 24 24',
    path: '<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  moon: {
    viewBox: '0 0 24 24',
    path: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  },

  // Warhammer-specific
  dice: {
    viewBox: '0 0 24 24',
    path: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/>'
  },
  sword: {
    viewBox: '0 0 24 24',
    path: '<path d="M14.5 6.5 19 2l3 3-4.5 4.5M2 19l3.5-3.5M6.5 9.5 2 14l3 3 4.5-4.5M14 10l-3-3M9.5 14.5 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="2" fill="none"/>'
  },
  shield: {
    viewBox: '0 0 24 24',
    path: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  },
  star: {
    viewBox: '0 0 24 24',
    path: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  },
  book: {
    viewBox: '0 0 24 24',
    path: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2" fill="none"/>'
  },
  user: {
    viewBox: '0 0 24 24',
    path: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>'
  },
  users: {
    viewBox: '0 0 24 24',
    path: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },

  // Loading
  spinner: {
    viewBox: '0 0 24 24',
    path: '<path d="M12 2v4m0 12v4M6 12H2m20 0h-4m-2.93-7.07-2.83 2.83m0 8.49-2.83 2.83m11.31 0-2.83-2.83m0-8.49 2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  }
};

/**
 * Get an icon as an SVG string
 * @param {string} name - The icon name
 * @param {string} className - Optional CSS class for styling
 * @param {number} size - Icon size in pixels (default: 24)
 * @returns {string} SVG markup
 */
export function getIcon(name, className = '', size = 24) {
  const icon = icons[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return '';
  }

  return `
    <svg
      class="${className}"
      width="${size}"
      height="${size}"
      viewBox="${icon.viewBox}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      ${icon.path}
    </svg>
  `;
}

/**
 * Get icon component props for Svelte
 * @param {string} name - The icon name
 * @returns {object} Icon properties
 */
export function getIconProps(name) {
  const icon = icons[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return {
    viewBox: icon.viewBox,
    path: icon.path
  };
}

/**
 * Check if an icon exists
 * @param {string} name - The icon name
 * @returns {boolean}
 */
export function hasIcon(name) {
  return name in icons;
}

/**
 * Get all available icon names
 * @returns {string[]}
 */
export function getIconNames() {
  return Object.keys(icons);
}
