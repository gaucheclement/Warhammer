/**
 * Character Migration Utilities
 *
 * This module provides utilities for:
 * - Importing characters from V1 format (remote server JSON)
 * - Exporting characters to JSON for backup
 * - Converting between V1 and V2 character formats
 * - Schema version migrations
 *
 * V1 Format: Character.html state structure (remote server persistence)
 * V2 Format: IndexedDB schema (local persistence)
 */

import {
  createEmptyCharacter,
  createCharacteristic,
  createSkill,
  createTalent,
  createSpell,
  createTrapping,
  createDetail,
  validateCharacter
} from './characterSchema.js'

/**
 * Import character from V1 format
 * Converts V1's Character.html state structure to V2's IndexedDB schema
 * @param {Object|string} v1Data - V1 character data (object or JSON string)
 * @returns {Object} V2 character object
 */
export function importFromV1(v1Data) {
  try {
    // Parse if string
    const v1Char = typeof v1Data === 'string' ? JSON.parse(v1Data) : v1Data

    // Create base V2 character
    const v2Char = createEmptyCharacter()

    // Basic fields
    v2Char.name = v1Char.name || 'Imported Character'
    v2Char.mode = v1Char.mode || 'creation'
    v2Char.stepIndex = v1Char.stepIndex !== undefined ? v1Char.stepIndex : null

    // Species
    if (v1Char.specie) {
      v2Char.specie = {
        id: v1Char.specie.id,
        data: v1Char.specie.data || null
      }
    }

    // Career Level
    if (v1Char.careerLevel) {
      v2Char.careerLevel = {
        id: v1Char.careerLevel.id,
        data: v1Char.careerLevel.data || null
      }
    }

    // Star
    if (v1Char.star) {
      v2Char.star = {
        id: v1Char.star.id,
        data: v1Char.star.data || null
      }
    }

    // God
    v2Char.god = v1Char.god || null

    // Magic
    v2Char.magic = v1Char.magic || null

    // Characteristics
    if (Array.isArray(v1Char.characteristics)) {
      v2Char.characteristics = v1Char.characteristics.map(char => ({
        id: char.id,
        roll: char.roll || 0,
        talent: char.talent || 0,
        advance: char.advance || 0,
        tmpadvance: char.tmpadvance || 0,
        specie: char.specie || 0,
        star: char.star || 0,
        career: char.career || 0,
        data: char.data || null,
        origins: Array.isArray(char.origins) ? char.origins : []
      }))
    }

    // Skills
    if (Array.isArray(v1Char.skills)) {
      v2Char.skills = v1Char.skills.map(skill => ({
        id: skill.id,
        advance: skill.advance || 0,
        tmpadvance: skill.tmpadvance || 0,
        specie: skill.specie || 0,
        career: skill.career || 0,
        spec: skill.spec || '',
        specs: Array.isArray(skill.specs) ? skill.specs : [],
        data: skill.data || null,
        origins: Array.isArray(skill.origins) ? skill.origins : []
      }))
    }

    // Talents
    if (Array.isArray(v1Char.talents)) {
      v2Char.talents = v1Char.talents.map(talent => ({
        id: talent.id,
        advance: talent.advance || 0,
        tmpadvance: talent.tmpadvance || 0,
        roll: talent.roll || 0,
        spec: talent.spec || '',
        specs: Array.isArray(talent.specs) ? talent.specs : [],
        data: talent.data || null,
        origins: Array.isArray(talent.origins) ? talent.origins : []
      }))
    }

    // Spells
    if (Array.isArray(v1Char.spells)) {
      v2Char.spells = v1Char.spells.map(spell => ({
        id: spell.id,
        spec: spell.spec || '',
        data: spell.data || null
      }))
    }

    // Trappings
    if (Array.isArray(v1Char.trappings)) {
      v2Char.trappings = v1Char.trappings.map(trapping => ({
        id: trapping.id,
        quantity: trapping.quantity || 1,
        equipped: trapping.equipped || false,
        spec: trapping.spec || '',
        data: trapping.data || null
      }))
    }

    // Details
    if (Array.isArray(v1Char.details)) {
      v2Char.details = v1Char.details.map(detail => ({
        type: detail.type,
        value: detail.value
      }))
    }

    // XP
    if (v1Char.xp) {
      v2Char.xp = {
        max: v1Char.xp.max || 0,
        log: v1Char.xp.log || {},
        used: v1Char.xp.used || 0,
        tmp_used: v1Char.xp.tmp_used || 0
      }
    }

    // Random State
    if (v1Char.randomState) {
      v2Char.randomState = {
        specie: v1Char.randomState.specie || 0,
        imposedSpecie: Array.isArray(v1Char.randomState.imposedSpecie)
          ? v1Char.randomState.imposedSpecie
          : [],
        career: v1Char.randomState.career || 0,
        imposedCareers: Array.isArray(v1Char.randomState.imposedCareers)
          ? v1Char.randomState.imposedCareers
          : [],
        star: v1Char.randomState.star || 0,
        imposedStar: Array.isArray(v1Char.randomState.imposedStar)
          ? v1Char.randomState.imposedStar
          : [],
        characteristic: v1Char.randomState.characteristic || 0,
        imposedCharacteristics: v1Char.randomState.imposedCharacteristics || {},
        imposedTalents: Array.isArray(v1Char.randomState.imposedTalents)
          ? v1Char.randomState.imposedTalents
          : []
      }
    }

    // Timestamps
    v2Char.created = v1Char.created || new Date().toISOString()
    v2Char.updated = new Date().toISOString()

    // Version
    v2Char.version = 1

    return v2Char
  } catch (error) {
    console.error('Error importing from V1:', error)
    throw new Error('Failed to import V1 character: ' + error.message)
  }
}

