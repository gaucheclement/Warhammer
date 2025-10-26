/**
 * Data Layer Tests
 *
 * Basic tests for the data layer functionality
 * Note: These are manual tests for verification. A proper test framework
 * would require additional setup (Vitest, Jest, etc.)
 */

import { mergeData, mergeEntityType, createCustomEntry, generateCustomId } from '../dataMerger.js'
import { search, getAutocompleteSuggestions } from '../search.js'
import { validateEntry, validateImportData } from '../validation.js'
import { createEntry, updateEntry, deleteEntry } from '../dataOperations.js'

/**
 * Test data merging
 */
export function testDataMerging() {
  console.log('Testing data merging...')

  const official = [
    { id: 1, label: 'Sword', type: 'weapon', isOfficial: true },
    { id: 2, label: 'Shield', type: 'armor', isOfficial: true }
  ]

  const custom = [
    { id: 1, label: 'Magic Sword', type: 'weapon' }, // Override official
    { id: 3, label: 'Potion', type: 'consumable' } // New custom entry
  ]

  const merged = mergeEntityType(official, custom)

  console.assert(merged.length === 3, 'Should have 3 entries')
  console.assert(merged[0].label === 'Magic Sword', 'Should override official entry')
  console.assert(merged[0].isModified === true, 'Should be marked as modified')
  console.assert(merged.some((e) => e.label === 'Potion'), 'Should include custom entry')

  console.log('✓ Data merging tests passed')
}

/**
 * Test custom ID generation
 */
export function testCustomIdGeneration() {
  console.log('Testing custom ID generation...')

  const id1 = generateCustomId('talents')
  const id2 = generateCustomId('talents')

  console.assert(id1.startsWith('custom_talents_'), 'ID should have correct prefix')
  console.assert(id1 !== id2, 'IDs should be unique')

  console.log('✓ Custom ID generation tests passed')
}

/**
 * Test validation
 */
export function testValidation() {
  console.log('Testing validation...')

  // Valid entry
  const validEntry = {
    id: 1,
    label: 'Test Talent',
    description: 'A test talent',
    maxRank: 3
  }

  const validResult = validateEntry('talents', validEntry)
  console.assert(validResult.valid === true, 'Valid entry should pass validation')

  // Invalid entry (missing required field)
  const invalidEntry = {
    id: 2,
    description: 'Missing label'
  }

  const invalidResult = validateEntry('talents', invalidEntry)
  console.assert(invalidResult.valid === false, 'Invalid entry should fail validation')
  console.assert(invalidResult.errors.length > 0, 'Should have validation errors')

  console.log('✓ Validation tests passed')
}

/**
 * Test search functionality
 */
export function testSearch() {
  console.log('Testing search functionality...')

  const testData = [
    { id: 1, label: 'Animal Care', description: 'Care for animals' },
    { id: 2, label: 'Art', description: 'Create beautiful art' },
    { id: 3, label: 'Charm Animal', description: 'Charm wild animals' },
    { id: 4, label: 'Drive', description: 'Drive vehicles' }
  ]

  const results = search('skills', testData, 'animal')

  console.assert(results.length > 0, 'Should find matching results')
  console.assert(
    results.some((r) => r.item.label === 'Animal Care'),
    'Should find "Animal Care"'
  )
  console.assert(
    results.some((r) => r.item.label === 'Charm Animal'),
    'Should find "Charm Animal"'
  )

  // Test with limit
  const limitedResults = search('skills', testData, 'a', { limit: 2 })
  console.assert(limitedResults.length <= 2, 'Should respect limit')

  console.log('✓ Search tests passed')
}

/**
 * Test autocomplete
 */
export function testAutocomplete() {
  console.log('Testing autocomplete...')

  const testData = [
    { id: 1, label: 'Animal Care' },
    { id: 2, label: 'Art' },
    { id: 3, label: 'Charm Animal' }
  ]

  const suggestions = getAutocompleteSuggestions('skills', testData, 'ani', 5)

  console.assert(Array.isArray(suggestions), 'Should return an array')
  console.assert(suggestions.length > 0, 'Should have suggestions')
  console.assert(suggestions.includes('Animal Care'), 'Should suggest "Animal Care"')

  console.log('✓ Autocomplete tests passed')
}

/**
 * Test import data validation
 */
export function testImportValidation() {
  console.log('Testing import data validation...')

  const validData = {
    talents: [
      { id: 1, label: 'Test Talent 1', description: 'Test' },
      { id: 2, label: 'Test Talent 2', description: 'Test' }
    ],
    skills: [
      { id: 1, label: 'Test Skill', description: 'Test' }
    ]
  }

  const validResult = validateImportData(validData)
  console.assert(validResult.valid === true, 'Valid data should pass validation')

  const invalidData = {
    talents: [
      { id: 1 } // Missing required 'label' field
    ]
  }

  const invalidResult = validateImportData(invalidData)
  console.assert(invalidResult.valid === false, 'Invalid data should fail validation')

  console.log('✓ Import validation tests passed')
}

/**
 * Test performance with large dataset
 */
export function testSearchPerformance() {
  console.log('Testing search performance...')

  // Generate 1000 test entries
  const largeDataset = []
  for (let i = 0; i < 1000; i++) {
    largeDataset.push({
      id: i,
      label: `Entry ${i}`,
      description: `Description for entry ${i}`
    })
  }

  // Add some specific entries to search for
  largeDataset[500].label = 'Animal Care'
  largeDataset[750].label = 'Charm Animal'

  const startTime = performance.now()
  const results = search('skills', largeDataset, 'animal')
  const endTime = performance.now()
  const duration = endTime - startTime

  console.assert(results.length > 0, 'Should find results in large dataset')
  console.assert(duration < 300, `Search should be < 300ms (was ${duration.toFixed(2)}ms)`)

  console.log(`✓ Search performance test passed (${duration.toFixed(2)}ms)`)
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('=== Running Data Layer Tests ===\n')

  try {
    testDataMerging()
    testCustomIdGeneration()
    testValidation()
    testSearch()
    testAutocomplete()
    testImportValidation()
    testSearchPerformance()

    console.log('\n=== All tests passed! ===')
    return true
  } catch (error) {
    console.error('\n=== Test failed! ===')
    console.error(error)
    return false
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.runDataLayerTests = runAllTests
}
