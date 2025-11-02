---
name: description
status: in-progress
created: 2025-11-01T12:40:22Z
updated: 2025-11-02T15:49:36Z
progress: 20%
prd: .claude/prds/description.md
github: https://github.com/gaucheclement/Warhammer/issues/35
---

# Epic: Description System

## Overview

The Description System provides rich, interactive displays for all 20+ entity types in Warhammer v2. When users click on any entity (species, careers, spells, equipment, etc.), they see a comprehensive description with cross-references, navigation, and context-appropriate formatting.

**Critical Discovery**: Significant infrastructure already exists in the codebase:
- ✅ `db-descriptions.js` - 8 entity types already have description generators
- ✅ `applyHelp()` - Cross-reference linking already implemented
- ✅ `db-relations.js` - Entity relationship navigation with caching
- ✅ `Modal.svelte` - Display container ready
- ✅ Routing, data stores, and search infrastructure in place

**This is an integration and completion project**, not a ground-up build. We'll extend existing systems rather than recreating them.

## Architecture Decisions

### 1. Leverage Existing Description Generators
**Decision**: Extend the existing `db-descriptions.js` system rather than rebuilding.
**Rationale**:
- 8 entity types already generate HTML descriptions
- `applyHelp()` already handles cross-reference linking
- Pattern is proven and working
- Reduces development time by ~60%

### 2. Component-Based Rendering
**Decision**: Create Svelte components that consume the generated HTML descriptions.
**Rationale**:
- Allows for progressive enhancement (start with HTML, add interactivity)
- Separates description logic (generators) from presentation (components)
- Enables multiple display modes (modal, panel, inline) with same generators

### 3. Navigation via Browser History API
**Decision**: Use hash-based routing with history stack management.
**Rationale**:
- Deep linking support (share URLs to specific descriptions)
- Browser back/forward buttons work naturally
- Integrates with existing `router.js` system
- History state tracks breadcrumb trail

### 4. Data-Driven Entity Configuration
**Decision**: Create entity type registry mapping types to generators and display configs.
**Rationale**:
- Single source of truth for entity type behavior
- Easy to add new entity types
- Consistent handling across all types
- Simplifies component logic

### 5. Performance-First Rendering
**Decision**: Cache generated descriptions, lazy load components, virtualize lists.
**Rationale**:
- Descriptions are computationally expensive to generate
- Users navigate frequently (high cache hit rate)
- Large related entity lists need virtualization
- Meets NFR1 requirement (< 100ms render time)

## Technical Approach

### Frontend Components

**Core Components** (New):
1. **`EntityDescription.svelte`** - Main description viewer
   - Accepts `entityType`, `entityId`, `displayMode` props
   - Fetches description via `generateDescription()`
   - Renders HTML with interactive cross-references
   - Manages tab/section state
   - Emits navigation events

2. **`DescriptionModal.svelte`** - Modal wrapper
   - Opens from anywhere via `openModal('description', {type, id})`
   - Full-screen overlay with close button
   - Integrates with existing `Modal.svelte`

3. **`DescriptionPanel.svelte`** - Side panel wrapper
   - Slide-out panel for persistent reference
   - Resizable width
   - Stays open while user works elsewhere

4. **`DescriptionInline.svelte`** - Inline expansion wrapper
   - Accordion-style in lists
   - Compact view with expand/collapse

5. **`NavigationBar.svelte`** - Navigation controls
   - Back/forward buttons
   - Breadcrumb trail
   - History dropdown
   - Keyboard shortcut hints

**Supporting Components** (Reuse Existing):
- `Modal.svelte` - Base modal container
- `DataTable.svelte` - Related entity lists
- `Badge.svelte` - Entity type indicators
- `Toast.svelte` - User feedback
- `SearchBar.svelte` - Quick entity lookup

### Backend Services

**Description Generation** (Extend Existing):

Current state in `db-descriptions.js`:
- ✅ Career
- ✅ CareerLevel
- ✅ Talent
- ✅ Skill
- ✅ Spell
- ✅ Class
- ✅ Species
- ✅ Trapping

