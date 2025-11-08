---
id: 270
status: TODO
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/species-* (R8)

## Objectif
Fusionner 5 fichiers wizard/species-* en 1 fichier species.md (~300 lignes)

## Fichiers sources (5 fichiers - 900 lignes estimé)
- species-selection.md
- species-characteristics.md
- species-talents.md
- species-skills.md
- species-validation.md

## Structure cible
```markdown
# Wizard - Sélection espèce
## Vue d'ensemble (10 lignes)
## Sélection espèce (60 lignes) - fusion species-selection.md
## Caractéristiques raciales (70 lignes) - fusion species-characteristics.md
## Talents raciaux (60 lignes) - fusion species-talents.md
## Compétences raciales (50 lignes) - fusion species-skills.md
## Validation (40 lignes) - fusion species-validation.md
## Exemples concrets (40 lignes)
## Voir aussi (10 lignes)
```

## Impact
- **-600 lignes** (-67%)
- **-80% fichiers** (5 → 1)

## Effort estimé
3 heures

## Critères d'acceptance
- [ ] 5 fichiers → 1 fichier species.md (~300 lignes)
- [ ] Anciens fichiers supprimés
- [ ] Aucune perte contenu métier
