/**
 * Custom Modifications Store
 *
 * Manages user-created custom content and modifications to official data.
 * Supports all 23 entity types from the Warhammer Fantasy 4e dataset.
 *
 * Data structure:
 * {
 *   talents: {
 *     'talent-id-123': {
 *       ...modifiedFields,
 *       _meta: {
 *         isCustom: false,
 *         isModified: true,
 *         originalId: 'talent-id-123',
 *         modified: timestamp
 *       }
 *     },
 *     'custom-talent-456': {
 *       ...customFields,
 *       _meta: {
 *         isCustom: true,
 *         created: timestamp
 *       }
 *     }
 *   },
 *   careers: { ... },
 *   // ... for all 23 entity types
 * }
 */

import { writable, get } from 'svelte/store';
import Dexie from 'dexie';

// Database for persistent storage of custom modifications
const db = new Dexie('WarhammerCustomModifications');

// Define database schema
db.version(1).stores({
  customModifications: 'entityType' // Keyed by entity type
});

/**
 * All 23 entity types supported by the system
 */
export const ENTITY_TYPES = [
  'books',
  'careers',
  'careerLevels',
  'species',
  'classes',
  'talents',
  'characteristics',
  'trappings',
  'skills',
  'spells',
  'creatures',
  'stars',
  'gods',
  'eyes',
  'hairs',
  'details',
  'traits',
  'lores',
  'magicks',
  'etats',
  'psychologies',
  'qualities',
  'trees'
];

/**
 * Initialize empty structure for all entity types
 */
function createEmptyModifications() {
  const modifications = {};
  for (const entityType of ENTITY_TYPES) {
    modifications[entityType] = {};
  }
  return modifications;
}

/**
 * Custom modifications store
 * Synced to IndexedDB for persistence
 */
