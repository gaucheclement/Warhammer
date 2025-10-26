/**
 * IndexedDB Schema Definition using Dexie.js
 *
 * This file defines the database schema for all 23 entity types
 * from the Warhammer Fantasy 4e data.
 *
 * SCHEMA CHANGELOG:
 * v1 - Initial minimal schema
 * v2 - Enhanced schema with all fields from Data*.html files
 *      - Added missing fields (desc, book, page, specs, etc.)
 *      - Added compound indexes for relationships
 *      - Added multi-entry indexes for array fields
 */

import Dexie from 'dexie'

export const db = new Dexie('WarhammerDB')

// Schema version 1 (minimal, deprecated)
db.version(1).stores({
  books: 'id, name, abbreviation',
  careers: 'id, name, class, species, status',
  careerLevels: 'id, name, career, level',
  species: 'id, name',
  classes: 'id, name',
  talents: 'id, name, maxRank, tests',
  characteristics: 'id, name, abbreviation',
  trappings: 'id, name, type, encumbrance',
  skills: 'id, name, characteristic, type, advanced',
  spells: 'id, name, cn, range, target, duration',
  creatures: 'id, name, type',
  stars: 'id, name',
  gods: 'id, name, domains',
  eyes: 'id, description',
  hairs: 'id, description',
  details: 'id, description, type',
  traits: 'id, name, type',
  lores: 'id, name, type',
  magicks: 'id, name, type',
  etats: 'id, name, type',
  psychologies: 'id, name, type',
  qualities: 'id, name, type',
  trees: 'id, name, type',
  characters: '++id, name, species, career, created, updated',
  settings: 'key'
})

// Schema version 2 (enhanced with full field support)
db.version(2).stores({
  // BOOKS - Source books and references
  // Fields: id, label, abr, language, folder, desc
  books: 'id, label, abr, language, folder',

  // CAREERS - Character careers/professions
  // Fields: id, label, class, rand (object), subRand, book, page, desc, folder
  // Relationships: class -> classes, species via rand object keys
  careers: 'id, label, class, book, page, folder',

  // CAREER LEVELS - Progression levels within careers
  // Fields: id, label, career, careerLevel, status, book, page, folder
  // Relationships: career -> careers, skills, talents, characteristics, trappings
  // Compound index allows efficient queries like: where('[career+careerLevel]').equals([careerId, 1])
  careerLevels: 'id, label, [career+careerLevel], career, careerLevel, status, book, page, folder',

  // SPECIES - Character races
  // Fields: id, label, refCareer, refDetail, refChar, book, page, desc, folder
  // Relationships: skills, talents via arrays
  species: 'id, label, refCareer, refDetail, refChar, book, page, folder',

  // CLASSES - Career classes (Social Status groups)
  // Fields: id, label, book, page, desc, folder
  // Relationships: trappings (starting possessions)
  classes: 'id, label, book, page, folder',

  // TALENTS - Character talents and abilities
  // Fields: id, label, max, test, specs (array), addSkill, addTalent, book, page, desc, folder
  // Multi-entry index (*specs) allows queries on individual spec values in the array
  talents: 'id, label, max, test, *specs, addSkill, addTalent, book, page, folder',

  // CHARACTERISTICS - Character attributes (M, WS, BS, S, T, I, Ag, Dex, Int, WP, Fel)
  // Fields: id, label, abr, type, rand (object), book, page, desc, folder
  characteristics: 'id, label, abr, type, book, page, folder',

  // TRAPPINGS - Equipment, weapons, armor, and items
  // Fields: id, label, type, subType, gold, silver, bronze, availability, enc,
  //         reach, damage, loc, pa, carry, mode, toughness, wounds, book, page, desc, folder
  // Relationships: qualities (weapon/armor qualities)
  trappings: 'id, label, type, subType, availability, book, page, folder',

  // SKILLS - Character skills and competencies
  // Fields: id, label, characteristic, type, advanced, specs (array), example, book, page, desc, folder
  // Relationships: characteristic -> characteristics
  skills: 'id, label, characteristic, type, advanced, *specs, book, page, folder',

  // SPELLS - Magic spells and prayers
  // Fields: id, label, type, subType, cn, range, target, duration, book, page, desc, folder
  // Relationships: talent (magic talent granting access)
  spells: 'id, label, type, subType, cn, range, target, duration, book, page, folder',

  // CREATURES - NPCs and monsters
  // Fields: id, label, folder, char (object), book, page, desc
  // Relationships: skills, talents, traits, optionals, trappings, spells (all arrays)
  creatures: 'id, label, folder, book, page',

  // STARS - Astrological signs for character generation
  // Fields: id, label, book, page, desc, folder
  stars: 'id, label, book, page, folder',

  // GODS - Deities and divine powers
  // Fields: id, label, book, page, desc, folder
  // Relationships: blessings, miracles -> spells
  gods: 'id, label, book, page, folder',

  // EYES - Eye color options for character generation
  // Fields: id, label (object with language keys), rand
  eyes: 'id, rand',

  // HAIRS - Hair color options for character generation
  // Fields: id, label (object with language keys), rand
  hairs: 'id, rand',

  // DETAILS - Physical details for character generation
  // Fields: id, label, desc (object or string), allDesc, type
  details: 'id, label, type',

  // TRAITS - Creature traits and special abilities
  // Fields: id, label, suffix, prefix, book, page, desc, folder
  traits: 'id, label, book, page, folder',

  // LORES - Magic lore traditions
  // Fields: id, label, suffix, parent, book, page, desc, folder
  lores: 'id, label, suffix, parent, book, page, folder',

  // MAGICKS - Magic domains/traditions (arcane, chaos, etc.)
  // Fields: id, label, type, book, page, desc, folder
  magicks: 'id, label, type, book, page, folder',

  // ETATS - Conditions and status effects
  // Fields: id, label, type, book, page, desc, folder
  etats: 'id, label, type, book, page, folder',

  // PSYCHOLOGIES - Mental conditions and psychological traits
  // Fields: id, label, type, book, page, desc, folder
  psychologies: 'id, label, type, book, page, folder',

  // QUALITIES - Weapon and armor qualities
  // Fields: id, label, type, book, page, desc, folder
  qualities: 'id, label, type, book, page, folder',

  // TREES - Folder hierarchy for organizing data
  // Fields: id, label, type, folder, parent
  trees: 'id, label, type, folder, parent',

  // User data
  characters: '++id, name, species, career, created, updated',
  settings: 'key'
})

