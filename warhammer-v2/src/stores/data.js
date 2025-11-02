/**
 * Data Layer Stores - Reactive state management for Warhammer data
 *
 * This module provides Svelte stores for managing official data, custom modifications,
 * and characters. It implements a transparent merging strategy where custom modifications
 * override official data by ID.
 *
 * Architecture:
 * - officialData: Immutable data from IndexedDB (loaded from embedded JSON)
 * - customModifications: User edits and custom content (persisted in IndexedDB)
 * - mergedData: Derived store that combines both sources
 * - characters: Separate store for character data
 */

import { writable, derived, get } from 'svelte/store'
import { db, getAllFromTable } from '../lib/db.js'
import { mergeData } from '../lib/dataMerger.js'
import { transformData, loadIntoIndexedDB, formatReport } from '../lib/db-loader.js'

/**
 * @typedef {Object} OfficialData
 * @property {Array} books
 * @property {Array} careers
 * @property {Array} careerLevels
 * @property {Array} species
 * @property {Array} classes
 * @property {Array} talents
 * @property {Array} characteristics
 * @property {Array} trappings
 * @property {Array} skills
 * @property {Array} spells
 * @property {Array} creatures
 * @property {Array} stars
 * @property {Array} gods
 * @property {Array} eyes
 * @property {Array} hairs
 * @property {Array} details
 * @property {Array} traits
 * @property {Array} lores
 * @property {Array} magicks
 * @property {Array} etats
 * @property {Array} psychologies
 * @property {Array} qualities
 * @property {Array} trees
 */

/**
 * Official game data (immutable, loaded from IndexedDB)
 * @type {import('svelte/store').Writable<OfficialData>}
 */
export const officialData = writable({
  books: [],
  careers: [],
  careerLevels: [],
  species: [],
  classes: [],
  talents: [],
  characteristics: [],
  trappings: [],
  skills: [],
  spells: [],
  creatures: [],
  stars: [],
  gods: [],
  eyes: [],
  hairs: [],
  details: [],
  traits: [],
  lores: [],
  magicks: [],
  etats: [],
  psychologies: [],
  qualities: [],
  trees: []
})

/**
 * Custom modifications (user edits and custom content)
 * Structure mirrors officialData but contains only modified/custom entries
 * @type {import('svelte/store').Writable<Object>}
 */
export const customModifications = writable({
  books: [],
  careers: [],
  careerLevels: [],
  species: [],
  classes: [],
  talents: [],
  characteristics: [],
  trappings: [],
  skills: [],
  spells: [],
  creatures: [],
  stars: [],
  gods: [],
  eyes: [],
  hairs: [],
  details: [],
  traits: [],
  lores: [],
  magicks: [],
  etats: [],
  psychologies: [],
  qualities: [],
  trees: []
})

/**
 * Merged data (derived store combining official and custom data)
 * Custom modifications override official data by ID
 * @type {import('svelte/store').Readable<Object>}
 */
export const mergedData = derived(
  [officialData, customModifications],
  ([$official, $custom]) => mergeData($official, $custom)
)

/**
 * Characters (separate from game data)
 * @type {import('svelte/store').Writable<Array>}
 */
export const characters = writable([])

/**
 * Loading state for data initialization
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isDataLoading = writable(true)

/**
 * Error state for data operations
 * @type {import('svelte/store').Writable<string|null>}
 */
export const dataError = writable(null)

// Define all entity types
const ENTITY_TYPES = [
  'books', 'careers', 'careerLevels', 'species', 'classes',
  'talents', 'characteristics', 'trappings', 'skills', 'spells',
  'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
  'traits', 'lores', 'magicks', 'etats', 'psychologies',
  'qualities', 'trees'
]

/**
 * Load official data from IndexedDB
 * This should be called once on app initialization
 * @returns {Promise<void>}
 */
