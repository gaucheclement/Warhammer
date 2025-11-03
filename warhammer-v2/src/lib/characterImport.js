/**
 * Character Import - Import and validate character data from JSON files
 *
 * This module provides functionality to import characters from JSON format,
 * validate the data, handle ID conflicts, and sanitize input.
 *
 * Uses ImportExportService for all import operations.
 */

import { createCharacterService, createBatchCharactersService } from './importExportConfigs.js'
import { createCharacter } from './dataOperations.js'

// Create service instances
const characterService = createCharacterService()
const batchService = createBatchCharactersService()

/**
 * Import options
 * @typedef {Object} ImportOptions
 * @property {boolean} replaceIfExists - Replace character if ID exists (default: false)
 * @property {boolean} assignNewId - Assign new ID even if one exists (default: true)
 * @property {boolean} validateData - Run validation before import (default: true)
 * @property {Array} existingCharacters - List of existing characters for conflict detection
 * @property {Object} mergedData - Merged game data for validation
 */

/**
 * Parse JSON string and perform initial validation
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parsed data or error
 */
export function parseCharacterJSON(jsonString) {
  // Try single character first
  const singleResult = characterService.import(jsonString, { validate: false })

  if (singleResult.success) {
    return {
      success: true,
      data: {
        characters: [singleResult.data.character],
        exportType: 'single',
        metadata: singleResult.metadata
      },
      errors: [],
      warnings: singleResult.warnings
    }
  }

  // Try batch characters
  const batchResult = batchService.import(jsonString, { validate: false })

  if (batchResult.success) {
    return {
      success: true,
      data: {
        characters: batchResult.data.characters,
        exportType: 'batch',
        metadata: batchResult.metadata
      },
      errors: [],
      warnings: batchResult.warnings
    }
  }

  // Legacy format fallback
  try {
    const parsed = JSON.parse(jsonString)
    if (parsed.name && parsed.species) {
      return {
        success: true,
        data: {
          characters: [parsed],
          exportType: 'legacy',
          metadata: {}
        },
        errors: [],
        warnings: ['Legacy format detected, may require additional validation']
      }
    }
  } catch (error) {
    // Ignore parse errors, will be handled below
  }

  return {
    success: false,
    errors: [singleResult.errors[0] || 'Unrecognized export format']
  }
}

/**
 * Validate character data structure
 * @param {Object} character - Character object to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateImportedCharacter(character, options = {}) {
  const { existingCharacters = [], mergedData = null } = options

  // Use service validator
  const result = characterService.validator(
    { character },
    {
      mode: 'import',
      context: { existingCharacters, mergedData }
    }
  )

  return result
}

/**
 * Sanitize character data to prevent XSS and other issues
 * @param {Object} character - Character object to sanitize
 * @returns {Object} Sanitized character
 */
export function sanitizeCharacter(character) {
  const sanitized = characterService.sanitizer({ character })
  return sanitized.character
}


/**
 * Import a character into the database
 * @param {Object} character - Character to import
 * @param {ImportOptions} options - Import options
 * @returns {Promise<Object>} Import result
 */
export async function importCharacter(character, options = {}) {
  const {
    replaceIfExists = false,
    assignNewId = true,
    validateData = true,
    existingCharacters = [],
    mergedData = null
  } = options

  try {
    // Validate character data
    if (validateData) {
      const validation = validateImportedCharacter(character, {
        existingCharacters,
        mergedData
      })

      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings
        }
      }
    }

    // Sanitize character data
    const sanitized = sanitizeCharacter(character)

    // Handle ID conflicts
    let finalCharacter = { ...sanitized }

    if (assignNewId || !finalCharacter.id) {
      // Remove ID to let database assign new one
      delete finalCharacter.id
    } else if (!replaceIfExists && finalCharacter.id) {
      // Check for conflict
      const conflict = existingCharacters.find(c => c.id === finalCharacter.id)
      if (conflict) {
        return {
          success: false,
          errors: [`Character ID ${finalCharacter.id} already exists`],
          warnings: ['Use assignNewId option to create as new character or replaceIfExists to replace']
        }
      }
    }

    // Update timestamps
    if (!finalCharacter.created) {
      finalCharacter.created = new Date().toISOString()
    }
    finalCharacter.updated = new Date().toISOString()

    // Create character in database
    const result = await createCharacter(finalCharacter)

    return {
      success: result.success,
      data: result.data,
      errors: result.success ? [] : [result.error],
      warnings: []
    }
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
      warnings: []
    }
  }
}

/**
 * Import multiple characters
 * @param {Array} characters - Characters to import
 * @param {ImportOptions} options - Import options
 * @returns {Promise<Object>} Import result
 */
export async function importCharacters(characters, options = {}) {
  if (!Array.isArray(characters)) {
    return {
      success: false,
      errors: ['Characters must be an array']
    }
  }

  const results = []
  const errors = []
  const warnings = []

  for (const character of characters) {
    const result = await importCharacter(character, options)
    results.push(result)

    if (!result.success) {
      errors.push(`Failed to import "${character.name}": ${result.errors.join(', ')}`)
    }

    if (result.warnings && result.warnings.length > 0) {
      warnings.push(...result.warnings)
    }
  }

  const successCount = results.filter(r => r.success).length

  return {
    success: successCount === characters.length,
    data: {
      total: characters.length,
      imported: successCount,
      failed: characters.length - successCount,
      results
    },
    errors,
    warnings
  }
}

/**
 * Preview character import (validate without saving)
 * @param {string} jsonString - JSON string to preview
 * @param {ImportOptions} options - Import options
 * @returns {Object} Preview result
 */
export function previewCharacterImport(jsonString, options = {}) {
  // Parse JSON
  const parseResult = parseCharacterJSON(jsonString)
  if (!parseResult.success) {
    return parseResult
  }

  const { characters, exportType, metadata } = parseResult.data
  const previews = []

  // Validate each character
  for (const character of characters) {
    const validation = validateImportedCharacter(character, options)
    previews.push({
      character: {
        name: character.name,
        species: character.species?.name,
        career: character.career?.name,
        id: character.id
      },
      validation
    })
  }

  return {
    success: true,
    data: {
      exportType,
      metadata,
      count: characters.length,
      previews
    }
  }
}
