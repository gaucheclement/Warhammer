/**
 * Character Data Model - Comprehensive character data structure and factory functions
 *
 * This module defines the complete character data structure used throughout the application
 * and provides factory functions for creating, initializing, and manipulating character objects.
 *
 * Key Components:
 * - Character data structure definition
 * - Factory functions for character creation
 * - Character initialization and transformation utilities
 */

/**
 * @typedef {Object} CharacterCharacteristics
 * @property {number} M - Movement
 * @property {number} WS - Weapon Skill
 * @property {number} BS - Ballistic Skill
 * @property {number} S - Strength
 * @property {number} T - Toughness
 * @property {number} I - Initiative
 * @property {number} Ag - Agility
 * @property {number} Dex - Dexterity
 * @property {number} Int - Intelligence
 * @property {number} WP - Willpower
 * @property {number} Fel - Fellowship
 */

/**
 * @typedef {Object} CharacterSkill
 * @property {string} id - Skill ID
 * @property {string} name - Skill name
 * @property {number} advances - Number of advances (0-60)
 * @property {string} characteristic - Associated characteristic (ws, bs, s, etc.)
 */

/**
 * @typedef {Object} CharacterTalent
 * @property {string} id - Talent ID
 * @property {string} name - Talent name
 * @property {number} times - Number of times taken (for talents with maxRank > 1)
 * @property {string} [description] - Talent description
 */

/**
 * @typedef {Object} CharacterSpell
 * @property {string} id - Spell ID
 * @property {string} name - Spell name
 * @property {string|number} cn - Casting Number
 * @property {string} [range] - Spell range
 * @property {string} [lore] - Spell lore/source
 */

/**
 * @typedef {Object} CharacterTrapping
 * @property {string} id - Trapping ID
 * @property {string} name - Trapping name
 * @property {number} quantity - Number of items
 * @property {boolean} equipped - Whether currently equipped
 * @property {number} [encumbrance] - Encumbrance value
 */

/**
 * @typedef {Object} CharacterExperience
 * @property {number} total - Total XP earned
 * @property {number} spent - XP spent on advances
 * @property {number} available - XP available to spend (total - spent)
 */

/**
 * @typedef {Object} CharacterWounds
 * @property {number} current - Current wounds
 * @property {number} max - Maximum wounds
 */

/**
 * @typedef {Object} CharacterFate
 * @property {number} current - Current fate points
 * @property {number} max - Maximum fate points
 */

/**
 * @typedef {Object} CharacterResilience
 * @property {number} current - Current resilience points
 * @property {number} max - Maximum resilience points
 */

/**
 * @typedef {Object} CharacterAppearance
 * @property {string} [eyes] - Eye color
 * @property {string} [hair] - Hair color
 * @property {string} [distinguishing] - Distinguishing features
 */

/**
 * @typedef {Object} Character
 * @property {number} [id] - Character ID (auto-incremented by IndexedDB)
 * @property {string} name - Character name (required)
 * @property {Object} species - Species reference
 * @property {string|number} species.id - Species ID
 * @property {string} species.name - Species name
 * @property {Object} career - Career reference
 * @property {string|number} career.id - Career ID
 * @property {string} career.name - Career name
 * @property {number} career.level - Career level (1-4)
 * @property {CharacterCharacteristics} characteristics - Character stats
 * @property {CharacterSkill[]} skills - Character skills
 * @property {CharacterTalent[]} talents - Character talents
 * @property {CharacterSpell[]} spells - Character spells (if applicable)
 * @property {CharacterTrapping[]} trappings - Character equipment
 * @property {CharacterExperience} experience - XP tracking
 * @property {CharacterWounds} wounds - Wound tracking
 * @property {CharacterFate} fate - Fate points
 * @property {CharacterResilience} resilience - Resilience points
 * @property {string} notes - Character notes
 * @property {CharacterAppearance} appearance - Physical appearance
 * @property {Object} ambitions - Character ambitions
 * @property {string} ambitions.shortTerm - Short-term ambition
 * @property {string} ambitions.longTerm - Long-term ambition
 * @property {Object} party - Party information
 * @property {string} party.name - Party name
 * @property {string} party.role - Character's role in party
 * @property {string} party.notes - Party notes
 * @property {string[]} psychologies - Active psychologies
 * @property {string[]} conditions - Active conditions
 * @property {string} gmNotes - GM-only notes
 * @property {string} created - Creation timestamp (ISO string)
 * @property {string} updated - Last update timestamp (ISO string)
 * @property {boolean} isDraft - Whether this is a draft character
 */

/**
 * Create an empty character with default values
 * @returns {Character} Empty character object
 */