Missing generators to implement:
- ❌ Trait (creature traits)
- ❌ Tree (chapters)
- ❌ Star (zodiac signs)
- ❌ Lore (magic lore)
- ❌ Magick (magic domains)
- ❌ Quality (equipment qualities)
- ❌ God (deities)
- ❌ Psychologie (psychological traits)
- ❌ Etat (status conditions)
- ❌ Creature
- ❌ Characteristic
- ❌ Book (source books)

**Relationship Navigation** (Extend Existing):

`db-relations.js` already provides:
- Career ↔ Levels, Class, Species
- CareerLevel ↔ Skills, Talents, Trappings
- Talent ↔ Careers, Skills
- Skill ↔ Characteristic, Careers, Talents
- Caching layer (5-minute TTL)

Need to add:
- Spell ↔ Lore, God, Talent
- Trapping ↔ Quality
- Trait ↔ Creature
- Generic "Where Used" queries for all types

**Cross-Reference System** (Enhance Existing):

Current `applyHelp()` supports:
- Pattern: `{type:label}` (e.g., `{skill:Dodge}`)
- Generates: `<span class="showHelp" data-type="type" data-id="id">label</span>`

Enhancements needed:
- Support all 20+ entity types (currently partial)
- Add tooltip previews on hover
- Handle missing/invalid references gracefully
- Support nested references
- Add reference validation during generation

### Infrastructure

**Entity Type Registry** (New):
```javascript
// src/lib/entity-registry.js
export const ENTITY_REGISTRY = {
  career: {
    generator: generateCareerDescription,
    displayName: 'Carrière',
    icon: 'briefcase',
    defaultTab: 'Info',
    hasRelatedEntities: true
  },
  skill: {
    generator: generateSkillDescription,
    displayName: 'Compétence',
    icon: 'star',
    defaultTab: 'Info',
    hasRelatedEntities: true
  },
  // ... all 20+ types
}
```

**Navigation State Management** (New):
```javascript
// src/stores/navigation.js
export const navigationHistory = writable([])
export const currentDescription = writable(null)

export function navigateToEntity(type, id) {
  // Push to history
  // Update URL hash
  // Load description
}

export function navigateBack() {
  // Pop from history
  // Update URL
  // Load previous description
}
```

**Description Cache** (New):
```javascript
// src/lib/description-cache.js
export class DescriptionCache {
  constructor(maxSize = 100, ttl = 300000) {} // 5 min TTL

  get(type, id) {}
  set(type, id, description) {}
  invalidate(type, id) {}
  clear() {}
}
```

**Deployment Considerations**:
- No backend changes required (client-side only)
- Bundle size impact: ~30KB for new components + generators
- Code splitting: Lazy load description generators per type
- Build process: No changes needed

**Monitoring & Observability**:
- Track description generation time (performance budget)
- Monitor cache hit rate (target > 70%)
- Log navigation depth (user engagement metric)
- Error tracking for missing entities / broken references

## Implementation Strategy

### Development Phases

**Phase 1: Complete Description Generators** (Week 1)
- Implement 12 missing description generators
- Follow existing patterns from `db-descriptions.js`
- Test each generator with real entity data
- Document generator API and patterns

**Phase 2: Unified Viewer Component** (Week 1-2)
- Create `EntityDescription.svelte` base component
- Integrate with existing generators
- Add cross-reference click handling
- Implement tab/section UI
- Build basic navigation controls

**Phase 3: Navigation System** (Week 2)
- Implement navigation history stack
- Add breadcrumb trail component
- Integrate with browser history API
- Add keyboard shortcuts (Alt+Left/Right)
- Build history dropdown

**Phase 4: Display Modes** (Week 2-3)
- Create modal wrapper (integrate with existing Modal)
- Build side panel component
- Implement inline expansion mode
- Ensure responsive behavior on mobile

**Phase 5: Enhanced Cross-References** (Week 3)
- Extend `applyHelp()` for all entity types
- Add tooltip previews
- Implement reference validation
- Handle edge cases (missing entities, circular refs)

