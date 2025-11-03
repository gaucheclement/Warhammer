# Entity Reference Specification
## Structured Format for Database References

**Version**: 1.0
**Date**: 2025-11-02
**Status**: Design Specification

---

## 1. Overview

This document defines the **EntityReference** data structure and transformation rules for the Warhammer database refactoring (Issue #47). The goal is to replace inconsistent string-based references with a structured, typed format that preserves all semantic information.

### Current State (JSON Source)
```json
{
  "traits": "Arme +5, Coriace, Intelligent, Lanceur de Sorts (Sorcellerie), Préjugé (sigmarites)"
}
```

### Target State (IndexedDB)
```javascript
{
  "traits": [
    { id: "arme", entityType: "trait", prefix: "+5", rating: 5, originalText: "Arme +5" },
    { id: "coriace", entityType: "trait", originalText: "Coriace" },
    { id: "intelligent", entityType: "trait", originalText: "Intelligent" },
    { id: "lanceur-de-sorts", entityType: "trait", spec: "Sorcellerie", originalText: "Lanceur de Sorts (Sorcellerie)" },
    { id: "prejuge", entityType: "trait", spec: "sigmarites", originalText: "Préjugé (sigmarites)" }
  ]
}
```

**Key Principle**: JSON files remain unchanged. Transformation happens once at load time, with results stored in IndexedDB.

---

## 2. EntityReference Interface

### TypeScript Definition

```typescript
/**
 * Structured reference to an entity with optional modifiers
 *
 * Replaces string-based references like "Arme +5" or "Combat (Épée)"
 * with a structured object that preserves all semantic information.
 */
interface EntityReference {
  /**
   * Stable, unique identifier for the target entity
   * Format: lowercase-with-hyphens (e.g., "lanceur-de-sorts")
   * Generated from label using ID generation algorithm
   */
  id: string

  /**
   * Entity type (table name) for the reference
   * Values: "trait", "skill", "talent", "spell", "characteristic", etc.
   * Matches IndexedDB table names (plural form)
   */
  entityType: string

  /**
   * Original text label before parsing
   * Used for debugging and fallback display if entity not found
   * Example: "Arme +5" or "Lanceur de Sorts (Sorcellerie)"
   */
  originalText: string

  /**
   * Display label of the target entity (optional, for convenience)
   * Populated during transformation for quick access
   * Example: "Arme", "Lanceur de Sorts"
   */
  label?: string

  /**
   * Numeric or textual prefix before the label
   * Usually a modifier like "+5", "-2", "+1d6"
   * Appears before the entity name: "Arme +5" has prefix "+5"
   */
  prefix?: string

  /**
   * Numeric or textual suffix after the label
   * Rare, but used in some cases
   * Appears after the entity name before specialization
   */
  suffix?: string

  /**
   * Specialization in parentheses
   * Example: "Combat (Épée)" has spec "Épée"
   * Example: "Lanceur de Sorts (Sorcellerie)" has spec "Sorcellerie"
   */
  spec?: string

  /**
   * Numeric rating extracted from prefix
   * Parsed from prefix for convenient numerical operations
   * Example: "+5" → 5, "-2" → -2, "+1d6" → 1
   * null if prefix is not numeric
   */
  rating?: number | null
}
```

### Field Rules

| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| `id` | Yes | string | Non-empty, lowercase, valid entity ID |
| `entityType` | Yes | string | Must match a table name in IndexedDB |
| `originalText` | Yes | string | Non-empty, original unparsed reference |
| `label` | No | string | Display label (for convenience) |
| `prefix` | No | string | Textual modifier before label |
| `suffix` | No | string | Textual modifier after label |
| `spec` | No | string | Specialization (text in parentheses) |
| `rating` | No | number/null | Numeric value from prefix |

---

## 3. Reference Grammar

### Formal Definition

```
ReferenceList  := Reference (Separator Reference)*
Reference      := Prefix? Label Suffix? Specialization?
Separator      := "," | " ou " | " et "
Prefix         := NumericModifier Whitespace
Suffix         := Whitespace NumericModifier
Specialization := Whitespace? "(" Text ")"
NumericModifier := [+|-]? Digit+ [d\-+Digit]*
Label          := [^,()]+  (trimmed)
```

### Examples with Parsing

| Input | Parsed Fields |
|-------|---------------|
| `"Arme +5"` | `{ label: "Arme", prefix: "+5", rating: 5 }` |
| `"Combat (Épée)"` | `{ label: "Combat", spec: "Épée" }` |
| `"Lanceur de Sorts (Sorcellerie)"` | `{ label: "Lanceur de Sorts", spec: "Sorcellerie" }` |
| `"Préjugé (sigmarites)"` | `{ label: "Préjugé", spec: "sigmarites" }` |
| `"+2 Agilité"` | `{ label: "Agilité", prefix: "+2", rating: 2 }` |
| `"Dextérité -1"` | `{ label: "Dextérité", suffix: "-1", rating: -1 }` |
| `"Coriace"` | `{ label: "Coriace" }` |

### List Parsing Examples

| Input | Parsed Count | Separators Used |
|-------|--------------|-----------------|
| `"A, B, C"` | 3 | Comma only |
| `"A ou B"` | 2 | " ou " (or) |
| `"A et B"` | 2 | " et " (and) |
| `"A, B ou C"` | 3 | Mixed |
| `"A, B, C, "` | 3 | Trailing comma ignored |

---

## 4. Entity Type Mapping

### Table Name Standardization

All entity types use **plural forms** in IndexedDB and EntityReference.

| Concept (Singular) | Table Name (Plural) | JSON Field Name |
|-------------------|---------------------|-----------------|
| Career | `careers` | `career`, `careers` |
| Career Level | `careerLevels` | `careerLevel` |
| Species | `species` | `species` |
| Class | `classes` | `class` |
| Talent | `talents` | `talent`, `talents`, `addTalent` |
| Skill | `skills` | `skill`, `skills`, `addSkill` |
| Characteristic | `characteristics` | `characteristic`, `characteristics` |
| Trapping | `trappings` | `trapping`, `trappings` |
| Spell | `spells` | `spell`, `spells` |
| Trait | `traits` | `trait`, `traits` |
| Lore | `lores` | `lore` |
| Magick | `magicks` | `magick` |
| God | `gods` | `god` |
| Quality | `qualities` | `quality`, `qualities` |
| Star | `stars` | `star` |
| Eye | `eyes` | `eye` |
| Hair | `hairs` | `hair` |
| Detail | `details` | `detail` |
| Etat | `etats` | `etat` |
| Psychology | `psychologies` | `psychologie` |
| Book | `books` | `book` |
| Tree | `trees` | `tree`, `folder` |
| Creature | `creatures` | `creature` |

### Field-to-EntityType Mapping

When transforming JSON fields, use this mapping:

| JSON Field | Entity Type | Notes |
|------------|-------------|-------|
| `skills`, `skill`, `addSkill` | `skills` | All skill references |
| `talents`, `talent`, `addTalent` | `talents` | All talent references |
| `traits`, `trait` | `traits` | Creature/character traits |
| `spells`, `spell` | `spells` | Magic spells |
| `characteristics` | `characteristics` | Attributes (M, WS, BS, etc.) |
| `trappings` | `trappings` | Equipment/items |
| `qualities` | `qualities` | Weapon/armor qualities |
| `species` | `species` | Races |
| `class` | `classes` | Social status classes |
| `lore` | `lores` | Magic lores |
| `blessings`, `miracles` | `spells` | Divine spells (subtype) |

---

## 5. ID Generation Rules

### Algorithm

```javascript
/**
 * Generate stable ID from entity label
 *
 * @param {string} label - Original label (e.g., "Lanceur de Sorts")
 * @param {string} entityType - Entity type for collision detection
 * @returns {string} Normalized ID (e.g., "lanceur-de-sorts")
 */
function generateStableId(label, entityType) {
  // Step 1: Normalize to lowercase
  let id = label.toLowerCase()

  // Step 2: Remove accents (NFD decomposition + strip combining marks)
  id = id.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Step 3: Replace non-alphanumeric with hyphens
  id = id.replace(/[^a-z0-9]+/g, '-')

  // Step 4: Trim leading/trailing hyphens
  id = id.replace(/^-+|-+$/g, '')

  // Step 5: Handle collisions (if ID already exists)
  // Check database, append -2, -3, etc. if needed
  id = ensureUnique(id, entityType)

  return id
}
```

### Examples

| Label | Generated ID |
|-------|-------------|
| `"Athlétisme"` | `"athletisme"` |
| `"Combat (Épée)"` | `"combat"` (spec not in ID) |
| `"Lanceur de Sorts"` | `"lanceur-de-sorts"` |
| `"L'Épée d'Argent"` | `"l-epee-d-argent"` |
| `"Magie Mineure"` | `"magie-mineure"` |

### Collision Handling

If multiple entities have the same normalized label:

1. **Context-aware lookup**: Search within correct `entityType` first
2. **Disambiguation**: Append `-2`, `-3`, etc.
3. **Manual review**: Log ambiguous cases for human decision

---

## 6. Label Resolution

### Resolution Strategy

When transforming `"Combat (Épée)"` to an `EntityReference`:

```javascript
// Step 1: Parse the reference
const parsed = parseEntityReference("Combat (Épée)")
// Result: { label: "Combat", spec: "Épée" }

// Step 2: Resolve label to ID (context-aware)
const id = await resolveLabel(parsed.label, "skills", context)
// Lookup: skills table for entity with label="Combat"
// Result: "combat"

// Step 3: Build EntityReference
const ref = {
  id: "combat",
  entityType: "skills",
  originalText: "Combat (Épée)",
  label: "Combat",
  spec: "Épée"
}
```

### Fuzzy Matching

If exact match not found, try:
1. **Case-insensitive match**: `"combat"` matches `"Combat"`
2. **Accent-insensitive**: `"Epée"` matches `"Épée"`
3. **Partial match** (Levenshtein distance < 2)

### Unresolved References

If label cannot be resolved:
- **Log warning** with context (entity, field, value)
- **Preserve original text** in `originalText`
- **Set ID to label** (best guess)
- **Mark as broken** for manual review

---

## 7. Transformation Rules by Field Type

### Single String Reference

**JSON Format**: `"career": "soldier"`

**Transformation**:
```javascript
{
  career: "soldier"  // Already an ID, no change needed
}
```

**Rule**: If field contains a simple ID, leave as string (no EntityReference needed).

---

### Comma-Separated String

**JSON Format**: `"species": "human, dwarf, elf"`

**Transformation**:
```javascript
{
  species: ["human", "dwarf", "elf"]  // Array of IDs
}
```

**Rule**: Parse comma-separated list, resolve labels to IDs, store as array.

---

### Reference with Modifiers

**JSON Format**: `"traits": "Arme +5, Coriace"`

**Transformation**:
```javascript
{
  traits: [
    {
      id: "arme",
      entityType: "traits",
      prefix: "+5",
      rating: 5,
      originalText: "Arme +5",
      label: "Arme"
    },
    {
      id: "coriace",
      entityType: "traits",
      originalText: "Coriace",
      label: "Coriace"
    }
  ]
}
```

**Rule**: Parse each reference, extract modifiers, create EntityReference array.

---

### Reference with Specialization

**JSON Format**: `"talents": "Combat (Épée), Tir (Arc)"`

**Transformation**:
```javascript
{
  talents: [
    {
      id: "combat",
      entityType: "talents",
      spec: "Épée",
      originalText: "Combat (Épée)",
      label: "Combat"
    },
    {
      id: "tir",
      entityType: "talents",
      spec: "Arc",
      originalText: "Tir (Arc)",
      label: "Tir"
    }
  ]
}
```

**Rule**: Parse specializations in parentheses, store in `spec` field.

---

### Mixed References

**JSON Format**: `"skills": ["athletisme", { id: "combat", spec: "Épée" }]`

**Transformation**:
```javascript
{
  skills: [
    {
      id: "athletisme",
      entityType: "skills",
      originalText: "athletisme",
      label: "Athlétisme"  // Looked up from DB
    },
    {
      id: "combat",
      entityType: "skills",
      spec: "Épée",
      originalText: "Combat (Épée)",  // Reconstructed
      label: "Combat"  // Looked up
    }
  ]
}
```

**Rule**: Handle both strings and objects, normalize to EntityReference format.

---

## 8. Field Detection Heuristics

### How to Identify Reference Fields

When processing a JSON entity, determine which fields contain references:

#### Known Reference Fields (Explicit)
Based on `ENTITY_RELATIONSHIP_CONFIG` from audit report:

- `career`, `careers` → `careers`
- `species` → `species`
- `class` → `classes`
- `skill`, `skills`, `addSkill` → `skills`
- `talent`, `talents`, `addTalent` → `talents`
- `trait`, `traits` → `traits`
- `characteristic`, `characteristics` → `characteristics`
- `trapping`, `trappings` → `trappings`
- `quality`, `qualities` → `qualities`
- `spell`, `spells` → `spells`
- `lore` → `lores`
- `magick` → `magicks`
- `god` → `gods`
- `book` → `books`
- `folder` → `trees`
- `blessings`, `miracles` → `spells`

#### Heuristic Detection
If field name matches pattern:
- Ends with `s` (plural) → likely array of IDs
- Matches entity type name → likely reference
- Contains `add` prefix → likely related entity reference

---

## 9. Data Integrity Validation

### Post-Transformation Checks

After loading and transforming all data:

1. **Referential Integrity**:
   - Every `EntityReference.id` must exist in `EntityReference.entityType` table
   - Log broken references (ID not found)

2. **Type Consistency**:
   - All references in same field have same `entityType`
   - Example: All items in `skills[]` have `entityType: "skills"`

3. **Label Consistency**:
   - `EntityReference.label` matches actual entity label
   - Lookup and verify

4. **Spec Validity**:
   - If entity has `canHaveSpec: false`, references shouldn't have `spec`
   - If entity has `specs: [...]`, reference `spec` should be in that list

### Validation Report Format

```javascript
{
  summary: {
    totalReferences: 15423,
    resolved: 15234,
    unresolved: 189,
    brokenRefs: 12,
    warnings: 45
  },
  unresolved: [
    {
      entityType: "creatures",
      entityId: "dragon-rouge",
      field: "traits",
      value: "Vol Supérieur",
      reason: "Label not found",
      suggestion: "Did you mean 'Vol'?"
    }
  ],
  broken: [
    {
      entityType: "careers",
      entityId: "artisan",
      field: "species",
      reference: { id: "elf-wood", entityType: "species" },
      reason: "Referenced entity does not exist"
    }
  ]
}
```

---

## 10. Backward Compatibility

### During Migration (Streams A-C)

Support **dual-format** reading:

```javascript
/**
 * Get field value, handling both old (string) and new (EntityReference[]) formats
 */
function getFieldValue(entity, field) {
  const value = entity[field]

  // New format: EntityReference[]
  if (Array.isArray(value) && value[0]?.entityType) {
    return value.map(ref => ref.id)
  }

  // Old format: comma-separated string
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim())
  }

  // Old format: array of IDs
  if (Array.isArray(value)) {
    return value
  }

  return []
}
```

### After Cutover (Stream D)

Remove backward compatibility code. All fields guaranteed to be `EntityReference[]`.

---

## 11. Display Label Generation

### Reconstructing Display Labels

From `EntityReference` to human-readable string:

```javascript
/**
 * Generate display label from EntityReference
 *
 * @param {EntityReference} ref - Structured reference
 * @returns {string} Formatted label
 */
function formatEntityReference(ref) {
  let label = ref.label || ref.id

  // Add prefix before label
  if (ref.prefix) {
    label = `${ref.prefix} ${label}`
  }

  // Add suffix after label
  if (ref.suffix) {
    label = `${label} ${ref.suffix}`
  }

  // Add specialization in parentheses
  if (ref.spec) {
    label = `${label} (${ref.spec})`
  }

  return label
}
```

### Examples

| EntityReference | Formatted Label |
|----------------|-----------------|
| `{ label: "Arme", prefix: "+5" }` | `"+5 Arme"` |
| `{ label: "Combat", spec: "Épée" }` | `"Combat (Épée)"` |
| `{ label: "Lanceur de Sorts", spec: "Sorcellerie" }` | `"Lanceur de Sorts (Sorcellerie)"` |
| `{ label: "Coriace" }` | `"Coriace"` |

---

## 12. Performance Considerations

### Memory Impact

**Current (String)**:
```javascript
{
  "traits": "Arme +5, Coriace"  // ~20 bytes
}
```

**New (EntityReference[])**:
```javascript
{
  "traits": [
    {
      id: "arme",
      entityType: "traits",
      prefix: "+5",
      rating: 5,
      originalText: "Arme +5",
      label: "Arme"
    },
    {
      id: "coriace",
      entityType: "traits",
      originalText: "Coriace",
      label: "Coriace"
    }
  ]
  // ~200 bytes (10x increase)
}
```

**Estimated Total Impact**:
- Typical database: ~10,000 references
- Old size: ~200 KB
- New size: ~2 MB
- **Impact**: +1.8 MB (acceptable for modern browsers)

### Access Speed

**Before** (runtime parsing):
```javascript
const ids = entity.traits.split(',').map(s => s.trim())
// 3-5ms for complex string
```

**After** (pre-parsed):
```javascript
const ids = entity.traits.map(ref => ref.id)
// <1ms (simple array map)
```

**Improvement**: 3-5x faster access, no parsing overhead.

---

## 13. Usage Examples

### Example 1: Career with Skills

**JSON Input**:
```json
{
  "id": "soldier|1",
  "label": "Recrue",
  "career": "soldier",
  "careerLevel": 1,
  "skills": "Athlétisme, Combat (Corps à Corps), Esquive"
}
```

**Transformed Output**:
```javascript
{
  id: "soldier|1",
  label: "Recrue",
  career: "soldier",  // Simple ID, no change
  careerLevel: 1,
  skills: [
    {
      id: "athletisme",
      entityType: "skills",
      originalText: "Athlétisme",
      label: "Athlétisme"
    },
    {
      id: "combat",
      entityType: "skills",
      spec: "Corps à Corps",
      originalText: "Combat (Corps à Corps)",
      label: "Combat"
    },
    {
      id: "esquive",
      entityType: "skills",
      originalText: "Esquive",
      label: "Esquive"
    }
  ]
}
```

---

### Example 2: Creature with Traits

**JSON Input**:
```json
{
  "id": "dragon",
  "label": "Dragon",
  "traits": "Arme +10, Vol, Souffle de Feu, Effrayant +3, Taille (Énorme)"
}
```

**Transformed Output**:
```javascript
{
  id: "dragon",
  label: "Dragon",
  traits: [
    {
      id: "arme",
      entityType: "traits",
      prefix: "+10",
      rating: 10,
      originalText: "Arme +10",
      label: "Arme"
    },
    {
      id: "vol",
      entityType: "traits",
      originalText: "Vol",
      label: "Vol"
    },
    {
      id: "souffle-de-feu",
      entityType: "traits",
      originalText: "Souffle de Feu",
      label: "Souffle de Feu"
    },
    {
      id: "effrayant",
      entityType: "traits",
      prefix: "+3",
      rating: 3,
      originalText: "Effrayant +3",
      label: "Effrayant"
    },
    {
      id: "taille",
      entityType: "traits",
      spec: "Énorme",
      originalText: "Taille (Énorme)",
      label: "Taille"
    }
  ]
}
```

---

## 14. Implementation Checklist

### Parser Module (`db-reference-parser.js`)
- [ ] Implement `parseCommaSeparatedList(text)`
- [ ] Implement `parseMultiSeparatorList(text)`
- [ ] Implement `parseEntityReference(text)`
- [ ] Implement `parseEntityReferenceList(text, entityType)`
- [ ] Implement `parseSpecs(entity, options)`
- [ ] Add comprehensive JSDoc
- [ ] Write unit tests (100% coverage)

### ID Generator (`db-id-generator.js`)
- [ ] Implement `generateStableId(label, entityType)`
- [ ] Implement `ensureUnique(id, entityType, existingIds)`
- [ ] Handle accent normalization
- [ ] Handle collision detection
- [ ] Write unit tests

### Data Loader (`db-loader.js`)
- [ ] Implement JSON to IndexedDB transformation
- [ ] Implement label to ID resolution
- [ ] Implement validation report generation
- [ ] Handle all entity types
- [ ] Log unresolved references
- [ ] Write integration tests

### Core Utilities
- [ ] Implement `formatEntityReference(ref)`
- [ ] Implement `resolveReferenceToId(label, entityType, context)`
- [ ] Implement validation functions
- [ ] Write utility tests

---

## 15. Success Criteria

### Functional Requirements
- ✅ All references in IndexedDB are `EntityReference` objects
- ✅ Original JSON files remain unchanged
- ✅ All semantic information preserved (prefix, suffix, spec)
- ✅ IDs are stable and unique
- ✅ Display labels can be reconstructed

### Quality Requirements
- ✅ 100% test coverage for parser
- ✅ All real-world examples parse correctly
- ✅ Validation report has <1% unresolved references
- ✅ Performance: parse 1000 refs in <100ms
- ✅ Memory: <5MB overhead for typical dataset

### Documentation Requirements
- ✅ This spec document
- ✅ API documentation (JSDoc)
- ✅ Examples for each function
- ✅ Migration guide for developers

---

**Specification Version**: 1.0
**Approved By**: Pending
**Implementation Start**: Stream B (2025-11-02)
