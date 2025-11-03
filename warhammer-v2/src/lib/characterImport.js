/**
 * Character Import - Import and validate character data from JSON files
 *
 * This module provides functionality to import characters from JSON format,
 * validate the data, handle ID conflicts, and sanitize input.
 */

import { validateCompleteCharacter } from './characterValidation.js'
import { createCharacter } from './dataOperations.js'
import { sanitizeString, sanitizeObject, sanitizeArray } from './sanitization.js'

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
  const errors = []
  const warnings = []

  // Check if JSON string is valid
  if (!jsonString || typeof jsonString !== 'string') {
    return {
      success: false,
      errors: ['Invalid JSON string provided']
    }
  }

  // Attempt to parse JSON
  let parsed
  try {
    parsed = JSON.parse(jsonString)
  } catch (error) {
    return {
      success: false,
      errors: [`Invalid JSON syntax: ${error.message}`]
    }
  }

  // Check if it's a valid export format
  if (!parsed) {
    return {
      success: false,
      errors: ['Parsed data is empty']
    }
  }

  // Determine export type
  let characters = []
  let exportType = 'unknown'

  if (parsed._type === 'warhammer-character' && parsed.character) {
    // Single character export
    characters = [parsed.character]
    exportType = 'single'
  } else if (parsed._type === 'warhammer-characters-batch' && Array.isArray(parsed.characters)) {
    // Multiple characters export
    characters = parsed.characters
    exportType = 'batch'
  } else if (parsed.name && parsed.species) {
    // Legacy or compact format (assume it's a character)
    characters = [parsed]
    exportType = 'legacy'
    warnings.push('Legacy format detected, may require additional validation')
  } else {
    return {
      success: false,
      errors: ['Unrecognized export format']
    }
  }

  // Check version compatibility
  if (parsed._version && parsed._version !== '1.0') {
    warnings.push(`Export version ${parsed._version} may not be fully compatible`)
  }

  return {
    success: true,
    data: {
      characters,
      exportType,
      metadata: {
        exported: parsed._exported,
        version: parsed._version,
        type: parsed._type
      }
    },
    errors,
    warnings
  }
}

/**
 * Validate character data structure
 * @param {Object} character - Character object to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateImportedCharacter(character, options = {}) {
  const errors = []
  const warnings = []

  const {
    existingCharacters = [],
    mergedData = null
  } = options

  // Check required fields
  if (!character.name || character.name.trim().length === 0) {
    errors.push('Character name is required')
  }

  if (!character.species || !character.species.id) {
    errors.push('Character must have a species')
  }

  if (!character.career || !character.career.id) {
    errors.push('Character must have a career')
  }

  if (!character.characteristics) {
    errors.push('Character must have characteristics')
  }

  // Check data types
  if (character.skills && !Array.isArray(character.skills)) {
    errors.push('Skills must be an array')
  }

  if (character.talents && !Array.isArray(character.talents)) {
    errors.push('Talents must be an array')
  }

  if (character.spells && !Array.isArray(character.spells)) {
    errors.push('Spells must be an array')
  }

  if (character.trappings && !Array.isArray(character.trappings)) {
    errors.push('Trappings must be an array')
  }

  // Check for ID conflicts
  if (character.id && existingCharacters.length > 0) {
    const conflict = existingCharacters.find(c => c.id === character.id)
    if (conflict) {
      warnings.push(`Character ID ${character.id} already exists: "${conflict.name}"`)
    }
  }

  // Validate species exists in game data
  if (mergedData && character.species && character.species.id) {
    const speciesExists = mergedData.species?.find(s => s.id === character.species.id)
    if (!speciesExists) {
      warnings.push(`Species "${character.species.name}" (ID: ${character.species.id}) not found in game data`)
    }
  }

  // Validate career exists in game data
  if (mergedData && character.career && character.career.id) {
    const careerExists = mergedData.careers?.find(c => c.id === character.career.id)
    if (!careerExists) {
      warnings.push(`Career "${character.career.name}" (ID: ${character.career.id}) not found in game data`)
    }
  }

  // Validate skills exist
  if (mergedData && character.skills && character.skills.length > 0) {
    for (const skill of character.skills) {
      if (skill.id) {
        const skillExists = mergedData.skills?.find(s => s.id === skill.id)
        if (!skillExists) {
          warnings.push(`Skill "${skill.name}" (ID: ${skill.id}) not found in game data`)
        }
      }
    }
  }

  // Validate talents exist
  if (mergedData && character.talents && character.talents.length > 0) {
    for (const talent of character.talents) {
      if (talent.id) {
        const talentExists = mergedData.talents?.find(t => t.id === talent.id)
        if (!talentExists) {
          warnings.push(`Talent "${talent.name}" (ID: ${talent.id}) not found in game data`)
        }
      }
    }
  }

  // Use comprehensive validation if available
  if (errors.length === 0) {
    const validation = validateCompleteCharacter(character, {
      existingCharacters,
      career: mergedData?.careers?.find(c => c.id === character.career?.id)
    })

    errors.push(...validation.errors)
    warnings.push(...validation.warnings)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Sanitize character data to prevent XSS and other issues
 * @param {Object} character - Character object to sanitize
 * @returns {Object} Sanitized character
 */
export function sanitizeCharacter(character) {
  const sanitized = {}

  // Sanitize string fields
  const stringFields = ['name', 'notes']
  for (const field of stringFields) {
    if (character[field]) {
      sanitized[field] = sanitizeString(character[field])
    } else {
      sanitized[field] = character[field]
    }
  }

  // Sanitize nested objects
  sanitized.species = sanitizeObject(character.species, ['name'])
  sanitized.career = sanitizeObject(character.career, ['name'])
  sanitized.appearance = sanitizeObject(character.appearance, ['eyes', 'hair', 'distinguishing'])

  // Copy numeric/structured data directly (already validated)
  sanitized.characteristics = { ...character.characteristics }
  sanitized.experience = { ...character.experience }
  sanitized.wounds = { ...character.wounds }
  sanitized.fate = { ...character.fate }
  sanitized.resilience = { ...character.resilience }

  // Sanitize arrays
  sanitized.skills = sanitizeArray(character.skills, ['name'])
  sanitized.talents = sanitizeArray(character.talents, ['name', 'description'])
  sanitized.spells = sanitizeArray(character.spells, ['name', 'range', 'lore'])
  sanitized.trappings = sanitizeArray(character.trappings, ['name'])

  // Preserve timestamps
  sanitized.created = character.created
  sanitized.updated = character.updated
  sanitized.isDraft = character.isDraft

  return sanitized
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
