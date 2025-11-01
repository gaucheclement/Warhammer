/**
 * Tests for NEW Description Generators (Issue #36 Stream B)
 *
 * This test file validates the 12 new entity type description generators:
 * - Characteristic, God, Lore, Star, Etat, Psychologie, Magick, Quality
 * - Trait, Tree, Creature, Book
 *
 * Tests are designed to run progressively as Stream A completes each generator.
 * DO NOT MODIFY db-descriptions.js - that's Stream A's responsibility.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db.js'
import { generateDescription } from './db-descriptions.js'

// ============================================================================
// TEST DATA CONSTANTS
// ============================================================================

/**
 * Real entity IDs from the database for testing.
 * These IDs are confirmed to exist in all-data.json.
 */
const TEST_ENTITIES = {
  characteristic: [
    { id: 'Capacité de Combat', label: 'Capacité de Combat' },
    { id: 'Capacité de Tir', label: 'Capacité de Tir' },
    { id: 'Force', label: 'Force' }
  ],
  god: [
    { id: 'Manann', label: 'Manann' },
    { id: 'Morr', label: 'Morr' },
    { id: 'Myrmidia', label: 'Myrmidia' }
  ],
  lore: [
    { id: 'Reikland', label: 'Reikland' },
    { id: 'Montagnes Grises', label: 'Montagnes Grises' },
    { id: 'Les montagnes, les collines et le Vorbergland', label: 'Les montagnes, les collines et le Vorbergland' }
  ],
  star: [
    { id: 'Wymund l\'Anachorète', label: 'Wymund l\'Anachorète' },
    { id: 'La Grande Croix', label: 'La Grande Croix' },
    { id: 'Le Trait du Peintre', label: 'Le Trait du Peintre' }
  ],
  etat: [
    { id: 'Assourdi', label: 'Assourdi' },
    { id: 'À Terre', label: 'À Terre' },
    { id: 'Aveuglé', label: 'Aveuglé' }
  ],
  psychologie: [
    { id: 'Animosité', label: 'Animosité' },
    { id: 'Peur', label: 'Peur' },
    { id: 'Frénésie', label: 'Frénésie' }
  ],
  magick: [
    { id: 'Bête', label: 'Bête' },
    { id: 'Cieux', label: 'Cieux' },
    { id: 'Feu', label: 'Feu' }
  ],
  quality: [
    { id: 'À Enroulement', label: 'À Enroulement' },
    { id: 'À Poudre noire', label: 'À Poudre noire' },
    { id: 'À Répétition', label: 'À Répétition' }
  ],
  trait: [
    { id: 'À distance', label: 'À distance' },
    { id: 'À sang-froid', label: 'À sang-froid' },
    { id: 'Affamé', label: 'Affamé' }
  ],
  tree: [
    { id: 'Racine', label: 'Racine' },
    { id: 'Personnage', label: 'Personnage' },
    { id: 'Races', label: 'Races' }
  ],
  creature: [
    { id: 'Humain', label: 'Humain' },
    { id: 'Nain', label: 'Nain' },
    { id: 'Halfling', label: 'Halfling' }
  ],
  book: [
    { id: 'Livre de base', label: 'Livre de base' },
    { id: 'Aux Armes !', label: 'Aux Armes !' },
    { id: 'Vents de la Magie', label: 'Vents de la Magie' }
  ]
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate HTML structure is well-formed
 * @param {string} html - HTML string to validate
 * @returns {Object} Validation result with {valid, errors}
 */
function validateHTML(html) {
  const errors = []

  if (typeof html !== 'string') {
    return { valid: false, errors: ['HTML is not a string'] }
  }

  // Check for unclosed tags (basic check)
  const openTags = html.match(/<([a-z]+)(?:\s[^>]*)?>/gi) || []
  const closeTags = html.match(/<\/([a-z]+)>/gi) || []

  // Self-closing tags don't need closing tags
  const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link']
  const openTagNames = openTags
    .map(tag => tag.match(/<([a-z]+)/i)?.[1]?.toLowerCase())
    .filter(tag => tag && !selfClosing.includes(tag))

  const closeTagNames = closeTags
    .map(tag => tag.match(/<\/([a-z]+)/i)?.[1]?.toLowerCase())
    .filter(Boolean)

  // Basic tag balance check
  const tagCounts = {}
  openTagNames.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1
  })
  closeTagNames.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) - 1
  })

  Object.entries(tagCounts).forEach(([tag, count]) => {
    if (count !== 0) {
      errors.push(`Unbalanced <${tag}> tags (${count > 0 ? 'unclosed' : 'extra closing'})`)
    }
  })

  // Check for incomplete tags
  if (/<[^>]*$/.test(html)) {
    errors.push('HTML ends with incomplete tag')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate cross-references use correct {type:label} format
 * @param {string} html - HTML string to check
 * @returns {Object} Validation result with {valid, references, invalidRefs}
 */
function validateCrossReferences(html) {
  if (typeof html !== 'string') {
    return { valid: true, references: [], invalidRefs: [] }
  }

  const references = []
  const invalidRefs = []

  // Look for showHelp spans (the proper format)
  const showHelpPattern = /<span class="showHelp" data-type="([^"]+)" data-id="([^"]+)">([^<]+)<\/span>/g
  let match
  while ((match = showHelpPattern.exec(html)) !== null) {
    references.push({
      type: match[1],
      id: match[2],
      text: match[3]
    })
  }

  // Look for old-style {type:label} references that should have been converted
  const oldStylePattern = /\{([a-z]+):([^}]+)\}/gi
  while ((match = oldStylePattern.exec(html)) !== null) {
    invalidRefs.push({
      raw: match[0],
      type: match[1],
      label: match[2]
    })
  }

  return {
    valid: invalidRefs.length === 0,
    references,
    invalidRefs
  }
}

