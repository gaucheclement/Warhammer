# Bug Analysis - Issue #50: Critical Data Structure Bugs

## Overview

Tests pass at 100% but application is BROKEN. Tests only validate structure (`sections` array exists) but NOT content (whether sections have proper data).

## Root Cause

Stream B refactoring created new data structures but the generators in `db-descriptions.js` return INCOMPLETE or WRONG structures that don't match what the Svelte components expect.

---

## Bug #1: Career Ranks Don't Display

**Status:** NEEDS INVESTIGATION

**Component:** `CareerDescription.svelte`
**Generator:** `generateCareerDescription()` (lines 326-474)

**Expected:** Career levels should show rank icons (1-4 stars)
**Actual:** Rank icons don't render

**Hypothesis:**
- Line 446: `rank: level.level` - might be undefined
- Component line 46-48 checks `section.rank` to show `<RankIcon>`
- Need to verify career level data structure

**To Diagnose:**
1. Check what `level.level` actually contains
2. Verify RankIcon component receives valid rank (1-4)
3. Check if rank is being passed correctly in tab structure

---

## Bug #2: Creature Stats Tab Is Empty

**Status:** ROOT CAUSE IDENTIFIED

**Component:** `CreatureDescription.svelte` line 43-45
**Generator:** `generateCreatureDescription()` lines 1959-2010

**Expected:**
```javascript
{
  type: 'stats',
  stats: { m: 4, cc: 35, ct: 30, ... }
}
```

**Actual:**
```javascript
{
  type: 'table',  // ❌ WRONG TYPE
  label: 'Caractéristiques',
  headers: [...],
  rows: [[...]]  // ❌ WRONG FORMAT
}
```

**Component Expects:**
```svelte
{#if subsection.type === 'stats'}
  <StatTable stats={subsection.stats} showAdditional={true} />
```

**Fix Required:**
```javascript
// BEFORE (lines 1968-1973)
statsSections.push({
  type: 'table',
  label: 'Caractéristiques',
  headers: charLabels,
  rows: [charValues]
})

// AFTER
statsSections.push({
  type: 'stats',  // ✅ CORRECT TYPE
  stats: creature.char  // ✅ PASS FULL stats OBJECT
})
```

**Additional Issue:**
Lines 1976-2003 create separate text sections for b, bf, be, pv. These should be REMOVED - StatTable already handles them via `showAdditional={true}`.

---

## Bug #3: Creature Traits Show Wrong Format

**Status:** ROOT CAUSE IDENTIFIED

**Component:** `DescriptionList.svelte`
**Generator:** `generateCreatureDescription()` lines 2058-2077

**Problem:** Traits in creature data often have specializations like:
- `"à distance (indice) (portée)"`
- `"arme naturelle +8"`

**Current Code (line 2070-2074):**
```javascript
items: validTraits.map(t => ({
  id: t.id,
  type: 'trait',
  label: getEntityLabel(t)  // ❌ Only gets base label, loses spec!
}))
```

**Issue:** Creatures store traits with specs like `"arme-naturelle +8"` but code only extracts base trait label, losing the modifier.

**Expected Display:** "Arme Naturelle +8"
**Actual Display:** "Arme Naturelle"

**Fix Required:**
Need to preserve the full string from creature.traits including any modifiers/specs.

**Similar Issue for Optional Traits:**
Line 2083: `items: creature.optionals.map(opt => opt)`
These are just strings but might need parsing if they contain entity references.

---

## Bug #4: Quality Error "Entity not found: devastatrice"

**Status:** NEEDS INVESTIGATION

**Component:** EntityDescription or quality lookup
**Generator:** Multiple (anywhere qualities are referenced)

**Error Message:** `Entity not found: quality with ID 'devastatrice'`

**Hypothesis:**
1. Wrong entity type used (maybe 'qualité' vs 'quality')
2. Wrong ID format (maybe 'dévastatrice' with accent)
3. Quality doesn't exist in database
4. Reference uses display name instead of ID

**To Diagnose:**
1. Search database for qualities containing "devast"
2. Check how trappings reference qualities
3. Verify quality ID normalization

---

## Bug #5: Species "Détails" Tab Shows Placeholder

**Status:** ROOT CAUSE IDENTIFIED

**Component:** `SpeciesDescription.svelte`
**Generator:** `generateSpeciesDescription()` lines 1026-1034

**Current Code:**
```javascript
sections.push({
  type: 'tab',
  tabKey: 'Détails',
  tabLabel: 'Détails',
  sections: [
    { type: 'text', content: 'Détails de la race (âge, taille, etc.)' }  // ❌ PLACEHOLDER
  ]
})
```

**Comment on line 1025:** `// Full implementation would require detail tables which aren't in scope`

**Fix Required:**
Implement actual species details:
- Age ranges (adulte, vieillesse, espérance de vie)
- Height ranges
- Hair colors
- Eye colors

These exist in the database but need proper implementation.

---

## Bug #6: Species "Caractéristiques" Tab Shows Placeholder

**Status:** ROOT CAUSE IDENTIFIED

**Component:** `SpeciesDescription.svelte`
**Generator:** `generateSpeciesDescription()` lines 1105-1112

**Current Code:**
```javascript
sections.push({
  type: 'tab',
  tabKey: 'Caractéristiques',
  tabLabel: 'Caractéristiques',
  sections: [
    { type: 'text', content: 'Table des caractéristiques de race' }  // ❌ PLACEHOLDER
  ]
})
```

**Comment on line 1104:** `// Characteristics table - simplified`

**Fix Required:**
Implement characteristic ranges table showing:
- Initial values (e.g., "2d10+20" for M)
- Advances (how much can be increased)

This data exists in the database but needs proper implementation.

---

## Bug #7: CareerLevel Shows No Description

**Status:** NEEDS INVESTIGATION

**Component:** `CareerLevelDescription.svelte` or redirect logic
**Generator:** `generateCareerLevelDescription()` lines 492-506

**Expected Behavior:**
When viewing a CareerLevel, should redirect to parent Career with that level's tab active.

**Current Code (lines 499-505):**
```javascript
return {
  sections: [],  // ❌ EMPTY!
  metadata: {
    tab_actif: careerLevel.level - tabOffset,
    careerLevel: careerLevel.level
  }
}
```

**Issue:** Returns empty sections array. The metadata suggests this should trigger a redirect/tab switch, but:
1. Where is this metadata used?
2. Is EntityDescription.svelte handling this metadata?
3. Should this navigate to the career instead?

**To Diagnose:**
1. Check how EntityDescription handles `metadata.tab_actif`
2. Verify if CareerLevelDescription component exists and what it does
3. Test manual navigation to a career level

---

## Summary of Fixes Needed

| Bug | File | Lines | Complexity | Priority |
|-----|------|-------|------------|----------|
| #2 | db-descriptions.js | 1968-2003 | Low | HIGH |
| #3 | db-descriptions.js | 2058-2077 | Medium | HIGH |
| #5 | db-descriptions.js | 1026-1034 | High | MEDIUM |
| #6 | db-descriptions.js | 1105-1112 | High | MEDIUM |
| #1 | db-descriptions.js | 326-474 | Low | HIGH |
| #4 | Multiple | ? | Low | HIGH |
| #7 | db-descriptions.js / EntityDescription.svelte | 492-506 | Medium | MEDIUM |

## Testing Strategy

After each fix:
1. Run vitest to ensure tests still pass
2. Start dev server
3. Navigate to affected entity type
4. Verify display in browser
5. Document what you see

DO NOT mark a bug as fixed until you've tested it in the browser!
