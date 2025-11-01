/**
 * Database Description Generation
 *
 * This module provides description generation functions for all Warhammer entity types.
 * It implements the description generation patterns from the original HTML data files
 * (DataCareer.html, DataTalent.html, etc.) and DescriptionHelper.html.
 *
 * Key features:
 * - Rich HTML descriptions with entity linking
 * - Automatic text processing to identify and link related entities
 * - Nested descriptions (e.g., career with levels)
 * - Formatting and label generation
 * - Support for specializations and variants
 *
 * @module db-descriptions
 */

import { db } from './db.js'
import {
  getCareerWithLevels,
  getCareerClass,
  getCareerSpecies,
  getCareerLevelCareer,
  getCareerLevelSkills,
  getCareerLevelTalents,
  getCareerLevelCharacteristics,
  getCareerLevelTrappings,
  getTalentWithRelations,
  getSkillWithCharacteristic,
  getSpellLore,
  findCareerLevelsBySkill,
  findCareerLevelsByTalent,
  findCareersBySpecies,
  findTalentsBySkill,
  getEntityLabel,
  entitiesToLabels
} from './db-relations.js'

// ============================================================================
// CORE UTILITIES
// ============================================================================

/**
 * Escape special regex characters
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Generate a clickable help link for an entity
 * @param {string} text - Display text
 * @param {string} id - Entity ID
 * @param {string} type - Entity type
 * @returns {string} HTML link
 */
function showHelpText(text, id, type) {
  return `<span class="showHelp" data-type="${type}" data-id="${id}">${text}</span>`
}

/**
 * Generate a help link from an entity object
 * @param {Object} entity - Entity object with id, label/name, typeItem
 * @returns {string} HTML link
 */
function showHelpTextFromElem(entity) {
  if (!entity || typeof entity.id === 'undefined') {
    return entity ? getEntityLabel(entity) : ''
  }
  return showHelpText(getEntityLabel(entity), entity.id, entity.typeItem)
}

/**
 * Convert array to HTML list
 * @param {Array<string>} array - Array of strings
 * @returns {string} HTML unordered list
 */
function toHtmlList(array) {
  if (!array || !array.length) return ''
  return '<ul><li>' + array.join('</li><li>') + '</li></ul>'
}

/**
 * Convert rank number to icon HTML
 * @param {number} rank - Career level rank (1-4)
 * @returns {string} HTML for rank icon
 */
function rankToImg(rank) {
  let icon = 'icon '
  if (rank === 1) {
    icon += 'cross_icon'
  } else if (rank === 2) {
    icon += 'sword_icon'
  } else if (rank === 3) {
    icon += 'skull_icon'
  } else if (rank === 4) {
    icon += 'shield_icon'
  }
  return `<div title="Rang ${rank}" class="${icon}"></div>`
}

/**
 * Convert array of entities to simple label strings with optional help links
 * @param {Array<Object>} entities - Array of entity objects
 * @param {boolean} withHelp - If true, wrap labels in help links
 * @returns {Array<string>} Array of label strings
 */
function entitiesToSimpleArray(entities, withHelp = false) {
  if (!entities || !Array.isArray(entities)) return []

  return entities.map(entity => {
    if (withHelp === true) {
      return showHelpTextFromElem(entity)
    }
    return getEntityLabel(entity)
  })
}

// ============================================================================
// TEXT PROCESSING AND ENTITY LINKING
// ============================================================================

/**
 * Apply automatic entity linking to text descriptions
 *
 * This is the core description formatting function, implementing the logic from
 * DescriptionHelper.applyHelp(). It searches for entity references in text and
 * automatically converts them to clickable help links.
 *
 * The function uses regex patterns to find entity names in text, matching:
 * - The entity label (with optional pluralization)
 * - Optional numbers/modifiers before or after
 * - Optional specializations in parentheses
 *
 * @param {string|Array<string>} texts - Text(s) to process
 * @param {Object} currentEntity - Current entity (to avoid self-referencing)
 * @param {Object} labelMap - Map of entity labels to entity objects
 * @returns {string|Array<string>} Processed text with help links
 *
 * @example
 * const text = "You gain +10 to Athletisme and Combat (Épée)"
 * const processed = applyHelp(text, career, { skill: skillMap })
 * // Returns text with Athletisme and Combat as clickable links
 */
