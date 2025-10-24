/**
 * Character Calculations - Utility functions for calculating derived character stats
 *
 * This module provides calculation functions for wounds, movement, initiative,
 * encumbrance, and other derived statistics based on WFRP 4e rules.
 */

/**
 * Calculate maximum wounds for a character
 * Based on WFRP 4e formula: (2 × T Bonus) + WP Bonus + S Bonus
 * Bonus = Characteristic / 10 (rounded down)
 *
 * @param {number} T - Toughness characteristic
 * @param {number} S - Strength characteristic
 * @param {number} WP - Willpower characteristic
 * @param {Array} [talents] - Character talents (for Hardy talent)
 * @returns {number} Maximum wounds
 */
export function calculateWounds(T, S, WP, talents = []) {
  // Calculate characteristic bonuses (divide by 10, round down)
  const tBonus = Math.floor(T / 10)
  const sBonus = Math.floor(S / 10)
  const wpBonus = Math.floor(WP / 10)

  // Base wounds calculation
  let maxWounds = (2 * tBonus) + wpBonus + sBonus

  // Check for Hardy talent (adds Toughness Bonus per rank)
  const hardyTalent = talents.find(t =>
    t.name?.toLowerCase().includes('hardy') ||
    t.id?.toLowerCase().includes('hardy')
  )

  if (hardyTalent) {
    const times = hardyTalent.times || 1
    maxWounds += tBonus * times
  }

  // Ensure minimum wounds of 1
  return Math.max(1, maxWounds)
}

/**
 * Calculate movement rate
 * Base movement from species characteristic, modified by encumbrance
 *
 * @param {number} M - Movement characteristic
 * @param {number} [encumbrance] - Total encumbrance (optional)
 * @param {number} [maxEncumbrance] - Maximum encumbrance before penalty (optional)
 * @returns {number} Effective movement rate
 */
export function calculateMovement(M, encumbrance = 0, maxEncumbrance = null) {
  let movement = M

  // Apply encumbrance penalty if over maximum
  if (maxEncumbrance !== null && encumbrance > maxEncumbrance) {
    // For each point over max encumbrance, reduce movement by 1
    const penalty = Math.floor((encumbrance - maxEncumbrance) / 5)
    movement = Math.max(0, M - penalty)
  }

  return movement
}

/**
 * Calculate initiative bonus
 * Based on Initiative and Agility characteristics
 *
 * @param {number} I - Initiative characteristic
 * @param {number} Ag - Agility characteristic
 * @returns {number} Initiative bonus (sum of bonuses)
 */
export function calculateInitiative(I, Ag) {
  const iBonus = Math.floor(I / 10)
  const agBonus = Math.floor(Ag / 10)

  return iBonus + agBonus
}

/**
 * Calculate total encumbrance from trappings
 *
 * @param {Array} trappings - Array of character trappings
 * @returns {number} Total encumbrance
 */
export function calculateEncumbrance(trappings) {
  if (!Array.isArray(trappings)) {
    return 0
  }

  return trappings.reduce((total, trapping) => {
    const encumbrance = trapping.encumbrance || 0
    const quantity = trapping.quantity || 1
    return total + (encumbrance * quantity)
  }, 0)
}

/**
 * Calculate maximum encumbrance capacity
 * Based on Toughness and Strength bonuses
 *
 * @param {number} T - Toughness characteristic
 * @param {number} S - Strength characteristic
 * @returns {number} Maximum encumbrance capacity
 */
export function calculateMaxEncumbrance(T, S) {
  const tBonus = Math.floor(T / 10)
  const sBonus = Math.floor(S / 10)

  // Maximum encumbrance = (T Bonus + S Bonus) × 10
  return (tBonus + sBonus) * 10
}

/**
 * Calculate characteristic bonus (divide by 10, round down)
 *
 * @param {number} characteristic - Characteristic value
 * @returns {number} Characteristic bonus
 */
export function calculateCharacteristicBonus(characteristic) {
  return Math.floor(characteristic / 10)
}

/**
 * Calculate all characteristic bonuses
 *
 * @param {Object} characteristics - Character characteristics
 * @returns {Object} Object with all characteristic bonuses
 */
export function calculateAllCharacteristicBonuses(characteristics) {
  return {
    MBonus: calculateCharacteristicBonus(characteristics.M || 0),
    WSBonus: calculateCharacteristicBonus(characteristics.WS || 0),
    BSBonus: calculateCharacteristicBonus(characteristics.BS || 0),
    SBonus: calculateCharacteristicBonus(characteristics.S || 0),
    TBonus: calculateCharacteristicBonus(characteristics.T || 0),
    IBonus: calculateCharacteristicBonus(characteristics.I || 0),
    AgBonus: calculateCharacteristicBonus(characteristics.Ag || 0),
    DexBonus: calculateCharacteristicBonus(characteristics.Dex || 0),
    IntBonus: calculateCharacteristicBonus(characteristics.Int || 0),
    WPBonus: calculateCharacteristicBonus(characteristics.WP || 0),
    FelBonus: calculateCharacteristicBonus(characteristics.Fel || 0)
  }
}

