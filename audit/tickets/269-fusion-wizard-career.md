---
id: 269
status: TODO
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/career-* (R7)

## Objectif
Fusionner 6 fichiers wizard/career-* en 1 fichier career.md (~340 lignes)

## Fichiers sources (6 fichiers - 1,050 lignes estimé)
- career-selection.md
- career-levels.md
- career-class.md
- career-status.md
- career-validation.md
- career-display.md

## Structure cible
```markdown
# Wizard - Sélection carrière
## Vue d'ensemble (10 lignes)
## Sélection carrière (70 lignes) - fusion career-selection.md
## Classes de carrières (50 lignes) - fusion career-class.md
## Niveaux de carrière (70 lignes) - fusion career-levels.md
## Statut social (50 lignes) - fusion career-status.md
## Affichage (40 lignes) - fusion career-display.md
## Validation (40 lignes) - fusion career-validation.md
## Exemples concrets (40 lignes)
## Voir aussi (10 lignes)
```

## Impact
- **-710 lignes** (-68%)
- **-83% fichiers** (6 → 1)

## Effort estimé
3 heures

## Critères d'acceptance
- [ ] 6 fichiers → 1 fichier career.md (~340 lignes)
- [ ] Anciens fichiers supprimés
- [ ] Aucune perte contenu métier
