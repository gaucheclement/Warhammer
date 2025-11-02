---
name: description
description: Unified description system for displaying detailed entity information with cross-references and navigation
status: backlog
created: 2025-11-01T12:36:45Z
---

# PRD: Description System

## Executive Summary

The Description System is a comprehensive feature that provides rich, detailed information displays for all 20 entity types in the Warhammer Character Generator v2. When users click on any entity (species, careers, spells, equipment, etc.), they will see a contextually-appropriate description panel with formatted information, cross-references to related entities, and navigation capabilities. This system replaces the legacy HTML-based `getDescription()` methods with a modern, React-based solution that adapts to different UI contexts while maintaining the depth and richness of information from the original application.

## Problem Statement

### Current State
- The legacy v1 application has 20 different Data*.html files, each implementing custom `getDescription()` methods
- Each method generates HTML strings with complex formatting, tables, and cross-references
- Description displays are context-specific but not consistently styled or navigable
- Migrating to v2 requires rebuilding this functionality with modern React patterns

### Why This Matters
- Descriptions are the primary way users understand entities and their relationships
- Without rich descriptions, the v2 application loses critical functionality that makes the character generator useful
- Users need to navigate between related entities (e.g., from a race to its available careers, from a spell to its required talent)
- The description system is foundational for the entire application - it affects nearly every user interaction

## User Stories

### Primary User Personas

**Character Builder (Primary)**
- Needs to understand what each option means before making character decisions
- Wants to see related options without losing context
- Needs quick access to rules and statistics

**Rules Reference User**
- Looks up specific entities to understand game mechanics
- Needs to see cross-references to related rules
- Wants to navigate between interconnected entities

**Game Master**
- Browses creatures, spells, and equipment for encounters
- Needs quick access to characteristics and abilities
- Wants to see complete stat blocks with all relevant information

### Detailed User Journeys

**Journey 1: Character Creation**
1. User is creating a new character and clicks on "Dwarf" species
2. Description panel opens showing:
   - Lore description of dwarves
   - Physical details (age, height formulas, eye/hair colors)
   - Racial skills and talents
   - Available careers
   - Characteristic base values
3. User clicks on "Slayer" career in the available careers list
4. Navigation occurs to Slayer career description (breadcrumb shows: Dwarf → Slayer)
5. User sees career progression, required skills, talents, and equipment
6. User clicks back button to return to Dwarf description

**Journey 2: Equipment Research**
1. User clicks on a weapon in an equipment list
2. Description shows weapon statistics, qualities, and availability
3. User clicks on a quality (e.g., "Armor Piercing")
4. Quality description appears with detailed rules explanation
5. User sees which other equipment has this quality
6. User can navigate to those items or return to original weapon

**Journey 3: Spell Discovery**
1. User views a magic lore (e.g., "Magie de Feu")
2. Description shows lore information and list of available spells
3. User clicks on a specific spell
4. Spell description shows casting number, range, target, duration, and effects
5. User sees which talents are required to cast this spell
6. User can click on the talent to see its requirements

### Pain Points Being Addressed

- **Context Loss**: In v1, clicking on cross-references often lost previous context
- **Inconsistent Display**: Different entity types had wildly different presentation styles
- **No Back Navigation**: Users couldn't easily return to previous views
- **Static Content**: Descriptions couldn't adapt to different display contexts (modal vs. panel vs. inline)
- **Poor Mobile Experience**: HTML string-based descriptions don't adapt to smaller screens

## Requirements

### Functional Requirements

#### FR1: Entity Description Components
**Priority: Critical**

Each of the 20 entity types must have a description component:
1. Trapping (Equipment)
2. Trait (Creature traits)
3. Talent
4. Tree (Chapter/folder structure)
5. Specie (Race)
6. Star (Zodiac signs)
7. Skill
8. Spell
9. Lore (Magic lore)
10. Magick (Magic domain)
11. Quality (Equipment qualities/flaws)
12. God (Deities)
13. Psychologie (Psychological traits)
14. Etat (Status conditions)
15. Creature
16. Class (Career class)
17. Characteristic
18. Book (Source books)
19. Career
20. CareerLevel (Career progression levels)

Each component must:
- Display all relevant fields for that entity type
- Format data appropriately (tables, lists, paragraphs)
- Handle missing/optional fields gracefully
- Support dynamic data updates

#### FR2: Cross-Reference System
**Priority: Critical**

Cross-references between entities must be interactive:
- All entity references in descriptions are clickable links
- Clicking a reference navigates to that entity's description
- System tracks supported cross-reference types:
  - characteristic, trait, talent, lore, skill, god, spell, etat, psychologie, magick, quality, career, tree, trapping, specie, creature, class, book, star