/**
 * Export character to V1-compatible format
 * Converts V2's IndexedDB schema to V1's Character.html structure
 * @param {Object} v2Char - V2 character object
 * @returns {Object} V1 character object
 */
export function exportToV1(v2Char) {
  try {
    // V1 and V2 formats are very similar, mostly just need to ensure structure
    const v1Char = {
      mode: v2Char.mode,
      stepIndex: v2Char.stepIndex,
      specie: v2Char.specie,
      careerLevel: v2Char.careerLevel,
      characteristics: v2Char.characteristics,
      skills: v2Char.skills,
      talents: v2Char.talents,
      spells: v2Char.spells,
      trappings: v2Char.trappings,
      details: v2Char.details,
      god: v2Char.god,
      star: v2Char.star,
      magic: v2Char.magic,
      xp: v2Char.xp,
      randomState: v2Char.randomState
    }

    // Add V1-specific methods if needed
    // (Methods will need to be re-attached by V1 code)

    return v1Char
  } catch (error) {
    console.error('Error exporting to V1:', error)
    throw new Error('Failed to export to V1 format: ' + error.message)
  }
}

/**
 * Export character to JSON string
 * @param {Object} character - Character object
 * @param {boolean} [pretty=true] - Pretty print JSON
 * @returns {string} JSON string
 */
export function exportToJSON(character, pretty = true) {
  try {
    return JSON.stringify(character, null, pretty ? 2 : 0)
  } catch (error) {
    console.error('Error exporting to JSON:', error)
    throw new Error('Failed to export character to JSON: ' + error.message)
  }
}

/**
 * Import character from JSON string
 * @param {string} jsonString - JSON string
 * @returns {Object} Character object
 */
export function importFromJSON(jsonString) {
  try {
    const character = JSON.parse(jsonString)

    // Validate
    const validation = validateCharacter(character)
    if (!validation.valid) {
      throw new Error('Invalid character data: ' + validation.errors.join(', '))
    }

    return character
  } catch (error) {
    console.error('Error importing from JSON:', error)
    throw new Error('Failed to import character from JSON: ' + error.message)
  }
}

/**
 * Migrate character to current schema version
 * @param {Object} character - Character to migrate
 * @returns {Object} Migrated character
 */
export function migrateCharacter(character) {
  const currentVersion = character.version || 0
  const targetVersion = 1

  if (currentVersion >= targetVersion) {
    return character
  }

  console.log(`Migrating character from version ${currentVersion} to ${targetVersion}`)

  let migrated = { ...character }

  // Migration from version 0 to 1
  if (currentVersion < 1) {
    migrated = migrateV0ToV1(migrated)
  }

  // Future migrations would go here
  // if (currentVersion < 2) {
  //   migrated = migrateV1ToV2(migrated)
  // }

  return migrated
}

/**
 * Migrate from version 0 (no version field) to version 1
 * @param {Object} character - Character to migrate
 * @returns {Object} Migrated character
 */
function migrateV0ToV1(character) {
  const migrated = { ...character }

  // Add version field
  migrated.version = 1

  // Ensure all required fields exist
  if (!migrated.created) {
    migrated.created = new Date().toISOString()
  }

  if (!migrated.updated) {
    migrated.updated = new Date().toISOString()
  }

  // Ensure arrays are arrays
  if (!Array.isArray(migrated.characteristics)) {
    migrated.characteristics = []
  }
  if (!Array.isArray(migrated.skills)) {
    migrated.skills = []
  }
  if (!Array.isArray(migrated.talents)) {
    migrated.talents = []
  }
  if (!Array.isArray(migrated.spells)) {
    migrated.spells = []
  }
  if (!Array.isArray(migrated.trappings)) {
    migrated.trappings = []
  }
  if (!Array.isArray(migrated.details)) {
    migrated.details = []
  }

  // Ensure XP structure
  if (!migrated.xp) {
    migrated.xp = {
      max: 0,
      log: {},
      used: 0,
      tmp_used: 0
    }
  }

  // Ensure randomState structure
  if (!migrated.randomState) {
    migrated.randomState = {
      specie: 0,
      imposedSpecie: [],
      career: 0,
      imposedCareers: [],
      star: 0,
      imposedStar: [],
      characteristic: 0,
      imposedCharacteristics: {},
      imposedTalents: []
    }
  }

  console.log('Migrated character to version 1')

  return migrated
}

