# Manual Testing Guide - Issue #50 Bug Fixes

## Prerequisites

Dev server is running at: `C:\Users\gauch\PhpstormProjects\epic-description\warhammer-v2`
URL: http://localhost:5173 (or whatever port Vite assigned)

## Bugs Fixed So Far

### ✅ Bug #2: Creature Stats Tab - FIXED
**What was wrong:** Stats tab was empty (type:'table' instead of type:'stats')
**What to test:**
1. Navigate to any creature (e.g., "Goblin", "Troll", "Vampire")
2. Click on the "Stats" tab
3. **Verify:** You see a table with characteristics (M, CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)
4. **Verify:** You see additional stats below (Blessures, Bonus de Force, etc.)

### ✅ Bug #3: Creature Traits Format - FIXED
**What was wrong:** Traits lost their specializations (e.g., "Arme Naturelle +8" became just "Arme Naturelle")
**What to test:**
1. Navigate to any creature with traits
2. Click on the "Capacités" tab
3. **Verify:** Traits show WITH their modifiers:
   - "Arme Naturelle +8" (not just "Arme Naturelle")
   - "À distance (Indice) (Portée)" (with full specialization)
4. **Verify:** Optional traits are also correct

---

## Bugs Still To Fix

### ❌ Bug #1: Career Ranks Don't Display
**Expected:** Career level tabs should show rank icons (stars 1-4)
**What to test:**
1. Navigate to any career (e.g., "Artisan", "Soldat")
2. Look at the tabs - should be: Info, [⭐] Niveau 1, [⭐⭐] Niveau 2, etc.
3. **Report:** Do you see rank icons or just "Niveau 1", "Niveau 2"?

### ❌ Bug #4: Quality Error "devastatrice"
**Expected:** Qualities should display without errors
**What to test:**
1. Try to navigate to quality "devastatrice" OR
2. Find a weapon/armor that has this quality and click on it
3. **Report:** What error message do you see? Screenshot if possible.

**Hypothesis:** The quality might be:
- Named "dévastatrice" (with accent) in database
- Have a different ID than expected
- Not exist at all

### ❌ Bug #5: Species "Détails" Tab Shows Placeholder
**Expected:** Should show age ranges, height, eye colors, hair colors
**Current:** Shows only "Détails de la race (âge, taille, etc.)"
**What to test:**
1. Navigate to any species (e.g., "Humain", "Elfe", "Nain")
2. Click on "Détails" tab
3. **Report:** What do you see? Just placeholder or actual data?

**Note:** This needs implementation - data exists but generator returns placeholder.

### ❌ Bug #6: Species "Caractéristiques" Tab Shows Placeholder
**Expected:** Should show characteristic ranges table (2d10+20, etc.)
**Current:** Shows only "Table des caractéristiques de race"
**What to test:**
1. Navigate to any species
2. Click on "Caractéristiques" tab
3. **Report:** What do you see?

**Note:** This needs implementation - data exists but generator returns placeholder.

### ❌ Bug #7: CareerLevel Shows No Description
**Expected:** When clicking a career level, should redirect to parent career with that level's tab active
**Current:** Shows empty description
**What to test:**
1. Find a way to navigate directly to a career level (if possible)
2. **Report:** What happens? Empty screen, error, or something else?

**Note:** This is a complex one - might need component changes, not just data.

---

## Testing Checklist

For each entity type, verify basic display works:

### Core Entities
- [ ] Career - Has tabs (Info, Levels 1-4, Accès)
- [ ] CareerLevel - Redirects or shows error
- [ ] Talent - Shows max, tests, description, specs, access
- [ ] Skill - Shows characteristic, type, description, specs
- [ ] Spell - Shows talent, NI, range, target, duration, description

### Items & Equipment
- [ ] Trapping/Weapon - Shows category, stats, qualities, description
- [ ] Quality - Shows type, description (bug #4!)

### Creatures & NPCs
- [ ] Creature - Stats tab works (bug #2!), traits show correctly (bug #3!)
- [ ] Trait - Shows description

### World & Magic
- [ ] Species/Race - Details tab (bug #5!), Characteristics tab (bug #6!)
- [ ] God - Shows description, blessings, miracles
- [ ] Lore - Shows description, spells
- [ ] Star - Shows description

### Conditions & Effects
- [ ] Etat - Shows type, description
- [ ] Psychologie - Shows type, description
- [ ] Magick - Shows type, description

### System & Reference
- [ ] Characteristic - Shows abbreviation, type, description
- [ ] Class - Shows description, careers, trappings
- [ ] Book - Shows info, content by type
- [ ] Tree/Folder - Shows type, parent, children, entities

---

## How to Report Issues

For each bug you find, please document:

1. **Entity Type:** What type of entity (career, creature, etc.)
2. **Entity ID:** Specific entity name/ID
3. **What You Did:** Steps to reproduce
4. **What You Saw:** Screenshot or description
5. **What You Expected:** What should have happened
6. **Console Errors:** Open browser console (F12), copy any red errors

---

## Priority Order

Test in this order:

1. **High Priority (Blocks usage):**
   - Bug #4: Quality error
   - Bug #2: Creature stats (FIXED - verify!)
   - Bug #3: Creature traits (FIXED - verify!)

2. **Medium Priority (Missing features):**
   - Bug #1: Career ranks
   - Bug #5: Species details
   - Bug #6: Species characteristics
   - Bug #7: CareerLevel redirect

3. **Low Priority (Nice to have):**
   - Cross-reference links work
   - Navigation history works
   - Tabs switch correctly

---

## Known Good Examples

Use these as baseline "working" examples:

- **Talent:** "Combat" - simple talent with specs
- **Skill:** "Athlétisme" - simple skill
- **Career:** "Artisan" - has 4 levels
- **Spell:** Any spell from a lore
- **Class:** "Guerriers" - has multiple careers

If these don't work, there's a more fundamental issue!
