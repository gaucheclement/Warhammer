---
issue: 2
created: 2025-10-24T14:30:00Z
---

# Analysis: Project Foundation & Build Setup

## Overview
This is the foundational task that sets up the entire Svelte + Vite project structure and configures the build system to produce a single-file HTML bundle. All other tasks depend on this infrastructure.

## Parallel Work Streams

This task is **not parallel** - it must be completed sequentially as a single unit of work before other tasks can begin.

### Stream A: Complete Foundation Setup
**Scope:** Entire task (cannot be split)

**Files to Create/Modify:**
- Create `warhammer-v2/` directory
- `warhammer-v2/package.json` - Dependencies and scripts
- `warhammer-v2/vite.config.js` - Build configuration with single-file plugin
- `warhammer-v2/src/App.svelte` - Root component
- `warhammer-v2/src/lib/db.js` - IndexedDB schema with Dexie
- `warhammer-v2/src/lib/initData.js` - Data initialization logic
- `warhammer-v2/src/main.js` - Entry point
- `warhammer-v2/index.html` - HTML shell
- `warhammer-v2/.gitignore` - Git ignore file
- `warhammer-v2/README.md` - Setup instructions

**Dependencies:**
- Node.js 18+ installed
- Access to existing `extract-data.js` (in parent directory)
- Understanding of Vite + Svelte project structure

**Work Description:**
1. Initialize Vite + Svelte project
2. Install dependencies (dexie, vite-plugin-singlefile, vite-plugin-html)
3. Configure Vite for single-file output with embedded data
4. Create IndexedDB schema for 23 entity types
5. Implement data initialization logic
6. Test dev server and production build
7. Document setup in README

**Estimated Time:** 12-16 hours

## Technical Considerations

### Critical Decisions
1. **Build System:** Use Vite with `vite-plugin-singlefile` to inline all assets
2. **IndexedDB Wrapper:** Use Dexie.js for cleaner API (~20KB)
3. **Data Embedding:** Inline JSON as JavaScript constant in build
4. **Entity Types:** 23 tables matching existing JSON structure

### Risks & Mitigations
- **Risk:** Bundle size exceeds 500KB
  - **Mitigation:** Monitor build size, configure aggressive minification
- **Risk:** IndexedDB initialization fails on first load
  - **Mitigation:** Add error handling, user-friendly error messages
- **Risk:** Build process not reproducible
  - **Mitigation:** Lock dependency versions, document all steps

### Testing Criteria
- Dev server runs without errors
- Production build creates single HTML file
- Built file size < 500KB (before data embedding)
- IndexedDB initializes with all 23 tables
- Data loads successfully from embedded JSON

## Dependencies Graph
```
Task #2 (Foundation)
  ↓
Tasks #3, #4 (Data Layer, UI Components)
  ↓
Tasks #5, #6, #7, #8 (Features - can run in parallel)
  ↓
Task #9 (Testing & Documentation)
```

## Coordination Notes
- This task blocks all others - must complete first
- Once complete, Tasks #3 and #4 can start
- After #3 and #4 complete, Tasks #5, #6, #7, #8 can run in parallel
- No conflicts with other tasks (foundational work)

## Success Criteria
✅ Project structure created
✅ Vite configured for single-file output
✅ IndexedDB schema defined for all 23 entity types
✅ Data initialization logic implemented
✅ Dev and build scripts working
✅ Documentation complete
✅ Ready for next tasks to begin