**Phase 6: Related Entities** (Week 3-4)
- Extend `db-relations.js` with missing relationships
- Add "Where Used" sections to descriptions
- Integrate with DataTable for long lists
- Optimize queries for performance

**Phase 7: Performance & Accessibility** (Week 4)
- Implement description caching
- Add lazy loading for generators
- Virtualize long entity lists
- Keyboard navigation improvements
- Screen reader testing & ARIA labels
- Performance profiling

**Phase 8: Testing & Documentation** (Week 4-5)
- Unit tests for all description generators
- Integration tests for navigation flow
- E2E tests for critical user journeys
- Component API documentation
- Usage guide for adding new entity types

### Risk Mitigation

**Risk**: Description generators produce inconsistent HTML formats
**Mitigation**: Standardize output format, create helper functions for common patterns

**Risk**: Performance degradation with deep navigation (many cached descriptions)
**Mitigation**: LRU cache with configurable size, monitor memory usage

**Risk**: Cross-reference loops (A → B → A) cause infinite navigation
**Mitigation**: Track visited entities in navigation session, warn on loops

**Risk**: Mobile UX poor due to complex descriptions
**Mitigation**: Responsive design from day 1, mobile testing throughout

**Risk**: Breaking changes to existing `db-descriptions.js` usage
**Mitigation**: Maintain backward compatibility, version generator functions

### Testing Approach

**Unit Tests** (Jest + Testing Library):
- Each description generator function
- Cross-reference parsing logic
- Navigation state management
- Cache operations
- Entity registry lookups

**Integration Tests**:
- Full description rendering flow
- Navigation between entities
- Cross-reference click handling
- Display mode switching
- Data store integration

**E2E Tests** (Playwright):
- User journey: Browse → View → Navigate → Return
- Cross-reference navigation
- History navigation
- Mobile responsive behavior

**Performance Tests**:
- Description generation time < 50ms (target)
- Component render time < 100ms (requirement)
- Cache hit rate > 70%
- Navigation transition < 50ms

**Accessibility Tests**:
- Keyboard navigation (tab, arrow keys, shortcuts)
- Screen reader compatibility
- ARIA labels correctness
- Color contrast verification
- Focus management

## Tasks Created
- [ ] #36 - Complete Missing Description Generators (parallel: false)
- [ ] #37 - Create EntityDescription Unified Viewer Component (parallel: false)
- [ ] #38 - Implement Navigation and History System (parallel: false)
- [ ] #39 - Build Display Mode Wrapper Components (parallel: true)
- [ ] #40 - Enhance Cross-Reference System for All Entity Types (parallel: true)
- [ ] #41 - Extend Related Entities System (parallel: true)
- [ ] #42 - Implement Performance Optimizations and Accessibility (parallel: false)
- [ ] #43 - Testing and Documentation (parallel: false)
- [ ] #48 - Unify Data Layer Architecture - Merge data.js and dataStore.js (parallel: true)

Total tasks: 9
Parallel tasks: 4
Sequential tasks: 5
## Task Breakdown Preview

High-level task categories for implementation:

- [ ] **Complete Description Generators**: Implement 12 missing entity type generators following existing patterns
- [ ] **Unified Description Viewer**: Create reusable Svelte component that renders descriptions in any display mode
- [ ] **Navigation & History System**: Add breadcrumb, back/forward, history stack, browser integration
- [ ] **Display Mode Adapters**: Build modal, side panel, and inline wrappers for description viewer
- [ ] **Enhanced Cross-References**: Extend applyHelp() for all types, add tooltips, validation, error handling
- [ ] **Related Entities System**: Extend db-relations.js, add "Where Used" sections, optimize queries
- [ ] **Performance & Accessibility**: Implement caching, lazy loading, keyboard nav, ARIA labels, screen reader support
- [ ] **Testing & Documentation**: Unit tests, integration tests, E2E tests, usage documentation

## Dependencies

