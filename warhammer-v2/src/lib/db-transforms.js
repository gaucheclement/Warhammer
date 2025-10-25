/**
 * Data Transformation Layer
 *
 * This module provides transformation and parsing utilities for Warhammer Fantasy 4e data.
 * Ported from DataHelper.html and DataFunctions.html.
 *
 * Key Features:
 * - String parsing into structured elements (stringToElems)
 * - Data binding (resolving ID strings to object references)
 * - Spec handling (splitting "spec1, spec2" into arrays)
 * - Type-specific transformations (careers, talents, skills, spells, etc.)
 * - Label generation for display
 *
 * @module db-transforms
 */

import { db } from './db.js'

/**
 * Converts an ID-able string to a normalized ID
 * @param {string} str - String to convert
 * @returns {string} Normalized ID
 */
export function toId(str) {
  if (!str) return ''
  return str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
}

/**
 * Creates an empty element structure
 * @param {string} text - Label text
 * @param {Array<string>} specs - Specializations array
 * @param {string} suffix - Numeric suffix (e.g., "2" for "+2")
 * @param {string} prefix - Numeric prefix
 * @returns {Object} Element structure
 */
export function createElem(text = '', specs = [], suffix = '', prefix = '') {
  const ret = {
    specs: specs || [],
    prefix: prefix || '',
    suffix: suffix || '',
    label: text || '',
    original: ''
  }

  if (ret.label) {
    ret.original = getLabelForElem(ret)
  }

  return ret
}

/**
 * Generates display label for an element
 * Supports specs (array or string), suffix, and prefix
 * @param {Object} elem - Element to format
 * @returns {string} Formatted label
 */
export function getLabelForElem(elem) {
  if (!elem) return ''

  const suffix = elem.suffix ? elem.suffix + ' ' : ''
  const label = elem.label || ''
  let spec = ''

  // Handle specs as array
  if (Array.isArray(elem.specs) && elem.specs.length > 0) {
    spec = ' (' + elem.specs.join(' ou ') + ')'
  }
  // Handle specs as string (legacy format)
  else if (typeof elem.specs === 'string' && elem.specs !== '') {
    spec = ' (' + elem.specs + ')'
  }
  // Handle single spec
  else if (elem.spec && elem.spec !== '' && elem.spec !== null && elem.spec !== 'undefined') {
    spec = ' (' + elem.spec + ')'
  }

  const prefix = elem.prefix ? ' ' + elem.prefix : ''

  return suffix + label + spec + prefix
}

/**
 * Generates display label for a data object (from database)
 * @param {Object} data - Data object
 * @returns {string} Formatted label
 */
export function getLabelForData(data) {
  if (!data) return ''

  let label = data.label || ''

  if (data.suffix) {
    label = data.suffix + ' ' + label
  }

  if (data.prefix) {
    label = label + ' ' + data.prefix
  }

  if (data.title) {
    label = label + ' - ' + data.title
  }

  let spec = ''
  if (data.specName) {
    spec = data.specName
  } else if (data.extra) {
    spec = data.extra
  } else if (data.abr) {
    spec = data.abr
  }

  spec = spec ? ' (' + spec + ')' : ''

  return label + spec
}

/**
 * Parses a complex string into structured elements
 * Handles patterns like:
 * - "Talent (Spec1 ou Spec2)"
 * - "Talent1, Talent2"
 * - "+2 Talent" or "Talent +2"
 * - "Talent1 ou Talent2"
 *
 * @param {Object} dbContext - Database context with all tables
 * @param {string} string - String to parse
 * @param {Object} from - Source object (for origin tracking)
 * @param {string} type - Type of element (talent, skill, spell, etc.)
 * @param {boolean} one - If true, return single element instead of array
 * @returns {Object|Array} Parsed element(s)
 */
