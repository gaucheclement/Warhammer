/**
 * Character Store - Reactive state management for character persistence
 *
 * This module provides Svelte stores for managing character data with IndexedDB persistence.
 * It follows the same patterns as dataStore.js and customModifications.js.
 *
 * Features:
 * - CRUD operations for characters
 * - Auto-save with debounce
 * - Character validation
 * - Search and filtering
 * - Character versioning support
 * - Reactive Svelte stores
 *
 * Architecture:
 * - characters: Writable store with all characters
 * - currentCharacter: Writable store with active character
 * - Auto-save functionality with configurable debounce
 */

import { writable, derived, get } from 'svelte/store'
import { db } from '../lib/db.js'
import {
  createEmptyCharacter,
  validateCharacter,
  sanitizeCharacter,
  needsMigration
} from '../utils/characterSchema.js'

/**
 * All characters from IndexedDB
 * @type {import('svelte/store').Writable<Array>}
 */
export const characters = writable([])

/**
 * Currently active/editing character
 * @type {import('svelte/store').Writable<Object|null>}
 */
export const currentCharacter = writable(null)

/**
 * Loading state for character operations
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isCharacterLoading = writable(false)

/**
 * Error state for character operations
 * @type {import('svelte/store').Writable<string|null>}
 */
export const characterError = writable(null)

/**
 * Auto-save state
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isAutoSaving = writable(false)

/**
 * Auto-save enabled flag
 * @type {import('svelte/store').Writable<boolean>}
 */
export const autoSaveEnabled = writable(true)

// Debounce timer for auto-save
let autoSaveTimer = null
const AUTO_SAVE_DELAY = 2000 // 2 seconds

/**
 * Load all characters from IndexedDB
 * @returns {Promise<void>}
 */
export async function loadCharacters() {
  try {
    isCharacterLoading.set(true)
    characterError.set(null)

    const data = await db.characters.toArray()

    // Sort by updated timestamp (most recent first)
    data.sort((a, b) => new Date(b.updated) - new Date(a.updated))

    characters.set(data)
    console.log(`Loaded ${data.length} characters`)
  } catch (error) {
    console.error('Error loading characters:', error)
    characterError.set('Failed to load characters: ' + error.message)
    throw error
  } finally {
    isCharacterLoading.set(false)
  }
}

/**
 * Get a character by ID
 * @param {number} id - Character ID
 * @returns {Promise<Object|undefined>}
 */
export async function getCharacter(id) {
  try {
    characterError.set(null)
    const character = await db.characters.get(id)

    if (character && needsMigration(character)) {
      console.warn('Character needs migration:', id)
      // TODO: Apply migrations when needed
    }

    return character
  } catch (error) {
    console.error('Error getting character:', error)
    characterError.set('Failed to get character: ' + error.message)
    throw error
  }
}

/**
 * Load a character by ID and set as current
 * @param {number} id - Character ID
 * @returns {Promise<Object|undefined>}
 */
export async function loadCharacter(id) {
  try {
    isCharacterLoading.set(true)
    const character = await getCharacter(id)

    if (character) {
      currentCharacter.set(character)
    } else {
      characterError.set('Character not found')
    }

    return character
  } catch (error) {
    console.error('Error loading character:', error)
    throw error
  } finally {
    isCharacterLoading.set(false)
  }
}

/**
 * Create a new character
 * @param {Object} [characterData] - Initial character data (optional)
 * @returns {Promise<number>} Character ID
 */
export async function createCharacter(characterData = null) {
  try {
    characterError.set(null)

    // Create base character
    const character = characterData || createEmptyCharacter()

    // Update timestamps
    character.created = new Date().toISOString()
    character.updated = new Date().toISOString()

    // Validate
    const validation = validateCharacter(character)
    if (!validation.valid) {
      throw new Error('Validation failed: ' + validation.errors.join(', '))
    }

    // Sanitize and save
    const cleanCharacter = sanitizeCharacter(character)
    const id = await db.characters.add(cleanCharacter)

    console.log('Created character:', id)

    // Reload characters list
    await loadCharacters()

    return id
  } catch (error) {
    console.error('Error creating character:', error)
    characterError.set('Failed to create character: ' + error.message)
    throw error
  }
}

