---
id: 091
status: DONE
priority: HIGH
domain: features
dependencies: [002, 086]
phase: 2
---

# Wizard Career - Sélection carrière compatible espèce

## Objectif
Créer `audit/features/wizard/career-selection.md` documentant la sélection de carrière compatible avec l'espèce choisie

## Périmètre
**DANS le scope:**
- Liste des carrières disponibles par espèce
- Restrictions d'espèce par carrière
- Carrières spécifiques à une espèce
- Sélection manuelle vs aléatoire
- Exemples concrets Warhammer (Prêtre de Sigmar = Humain uniquement, etc.)

**HORS scope:**
- Implémentation technique UI
- Code de filtrage

## Critères d'acceptance
- [x] Fichier créé < 200 lignes (197 lignes)
- [x] Cross-refs OK vers careers.md et species.md
- [x] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [x] Exemples par type de carrière
- [x] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCareers.html

## Livrables
`audit/features/wizard/career-selection.md`

## Validation finale
- [x] Tous critères cochés
- [x] Format template respecté
- [x] Pas de Future Work
- [x] Fichier autonome
