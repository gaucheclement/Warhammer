/**
 * IndexedDB Schema Definition using Dexie.js
 *
 * This file defines the database schema for all 23 entity types
 * from the Warhammer Fantasy 4e data.
 */

import Dexie from 'dexie'

export const db = new Dexie('WarhammerDB')

// Define schema version 1
db.version(1).stores({
  // Core game data (23 tables)
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
    .filter(item => item.name && item.name.toLowerCase().includes(searchLower))
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