export function applyHelp(texts, currentEntity, labelMap = {}) {
  if (!texts) return texts

  const isArray = Array.isArray(texts)
  const result = []

  // Sort labels by length (longest first) to match longer names before shorter ones
  const sortedLabels = Object.entries(labelMap).sort((a, b) => b[0].length - a[0].length)

  const textsToProcess = isArray ? texts : [texts]

  textsToProcess.forEach(text => {
    if (!text || typeof text !== 'string') {
      result.push(text)
      return
    }

    let processedText = text
    const matches = []

    // Process each potential entity label
    for (const [label, entity] of sortedLabels) {
      // Skip if this is the same entity (avoid self-reference)
      if (entity.typeItem === currentEntity.typeItem && entity.label === currentEntity.label) {
        continue
      }

      // Build regex pattern
      const regNumber = '( ?[+|-]?\\d+[d\\-+\\d]* ?)?'
      const regSpec = '( ?\\([^\\(\\$]*\\))?'
      const reg = '[^-#|\\w\\u00C0-\\u00FF\\u0153]'
      const regexpBegin = isArray ? '(^| ou )' : '(' + reg + '|^)'

      // Add optional spec and number patterns if entity can have specs
      const prefix = entity.canHaveSpec ? regSpec + regNumber : '()()'

      // Split label into words and add optional pluralization
      const regexpLabel = label.trim().split(' ').map(word => escapeRegExp(word) + 's?')

      const regexp = new RegExp(
        regexpBegin + '(' + regNumber + regexpLabel.join(' ') + regNumber + prefix + ')($|' + reg + ')',
        'gm'
      )

      processedText = processedText.replace(regexp, (match, p1, p2, p3, p4, p5, p6, p7) => {
        matches.push(showHelpText(p2, entity.id, entity.typeItem))
        return p1 + '#' + (matches.length - 1) + '#' + p7
      })
    }

    // Replace placeholders with actual help links (do it twice to handle overlaps)
    processedText = processedText.replace(new RegExp('#(\\d+)#', 'gm'), (match, p1) => matches[p1])
    processedText = processedText.replace(new RegExp('#(\\d+)#', 'gm'), (match, p1) => matches[p1])

    result.push(processedText)
  })

  return isArray ? result : result[0]
}

/**
 * Build a label map for entity linking
 *
 * Creates a map of entity labels to entity objects, used by applyHelp()
 * to identify entities in text.
 *
 * @param {Object} entityCollections - Object with entity type keys and array values
 * @returns {Object} Map of labels to entities
 *
 * @example
 * const labelMap = await buildLabelMap({
 *   skill: await db.skills.toArray(),
 *   talent: await db.talents.toArray()
 * })
 */
export async function buildLabelMap(entityCollections) {
  const map = {}

  for (const [type, entities] of Object.entries(entityCollections)) {
    if (!entities || !Array.isArray(entities)) continue

    for (const entity of entities) {
      const label = entity.label || entity.name
      if (label) {
        map[label] = {
          ...entity,
          typeItem: type
        }

        // Add abbreviation if present
        if (entity.abr) {
          map[entity.abr] = {
            ...entity,
            typeItem: type
          }
        }
      }
    }
  }

  return map
}

/**
 * List matches in a simple format
 *
 * Implements DescriptionHelper.listMatchSimple() for displaying
 * related entities organized by type.
 *
 * @param {string} text - Section title
 * @param {Object} matches - Matches organized by type
 * @param {string} key - Entity type key
 * @returns {string} HTML formatted list
 */
function listMatchSimple(text, matches, key) {
  if (!matches || !matches[key] || !Object.keys(matches[key]).length) {
    return ''
  }

  let html = ''
  if (text) {
    html += '<b>' + text + ': </b>'
  }

  html += '<ul>'
  for (const [name, entity] of Object.entries(matches[key])) {
    const linkText = entity.inactive ? name : showHelpText(name, entity.id, key)
    html += '<li>' + linkText + '</li>'
  }
  html += '</ul>'

  return html
}

/**
 * List career level matches with rank icons
 *
 * Implements DescriptionHelper.listMatchCareerLevel() for displaying
 * career levels with their rank indicators.
 *
 * @param {string} text - Section title
 * @param {Array} careerLevelMatches - Array of career level objects by rank
 * @returns {string} HTML formatted list with rank icons
 */
function listMatchCareerLevel(text, careerLevelMatches) {
  if (!careerLevelMatches || !careerLevelMatches.length) {
    return ''
  }

  let html = '<b>' + text + ': </b><ul>'

  careerLevelMatches.forEach((levelGroup, rank) => {
    if (levelGroup) {
      for (const [name, entity] of Object.entries(levelGroup)) {
        html += '<li style="display: flex">'
        html += '<div class="div_label">'
        html += rankToImg(rank)
        html += showHelpText(name, entity.id, 'careerLevel')
        html += '</div>'
        html += '</li>'
      }
    }
  })

  html += '</ul>'
  return html
}

// ============================================================================
// ENTITY DESCRIPTION GENERATORS
// ============================================================================

