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
 *
 * History format:
 * [{type: string, id: string, label: string, timestamp: number}, ...]
 *
 * Issue #38 Stream A: Core navigation logic and state management
 */

import { writable, derived, get } from 'svelte/store';
import { dataQueries } from './dataStore.js';

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
  if (!type || !id) {
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
