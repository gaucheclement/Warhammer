/**
 * Export Modifications - Generate and download JSON patch files
 *
 * This module provides functionality to export custom modifications and user-created
 * content as JSON files. The export includes only modified/custom entries (not the
 * full official dataset) to minimize file size.
 *
 * Uses ImportExportService for all export operations.
 */

import { get } from 'svelte/store'
import { customModifications } from '../stores/data.js'
import { createModificationsService } from './importExportConfigs.js'

// Create service instance
const modificationsService = createModificationsService()

/**
 * Generate export data from customModifications store
 * @param {string} [authorName] - Optional author name
 * @returns {Object} Export data object
 */
export function generateExportData(authorName = '') {
  const modifications = get(customModifications)
  return modifications
}

/**
 * Generate a filename for the export
 * Format: warhammer-mods-YYYYMMDD-HHMMSS.json
 * @returns {string} Filename
 */
export function generateExportFilename() {
  return modificationsService.filenameGenerator({})
}

/**
 * Trigger browser download of JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Filename for download
 */
export function downloadJSON(data, filename) {
  const jsonStr = JSON.stringify(data, null, 2)
  modificationsService.downloadJSON(jsonStr, filename)
}

/**
 * Main export function - generates and downloads modifications
 * @param {string} [authorName] - Optional author name
 * @returns {Object} Export result with success status and data
 */
export function exportModifications(authorName = '') {
  try {
    const modifications = generateExportData(authorName)
    const metadata = authorName ? { author: authorName } : {}
    const result = modificationsService.exportAndDownload(modifications, { metadata })

    if (!result.success) {
      return {
        success: false,
        error: result.errors[0] || 'Export failed',
        data: null
      }
    }

    return {
      success: true,
      filename: result.filename,
      data: result.data,
      count: countModifications(modifications)
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
