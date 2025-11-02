---
issue: 49
stream: Fix db-descriptions.js
agent: general-purpose
started: 2025-11-02T18:29:31Z
completed: 2025-11-02T19:39:00Z
status: completed
depends_on: stream-A
---

# Stream B: Fix db-descriptions.js

## Scope
Replace all broken entity resolution in descriptions (species skills/talents, class trappings) with `resolveEntityReference()`.

## Files
- `src/lib/db-descriptions.js` (lines 759-767, 819-826, 832-839)

## Completed Work

### 1. Added resolveEntityReference Import
**File**: `C:\Users\gauch\PhpstormProjects\epic-description\warhammer-v2\src\lib\db-descriptions.js` (line 37)

Added `resolveEntityReference` to the imports from `db-relations.js`.

### 2. Fixed Species Skills Resolution (Lines 821-823)
**Before**:
```javascript
const skills = await Promise.all(
  species.skills.map(s => {
    const id = typeof s === 'string' ? s : s.id
    return db.skills.get(id)
  })
)
```

**After**:
```javascript
const skills = await Promise.all(
  species.skills.map(s => resolveEntityReference(s, db.skills))
)
```

### 3. Fixed Species Talents Resolution (Lines 831-833)
**Before**:
```javascript
const talents = await Promise.all(
  species.talents.map(t => {
    const id = typeof t === 'string' ? t : t.id
    return db.talents.get(id)
  })
)
```

**After**:
```javascript
const talents = await Promise.all(
  species.talents.map(t => resolveEntityReference(t, db.talents))
)
```

### 4. Fixed Class Trappings Resolution (Lines 764-766)
**Before**:
```javascript
const trappings = await Promise.all(
  classObj.trappings.map(t => {
    const id = typeof t === 'string' ? t : t.id
    return db.trappings.get(id)
  })
)
```

**After**:
```javascript
const trappings = await Promise.all(
  classObj.trappings.map(t => resolveEntityReference(t, db.trappings))
)
```

### 5. Test Results
**Status**: ✅ **ALL TESTS PASSING**

```
Test Files  2 passed (2)
Tests       125 passed (125)
Duration    2.61s
```

## Impact

This fix ensures that:
- Species skills show only the specific specializations (e.g., "Corps à corps (Base)" not all melee types)
- Species talents show only the specific specializations (e.g., "Langue (Elthárin)" not all languages)
- Class trappings correctly handle specialized equipment
- No regressions in other entity displays

## Acceptance Criteria - All Met ✅

- ✅ All 3 locations updated to use `resolveEntityReference`
- ✅ Import statement added
- ✅ All tests pass (125/125)
- ✅ No regressions in test suite
- ✅ Code simplified (reduced from 6 lines to 1 line per location)

## Next Steps

Manual testing required to verify:
- Navigate to Wood Elf species in dev server
- Check "Comps/Talents" tab displays:
  - "Corps à corps (Base)" - not all melee specs
  - "Langue (Elthárin)" - not all languages
  - "Sens aiguisé (Vue)" - not all senses

## Changes Summary

**Commit**: 51bdf56
- Modified: `src/lib/db-descriptions.js`
- Lines changed: -13, +5 (simplified code)
- All tests passing
- No breaking changes
