/**
 * Import Modifications - Import and merge JSON patch files
 *
 * This module provides functionality to import custom modifications and user-created
 * content from JSON files. It validates the import data, detects conflicts with existing
 * modifications, and provides conflict resolution options.
 *
 * Import Process:
 * 1. Validate file is valid JSON
 * 2. Validate structure matches export format
 * 3. Check version compatibility
 * 4. Detect conflicts (ID collisions with existing modifications)
 * 5. Resolve conflicts (user chooses: keep, overwrite, or merge)
 * 6. Apply import with resolved conflicts
 */

import { get } from 'svelte/store'
import { customModifications, saveCustomModifications } from '../stores/data.js'

/**
 * Supported import versions
 */
const SUPPORTED_VERSIONS = ['1.0']

/**
 * Entity types that can be imported
 */
const ENTITY_TYPES = [
  'books', 'careers', 'careerLevels', 'species', 'classes',
  'talents', 'characteristics', 'trappings', 'skills', 'spells',
  'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
  'traits', 'lores', 'magicks', 'etats', 'psychologies',
  'qualities', 'trees'
]

/**
 * Validate that a file is valid JSON
 * @param {File} file - The file to validate
 * @returns {Promise<Object>} Validation result with parsed data or error
 */
export async function validateImportFile(file) {
  try {
    // Check file type
    if (!file.name.endsWith('.json')) {
      return {
        valid: false,
        error: 'File must be a JSON file (.json)',
        data: null
      }
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit',
        data: null
      }
    }

    // Read file content
    const text = await file.text()

    // Parse JSON
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      return {
        valid: false,
        error: `Invalid JSON: ${parseError.message}`,
        data: null
      }
    }

    // Validate structure
    const structureValidation = validateImportData(data)
    if (!structureValidation.valid) {
      return structureValidation
    }

    return {
      valid: true,
      error: null,
      data
    }
  } catch (error) {
    return {
      valid: false,
      error: `Failed to read file: ${error.message}`,
      data: null
    }
  }
}

/**
 * Validate import data structure
 * @param {Object} data - The import data to validate
 * @returns {Object} Validation result
 */
export function validateImportData(data) {
  // Check required fields
  if (!data.version) {
    return {
      valid: false,
      error: 'Missing required field: version',
      data: null
    }
  }

  if (!data.modifications) {
    return {
      valid: false,
      error: 'Missing required field: modifications',
      data: null
    }
  }

  if (!data.exported) {
    return {
      valid: false,
      error: 'Missing required field: exported (timestamp)',
      data: null
    }
  }

  // Check version compatibility
  if (!SUPPORTED_VERSIONS.includes(data.version)) {
    return {
      valid: false,
      error: `Unsupported version: ${data.version}. Supported versions: ${SUPPORTED_VERSIONS.join(', ')}`,
      data: null
    }
  }

  // Validate modifications structure
  if (typeof data.modifications !== 'object' || data.modifications === null) {
    return {
      valid: false,
      error: 'Invalid modifications structure (must be an object)',
      data: null
    }
  }

  // Validate each entity type in modifications
  for (const entityType of Object.keys(data.modifications)) {
    if (!ENTITY_TYPES.includes(entityType)) {
      return {
        valid: false,
        error: `Invalid entity type: ${entityType}`,
        data: null
      }
    }

    if (!Array.isArray(data.modifications[entityType])) {
      return {
        valid: false,
        error: `Invalid data for ${entityType} (must be an array)`,
        data: null
      }
    }

    // Validate each entity has an ID
    for (const entity of data.modifications[entityType]) {
      if (!entity.id) {
        return {
          valid: false,
          error: `Entity in ${entityType} is missing required 'id' field`,
          data: null
        }
      }
    }
  }

  return {
    valid: true,
    error: null,
    data
  }
}

/**
 * Detect conflicts between import data and existing modifications
 * A conflict occurs when an imported entity has the same ID as an existing modification
 * @param {Object} importData - The validated import data
 * @returns {Object} Conflicts organized by entity type
 */
