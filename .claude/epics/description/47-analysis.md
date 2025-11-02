---
issue: 47
analyzed: 2025-11-02T10:05:37Z
streams: 4
---

# Issue #47 Analysis: Refactor Database ID System for Consistency

## Overview
This is a comprehensive refactoring to eliminate inconsistent entity identification across the codebase. The current system uses multiple methods (ID, label, index) causing maintainability issues and requiring extensive workarounds. The solution involves creating a unified parsing module, establishing stable IDs, and normalizing all entity references at data load time while preserving the original JSON format.

**Key Innovation**: All complex parsing happens once at JSON load time, with results stored in IndexedDB in a clean, structured format. The rest of the application works with normalized data structures.

## Parallel Work Streams

### Stream A: Audit and Design
**Agent**: code-analyzer
**Can Start**: Immediately
**Estimated Time**: 16-20 hours

**Files**:
- warhammer-v2/src/lib/db-relations.js (read/analyze)
- warhammer-v2/src/lib/db-descriptions.js (read/analyze)
- warhammer-v2/src/lib/validators.js (read/analyze)
- warhammer-v2/src/lib/db.js (read/analyze)
- All JSON data files in data directory (analyze formats)
- Create: .claude/epics/description/updates/47/audit-report.md
- Create: .claude/epics/description/updates/47/entity-reference-spec.md

**Scope**:
1. **Comprehensive Code Audit**:
   - Document all 12+ instances of .split(',').map(s => s.trim()) with exact line numbers
   - Identify all entity identification methods (ID/label/index usage)
   - List all normalization/workaround functions
   - Map all navigation paths (especially index-based)
   
2. **Data Format Analysis**:
   - Audit all reference formats in JSON files (traits, skills, talents, etc.)
   - Document the grammar: [Prefix] Label [Suffix] [(Spec)]
   - Identify edge cases and complex patterns
   - List all entity types and their relationship fields
   
3. **Design EntityReference Standard**:
   - Define TypeScript interface for EntityReference
   - Document transformation rules JSON to IndexedDB
   - Design ID generation scheme (stable, unique)
   - Create table name mapping (singular/plural, aliases)

**Deliverables**:
- Complete audit report with line numbers
- EntityReference specification document
- ID generation and table naming standards
- List of all files requiring modification

**Dependencies**: None

---

### Stream B: Create Unified Parser Module
**Agent**: general-purpose
**Can Start**: After Stream A completes (needs EntityReference spec)
**Estimated Time**: 18-22 hours

**Files**:
- Create: warhammer-v2/src/lib/db-reference-parser.js
- Create: warhammer-v2/src/lib/db-reference-parser.test.js
- Reference: .claude/epics/description/updates/47/entity-reference-spec.md (from Stream A)

**Scope**:
1. **Create Core Parsing Functions**:
   - parseCommaSeparatedList(text) - Replaces 12+ duplications
   - parseMultiSeparatorList(text) - comma, "ou", "et"
   - parseSpecs(entity, options) - Replaces parseTalentSpecs() and parseSkillSpecs()
   - parseEntityReference(text) - Parse: "Arme +5" or "Sort (Feu)"
   - parseEntityReferenceList(text, entityType)
   - resolveReferenceToId(label, entityType, context)

2. **Implement Grammar Parser**:
   - Reuse regex from db-descriptions.js:179-182 (already tested in applyHelp())
   - Extract: prefix (+5, -2), suffix, spec (Sorcellerie), label
   - Handle multiple separators (comma, "ou", "et")
   - Preserve original text for debugging

3. **Comprehensive Test Suite**:
   - Test all formats found in audit (Stream A)
   - Edge cases: nested parens, multiple prefixes, special characters
   - Performance tests (parsing 1000+ references)
   - Fallback behavior when parsing fails

**Deliverables**:
- db-reference-parser.js with full JSDoc
- 100% test coverage for all parsing functions
- Performance benchmarks
- Documentation with examples for each format

**Dependencies**: 
- Depends on Stream A (needs EntityReference spec and format audit)

---

### Stream C: Data Transformation Layer
**Agent**: general-purpose
**Can Start**: After Stream B completes (needs parser module)
**Estimated Time**: 16-20 hours

**Files**:
- Create: warhammer-v2/src/lib/db-loader.js
- Create: warhammer-v2/src/lib/db-loader.test.js
- Create: warhammer-v2/src/lib/db-id-generator.js
- Modify: warhammer-v2/src/lib/db.js (integrate new loader)
- Modify: warhammer-v2/src/stores/dataStore.js (use new loading system)

