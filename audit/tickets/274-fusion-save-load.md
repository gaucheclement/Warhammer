---
id: 274
status: DONE
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion save-load/* (R12)

## Objectif
Fusionner 5 fichiers save-load/* en 1 fichier save-load.md (~320 lignes)

## Fichiers sources (5 fichiers - 780 lignes)
- sheets-save.md
- json-export.md
- import.md
- cloud-storage.md
- local-storage.md

## Structure cible
```markdown
# Save/Load - Sauvegarde et restauration

## Vue d'ensemble (10 lignes)
## Sérialisation personnage (70 lignes) - fusion sheets-save.md + json-export.md
## Stockage cloud (60 lignes) - fusion cloud-storage.md (Google Sheets)
## Stockage local (50 lignes) - fusion local-storage.md (localStorage/JSON files)
## Import données (60 lignes) - fusion import.md
## Format JSON (40 lignes)
## Voir aussi (10 lignes)
```

## Impact
- **-460 lignes** (-59%)
- **-80% fichiers** (5 → 1)

## Effort estimé
2.5 heures

## Critères d'acceptance
- [x] 5 fichiers → 1 fichier save-load.md (~320 lignes)
- [x] Anciens fichiers supprimés