- Links are visually distinguished from regular text
- Tooltips show entity names on hover
- Invalid or missing references are handled gracefully

#### FR3: Navigation System
**Priority: Critical**

Users must be able to navigate between descriptions:
- **Forward Navigation**: Click any entity reference to view its description
- **Back Navigation**: Return to the previous entity description
- **Breadcrumb Trail**: Show navigation path (e.g., "Dwarf → Slayer → Shield Bash")
- **History Limit**: Reasonable limit to prevent memory issues (e.g., 50 items)
- **Navigation Controls**: Visible back/forward buttons
- **Keyboard Navigation**: Support browser back/forward buttons

#### FR4: Context-Adaptive Display
**Priority: High**

The description system must work in multiple contexts:
- **Modal/Dialog**: Full-screen overlay for focused viewing
- **Side Panel**: Slide-out panel for persistent reference
- **Inline Expansion**: Accordion-style expansion within lists
- **Dedicated Page**: Full page view with URL routing
- **Mobile Responsive**: Adapt layout for small screens

The system should accept a `displayMode` prop or context to determine presentation style.

#### FR5: Dynamic Content Rendering
**Priority: High**

Descriptions must support:
- **Formatted Text**: Paragraphs, line breaks, emphasis
- **Lists**: Bulleted and numbered lists
- **Tables**: Multi-column tables with headers
- **Nested Information**: Tabs or accordions for complex data
- **Formulas**: Display game formulas (e.g., "2d10 + 15")
- **Conditional Display**: Show/hide sections based on data presence

#### FR6: Help Text Processing
**Priority: High**

Migrate `DescriptionHelper.applyHelp()` functionality:
- Parse entity references in text (e.g., `{skill:Dodge}`, `{talent:Strike to Stun}`)
- Convert references to clickable links
- Support multiple reference formats from legacy system
- Handle escaped or special characters
- Preserve formatting while adding interactivity

#### FR7: Tab/Section Organization
**Priority: Medium**

For entities with multiple information categories:
- Group related information into tabs or sections
- Examples from Species: "Info", "Détails", "Comps/Talents", "Carrières", "Caractéristiques"
- Allow configuration of which tab/section is default
- Persist user's tab selection within session
- Mobile: Convert tabs to accordions automatically

#### FR8: Related Entity Lists
**Priority: Medium**

Show "Where Used" or "Access" information:
- For Talents: Show species and careers that grant this talent
- For Skills: Show species and careers that grant this skill
- For Spells: Show lores and gods that provide access
- For Qualities: Show equipment with this quality
- For Traits: Show creatures with this trait

Use the existing `match` system to filter and display related entities.

#### FR9: Special Displays
**Priority: Medium**

Some entity types have unique display requirements:
- **Species**: Generate random tables for eye color, hair color
- **Creatures**: Display characteristic ranges and complex trait lists
- **Career**: Show multi-level progression with inherited abilities
- **Book**: Show filtered lists of all entities from that source
- **Star**: Display characteristic modifiers with +/- indicators

#### FR10: Search and Filter Integration
**Priority: Low**

When descriptions show lists of related entities:
- Inherit any active filters from parent context
- Allow in-place filtering of long lists
- Maintain sort order consistency with parent views

### Non-Functional Requirements

#### NFR1: Performance
- Description component render time: < 100ms for 95th percentile
- Navigation transition: < 50ms perceived delay
- Large lists (e.g., all equipment in a book): Use virtualization for 100+ items
- Cache rendered descriptions for visited entities
- Lazy load tab content until selected

#### NFR2: Accessibility
- All interactive elements keyboard navigable
- Screen reader support for entity relationships
- ARIA labels for navigation controls
- Sufficient color contrast for all text
- Focus management when navigating between descriptions

#### NFR3: Extensibility
- New entity types can be added without modifying core description system
- Description components follow a standard interface/contract
- Cross-reference types are configurable
- Display modes can be extended by consumers

#### NFR4: Data Evolution
- System adapts to schema changes in entity data
- Missing fields don't break displays
- New fields can be added to entities without code changes
- Support for entity versioning (if needed in future)

#### NFR5: Internationalization Ready
- All UI strings externalized for translation
- Entity field labels configurable per locale
- Support for multi-language entity descriptions (if/when added)

#### NFR6: Consistency
- All entity descriptions follow consistent visual language
- Common information types (e.g., source book, page number) displayed uniformly
- Navigation behavior identical across all entity types
- Error states handled consistently

## Success Criteria

### Measurable Outcomes

