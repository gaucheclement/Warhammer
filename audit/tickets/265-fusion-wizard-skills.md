---
id: 265
status: DONE
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/skills-* (R3)

## Objectif
Fusionner 8 fichiers wizard/skills-* en 1 fichier skills.md (~400 lignes)

## Fichiers sources (8 fichiers - 1,482 lignes)
- skills-species.md
- skills-career.md
- skills-choice.md
- skills-specialization.md
- skills-values.md
- skills-grouping.md
- skills-progression.md
- skills-validation.md

## Structure cible
```markdown
# Wizard - Compétences
## Vue d'ensemble (10 lignes)
## Compétences d'espèce (50 lignes) - fusion skills-species.md
## Compétences de carrière (50 lignes) - fusion skills-career.md
## Gestion des choix (50 lignes) - fusion skills-choice.md
## Spécialisations (60 lignes) - fusion skills-specialization.md
## Calcul des valeurs (50 lignes) - fusion skills-values.md
## Regroupement et affichage (50 lignes) - fusion skills-grouping.md
## Règles de progression (40 lignes) - fusion skills-progression.md
## Validation (30 lignes) - fusion skills-validation.md
## Exemples concrets (40 lignes)
## Voir aussi (10 lignes)
```

## Impact
- **-1,082 lignes** (-73%)
- **-88% fichiers** (8 → 1)

## Effort estimé
3 heures

## Critères d'acceptance
- [x] 8 fichiers → 1 fichier skills.md (~400 lignes) - 439 lignes
- [x] Anciens fichiers supprimés
- [x] Aucune perte contenu métier