/**
 * Generate description for a Career
 *
 * Implements career.getDescription() from DataCareer.html
 * Includes career info, all career levels with their details, and access information.
 *
 * @param {string} careerId - Career ID
 * @returns {Promise<Object>} Object with description sections (Info, rank icons, Accès)
 *
 * @example
 * const desc = await generateCareerDescription('artisan')
 * // Returns: {
 * //   Info: "Career description...",
 * //   [rank1Icon]: "Level 1 details...",
 * //   [rank2Icon]: "Level 2 details...",
 * //   Accès: "Species that can access..."
 * // }
 */
export async function generateCareerDescription(careerId) {
  const career = await getCareerWithLevels(careerId)
  if (!career) return null

  const result = {}

  // Add basic description if present
  if (career.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray()
    })
    result['Info'] = applyHelp(career.desc, { typeItem: 'career', label: career.name }, labelMap)
  }

  // Add each career level
  if (career.levels && career.levels.length > 0) {
    for (const level of career.levels) {
      const classObj = await getCareerClass(careerId)
      const characteristics = await getCareerLevelCharacteristics(level.id, true)
      const skills = await getCareerLevelSkills(level.id, true)
      const talents = await getCareerLevelTalents(level.id)
      const trappings = await getCareerLevelTrappings(level.id)

      let levelDesc = ''
      levelDesc += '<b>Niveau de carrière: </b>' + getEntityLabel(level) + '<BR><BR>'
      levelDesc += '<b>Statut: </b>' + (level.status || '') + '<BR><BR>'

      if (classObj) {
        levelDesc += '<b>Classe: </b>' + showHelpTextFromElem(classObj) + '<BR><BR>'
      }

      levelDesc += '<b>Attributs: </b>' + toHtmlList(entitiesToSimpleArray(characteristics, true))
      levelDesc += '<b>Compétences: </b>' + toHtmlList(entitiesToSimpleArray(skills, true))
      levelDesc += '<b>Talents: </b>' + toHtmlList(entitiesToSimpleArray(talents, true))
      levelDesc += '<b>Possessions: </b>' + toHtmlList(entitiesToSimpleArray(trappings, true))

      result[rankToImg(level.level)] = levelDesc
    }
  }

  // Add species access information
  const species = await getCareerSpecies(careerId)
  if (species && species.length > 0) {
    const speciesMatches = {}
    species.forEach(s => {
      speciesMatches[s.name || s.label] = { id: s.id }
    })
    const accessInfo = listMatchSimple('Race donnant accès à cette carrière', { specie: speciesMatches }, 'specie')
    if (accessInfo) {
      result['Accès'] = accessInfo
    }
  }

  return result
}

/**
 * Generate description for a Career Level
 *
 * Implements careerLevel.getDescription() from DataCareerLevel.html
 * Returns metadata about which tab should be active when displaying.
 *
 * @param {string} careerLevelId - Career level ID
 * @returns {Promise<Object>} Object with tab_actif property
 *
 * @example
 * const desc = await generateCareerLevelDescription('artisan|apprenti artisan')
 * // Returns: { tab_actif: 1 }
 */
export async function generateCareerLevelDescription(careerLevelId) {
  const careerLevel = await db.careerLevels.get(careerLevelId)
  if (!careerLevel) return null

  const career = await getCareerLevelCareer(careerLevelId)
  const tabOffset = career && career.desc ? 0 : 1

  return { tab_actif: careerLevel.level - tabOffset }
}

/**
 * Generate description for a Talent
 *
 * Implements talent.getDescription() from DataTalent.html
 * Includes max rank, tests, description with entity links, specializations,
 * and access information (species and career levels).
 *
 * @param {string} talentId - Talent ID
 * @returns {Promise<Object|string>} Object with Info/Accès sections, or just Info string
 *
 * @example
 * const desc = await generateTalentDescription('combat')
 * // Returns: {
 * //   Info: "Max: 5<br>Tests: ...<br>Description...",
 * //   Accès: "Careers and species..."
 * // }
 */
