---
id: 101
status: TODO
priority: HIGH
domain: features
dependencies: [018, 099]
phase: 2
---

# Wizard Characteristics - Calcul totaux et bonus

## Objectif
Créer `audit/features/wizard/characteristics-totals.md` documentant le calcul des valeurs totales et bonus (+X/10)

## Périmètre
**DANS le scope:**
- Formule: Total = Base Espèce + Variable (2d10) + Avances Carrière + XP
- Calcul bonus (Total / 10, arrondi inférieur)
- Affichage Total et Bonus séparés
- Mise à jour temps réel lors modifications
- Exemples de calculs Warhammer

**HORS scope:**
- Implémentation calculs
- Code mise à jour temps réel

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers characteristics.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples de calculs détaillés
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCharacteristics.html

## Livrables
`audit/features/wizard/characteristics-totals.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
