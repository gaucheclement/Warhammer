# Warhammer Fantasy 4e - Database Schema Documentation

## Overview

This document provides comprehensive documentation for the enriched IndexedDB schema used in the Warhammer Fantasy Roleplay 4th Edition application. The schema is implemented using Dexie.js and includes 23 entity types with rich relationships, transformation utilities, and description generation capabilities.

## Table of Contents

- [Schema Architecture](#schema-architecture)
- [Entity Types](#entity-types)
- [Relationship Patterns](#relationship-patterns)
- [Transformation Utilities](#transformation-utilities)
- [Description Generation](#description-generation)
- [Migration Guide](#migration-guide)
- [Code Examples](#code-examples)
- [API Documentation](#api-documentation)

## Schema Architecture

### Schema Version: v2

The database uses Dexie's version management system for schema evolution:

```javascript
db.version(1).stores({ ... }) // v1 - minimal schema (deprecated)
db.version(2).stores({ ... }) // v2 - enhanced schema (current)
```

### Key Features

- **Compound Indexes**: Enable efficient relationship queries
- **Multi-Entry Indexes**: Support querying array fields (specs, skills, talents)
- **Rich Metadata**: Every entity includes book, page, folder, and desc fields
- **Hierarchical Organization**: Folder-based tree structures
- **Specialization Support**: Array-based specs for talents and skills

## Entity Types

### 1. Books

Source books and references

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Book name
- `abr` - Abbreviation (e.g., "WFRP", "EIS")
- `language` - Language code
- `folder` - Hierarchical organization
- `desc` - Description

**Indexes:** `id`, `label`, `abr`, `language`, `folder`

**Example:**
```javascript
{
  id: 'core',
  label: 'Core Rulebook',
  abr: 'WFRP',
  language: 'fr',
  folder: 'official'
}
```

### 2. Careers

Character careers and professions

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Career name
- `class` - Reference to classes table
- `rand` - Object with species probability weights
- `subRand` - Sub-probability for career selection
- `book`, `page`, `folder`, `desc` - Metadata

**Indexes:** `id`, `label`, `class`, `book`, `page`, `folder`

**Relationships:**
- `class` → `classes` (many-to-one)
- `species` via rand keys → `species` (many-to-many)
- `careerLevels` ← (one-to-many)

**Example:**
```javascript
{
  id: 'soldier',
  label: 'Soldat',
  class: 'warriors',
  rand: { human: 100, dwarf: 80, halfling: 0 },
  book: 'core',
  page: '45'
}
```

### 3. Career Levels

Progression levels within careers

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Level name
- `career` - Reference to careers table
- `careerLevel` - Level number (1-4)
- `status` - Career status (e.g., "Bronze 1", "Silver 3")
- `skills` - Array of skill IDs
- `talents` - Array of talent IDs
- `characteristics` - Array of characteristic IDs
- `trappings` - Array of trapping IDs or strings
- `book`, `page`, `folder` - Metadata

**Indexes:** `id`, `label`, `[career+careerLevel]` (compound), `career`, `careerLevel`, `status`, `book`, `page`, `folder`

**Relationships:**
- `career` → `careers` (many-to-one)
- `skills` → `skills[]` (many-to-many)
- `talents` → `talents[]` (many-to-many)
- `characteristics` → `characteristics[]` (many-to-many)
- `trappings` → `trappings[]` (many-to-many)

**Example:**
```javascript
{
  id: 'soldier|recrue',
  label: 'Recrue',
  career: 'soldier',
  careerLevel: 1,
  status: 'Bronze 1',
  skills: ['athletics', 'combat-melee', 'endurance'],
  talents: ['strike-mighty'],
  characteristics: ['ws', 's', 't']
}
```

### 4. Species

Character races

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Species name
- `refCareer` - Reference career ID
- `refDetail` - Reference detail ID
- `refChar` - Reference characteristics
- `book`, `page`, `desc`, `folder` - Metadata

**Indexes:** `id`, `label`, `refCareer`, `refDetail`, `refChar`, `book`, `page`, `folder`

**Example:**
```javascript
{
  id: 'human',
  label: 'Humain',
  refCareer: 'human-careers',
  refChar: 'human-chars',
  book: 'core',
  page: '20'
}
```

### 5. Classes

Career classes (social status groups)

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Class name (e.g., "Guerriers", "Bourgeois")
- `trappings` - Array of starting possessions
- `book`, `page`, `desc`, `folder` - Metadata

**Indexes:** `id`, `label`, `book`, `page`, `folder`

**Example:**
```javascript
{
  id: 'warriors',
  label: 'Guerriers',
  trappings: ['sword', 'shield', 'leather-armor'],
  book: 'core',
  page: '30'
}
```

### 6. Talents

Character talents and abilities

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Talent name
- `max` - Maximum rank (string, e.g., "1", "Int Bonus")
- `test` - Required test description
- `specs` - Array of specializations
- `addSkill` - Grants skill ID
- `addTalent` - Grants talent ID
- `book`, `page`, `desc`, `folder` - Metadata

**Indexes:** `id`, `label`, `max`, `test`, `*specs` (multi-entry), `addSkill`, `addTalent`, `book`, `page`, `folder`

**Relationships:**
- `addSkill` → `skills` (one-to-one)
- `addTalent` → `talents` (one-to-one)

**Example:**
```javascript
{
  id: 'ambidextrous',
  label: 'Ambidextre',
  max: '1',
  test: 'None',
  specs: [],
  desc: 'Can use both hands equally well',
  book: 'core',
  page: '120'
}
```

### 7. Skills

Character skills and competencies

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Skill name
- `characteristic` - Reference to characteristics table
- `type` - Skill type (base/advanced)
- `advanced` - Boolean flag
- `specs` - Array of specializations
- `example` - Usage examples
- `book`, `page`, `desc`, `folder` - Metadata

**Indexes:** `id`, `label`, `characteristic`, `type`, `advanced`, `*specs` (multi-entry), `book`, `page`, `folder`

**Relationships:**
- `characteristic` → `characteristics` (many-to-one)

**Example:**
```javascript
{
  id: 'athletics',
  label: 'Athlétisme',
  characteristic: 'ag',
  type: 'base',
  advanced: false,
  specs: ['Climbing', 'Swimming'],
  desc: 'Physical prowess and coordination',
  book: 'core',
  page: '95'
}
```

### 8. Characteristics

Character attributes (M, WS, BS, S, T, I, Ag, Dex, Int, WP, Fel)

**Fields:**
- `id` (primary) - Unique identifier (e.g., "ag", "ws")
- `label` - Full name (e.g., "Agilité", "Weapon Skill")
- `abr` - Abbreviation (e.g., "Ag", "WS")
- `type` - Type classification
- `rand` - Random generation object
- `book`, `page`, `desc`, `folder` - Metadata

**Indexes:** `id`, `label`, `abr`, `type`, `book`, `page`, `folder`

### 9. Spells

Magic spells and prayers

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Spell name
- `type` - Magic type (arcane, divine, chaos, etc.)
- `subType` - Sub-type classification
- `cn` - Casting number
- `range` - Spell range
- `target` - Target type
- `duration` - Effect duration
- `book`, `page`, `desc`, `folder` - Metadata

**Indexes:** `id`, `label`, `type`, `subType`, `cn`, `range`, `target`, `duration`, `book`, `page`, `folder`

**Relationships:**
- Lore relationship through `lores` table

### 10. Trappings

Equipment, weapons, armor, and items

**Fields:**
- `id` (primary) - Unique identifier
- `label` - Item name
- `type` - Item category (weapon, armor, container, etc.)
- `subType` - Sub-category
- `gold`, `silver`, `bronze` - Price components
- `availability` - Availability rating
- `enc` - Encumbrance value
- **Weapon stats**: `reach`, `damage`
- **Armor stats**: `loc` (locations), `pa` (armor points)
- **Container stats**: `carry` (capacity)
- **Vehicle stats**: `mode`, `toughness`, `wounds`
- `book`, `page`, `desc`, `folder` - Metadata

**Indexes:** `id`, `label`, `type`, `subType`, `availability`, `book`, `page`, `folder`

### 11-23. Additional Entity Types

- **Creatures** - NPCs and monsters with full statistics
- **Stars** - Astrological signs for character generation
- **Gods** - Deities and divine powers
- **Eyes** - Eye color options for character generation
- **Hairs** - Hair color options for character generation
- **Details** - Physical details for character generation
- **Traits** - Creature traits and special abilities
- **Lores** - Magic lore traditions
- **Magicks** - Magic domains/traditions
- **Etats** - Conditions and status effects
- **Psychologies** - Mental conditions
- **Qualities** - Weapon and armor qualities
- **Trees** - Folder hierarchy for data organization

## Relationship Patterns

### Forward Relationships (Entity → Related Entities)

#### Career → Class
```javascript
import { getCareerClass } from './db-relations.js'

const classObj = await getCareerClass('soldier')
// Returns: { id: 'warriors', label: 'Guerriers', ... }
```

#### Career → Levels
```javascript
import { getCareerWithLevels } from './db-relations.js'

const career = await getCareerWithLevels('soldier')
// Returns: { id: 'soldier', levels: [level1, level2, level3, level4] }
```

#### Career Level → Skills (Cumulative)
```javascript
import { getCareerLevelSkills } from './db-relations.js'

// Get all skills from level 1 through current level
const allSkills = await getCareerLevelSkills('soldier|sergeant', false)

// Get only skills from this specific level
const levelSkills = await getCareerLevelSkills('soldier|sergeant', true)
```

#### Talent → Skill
```javascript
import { getTalentSkill } from './db-relations.js'

const skill = await getTalentSkill('sailor')
// Returns skill with talent's specs applied
```

#### Skill → Characteristic
```javascript
import { getSkillCharacteristic } from './db-relations.js'

const char = await getSkillCharacteristic('athletics')
// Returns: { id: 'ag', label: 'Agilité', abr: 'Ag' }
```

### Reverse Relationships (Search by Related Entity)

#### Find Career Levels by Skill
```javascript
import { findCareerLevelsBySkill } from './db-relations.js'

const levels = await findCareerLevelsBySkill('combat-melee')
// Returns all career levels that grant this skill
```

#### Find Careers by Species
```javascript
import { findCareersBySpecies } from './db-relations.js'

const careers = await findCareersBySpecies('human')
// Returns all careers accessible to humans
```

### Caching

All relationship functions use an in-memory cache with 5-minute TTL:

```javascript
import { clearRelationCache, clearRelationCacheForType } from './db-relations.js'

// Clear all cached relationships
clearRelationCache()

// Clear cache for specific entity type
clearRelationCacheForType('career')
```

## Transformation Utilities

### ID Normalization

```javascript
import { toId } from './db-transforms.js'

toId('Magie Mineure') // → 'magie-mineure'
toId('Cavalier (Nain)') // → 'cavalier-nain'
toId('Équitation') // → 'equitation'
```

### Spec Parsing

```javascript
import { parseSpecs } from './db-transforms.js'

parseSpecs('Savoir, Métier, Artisanat')
// Returns: ['Savoir', 'Métier', 'Artisanat']
```

### String to Elements

Parse complex strings with specs, modifiers, and multiple elements:

```javascript
import { stringToElems } from './db-transforms.js'

// Simple parsing
const elem = await stringToElems(db, 'Combat', null, 'skill', true)
// Returns: { label: 'Combat', data: {...}, ... }

// With specialization
const elemWithSpec = await stringToElems(db, 'Combat (Arme à une main)', null, 'skill', true)
// Returns: { label: 'Combat', specs: ['Arme à une main'], ... }

// With modifier
const elemWithMod = await stringToElems(db, '+2 Combat', null, 'skill', true)
// Returns: { label: 'Combat', suffix: '+2', ... }

// Multiple elements
const elems = await stringToElems(db, 'Combat, Athlétisme', null, 'skill', false)
// Returns: [elem1, elem2]
```

### Type-Specific Transformations

```javascript
import { transform, transformTalent, transformSkill } from './db-transforms.js'

// Transform talent (parses specs, resolves references)
const talent = await transformTalent(db, rawTalent)
// Parses specs string → array
// Resolves addSkill → skillData
// Resolves addTalent → talentData

// Transform skill (parses specs, resolves characteristic)
const skill = await transformSkill(db, rawSkill)
// Parses specs string → array
// Resolves characteristic → characteristicData

// Master transformer (routes to appropriate type)
const transformed = await transform(db, data, 'talent')
```

### Validation

```javascript
import { validate } from './db-transforms.js'

const result = validate(talent, 'talent')
// Returns: { valid: true|false, errors: string[] }

if (!result.valid) {
  console.error('Validation errors:', result.errors)
}
```

## Description Generation

### Overview

The description generation system creates rich HTML descriptions with automatic entity linking, formatted metadata, and relationship information.

### Core Features

- **Automatic Entity Linking**: Text descriptions automatically identify and link entity references
- **Relationship Display**: Shows where entities are used (access information)
- **Rich Formatting**: HTML output with proper structure
- **Specialization Support**: Handles entity specs in both generation and linking

### Career Descriptions

```javascript
import { generateCareerDescription } from './db-descriptions.js'

const description = await generateCareerDescription('soldier')
// Returns object with rank icons as keys:
// {
//   '<rank-1-icon>': 'Level 1 details...',
//   '<rank-2-icon>': 'Level 2 details...',
//   ...
// }
```

Each level includes:
- Level name and status
- Cumulative skills and characteristics
- Talents for this level
- Trappings (includes class trappings for level 1)

### Talent Descriptions

```javascript
import { generateTalentDescription } from './db-descriptions.js'

const description = await generateTalentDescription('ambidextrous')
// Returns object or string:
// {
//   Info: 'Max rank, tests, description with entity links...',
//   Accès: 'Career levels and species that grant this talent...'
// }
```

### Skill Descriptions

```javascript
import { generateSkillDescription } from './db-descriptions.js'

const description = await generateSkillDescription('athletics')
// Returns object or string:
// {
//   Info: 'Characteristic, type, description with examples...',
//   Accès: 'Career levels and talents that grant this skill...'
// }
```

### Spell Descriptions

```javascript
import { generateSpellDescription } from './db-descriptions.js'

const description = await generateSpellDescription('fireball')
// Returns object:
// {
//   Info: 'CN, Range, Target, Duration, Description...',
//   Accès: 'Lores and gods that provide this spell...'
// }
```

### Entity Linking

The `applyHelp()` function automatically finds and links entity references in text:

```javascript
import { applyHelp, buildLabelMap } from './db-descriptions.js'

// Build map of entities for linking
const skills = await db.skills.toArray()
const labelMap = await buildLabelMap(skills.map(s => ({ ...s, typeItem: 'skill' })))

const text = 'You gain +10 to Athletics and Combat'
const linked = applyHelp(text, currentEntity, labelMap)
// Returns HTML with Athletics and Combat as clickable help links
```

## Migration Guide

### v1 to v2 Migration

The database automatically migrates from v1 to v2 when opened:

```javascript
import { db } from './db.js'

// Database automatically upgrades to v2
await db.open()
console.log('Current version:', db.verno) // 2
```

### Changes in v2

1. **Field Naming**: Consistent use of `label` instead of `name`
2. **Enhanced Metadata**: All tables include `book`, `page`, `folder`, `desc`
3. **Compound Indexes**: `[career+careerLevel]` for efficient relationship queries
4. **Multi-Entry Indexes**: `*specs` for querying array contents
5. **Array Fields**: Specs stored as arrays instead of comma-separated strings

### Breaking Changes

None - v1 databases upgrade automatically. All existing queries remain compatible.

## Code Examples

### Complete Workflow: Load and Display Career

```javascript
import { db } from './db.js'
import { getCareerWithLevels, getCareerClass } from './db-relations.js'
import { generateCareerDescription } from './db-descriptions.js'

// Load career with all relationships
const career = await getCareerWithLevels('soldier')
const classObj = await getCareerClass('soldier')

// Generate rich description
const description = await generateCareerDescription('soldier')

// Display
console.log(`Career: ${career.label}`)
console.log(`Class: ${classObj.label}`)
console.log(`Levels: ${career.levels.length}`)
console.log('Description:', description)
```

### Search and Filter

```javascript
// Find all combat-related skills
const combatSkills = await db.skills
  .where('label')
  .startsWithIgnoreCase('combat')
  .toArray()

// Find talents with specific spec
const swordTalents = await db.talents
  .where('specs')
  .equals('Arme à une main')
  .toArray()

// Find career levels for a career
const levels = await db.careerLevels
  .where('[career+careerLevel]')
  .between(['soldier', 1], ['soldier', 4])
  .toArray()
```

### Data Loading

```javascript
import { bulkAdd, clearTable } from './db.js'
import { transform } from './db-transforms.js'

// Clear existing data
await clearTable('talents')

// Transform and load
const rawTalents = // ... load from JSON
const transformedTalents = await Promise.all(
  rawTalents.map(t => transform(db, t, 'talent'))
)

// Bulk insert
await bulkAdd('talents', transformedTalents)

console.log('Loaded', transformedTalents.length, 'talents')
```

## API Documentation

### db.js

Core database module with schema and helper functions.

#### Functions

- `getAllFromTable(tableName)` - Get all records from a table
- `searchByName(tableName, searchTerm)` - Search by name (case-insensitive)
- `getById(tableName, id)` - Get record by ID
- `clearTable(tableName)` - Clear all records
- `bulkAdd(tableName, data)` - Bulk insert records
- `getDbStats()` - Get counts for all tables

### db-relations.js

Relationship navigation and helper functions.

#### Career Functions

- `getCareerWithLevels(careerId)` - Get career with all levels
- `getCareerClass(careerId)` - Get class for career
- `getCareerSpecies(careerId)` - Get species that can access career

#### Career Level Functions

- `getCareerLevelCareer(careerLevelId)` - Get career for level
- `getCareerLevelSkills(careerLevelId, onlyThisLevel)` - Get skills (cumulative by default)
- `getCareerLevelTalents(careerLevelId)` - Get talents for level
- `getCareerLevelCharacteristics(careerLevelId, onlyThisLevel)` - Get characteristics (cumulative)
- `getCareerLevelTrappings(careerLevelId, onlyThisLevel)` - Get trappings (includes class trappings for level 1)

#### Talent Functions

- `getTalentSkill(talentId)` - Get skill granted by talent
- `getTalentTalent(talentId)` - Get talent granted by talent
- `getTalentWithRelations(talentId)` - Get talent with all relations
- `parseTalentSpecs(talent)` - Parse talent specializations

#### Skill Functions

- `getSkillCharacteristic(skillId)` - Get characteristic for skill
- `getSkillWithCharacteristic(skillId)` - Get skill with characteristic
- `parseSkillSpecs(skill)` - Parse skill specializations

#### Reverse Lookup Functions

- `findCareerLevelsBySkill(skillId)` - Find levels that grant skill
- `findCareerLevelsByTalent(talentId)` - Find levels that grant talent
- `findCareersBySpecies(speciesId)` - Find careers for species
- `findTalentsBySkill(skillId)` - Find talents that grant skill

#### Utility Functions

- `resolveEntityRef(ref, type)` - Resolve entity reference to object
- `resolveEntityRefs(refs, type)` - Resolve multiple references
- `getEntityLabel(entity)` - Generate display label with specs
- `entitiesToLabels(entities)` - Convert entities to label strings
- `clearRelationCache()` - Clear all cached relationships
- `clearRelationCacheForType(type)` - Clear cache for specific type

### db-transforms.js

Data transformation and parsing utilities.

#### Functions

- `toId(str)` - Convert string to normalized ID
- `createElem(text, specs, suffix, prefix)` - Create element structure
- `getLabelForElem(elem)` - Generate display label for element
- `getLabelForData(data)` - Generate display label for database object
- `stringToElems(db, string, from, type, one)` - Parse complex strings
- `bindElem(db, elem, from, type)` - Bind element to database data
- `parseSpecs(specs)` - Parse comma-separated specs to array
- `transform(db, data, type)` - Master transformation router
- `transformCareer(db, career)` - Transform career
- `transformTalent(db, talent)` - Transform talent
- `transformSkill(db, skill)` - Transform skill
- `transformSpell(db, spell)` - Transform spell
- `transformCareerLevel(db, careerLevel)` - Transform career level
- `validate(data, type)` - Validate transformed data
- `eachElem(elems, func)` - Iterate over elements
- `flattenElemIteratively(obj, condition)` - Flatten tree structure

### db-descriptions.js

Description generation and entity linking.

#### Functions

- `buildLabelMap(entities)` - Build map of labels to entities
- `applyHelp(texts, currentEntity, labelMap)` - Apply automatic entity linking
- `generateDescription(id, type)` - Master description generator
- `generateCareerDescription(careerId)` - Generate career description with levels
- `generateTalentDescription(talentId)` - Generate talent description with access
- `generateSkillDescription(skillId)` - Generate skill description with access
- `generateSpellDescription(spellId)` - Generate spell description
- `generateClassDescription(classId)` - Generate class description
- `generateSpeciesDescription(speciesId)` - Generate species description
- `generateTrappingDescription(trappingId)` - Generate trapping description

---

**Last Updated**: 2025-10-25
**Schema Version**: v2
**Issue**: #22