/**
 * Update an existing character
 * @param {number} id - Character ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updateCharacter(id, updates) {
  try {
    characterError.set(null)

    // Get existing character
    const existing = await db.characters.get(id)
    if (!existing) {
      throw new Error('Character not found')
    }

    // Merge updates
    const updated = {
      ...existing,
      ...updates,
      updated: new Date().toISOString()
    }

    // Validate
    const validation = validateCharacter(updated)
    if (!validation.valid) {
      throw new Error('Validation failed: ' + validation.errors.join(', '))
    }

    // Sanitize and save
    const cleanCharacter = sanitizeCharacter(updated)
    await db.characters.put(cleanCharacter)

    console.log('Updated character:', id)

    // Update current character if it's the one being edited
    const current = get(currentCharacter)
    if (current && current.id === id) {
      currentCharacter.set(cleanCharacter)
    }

    // Reload characters list
    await loadCharacters()
  } catch (error) {
    console.error('Error updating character:', error)
    characterError.set('Failed to update character: ' + error.message)
    throw error
  }
}

/**
 * Delete a character
 * @param {number} id - Character ID
 * @returns {Promise<void>}
 */
export async function deleteCharacter(id) {
  try {
    characterError.set(null)

    await db.characters.delete(id)

    console.log('Deleted character:', id)

    // Clear current character if it's the one being deleted
    const current = get(currentCharacter)
    if (current && current.id === id) {
      currentCharacter.set(null)
    }

    // Reload characters list
    await loadCharacters()
  } catch (error) {
    console.error('Error deleting character:', error)
    characterError.set('Failed to delete character: ' + error.message)
    throw error
  }
}

/**
 * List all characters (from store, no DB access)
 * @returns {Array}
 */
export function listCharacters() {
  return get(characters)
}

/**
 * Search characters by name, species, or career
 * @param {string} query - Search query
 * @returns {Promise<Array>}
 */
export async function searchCharacters(query) {
  try {
    characterError.set(null)

    if (!query || query.trim() === '') {
      return await db.characters.toArray()
    }

    const searchLower = query.toLowerCase()

    const results = await db.characters
      .filter(char => {
        // Search in name
        if (char.name && char.name.toLowerCase().includes(searchLower)) {
          return true
        }

        // Search in species name
        if (char.specie && char.specie.data && char.specie.data.label) {
          if (char.specie.data.label.toLowerCase().includes(searchLower)) {
            return true
          }
        }

        // Search in career name
        if (char.careerLevel && char.careerLevel.data && char.careerLevel.data.label) {
          if (char.careerLevel.data.label.toLowerCase().includes(searchLower)) {
            return true
          }
        }

        return false
      })
      .toArray()

    return results
  } catch (error) {
    console.error('Error searching characters:', error)
    characterError.set('Failed to search characters: ' + error.message)
    throw error
  }
}

/**
 * Get characters by species ID
 * @param {string} speciesId - Species ID
 * @returns {Promise<Array>}
 */
export async function getCharactersBySpecies(speciesId) {
  try {
    return await db.characters
      .filter(char => char.specie && char.specie.id === speciesId)
      .toArray()
  } catch (error) {
    console.error('Error getting characters by species:', error)
    throw error
  }
}

/**
 * Get characters by career ID
 * @param {string} careerId - Career ID
 * @returns {Promise<Array>}
 */
export async function getCharactersByCareer(careerId) {
  try {
    return await db.characters
      .filter(char => {
        // Check if careerLevel exists and has the career reference
        if (char.careerLevel && char.careerLevel.data) {
          return char.careerLevel.data.career === careerId
        }
        return false
      })
      .toArray()
  } catch (error) {
    console.error('Error getting characters by career:', error)
    throw error
  }
}

/**
 * Clone a character
 * @param {number} id - Character ID to clone
 * @param {string} [newName] - New name for clone
 * @returns {Promise<number>} New character ID
 */
export async function cloneCharacter(id, newName) {
  try {
    characterError.set(null)

    const original = await getCharacter(id)
    if (!original) {
      throw new Error('Character not found')
    }

    // Create clone
    const clone = JSON.parse(JSON.stringify(original))
    delete clone.id

    clone.name = newName || `${original.name} (Copy)`
    clone.created = new Date().toISOString()
    clone.updated = new Date().toISOString()

    // Save clone
    return await createCharacter(clone)
  } catch (error) {
    console.error('Error cloning character:', error)
    characterError.set('Failed to clone character: ' + error.message)
    throw error
  }
}

/**
 * Auto-save current character with debounce
 * Call this whenever the current character is modified
 * @returns {void}
 */
