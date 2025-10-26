/**
 * Data Merging Logic - Combines official and custom data
 *
 * This module implements the merging strategy for combining official game data
 * with custom user modifications. Custom data overrides official data by ID.
 *
 * Merge Strategy:
 * - Custom overrides official by ID
 * - Entries marked with flags: isOfficial, isCustom, isModified
 * - Original official data preserved for reset functionality
 * - Deletions handled via soft delete (marked as deleted)
 */

/**
 * @typedef {Object} MergedEntry
 * @property {string|number} id - Unique identifier
 * @property {boolean} isOfficial - Entry from official data
 * @property {boolean} isCustom - Entry is user-created
 * @property {boolean} isModified - Official entry modified by user
 * @property {boolean} isDeleted - Entry marked as deleted
 * @property {Object} [_original] - Original official data (for modified entries)
 */

/**
 * Merge official and custom data for all entity types
 * @param {Object} official - Official data object
 * @param {Object} custom - Custom modifications object
 * @returns {Object} Merged data object
 */
export function mergeData(official, custom) {
  const merged = {}

  // Get all entity types from official data
  const entityTypes = Object.keys(official)

  for (const entityType of entityTypes) {
    merged[entityType] = mergeEntityType(
      official[entityType] || [],
      custom[entityType] || []
    )
  }

  return merged
}

/**
 * Merge official and custom data for a single entity type
 * @param {Array} officialEntries - Official entries
 * @param {Array} customEntries - Custom entries
 * @returns {Array} Merged entries
 */
export function mergeEntityType(officialEntries, customEntries) {
  // Create a map of official entries by ID for fast lookup
  const officialMap = new Map()
  for (const entry of officialEntries) {
    officialMap.set(entry.id, { ...entry, isOfficial: true })
  }

  // Process custom entries
  const customMap = new Map()
  for (const entry of customEntries) {
    const hasOriginal = officialMap.has(entry.id)

    if (hasOriginal) {
      // This is a modification of an official entry
      const original = officialMap.get(entry.id)
      customMap.set(entry.id, {
        ...entry,
        isOfficial: false,
        isModified: true,
        isCustom: false,
        _original: original
      })
    } else {
      // This is a pure custom entry
      customMap.set(entry.id, {
        ...entry,
        isOfficial: false,
        isModified: false,
        isCustom: true
      })
    }
  }

  // Merge: custom overrides official
  const mergedMap = new Map()

  // Add all official entries
  for (const [id, entry] of officialMap) {
    mergedMap.set(id, entry)
  }

  // Override with custom entries
  for (const [id, entry] of customMap) {
    mergedMap.set(id, entry)
  }

  // Convert map to array and filter out deleted entries
  const result = Array.from(mergedMap.values()).filter(
    (entry) => !entry.isDeleted
  )

  return result
}

/**
 * Mark an entry as modified (creates a custom modification)
 * @param {Object} officialEntry - Original official entry
 * @param {Object} modifications - Fields to modify
 * @returns {Object} Modified entry ready to add to customModifications
 */
export function createModification(officialEntry, modifications) {
  return {
    ...officialEntry,
    ...modifications,
    _modifiedAt: new Date().toISOString()
  }
}

/**
 * Create a new custom entry (not based on official data)
 * @param {string} entityType - Type of entity
 * @param {Object} data - Entry data
 * @returns {Object} New custom entry
 */
export function createCustomEntry(entityType, data) {
  return {
    ...data,
    id: generateCustomId(entityType),
    _createdAt: new Date().toISOString(),
    isCustom: true
  }
}

/**
 * Mark an entry as deleted (soft delete)
 * @param {Object} entry - Entry to delete
 * @returns {Object} Entry marked as deleted
 */
export function markAsDeleted(entry) {
  return {
    ...entry,
    isDeleted: true,
    _deletedAt: new Date().toISOString()
  }
}

/**
 * Restore a deleted entry
 * @param {Object} entry - Deleted entry
 * @returns {Object} Restored entry
 */
export function restoreDeleted(entry) {
  const restored = { ...entry }
  delete restored.isDeleted
  delete restored._deletedAt
  return restored
}

/**
 * Revert a modified entry to its original state
 * @param {Object} modifiedEntry - Modified entry with _original field
 * @returns {Object|null} Original entry or null if no original exists
 */
export function revertToOriginal(modifiedEntry) {
  if (modifiedEntry._original) {
    return { ...modifiedEntry._original }
  }
  return null
}

/**
 * Generate a unique ID for custom entries
 * Custom IDs are prefixed with 'custom_' to avoid conflicts with official IDs
 * @param {string} entityType - Type of entity
 * @returns {string} Unique ID
 */
