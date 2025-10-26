/**
 * Badge Utility Functions
 *
 * Helper functions for determining badge types and modification status
 * Used throughout the app to display appropriate visual indicators
 */

/**
 * Determine the badge type for an entity based on its metadata
 *
 * @param {Object} entity - The entity to check (talent, spell, career, etc.)
 * @returns {string} Badge type: 'official' | 'custom' | 'modified' | 'deleted'
 */
export function getBadgeType(entity) {
  if (!entity) {
    return 'official';
  }

  // Check for metadata object
  const meta = entity._meta || entity.meta;

  if (!meta) {
    // No metadata means it's official content
    return 'official';
  }

  // Check deletion status first
  if (meta.isDeleted || meta.deleted) {
    return 'deleted';
  }

  // Check if it's custom content (user-created)
  if (meta.isCustom || meta.custom) {
    return 'custom';
  }

  // Check if it's modified official content
  if (meta.isModified || meta.modified) {
    return 'modified';
  }

  // Default to official
  return 'official';
}

/**
 * Check if an entity has any modifications
 *
 * @param {Object} entity - The entity to check
 * @returns {boolean} True if the entity has modifications
 */
export function hasModifications(entity) {
  if (!entity) {
    return false;
  }

  const meta = entity._meta || entity.meta;

  if (!meta) {
    return false;
  }

  return !!(
    meta.isModified ||
    meta.modified ||
    meta.isCustom ||
    meta.custom ||
    meta.isDeleted ||
    meta.deleted
  );
}

/**
 * Check if an entity is custom content (user-created)
 *
 * @param {Object} entity - The entity to check
 * @returns {boolean} True if the entity is custom content
 */
export function isCustomContent(entity) {
  if (!entity) {
    return false;
  }

  const meta = entity._meta || entity.meta;
  return !!(meta && (meta.isCustom || meta.custom));
}

/**
 * Check if an entity is modified official content
 *
 * @param {Object} entity - The entity to check
 * @returns {boolean} True if the entity is modified
 */
export function isModifiedContent(entity) {
  if (!entity) {
    return false;
  }

  const meta = entity._meta || entity.meta;
  return !!(meta && (meta.isModified || meta.modified));
}

/**
 * Check if an entity is deleted (soft delete)
 *
 * @param {Object} entity - The entity to check
 * @returns {boolean} True if the entity is deleted
 */
export function isDeletedContent(entity) {
  if (!entity) {
    return false;
  }

  const meta = entity._meta || entity.meta;
  return !!(meta && (meta.isDeleted || meta.deleted));
}

/**
 * Check if an entity is official (unmodified) content
 *
 * @param {Object} entity - The entity to check
 * @returns {boolean} True if the entity is official
 */
export function isOfficialContent(entity) {
  if (!entity) {
    return true;
  }

  return !hasModifications(entity);
}

/**
 * Get a human-readable label for the badge type
 *
 * @param {string} type - Badge type
 * @returns {string} Human-readable label
 */
export function getBadgeLabel(type) {
  const labels = {
    official: 'Official',
    custom: 'Custom',
    modified: 'Modified',
    deleted: 'Deleted'
  };

  return labels[type] || 'Official';
}

/**
 * Get the modification timestamp for an entity
 *
 * @param {Object} entity - The entity to check
 * @returns {Date|null} Modification timestamp or null if not available
 */
export function getModificationTimestamp(entity) {
  if (!entity) {
    return null;
  }

  const meta = entity._meta || entity.meta;

  if (!meta) {
    return null;
  }

  // Check for various timestamp fields
  const timestamp = meta.modified || meta.created || meta.timestamp;

  if (!timestamp) {
    return null;
  }

  // Try to parse as Date
  try {
    return new Date(timestamp);
  } catch (e) {
    console.warn('Failed to parse timestamp:', timestamp);
    return null;
  }
}

/**
 * Format a modification timestamp for display
 *
 * @param {Object} entity - The entity to check
 * @returns {string} Formatted timestamp or empty string
 */
export function formatModificationTimestamp(entity) {
  const timestamp = getModificationTimestamp(entity);

  if (!timestamp) {
    return '';
  }

  // Format as relative time (e.g., "2 hours ago")
  const now = new Date();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    // Format as date for older modifications
    return timestamp.toLocaleDateString();
  }
}

/**
 * Get CSS class names for an entity based on its modification status
 *
 * @param {Object} entity - The entity to check
 * @returns {string} Space-separated CSS class names
 */
export function getBadgeClasses(entity) {
  const type = getBadgeType(entity);
  const classes = [`badge-${type}`];

  if (hasModifications(entity)) {
    classes.push('has-modifications');
  }

  return classes.join(' ');
}

/**
 * Filter entities by badge type
 *
 * @param {Array} entities - Array of entities
 * @param {string} type - Badge type to filter by
 * @returns {Array} Filtered entities
 */
export function filterByBadgeType(entities, type) {
  if (!entities || !Array.isArray(entities)) {
    return [];
  }

  if (!type || type === 'all') {
    return entities;
  }

  return entities.filter(entity => getBadgeType(entity) === type);
}

/**
 * Count entities by badge type
 *
 * @param {Array} entities - Array of entities
 * @returns {Object} Count of each badge type
 */
export function countByBadgeType(entities) {
  if (!entities || !Array.isArray(entities)) {
    return {
      official: 0,
      custom: 0,
      modified: 0,
      deleted: 0
    };
  }

  const counts = {
    official: 0,
    custom: 0,
    modified: 0,
    deleted: 0
  };

  entities.forEach(entity => {
    const type = getBadgeType(entity);
    counts[type] = (counts[type] || 0) + 1;
  });

  return counts;
}