1. **Coverage**: 100% of 20 entity types have functional description components
2. **Feature Parity**: All information displayed in v1 `getDescription()` is accessible in v2
3. **Navigation Depth**: Users can navigate at least 5 levels deep without errors
4. **Performance**: 95th percentile render time under 100ms on reference hardware
5. **Cross-Reference Accuracy**: 99%+ of cross-references link to correct entities
6. **Mobile Usability**: Description system functional on screens down to 320px width
7. **Accessibility Score**: Lighthouse accessibility score ≥ 95

### Key Metrics and KPIs

**Development Phase:**
- Test coverage for description components ≥ 80%
- Zero console errors when navigating between entities
- All legacy `getDescription()` methods successfully migrated

**Post-Launch:**
- User engagement: Average navigation depth per session
- Error rate: < 0.1% of description loads result in errors
- User satisfaction: Qualitative feedback from beta testers (if available)

### Definition of Done

- [ ] All 20 entity type description components implemented
- [ ] Cross-reference system functional for all reference types
- [ ] Navigation (forward/back/breadcrumb) working correctly
- [ ] At least 2 display modes implemented (modal + one other)
- [ ] Help text processing migrated from legacy system
- [ ] Unit tests for all description components
- [ ] Integration tests for navigation flow
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Documentation for adding new entity types
- [ ] Code review completed
- [ ] Feature demo to stakeholders

## Constraints & Assumptions

### Technical Constraints
- Must work within existing v2 React architecture
- Must use existing data layer and entity loading system
- Must maintain compatibility with current routing system
- Cannot break existing functionality in other parts of application

### Timeline Constraints
- This is a foundational feature required before many other v2 features can be completed
- Phased implementation may be necessary (start with core entity types)

### Resource Constraints
- Single developer (likely) implementing 20+ components
- Must leverage existing utility functions and components where possible
- Code generation or templating may be beneficial for repetitive patterns

### Assumptions
- Data structure for entities in v2 closely matches v1 (confirmed by existing analysis)
- Entity data is already loaded/loadable via existing data layer
- Users are familiar with v1 behavior and expect similar functionality
- Cross-reference format in entity descriptions is consistent with v1
- Help text parsing logic from DescriptionHelper can be ported

## Out of Scope

### Explicitly NOT Building

1. **Entity Editing**: Description system is read-only. Editing entities is a separate feature.
2. **Print/PDF Export**: Formatted printing or PDF generation of descriptions is separate.
3. **Custom User Notes**: Users cannot add their own notes to entity descriptions.
4. **Comparison Views**: Side-by-side comparison of multiple entities is separate feature.
5. **Advanced Search**: Full-text search within descriptions is separate feature.
6. **Sharing/Bookmarking**: Saving or sharing specific descriptions is separate feature.
7. **Offline Support**: Description system requires data access; offline caching is separate.
8. **Real-time Collaboration**: Multiple users viewing/discussing descriptions is out of scope.
9. **Animation**: Beyond simple transitions, no complex animations for description displays.
10. **Entity Creation Wizards**: Guided creation flows using descriptions is separate feature.

### Future Considerations
These items are out of scope for v1 of description system but may be added later:
- Customizable description templates per entity type
- User-selectable information density (compact/detailed views)
- Description history/recently viewed
- Integration with character sheet to show "relevant to this character" filtering

## Dependencies

### External Dependencies
- **Data Layer**: Entity data must be available via existing data loading mechanisms
- **Routing System**: Navigation between entities may require URL updates (if using dedicated page mode)
- **UI Component Library**: Tabs, modals, panels must be available or built
- **Icon Library**: For navigation controls, expandable sections, etc.

### Internal Team Dependencies
- **Data Schema Documentation**: Clear documentation of all entity types and their fields
- **Cross-Reference Format Spec**: Documented format for entity references in text
- **Design System**: Visual design for description components and navigation
- **QA Resources**: Testing navigation flows and cross-reference accuracy

### Technical Dependencies
- **Entity Type Registry**: System to map entity type strings to component implementations
- **Help Text Parser**: Port of `DescriptionHelper.applyHelp()` logic
- **Match/Filter System**: For "where used" lists
- **Navigation State Management**: React context or similar for navigation history

### Sequencing
This feature has dependencies on:
- ✅ Data layer for entity loading (already exists)
- ✅ Entity schemas defined (already exists)
- ⚠️ UI component library decisions (modal/panel components)
- ⚠️ Design system for consistent styling

This feature blocks:
- Character creation wizard (needs to show descriptions during selection)
- Equipment management (needs to show item descriptions)
- Spell book interface (needs to show spell descriptions)
- Creature statblock displays (needs to show full creature info)
- Many other features that reference entities

## Implementation Recommendations

### Phased Rollout

**Phase 1: Foundation (Priority: Critical)**
- Implement core description framework
- Build 5 most-used entity types: Specie, Career, Skill, Talent, Spell
- Implement basic navigation (forward/back)
- Single display mode (modal)
- Basic cross-reference support

