---
id: 102
status: TODO
priority: MEDIUM
domain: features
dependencies: [018, 100]
phase: 2
---

# Wizard Characteristics - Validation cohérence

## Objectif
Créer `audit/features/wizard/characteristics-validation.md` documentant la validation des valeurs de caractéristiques saisies

## Périmètre
**DANS le scope:**
- Limites min/max par caractéristique
- Validation formule espèce (fixe + 2d10 max)
- Détection valeurs aberrantes
- Messages d'erreur explicites
- Blocage passage step suivant si invalide
- Exemples de cas invalides Warhammer

**HORS scope:**
- Implémentation validation
- Code règles métier

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers characteristics.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples de validations
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCharacteristics.html

## Livrables
`audit/features/wizard/characteristics-validation.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