/**
 * Validate tab structure for complex entities
 * @param {Object|string} result - Generator result
 * @returns {Object} Validation result
 */
function validateTabStructure(result) {
  if (typeof result === 'string') {
    // Simple string result, no tabs - this is valid
    return { valid: true, hasMultipleTabs: false, tabs: [] }
  }

  if (typeof result !== 'object' || result === null) {
    return { valid: false, error: 'Result is not an object or string' }
  }

  const tabs = Object.keys(result)
  const hasMultipleTabs = tabs.length > 1

  // Check that all values are strings
  const nonStringTabs = tabs.filter(tab => typeof result[tab] !== 'string')
  if (nonStringTabs.length > 0) {
    return {
      valid: false,
      error: `Tabs contain non-string values: ${nonStringTabs.join(', ')}`
    }
  }

  return {
    valid: true,
    hasMultipleTabs,
    tabs
  }
}

/**
 * Run all validations on a generator result
 * @param {Object|string} result - Generator result
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @returns {Object} Complete validation results
 */
function runAllValidations(result, entityType, entityId) {
  const validations = {
    entityType,
    entityId,
    result: {
      type: typeof result,
      isNull: result === null
    },
    tabStructure: validateTabStructure(result),
    html: { valid: true, errors: [] },
    crossReferences: { valid: true, references: [], invalidRefs: [] }
  }

  // Extract HTML strings for validation
  const htmlStrings = []
  if (typeof result === 'string') {
    htmlStrings.push(result)
  } else if (typeof result === 'object' && result !== null) {
    Object.values(result).forEach(value => {
      if (typeof value === 'string') {
        htmlStrings.push(value)
      }
    })
  }

  // Validate each HTML string
  htmlStrings.forEach(html => {
    const htmlValidation = validateHTML(html)
    if (!htmlValidation.valid) {
      validations.html.valid = false
      validations.html.errors.push(...htmlValidation.errors)
    }

    const refValidation = validateCrossReferences(html)
    if (!refValidation.valid) {
      validations.crossReferences.valid = false
      validations.crossReferences.invalidRefs.push(...refValidation.invalidRefs)
    }
    validations.crossReferences.references.push(...refValidation.references)
  })

  return validations
}