export async function stringToElems(dbContext, string, from = null, type = '', one = false) {
  if (!string || string.trim() === '') {
    return one ? '' : []
  }

  // Split by operators while preserving them
  // Pattern: numbers with modifiers, " ou ", ", ", parentheses
  const elems = string.split(/([+|-]?\d+[d\-+\d]*| ou |, | \(|\))/g)

  let elem = createElem()
  let modeText = 'label' // What we're currently parsing: 'label', 'specs'
  let modeAffix = 'suffix' // Which affix we're adding: 'suffix' or 'prefix'
  const result = []
  let res = []
  let specIndex = 0

  for (let index = 0; index < elems.length; ++index) {
    const original = elems[index]
    const e = original.trim()

    // Preserve original for reconstruction
    if (!((e === 'ou' || e === ',') && modeText === 'label')) {
      elem.original += original
    }

    if (e === '') {
      // Skip empty
    } else if (e === '(') {
      modeText = 'specs'
    } else if (e === ')') {
      modeText = 'label'
    } else if (!isNaN(parseInt(e)) && modeText === 'label') {
      // Numeric suffix/prefix
      elem[modeAffix] = e
    } else if (!isNaN(parseInt(e)) && elem[modeText][specIndex] !== undefined) {
      // Numeric in spec context
      elem[modeAffix] = e
    } else if ((e === 'ou' || e === ',') && modeText === 'label') {
      // End of element
      await bindElem(dbContext, elem, from, type)

      if (e === 'ou' || res.length > 0) {
        res.push(elem)
      } else {
        res = elem
      }

      if (e === ',') {
        result.push(res)
        res = []
      }

      elem = createElem()
      modeAffix = 'suffix'
      specIndex = 0
    } else if (e === 'ou' && modeText === 'specs') {
      ++specIndex
    } else if (e === ',' && modeText === 'specs') {
      // Comma within specs - ignore
    } else if (modeText === 'specs') {
      // Add to spec
      if (elem[modeText][specIndex] === undefined) {
        elem[modeText][specIndex] = e
      } else {
        elem[modeText][specIndex] += ' ' + e
      }
    } else if (modeText === 'label') {
      // Main label
      elem[modeText] = e
      modeAffix = 'prefix' // Switch to prefix for subsequent numbers
    }
  }

  // Handle last element
  await bindElem(dbContext, elem, from, type)

  if (one) {
    return elem
  }

  if (res.length > 0) {
    res.push(elem)
  } else {
    res = elem
  }
  result.push(res)

  return result
}

/**
 * Binds an element to actual database data
 * Resolves label to ID and looks up in database
 * @param {Object} dbContext - Database context
 * @param {Object} elem - Element to bind
 * @param {Object} from - Source object
 * @param {string} type - Type of element
 * @returns {Promise<Object>} Bound element
 */
export async function bindElem(dbContext, elem, from = null, type = '') {
  await formatComplexElem(dbContext, elem, type, from)
  return elem
}

/**
 * Formats a complex element and resolves it to database data
 * @param {Object} dbContext - Database context
 * @param {Object} elem - Element to format
 * @param {string} type - Type of element (skill, talent, spell, etc.)
 * @param {Object} from - Source object
 * @returns {Promise<Object>} Formatted element
 */
export async function formatComplexElem(dbContext, elem, type, from = null) {
  const label = elem.label
  elem.typeItem = type

  if (from) {
    elem.origins = [from.id]
    if (from.id && from.id.split('|').length > 1) {
      elem.origins.push(from.id.split('|')[1])
    }
  }

  // Try to find matching data in database
  const test = []
  let spec = ''

  if (elem.specs.length === 1) {
    spec = elem.specs[0]
    if (spec && spec !== 'Au choix') {
      test.push(label + ' (' + spec + ')')
    } else {
      spec = ''
    }
  }
  test.push(label)

  // Look up in database
  let data = null
  const tableName = type === 'characteristic' ? 'characteristics' :
                    type === 'class' ? 'classes' :
                    type + 's' // Most tables are plural

  if (dbContext[tableName]) {
    for (const testLabel of test) {
      const id = toId(testLabel)
      data = await dbContext[tableName].get(id)
      if (data) break
    }
  }

  // Set up helper methods
  elem.getLabel = getLabelForElem
  elem.getData = () => elem.data || elem

  if (!data) {
    elem.spec = spec
    if (elem.typeItem !== 'trapping') {
      console.warn('formatComplexElem: Could not find ' + type + ' with label:', label)
    }
    return elem
  }

  // Bind to data
  if (spec && (!data.specName || spec !== data.specName)) {
    elem.spec = spec
    elem.specs = [spec]
  } else {
    elem.spec = ''
    elem.specs = []
  }

  elem.id = data.id
  elem.data = data

  return elem
}

