/**
 * Admin Export Functionality - Export official database for admin mode
 *
 * This module provides functionality to export the official database (from IndexedDB)
 * in the all-data.json format. This allows admins to download the current state of
 * the official data for backup, version control, or community contribution review.
 *
 * Architecture:
 * - Reads current officialData from the data store
 * - Converts from plural keys (stores) to singular keys (all-data.json format)
 * - Validates data integrity before export
 * - Generates timestamped filename
 * - Downloads as JSON file
 */

import { get } from 'svelte/store'
import { officialData } from '../stores/data.js'

/**
 * Mapping from store keys (plural) to all-data.json keys (singular)
 * This ensures the exported file matches the expected format
 */
const KEY_MAPPING = {
  books: 'book',
  careers: 'career',
  careerLevels: 'careerLevel',
  species: 'specie',
  classes: 'class',
  talents: 'talent',
  characteristics: 'characteristic',
  trappings: 'trapping',
  skills: 'skill',
  spells: 'spell',
  creatures: 'creature',
  stars: 'star',
  gods: 'god',
  eyes: 'eye',
  hairs: 'hair',
  details: 'detail',
  traits: 'trait',
  lores: 'lore',
  magicks: 'magick',
  etats: 'etat',
  psychologies: 'psychologie',
  qualities: 'quality',
  trees: 'tree'
}

/**
 * All entity types that should be included in the export
 */
const ENTITY_TYPES = [
  'books',
  'careers',
  'careerLevels',
  'species',
  'classes',
  'talents',
  'characteristics',
  'trappings',
  'skills',
  'spells',
  'creatures',
  'stars',
  'gods',
  'eyes',
  'hairs',
  'details',
  'traits',
  'lores',
  'magicks',
  'etats',
  'psychologies',
  'qualities',
  'trees'
]

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the data is valid
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 * @property {Object} stats - Statistics about the data
 */

/**
 * @typedef {Object} ExportResult
 * @property {boolean} success - Whether export succeeded
 * @property {string} filename - Generated filename
 * @property {number} size - Size of exported data in bytes
 * @property {Object} stats - Statistics about exported data
 * @property {string[]} errors - Array of error messages
 */

/**
 * Validate official data before export
 * Ensures data integrity and provides warnings for potential issues
 *
 * @param {Object} data - Official data from store (plural keys)
 * @returns {ValidationResult} Validation result
 */
export function validateExportData(data) {
  const errors = []
  const warnings = []
  const stats = {}

  // Check that data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object')
    return { valid: false, errors, warnings, stats }
  }

  // Validate each entity type
  for (const entityType of ENTITY_TYPES) {
    const entities = data[entityType]

    // Check if entity type exists
    if (!entities) {
      warnings.push(`Missing entity type: ${entityType}`)
      stats[entityType] = 0
      continue
    }

    // Check if entity type is an array
    if (!Array.isArray(entities)) {
      errors.push(`Entity type ${entityType} must be an array`)
      continue
    }

    stats[entityType] = entities.length

    // Validate that each entity has an ID
    const entitiesWithoutId = entities.filter((entity) => !entity.id && entity.id !== 0)
    if (entitiesWithoutId.length > 0) {
      warnings.push(
        `${entityType}: ${entitiesWithoutId.length} entities without ID`
      )
    }

    // Check for duplicate IDs
    const ids = new Set()
    const duplicates = []
    for (const entity of entities) {
      if (ids.has(entity.id)) {
        duplicates.push(entity.id)
      }
      ids.add(entity.id)
    }

    if (duplicates.length > 0) {
      errors.push(
        `${entityType}: Duplicate IDs found: ${duplicates.join(', ')}`
      )
    }

    // Warn if entity type is empty
    if (entities.length === 0) {
      warnings.push(`${entityType}: No entities to export`)
    }
  }

  // Check for unknown entity types
  const unknownTypes = Object.keys(data).filter(
    (key) => !ENTITY_TYPES.includes(key)
  )
  if (unknownTypes.length > 0) {
    warnings.push(
      `Unknown entity types will be ignored: ${unknownTypes.join(', ')}`
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats
  }
}

/**
 * Convert store data (plural keys) to all-data.json format (singular keys)
 *
 * @param {Object} data - Official data from store (plural keys)
 * @returns {Object} Data in all-data.json format (singular keys)
 */
export function convertToExportFormat(data) {
  const exportData = {}

  for (const [pluralKey, singularKey] of Object.entries(KEY_MAPPING)) {
    if (data[pluralKey]) {
      exportData[singularKey] = data[pluralKey]
    }
  }

  return exportData
}

/**
 * Generate a timestamped filename for the export
 *
 * @param {string} [prefix] - Filename prefix (default: 'all-data')
 * @returns {string} Timestamped filename
 */
