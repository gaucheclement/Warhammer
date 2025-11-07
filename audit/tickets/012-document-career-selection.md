---
id: 012
status: TODO
priority: HIGH
domain: features
dependencies: [002, 010, 011]
---

# Documenter étape Sélection de Carrière

## Objectif
Documenter la fonctionnalité de sélection de carrière (Step 2).

## Périmètre
**DANS le scope:**
- Objectif utilisateur
- Flux de sélection
- Filtrage par espèce
- Règles métier carrières
- Données utilisées (careers, classes)

**HORS scope:**
- Code UI

## Critères d'acceptance
- [ ] Fichier `audit/features/character-creation/career-selection.md` créé
- [ ] Fichier < 200 lignes
- [ ] Flux fonctionnel documenté
- [ ] Règles de filtrage par espèce
- [ ] Liens vers database/careers.md et classes.md
- [ ] Cas particuliers
- [ ] Aucun code technique

## Fichiers à analyser
- `warhammer-v2/src/components/wizard/WizardStep2Career.svelte`

## Livrables
- `audit/features/character-creation/career-selection.md`

## Validation finale
- Fonctionnalité complète
- Règles filtrage claires
- Format respecté
