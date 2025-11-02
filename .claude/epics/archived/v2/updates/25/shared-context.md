# Issue #25 - Shared Context

## Overview

This file contains shared discoveries and context across all streams working on Issue #25 (Stream C - Documentation Part 2).

**Last Updated**: 2025-10-25
**Updated By**: Stream C

## Project Architecture Findings

### Project Structure

The project is actually a **dual-structure repository**:

1. **Root Level** (`/epic-v2/`): Google Apps Script project for data extraction
   - Legacy HTML files for data management UI
   - `extract-data.js` - Node.js script to pull data from Google Sheets
   - `data/` directory - stores extracted JSON data

2. **Warhammer-v2 Subdirectory** (`/epic-v2/warhammer-v2/`): Modern Svelte PWA
   - Main application codebase
   - Single-file build architecture
   - All documentation located here

### Tech Stack (warhammer-v2)

**Core**:
- Svelte 5.39.6 (UI framework, compiled to vanilla JS)
- Vite 7.1.7 (build tool, dev server)
- Dexie 4.2.1 (IndexedDB wrapper)
- svelte-spa-router 4.0.1 (hash-based routing)
- Fuse.js 7.1.0 (fuzzy search)

**Testing**:
- Vitest 4.0.3 (unit testing)
- @testing-library/svelte 5.2.8
- happy-dom 20.0.8 (DOM simulation)
- fake-indexeddb 6.2.4 (IndexedDB mocking)

**Build Plugins**:
- vite-plugin-singlefile 2.3.0 (inlines all assets)
- vite-plugin-pwa 1.1.0 (Service Worker generation)
- vite-plugin-html 3.2.2 (HTML minification)
- rollup-plugin-visualizer 6.0.5 (bundle analysis)

### Component Architecture

**Directory Layout** (`/warhammer-v2/src/`):

```
components/
├── character/          # Character display components (12 files)
├── common/            # Reusable UI elements
└── wizard/            # Character creator steps (11 files)

layouts/
├── Layout.svelte      # Main layout wrapper
├── Header.svelte      # App header with navigation
├── Sidebar.svelte     # Navigation sidebar
└── Footer.svelte      # App footer

routes/                # Page components (route targets)
├── Home.svelte        # Landing page
├── Browse.svelte      # Data browser with filters
├── CharacterList.svelte  # Character management
├── CharacterSheet.svelte # Character detail view
├── Creator.svelte     # Character creation wizard
├── Admin.svelte       # Admin panel for data management
├── Settings.svelte    # User settings
└── NotFound.svelte    # 404 page

stores/
└── data.js            # Svelte stores for state management
    ├── officialData (writable)
    ├── customModifications (writable)
    ├── mergedData (derived)
    └── characters (writable)

lib/                   # Business logic and utilities
├── db.js              # IndexedDB schema (24 tables)
├── db-relations.js    # Entity relationship navigation
├── db-transforms.js   # Data parsing and enrichment
├── db-descriptions.js # Rich description generation
├── initData.js        # Database initialization logic
├── dataMerger.js      # Official + custom data merging
├── router.js          # Route configuration with lazy loading
├── characterModel.js  # Character data structure (20KB)
├── characterGenerator.js  # Character creation logic (14KB)
├── characterCalculations.js  # Stats calculations (13KB)
├── characterValidation.js  # Validation rules (18KB)
├── characterAdvancement.js  # XP and advancement (12KB)
├── characterImport.js # JSON import logic (13KB)
├── characterExport.js # JSON export logic (6KB)
├── dataOperations.js  # CRUD operations (17KB)
├── exportModifications.js  # Custom content export (6KB)
├── importModifications.js  # Custom content import (15KB)
├── draftManager.js    # Draft auto-save (4KB)
├── formSchemas.js     # Form field definitions (31KB)
├── validation.js      # General validation utilities (13KB)
├── validators.js      # Entity-specific validators (18KB)
├── search.js          # Fuzzy search with Fuse.js (12KB)
├── toastStore.js      # Toast notifications (2.5KB)
└── __tests__/         # Unit tests (11 test files)
```

**Component Count**: 66 Svelte components total

### State Management Pattern

**Three-Layer Data Architecture**:

1. **Official Data** (Immutable):
   - Loaded from `window.__WARHAMMER_DATA__` (embedded at build time)
   - Stored in IndexedDB (23 tables for game data)
   - Never directly modified

2. **Custom Modifications** (Mutable):
   - User edits and homebrew content
   - Stored in localStorage (for modifications)
   - Stored in IndexedDB (for characters)

3. **Merged Data** (Computed):
   - Derived store that combines official + custom
   - Custom overrides official by ID
   - Real-time reactive updates via Svelte stores