/**
 * Calculate fate points based on species
 * Typically species-specific, default values provided
 *
 * @param {string} speciesName - Species name
 * @returns {number} Default fate points for species
 */
export function calculateDefaultFate(speciesName) {
  const speciesLower = (speciesName || '').toLowerCase()

  // Default fate points by common species (WFRP 4e values)
  const fateBySpecies = {
    human: 2,
    halfling: 3,
    dwarf: 2,
    'high elf': 2,
    'wood elf': 2,
    elf: 2,
    gnome: 3
  }

  return fateBySpecies[speciesLower] || 0
}

/**
 * Calculate resilience points based on species
 * Typically species-specific, default values provided
 *
 * @param {string} speciesName - Species name
 * @returns {number} Default resilience points for species
 */
export function calculateDefaultResilience(speciesName) {
  const speciesLower = (speciesName || '').toLowerCase()

  // Default resilience points by common species (WFRP 4e values)
  const resilienceBySpecies = {
    human: 1,
    halfling: 2,
    dwarf: 2,
    'high elf': 0,
    'wood elf': 0,
    elf: 0,
    gnome: 1
  }

  return resilienceBySpecies[speciesLower] || 0
}

/**
 * Calculate skill test target number
 * Target = Characteristic + Skill Advances
 *
 * @param {number} characteristic - Base characteristic value
 * @param {number} advances - Skill advances
 * @returns {number} Target number for skill test
 */
export function calculateSkillTarget(characteristic, advances) {
  return characteristic + advances
}

/**
 * Calculate XP cost for characteristic advance
 * Cost = 25 × (current advance + 1)
 *
 * @param {number} currentAdvance - Current number of advances
 * @returns {number} XP cost for next advance
 */
export function calculateCharacteristicAdvanceCost(currentAdvance) {
  return 25 * (currentAdvance + 1)
}

/**
 * Calculate XP cost for skill advance
 * Basic skills: 10 × (current advance + 1)
 * Advanced skills: 15 × (current advance + 1)
 *
 * @param {number} currentAdvance - Current number of advances
 * @param {boolean} isAdvanced - Whether skill is advanced
 * @returns {number} XP cost for next advance
 */
export function calculateSkillAdvanceCost(currentAdvance, isAdvanced = false) {
  const baseCost = isAdvanced ? 15 : 10
  return baseCost * (currentAdvance + 1)
}

/**
 * Calculate XP cost for talent
 * Standard cost: 100 XP per rank
 *
 * @param {number} [timesAlreadyTaken=0] - Number of times already taken
 * @returns {number} XP cost for next rank
 */
export function calculateTalentCost(timesAlreadyTaken = 0) {
  return 100
}

/**
 * Calculate total XP spent on a character
 *
 * @param {Object} character - Character object
 * @param {Array} [skillDefinitions] - Skill definitions (to check if advanced)
 * @returns {number} Total XP spent
 */
export function calculateTotalXPSpent(character, skillDefinitions = []) {
  let totalSpent = 0

  // XP spent on characteristic advances
  // This requires tracking advances separately, which isn't in the base model
  // For now, we'll use the experience.spent field directly

  // XP spent on skills
  for (const skill of character.skills || []) {
    const skillDef = skillDefinitions.find(s => s.id === skill.id)
    const isAdvanced = skillDef?.advanced || false

    // Calculate cumulative cost for all advances
    for (let i = 0; i < skill.advances; i++) {
      totalSpent += calculateSkillAdvanceCost(i, isAdvanced)
    }
  }

  // XP spent on talents
  for (const talent of character.talents || []) {
    totalSpent += calculateTalentCost() * (talent.times || 1)
  }

  return totalSpent
}

/**
 * Calculate damage bonus from Strength
 * Damage Bonus = S Bonus
 *
 * @param {number} S - Strength characteristic
 * @returns {number} Damage bonus
 */
export function calculateDamageBonus(S) {
  return Math.floor(S / 10)
}

/**
 * Calculate carrying capacity categories
 *
 * @param {number} T - Toughness
 * @param {number} S - Strength
 * @param {number} currentEncumbrance - Current encumbrance
 * @returns {Object} Carrying capacity info
 */
