---
id: 276
status: DONE
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion partielle admin/* + advancement/* (R18+R19)

## Objectif
Fusionner admin/* (15→6) et advancement/* (15→6) en fichiers regroupés par domaine

## admin/* (15 fichiers - 2,300 lignes)

### Regroupement proposé (6 fichiers)
1. **admin-edit-entities.md** (~450 lignes) - fusion edit-species.md + edit-careers.md + edit-skills.md + edit-talents.md + edit-spells.md + edit-trappings.md
2. **admin-preview.md** (~200 lignes) - fusion preview.md + rich-descriptions.md
3. **admin-validation.md** (~250 lignes) - fusion validation rules
4. **admin-ui.md** (~250 lignes) - fusion UI patterns
5. **admin-permissions.md** (~150 lignes) - fusion access control
6. **admin-batch.md** (~150 lignes) - fusion batch operations

**Duplication identifiée (depuis rapport R19)** :
- edit-species.md et edit-careers.md ont structure IDENTIQUE (6/7 sections)
- 1,120 lignes duplication (140 lignes × 8 edit-* files)

## advancement/* (15 fichiers - 2,200 lignes)

### Regroupement proposé (6 fichiers)
1. **xp-costs.md** (~350 lignes) - fusion cost-characteristics.md + cost-skills-basic.md + cost-skills-advanced.md + cost-talents.md + cost-spells.md + cost-other.md
2. **xp-calculation.md** (~300 lignes) - fusion calculation rules
3. **xp-career.md** (~250 lignes) - fusion career advancement
4. **xp-validation.md** (~250 lignes) - fusion validation
5. **xp-ui.md** (~200 lignes) - fusion UI
6. **xp-log.md** (~150 lignes) - fusion history

**Duplication identifiée (depuis rapport R18)** :
- cost-*.md files ont structure IDENTIQUE (tableau paliers, exemples)
- 840 lignes duplication

## Impact admin/*
- **-900 lignes** (-39%)
- **-60% fichiers** (15 → 6)

## Impact advancement/*
- **-900 lignes** (-41%)
- **-60% fichiers** (15 → 6)

## Effort estimé
8 heures (2× 4h pour chaque groupe)

## Critères d'acceptance
- [ ] admin/* : 15 fichiers → 6 fichiers (~1,400 lignes)
- [ ] advancement/* : 15 fichiers → 6 fichiers (~1,300 lignes)
- [ ] Anciens fichiers supprimés
- [ ] Élimination duplications identifiées