export async function generateTalentDescription(talentId) {
  const talent = await getTalentWithRelations(talentId)
  if (!talent) return null

  let desc = ''

  // Max rank
  if (talent.max) {
    desc += '<b>Maxi: </b>' + talent.max + '<br>'
  }

  // Tests
  if (talent.tests) {
    desc += '<b>Tests: </b>' + talent.tests + '<br>'
  }

  // Description with entity linking
  if (talent.desc) {
    desc += '<br>'
    const labelMap = await buildLabelMap({
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      lore: await db.lores.toArray(),
      etat: await db.etats.toArray(),
      magick: await db.magicks.toArray(),
      quality: await db.qualities.toArray(),
      trapping: await db.trappings.toArray(),
      god: await db.gods.toArray(),
      talent: await db.talents.toArray(),
      psychologie: await db.psychologies.toArray()
    })
    desc += applyHelp(talent.desc, { typeItem: 'talent', label: talent.name }, labelMap)
  }

  // Specializations
  if (talent.specs && talent.specs.length) {
    const specs = Array.isArray(talent.specs) ? talent.specs : talent.specs.split(', ')
    desc += '<br><br><b>Spécialisations: </b>' + specs.join(', ') + '<br>'
  }

  const result = { Info: desc }

  // Access information
  const careerLevels = await findCareerLevelsByTalent(talentId)
  if (careerLevels && careerLevels.length > 0) {
    // Build career level matches grouped by rank
    const careerLevelMatches = []
    for (const cl of careerLevels) {
      const career = await getCareerLevelCareer(cl.id)
      if (career) {
        if (!careerLevelMatches[cl.level]) {
          careerLevelMatches[cl.level] = {}
        }
        careerLevelMatches[cl.level][career.name || career.label] = { id: cl.id }
      }
    }

    const accessInfo = listMatchCareerLevel('Carrières donnant accès à ce talent', careerLevelMatches)
    if (accessInfo) {
      result['Accès'] = accessInfo
    }
  }

  // Handle special case for "magie mineure" talent
  if (talent.id === 'magie mineure') {
    const minorSpells = await db.spells
      .where('type')
      .equals('Magie mineure')
      .toArray()

    if (minorSpells && minorSpells.length > 0) {
      result['Sorts'] = '<b>Sorts uniques: </b>' + toHtmlList(entitiesToSimpleArray(minorSpells, true))
    }
  }

  // Return just the info string if no other sections
  if (!result['Sorts'] && !result['Accès']) {
    return result['Info']
  }

  return result
}

/**
 * Generate description for a Skill
 *
 * Implements skill.getDescription() from DataSkill.html
 * Includes characteristic, type (base/advanced), grouped status, description,
 * examples, specializations, and access information.
 *
 * @param {string} skillId - Skill ID
 * @returns {Promise<Object|string>} Object with Info/Accès sections, or just Info string
 *
 * @example
 * const desc = await generateSkillDescription('athletisme')
 * // Returns: {
 * //   Info: "Attribut: Agilité...",
 * //   Accès: "Species and careers..."
 * // }
 */
export async function generateSkillDescription(skillId) {
  const skill = await getSkillWithCharacteristic(skillId)
  if (!skill) return null

  let desc = ''

  // Characteristic
  if (skill.characteristicObj) {
    desc += '<b>Attribut: </b>' + showHelpTextFromElem(skill.characteristicObj)
  }

  // Type and grouped status
  const type = skill.type || 'base'
  desc += '<i>, ' + (type === 'base' ? 'de ' : '') + type

  if (skill.specs && skill.specs.length) {
    desc += ', groupée'
  }
  desc += '</i><br><br>'

  // Description with entity linking
  if (skill.desc) {
    let tmpDesc = skill.desc
    if (skill.example) {
      tmpDesc += '<br><br><b>Exemple: </b>' + skill.example
    }

    const labelMap = await buildLabelMap({
      skill: await db.skills.toArray(),
      characteristic: await db.characteristics.toArray(),
      talent: await db.talents.toArray(),
      lore: await db.lores.toArray(),
      god: await db.gods.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray()
    })
    desc += applyHelp(tmpDesc, { typeItem: 'skill', label: skill.name }, labelMap)
  }

  // Specializations
  if (skill.specs && skill.specs.length) {
    const specs = Array.isArray(skill.specs) ? skill.specs : skill.specs.split(', ')
    desc += '<br><br><b>Spécialisations: </b>' + specs.join(', ')
  }

  // Access information
  let accessInfo = ''

  // Career levels
  const careerLevels = await findCareerLevelsBySkill(skillId)
  if (careerLevels && careerLevels.length > 0) {
    const careerLevelMatches = []
    for (const cl of careerLevels) {
      const career = await getCareerLevelCareer(cl.id)
      if (career) {
        if (!careerLevelMatches[cl.level]) {
          careerLevelMatches[cl.level] = {}
        }
        careerLevelMatches[cl.level][career.name || career.label] = { id: cl.id }
      }
    }
    accessInfo += listMatchCareerLevel('Carrières donnant accès à cette compétence', careerLevelMatches)
  }

  // Talents
  const talents = await findTalentsBySkill(skillId)
  if (talents && talents.length > 0) {
    const talentMatches = {}
    talents.forEach(t => {
      talentMatches[t.name || t.label] = { id: t.id }
    })
    accessInfo += listMatchSimple('Talents liés à cette compétence', { talent: talentMatches }, 'talent')
  }

  if (accessInfo) {
    return {
      Info: desc,
      Accès: accessInfo
    }
  }

  return desc
}

