---
id: 273
status: DONE
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion character-sheet/* (R11)

## Objectif
Fusionner 6 fichiers character-sheet/* en 1 fichier character-sheet.md (~380 lignes)

## Fichiers sources (6 fichiers - 935 lignes)
- identity.md
- characteristics-skills.md
- talents-spells.md
- equipment.md
- export-print.md
- real-time-updates.md

## Structure cible
```markdown
# Character Sheet - Feuille de personnage

## Vue d'ensemble (10 lignes)
## Section Identité (50 lignes) - fusion identity.md
## Caractéristiques et Compétences (80 lignes) - fusion characteristics-skills.md
## Talents et Sorts (70 lignes) - fusion talents-spells.md
## Équipement (60 lignes) - fusion equipment.md
## Export et Impression (50 lignes) - fusion export-print.md
## Mise à jour temps réel (40 lignes) - fusion real-time-updates.md
## Voir aussi (10 lignes)
```

## Impact
- **-555 lignes** (-59%)
- **-83% fichiers** (6 → 1)

## Effort estimé
2.5 heures

## Critères d'acceptance
- [ ] 6 fichiers → 1 fichier character-sheet.md (~380 lignes)
- [ ] Anciens fichiers supprimés
