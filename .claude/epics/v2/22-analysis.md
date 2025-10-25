---
issue: 22
title: Intégrer la structure de données riche dans db.js
analyzed: 2025-10-25T05:58:16Z
estimated_hours: 24
parallelization_factor: 2.5
---

# Parallel Work Analysis: Issue #22

## Overview
Enrich the minimal IndexedDB schema in `db.js` to match the rich data structure defined in the original HTML files. This involves adding missing fields, implementing relationships, porting transformation logic, and adding description generation capabilities across 23 entity types.

## Parallel Streams

### Stream A: Schema Enhancement
**Scope**: Update Dexie schema with all missing fields from HTML data definitions
**Files**:
- ../epic-v2/warhammer-v2/src/lib/db.js (schema section only)
**Agent Type**: fullstack-specialist
**Can Start**: immediately
**Estimated Hours**: 6
**Dependencies**: none

**Details**:
- Analyze all 23 Data*.html files to extract complete field lists
- Add missing fields to each table (desc, book, page, specs, etc.)
- Add compound indexes for relationships (e.g., [career+level])
- Add multi-entry indexes for array fields (e.g., *species)
- Update schema version to v2
- Document schema changes

### Stream B: Relations Layer
**Scope**: Create relationship helper functions to navigate between related entities
**Files**:
- ../epic-v2/warhammer-v2/src/lib/db-relations.js (new file)
**Agent Type**: backend-specialist
**Can Start**: immediately
**Estimated Hours**: 8
**Dependencies**: none (can work with Stream A in parallel using anticipated schema)

**Details**:
- Port relationship logic from DataCareer.html, DataTalent.html, DataSkill.html, etc.
- Implement getCareerWithLevels(), getTalentWithRelations(), etc.
- Handle bidirectional relationships (career ↔ careerLevel, talent ↔ skill)
- Support array relationships (career → species[], careerLevel → talents[])
- Add caching layer for frequently accessed relationships
- Write JSDoc documentation for all relationship helpers

### Stream C: Transformation Layer
**Scope**: Port DataHelper transformation and parsing logic
**Files**:
- ../epic-v2/warhammer-v2/src/lib/db-transforms.js (new file)
**Agent Type**: backend-specialist
**Can Start**: after Stream A schema changes are defined (can work with anticipated schema)
**Estimated Hours**: 7
**Dependencies**: Stream A (needs schema structure)

**Details**:
- Port stringToElems() logic from DataHelper.html
- Implement parseElems() for transforming raw data
- Handle spec parsing (splitting "spec1, spec2" into arrays)
- Implement data binding and resolution (ID strings → object references)
- Support type-specific transformations (careers, talents, skills, spells, etc.)
- Add validation for transformed data

### Stream D: Description Generation Layer
**Scope**: Port DescriptionHelper description generation logic
**Files**:
- ../epic-v2/warhammer-v2/src/lib/db-descriptions.js (new file)
**Agent Type**: fullstack-specialist
**Can Start**: after Stream B completes (needs relationship helpers)
**Estimated Hours**: 6
**Dependencies**: Stream B

**Details**:
- Port getDescription() methods from all Data*.html files
- Implement DescriptionHelper.applyHelp() logic
- Generate structured descriptions for all 23 entity types
- Support nested descriptions (career → levels → skills/talents)
- Handle formatting and labels
- Support hierarchical display (folders/trees)

### Stream E: Testing & Documentation
**Scope**: Comprehensive testing and documentation
**Files**:
- ../epic-v2/warhammer-v2/src/lib/db.test.js (new file)
- ../epic-v2/warhammer-v2/src/lib/db-relations.test.js (new file)
- ../epic-v2/warhammer-v2/src/lib/db-transforms.test.js (new file)
- ../epic-v2/warhammer-v2/src/lib/db-descriptions.test.js (new file)
- ../epic-v2/warhammer-v2/docs/database-schema.md (new file)
**Agent Type**: fullstack-specialist
**Can Start**: after Streams A, B, C complete
**Estimated Hours**: 8
**Dependencies**: Streams A, B, C, D

**Details**:
- Unit tests for schema migrations
- Integration tests for relationships
- Tests for transformations and parsing
- Tests for description generation
- Documentation of enriched schema
- Migration guide from v1 to v2
- API documentation for new helpers

## Coordination Points

### Shared Files
- `../epic-v2/warhammer-v2/src/lib/db.js` - Stream A modifies schema section only, other streams import from it
- `../epic-v2/warhammer-v2/package.json` - If new dependencies needed (coordinate additions)

### Sequential Requirements
1. Stream A schema structure should be defined before Stream C completes transformations
2. Stream B relationship helpers must complete before Stream D description generation
3. Streams A, B, C must complete before Stream E comprehensive testing

### Parallel Execution Notes
- Streams A and B can start immediately and work in parallel
- Stream B can anticipate schema changes and adjust when A finalizes
- Stream C can start with anticipated schema, coordinate with A for final schema
- Stream D waits for B to complete
- Stream E waits for A, B, C to complete before comprehensive testing

## Conflict Risk Assessment
- **Low Risk**: Each stream works on separate files (db-relations.js, db-transforms.js, db-descriptions.js)
- **Low Risk**: Stream A only modifies the schema section of db.js, not the helper functions
- **Very Low Risk**: Clear separation of concerns with minimal overlap

## Parallelization Strategy

**Recommended Approach**: hybrid

**Phase 1 (Parallel)**: Launch Streams A and B simultaneously
- Stream A enriches schema
- Stream B builds relationships (can anticipate schema)
- Wall time: ~8 hours (max of 6h and 8h)

**Phase 2 (Parallel)**: Launch Stream C when A is defined
- Stream C transforms data using new schema
- Stream B continues if needed
- Wall time: ~7 hours

**Phase 3 (Sequential)**: Launch Stream D after B completes
- Stream D generates descriptions using relationships
- Wall time: ~6 hours

**Phase 4 (Sequential)**: Launch Stream E after A, B, C complete
- Stream E tests and documents everything
- Wall time: ~8 hours

## Expected Timeline

With parallel execution:
- Wall time: ~29 hours (8 + 7 + 6 + 8)
- Total work: 35 hours (6 + 8 + 7 + 6 + 8)
- Efficiency gain: 17%

Without parallel execution:
- Wall time: 35 hours (sequential)

**Note**: The parallelization factor of 2.5x is conservative. Actual gains depend on coordination overhead and schema finalization timing. The main benefit is having multiple agents working simultaneously in Phase 1.

## Notes

### Data Source Analysis Required
Each stream should reference the original HTML files:
- DataFunctions.html - Framework patterns
- DataHelper.html - Transformation patterns
- DescriptionHelper.html - Description patterns
- Data*.html (23 files) - Type-specific implementations

### Schema Migration Strategy
Consider using Dexie's version migration system:
```javascript
db.version(2).stores({
  // Enhanced schema
}).upgrade(tx => {
  // Migrate existing data
})
```

### Testing Priority
Focus testing on:
1. Schema migrations (v1 → v2)
2. Relationship integrity (bidirectional)
3. Transformation accuracy (parsing specs, IDs)
4. Description completeness (all 23 types)

### Risk Mitigation
- Keep v1 schema functional during development
- Test migrations with real data samples
- Document all breaking changes
- Provide rollback strategy