export function detectConflicts(importData) {
  const existing = get(customModifications)
  const conflicts = {}
  let totalConflicts = 0

  for (const entityType of Object.keys(importData.modifications)) {
    const importedEntities = importData.modifications[entityType] || []
    const existingEntities = existing[entityType] || []

    // Create a map of existing entities by ID for fast lookup
    const existingMap = new Map()
    for (const entity of existingEntities) {
      existingMap.set(entity.id, entity)
    }

    // Find conflicts
    const entityConflicts = []
    for (const importedEntity of importedEntities) {
      const existingEntity = existingMap.get(importedEntity.id)
      if (existingEntity) {
        entityConflicts.push({
          id: importedEntity.id,
          existing: existingEntity,
          imported: importedEntity,
          // Default resolution strategy
          resolution: 'keep' // 'keep' | 'overwrite' | 'merge'
        })
        totalConflicts++
      }
    }

    if (entityConflicts.length > 0) {
      conflicts[entityType] = entityConflicts
    }
  }

  return {
    hasConflicts: totalConflicts > 0,
    totalConflicts,
    conflicts,
    // Summary for each entity type
    summary: Object.keys(conflicts).map(entityType => ({
      entityType,
      count: conflicts[entityType].length
    }))
  }
}

/**
 * Preview what would be imported (without applying changes)
 * @param {Object} importData - The validated import data
 * @param {Object} conflictResolutions - Map of entity ID to resolution strategy
 * @returns {Object} Preview of changes
 */
export function previewImport(importData, conflictResolutions = {}) {
  const existing = get(customModifications)
  const preview = {
    toAdd: {},
    toUpdate: {},
    toKeep: {},
    counts: {
      add: 0,
      update: 0,
      keep: 0,
      total: 0
    }
  }

  for (const entityType of Object.keys(importData.modifications)) {
    const importedEntities = importData.modifications[entityType] || []
    const existingEntities = existing[entityType] || []

    // Create a map of existing entities by ID
    const existingMap = new Map()
    for (const entity of existingEntities) {
      existingMap.set(entity.id, entity)
    }

    const toAdd = []
    const toUpdate = []
    const toKeep = []

    for (const importedEntity of importedEntities) {
      const existingEntity = existingMap.get(importedEntity.id)

      if (!existingEntity) {
        // No conflict - will be added
        toAdd.push(importedEntity)
        preview.counts.add++
      } else {
        // Conflict - check resolution
        const resolution = conflictResolutions[importedEntity.id] || 'keep'

        if (resolution === 'keep') {
          toKeep.push({
            id: importedEntity.id,
            entity: existingEntity
          })
          preview.counts.keep++
        } else if (resolution === 'overwrite') {
          toUpdate.push({
            id: importedEntity.id,
            from: existingEntity,
            to: importedEntity
          })
          preview.counts.update++
        } else if (resolution === 'merge') {
          // For merge, we combine fields (imported fields override existing)
          const merged = { ...existingEntity, ...importedEntity }
          toUpdate.push({
            id: importedEntity.id,
            from: existingEntity,
            to: merged
          })
          preview.counts.update++
        }
      }
    }

    if (toAdd.length > 0) preview.toAdd[entityType] = toAdd
    if (toUpdate.length > 0) preview.toUpdate[entityType] = toUpdate
    if (toKeep.length > 0) preview.toKeep[entityType] = toKeep
  }

  preview.counts.total = preview.counts.add + preview.counts.update + preview.counts.keep

  return preview
}

/**
 * Import modifications with resolved conflicts
 * @param {Object} importData - The validated import data
 * @param {Object} conflictResolutions - Map of entity ID to resolution strategy
 * @returns {Object} Import result
 */
export function importModifications(importData, conflictResolutions = {}) {
  try {
    // Validate before importing
    const validation = validateImportData(importData)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        imported: 0
      }
    }

    // Get preview to determine what will change
    const preview = previewImport(importData, conflictResolutions)

    // Create a backup of current modifications (in case we need to rollback)
    const backup = get(customModifications)

    // Build the new modifications object
    const current = get(customModifications)
    const updated = { ...current }

    // Process each entity type
    for (const entityType of Object.keys(importData.modifications)) {
      const importedEntities = importData.modifications[entityType] || []
      const existingEntities = current[entityType] || []

      // Create a map of existing entities by ID
      const existingMap = new Map()
      for (const entity of existingEntities) {
        existingMap.set(entity.id, entity)
      }

      // Build the updated list for this entity type
      const updatedEntities = [...existingEntities]

      for (const importedEntity of importedEntities) {
        const existingIndex = updatedEntities.findIndex(e => e.id === importedEntity.id)

        if (existingIndex === -1) {
          // No conflict - add it
          updatedEntities.push(importedEntity)
        } else {
          // Conflict - apply resolution
          const resolution = conflictResolutions[importedEntity.id] || 'keep'

          if (resolution === 'keep') {
            // Keep existing, do nothing
            continue
          } else if (resolution === 'overwrite') {
            // Replace with imported
            updatedEntities[existingIndex] = importedEntity
          } else if (resolution === 'merge') {
            // Merge (imported fields override existing)
            updatedEntities[existingIndex] = {
              ...updatedEntities[existingIndex],
              ...importedEntity
            }
          }
        }
      }

      updated[entityType] = updatedEntities
    }

    // Apply the update
    customModifications.set(updated)

    // Persist to storage
    saveCustomModifications()

    return {
      success: true,
      error: null,
      imported: preview.counts.add + preview.counts.update,
      kept: preview.counts.keep,
      total: preview.counts.total,
      preview,
      backup // Return backup in case caller wants to implement undo
    }
  } catch (error) {
    console.error('Error importing modifications:', error)
    return {
      success: false,
      error: error.message,
      imported: 0
    }
  }
}

