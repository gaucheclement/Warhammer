/**
 * Edit Mode Store
 *
 * Manages the global edit mode state for the application.
 * When edit mode is enabled, all data entries show edit buttons.
 */

import { writable } from 'svelte/store';

/**
 * Edit mode state
 * @type {import('svelte/store').Writable<boolean>}
 */
export const editModeEnabled = writable(false);

/**
 * Currently editing entity (if any)
 * @type {import('svelte/store').Writable<{entityType: string, entity: Object} | null>}
 */
export const currentlyEditing = writable(null);

/**
 * Enable edit mode
 */
export function enableEditMode() {
  editModeEnabled.set(true);
  console.log('Edit mode enabled');
}

/**
 * Disable edit mode
 */
export function disableEditMode() {
  editModeEnabled.set(false);
  currentlyEditing.set(null);
  console.log('Edit mode disabled');
}

/**
 * Toggle edit mode on/off
 */
export function toggleEditMode() {
  editModeEnabled.update(enabled => {
    const newState = !enabled;
    if (!newState) {
      currentlyEditing.set(null);
    }
    console.log('Edit mode', newState ? 'enabled' : 'disabled');
    return newState;
  });
}

/**
 * Start editing an entity
 * @param {string} entityType - Type of entity (e.g., 'talents', 'skills')
 * @param {Object} entity - The entity to edit
 */
export function startEditing(entityType, entity) {
  currentlyEditing.set({ entityType, entity });
}

/**
 * Stop editing (close editor)
 */
export function stopEditing() {
  currentlyEditing.set(null);
}
