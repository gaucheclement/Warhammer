---
id: 100
status: TODO
priority: MEDIUM
domain: features
dependencies: [018, 097]
phase: 2
---

# Wizard Characteristics - Mode saisie manuelle vs aléatoire

## Objectif
Créer `audit/features/wizard/characteristics-manual-mode.md` documentant le choix entre saisie manuelle et génération aléatoire

## Périmètre
**DANS le scope:**
- Toggle entre mode manuel et aléatoire
- Saisie manuelle valeur par valeur
- Génération aléatoire complète (bouton)
- Validation des valeurs saisies manuellement
- Limites min/max par caractéristique
- Exemples d'utilisation Warhammer

**HORS scope:**
- Implémentation UI
- Code validation

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers characteristics.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples des deux modes
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\StepCharacteristics.html

## Livrables
`audit/features/wizard/characteristics-manual-mode.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
