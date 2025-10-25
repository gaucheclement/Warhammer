/**
 * Character Schema Definition
 *
 * This module defines the complete character data structure for Warhammer Fantasy 4e characters.
 * The schema is based on V1's Character.html state structure but adapted for V2's IndexedDB storage.
 *
 * Key Components:
 * - Full character state structure matching V1
 * - IndexedDB-specific fields (id, created, updated)
 * - Comprehensive JSDoc documentation
 * - Schema validation helpers
 */

/**
 * @typedef {Object} CharacteristicData
 * @property {string} id - Characteristic ID (e.g., 'mouvement', 'capacite-de-combat')
 * @property {number} roll - Random roll value (from dice)
 * @property {number} talent - Bonus from talents
 * @property {number} advance - Advances purchased with XP
 * @property {number} tmpadvance - Temporary advances (session-based)
 * @property {number} specie - Species base value
 * @property {number} star - Star sign bonus
 * @property {number} career - Career bonus
 * @property {string[]} origins - Source of this characteristic (career IDs)
 */

/**
 * @typedef {Object} SkillData
 * @property {string} id - Skill ID
 * @property {number} advance - Advances purchased with XP
 * @property {number} tmpadvance - Temporary advances
 * @property {number} specie - Species bonus
 * @property {number} career - Career bonus
 * @property {string} spec - Specialization (e.g., specific language, lore)
 * @property {string[]} specs - Available specializations
 * @property {string[]} origins - Source of this skill (career IDs, 'specie', 'talent')
 */

/**
 * @typedef {Object} TalentData
 * @property {string} id - Talent ID
 * @property {number} advance - Number of times taken
 * @property {number} tmpadvance - Temporary advances
 * @property {number} roll - Random roll (for some talents)
 * @property {string} spec - Specialization
 * @property {string[]} specs - Available specializations
 * @property {string[]} origins - Source of this talent (career IDs, 'specie')
 */

/**
 * @typedef {Object} SpellData
 * @property {string} id - Spell ID
 * @property {string} spec - Spell lore/domain
 */

/**
 * @typedef {Object} TrappingData
 * @property {string} id - Trapping ID
 * @property {number} quantity - Number of items
 * @property {boolean} equipped - Whether currently equipped
 * @property {string} spec - Specialization/variant
 */

/**
 * @typedef {Object} DetailData
 * @property {string} type - Detail type (age, height, weight, etc.)
 * @property {string} value - Detail value
 */

/**
 * @typedef {Object} SpecieReference
 * @property {string} id - Species ID
 * @property {Object} [data] - Full species data (optional, for methods)
 */

/**
 * @typedef {Object} CareerLevelReference
 * @property {string} id - Career level ID
 * @property {Object} [data] - Full career level data (optional, for methods)
 */

/**
 * @typedef {Object} StarReference
 * @property {string} id - Star ID
 * @property {Object} [data] - Full star data (optional, for methods)
 */

/**
 * @typedef {Object} XPTracking
 * @property {number} max - Maximum XP earned
 * @property {Object} log - XP expenditure log (keyed by category)
 * @property {number} used - Total XP spent
 * @property {number} tmp_used - Temporary XP usage
 */

/**
 * @typedef {Object} RandomState
 * @property {number} specie - Random roll state for species (0=not rolled, 1=random, 2=manual)
 * @property {Array} imposedSpecie - Pre-selected species constraints
 * @property {number} career - Random roll state for career
 * @property {Array} imposedCareers - Pre-selected career constraints
 * @property {number} star - Random roll state for star sign
 * @property {Array} imposedStar - Pre-selected star constraints
 * @property {number} characteristic - Random roll state for characteristics
 * @property {Object} imposedCharacteristics - Pre-selected characteristic values (keyed by char ID)
 * @property {Array} imposedTalents - Pre-selected talents
 */

/**
 * @typedef {Object} CharacterSchema
 * @property {number} [id] - Auto-incremented database ID
 * @property {string} name - Character name (required for persistence)
 * @property {string} mode - Character creation mode ('creation' or 'libre')
 * @property {number} stepIndex - Current wizard step (0-9, null if complete)
 * @property {SpecieReference|null} specie - Character species
 * @property {CareerLevelReference|null} careerLevel - Current career level
 * @property {CharacteristicData[]} characteristics - Character characteristics (M, WS, BS, S, T, I, Ag, Dex, Int, WP, Fel, etc.)
 * @property {SkillData[]} skills - Character skills
 * @property {TalentData[]} talents - Character talents
 * @property {SpellData[]} spells - Character spells
 * @property {TrappingData[]} trappings - Character equipment
 * @property {DetailData[]} details - Physical details (age, height, hair, eyes, etc.)
 * @property {string|null} god - Deity (if applicable)
 * @property {StarReference|null} star - Star sign (if applicable)
 * @property {string|null} magic - Magic type (if applicable)
 * @property {XPTracking} xp - Experience points tracking
 * @property {RandomState} randomState - State for random generation/re-rolls
 * @property {string} created - ISO timestamp of creation
 * @property {string} updated - ISO timestamp of last update
 * @property {number} version - Schema version for migrations
 */

/**
 * Create a new empty character with default values
 * @returns {CharacterSchema}
 */
