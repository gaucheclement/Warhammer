/**
 * Character Export - Export character data to JSON files
 *
 * This module provides functionality to export characters to JSON format
 * with metadata and trigger browser downloads.
 */

/**
 * Export metadata version
 * Increment this when export format changes
 */
const EXPORT_VERSION = '1.0'

/**
 * Export a single character to JSON
 * @param {Object} character - Character object to export
 * @returns {Object} Export result with data and filename
 */
export function exportCharacter(character) {
  if (!character) {
    throw new Error('Character is required for export')
  }

  // Create export data with metadata
  const exportData = {
    _exported: new Date().toISOString(),
    _version: EXPORT_VERSION,
    _type: 'warhammer-character',
    character: {
      ...character
    }
  }

  // Generate filename: character-{name}-{date}.json
  const datestamp = new Date().toISOString().split('T')[0]
  const safeName = sanitizeFilename(character.name || 'unnamed')
  const filename = `character-${safeName}-${datestamp}.json`

  return {
    data: exportData,
    filename,
    json: JSON.stringify(exportData, null, 2)
  }
}

/**
 * Export multiple characters to a single JSON file
 * @param {Array} characters - Array of character objects
 * @returns {Object} Export result with data and filename
 */
export function exportAllCharacters(characters) {
  if (!Array.isArray(characters)) {
    throw new Error('Characters must be an array')
  }

  // Create export data with metadata
  const exportData = {
    _exported: new Date().toISOString(),
    _version: EXPORT_VERSION,
    _type: 'warhammer-characters-batch',
    count: characters.length,
    characters: characters.map(character => ({
      ...character
    }))
  }

  // Generate filename: characters-{date}.json
  const datestamp = new Date().toISOString().split('T')[0]
  const filename = `characters-${datestamp}.json`

  return {
    data: exportData,
    filename,
    json: JSON.stringify(exportData, null, 2)
  }
}

/**
 * Trigger browser download of JSON data
 * @param {string} jsonString - JSON string to download
 * @param {string} filename - Filename for download
 */
export function downloadJSON(jsonString, filename) {
  try {
    // Create blob from JSON string
    const blob = new Blob([jsonString], { type: 'application/json' })

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`)
  }
}

/**
 * Export and download a character
 * @param {Object} character - Character to export
 * @returns {Object} Export result
 */
export function exportAndDownloadCharacter(character) {
  const exportResult = exportCharacter(character)
  downloadJSON(exportResult.json, exportResult.filename)
  return exportResult
}

/**
 * Export and download all characters
 * @param {Array} characters - Characters to export
 * @returns {Object} Export result
 */
export function exportAndDownloadAllCharacters(characters) {
  const exportResult = exportAllCharacters(characters)
  downloadJSON(exportResult.json, exportResult.filename)
  return exportResult
}

/**
 * Sanitize filename for safe file system usage
 * @param {string} name - Original name
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .slice(0, 50) // Limit length
    || 'character' // Fallback
}

/**
 * Validate export data structure
 * @param {Object} exportData - Export data to validate
 * @returns {Object} Validation result
 */
export function validateExportData(exportData) {
  const errors = []
  const warnings = []

  if (!exportData) {
    errors.push('Export data is required')
    return { valid: false, errors, warnings }
  }

  // Check metadata
  if (!exportData._exported) {
    warnings.push('Missing export timestamp')
  }

  if (!exportData._version) {
    warnings.push('Missing export version')
  }

  if (!exportData._type) {
    warnings.push('Missing export type')
  }

  // Check character data
  if (exportData._type === 'warhammer-character') {
    if (!exportData.character) {
      errors.push('Missing character data')
    } else {
      // Validate character has required fields
      if (!exportData.character.name) {
        errors.push('Character missing name')
      }
      if (!exportData.character.species) {
        warnings.push('Character missing species')
      }
      if (!exportData.character.career) {
        warnings.push('Character missing career')
      }
    }
  } else if (exportData._type === 'warhammer-characters-batch') {
    if (!Array.isArray(exportData.characters)) {
      errors.push('Missing characters array')
    } else if (exportData.characters.length === 0) {
      warnings.push('Characters array is empty')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Create a shareable export (minimal data for sharing)
 * Useful for online sharing or version control
 * @param {Object} character - Character to export
 * @returns {Object} Compact export data
 */
export function exportCharacterCompact(character) {
  if (!character) {
    throw new Error('Character is required for export')
  }

  // Create compact export with only essential data
  const compactData = {
    v: EXPORT_VERSION,
    name: character.name,
    species: character.species,
    career: character.career,
    characteristics: character.characteristics,
    skills: character.skills,
    talents: character.talents,
    spells: character.spells,
    trappings: character.trappings,
    experience: character.experience,
    wounds: character.wounds,
    fate: character.fate,
    resilience: character.resilience,
    appearance: character.appearance,
    notes: character.notes
  }

  return {
    data: compactData,
    json: JSON.stringify(compactData)
  }
}
