---
id: 157
status: DONE
priority: HIGH
domain: features
dependencies: [145]
phase: 2
---

# Character Model - Gestion XP

## Objectif
Créer `audit/features/character-model/xp.md` documentant les méthodes de gestion de l'XP dans le modèle Character

## Périmètre
**DANS le scope:**
- setXPMax(xp): définir XP max
- spendXP(amount, category): dépenser XP
- getXPAvailable(): XP disponible
- Log historique XP
- Exemples concrets Warhammer

**HORS scope:**
- Implémentation technique
- Code UI

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\warhammer-v1\src\Character.html

## Livrables
`audit/features/character-model/xp.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome
