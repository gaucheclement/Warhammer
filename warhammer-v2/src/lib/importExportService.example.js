/**
 * ImportExportService - Usage Examples
 *
 * This file demonstrates how to use the ImportExportService
 * with different configurations for characters and modifications.
 */

import {
  createCharacterService,
  createModificationsService,
  createBatchCharactersService
} from './importExportConfigs.js'

/**
 * EXAMPLE 1: Export a Single Character
 */
export async function exportCharacterExample() {
  const characterService = createCharacterService()

  const character = {
    name: 'Sigmar le Vaillant',
    species: { id: 'human', name: 'Humain' },
    career: { id: 'warrior', name: 'Guerrier' },
    characteristics: {
      WS: 40,
      BS: 30,
      S: 35,
      T: 35,
      I: 30,
      Ag: 30,
      Dex: 30,
      Int: 30,
      WP: 30,
      Fel: 30
    },
    skills: [
      { id: 'melee-basic', name: 'Mêlée (Base)', advances: 5 }
    ],
    talents: [
      { id: 'strike-mighty-blow', name: 'Coup Puissant', description: '+1 dégâts' }
    ],
    spells: [],
    trappings: [
      { id: 'sword', name: 'Épée', quantity: 1 }
    ],
    experience: {
      current: 100,
      spent: 50,
      total: 150
    },
    wounds: {
      current: 12,
      max: 12
    },
    fate: {
      current: 3,
      max: 3
    },
    resilience: {
      current: 2,
      max: 2
    },
    appearance: {
      eyes: 'Bleus',
      hair: 'Blonds',
      distinguishing: 'Cicatrice sur le front'
    },
    notes: 'Un guerrier courageux',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    isDraft: false
  }

  // Export and download
  const result = characterService.exportAndDownload(character)

  if (result.success) {
    console.log(`✓ Personnage exporté: ${result.filename}`)
    console.log(`  Taille: ${result.json.length} octets`)
  } else {
    console.error('✗ Erreur d\'exportation:', result.errors)
  }

  return result
}

/**
 * EXAMPLE 2: Import a Character from File
 */
export async function importCharacterExample(file) {
  const characterService = createCharacterService()

  // Import with validation and sanitization
  const result = await characterService.importFromFile(file, {
    validate: true,
    sanitize: true,
    context: {
      existingCharacters: [],  // List of existing characters for ID conflict detection
      mergedData: null         // Game data for validation
    }
  })

  if (result.success) {
    console.log('✓ Personnage importé avec succès')
    console.log(`  Nom: ${result.data.character.name}`)
    console.log(`  Espèce: ${result.data.character.species.name}`)
    console.log(`  Carrière: ${result.data.character.career.name}`)

    if (result.warnings.length > 0) {
      console.warn('  Avertissements:', result.warnings)
    }

    return result.data.character
  } else {
    console.error('✗ Erreur d\'importation:', result.errors)
    return null
  }
}

/**
 * EXAMPLE 3: Export Multiple Characters (Batch)
 */
export async function exportBatchCharactersExample() {
  const batchService = createBatchCharactersService()

  const characters = [
    {
      name: 'Sigmar le Vaillant',
      species: { id: 'human', name: 'Humain' },
      career: { id: 'warrior', name: 'Guerrier' },
      // ... other fields
    },
    {
      name: 'Elara la Sage',
      species: { id: 'elf', name: 'Elfe' },
      career: { id: 'wizard', name: 'Sorcier' },
      // ... other fields
    }
  ]

  const result = batchService.exportAndDownload(characters)

  if (result.success) {
    console.log(`✓ ${characters.length} personnages exportés: ${result.filename}`)
  } else {
    console.error('✗ Erreur d\'exportation:', result.errors)
  }

  return result
}

/**
 * EXAMPLE 4: Export Custom Modifications
 */
export async function exportModificationsExample() {
  const modificationsService = createModificationsService()

  const modifications = {
    talents: [
      {
        id: 'custom-talent-1',
        name: 'Talent Personnalisé',
        description: 'Un talent créé par l\'utilisateur',
        maxRank: 1,
        tests: '',
        isCustom: true
      }
    ],
    careers: [
      {
        id: 'custom-career-1',
        name: 'Carrière Personnalisée',
        class: 'Guerrier',
        species: ['human'],
        isCustom: true
      }
    ],
    skills: [],
    spells: []
    // ... other entity types
  }

  const result = modificationsService.exportAndDownload(modifications, {
    metadata: {
      author: 'Jean Dupont',
      description: 'Mes modifications personnalisées'
    }
  })

  if (result.success) {
    console.log(`✓ Modifications exportées: ${result.filename}`)

    // Count modifications
    const count = Object.values(modifications)
      .filter(Array.isArray)
      .reduce((sum, arr) => sum + arr.length, 0)
    console.log(`  Total: ${count} modifications`)
  } else {
    console.error('✗ Erreur d\'exportation:', result.errors)
  }

  return result
}

