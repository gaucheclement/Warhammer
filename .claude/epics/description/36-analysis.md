---
issue: 36
title: Complete Missing Description Generators
analyzed: 2025-11-01T13:00:41Z
estimated_hours: 24
parallelization_factor: 1.4
---

# Parallel Work Analysis: Issue #36

## Overview
Implement 12 missing entity type description generators in `db-descriptions.js` following the established patterns from 8 existing generators (Career, CareerLevel, Talent, Skill, Spell, Class, Species, Trapping). Each generator must produce rich HTML descriptions with entity cross-references in the format `{type:label}`.

**Missing Types**: Trait, Tree, Star, Lore, Magick, Quality, God, Psychologie, Etat, Creature, Characteristic, Book

## Parallel Streams

### Stream A: Generator Implementation
**Scope**: Implement all 12 missing description generators sequentially in db-descriptions.js
**Files**:
- `warhammer-v2/src/lib/db-descriptions.js` (primary work file)
  - Add 12 new generator functions (lines 964-997 area)
  - Update generateDescription() switch statement (lines 978-1001)
  - Update exports (lines 1008-1028)

**Agent Type**: backend-specialist
**Can Start**: immediately
**Estimated Hours**: 22 hours

**Implementation Order** (simple first, then complex):
1. **Characteristic** (2h) - Referenced frequently, basic structure
2. **God** (3h) - Simple with lore/spell relationships
3. **Lore** (3h) - Magic tradition with spell lists
4. **Star** (2h) - Simple astrological data
5. **Etat** (2h) - Status conditions, simple structure
6. **Psychologie** (3h) - Mental conditions, similar to Etat
7. **Magick** (2h) - Magic domain types
8. **Quality** (2h) - Weapon/armor properties
9. **Trait** (3h) - Creature traits with complex descriptions
10. **Tree** (7h) - Folder hierarchy, complex navigation
11. **Creature** (8h) - Most complex: stats, skills, talents, traits, spells
12. **Book** (7h) - Reference book with content lists

**Pattern to Follow**:
```javascript
export async function generate{Type}Description(entityId) {
  const entity = await db.{type}s.get(entityId)
  if (!entity) return null

  // Build description with sections
  // Use applyHelp() for entity linking
  // Return string or object with tabs
}
```

### Stream B: Testing and Validation
**Scope**: Prepare test data and validate each generator as it's completed
**Files**:
- Create `warhammer-v2/src/lib/db-descriptions-new.test.js` (new file)
- Test data collection script
- HTML validation utilities

**Agent Type**: fullstack-specialist
**Can Start**: immediately
**Estimated Hours**: 6 hours

**Work Breakdown**:
1. **Setup** (1h): Create test file structure, import test utilities
2. **Test Data Collection** (2h): Gather real entity IDs for each type from database
3. **Validation Framework** (1h): HTML validation, cross-reference checking
4. **Progressive Testing** (2h): Test each generator as Stream A completes it

**Coordination**: Monitor Stream A progress and test each completed generator

## Coordination Points

### Shared Files
**Single File Conflict**: Both streams will interact with `db-descriptions.js`
- **Stream A**: Actively modifying (HIGH write activity)
- **Stream B**: Reading for tests (read-only)

**Resolution**: Stream B reads, never writes to db-descriptions.js. All test code goes in separate test file.

### Sequential Requirements
1. Stream B can prepare test framework immediately
2. Stream A implements generators sequentially (1-12)
3. Stream B validates each generator after Stream A completes it
4. Final integration: Update generateDescription() switch and exports after all generators complete

### Communication Protocol
Stream A updates progress after each generator:
- Commits with format: `Issue #36: Add {EntityType} description generator`
- Stream B watches for commits and tests new generators
- Stream B reports validation issues back to Stream A

## Conflict Risk Assessment
**Medium Risk**:
- Single file for all generators creates bottleneck
- Switch statement and exports need careful coordination
- BUT: Generators are independent functions, can be added sequentially
- Test stream is read-only, no write conflicts

**Mitigation**:
- Stream A works sequentially within the file
- Stream B uses separate test file
- Clear commit messages for coordination

## Parallelization Strategy

**Recommended Approach**: Hybrid parallel

1. **Launch both streams simultaneously**
2. **Stream A**: Implements generators 1-12 sequentially
   - Commits after each generator
   - Updates switch statement incrementally
3. **Stream B**: Prepares tests, then validates progressively
   - Tests each generator as it's committed
   - Reports issues for quick fixes

**Efficiency Gain**: Stream B's validation catches issues early, reducing rework time.

## Expected Timeline

With parallel execution:
- **Wall time**: 22 hours (limited by Stream A's sequential work)
- **Total work**: 28 hours (22h + 6h)
- **Efficiency gain**: 21% (early validation reduces debugging time by ~5h)

Without parallel execution:
- **Wall time**: 27 hours (implement all, then test all, more rework)

## Entity Schema Reference

All missing entity types follow similar schema patterns:
- **Simple entities** (Characteristic, Star, God, Lore, Magick, Quality, Etat, Psychologie):
  - Fields: id, label, book, page, desc, folder
  - Basic description with entity linking
  - Simple access information

- **Complex entities** (Trait, Creature, Book, Tree):
  - **Trait**: id, label, suffix, prefix, book, page, desc, folder
  - **Creature**: id, label, char (object), skills, talents, traits, spells (arrays)
  - **Book**: id, label, abr, language, folder, desc
  - **Tree**: id, label, type, folder, parent (hierarchy)

## Notes
- Follow CLAUDE.md: "Think carefully and implement the most concise solution"
- Reuse existing patterns from generateTalentDescription() and generateSpellDescription()
- Use buildLabelMap() for entity cross-referencing
- Use applyHelp() for automatic entity linking in descriptions
- Each generator returns either string (simple) or object with tabs (complex)
- Test with real database entities, not mocked data
- Validate HTML structure and cross-reference links
