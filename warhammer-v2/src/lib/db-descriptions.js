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
  entitiesToLabels,
  resolveEntityReference
} from './db-relations.js'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @typedef {Object} EntityRef
 * @property {string} id - Entity ID
 * @property {string} type - Entity type (skill, talent, career, etc.)
 * @property {string} label - Display label
 */

/**
 * @typedef {Object} DescriptionSection
 * @property {string} type - Section type: 'text' | 'list' | 'link' | 'table' | 'rank' | 'stats'
 * @property {string} [label] - Section label (for list, table)
 * @property {string} [content] - Text content (for text type)
 * @property {Array<EntityRef|string>} [items] - List items (for list type)
 * @property {EntityRef} [entity] - Entity reference (for link type)
 * @property {Object} [stats] - Statistics data (for stats type)
 * @property {number} [rank] - Career rank 1-4 (for rank type)
 * @property {Array<Array<string>>} [rows] - Table rows (for table type)
 * @property {Array<string>} [headers] - Table headers (for table type)
 */

/**
 * @typedef {Object} DescriptionData
 * @property {Array<DescriptionSection>} sections - Array of description sections
 */

/**
 * @typedef {Object|string} DescriptionResult
 * Either a DescriptionData object with sections, or a simple string for backward compatibility
 */

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
 * @param {string} [tooltip] - Optional tooltip text for title attribute
 * @param {boolean} [broken=false] - Whether this is a broken reference
 * @returns {string} HTML link
 */
