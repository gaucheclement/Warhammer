# Advancement - Progression carrière

## Vue d'ensemble

Progression 4 niveaux carrière, restrictions achats XP, changement carrière avec impacts coûts.

## Structure 4 niveaux

Niveau 1 Bronze : 3 caractéristiques +5, 8-10 compétences, 4 talents.

Niveau 2 Silver : 1 caractéristique +10, 6 compétences, 4 talents.

Niveau 3 Gold : 1 caractéristique +15, 4 compétences, 4 talents.

Niveau 4 Gold+ : 1 caractéristique +20, 2 compétences, 4 talents.

Total cumulé : 6 caractéristiques (+30 avances), 20-22 compétences, 16 talents.

## Passage niveau supérieur

Condition : Rang actuel VALIDÉ avant passage.

Critères validation : Voir [../../business-rules/validation-rang-carriere.md](../../business-rules/validation-rang-carriere.md).

Coût passage : 100 XP après validation.

Blocage : Impossible monter si validation échoue.

## Mécanisme passage

Process : Personnage niveau N → Validation conditions → Mise à jour niveau N+1 → Nouveaux avantages disponibles.

Conservation acquis : Avances, XP dépensé, status social niveau N.

Changements : Niveau N → N+1, liste "dans carrière" ajout éléments N+1, status Bronze → Silver → Gold, salaire augmente.

Accumulation : Éléments cumulés chaque niveau (niveau 2 = niveau 1 + niveau 2).

Restrictions : Limite niveau 4, impossibilité retour niveau N-1.

## Restrictions carrière

Création wizard : Strict niveau 1 uniquement, aucune progression autorisée.

Post-création : Toutes caractéristiques/compétences/talents accessibles (coût ×2 hors carrière), changement carrière autorisé, progression autorisée.

Détermination "dans carrière" : Élément apparaît niveau carrière actuel.

## Changement carrière

Recommandations WFRP : Complétion niveau 4, justification narrative, validation MJ.

Système : Aucune restriction technique, changement à tout moment.

Mécanisme : Bouton [Carrière] → Sélection nouvelle carrière → Confirmation → Mise à jour niveau 1 nouvelle carrière.

Conservation acquis : Caractéristiques, compétences, talents, sorts, XP dépensé.

Changements : Carrière actuelle, liste "dans/hors carrière" recalculée, coûts futurs recalculés, status niveau 1 nouvelle carrière.

Impact coûts : Recalcul instantané "dans/hors carrière" selon nouvelle carrière.

Coûts XP : 100-300 XP selon validation rang et classe. Voir [../../business-rules/calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md).

Restrictions espèce : Carrières filtrées selon espèce.

## Status social

Évolution : Niveau 1 Bronze, Niveau 2 Silver, Niveau 3 Gold, Niveau 4 Gold+.

Impact : Interactions sociales, revenus, respect NPC.

## Limites

Tests/mentor non implémentés, pas complétion automatique, pas traçabilité changements, pas calcul automatique économie XP.

## Voir aussi

- [xp-costs.md](./xp-costs.md)
- [xp-validation.md](./xp-validation.md)
- [../../business-rules/validation-rang-carriere.md](../../business-rules/validation-rang-carriere.md)
- [../../business-rules/calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md)
