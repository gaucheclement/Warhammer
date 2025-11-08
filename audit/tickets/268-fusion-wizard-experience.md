---
id: 268
status: TODO
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/experience-* (R6)

## Objectif
Fusionner 7 fichiers wizard/experience-* en 1 fichier experience.md (~380 lignes)

## Fichiers sources (7 fichiers - 1,200 lignes estimé)
- experience-starting.md
- experience-species.md
- experience-career.md
- experience-allocation.md
- experience-log.md
- experience-validation.md
- experience-display.md

## Structure cible
```markdown
# Wizard - Expérience initiale
## Vue d'ensemble (10 lignes)
## Points d'expérience départ (50 lignes) - fusion experience-starting.md
## XP racial (50 lignes) - fusion experience-species.md
## XP carrière (50 lignes) - fusion experience-career.md
## Allocation XP (70 lignes) - fusion experience-allocation.md
## Historique XP (50 lignes) - fusion experience-log.md
## Affichage (40 lignes) - fusion experience-display.md
## Validation (40 lignes) - fusion experience-validation.md
## Exemples concrets (40 lignes)
## Voir aussi (10 lignes)
```

## Impact
- **-820 lignes** (-68%)
- **-86% fichiers** (7 → 1)

## Effort estimé
3 heures

## Critères d'acceptance
- [ ] 7 fichiers → 1 fichier experience.md (~380 lignes)
- [ ] Anciens fichiers supprimés
- [ ] Aucune perte contenu métier