/**
 * Count total modifications in import data
 * @param {Object} importData - The import data
 * @returns {number} Total count
 */
export function countImportModifications(importData) {
  let count = 0
  for (const entityType of Object.keys(importData.modifications || {})) {
    count += (importData.modifications[entityType] || []).length
  }
  return count
}

/**
 * Get summary of import data
 * @param {Object} importData - The import data
 * @returns {Object} Summary statistics
 */
export function getImportSummary(importData) {
  if (!importData || !importData.modifications) {
    return {
      totalCount: 0,
      customCount: 0,
      modifiedCount: 0,
      entityTypeCount: 0,
      typeBreakdown: {}
    }
  }

  let totalCount = 0
  let customCount = 0
  let modifiedCount = 0
  const typeBreakdown = {}

  for (const entityType of Object.keys(importData.modifications)) {
    const entries = importData.modifications[entityType] || []
    if (entries.length > 0) {
      let customInType = 0
      let modifiedInType = 0

      for (const entry of entries) {
        if (entry._meta?.isCustom || entry.isCustom) {
          customCount++
          customInType++
        } else if (entry._meta?.isModified || entry.isModified) {
          modifiedCount++
          modifiedInType++
        }
        totalCount++
      }

      typeBreakdown[entityType] = {
        total: entries.length,
        custom: customInType,
        modified: modifiedInType
      }
    }
  }

  return {
    totalCount,
    customCount,
    modifiedCount,
    entityTypeCount: Object.keys(typeBreakdown).length,
    typeBreakdown,
    version: importData.version,
    exported: importData.exported,
    author: importData.author
  }
}

/**
 * Compare two entities and return differences
 * Useful for showing what changed in conflict resolution UI
 * @param {Object} entity1 - First entity
 * @param {Object} entity2 - Second entity
 * @returns {Object} Differences
 */
export function compareEntities(entity1, entity2) {
  const differences = {
    added: [],
    removed: [],
    changed: [],
    unchanged: []
  }

  // Get all unique keys from both entities
  const allKeys = new Set([
    ...Object.keys(entity1 || {}),
    ...Object.keys(entity2 || {})
  ])

  for (const key of allKeys) {
    // Skip internal metadata for comparison display
    if (key === '_meta' || key === 'id') continue

    const hasInEntity1 = key in entity1
    const hasInEntity2 = key in entity2

    if (hasInEntity1 && !hasInEntity2) {
      differences.removed.push({
        key,
        value: entity1[key]
      })
    } else if (!hasInEntity1 && hasInEntity2) {
      differences.added.push({
        key,
        value: entity2[key]
      })
    } else if (hasInEntity1 && hasInEntity2) {
      // Compare values (deep comparison for objects/arrays)
      const value1 = JSON.stringify(entity1[key])
      const value2 = JSON.stringify(entity2[key])

      if (value1 !== value2) {
        differences.changed.push({
          key,
          oldValue: entity1[key],
          newValue: entity2[key]
        })
      } else {
        differences.unchanged.push({
          key,
          value: entity1[key]
        })
      }
    }
  }

  return differences
}

/**
 * Rollback to a previous state (used for undo)
 * @param {Object} backup - The backup to restore
 * @returns {boolean} Success status
 */
export function rollbackImport(backup) {
  try {
    customModifications.set(backup)
    saveCustomModifications()
    return true
  } catch (error) {
    console.error('Error rolling back import:', error)
    return false
  }
}
