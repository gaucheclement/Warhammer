---
issue: 40
title: Enhance Cross-Reference System for All Entity Types
analyzed: 2025-11-01T16:33:20Z
estimated_hours: 16
parallelization_factor: 2.5
---

# Parallel Work Analysis: Issue #40

## Overview
Extend the existing `applyHelp()` function to support all 20+ entity types with enhanced features: tooltip previews, validation, broken reference handling, and nested reference support. Currently only supports a subset (~11 types). Need to add the remaining types and implement new tooltip/validation features.

## Parallel Streams

### Stream A: Core Cross-Reference Extension
**Scope**: Extend `applyHelp()` and `buildLabelMap()` to support all missing entity types
**Files**:
- `warhammer-v2/src/lib/db-descriptions.js` (applyHelp, buildLabelMap functions)
**Agent Type**: backend-specialist
**Can Start**: immediately
**Estimated Hours**: 6
**Dependencies**: none

**Details**:
- Add missing entity types to buildLabelMap calls across all generators
- Missing types: book, career, careerLevel, class, specie/species, spell, creature, star, tree
- Update pattern recognition in applyHelp to handle {type:label} syntax
- Ensure all 23 entity types from db.js are supported
- Test cross-references work for new types

### Stream B: Tooltip & Validation System
**Scope**: Implement tooltip preview system and reference validation
**Files**:
- `warhammer-v2/src/lib/db-descriptions.js` (new functions: validateReferences, getEntitySummary)
- `warhammer-v2/src/lib/validation.js` (integrate with existing validation)
**Agent Type**: fullstack-specialist
**Can Start**: immediately
**Estimated Hours**: 6
**Dependencies**: none

**Details**:
- Create `validateReferences(html)` function to check entity existence
- Implement tooltip data generation (1-2 line summaries)
- Add title attribute or data-tooltip attribute to showHelpText
- Handle missing/invalid references with visual indicators
- Add "broken" class for missing references
- Return validation report with broken references

### Stream C: UI Integration & Testing
**Scope**: Wire up tooltip display and visual indicators in UI
**Files**:
- `warhammer-v2/src/lib/components/**` (tooltip components if needed)
- CSS for tooltip styling and broken reference indicators
- `warhammer-v2/src/lib/db-descriptions.test.js` (comprehensive test coverage)
**Agent Type**: frontend-specialist
**Can Start**: after Stream A & B complete core functions
**Estimated Hours**: 4
**Dependencies**: Stream A (entity types), Stream B (validation logic)

**Details**:
- Implement CSS for .showHelp.broken (red underline warning)
- Add tooltip hover behavior (CSS or JS-based)
- Handle navigation events on cross-reference clicks
- Test nested references thoroughly
- Manual testing with 100+ cross-references
- Verify 99%+ accuracy requirement

## Coordination Points

### Shared Files
- `warhammer-v2/src/lib/db-descriptions.js` - Streams A & B both modify this file
  - Stream A: Extends buildLabelMap calls in all generator functions
  - Stream B: Adds validateReferences and tooltip generation
  - **Coordination**: Stream A focuses on lines 222-248 (buildLabelMap), Stream B adds new functions at end of file

### Sequential Requirements
1. Stream A must complete entity type extension before Stream C can test all types
2. Stream B must complete validation functions before Stream C integrates UI
3. Streams A & B can work in parallel on different parts of db-descriptions.js

## Conflict Risk Assessment
- **Medium Risk**: Streams A & B both modify `db-descriptions.js`
  - Stream A adds entity types to buildLabelMap calls (scattered throughout file)
  - Stream B adds new validation functions (end of file)
  - Mitigation: Stream A focuses on existing generator functions, Stream B adds new utility functions

## Parallelization Strategy

**Recommended Approach**: hybrid

1. Launch Streams A & B in parallel
   - Stream A extends entity type support
   - Stream B implements validation/tooltip system
2. Coordinate merge of db-descriptions.js changes
3. Start Stream C when A & B complete
   - Stream C integrates and tests everything

## Expected Timeline

With parallel execution:
- Wall time: 10 hours (Streams A & B: 6h parallel, Stream C: 4h sequential)
- Total work: 16 hours
- Efficiency gain: 37.5%

Without parallel execution:
- Wall time: 16 hours

## Notes

### Entity Types Requiring Support
From db.js schema (23 types):
- **Already supported** (~11): characteristic, skill, talent, etat, psychologie, magick, quality, trapping, trait, lore, god
- **Need to add** (~12): book, career, careerLevel, class, specie, spell, creature, star, tree, eyes, hairs, details

### Pattern Format
Current: Implicit matching via label text
Target: Explicit `{type:label}` syntax support
- Example: `{spell:Boule de Feu}` → Link to spell
- Example: `{creature:Gobelin}` → Link to creature
- Must coexist with existing implicit matching

### Validation Requirements
- Check entity exists before creating link
- Log warnings for broken references (console.warn)
- Visual indicator: red underline on broken refs
- Return validation report: `{ valid: [], broken: [{ type, label, location }] }`

### Nested Reference Testing
Critical: References inside entity descriptions must work
- Example: Talent "Combat" description contains `{skill:Dodge}`
- Test depth: 2-3 levels of nesting
- Verify no infinite loops or performance issues

### Manual Testing Checklist
- [ ] All 23 entity types linkable
- [ ] Tooltips show on hover
- [ ] Broken references show warning
- [ ] Click triggers navigation
- [ ] Nested refs work 2-3 levels deep
- [ ] 100+ cross-reference stress test
- [ ] No console errors for broken refs
