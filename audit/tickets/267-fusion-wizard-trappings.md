---
id: 267
status: DONE
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/trappings-* (R5)

## Objectif
Fusionner 6 fichiers wizard/trappings-* en 1 fichier trappings.md (~350 lignes)

## Fichiers sources (6 fichiers - 1,101 lignes)
- trappings-career.md
- trappings-species.md
- trappings-selection.md
- trappings-money.md
- trappings-validation.md
- trappings-display.md

## Structure cible
```markdown
# Wizard - Équipement initial
## Vue d'ensemble (10 lignes)
## Trappings de carrière (70 lignes) - fusion trappings-career.md
## Trappings d'espèce (50 lignes) - fusion trappings-species.md
## Sélection trappings (60 lignes) - fusion trappings-selection.md
## Monnaie initiale (50 lignes) - fusion trappings-money.md
## Affichage (40 lignes) - fusion trappings-display.md
## Validation (40 lignes) - fusion trappings-validation.md
## Exemples concrets (40 lignes)
## Voir aussi (10 lignes)
```

## Impact
- **-751 lignes** (-68%)
- **-83% fichiers** (6 → 1)

## Effort estimé
3 heures

## Critères d'acceptance
- [ ] 6 fichiers → 1 fichier trappings.md (~350 lignes)
- [ ] Anciens fichiers supprimés
- [ ] Aucune perte contenu métier