**Store Usage Pattern**:
```javascript
// Subscribe to merged data (auto-updates)
$: talents = $mergedData.talents

// Modify custom content
modifyEntity('talents', 'talent-id', { max: '2' })

// Create custom content
createCustomEntity('talents', { label: 'New Talent', ... })
```

### Database Schema

**IndexedDB Database**: `WarhammerDB`
**Schema Version**: v2
**Total Tables**: 24

**Game Data Tables** (23):
- books, careers, careerLevels, species, classes
- talents, characteristics, trappings, skills, spells
- creatures, stars, gods, eyes, hairs, details
- traits, lores, magicks, etats, psychologies
- qualities, trees

**User Data Tables** (1):
- characters (user-created characters with full state)

**Index Types**:
- Primary: `id` on all tables
- Secondary: `label`, `book`, `page`, `folder` (for filtering/sorting)
- Compound: `[career+careerLevel]` (for efficient level queries)
- Multi-entry: `*specs` (for searching within array fields)

**Key Relationships**:
- Career → Class (forward)
- Career Level → Career, Skills, Talents (forward)
- Skill → Characteristic (forward)
- Skill ← Career Levels (reverse, computed)
- Talent ← Career Levels (reverse, computed)

### Build Process

**Development** (`npm run dev`):
- Vite dev server on port 5173
- Hot Module Replacement (HMR)
- No minification, source maps enabled

**Production** (`npm run build`):
1. Svelte compiles to JavaScript
2. Rollup bundles all modules
3. Custom plugin embeds `../data/all-data.json` as `window.__WARHAMMER_DATA__`
4. vite-plugin-html minifies HTML
5. vite-plugin-singlefile inlines all CSS and JS
6. Terser minifies JS (removes console.log)
7. vite-plugin-pwa generates Service Worker
8. Output: Single `dist/index.html` file

**Bundle Metrics**:
- Uncompressed: ~1.8MB (includes 1.6MB embedded data)
- Gzipped: ~445KB
- Brotli: ~380KB

### Data Flow

**Initialization Sequence**:
1. `main.js` calls `initializeDatabase()`
2. Check `localStorage` for `warhammer_data_initialized` flag
3. If not initialized:
   - Load `window.__WARHAMMER_DATA__`
   - Bulk insert into IndexedDB (23 tables)
   - Set initialization flag
4. Mount Svelte app
5. `App.svelte` calls `initializeDataStores()`
6. Load official data from IndexedDB → `officialData` store
7. Load custom modifications from localStorage → `customModifications` store
8. `mergedData` derived store automatically computes combination
9. Load characters from IndexedDB → `characters` store

**Runtime Data Updates**:
- User edits entity → Update `customModifications` store → Save to localStorage
- `mergedData` automatically recomputes (Svelte reactivity)
- Components re-render with updated data

### Routing Architecture

**Router**: svelte-spa-router (hash-based)

**Route Configuration** (`lib/router.js`):
- `/` - Home (loaded immediately)
- All other routes lazy-loaded via `wrap()` for code splitting
- Supports route parameters (`:id`, `:category`)
- Route guards: `beforeRouteChange()`, `afterRouteChange()`
- Auto-scroll to top on navigation
- Dynamic page title updates

**Navigation Patterns**:
```javascript
import { push } from 'svelte-spa-router'
push('/characters')  // Navigate programmatically
```

### Testing Strategy

**Test Framework**: Vitest with happy-dom

**Test Files** (`lib/__tests__/`):
- `db.test.js` - Database operations
- `db-relations.test.js` - Relationship navigation
- `db-transforms.test.js` - Data transformations
- `db-descriptions.test.js` - Description generation
- `dataMerger.test.js` - Official + custom merging
- `dataOperations.test.js` - CRUD operations
- `importExport.test.js` - Import/export logic
- `search.test.js` - Fuzzy search
- `validation.test.js` - Validation utilities

**Test Commands**:
- `npm test` - Run once
- `npm run test:watch` - Watch mode
- `npm run test:ui` - Visual test UI
- `npm test -- --coverage` - Coverage report

**Coverage Focus**:
- Business logic: 80%+ target
- Utilities: 90%+ target
- Components: 60%+ target

### Offline Strategy

**PWA Configuration**:
- Service Worker auto-generated by vite-plugin-pwa
- Cache strategy: Cache First for app shell
- Runtime caching for external fonts (Google Fonts)
- Max file size: 3MB (accommodates single-file build)
- Auto-update on new version (skipWaiting: true)

**Offline Capabilities**:
- Complete functionality without internet after first load
- All data embedded and stored in IndexedDB
- Service Worker caches application shell
- Works with `file://` protocol

### Data Extraction Process

**External System**: Google Apps Script web application
- Hosts official game data in Google Sheets
- Provides REST endpoint for data extraction
- Returns JSON with 23 entity types