export async function loadOfficialData() {
  try {
    isDataLoading.set(true)
    dataError.set(null)

    // Check if IndexedDB is empty (first time load)
    const talentCount = await db.talents.count()

    if (talentCount === 0 && window.__WARHAMMER_DATA__) {
      console.log('IndexedDB is empty, loading from embedded data...')
      await seedIndexedDB(window.__WARHAMMER_DATA__)
    }

    const data = {}

    // Load all entity types from IndexedDB
    for (const entityType of ENTITY_TYPES) {
      data[entityType] = await getAllFromTable(entityType)
    }

    officialData.set(data)
    console.log('Official data loaded successfully', {
      talents: data.talents?.length || 0,
      careers: data.careers?.length || 0,
      species: data.species?.length || 0
    })
  } catch (error) {
    console.error('Error loading official data:', error)
    dataError.set('Failed to load official data: ' + error.message)
    throw error
  } finally {
    isDataLoading.set(false)
  }
}

/**
 * Seed IndexedDB with initial data from embedded JSON
 *
 * Issue #47/#48: Now uses transformData pipeline to:
 * - Generate stable string IDs (e.g., "skill-athletisme")
 * - Parse references into EntityReference objects
 * - Validate and report data quality
 *
 * @param {Object} data - The data object from window.__WARHAMMER_DATA__
 * @returns {Promise<void>}
 */
async function seedIndexedDB(data) {
  try {
    console.log('Seeding IndexedDB with initial data...')
    console.log('Issue #47/#48: Using transformData pipeline for ID generation and reference parsing')

    // Transform data using db-loader pipeline
    // This generates string IDs and parses all references into EntityReference objects
    const { data: transformedData, report } = transformData(data, {
      generateReport: true,
      preserveOriginal: false
    })

    // Log transformation report showing data quality
    console.log(formatReport(report))

    // Load transformed data into IndexedDB
    const stats = await loadIntoIndexedDB(db, transformedData)

    // Log loading statistics
    console.log('IndexedDB seeded successfully')
    console.log('Load statistics:', stats)

    if (stats.errors && stats.errors.length > 0) {
      console.error('Some tables failed to load:', stats.errors)
      throw new Error(`Failed to load ${stats.errors.length} tables`)
    }

    return { transformedData, report, stats }
  } catch (error) {
    console.error('Error seeding IndexedDB:', error)
    throw error
  }
}

/**
 * Load custom modifications from localStorage
 * Custom modifications are stored separately from the official data in IndexedDB
 * For now, we use localStorage for simplicity
 * @returns {Promise<void>}
 */
export async function loadCustomModifications() {
  try {
    const stored = localStorage.getItem('customModifications')
    if (stored) {
      const data = JSON.parse(stored)
      customModifications.set(data)
      console.log('Custom modifications loaded successfully')
    }
  } catch (error) {
    console.error('Error loading custom modifications:', error)
    // Don't throw - custom modifications are optional
  }
}

/**
 * Save custom modifications to localStorage
 * @returns {void}
 */
export function saveCustomModifications() {
  try {
    const data = get(customModifications)
    localStorage.setItem('customModifications', JSON.stringify(data))
    console.log('Custom modifications saved successfully')
  } catch (error) {
    console.error('Error saving custom modifications:', error)
    dataError.set('Failed to save custom modifications: ' + error.message)
  }
}

/**
 * Load characters from IndexedDB
 * @returns {Promise<void>}
 */
export async function loadCharacters() {
  try {
    const data = await getAllFromTable('characters')
    characters.set(data)
    console.log(`Loaded ${data.length} characters`)
  } catch (error) {
    console.error('Error loading characters:', error)
    dataError.set('Failed to load characters: ' + error.message)
  }
}

/**
 * Initialize all data stores
 * This is the main entry point for loading data on app startup
 * @returns {Promise<void>}
 */
export async function initializeDataStores() {
  try {
    await loadOfficialData()
    await loadCustomModifications()
    await loadCharacters()
  } catch (error) {
    console.error('Error initializing data stores:', error)
    throw error
  }
}

