/**
 * CRUD Operations - Create, Read, Update, Delete operations for data entities
 *
 * This module provides high-level CRUD operations that work with the
 * Svelte stores and maintain data consistency between official and custom data.
 */

import { get } from 'svelte/store'
import {
  officialData,
  customModifications,
  characters,
  saveCustomModifications
} from '../stores/data.js'
import { db } from './db.js'
import {
  createModification,
  createCustomEntry,
  markAsDeleted,
  restoreDeleted,
  revertToOriginal,
  generateCustomId
} from './dataMerger.js'
import { validateEntry } from './validation.js'

/**
 * @typedef {Object} CRUDResult
 * @property {boolean} success - Whether operation succeeded
 * @property {Object} [data] - Result data
 * @property {string} [error] - Error message if failed
 */

// ==================== CREATE OPERATIONS ====================

/**
 * Create a new custom entry
 * @param {string} entityType - Type of entity
 * @param {Object} data - Entry data
 * @returns {CRUDResult} Operation result
 */
export function createEntry(entityType, data) {
  try {
    // Create custom entry with unique ID first
    const entry = createCustomEntry(entityType, data)

    // Then validate the complete entry (including generated ID)
    const validation = validateEntry(entityType, entry)
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      }
    }

    // Add to custom modifications store
    const current = get(customModifications)
    const updated = {
      ...current,
      [entityType]: [...(current[entityType] || []), entry]
    }

    customModifications.set(updated)
    saveCustomModifications()

    return {
      success: true,
      data: entry
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Create multiple entries in bulk
 * @param {string} entityType - Type of entity
 * @param {Array} entries - Array of entry data
 * @returns {CRUDResult} Operation result
 */
export function bulkCreateEntries(entityType, entries) {
  try {
    if (!Array.isArray(entries)) {
      return {
        success: false,
        error: 'Entries must be an array'
      }
    }

    const created = []
    const errors = []

    for (const data of entries) {
      const result = createEntry(entityType, data)
      if (result.success) {
        created.push(result.data)
      } else {
        errors.push(result.error)
      }
    }

    return {
      success: errors.length === 0,
      data: {
        created: created.length,
        errors
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ==================== READ OPERATIONS ====================

/**
 * Get an entry by ID from merged data
 * @param {string} entityType - Type of entity
 * @param {string|number} id - Entry ID
 * @param {Object} mergedData - Merged data object
 * @returns {Object|null} Entry or null if not found
 */
export function getEntryById(entityType, id, mergedData) {
  const entries = mergedData[entityType] || []
  return entries.find((entry) => entry.id === id) || null
}

/**
 * Get all entries of a specific type from merged data
 * @param {string} entityType - Type of entity
 * @param {Object} mergedData - Merged data object
 * @returns {Array} Array of entries
 */
export function getAllEntries(entityType, mergedData) {
  return mergedData[entityType] || []
}

/**
 * Filter entries by a predicate function
 * @param {string} entityType - Type of entity
 * @param {Object} mergedData - Merged data object
 * @param {Function} predicate - Filter function
 * @returns {Array} Filtered entries
 */
export function filterEntries(entityType, mergedData, predicate) {
  const entries = mergedData[entityType] || []
  return entries.filter(predicate)
}

/**
 * Get entries by multiple IDs
 * @param {string} entityType - Type of entity
 * @param {Array<string|number>} ids - Array of IDs
 * @param {Object} mergedData - Merged data object
 * @returns {Array} Array of found entries
 */
export function getEntriesByIds(entityType, ids, mergedData) {
  const entries = mergedData[entityType] || []
  const idSet = new Set(ids)
  return entries.filter((entry) => idSet.has(entry.id))
}

// ==================== UPDATE OPERATIONS ====================

/**
 * Update an entry (creates a custom modification)
 * @param {string} entityType - Type of entity
 * @param {string|number} id - Entry ID
 * @param {Object} updates - Fields to update
 * @param {Object} mergedData - Merged data object
 * @returns {CRUDResult} Operation result
 */
export function updateEntry(entityType, id, updates, mergedData) {
  try {
    // Find entry in merged data
    const entry = getEntryById(entityType, id, mergedData)
    if (!entry) {
      return {
        success: false,
        error: `Entry not found: ${entityType} with id ${id}`
      }
    }

    // Create modified entry
    const modified = createModification(entry, updates)

    // Validate modified entry
    const validation = validateEntry(entityType, modified)
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      }
    }

    // Update custom modifications store
    const current = get(customModifications)
    const existingEntries = current[entityType] || []
    const index = existingEntries.findIndex((e) => e.id === id)

    let updated
    if (index !== -1) {
      // Replace existing modification
      const newEntries = [...existingEntries]
      newEntries[index] = modified
      updated = {
        ...current,
        [entityType]: newEntries
      }
    } else {
      // Add new modification
      updated = {
        ...current,
        [entityType]: [...existingEntries, modified]
      }
    }

    customModifications.set(updated)
    saveCustomModifications()

    return {
      success: true,
      data: modified
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Update multiple entries in bulk
 * @param {string} entityType - Type of entity
 * @param {Array} updates - Array of {id, updates} objects
 * @param {Object} mergedData - Merged data object
 * @returns {CRUDResult} Operation result
 */
export function bulkUpdateEntries(entityType, updates, mergedData) {
  try {
    if (!Array.isArray(updates)) {
      return {
        success: false,
        error: 'Updates must be an array'
      }
    }

    const updated = []
    const errors = []

    for (const { id, updates: data } of updates) {
      const result = updateEntry(entityType, id, data, mergedData)
      if (result.success) {
        updated.push(result.data)
      } else {
        errors.push(result.error)
      }
    }

    return {
      success: errors.length === 0,
      data: {
        updated: updated.length,
        errors
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ==================== DELETE OPERATIONS ====================

/**
 * Delete an entry (soft delete for official, hard delete for custom)
 * @param {string} entityType - Type of entity
 * @param {string|number} id - Entry ID
 * @param {Object} mergedData - Merged data object
 * @returns {CRUDResult} Operation result
 */
export function deleteEntry(entityType, id, mergedData) {
  try {
    // Find entry in merged data
    const entry = getEntryById(entityType, id, mergedData)
    if (!entry) {
      return {
        success: false,
        error: `Entry not found: ${entityType} with id ${id}`
      }
    }

    const current = get(customModifications)
    const existingEntries = current[entityType] || []

    let updated

    if (entry.isCustom) {
      // Hard delete for custom entries
      updated = {
        ...current,
        [entityType]: existingEntries.filter((e) => e.id !== id)
      }
    } else {
      // Soft delete for official entries (mark as deleted)
      const deleted = markAsDeleted(entry)
      const index = existingEntries.findIndex((e) => e.id === id)

      if (index !== -1) {
        const newEntries = [...existingEntries]
        newEntries[index] = deleted
        updated = {
          ...current,
          [entityType]: newEntries
        }
      } else {
        updated = {
          ...current,
          [entityType]: [...existingEntries, deleted]
        }
      }
    }

    customModifications.set(updated)
    saveCustomModifications()

    return {
      success: true,
      data: { id, deleted: true }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Delete multiple entries in bulk
 * @param {string} entityType - Type of entity
 * @param {Array<string|number>} ids - Array of entry IDs
 * @param {Object} mergedData - Merged data object
 * @returns {CRUDResult} Operation result
 */
export function bulkDeleteEntries(entityType, ids, mergedData) {
  try {
    if (!Array.isArray(ids)) {
      return {
        success: false,
        error: 'IDs must be an array'
      }
    }

    const deleted = []
    const errors = []

    for (const id of ids) {
      const result = deleteEntry(entityType, id, mergedData)
      if (result.success) {
        deleted.push(id)
      } else {
        errors.push(result.error)
      }
    }

    return {
      success: errors.length === 0,
      data: {
        deleted: deleted.length,
        errors
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Restore a deleted entry
 * @param {string} entityType - Type of entity
 * @param {string|number} id - Entry ID
 * @returns {CRUDResult} Operation result
 */
export function restoreEntry(entityType, id) {
  try {
    const current = get(customModifications)
    const existingEntries = current[entityType] || []
    const index = existingEntries.findIndex((e) => e.id === id)

    if (index === -1) {
      return {
        success: false,
        error: `Entry not found: ${entityType} with id ${id}`
      }
    }

    const entry = existingEntries[index]
    if (!entry.isDeleted) {
      return {
        success: false,
        error: 'Entry is not deleted'
      }
    }

    const restored = restoreDeleted(entry)
    const newEntries = [...existingEntries]
    newEntries[index] = restored

    const updated = {
      ...current,
      [entityType]: newEntries
    }

    customModifications.set(updated)
    saveCustomModifications()

    return {
      success: true,
      data: restored
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ==================== SPECIAL OPERATIONS ====================

/**
 * Revert a modified entry to its original state
 * @param {string} entityType - Type of entity
 * @param {string|number} id - Entry ID
 * @returns {CRUDResult} Operation result
 */
export function revertEntry(entityType, id) {
  try {
    const current = get(customModifications)
    const existingEntries = current[entityType] || []
    const index = existingEntries.findIndex((e) => e.id === id)

    if (index === -1) {
      return {
        success: false,
        error: `Entry not found: ${entityType} with id ${id}`
      }
    }

    const entry = existingEntries[index]
    const original = revertToOriginal(entry)

    if (!original) {
      return {
        success: false,
        error: 'No original data to revert to (entry may be custom)'
      }
    }

    // Remove the modification
    const newEntries = existingEntries.filter((e) => e.id !== id)
    const updated = {
      ...current,
      [entityType]: newEntries
    }

    customModifications.set(updated)
    saveCustomModifications()

    return {
      success: true,
      data: original
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Duplicate an entry (creates a custom copy)
 * @param {string} entityType - Type of entity
 * @param {string|number} id - Entry ID to duplicate
 * @param {Object} mergedData - Merged data object
 * @param {Object} [modifications] - Optional modifications for the duplicate
 * @returns {CRUDResult} Operation result
 */
export function duplicateEntry(entityType, id, mergedData, modifications = {}) {
  try {
    const entry = getEntryById(entityType, id, mergedData)
    if (!entry) {
      return {
        success: false,
        error: `Entry not found: ${entityType} with id ${id}`
      }
    }

    // Create a copy with a new ID
    const duplicate = {
      ...entry,
      ...modifications,
      id: generateCustomId(entityType),
      label: modifications.label || `${entry.label} (Copy)`,
      _copiedFrom: id,
      _copiedAt: new Date().toISOString()
    }

    // Remove internal flags from original
    delete duplicate.isOfficial
    delete duplicate.isCustom
    delete duplicate.isModified
    delete duplicate._original

    return createEntry(entityType, duplicate)
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ==================== CHARACTER OPERATIONS ====================

/**
 * Create a new character
 * @param {Object} characterData - Character data
 * @returns {Promise<CRUDResult>} Operation result
 */
export async function createCharacter(characterData) {
  try {
    const character = {
      ...characterData,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }

    // Add to IndexedDB
    const id = await db.characters.add(character)
    character.id = id

    // Update store
    const current = get(characters)
    characters.set([...current, character])

    return {
      success: true,
      data: character
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Update a character
 * @param {number} id - Character ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<CRUDResult>} Operation result
 */
export async function updateCharacter(id, updates) {
  try {
    const character = await db.characters.get(id)
    if (!character) {
      return {
        success: false,
        error: `Character not found: ${id}`
      }
    }

    const updated = {
      ...character,
      ...updates,
      updated: new Date().toISOString()
    }

    await db.characters.put(updated)

    // Update store
    const current = get(characters)
    const index = current.findIndex((c) => c.id === id)
    if (index !== -1) {
      const newCharacters = [...current]
      newCharacters[index] = updated
      characters.set(newCharacters)
    }

    return {
      success: true,
      data: updated
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Delete a character
 * @param {number} id - Character ID
 * @returns {Promise<CRUDResult>} Operation result
 */
export async function deleteCharacter(id) {
  try {
    await db.characters.delete(id)

    // Update store
    const current = get(characters)
    characters.set(current.filter((c) => c.id !== id))

    return {
      success: true,
      data: { id, deleted: true }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Duplicate a character
 * @param {number} id - Character ID to duplicate
 * @param {string} [newName] - Name for the duplicate
 * @returns {Promise<CRUDResult>} Operation result
 */
export async function duplicateCharacter(id, newName) {
  try {
    const character = await db.characters.get(id)
    if (!character) {
      return {
        success: false,
        error: `Character not found: ${id}`
      }
    }

    const duplicate = {
      ...character,
      name: newName || `${character.name} (Copy)`,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }

    delete duplicate.id

    return await createCharacter(duplicate)
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
