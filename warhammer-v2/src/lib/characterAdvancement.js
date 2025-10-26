/**
 * Character Advancement - XP spending and career progression system
 *
 * This module provides functionality for spending XP on character improvements,
 * tracking advancement history, and managing career progression.
 */

import {
  calculateCharacteristicAdvanceCost,
  calculateSkillAdvanceCost,
  calculateTalentCost
} from './characterCalculations.js'

/**
 * @typedef {Object} AdvancementResult
 * @property {boolean} success - Whether the advancement succeeded
 * @property {Object} [character] - Updated character object
 * @property {string} [error] - Error message if failed
 * @property {Object} [log] - Log entry for the advancement
 */

/**
 * Initialize advancement log if not present
 * @param {Object} character - Character object
 * @returns {Object} Character with advancement log initialized
 */
function ensureAdvancementLog(character) {
  if (!character.advancementLog) {
    character.advancementLog = []
  }
  return character
}

/**
 * Initialize characteristic advances tracking if not present
 * @param {Object} character - Character object
 * @returns {Object} Character with characteristic advances initialized
 */
function ensureCharacteristicAdvances(character) {
  if (!character.characteristicAdvances) {
    character.characteristicAdvances = {
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
    }
  }
  return character
}

/**
 * Add entry to advancement log
 * @param {Object} character - Character object
 * @param {string} type - Type of advancement (characteristic, skill, talent, career)
 * @param {string} target - What was advanced (e.g., "WS", "Melee (Basic)", "Hardy")
 * @param {number} xpCost - XP spent
 * @param {string} [description] - Optional description
 * @returns {Object} Log entry
 */
function addLogEntry(character, type, target, xpCost, description = '') {
  const logEntry = {
    date: new Date().toISOString(),
    type,
    target,
    xpCost,
    description
  }

  character.advancementLog.push(logEntry)
  return logEntry
}

/**
 * Spend XP on a characteristic advance
 * @param {Object} character - Character object
 * @param {string} characteristic - Characteristic key (WS, BS, S, etc.)
 * @returns {AdvancementResult} Result of the advancement
 */
export function advanceCharacteristic(character, characteristic) {
  ensureAdvancementLog(character)
  ensureCharacteristicAdvances(character)

  const charUpper = characteristic.toUpperCase()

  // Validate characteristic
  if (!(charUpper in character.characteristics)) {
    return {
      success: false,
      error: `Invalid characteristic: ${characteristic}`
    }
  }

  // Calculate cost
  const currentAdvances = character.characteristicAdvances[charUpper] || 0
  const cost = calculateCharacteristicAdvanceCost(currentAdvances)

  // Check if enough XP
  if (character.experience.available < cost) {
    return {
      success: false,
      error: `Not enough XP. Need ${cost}, have ${character.experience.available}`
    }
  }

  // Apply advancement
  character.characteristics[charUpper] += 1
  character.characteristicAdvances[charUpper] = currentAdvances + 1
  character.experience.spent += cost
  character.experience.available -= cost

  // Add log entry
  const logEntry = addLogEntry(
    character,
    'characteristic',
    charUpper,
    cost,
    `+1 ${charUpper} (${character.characteristics[charUpper] - 1} → ${character.characteristics[charUpper]})`
  )

  character.updated = new Date().toISOString()

  return {
    success: true,
    character,
    log: logEntry
  }
}

/**
 * Spend XP on a skill advance
 * @param {Object} character - Character object
 * @param {string} skillId - Skill ID
 * @param {boolean} isAdvanced - Whether the skill is advanced (affects cost)
 * @returns {AdvancementResult} Result of the advancement
 */
export function advanceSkill(character, skillId, isAdvanced = false) {
  ensureAdvancementLog(character)

  // Find skill
  const skill = character.skills.find(s => s.id === skillId)

  if (!skill) {
    return {
      success: false,
      error: `Skill not found: ${skillId}`
    }
  }

  // Calculate cost
  const currentAdvances = skill.advances || 0
  const cost = calculateSkillAdvanceCost(currentAdvances, isAdvanced)

  // Check if enough XP
  if (character.experience.available < cost) {
    return {
      success: false,
      error: `Not enough XP. Need ${cost}, have ${character.experience.available}`
    }
  }

  // Apply advancement
  skill.advances = currentAdvances + 1
  character.experience.spent += cost
  character.experience.available -= cost

  // Add log entry
  const logEntry = addLogEntry(
    character,
    'skill',
    skill.name,
    cost,
    `+1 ${skill.name} (${currentAdvances} → ${skill.advances})`
  )

  character.updated = new Date().toISOString()

  return {
    success: true,
    character,
    log: logEntry
  }
}

/**
 * Spend XP on a talent
 * @param {Object} character - Character object
 * @param {Object} talent - Talent definition from mergedData
 * @returns {AdvancementResult} Result of the advancement
 */
