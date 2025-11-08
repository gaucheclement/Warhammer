---
id: 094
status: TODO
priority: HIGH
domain: features
dependencies: [003, 091]
phase: 2
---

# Wizard Career - Sélection niveau initial

## Objectif
Créer `audit/features/wizard/career-level-initial.md` documentant la sélection du niveau initial de carrière (Bronze 1 par défaut)

## Périmètre
**DANS le scope:**
- Niveau 1 (Bronze) par défaut pour création
- Possibilité de démarrer à un niveau supérieur (Bronze 2-4, Silver, Gold)
- Avantages du niveau initial (skills, talents, trappings, caractéristiques)
- Budget XP initial si niveau > 1
- Exemples Warhammer

**HORS scope:**
- Implémentation sélection
- Code UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers career-levels.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples par niveau
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCareers.html

## Livrables
`audit/features/wizard/career-level-initial.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
