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

    const data = {}

    // Load all entity types from IndexedDB
    for (const entityType of ENTITY_TYPES) {
      data[entityType] = await getAllFromTable(entityType)
    }

    officialData.set(data)
    console.log('Official data loaded successfully')
  } catch (error) {
    console.error('Error loading official data:', error)
    dataError.set('Failed to load official data: ' + error.message)
    throw error
  } finally {
    isDataLoading.set(false)
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