/**
 * Generate description for a Spell
 *
 * Implements spell.getDescription() from DataSpell.html
 * Includes talent requirement, casting number, range, target, duration,
 * description, and access information (lores and gods).
 *
 * @param {string} spellId - Spell ID
 * @returns {Promise<Object>} Object with Info and potentially Accès sections
 *
 * @example
 * const desc = await generateSpellDescription('boule-de-feu')
 * // Returns: {
 * //   Info: "Talent: Magie...<br>NI: 7...",
 * //   Accès: "Lores..."
 * // }
 */
export async function generateSpellDescription(spellId) {
  const spell = await db.spells.get(spellId)
  if (!spell) return null

  const result = {}
  let desc = ''

  // Talent requirement
  if (spell.talent) {
    const talent = await db.talents.get(spell.talent)
    if (talent) {
      desc += '<b>Talent: </b>' + showHelpTextFromElem(talent) + '<br>'
    }
  }

  // Casting number
  if (spell.cn) {
    desc += '<b>NI: </b>' + spell.cn + '<br>'
  }

  // Range, target, duration with entity linking
  const labelMap = await buildLabelMap({
    characteristic: await db.characteristics.toArray()
  })

  if (spell.range) {
    desc += '<b>Portée: </b>' + applyHelp(spell.range, { typeItem: 'spell', label: spell.name }, labelMap) + '<br>'
  }
  if (spell.target) {
    desc += '<b>Cible: </b>' + applyHelp(spell.target, { typeItem: 'spell', label: spell.name }, labelMap) + '<br>'
  }
  if (spell.duration) {
    desc += '<b>Durée: </b>' + applyHelp(spell.duration, { typeItem: 'spell', label: spell.name }, labelMap) + '<br>'
  }

  // Description
  if (spell.desc) {
    desc += '<br>'
    const fullLabelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      talent: await db.talents.toArray(),
      quality: await db.qualities.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray(),
      magick: await db.magicks.toArray(),
      trait: await db.traits.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      god: await db.gods.toArray()
    })
    desc += applyHelp(spell.desc, { typeItem: 'spell', label: spell.name }, fullLabelMap)
  }

  if (desc) {
    result['Info'] = desc
  }

  // Access information
  let accessInfo = ''

  // Lore access
  if (spell.lore) {
    const lore = await db.lores.get(spell.lore)
    if (lore) {
      accessInfo += listMatchSimple('Domaines donnant accès à ce sort', { lore: { [lore.name || lore.label]: { id: lore.id } } }, 'lore')
    }
  }

  // God access
  if (spell.god) {
    const god = await db.gods.get(spell.god)
    if (god) {
      accessInfo += listMatchSimple('Dieux donnant accès à ce sort', { god: { [god.name || god.label]: { id: god.id } } }, 'god')
    }
  }

  if (accessInfo) {
    result['Accès'] = accessInfo
  }

  return result
}

/**
 * Generate description for a Class
 *
 * Implements class.getDescription() from DataClass.html
 * Includes class description, career options, and starting trappings.
 *
 * @param {string} classId - Class ID
 * @returns {Promise<string>} HTML description
 *
 * @example
 * const desc = await generateClassDescription('rangers')
 * // Returns: "Description...<br>Career options...<br>Possessions..."
 */
export async function generateClassDescription(classId) {
  const classObj = await db.classes.get(classId)
  if (!classObj) return null

  let desc = ''

  // Description
  if (classObj.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray()
    })
    desc += applyHelp(classObj.desc, { typeItem: 'class', label: classObj.name }, labelMap)
    desc += '<br><br>'
  }

  // Career options
  const careers = await db.careers.where('class').equals(classId).toArray()
  if (careers && careers.length > 0) {
    const careerMatches = {}
    careers.forEach(c => {
      careerMatches[c.name || c.label] = { id: c.id }
    })
    desc += listMatchSimple('Options de Carrière', { career: careerMatches }, 'career')
  }

  // Starting trappings
  if (classObj.trappings && classObj.trappings.length) {
    const trappings = await Promise.all(
      classObj.trappings.map(t => {
        const id = typeof t === 'string' ? t : t.id
        return db.trappings.get(id)
      })
    )
    const validTrappings = trappings.filter(t => t)
    if (validTrappings.length > 0) {
      desc += '<b>Possesssions: </b>' + toHtmlList(entitiesToSimpleArray(validTrappings, true))
    }
  }

  return desc
}

/**
 * Generate description for a Species
 *
 * Implements specie.getDescription() from DataSpecie.html
 * Includes species info, details (age, height, eyes, hair), characteristics,
 * racial skills/talents, and available careers.
 *
 * @param {string} speciesId - Species ID
 * @returns {Promise<Object>} Object with multiple sections (Info, Détails, Caractéristiques, etc.)
 *
 * @example
 * const desc = await generateSpeciesDescription('human')
 * // Returns: {
 * //   Info: "Species description...",
 * //   Détails: "Age, height, etc...",
 * //   'Comps/Talents': "Racial skills and talents...",
 * //   Carrières: "Available careers..."
 * // }
 */
