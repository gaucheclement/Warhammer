/**
 * Database ID Generator
 *
 * Generates stable, unique IDs for entities in the Warhammer database.
 * IDs are derived from labels and normalized for consistency.
 *
 * Key Features:
 * - Stable IDs never change once assigned
 * - Accent-insensitive normalization (Athlétisme → athletisme)
 * - Handle collisions with entity type context
 * - Lowercase with hyphens format (e.g., "lanceur-de-sorts")
 *
 * @module db-id-generator
 */

/**
 * Normalize a label into a stable ID
 *
 * Applies the following transformations:
 * 1. Lowercase
 * 2. Remove accents (NFD decomposition + strip combining marks)
 * 3. Replace non-alphanumeric with hyphens
 * 4. Remove leading/trailing hyphens
 * 5. Collapse multiple hyphens into one
 *
 * @param {string} label - Original label (e.g., "Lanceur de Sorts")
 * @returns {string} Normalized ID (e.g., "lanceur-de-sorts")
 *
 * @example
 * normalizeLabel("Athlétisme")
 * // Returns: "athletisme"
 *
 * @example
 * normalizeLabel("Combat (Épée)")
 * // Returns: "combat-epee"
 *
 * @example
 * normalizeLabel("L'Épée d'Argent")
 * // Returns: "l-epee-d-argent"
 *
 * @example
 * normalizeLabel("Magie Mineure")
 * // Returns: "magie-mineure"
 */
export function normalizeLabel(label) {
  if (!label || typeof label !== 'string') {
    return ''
  }

  // Step 1: Lowercase
  let id = label.toLowerCase()

  // Step 2: Remove accents using NFD decomposition
  // NFD splits characters into base + combining marks
  // Then we remove all combining diacritical marks (U+0300 to U+036F)
  id = id.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Step 3: Replace non-alphanumeric characters with hyphens
  // Keep only: a-z, 0-9, everything else becomes hyphen
  id = id.replace(/[^a-z0-9]+/g, '-')

  // Step 4: Remove leading/trailing hyphens
  id = id.replace(/^-+|-+$/g, '')

  // Step 5: Collapse multiple consecutive hyphens into one
  id = id.replace(/-+/g, '-')

  return id
}

/**
 * Generate a stable ID from a label
 *
 * If the normalized ID already exists in the given context (entity type),
 * append a numeric suffix (-2, -3, etc.) to ensure uniqueness.
 *
 * @param {string} label - Original label
 * @param {string} entityType - Entity type for context
 * @param {Set<string>|Array<string>} existingIds - Set or array of existing IDs
 * @returns {string} Unique normalized ID
 *
 * @example
 * generateStableId("Combat", "skills", new Set(["combat"]))
 * // Returns: "combat-2"
 *
 * @example
 * generateStableId("Athlétisme", "skills", [])
 * // Returns: "athletisme"
 *
 * @example
 * generateStableId("Combat", "talents", new Set(["combat", "combat-2"]))
 * // Returns: "combat-3"
 */
export function generateStableId(label, entityType, existingIds = []) {
  const baseId = normalizeLabel(label)

  if (!baseId) {
    // Fallback for empty labels
    return `${entityType}-unknown`
  }

  // Convert array to Set for O(1) lookups
  const idSet = existingIds instanceof Set ? existingIds : new Set(existingIds)

  // If base ID is unique, use it
  if (!idSet.has(baseId)) {
    return baseId
  }

  // Otherwise, find the next available suffix
  let suffix = 2
  let candidateId = `${baseId}-${suffix}`

  while (idSet.has(candidateId)) {
    suffix++
    candidateId = `${baseId}-${suffix}`
  }

  return candidateId
}

/**
 * Generate IDs for an array of entities
 *
 * Ensures all IDs are unique within the entity type.
 * Modifies entities in place by adding an 'id' field.
 * If entity already has an 'id', it is preserved.
 *
 * @param {Array<Object>} entities - Array of entities
 * @param {string} entityType - Entity type
 * @returns {Array<Object>} Array of entities with IDs
 *
 * @example
 * const skills = [
 *   { label: "Athlétisme" },
 *   { label: "Combat" },
 *   { label: "Combat", id: "combat-custom" }  // Preserved
 * ]
 * generateIdsForEntities(skills, "skills")
 * // Returns: [
 * //   { label: "Athlétisme", id: "athletisme" },
 * //   { label: "Combat", id: "combat" },
 * //   { label: "Combat", id: "combat-custom" }
 * // ]
 */
