# Issue #41 Stream B: "Where Used" Query System

## Status
In Progress

## Assigned To
Stream B Agent - Backend Specialist

## Scope
Implement generic reverse lookup system that finds all entities referencing a given entity.

## Files Modified
- `warhammer-v2/src/lib/db-relations.js` (lines 830+)

## Work Log

### 2025-11-01 - Initial Setup
- Created progress tracking file
- Reviewed existing db-relations.js structure
- Analyzed all 23+ entity types from db.js
- Identified relationship patterns to support

## Implementation Plan

### 1. Function Signature
```javascript
async function getEntityUsage(entityType, entityId, options = {})
```

### 2. Entity Types to Support (23 types)
Core entities:
- careers, careerLevels, species, classes
- talents, skills, characteristics
- trappings, qualities
- spells, lores, magicks, gods
- creatures, traits
- stars, eyes, hairs, details
- etats, psychologies
- books, trees

### 3. Relationship Patterns

#### Array-based References
- `skills[]` in careerLevels, species, creatures
- `talents[]` in careerLevels, species, creatures
- `trappings[]` in careerLevels, classes, creatures
- `characteristics[]` in careerLevels
- `specs[]` in skills, talents
- `qualities[]` in trappings

#### String-based References
- `career` in careerLevels
- `class` in careers
- `characteristic` in skills
- `lore` in spells
- `addSkill` in talents
- `addTalent` in talents

#### Object-embedded References
- `rand` object in careers (species keys)
- `char` object in creatures (characteristic values)

### 4. Query Strategies
- Batch operations using Promise.all
- Leverage existing indexes (career, characteristic, etc.)
- Filter operations for non-indexed fields
- Efficient object traversal for embedded references

### 5. Performance Targets
- < 100ms for typical queries
- Cache results with 5-minute TTL
- Avoid N+1 query patterns
- Use batch queries where possible

## Progress

- [x] Created progress file
- [x] Designed function signature
- [x] Implemented entity type mapping
- [x] Created query strategies
- [x] Implemented result grouping
- [x] Added caching layer
- [x] Added performance benchmarking
- [x] Added JSDoc documentation
- [ ] Integration into main db-relations.js file
- [ ] Testing with real data

## Implementation Details

### Functions Implemented

1. **getEntityUsage(entityType, entityId, options)**
   - Main function for reverse lookup
   - Supports 23+ entity types
   - Returns results grouped by entity type
   - Includes optional performance benchmarking
   - Cache-enabled with 5-minute TTL

2. **getEntityUsageStats(entityType, entityId)**
   - Returns usage counts summary
   - Includes total count and canDelete flag
   - Useful for determining deletion safety

3. **getEntityUsageBatch(entityType, entityIds, options)**
   - Batch processing for multiple entities
   - Parallel execution using Promise.all
   - Returns object mapping IDs to usage data

4. **findOrphanedEntities(entityType, options)**
   - Finds entities not referenced anywhere
   - Useful for data cleanup
   - Configurable limit (default 100)

### Entity Types Supported (23 types)

**Core Gameplay**:
- careers, careerLevels, species, classes
- talents, skills, characteristics

**Equipment**:
- trappings, qualities

**Magic & Religion**:
- spells, lores, magicks, gods

**Creatures & Traits**:
- creatures, traits

**Character Generation**:
- stars, eyes, hairs, details

**Status & Conditions**:
- etats, psychologies

**Reference Data**:
- books, trees

### Relationship Patterns Implemented

**Array-based References**:
- skills[], talents[], trappings[] in careerLevels
- skills[], talents[] in species
- skills[], talents[], traits[], spells[], trappings[] in creatures
- qualities[] in trappings
- blessings[], miracles[] in gods
- specs[] in skills and talents

**String-based References**:
- career in careerLevels (indexed)
- class in careers (indexed)
- characteristic in skills (indexed)
- lore in spells (non-indexed)
- addSkill, addTalent in talents (indexed)
- parent in lores, magicks, trees (non-indexed)
- book in most entities (indexed)
- folder in most entities (indexed)

**Object-embedded References**:
- rand object in careers (species as keys)
- char object in creatures (characteristics as values)

### Performance Optimizations

1. **Indexed Queries**: Uses Dexie .where() for indexed fields
2. **Batch Operations**: Promise.all for parallel query execution
3. **Caching**: 5-minute TTL for all usage queries
4. **Deduplication**: Removes duplicates within each result type
5. **Benchmarking**: Optional performance.now() tracking

### Query Performance Targets

- Indexed queries: ~10-20ms
- Non-indexed queries: ~50-100ms
- Batch queries: Parallel execution, scales linearly
- Cache hits: < 1ms

## File Location

Implementation completed in separate file:
`warhammer-v2/src/lib/db-relations-whereused.js`

This file contains the complete "Where Used" system ready for integration into
`db-relations.js` at line 830+ (after findTalentsBySkill function).

## Integration Notes

To integrate into main db-relations.js:
1. Export relationCache from db-relations.js
2. Copy content from db-relations-whereused.js (excluding imports and export default)
3. Insert after line 829 (after findTalentsBySkill)
4. Update default export to include new functions
5. Run tests to verify no conflicts with Stream A

## Blockers
None at this time. Implementation complete, pending integration.

## Next Steps
1. Coordinate with Stream A to ensure no conflicts
2. Integrate into main db-relations.js file
3. Export new functions in default export
4. Test with real database data
5. Performance benchmark with typical queries
6. Document any edge cases discovered
