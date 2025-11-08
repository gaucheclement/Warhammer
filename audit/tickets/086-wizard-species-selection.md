---
id: 086
status: DONE
priority: HIGH
domain: features
dependencies: [001]
phase: 2
---

# Wizard Species - Sélection espèce et sous-espèce

## Objectif
Créer `audit/features/wizard/species-selection.md` documentant la sélection d'espèce et sous-espèce lors de la création de personnage

## Périmètre
**DANS le scope:**
- Sélection parmi les espèces disponibles (Humain, Halfelin, Nain, Elfe, etc.)
- Sélection de la sous-espèce si applicable
- Affichage des informations de l'espèce sélectionnée
- Règles de présélection et restrictions
- Exemples concrets par espèce Warhammer

**HORS scope:**
- Implémentation technique UI
- Code de rendu des composants

## Critères d'acceptance
- [x] Fichier créé < 200 lignes (175 lignes)
- [x] Cross-refs OK vers species.md et wizard-overview.md
- [x] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [x] Exemples concrets pour chaque espèce
- [x] Relations documentées (table species)

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepSpecies.html

## Livrables
`audit/features/wizard/species-selection.md`

## Validation finale
- [x] Tous critères cochés
- [x] Format template respecté
- [x] Pas de Future Work
- [x] Fichier autonome
