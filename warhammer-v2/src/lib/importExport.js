/**
 * Import/Export Utilities - JSON data import/export with validation
 *
 * This module provides utilities for importing and exporting custom modifications
 * and character data. Includes validation, sanitization, and conflict resolution.
 */

import {
  validateImportData,
  sanitizeImportData,
  checkIdConflicts,
  generateChangePreview,
  validateJSON,
  validateFileSize
} from './validation.js'

/**
 * @typedef {Object} ImportOptions
 * @property {boolean} [merge] - Merge with existing data (default: true)
 * @property {boolean} [overwrite] - Overwrite existing entries (default: false)
 * @property {boolean} [validate] - Validate data before import (default: true)
 * @property {boolean} [sanitize] - Sanitize data to prevent XSS (default: true)
 * @property {string[]} [entityTypes] - Only import specific entity types
 */

/**
 * @typedef {Object} ImportResult
 * @property {boolean} success - Whether import succeeded
 * @property {Object} data - Imported data
 * @property {number} importedCount - Number of entries imported
 * @property {number} skippedCount - Number of entries skipped
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 * @property {Object} conflicts - ID conflicts detected
 */

/**
 * @typedef {Object} ExportOptions
 * @property {string[]} [entityTypes] - Only export specific entity types
 * @property {boolean} [includeCharacters] - Include characters (default: false)
 * @property {boolean} [includeMetadata] - Include metadata (default: true)
 * @property {boolean} [prettyPrint] - Pretty print JSON (default: false)
 */

/**
 * Import custom modifications from JSON string
 * @param {string} jsonString - JSON string to import
 * @param {Object} existingData - Existing custom modifications
 * @param {ImportOptions} [options] - Import options
 * @returns {Promise<ImportResult>} Import result
 */
export async function importCustomModifications(
  jsonString,
  existingData,
  options = {}
) {
  const {
    merge = true,
    overwrite = false,
    validate = true,
    sanitize = true,
    entityTypes = null
  } = options

  const errors = []
  const warnings = []
  let importedCount = 0
  let skippedCount = 0

  try {
    // Validate JSON structure
    const jsonValidation = validateJSON(jsonString)
    if (!jsonValidation.valid) {
      return {
        success: false,
        data: null,
        importedCount: 0,
        skippedCount: 0,
        errors: jsonValidation.errors,
        warnings: [],
        conflicts: {}
      }
    }

    let data = jsonValidation.data

    // Filter by entity types if specified
    if (entityTypes && Array.isArray(entityTypes)) {
      const filtered = {}
      for (const type of entityTypes) {
        if (data[type]) {
          filtered[type] = data[type]
        }
      }
      data = filtered
    }

    // Validate data structure
    if (validate) {
      const validation = validateImportData(data)
      if (!validation.valid) {
        errors.push(...validation.errors)
      }
      warnings.push(...validation.warnings)

      // Don't proceed if validation failed
      if (!validation.valid) {
        return {
          success: false,
          data: null,
          importedCount: 0,
          skippedCount: 0,
          errors,
          warnings,
          conflicts: {}
        }
      }
    }

    // Sanitize data
    if (sanitize) {
      data = sanitizeImportData(data)
    }

    // Check for ID conflicts
    const conflicts = checkIdConflicts(data, existingData)
    if (Object.keys(conflicts).length > 0) {
      warnings.push('ID conflicts detected')

      if (!overwrite) {
        for (const [entityType, ids] of Object.entries(conflicts)) {
          warnings.push(
            `${entityType}: ${ids.length} entries will be skipped due to ID conflicts`
          )
        }
      } else {
        for (const [entityType, ids] of Object.entries(conflicts)) {
          warnings.push(
            `${entityType}: ${ids.length} entries will be overwritten`
          )
        }
      }
    }

    // Merge or replace data
    const resultData = merge
      ? mergeImportData(data, existingData, overwrite)
      : data

    // Count imported and skipped entries
    for (const [entityType, entries] of Object.entries(resultData)) {
      if (Array.isArray(entries)) {
        const existingCount = (existingData[entityType] || []).length
        const newCount = entries.length
        const imported = newCount - existingCount

        if (imported > 0) {
          importedCount += imported
        } else if (imported < 0) {
          skippedCount += Math.abs(imported)
        }
      }
    }

    return {
      success: true,
      data: resultData,
      importedCount,
      skippedCount,
      errors,
      warnings,
      conflicts
    }
  } catch (error) {
    errors.push(`Import failed: ${error.message}`)
    return {
      success: false,
      data: null,
      importedCount: 0,
      skippedCount: 0,
      errors,
      warnings,
      conflicts: {}
    }
  }
}

/**
 * Import custom modifications from a file
 * @param {File} file - File to import
 * @param {Object} existingData - Existing custom modifications
 * @param {ImportOptions} [options] - Import options
 * @returns {Promise<ImportResult>} Import result
 */
export async function importFromFile(file, existingData, options = {}) {
  const errors = []

  try {
    // Validate file size
    const sizeValidation = validateFileSize(file.size)
    if (!sizeValidation.valid) {
      return {
        success: false,
        data: null,
        importedCount: 0,
        skippedCount: 0,
        errors: sizeValidation.errors,
        warnings: sizeValidation.warnings,
        conflicts: {}
      }
    }

    // Read file content
    const content = await readFileAsText(file)

    // Import from JSON string
    return await importCustomModifications(content, existingData, options)
  } catch (error) {
    errors.push(`Failed to read file: ${error.message}`)
    return {
      success: false,
      data: null,
      importedCount: 0,
      skippedCount: 0,
      errors,
      warnings: [],
      conflicts: {}
    }
  }
}

/**
 * Export custom modifications to JSON string
 * @param {Object} customData - Custom modifications to export
 * @param {ExportOptions} [options] - Export options
 * @returns {string} JSON string
 */
export function exportCustomModifications(customData, options = {}) {
  const {
    entityTypes = null,
    includeCharacters = false,
    includeMetadata = true,
    prettyPrint = false
  } = options

  let data = { ...customData }

  // Filter by entity types if specified
  if (entityTypes && Array.isArray(entityTypes)) {
    const filtered = {}
    for (const type of entityTypes) {
      if (data[type]) {
        filtered[type] = data[type]
      }
    }
    data = filtered
  }

  // Remove characters if not included
  if (!includeCharacters) {
    delete data.characters
  }

  // Add metadata
  if (includeMetadata) {
    data._metadata = {
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      appName: 'Warhammer Fantasy Roleplay 4e',
      entityTypes: Object.keys(data).filter((key) => !key.startsWith('_'))
    }
  }

  // Convert to JSON
  return JSON.stringify(data, null, prettyPrint ? 2 : 0)
}

/**
 * Export custom modifications to a downloadable file
 * @param {Object} customData - Custom modifications to export
 * @param {string} [filename] - Filename (default: warhammer-custom-data.json)
 * @param {ExportOptions} [options] - Export options
 * @returns {void}
 */
