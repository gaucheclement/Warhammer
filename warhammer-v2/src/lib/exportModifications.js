/**
 * Export Modifications - Generate and download JSON patch files
 *
 * This module provides functionality to export custom modifications and user-created
 * content as JSON files. The export includes only modified/custom entries (not the
 * full official dataset) to minimize file size.
 *
 * Export Format:
 * {
 *   version: '1.0',
 *   exported: timestamp,
 *   author: 'User Name (optional)',
 *   modifications: {
 *     talents: [...],
 *     careers: [...],
 *     // ... other entity types
 *   }
 * }
 */

import { get } from 'svelte/store'
import { customModifications } from '../stores/data.js'

/**
 * Export version - increment this when export format changes
 */
const EXPORT_VERSION = '1.0'

/**
 * Entity types that can be exported
 */
const ENTITY_TYPES = [
  'books', 'careers', 'careerLevels', 'species', 'classes',
  'talents', 'characteristics', 'trappings', 'skills', 'spells',
  'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
  'traits', 'lores', 'magicks', 'etats', 'psychologies',
  'qualities', 'trees'
]

/**
 * Generate export data from customModifications store
 * @param {string} [authorName] - Optional author name
 * @returns {Object} Export data object
 */
export function generateExportData(authorName = '') {
  const modifications = get(customModifications)
  const exported = new Date().toISOString()

  // Filter out empty entity types (no modifications)
  const filteredModifications = {}
  for (const entityType of ENTITY_TYPES) {
    const entries = modifications[entityType]
    if (entries && entries.length > 0) {
      filteredModifications[entityType] = entries
    }
  }

  return {
    version: EXPORT_VERSION,
    exported,
    author: authorName || undefined,
    modifications: filteredModifications
  }
}

/**
 * Generate a filename for the export
 * Format: warhammer-mods-YYYYMMDD-HHMMSS.json
 * @returns {string} Filename
 */
export function generateExportFilename() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `warhammer-mods-${year}${month}${day}-${hours}${minutes}${seconds}.json`
}

/**
 * Trigger browser download of JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Filename for download
 */
export function downloadJSON(data, filename) {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Main export function - generates and downloads modifications
 * @param {string} [authorName] - Optional author name
 * @returns {Object} Export result with success status and data
 */
export function exportModifications(authorName = '') {
  try {
    const data = generateExportData(authorName)
    const filename = generateExportFilename()

    // Check if there are any modifications to export
    if (Object.keys(data.modifications).length === 0) {
      return {
        success: false,
        error: 'No modifications to export',
        data: null
      }
    }

    downloadJSON(data, filename)

    return {
      success: true,
      filename,
      data,
      count: countModifications(data.modifications)
    }
  } catch (error) {
    console.error('Error exporting modifications:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Count total number of modifications across all entity types
 * @param {Object} modifications - Modifications object
 * @returns {number} Total count
 */
export function countModifications(modifications) {
  let count = 0
  for (const entityType of Object.keys(modifications)) {
    count += (modifications[entityType] || []).length
  }
  return count
}

/**
 * Get count of modifications by entity type
 * @returns {Object} Object with counts per entity type
 */
export function getModificationsCounts() {
  const modifications = get(customModifications)
  const counts = {}

  for (const entityType of ENTITY_TYPES) {
    const entries = modifications[entityType]
    if (entries && entries.length > 0) {
      counts[entityType] = entries.length
    }
  }

  return counts
}

/**
 * Get summary statistics about modifications
 * @returns {Object} Statistics object
 */
export function getExportSummary() {
  const modifications = get(customModifications)
  let totalCount = 0
  let customCount = 0
  let modifiedCount = 0
  const typeBreakdown = {}

  for (const entityType of ENTITY_TYPES) {
    const entries = modifications[entityType] || []
    if (entries.length > 0) {
      let customInType = 0
      let modifiedInType = 0

      for (const entry of entries) {
        if (entry.isCustom) {
          customCount++
          customInType++
        } else if (entry.isModified) {
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
    typeBreakdown
  }
}
