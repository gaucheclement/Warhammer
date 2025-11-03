# ImportExportService - Service Générique d'Import/Export

## Vue d'ensemble

Le `ImportExportService` est un service générique qui abstrait les patterns communs trouvés dans les 4 fichiers d'import/export existants (~1418 lignes).

## Patterns Abstraits

### 1. Téléchargement JSON
**Avant (répété dans 3 fichiers):**
```javascript
// characterExport.js (lignes 83-104)
export function downloadJSON(jsonString, filename) {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

**Après (dans le service):**
```javascript
// Utilisé automatiquement par exportAndDownload()
service.downloadJSON(json, filename)
```

**Gain:** 22 lignes × 3 fichiers = **66 lignes éliminées**

### 2. Validation de Fichier
**Avant (répété dans 2 fichiers):**
```javascript
// importModifications.js (lignes 41-95)
export async function validateImportFile(file) {
  // Check file type
  if (!file.name.endsWith('.json')) {
    return { valid: false, error: 'File must be a JSON file (.json)', data: null }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit', data: null }
  }

  // Read and parse...
}
```

**Après:**
```javascript
// Intégré dans importFromFile()
await service.importFromFile(file)
```

**Gain:** 55 lignes × 2 fichiers = **110 lignes éliminées**

### 3. Gestion des Métadonnées
**Avant (répété dans 4 fichiers):**
```javascript
// Pattern dans chaque fichier
const exportData = {
  _exported: new Date().toISOString(),
  _version: EXPORT_VERSION,
  _type: 'warhammer-character',
  // ... data
}
```

**Après:**
```javascript
// Automatiquement ajouté par le service
service.export(data) // Métadonnées ajoutées automatiquement
```

**Gain:** ~15 lignes × 4 fichiers = **60 lignes éliminées**

### 4. Parse et Validation JSON
**Avant:**
```javascript
// characterImport.js (lignes 27-101)
export function parseCharacterJSON(jsonString) {
  const errors = []
  const warnings = []

  // Check if JSON string is valid
  if (!jsonString || typeof jsonString !== 'string') {
    return { success: false, errors: ['Invalid JSON string provided'] }
  }

  // Attempt to parse JSON
  let parsed
  try {
    parsed = JSON.parse(jsonString)
  } catch (error) {
    return { success: false, errors: [`Invalid JSON syntax: ${error.message}`] }
  }

  // ... plus 60 lignes de validation
}
```

**Après:**
```javascript
const result = service.import(jsonString)
// Parse, validation, et extraction de métadonnées en une seule fonction
```

**Gain:** ~75 lignes × 2 fichiers = **150 lignes éliminées**

### 5. Gestion d'Erreurs Standardisée
**Avant (pattern répété):**
```javascript
try {
  // logic
  return { success: true, data, errors: [], warnings: [] }
} catch (error) {
  return { success: false, data: null, errors: [error.message], warnings: [] }
}
```

**Après:**
```javascript
// Automatiquement géré par le service
// Format de retour cohérent pour toutes les opérations
```

**Gain:** ~20 lignes × 4 fichiers = **80 lignes éliminées**

## Gain Total Potentiel

| Pattern | Lignes Éliminées |
|---------|-----------------|
| Téléchargement JSON | 66 |
| Validation de Fichier | 110 |
| Gestion des Métadonnées | 60 |
| Parse et Validation JSON | 150 |
| Gestion d'Erreurs | 80 |
| Autres duplications | ~50 |
| **TOTAL** | **~516 lignes** |

**Réduction:** De 1418 lignes à environ **900 lignes** (36% de réduction)

## Usage

### Configuration pour Personnages

```javascript
import { createCharacterService } from './importExportConfigs.js'

const characterService = createCharacterService()

// Export
const result = characterService.exportAndDownload(character)
if (!result.success) {
  console.error(result.errors)
}

// Import
const importResult = await characterService.importFromFile(file, {
  context: { existingCharacters, mergedData }
})
if (importResult.success) {
  // Utiliser importResult.data.character
}
```

### Configuration pour Modifications

```javascript
import { createModificationsService } from './importExportConfigs.js'

const modificationsService = createModificationsService()

// Export
const result = modificationsService.exportAndDownload(modifications)

// Import
const importResult = await modificationsService.importFromFile(file)
```

### Configuration Personnalisée

```javascript
import { ImportExportService, createValidator, createTransformer, createFilenameGenerator } from './importExportService.js'