export function createEmptyCharacter() {
  return {
    name: '',
    species: {
      id: null,
      name: ''
    },
    career: {
      id: null,
      name: '',
      level: 1
    },
    characteristics: {
      M: 0,
      WS: 0,
      BS: 0,
      S: 0,
      T: 0,
      I: 0,
      Ag: 0,
      Dex: 0,
      Int: 0,
      WP: 0,
      Fel: 0
    },
    skills: [],
    talents: [],
    spells: [],
    trappings: [],
    experience: {
      total: 0,
      spent: 0,
      available: 0
    },
    wounds: {
      current: 0,
      max: 0
    },
    fate: {
      current: 0,
      max: 0
    },
    resilience: {
      current: 0,
      max: 0
    },
    // Random choice tracking (for XP bonuses)
    randomState: {
      specie: 0,         // 0=none, 1=accepted(+20), -1=manual
      career: 0,         // 0=none, 1=first(+50), 2=second(+25), -1=manual
      characteristic: 0  // 0=none, 1=accepted(+50), 2=reassigned(+25), -1=manual
    },
    // XP management (bonus XP from random choices)
    xp: {
      max: 0,       // Total bonus XP earned from random choices
      used: 0,      // XP spent on advances
      tmp_used: 0,  // Temporary (unvalidated) XP
      log: {}       // History: { advance_id: cost }
    },
    notes: '',
    appearance: {
      eyes: '',
      hair: '',
      distinguishing: ''
    },
    ambitions: {
      shortTerm: '',
      longTerm: ''
    },
    party: {
      name: '',
      role: '',
      notes: ''
    },
    psychologies: [],
    conditions: [],
    gmNotes: '',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    isDraft: false
  }
}

/**
 * Create a character initialized with species data
 * @param {Object} species - Species data from mergedData
 * @returns {Character} Character with species modifiers applied
 */
export function createCharacterFromSpecies(species) {
  const character = createEmptyCharacter()

  if (!species) {
    return character
  }

  // Set species reference
  character.species = {
    id: species.id,
    name: species.label || species.name // Use label (v2 schema), fallback to name (v1 compat)
  }

  // Apply species characteristic modifiers
  if (species.characteristics) {
    for (const [key, value] of Object.entries(species.characteristics)) {
      const upperKey = key.toUpperCase()
      if (upperKey in character.characteristics) {
        character.characteristics[upperKey] = value || 0
      }
    }
  }

  // Add species skills if provided
  if (species.skills && Array.isArray(species.skills)) {
    character.skills = species.skills.map(skill => ({
      id: typeof skill === 'string' ? skill : skill.id,
      name: typeof skill === 'string' ? skill : (skill.label || skill.name), // Use label (v2), fallback to name
      advances: 0,
      characteristic: typeof skill === 'object' ? skill.characteristic : ''
    }))
  }

  // Add species talents if provided
  if (species.talents && Array.isArray(species.talents)) {
    character.talents = species.talents.map(talent => ({
      id: typeof talent === 'string' ? talent : talent.id,
      name: typeof talent === 'string' ? talent : (talent.label || talent.name), // Use label (v2), fallback to name
      times: 1,
      description: typeof talent === 'object' ? (talent.desc || talent.description) : '' // Use desc (v2), fallback to description
    }))
  }

  return character
}

/**
 * Apply career data to a character
 * @param {Character} character - Character to modify
 * @param {Object} career - Career data from mergedData
 * @returns {Character} Character with career data applied
 */
export function applyCareerToCharacter(character, career) {
  if (!career) {
    return character
  }

  // Set career reference
  character.career = {
    id: career.id,
    name: career.label || career.name, // Use label (v2 schema), fallback to name (v1 compat)
    level: 1
  }

  // Note: Career skills, talents, and trappings are typically added
  // through the wizard interface, not automatically applied here
  // This function primarily sets the career reference

  return character
}

/**
 * Calculate derived stats for a character
 * This includes wounds, movement modifiers, and other calculated values
 * @param {Character} character - Character to calculate stats for
 * @param {Object} [options] - Additional options for calculation
 * @param {Object} [options.talents] - Full talent definitions for bonus calculations
 * @returns {Character} Character with derived stats calculated
 */
