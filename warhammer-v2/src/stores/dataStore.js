/**
 * Data Store
 *
 * Central data management for Warhammer Fantasy 4e application.
 * Combines official data from IndexedDB with custom modifications.
 *
 * Features:
 * - Reactive derived store that auto-merges official + custom data
 * - Efficient merge strategy (only re-merge changed entity types)
 * - Transparent access to merged dataset
 * - Priority: custom/modified entries override official ones
 */

import { writable, derived, get } from 'svelte/store';
import Dexie from 'dexie';
import { customModifications, ENTITY_TYPES } from './customModifications.js';
import { transformData, loadIntoIndexedDB, formatReport } from '../lib/db-loader.js';

// Database for official data (created by Task #12)
const db = new Dexie('WarhammerData');

// Define database schema (matches Task #12 schema)
db.version(1).stores({
  books: 'id',
  careers: 'id',
  careerLevels: 'id',
  species: 'id',
  classes: 'id',
  talents: 'id',
  characteristics: 'id',
  trappings: 'id',
  skills: 'id',
  spells: 'id',
  creatures: 'id',
  stars: 'id',
  gods: 'id',
  eyes: 'id',
  hairs: 'id',
  details: 'id',
  traits: 'id',
  lores: 'id',
  magicks: 'id',
  etats: 'id',
  psychologies: 'id',
  qualities: 'id',
  trees: 'id'
});

/**
 * Seed IndexedDB with initial data from window.__WARHAMMER_DATA__
 *
 * Issue #47: Now uses db-loader to:
 * - Generate stable string IDs (e.g., "skill-athletisme" instead of 0)
 * - Parse references into EntityReference objects  
 * - Validate and report data quality
 */
async function seedIndexedDB(data) {
  console.log('Seeding IndexedDB with initial data...');
  console.log('Issue #47: Using db-loader for ID generation and reference parsing');

  try {
    // Transform data using db-loader
    // This generates string IDs and parses all references
    const { data: transformedData, report } = transformData(data, {
      generateReport: true,
      preserveOriginal: false
    });

    // Log transformation report
    console.log(formatReport(report));

    // Load transformed data into IndexedDB
    const stats = await loadIntoIndexedDB(db, transformedData);

    // Log loading statistics
    console.log('IndexedDB seeded successfully');
    console.log('Load statistics:', stats);

    if (stats.errors && stats.errors.length > 0) {
      console.error('Some tables failed to load:', stats.errors);
    }

    return { transformedData, report, stats };
  } catch (error) {
    console.error('Failed to seed IndexedDB:', error);
    throw error;
  }
}

/**
 * Official data store (loaded from IndexedDB)
 * Structure: { talents: {...}, careers: {...}, ... }
 */
function createOfficialDataStore() {
  const { subscribe, set } = writable(createEmptyData());

  let initialized = false;

  return {
    subscribe,

    /**
     * Load official data from IndexedDB
     */
    async load() {
      if (initialized) return;

      try {
        // Check if IndexedDB is empty (first time load)
        const talentCount = await db.talents.count();

        if (talentCount === 0 && window.__WARHAMMER_DATA__) {
          console.log('IndexedDB is empty, loading from embedded data...');
          await seedIndexedDB(window.__WARHAMMER_DATA__);
        }

        const data = createEmptyData();

        // Load all entity types in parallel
        const loadPromises = ENTITY_TYPES.map(async (entityType) => {
          const items = await db[entityType].toArray();
          const indexed = {};
          for (const item of items) {
            indexed[item.id] = item;
          }
          data[entityType] = indexed;
        });

        await Promise.all(loadPromises);
        set(data);
        initialized = true;
      } catch (error) {
        console.error('Failed to load official data from IndexedDB:', error);
        set(createEmptyData());
        initialized = true;
      }
    },

    /**
     * Reload official data (useful after data updates)
     */
    async reload() {
      initialized = false;
      await this.load();
    }
  };
}

function createEmptyData() {
  const data = {};
  for (const entityType of ENTITY_TYPES) {
    data[entityType] = {};
  }
  return data;
}

/**
 * Official data store instance
 */
export const officialData = createOfficialDataStore();

/**
 * Merge official data with custom modifications
 *
 * @param {object} official - Official data
 * @param {object} custom - Custom modifications
 * @returns {object} Merged data with custom overriding official
 */
