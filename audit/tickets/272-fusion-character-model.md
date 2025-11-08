---
id: 272
status: TODO
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion partielle character-model/* (R10)

## Objectif
Fusionner 15 fichiers character-model/* en 6 fichiers regroupés par domaine

## Fichiers sources (15 fichiers - 2,400 lignes estimé)

## Regroupement proposé (6 fichiers)
1. **character-structure.md** (~400 lignes) - fusion state + data + initialization
2. **character-calculations.md** (~350 lignes) - fusion totals + bonuses + derived
3. **character-getters.md** (~300 lignes) - fusion getCharacteristics + getSkills + getTalents
4. **character-mutations.md** (~250 lignes) - fusion add/remove/update methods
5. **character-validation.md** (~200 lignes) - fusion validation rules
6. **random-state.md** (202 lignes) - conservé tel quel (fichier unique)

## Impact
- **-1,000 lignes** (-42%)
- **-60% fichiers** (15 → 6)

## Effort estimé
4 heures

## Critères d'acceptance
- [ ] 15 fichiers → 6 fichiers
- [ ] Total ~1,400 lignes (vs 2,400)
- [ ] Anciens fichiers supprimés