export function calculateDerivedStats(character, options = {}) {
  const { talents = [] } = options

  // Calculate maximum wounds
  // Base formula: (2 × T Bonus) + WP Bonus + Strength Bonus
  // T Bonus = T / 10 (rounded down)
  // WP Bonus = WP / 10 (rounded down)
  // S Bonus = S / 10 (rounded down)
  const tBonus = Math.floor(character.characteristics.T / 10)
  const wpBonus = Math.floor(character.characteristics.WP / 10)
  const sBonus = Math.floor(character.characteristics.S / 10)

  let maxWounds = (2 * tBonus) + wpBonus + sBonus

  // Check for talents that modify wounds
  // Common talents: Hardy (adds Toughness Bonus to wounds)
  const hardyTalent = character.talents.find(t =>
    t.name.toLowerCase().includes('hardy')
  )
  if (hardyTalent) {
    maxWounds += tBonus * (hardyTalent.times || 1)
  }

  // Ensure minimum wounds of 1
  maxWounds = Math.max(1, maxWounds)

  character.wounds.max = maxWounds

  // Set current wounds to max if not already set
  if (character.wounds.current === 0) {
    character.wounds.current = maxWounds
  }

  // Calculate fate points (typically species-based, set during creation)
  // If not already set, use default of 0
  if (character.fate.max === 0) {
    character.fate.max = 0
  }
  if (character.fate.current === 0) {
    character.fate.current = character.fate.max
  }

  // Calculate resilience (typically species-based, set during creation)
  if (character.resilience.max === 0) {
    character.resilience.max = 0
  }
  if (character.resilience.current === 0) {
    character.resilience.current = character.resilience.max
  }

  return character
}

/**
 * Clone a character (for duplication)
 * @param {Character} character - Character to clone
 * @param {string} [newName] - Optional new name for the clone
 * @returns {Character} Cloned character
 */
