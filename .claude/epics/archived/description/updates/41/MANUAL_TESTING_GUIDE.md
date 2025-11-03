# Manual Testing Guide - Issue #41
## Extend Related Entities System

**Dev Server**: http://localhost:5173/
**Feature**: EntityDescription "Related" tab with DataTable pagination
**Test Date**: 2025-11-01

---

## What to Test

The new feature adds a "Related" tab to entity description pages that shows:
1. **Related entities** using new relationship functions (Stream A)
2. **"Where Used"** - all entities that reference the current entity (Stream B)
3. **DataTable pagination** for lists with more than 50 items (Stream C)

---

## Test Scenarios

### 1. Basic Related Tab Functionality

#### Test 1.1: Tab Navigation
**Steps:**
1. Navigate to any entity detail page (e.g., a Skill, Talent, Career, etc.)
2. Look for the tab bar with "Info" and "Related" tabs
3. Click on the "Related" tab

**Expected Results:**
- ✅ Two tabs visible: "Info" and "Related"
- ✅ "Related" tab is clickable
- ✅ Tab switches smoothly with active state indicator
- ✅ Badge showing count of related entities (e.g., "Related (15)")

#### Test 1.2: Related Content Display
**Steps:**
1. On the "Related" tab, observe the content

**Expected Results:**
- ✅ Related entities are grouped by type (e.g., "Career Levels", "Species", "Talents")
- ✅ Each group shows the entity type name and count
- ✅ Entity names are clickable links
- ✅ Clean, readable layout with proper spacing

---

### 2. Small Lists (≤ 50 items)

**Purpose**: Test simple list rendering for entities with few relationships

#### Test 2.1: Skills with Few Relationships
**Test Entities:**
- Navigate to a skill like "Art" or "Entertain"

**Expected Results:**
- ✅ Simple bulleted list format
- ✅ Entity names are clickable
- ✅ Clicking navigates to that entity's page
- ✅ No DataTable (simple list only)
- ✅ Fast loading (< 1 second)

#### Test 2.2: Trappings with Qualities
**Test Entities:**
- Navigate to a trapping like "Sword" or "Shield"

**Expected Results:**
- ✅ Shows related qualities
- ✅ Shows entities that use this trapping (careers, etc.)
- ✅ Simple list format

---

### 3. Large Lists (> 50 items) - DataTable

**Purpose**: Test DataTable pagination for entities with many relationships

#### Test 3.1: Popular Skills
**Test Entities:**
- Navigate to "Athletics" or "Melee (Basic)"
- These should be referenced by many career levels

**Expected Results:**
- ✅ DataTable component renders (not simple list)
- ✅ Virtual scrolling enabled
- ✅ Smooth scrolling performance (60fps)
- ✅ Shows "Showing X of Y items" or similar
- ✅ Search/filter box available (if DataTable supports it)
- ✅ Sortable columns (click column headers)
- ✅ Row height consistent
- ✅ Clicking row navigates to entity

#### Test 3.2: Common Characteristics
**Test Entities:**
- Navigate to characteristics like "Weapon Skill" or "Fellowship"
- These should be referenced by many skills

**Expected Results:**
- ✅ DataTable handles 100+ items smoothly
- ✅ No lag when scrolling
- ✅ All items accessible via scroll
- ✅ Performance < 200ms to render

---

### 4. Relationship Types Coverage

Test that different entity types show appropriate relationships:

#### Test 4.1: Spells → Gods (New in Stream A)
**Steps:**
1. Navigate to a divine spell (blessing or miracle)
2. Check the "Related" tab

**Expected Results:**
- ✅ Shows which god grants this spell
- ✅ Link to god entity works

#### Test 4.2: Spells → Talents (New in Stream A)
**Steps:**
1. Navigate to a spell like "Magic Missile"
2. Check the "Related" tab

**Expected Results:**
- ✅ Shows talents that grant this spell
- ✅ Link to talent entity works

#### Test 4.3: Trappings → Qualities (New in Stream A)
**Steps:**
1. Navigate to equipment like "Plate Armor"
2. Check the "Related" tab

**Expected Results:**
- ✅ Shows all qualities for this equipment
- ✅ Links to quality entities work

#### Test 4.4: Creatures → Traits (New in Stream A)
**Steps:**
1. Navigate to a creature like "Orc" or "Goblin"
2. Check the "Related" tab

**Expected Results:**
- ✅ Shows all traits for the creature
- ✅ Links to trait entities work

#### Test 4.5: Reverse Relationships ("Where Used")
**Steps:**
1. Navigate to a talent, skill, or trapping
2. Check the "Related" tab

**Expected Results:**
- ✅ Shows all entities that reference this one
- ✅ Grouped by type (careers, species, talents, etc.)
- ✅ Bidirectional: if A→B, then B should show A

---

### 5. Edge Cases

#### Test 5.1: Entity with No Relationships
**Steps:**
1. Find an entity that's not referenced anywhere (orphaned)
2. Check the "Related" tab

**Expected Results:**
- ✅ Shows friendly message: "No related entities found" or similar
- ✅ No errors in console
- ✅ Tab still works correctly

#### Test 5.2: Brand New Entity
**Steps:**
1. If possible, create a new entity
2. Check its "Related" tab immediately

**Expected Results:**
- ✅ Empty state displayed
- ✅ No crashes

#### Test 5.3: Entity with Exactly 50 Items
**Steps:**
1. Find an entity with close to 50 relationships
2. Check if it uses simple list or DataTable

**Expected Results:**
- ✅ 50 or fewer: simple list
- ✅ 51 or more: DataTable
- ✅ Boundary correctly handled

---

### 6. Performance Testing