function mergeData(official, custom) {
  const merged = {};

  for (const entityType of ENTITY_TYPES) {
    const officialEntities = official[entityType] || {};
    const customEntities = custom[entityType] || {};

    // Merge: custom overrides official
    merged[entityType] = {
      ...officialEntities,
      ...customEntities
    };

    // Mark official entries that aren't modified
    for (const [id, entity] of Object.entries(merged[entityType])) {
      if (!entity._meta) {
        // Add metadata to indicate this is official, unmodified data
        merged[entityType][id] = {
          ...entity,
          _meta: {
            isOfficial: true,
            isCustom: false,
            isModified: false
          }
        };
      }
    }
  }

  return merged;
}

/**
 * Merged data store (derived from official + custom)
 * Automatically updates when either official or custom data changes
 */
export const mergedData = derived(
  [officialData, customModifications],
  ([$official, $custom]) => mergeData($official, $custom)
);

/**
 * Efficient merge cache for partial updates
 * Tracks which entity types need re-merging
 */
let mergeCache = null;
let lastOfficialData = null;
let lastCustomData = null;

/**
 * Optimized merged data store
 * Only re-merges entity types that have changed
 */
export const optimizedMergedData = derived(
  [officialData, customModifications],
  ([$official, $custom]) => {
    // First time: full merge
    if (!mergeCache) {
      mergeCache = mergeData($official, $custom);
      lastOfficialData = $official;
      lastCustomData = $custom;
      return mergeCache;
    }

    // Detect changes by entity type
    let hasChanges = false;

    for (const entityType of ENTITY_TYPES) {
      const officialChanged = $official[entityType] !== lastOfficialData[entityType];
      const customChanged = $custom[entityType] !== lastCustomData[entityType];

      if (officialChanged || customChanged) {
        hasChanges = true;

        // Re-merge only this entity type
        const officialEntities = $official[entityType] || {};
        const customEntities = $custom[entityType] || {};

        mergeCache[entityType] = {
          ...officialEntities,
          ...customEntities
        };

        // Add metadata for official entries
        for (const [id, entity] of Object.entries(mergeCache[entityType])) {
          if (!entity._meta) {
            mergeCache[entityType][id] = {
              ...entity,
              _meta: {
                isOfficial: true,
                isCustom: false,
                isModified: false
              }
            };
          }
        }
      }
    }

    if (hasChanges) {
      lastOfficialData = $official;
      lastCustomData = $custom;
      // Return a new reference to trigger reactivity
      mergeCache = { ...mergeCache };
    }

    return mergeCache;
  }
);

/**
 * Data query utilities
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
    const data = get(mergedData);
    return data[entityType]?.[id] || null;
  },

  /**
   * Get all entities of a specific type
   *
   * @param {string} entityType - Entity type
   * @returns {array} Array of entities
   */
  getAll(entityType) {
    const data = get(mergedData);
    return Object.values(data[entityType] || {});
  },

  /**
   * Filter entities by predicate function
   *
   * @param {string} entityType - Entity type
   * @param {function} predicate - Filter function
   * @returns {array} Filtered entities
   */
  filter(entityType, predicate) {
    const entities = this.getAll(entityType);
    return entities.filter(predicate);
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
      entity => entity._meta?.isOfficial && !entity._meta?.isModified
    );
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
    );
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
    );
  },

  /**
   * Search entities by name (case-insensitive)
   *
   * @param {string} entityType - Entity type
   * @param {string} searchTerm - Search term
   * @returns {array} Matching entities
   */
  searchByName(entityType, searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.filter(
      entityType,
      entity => entity.name?.toLowerCase().includes(term)
    );
  },

  /**
   * Get count of entities by type
   *
   * @param {string} entityType - Entity type
   * @returns {object} Count breakdown
   */
  getCount(entityType) {
    const all = this.getAll(entityType);
    return {
      total: all.length,
      official: all.filter(e => e._meta?.isOfficial && !e._meta?.isModified).length,
      custom: all.filter(e => e._meta?.isCustom).length,
      modified: all.filter(e => e._meta?.isModified && !e._meta?.isCustom).length
    };
  },

  /**
   * Get statistics for all entity types
   *
   * @returns {object} Statistics object
   */
  getAllStats() {
    const stats = {};
    for (const entityType of ENTITY_TYPES) {
      stats[entityType] = this.getCount(entityType);
    }
    return stats;
  }
};

/**
 * Initialize the data store
 * Must be called once at app startup
 */
export async function initDataStore() {
  try {
    // Load official data first
    await officialData.load();

    // Initialize custom modifications
    await customModifications.init();

    console.log('Data store initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize data store:', error);
    throw error;
  }
}

/**
 * Export the store instances and utilities
 */
export default {
  officialData,
  customModifications,
  mergedData,
  optimizedMergedData,
  dataQueries,
  initDataStore,
  ENTITY_TYPES
};