**Phase 2: Expansion (Priority: High)**
- Add remaining 15 entity types
- Enhanced navigation (breadcrumb, history)
- Second display mode (side panel or inline)
- Complete cross-reference system
- Help text processing

**Phase 3: Enhancement (Priority: Medium)**
- Additional display modes
- Related entity lists ("where used")
- Tab/section organization for complex entities
- Performance optimizations
- Accessibility enhancements

**Phase 4: Polish (Priority: Low)**
- Mobile responsive improvements
- Additional keyboard shortcuts
- Search/filter integration
- Edge case handling
- Documentation

### Technical Approach Suggestions

1. **Component Architecture**:
   - Create base `EntityDescription` component with common functionality
   - Individual entity type components extend/compose base component
   - Use composition over inheritance for flexibility

2. **Cross-Reference Parsing**:
   - Port `DescriptionHelper.applyHelp()` to modern JavaScript/React
   - Consider using a markdown-like parser for entity references
   - Cache parsed descriptions to avoid re-parsing on each render

3. **Navigation State**:
   - Use React Context for navigation history
   - Consider browser history API for URL-based navigation (optional)
   - Implement stack-based history for back navigation

4. **Display Modes**:
   - Use render props or compound components pattern
   - Allow parent components to provide display context
   - Ensure core description logic is reusable across modes

5. **Performance**:
   - Lazy load description components per entity type
   - Virtualize long lists in descriptions
   - Memoize expensive computations (e.g., filtering related entities)

### Open Questions for Implementation

1. Should navigation be URL-based (allowing deep linking to specific descriptions)?
2. How should navigation state interact with browser back button?
3. Should description components be code-split per entity type?
4. What's the preferred UI library for modals/panels/tabs?
5. Should cross-reference tooltips show a preview of the referenced entity?
6. How should mobile users navigate without back buttons?

---

## Appendix: Entity Type Reference

### Complete List of Entity Types

| # | Type | Label | Key Fields | Cross-Refs |
|---|------|-------|------------|------------|
| 1 | trapping | Possession | type, damage, pa, qualities | quality, skill, talent |
| 2 | trait | Trait de créature | prefix, specs | creature, characteristic |
| 3 | talent | Talent | specs, max, test | skill, characteristic |
| 4 | tree | Chapitre | type, folder | (all types) |
| 5 | specie | Race | skills, talents, characteristics | skill, talent, career |
| 6 | star | (zodiac) | talent, characteristics | talent, characteristic |
| 7 | skill | Compétence | characteristic, specs | characteristic, talent |
| 8 | spell | Sort/Miracle | talent, cn, range, target | talent, lore, god |
| 9 | lore | (magic lore) | parent, spells | god, spell |
| 10 | magick | (magic domain) | folder, spells | spell, (all) |
| 11 | quality | (dynamic) | type, subType | trapping |
| 12 | god | Dieu | blessings, miracles | spell, lore |
| 13 | psychologie | Trait Psychologique | prefix | (all characteristics) |
| 14 | etat | État | desc | (all characteristics) |
| 15 | creature | Créature | skills, talents, traits, char | skill, talent, trait, spell |
| 16 | class | Classe | trappings | trapping, career |
| 17 | characteristic | Point de | type | skill, careerLevel |
| 18 | book | Livre | abr, language | (all types) |
| 19 | career | Carrière | class, rand | class, specie, careerLevel |
| 20 | careerLevel | Niveau de | career, characteristics, skills | career, characteristic, skill, talent |

### Example Description Structures

**Example 1: Talent (Simple)**
```
Tabs: ["Info", "Accès"]

Info:
- Maxi: [max level]
- Tests: [test requirements]
- Description: [formatted text with cross-refs]
- Specializations: [if applicable]

Accès:
- Species: [list of species granting this talent]
- Careers: [list of careers granting this talent]
```

**Example 2: Specie (Complex)**
```
Tabs: ["Info", "Détails", "Comps/Talents", "Carrières", "Caractéristiques"]

Info:
- [Lore description with cross-refs]

Détails:
- Age formula
- Height formula
- Eye color table (2d10 random table)
- Hair color table (2d10 random table)
- Other physical details

Comps/Talents:
- Racial skills list
- Racial talents list

Carrières:
- Available careers list

Caractéristiques:
- Characteristic base values table
- Roll modifiers
```

**Example 3: Creature (Very Complex)**
```
Tabs: ["Info", "Caractéristiques"]

Info:
- [Description if present]

Caractéristiques:
- Characteristics table (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)
- Skills (grouped and with specializations)
- Talents (grouped and with specializations)
- Traits (with specializations)
- Optional Traits
- Equipment
- Spells (grouped by type)
```

---

*End of PRD*
