---
issue: 41
stream: Core Relationship Extensions
agent: backend-specialist
started: 2025-11-01T17:15:58Z
status: in_progress
---

# Stream A: Core Relationship Extensions

## Scope
Add missing forward relationship functions (Spell ↔ Lore/God/Talent, Trapping ↔ Quality, Trait ↔ Creature, etc.)

## Files
- `warhammer-v2/src/lib/db-relations.js` (lines 662-709 - extend spell relationships)
- `warhammer-v2/src/lib/db-relations.js` (new sections after line 709)

## Tasks
1. Add Spell ↔ God relationship functions (divine spells)
2. Add Spell ↔ Talent relationship functions (spell-granting talents)
3. Add Trapping ↔ Quality relationship functions
4. Add Trait ↔ Creature relationship functions
5. Add God ↔ Blessing/Miracle relationships
6. Add Lore ↔ Magick domain relationships
7. Update cache patterns for new relationships
8. Add JSDoc documentation for all new functions

## Progress
- Starting implementation