export function exportToFile(
  customData,
  filename = 'warhammer-custom-data.json',
  options = {}
) {
  const jsonString = exportCustomModifications(customData, {
    ...options,
    prettyPrint: true
  })

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
 * Export characters to JSON
 * @param {Array} characters - Characters to export
 * @param {boolean} [includeMetadata] - Include metadata
 * @returns {string} JSON string
 */
export function exportCharacters(characters, includeMetadata = true) {
  const data = {
    characters
  }

  if (includeMetadata) {
    data._metadata = {
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      appName: 'Warhammer Fantasy Roleplay 4e',
      characterCount: characters.length
    }
  }

  return JSON.stringify(data, null, 2)
}

/**
 * Export characters to a downloadable file
 * @param {Array} characters - Characters to export
 * @param {string} [filename] - Filename
 * @returns {void}
 */
export function exportCharactersToFile(
  characters,
  filename = 'warhammer-characters.json'
) {
  const jsonString = exportCharacters(characters, true)

  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * Generate a JSON patch for modified entries
 * Exports only the differences from official data
 * @param {Object} customModifications - Custom modifications
 * @param {Object} officialData - Official data
 * @returns {string} JSON patch
 */
export function generateJSONPatch(customModifications, officialData) {
  const patch = {
    _metadata: {
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      type: 'json-patch',
      appName: 'Warhammer Fantasy Roleplay 4e'
    },
    modifications: []
  }

  for (const [entityType, entries] of Object.entries(customModifications)) {
    if (!Array.isArray(entries) || entries.length === 0) {
      continue
    }

    const officialMap = new Map()
    if (officialData[entityType]) {
      for (const entry of officialData[entityType]) {
        officialMap.set(entry.id, entry)
      }
    }

    for (const entry of entries) {
      const operation = officialMap.has(entry.id)
        ? 'update'
        : entry.isCustom
          ? 'add'
          : 'unknown'

      const mod = {
        op: operation,
        entityType,
        id: entry.id,
        data: entry
      }

      // For updates, include only changed fields
      if (operation === 'update') {
        const original = officialMap.get(entry.id)
        const changes = {}

        for (const [key, value] of Object.entries(entry)) {
          if (key.startsWith('_') || key.startsWith('is')) continue
          if (JSON.stringify(original[key]) !== JSON.stringify(value)) {
            changes[key] = value
          }
        }

        mod.changes = changes
      }

      patch.modifications.push(mod)
    }
  }

  return JSON.stringify(patch, null, 2)
}

/**
 * Generate a change preview for import
 * @param {string} jsonString - JSON string to preview
 * @param {Object} existingData - Existing data
 * @returns {Promise<Object>} Change preview
 */
export async function previewImport(jsonString, existingData) {
  try {
    const jsonValidation = validateJSON(jsonString)
    if (!jsonValidation.valid) {
      return {
        success: false,
        errors: jsonValidation.errors,
        preview: null
      }
    }

    const data = jsonValidation.data
    const preview = generateChangePreview(data, existingData)

    return {
      success: true,
      errors: [],
      preview
    }
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
      preview: null
    }
  }
}

/**
 * Merge imported data with existing data
 * @param {Object} importedData - Data to import
 * @param {Object} existingData - Existing data
 * @param {boolean} overwrite - Whether to overwrite existing entries
 * @returns {Object} Merged data
 */
function mergeImportData(importedData, existingData, overwrite) {
  const merged = {}

  // Get all entity types from both datasets
  const allTypes = new Set([
    ...Object.keys(importedData),
    ...Object.keys(existingData)
  ])

  for (const entityType of allTypes) {
    // Skip metadata fields
    if (entityType.startsWith('_')) {
      continue
    }

    const imported = importedData[entityType] || []
    const existing = existingData[entityType] || []

    if (!Array.isArray(imported) || !Array.isArray(existing)) {
      merged[entityType] = imported.length > 0 ? imported : existing
      continue
    }

    const existingMap = new Map(existing.map((e) => [e.id, e]))
    const result = [...existing]

    for (const entry of imported) {
      if (existingMap.has(entry.id)) {
        if (overwrite) {
          // Replace existing entry
          const index = result.findIndex((e) => e.id === entry.id)
          if (index !== -1) {
            result[index] = entry
          }
        }
        // else skip (don't overwrite)
      } else {
        // Add new entry
        result.push(entry)
      }
    }

    merged[entityType] = result
  }

  return merged
}

/**
 * Read a file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      resolve(event.target.result)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsText(file)
  })
}

/**
 * Validate import before applying
 * @param {string} jsonString - JSON to validate
 * @param {Object} existingData - Existing data
 * @returns {Object} Validation report
 */
export function validateImport(jsonString, existingData) {
  const report = {
    valid: false,
    errors: [],
    warnings: [],
    conflicts: {},
    preview: null
  }

  try {
    // Validate JSON
    const jsonValidation = validateJSON(jsonString)
    if (!jsonValidation.valid) {
      report.errors.push(...jsonValidation.errors)
      return report
    }

    const data = jsonValidation.data

    // Validate data structure
    const validation = validateImportData(data)
    report.errors.push(...validation.errors)
    report.warnings.push(...validation.warnings)

    if (!validation.valid) {
      return report
    }

    // Check conflicts
    report.conflicts = checkIdConflicts(data, existingData)

    // Generate preview
    report.preview = generateChangePreview(data, existingData)

    report.valid = true
    return report
  } catch (error) {
    report.errors.push(`Validation error: ${error.message}`)
    return report
  }
}