export function scheduleAutoSave() {
  const enabled = get(autoSaveEnabled)
  if (!enabled) {
    return
  }

  // Clear existing timer
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }

  // Schedule new save
  autoSaveTimer = setTimeout(async () => {
    try {
      const character = get(currentCharacter)
      if (!character || !character.id) {
        return
      }

      isAutoSaving.set(true)

      await updateCharacter(character.id, character)

      console.log('Auto-saved character:', character.id)
    } catch (error) {
      console.error('Auto-save failed:', error)
      // Don't throw - auto-save failures should be silent
    } finally {
      isAutoSaving.set(false)
    }
  }, AUTO_SAVE_DELAY)
}

/**
 * Manually trigger auto-save immediately (bypass debounce)
 * @returns {Promise<void>}
 */
export async function saveNow() {
  try {
    const character = get(currentCharacter)
    if (!character || !character.id) {
      throw new Error('No character to save')
    }

    // Clear pending auto-save
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
      autoSaveTimer = null
    }

    isAutoSaving.set(true)

    await updateCharacter(character.id, character)

    console.log('Manually saved character:', character.id)
  } catch (error) {
    console.error('Manual save failed:', error)
    characterError.set('Failed to save character: ' + error.message)
    throw error
  } finally {
    isAutoSaving.set(false)
  }
}

/**
 * Enable or disable auto-save
 * @param {boolean} enabled - Enable flag
 * @returns {void}
 */
export function setAutoSaveEnabled(enabled) {
  autoSaveEnabled.set(enabled)

  if (!enabled && autoSaveTimer) {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = null
  }

  console.log('Auto-save', enabled ? 'enabled' : 'disabled')
}

/**
 * Get character count
 * @returns {Promise<number>}
 */
export async function getCharacterCount() {
  try {
    return await db.characters.count()
  } catch (error) {
    console.error('Error getting character count:', error)
    throw error
  }
}

/**
 * Export character to JSON
 * @param {number} id - Character ID
 * @returns {Promise<string>} JSON string
 */
export async function exportCharacterToJSON(id) {
  try {
    const character = await getCharacter(id)
    if (!character) {
      throw new Error('Character not found')
    }

    return JSON.stringify(character, null, 2)
  } catch (error) {
    console.error('Error exporting character:', error)
    characterError.set('Failed to export character: ' + error.message)
    throw error
  }
}

/**
 * Import character from JSON
 * @param {string} jsonString - JSON string
 * @returns {Promise<number>} Character ID
 */
export async function importCharacterFromJSON(jsonString) {
  try {
    const character = JSON.parse(jsonString)

    // Remove ID if present (will be auto-assigned)
    delete character.id

    // Validate
    const validation = validateCharacter(character)
    if (!validation.valid) {
      throw new Error('Invalid character data: ' + validation.errors.join(', '))
    }

    // Create character
    return await createCharacter(character)
  } catch (error) {
    console.error('Error importing character:', error)
    characterError.set('Failed to import character: ' + error.message)
    throw error
  }
}

/**
 * Clear current character
 * @returns {void}
 */
export function clearCurrentCharacter() {
  currentCharacter.set(null)

  // Clear any pending auto-save
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = null
  }
}

/**
 * Set current character (without loading from DB)
 * Useful for character creation wizard
 * @param {Object} character - Character object
 * @returns {void}
 */
export function setCurrentCharacter(character) {
  currentCharacter.set(character)
}

/**
 * Update current character fields and schedule auto-save
 * @param {Object} updates - Fields to update
 * @returns {void}
 */
export function updateCurrentCharacter(updates) {
  currentCharacter.update(char => {
    if (!char) return char

    const updated = {
      ...char,
      ...updates,
      updated: new Date().toISOString()
    }

    // Schedule auto-save if character has an ID
    if (updated.id) {
      scheduleAutoSave()
    }

    return updated
  })
}

/**
 * Derived store: Character count
 */
export const characterCount = derived(
  characters,
  $characters => $characters.length
)

/**
 * Derived store: Characters sorted by name
 */
export const charactersSortedByName = derived(
  characters,
  $characters => [...$characters].sort((a, b) => a.name.localeCompare(b.name))
)

/**
 * Derived store: Characters sorted by last updated
 */
export const charactersSortedByUpdated = derived(
  characters,
  $characters => [...$characters].sort((a, b) =>
    new Date(b.updated) - new Date(a.updated)
  )
)

/**
 * Derived store: Has unsaved changes (for current character)
 * Note: This is a placeholder - actual implementation would require
 * comparing current state with saved state
 */
export const hasUnsavedChanges = derived(
  currentCharacter,
  $current => false // TODO: Implement change detection
)