/**
 * Reset custom modifications (clear all user edits)
 * @returns {void}
 */
export function resetCustomModifications() {
  customModifications.set({
    books: [],
    careers: [],
    careerLevels: [],
    species: [],
    classes: [],
    talents: [],
    characteristics: [],
    trappings: [],
    skills: [],
    spells: [],
    creatures: [],
    stars: [],
    gods: [],
    eyes: [],
    hairs: [],
    details: [],
    traits: [],
    lores: [],
    magicks: [],
    etats: [],
    psychologies: [],
    qualities: [],
    trees: []
  })
  localStorage.removeItem('customModifications')
  console.log('Custom modifications reset')
}

/**
 * Get count of custom modifications
 * @returns {number}
 */
export function getCustomModificationsCount() {
  const data = get(customModifications)
  let count = 0
  for (const entityType of ENTITY_TYPES) {
    count += (data[entityType] || []).length
  }
  return count
}

/**
 * Subscribe to merged data for a specific entity type
 * @param {string} entityType - Type of entity (e.g., 'talents', 'skills')
 * @returns {import('svelte/store').Readable<Array>}
 */
export function getMergedEntityType(entityType) {
  return derived(mergedData, ($merged) => $merged[entityType] || [])
}

/**
 * Modify an existing entity (official or custom)
 * Adds metadata to track modification status
 * @param {string} entityType - Type of entity (e.g., 'talents', 'skills')
 * @param {string|number} entityId - ID of the entity to modify
 * @param {Object} modifiedFields - Fields that have been modified
 * @returns {void}
 */
export function modifyEntity(entityType, entityId, modifiedFields) {
  if (!ENTITY_TYPES.includes(entityType)) {
    console.error(`Invalid entity type: ${entityType}`)
    return
  }

  const currentModifications = get(customModifications)
  const currentTypeData = currentModifications[entityType] || []

  // Find if this entity is already modified
  const existingIndex = currentTypeData.findIndex(item => item.id === entityId)

  // Get the original entity from official data
  const official = get(officialData)
  const originalEntity = official[entityType]?.find(item => item.id === entityId)

  if (!originalEntity) {
    console.error(`Entity not found: ${entityType} with id ${entityId}`)
    return
  }

  // Create the modified entity
  const modifiedEntity = {
    ...originalEntity,
    ...modifiedFields,
    _meta: {
      isModified: true,
      originalId: entityId,
      modified: new Date().toISOString()
    }
  }

  // Update or add the modification
  const updatedTypeData = [...currentTypeData]
  if (existingIndex >= 0) {
    updatedTypeData[existingIndex] = modifiedEntity
  } else {
    updatedTypeData.push(modifiedEntity)
  }

  // Update the store
  customModifications.update(mods => ({
    ...mods,
    [entityType]: updatedTypeData
  }))

  // Persist to localStorage
  saveCustomModifications()

  console.log(`Modified ${entityType} entity:`, entityId)
}

/**
 * Create a new custom entity
 * @param {string} entityType - Type of entity (e.g., 'talents', 'skills')
 * @param {Object} entityData - Data for the new entity
 * @returns {string} ID of the created entity
 */
