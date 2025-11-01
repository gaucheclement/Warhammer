/**
 * Database Relationship Helpers
 *
 * This module provides helper functions to navigate between related entities
 * in the Warhammer database. It implements the relationship patterns from the
 * original HTML data files (DataCareer.html, DataTalent.html, etc.).
 *
 * Key relationships:
 * - Career ↔ CareerLevel (one-to-many)
 * - Career → Class (many-to-one)
 * - Career → Species[] (many-to-many)
 * - CareerLevel → Skills[] (many-to-many)
 * - CareerLevel → Talents[] (many-to-many)
 * - CareerLevel → Trappings[] (many-to-many)
 * - Talent → Skill (one-to-one via addSkill)
 * - Talent → Talent (one-to-one via addTalent)
 * - Skill → Characteristic (many-to-one)
 *
 * @module db-relations
 */

import { db } from './db.js'

/**
 * Simple in-memory cache for frequently accessed relationships
 * Cache entries expire after 5 minutes
 */
class RelationCache {
  constructor(ttl = 5 * 60 * 1000) {
    this.cache = new Map()
    this.ttl = ttl
  }

  /**
   * Get a cached value
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if expired/missing
   */
  get(key) {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  /**
   * Set a cache value
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   */
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear()
  }

  /**
   * Clear cache entries matching a pattern
   * @param {RegExp} pattern - Pattern to match against keys
   */
  clearPattern(pattern) {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
const relationCache = new RelationCache()

// Export cache instance for use in whereused system
export { relationCache }

/**
 * Clear all cached relationships
 */
export function clearRelationCache() {
  relationCache.clear()
}

/**
 * Clear cached relationships for a specific entity type
 * @param {string} type - Entity type (e.g., 'career', 'talent')
 */
export function clearRelationCacheForType(type) {
  relationCache.clearPattern(new RegExp(`^${type}:`))
}

// ============================================================================
// CAREER RELATIONSHIPS
// ============================================================================

/**
 * Get a career with all its levels included
 *
 * This implements the pattern from DataCareer.html where careers are linked
 * to their career levels through the allByCareer collection.
 *
 * @param {string} careerId - Career ID
 * @returns {Promise<Object|null>} Career object with levels array, or null if not found
 *
 * @example
 * const career = await getCareerWithLevels('artisan')
 * // Returns: { id: 'artisan', name: 'Artisan', class: {...}, levels: [...] }
 */
export async function getCareerWithLevels(careerId) {
  const cacheKey = `career:withLevels:${careerId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const career = await db.careers.get(careerId)
  if (!career) return null

  // Get all career levels for this career, sorted by level
  const levels = await db.careerLevels
    .where('career')
    .equals(careerId)
    .sortBy('level')

  const result = { ...career, levels }
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get the class associated with a career
 *
 * Implements career.getClass() from DataCareer.html
 *
 * @param {string} careerId - Career ID
 * @returns {Promise<Object|null>} Class object or null
 *
 * @example
 * const classObj = await getCareerClass('artisan')
 * // Returns: { id: 'rangers', name: 'Rangers', ... }
 */
export async function getCareerClass(careerId) {
  const cacheKey = `career:class:${careerId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const career = await db.careers.get(careerId)
  if (!career || !career.class) return null

  const classObj = await db.classes.get(career.class)
  relationCache.set(cacheKey, classObj)
  return classObj
}

/**
 * Get all species that can access a career
 *
 * @param {string} careerId - Career ID
 * @returns {Promise<Array>} Array of species objects
 *
 * @example
 * const species = await getCareerSpecies('artisan')
 * // Returns: [{ id: 'human', name: 'Humain' }, ...]
 */
export async function getCareerSpecies(careerId) {
  const cacheKey = `career:species:${careerId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const career = await db.careers.get(careerId)
  if (!career || !career.species) return []

  // species can be a string or array
  const speciesIds = Array.isArray(career.species)
    ? career.species
    : career.species.split(',').map(s => s.trim())

  const speciesObjects = await Promise.all(
    speciesIds.map(id => db.species.get(id))
  )

  // Filter out null values (in case some IDs don't exist)
  const result = speciesObjects.filter(s => s !== null && s !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

// ============================================================================
// CAREER LEVEL RELATIONSHIPS
// ============================================================================

/**
 * Get the career associated with a career level
 *
 * Implements careerLevel.getCareer() from DataCareerLevel.html
 *
 * @param {string} careerLevelId - Career level ID
 * @returns {Promise<Object|null>} Career object or null
 *
 * @example
 * const career = await getCareerLevelCareer('artisan|apprenti artisan')
 */
export async function getCareerLevelCareer(careerLevelId) {
  const cacheKey = `careerLevel:career:${careerLevelId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const careerLevel = await db.careerLevels.get(careerLevelId)
  if (!careerLevel || !careerLevel.career) return null

  const career = await db.careers.get(careerLevel.career)
  relationCache.set(cacheKey, career)
  return career
}

/**
 * Get all skills for a career level
 *
 * Implements careerLevel.getSkills() from DataCareerLevel.html
 * If only=false (default), includes skills from previous levels
 *
 * @param {string} careerLevelId - Career level ID
 * @param {boolean} onlyThisLevel - If true, only return skills from this level
 * @returns {Promise<Array>} Array of skill objects
 *
 * @example
 * const skills = await getCareerLevelSkills('artisan|compagnon artisan')
 * // Returns all skills from level 1 and 2
 *
 * const skillsOnly = await getCareerLevelSkills('artisan|compagnon artisan', true)
 * // Returns only skills from level 2
 */
export async function getCareerLevelSkills(careerLevelId, onlyThisLevel = false) {
  const cacheKey = `careerLevel:skills:${careerLevelId}:${onlyThisLevel}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const careerLevel = await db.careerLevels.get(careerLevelId)
  if (!careerLevel) return []

  let allSkills = []

  // If not only this level and level > 1, get previous levels' skills
  if (!onlyThisLevel && careerLevel.level > 1) {
    const previousLevels = await db.careerLevels
      .where('career')
      .equals(careerLevel.career)
      .and(cl => cl.level < careerLevel.level)
      .sortBy('level')

    for (const prevLevel of previousLevels) {
      if (prevLevel.skills && Array.isArray(prevLevel.skills)) {
        allSkills = [...allSkills, ...prevLevel.skills]
      }
    }
  }

  // Add skills from current level
  if (careerLevel.skills && Array.isArray(careerLevel.skills)) {
    allSkills = [...allSkills, ...careerLevel.skills]
  }

  // Resolve skill IDs to skill objects
  const skillObjects = await Promise.all(
    allSkills.map(skillId => {
      // Handle both string IDs and objects
      const id = typeof skillId === 'string' ? skillId : skillId.id
      return db.skills.get(id)
    })
  )

  const result = skillObjects.filter(s => s !== null && s !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get all talents for a career level
 *
 * Implements careerLevel.getTalents() from DataCareerLevel.html
 * Note: Unlike skills, talents are only from the current level
 *
 * @param {string} careerLevelId - Career level ID
 * @returns {Promise<Array>} Array of talent objects
 *
 * @example
 * const talents = await getCareerLevelTalents('artisan|compagnon artisan')
 */
export async function getCareerLevelTalents(careerLevelId) {
  const cacheKey = `careerLevel:talents:${careerLevelId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const careerLevel = await db.careerLevels.get(careerLevelId)
  if (!careerLevel || !careerLevel.talents) return []

  const talentIds = Array.isArray(careerLevel.talents)
    ? careerLevel.talents
    : []

  const talentObjects = await Promise.all(
    talentIds.map(talentId => {
      const id = typeof talentId === 'string' ? talentId : talentId.id
      return db.talents.get(id)
    })
  )

  const result = talentObjects.filter(t => t !== null && t !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get all characteristics for a career level
 *
 * Implements careerLevel.getCharacteristics() from DataCareerLevel.html
 * If only=false (default), includes characteristics from previous levels
 *
 * @param {string} careerLevelId - Career level ID
 * @param {boolean} onlyThisLevel - If true, only return characteristics from this level
 * @returns {Promise<Array>} Array of characteristic objects
 *
 * @example
 * const chars = await getCareerLevelCharacteristics('artisan|compagnon artisan')
 */
export async function getCareerLevelCharacteristics(careerLevelId, onlyThisLevel = false) {
  const cacheKey = `careerLevel:characteristics:${careerLevelId}:${onlyThisLevel}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const careerLevel = await db.careerLevels.get(careerLevelId)
  if (!careerLevel) return []

  let allCharacteristics = []

  // If not only this level and level > 1, get previous levels' characteristics
  if (!onlyThisLevel && careerLevel.level > 1) {
    const previousLevels = await db.careerLevels
      .where('career')
      .equals(careerLevel.career)
      .and(cl => cl.level < careerLevel.level)
      .sortBy('level')

    for (const prevLevel of previousLevels) {
      if (prevLevel.characteristics && Array.isArray(prevLevel.characteristics)) {
        allCharacteristics = [...allCharacteristics, ...prevLevel.characteristics]
      }
    }
  }

  // Add characteristics from current level
  if (careerLevel.characteristics && Array.isArray(careerLevel.characteristics)) {
    allCharacteristics = [...allCharacteristics, ...careerLevel.characteristics]
  }

  // Resolve characteristic IDs to characteristic objects
  const characteristicObjects = await Promise.all(
    allCharacteristics.map(charId => {
      const id = typeof charId === 'string' ? charId : charId.id
      return db.characteristics.get(id)
    })
  )

  const result = characteristicObjects.filter(c => c !== null && c !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get all trappings for a career level
 *
 * Implements careerLevel.getTrappings() from DataCareerLevel.html
 * For level 1, includes class trappings as well
 *
 * @param {string} careerLevelId - Career level ID
 * @param {boolean} onlyThisLevel - If true, only return trappings from this level
 * @returns {Promise<Array>} Array of trapping objects or strings
 *
 * @example
 * const trappings = await getCareerLevelTrappings('artisan|apprenti artisan')
 * // For level 1, includes class trappings + career level trappings
 */
export async function getCareerLevelTrappings(careerLevelId, onlyThisLevel = false) {
  const cacheKey = `careerLevel:trappings:${careerLevelId}:${onlyThisLevel}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const careerLevel = await db.careerLevels.get(careerLevelId)
  if (!careerLevel) return []

  let allTrappings = []

  // For level 1, include class trappings
  if (!onlyThisLevel && careerLevel.level === 1) {
    const career = await getCareerLevelCareer(careerLevelId)
    if (career) {
      const classObj = await getCareerClass(career.id)
      if (classObj && classObj.trappings && Array.isArray(classObj.trappings)) {
        allTrappings = [...classObj.trappings]
      }
    }
  }

  // Add trappings from current level
  if (careerLevel.trappings && Array.isArray(careerLevel.trappings)) {
    allTrappings = [...allTrappings, ...careerLevel.trappings]
  }

  // Trappings can be either IDs or plain strings
  // Try to resolve IDs, but keep strings as-is
  const trappingObjects = await Promise.all(
    allTrappings.map(async (trapping) => {
      if (typeof trapping === 'string') {
        const obj = await db.trappings.get(trapping)
        return obj || trapping // Return the object if found, otherwise the string
      }
      return trapping
    })
  )

  relationCache.set(cacheKey, trappingObjects)
  return trappingObjects
}

// ============================================================================
// TALENT RELATIONSHIPS
// ============================================================================

/**
 * Get the skill associated with a talent (via addSkill)
 *
 * Implements talent.getSkill() from DataTalent.html
 * If the talent has specs, those are applied to the skill as well
 *
 * @param {string} talentId - Talent ID
 * @returns {Promise<Object|null>} Skill object with specs applied, or null
 *
 * @example
 * const skill = await getTalentSkill('marin')
 * // Returns the skill with talent's specializations applied
 */
export async function getTalentSkill(talentId) {
  const cacheKey = `talent:skill:${talentId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const talent = await db.talents.get(talentId)
  if (!talent || !talent.addSkill) return null

  const skill = await db.skills.get(talent.addSkill)
  if (!skill) return null

  // Apply talent's specializations to the skill
  const result = { ...skill }
  if (talent.specs) {
    result.spec = Array.isArray(talent.specs) ? talent.specs[0] : talent.specs
    result.specs = Array.isArray(talent.specs) ? talent.specs : [talent.specs]
  }
  result.origins = ['talent', talentId]

  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get the talent associated with a talent (via addTalent)
 *
 * Implements talent.getTalent() from DataTalent.html
 * Some talents grant other talents
 *
 * @param {string} talentId - Talent ID
 * @returns {Promise<Object|null>} Talent object or null
 *
 * @example
 * const relatedTalent = await getTalentTalent('magie')
 */
export async function getTalentTalent(talentId) {
  const cacheKey = `talent:talent:${talentId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const talent = await db.talents.get(talentId)
  if (!talent || !talent.addTalent) return null

  const relatedTalent = await db.talents.get(talent.addTalent)
  if (!relatedTalent) return null

  const result = { ...relatedTalent, origins: ['talent', talentId] }
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get a talent with all its related entities
 *
 * Combines multiple relationship queries for convenience
 *
 * @param {string} talentId - Talent ID
 * @returns {Promise<Object|null>} Talent with relatedSkill and relatedTalent
 *
 * @example
 * const talent = await getTalentWithRelations('marin')
 * // Returns: { id: 'marin', name: 'Marin', relatedSkill: {...}, relatedTalent: null }
 */
export async function getTalentWithRelations(talentId) {
  const cacheKey = `talent:withRelations:${talentId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const talent = await db.talents.get(talentId)
  if (!talent) return null

  const [relatedSkill, relatedTalent] = await Promise.all([
    getTalentSkill(talentId),
    getTalentTalent(talentId)
  ])

  const result = {
    ...talent,
    relatedSkill,
    relatedTalent
  }

  relationCache.set(cacheKey, result)
  return result
}

/**
 * Parse talent specializations
 *
 * Implements the specs parsing logic from DataTalent.html
 * Converts comma-separated string to array
 *
 * @param {Object} talent - Talent object
 * @returns {Object} Talent with parsed specs array
 *
 * @example
 * const talent = parseTalentSpecs({ id: 'test', specs: 'Combat, Tir' })
 * // Returns: { id: 'test', specs: ['Combat', 'Tir'], canHaveSpec: true }
 */
export function parseTalentSpecs(talent) {
  if (!talent) return talent

  const parsed = { ...talent }

  if (typeof parsed.specs === 'string' && parsed.specs) {
    parsed.specs = parsed.specs.split(',').map(s => s.trim())
    parsed.canHaveSpec = true
  } else if (!parsed.specs) {
    parsed.specs = []
    parsed.canHaveSpec = false
  }

  parsed.spec = ''
  parsed.origins = parsed.origins || []

  return parsed
}

// ============================================================================
// SKILL RELATIONSHIPS
// ============================================================================

/**
 * Get the characteristic associated with a skill
 *
 * Implements skill.getCharacteristic() from DataSkill.html
 *
 * @param {string} skillId - Skill ID
 * @returns {Promise<Object|null>} Characteristic object or null
 *
 * @example
 * const char = await getSkillCharacteristic('athletisme')
 * // Returns: { id: 'ag', name: 'Agilité', abbreviation: 'Ag' }
 */
export async function getSkillCharacteristic(skillId) {
  const cacheKey = `skill:characteristic:${skillId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const skill = await db.skills.get(skillId)
  if (!skill || !skill.characteristic) return null

  const characteristic = await db.characteristics.get(skill.characteristic)
  relationCache.set(cacheKey, characteristic)
  return characteristic
}

/**
 * Get a skill with its characteristic
 *
 * Convenience function that combines skill and characteristic
 *
 * @param {string} skillId - Skill ID
 * @returns {Promise<Object|null>} Skill with characteristic object
 *
 * @example
 * const skill = await getSkillWithCharacteristic('athletisme')
 * // Returns: { id: 'athletisme', name: 'Athlétisme', characteristicObj: {...} }
 */
export async function getSkillWithCharacteristic(skillId) {
  const cacheKey = `skill:withCharacteristic:${skillId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const skill = await db.skills.get(skillId)
  if (!skill) return null

  const characteristic = await getSkillCharacteristic(skillId)

  const result = {
    ...skill,
    characteristicObj: characteristic
  }

  relationCache.set(cacheKey, result)
  return result
}

/**
 * Parse skill specializations
 *
 * Implements the specs parsing logic from DataSkill.html
 * Converts comma-separated string to array
 *
 * @param {Object} skill - Skill object
 * @returns {Object} Skill with parsed specs array
 *
 * @example
 * const skill = parseSkillSpecs({ id: 'test', specs: 'Épée, Hache' })
 * // Returns: { id: 'test', specs: ['Épée', 'Hache'], canHaveSpec: true }
 */
export function parseSkillSpecs(skill) {
  if (!skill) return skill

  const parsed = { ...skill }

  if (typeof parsed.specs === 'string' && parsed.specs) {
    parsed.specs = parsed.specs.split(',').map(s => s.trim())
    parsed.canHaveSpec = true
    parsed.specName = 'Au choix'
  } else if (!parsed.specs) {
    parsed.specs = []
    parsed.canHaveSpec = false
    parsed.specName = ''
  }

  parsed.spec = ''
  parsed.origins = parsed.origins || []

  return parsed
}

// ============================================================================
// SPELL RELATIONSHIPS
// ============================================================================

/**
 * Get all spells for a specific lore
 *
 * @param {string} loreId - Lore ID
 * @returns {Promise<Array>} Array of spell objects
 *
 * @example
 * const spells = await getSpellsByLore('feu')
 */
export async function getSpellsByLore(loreId) {
  const cacheKey = `spell:byLore:${loreId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const spells = await db.spells
    .where('lore')
    .equals(loreId)
    .toArray()

  relationCache.set(cacheKey, spells)
  return spells
}

/**
 * Get the lore associated with a spell
 *
 * @param {string} spellId - Spell ID
 * @returns {Promise<Object|null>} Lore object or null
 *
 * @example
 * const lore = await getSpellLore('boule-de-feu')
 */
export async function getSpellLore(spellId) {
  const cacheKey = `spell:lore:${spellId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const spell = await db.spells.get(spellId)
  if (!spell || !spell.lore) return null

  const lore = await db.lores.get(spell.lore)
  relationCache.set(cacheKey, lore)
  return lore
}

/**
 * Get all divine spells granted by a specific god
 *
 * @param {string} godId - God ID
 * @returns {Promise<Array>} Array of spell objects (blessings and miracles)
 *
 * @example
 * const divineSpells = await getSpellsByGod('sigmar')
 * // Returns: [{ id: 'blessing-of-sigmar', type: 'blessing', ... }, ...]
 */
export async function getSpellsByGod(godId) {
  const cacheKey = `spell:byGod:${godId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const god = await db.gods.get(godId)
  if (!god) return []

  const spells = []

  // Get blessings for this god
  if (god.blessings && Array.isArray(god.blessings)) {
    const blessings = await Promise.all(
      god.blessings.map(id => db.spells.get(id))
    )
    spells.push(...blessings.filter(s => s !== null && s !== undefined))
  }

  // Get miracles for this god
  if (god.miracles && Array.isArray(god.miracles)) {
    const miracles = await Promise.all(
      god.miracles.map(id => db.spells.get(id))
    )
    spells.push(...miracles.filter(s => s !== null && s !== undefined))
  }

  relationCache.set(cacheKey, spells)
  return spells
}

/**
 * Get the god associated with a divine spell (blessing or miracle)
 *
 * Reverse lookup: spell → god
 *
 * @param {string} spellId - Spell ID
 * @returns {Promise<Object|null>} God object or null
 *
 * @example
 * const god = await getSpellGod('blessing-of-sigmar')
 * // Returns: { id: 'sigmar', name: 'Sigmar', ... }
 */
export async function getSpellGod(spellId) {
  const cacheKey = `spell:god:${spellId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allGods = await db.gods.toArray()

  for (const god of allGods) {
    // Check blessings
    if (god.blessings && Array.isArray(god.blessings) && god.blessings.includes(spellId)) {
      relationCache.set(cacheKey, god)
      return god
    }

    // Check miracles
    if (god.miracles && Array.isArray(god.miracles) && god.miracles.includes(spellId)) {
      relationCache.set(cacheKey, god)
      return god
    }
  }

  relationCache.set(cacheKey, null)
  return null
}

/**
 * Get all spells granted by a specific talent
 *
 * Some talents grant access to specific spells (e.g., magic talents)
 *
 * @param {string} talentId - Talent ID
 * @returns {Promise<Array>} Array of spell objects
 *
 * @example
 * const spells = await getSpellsByTalent('arcane-magic-fire')
 * // Returns: [{ id: 'fireball', type: 'spell', ... }, ...]
 */
export async function getSpellsByTalent(talentId) {
  const cacheKey = `spell:byTalent:${talentId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const talent = await db.talents.get(talentId)
  if (!talent || !talent.spells || !Array.isArray(talent.spells)) return []

  const spells = await Promise.all(
    talent.spells.map(id => db.spells.get(id))
  )

  const result = spells.filter(s => s !== null && s !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get all talents that grant access to a specific spell
 *
 * Reverse lookup: spell → talents
 *
 * @param {string} spellId - Spell ID
 * @returns {Promise<Array>} Array of talent objects
 *
 * @example
 * const talents = await getTalentsBySpell('fireball')
 * // Returns: [{ id: 'arcane-magic-fire', name: 'Arcane Magic (Fire)', ... }]
 */
export async function getTalentsBySpell(spellId) {
  const cacheKey = `talent:bySpell:${spellId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allTalents = await db.talents.toArray()

  const result = allTalents.filter(talent => {
    if (!talent.spells || !Array.isArray(talent.spells)) return false
    return talent.spells.includes(spellId)
  })

  relationCache.set(cacheKey, result)
  return result
}

// ============================================================================
// TRAPPING RELATIONSHIPS
// ============================================================================

/**
 * Get all qualities for a specific trapping (weapon/armor qualities)
 *
 * @param {string} trappingId - Trapping ID
 * @returns {Promise<Array>} Array of quality objects
 *
 * @example
 * const qualities = await getTrappingQualities('sword')
 * // Returns: [{ id: 'sharp', name: 'Sharp', ... }, ...]
 */
export async function getTrappingQualities(trappingId) {
  const cacheKey = `trapping:qualities:${trappingId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const trapping = await db.trappings.get(trappingId)
  if (!trapping || !trapping.qualities) return []

  // qualities can be a string or array
  const qualityIds = Array.isArray(trapping.qualities)
    ? trapping.qualities
    : trapping.qualities.split(',').map(q => q.trim())

  const qualities = await Promise.all(
    qualityIds.map(id => db.qualities.get(id))
  )

  const result = qualities.filter(q => q !== null && q !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get all trappings that have a specific quality
 *
 * Reverse lookup: quality → trappings
 *
 * @param {string} qualityId - Quality ID
 * @returns {Promise<Array>} Array of trapping objects
 *
 * @example
 * const trappings = await getTrappingsByQuality('sharp')
 * // Returns: [{ id: 'sword', name: 'Sword', ... }, ...]
 */
export async function getTrappingsByQuality(qualityId) {
  const cacheKey = `trapping:byQuality:${qualityId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allTrappings = await db.trappings.toArray()

  const result = allTrappings.filter(trapping => {
    if (!trapping.qualities) return false

    const qualityIds = Array.isArray(trapping.qualities)
      ? trapping.qualities
      : trapping.qualities.split(',').map(q => q.trim())

    return qualityIds.includes(qualityId)
  })

  relationCache.set(cacheKey, result)
  return result
}

// ============================================================================
// TRAIT & CREATURE RELATIONSHIPS
// ============================================================================

/**
 * Get all creatures that have a specific trait
 *
 * Reverse lookup: trait → creatures
 *
 * @param {string} traitId - Trait ID
 * @returns {Promise<Array>} Array of creature objects
 *
 * @example
 * const creatures = await getCreaturesByTrait('flight')
 * // Returns: [{ id: 'griffon', name: 'Griffon', ... }, ...]
 */
export async function getCreaturesByTrait(traitId) {
  const cacheKey = `creature:byTrait:${traitId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allCreatures = await db.creatures.toArray()

  const result = allCreatures.filter(creature => {
    if (!creature.traits || !Array.isArray(creature.traits)) return false
    return creature.traits.some(t => {
      const id = typeof t === 'string' ? t : t.id
      return id === traitId
    })
  })

  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get all traits for a specific creature
 *
 * @param {string} creatureId - Creature ID
 * @returns {Promise<Array>} Array of trait objects
 *
 * @example
 * const traits = await getCreatureTraits('griffon')
 * // Returns: [{ id: 'flight', name: 'Flight', ... }, ...]
 */
export async function getCreatureTraits(creatureId) {
  const cacheKey = `creature:traits:${creatureId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const creature = await db.creatures.get(creatureId)
  if (!creature || !creature.traits || !Array.isArray(creature.traits)) return []

  const traits = await Promise.all(
    creature.traits.map(traitRef => {
      const id = typeof traitRef === 'string' ? traitRef : traitRef.id
      return db.traits.get(id)
    })
  )

  const result = traits.filter(t => t !== null && t !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

// ============================================================================
// GOD RELATIONSHIPS
// ============================================================================

/**
 * Get all blessings for a specific god
 *
 * @param {string} godId - God ID
 * @returns {Promise<Array>} Array of blessing objects
 *
 * @example
 * const blessings = await getGodBlessings('sigmar')
 * // Returns: [{ id: 'blessing-of-sigmar', type: 'blessing', ... }]
 */
export async function getGodBlessings(godId) {
  const cacheKey = `god:blessings:${godId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const god = await db.gods.get(godId)
  if (!god || !god.blessings || !Array.isArray(god.blessings)) return []

  const blessings = await Promise.all(
    god.blessings.map(id => db.spells.get(id))
  )

  const result = blessings.filter(b => b !== null && b !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

/**
 * Get all miracles for a specific god
 *
 * @param {string} godId - God ID
 * @returns {Promise<Array>} Array of miracle objects
 *
 * @example
 * const miracles = await getGodMiracles('sigmar')
 * // Returns: [{ id: 'miracle-of-sigmar', type: 'miracle', ... }]
 */
export async function getGodMiracles(godId) {
  const cacheKey = `god:miracles:${godId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const god = await db.gods.get(godId)
  if (!god || !god.miracles || !Array.isArray(god.miracles)) return []

  const miracles = await Promise.all(
    god.miracles.map(id => db.spells.get(id))
  )

  const result = miracles.filter(m => m !== null && m !== undefined)
  relationCache.set(cacheKey, result)
  return result
}

// ============================================================================
// LORE & MAGICK RELATIONSHIPS
// ============================================================================

/**
 * Get the magick domain/tradition for a specific lore
 *
 * Lores belong to magick domains (e.g., Lore of Fire → Arcane Magic)
 *
 * @param {string} loreId - Lore ID
 * @returns {Promise<Object|null>} Magick object or null
 *
 * @example
 * const magick = await getLoreMagick('feu')
 * // Returns: { id: 'arcane', name: 'Arcane Magic', ... }
 */
export async function getLoreMagick(loreId) {
  const cacheKey = `lore:magick:${loreId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const lore = await db.lores.get(loreId)
  if (!lore || !lore.parent) {
    relationCache.set(cacheKey, null)
    return null
  }

  const magick = await db.magicks.get(lore.parent)
  relationCache.set(cacheKey, magick)
  return magick
}

/**
 * Get all lores within a specific magick domain
 *
 * Reverse lookup: magick → lores
 *
 * @param {string} magickId - Magick ID
 * @returns {Promise<Array>} Array of lore objects
 *
 * @example
 * const lores = await getLoresByMagick('arcane')
 * // Returns: [{ id: 'feu', name: 'Lore of Fire', ... }, ...]
 */
export async function getLoresByMagick(magickId) {
  const cacheKey = `lore:byMagick:${magickId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const lores = await db.lores
    .where('parent')
    .equals(magickId)
    .toArray()

  relationCache.set(cacheKey, lores)
  return lores
}

// ============================================================================
// BIDIRECTIONAL SEARCH HELPERS
// ============================================================================

/**
 * Find all career levels that grant a specific skill
 *
 * Reverse lookup: skill → career levels
 *
 * @param {string} skillId - Skill ID
 * @returns {Promise<Array>} Array of career level objects
 *
 * @example
 * const careerLevels = await findCareerLevelsBySkill('athletisme')
 */
export async function findCareerLevelsBySkill(skillId) {
  const cacheKey = `reverse:careerLevels:bySkill:${skillId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allCareerLevels = await db.careerLevels.toArray()

  const result = allCareerLevels.filter(cl => {
    if (!cl.skills || !Array.isArray(cl.skills)) return false
    return cl.skills.some(s => {
      const id = typeof s === 'string' ? s : s.id
      return id === skillId
    })
  })

  relationCache.set(cacheKey, result)
  return result
}

/**
 * Find all career levels that grant a specific talent
 *
 * Reverse lookup: talent → career levels
 *
 * @param {string} talentId - Talent ID
 * @returns {Promise<Array>} Array of career level objects
 *
 * @example
 * const careerLevels = await findCareerLevelsByTalent('combat-au-contact')
 */
export async function findCareerLevelsByTalent(talentId) {
  const cacheKey = `reverse:careerLevels:byTalent:${talentId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allCareerLevels = await db.careerLevels.toArray()

  const result = allCareerLevels.filter(cl => {
    if (!cl.talents || !Array.isArray(cl.talents)) return false
    return cl.talents.some(t => {
      const id = typeof t === 'string' ? t : t.id
      return id === talentId
    })
  })

  relationCache.set(cacheKey, result)
  return result
}

/**
 * Find all careers accessible to a specific species
 *
 * Reverse lookup: species → careers
 *
 * @param {string} speciesId - Species ID
 * @returns {Promise<Array>} Array of career objects
 *
 * @example
 * const careers = await findCareersBySpecies('human')
 */
export async function findCareersBySpecies(speciesId) {
  const cacheKey = `reverse:careers:bySpecies:${speciesId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allCareers = await db.careers.toArray()

  const result = allCareers.filter(career => {
    if (!career.species) return false

    const speciesIds = Array.isArray(career.species)
      ? career.species
      : career.species.split(',').map(s => s.trim())

    return speciesIds.includes(speciesId)
  })

  relationCache.set(cacheKey, result)
  return result
}

/**
 * Find all talents that grant a specific skill
 *
 * Reverse lookup: skill → talents
 *
 * @param {string} skillId - Skill ID
 * @returns {Promise<Array>} Array of talent objects
 *
 * @example
 * const talents = await findTalentsBySkill('navigation')
 */
export async function findTalentsBySkill(skillId) {
  const cacheKey = `reverse:talents:bySkill:${skillId}`
  const cached = relationCache.get(cacheKey)
  if (cached) return cached

  const allTalents = await db.talents.toArray()

  const result = allTalents.filter(talent => talent.addSkill === skillId)

  relationCache.set(cacheKey, result)
  return result
}

// ============================================================================
// WHERE USED REVERSE LOOKUP SYSTEM
// ============================================================================

/**
 * Entity type configuration for reverse lookup queries
 * Maps entity types to their relationship patterns and query strategies
 */
const ENTITY_RELATIONSHIP_CONFIG = {
  // CAREERS - referenced by careerLevels, species (via rand object)
  careers: {
    arrayReferences: [], // No entities have careers[] arrays
    stringReferences: [
      { table: 'careerLevels', field: 'career', indexed: true }
    ],
    objectReferences: [
      { table: 'careers', field: 'rand', pattern: 'keys' } // species as keys in rand object
    ]
  },

  // CAREER LEVELS - not directly referenced by other entities
  careerLevels: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // SPECIES - referenced by careers (via rand object keys)
  species: {
    arrayReferences: [
      { table: 'careers', field: 'species', type: 'string-or-array' } // Can be string or array
    ],
    stringReferences: [],
    objectReferences: []
  },

  // CLASSES - referenced by careers
  classes: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careers', field: 'class', indexed: true }
    ],
    objectReferences: []
  },

  // TALENTS - referenced by careerLevels, species, creatures, and other talents
  talents: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careerLevels', field: 'talents', indexed: false, parseList: true },
      { table: 'species', field: 'talents', indexed: false, parseList: true },
      { table: 'creatures', field: 'talents', indexed: false, parseList: true },
      { table: 'talents', field: 'addTalent', indexed: true }
    ],
    objectReferences: []
  },

  // SKILLS - referenced by careerLevels, species, creatures, talents
  skills: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careerLevels', field: 'skills', indexed: false, parseList: true },
      { table: 'species', field: 'skills', indexed: false, parseList: true },
      { table: 'creatures', field: 'skills', indexed: false, parseList: true },
      { table: 'talents', field: 'addSkill', indexed: true },
      { table: 'skills', field: 'characteristic', indexed: true }
    ],
    objectReferences: []
  },

  // CHARACTERISTICS - referenced by skills, careerLevels
  characteristics: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careerLevels', field: 'characteristics', indexed: false, parseList: true },
      { table: 'skills', field: 'characteristic', indexed: true }
    ],
    objectReferences: [
      { table: 'creatures', field: 'char', pattern: 'values' } // characteristics as values in char object
    ]
  },

  // TRAPPINGS - referenced by careerLevels, classes, creatures
  trappings: {
    arrayReferences: [
      { table: 'classes', field: 'trappings', type: 'array' }
    ],
    stringReferences: [
      { table: 'careerLevels', field: 'trappings', indexed: false, parseList: true },
      { table: 'creatures', field: 'trappings', indexed: false, parseList: true }
    ],
    objectReferences: []
  },

  // QUALITIES - referenced by trappings
  qualities: {
    arrayReferences: [
      { table: 'trappings', field: 'qualities', type: 'array' }
    ],
    stringReferences: [],
    objectReferences: []
  },

  // SPELLS - referenced by creatures, gods (blessings/miracles)
  spells: {
    arrayReferences: [
      { table: 'gods', field: 'blessings', type: 'array' },
      { table: 'gods', field: 'miracles', type: 'array' },
      { table: 'talents', field: 'spells', type: 'array' }
    ],
    stringReferences: [
      { table: 'creatures', field: 'spells', indexed: false, parseList: true }
    ],
    objectReferences: []
  },

  // LORES - referenced by spells
  lores: {
    arrayReferences: [],
    stringReferences: [
      { table: 'spells', field: 'lore', indexed: false }
    ],
    objectReferences: []
  },

  // MAGICKS - referenced by lores (parent)
  magicks: {
    arrayReferences: [],
    stringReferences: [
      { table: 'lores', field: 'parent', indexed: false }
    ],
    objectReferences: []
  },

  // GODS - not directly referenced (they reference spells)
  gods: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // CREATURES - not directly referenced
  creatures: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // TRAITS - referenced by creatures
  traits: {
    arrayReferences: [],
    stringReferences: [
      { table: 'creatures', field: 'traits', indexed: false, parseList: true }
    ],
    objectReferences: []
  },

  // STARS - not directly referenced
  stars: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // EYES - not directly referenced
  eyes: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // HAIRS - not directly referenced
  hairs: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // DETAILS - referenced by species (refDetail)
  details: {
    arrayReferences: [],
    stringReferences: [
      { table: 'species', field: 'refDetail', indexed: false }
    ],
    objectReferences: []
  },

  // ETATS - not directly referenced
  etats: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // PSYCHOLOGIES - not directly referenced
  psychologies: {
    arrayReferences: [],
    stringReferences: [],
    objectReferences: []
  },

  // BOOKS - referenced by most entities via 'book' field
  books: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careers', field: 'book', indexed: true },
      { table: 'careerLevels', field: 'book', indexed: true },
      { table: 'species', field: 'book', indexed: true },
      { table: 'classes', field: 'book', indexed: true },
      { table: 'talents', field: 'book', indexed: true },
      { table: 'skills', field: 'book', indexed: true },
      { table: 'characteristics', field: 'book', indexed: true },
      { table: 'trappings', field: 'book', indexed: true },
      { table: 'spells', field: 'book', indexed: true },
      { table: 'creatures', field: 'book', indexed: true },
      { table: 'traits', field: 'book', indexed: true },
      { table: 'lores', field: 'book', indexed: true },
      { table: 'magicks', field: 'book', indexed: true },
      { table: 'gods', field: 'book', indexed: true },
      { table: 'stars', field: 'book', indexed: true },
      { table: 'etats', field: 'book', indexed: true },
      { table: 'psychologies', field: 'book', indexed: true },
      { table: 'qualities', field: 'book', indexed: true }
    ],
    objectReferences: []
  },

  // TREES - referenced by most entities via 'folder' field
  trees: {
    arrayReferences: [],
    stringReferences: [
      { table: 'careers', field: 'folder', indexed: true },
      { table: 'careerLevels', field: 'folder', indexed: true },
      { table: 'species', field: 'folder', indexed: true },
      { table: 'classes', field: 'folder', indexed: true },
      { table: 'talents', field: 'folder', indexed: true },
      { table: 'skills', field: 'folder', indexed: true },
      { table: 'characteristics', field: 'folder', indexed: true },
      { table: 'trappings', field: 'folder', indexed: true },
      { table: 'spells', field: 'folder', indexed: true },
      { table: 'creatures', field: 'folder', indexed: true },
      { table: 'traits', field: 'folder', indexed: true },
      { table: 'lores', field: 'folder', indexed: true },
      { table: 'magicks', field: 'folder', indexed: true },
      { table: 'gods', field: 'folder', indexed: true },
      { table: 'stars', field: 'folder', indexed: true },
      { table: 'etats', field: 'folder', indexed: true },
      { table: 'psychologies', field: 'folder', indexed: true },
      { table: 'qualities', field: 'folder', indexed: true },
      { table: 'trees', field: 'parent', indexed: false }
    ],
    objectReferences: []
  }
}
// Add singular aliases for entity types used by components
// These allow components to use singular forms (specie, career, skill, etc.)
// while the main config uses plural forms (species, careers, skills, etc.)
ENTITY_RELATIONSHIP_CONFIG.specie = ENTITY_RELATIONSHIP_CONFIG.species;
ENTITY_RELATIONSHIP_CONFIG.career = ENTITY_RELATIONSHIP_CONFIG.careers;
ENTITY_RELATIONSHIP_CONFIG.skill = ENTITY_RELATIONSHIP_CONFIG.skills;
ENTITY_RELATIONSHIP_CONFIG.talent = ENTITY_RELATIONSHIP_CONFIG.talents;
ENTITY_RELATIONSHIP_CONFIG.spell = ENTITY_RELATIONSHIP_CONFIG.spells;
ENTITY_RELATIONSHIP_CONFIG.trait = ENTITY_RELATIONSHIP_CONFIG.traits;
ENTITY_RELATIONSHIP_CONFIG.trapping = ENTITY_RELATIONSHIP_CONFIG.trappings;
ENTITY_RELATIONSHIP_CONFIG.creature = ENTITY_RELATIONSHIP_CONFIG.creatures;

/**
 * Query an indexed field for entities referencing a specific ID
 * @private
 */
async function queryIndexedReference(table, field, entityId) {
  return await db[table].where(field).equals(entityId).toArray()
}

/**
 * Query array field for entities containing a specific ID
 * Handles both string arrays and object arrays with .id property
 * @private
 */
async function queryArrayReference(table, field, entityId, type) {
  const allEntities = await db[table].toArray()

  return allEntities.filter(entity => {
    const fieldValue = entity[field]
    if (!fieldValue) return false

    // Handle string-or-array type (like species in careers)
    if (type === 'string-or-array') {
      if (typeof fieldValue === 'string') {
        const ids = fieldValue.split(',').map(s => s.trim())
        return ids.includes(entityId)
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.some(item => {
          const id = typeof item === 'string' ? item : item?.id
          return id === entityId
        })
      }
      return false
    }

    // Handle regular arrays
    if (!Array.isArray(fieldValue)) return false

    return fieldValue.some(item => {
      const id = typeof item === 'string' ? item : item?.id
      return id === entityId
    })
  })
}

/**
 * Query object field for entities with embedded references
 * Supports 'keys' pattern (entity ID as object key) and 'values' pattern (entity ID as object value)
 * @private
 */
async function queryObjectReference(table, field, entityId, pattern) {
  const allEntities = await db[table].toArray()

  return allEntities.filter(entity => {
    const fieldValue = entity[field]
    if (!fieldValue || typeof fieldValue !== 'object') return false

    if (pattern === 'keys') {
      // Check if entityId is a key in the object (e.g., rand object in careers)
      return Object.keys(fieldValue).includes(entityId)
    }

    if (pattern === 'values') {
      // Check if entityId is a value in the object (e.g., char object in creatures)
      return Object.values(fieldValue).includes(entityId)
    }

    return false
  })
}
/**
 * Query string field for entities containing a specific ID
 * Handles exact match or comma-separated list parsing
 * @private
 */
async function queryStringReference(table, field, entityId, parseList = false) {
  const allEntities = await db[table].toArray()

  return allEntities.filter(entity => {
    const fieldValue = entity[field]
    if (!fieldValue) return false
    if (typeof fieldValue !== 'string') return false

    if (parseList) {
      // Parse comma-separated list and check if entityId is in it
      const ids = fieldValue.split(',').map(s => s.trim())
      return ids.includes(entityId)
    } else {
      // Exact match
      return fieldValue === entityId
    }
  })
}

/**
 * Get all entities that reference (use) a specific entity
 *
 * This function performs a comprehensive reverse lookup across all entity types
 * to find where a specific entity is used. It handles multiple relationship patterns:
 * - Array-based references (skills[], talents[], trappings[])
 * - String-based references (career, class, characteristic)
 * - Object-embedded references (rand object keys, char object values)
 *
 * Results are grouped by entity type and cached for 5 minutes.
 * Performance is optimized using batch queries and indexed lookups where available.
 *
 * @param {string} entityType - Type of the entity (e.g., 'skills', 'talents', 'careers')
 * @param {string} entityId - ID of the entity to find usage for
 * @param {Object} options - Optional configuration
 * @param {boolean} options.skipCache - If true, bypass cache and fetch fresh data
 * @param {boolean} options.benchmark - If true, return performance metrics
 * @returns {Promise<Object>} Object with results grouped by entity type and optional performance data
 *
 * @example
 * // Find all entities that reference a specific skill
 * const usage = await getEntityUsage('skills', 'athletisme')
 * // Returns: {
 * //   careerLevels: [{ id: 'artisan|1', label: 'Apprenti Artisan', ... }],
 * //   talents: [{ id: 'acrobat', label: 'Acrobate', ... }],
 * //   species: [{ id: 'human', label: 'Humain', ... }],
 * //   _performance: { queryTime: 45, cacheHit: false }
 * // }
 *
 * @example
 * // Find where a talent is used
 * const usage = await getEntityUsage('talents', 'combat-au-contact')
 * // Returns grouped results showing career levels and other talents that reference it
 *
 * @example
 * // Find career levels that use a specific career
 * const usage = await getEntityUsage('careers', 'artisan')
 * // Returns: { careerLevels: [...], species: [...] }
 */
export async function getEntityUsage(entityType, entityId, options = {}) {
  const { skipCache = false, benchmark = false } = options
  const startTime = benchmark ? performance.now() : 0

  // Check cache first
  const cacheKey = `usage:${entityType}:${entityId}`
  if (!skipCache) {
    const cached = relationCache.get(cacheKey)
    if (cached) {
      if (benchmark) {
        return {
          ...cached,
          _performance: {
            queryTime: performance.now() - startTime,
            cacheHit: true
          }
        }
      }
      return cached
    }
  }

  // Get relationship configuration for this entity type
  const config = ENTITY_RELATIONSHIP_CONFIG[entityType]
  if (!config) {
    console.warn(`No relationship configuration found for entity type: ${entityType}`)
    return {}
  }

  const results = {}

  // Query all array-based references
  const arrayQueries = config.arrayReferences.map(async ref => {
    const entities = await queryArrayReference(ref.table, ref.field, entityId, ref.type)
    if (entities.length > 0) {
      if (!results[ref.table]) results[ref.table] = []
      results[ref.table].push(...entities)
    }
  })

  // Query all string-based references
  const stringQueries = config.stringReferences.map(async ref => {
    let entities
    if (ref.indexed) {
      entities = await queryIndexedReference(ref.table, ref.field, entityId)
    } else if (ref.parseList) {
      entities = await queryStringReference(ref.table, ref.field, entityId, true)
    } else {
      entities = await queryStringReference(ref.table, ref.field, entityId, false)
    }
    if (entities.length > 0) {
      if (!results[ref.table]) results[ref.table] = []
      results[ref.table].push(...entities)
    }
  })

  // Query all object-embedded references
  const objectQueries = config.objectReferences.map(async ref => {
    const entities = await queryObjectReference(ref.table, ref.field, entityId, ref.pattern)
    if (entities.length > 0) {
      if (!results[ref.table]) results[ref.table] = []
      results[ref.table].push(...entities)
    }
  })

  // Execute all queries in parallel
  await Promise.all([...arrayQueries, ...stringQueries, ...objectQueries])

  // Remove duplicates within each entity type (using Set with id as key)
  for (const table in results) {
    const uniqueMap = new Map()
    results[table].forEach(entity => {
      if (!uniqueMap.has(entity.id)) {
        uniqueMap.set(entity.id, entity)
      }
    })
    results[table] = Array.from(uniqueMap.values())
  }

  // Cache the results
  relationCache.set(cacheKey, results)

  // Add performance metrics if requested
  if (benchmark) {
    return {
      ...results,
      _performance: {
        queryTime: performance.now() - startTime,
        cacheHit: false,
        resultCount: Object.values(results).reduce((sum, arr) => sum + arr.length, 0),
        entityTypesFound: Object.keys(results).length
      }
    }
  }

  return results
}

/**
 * Get usage statistics for an entity
 *
 * Returns a summary of how many times an entity is referenced across all entity types.
 * Useful for determining if an entity can be safely deleted or understanding its importance.
 *
 * @param {string} entityType - Type of the entity
 * @param {string} entityId - ID of the entity
 * @returns {Promise<Object>} Object with usage counts and total
 *
 * @example
 * const stats = await getEntityUsageStats('skills', 'athletisme')
 * // Returns: {
 * //   counts: { careerLevels: 15, talents: 2, species: 3 },
 * //   total: 20,
 * //   canDelete: false
 * // }
 */
export async function getEntityUsageStats(entityType, entityId) {
  const usage = await getEntityUsage(entityType, entityId)

  const counts = {}
  let total = 0

  for (const table in usage) {
    if (table !== '_performance') {
      counts[table] = usage[table].length
      total += usage[table].length
    }
  }

  return {
    counts,
    total,
    canDelete: total === 0 // Entity is safe to delete if not used anywhere
  }
}

/**
 * Batch query for entity usage
 *
 * Efficiently finds usage for multiple entities of the same type.
 * Uses Promise.all for parallel processing.
 *
 * @param {string} entityType - Type of entities
 * @param {Array<string>} entityIds - Array of entity IDs
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} Object mapping entity IDs to their usage data
 *
 * @example
 * const batchUsage = await getEntityUsageBatch('skills', ['athletisme', 'escalade', 'natation'])
 * // Returns: {
 * //   'athletisme': { careerLevels: [...], talents: [...] },
 * //   'escalade': { careerLevels: [...] },
 * //   'natation': { species: [...] }
 * // }
 */
export async function getEntityUsageBatch(entityType, entityIds, options = {}) {
  const results = await Promise.all(
    entityIds.map(async id => {
      const usage = await getEntityUsage(entityType, id, options)
      return { id, usage }
    })
  )

  // Convert array to object with IDs as keys
  return results.reduce((acc, { id, usage }) => {
    acc[id] = usage
    return acc
  }, {})
}

/**
 * Find orphaned entities
 *
 * Finds all entities of a specific type that are not referenced by any other entities.
 * Useful for data cleanup and identifying unused content.
 *
 * @param {string} entityType - Type of entities to check
 * @param {Object} options - Optional configuration
 * @param {number} options.limit - Maximum number of orphans to return (default: 100)
 * @returns {Promise<Array>} Array of orphaned entities
 *
 * @example
 * const orphanedSkills = await findOrphanedEntities('skills')
 * // Returns: [{ id: 'rare-skill', label: 'Rare Skill', usage: {} }]
 */
export async function findOrphanedEntities(entityType, options = {}) {
  const { limit = 100 } = options

  // Get all entities of this type
  const allEntities = await db[entityType].toArray()

  const orphans = []

  // Check usage for each entity (with limit to avoid excessive queries)
  for (const entity of allEntities.slice(0, Math.min(allEntities.length, limit * 2))) {
    const stats = await getEntityUsageStats(entityType, entity.id)

    if (stats.canDelete) {
      orphans.push({
        ...entity,
        usage: stats
      })

      if (orphans.length >= limit) break
    }
  }

  return orphans
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Resolve an entity reference to its full object
 *
 * Entity references in the database can be:
 * - Plain string ID
 * - Object with id property
 * - Object with data property containing the full entity
 *
 * This helper normalizes all these formats
 *
 * @param {string|Object} ref - Entity reference
 * @param {string} type - Entity type (e.g., 'skills', 'talents')
 * @returns {Promise<Object|null>} Resolved entity or null
 *
 * @example
 * const skill = await resolveEntityRef('athletisme', 'skills')
 * const talent = await resolveEntityRef({ id: 'combat' }, 'talents')
 */
export async function resolveEntityRef(ref, type) {
  if (!ref) return null

  // Already a full object with data
  if (ref.data) return ref.data

  // String ID
  if (typeof ref === 'string') {
    return await db[type].get(ref)
  }

  // Object with ID
  if (ref.id) {
    return await db[type].get(ref.id)
  }

  return null
}

/**
 * Resolve multiple entity references
 *
 * @param {Array} refs - Array of entity references
 * @param {string} type - Entity type
 * @returns {Promise<Array>} Array of resolved entities
 *
 * @example
 * const skills = await resolveEntityRefs(['athletisme', 'escalade'], 'skills')
 */
export async function resolveEntityRefs(refs, type) {
  if (!refs || !Array.isArray(refs)) return []

  const resolved = await Promise.all(
    refs.map(ref => resolveEntityRef(ref, type))
  )

  return resolved.filter(r => r !== null && r !== undefined)
}

/**
 * Generate a label for an entity with specializations
 *
 * Implements DataFunctions.getLabelForElem() logic
 *
 * @param {Object} entity - Entity object
 * @returns {string} Formatted label
 *
 * @example
 * getEntityLabel({ label: 'Combat', spec: 'Épée' })
 * // Returns: "Combat (Épée)"
 *
 * getEntityLabel({ label: 'Artisan', suffix: 'Apprenti' })
 * // Returns: "Apprenti Artisan"
 */
export function getEntityLabel(entity) {
  if (!entity) return ''

  let label = entity.label || entity.name || ''

  // Add suffix before label
  if (entity.suffix) {
    label = `${entity.suffix} ${label}`
  }

  // Add specialization
  let spec = ''
  if (entity.specs && Array.isArray(entity.specs) && entity.specs.length > 0) {
    spec = ` (${entity.specs.join(' ou ')})`
  } else if (typeof entity.specs === 'string' && entity.specs) {
    spec = ` (${entity.specs})`
  } else if (entity.spec) {
    spec = ` (${entity.spec})`
  }

  // Add prefix after label and spec
  if (entity.prefix) {
    label = `${label}${spec} ${entity.prefix}`
  } else {
    label = `${label}${spec}`
  }

  return label
}

/**
 * Convert an array of entities to simple string labels
 *
 * @param {Array} entities - Array of entity objects
 * @returns {Array<string>} Array of labels
 *
 * @example
 * const labels = entitiesToLabels([
 *   { label: 'Combat', spec: 'Épée' },
 *   { label: 'Athlétisme' }
 * ])
 * // Returns: ["Combat (Épée)", "Athlétisme"]
 */
export function entitiesToLabels(entities) {
  if (!entities || !Array.isArray(entities)) return []
  return entities.map(getEntityLabel)
}

export default {
  // Cache management
  clearRelationCache,
  clearRelationCacheForType,

  // Career relationships
  getCareerWithLevels,
  getCareerClass,
  getCareerSpecies,

  // Career level relationships
  getCareerLevelCareer,
  getCareerLevelSkills,
  getCareerLevelTalents,
  getCareerLevelCharacteristics,
  getCareerLevelTrappings,

  // Talent relationships
  getTalentSkill,
  getTalentTalent,
  getTalentWithRelations,
  parseTalentSpecs,

  // Skill relationships
  getSkillCharacteristic,
  getSkillWithCharacteristic,
  parseSkillSpecs,

  // Spell relationships
  getSpellsByLore,
  getSpellLore,

  // Bidirectional search
  findCareerLevelsBySkill,
  findCareerLevelsByTalent,
  findCareersBySpecies,
  findTalentsBySkill,

  // Where Used / Reverse lookup
  getEntityUsage,
  getEntityUsageStats,
  getEntityUsageBatch,
  findOrphanedEntities,

  // Utilities
  resolveEntityRef,
  resolveEntityRefs,
  getEntityLabel,
  entitiesToLabels
}
