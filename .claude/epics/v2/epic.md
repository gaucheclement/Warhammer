---
name: v2
status: completed
created: 2025-10-24T13:32:14Z
completed: 2025-10-26T07:18:14Z
progress: 100%
prd: .claude/prds/v2.md
github: https://github.com/gaucheclement/Warhammer/issues/1
updated: 2025-10-26T07:18:14Z
---

# Epic: Warhammer Fantasy 4e - Version 2

## Overview

Complete rewrite of the Warhammer Fantasy Roleplay 4th edition application from a legacy Google Apps Script/PHP/jQuery stack to a modern, offline-first, single-file Progressive Web Application. The new architecture will use vanilla JavaScript (ES2020+) with a lightweight framework (Svelte recommended), bundled into a single minified HTML file (~500KB) that embeds all data (~1.6MB JSON) via IndexedDB initialization. The application will be fully functional offline, mobile-first, and maintain 100% feature parity with v1 while dramatically improving maintainability and user experience.

**Key Innovation:** Single HTML file architecture with embedded Service Worker, eliminating server dependencies while supporting offline-first functionality and community contributions via JSON import/export.

## Architecture Decisions

### 1. Framework Choice: Svelte
**Rationale:**
- Compiles to vanilla JS (no runtime overhead)
- Smallest bundle size among modern frameworks (~15-20KB)
- Built-in reactive state management
- Excellent DX with component-based architecture
- Better maintainability than vanilla JS for complex UI

**Alternative considered:** Alpine.js (lighter but less powerful), Vanilla JS (harder to maintain)

