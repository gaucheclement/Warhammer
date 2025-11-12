# Coûts XP Advancement

## Objectif

Interface d'affichage des coûts XP pour acheter améliorations personnage. Implémente le calcul automatique des coûts selon règles métier.

**Coûts détaillés** : Voir [calculs-xp-progression.md](../business-rules/calculs-xp-progression.md)

## Affichage des coûts

### Interface caractéristiques

**Affichage coût** : Calculé automatiquement selon palier actuel

**Exemple** : Force 45 → prochain +1 coûte 190 XP (palier 41-45)

**Multiplicateur** : ×2 si hors carrière (affiché en rouge)

### Interface compétences

**Affichage coût acquisition** :
- Basic dans carrière : 10 XP
- Basic hors carrière : 20 XP
- Advanced dans carrière : 20 XP
- Advanced hors carrière : 40 XP

**Affichage coût avances** : Calculé selon palier (10-380 XP)

**Multiplicateur** : ×2 si hors carrière

**Spécialisations** : Chaque spécialisation = compétence distincte avec son propre coût

### Interface talents

**Affichage coût** : 100 XP/rang (200 XP/rang si hors carrière)

**Exemple** : Chanceux rang 2 dans carrière → 100 XP

**Spécialisations** : Chaque spécialisation = talent distinct

### Interface sorts

**Affichage coût** : Calculé automatiquement selon formule magie

**Coûts détaillés** : Voir [calculs-xp-progression.md](../business-rules/calculs-xp-progression.md)

## Affichage multiplicateur hors carrière

**Indicateur visuel** : ×2 affiché en rouge si élément hors carrière

**Exemple** : End +1 hors carrière → "50 XP (×2)" en rouge

**Changement dynamique** : Recalculé automatiquement lors changement carrière

## Relations

**Fichiers liés**: xp-budget.md - Budget XP disponible, xp-validation.md - Validation achats, xp-career.md - Progression carrière, xp-ui.md - Interface dépense

**Business rules** : [calculs-xp-progression.md](../business-rules/calculs-xp-progression.md) - Coûts détaillés et formules
