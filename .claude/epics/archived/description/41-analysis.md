---
issue: 41
title: Extend Related Entities System
analyzed: 2025-11-01T17:11:49Z
estimated_hours: 16
parallelization_factor: 2.5
---

# Parallel Work Analysis: Issue #41

## Overview
Extend the `db-relations.js` module to support missing entity relationships and implement a comprehensive "Where Used" system for reverse lookups. Integrate with EntityDescription component to display related entities using DataTable for pagination of large lists.

## Parallel Streams

### Stream A: Core Relationship Extensions
**Scope**: Add missing forward relationship functions (Spell ↔ Lore/God/Talent, Trapping ↔ Quality, Trait ↔ Creature, etc.)

**Files**:
- `warhammer-v2/src/lib/db-relations.js` (lines 662-709 - extend spell relationships)
- `warhammer-v2/src/lib/db-relations.js` (new sections after line 709)

**Agent Type**: backend-specialist

**Can Start**: immediately

**Estimated Hours**: 6 hours

**Dependencies**: none

**Tasks**:
1. Add Spell ↔ God relationship functions (divine spells)
2. Add Spell ↔ Talent relationship functions (spell-granting talents)
3. Add Trapping ↔ Quality relationship functions
4. Add Trait ↔ Creature relationship functions
5. Add God ↔ Blessing/Miracle relationships
6. Add Lore ↔ Magick domain relationships
7. Update cache patterns for new relationships
8. Add JSDoc documentation for all new functions

### Stream B: "Where Used" Query System
**Scope**: Implement generic reverse lookup system that finds all entities referencing a given entity

**Files**:
- `warhammer-v2/src/lib/db-relations.js` (new section after current bidirectional helpers at line 829)

**Agent Type**: backend-specialist

**Can Start**: immediately

**Estimated Hours**: 7 hours

**Dependencies**: none

**Tasks**:
1. Design `getEntityUsage(entityType, entityId)` function signature
2. Implement entity type mapping (20+ types from db.js)
3. Create query strategies for each relationship pattern:
   - Array-based references (skills[], talents[], trappings[])
   - String-based references (career, class, characteristic)
   - Object-embedded references (rand object in careers)
   - Multi-entry indexed arrays (specs)
4. Implement result grouping by entity type
5. Add caching layer with 5-minute TTL
6. Optimize queries using batch operations and indexes
7. Add performance benchmarking (target < 100ms)
8. Add comprehensive JSDoc with examples

### Stream C: EntityDescription Integration & Testing
**Scope**: Integrate relationship system with UI component, add pagination for large lists, comprehensive testing

**Files**:
- `warhammer-v2/src/components/EntityDescription.svelte` (if exists) or create new component
- `warhammer-v2/src/lib/db-relations.test.js` (new test file)
- Integration with existing DataTable component

**Agent Type**: fullstack-specialist

**Can Start**: after Streams A & B complete at least 50%

**Estimated Hours**: 5 hours

**Dependencies**: Stream A (relationship functions), Stream B (Where Used function)

**Tasks**:
1. Create/locate EntityDescription component with "Related" tab
2. Implement data fetching for related entities using new functions
3. Add DataTable integration for lists > 50 items
4. Add pagination, sorting, filtering UI
5. Write unit tests for new relationship functions
6. Write integration tests for "Where Used" across entity types
7. Manual testing with 10+ different entity types
8. Performance testing to verify < 100ms query times
9. Test bidirectional relationships (A→B and B→A)

## Coordination Points

### Shared Files
- `warhammer-v2/src/lib/db-relations.js` - All streams modify this file:
  - **Stream A**: Lines 662-709 (spell section) and new sections after line 829
  - **Stream B**: New section after line 829 (bidirectional helpers)
  - **Coordination**: Work in separate sections, Stream A focuses on forward relationships (ending ~line 750), Stream B adds reverse lookup system starting after that

### Sequential Requirements
1. Streams A & B can run fully in parallel (separate sections of db-relations.js)
2. Stream C should start when A & B are ~50% complete (relationship functions are available for integration)
3. Performance testing in Stream C may identify optimizations needed in A & B
4. Final integration testing requires all streams complete

### Integration Points
- Stream C uses functions from both Stream A (forward relationships) and Stream B (Where Used)
- DataTable component already exists, just needs integration
- Cache invalidation strategy must be consistent across all relationship functions

## Conflict Risk Assessment
**Medium Risk**: Multiple streams modifying `db-relations.js`
- **Mitigation**: Clear section boundaries:
  - Stream A: Lines 662-750 (spell relationships + new entity relationships)
  - Stream B: Lines 830+ (Where Used system)
  - Stream C: Separate component files + test files

**Low Risk**: Stream C works primarily on separate UI/test files

## Parallelization Strategy

**Recommended Approach**: Hybrid (parallel start, then convergence)

**Execution Plan**:
1. **Phase 1** (Parallel): Launch Streams A & B simultaneously
   - Stream A adds forward relationships (6 hours)
   - Stream B builds Where Used system (7 hours)
   - Expected wall time: 7 hours (max of the two)

2. **Phase 2** (Integration): Start Stream C when A & B are 50% complete
   - Stream C integrates UI and tests (5 hours)
   - Can begin integration work while A & B finalize edge cases
   - Some coordination needed for cache strategy

3. **Phase 3** (Testing): Final integration and performance validation
   - All streams converge for integration testing
   - Performance benchmarking across all entity types
   - Cache validation and optimization

## Expected Timeline

**With parallel execution**:
- Phase 1 (Parallel): 7 hours
- Phase 2 (Overlap): 3 hours (Stream C starts at 50% of A/B)
- Phase 3 (Integration): 2 hours
- **Total wall time**: ~10-12 hours

**Without parallel execution**:
- Stream A: 6 hours
- Stream B: 7 hours
- Stream C: 5 hours
- **Total wall time**: 18 hours

**Efficiency gain**: ~40-45% time reduction (18h → 10-12h)

## Notes

### Performance Considerations
- All new relationship functions must include caching with 5-minute TTL
- Use batch queries and existing indexes (career, level, characteristic, etc.)
- Avoid N+1 query patterns by using Promise.all for parallel lookups
- Where Used queries should leverage compound indexes where available

### Entity Types Coverage
Must support relationships for all 23+ entity types:
- Core: careers, careerLevels, species, classes, talents, skills, characteristics
- Equipment: trappings, qualities
- Magic: spells, lores, magicks, gods
- Creatures: creatures, traits
- Character Gen: stars, eyes, hairs, details
- Status: etats, psychologies
- Reference: books, trees

### Cache Strategy
- Maintain existing 5-minute TTL
- Use consistent cache key patterns: `{entityType}:{relationshipType}:{id}`
- Implement cache invalidation for Where Used when entities are modified
- Consider cache warming for frequently accessed relationships

### Testing Requirements
- Unit tests for each new relationship function
- Integration tests for Where Used across all entity types
- Performance benchmarks for < 100ms target
- Manual testing with real data (10+ entity types)
- Bidirectional relationship validation (A→B implies B→A exists)

### Future Extensibility
- Design Where Used system to easily support new entity types
- Document relationship patterns for future developers
- Consider adding relationship visualization (graph) in future
- Plan for real-time relationship updates if data changes