export async function generateSpeciesDescription(speciesId) {
  const species = await db.species.get(speciesId)
  if (!species) return null

  const result = {}

  // Basic description
  if (species.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray(),
      psychologie: await db.psychologies.toArray()
    })
    result['Info'] = applyHelp(species.desc, { typeItem: 'specie', label: species.name }, labelMap)
  }

  // Details section (age, height, etc.) - simplified version
  // Full implementation would require detail tables which aren't in scope
  result['Détails'] = 'Détails de la race (âge, taille, etc.)'

  // Skills and talents
  let skillsTalents = ''
  if (species.skills && species.skills.length) {
    const skills = await Promise.all(
      species.skills.map(s => {
        const id = typeof s === 'string' ? s : s.id
        return db.skills.get(id)
      })
    )
    const validSkills = skills.filter(s => s)
    if (validSkills.length > 0) {
      skillsTalents += '<b>Compétences de race: </b>' + toHtmlList(entitiesToSimpleArray(validSkills, true))
    }
  }

  if (species.talents && species.talents.length) {
    const talents = await Promise.all(
      species.talents.map(t => {
        const id = typeof t === 'string' ? t : t.id
        return db.talents.get(id)
      })
    )
    const validTalents = talents.filter(t => t)
    if (validTalents.length > 0) {
      skillsTalents += '<b>Talents de race: </b>' + toHtmlList(entitiesToSimpleArray(validTalents, true))
    }
  }

  if (skillsTalents) {
    result['Comps/Talents'] = skillsTalents
  }

  // Available careers
  const careers = await findCareersBySpecies(speciesId)
  if (careers && careers.length > 0) {
    result['Carrières'] = toHtmlList(entitiesToSimpleArray(careers, true))
  }

  // Characteristics table - simplified
  result['Caractéristiques'] = 'Table des caractéristiques de race'

  return result
}

/**
 * Generate description for a Trapping (weapon, armor, or item)
 *
 * Implements trapping.getDescription() from DataTrapping.html
 * Includes category, stats (price, enc, reach, damage, armor, etc.),
 * qualities/flaws, and description.
 *
 * @param {string} trappingId - Trapping ID
 * @returns {Promise<string>} HTML description
 *
 * @example
 * const desc = await generateTrappingDescription('epee-courte')
 * // Returns: "Catégorie: melee<br>Groupe: Épées<br>Price: ...<br>Damage: ..."
 */
export async function generateTrappingDescription(trappingId) {
  const trapping = await db.trappings.get(trappingId)
  if (!trapping) return null

  const type = trapping.type || 'trapping'
  const isVehicle = type === 'vehicle'
  const isRanged = type === 'ranged' || type === 'ammunition'
  const isWeapon = type === 'melee' || isRanged
  const isArmor = type === 'armor'

  let desc = '<b>Catégorie: </b>' + type + '<br>'

  if (trapping.subType) {
    desc += '<b>Groupe d\'armes: </b>' + trapping.subType + '<br>'
  }
  desc += '<br>'

  if (trapping.price) {
    desc += '<b>Prix: </b>' + trapping.price + '<br>'
  }
  if (trapping.availability) {
    desc += '<b>Disponibilité: </b>' + trapping.availability + '<br>'
  }
  if (trapping.enc) {
    desc += '<b>Encombrement: </b>' + trapping.enc + '<br>'
  }
  desc += '<br>'

  if (trapping.reach) {
    if (isRanged) {
      desc += '<b>Porté: </b>' + trapping.reach + '<br>'
    } else {
      desc += '<b>Allonge: </b>' + trapping.reach + '<br>'
    }
  }
  if (trapping.damage) {
    desc += '<b>Dégâts: </b>' + trapping.damage + '<br>'
  }
  if (trapping.loc) {
    desc += '<b>Emplacements: </b>' + trapping.loc + '<br>'
  }
  if (trapping.pa) {
    desc += '<b>Points d\'armure: </b>' + trapping.pa + '<br>'
  }
  if (trapping.carry) {
    if (isVehicle) {
      desc += '<b>Chargement: </b>' + trapping.carry + '<br>'
    } else {
      desc += '<b>Contenu: </b>' + trapping.carry + '<br>'
    }
  }
  if (trapping.mode) {
    desc += '<b>Mode: </b>' + trapping.mode + '<br>'
  }
  if (trapping.toughness) {
    desc += '<b>Endurance: </b>' + trapping.toughness + '<br>'
  }
  if (trapping.wounds) {
    desc += '<b>Blessures: </b>' + trapping.wounds + '<br>'
  }

  // Qualities and flaws
  if (trapping.qualities && trapping.qualities.length) {
    const qualities = await Promise.all(
      trapping.qualities.map(q => {
        const id = typeof q === 'string' ? q : q.id
        return db.qualities.get(id)
      })
    )
    const validQualities = qualities.filter(q => q)
    if (validQualities.length > 0) {
      desc += '<b>Atouts et Défauts: </b>' + entitiesToSimpleArray(validQualities, true).join(', ') + '<br>'
    }
  }

  // Description
  if (trapping.desc) {
    desc += '<br>'
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray(),
      etat: await db.etats.toArray(),
      talent: await db.talents.toArray(),
      skill: await db.skills.toArray(),
      characteristic: await db.characteristics.toArray(),
      psychologie: await db.psychologies.toArray()
    })
    desc += applyHelp(trapping.desc, { typeItem: 'trapping', label: trapping.name }, labelMap)
  }

  return desc
}

