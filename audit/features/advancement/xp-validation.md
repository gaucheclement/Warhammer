# Advancement - Validation achats

## Vue d'ensemble

Validation achats XP avant confirmation pour éviter erreurs.

## Niveaux validation

Validation temps réel : Avant clic [+], vérifications budget/rang max/spécialisation/pré-requis, résultat bouton activé/désactivé.

Validation post-achat : Après clic [+], double-check budget/valeur/spécialisation, résultat achat confirmé ou annulé.

Validation finale : Avant validation step, vérifications budget global/cohérence/éléments valides, résultat step validé ou bloqué.

## Contraintes par type

Caractéristiques : Budget, dans/hors carrière ×2, avances ≤70, palier correct.

Compétences : Budget, dans/hors carrière ×2, spécialisation si groupée, avances ≤70, type Basic/Advanced.

Talents : Budget, dans/hors carrière ×2, pré-requis, rang séquentiel, rang max, spécialisation si requise.

Sorts : Talent prérequis, domaine choisi, pas doublon, budget.

## Validation budget

Mode création strict : XP disponible ≥ 0 obligatoire, blocages bouton [+] et [Valider] si budget négatif.

Mode post-création souple : XP disponible peut être < 0, dette temporaire autorisée, MJ gère dépassements.

## Pré-requis et spécialisations

Talents chaînés : Vérifier prerequisite avant achat.

Rangs dynamiques : Max = Bonus Carac.

Spécialisations : Popup sélection si requis.

## Recalcul

Fonction refreshXP : Appelée après chaque modification, recalcule XP dépensé/disponible/état boutons/coûts.

Algorithme : Somme coûts paliers × multiplicateur carrière pour chaque catégorie.

## Limites

Blocages silencieux sans messages, pas validation exhaustive règles complexes, pas panneau récapitulatif problèmes, validation client limitée.

## Voir aussi

- [xp-budget.md](./xp-budget.md)
- [xp-log.md](./xp-log.md)
- [xp-costs.md](./xp-costs.md)
- [xp-career.md](./xp-career.md)