/**
 * EXAMPLE 5: Import Modifications from File
 */
export async function importModificationsExample(file) {
  const modificationsService = createModificationsService()

  const result = await modificationsService.importFromFile(file, {
    validate: true,
    sanitize: false  // Modifications are typically game data, less sanitization needed
  })

  if (result.success) {
    console.log('✓ Modifications importées avec succès')

    // Show what was imported
    const entityTypes = Object.keys(result.data.modifications)
    console.log(`  Types d'entités: ${entityTypes.join(', ')}`)

    for (const entityType of entityTypes) {
      const count = result.data.modifications[entityType].length
      console.log(`  ${entityType}: ${count} entrées`)
    }

    if (result.warnings.length > 0) {
      console.warn('  Avertissements:', result.warnings)
    }

    return result.data.modifications
  } else {
    console.error('✗ Erreur d\'importation:', result.errors)
    return null
  }
}

/**
 * EXAMPLE 6: Preview Import (without saving)
 */
export async function previewImportExample(file) {
  const characterService = createCharacterService()

  // Import without saving to preview the data
  const result = await characterService.importFromFile(file, {
    validate: true,
    sanitize: true
  })

  if (result.success) {
    console.log('✓ Aperçu de l\'import:')
    console.log(`  Type: ${result.metadata.type}`)
    console.log(`  Version: ${result.metadata.version}`)
    console.log(`  Exporté le: ${result.metadata.exported}`)

    // Show character preview
    if (result.data.character) {
      console.log(`  Personnage: ${result.data.character.name}`)
      console.log(`  Espèce: ${result.data.character.species.name}`)
      console.log(`  Carrière: ${result.data.character.career.name}`)
    }

    if (result.warnings.length > 0) {
      console.warn('  Avertissements:')
      result.warnings.forEach(w => console.warn(`    - ${w}`))
    }

    return {
      canImport: result.success,
      data: result.data,
      metadata: result.metadata,
      warnings: result.warnings
    }
  } else {
    console.error('✗ Erreurs de validation:')
    result.errors.forEach(e => console.error(`    - ${e}`))
    return {
      canImport: false,
      errors: result.errors
    }
  }
}

/**
 * EXAMPLE 7: Custom Service Configuration
 */
export function createCustomServiceExample() {
  const { ImportExportService, createValidator, createTransformer, createFilenameGenerator } = require('./importExportService.js')

  const customService = new ImportExportService({
    type: 'warhammer-custom-data',
    version: '1.0',

    validator: createValidator((data, options) => {
      const errors = []
      const warnings = []

      // Custom validation logic
      if (options.mode === 'export') {
        if (!data.customField) {
          errors.push('customField est requis')
        }
      } else if (options.mode === 'import') {
        if (!data.importedField) {
          warnings.push('importedField est manquant')
        }
      }

      return { valid: errors.length === 0, errors, warnings }
    }),

    transformer: createTransformer((data) => {
      // Transform data for export
      return {
        customField: data.customField,
        additionalInfo: 'Transformé',
        timestamp: Date.now()
      }
    }),

    filenameGenerator: createFilenameGenerator(
      'custom',
      (data) => data.customField  // Extract name from data
    ),

    sanitizer: (data) => {
      // Sanitize imported data
      return {
        ...data,
        sanitized: true
      }
    },

    maxFileSizeMB: 5  // 5MB limit
  })

  return customService
}

/**
 * EXAMPLE 8: Error Handling
 */
export async function errorHandlingExample() {
  const characterService = createCharacterService()

  // Attempt to export invalid character
  const invalidCharacter = {
    // Missing required fields
  }

  const exportResult = characterService.export(invalidCharacter)

  if (!exportResult.success) {
    console.error('Erreurs d\'exportation:')
    exportResult.errors.forEach((error, index) => {
      console.error(`  ${index + 1}. ${error}`)
    })
  }

  // Attempt to import invalid JSON
  const invalidJson = '{ invalid json'
  const importResult = characterService.import(invalidJson)

  if (!importResult.success) {
    console.error('Erreurs d\'importation:')
    importResult.errors.forEach((error, index) => {
      console.error(`  ${index + 1}. ${error}`)
    })
  }

  // Handle file size limit
  const largeFile = new File(
    ['x'.repeat(20 * 1024 * 1024)],  // 20MB
    'large.json'
  )

  const fileResult = await characterService.importFromFile(largeFile)

  if (!fileResult.success) {
    console.error('Erreur de taille de fichier:')
    console.error(`  ${fileResult.errors[0]}`)
  }
}

// Export all examples
export default {
  exportCharacterExample,
  importCharacterExample,
  exportBatchCharactersExample,
  exportModificationsExample,
  importModificationsExample,
  previewImportExample,
  createCustomServiceExample,
  errorHandlingExample
}