export function purchaseTalent(character, talent) {
  ensureAdvancementLog(character)

  // Check if talent already exists
  const existingTalent = character.talents.find(t => t.id === talent.id)

  // Calculate cost
  const cost = calculateTalentCost(existingTalent ? existingTalent.times : 0)

  // Check if enough XP
  if (character.experience.available < cost) {
    return {
      success: false,
      error: `Not enough XP. Need ${cost}, have ${character.experience.available}`
    }
  }

  // Check if talent can be taken multiple times
  const maxRank = talent.maxRank || 1
  if (existingTalent && existingTalent.times >= maxRank) {
    return {
      success: false,
      error: `${talent.name} is already at maximum rank (${maxRank})`
    }
  }

  // Apply advancement
  if (existingTalent) {
    existingTalent.times += 1
  } else {
    character.talents.push({
      id: talent.id,
      name: talent.name,
      times: 1,
      description: talent.description || ''
    })
  }

  character.experience.spent += cost
  character.experience.available -= cost

  // Add log entry
  const times = existingTalent ? existingTalent.times : 1
  const logEntry = addLogEntry(
    character,
    'talent',
    talent.name,
    cost,
    times > 1 ? `${talent.name} (Rank ${times})` : talent.name
  )

  character.updated = new Date().toISOString()

  return {
    success: true,
    character,
    log: logEntry
  }
}

/**
 * Advance career level
 * @param {Object} character - Character object
 * @param {Object} [careerData] - Career definition from mergedData
 * @returns {AdvancementResult} Result of the advancement
 */
export function advanceCareerLevel(character, careerData = null) {
  ensureAdvancementLog(character)

  const currentLevel = character.career.level || 1
  const maxLevel = 4

  if (currentLevel >= maxLevel) {
    return {
      success: false,
      error: `Career is already at maximum level (${maxLevel})`
    }
  }

  // Advance career level
  character.career.level = currentLevel + 1

  // Add log entry
  const logEntry = addLogEntry(
    character,
    'career',
    character.career.name,
    0,
    `Advanced to ${character.career.name} Level ${character.career.level}`
  )

  character.updated = new Date().toISOString()

  return {
    success: true,
    character,
    log: logEntry
  }
}

/**
 * Get available XP for spending
 * @param {Object} character - Character object
 * @returns {number} Available XP
 */
export function getAvailableXP(character) {
  return character.experience.available || 0
}

/**
 * Calculate cost for next characteristic advance
 * @param {Object} character - Character object
 * @param {string} characteristic - Characteristic key
 * @returns {number} XP cost
 */
export function getCharacteristicAdvanceCost(character, characteristic) {
  ensureCharacteristicAdvances(character)
  const charUpper = characteristic.toUpperCase()
  const currentAdvances = character.characteristicAdvances[charUpper] || 0
  return calculateCharacteristicAdvanceCost(currentAdvances)
}

/**
 * Calculate cost for next skill advance
 * @param {Object} character - Character object
 * @param {string} skillId - Skill ID
 * @param {boolean} isAdvanced - Whether the skill is advanced
 * @returns {number} XP cost
 */
export function getSkillAdvanceCost(character, skillId, isAdvanced = false) {
  const skill = character.skills.find(s => s.id === skillId)
  const currentAdvances = skill ? skill.advances || 0 : 0
  return calculateSkillAdvanceCost(currentAdvances, isAdvanced)
}

/**
 * Calculate cost for talent
 * @param {Object} character - Character object
 * @param {string} talentId - Talent ID
 * @returns {number} XP cost
 */
export function getTalentCost(character, talentId) {
  const existingTalent = character.talents.find(t => t.id === talentId)
  return calculateTalentCost(existingTalent ? existingTalent.times : 0)
}

/**
 * Get advancement log formatted for display
 * @param {Object} character - Character object
 * @param {number} [limit] - Maximum number of entries to return
 * @returns {Array} Formatted log entries
 */
export function getAdvancementLog(character, limit = null) {
  ensureAdvancementLog(character)

  let log = [...character.advancementLog]

  // Sort by date, most recent first
  log.sort((a, b) => new Date(b.date) - new Date(a.date))

  if (limit) {
    log = log.slice(0, limit)
  }

  return log
}

/**
 * Format log entry for display
 * @param {Object} logEntry - Log entry object
 * @returns {string} Formatted string
 */
export function formatLogEntry(logEntry) {
  const date = new Date(logEntry.date)
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  if (logEntry.type === 'career') {
    return `${dateStr}: ${logEntry.description}`
  }

  return `${dateStr}: ${logEntry.description} (${logEntry.xpCost} XP)`
}

/**
 * Get total XP spent by category
 * @param {Object} character - Character object
 * @returns {Object} XP spent by category
 */
export function getXPSpentByCategory(character) {
  ensureAdvancementLog(character)

  const categories = {
    characteristic: 0,
    skill: 0,
    talent: 0,
    career: 0
  }

  for (const entry of character.advancementLog) {
    if (entry.type in categories) {
      categories[entry.type] += entry.xpCost || 0
    }
  }

  return categories
}

/**
 * Check if character can afford an advancement
 * @param {Object} character - Character object
 * @param {number} cost - XP cost
 * @returns {boolean} True if character can afford
 */
export function canAfford(character, cost) {
  return getAvailableXP(character) >= cost
}

/**
 * Add XP to character
 * @param {Object} character - Character object
 * @param {number} amount - Amount of XP to add
 * @param {string} [reason] - Reason for XP award
 * @returns {Object} Updated character
 */
export function awardXP(character, amount, reason = 'Session reward') {
  ensureAdvancementLog(character)

  character.experience.total += amount
  character.experience.available += amount

  // Add log entry
  addLogEntry(character, 'xp_award', 'XP Award', 0, `+${amount} XP: ${reason}`)

  character.updated = new Date().toISOString()

  return character
}