export function generateCustomId(entityType) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `custom_${entityType}_${timestamp}_${random}`
}

/**
 * Check if an entry is from official data
 * @param {Object} entry - Entry to check
 * @returns {boolean}
 */
export function isOfficialEntry(entry) {
  return entry.isOfficial === true && !entry.isModified
}

/**
 * Check if an entry is custom (user-created)
 * @param {Object} entry - Entry to check
 * @returns {boolean}
 */
export function isCustomEntry(entry) {
  return entry.isCustom === true
}

/**
 * Check if an entry is a modified official entry
 * @param {Object} entry - Entry to check
 * @returns {boolean}
 */
export function isModifiedEntry(entry) {
  return entry.isModified === true
}

/**
 * Get all modified entries from merged data
 * @param {Object} mergedData - Merged data object
 * @returns {Object} Object with arrays of modified entries by entity type
 */
export function getModifiedEntries(mergedData) {
  const modified = {}

  for (const [entityType, entries] of Object.entries(mergedData)) {
    modified[entityType] = entries.filter((entry) => entry.isModified === true)
  }

  return modified
}

/**
 * Get all custom entries from merged data
 * @param {Object} mergedData - Merged data object
 * @returns {Object} Object with arrays of custom entries by entity type
 */
export function getCustomEntries(mergedData) {
  const custom = {}

  for (const [entityType, entries] of Object.entries(mergedData)) {
    custom[entityType] = entries.filter((entry) => entry.isCustom === true)
  }

  return custom
}

/**
 * Get statistics about merged data
 * @param {Object} mergedData - Merged data object
 * @returns {Object} Statistics object
 */
export function getMergeStats(mergedData) {
  const stats = {
    total: 0,
    official: 0,
    custom: 0,
    modified: 0,
    byEntityType: {}
  }

  for (const [entityType, entries] of Object.entries(mergedData)) {
    const entityStats = {
      total: entries.length,
      official: 0,
      custom: 0,
      modified: 0
    }

    for (const entry of entries) {
      if (entry.isCustom) {
        entityStats.custom++
        stats.custom++
      } else if (entry.isModified) {
        entityStats.modified++
        stats.modified++
      } else if (entry.isOfficial) {
        entityStats.official++
        stats.official++
      }
    }

    stats.byEntityType[entityType] = entityStats
    stats.total += entries.length
  }

  return stats
}

/**
 * Detect conflicts between custom and official data
 * A conflict occurs when both versions exist but have different values
 * @param {Object} official - Official data
 * @param {Object} custom - Custom modifications
 * @returns {Array} Array of conflict objects
 */
export function detectConflicts(official, custom) {
  const conflicts = []

  for (const [entityType, customEntries] of Object.entries(custom)) {
    const officialEntries = official[entityType] || []
    const officialMap = new Map(officialEntries.map((e) => [e.id, e]))

    for (const customEntry of customEntries) {
      if (officialMap.has(customEntry.id)) {
        const officialEntry = officialMap.get(customEntry.id)

        // Check if there are actual differences
        const differences = findDifferences(officialEntry, customEntry)
        if (differences.length > 0) {
          conflicts.push({
            entityType,
            id: customEntry.id,
            officialEntry,
            customEntry,
            differences
          })
        }
      }
    }
  }

  return conflicts
}

/**
 * Find differences between two entries
 * @param {Object} entry1 - First entry
 * @param {Object} entry2 - Second entry
 * @returns {Array} Array of field names that differ
 */
function findDifferences(entry1, entry2) {
  const differences = []
  const allKeys = new Set([...Object.keys(entry1), ...Object.keys(entry2)])

  for (const key of allKeys) {
    // Skip internal fields
    if (key.startsWith('_') || key.startsWith('is')) continue

    if (JSON.stringify(entry1[key]) !== JSON.stringify(entry2[key])) {
      differences.push(key)
    }
  }

  return differences
}

/**
 * Resolve a conflict by choosing a version
 * @param {Object} conflict - Conflict object from detectConflicts
 * @param {'official'|'custom'|'merge'} resolution - How to resolve
 * @param {Object} [mergedFields] - Fields to use if resolution is 'merge'
 * @returns {Object} Resolved entry
 */
export function resolveConflict(conflict, resolution, mergedFields = {}) {
  switch (resolution) {
    case 'official':
      return { ...conflict.officialEntry }

    case 'custom':
      return { ...conflict.customEntry }

    case 'merge':
      return {
        ...conflict.officialEntry,
        ...conflict.customEntry,
        ...mergedFields,
        _conflictResolvedAt: new Date().toISOString()
      }

    default:
      throw new Error(`Unknown conflict resolution: ${resolution}`)
  }
}
