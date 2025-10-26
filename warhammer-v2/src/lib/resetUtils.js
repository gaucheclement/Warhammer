/**
 * Reset Utility Functions
 *
 * Functions for resetting custom modifications and reverting entities to official data.
 * Provides individual, type-based, and bulk reset operations with safety checks.
 */

import { get } from 'svelte/store';
import { customModifications, saveCustomModifications } from '../stores/data.js';
import { isCustomContent, isModifiedContent, hasModifications } from './badgeUtils.js';

/**
 * @typedef {Object} ResetResult
 * @property {boolean} success - Whether operation succeeded
 * @property {string} [message] - Success/error message
 * @property {Object} [data] - Additional result data
 */

/**
 * Reset an individual entity to official data
 * For modified entities: removes the modification, reverts to official
 * For custom entities: deletes the custom entity
 *
 * @param {string} entityType - Type of entity (e.g., 'talents', 'spells')
 * @param {string|number} entityId - ID of the entity to reset
 * @returns {ResetResult} Operation result
 */
export function resetEntity(entityType, entityId) {
  try {
    const current = get(customModifications);
    const entities = current[entityType] || [];

    // Find the entity in custom modifications
    const entityIndex = entities.findIndex(e => e.id === entityId);

    if (entityIndex === -1) {
      return {
        success: false,
        message: 'Entity not found in custom modifications'
      };
    }

    const entity = entities[entityIndex];

    // Determine what type of reset this is
    const isCustom = isCustomContent(entity);
    const isModified = isModifiedContent(entity);

    // Remove the entity from custom modifications
    const updatedEntities = entities.filter(e => e.id !== entityId);

    const updated = {
      ...current,
      [entityType]: updatedEntities
    };

    customModifications.set(updated);
    saveCustomModifications();

    return {
      success: true,
      message: isCustom
        ? 'Custom entity deleted successfully'
        : 'Entity reverted to official data',
      data: {
        entityType,
        entityId,
        wasCustom: isCustom,
        wasModified: isModified
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to reset entity: ${error.message}`
    };
  }
}

/**
 * Reset all entities of a specific type
 * Removes all custom and modified entities for the given entity type
 *
 * @param {string} entityType - Type of entity to reset
 * @returns {ResetResult} Operation result
 */
export function resetEntityType(entityType) {
  try {
    const current = get(customModifications);
    const entities = current[entityType] || [];

    if (entities.length === 0) {
      return {
        success: true,
        message: 'No modifications to reset for this entity type',
        data: {
          entityType,
          count: 0
        }
      };
    }

    // Count custom vs modified
    const customCount = entities.filter(isCustomContent).length;
    const modifiedCount = entities.filter(isModifiedContent).length;
    const totalCount = entities.length;

    // Clear all modifications for this type
    const updated = {
      ...current,
      [entityType]: []
    };

    customModifications.set(updated);
    saveCustomModifications();

    return {
      success: true,
      message: `Reset ${totalCount} modification(s)`,
      data: {
        entityType,
        count: totalCount,
        custom: customCount,
        modified: modifiedCount
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to reset entity type: ${error.message}`
    };
  }
}

/**
 * Reset all custom modifications across all entity types
 * This is the nuclear option - clears everything
 *
 * @returns {ResetResult} Operation result
 */
export function resetAll() {
  try {
    const current = get(customModifications);

    // Count total modifications before reset
    let totalCount = 0;
    let customCount = 0;
    let modifiedCount = 0;

    const entityTypes = Object.keys(current);

    entityTypes.forEach(entityType => {
      const entities = current[entityType] || [];
      totalCount += entities.length;
      customCount += entities.filter(isCustomContent).length;
      modifiedCount += entities.filter(isModifiedContent).length;
    });

    if (totalCount === 0) {
      return {
        success: true,
        message: 'No modifications to reset',
        data: {
          count: 0
        }
      };
    }

    // Create empty structure with all entity types
    const emptyStructure = {};
    entityTypes.forEach(entityType => {
      emptyStructure[entityType] = [];
    });

    customModifications.set(emptyStructure);
    saveCustomModifications();

    return {
      success: true,
      message: `Reset all ${totalCount} modification(s)`,
      data: {
        count: totalCount,
        custom: customCount,
        modified: modifiedCount,
        affectedTypes: entityTypes.filter(type => (current[type] || []).length > 0)
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to reset all modifications: ${error.message}`
    };
  }
}

/**
 * Get reset confirmation message for an entity
 * Provides context about what will be reset
 *
 * @param {Object} entity - Entity to reset
 * @param {string} entityType - Type of entity
 * @returns {string} Confirmation message
 */
export function getResetConfirmationMessage(entity, entityType) {
  if (!entity) {
    return 'Are you sure you want to reset this entity?';
  }

  const entityName = entity.name || entity.title || 'this entity';

  if (isCustomContent(entity)) {
    return `Are you sure you want to delete the custom ${entityType.slice(0, -1)} "${entityName}"? This action cannot be undone.`;
  }

  if (isModifiedContent(entity)) {
    return `Are you sure you want to revert "${entityName}" to official data? All your modifications will be lost.`;
  }

  return `Are you sure you want to reset "${entityName}"?`;
}

/**
 * Get reset confirmation message for an entity type
 *
 * @param {string} entityType - Type of entity
 * @param {number} count - Number of entities to reset
 * @returns {string} Confirmation message
 */
export function getResetTypeConfirmationMessage(entityType, count) {
  if (count === 0) {
    return `No modifications found for ${entityType}.`;
  }

  return `Are you sure you want to reset all ${count} modification(s) for ${entityType}? This action cannot be undone.`;
}

/**
 * Get reset confirmation message for bulk reset
 *
 * @param {number} count - Total number of modifications
 * @returns {string} Confirmation message
 */
export function getResetAllConfirmationMessage(count) {
  if (count === 0) {
    return 'No modifications found.';
  }

  return `Are you sure you want to reset ALL ${count} modification(s)? This will delete all custom content and revert all modifications to official data. This action cannot be undone.`;
}

/**
 * Check if an entity can be reset
 * Only entities with modifications can be reset
 *
 * @param {Object} entity - Entity to check
 * @returns {boolean} True if entity can be reset
 */
export function canResetEntity(entity) {
  return hasModifications(entity);
}

/**
 * Get count of modifications for an entity type
 *
 * @param {string} entityType - Type of entity
 * @returns {number} Count of modifications
 */
export function getModificationCount(entityType) {
  const current = get(customModifications);
  const entities = current[entityType] || [];
  return entities.length;
}

/**
 * Get total count of all modifications
 *
 * @returns {number} Total count
 */
export function getTotalModificationCount() {
  const current = get(customModifications);
  let count = 0;

  Object.keys(current).forEach(entityType => {
    count += (current[entityType] || []).length;
  });

  return count;
}

/**
 * Get detailed statistics about modifications
 *
 * @returns {Object} Statistics object
 */
export function getModificationStats() {
  const current = get(customModifications);
  const stats = {
    total: 0,
    custom: 0,
    modified: 0,
    byType: {}
  };

  Object.keys(current).forEach(entityType => {
    const entities = current[entityType] || [];
    const typeStats = {
      total: entities.length,
      custom: entities.filter(isCustomContent).length,
      modified: entities.filter(isModifiedContent).length
    };

    stats.byType[entityType] = typeStats;
    stats.total += typeStats.total;
    stats.custom += typeStats.custom;
    stats.modified += typeStats.modified;
  });

  return stats;
}

/**
 * Preview what would be reset for an entity type
 *
 * @param {string} entityType - Type of entity
 * @returns {Object} Preview data
 */
export function previewResetType(entityType) {
  const current = get(customModifications);
  const entities = current[entityType] || [];

  return {
    entityType,
    count: entities.length,
    custom: entities.filter(isCustomContent),
    modified: entities.filter(isModifiedContent),
    entities: entities.map(e => ({
      id: e.id,
      name: e.name || e.title || 'Unnamed',
      isCustom: isCustomContent(e),
      isModified: isModifiedContent(e)
    }))
  };
}

/**
 * Preview what would be reset for all modifications
 *
 * @returns {Object} Preview data
 */
export function previewResetAll() {
  const current = get(customModifications);
  const preview = {
    total: 0,
    custom: 0,
    modified: 0,
    byType: {}
  };

  Object.keys(current).forEach(entityType => {
    const entities = current[entityType] || [];
    if (entities.length > 0) {
      preview.byType[entityType] = {
        count: entities.length,
        custom: entities.filter(isCustomContent).length,
        modified: entities.filter(isModifiedContent).length
      };
      preview.total += entities.length;
      preview.custom += preview.byType[entityType].custom;
      preview.modified += preview.byType[entityType].modified;
    }
  });

  return preview;
}