/**
 * Helper function to get all data from a table
 * @param {string} tableName - Name of the table
 * @returns {Promise<Array>} Array of records
 */
export async function getAllFromTable(tableName) {
  return await db[tableName].toArray()
}

/**
 * Helper function to search in a table by name
 * @param {string} tableName - Name of the table
 * @param {string} searchTerm - Term to search for
 * @returns {Promise<Array>} Array of matching records
 */
export async function searchByName(tableName, searchTerm) {
  const searchLower = searchTerm.toLowerCase()
  return await db[tableName]
    .filter(item => item.label && item.label.toLowerCase().includes(searchLower))
    .toArray()
}

/**
 * Helper function to get a record by ID
 * @param {string} tableName - Name of the table
 * @param {string|number} id - ID of the record
 * @returns {Promise<Object|undefined>} The record or undefined
 */
export async function getById(tableName, id) {
  return await db[tableName].get(id)
}

/**
 * Helper function to clear all data from a table
 * @param {string} tableName - Name of the table
 * @returns {Promise<void>}
 */
export async function clearTable(tableName) {
  await db[tableName].clear()
}

/**
 * Helper function to bulk add data to a table
 * @param {string} tableName - Name of the table
 * @param {Array} data - Array of records to add
 * @returns {Promise<void>}
 */
export async function bulkAdd(tableName, data) {
  if (data && Array.isArray(data) && data.length > 0) {
    await db[tableName].bulkAdd(data)
  }
}

/**
 * Get database statistics
 * @returns {Promise<Object>} Object with counts for each table
 */
export async function getDbStats() {
  const tables = [
    'books', 'careers', 'careerLevels', 'species', 'classes',
    'talents', 'characteristics', 'trappings', 'skills', 'spells',
    'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
    'traits', 'lores', 'magicks', 'etats', 'psychologies',
    'qualities', 'trees', 'characters'
  ]

  const stats = {}
  for (const table of tables) {
    stats[table] = await db[table].count()
  }

  return stats
}

export default db
