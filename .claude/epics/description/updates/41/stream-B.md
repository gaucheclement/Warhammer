---
issue: 41
stream: Where Used Query System
agent: backend-specialist
started: 2025-11-01T17:15:58Z
status: in_progress
---

# Stream B: "Where Used" Query System

## Scope
Implement generic reverse lookup system that finds all entities referencing a given entity

## Files
- `warhammer-v2/src/lib/db-relations.js` (new section after current bidirectional helpers at line 829)

## Tasks
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

## Progress
- Starting implementation