**Extraction Script** (`/extract-data.js` in root):
- Node.js script using native `https` module
- Connects to Google Apps Script URL
- Downloads all-data.json
- Saves to `/data/all-data.json`
- Used by build process to embed data

**npm Scripts**:
- `npm run extract` - Pull latest data from Google Sheets
- `npm run prebuild` - Auto-runs extraction before build

## Key Files for Contributors

### Essential Files to Understand:

1. **Data Layer**:
   - `src/lib/db.js` - Schema definition
   - `src/stores/data.js` - State management
   - `src/lib/initData.js` - Initialization logic

2. **Routing**:
   - `src/lib/router.js` - Route configuration
   - `src/App.svelte` - Root component with router

3. **Character System**:
   - `src/lib/characterModel.js` - Data structure
   - `src/lib/characterGenerator.js` - Creation logic
   - `src/lib/characterCalculations.js` - Stats calculations

4. **Build Configuration**:
   - `vite.config.js` - Build pipeline
   - `vitest.config.js` - Test configuration

### Important Patterns:

**Component Communication**:
- Props down, events up
- Stores for global state
- Context for subtree state

**Async Operations**:
- All IndexedDB operations are async
- Use `async/await` consistently
- Handle errors with try/catch

**Reactivity**:
- `$:` for reactive statements
- `$store` for store subscriptions
- Automatic re-rendering on data changes

## Documentation Status

### Existing Documentation (All Complete)

All documentation is located in `/warhammer-v2/docs/`:

1. **ADMIN_GUIDE.md** - 1,160 lines
   - Admin mode access and features
   - Editing official data procedures
   - Creating custom content workflows
   - Data import/export processes
   - Conflict resolution strategies
   - Community contribution guidelines
   - Maintenance and troubleshooting

2. **ARCHITECTURE.md** - 1,357 lines
   - Technology stack overview
   - Architecture principles (offline-first, single-file, data integrity)
   - Complete project structure breakdown
   - Build system configuration
   - Data layer architecture (three-layer system)
   - Component architecture and patterns
   - State management with Svelte stores
   - Routing configuration
   - Offline strategy and PWA
   - Performance optimization techniques
   - Testing strategy and tools
   - Deployment options
   - Development workflow

3. **README.md** (in `/warhammer-v2/`) - 574 lines
   - Feature overview
   - Quick start guide
   - Development setup
   - Build and deploy instructions
   - Project structure
   - How it works (data embedding, IndexedDB, build config)
   - Development guidelines
   - Testing instructions
   - Browser support
   - Documentation links
   - Troubleshooting
   - Contributing guide
   - Roadmap
   - Version history

4. **database-schema.md** - Previously created, comprehensive schema docs

5. **USER_GUIDE.md** - Previously created, comprehensive user manual

6. **MIGRATION.md** - Previously created, v1 to v2 migration guide

### Documentation Quality Assessment

All three requested documents are **complete and comprehensive**:

- **ADMIN_GUIDE.md**: 8+ pages (equivalent), covers all admin workflows
- **ARCHITECTURE.md**: 10+ pages (equivalent), thorough technical documentation
- **README.md**: 2-3 pages (equivalent), perfect for quick onboarding

The documentation is:
- Technically accurate (verified against codebase)
- Well-structured with clear TOC
- Includes code examples
- Has proper formatting
- Covers all required topics from assignment

## Useful Context for Other Streams

### For Frontend Development:
- Components follow container/presentational pattern
- All data access goes through stores (never direct IndexedDB calls in components)
- Use lazy loading for routes (see `router.js` for pattern)
- Toast notifications available via `toastStore.js`

### For Data Management:
- Never modify official data in place
- Always use `modifyEntity()` or `createCustomEntity()` from `stores/data.js`
- Custom modifications stored separately and merged at runtime
- Validation happens at multiple levels (form, store, database)

### For Testing:
- Tests use fake-indexeddb for mocking
- happy-dom provides DOM environment
- Test files co-located with source in `__tests__/` subdirectories
- Run specific test: `npm test -- db.test.js`

### For Build/Deploy:
- Single-file build enables drag-and-drop deployment
- No server-side logic required
- Works with file:// protocol (truly offline)
- Service Worker is optional (app works without it)

## Common Pitfalls

1. **Don't modify IndexedDB directly**: Use stores
2. **Don't forget async/await**: All DB operations are async
3. **Don't hardcode IDs**: Use references and lookups
4. **Don't skip validation**: Always validate user input
5. **Don't ignore console in dev**: Important initialization logs

## Cross-Stream Coordination

This shared-context.md file should be updated by any stream that discovers:
- New architectural patterns
- Important file relationships
- Build configuration insights
- Testing strategies
- Performance optimizations

## Questions & Clarifications

None at this time. Documentation is complete and comprehensive.