/**
 * Parses specs field (comma-separated string) into array
 * @param {string} specs - Specs string like "Savoir, Métier"
 * @returns {Array<string>} Array of specs
 */
export function parseSpecs(specs) {
  if (!specs || specs === '') return []
  if (Array.isArray(specs)) return specs
  return specs.split(', ').map(s => s.trim()).filter(s => s !== '')
}

/**
 * Type-specific transformation for careers
 * @param {Object} dbContext - Database context
 * @param {Object} career - Career data
 * @returns {Promise<Object>} Transformed career
 */
export async function transformCareer(dbContext, career) {
  if (!career) return career

  // Parse class reference
  if (career.class && typeof career.class === 'string') {
    const classElem = await stringToElems(dbContext, career.class, career, 'class', true)
    career.classData = classElem.data || null
  }

  return career
}

/**
 * Type-specific transformation for talents
 * @param {Object} dbContext - Database context
 * @param {Object} talent - Talent data
 * @returns {Promise<Object>} Transformed talent
 */
export async function transformTalent(dbContext, talent) {
  if (!talent) return talent

  // Parse specs
  talent.specs = parseSpecs(talent.specs)
  talent.spec = ''
  talent.origins = []
  talent.canHaveSpec = talent.specs.length > 0

  // Parse addSkill reference
  if (talent.addSkill) {
    const skillElem = await stringToElems(dbContext, talent.addSkill, talent, 'skill', true)
    talent.addSkillData = skillElem.data || null
  }

  // Parse addTalent reference
  if (talent.addTalent) {
    const talentElem = await stringToElems(dbContext, talent.addTalent, talent, 'talent', true)
    talent.addTalentData = talentElem.data || null
  }

  return talent
}

/**
 * Type-specific transformation for skills
 * @param {Object} dbContext - Database context
 * @param {Object} skill - Skill data
 * @returns {Promise<Object>} Transformed skill
 */
export async function transformSkill(dbContext, skill) {
  if (!skill) return skill

  // Parse specs
  skill.specs = parseSpecs(skill.specs)
  skill.specName = skill.specs.length > 0 ? 'Au choix' : ''
  skill.spec = ''
  skill.origins = []
  skill.canHaveSpec = skill.specs.length > 0

  // Parse characteristic reference
  if (skill.characteristic && typeof skill.characteristic === 'string') {
    const charElem = await stringToElems(dbContext, skill.characteristic, skill, 'characteristic', true)
    skill.characteristicData = charElem.data || null
  }

  return skill
}

/**
 * Type-specific transformation for spells
 * @param {Object} dbContext - Database context
 * @param {Object} spell - Spell data
 * @returns {Promise<Object>} Transformed spell
 */
export async function transformSpell(dbContext, spell) {
  if (!spell) return spell

  // Determine if it's a spell or miracle
  if (spell.type) {
    spell.canHaveSpec = true

    if (['Magie des Arcanes', 'Magie du Chaos', 'Magie mineure'].includes(spell.type)) {
      spell.labelItem = 'Sort'
    } else if (spell.type === 'Invocation') {
      spell.labelItem = 'Miracle'
    }
  }

  // Parse talent reference from type + subType
  if (spell.type) {
    const subType = spell.subType ? [spell.subType] : []
    const elem = createElem(spell.type, subType)
    const talentElem = await bindElem(dbContext, elem, spell, 'talent')
    spell.talentData = talentElem.data || null
  }

  return spell
}

/**
 * Type-specific transformation for career levels
 * @param {Object} dbContext - Database context
 * @param {Object} careerLevel - Career level data
 * @returns {Promise<Object>} Transformed career level
 */