const customService = new ImportExportService({
  type: 'my-custom-type',
  version: '1.0',
  validator: createValidator((data, options) => {
    // Logique de validation
    return { valid: true, errors: [], warnings: [] }
  }),
  transformer: createTransformer((data) => {
    // Transformer les données pour l'export
    return { transformed: data }
  }),
  filenameGenerator: createFilenameGenerator('prefix', (data) => data.name),
  sanitizer: (data) => {
    // Nettoyer les données importées
    return sanitizedData
  },
  maxFileSizeMB: 10
})
```

## API du Service

### `export(data, options)`
Exporte les données au format JSON avec métadonnées.

**Options:**
- `metadata`: Métadonnées additionnelles à inclure
- `compact`: Utiliser format compact sans indentation

**Retour:**
```javascript
{
  success: boolean,
  data: Object | null,      // Données exportées avec métadonnées
  filename: string | null,
  json: string | null,
  errors: string[],
  warnings: string[]
}
```

### `import(jsonString, options)`
Importe et valide une chaîne JSON.

**Options:**
- `validate`: Exécuter la validation (défaut: true)
- `sanitize`: Nettoyer les données (défaut: true)
- `context`: Contexte additionnel pour la validation

**Retour:**
```javascript
{
  success: boolean,
  data: any | null,
  metadata: {
    exported: string,
    version: string,
    type: string
  } | null,
  errors: string[],
  warnings: string[]
}
```

### `importFromFile(file, options)`
Importe depuis un fichier avec validation de taille et type.

**Retour:** Même format que `import()`

### `exportAndDownload(data, options)`
Exporte et déclenche le téléchargement du navigateur.

**Retour:** Même format que `export()`

### `downloadJSON(jsonString, filename)`
Déclenche le téléchargement d'une chaîne JSON.

## Fonctions Helper

### `createValidator(validationFn)`
Crée un validateur avec gestion d'erreurs.

```javascript
const validator = createValidator((data, options) => {
  if (!data.name) {
    return { valid: false, errors: ['Name required'], warnings: [] }
  }
  return { valid: true, errors: [], warnings: [] }
})
```

### `createTransformer(transformFn)`
Crée un transformateur avec gestion d'erreurs.

```javascript
const transformer = createTransformer((data) => {
  return { transformed: true, ...data }
})
```

### `createFilenameGenerator(prefix, extractName)`
Crée un générateur de nom de fichier avec timestamp.

```javascript
const generator = createFilenameGenerator('character', (data) => data.name)
// Génère: character-john_smith-20250101-120000.json
```

## Tests

**33 tests** couvrant:
- Configuration et initialisation
- Export avec validation
- Import avec validation
- Gestion des fichiers
- Téléchargement
- Gestion d'erreurs
- Fonctions helper

```bash
npm test -- importExportService.test.js
```

**Résultat:** ✓ 33 tests passed

## Prochaines Étapes

1. **Phase 1:** Service créé et testé (✓)
2. **Phase 2:** Migrer `characterExport.js` pour utiliser le service
3. **Phase 3:** Migrer `characterImport.js` pour utiliser le service
4. **Phase 4:** Migrer `exportModifications.js` pour utiliser le service
5. **Phase 5:** Migrer `importModifications.js` pour utiliser le service
6. **Phase 6:** Supprimer le code dupliqué des fichiers originaux

## Avantages

1. **Réduction de Code:** ~36% de code en moins
2. **Maintenabilité:** Un seul endroit pour les bugs et améliorations
3. **Cohérence:** Format standardisé pour tous les imports/exports
4. **Testabilité:** Service isolé et facilement testable
5. **Extensibilité:** Facile d'ajouter de nouveaux types de données
6. **Réutilisabilité:** Patterns réutilisables pour de futures fonctionnalités

## Notes d'Implémentation

- Le service utilise des **fonctions de configuration** (validator, transformer, etc.) pour rester flexible
- Les **métadonnées** (_version, _exported, _type) sont automatiquement gérées
- La **validation** est optionnelle mais activée par défaut
- La **sanitisation** est optionnelle mais activée par défaut
- Les **erreurs** et **warnings** sont toujours retournés dans un format standardisé
- Le service est **framework-agnostic** (peut être utilisé avec n'importe quel framework)
