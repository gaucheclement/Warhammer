---
id: 011
status: TODO
priority: HIGH
domain: features
dependencies: [001, 010]
---

# Documenter étape Sélection d'Espèce

## Objectif
Documenter la fonctionnalité de sélection d'espèce (Step 1).

## Périmètre
**DANS le scope:**
- Objectif utilisateur
- Flux de sélection
- Règles métier espèce
- Impact sur le reste du wizard
- Données utilisées (table species)

**HORS scope:**
- Code UI

## Critères d'acceptance
- [ ] Fichier `audit/features/character-creation/species-selection.md` créé
- [ ] Fichier < 200 lignes
- [ ] Flux fonctionnel documenté
- [ ] Règles métier
- [ ] Lien vers audit/database/species.md
- [ ] Cas particuliers
- [ ] Aucun code technique

## Fichiers à analyser
- `warhammer-v2/src/components/wizard/WizardStep1Species.svelte`

## Livrables
- `audit/features/character-creation/species-selection.md`

## Validation finale
- Fonctionnalité complète
- Règles métier claires
- Format respecté