### External Dependencies
- ✅ **Data Layer**: `data.js` stores, `db.js` IndexedDB access (exists)
- ✅ **Routing System**: `router.js` hash-based routing (exists)
- ✅ **UI Components**: Modal, DataTable, Badge (exists)
- ⚠️ **Design System**: Need to define description-specific styles (tabs, breadcrumb, etc.)

### Internal Team Dependencies
- **Data Schema Validation**: Confirm all entity types have stable schemas
- **UX Design**: Mockups for navigation controls and display modes
- **QA Resources**: Manual testing for cross-reference accuracy across 20+ types

### Technical Dependencies
- ✅ `db-descriptions.js` - Core description generation (exists, needs extension)
- ✅ `db-relations.js` - Entity relationships (exists, needs extension)
- ✅ `applyHelp()` - Cross-reference linking (exists, needs enhancement)
- ❌ Entity Type Registry - New component registry system
- ❌ Navigation State Store - New Svelte store for history
- ❌ Description Cache - New LRU cache implementation

### Sequencing

**Blockers**: None. All prerequisites exist.

**This feature blocks**:
- Character creation wizard (needs descriptions for selection)
- Equipment manager (needs item descriptions)
- Spell book (needs spell descriptions)
- Creature compendium (needs stat blocks)
- Admin entity editor improvements

## Success Criteria (Technical)

### Performance Benchmarks
- ✅ Description generation: < 50ms average, < 100ms p95
- ✅ Component render: < 100ms p95 (PRD requirement)
- ✅ Navigation transition: < 50ms perceived delay
- ✅ Cache hit rate: > 70% after 5 minutes of usage
- ✅ Bundle size increase: < 50KB gzipped

### Quality Gates
- ✅ Test coverage: ≥ 80% for description components
- ✅ Zero console errors during navigation
- ✅ All 20+ entity types render descriptions
- ✅ Cross-reference accuracy: 99%+ (manual audit of 100 random refs)
- ✅ Accessibility: Lighthouse score ≥ 95
- ✅ Mobile: Functional on 320px width screens

### Acceptance Criteria
- ✅ User can view description for any entity type
- ✅ Clicking cross-references navigates to target entity
- ✅ Back button returns to previous description
- ✅ Breadcrumb shows navigation path (up to 5 levels)
- ✅ Descriptions work in modal, panel, and inline modes
- ✅ Related entities ("Where Used") display correctly
- ✅ Tab/section organization works for complex entities
- ✅ Keyboard navigation fully functional
- ✅ No memory leaks after 50+ navigation events

## Estimated Effort

### Overall Timeline: 4-5 Weeks

**Week 1: Foundation**
- Complete 12 missing description generators (3 days)
- Build unified EntityDescription component (2 days)

**Week 2: Navigation**
- Implement navigation system (2 days)
- Create display mode wrappers (2 days)
- Browser history integration (1 day)

**Week 3: Enhancement**
- Extend cross-reference system (2 days)
- Add related entities ("Where Used") (2 days)
- Implement tooltips and previews (1 day)

**Week 4: Polish**
- Performance optimizations (2 days)
- Accessibility improvements (1 day)
- Mobile responsive fixes (1 day)
- Bug fixes (1 day)

**Week 5: Testing & Documentation**
- Write unit and integration tests (2 days)
- E2E test scenarios (1 day)
- Documentation and usage guide (1 day)
- Code review and refinement (1 day)

### Resource Requirements
- **1 Full-Stack Developer**: Primary implementer (100% allocation)
- **1 UX Designer**: Design system for navigation/display modes (20% allocation, Week 1-2)
- **1 QA Engineer**: Manual cross-reference testing (50% allocation, Week 4-5)

### Critical Path Items
1. **Description Generators** - Must complete before viewer component work
2. **Navigation System** - Required for cross-reference functionality
3. **Display Modes** - Needed for integration with existing UI
4. **Performance Testing** - Must validate before release

