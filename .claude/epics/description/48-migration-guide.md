---
issue: 48
title: Unified Data Layer Migration Guide
created: 2025-11-02
---

# Issue #48: Unified Data Layer Migration Guide

## Overview

Issue #48 successfully unified two parallel data layer implementations into a single, coherent system.
All functionality from both src/stores/data.js (active but incomplete) and src/stores/dataStore.js (dormant with advanced features) has been integrated into a unified src/stores/data.js.

##What Changed

### Before (Two Systems)

- **src/stores/data.js** (494 lines) - Active, used by 23+ files, but missing EntityReference parsing
- **src/stores/dataStore.js** (433 lines) - Dormant, had transformData pipeline but was never initialized

### After (One System)

- **src/stores/data.js** (485 lines + utilities) - Unified system with all features
- **src/stores/dataStore.js.bak** - Archived for historical reference (DO NOT USE)

## Key Improvements

1. **transformData Pipeline**: Issue #47 integration, generates stable string IDs, parses EntityReference objects
2. **dataQueries Utility**: Convenient methods for querying merged data
3. **Data Quality Validation**: Reports unresolved/ambiguous references on startup
4. **No Code Duplication**: Single source of truth
5. **Complete API**: All CRUD operations, characters store, helpers

## Usage

### Importing

```javascript
import { dataQueries, mergedData, officialData } from "./stores/data.js"
```

### dataQueries API

- `getById(entityType, id)` - Get single entity
- `getAll(entityType)` - Get all entities of a type
- `filter(entityType, predicate)` - Filter by function
- `getOfficial(entityType)` - Only official entities
- `getCustom(entityType)` - Only custom entities
- `getModified(entityType)` - Only modified entities
- `searchByName(entityType, term)` - Search by name
- `getCount(entityType)` - Count breakdown
- `getAllStats()` - Stats for all types

### EntityReference Format

```javascript
{
  id: "skill-athletisme",
  label: "Athletisme",
  entityType: "skills",
  original: "athletisme",
  resolved: true,
  ambiguous: false
}
```

## Migration Checklist

### For Reading Data
- [ ] Import from ./stores/data.js (NOT dataStore.js)
- [ ] Use mergedData for combined official + custom data
- [ ] Use dataQueries for convenient querying
- [ ] Check isDataLoading before accessing data

### For Modifying Data
- [ ] Use modifyEntity() to edit entities
- [ ] Use createCustomEntity() to create
- [ ] Use deleteModification() to delete
- [ ] Changes auto-persist to localStorage

### For References
- [ ] Handle EntityReference objects (have .id, .label, .entityType)
- [ ] Use .id for entity ID, .label for display
- [ ] Check .resolved for unresolved references

## Validation Report

On startup, console shows:
- Total entities and references processed
- Per-entity-type statistics
- Unresolved/ambiguous references
- Data quality percentage

## Common Patterns

```javascript
// Get single entity
const talent = dataQueries.getById("talents", "talent-acrobatie")

// Search by name
const results = dataQueries.searchByName("skills", "athl")

// Get counts
const { total, official, custom, modified } = dataQueries.getCount("talents")
```

## Troubleshooting

- **IDs are numbers not strings**: Clear IndexedDB and reload
- **Custom mods not persisting**: Check localStorage not full, not private mode
- **Unresolved references**: Check entity names match exactly

## Related Issues

- Issue #48: Unified Data Layer Architecture
- Issue #47: Entity Reference Parsing and Validation

## Documentation

See JSDoc comments in src/stores/data.js for complete API documentation.

---

**Created**: 2025-11-02
**Streams**: A (Core), B (Utilities), C (Testing), D (Documentation)
**Status**: Complete and Production Ready
