---
id: 266
status: TODO
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/talents-* (R4)

## Objectif
Fusionner 7 fichiers wizard/talents-* en 1 fichier talents.md (~360 lignes)

## Fichiers sources (7 fichiers - 1,215 lignes)
- talents-choice.md
- talents-random.md
- talents-species.md
- talents-career.md
- talents-multiple.md
- talents-validation.md
- talents-display.md

## Structure cible
```markdown
# Wizard - Talents
## Vue d'ensemble (10 lignes)
## Talents d'espèce (50 lignes) - fusion talents-species.md
## Talents de carrière (50 lignes) - fusion talents-career.md
## Gestion des choix (50 lignes) - fusion talents-choice.md + talents-random.md
## Talents multiples (50 lignes) - fusion talents-multiple.md
## Affichage (40 lignes) - fusion talents-display.md
## Validation (40 lignes) - fusion talents-validation.md
## Exemples concrets (40 lignes)
## Voir aussi (10 lignes)
```

## Impact
- **-855 lignes** (-70%)
- **-86% fichiers** (7 → 1)

## Effort estimé
3 heures

## Critères d'acceptance
- [ ] 7 fichiers → 1 fichier talents.md (~360 lignes)
- [ ] Anciens fichiers supprimés
- [ ] Aucune perte contenu métier