### 2. Single-File Distribution Model
**Rationale:**
- Simplifies deployment (drag-and-drop, file:// protocol support)
- Works on any web server or locally
- Eliminates CORS and deployment complexity
- Enables true offline usage without complex setup

**Implementation:** Vite with inline asset plugin to bundle CSS/JS into single HTML

### 3. Data Storage Strategy
**Three-Layer Model:**
- **Layer 1 - Embedded:** Official data inline in HTML as base64-encoded JSON (~300KB)
- **Layer 2 - IndexedDB:** Runtime storage for performance (parsed on first load)
- **Layer 3 - LocalStorage:** User preferences and lightweight config

**Rationale:** Embedded data ensures offline functionality, IndexedDB provides fast querying, localStorage handles simple preferences

### 4. State Management: Svelte Stores + Context API
**Rationale:**
- Native Svelte stores for reactive global state
- Context API for component tree data passing
- No external state library needed (reduces bundle size)
- Simple custom/official data merging logic in store

### 5. Offline-First Architecture
**Service Worker Strategy:** Cache-first with network fallback
- HTML/CSS/JS: Cache (immutable)
- Data updates: Network-first with cache fallback
- User characters: IndexedDB only (no network)

**Tool:** Workbox for Service Worker generation

### 6. Build Process: Vite
**Rationale:**
- Lightning-fast dev server with HMR
- Modern ES modules support
- Excellent minification (esbuild/terser)
- Plugin ecosystem for inline assets
- Better DX than Webpack for this use case

## Technical Approach

### Frontend Components

**Component Architecture (Svelte):**
```
App.svelte (root)
├── Router.svelte (client-side routing)
├── Layout/
│   ├── Header.svelte (navigation, search)
│   ├── Sidebar.svelte (filters, menu)
│   └── Footer.svelte
├── Pages/
│   ├── Browse.svelte (data consultation)
│   ├── CharacterCreator.svelte
│   ├── CharacterSheet.svelte
│   ├── Admin.svelte (protected)
│   └── Settings.svelte
├── Components/
│   ├── DataTable.svelte (virtualized table)
│   ├── SearchBar.svelte (autocomplete)
│   ├── Modal.svelte
│   ├── Toast.svelte (notifications)
│   └── ContextualHelp.svelte (tooltips/popovers)
└── Forms/
    ├── CharacterForm.svelte
    ├── CustomContentEditor.svelte
    └── ImportExport.svelte
```

**Key UI Features:**
- Virtual scrolling for 1000+ item lists (performance)
- Lazy-loaded detail views (reduce initial render)
- Mobile-optimized touch gestures (swipe navigation)
- Responsive grid/flexbox layouts (320px to 2560px)
- Dark/light theme toggle (CSS custom properties)

**State Management:**
```javascript
// stores/data.js
- officialData (immutable, from embedded JSON)
- customModifications (user edits, merged on read)
- characters (array of character objects)

// stores/ui.js
- currentTheme, sidebarOpen, activeFilters
```

### Backend Services

**No Traditional Backend - Static Architecture:**

**Data Pipeline:**
1. **Development:** `extract-data.js` fetches from Google Sheets API
2. **Build:** Vite inlines `data/all-data.json` into HTML
3. **Runtime:** App parses embedded data → IndexedDB on first load
4. **Updates:** Admin pushes new HTML file (data included)

**Admin Features (Client-Side Only):**
- Password-protected mode (hashed password in localStorage)
- Edit official data → export modified `all-data.json`
- Review community contributions (import → preview → merge)
- Generate new build with updated data

**Optional Cloud Sync (v2.1+):**
- Google Sheets API for character backup (read/write)
- Firebase/Supabase for real-time sync (future consideration)

### Infrastructure

**Hosting:**
- Primary: GitHub Pages (free, CDN, HTTPS)
- Fallback: Any static host (Netlify, Vercel, Cloudflare Pages)
- Local: File system (file:// protocol)

**Build Pipeline:**
```bash
npm run extract    # Fetch latest data from Google Sheets
npm run dev        # Vite dev server (HMR)
npm run build      # Production build → dist/index.html (single file)
npm run preview    # Test production build locally
```

**Deployment:**
- Manual: Upload `dist/index.html` to GitHub Pages
- Automated: GitHub Actions on push to main

**Monitoring:**
- Client-side error tracking (Sentry or self-hosted)
- Analytics: Plausible (privacy-friendly, lightweight)
- Performance: Web Vitals API (logged locally)

**Service Worker:**
- Generated by Workbox during build
- Embedded in `<script>` tag within HTML
- Precaches HTML/CSS/JS (immutable)
- Runtime caching for external resources (if any)

## Implementation Strategy

### Development Phases

**MVP Scope (v2.0):**
- Data browsing (all 1000+ entries)
- Search and filtering
- Character creation and management
- Custom content (local modifications)
- Import/export functionality
- Offline mode
- Mobile-responsive UI

**Post-MVP (v2.1+):**
- Advanced theming (multiple variants)
- Cloud character sync
- Dice roller
- Campaign mode

### Risk Mitigation

**Risk 1: Bundle Size > 500KB**
- Mitigation: Code splitting by route, lazy load non-critical features
- Fallback: Progressive data loading (load categories on-demand)

**Risk 2: IndexedDB Performance on Old Devices**
- Mitigation: Add loading states, optimize queries, implement pagination
- Fallback: In-memory cache for critical data (small subset)

**Risk 3: User Resistance to Change**
- Mitigation: Beta testing with existing users, migration guide, v1 parallel maintenance
- Fallback: Feature flag to toggle between v1/v2 interfaces

**Risk 4: Data Loss During Migration**
- Mitigation: Export v1 data script, import v2 with validation, rollback plan
- Fallback: Keep v1 accessible indefinitely as backup

### Testing Approach

**Unit Tests (Vitest):**
- Data merging logic (official + custom)
- Character generation calculations
- Search/filter algorithms

**Integration Tests (Testing Library):**
- Character creation flow (E2E)
- Import/export functionality
- Admin mode operations

**Manual Testing:**
- Cross-browser (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS 13+, Android 8+)
- Offline mode (Service Worker caching)
- Performance (Lighthouse scores)

**No Backend Testing:** No API tests needed (static architecture)

## Task Breakdown Preview

High-level implementation tasks (8-10 total):

1. **Project Foundation & Build Setup**
   - Initialize Vite + Svelte project
   - Configure build to inline assets into single HTML
   - Integrate `extract-data.js` into build pipeline
   - Setup IndexedDB initialization from embedded data

2. **Data Layer & State Management**
   - Design IndexedDB schema (23 tables matching existing JSON structure)
   - Implement data stores (official, custom, merged)
   - Build search engine (Fuse.js or custom)
   - Create import/export utilities (JSON sanitization)

3. **Core UI Components & Layout**
   - Responsive layout (header, sidebar, main content)
   - Routing system (client-side, hash-based)
   - Virtualized data tables (1000+ rows)
   - Theme system (dark/light modes, CSS variables)

4. **Character Creation & Management**
   - Multi-step character creator form (species → careers → characteristics → talents → equipment)
   - Character sheet view (display all attributes)
   - Character list with search/filter
   - Save/load/delete characters (IndexedDB)

5. **Custom Content & Modifications**
   - Contextual edit mode (modify any official data locally)
   - Custom content creator (add new entries)
   - Visual indicators (official vs custom vs modified)
   - Export modifications as JSON patch file

6. **Admin Mode**
   - Password protection (SHA-256 hash)
   - Edit official data interface
   - Community contribution review workflow
   - Generate updated data export

7. **Offline Support & Service Worker**
   - Service Worker implementation (Workbox)
   - Cache strategies (cache-first for app, network-first for updates)
   - Offline detection UI
   - Update notification system

8. **Testing, Optimization & Documentation**
   - Unit/integration tests for critical paths
   - Performance optimization (bundle analysis, lazy loading)
   - Cross-browser/device testing
   - User documentation (migration guide, admin manual)

## Dependencies

### External Dependencies

**Build Time:**
- Node.js 18+ (LTS)
- npm/pnpm (package management)
- Vite 5+ (build tool)
- Svelte 4+ (framework)

**Runtime (Bundled):**
- Dexie.js (~20KB) - IndexedDB wrapper
- Fuse.js (~12KB) - Fuzzy search
- Workbox (~15KB) - Service Worker utilities

**Optional (Admin Only):**
- Google Sheets API (character backup, optional feature)

**Total Estimated Bundle:** ~400-450KB (minified + gzipped)

### Internal Dependencies

**Existing Assets (Leverage):**
- `extract-data.js` - Already functional, integrate into build
- `data/all-data.json` - 1.6MB structured data, ready to embed
- Existing data schema - Well-defined 23 entity types (books, careers, species, etc.)

**Migration Requirements:**
- v1 localStorage format analysis (understand save structure)
- Migration script: v1 saves → v2 IndexedDB format
- Rollback mechanism: Export v1 data before migration

**Design Assets (Create):**
- Warhammer-themed color palette
- Icon set (SVG, inline)
- Typography system (medieval aesthetic)

### Team & Resources

**Solo Developer:** All roles (architecture, development, testing, documentation)

**Community:**
- 10-20 beta testers (existing users)
- Potential contributors (custom content)

**Time Commitment:** Part-time development (evenings/weekends)

## Success Criteria (Technical)

### Performance Benchmarks
- ✅ Time to Interactive < 2s on 3G (Lighthouse metric)
- ✅ First Contentful Paint < 1s on 4G
- ✅ Bundle size (gzipped): < 500KB
- ✅ Search results: < 300ms for 1000 entries (local testing)
- ✅ Character creation: < 100ms per step transition

### Quality Gates
- ✅ Lighthouse scores: Performance > 90, Accessibility > 90, Best Practices > 90, SEO > 80
- ✅ Zero console errors in production build
- ✅ Unit test coverage > 70% for business logic
- ✅ Cross-browser compatibility: Latest 2 versions of Chrome, Firefox, Safari, Edge
- ✅ Mobile support: iOS 13+ and Android 8+ tested

### Acceptance Criteria
- ✅ 100% feature parity with v1 (all functionality preserved)
- ✅ Offline mode works completely (no network errors)
- ✅ Admin can update data and generate new build
- ✅ Users can import v1 character saves
- ✅ Custom content can be exported and imported
- ✅ Mobile UI usable with one hand (thumb-friendly navigation)

### Post-Launch Metrics
- User migration: 80% of v1 users active on v2 within 3 months
- Retention: 70% of users return after 1 month
- Mobile usage: 50%+ of sessions on mobile devices
- Error rate: < 0.1% of sessions encounter JavaScript errors
- Community contributions: 5+ accepted within 6 months

## Estimated Effort

**Overall Timeline:** 14-18 weeks (part-time development)

**Phase Breakdown:**
- Week 1-2: Project setup, build config, data layer (16h)
- Week 3-5: Core UI, routing, layouts (24h)
- Week 6-8: Character creator and management (24h)
- Week 9-11: Custom content and admin mode (20h)
- Week 12-13: Service Worker, offline support (16h)
- Week 14-16: Testing, optimization, bug fixes (20h)
- Week 17-18: Documentation, migration, beta testing, launch (16h)

**Total Effort:** ~136 hours of development work

**Critical Path:**
1. Data layer (blocks all features)
2. Character creator (core value proposition)
3. Offline mode (key differentiator from v1)

**Resource Requirements:**
- 8-12 hours/week development time
- Access to Google Sheets API (data extraction)
- Beta testers available for weeks 16-17

**Risks to Timeline:**
- Learning curve for Svelte (if new to developer)
- Underestimated complexity of data merging logic
- Service Worker debugging (can be tricky)

**Mitigation:**
- Spike sessions for risky components (week 0)
- MVP-first approach (cut non-critical features)
- Community help for testing/feedback

## Tasks Created

- [ ] #2 - Project Foundation & Build Setup (parallel: false, depends on: none)
- [ ] #3 - Data Layer & State Management (parallel: false, depends on: #2)
- [ ] #4 - Core UI Components & Layout (parallel: false, depends on: #2, #3)
- [ ] #5 - Character Creation & Management (parallel: true, depends on: #3, #4, conflicts: #6)
- [ ] #6 - Custom Content & Modifications (parallel: true, depends on: #3, #4, conflicts: #5)
- [ ] #7 - Admin Mode (parallel: true, depends on: #4, #6)
- [ ] #8 - Offline Support & Service Worker (parallel: true, depends on: #2, #4)
- [ ] #9 - Testing, Optimization & Documentation (parallel: false, depends on: #2-#8)

**Total tasks:** 8
**Parallel tasks:** 4 (tasks #5, #6, #7, #8 can run concurrently)
**Sequential tasks:** 4 (tasks #2, #3, #4, #9 must run in order)
**Estimated total effort:** 136-160 hours

**Critical Path:**
#2 → #3 → #4 → {#5, #6, #7, #8} → #9
(Sequential foundation → Parallel feature development → Final integration)