export function calculateCarryingCapacity(T, S, currentEncumbrance) {
  const maxEncumbrance = calculateMaxEncumbrance(T, S)

  // WFRP 4e encumbrance categories
  const lightLoad = Math.floor(maxEncumbrance / 3)
  const mediumLoad = Math.floor((maxEncumbrance * 2) / 3)

  let category = 'light'
  let movementPenalty = 0

  if (currentEncumbrance > maxEncumbrance) {
    category = 'overloaded'
    movementPenalty = Math.floor((currentEncumbrance - maxEncumbrance) / 5)
  } else if (currentEncumbrance > mediumLoad) {
    category = 'heavy'
    movementPenalty = 1
  } else if (currentEncumbrance > lightLoad) {
    category = 'medium'
    movementPenalty = 0
  }

  return {
    current: currentEncumbrance,
    maximum: maxEncumbrance,
    category,
    movementPenalty,
    percentage: Math.round((currentEncumbrance / maxEncumbrance) * 100)
  }
}

/**
 * Calculate advantage modifier for initiative
 * (Used in combat)
 *
 * @param {number} currentAdvantage - Current advantage level
 * @returns {number} Modifier to initiative
 */
export function calculateAdvantageModifier(currentAdvantage) {
  // In WFRP 4e, advantage adds to initiative
  return Math.max(0, currentAdvantage)
}

/**
 * Roll random characteristic value (2d10)
 * Standard character generation roll
 *
 * @returns {number} Random characteristic value (2-20)
 */
export function rollCharacteristic() {
  const die1 = Math.floor(Math.random() * 10) + 1
  const die2 = Math.floor(Math.random() * 10) + 1
  return die1 + die2
}

/**
 * Roll all characteristics for character creation
 *
 * @param {Object} [speciesModifiers] - Species modifiers to add
 * @returns {Object} Object with all rolled characteristics
 */
export function rollAllCharacteristics(speciesModifiers = {}) {
  const rolls = {
    M: speciesModifiers.M || 0,
    WS: rollCharacteristic() + (speciesModifiers.WS || 0),
    BS: rollCharacteristic() + (speciesModifiers.BS || 0),
    S: rollCharacteristic() + (speciesModifiers.S || 0),
    T: rollCharacteristic() + (speciesModifiers.T || 0),
    I: rollCharacteristic() + (speciesModifiers.I || 0),
    Ag: rollCharacteristic() + (speciesModifiers.Ag || 0),
    Dex: rollCharacteristic() + (speciesModifiers.Dex || 0),
    Int: rollCharacteristic() + (speciesModifiers.Int || 0),
    WP: rollCharacteristic() + (speciesModifiers.WP || 0),
    Fel: rollCharacteristic() + (speciesModifiers.Fel || 0)
  }

  return rolls
}

/**
 * Calculate point-buy characteristic allocation
 * (Alternative to rolling)
 *
 * @param {number} totalPoints - Total points to allocate
 * @param {Object} allocations - Desired allocation per characteristic
 * @param {Object} [speciesModifiers] - Species modifiers to add
 * @returns {Object} Calculated characteristics
 */
export function calculatePointBuyCharacteristics(totalPoints, allocations, speciesModifiers = {}) {
  const allocated = { ...allocations }

  // Add species modifiers
  for (const [key, value] of Object.entries(speciesModifiers)) {
    allocated[key] = (allocated[key] || 0) + value
  }

  return allocated
}

/**
 * Calculate corruption points effect
 * (For dark campaigns)
 *
 * @param {number} corruptionPoints - Total corruption points
 * @returns {Object} Corruption effects
 */
export function calculateCorruptionEffects(corruptionPoints) {
  const effects = {
    points: corruptionPoints,
    mutations: Math.floor(corruptionPoints / 10),
    insanity: Math.floor(corruptionPoints / 5),
    warning: ''
  }

  if (corruptionPoints >= 100) {
    effects.warning = 'Character is completely corrupted'
  } else if (corruptionPoints >= 50) {
    effects.warning = 'Character is heavily corrupted'
  } else if (corruptionPoints >= 20) {
    effects.warning = 'Character shows signs of corruption'
  }

  return effects
}

/**
 * Calculate career advancement progress
 *
 * @param {Object} character - Character object
 * @param {Object} career - Career definition
 * @returns {Object} Career progress information
 */
export function calculateCareerProgress(character, career) {
  // This is a simplified calculation
  // Full implementation would track specific career advances

  const currentLevel = character.career.level || 1
  const maxLevel = 4

  return {
    currentLevel,
    maxLevel,
    canAdvance: currentLevel < maxLevel,
    percentage: (currentLevel / maxLevel) * 100
  }
}
