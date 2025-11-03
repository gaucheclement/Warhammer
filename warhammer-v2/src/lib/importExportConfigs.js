/**
 * ImportExportConfigs - Pre-configured import/export services
 *
 * This module provides ready-to-use import/export service configurations
 * for different data types (characters, modifications, etc.)
 */

import {
  ImportExportService,
  createValidator,
  createTransformer,
  createFilenameGenerator
} from './importExportService.js'
import { generateFilenameWithDate, sanitizeFilename } from './fileUtils.js'
import { validateCompleteCharacter } from './characterValidation.js'
import { sanitizeObject, sanitizeArray, sanitizeString } from './sanitization.js'

/**
 * Character Import/Export Service Configuration
 */

// Validator for single character
const characterValidator = createValidator((data, options = {}) => {
  const errors = []
  const warnings = []
  const mode = options.mode || 'export'

  if (mode === 'export') {
    // Export validation - check that we have a valid character
    if (!data) {
      errors.push('Le personnage est requis pour l\'exportation')
      return { valid: false, errors, warnings }
    }

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Le nom du personnage est requis')
    }

    if (!data.species || !data.species.id) {
      errors.push('Le personnage doit avoir une espèce')
    }

    if (!data.career || !data.career.id) {
      errors.push('Le personnage doit avoir une carrière')
    }

    if (!data.characteristics) {
      errors.push('Le personnage doit avoir des caractéristiques')
    }
  } else if (mode === 'import') {
    // Import validation - check structure and optionally validate against game data
    if (!data.character) {
      errors.push('Données de personnage manquantes')
      return { valid: false, errors, warnings }
    }

    const character = data.character

    if (!character.name || character.name.trim().length === 0) {
      errors.push('Le nom du personnage est requis')
    }

    if (!character.species || !character.species.id) {
      errors.push('Le personnage doit avoir une espèce')
    }

    if (!character.career || !character.career.id) {
      errors.push('Le personnage doit avoir une carrière')
    }

    if (!character.characteristics) {
      errors.push('Le personnage doit avoir des caractéristiques')
    }

    // Type checks
    if (character.skills && !Array.isArray(character.skills)) {
      errors.push('Les compétences doivent être un tableau')
    }

    if (character.talents && !Array.isArray(character.talents)) {
      errors.push('Les talents doivent être un tableau')
    }

    if (character.spells && !Array.isArray(character.spells)) {
      errors.push('Les sorts doivent être un tableau')
    }

    if (character.trappings && !Array.isArray(character.trappings)) {
      errors.push('Les équipements doivent être un tableau')
    }

    // Use comprehensive validation if context provided
    if (errors.length === 0 && options.context) {
      const fullValidation = validateCompleteCharacter(character, options.context)
      errors.push(...fullValidation.errors)
      warnings.push(...fullValidation.warnings)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
})

// Transformer for single character export
const characterTransformer = createTransformer((character) => {
  return {
    character: {
      ...character
    }
  }
})

// Filename generator for single character
const characterFilenameGenerator = createFilenameGenerator(
  'character',
  (data) => data.name || 'unnamed'
)

// Sanitizer for imported character data
function characterSanitizer(data) {
  if (!data.character) return data

  const character = data.character
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

  // Preserve timestamps and flags
  sanitized.created = character.created
  sanitized.updated = character.updated
  sanitized.isDraft = character.isDraft
  sanitized.id = character.id

  return { character: sanitized }
}

/**
 * Create a character import/export service instance
 * @returns {ImportExportService} Character service
 */
export function createCharacterService() {
  return new ImportExportService({
    type: 'warhammer-character',
    version: '1.0',
    validator: characterValidator,
    transformer: characterTransformer,
    filenameGenerator: characterFilenameGenerator,
    sanitizer: characterSanitizer,
    maxFileSizeMB: 10
  })
}

/**
 * Modifications Import/Export Service Configuration
 */

// Validator for modifications
const modificationsValidator = createValidator((data, options = {}) => {
  const errors = []
  const warnings = []
  const mode = options.mode || 'export'

  if (mode === 'export') {
    // Export validation
    if (!data || typeof data !== 'object') {
      errors.push('Les données de modifications sont requises')
      return { valid: false, errors, warnings }
    }

    // Check if there are any modifications
    const hasModifications = Object.keys(data).some(
      key => Array.isArray(data[key]) && data[key].length > 0
    )

    if (!hasModifications) {
      errors.push('Aucune modification à exporter')
    }
  } else if (mode === 'import') {
    // Import validation
    if (!data.modifications) {
      errors.push('Champ requis manquant: modifications')
      return { valid: false, errors, warnings }
    }

    if (typeof data.modifications !== 'object' || data.modifications === null) {
      errors.push('Structure de modifications invalide (doit être un objet)')
      return { valid: false, errors, warnings }
    }

    // Validate each entity type in modifications
    const ENTITY_TYPES = [
      'books', 'careers', 'careerLevels', 'species', 'classes',
      'talents', 'characteristics', 'trappings', 'skills', 'spells',
      'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
      'traits', 'lores', 'magicks', 'etats', 'psychologies',
      'qualities', 'trees'
    ]

    for (const entityType of Object.keys(data.modifications)) {
      if (!ENTITY_TYPES.includes(entityType)) {
        errors.push(`Type d'entité invalide: ${entityType}`)
      }

      if (!Array.isArray(data.modifications[entityType])) {
        errors.push(`Données invalides pour ${entityType} (doit être un tableau)`)
      } else {
        // Validate each entity has an ID
        for (const entity of data.modifications[entityType]) {
          if (!entity.id) {
            errors.push(`Entité dans ${entityType} manque le champ 'id' requis`)
            break
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
})

// Transformer for modifications export
const modificationsTransformer = createTransformer((modifications) => {
  // Filter out empty entity types
  const ENTITY_TYPES = [
    'books', 'careers', 'careerLevels', 'species', 'classes',
    'talents', 'characteristics', 'trappings', 'skills', 'spells',
    'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
    'traits', 'lores', 'magicks', 'etats', 'psychologies',
    'qualities', 'trees'
  ]

  const filtered = {}
  for (const entityType of ENTITY_TYPES) {
    const entries = modifications[entityType]
    if (entries && Array.isArray(entries) && entries.length > 0) {
      filtered[entityType] = entries
    }
  }

  return {
    modifications: filtered
  }
})

// Filename generator for modifications
const modificationsFilenameGenerator = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, '')
    .replace('T', '-')

  return `warhammer-mods-${timestamp}.json`
}

// Sanitizer for modifications (minimal - most data is game data)
function modificationsSanitizer(data) {
  // Modifications typically contain game data that doesn't need extensive sanitization
  // Just return the data structure as-is
  return data
}

/**
 * Create a modifications import/export service instance
 * @returns {ImportExportService} Modifications service
 */
export function createModificationsService() {
  return new ImportExportService({
    type: 'warhammer-modifications',
    version: '1.0',
    validator: modificationsValidator,
    transformer: modificationsTransformer,
    filenameGenerator: modificationsFilenameGenerator,
    sanitizer: modificationsSanitizer,
    maxFileSizeMB: 10
  })
}

/**
 * Batch Characters Import/Export Service Configuration
 */

// Validator for batch characters
const batchCharactersValidator = createValidator((data, options = {}) => {
  const errors = []
  const warnings = []
  const mode = options.mode || 'export'

  if (mode === 'export') {
    if (!Array.isArray(data)) {
      errors.push('Les personnages doivent être un tableau')
      return { valid: false, errors, warnings }
    }

    if (data.length === 0) {
      warnings.push('Le tableau de personnages est vide')
    }

    // Validate each character
    for (let i = 0; i < data.length; i++) {
      const char = data[i]
      if (!char.name) {
        errors.push(`Personnage ${i + 1}: nom manquant`)
      }
    }
  } else if (mode === 'import') {
    if (!data.characters) {
      errors.push('Données de personnages manquantes')
      return { valid: false, errors, warnings }
    }

    if (!Array.isArray(data.characters)) {
      errors.push('Le tableau de personnages est manquant')
      return { valid: false, errors, warnings }
    }

    if (data.characters.length === 0) {
      warnings.push('Le tableau de personnages est vide')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
})

// Transformer for batch characters export
const batchCharactersTransformer = createTransformer((characters) => {
  return {
    count: characters.length,
    characters: characters.map(character => ({
      ...character
    }))
  }
})

// Filename generator for batch characters
const batchCharactersFilenameGenerator = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, '')
    .replace('T', '-')

  return `characters-${timestamp}.json`
}

/**
 * Create a batch characters import/export service instance
 * @returns {ImportExportService} Batch characters service
 */
export function createBatchCharactersService() {
  return new ImportExportService({
    type: 'warhammer-characters-batch',
    version: '1.0',
    validator: batchCharactersValidator,
    transformer: batchCharactersTransformer,
    filenameGenerator: batchCharactersFilenameGenerator,
    sanitizer: (data) => {
      // Sanitize each character in the batch
      if (!data.characters || !Array.isArray(data.characters)) {
        return data
      }

      return {
        ...data,
        characters: data.characters.map(char => {
          const singleCharData = characterSanitizer({ character: char })
          return singleCharData.character
        })
      }
    },
    maxFileSizeMB: 10
  })
}
