---
id: 099
status: DONE
priority: HIGH
domain: features
dependencies: [003, 018, 097]
phase: 2
---

# Wizard Characteristics - Ajout bonus carrière

## Objectif
Créer `audit/features/wizard/characteristics-career-bonus.md` documentant l'ajout des bonus de caractéristiques du niveau 1 de carrière

## Périmètre
**DANS le scope:**
- Avances de caractéristiques par niveau carrière (ex: "+5 CC, +10 End")
- Application cumulative si multi-niveaux
- Affichage séparé base vs bonus carrière
- Calcul automatique lors sélection carrière
- Exemples Warhammer par carrière

**HORS scope:**
- Implémentation calculs
- Code application bonus

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers career-levels.md et characteristics.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples par type de carrière
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCharacteristics.html

## Livrables
`audit/features/wizard/characteristics-career-bonus.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