#### Test 6.1: First Load Performance
**Steps:**
1. Open browser DevTools → Network tab
2. Navigate to an entity with many relationships
3. Click "Related" tab
4. Observe timing

**Expected Results:**
- ✅ Initial data fetch: < 100ms
- ✅ UI renders: < 200ms total
- ✅ Smooth transition (no jank)

#### Test 6.2: Cache Performance
**Steps:**
1. Click "Related" tab on an entity
2. Switch to "Info" tab
3. Switch back to "Related" tab
4. Observe timing

**Expected Results:**
- ✅ Second load: < 5ms (from cache)
- ✅ Instant display
- ✅ No network request (check DevTools)

#### Test 6.3: DataTable Scroll Performance
**Steps:**
1. Open a large list (100+ items) in DataTable
2. Scroll rapidly up and down
3. Watch for frame drops

**Expected Results:**
- ✅ Smooth 60fps scrolling
- ✅ No lag or stuttering
- ✅ Virtual scrolling working (only renders visible rows)

---

### 7. Browser Console Checks

Open DevTools Console (F12) during testing:

**Expected:**
- ✅ No errors logged
- ✅ No warnings about missing data
- ✅ Cache hits logged (if debug enabled)
- ✅ Performance metrics visible (if benchmarking enabled)

**Red Flags:**
- ❌ "Cannot read property" errors
- ❌ Network errors (404, 500)
- ❌ Infinite loops or memory leaks
- ❌ React/Svelte hydration errors

---

### 8. Cross-Browser Testing (Optional)

If time permits, test on:
- ✅ Chrome/Edge (primary)
- ✅ Firefox
- ✅ Safari (if on Mac)

**Check:**
- Tab navigation works
- DataTable renders correctly
- Scrolling is smooth
- No layout issues

---

## Entity Type Test Matrix

Test at least one entity from each category:

| Entity Type | Test Entity | Relationships to Check |
|-------------|-------------|------------------------|
| **Skills** | Athletics | Career levels, species, talents |
| **Talents** | Warrior Born | Skills granted, careers |
| **Characteristics** | Weapon Skill | Skills that use it |
| **Careers** | Soldier | Career levels, skills, talents |
| **Career Levels** | Soldier 1 | Parent career, skills, talents |
| **Species** | Human | Skills, talents |
| **Trappings** | Sword | Qualities, careers |
| **Qualities** | Sharp | Trappings that have it |
| **Spells** | Magic Missile | Lores, gods, talents |
| **Lores** | Fire | Spells, magicks |
| **Gods** | Sigmar | Blessings, miracles |
| **Creatures** | Orc | Traits |
| **Traits** | Armour | Creatures that have it |

---

## Test Results Template

Use this to track your testing:

```
### Test Session: [Date/Time]

#### Environment
- Browser:
- OS:
- Dev Server: http://localhost:5173/

#### Test 1: Basic Tab Functionality
- [ ] Tab navigation works
- [ ] Entity count badge displays
- [ ] Content loads
- Issues:

#### Test 2: Small Lists
- [ ] Simple list renders
- [ ] Links work
- [ ] Performance OK
- Issues:

#### Test 3: Large Lists (DataTable)
- [ ] DataTable renders for > 50 items
- [ ] Scrolling smooth
- [ ] Sorting works
- [ ] Navigation works
- Issues:

#### Test 4: Relationship Types
- [ ] Spells → Gods
- [ ] Spells → Talents
- [ ] Trappings → Qualities
- [ ] Creatures → Traits
- [ ] Reverse relationships
- Issues:

#### Test 5: Edge Cases
- [ ] Empty state handles gracefully
- [ ] No console errors
- Issues:

#### Test 6: Performance
- [ ] First load < 100ms
- [ ] Cache works
- [ ] 60fps scrolling
- Issues:

#### Overall Assessment
- Status: ✅ PASS / ⚠️ ISSUES / ❌ FAIL
- Notes:
```

---

## Known Issues to Watch For

Based on implementation, watch out for:

1. **Entity Type Normalization**
   - Some types might appear as "careerLevel" vs "careerLevels"
   - Should be handled, but verify pluralization is correct

2. **Cache Timing**
   - Cache is set to 5 minutes
   - If testing same entity repeatedly, might see stale data

3. **DataTable Import**
   - Verify DataTable component exists and imports correctly
   - Check for any missing dependencies

4. **Empty States**
   - Ensure friendly messages appear (not blank screens)

---

## Success Criteria

Consider testing **PASSED** if:

✅ All 8 acceptance criteria work:
1. Forward relationships display correctly
2. "Where Used" shows all references
3. All 20+ entity types supported
4. Related tab is visible and functional
5. DataTable appears for lists > 50
6. Cache is working (5-min TTL)
7. Performance < 100ms
8. Bidirectional relationships verified

✅ No critical bugs
✅ Performance is acceptable
✅ User experience is smooth

---

## Reporting Issues

If you find issues, document:
1. **What you were testing**
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Browser/environment**
6. **Screenshots** (if applicable)
7. **Console errors** (if any)

---

## Quick Start Checklist

Ready to test? Here's the fastest path:

1. ✅ Open http://localhost:5173/
2. ✅ Navigate to "Athletics" skill (should have many relationships)
3. ✅ Click "Related" tab
4. ✅ Verify DataTable appears with scrolling
5. ✅ Click an entity in the list → should navigate
6. ✅ Go back, switch tabs → should be instant (cached)
7. ✅ Open DevTools Console → check for errors
8. ✅ Test 2-3 different entity types
9. ✅ Look for empty state (find unused entity)
10. ✅ Report back results!

---

**Good luck with testing! 🧪**
