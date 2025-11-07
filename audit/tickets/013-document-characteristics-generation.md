---
id: 013
status: TODO
priority: HIGH
domain: features
dependencies: [003, 010]
---

# Documenter étape Génération de Caractéristiques

## Objectif
Documenter génération et ajustement des caractéristiques (Step 3).

## Périmètre
**DANS le scope:**
- Objectif utilisateur
- Flux de génération (aléatoire, manuel, etc.)
- Modificateurs raciaux
- Règles de calcul
- Validations

**HORS scope:**
- Code de génération

## Critères d'acceptance
- [ ] Fichier `audit/features/character-creation/characteristics-generation.md` créé
- [ ] Fichier < 200 lignes
- [ ] Flux de génération documenté
- [ ] Règles modificateurs
- [ ] Lien vers database/characteristics.md et species.md
- [ ] Aucun code technique

## Fichiers à analyser
- `warhammer-v2/src/components/wizard/WizardStep3Characteristics.svelte`

## Livrables
- `audit/features/character-creation/characteristics-generation.md`

## Validation finale
- Règles génération complètes
- Format respecté
