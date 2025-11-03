/**
 * Character Export - Export character data to JSON files
 *
 * This module provides functionality to export characters to JSON format
 * with metadata and trigger browser downloads.
 *
 * Uses ImportExportService for all export operations.
 */

import { createCharacterService, createBatchCharactersService } from './importExportConfigs.js'

// Create service instances
const characterService = createCharacterService()
const batchService = createBatchCharactersService()

/**
 * Export a single character to JSON
 * @param {Object} character - Character object to export
 * @returns {Object} Export result with data and filename
 */
export function exportCharacter(character) {
  const result = characterService.export(character)

  if (!result.success) {
    throw new Error(result.errors[0] || 'Export failed')
  }

  return {
    data: result.data,
    filename: result.filename,
    json: result.json
  }
}

/**
 * Export multiple characters to a single JSON file
 * @param {Array} characters - Array of character objects
 * @returns {Object} Export result with data and filename
 */
export function exportAllCharacters(characters) {
  const result = batchService.export(characters)

  if (!result.success) {
    throw new Error(result.errors[0] || 'Export failed')
  }

  return {
    data: result.data,
    filename: result.filename,
    json: result.json
  }
}

/**
 * Trigger browser download of JSON data
 * @param {string} jsonString - JSON string to download
 * @param {string} filename - Filename for download
 */
export function downloadJSON(jsonString, filename) {
  characterService.downloadJSON(jsonString, filename)
}

/**
 * Export and download a character
 * @param {Object} character - Character to export
 * @returns {Object} Export result
 */
export function exportAndDownloadCharacter(character) {
  const result = characterService.exportAndDownload(character)

  if (!result.success) {
    throw new Error(result.errors[0] || 'Export failed')
  }

  return {
    data: result.data,
    filename: result.filename,
    json: result.json
  }
}

/**
 * Export and download all characters
 * @param {Array} characters - Characters to export
 * @returns {Object} Export result
 */
export function exportAndDownloadAllCharacters(characters) {
  const result = batchService.exportAndDownload(characters)

  if (!result.success) {
    throw new Error(result.errors[0] || 'Export failed')
  }

  return {
    data: result.data,
    filename: result.filename,
    json: result.json
  }
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
  const result = characterService.export(character, { compact: true })

  if (!result.success) {
    throw new Error(result.errors[0] || 'Export failed')
  }

  // Create compact data structure (minimal data)
  const compactData = {
    v: '1.0',
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