export function generateExportFilename(prefix = 'all-data') {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]
  return `${prefix}-${timestamp}.json`
}

/**
 * Download JSON data as a file
 *
 * @param {Object} data - Data to download
 * @param {string} filename - Filename for download
 * @returns {void}
 */
export function downloadJSON(data, filename) {
  // Convert to JSON with pretty printing for readability
  const jsonString = JSON.stringify(data, null, 2)

  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Export official data to JSON file
 * Main entry point for admin data export functionality
 *
 * This function:
 * 1. Reads current officialData from store
 * 2. Validates data integrity
 * 3. Converts to all-data.json format (singular keys)
 * 4. Generates timestamped filename
 * 5. Downloads as JSON file
 *
 * @param {Object} [options] - Export options
 * @param {string} [options.filename] - Custom filename (without extension)
 * @param {boolean} [options.skipValidation] - Skip validation (default: false)
 * @returns {ExportResult} Export result
 */
export function exportOfficialData(options = {}) {
  const { filename, skipValidation = false } = options

  try {
    // Get current officialData from store
    const data = get(officialData)

    // Validate data before export (unless skipped)
    let validation = null
    if (!skipValidation) {
      validation = validateExportData(data)

      // Log validation results
      if (validation.warnings.length > 0) {
        console.warn('Export validation warnings:', validation.warnings)
      }

      // Don't export if validation failed
      if (!validation.valid) {
        console.error('Export validation failed:', validation.errors)
        return {
          success: false,
          filename: null,
          size: 0,
          stats: validation.stats,
          errors: validation.errors
        }
      }
    }

    // Convert to all-data.json format (plural -> singular keys)
    const exportData = convertToExportFormat(data)

    // Generate filename
    const exportFilename = filename
      ? `${filename}.json`
      : generateExportFilename()

    // Calculate size
    const jsonString = JSON.stringify(exportData, null, 2)
    const size = new Blob([jsonString]).size

    // Download JSON
    downloadJSON(exportData, exportFilename)

    // Log success
    console.log('Official data exported successfully:', {
      filename: exportFilename,
      size: `${(size / 1024).toFixed(2)} KB`,
      entities: validation ? validation.stats : 'validation skipped'
    })

    return {
      success: true,
      filename: exportFilename,
      size,
      stats: validation ? validation.stats : {},
      errors: []
    }
  } catch (error) {
    console.error('Export failed:', error)
    return {
      success: false,
      filename: null,
      size: 0,
      stats: {},
      errors: [error.message]
    }
  }
}

/**
 * Get export preview without downloading
 * Useful for showing export statistics and validation results before actual export
 *
 * @returns {Object} Export preview with validation results and statistics
 */
export function getExportPreview() {
  try {
    const data = get(officialData)
    const validation = validateExportData(data)

    // Calculate estimated size
    const exportData = convertToExportFormat(data)
    const jsonString = JSON.stringify(exportData, null, 2)
    const size = new Blob([jsonString]).size

    return {
      success: true,
      validation,
      size,
      sizeFormatted: `${(size / 1024).toFixed(2)} KB`,
      filename: generateExportFilename(),
      entityCount: Object.values(validation.stats).reduce((a, b) => a + b, 0)
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Export specific entity types only
 * Useful for partial exports or testing
 *
 * @param {string[]} entityTypes - Array of entity type names (plural form)
 * @param {string} [filename] - Custom filename
 * @returns {ExportResult} Export result
 */
export function exportEntityTypes(entityTypes, filename) {
  try {
    const data = get(officialData)

    // Filter to only requested entity types
    const filteredData = {}
    for (const entityType of entityTypes) {
      if (ENTITY_TYPES.includes(entityType) && data[entityType]) {
        filteredData[entityType] = data[entityType]
      }
    }

    // Validate filtered data
    const validation = validateExportData(filteredData)

    if (!validation.valid) {
      console.error('Export validation failed:', validation.errors)
      return {
        success: false,
        filename: null,
        size: 0,
        stats: validation.stats,
        errors: validation.errors
      }
    }

    // Convert to export format
    const exportData = convertToExportFormat(filteredData)

    // Generate filename
    const exportFilename = filename
      ? `${filename}.json`
      : generateExportFilename(`partial-${entityTypes.join('-')}`)

    // Calculate size
    const jsonString = JSON.stringify(exportData, null, 2)
    const size = new Blob([jsonString]).size

    // Download JSON
    downloadJSON(exportData, exportFilename)

    console.log('Partial export completed:', {
      filename: exportFilename,
      entityTypes,
      stats: validation.stats
    })

    return {
      success: true,
      filename: exportFilename,
      size,
      stats: validation.stats,
      errors: []
    }
  } catch (error) {
    console.error('Partial export failed:', error)
    return {
      success: false,
      filename: null,
      size: 0,
      stats: {},
      errors: [error.message]
    }
  }
}
