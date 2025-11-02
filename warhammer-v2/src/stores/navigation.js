/**
 * Navigation Store
 *
 * Manages navigation history and state for the entity description viewer.
 * Provides back/forward navigation, history tracking, and circular navigation detection.
 *
 * Features:
 * - History stack with max 50 items (FIFO)
 * - Session-only persistence (clears on reload)
 * - Circular navigation detection (A→B→A→B)
 * - Navigation functions: navigateToEntity, navigateBack, navigateForward
 * - Browser history API integration with URL hash sync
 *
 * History format:
 * [{type: string, id: string, label: string, timestamp: number}, ...]
 *
 * Issue #38 Stream A: Core navigation logic and state management
 * Issue #38 Stream C: Browser history API integration
 * Issue #48 Stream B: Updated to use unified data layer (data.js)
 */

import { writable, derived, get } from 'svelte/store';
import { dataQueries } from './data.js';

/**
 * Maximum number of history items to keep
 * Implements FIFO when limit is reached
 */
const MAX_HISTORY_SIZE = 50;

/**
 * Maximum number of identical navigation patterns to allow
 * before considering it circular navigation
 */
const CIRCULAR_NAVIGATION_THRESHOLD = 3;

/**
 * Navigation history entry
 * @typedef {Object} HistoryEntry
 * @property {string} type - Entity type (e.g., 'talents', 'careers')
 * @property {string} id - Entity ID
 * @property {string} label - Display label for the entity
 * @property {number} timestamp - Unix timestamp when navigation occurred
 */

/**
 * Navigation state
 * @typedef {Object} NavigationState
 * @property {HistoryEntry[]} history - Full navigation history
 * @property {number} currentIndex - Current position in history (-1 if no navigation)
 */

/**
 * Create initial navigation state
 * @returns {NavigationState}
 */
function createInitialState() {
  return {
    history: [],
    currentIndex: -1
  };
}

/**
 * Navigation store
 * Stores full navigation state including history and current position
 */
export const navigationState = writable(createInitialState());

/**
 * Current history entry (derived from navigationState)
 * Returns null if no current navigation
 */
export const currentEntry = derived(
  navigationState,
  ($state) => {
    if ($state.currentIndex === -1 || $state.currentIndex >= $state.history.length) {
      return null;
    }
    return $state.history[$state.currentIndex];
  }
);

/**
 * Can navigate back (derived store)
 */
export const canNavigateBack = derived(
  navigationState,
  ($state) => $state.currentIndex > 0
);

/**
 * Can navigate forward (derived store)
 */
export const canNavigateForward = derived(
  navigationState,
  ($state) => $state.currentIndex < $state.history.length - 1
);

/**
 * Get entity label from data store
 * @param {string} type - Entity type
 * @param {string} id - Entity ID
 * @returns {string} Entity label or fallback
 */
function getEntityLabel(type, id) {
  try {
    const entity = dataQueries.getById(type, id);
    // Most entities have 'name', some might have 'label'
    return entity?.name || entity?.label || `${type}:${id}`;
  } catch (error) {
    console.error(`Failed to get label for ${type}:${id}`, error);
    return `${type}:${id}`;
  }
}

/**
 * Detect circular navigation pattern
 * Returns true if last N navigations show a repeating pattern
 *
 * Example: A→B→A→B→A→B is circular (pattern: A→B)
 *
 * @param {HistoryEntry[]} history - Navigation history
 * @returns {boolean} True if circular navigation detected
 */
function detectCircularNavigation(history) {
  if (history.length < 4) return false;

  // Check for alternating pattern (A→B→A→B)
  const last4 = history.slice(-4);
  const pattern = [
    `${last4[0].type}:${last4[0].id}`,
    `${last4[1].type}:${last4[1].id}`,
    `${last4[2].type}:${last4[2].id}`,
    `${last4[3].type}:${last4[3].id}`
  ];

  // Check if pattern is A-B-A-B
  if (pattern[0] === pattern[2] && pattern[1] === pattern[3] && pattern[0] !== pattern[1]) {
    console.warn('Circular navigation detected:', pattern);
    return true;
  }

  // Check for longer patterns (A→B→C→A→B→C)
  if (history.length >= 6) {
    const last6 = history.slice(-6);
    const pattern6 = last6.map(entry => `${entry.type}:${entry.id}`);

    // Check if pattern is A-B-C-A-B-C
    if (pattern6[0] === pattern6[3] &&
        pattern6[1] === pattern6[4] &&
        pattern6[2] === pattern6[5] &&
        pattern6[0] !== pattern6[1] &&
        pattern6[1] !== pattern6[2]) {
      console.warn('Circular navigation detected (3-step):', pattern6);
      return true;
    }
  }

  return false;
}

