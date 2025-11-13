# Advancement - Historique dépenses

## Vue d'ensemble

Enregistrement toutes dépenses XP pour annulation et suivi.

## Structure historique

Avances temporaires : Chaque élément possède champ avances temporaires stockant achats XP.

Séparation : Avances permanentes (espèce, carrière, talents) vs avances temporaires (achetées XP, annulables).

## Affichage historique

Par catégorie : Caractéristiques, Compétences, Talents avec avances XP.

Informations : Nom, valeur base, avances, coût, valeur totale.

## Annulation dépenses

Annulation dernière : Bouton [-] réduit avances temporaires de 1, recalcule coût remboursement, LIFO.

Remboursement intégral : 100% sans pénalité.

Annulation complète : Bouton [Annuler] réinitialise tous avances temporaires à 0, rembourse tout XP.

## Calcul XP dépensé

Algorithme refreshXP : Pour chaque catégorie/élément, calculer oldValue/newValue, appeler getXPCost(), multiplier ×2 si hors carrière, ajouter au total.

Temps réel : Calcul après chaque modification.

## Persistance

Sauvegarde temporaire : avances temporaires en mémoire pendant session.

Sauvegarde définitive : Consolidation lors validation finale, avances deviennent permanentes.

## Validation historique

Contraintes : Cohérence XP dépensé = somme coûts, budget ≤ XP max création, avances temporaires ≥ 0, recalcul temps réel.

## Limites

Pas historique horodaté, pas export historique, pas comparaison versions, pas annulation sélective (LIFO seulement), pas snapshots multiples.

## Voir aussi

- [xp-budget.md](./xp-budget.md)
- [xp-validation.md](./xp-validation.md)
- [xp-costs.md](./xp-costs.md)