export function createCustomEntity(entityType, entityData) {
  if (!ENTITY_TYPES.includes(entityType)) {
    console.error(`Invalid entity type: ${entityType}`)
    return null
  }

  // Generate a unique ID for the custom entity
  const customId = `custom-${entityType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const currentModifications = get(customModifications)
  const currentTypeData = currentModifications[entityType] || []

  const newEntity = {
    ...entityData,
    id: customId,
    _meta: {
      isCustom: true,
      created: new Date().toISOString()
    }
  }

  // Add the new entity
  customModifications.update(mods => ({
    ...mods,
    [entityType]: [...currentTypeData, newEntity]
  }))

  // Persist to localStorage
  saveCustomModifications()

  console.log(`Created custom ${entityType} entity:`, customId)
  return customId
}

/**
 * Delete a modification (reset to official or remove custom)
 * @param {string} entityType - Type of entity (e.g., 'talents', 'skills')
 * @param {string|number} entityId - ID of the entity
 * @returns {void}
 */
export function deleteModification(entityType, entityId) {
  if (!ENTITY_TYPES.includes(entityType)) {
    console.error(`Invalid entity type: ${entityType}`)
    return
  }

  const currentModifications = get(customModifications)
  const currentTypeData = currentModifications[entityType] || []

  // Remove the entity from modifications
  const updatedTypeData = currentTypeData.filter(item => item.id !== entityId)

  customModifications.update(mods => ({
    ...mods,
    [entityType]: updatedTypeData
  }))

  // Persist to localStorage
  saveCustomModifications()

  console.log(`Removed modification for ${entityType} entity:`, entityId)
}

/**
 * Data query utilities
 * Issue #48 Stream B: Ported from dataStore.js for unified data layer
 *
 * Provides convenient methods for querying merged data (official + custom).
 * All methods work with the reactive mergedData store.
 */
export const dataQueries = {
  /**
   * Get a single entity by ID
   *
   * @param {string} entityType - Entity type
   * @param {string} id - Entity ID
   * @returns {object|null} The entity or null if not found
   */
  getById(entityType, id) {
    const data = get(mergedData)
    const entities = data[entityType] || []
    return entities.find(e => e.id === id) || null
  },

  /**
   * Get all entities of a specific type
   *
   * @param {string} entityType - Entity type
   * @returns {array} Array of entities
   */
  getAll(entityType) {
    const data = get(mergedData)
    return data[entityType] || []
  },

  /**
   * Filter entities by predicate function
   *
   * @param {string} entityType - Entity type
   * @param {function} predicate - Filter function
   * @returns {array} Filtered entities
   */
  filter(entityType, predicate) {
    const entities = this.getAll(entityType)
    return entities.filter(predicate)
  },

  /**
   * Get only official (unmodified) entities
   *
   * @param {string} entityType - Entity type
   * @returns {array} Official entities
   */
  getOfficial(entityType) {
    return this.filter(
      entityType,
      entity => !entity._meta || (!entity._meta.isCustom && !entity._meta.isModified)
    )
  },

  /**
   * Get only custom entities
   *
   * @param {string} entityType - Entity type
   * @returns {array} Custom entities
   */
  getCustom(entityType) {
    return this.filter(
      entityType,
      entity => entity._meta?.isCustom
    )
  },

  /**
   * Get only modified entities
   *
   * @param {string} entityType - Entity type
   * @returns {array} Modified entities
   */
  getModified(entityType) {
    return this.filter(
      entityType,
      entity => entity._meta?.isModified && !entity._meta?.isCustom
    )
  },

  /**
   * Search entities by name (case-insensitive)
   *
   * @param {string} entityType - Entity type
   * @param {string} searchTerm - Search term
   * @returns {array} Matching entities
   */
  searchByName(entityType, searchTerm) {
    const term = searchTerm.toLowerCase()
    return this.filter(
      entityType,
      entity => entity.name?.toLowerCase().includes(term)
    )
  },

  /**
   * Get count of entities by type
   *
   * @param {string} entityType - Entity type
   * @returns {object} Count breakdown
   */
  getCount(entityType) {
    const all = this.getAll(entityType)
    return {
      total: all.length,
      official: all.filter(e => !e._meta || (!e._meta.isCustom && !e._meta.isModified)).length,
      custom: all.filter(e => e._meta?.isCustom).length,
      modified: all.filter(e => e._meta?.isModified && !e._meta?.isCustom).length
    }
  },

  /**
   * Get statistics for all entity types
   *
   * @returns {object} Statistics object
   */
  getAllStats() {
    const stats = {}
    for (const entityType of ENTITY_TYPES) {
      stats[entityType] = this.getCount(entityType)
    }
    return stats
  }
}
