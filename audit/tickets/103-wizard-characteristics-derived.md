---
id: 103
status: TODO
priority: HIGH
domain: features
dependencies: [018, 101]
phase: 2
---

# Wizard Characteristics - Calculs dérivés

## Objectif
Créer `audit/features/wizard/characteristics-derived.md` documentant le calcul des attributs dérivés (Mouvement, Blessures, etc.)

## Périmètre
**DANS le scope:**
- Mouvement (selon espèce + modificateurs)
- Blessures (formules complexes selon espèce + For + End + Taille)
- Destin (selon espèce)
- Résolution (selon espèce)
- Points de Fortune
- Formules de calcul détaillées
- Exemples Warhammer par espèce

**HORS scope:**
- Implémentation calculs
- Code formules

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers characteristics.md et species.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples de calculs par espèce
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCharacteristics.html

## Livrables
`audit/features/wizard/characteristics-derived.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
