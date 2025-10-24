/**
 * Draft Manager - Auto-save and draft restoration for character creation
 *
 * This module provides functionality for saving character creation progress
 * as drafts to localStorage, with auto-save and manual restore capabilities.
 */

const DRAFT_KEY = 'characterDraft'

/**
 * Save a character draft to localStorage
 * @param {Object} character - Character data to save
 * @returns {Object} Result object with success status
 */
export function saveDraft(character) {
  try {
    const draft = {
      character,
      timestamp: new Date().toISOString(),
      version: 1
    }

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))

    return {
      success: true,
      timestamp: draft.timestamp
    }
  } catch (error) {
    console.error('Failed to save draft:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Load a character draft from localStorage
 * @returns {Object|null} Draft object with character and timestamp, or null if none exists
 */
export function loadDraft() {
  try {
    const draftStr = localStorage.getItem(DRAFT_KEY)

    if (!draftStr) {
      return null
    }

    const draft = JSON.parse(draftStr)

    // Validate draft structure
    if (!draft.character || !draft.timestamp) {
      console.warn('Invalid draft structure, clearing draft')
      clearDraft()
      return null
    }

    return draft
  } catch (error) {
    console.error('Failed to load draft:', error)
    // Clear corrupted draft
    clearDraft()
    return null
  }
}

/**
 * Clear the character draft from localStorage
 * @returns {Object} Result object with success status
 */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
    return {
      success: true
    }
  } catch (error) {
    console.error('Failed to clear draft:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Check if a draft exists in localStorage
 * @returns {boolean} True if a valid draft exists
 */
export function hasDraft() {
  try {
    const draftStr = localStorage.getItem(DRAFT_KEY)

    if (!draftStr) {
      return false
    }

    const draft = JSON.parse(draftStr)
    return !!(draft.character && draft.timestamp)
  } catch (error) {
    console.error('Failed to check for draft:', error)
    return false
  }
}

/**
 * Get draft metadata without loading full character
 * @returns {Object|null} Draft metadata (timestamp, version) or null
 */
export function getDraftMetadata() {
  try {
    const draftStr = localStorage.getItem(DRAFT_KEY)

    if (!draftStr) {
      return null
    }

    const draft = JSON.parse(draftStr)

    if (!draft.timestamp) {
      return null
    }

    return {
      timestamp: draft.timestamp,
      version: draft.version || 1,
      age: Date.now() - new Date(draft.timestamp).getTime()
    }
  } catch (error) {
    console.error('Failed to get draft metadata:', error)
    return null
  }
}

/**
 * Format draft timestamp for display
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted date string
 */
export function formatDraftTimestamp(timestamp) {
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) {
      return 'just now'
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60)
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else {
      const days = Math.floor(diffMins / 1440)
      return `${days} day${days === 1 ? '' : 's'} ago`
    }
  } catch (error) {
    console.error('Failed to format timestamp:', error)
    return 'unknown'
  }
}