export function cloneCharacter(character, newName) {
  const clone = JSON.parse(JSON.stringify(character))

  // Remove ID (will be assigned by IndexedDB)
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
 * Add a skill to a character
 * @param {Character} character - Character to modify
 * @param {Object} skill - Skill data to add
 * @param {number} [advances=0] - Initial advances
 * @returns {Character} Modified character
 */
export function addSkillToCharacter(character, skill, advances = 0) {
  // Check if skill already exists
  const existingIndex = character.skills.findIndex(s => s.id === skill.id)

  if (existingIndex >= 0) {
    // Update existing skill advances
    character.skills[existingIndex].advances += advances
  } else {
    // Add new skill
    character.skills.push({
      id: skill.id,
      name: skill.label || skill.name, // Use label (v2 schema), fallback to name (v1 compat)
      advances,
      characteristic: skill.characteristic || ''
    })
  }

  character.updated = new Date().toISOString()
  return character
}

/**
 * Add a talent to a character
 * @param {Character} character - Character to modify
 * @param {Object} talent - Talent data to add
 * @returns {Character} Modified character
 */
export function addTalentToCharacter(character, talent) {
  // Check if talent already exists
  const existingIndex = character.talents.findIndex(t => t.id === talent.id)

  if (existingIndex >= 0) {
    // Increment times taken (for talents with maxRank > 1)
    character.talents[existingIndex].times++
  } else {
    // Add new talent
    character.talents.push({
      id: talent.id,
      name: talent.label || talent.name, // Use label (v2 schema), fallback to name (v1 compat)
      times: 1,
      description: talent.description || talent.desc || '' // Use desc (v2), fallback to description
    })
  }

  character.updated = new Date().toISOString()
  return character
}

/**
 * Add a spell to a character
 * @param {Character} character - Character to modify
 * @param {Object} spell - Spell data to add
 * @returns {Character} Modified character
 */
export function addSpellToCharacter(character, spell) {
  // Check if spell already exists
  const exists = character.spells.some(s => s.id === spell.id)

  if (!exists) {
    character.spells.push({
      id: spell.id,
      name: spell.label || spell.name, // Use label (v2 schema), fallback to name (v1 compat)
      cn: spell.cn || '',
      range: spell.range || '',
      lore: spell.lore || ''
    })
    character.updated = new Date().toISOString()
  }

  return character
}

/**
 * Add a trapping to a character
 * @param {Character} character - Character to modify
 * @param {Object} trapping - Trapping data to add
 * @param {number} [quantity=1] - Quantity to add
 * @returns {Character} Modified character
 */
export function addTrappingToCharacter(character, trapping, quantity = 1) {
  // Check if trapping already exists
  const existingIndex = character.trappings.findIndex(t => t.id === trapping.id)

  if (existingIndex >= 0) {
    // Increase quantity
    character.trappings[existingIndex].quantity += quantity
  } else {
    // Add new trapping
    character.trappings.push({
      id: trapping.id,
      name: trapping.label || trapping.name, // Use label (v2 schema), fallback to name (v1 compat)
      quantity,
      equipped: false,
      encumbrance: trapping.encumbrance || 0
    })
  }

  character.updated = new Date().toISOString()
  return character
}

/**
 * Remove a skill from a character
 * @param {Character} character - Character to modify
 * @param {string} skillId - Skill ID to remove
 * @returns {Character} Modified character
 */
export function removeSkillFromCharacter(character, skillId) {
  character.skills = character.skills.filter(s => s.id !== skillId)
  character.updated = new Date().toISOString()
  return character
}

/**
 * Remove a talent from a character
 * @param {Character} character - Character to modify
 * @param {string} talentId - Talent ID to remove
 * @returns {Character} Modified character
 */
export function removeTalentFromCharacter(character, talentId) {
  const index = character.talents.findIndex(t => t.id === talentId)

  if (index >= 0) {
    if (character.talents[index].times > 1) {
      // Decrement times
      character.talents[index].times--
    } else {
      // Remove talent
      character.talents.splice(index, 1)
    }
    character.updated = new Date().toISOString()
  }

  return character
}

/**
 * Remove a spell from a character
 * @param {Character} character - Character to modify
 * @param {string} spellId - Spell ID to remove
 * @returns {Character} Modified character
 */
export function removeSpellFromCharacter(character, spellId) {
  character.spells = character.spells.filter(s => s.id !== spellId)
  character.updated = new Date().toISOString()
  return character
}

/**
 * Remove a trapping from a character
 * @param {Character} character - Character to modify
 * @param {string} trappingId - Trapping ID to remove
 * @param {number} [quantity] - Quantity to remove (if not specified, removes all)
 * @returns {Character} Modified character
 */
export function removeTrappingFromCharacter(character, trappingId, quantity) {
  const index = character.trappings.findIndex(t => t.id === trappingId)

  if (index >= 0) {
    if (quantity && character.trappings[index].quantity > quantity) {
      // Decrease quantity
      character.trappings[index].quantity -= quantity
    } else {
      // Remove trapping
      character.trappings.splice(index, 1)
    }
    character.updated = new Date().toISOString()
  }

  return character
}

/**
 * Update character XP
 * @param {Character} character - Character to modify
 * @param {number} totalXP - New total XP value
 * @returns {Character} Modified character
 */
export function updateCharacterXP(character, totalXP) {
  character.experience.total = totalXP
  character.experience.available = totalXP - character.experience.spent
  character.updated = new Date().toISOString()
  return character
}

/**
 * Spend XP on character advancement
 * @param {Character} character - Character to modify
 * @param {number} xpCost - Amount of XP to spend
 * @returns {Character} Modified character
 */
export function spendCharacterXP(character, xpCost) {
  if (character.experience.available >= xpCost) {
    character.experience.spent += xpCost
    character.experience.available -= xpCost
    character.updated = new Date().toISOString()
  }
  return character
}

/**
 * Calculate total bonus XP from random choices
 * @param {Character} character - Character to calculate XP for
 * @returns {number} Total bonus XP earned
 */
export function calculateBonusXP(character) {
  let total = 0

  // Species random bonus
  if (character.randomState.specie === 1) {
    total += 20
  }

  // Career random bonuses
  if (character.randomState.career === 1) {
    total += 50  // First random choice
  } else if (character.randomState.career === 2) {
    total += 25  // Second random choice
  }

  // Characteristic random bonuses
  if (character.randomState.characteristic === 1) {
    total += 50  // Accepted rolls
  } else if (character.randomState.characteristic === 2) {
    total += 25  // Reassigned points
  }

  return total
}

/**
 * Add XP bonus and update character state
 * @param {Character} character - Character to modify
 * @param {string} type - Type of bonus ('specie', 'career', 'characteristic')
 * @param {number} amount - Amount of XP to add
 * @param {number} state - State value to set (1 for first/accepted, 2 for second/reassigned, -1 for manual)
 * @returns {Character} Modified character
 */
export function addXPBonus(character, type, amount, state) {
  // Update randomState
  if (type === 'specie') {
    character.randomState.specie = state
  } else if (type === 'career') {
    character.randomState.career = state
  } else if (type === 'characteristic') {
    character.randomState.characteristic = state
  }

  // Add XP bonus
  character.xp.max += amount
  character.updated = new Date().toISOString()

  return character
}

/**
 * Spend bonus XP on an advance
 * @param {Character} character - Character to modify
 * @param {string} advanceId - ID of the advance being purchased
 * @param {number} cost - XP cost of the advance
 * @returns {Character} Modified character
 */
export function spendBonusXP(character, advanceId, cost) {
  const available = character.xp.max - character.xp.used

  if (available >= cost) {
    character.xp.used += cost
    character.xp.log[advanceId] = cost
    character.updated = new Date().toISOString()
  }

  return character
}

/**
 * Get available bonus XP
 * @param {Character} character - Character to check
 * @returns {number} Available bonus XP
 */
export function getAvailableBonusXP(character) {
  return character.xp.max - character.xp.used
}