/**
 * Batch import characters from V1 format
 * @param {Array|string} v1CharactersData - Array of V1 characters or JSON string
 * @returns {Array} Array of V2 characters
 */
export function batchImportFromV1(v1CharactersData) {
  try {
    const v1Array = typeof v1CharactersData === 'string'
      ? JSON.parse(v1CharactersData)
      : v1CharactersData

    if (!Array.isArray(v1Array)) {
      throw new Error('Expected array of characters')
    }

    return v1Array.map((v1Char, index) => {
      try {
        return importFromV1(v1Char)
      } catch (error) {
        console.error(`Error importing character ${index}:`, error)
        throw error
      }
    })
  } catch (error) {
    console.error('Error batch importing from V1:', error)
    throw new Error('Failed to batch import V1 characters: ' + error.message)
  }
}

/**
 * Batch export characters to V1 format
 * @param {Array} v2Characters - Array of V2 characters
 * @returns {Array} Array of V1 characters
 */
export function batchExportToV1(v2Characters) {
  try {
    if (!Array.isArray(v2Characters)) {
      throw new Error('Expected array of characters')
    }

    return v2Characters.map((v2Char, index) => {
      try {
        return exportToV1(v2Char)
      } catch (error) {
        console.error(`Error exporting character ${index}:`, error)
        throw error
      }
    })
  } catch (error) {
    console.error('Error batch exporting to V1:', error)
    throw new Error('Failed to batch export to V1 format: ' + error.message)
  }
}

/**
 * Validate imported character and fix common issues
 * @param {Object} character - Character to validate and fix
 * @returns {Object} Fixed character
 */
export function validateAndFixImport(character) {
  const fixed = { ...character }

  // Ensure name exists
  if (!fixed.name || fixed.name.trim() === '') {
    fixed.name = 'Imported Character'
  }

  // Ensure mode is valid
  if (!['creation', 'libre'].includes(fixed.mode)) {
    fixed.mode = 'creation'
  }

  // Ensure all arrays exist
  const arrays = ['characteristics', 'skills', 'talents', 'spells', 'trappings', 'details']
  arrays.forEach(field => {
    if (!Array.isArray(fixed[field])) {
      fixed[field] = []
    }
  })

  // Ensure XP structure
  if (!fixed.xp || typeof fixed.xp !== 'object') {
    fixed.xp = {
      max: 0,
      log: {},
      used: 0,
      tmp_used: 0
    }
  } else {
    fixed.xp.max = fixed.xp.max || 0
    fixed.xp.log = fixed.xp.log || {}
    fixed.xp.used = fixed.xp.used || 0
    fixed.xp.tmp_used = fixed.xp.tmp_used || 0
  }

  // Ensure randomState structure
  if (!fixed.randomState || typeof fixed.randomState !== 'object') {
    fixed.randomState = {
      specie: 0,
      imposedSpecie: [],
      career: 0,
      imposedCareers: [],
      star: 0,
      imposedStar: [],
      characteristic: 0,
      imposedCharacteristics: {},
      imposedTalents: []
    }
  }

  // Ensure timestamps
  if (!fixed.created) {
    fixed.created = new Date().toISOString()
  }
  fixed.updated = new Date().toISOString()

  // Ensure version
  if (!fixed.version) {
    fixed.version = 1
  }

  return fixed
}

/**
 * Convert localStorage character data to V2 format
 * V1 stored characters in localStorage as JSON
 * @param {string} localStorageKey - Key used in localStorage
 * @returns {Object|null} V2 character or null if not found
 */
export function importFromLocalStorage(localStorageKey) {
  try {
    const data = localStorage.getItem(localStorageKey)
    if (!data) {
      return null
    }

    const v1Char = JSON.parse(data)
    return importFromV1(v1Char)
  } catch (error) {
    console.error('Error importing from localStorage:', error)
    throw new Error('Failed to import from localStorage: ' + error.message)
  }
}

/**
 * Get migration summary for a character
 * @param {Object} character - Character to analyze
 * @returns {Object} Migration summary
 */
export function getMigrationSummary(character) {
  const currentVersion = character.version || 0
  const targetVersion = 1
  const needsMigration = currentVersion < targetVersion

  return {
    currentVersion,
    targetVersion,
    needsMigration,
    issues: needsMigration ? ['Character needs migration to current version'] : []
  }
}