// ============================================================================
// TEST SETUP
// ============================================================================

/**
 * Load test data into database
 * This loads all necessary entities for testing relationships
 */
async function loadTestData() {
  // Load all entity types from all-data.json
  const fs = await import('fs')
  const path = await import('path')
  const { fileURLToPath } = await import('url')

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const dataPath = path.join(__dirname, '../../data/all-data.json')
  const allData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

  // Load each entity type
  const entityTypes = [
    'book', 'characteristic', 'god', 'lore', 'star', 'etat',
    'psychologie', 'magick', 'quality', 'trait', 'tree', 'creature'
  ]

  for (const type of entityTypes) {
    const data = allData[type]
    if (data && Array.isArray(data) && data.length > 0) {
      // Normalize data: ensure each item has an id field
      const normalizedData = data.map(item => ({
        ...item,
        id: item.id || item.label || item.name
      }))

      const tableName = type === 'psychologie' ? 'psychologies' : `${type}s`
      await db[tableName].bulkAdd(normalizedData)
    }
  }
}

// ============================================================================
// GENERATOR TESTS
// ============================================================================

describe('New Entity Description Generators (Issue #36)', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    await loadTestData()
  })

  afterEach(async () => {
    await db.close()
  })

  // ==========================================================================
  // 1. CHARACTERISTIC
  // ==========================================================================
  describe('Characteristic Description Generator', () => {
    TEST_ENTITIES.characteristic.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('characteristic', id)

        // Basic checks
        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        // Run validations
        const validation = runAllValidations(result, 'characteristic', id)

        // Tab structure
        expect(validation.tabStructure.valid).toBe(true)

        // HTML validation
        if (!validation.html.valid) {
          console.error(`HTML validation failed for ${label}:`, validation.html.errors)
        }
        expect(validation.html.valid).toBe(true)

        // Cross-reference validation
        if (!validation.crossReferences.valid) {
          console.error(`Cross-reference validation failed for ${label}:`, validation.crossReferences.invalidRefs)
        }
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing characteristic gracefully', async () => {
      const result = await generateDescription('characteristic', 'non-existent-characteristic')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 2. GOD
  // ==========================================================================
  describe('God Description Generator', () => {
    TEST_ENTITIES.god.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('god', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'god', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing god gracefully', async () => {
      const result = await generateDescription('god', 'non-existent-god')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 3. LORE
  // ==========================================================================
  describe('Lore Description Generator', () => {
    TEST_ENTITIES.lore.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('lore', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'lore', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing lore gracefully', async () => {
      const result = await generateDescription('lore', 'non-existent-lore')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 4. STAR
  // ==========================================================================
  describe('Star Description Generator', () => {
    TEST_ENTITIES.star.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('star', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'star', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing star gracefully', async () => {
      const result = await generateDescription('star', 'non-existent-star')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 5. ETAT
  // ==========================================================================
  describe('Etat Description Generator', () => {
    TEST_ENTITIES.etat.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('etat', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'etat', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing etat gracefully', async () => {
      const result = await generateDescription('etat', 'non-existent-etat')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 6. PSYCHOLOGIE
  // ==========================================================================
  describe('Psychologie Description Generator', () => {
    TEST_ENTITIES.psychologie.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('psychologie', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'psychologie', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing psychologie gracefully', async () => {
      const result = await generateDescription('psychologie', 'non-existent-psychologie')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 7. MAGICK
  // ==========================================================================
  describe('Magick Description Generator', () => {
    TEST_ENTITIES.magick.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('magick', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'magick', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing magick gracefully', async () => {
      const result = await generateDescription('magick', 'non-existent-magick')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 8. QUALITY
  // ==========================================================================
  describe('Quality Description Generator', () => {
    TEST_ENTITIES.quality.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('quality', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'quality', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing quality gracefully', async () => {
      const result = await generateDescription('quality', 'non-existent-quality')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 9. TRAIT
  // ==========================================================================
  describe('Trait Description Generator', () => {
    TEST_ENTITIES.trait.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('trait', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'trait', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing trait gracefully', async () => {
      const result = await generateDescription('trait', 'non-existent-trait')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 10. TREE
  // ==========================================================================
  describe('Tree Description Generator', () => {
    TEST_ENTITIES.tree.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('tree', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'tree', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing tree gracefully', async () => {
      const result = await generateDescription('tree', 'non-existent-tree')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 11. CREATURE
  // ==========================================================================
  describe('Creature Description Generator', () => {
    TEST_ENTITIES.creature.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('creature', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'creature', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing creature gracefully', async () => {
      const result = await generateDescription('creature', 'non-existent-creature')
      expect(result).toBeNull()
    })
  })

  // ==========================================================================
  // 12. BOOK
  // ==========================================================================
  describe('Book Description Generator', () => {
    TEST_ENTITIES.book.forEach(({ id, label }) => {
      it(`should generate description for ${label}`, async () => {
        const result = await generateDescription('book', id)

        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        const validation = runAllValidations(result, 'book', id)

        expect(validation.tabStructure.valid).toBe(true)
        expect(validation.html.valid).toBe(true)
        expect(validation.crossReferences.valid).toBe(true)
      })
    })

    it('should handle missing book gracefully', async () => {
      const result = await generateDescription('book', 'non-existent-book')
      expect(result).toBeNull()
    })
  })
})

// ============================================================================
// VALIDATION UTILITIES TESTS
// ============================================================================

describe('Validation Utilities', () => {
  describe('validateHTML', () => {
    it('should pass valid HTML', () => {
      const html = '<div><b>Test</b> content</div>'
      const result = validateHTML(html)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect unclosed tags', () => {
      const html = '<div><b>Test</b> content'
      const result = validateHTML(html)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should allow self-closing tags', () => {
      const html = '<div>Test<br>content</div>'
      const result = validateHTML(html)
      expect(result.valid).toBe(true)
    })

    it('should detect incomplete tags', () => {
      const html = '<div>Test<b'
      const result = validateHTML(html)
      expect(result.valid).toBe(false)
    })
  })

  describe('validateCrossReferences', () => {
    it('should detect showHelp spans', () => {
      const html = '<span class="showHelp" data-type="skill" data-id="combat">Combat</span>'
      const result = validateCrossReferences(html)
      expect(result.valid).toBe(true)
      expect(result.references).toHaveLength(1)
      expect(result.references[0].type).toBe('skill')
    })

    it('should detect invalid old-style references', () => {
      const html = 'You gain {skill:Combat} bonus'
      const result = validateCrossReferences(html)
      expect(result.valid).toBe(false)
      expect(result.invalidRefs).toHaveLength(1)
    })

    it('should handle text without references', () => {
      const html = '<div>Plain text content</div>'
      const result = validateCrossReferences(html)
      expect(result.valid).toBe(true)
      expect(result.references).toHaveLength(0)
    })
  })

  describe('validateTabStructure', () => {
    it('should validate string result', () => {
      const result = validateTabStructure('Simple string result')
      expect(result.valid).toBe(true)
      expect(result.hasMultipleTabs).toBe(false)
    })

    it('should validate object with tabs', () => {
      const obj = {
        Info: 'Info content',
        Stats: 'Stats content'
      }
      const result = validateTabStructure(obj)
      expect(result.valid).toBe(true)
      expect(result.hasMultipleTabs).toBe(true)
      expect(result.tabs).toContain('Info')
      expect(result.tabs).toContain('Stats')
    })

    it('should detect non-string tab values', () => {
      const obj = {
        Info: 'Valid',
        Stats: 123
      }
      const result = validateTabStructure(obj)
      expect(result.valid).toBe(false)
    })
  })
})