**Scope**:
1. **ID Generation System**:
   - Generate stable IDs from labels: "Athlétisme" to "skill-athletisme"
   - Handle duplicates: "Combat" (skill) vs "Combat" (talent)
   - Normalize accents, spaces, special chars
   - Ensure IDs never change once assigned

2. **JSON to IndexedDB Transformation**:
   - Load original JSON (unchanged format)
   - Generate IDs for all entities
   - Parse all reference strings using db-reference-parser.js
   - Resolve labels to IDs with context-aware lookup
   - Store normalized EntityReference objects in IndexedDB
   - Preserve original strings in originalText field for debugging

3. **Validation and Reporting**:
   - Validate all ID references exist
   - Report unresolved references (label not found)
   - Report ambiguous references (multiple matches)
   - Log transformation statistics
   - Create integrity report after load

4. **Table Name Normalization**:
   - Implement mapping: species to specie, careers to career
   - Document all table names and aliases
   - Consistent singular form in IndexedDB

**Deliverables**:
- db-loader.js with transformation logic
- db-id-generator.js for stable ID generation
- Comprehensive loading tests
- Sample transformation report
- Migration validation script

**Dependencies**: 
- Depends on Stream B (needs parser module)
- Blocks Stream D (D needs normalized data structure)

---

### Stream D: Refactor Existing Code
**Agent**: general-purpose
**Can Start**: After Stream C completes (needs normalized data in IndexedDB)
**Estimated Time**: 12-16 hours

**Files**:
- Modify: warhammer-v2/src/lib/db-relations.js
  - Remove: parseTalentSpecs(), parseSkillSpecs()
  - Replace 8+ instances of .split(',').map(s => s.trim())
  - Update: all functions to use EntityReference format
- Modify: warhammer-v2/src/lib/db-descriptions.js
  - Replace 2+ instances of .split(',').map(s => s.trim())
  - Update: applyHelp() to work with structured references
- Modify: warhammer-v2/src/lib/validators.js
  - Replace 2+ instances of .split(',').map(s => s.trim())
- Modify: Navigation components (all .svelte files using index)
  - Replace index-based navigation with ID-based
  - Update: Browse.svelte, ContextualHelp.svelte, etc.
- Modify: warhammer-v2/src/lib/db-relations.test.js
- Modify: warhammer-v2/src/lib/db-descriptions.test.js

**Scope**:
1. **Remove Workaround Functions**:
   - Delete: normalizeId() and similar functions
   - Delete: duplicate parsing logic (12+ instances)
   - Delete: parseTalentSpecs(), parseSkillSpecs()
   - Replace with: imports from db-reference-parser.js

2. **Update Relation Handling**:
   - Assume all references are already EntityReference objects (from IndexedDB)
   - No more runtime parsing of strings
   - Use reference.id directly for lookups
   - Preserve prefix, suffix, spec in display

3. **Fix Navigation**:
   - Replace: navigate('/entity?index=5') 
   - With: navigate('/entity?id=skill-athletisme')
   - Update: all link generation in components
   - Update: all route handlers to use ID parameter

4. **Update Search Functions**:
   - Search by ID (indexed, fast)
   - No more label to ID conversion at search time
   - Fuzzy search can still use labels (stored in entity)

5. **Update Tests**:
   - Update all tests to expect EntityReference format
   - Remove tests for deleted functions
   - Add integration tests for ID-based navigation

**Deliverables**:
- Refactored codebase with ~50-70 lines removed
- All navigation using IDs instead of indices
- All tests passing
- No parsing in business logic (only in loader)
- Code simplification report

**Dependencies**: 
- Depends on Stream C (needs normalized data available)
- Must coordinate with other streams (read their specs)

---

## Coordination Notes

### Critical Path
```
Stream A (Audit) -> Stream B (Parser) -> Stream C (Loader) -> Stream D (Refactor)
```

All streams are **sequential** - each depends on the previous completing.

### Data Compatibility
- **Phase 1** (Streams A-C): New loading system coexists with old code
- **Phase 2** (Stream D): Cutover to new system
- **No breaking changes** until Stream D is complete and tested
- Original JSON files remain unchanged throughout

### Testing Strategy
- **Stream B**: Unit tests for parser (isolated)
- **Stream C**: Integration tests for loader (with mock data)
- **Stream D**: Full e2e tests (real data, all features)
- **Final validation**: Manual testing of all entity types and navigation

