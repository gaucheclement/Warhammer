/**
 * Character Validation - Validation functions for character data
 *
 * This module provides comprehensive validation for all character-related data,
 * including name validation, characteristic ranges, skill requirements, talent
 * prerequisites, and complete character validation before save.
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 */

/**
 * Validate character name
 * @param {string} name - Character name to validate
 * @param {Array} [existingCharacters] - Existing characters to check for uniqueness
 * @returns {ValidationResult} Validation result
 */
export function validateCharacterName(name, existingCharacters = []) {
  const errors = []
  const warnings = []

  // Check if name is empty
  if (!name || name.trim().length === 0) {
    errors.push('Character name is required')
    return { valid: false, errors, warnings }
  }

  // Check name length
  if (name.length < 2) {
    errors.push('Character name must be at least 2 characters long')
  }

  if (name.length > 100) {
    errors.push('Character name must be less than 100 characters')
  }

  // Check for invalid characters (allow letters, numbers, spaces, hyphens, apostrophes)
  const invalidChars = /[^a-zA-Z0-9\s'\-]/
  if (invalidChars.test(name)) {
    warnings.push('Character name contains special characters')
  }

  // Check for uniqueness
  if (existingCharacters && existingCharacters.length > 0) {
    const nameLower = name.toLowerCase().trim()
    const duplicate = existingCharacters.find(
      char => char.name.toLowerCase().trim() === nameLower
    )
    if (duplicate) {
      warnings.push(`A character named "${name}" already exists`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate character characteristics
 * @param {Object} characteristics - Character characteristics object
 * @returns {ValidationResult} Validation result
 */
export function validateCharacteristics(characteristics) {
  const errors = []
  const warnings = []

  const requiredCharacteristics = ['M', 'WS', 'BS', 'S', 'T', 'I', 'Ag', 'Dex', 'Int', 'WP', 'Fel']

  // Check all required characteristics are present
  for (const char of requiredCharacteristics) {
    if (!(char in characteristics)) {
      errors.push(`Missing characteristic: ${char}`)
    }
  }

  // Check characteristic values are valid
  for (const [char, value] of Object.entries(characteristics)) {
    if (requiredCharacteristics.includes(char)) {
      // Check type
      if (typeof value !== 'number') {
        errors.push(`${char} must be a number`)
        continue
      }

      // Check range (0-100 is typical for WFRP 4e)
      if (value < 0 || value > 100) {
        errors.push(`${char} must be between 0 and 100 (current: ${value})`)
      }

      // Warn about unusually low values
      if (value > 0 && value < 10) {
        warnings.push(`${char} is unusually low (${value})`)
      }

      // Warn about suspiciously high values
      if (value > 80) {
        warnings.push(`${char} is very high (${value})`)
      }
    }
  }

  // Check Movement characteristic (typically 3-6)
  if (characteristics.M !== undefined) {
    if (characteristics.M < 1 || characteristics.M > 10) {
      warnings.push(`Movement (M) is typically between 1 and 10 (current: ${characteristics.M})`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate skill selection
 * @param {Array} skills - Character skills
 * @param {Object} [career] - Career data (optional, for checking career skills)
 * @returns {ValidationResult} Validation result
 */
export function validateSkillSelection(skills, career = null) {
  const errors = []
  const warnings = []

  // Check skills array is valid
  if (!Array.isArray(skills)) {
    errors.push('Skills must be an array')
    return { valid: false, errors, warnings }
  }

  // Validate each skill
  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i]

    // Check required fields
    if (!skill.id) {
      errors.push(`Skill at index ${i} is missing id`)
    }

    if (!skill.name) {
      errors.push(`Skill at index ${i} is missing name`)
    }

    // Check advances are valid
    if (typeof skill.advances !== 'number') {
      errors.push(`Skill "${skill.name}" advances must be a number`)
    } else if (skill.advances < 0) {
      errors.push(`Skill "${skill.name}" advances cannot be negative`)
    } else if (skill.advances > 60) {
      warnings.push(`Skill "${skill.name}" has unusually high advances (${skill.advances})`)
    }

    // Check for duplicates
    const duplicates = skills.filter(s => s.id === skill.id)
    if (duplicates.length > 1) {
      errors.push(`Duplicate skill: ${skill.name}`)
    }
  }

  // Check career skill requirements (if career provided)
  if (career && career.skills && Array.isArray(career.skills)) {
    // Note: This is a soft check - career skills are recommended but not required
    const careerSkillIds = new Set(career.skills.map(s => typeof s === 'string' ? s : s.id))
    const characterSkillIds = new Set(skills.map(s => s.id))

    const missingCareerSkills = [...careerSkillIds].filter(id => !characterSkillIds.has(id))
    if (missingCareerSkills.length > 0) {
      warnings.push(`Missing some career skills (${missingCareerSkills.length} skills)`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate talent prerequisites
 * @param {Array} talents - Character talents
 * @param {Object} character - Full character object (for checking prerequisites)
 * @param {Array} [talentDefinitions] - Full talent definitions from game data
 * @returns {ValidationResult} Validation result
 */
export function validateTalentPrerequisites(talents, character, talentDefinitions = []) {
  const errors = []
  const warnings = []

  // Check talents array is valid
  if (!Array.isArray(talents)) {
    errors.push('Talents must be an array')
    return { valid: false, errors, warnings }
  }

  // Validate each talent
  for (let i = 0; i < talents.length; i++) {
    const talent = talents[i]

    // Check required fields
    if (!talent.id) {
      errors.push(`Talent at index ${i} is missing id`)
    }

    if (!talent.name) {
      errors.push(`Talent at index ${i} is missing name`)
    }

    // Check times taken is valid
    if (typeof talent.times !== 'number') {
      errors.push(`Talent "${talent.name}" times must be a number`)
    } else if (talent.times < 1) {
      errors.push(`Talent "${talent.name}" times must be at least 1`)
    }

    // Check for duplicates
    const duplicates = talents.filter(t => t.id === talent.id)
    if (duplicates.length > 1) {
      errors.push(`Duplicate talent: ${talent.name}`)
    }

    // Check maxRank if talent definition available
    if (talentDefinitions.length > 0) {
      const definition = talentDefinitions.find(t => t.id === talent.id)
      if (definition && definition.maxRank) {
        if (talent.times > definition.maxRank) {
          errors.push(
            `Talent "${talent.name}" exceeds maxRank (${talent.times}/${definition.maxRank})`
          )
        }
      }
    }

    // Note: Detailed prerequisite checking (e.g., "requires WS 40+")
    // would require parsing talent descriptions, which is complex
    // For now, we do basic structural validation
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate spells
 * @param {Array} spells - Character spells
 * @param {Object} [career] - Career data (optional, for checking spell limits)
 * @returns {ValidationResult} Validation result
 */
export function validateSpells(spells, career = null) {
  const errors = []
  const warnings = []

  // Check spells array is valid
  if (!Array.isArray(spells)) {
    errors.push('Spells must be an array')
    return { valid: false, errors, warnings }
  }

  // Validate each spell
  for (let i = 0; i < spells.length; i++) {
    const spell = spells[i]

    // Check required fields
    if (!spell.id) {
      errors.push(`Spell at index ${i} is missing id`)
    }

    if (!spell.name) {
      errors.push(`Spell at index ${i} is missing name`)
    }

    // Check for duplicates
    const duplicates = spells.filter(s => s.id === spell.id)
    if (duplicates.length > 1) {
      errors.push(`Duplicate spell: ${spell.name}`)
    }
  }

  // Check spell limits (if career provided)
  // Note: Spell limits vary by career and level, this is a basic check
  if (career && spells.length > 0) {
    // Check if career should have spells
    const careerName = career.name?.toLowerCase() || ''
    const isSpellcaster = careerName.includes('wizard') ||
                          careerName.includes('priest') ||
                          careerName.includes('witch')

    if (!isSpellcaster && spells.length > 0) {
      warnings.push('This career typically does not have spells')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate trappings
 * @param {Array} trappings - Character trappings
 * @returns {ValidationResult} Validation result
 */
export function validateTrappings(trappings) {
  const errors = []
  const warnings = []

  // Check trappings array is valid
  if (!Array.isArray(trappings)) {
    errors.push('Trappings must be an array')
    return { valid: false, errors, warnings }
  }

  // Validate each trapping
  for (let i = 0; i < trappings.length; i++) {
    const trapping = trappings[i]

    // Check required fields
    if (!trapping.id) {
      errors.push(`Trapping at index ${i} is missing id`)
    }

    if (!trapping.name) {
      errors.push(`Trapping at index ${i} is missing name`)
    }

    // Check quantity is valid
    if (typeof trapping.quantity !== 'number') {
      errors.push(`Trapping "${trapping.name}" quantity must be a number`)
    } else if (trapping.quantity < 0) {
      errors.push(`Trapping "${trapping.name}" quantity cannot be negative`)
    } else if (trapping.quantity === 0) {
      warnings.push(`Trapping "${trapping.name}" has zero quantity`)
    }

    // Check equipped is boolean
    if (typeof trapping.equipped !== 'boolean') {
      errors.push(`Trapping "${trapping.name}" equipped must be true/false`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate experience values
 * @param {Object} experience - Experience object
 * @returns {ValidationResult} Validation result
 */
export function validateExperience(experience) {
  const errors = []
  const warnings = []

  // Check required fields
  if (typeof experience.total !== 'number') {
    errors.push('Experience total must be a number')
  } else if (experience.total < 0) {
    errors.push('Experience total cannot be negative')
  }

  if (typeof experience.spent !== 'number') {
    errors.push('Experience spent must be a number')
  } else if (experience.spent < 0) {
    errors.push('Experience spent cannot be negative')
  }

  if (typeof experience.available !== 'number') {
    errors.push('Experience available must be a number')
  } else if (experience.available < 0) {
    errors.push('Experience available cannot be negative')
  }

  // Check consistency
  if (
    typeof experience.total === 'number' &&
    typeof experience.spent === 'number' &&
    typeof experience.available === 'number'
  ) {
    const calculatedAvailable = experience.total - experience.spent
    if (experience.available !== calculatedAvailable) {
      errors.push(
        `Experience calculation error: available (${experience.available}) should be total (${experience.total}) - spent (${experience.spent}) = ${calculatedAvailable}`
      )
    }
  }

  // Warn about spent exceeding total
  if (experience.spent > experience.total) {
    errors.push('Experience spent cannot exceed total')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate complete character before save
 * @param {Object} character - Character to validate
 * @param {Object} [options] - Validation options
 * @param {Array} [options.existingCharacters] - Existing characters for uniqueness check
 * @param {Array} [options.talentDefinitions] - Talent definitions for prerequisite checking
 * @param {Object} [options.career] - Career data for requirement checking
 * @returns {ValidationResult} Validation result
 */
export function validateCompleteCharacter(character, options = {}) {
  const errors = []
  const warnings = []

  const {
    existingCharacters = [],
    talentDefinitions = [],
    career = null
  } = options

  // Validate name
  const nameValidation = validateCharacterName(character.name, existingCharacters)
  errors.push(...nameValidation.errors)
  warnings.push(...nameValidation.warnings)

  // Validate species
  if (!character.species || !character.species.id) {
    errors.push('Character must have a species')
  }

  // Validate career
  if (!character.career || !character.career.id) {
    errors.push('Character must have a career')
  }

  // Validate career level
  if (character.career && character.career.level) {
    if (typeof character.career.level !== 'number') {
      errors.push('Career level must be a number')
    } else if (character.career.level < 1 || character.career.level > 4) {
      errors.push('Career level must be between 1 and 4')
    }
  }

  // Validate characteristics
  const characteristicsValidation = validateCharacteristics(character.characteristics)
  errors.push(...characteristicsValidation.errors)
  warnings.push(...characteristicsValidation.warnings)

  // Validate skills
  const skillsValidation = validateSkillSelection(character.skills, career)
  errors.push(...skillsValidation.errors)
  warnings.push(...skillsValidation.warnings)

  // Validate talents
  const talentsValidation = validateTalentPrerequisites(
    character.talents,
    character,
    talentDefinitions
  )
  errors.push(...talentsValidation.errors)
  warnings.push(...talentsValidation.warnings)

  // Validate spells
  const spellsValidation = validateSpells(character.spells, career)
  errors.push(...spellsValidation.errors)
  warnings.push(...spellsValidation.warnings)

  // Validate trappings
  const trappingsValidation = validateTrappings(character.trappings)
  errors.push(...trappingsValidation.errors)
  warnings.push(...trappingsValidation.warnings)

  // Validate experience
  const experienceValidation = validateExperience(character.experience)
  errors.push(...experienceValidation.errors)
  warnings.push(...experienceValidation.warnings)

  // Validate wounds
  if (typeof character.wounds.max !== 'number' || character.wounds.max < 1) {
    errors.push('Maximum wounds must be at least 1')
  }

  if (typeof character.wounds.current !== 'number') {
    errors.push('Current wounds must be a number')
  } else if (character.wounds.current < 0) {
    errors.push('Current wounds cannot be negative')
  } else if (character.wounds.current > character.wounds.max) {
    warnings.push('Current wounds exceed maximum')
  }

  // Validate fate
  if (typeof character.fate.max !== 'number' || character.fate.max < 0) {
    errors.push('Maximum fate must be 0 or greater')
  }

  if (typeof character.fate.current !== 'number' || character.fate.current < 0) {
    errors.push('Current fate must be 0 or greater')
  }

  // Validate resilience
  if (typeof character.resilience.max !== 'number' || character.resilience.max < 0) {
    errors.push('Maximum resilience must be 0 or greater')
  }

  if (typeof character.resilience.current !== 'number' || character.resilience.current < 0) {
    errors.push('Current resilience must be 0 or greater')
  }

  // Validate timestamps
  if (!character.created) {
    warnings.push('Missing creation timestamp')
  }

  if (!character.updated) {
    warnings.push('Missing update timestamp')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate character for draft save (more lenient than complete validation)
 * @param {Object} character - Character to validate
 * @returns {ValidationResult} Validation result
 */
export function validateCharacterDraft(character) {
  const errors = []
  const warnings = []

  // Only require name for drafts
  if (!character.name || character.name.trim().length === 0) {
    errors.push('Character name is required')
  }

  // Check basic structure
  if (!character.characteristics) {
    errors.push('Character must have characteristics object')
  }

  if (!Array.isArray(character.skills)) {
    errors.push('Character skills must be an array')
  }

  if (!Array.isArray(character.talents)) {
    errors.push('Character talents must be an array')
  }

  if (!Array.isArray(character.spells)) {
    errors.push('Character spells must be an array')
  }

  if (!Array.isArray(character.trappings)) {
    errors.push('Character trappings must be an array')
  }

  // Warn about incomplete data
  if (!character.species || !character.species.id) {
    warnings.push('Draft is missing species')
  }

  if (!character.career || !character.career.id) {
    warnings.push('Draft is missing career')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