export function generateIdsForEntities(entities, entityType) {
  if (!Array.isArray(entities)) {
    return []
  }

  // First pass: collect existing string IDs (skip numeric IDs)
  const existingIds = new Set()
  for (const entity of entities) {
    // Only preserve string IDs, regenerate numeric ones
    if (entity.id && typeof entity.id === 'string') {
      existingIds.add(entity.id)
    }
  }

  // Second pass: generate IDs for entities without string ID
  for (const entity of entities) {
    // Generate ID if missing OR if it's numeric (from index field)
    if (!entity.id || typeof entity.id === 'number') {
      // Handle special case: label is an object (eyes, hairs, details)
      // Use index to generate unique ID
      let label = entity.label || entity.name || ''
      if (typeof label === 'object') {
        // Use entityType + index for unique ID
        label = `${entityType}-${entity.index !== undefined ? entity.index : existingIds.size}`
      }
      const newId = generateStableId(label, entityType, existingIds)
      entity.id = newId
      existingIds.add(newId)
    }
  }

  return entities
}

/**
 * Create a mapping from labels to IDs for fast lookup
 *
 * Handles multiple entities with the same label by storing them as arrays.
 * Case-insensitive and accent-insensitive lookup keys.
 *
 * @param {Array<Object>} entities - Array of entities
 * @returns {Map<string, string|Array<string>>} Map from normalized label to ID(s)
 *
 * @example
 * const entities = [
 *   { id: "combat", label: "Combat" },
 *   { id: "combat-talent", label: "Combat" },
 *   { id: "athletisme", label: "Athlétisme" }
 * ]
 * createLabelToIdMap(entities)
 * // Returns: Map {
 * //   "combat" => ["combat", "combat-talent"],
 * //   "athletisme" => "athletisme"
 * // }
 */
export function createLabelToIdMap(entities) {
  const labelMap = new Map()

  for (const entity of entities) {
    const label = entity.label || entity.name
    if (!label) continue

    const normalizedLabel = normalizeLabel(label)
    const existingValue = labelMap.get(normalizedLabel)

    if (!existingValue) {
      // First entity with this label
      labelMap.set(normalizedLabel, entity.id)
    } else if (Array.isArray(existingValue)) {
      // Multiple entities already exist
      existingValue.push(entity.id)
    } else {
      // Second entity with this label - convert to array
      labelMap.set(normalizedLabel, [existingValue, entity.id])
    }
  }

  return labelMap
}

/**
 * Resolve a label to an ID using a label-to-ID map
 *
 * Returns null if label is not found.
 * If multiple IDs match (collision), returns the first one and logs a warning.
 *
 * @param {string} label - Label to resolve
 * @param {Map<string, string|Array<string>>} labelMap - Label-to-ID mapping
 * @param {string} entityType - Entity type for warning messages
 * @returns {string|null} Resolved ID or null
 *
 * @example
 * const map = new Map([["combat", "combat"]])
 * resolveLabelToId("Combat", map, "skills")
 * // Returns: "combat"
 *
 * @example
 * const map = new Map([["combat", ["combat-skill", "combat-talent"]]])
 * resolveLabelToId("Combat", map, "skills")
 * // Returns: "combat-skill" (first match, logs warning)
 */
export function resolveLabelToId(label, labelMap, entityType) {
  if (!label || !labelMap) {
    return null
  }

  const normalizedLabel = normalizeLabel(label)
  const result = labelMap.get(normalizedLabel)

  if (!result) {
    return null
  }

  if (Array.isArray(result)) {
    // Multiple matches - this is an ambiguity
    console.warn(
      `Ambiguous label "${label}" in ${entityType}: matches ${result.length} entities [${result.join(', ')}]. Using first match.`
    )
    return result[0]
  }

  return result
}

/**
 * Batch resolve multiple labels to IDs
 *
 * @param {Array<string>} labels - Array of labels to resolve
 * @param {Map<string, string|Array<string>>} labelMap - Label-to-ID mapping
 * @param {string} entityType - Entity type for warnings
 * @returns {Array<Object>} Array of { label, id, resolved } objects
 *
 * @example
 * const map = new Map([["combat", "combat"], ["athletisme", "athletisme"]])
 * batchResolveLabelToId(["Combat", "Athlétisme", "Unknown"], map, "skills")
 * // Returns: [
 * //   { label: "Combat", id: "combat", resolved: true },
 * //   { label: "Athlétisme", id: "athletisme", resolved: true },
 * //   { label: "Unknown", id: null, resolved: false }
 * // ]
 */
export function batchResolveLabelToId(labels, labelMap, entityType) {
  if (!Array.isArray(labels)) {
    return []
  }

  return labels.map(label => {
    const id = resolveLabelToId(label, labelMap, entityType)
    return {
      label,
      id,
      resolved: id !== null
    }
  })
}

// Export default object with all functions
export default {
  normalizeLabel,
  generateStableId,
  generateIdsForEntities,
  createLabelToIdMap,
  resolveLabelToId,
  batchResolveLabelToId
}
