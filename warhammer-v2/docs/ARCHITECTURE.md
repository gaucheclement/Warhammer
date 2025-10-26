# Architecture Documentation

## Overview

Warhammer Fantasy 4e v2 is a modern Progressive Web Application (PWA) built with Svelte 5, Vite 7, and IndexedDB. The application compiles to a single HTML file containing all code and data, enabling complete offline functionality.

This document provides a comprehensive overview of the application architecture, design decisions, data flow, and technical implementation details.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Architecture Principles](#architecture-principles)
3. [Project Structure](#project-structure)
4. [Build System](#build-system)
5. [Data Layer](#data-layer)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Routing](#routing)
9. [Offline Strategy](#offline-strategy)
10. [Performance Optimization](#performance-optimization)
11. [Testing Strategy](#testing-strategy)
12. [Deployment](#deployment)
13. [Development Workflow](#development-workflow)

---

## Technology Stack

### Core Technologies

**Frontend Framework**:
- **Svelte 5** (^5.39.6)
  - Compile-time framework with no runtime overhead
  - Reactive state management built-in
  - Smallest bundle size among modern frameworks
  - Excellent developer experience

**Build Tool**:
- **Vite 7** (^7.1.7)
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds with Rollup
  - ES modules support
  - Rich plugin ecosystem

**Database**:
- **IndexedDB** via Dexie.js (^4.2.1)
  - Browser-native NoSQL database
  - Fast querying with indexes
  - Persistent storage (survives page reloads)
  - Supports complex queries and relationships

**Router**:
- **svelte-spa-router** (^4.0.1)
  - Hash-based routing for single-file compatibility
  - Simple API with route parameters
  - Programmatic navigation
  - Route guards and hooks

**Search**:
- **Fuse.js** (^7.1.0)
  - Fuzzy search with configurable threshold
  - Multi-field searching
  - Lightweight (~12KB)

### Development Tools

**Testing**:
- **Vitest** (^4.0.3) - Unit and integration testing
- **@vitest/ui** (^4.0.3) - Visual test runner
- **happy-dom** (^20.0.8) - DOM simulation for tests
- **fake-indexeddb** (^6.2.4) - IndexedDB mocking

**Build Plugins**:
- **vite-plugin-singlefile** (^2.3.0) - Inline all assets
- **vite-plugin-html** (^3.2.2) - HTML minification
- **vite-plugin-pwa** (^1.1.0) - Service Worker generation
- **rollup-plugin-visualizer** - Bundle analysis

**Code Quality**:
- ESLint (code linting)
- Prettier (code formatting)
- TypeScript JSDoc (type annotations without compilation)

### Why These Technologies?

**Svelte over React/Vue**:
- Compiles to vanilla JS (no framework runtime)
- Smallest bundle size (critical for single-file build)
- Native reactivity without virtual DOM
- Simpler component syntax

**Vite over Webpack**:
- 10-100x faster development server
- Simpler configuration
- Better tree-shaking
- Native ES modules

**IndexedDB over LocalStorage**:
- Much larger storage capacity (50MB+)
- Complex queries with indexes
- Structured data storage
- Asynchronous API (non-blocking)

**Single-File over Multi-File**:
- Works offline without Service Worker
- No CORS issues
- Drag-and-drop deployment
- Share as single file

---

## Architecture Principles

### 1. Offline-First

**Primary Goal**: Application must work completely offline after initial load.

**Implementation**:
- All data embedded in HTML at build time
- Service Worker caches application shell
- IndexedDB stores data locally
- No external API dependencies

**Benefits**:
- Works without internet connection
- Fast load times (no network requests)
- Privacy-focused (no data sent to servers)
- Resilient to network failures

### 2. Single-File Build

**Primary Goal**: Entire application in one HTML file.

**Implementation**:
- All CSS inlined in `<style>` tags
- All JS inlined in `<script>` tags
- All data embedded as `window.__WARHAMMER_DATA__`
- All images/fonts base64-encoded or SVG

**Benefits**:
- Simple deployment (one file to upload)
- Works with file:// protocol
- No server configuration needed
- Easy to share and distribute

### 3. Progressive Enhancement

**Primary Goal**: Core features work even with limited browser capabilities.

**Implementation**:
- Graceful degradation for older browsers
- Feature detection before using advanced APIs
- Fallbacks for unsupported features
- Core functionality without JavaScript (minimal)

**Browser Support**:
- Modern browsers: Full functionality
- Older browsers: Degraded but usable
- No JavaScript: Static fallback page

### 4. Data Integrity

**Primary Goal**: Ensure data consistency and prevent corruption.

**Implementation**:
- Immutable official data
- Separate custom modifications
- Merge at runtime (never modify source)
- Validation on all data operations
- Atomic transactions for multi-step operations

**Benefits**:
- Official data never corrupted
- Easy to reset to defaults
- Custom changes isolated
- Conflict resolution possible

### 5. Performance

**Primary Goal**: Fast, responsive user experience.

**Implementation**:
- Aggressive code splitting and lazy loading
- Optimized bundle size (~445KB gzipped)
- IndexedDB indexes for fast queries
- Virtual scrolling for large lists
- Debounced search inputs
- Memoized computed values

**Metrics**:
- Time to Interactive: <2s
- First Contentful Paint: <1s
- Lighthouse Performance: >90
- Bundle size: <500KB gzipped

---

## Project Structure

```
warhammer-v2/
├── docs/                      # Documentation
│   ├── MIGRATION.md          # v1 to v2 migration guide
│   ├── USER_GUIDE.md         # User manual
│   ├── ADMIN_GUIDE.md        # Admin manual
│   ├── ARCHITECTURE.md       # This file
│   └── database-schema.md    # Database documentation
│
├── public/                    # Static assets
│   ├── icon-192.png          # PWA icon 192x192
│   ├── icon-512.png          # PWA icon 512x512
│   └── favicon.ico           # Browser favicon
│
├── src/                       # Source code
│   ├── components/           # Reusable UI components
│   │   ├── character/       # Character-specific components
│   │   ├── common/          # Common UI elements
│   │   └── wizard/          # Character creator wizard steps
│   │
│   ├── layouts/              # Page layouts
│   │   ├── Layout.svelte    # Main app layout
│   │   ├── Header.svelte    # Header bar
│   │   ├── Sidebar.svelte   # Navigation sidebar
│   │   └── Footer.svelte    # Footer bar
│   │
│   ├── routes/               # Page components (route targets)
│   │   ├── Home.svelte      # Home page
│   │   ├── Browse.svelte    # Data browser
│   │   ├── CharacterList.svelte
│   │   ├── CharacterSheet.svelte
│   │   ├── Creator.svelte   # Character creator wizard
│   │   ├── Admin.svelte     # Admin panel
│   │   ├── Settings.svelte  # Settings page
│   │   └── NotFound.svelte  # 404 page
│   │
│   ├── stores/               # Svelte stores (state management)
│   │   └── data.js          # Data layer stores
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── db.js            # IndexedDB schema (Dexie)
│   │   ├── db-relations.js  # Relationship navigation
│   │   ├── db-transforms.js # Data transformations
│   │   ├── db-descriptions.js # Description generation
│   │   ├── initData.js      # Database initialization
│   │   ├── dataMerger.js    # Official + Custom merging
│   │   ├── router.js        # Route configuration
│   │   ├── characterModel.js # Character data structure
│   │   ├── characterGenerator.js # Character creation logic
│   │   ├── characterCalculations.js # Stats calculations
│   │   ├── characterValidation.js # Validation rules
│   │   ├── characterAdvancement.js # XP and advancement
│   │   ├── characterImport.js # Import from JSON
│   │   ├── characterExport.js # Export to JSON
│   │   ├── dataOperations.js # CRUD operations
│   │   ├── draftManager.js  # Draft auto-save
│   │   ├── exportModifications.js # Custom content export
│   │   ├── toastStore.js    # Toast notifications
│   │   └── __tests__/       # Unit tests
│   │
│   ├── App.svelte            # Root component
│   ├── main.js               # Application entry point
│   └── app.css               # Global styles
│
├── data/                      # Game data (JSON)
│   └── all-data.json         # Combined game data (1.6MB)
│
├── dist/                      # Production build output
│   ├── index.html            # Single-file bundle
│   └── stats.html            # Bundle analysis
│
├── .gitignore
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── package-lock.json
├── vite.config.js            # Vite configuration
├── vitest.config.js          # Vitest configuration
├── vitest.setup.js           # Test setup
└── README.md                  # Project overview
```

---

## Build System

### Vite Configuration

**File**: `vite.config.js`

**Key Plugins**:

1. **@sveltejs/vite-plugin-svelte**:
   - Compiles Svelte components
   - HMR support
   - CSS scoping

2. **embedDataPlugin (Custom)**:
   - Reads `../data/all-data.json`
   - Embeds as `window.__WARHAMMER_DATA__`
   - Injects before `</head>` tag

3. **vite-plugin-html**:
   - Minifies HTML
   - Removes whitespace and comments

4. **vite-plugin-pwa**:
   - Generates Service Worker
   - Creates PWA manifest
   - Configures caching strategies
   - Auto-update on new version

5. **vite-plugin-singlefile**:
   - Inlines all CSS into HTML
   - Inlines all JS into HTML
   - Produces single self-contained file

6. **rollup-plugin-visualizer**:
   - Analyzes bundle composition
   - Outputs `dist/stats.html`
   - Shows gzipped and brotli sizes

**Build Configuration**:

```javascript
{
  target: 'es2020',              // Modern browser support
  outDir: 'dist',                // Output directory
  assetsInlineLimit: 100000000,  // Inline all assets
  cssCodeSplit: false,           // Single CSS bundle
  minify: 'terser',              // Aggressive minification
  terserOptions: {
    compress: {
      drop_console: true,        // Remove console.log
      drop_debugger: true,       // Remove debugger statements
      pure_funcs: ['console.log'] // Remove specific functions
    }
  },
  rollupOptions: {
    output: {
      inlineDynamicImports: true, // Inline dynamic imports
      manualChunks: undefined     // No code splitting
    }
  }
}
```

### Build Process

**Development Build** (`npm run dev`):
1. Vite starts dev server on port 5173
2. HMR enabled for instant updates
3. Source maps for debugging
4. No minification
5. Fast incremental compilation

**Production Build** (`npm run build`):
1. **Pre-build**: Data extraction (if needed)
2. **Compile**: Svelte → JavaScript
3. **Bundle**: Rollup combines all modules
4. **Embed Data**: Inject `window.__WARHAMMER_DATA__`
5. **Inline Assets**: CSS, JS, images → HTML
6. **Minify**: Terser compresses JavaScript
7. **Generate PWA**: Service Worker and manifest
8. **Output**: Single `dist/index.html` file
9. **Analyze**: Generate `dist/stats.html`

**Build Output**:
- **Uncompressed**: ~1.8MB (includes 1.6MB data)
- **Gzipped**: ~445KB (browser transfer size)
- **Brotli**: ~380KB (if server supports)

---

## Data Layer

### Architecture

**Three-Layer System**:

1. **Official Data** (Immutable):
   - Loaded from embedded `window.__WARHAMMER_DATA__`
   - Stored in IndexedDB
   - Never modified by user

2. **Custom Modifications** (Mutable):
   - User edits and custom content
   - Stored separately in IndexedDB
   - Persisted across sessions

3. **Merged Data** (Computed):
   - Runtime combination of official + custom
   - Custom overrides official by ID
   - Reactive Svelte store

### IndexedDB Schema

**Database**: `WarhammerDB`
**Schema Version**: v2
**Tables**: 24 (23 game data + 1 user data)

**Game Data Tables**:
- books, careers, careerLevels, species, classes
- talents, characteristics, trappings, skills, spells
- creatures, stars, gods, eyes, hairs, details
- traits, lores, magicks, etats, psychologies
- qualities, trees

**User Data Tables**:
- characters (user-created characters)
- settings (application preferences)

**Indexes**:
- Primary: `id` on all tables
- Secondary: `label`, `book`, `page`, `folder`
- Compound: `[career+careerLevel]` for efficient queries
- Multi-entry: `*specs` for array field queries

**Example Schema** (Talents):
```javascript
talents: 'id, label, max, test, *specs, addSkill, addTalent, book, page, folder'
```

See [database-schema.md](database-schema.md) for complete documentation.

### Data Initialization

**Process** (`lib/initData.js`):

1. **Check localStorage**: `warhammer_data_initialized`
2. **If not initialized**:
   - Load `window.__WARHAMMER_DATA__`
   - Validate data structure
   - Bulk insert into IndexedDB (23 tables)
   - Set initialization flag
3. **Load into stores**:
   - `officialData.set(...)` from IndexedDB
   - `customModifications.set(...)` from IndexedDB
   - `mergedData` automatically computed

**Re-initialization**:
- Clear all tables
- Re-run initialization process
- Optionally preserve custom modifications
- Used for updates or corruption recovery

### Data Merging

**Merge Strategy** (`lib/dataMerger.js`):

```javascript
function mergeData(official, custom) {
  const merged = {}

  for (const entityType of ENTITY_TYPES) {
    // Start with official data
    const officialMap = new Map(
      official[entityType].map(e => [e.id, e])
    )

    // Apply custom modifications (overrides)
    for (const customEntity of custom[entityType]) {
      officialMap.set(customEntity.id, customEntity)
    }

    // Convert back to array
    merged[entityType] = Array.from(officialMap.values())
  }

  return merged
}
```

**Characteristics**:
- Custom modifications override official by ID
- Null/undefined in custom doesn't delete official
- Arrays in custom replace official arrays completely
- Objects in custom merge field-by-field

### Relationships

**Relationship Types**:

1. **Forward** (Entity → Related):
   - Career → Class
   - Skill → Characteristic
   - Career Level → Skills

2. **Reverse** (Related → Entity):
   - Skill → Career Levels using it
   - Talent → Career Levels granting it

**Implementation** (`lib/db-relations.js`):

```javascript
// Forward relationship (cached)
async function getCareerClass(careerId) {
  const career = await db.careers.get(careerId)
  return await db.classes.get(career.class)
}

// Reverse relationship (computed)
async function findCareerLevelsBySkill(skillId) {
  const allLevels = await db.careerLevels.toArray()
  return allLevels.filter(level =>
    level.skills && level.skills.includes(skillId)
  )
}
```

**Caching**:
- In-memory cache with 5-minute TTL
- Cleared on data modifications
- Speeds up repeated queries

### Transformations

**Purpose**: Convert raw data to enriched objects

**Transform Pipeline** (`lib/db-transforms.js`):
1. **Parse**: Convert strings to structured data
2. **Validate**: Check required fields
3. **Resolve**: Look up related entities
4. **Enrich**: Add computed fields
5. **Cache**: Store for reuse

**Example** (Skill transform):
```javascript
async function transformSkill(db, skill) {
  return {
    ...skill,
    // Parse comma-separated specs to array
    specs: parseSpecs(skill.specs),
    // Resolve characteristic reference
    characteristic: await db.characteristics.get(skill.characteristic),
    // Add computed fields
    displayName: getDisplayName(skill),
    fullDescription: await generateDescription(skill)
  }
}
```

### Description Generation

**Purpose**: Create rich HTML descriptions with entity linking

**Features** (`lib/db-descriptions.js`):
- Automatic cross-references (clickable links)
- Access information (where item is available)
- Formatted metadata (book, page, stats)
- Context-aware descriptions

**Example** (Talent description):
```javascript
async function generateTalentDescription(talentId) {
  const talent = await db.talents.get(talentId)

  return {
    Info: `
      <p><strong>Max:</strong> ${talent.max}</p>
      <p><strong>Tests:</strong> ${talent.test}</p>
      <p>${applyHelp(talent.desc, talent, labelMap)}</p>
    `,
    Access: `
      <p>Available from:</p>
      <ul>
        ${careerLevels.map(l => `<li>${l.label}</li>`).join('')}
      </ul>
    `
  }
}
```

---

## Component Architecture

### Component Hierarchy

```
App.svelte
├── ToastContainer.svelte
├── OfflineIndicator.svelte
├── UpdateNotification.svelte
└── Layout.svelte
    ├── Header.svelte
    │   ├── ThemeToggle.svelte
    │   └── SearchBar.svelte
    ├── Sidebar.svelte
    └── Router (svelte-spa-router)
        ├── Home.svelte
        ├── Browse.svelte
        │   ├── DataTable.svelte
        │   │   ├── DataTableHeader.svelte
        │   │   └── DataTableRow.svelte
        │   └── Modal.svelte
        ├── CharacterList.svelte
        │   └── CharacterCard.svelte
        ├── CharacterSheet.svelte
        │   ├── CharacterHeader.svelte
        │   ├── CharacteristicsBlock.svelte
        │   ├── SkillsBlock.svelte
        │   ├── TalentsBlock.svelte
        │   ├── SpellsBlock.svelte
        │   ├── EquipmentBlock.svelte
        │   ├── AdvancementBlock.svelte
        │   └── NotesBlock.svelte
        ├── Creator.svelte
        │   ├── WizardProgress.svelte
        │   ├── WizardNavigation.svelte
        │   ├── WizardStep1Species.svelte
        │   ├── WizardStep2Career.svelte
        │   ├── WizardStep3Characteristics.svelte
        │   ├── WizardStep4Skills.svelte
        │   ├── WizardStep5Talents.svelte
        │   ├── WizardStep6Equipment.svelte
        │   ├── WizardStep7Details.svelte
        │   ├── WizardStep8Experience.svelte
        │   └── WizardStep9Review.svelte
        ├── Admin.svelte
        └── Settings.svelte
```

### Component Patterns

**1. Container Components** (Routes):
- Manage state
- Fetch data
- Handle business logic
- Pass data to presentational components

**2. Presentational Components**:
- Receive data via props
- Render UI
- Emit events to parents
- No business logic

**3. Compound Components**:
- Multiple components working together
- Shared context via stores or props
- Example: Wizard steps

**4. Layout Components**:
- Define page structure
- Consistent across routes
- Header, sidebar, footer

### Component Communication

**Props (Parent → Child)**:
```svelte
<!-- Parent -->
<ChildComponent
  name={characterName}
  level={characterLevel}
/>

<!-- Child -->
<script>
  export let name
  export let level
</script>
```

**Events (Child → Parent)**:
```svelte
<!-- Child -->
<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  function handleClick() {
    dispatch('customEvent', { detail: 'value' })
  }
</script>

<!-- Parent -->
<ChildComponent on:customEvent={handleEvent} />
```

**Stores (Global State)**:
```svelte
<script>
  import { mergedData } from '../stores/data.js'

  // Reactive subscription (auto-updates)
  $: talents = $mergedData.talents
</script>
```

**Context (Component Tree)**:
```svelte
<!-- Parent -->
<script>
  import { setContext } from 'svelte'
  setContext('theme', { mode: 'dark' })
</script>

<!-- Child (any depth) -->
<script>
  import { getContext } from 'svelte'
  const theme = getContext('theme')
</script>
```

---

## State Management

### Svelte Stores

**Store Types**:

1. **Writable**: Read/write state
2. **Readable**: Read-only state
3. **Derived**: Computed from other stores
4. **Custom**: Custom subscription logic

**Data Stores** (`stores/data.js`):

```javascript
// Writable stores
export const officialData = writable({...})
export const customModifications = writable({...})
export const characters = writable([])

// Derived store (auto-computed)
export const mergedData = derived(
  [officialData, customModifications],
  ([$official, $custom]) => mergeData($official, $custom)
)

// Loading states
export const isDataLoading = writable(true)
export const dataError = writable(null)
```

**Toast Store** (`lib/toastStore.js`):
```javascript
function createToastStore() {
  const { subscribe, update } = writable([])

  return {
    subscribe,
    success: (message) => update(toasts => [...toasts, { type: 'success', message }]),
    error: (message) => update(toasts => [...toasts, { type: 'error', message }]),
    dismiss: (id) => update(toasts => toasts.filter(t => t.id !== id))
  }
}

export const toasts = createToastStore()
```

### Local State

**Component State**:
```svelte
<script>
  // Reactive variable
  let count = 0

  // Reactive statement (auto-updates)
  $: doubled = count * 2

  // Reactive block (side effects)
  $: {
    console.log('Count changed:', count)
  }
</script>
```

**Lifecycle Hooks**:
```svelte
<script>
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte'

  onMount(() => {
    // Component mounted (runs once)
    console.log('Mounted')

    return () => {
      // Cleanup (optional)
      console.log('Unmounting')
    }
  })

  onDestroy(() => {
    // Component destroyed
  })

  beforeUpdate(() => {
    // Before DOM update
  })

  afterUpdate(() => {
    // After DOM update
  })
</script>
```

### State Persistence

**LocalStorage**:
- Initialization flags
- Draft saves
- User preferences

**IndexedDB**:
- Official game data
- Custom modifications
- Characters
- Large datasets

**Session Storage**:
- Temporary session data
- Navigation state

---

## Routing

### Configuration

**File**: `lib/router.js`

**Route Definition**:
```javascript
export const routes = {
  '/': Home,
  '/browse': Browse,
  '/browse/:category': Browse,
  '/characters': CharacterList,
  '/character/:id': CharacterSheet,
  '/creator': Creator,
  '/admin': Admin,
  '/settings': Settings,
  '*': NotFound
}
```

**Route Parameters**:
```svelte
<!-- In component -->
<script>
  export let params = {}  // From router

  $: characterId = params.id  // Reactive
</script>
```

**Programmatic Navigation**:
```javascript
import { push, pop, replace } from 'svelte-spa-router'

// Navigate to route
push('/characters')

// Navigate back
pop()

// Replace current route
replace('/login')
```

**Navigation Guards**:
```javascript
export function beforeRouteChange(detail) {
  // Check conditions
  if (!isAuthenticated() && detail.location.startsWith('/admin')) {
    return false  // Prevent navigation
  }
  return true  // Allow navigation
}
```

---

## Offline Strategy

### Service Worker

**Generated by**: vite-plugin-pwa

**Strategies**:

1. **Network First**: Check network, fallback to cache
2. **Cache First**: Check cache, fallback to network
3. **Stale While Revalidate**: Serve cache, update in background
4. **Network Only**: Always fetch from network
5. **Cache Only**: Only serve from cache

**Configuration** (vite.config.js):
```javascript
VitePWA({
  registerType: 'autoUpdate',  // Auto-update on new version
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,  // 3 MB
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
        }
      }
    ],
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true
  }
})
```

### PWA Manifest

**Configuration**:
```javascript
manifest: {
  name: 'Warhammer Fantasy Roleplay 4th Edition',
  short_name: 'WFRP 4e',
  description: 'Progressive Web Application for WFRP 4e',
  theme_color: '#1a1a1a',
  background_color: '#1a1a1a',
  display: 'standalone',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
  ]
}
```

### Offline Indicator

**Component**: `OfflineIndicator.svelte`

**Features**:
- Detects online/offline status
- Shows visual indicator
- Listens to `online` and `offline` events
- Updates reactive state

---

## Performance Optimization

### Bundle Optimization

**Code Splitting**:
- Lazy load routes (future enhancement)
- Dynamic imports for heavy features
- Split vendor chunks (current: single bundle)

**Tree Shaking**:
- Vite/Rollup removes unused code
- ES modules enable static analysis
- Smaller bundle size

**Minification**:
- Terser compresses JavaScript
- Removes console.log
- Mangles variable names
- Compresses literals

### Runtime Optimization

**Virtual Scrolling** (Future):
- Render only visible rows
- Large lists (1000+ items) perform well

**Debouncing**:
- Search input debounced (300ms)
- Resize events debounced
- Prevents excessive re-renders

**Memoization**:
- Cache expensive computations
- Svelte reactive statements
- Custom memoization utilities

**IndexedDB Optimization**:
- Compound indexes for common queries
- Multi-entry indexes for array fields
- Batch operations for bulk inserts
- Connection pooling

### Loading Performance

**Metrics** (Lighthouse):
- **FCP** (First Contentful Paint): <1s
- **LCP** (Largest Contentful Paint): <2s
- **TBT** (Total Blocking Time): <200ms
- **CLS** (Cumulative Layout Shift): <0.1

**Techniques**:
- Critical CSS inlined
- Deferred non-critical JS
- Preload key resources
- Optimize images

---

## Testing Strategy

### Unit Tests

**Framework**: Vitest

**Test Files**: `lib/__tests__/*.test.js`

**Coverage**:
- Data transformations
- Calculations
- Validators
- Utilities

**Example**:
```javascript
import { describe, it, expect } from 'vitest'
import { toId } from '../db-transforms.js'

describe('toId', () => {
  it('converts to lowercase kebab-case', () => {
    expect(toId('Magie Mineure')).toBe('magie-mineure')
  })
})
```

### Integration Tests

**Scope**:
- Database operations
- Data layer integration
- Component integration

**Example**:
```javascript
import { db } from '../db.js'
import { getAllFromTable } from '../db.js'

describe('Database operations', () => {
  it('loads all talents', async () => {
    const talents = await getAllFromTable('talents')
    expect(talents.length).toBeGreaterThan(0)
  })
})
```

### E2E Tests (Future)

**Framework**: Playwright or Cypress

**Scenarios**:
- Complete character creation flow
- Data browsing and search
- Import/export operations

### Running Tests

```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Coverage report
npm test -- --coverage
```

---

## Deployment

### Build for Production

```bash
# Build single-file bundle
npm run build

# Output: dist/index.html
```

### Deployment Options

**1. Static File Hosting**:
- Upload `dist/index.html` to any web server
- No server-side logic required
- Examples: Netlify, Vercel, GitHub Pages

**2. GitHub Pages**:
```bash
# Build
npm run build

# Deploy
git add dist/index.html
git commit -m "Deploy"
git push origin main

# Configure GitHub Pages to serve from dist/ folder
```

**3. File Sharing**:
- Download `dist/index.html`
- Share via email, USB, cloud storage
- Recipient opens in browser (works offline!)

**4. Local File**:
- Open `dist/index.html` directly in browser
- Works with file:// protocol
- All features available

### Environment Variables

**Development**:
```bash
# .env (not committed)
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

**Usage**:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
const isDebug = import.meta.env.VITE_DEBUG === 'true'
```

**Production**:
- No environment variables needed
- All data embedded at build time
- No runtime configuration

---

## Development Workflow

### Local Development

**Setup**:
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

**Hot Module Replacement**:
- Edit `.svelte` files → Instant update
- Edit `.js` files → Fast refresh
- Edit `.css` files → Instant style update
- State preserved across updates

### Code Organization

**Best Practices**:
- **Components**: One component per file
- **Utilities**: Grouped by functionality
- **Styles**: Scoped to components
- **Tests**: Co-located with source files

**Naming Conventions**:
- Components: PascalCase (e.g., `CharacterCard.svelte`)
- Utilities: camelCase (e.g., `dataMerger.js`)
- Constants: UPPER_SNAKE_CASE
- Private functions: `_functionName`

### Git Workflow

**Branch Strategy**:
- `main`: Stable production code
- `develop`: Integration branch
- Feature branches: `feature/issue-123-description`
- Hotfix branches: `hotfix/critical-bug`

**Commit Messages**:
```
Issue #123: Stream A - Add character creator wizard

- Implement 9-step wizard
- Add draft auto-save
- Add validation
```

### Code Review

**Checklist**:
- [ ] Code follows style guide
- [ ] Tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No hard-coded values
- [ ] Accessibility considered
- [ ] Performance tested

---

## Future Enhancements

### Planned Features

**Phase 1** (Current):
- Core data browsing
- Character creation
- Character management
- Custom content
- Offline support

**Phase 2** (Upcoming):
- Advanced search with filters
- Character advancement tracking
- Combat tracker
- Initiative tracker
- NPC generator

**Phase 3** (Future):
- Multi-user sync (optional cloud)
- Campaign management
- Session notes
- Dice roller
- Character portraits

### Technical Debt

**Known Issues**:
- Bundle size could be reduced further
- Some components need refactoring
- Test coverage needs improvement
- Accessibility audit needed

**Planned Improvements**:
- Migrate to TypeScript
- Add E2E tests
- Optimize IndexedDB queries
- Implement virtual scrolling
- Add service worker update prompt

---

## Contributing

### Getting Started

1. Fork repository
2. Clone your fork
3. Create feature branch
4. Make changes with tests
5. Submit pull request

### Development Guidelines

**Code Style**:
- 2-space indentation
- Semicolons optional
- Single quotes for strings
- Trailing commas

**Component Structure**:
```svelte
<script>
  // Imports
  import { onMount } from 'svelte'

  // Props
  export let name

  // Local state
  let count = 0

  // Reactive statements
  $: doubled = count * 2

  // Functions
  function handleClick() {
    count++
  }

  // Lifecycle
  onMount(() => {
    console.log('Mounted')
  })
</script>

<!-- Template -->
<div class="container">
  <h1>{name}</h1>
  <p>Count: {count}</p>
  <button on:click={handleClick}>Increment</button>
</div>

<!-- Styles (scoped) -->
<style>
  .container {
    padding: 1rem;
  }
</style>
```

### Documentation

**Required Documentation**:
- JSDoc comments for functions
- README for new features
- Architecture docs for major changes
- Examples for complex APIs

---

## Resources

### Internal Documentation

- [Migration Guide](MIGRATION.md)
- [User Guide](USER_GUIDE.md)
- [Admin Guide](ADMIN_GUIDE.md)
- [Database Schema](database-schema.md)

### External Resources

**Svelte**:
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Svelte API Docs](https://svelte.dev/docs)

**Vite**:
- [Vite Guide](https://vitejs.dev/guide/)
- [Vite Plugins](https://vitejs.dev/plugins/)

**Dexie.js**:
- [Dexie Tutorial](https://dexie.org/docs/Tutorial)
- [Dexie API Reference](https://dexie.org/docs/API-Reference)

**IndexedDB**:
- [MDN IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

**PWA**:
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox](https://developers.google.com/web/tools/workbox)

---

## Contact

- **GitHub**: [Repository URL]
- **Issues**: [Issues URL]
- **Discussions**: [Discussions URL]
- **Email**: [Contact email]

---

**Last Updated**: 2025-10-25
**Document Version**: 1.0
**App Version**: 2.0.0
