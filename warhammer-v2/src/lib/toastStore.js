/**
 * Toast notification store
 * Manages toast messages with auto-dismiss and stacking
 */

import { writable } from 'svelte/store';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Default duration in milliseconds
const DEFAULT_DURATION = 5000;

// Internal store
const { subscribe, update } = writable([]);

let nextId = 1;

/**
 * Add a toast notification
 * @param {Object} options - Toast options
 * @param {string} options.message - Toast message
 * @param {string} [options.type='info'] - Toast type (success, error, warning, info)
 * @param {number} [options.duration=5000] - Duration in ms (0 for no auto-dismiss)
 * @param {boolean} [options.dismissible=true] - Can be manually dismissed
 * @returns {number} Toast ID
 */
function addToast({ message, type = TOAST_TYPES.INFO, duration = DEFAULT_DURATION, dismissible = true }) {
  const id = nextId++;
  const toast = {
    id,
    message,
    type,
    duration,
    dismissible,
    createdAt: Date.now(),
    paused: false
  };

  update(toasts => [...toasts, toast]);

  // Auto-dismiss if duration is set
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

/**
 * Remove a toast by ID
 * @param {number} id - Toast ID
 */
function removeToast(id) {
  update(toasts => toasts.filter(t => t.id !== id));
}

/**
 * Pause auto-dismiss for a toast
 * @param {number} id - Toast ID
 */
function pauseToast(id) {
  update(toasts => toasts.map(t => t.id === id ? { ...t, paused: true } : t));
}

/**
 * Resume auto-dismiss for a toast
 * @param {number} id - Toast ID
 */
function resumeToast(id) {
  update(toasts => toasts.map(t => t.id === id ? { ...t, paused: false } : t));
}

/**
 * Clear all toasts
 */
function clearAll() {
  update(() => []);
}

/**
 * Convenience methods for each toast type
 */
function success(message, options = {}) {
  return addToast({ message, type: TOAST_TYPES.SUCCESS, ...options });
}

function error(message, options = {}) {
  return addToast({ message, type: TOAST_TYPES.ERROR, ...options });
}

function warning(message, options = {}) {
  return addToast({ message, type: TOAST_TYPES.WARNING, ...options });
}

function info(message, options = {}) {
  return addToast({ message, type: TOAST_TYPES.INFO, ...options });
}

// Export toast store
export const toasts = {
  subscribe,
  add: addToast,
  remove: removeToast,
  pause: pauseToast,
  resume: resumeToast,
  clearAll,
  success,
  error,
  warning,
  info
};