/**
 * Navigate to an entity
 * Adds entry to history and updates current position
 *
 * @param {string} type - Entity type (e.g., 'talents', 'careers')
 * @param {string} id - Entity ID
 * @returns {boolean} True if navigation succeeded, false if circular navigation blocked
 */
export function navigateToEntity(type, id) {
  if (!type || (id === null || id === undefined)) {
    console.error('navigateToEntity: type and id are required');
    return false;
  }

  const state = get(navigationState);

  // Check if navigating to the same entity
  if (state.currentIndex >= 0 && state.currentIndex < state.history.length) {
    const current = state.history[state.currentIndex];
    if (current.type === type && current.id === id) {
      console.log('Already viewing this entity, skipping navigation');
      return false;
    }
  }

  // Create new entry
  const newEntry = {
    type,
    id,
    label: getEntityLabel(type, id),
    timestamp: Date.now()
  };

  // If we're not at the end of history, remove forward history
  let newHistory;
  if (state.currentIndex < state.history.length - 1) {
    newHistory = state.history.slice(0, state.currentIndex + 1);
  } else {
    newHistory = [...state.history];
  }

  // Add new entry
  newHistory.push(newEntry);

  // Check for circular navigation before committing
  if (detectCircularNavigation(newHistory)) {
    console.warn('Circular navigation blocked');
    return false;
  }

  // Enforce FIFO if max size exceeded
  if (newHistory.length > MAX_HISTORY_SIZE) {
    newHistory.shift(); // Remove oldest entry
  } else {
    // Only increment if we didn't remove an item
  }

  // Update state
  navigationState.set({
    history: newHistory,
    currentIndex: newHistory.length - 1
  });

  // Issue #38: Browser integration disabled - navigation is modal-only
  // updateBrowserHash(type, id);

  console.log(`Navigated to ${type}:${id} (${newEntry.label})`);
  return true;
}

/**
 * Navigate back to previous entry
 * @returns {HistoryEntry|null} Previous entry or null if cannot go back
 */
export function navigateBack() {
  const state = get(navigationState);

  if (state.currentIndex <= 0) {
    console.log('Cannot navigate back: at beginning of history');
    return null;
  }

  const newIndex = state.currentIndex - 1;
  navigationState.update(s => ({
    ...s,
    currentIndex: newIndex
  }));

  const entry = state.history[newIndex];

  // Issue #38: Browser integration disabled - navigation is modal-only
  // updateBrowserHash(entry.type, entry.id);

  console.log(`Navigated back to ${entry.type}:${entry.id} (${entry.label})`);
  return entry;
}

/**
 * Navigate forward to next entry
 * @returns {HistoryEntry|null} Next entry or null if cannot go forward
 */
export function navigateForward() {
  const state = get(navigationState);

  if (state.currentIndex >= state.history.length - 1) {
    console.log('Cannot navigate forward: at end of history');
    return null;
  }

  const newIndex = state.currentIndex + 1;
  navigationState.update(s => ({
    ...s,
    currentIndex: newIndex
  }));

  const entry = state.history[newIndex];

  // Issue #38: Browser integration disabled - navigation is modal-only
  // updateBrowserHash(entry.type, entry.id);

  console.log(`Navigated forward to ${entry.type}:${entry.id} (${entry.label})`);
  return entry;
}

/**
 * Get navigation history
 * @param {number} limit - Max number of entries to return (most recent first)
 * @returns {HistoryEntry[]} History entries
 */
export function getHistory(limit = null) {
  const state = get(navigationState);
  const history = [...state.history].reverse(); // Most recent first
  return limit ? history.slice(0, limit) : history;
}

/**
 * Get breadcrumb trail (last N entries including current)
 * @param {number} count - Number of breadcrumb items
 * @returns {HistoryEntry[]} Breadcrumb entries (oldest to newest)
 */
export function getBreadcrumbs(count = 5) {
  const state = get(navigationState);

  if (state.currentIndex === -1) {
    return [];
  }

  const start = Math.max(0, state.currentIndex - count + 1);
  return state.history.slice(start, state.currentIndex + 1);
}

/**
 * Clear navigation history
 * Resets to initial state
 */
export function clearHistory() {
  navigationState.set(createInitialState());
  console.log('Navigation history cleared');
}

/**
 * Jump to a specific history entry by index
 * @param {number} index - Index in history array
 * @returns {HistoryEntry|null} Entry at index or null if invalid
 */
export function jumpToHistoryIndex(index) {
  const state = get(navigationState);

  if (index < 0 || index >= state.history.length) {
    console.error('Invalid history index:', index);
    return null;
  }

  navigationState.update(s => ({
    ...s,
    currentIndex: index
  }));

  const entry = state.history[index];

  // Issue #38: Browser integration disabled - navigation is modal-only
  // updateBrowserHash(entry.type, entry.id);

  console.log(`Jumped to history index ${index}: ${entry.type}:${entry.id} (${entry.label})`);
  return entry;
}

