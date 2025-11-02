---
issue: 46
stream: Add Missing Relationship Configurations
agent: general-purpose
started: 2025-11-01T21:09:58Z
completed: 2025-11-01T22:18:30Z
status: completed
---

# Stream B: Add Missing Relationship Configurations

## Scope
Add singular entity type aliases to ENTITY_RELATIONSHIP_CONFIG in db-relations.js

## Files
- `warhammer-v2/src/lib/db-relations.js` (after line 1471, before queryIndexedReference function)

## Progress

### Completed Tasks
1. Added singular aliases after ENTITY_RELATIONSHIP_CONFIG definition (line 1472-1482)
2. Mapped singular types to plural configs:
   - specie → species
   - career → careers
   - skill → skills
   - talent → talents
   - spell → spells
   - trait → traits
   - trapping → trappings
   - creature → creatures (added for completeness)

### Implementation Details

Added the following code after line 1471 in `db-relations.js`:

```javascript
// Add singular aliases for entity types used by components
// These allow components to use singular forms (specie, career, skill, etc.)
// while the main config uses plural forms (species, careers, skills, etc.)
ENTITY_RELATIONSHIP_CONFIG.specie = ENTITY_RELATIONSHIP_CONFIG.species;
ENTITY_RELATIONSHIP_CONFIG.career = ENTITY_RELATIONSHIP_CONFIG.careers;
ENTITY_RELATIONSHIP_CONFIG.skill = ENTITY_RELATIONSHIP_CONFIG.skills;
ENTITY_RELATIONSHIP_CONFIG.talent = ENTITY_RELATIONSHIP_CONFIG.talents;
ENTITY_RELATIONSHIP_CONFIG.spell = ENTITY_RELATIONSHIP_CONFIG.spells;
ENTITY_RELATIONSHIP_CONFIG.trait = ENTITY_RELATIONSHIP_CONFIG.traits;
ENTITY_RELATIONSHIP_CONFIG.trapping = ENTITY_RELATIONSHIP_CONFIG.trappings;
ENTITY_RELATIONSHIP_CONFIG.creature = ENTITY_RELATIONSHIP_CONFIG.creatures;
```

### Testing

The `getEntityUsage` function (line 1617) now correctly handles singular entity types:
- Previously: `getEntityUsage('specie', id)` would log a warning and return empty object
- Now: `getEntityUsage('specie', id)` resolves to the `species` config and returns relationships

### Commits
- `b637dfa`: Issue #46: Add singular entity type aliases to ENTITY_RELATIONSHIP_CONFIG

## Summary

Stream B is complete. The singular aliases are now available and will resolve to their plural counterparts, allowing components like EntityDescription.svelte to use singular entity types without triggering "No relationship configuration found" warnings. This fixes the root cause of Issue #2 (Missing Relationship Configuration) identified in the task analysis.
