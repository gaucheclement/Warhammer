/**
 * Data Initialization Logic
 *
 * This module handles loading embedded JSON data into IndexedDB
 * on first run, and checking if data is already initialized.
 */

import { db, bulkAdd, getDbStats } from './db.js'

const INIT_FLAG_KEY = 'warhammer_data_initialized'
const DATA_VERSION_KEY = 'warhammer_data_version'
const CURRENT_DATA_VERSION = '1.0.0'

/**
 * Check if the database has been initialized
 * @returns {boolean} True if data is already loaded
 */
export function isDataInitialized() {
  const flag = localStorage.getItem(INIT_FLAG_KEY)
  const version = localStorage.getItem(DATA_VERSION_KEY)
  return flag === 'true' && version === CURRENT_DATA_VERSION
}

/**
 * Mark the database as initialized
 */
function markAsInitialized() {
  localStorage.setItem(INIT_FLAG_KEY, 'true')
  localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION)
}

/**
 * Clear the initialization flag (for forced reload)
 */
export function clearInitFlag() {
  localStorage.removeItem(INIT_FLAG_KEY)
  localStorage.removeItem(DATA_VERSION_KEY)
}

/**
 * Get the embedded data from the global window object
 * @returns {Object|null} The embedded data or null if not found
 */
function getEmbeddedData() {
  if (typeof window !== 'undefined' && window.__WARHAMMER_DATA__) {
    return window.__WARHAMMER_DATA__
  }
  console.error('No embedded data found in window.__WARHAMMER_DATA__')
  return null
}

/**
 * Load data into a specific table
 * @param {string} tableName - Name of the table
 * @param {Array} data - Data to load
 * @returns {Promise<number>} Number of records loaded
 */
async function loadTableData(tableName, data) {
  if (!data || !Array.isArray(data)) {
    console.warn(`No data found for table: ${tableName}`)
    return 0
  }

  try {
    await bulkAdd(tableName, data)
    return data.length
  } catch (error) {
    console.error(`Error loading data into ${tableName}:`, error)
    throw error
  }
}

/**
 * Initialize the database with embedded data
 * @returns {Promise<Object>} Object with initialization results
 */
export async function initializeDatabase() {
  console.log('Starting database initialization...')

  // Check if already initialized
  if (isDataInitialized()) {
    console.log('Database already initialized')
    const stats = await getDbStats()
    return {
      success: true,
      alreadyInitialized: true,
      stats
    }
  }

  try {
    // Get embedded data
    const embeddedData = getEmbeddedData()
    if (!embeddedData) {
      throw new Error('No embedded data available')
    }

    // Mapping of data keys to table names
    const dataMapping = {
      book: 'books',
      career: 'careers',
      careerLevel: 'careerLevels',
      specie: 'species',
      class: 'classes',
      talent: 'talents',
      characteristic: 'characteristics',
      trapping: 'trappings',
      skill: 'skills',
      spell: 'spells',
      creature: 'creatures',
      star: 'stars',
      god: 'gods',
      eye: 'eyes',
      hair: 'hairs',
      detail: 'details',
      trait: 'traits',
      lore: 'lores',
      magick: 'magicks',
      etat: 'etats',
      psychologie: 'psychologies',
      quality: 'qualities',
      tree: 'trees'
    }

    console.log('Loading data into IndexedDB...')
    const results = {}
    let totalRecords = 0

    // Load data for each table
    for (const [dataKey, tableName] of Object.entries(dataMapping)) {
      const data = embeddedData[dataKey]
      if (data) {
        const count = await loadTableData(tableName, data)
        results[tableName] = count
        totalRecords += count
        console.log(`✓ Loaded ${count} records into ${tableName}`)
      }
    }

    // Mark as initialized
    markAsInitialized()

    console.log(`✓ Database initialization complete! Total records: ${totalRecords}`)

    const stats = await getDbStats()

    return {
      success: true,
      alreadyInitialized: false,
      totalRecords,
      results,
      stats
    }

  } catch (error) {
    console.error('Database initialization failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Force re-initialization of the database
 * @returns {Promise<Object>} Object with initialization results
 */
export async function forceReInitialize() {
  console.log('Forcing database re-initialization...')

  try {
    // Clear initialization flag
    clearInitFlag()

    // Clear all tables
    const tables = [
      'books', 'careers', 'careerLevels', 'species', 'classes',
      'talents', 'characteristics', 'trappings', 'skills', 'spells',
      'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
      'traits', 'lores', 'magicks', 'etats', 'psychologies',
      'qualities', 'trees'
    ]

    for (const table of tables) {
      await db[table].clear()
    }

    console.log('All tables cleared')

    // Re-initialize
    return await initializeDatabase()

  } catch (error) {
    console.error('Force re-initialization failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get initialization status
 * @returns {Promise<Object>} Object with status information
 */
export async function getInitStatus() {
  const initialized = isDataInitialized()
  const version = localStorage.getItem(DATA_VERSION_KEY)
  const stats = initialized ? await getDbStats() : {}

  return {
    initialized,
    version,
    currentVersion: CURRENT_DATA_VERSION,
    stats
  }
}
