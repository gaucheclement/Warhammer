# Advancement - Budget XP

## Vue d'ensemble

Suivi budget XP disponible pour dépenser points expérience avec vue d'ensemble par catégorie.

## Structure budget

Champs xp : xp.max (total gagné), xp.used (déjà dépensé consolidé), xp.XP temporaire (dépensé temporairement annulable).

XP disponible = xp.max - xp.used - xp.XP temporaire.

## Sources XP

Création : Espèce aléatoire +50/+25 XP, Carrière aléatoire +50/+25 XP, Étoile aléatoire +25 XP, total 0-200 XP.

Post-création : Récompenses MJ aventures/roleplay/défaites, milestones, progression sessions, total variable 0-10000+ XP.

## Affichage budget

Format : [150] Points d'Expérience à dépenser, temps réel après chaque modification.

Couleurs : Vert XP > 0, Orange XP = 0, Rouge XP < 0 (création bloqué, post-création autorisé).

## Gestion budget

Mode création strict : Bouton [+] désactivé si dépassement, [Valider] désactivé si XP < 0, impossible valider négatif.

Mode post-création souple : Bouton [+] toujours activé, budget peut être négatif dette temporaire, MJ gère dépassements.

## Calcul XP dépensé

Algorithme : Pour chaque catégorie, somme coûts paliers × multiplicateur carrière (dans ×1, hors ×2).

## Ajout XP post-création

Méthode addXP(source, amount, permanent) : Ajoute XP avec traçabilité source.

Historique gains : Date, source, montant, XP max après gain.

## Récapitulatif XP

Total par catégorie : Caractéristiques, Compétences, Talents, Sorts, total général.

Format affichage : [Catégorie]: X XP (N améliorées), Total dépensé, XP restant.

## Validation budget

Contraintes création : XP disponible ≥ 0, budget initial cohérent, pas dépassement.

Contraintes post-création : XP peut être négatif, MJ valide dépassements, traçabilité gains/dépenses.

Validation cohérence : Somme catégories = Total dépensé, Total = xp.XP temporaire ou xp.used, XP restant = xp.max - total.

## Limites

Pas breakdown détaillé par élément, pas graphiques, pas export rapport, pas détection optimisation, pas historique gains traçable.

## Voir aussi

- [xp-log.md](./xp-log.md)
- [xp-validation.md](./xp-validation.md)
- [xp-costs.md](./xp-costs.md)