export async function transformCareerLevel(dbContext, careerLevel) {
  if (!careerLevel) return careerLevel

  // Parse career reference
  if (careerLevel.career && typeof careerLevel.career === 'string') {
    const careerData = await dbContext.careers.get(careerLevel.career)
    careerLevel.careerData = careerData || null
  }

  return careerLevel
}

/**
 * Master transform function that routes to type-specific transformers
 * @param {Object} dbContext - Database context (db object)
 * @param {Object} data - Data to transform
 * @param {string} type - Type of data
 * @returns {Promise<Object>} Transformed data
 */
export async function transform(dbContext, data, type) {
  if (!data) return data

  switch (type) {
    case 'career':
      return await transformCareer(dbContext, data)
    case 'talent':
      return await transformTalent(dbContext, data)
    case 'skill':
      return await transformSkill(dbContext, data)
    case 'spell':
      return await transformSpell(dbContext, data)
    case 'careerLevel':
      return await transformCareerLevel(dbContext, data)
    default:
      return data
  }
}

/**
 * Validates transformed data
 * @param {Object} data - Data to validate
 * @param {string} type - Type of data
 * @returns {Object} Validation result with { valid: boolean, errors: Array<string> }
 */
export function validate(data, type) {
  const errors = []

  if (!data) {
    errors.push('Data is null or undefined')
    return { valid: false, errors }
  }

  // Common validations
  if (!data.id) {
    errors.push('Missing required field: id')
  }

  if (!data.label) {
    errors.push('Missing required field: label')
  }

  // Type-specific validations
  switch (type) {
    case 'career':
      if (!data.class) {
        errors.push('Career missing required field: class')
      }
      break

    case 'talent':
      if (data.specs && !Array.isArray(data.specs)) {
        errors.push('Talent specs must be an array')
      }
      break

    case 'skill':
      if (!data.characteristic) {
        errors.push('Skill missing required field: characteristic')
      }
      if (data.specs && !Array.isArray(data.specs)) {
        errors.push('Skill specs must be an array')
      }
      break

    case 'spell':
      if (!data.cn && data.type !== 'Invocation') {
        errors.push('Spell missing required field: cn')
      }
      break

    case 'careerLevel':
      if (!data.career) {
        errors.push('CareerLevel missing required field: career')
      }
      if (!data.careerLevel && data.careerLevel !== 0) {
        errors.push('CareerLevel missing required field: careerLevel')
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Iterates over elements/arrays and applies a function
 * @param {Array|Object} elems - Elements to iterate
 * @param {Function} func - Function to apply (el, i, y, isArray)
 */
export function eachElem(elems, func) {
  if (!elems) return

  for (let i = 0; i < elems.length; ++i) {
    const elem = elems[i]
    let y = 0

    if (Array.isArray(elem)) {
      for (; y < elem.length; ++y) {
        const el = elem[y]
        func(el, i, y, true)
      }
    } else {
      func(elem, i, y, false)
    }
  }
}

/**
 * Flattens a hierarchical tree structure iteratively
 * @param {Object} obj - Root object with children property
 * @param {Function} condition - Optional filter condition
 * @returns {Array} Flattened array with level property
 */
export function flattenElemIteratively(obj, condition = null) {
  const result = []
  const stack = [{ node: obj, level: 0 }]

  while (stack.length > 0) {
    const { node, level } = stack.shift()

    if (condition && !condition(node)) {
      continue
    }

    // Add node to result with level
    const tmp = { ...node, level }
    result.push(tmp)

    // Add children to stack
    if (node.children && node.children.length > 0) {
      const childEntries = node.children.map(child => ({
        node: child,
        level: level + 1
      }))
      stack.unshift(...childEntries)
    }
  }

  return result
}

export default {
  toId,
  createElem,
  getLabelForElem,
  getLabelForData,
  stringToElems,
  bindElem,
  formatComplexElem,
  parseSpecs,
  transformCareer,
  transformTalent,
  transformSkill,
  transformSpell,
  transformCareerLevel,
  transform,
  validate,
  eachElem,
  flattenElemIteratively
}