/**
 * Generate description for a Characteristic
 *
 * Implements characteristic.getDescription()
 * Includes abbreviation, type, and description with entity linking.
 *
 * @param {string} characteristicId - Characteristic ID
 * @returns {Promise<string>} HTML description
 *
 * @example
 * const desc = await generateCharacteristicDescription('ws')
 * // Returns: "Abréviation: CC<br>Type: Combat...<br>Description..."
 */
export async function generateCharacteristicDescription(characteristicId) {
  const characteristic = await db.characteristics.get(characteristicId)
  if (!characteristic) return null

  let desc = ''

  // Abbreviation
  if (characteristic.abr) {
    desc += '<b>Abréviation: </b>' + characteristic.abr + '<br>'
  }

  // Type
  if (characteristic.type) {
    desc += '<b>Type: </b>' + characteristic.type + '<br>'
  }

  // Description
  if (characteristic.desc) {
    desc += '<br>'
    const labelMap = await buildLabelMap({
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      characteristic: await db.characteristics.toArray()
    })
    desc += applyHelp(characteristic.desc, { typeItem: 'characteristic', label: characteristic.label }, labelMap)
  }

  return desc
}

/**
 * Generate description for a God
 *
 * Implements god.getDescription()
 * Includes god description with entity linking, and lists of blessings/miracles.
 *
 * @param {string} godId - God ID
 * @returns {Promise<Object|string>} Object with Info and Sorts sections, or just Info string
 *
 * @example
 * const desc = await generateGodDescription('sigmar')
 * // Returns: {
 * //   Info: "Description of Sigmar...",
 * //   Sorts: "Blessings and miracles..."
 * // }
 */
export async function generateGodDescription(godId) {
  const god = await db.gods.get(godId)
  if (!god) return null

  let desc = ''

  // Description with entity linking
  if (god.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray(),
      talent: await db.talents.toArray(),
      skill: await db.skills.toArray(),
      characteristic: await db.characteristics.toArray()
    })
    desc += applyHelp(god.desc, { typeItem: 'god', label: god.label }, labelMap)
  }

  // Get blessings and miracles
  const blessings = await db.spells
    .where('god')
    .equals(godId)
    .and(spell => spell.type === 'Bénédiction' || spell.type === 'blessing')
    .toArray()

  const miracles = await db.spells
    .where('god')
    .equals(godId)
    .and(spell => spell.type === 'Miracle' || spell.type === 'miracle')
    .toArray()

  // If we have spells, create sections
  if ((blessings && blessings.length > 0) || (miracles && miracles.length > 0)) {
    const result = { Info: desc }
    let spellsDesc = ''

    if (blessings && blessings.length > 0) {
      spellsDesc += '<b>Bénédictions: </b>' + toHtmlList(entitiesToSimpleArray(blessings, true))
    }

    if (miracles && miracles.length > 0) {
      spellsDesc += '<b>Miracles: </b>' + toHtmlList(entitiesToSimpleArray(miracles, true))
    }

    if (spellsDesc) {
      result['Sorts'] = spellsDesc
    }

    return result
  }

  return desc
}

/**
 * Generate description for a Lore
 *
 * Implements lore.getDescription()
 * Includes lore description with entity linking, and list of spells.
 *
 * @param {string} loreId - Lore ID
 * @returns {Promise<Object|string>} Object with Info and Sorts sections, or just Info string
 *
 * @example
 * const desc = await generateLoreDescription('feu')
 * // Returns: {
 * //   Info: "Description of fire magic...",
 * //   Sorts: "List of fire spells..."
 * // }
 */