### Risks to Timeline
- **High Complexity Entity Types**: Book, Creature may take 2x longer than estimated
- **Cross-Reference Edge Cases**: Handling all reference patterns may uncover hidden complexity
- **Performance Optimization**: May require iteration if initial approach doesn't meet benchmarks

## Open Questions for Implementation

1. **URL Structure**: Should entity descriptions use `/entity/:type/:id` or `/description/:type/:id`?
   - Recommendation: `/entity/:type/:id` (more intuitive)

2. **Navigation History Limit**: 50 items enough? Should it persist across sessions?
   - Recommendation: 50 items, session-only (clear on page reload)

3. **Cross-Reference Tooltip Content**: Show full entity description or just summary?
   - Recommendation: Summary only (1-2 lines) to avoid performance issues

4. **Display Mode Default**: What should default display mode be?
   - Recommendation: Modal (most common use case, least intrusive)

5. **Entity Type Priority**: If timeline slips, which entity types are MVP?
   - Recommendation: Species, Career, Skill, Talent, Spell (most used in character creation)

6. **Code Splitting**: Should each entity type generator be a separate bundle?
   - Recommendation: Yes for large types (Career, Species, Creature), no for simple types

## Technical Debt & Future Improvements

### Technical Debt Created
- **HTML String Generation**: Generators produce HTML strings (not ideal for React/Svelte)
  - Future: Migrate to JSON description format, render in components
- **Incomplete Type Safety**: No TypeScript for description generators
  - Future: Add TypeScript definitions for all entity schemas

### Future Enhancements (Out of Scope for v1)
- **Real-time Collaboration**: Multiple users viewing same description with cursors
- **Description History**: Track user's recently viewed entities
- **Comparison Mode**: Side-by-side comparison of 2+ entities
- **Print/Export**: PDF generation from descriptions
- **Custom Layouts**: User-configurable description template per entity type
- **Description Search**: Full-text search within description content
- **Bookmarks**: Save favorite entities for quick access

---

## Appendix: Existing Infrastructure Reference

### Key Files to Work With

**Description Generation**:
- `src/lib/db-descriptions.js` - Core generators (extend this)
- `src/lib/db-relations.js` - Entity relationships (extend this)

**UI Components**:
- `src/components/Modal.svelte` - Modal wrapper (reuse)
- `src/components/DataTable.svelte` - Related entity lists (reuse)
- `src/components/Badge.svelte` - Entity type badges (reuse)

**Data Layer**:
- `src/stores/data.js` - Reactive entity stores (use for data access)
- `src/lib/db.js` - IndexedDB access (use for queries)
- `src/stores/ui.js` - UI state (extend for description state)

**Routing**:
- `src/lib/router.js` - Routing utilities (extend with new routes)

**Search**:
- `src/lib/search.js` - Entity search (use for quick lookup)

### Generator Function Signature

All description generators should follow this pattern:

```javascript
/**
 * Generate description HTML for an entity
 * @param {string} entityId - Entity unique identifier
 * @returns {Promise<Object>} Description object with tabs/sections
 *
 * Return format:
 * {
 *   tabs: {
 *     "Info": "<p>Description with {skill:Dodge} references</p>",
 *     "Stats": "<table>...</table>",
 *     "Related": "<ul>...</ul>"
 *   },
 *   defaultTab: "Info",
 *   metadata: {
 *     entityType: "talent",
 *     entityId: "combat",
 *     label: "Combat"
 *   }
 * }
 */
export async function generateEntityDescription(entityId) {
  // Implementation
}
```

### Cross-Reference Format

Current supported format in `applyHelp()`:
- `{skill:Dodge}` → Links to skill "Dodge"
- `{talent:Strike to Stun}` → Links to talent "Strike to Stun"
- `{characteristic:Force}` → Links to characteristic "Force"

Need to extend for:
- `{spell:Boule de Feu}` → Link to spell
- `{creature:Gobelin}` → Link to creature
- `{trait:Effrayant (2)}` → Link to trait with spec
- `{quality:Armor Piercing}` → Link to quality
- etc. (all 20+ types)

---

*End of Epic*