export function createEmptyCharacter() {
  return {
    name: '',
    mode: 'creation',
    stepIndex: null,
    specie: null,
    careerLevel: null,
    characteristics: [],
    skills: [],
    talents: [],
    spells: [],
    trappings: [],
    details: [],
    god: null,
    star: null,
    magic: null,
    xp: {
      max: 0,
      log: {},
      used: 0,
      tmp_used: 0
    },
    randomState: {
      specie: 0,
      imposedSpecie: [],
      career: 0,
      imposedCareers: [],
      star: 0,
      imposedStar: [],
      characteristic: 0,
      imposedCharacteristics: {},
      imposedTalents: []
    },
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: 1
  }
}

/**
 * Create a characteristic entry
 * @param {string} id - Characteristic ID
 * @param {Object} [data] - Full characteristic data (optional)
 * @returns {CharacteristicData}
 */
export function createCharacteristic(id, data = null) {
  return {
    id,
    roll: 0,
    talent: 0,
    advance: 0,
    tmpadvance: 0,
    specie: 0,
    star: 0,
    career: 0,
    data,
    origins: []
  }
}

/**
 * Create a skill entry
 * @param {string} id - Skill ID
 * @param {Object} [data] - Full skill data (optional)
 * @returns {SkillData}
 */
export function createSkill(id, data = null) {
  return {
    id,
    advance: 0,
    tmpadvance: 0,
    specie: 0,
    career: 0,
    spec: '',
    specs: [],
    data,
    origins: []
  }
}

/**
 * Create a talent entry
 * @param {string} id - Talent ID
 * @param {Object} [data] - Full talent data (optional)
 * @returns {TalentData}
 */
export function createTalent(id, data = null) {
  return {
    id,
    advance: 0,
    tmpadvance: 0,
    roll: 0,
    spec: '',
    specs: [],
    data,
    origins: []
  }
}

/**
 * Create a spell entry
 * @param {string} id - Spell ID
 * @param {string} [spec] - Spell lore/domain
 * @param {Object} [data] - Full spell data (optional)
 * @returns {SpellData}
 */
export function createSpell(id, spec = '', data = null) {
  return {
    id,
    spec,
    data
  }
}

/**
 * Create a trapping entry
 * @param {string} id - Trapping ID
 * @param {number} [quantity] - Quantity
 * @param {Object} [data] - Full trapping data (optional)
 * @returns {TrappingData}
 */
export function createTrapping(id, quantity = 1, data = null) {
  return {
    id,
    quantity,
    equipped: false,
    spec: '',
    data
  }
}

/**
 * Create a detail entry
 * @param {string} type - Detail type
 * @param {string} value - Detail value
 * @returns {DetailData}
 */
export function createDetail(type, value) {
  return {
    type,
    value
  }
}

/**
 * Validate character data
 * @param {CharacterSchema} character - Character to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateCharacter(character) {
  const errors = []

  // Name is required for saving
  if (!character.name || character.name.trim() === '') {
    errors.push('Character name is required')
  }

  // Mode must be valid
  if (!['creation', 'libre'].includes(character.mode)) {
    errors.push('Character mode must be "creation" or "libre"')
  }

  // XP values should be non-negative
  if (character.xp.max < 0) {
    errors.push('XP max cannot be negative')
  }
  if (character.xp.used < 0) {
    errors.push('XP used cannot be negative')
  }
  if (character.xp.used > character.xp.max) {
    errors.push('XP used cannot exceed XP max')
  }

  // Arrays should be arrays
  if (!Array.isArray(character.characteristics)) {
    errors.push('Characteristics must be an array')
  }
  if (!Array.isArray(character.skills)) {
    errors.push('Skills must be an array')
  }
  if (!Array.isArray(character.talents)) {
    errors.push('Talents must be an array')
  }
  if (!Array.isArray(character.spells)) {
    errors.push('Spells must be an array')
  }
  if (!Array.isArray(character.trappings)) {
    errors.push('Trappings must be an array')
  }
  if (!Array.isArray(character.details)) {
    errors.push('Details must be an array')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Clone a character (deep copy)
 * @param {CharacterSchema} character - Character to clone
 * @param {string} [newName] - New name for clone
 * @returns {CharacterSchema}
 */
export function cloneCharacter(character, newName) {
  const clone = JSON.parse(JSON.stringify(character))

  // Remove ID (will be auto-assigned)
  delete clone.id

  // Update name
  if (newName) {
    clone.name = newName
  } else {
    clone.name = `${character.name} (Copy)`
  }

  // Update timestamps
  clone.created = new Date().toISOString()
  clone.updated = new Date().toISOString()

  return clone
}

/**
 * Sanitize character for storage (remove methods, keep only data)
 * @param {CharacterSchema} character - Character to sanitize
 * @returns {CharacterSchema}
 */
export function sanitizeCharacter(character) {
  // Create a clean copy with only data properties
  return JSON.parse(JSON.stringify(character))
}

/**
 * Get character schema version
 * @returns {number}
 */
export function getCurrentSchemaVersion() {
  return 1
}

/**
 * Check if character needs migration
 * @param {CharacterSchema} character - Character to check
 * @returns {boolean}
 */
export function needsMigration(character) {
  return !character.version || character.version < getCurrentSchemaVersion()
}