export async function generateLoreDescription(loreId) {
  const lore = await db.lores.get(loreId)
  if (!lore) return null

  let desc = ''

  // Description with entity linking
  if (lore.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray(),
      talent: await db.talents.toArray(),
      skill: await db.skills.toArray(),
      magick: await db.magicks.toArray(),
      characteristic: await db.characteristics.toArray()
    })
    desc += applyHelp(lore.desc, { typeItem: 'lore', label: lore.label }, labelMap)
  }

  // Get spells for this lore
  const spells = await db.spells
    .where('lore')
    .equals(loreId)
    .toArray()

  // If we have spells, create sections
  if (spells && spells.length > 0) {
    const result = { Info: desc }
    result['Sorts'] = '<b>Sorts du domaine: </b>' + toHtmlList(entitiesToSimpleArray(spells, true))
    return result
  }

  return desc
}

/**
 * Generate description for a Star
 *
 * Implements star.getDescription()
 * Includes star description with entity linking for astrological signs.
 *
 * @param {string} starId - Star ID
 * @returns {Promise<string>} HTML description
 *
 * @example
 * const desc = await generateStarDescription('gnuthus')
 * // Returns: "Description of Gnuthus the Ox..."
 */
export async function generateStarDescription(starId) {
  const star = await db.stars.get(starId)
  if (!star) return null

  let desc = ''

  // Description with entity linking
  if (star.desc) {
    const labelMap = await buildLabelMap({
      characteristic: await db.characteristics.toArray(),
      talent: await db.talents.toArray(),
      skill: await db.skills.toArray()
    })
    desc += applyHelp(star.desc, { typeItem: 'star', label: star.label }, labelMap)
  }

  return desc
}

/**
 * Generate description for an Etat (condition/status effect)
 *
 * Implements etat.getDescription()
 * Includes type and description with entity linking.
 *
 * @param {string} etatId - Etat ID
 * @returns {Promise<string>} HTML description
 *
 * @example
 * const desc = await generateEtatDescription('assomme')
 * // Returns: "Type: ...<br>Description of stunned condition..."
 */
export async function generateEtatDescription(etatId) {
  const etat = await db.etats.get(etatId)
  if (!etat) return null

  let desc = ''

  // Type
  if (etat.type) {
    desc += '<b>Type: </b>' + etat.type + '<br><br>'
  }

  // Description with entity linking
  if (etat.desc) {
    const labelMap = await buildLabelMap({
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray(),
      trait: await db.traits.toArray()
    })
    desc += applyHelp(etat.desc, { typeItem: 'etat', label: etat.label }, labelMap)
  }

  return desc
}

/**
 * Generate description for a Psychologie (mental condition/psychological trait)
 *
 * Implements psychologie.getDescription()
 * Includes type and description with entity linking.
 *
 * @param {string} psychologieId - Psychologie ID
 * @returns {Promise<string>} HTML description
 *
 * @example
 * const desc = await generatePsychologieDescription('animosite')
 * // Returns: "Type: ...<br>Description of animosity..."
 */
export async function generatePsychologieDescription(psychologieId) {
  const psychologie = await db.psychologies.get(psychologieId)
  if (!psychologie) return null

  let desc = ''

  // Type
  if (psychologie.type) {
    desc += '<b>Type: </b>' + psychologie.type + '<br><br>'
  }

  // Description with entity linking
  if (psychologie.desc) {
    const labelMap = await buildLabelMap({
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray(),
      trait: await db.traits.toArray()
    })
    desc += applyHelp(psychologie.desc, { typeItem: 'psychologie', label: psychologie.label }, labelMap)
  }

  return desc
}

/**
 * Generate description for any entity type
 *
 * Universal description generator that routes to the appropriate
 * type-specific generator based on entity type.
 *
 * @param {string} entityType - Entity type (career, talent, skill, etc.)
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object|string|null>} Generated description
 *
 * @example
 * const desc = await generateDescription('talent', 'combat')
 * const careerDesc = await generateDescription('career', 'artisan')
 */
export async function generateDescription(entityType, entityId) {
  switch (entityType) {
    case 'career':
      return await generateCareerDescription(entityId)
    case 'careerLevel':
      return await generateCareerLevelDescription(entityId)
    case 'talent':
      return await generateTalentDescription(entityId)
    case 'skill':
      return await generateSkillDescription(entityId)
    case 'spell':
      return await generateSpellDescription(entityId)
    case 'class':
      return await generateClassDescription(entityId)
    case 'specie':
    case 'species':
      return await generateSpeciesDescription(entityId)
    case 'trapping':
      return await generateTrappingDescription(entityId)
    default:
      // For other types, return basic description if available
      const entity = await db[entityType + 's']?.get(entityId)
      return entity?.desc || null
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core utilities
  applyHelp,
  buildLabelMap,
  showHelpText,
  showHelpTextFromElem,
  toHtmlList,
  rankToImg,
  entitiesToSimpleArray,

  // Description generators
  generateDescription,
  generateCareerDescription,
  generateCareerLevelDescription,
  generateTalentDescription,
  generateSkillDescription,
  generateSpellDescription,
  generateClassDescription,
  generateSpeciesDescription,
  generateTrappingDescription
}
