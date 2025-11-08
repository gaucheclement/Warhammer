---
id: 092
status: DONE
priority: HIGH
domain: features
dependencies: [002, 091]
phase: 2
---

# Wizard Career - Filtrage par classe

## Objectif
Créer `audit/features/wizard/career-class-filter.md` documentant le filtrage des carrières par classe (Guerrier, Roublard, Érudit, Ranger)

## Périmètre
**DANS le scope:**
- 4 classes de carrières (Warrior, Rogue, Academic, Ranger)
- Filtrage dynamique selon classe sélectionnée
- Carrières appartenant à chaque classe
- Affichage regroupé par classe
- Exemples concrets Warhammer

**HORS scope:**
- Implémentation filtres
- Code UI

## Critères d'acceptance
- [x] Fichier créé < 200 lignes (186 lignes)
- [x] Cross-refs OK vers careers.md et classes.md
- [x] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [x] Exemples par classe
- [x] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCareers.html

## Livrables
`audit/features/wizard/career-class-filter.md`

## Validation finale
- [x] Tous critères cochés
- [x] Format template respecté
- [x] Pas de Future Work
- [x] Fichier autonome