function showHelpText(text, id, type, tooltip = null, broken = false) {
  const brokenClass = broken ? ' broken' : ''
  const titleAttr = tooltip ? ` title="${tooltip}"` : ''
  return `<span class="showHelp${brokenClass}" data-type="${type}" data-id="${id}"${titleAttr}>${text}</span>`
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
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateTalentDescription('combat')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', label: 'Maxi', content: '5' },
 * //     { type: 'text', label: 'Tests', content: '...' },
 * //     { type: 'text', content: 'Description...' },
 * //     { type: 'list', label: 'Spécialisations', items: [...] },
 * //     { type: 'list', label: 'Carrières donnant accès', items: [...] }
 * //   ]
 * // }
 */
export async function generateTalentDescription(talentId) {
  const talent = await getTalentWithRelations(talentId)
  if (!talent) return null

  const sections = []

  // Max rank
  if (talent.max) {
    sections.push({
      type: 'text',
      label: 'Maxi',
      content: String(talent.max)
    })
  }

  // Tests
  if (talent.tests) {
    sections.push({
      type: 'text',
      label: 'Tests',
      content: talent.tests
    })
  }

  // Description with entity linking
  if (talent.desc) {
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
    const processedDesc = applyHelp(talent.desc, { typeItem: 'talent', label: talent.name }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  // Specializations
  if (talent.specs && talent.specs.length) {
    const specs = Array.isArray(talent.specs) ? talent.specs : talent.specs.split(', ')
    sections.push({
      type: 'list',
      label: 'Spécialisations',
      items: specs.map(spec => ({
        type: 'text',
        label: spec
      }))
    })
  }

  // Access information - Career levels
  const careerLevels = await findCareerLevelsByTalent(talentId)
  if (careerLevels && careerLevels.length > 0) {
    // Build career level items grouped by rank
    const careerItems = []
    for (const cl of careerLevels) {
      const career = await getCareerLevelCareer(cl.id)
      if (career) {
        careerItems.push({
          id: cl.id,
          type: 'careerLevel',
          label: career.name || career.label,
          rank: cl.level
        })
      }
    }

    if (careerItems.length > 0) {
      sections.push({
        type: 'list',
        label: 'Carrières donnant accès à ce talent',
        items: careerItems
      })
    }
  }

  // Handle special case for "magie mineure" talent
  if (talent.id === 'magie mineure') {
    const minorSpells = await db.spells
      .where('type')
      .equals('Magie mineure')
      .toArray()

    if (minorSpells && minorSpells.length > 0) {
      sections.push({
        type: 'list',
        label: 'Sorts uniques',
        items: minorSpells.map(spell => ({
          id: spell.id,
          type: 'spell',
          label: spell.name || spell.label
        }))
      })
    }
  }

  return { sections }
}

/**
 * Generate description for a Skill
 *
 * Implements skill.getDescription() from DataSkill.html
 * Includes characteristic, type (base/advanced), grouped status, description,
 * examples, specializations, and access information.
 *
 * @param {string} skillId - Skill ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateSkillDescription('athletisme')
 * // Returns: {
 * //   sections: [
 * //     { type: 'link', label: 'Attribut', entity: { id: 'ag', type: 'characteristic', label: 'Agilité' } },
 * //     { type: 'text', label: 'Type', content: 'de base, groupée' },
 * //     { type: 'text', content: 'Description...' },
 * //     { type: 'list', label: 'Spécialisations', items: [...] }
 * //   ]
 * // }
 */
export async function generateSkillDescription(skillId) {
  const skill = await getSkillWithCharacteristic(skillId)
  if (!skill) return null

  const sections = []

  // Characteristic
  if (skill.characteristicObj) {
    sections.push({
      type: 'link',
      label: 'Attribut',
      entity: {
        id: skill.characteristicObj.id,
        type: 'characteristic',
        label: getEntityLabel(skill.characteristicObj)
      }
    })
  }

  // Type and grouped status
  const type = skill.type || 'base'
  let typeText = (type === 'base' ? 'de ' : '') + type
  if (skill.specs && skill.specs.length) {
    typeText += ', groupée'
  }
  sections.push({
    type: 'text',
    label: 'Type',
    content: typeText
  })

  // Description with entity linking
  if (skill.desc) {
    let tmpDesc = skill.desc
    if (skill.example) {
      tmpDesc += '\n\nExemple: ' + skill.example
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
    const processedDesc = applyHelp(tmpDesc, { typeItem: 'skill', label: skill.name }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  // Specializations
  if (skill.specs && skill.specs.length) {
    const specs = Array.isArray(skill.specs) ? skill.specs : skill.specs.split(', ')
    sections.push({
      type: 'list',
      label: 'Spécialisations',
      items: specs.map(spec => ({
        type: 'text',
        label: spec
      }))
    })
  }

  // Access information - Career levels
  const careerLevels = await findCareerLevelsBySkill(skillId)
  if (careerLevels && careerLevels.length > 0) {
    const careerItems = []
    for (const cl of careerLevels) {
      const career = await getCareerLevelCareer(cl.id)
      if (career) {
        careerItems.push({
          id: cl.id,
          type: 'careerLevel',
          label: career.name || career.label,
          rank: cl.level
        })
      }
    }

    if (careerItems.length > 0) {
      sections.push({
        type: 'list',
        label: 'Carrières donnant accès à cette compétence',
        items: careerItems
      })
    }
  }

  // Talents
  const talents = await findTalentsBySkill(skillId)
  if (talents && talents.length > 0) {
    sections.push({
      type: 'list',
      label: 'Talents liés à cette compétence',
      items: talents.map(t => ({
        id: t.id,
        type: 'talent',
        label: t.name || t.label
      }))
    })
  }

  return { sections }
}

/**
 * Generate description for a Spell
 *
 * Implements spell.getDescription() from DataSpell.html
 * Includes talent requirement, casting number, range, target, duration,
 * description, and access information (lores and gods).
 *
 * @param {string} spellId - Spell ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateSpellDescription('boule-de-feu')
 * // Returns: {
 * //   sections: [
 * //     { type: 'link', label: 'Talent', entity: {...} },
 * //     { type: 'text', label: 'NI', content: '7' },
 * //     { type: 'text', label: 'Portée', content: '...' },
 * //     { type: 'text', content: 'Description...' }
 * //   ]
 * // }
 */
export async function generateSpellDescription(spellId) {
  const spell = await db.spells.get(spellId)
  if (!spell) return null

  const sections = []

  // Talent requirement
  if (spell.talent) {
    const talent = await db.talents.get(spell.talent)
    if (talent) {
      sections.push({
        type: 'link',
        label: 'Talent',
        entity: {
          id: talent.id,
          type: 'talent',
          label: getEntityLabel(talent)
        }
      })
    }
  }

  // Casting number
  if (spell.cn) {
    sections.push({
      type: 'text',
      label: 'NI',
      content: String(spell.cn)
    })
  }

  // Range, target, duration with entity linking
  const labelMap = await buildLabelMap({
    characteristic: await db.characteristics.toArray()
  })

  if (spell.range) {
    const processedRange = applyHelp(spell.range, { typeItem: 'spell', label: spell.name }, labelMap)
    sections.push({
      type: 'text',
      label: 'Portée',
      content: processedRange
    })
  }
  if (spell.target) {
    const processedTarget = applyHelp(spell.target, { typeItem: 'spell', label: spell.name }, labelMap)
    sections.push({
      type: 'text',
      label: 'Cible',
      content: processedTarget
    })
  }
  if (spell.duration) {
    const processedDuration = applyHelp(spell.duration, { typeItem: 'spell', label: spell.name }, labelMap)
    sections.push({
      type: 'text',
      label: 'Durée',
      content: processedDuration
    })
  }

  // Description
  if (spell.desc) {
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
    const processedDesc = applyHelp(spell.desc, { typeItem: 'spell', label: spell.name }, fullLabelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  // Access information - Lore access
  if (spell.lore) {
    const lore = await db.lores.get(spell.lore)
    if (lore) {
      sections.push({
        type: 'list',
        label: 'Domaines donnant accès à ce sort',
        items: [{
          id: lore.id,
          type: 'lore',
          label: lore.name || lore.label
        }]
      })
    }
  }

  // God access
  if (spell.god) {
    const god = await db.gods.get(spell.god)
    if (god) {
      sections.push({
        type: 'list',
        label: 'Dieux donnant accès à ce sort',
        items: [{
          id: god.id,
          type: 'god',
          label: god.name || god.label
        }]
      })
    }
  }

  return { sections }
}

/**
 * Generate description for a Class
 *
 * Implements class.getDescription() from DataClass.html
 * Includes class description, career options, and starting trappings.
 *
 * @param {string} classId - Class ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateClassDescription('rangers')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', content: 'Description...' },
 * //     { type: 'list', label: 'Options de Carrière', items: [...] },
 * //     { type: 'list', label: 'Possessions', items: [...] }
 * //   ]
 * // }
 */
export async function generateClassDescription(classId) {
  const classObj = await db.classes.get(classId)
  if (!classObj) return null

  const sections = []

  // Description
  if (classObj.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray()
    })
    const processedDesc = applyHelp(classObj.desc, { typeItem: 'class', label: classObj.name }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  // Career options
  const careers = await db.careers.where('class').equals(classId).toArray()
  if (careers && careers.length > 0) {
    sections.push({
      type: 'list',
      label: 'Options de Carrière',
      items: careers.map(c => ({
        id: c.id,
        type: 'career',
        label: c.name || c.label
      }))
    })
  }

  // Starting trappings
  if (classObj.trappings && classObj.trappings.length) {
    const trappings = await Promise.all(
      classObj.trappings.map(t => resolveEntityReference(t, db.trappings))
    )
    const validTrappings = trappings.filter(t => t)
    if (validTrappings.length > 0) {
      sections.push({
        type: 'list',
        label: 'Possessions',
        items: validTrappings.map(t => ({
          id: t.id,
          type: 'trapping',
          label: t.name || t.label
        }))
      })
    }
  }

  return { sections }
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
  if (species.skills && Array.isArray(species.skills) && species.skills.length) {
    const skills = await Promise.all(
      species.skills.map(s => resolveEntityReference(s, db.skills))
    )
    const validSkills = skills.filter(s => s)
    if (validSkills.length > 0) {
      skillsTalents += '<b>Compétences de race: </b>' + toHtmlList(entitiesToSimpleArray(validSkills, true))
    }
  }

  if (species.talents && Array.isArray(species.talents) && species.talents.length) {
    const talents = await Promise.all(
      species.talents.map(t => resolveEntityReference(t, db.talents))
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
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateTrappingDescription('epee-courte')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', label: 'Catégorie', content: 'melee' },
 * //     { type: 'text', label: 'Prix', content: '10 co' },
 * //     { type: 'text', label: 'Dégâts', content: '+7' },
 * //     { type: 'list', label: 'Atouts et Défauts', items: [...] },
 * //     { type: 'text', content: 'Description...' }
 * //   ]
 * // }
 */
export async function generateTrappingDescription(trappingId) {
  const trapping = await db.trappings.get(trappingId)
  if (!trapping) return null

  const sections = []
  const type = trapping.type || 'trapping'
  const isVehicle = type === 'vehicle'
  const isRanged = type === 'ranged' || type === 'ammunition'

  // Category
  sections.push({
    type: 'text',
    label: 'Catégorie',
    content: type
  })

  // Sub-type (weapon group)
  if (trapping.subType) {
    sections.push({
      type: 'text',
      label: 'Groupe d\'armes',
      content: trapping.subType
    })
  }

  // Basic stats
  if (trapping.price) {
    sections.push({
      type: 'text',
      label: 'Prix',
      content: trapping.price
    })
  }
  if (trapping.availability) {
    sections.push({
      type: 'text',
      label: 'Disponibilité',
      content: trapping.availability
    })
  }
  if (trapping.enc) {
    sections.push({
      type: 'text',
      label: 'Encombrement',
      content: String(trapping.enc)
    })
  }

  // Combat stats
  if (trapping.reach) {
    sections.push({
      type: 'text',
      label: isRanged ? 'Porté' : 'Allonge',
      content: trapping.reach
    })
  }
  if (trapping.damage) {
    sections.push({
      type: 'text',
      label: 'Dégâts',
      content: trapping.damage
    })
  }
  if (trapping.loc) {
    sections.push({
      type: 'text',
      label: 'Emplacements',
      content: trapping.loc
    })
  }
  if (trapping.pa) {
    sections.push({
      type: 'text',
      label: 'Points d\'armure',
      content: String(trapping.pa)
    })
  }
  if (trapping.carry) {
    sections.push({
      type: 'text',
      label: isVehicle ? 'Chargement' : 'Contenu',
      content: trapping.carry
    })
  }
  if (trapping.mode) {
    sections.push({
      type: 'text',
      label: 'Mode',
      content: trapping.mode
    })
  }
  if (trapping.toughness) {
    sections.push({
      type: 'text',
      label: 'Endurance',
      content: String(trapping.toughness)
    })
  }
  if (trapping.wounds) {
    sections.push({
      type: 'text',
      label: 'Blessures',
      content: String(trapping.wounds)
    })
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
      sections.push({
        type: 'list',
        label: 'Atouts et Défauts',
        items: validQualities.map(q => ({
          id: q.id,
          type: 'quality',
          label: q.name || q.label
        }))
      })
    }
  }

  // Description
  if (trapping.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray(),
      etat: await db.etats.toArray(),
      talent: await db.talents.toArray(),
      skill: await db.skills.toArray(),
      characteristic: await db.characteristics.toArray(),
      psychologie: await db.psychologies.toArray()
    })
    const processedDesc = applyHelp(trapping.desc, { typeItem: 'trapping', label: trapping.name }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for a Characteristic
 *
 * Implements characteristic.getDescription()
 * Includes abbreviation, type, and description with entity linking.
 *
 * @param {string} characteristicId - Characteristic ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateCharacteristicDescription('ws')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', label: 'Abréviation', content: 'CC' },
 * //     { type: 'text', label: 'Type', content: 'Combat' },
 * //     { type: 'text', content: 'Description...' }
 * //   ]
 * // }
 */
export async function generateCharacteristicDescription(characteristicId) {
  const characteristic = await db.characteristics.get(characteristicId)
  if (!characteristic) return null

  const sections = []

  // Abbreviation
  if (characteristic.abr) {
    sections.push({
      type: 'text',
      label: 'Abréviation',
      content: characteristic.abr
    })
  }

  // Type
  if (characteristic.type) {
    sections.push({
      type: 'text',
      label: 'Type',
      content: characteristic.type
    })
  }

  // Description
  if (characteristic.desc) {
    const labelMap = await buildLabelMap({
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      characteristic: await db.characteristics.toArray()
    })
    const processedDesc = applyHelp(characteristic.desc, { typeItem: 'characteristic', label: characteristic.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for a God
 *
 * Implements god.getDescription()
 * Includes god description with entity linking, and lists of blessings/miracles.
 *
 * @param {string} godId - God ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateGodDescription('sigmar')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', content: 'Description of Sigmar...' },
 * //     { type: 'list', label: 'Bénédictions', items: [...] },
 * //     { type: 'list', label: 'Miracles', items: [...] }
 * //   ]
 * // }
 */
export async function generateGodDescription(godId) {
  const god = await db.gods.get(godId)
  if (!god) return null

  const sections = []

  // Description with entity linking
  if (god.desc) {
    const labelMap = await buildLabelMap({
      lore: await db.lores.toArray(),
      god: await db.gods.toArray(),
      talent: await db.talents.toArray(),
      skill: await db.skills.toArray(),
      characteristic: await db.characteristics.toArray()
    })
    const processedDesc = applyHelp(god.desc, { typeItem: 'god', label: god.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  // Get blessings and miracles
  // Spells use type='Invocation' and spec='god label' (not god id)
  const allSpells = await db.spells.toArray()

  const blessings = allSpells.filter(spell =>
    (spell.type === 'Bénédiction' || spell.type === 'blessing') &&
    spell.spec === god.label
  )

  const miracles = allSpells.filter(spell =>
    (spell.type === 'Miracle' || spell.type === 'miracle') &&
    spell.spec === god.label
  )

  if (blessings && blessings.length > 0) {
    sections.push({
      type: 'list',
      label: 'Bénédictions',
      items: blessings.map(spell => ({
        id: spell.id,
        type: 'spell',
        label: spell.name || spell.label
      }))
    })
  }

  if (miracles && miracles.length > 0) {
    sections.push({
      type: 'list',
      label: 'Miracles',
      items: miracles.map(spell => ({
        id: spell.id,
        type: 'spell',
        label: spell.name || spell.label
      }))
    })
  }

  return { sections }
}

/**
 * Generate description for a Lore
 *
 * Implements lore.getDescription()
 * Includes lore description with entity linking, and list of spells.
 *
 * @param {string} loreId - Lore ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateLoreDescription('feu')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', content: 'Description of fire magic...' },
 * //     { type: 'list', label: 'Sorts du domaine', items: [...] }
 * //   ]
 * // }
 */
export async function generateLoreDescription(loreId) {
  const lore = await db.lores.get(loreId)
  if (!lore) return null

  const sections = []

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
    const processedDesc = applyHelp(lore.desc, { typeItem: 'lore', label: lore.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  // Get spells for this lore
  // Filter spells by lore field (not indexed)
  const allSpells = await db.spells.toArray()
  const spells = allSpells.filter(spell => spell.lore === loreId)

  if (spells && spells.length > 0) {
    sections.push({
      type: 'list',
      label: 'Sorts du domaine',
      items: spells.map(spell => ({
        id: spell.id,
        type: 'spell',
        label: spell.name || spell.label
      }))
    })
  }

  return { sections }
}

/**
 * Generate description for a Star
 *
 * Implements star.getDescription()
 * Includes star description with entity linking for astrological signs.
 *
 * @param {string} starId - Star ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateStarDescription('gnuthus')
 * // Returns: { sections: [{ type: 'text', content: 'Description of Gnuthus the Ox...' }] }
 */
export async function generateStarDescription(starId) {
  const star = await db.stars.get(starId)
  if (!star) return null

  const sections = []

  // Description with entity linking
  if (star.desc) {
    const labelMap = await buildLabelMap({
      book: await db.books.toArray(),
      career: await db.careers.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      spell: await db.spells.toArray(),
      creature: await db.creatures.toArray(),
      trait: await db.traits.toArray(),
      star: await db.stars.toArray()
    })
    const processedDesc = applyHelp(star.desc, { typeItem: 'star', label: star.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for an Etat (condition/status effect)
 *
 * Implements etat.getDescription()
 * Includes type and description with entity linking.
 *
 * @param {string} etatId - Etat ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateEtatDescription('assomme')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', label: 'Type', content: '...' },
 * //     { type: 'text', content: 'Description of stunned condition...' }
 * //   ]
 * // }
 */
export async function generateEtatDescription(etatId) {
  const etat = await db.etats.get(etatId)
  if (!etat) return null

  const sections = []

  // Type
  if (etat.type) {
    sections.push({
      type: 'text',
      label: 'Type',
      content: etat.type
    })
  }

  // Description with entity linking
  if (etat.desc) {
    const labelMap = await buildLabelMap({
      book: await db.books.toArray(),
      career: await db.careers.toArray(),
      specie: await db.species.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      spell: await db.spells.toArray(),
      creature: await db.creatures.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray(),
      trait: await db.traits.toArray()
    })
    const processedDesc = applyHelp(etat.desc, { typeItem: 'etat', label: etat.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for a Psychologie (mental condition/psychological trait)
 *
 * Implements psychologie.getDescription()
 * Includes type and description with entity linking.
 *
 * @param {string} psychologieId - Psychologie ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generatePsychologieDescription('animosite')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', label: 'Type', content: '...' },
 * //     { type: 'text', content: 'Description of animosity...' }
 * //   ]
 * // }
 */
export async function generatePsychologieDescription(psychologieId) {
  const psychologie = await db.psychologies.get(psychologieId)
  if (!psychologie) return null

  const sections = []

  // Type
  if (psychologie.type) {
    sections.push({
      type: 'text',
      label: 'Type',
      content: psychologie.type
    })
  }

  // Description with entity linking
  if (psychologie.desc) {
    const labelMap = await buildLabelMap({
      book: await db.books.toArray(),
      career: await db.careers.toArray(),
      specie: await db.species.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      spell: await db.spells.toArray(),
      creature: await db.creatures.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray(),
      trait: await db.traits.toArray()
    })
    const processedDesc = applyHelp(psychologie.desc, { typeItem: 'psychologie', label: psychologie.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for a Magick (magic domain/tradition)
 *
 * Implements magick.getDescription()
 * Includes type and description with entity linking.
 *
 * @param {string} magickId - Magick ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateMagickDescription('arcane')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', label: 'Type', content: '...' },
 * //     { type: 'text', content: 'Description of arcane magic...' }
 * //   ]
 * // }
 */
export async function generateMagickDescription(magickId) {
  const magick = await db.magicks.get(magickId)
  if (!magick) return null

  const sections = []

  // Type
  if (magick.type) {
    sections.push({
      type: 'text',
      label: 'Type',
      content: magick.type
    })
  }

  // Description with entity linking
  if (magick.desc) {
    const labelMap = await buildLabelMap({
      book: await db.books.toArray(),
      career: await db.careers.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      spell: await db.spells.toArray(),
      creature: await db.creatures.toArray(),
      lore: await db.lores.toArray(),
      magick: await db.magicks.toArray()
    })
    const processedDesc = applyHelp(magick.desc, { typeItem: 'magick', label: magick.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for a Quality (weapon/armor quality or flaw)
 *
 * Implements quality.getDescription()
 * Includes type and description with entity linking.
 *
 * @param {string} qualityId - Quality ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateQualityDescription('percutant')
 * // Returns: {
 * //   sections: [
 * //     { type: 'text', label: 'Type', content: 'atout' },
 * //     { type: 'text', content: 'Description of impact quality...' }
 * //   ]
 * // }
 */
export async function generateQualityDescription(qualityId) {
  const quality = await db.qualities.get(qualityId)
  if (!quality) return null

  const sections = []

  // Type
  if (quality.type) {
    sections.push({
      type: 'text',
      label: 'Type',
      content: quality.type
    })
  }

  // Description with entity linking
  if (quality.desc) {
    const labelMap = await buildLabelMap({
      book: await db.books.toArray(),
      career: await db.careers.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      spell: await db.spells.toArray(),
      creature: await db.creatures.toArray(),
      etat: await db.etats.toArray(),
      quality: await db.qualities.toArray(),
      trait: await db.traits.toArray(),
      trapping: await db.trappings.toArray()
    })
    const processedDesc = applyHelp(quality.desc, { typeItem: 'quality', label: quality.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for a Trait (creature trait or special ability)
 *
 * Implements trait.getDescription()
 * Includes description with entity linking. Traits can have complex descriptions
 * with ratings, modifiers, and references to other game mechanics.
 *
 * @param {string} traitId - Trait ID
 * @returns {Promise<DescriptionData>} Structured description data
 *
 * @example
 * const desc = await generateTraitDescription('arme-naturelle')
 * // Returns: { sections: [{ type: 'text', content: 'Description of natural weapons trait...' }] }
 */
export async function generateTraitDescription(traitId) {
  const trait = await db.traits.get(traitId)
  if (!trait) return null

  const sections = []

  // Description with entity linking
  if (trait.desc) {
    const labelMap = await buildLabelMap({
      book: await db.books.toArray(),
      career: await db.careers.toArray(),
      specie: await db.species.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      spell: await db.spells.toArray(),
      creature: await db.creatures.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray(),
      trait: await db.traits.toArray(),
      quality: await db.qualities.toArray()
    })
    const processedDesc = applyHelp(trait.desc, { typeItem: 'trait', label: trait.label }, labelMap)
    sections.push({
      type: 'text',
      content: processedDesc
    })
  }

  return { sections }
}

/**
 * Generate description for a Tree (folder hierarchy node)
 *
 * Implements tree.getDescription()
 * Shows folder information, parent folder, and lists child folders and entities.
 *
 * @param {string} treeId - Tree ID
 * @returns {Promise<Object|string>} Object with Info and Contents sections, or just Info string
 *
 * @example
 * const desc = await generateTreeDescription('carriere-guerriers')
 * // Returns: {
 * //   Info: "Type: carriere<br>Parent: ...",
 * //   Contenu: "Child folders and entities..."
 * // }
 */
export async function generateTreeDescription(treeId) {
  const tree = await db.trees.get(treeId)
  if (!tree) return null

  let desc = ''

  // Type
  if (tree.type) {
    desc += '<b>Type: </b>' + tree.type + '<br>'
  }

  // Parent folder
  if (tree.parent) {
    const parent = await db.trees.get(tree.parent)
    if (parent) {
      desc += '<b>Dossier parent: </b>' + showHelpTextFromElem({ ...parent, typeItem: 'tree' }) + '<br>'
    }
  }

  // Get child folders
  const childFolders = await db.trees
    .where('parent')
    .equals(treeId)
    .toArray()

  // Get entities in this folder based on type
  let entities = []
  if (tree.type) {
    const tableName = tree.type + 's'
    if (db[tableName]) {
      entities = await db[tableName]
        .where('folder')
        .equals(treeId)
        .toArray()
    }
  }

  // If we have children or entities, create sections
  if (childFolders.length > 0 || entities.length > 0) {
    const result = { Info: desc }
    let contentsDesc = ''

    if (childFolders.length > 0) {
      contentsDesc += '<b>Sous-dossiers: </b>'
      contentsDesc += toHtmlList(childFolders.map(f => showHelpTextFromElem({ ...f, typeItem: 'tree' })))
    }

    if (entities.length > 0) {
      contentsDesc += '<b>Éléments: </b>'
      contentsDesc += toHtmlList(entitiesToSimpleArray(entities.map(e => ({ ...e, typeItem: tree.type })), true))
    }

    if (contentsDesc) {
      result['Contenu'] = contentsDesc
    }

    return result
  }

  return desc
}

/**
 * Generate description for a Creature
 *
 * Implements creature.getDescription()
 * Most complex generator: includes characteristics, skills, talents, traits,
 * optional abilities, trappings, and spells.
 *
 * @param {string} creatureId - Creature ID
 * @returns {Promise<Object>} Object with multiple sections (Info, Stats, Capacités, etc.)
 *
 * @example
 * const desc = await generateCreatureDescription('goblin')
 * // Returns: {
 * //   Info: "Description...",
 * //   Stats: "Characteristics table...",
 * //   Capacités: "Skills, talents, traits...",
 * //   Sorts: "Spells if any...",
 * //   Équipement: "Trappings if any..."
 * // }
 */
export async function generateCreatureDescription(creatureId) {
  const creature = await db.creatures.get(creatureId)
  if (!creature) return null

  const result = {}

  // Basic description
  if (creature.desc) {
    const labelMap = await buildLabelMap({
      book: await db.books.toArray(),
      career: await db.careers.toArray(),
      specie: await db.species.toArray(),
      characteristic: await db.characteristics.toArray(),
      skill: await db.skills.toArray(),
      talent: await db.talents.toArray(),
      spell: await db.spells.toArray(),
      creature: await db.creatures.toArray(),
      trait: await db.traits.toArray(),
      etat: await db.etats.toArray(),
      psychologie: await db.psychologies.toArray()
    })
    result['Info'] = applyHelp(creature.desc, { typeItem: 'creature', label: creature.label }, labelMap)
  }

  // Characteristics
  if (creature.char) {
    let statsDesc = '<b>Caractéristiques:</b><br><table class="stats-table">'
    statsDesc += '<tr>'
    const charOrder = ['m', 'cc', 'ct', 'f', 'e', 'i', 'ag', 'dex', 'int', 'fm', 'soc']
    const charLabels = ['M', 'CC', 'CT', 'F', 'E', 'I', 'Ag', 'Dex', 'Int', 'FM', 'Soc']

    for (let i = 0; i < charOrder.length; i++) {
      statsDesc += '<th>' + charLabels[i] + '</th>'
    }
    statsDesc += '</tr><tr>'
    for (let i = 0; i < charOrder.length; i++) {
      const val = creature.char[charOrder[i]] || '-'
      statsDesc += '<td>' + val + '</td>'
    }
    statsDesc += '</tr></table><br>'

    // Additional stats
    if (creature.char.b) {
      statsDesc += '<b>Blessures: </b>' + creature.char.b + '<br>'
    }
    if (creature.char.bf) {
      statsDesc += '<b>Bonus de Force: </b>' + creature.char.bf + '<br>'
    }
    if (creature.char.be) {
      statsDesc += '<b>Bonus d\'Endurance: </b>' + creature.char.be + '<br>'
    }
    if (creature.char.pv) {
      statsDesc += '<b>Points de Vie: </b>' + creature.char.pv + '<br>'
    }

    result['Stats'] = statsDesc
  }

  // Skills, Talents, and Traits
  let abilitiesDesc = ''

  if (creature.skills && Array.isArray(creature.skills) && creature.skills.length > 0) {
    const skills = await Promise.all(
      creature.skills.map(s => {
        const id = typeof s === 'string' ? s : s.id
        return db.skills.get(id)
      })
    )
    const validSkills = skills.filter(s => s)
    if (validSkills.length > 0) {
      abilitiesDesc += '<b>Compétences: </b>' + toHtmlList(entitiesToSimpleArray(validSkills, true))
    }
  }

  if (creature.talents && Array.isArray(creature.talents) && creature.talents.length > 0) {
    const talents = await Promise.all(
      creature.talents.map(t => {
        const id = typeof t === 'string' ? t : t.id
        return db.talents.get(id)
      })
    )
    const validTalents = talents.filter(t => t)
    if (validTalents.length > 0) {
      abilitiesDesc += '<b>Talents: </b>' + toHtmlList(entitiesToSimpleArray(validTalents, true))
    }
  }

  if (creature.traits && Array.isArray(creature.traits) && creature.traits.length > 0) {
    const traits = await Promise.all(
      creature.traits.map(t => {
        const id = typeof t === 'string' ? t : t.id
        return db.traits.get(id)
      })
    )
    const validTraits = traits.filter(t => t)
    if (validTraits.length > 0) {
      abilitiesDesc += '<b>Traits: </b>' + toHtmlList(entitiesToSimpleArray(validTraits, true))
    }
  }

  if (creature.optionals && Array.isArray(creature.optionals) && creature.optionals.length > 0) {
    abilitiesDesc += '<b>Capacités optionnelles: </b><ul>'
    creature.optionals.forEach(opt => {
      abilitiesDesc += '<li>' + opt + '</li>'
    })
    abilitiesDesc += '</ul>'
  }

  if (abilitiesDesc) {
    result['Capacités'] = abilitiesDesc
  }

  // Spells - grouped by type and spec
  if (creature.spells && Array.isArray(creature.spells) && creature.spells.length > 0) {
    const spells = await Promise.all(
      creature.spells.map(s => {
        const id = typeof s === 'string' ? s : s.id
        return db.spells.get(id)
      })
    )
    const validSpells = spells.filter(s => s)

    if (validSpells.length > 0) {
      // Group spells by type and spec
      const spellsByGroupAndSpec = {}

      validSpells.forEach(spell => {
        const type = spell.type || 'Autre'
        const spec = spell.spec || ''

        if (!spellsByGroupAndSpec[type]) {
          spellsByGroupAndSpec[type] = {}
        }
        if (!spellsByGroupAndSpec[type][spec]) {
          spellsByGroupAndSpec[type][spec] = []
        }
        spellsByGroupAndSpec[type][spec].push(spell)
      })

      // Build HTML with grouped spells
      let spellsDesc = ''
      for (const [type, specGroups] of Object.entries(spellsByGroupAndSpec)) {
        for (const [spec, spellList] of Object.entries(specGroups)) {
          const groupLabel = type + (spec ? ' (' + spec + ')' : '')
          spellsDesc += '<b>' + groupLabel + ': </b>' + toHtmlList(entitiesToSimpleArray(spellList, true)) + '<br>'
        }
      }

      result['Sorts'] = spellsDesc
    }
  }

  // Trappings
  if (creature.trappings && Array.isArray(creature.trappings) && creature.trappings.length > 0) {
    const trappings = await Promise.all(
      creature.trappings.map(t => {
        const id = typeof t === 'string' ? t : t.id
        return db.trappings.get(id)
      })
    )
    const validTrappings = trappings.filter(t => t)
    if (validTrappings.length > 0) {
      result['Équipement'] = '<b>Possessions: </b>' + toHtmlList(entitiesToSimpleArray(validTrappings, true))
    }
  }

  return result
}

/**
 * Generate description for a Book (reference source book)
 *
 * Implements book.getDescription()
 * Lists all content from this source book organized by type.
 *
 * @param {string} bookId - Book ID
 * @returns {Promise<Object|string>} Object with Info and Content sections, or just Info string
 *
 * @example
 * const desc = await generateBookDescription('core-rulebook')
 * // Returns: {
 * //   Info: "Abbreviation: CRB<br>Language: FR...",
 * //   Contenu: "List of careers, talents, spells, etc. from this book..."
 * // }
 */
export async function generateBookDescription(bookId) {
  const book = await db.books.get(bookId)
  if (!book) return null

  let desc = ''

  // Abbreviation
  if (book.abr) {
    desc += '<b>Abréviation: </b>' + book.abr + '<br>'
  }

  // Language
  if (book.language) {
    desc += '<b>Langue: </b>' + book.language + '<br>'
  }

  // Description
  if (book.desc) {
    desc += '<br>' + book.desc
  }

  // Get content from this book across all entity types
  const contentTypes = [
    { table: 'careers', label: 'Carrières', type: 'career' },
    { table: 'talents', label: 'Talents', type: 'talent' },
    { table: 'skills', label: 'Compétences', type: 'skill' },
    { table: 'spells', label: 'Sorts', type: 'spell' },
    { table: 'trappings', label: 'Équipement', type: 'trapping' },
    { table: 'creatures', label: 'Créatures', type: 'creature' },
    { table: 'traits', label: 'Traits', type: 'trait' },
    { table: 'classes', label: 'Classes', type: 'class' },
    { table: 'species', label: 'Races', type: 'specie' },
    { table: 'gods', label: 'Dieux', type: 'god' },
    { table: 'lores', label: 'Domaines', type: 'lore' }
  ]

  let contentDesc = ''
  let hasContent = false

  for (const contentType of contentTypes) {
    const items = await db[contentType.table]
      .where('book')
      .equals(bookId)
      .toArray()

    if (items && items.length > 0) {
      hasContent = true
      contentDesc += '<b>' + contentType.label + ': </b>'
      contentDesc += toHtmlList(entitiesToSimpleArray(items.map(i => ({ ...i, typeItem: contentType.type })), true))
    }
  }

  if (hasContent) {
    return {
      Info: desc,
      Contenu: contentDesc
    }
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
    case 'characteristic':
      return await generateCharacteristicDescription(entityId)
    case 'god':
      return await generateGodDescription(entityId)
    case 'lore':
      return await generateLoreDescription(entityId)
    case 'star':
      return await generateStarDescription(entityId)
    case 'etat':
      return await generateEtatDescription(entityId)
    case 'psychologie':
      return await generatePsychologieDescription(entityId)
    case 'magick':
      return await generateMagickDescription(entityId)
    case 'quality':
      return await generateQualityDescription(entityId)
    case 'trait':
      return await generateTraitDescription(entityId)
    case 'tree':
      return await generateTreeDescription(entityId)
    case 'creature':
      return await generateCreatureDescription(entityId)
    case 'book':
      return await generateBookDescription(entityId)
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
  generateTrappingDescription,
  generateCharacteristicDescription,
  generateGodDescription,
  generateLoreDescription,
  generateStarDescription,
  generateEtatDescription,
  generatePsychologieDescription,
  generateMagickDescription,
  generateQualityDescription,
  generateTraitDescription,
  generateTreeDescription,
  generateCreatureDescription,
  generateBookDescription,

  // Tooltip and validation (Issue #40 Stream B)
  getEntitySummary,
  validateReferences,
  enhanceWithTooltips
}

// ============================================================================
// TOOLTIP AND VALIDATION SYSTEM (Stream B - Issue #40)
// ============================================================================

/**
 * Get database table name for entity type
 * Handles special pluralization cases and aliases
 *
 * @param {string} type - Entity type
 * @returns {string|null} Table name or null if unknown
 */
function getTableName(type) {
  const tableMap = {
    skill: 'skills',
    talent: 'talents',
    spell: 'spells',
    characteristic: 'characteristics',
    trait: 'traits',
    quality: 'qualities',
    trapping: 'trappings',
    career: 'careers',
    careerLevel: 'careerLevels',
    class: 'classes',
    specie: 'species',
    species: 'species',  // Alias
    lore: 'lores',
    god: 'gods',
    creature: 'creatures',
    etat: 'etats',
    psychologie: 'psychologies',
    magick: 'magicks',
    star: 'stars',
    tree: 'trees',
    book: 'books'
  }
  return tableMap[type] || null
}

/**
 * Get a 1-2 line summary for an entity to use in tooltips
 *
 * @param {string} type - Entity type (skill, talent, spell, etc.)
 * @param {string} id - Entity ID
 * @returns {Promise<string|null>} Summary text or null if not found
 *
 * @example
 * const summary = await getEntitySummary('skill', 'dodge')
 * // Returns: "Esquive - Compétence de base"
 */
export async function getEntitySummary(type, id) {
  if (!type || !id) return null

  try {
    const tableName = getTableName(type)

    if (!tableName || !db[tableName]) {
      return null
    }

    const entity = await db[tableName].get(id)
    if (!entity) return null

    const label = entity.label || entity.name || id

    // Generate context-appropriate summaries based on entity type
    switch (type) {
      case 'skill':
        if (entity.characteristic) {
          const char = await db.characteristics.get(entity.characteristic)
          const charLabel = char ? (char.abr || char.label) : entity.characteristic
          const skillType = entity.type || 'base'
          return `${label} - ${charLabel}, ${skillType}`
        }
        return `${label} - Compétence`

      case 'talent':
        if (entity.max) {
          return `${label} - Talent (Max: ${entity.max})`
        }
        return `${label} - Talent`

      case 'spell':
        if (entity.cn) {
          return `${label} - Sort (NI: ${entity.cn})`
        }
        return `${label} - Sort`

      case 'characteristic':
        if (entity.abr) {
          return `${label} (${entity.abr}) - Caractéristique`
        }
        return `${label} - Caractéristique`

      case 'trait':
        return `${label} - Trait`

      case 'quality':
        if (entity.type) {
          return `${label} - ${entity.type}`
        }
        return `${label} - Qualité`

      case 'trapping':
        if (entity.type) {
          return `${label} - ${entity.type}`
        }
        return `${label} - Équipement`

      case 'career':
        if (entity.class) {
          const classObj = await db.classes.get(entity.class)
          const classLabel = classObj ? classObj.label : entity.class
          return `${label} - Carrière (${classLabel})`
        }
        return `${label} - Carrière`

      case 'careerLevel':
        if (entity.career) {
          const career = await db.careers.get(entity.career)
          const careerLabel = career ? (career.label || career.name) : entity.career
          return `${label} - ${careerLabel} Niv.${entity.level || '?'}`
        }
        return `${label} - Niveau de carrière`

      case 'class':
        return `${label} - Classe`

      case 'specie':
      case 'species':
        return `${label} - Race`

      case 'lore':
        return `${label} - Domaine magique`

      case 'god':
        return `${label} - Divinité`

      case 'creature':
        return `${label} - Créature`

      case 'etat':
        return `${label} - État`

      case 'psychologie':
        return `${label} - Psychologie`

      case 'magick':
        return `${label} - Magie`

      case 'star':
        return `${label} - Signe astrologique`

      case 'tree':
        if (entity.type) {
          return `${label} - Dossier (${entity.type})`
        }
        return `${label} - Dossier`

      case 'book':
        if (entity.abr) {
          return `${label} (${entity.abr}) - Livre de règles`
        }
        return `${label} - Livre de règles`

      default:
        return `${label} - ${type}`
    }
  } catch (error) {
    console.warn(`Error generating summary for ${type}:${id}`, error)
    return null
  }
}

/**
 * Validate entity references in HTML content
 *
 * Checks if all entity references (showHelp spans) actually exist in the database.
 * Returns a report of valid and broken references.
 *
 * @param {string} html - HTML content to validate
 * @returns {Promise<Object>} Validation report with valid and broken references
 *
 * @example
 * const report = await validateReferences(description)
 * // Returns: {
 * //   valid: [{ type: 'skill', id: 'dodge', label: 'Dodge' }],
 * //   broken: [{ type: 'spell', id: 'invalid', label: 'Invalid Spell' }]
 * // }
 */
export async function validateReferences(html) {
  if (!html || typeof html !== 'string') {
    return { valid: [], broken: [] }
  }

  const valid = []
  const broken = []

  // Find all showHelp spans
  const spanRegex = /<span[^>]+class="showHelp"[^>]*>.*?<\/span>/gi
  const matches = html.match(spanRegex)

  if (!matches) {
    return { valid: [], broken: [] }
  }

  for (const match of matches) {
    // Extract data-type, data-id, and text content
    const typeMatch = match.match(/data-type="([^"]+)"/)
    const idMatch = match.match(/data-id="([^"]+)"/)
    const textMatch = match.match(/>([^<]+)</)

    if (!typeMatch || !idMatch || !textMatch) continue

    const type = typeMatch[1]
    const id = idMatch[1]
    const label = textMatch[1]

    // Check if entity exists
    try {
      const tableName = getTableName(type)

      if (!tableName || !db[tableName]) {
        broken.push({ type, id, label, reason: 'Unknown entity type' })
        continue
      }

      const entity = await db[tableName].get(id)

      if (entity) {
        valid.push({ type, id, label })
      } else {
        broken.push({ type, id, label, reason: 'Entity not found' })
      }
    } catch (error) {
      broken.push({ type, id, label, reason: error.message })
    }
  }

  return { valid, broken }
}

/**
 * Enhance HTML with tooltips for entity references
 *
 * Adds title attributes with entity summaries to showHelp spans.
 * Adds "broken" class to spans for entities that don't exist.
 *
 * @param {string} html - HTML content to enhance
 * @returns {Promise<string>} Enhanced HTML with tooltips and broken markers
 *
 * @example
 * const enhanced = await enhanceWithTooltips(description)
 * // Adds title="Esquive - Compétence de base" to skill spans
 */
export async function enhanceWithTooltips(html) {
  if (!html || typeof html !== 'string') {
    return html
  }

  // Find all showHelp spans
  const spanRegex = /<span[^>]+class="showHelp"[^>]*>.*?<\/span>/gi
  const matches = html.match(spanRegex)

  if (!matches) {
    return html
  }

  let enhancedHtml = html

  for (const match of matches) {
    // Skip if already has title attribute
    if (match.includes('title=')) {
      continue
    }

    // Extract data-type, data-id, and text content
    const typeMatch = match.match(/data-type="([^"]+)"/)
    const idMatch = match.match(/data-id="([^"]+)"/)

    if (!typeMatch || !idMatch) continue

    const type = typeMatch[1]
    const id = idMatch[1]

    // Check if entity exists and get summary
    try {
      const tableName = getTableName(type)

      if (!tableName || !db[tableName]) {
        // Unknown entity type - mark as broken
        const brokenMatch = match.replace('class="showHelp"', 'class="showHelp broken" title="Type d\'entité inconnu"')
        enhancedHtml = enhancedHtml.replace(match, brokenMatch)
        continue
      }

      const entity = await db[tableName].get(id)

      if (entity) {
        // Entity exists - add tooltip
        const summary = await getEntitySummary(type, id)
        if (summary) {
          const enhancedMatch = match.replace(/data-id="[^"]+"/,  `data-id="${id}" title="${summary}"`)
          enhancedHtml = enhancedHtml.replace(match, enhancedMatch)
        }
      } else {
        // Entity not found - mark as broken
        const brokenMatch = match.replace('class="showHelp"', 'class="showHelp broken" title="Référence introuvable"')
        enhancedHtml = enhancedHtml.replace(match, brokenMatch)
      }
    } catch (error) {
      console.warn(`Error enhancing tooltip for ${type}:${id}`, error)
      // Mark as broken on error
      const brokenMatch = match.replace('class="showHelp"', `class="showHelp broken" title="Erreur: ${error.message}"`)
      enhancedHtml = enhancedHtml.replace(match, brokenMatch)
    }
  }

  return enhancedHtml
}