/**
 * Get current navigation statistics
 * Useful for debugging and testing
 *
 * @returns {Object} Navigation statistics
 */
export function getNavigationStats() {
  const state = get(navigationState);

  return {
    historySize: state.history.length,
    currentIndex: state.currentIndex,
    canGoBack: state.currentIndex > 0,
    canGoForward: state.currentIndex < state.history.length - 1,
    currentEntry: state.currentIndex >= 0 ? state.history[state.currentIndex] : null,
    maxHistorySize: MAX_HISTORY_SIZE
  };
}

// ============================================================================
// Issue #38 Stream C: Browser History API Integration
// ============================================================================

/**
 * Configuration for browser integration
 */
let browserIntegrationEnabled = false;
let isProcessingBrowserEvent = false;

/**
 * Build URL hash for entity navigation
 * Format: #/entity/:type/:id
 *
 * @param {string} type - Entity type
 * @param {string} id - Entity ID
 * @returns {string} URL hash
 */
function buildEntityHash(type, id) {
  return `#/entity/${encodeURIComponent(type)}/${encodeURIComponent(id)}`;
}

/**
 * Parse entity from URL hash
 * Supports format: #/entity/:type/:id
 *
 * @param {string} hash - URL hash (with or without #)
 * @returns {Object|null} {type, id} or null if invalid
 */
function parseEntityHash(hash) {
  // Remove leading # if present
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;

  // Match pattern /entity/:type/:id
  const match = cleanHash.match(/^\/entity\/([^/]+)\/([^/]+)$/);

  if (!match) {
    return null;
  }

  return {
    type: decodeURIComponent(match[1]),
    id: decodeURIComponent(match[2])
  };
}

/**
 * Update browser URL hash without triggering hashchange event
 *
 * @param {string} type - Entity type
 * @param {string} id - Entity ID
 */
function updateBrowserHash(type, id) {
  if (!browserIntegrationEnabled) {
    return;
  }

  const newHash = buildEntityHash(type, id);

  // Check if hash is already correct to avoid unnecessary updates
  if (window.location.hash === newHash) {
    return;
  }

  // Set flag to prevent our own hashchange handler from firing
  isProcessingBrowserEvent = true;

  // Update URL hash
  window.location.hash = newHash;

  // Reset flag after a tick
  setTimeout(() => {
    isProcessingBrowserEvent = false;
  }, 0);
}

/**
 * Handle browser hashchange events
 * Syncs browser back/forward with navigation store
 */
function handleHashChange() {
  // Ignore if we triggered the change ourselves
  if (isProcessingBrowserEvent) {
    return;
  }

  const hash = window.location.hash;
  const parsed = parseEntityHash(hash);

  if (!parsed) {
    // Not an entity navigation hash, ignore
    console.log('Hash change ignored (not entity navigation):', hash);
    return;
  }

  const state = get(navigationState);

  // Check if this entity is already in our history
  // If browser back/forward was pressed, we should jump to that history entry
  let foundIndex = -1;

  for (let i = 0; i < state.history.length; i++) {
    const entry = state.history[i];
    if (entry.type === parsed.type && entry.id === parsed.id) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex !== -1 && foundIndex !== state.currentIndex) {
    // Jump to existing history entry (browser back/forward)
    console.log(`Browser navigation detected: jumping to history index ${foundIndex}`);
    jumpToHistoryIndex(foundIndex);
  } else if (foundIndex === -1) {
    // New navigation from URL (e.g., user typed in address bar)
    console.log('New navigation from URL hash:', parsed);
    navigateToEntity(parsed.type, parsed.id);
  }
  // else: already at this entry, no action needed
}

/**
 * Initialize browser history integration
 * Sets up hashchange event listener and syncs initial state
 *
 * Call this once when the app initializes (e.g., in App.svelte onMount)
 *
 * @returns {Function} Cleanup function to remove event listener
 */
export function initBrowserIntegration() {
  if (browserIntegrationEnabled) {
    console.warn('Browser integration already initialized');
    return () => {};
  }

  browserIntegrationEnabled = true;

  // Set up hashchange listener
  window.addEventListener('hashchange', handleHashChange);

  // Check if there's an entity hash in the URL on init
  const currentHash = window.location.hash;
  const parsed = parseEntityHash(currentHash);

  if (parsed) {
    console.log('Initial entity navigation from URL:', parsed);
    navigateToEntity(parsed.type, parsed.id);
  }

  console.log('Browser history integration initialized');

  // Return cleanup function
  return () => {
    browserIntegrationEnabled = false;
    window.removeEventListener('hashchange', handleHashChange);
    console.log('Browser history integration cleaned up');
  };
}

/**
 * Check if browser integration is enabled
 * @returns {boolean}
 */
export function isBrowserIntegrationEnabled() {
  return browserIntegrationEnabled;
}