### Shared Artifacts
- entity-reference-spec.md (Stream A to B, C, D)
- audit-report.md (Stream A to D for refactoring targets)
- db-reference-parser.js (Stream B to C, D)
- db-loader.js (Stream C to D for integration)

---

## Risk Factors

### High Risk: Grammar Parser Complexity
**Problem**: Reference grammar is complex with many edge cases
- Nested parentheses: "Sort (Magie (Feu))"
- Multiple prefixes: "Arme +5 +2"
- Mixed separators: "skill1, skill2 ou skill3"

**Mitigation**:
- Stream A identifies ALL formats in existing JSON (exhaustive audit)
- Stream B tests against every real-world example found
- Fallback: preserve original string if parse fails
- Logging: track all unparsed references for manual review

### Medium Risk: Label to ID Resolution Ambiguity
**Problem**: Same label may exist in multiple entity types
- "Combat" is both a skill and a talent
- "Feu" could be a lore or a trait

**Mitigation**:
- Context-aware lookup (search within correct entityType first)
- Scoring system for fuzzy matching
- Report all ambiguous cases for manual resolution
- Option to add hints to JSON if needed

### Medium Risk: Breaking Changes
**Problem**: This refactor touches all data access patterns

**Mitigation**:
- Stream C maintains backward compatibility during development
- Comprehensive test suite before Stream D
- Feature flags to enable/disable new system
- Regression testing checklist for all features

### Low Risk: Performance During Loading
**Problem**: Parsing thousands of references might be slow

**Mitigation**:
- Parse in Web Worker (non-blocking)
- Cache parsed results (localStorage)
- Progress indicator for users
- Benchmark: target <2s for full load

---

## Success Metrics

### Code Quality
- [ ] ~50-70 lines of duplicate code removed
- [ ] Zero instances of .split(',').map(s => s.trim()) outside parser module
- [ ] Zero ad-hoc parsing in business logic
- [ ] All entity references use EntityReference interface

### Data Integrity
- [ ] 100% of entities have stable IDs
- [ ] 100% of references resolved (or logged)
- [ ] Zero broken navigation links
- [ ] Referential integrity report shows 0 errors

### Performance
- [ ] Search by ID: <10ms (indexed lookup)
- [ ] Full data load: <2s (with parsing)
- [ ] Navigation: instant (no index recalculation)
- [ ] Memory: no regression (structured data is more efficient)

### Testing
- [ ] Parser: 100% code coverage
- [ ] Loader: all entity types tested
- [ ] Refactor: all existing tests pass
- [ ] E2E: navigation, search, relations all work

---

## Estimated Timeline

| Stream | Duration | Dependencies | Can Parallelize |
|--------|----------|--------------|-----------------|
| Stream A | 16-20h | None | No (foundation) |
| Stream B | 18-22h | After A | No (needs spec) |
| Stream C | 16-20h | After B | No (needs parser) |
| Stream D | 12-16h | After C | No (needs data) |
| **Total** | **62-78h** | Sequential | **No** |

**Critical**: This is NOT parallelizable. Each stream builds on the previous.

**Recommendation**: 
1. One agent handles entire flow (maintains context)
2. OR: Clear handoffs with comprehensive documentation at each stage
3. Stream A output (specs) must be detailed enough to guide B, C, D

---

## Definition of Done

### Stream A Complete When:
- [ ] Audit report lists all 12+ duplication instances with line numbers
- [ ] All reference formats documented with examples
- [ ] EntityReference interface defined
- [ ] ID generation rules documented
- [ ] Table name mapping complete

### Stream B Complete When:
- [ ] db-reference-parser.js created with all functions
- [ ] 100% test coverage achieved
- [ ] All formats from audit successfully parsed
- [ ] Performance benchmarks meet targets
- [ ] API documentation complete

### Stream C Complete When:
- [ ] db-loader.js transforms all entity types
- [ ] IDs generated and stable
- [ ] All references resolved or logged
- [ ] Integrity report generated
- [ ] Loading tests pass

### Stream D Complete When:
- [ ] All duplicate code removed
- [ ] All navigation uses IDs
- [ ] All tests passing
- [ ] No runtime parsing in business logic
- [ ] Manual testing confirms all features work

### Issue #47 Complete When:
- [ ] All 4 streams complete
- [ ] Performance metrics met
- [ ] Zero regression bugs
- [ ] Documentation updated
- [ ] Migration guide written