function createCustomModificationsStore() {
  const { subscribe, set, update } = writable(createEmptyModifications());

  let initialized = false;

  return {
    subscribe,

    /**
     * Initialize store from IndexedDB
     */
    async init() {
      if (initialized) return;

      try {
        const stored = await db.customModifications.toArray();
        if (stored.length > 0) {
          const modifications = createEmptyModifications();
          for (const item of stored) {
            modifications[item.entityType] = item.data || {};
          }
          set(modifications);
        }
        initialized = true;
      } catch (error) {
        console.error('Failed to load custom modifications from IndexedDB:', error);
        set(createEmptyModifications());
        initialized = true;
      }
    },

    /**
     * Persist current state to IndexedDB
     */
    async persist() {
      const current = get({ subscribe });

      try {
        // Save each entity type separately for efficient updates
        const promises = ENTITY_TYPES.map(async (entityType) => {
          await db.customModifications.put({
            entityType,
            data: current[entityType]
          });
        });

        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to persist custom modifications to IndexedDB:', error);
        throw error;
      }
    },

    /**
     * Create a new custom entity
     *
     * @param {string} entityType - The type of entity (e.g., 'talents', 'spells')
     * @param {string} id - Unique identifier for the custom entity
     * @param {object} data - Entity data
     * @returns {Promise<object>} The created entity with metadata
     */
    async create(entityType, id, data) {
      if (!ENTITY_TYPES.includes(entityType)) {
        throw new Error(`Invalid entity type: ${entityType}`);
      }

      const entity = {
        ...data,
        _meta: {
          isCustom: true,
          created: Date.now()
        }
      };

      update(store => {
        store[entityType][id] = entity;
        return store;
      });

      await this.persist();
      return entity;
    },

    /**
     * Modify an existing official entity
     *
     * @param {string} entityType - The type of entity
     * @param {string} id - Entity ID
     * @param {object} modifications - Fields to modify
     * @returns {Promise<object>} The modified entity with metadata
     */
    async modify(entityType, id, modifications) {
      if (!ENTITY_TYPES.includes(entityType)) {
        throw new Error(`Invalid entity type: ${entityType}`);
      }

      let entity;

      update(store => {
        const existing = store[entityType][id];

        entity = {
          ...existing,
          ...modifications,
          _meta: {
            ...(existing?._meta || {}),
            isCustom: existing?._meta?.isCustom || false,
            isModified: true,
            originalId: id,
            modified: Date.now()
          }
        };

        store[entityType][id] = entity;
        return store;
      });

      await this.persist();
      return entity;
    },

    /**
     * Read a custom or modified entity
     *
     * @param {string} entityType - The type of entity
     * @param {string} id - Entity ID
     * @returns {object|null} The entity or null if not found
     */
    read(entityType, id) {
      if (!ENTITY_TYPES.includes(entityType)) {
        throw new Error(`Invalid entity type: ${entityType}`);
      }

      const current = get({ subscribe });
      return current[entityType][id] || null;
    },

    /**
     * Read all entities of a specific type
     *
     * @param {string} entityType - The type of entity
     * @returns {object} All entities of the specified type
     */
    readAll(entityType) {
      if (!ENTITY_TYPES.includes(entityType)) {
        throw new Error(`Invalid entity type: ${entityType}`);
      }

      const current = get({ subscribe });
      return current[entityType];
    },

    /**
     * Delete a custom modification or reset a modified official entity
     *
     * @param {string} entityType - The type of entity
     * @param {string} id - Entity ID
     * @returns {Promise<void>}
     */
    async delete(entityType, id) {
      if (!ENTITY_TYPES.includes(entityType)) {
        throw new Error(`Invalid entity type: ${entityType}`);
      }

      update(store => {
        delete store[entityType][id];
        return store;
      });

      await this.persist();
    },

    /**
     * Reset all modifications for a specific entity type
     *
     * @param {string} entityType - The type of entity
     * @returns {Promise<void>}
     */
    async resetType(entityType) {
      if (!ENTITY_TYPES.includes(entityType)) {
        throw new Error(`Invalid entity type: ${entityType}`);
      }

      update(store => {
        store[entityType] = {};
        return store;
      });

      await this.persist();
    },

    /**
     * Reset ALL custom modifications (use with caution!)
     *
     * @returns {Promise<void>}
     */
    async resetAll() {
      set(createEmptyModifications());
      await this.persist();
    },

    /**
     * Export all custom modifications as JSON
     *
     * @returns {object} Exportable JSON structure
     */
    export() {
      const current = get({ subscribe });

      // Filter out empty entity types for cleaner export
      const exportData = {};
      for (const entityType of ENTITY_TYPES) {
        const entities = current[entityType];
        if (Object.keys(entities).length > 0) {
          exportData[entityType] = entities;
        }
      }

      return {
        version: '2.0',
        exported: Date.now(),
        modifications: exportData
      };
    },

    /**
     * Import custom modifications from JSON
     *
     * @param {object} importData - Data to import
     * @param {boolean} merge - If true, merge with existing; if false, replace
     * @returns {Promise<object>} Import results with conflicts
     */
    async import(importData, merge = true) {
      if (!importData.modifications) {
        throw new Error('Invalid import data: missing modifications field');
      }

      const conflicts = [];
      const current = get({ subscribe });

      update(store => {
        for (const entityType of ENTITY_TYPES) {
          const importEntities = importData.modifications[entityType];
          if (!importEntities) continue;

          for (const [id, entity] of Object.entries(importEntities)) {
            // Check for conflicts
            if (merge && store[entityType][id]) {
              conflicts.push({
                entityType,
                id,
                existing: store[entityType][id],
                incoming: entity
              });
            }

            // Import entity (conflicts handled by caller)
            store[entityType][id] = entity;
          }
        }
        return store;
      });

      await this.persist();

      return {
        imported: true,
        conflicts
      };
    },

    /**
     * Get statistics about custom modifications
     *
     * @returns {object} Statistics object
     */
    getStats() {
      const current = get({ subscribe });
      const stats = {
        total: 0,
        custom: 0,
        modified: 0,
        byType: {}
      };

      for (const entityType of ENTITY_TYPES) {
        const entities = current[entityType];
        const count = Object.keys(entities).length;

        if (count > 0) {
          stats.byType[entityType] = {
            total: count,
            custom: 0,
            modified: 0
          };

          for (const entity of Object.values(entities)) {
            if (entity._meta?.isCustom) {
              stats.custom++;
              stats.byType[entityType].custom++;
            } else if (entity._meta?.isModified) {
              stats.modified++;
              stats.byType[entityType].modified++;
            }
          }

          stats.total += count;
        }
      }

      return stats;
    }
  };
}

// Export the store instance
export const customModifications = createCustomModificationsStore();
