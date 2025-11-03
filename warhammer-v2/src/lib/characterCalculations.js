/**
 * Character Calculations - Utility functions for calculating derived character stats
 *
 * This module provides calculation functions for wounds, movement, initiative,
 * encumbrance, and other derived statistics based on WFRP 4e rules.
 */

/**
 * Calculate characteristic bonus (divide by 10, round down)
 * Core WFRP 4e mechanic used throughout the system
 *
 * @param {number} characteristic - Characteristic value
 * @returns {number} Characteristic bonus
 */
export function calculateCharacteristicBonus(characteristic) {
  return Math.floor(characteristic / 10)
}

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
  const tBonus = calculateCharacteristicBonus(T)
  const sBonus = calculateCharacteristicBonus(S)
  const wpBonus = calculateCharacteristicBonus(WP)

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
  const iBonus = calculateCharacteristicBonus(I)
  const agBonus = calculateCharacteristicBonus(Ag)

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
  const tBonus = calculateCharacteristicBonus(T)
  const sBonus = calculateCharacteristicBonus(S)

  // Maximum encumbrance = (T Bonus + S Bonus) × 10
  return (tBonus + sBonus) * 10
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
 * Get species defaults (fate and resilience) based on species name
 * These values come from the WFRP 4e characteristics data
 *
 * @param {string} speciesName - Species name (e.g., "Humain", "Nain", "Halfling")
 * @returns {Object} Object with fate and resilience values
 */
export function getSpeciesDefaults(speciesName) {
  // Normalize species name for matching
  // The characteristics.json uses French names: Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome
  const normalized = (speciesName || '').toLowerCase()

  // Map various species name variations to standard values
  // Source: characteristics.json "Destin" (index 11), "Résilience" (index 13), "Extra Points" (index 15)
  // Note: Values represent typical/recommended distribution of base + extra points
  // - Humain: Base 2 + 3 extra (typically 2 fate, 1 resilience = 2/1)
  // - Halfling: Base 0 + 3 extra (typically 3 fate or 1 fate + 2 resilience = 3/2 for balanced)
  // - Nain: Base 0 + 2 extra (typically distributed as 2/2)
  // - Haut/Elfe Sylvain: Base 0 + 2 extra (typically concentrated in fate = 2/0)
  // - Gnome: Base 2 + 2 extra (typically 3/1 or balanced)
  const speciesDefaults = {
    // Humain: Typical fate 2, resilience 1
    'humain': { fate: 2, resilience: 1 },
    'human': { fate: 2, resilience: 1 },
    'reiklander': { fate: 2, resilience: 1 },

    // Halfling: Typical fate 3 (extra points all to fate) or balanced 1/2
    // Using 3/2 to represent halfling's luck (high fate) and toughness (high resilience)
    'halfling': { fate: 3, resilience: 2 },

    // Nain: Typical fate 2 (some extra to fate), resilience 2 (base + some extra)
    'nain': { fate: 2, resilience: 2 },
    'dwarf': { fate: 2, resilience: 2 },

    // Haut Elfe: Typical fate 2 (all extra to fate), resilience 0
    'haut elfe': { fate: 2, resilience: 0 },
    'high elf': { fate: 2, resilience: 0 },
    'elf': { fate: 2, resilience: 0 },

    // Elfe Sylvain: Typical fate 2 (all extra to fate), resilience 0
    'elfe sylvain': { fate: 2, resilience: 0 },
    'wood elf': { fate: 2, resilience: 0 },

    // Gnome: Typical fate 3 (base + extra), resilience 1 (some extra)
    'gnome': { fate: 3, resilience: 1 }
  }

  return speciesDefaults[normalized] || { fate: 0, resilience: 0 }
}

/**
 * Calculate fate points based on species
 * Typically species-specific, default values provided
 *
 * @param {string} speciesName - Species name
 * @returns {number} Default fate points for species
 */
export function calculateDefaultFate(speciesName) {
  return getSpeciesDefaults(speciesName).fate
}

/**
 * Calculate resilience points based on species
 * Typically species-specific, default values provided
 *
 * @param {string} speciesName - Species name
 * @returns {number} Default resilience points for species
 */
export function calculateDefaultResilience(speciesName) {
  return getSpeciesDefaults(speciesName).resilience
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
  return calculateCharacteristicBonus(S)
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
    mutations: calculateCharacteristicBonus(corruptionPoints),
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
