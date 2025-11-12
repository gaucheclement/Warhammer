# Historique Dépenses XP

## Objectif

Système enregistre toutes dépenses XP pour permettre annulation et suivi. Historique essentiel pour transparence et correction erreurs.

## Structure de l'Historique

**Champ avances temporaires**: Chaque élément améliorable (caractéristique, compétence, talent) possède champ avances temporaires qui stocke avances temporaires achetées avec XP

**Exemple avances temporaires**: Charme avances espèce +0, Charme avances carrière +5, Charme avances temporaires +3 acheté avec XP = Total 0 + 5 + 3 = 8

**Séparation avances**: Avances permanentes (Avances espèce immutables, Avances carrière immutables après acquisition niveau, Avances talents modificateurs +5/+Bonus), avances temporaires avances temporaires (Avances achetées avec XP, Annulables bouton -, Recalculées dynamiquement)

## Affichage de l'Historique

**Par catégorie**: Historique affiché par catégories (Caractéristiques liste caractéristiques améliorées avec avances XP, Compétences liste compétences avec avances/acquisition XP, Talents liste talents acquis/rangs achetés avec XP)

**Informations affichées par élément**: Nom (Caractéristique/Compétence/Talent), valeur base (valeur avant achat XP), avances (nombre avances achetées +N), coût (XP dépensé pour cet élément), valeur totale (valeur après avances XP)

**Exemple affichage Charme**: Base 35 Soc, Avances +3, Coût 40 XP (10 + 10 + 10 + 10), Total 38

## Annulation Dépenses

**Annulation dernière dépense bouton -**: Chaque ligne historique possède bouton [-] permettant (Réduire avances temporaires de 1, Recalculer coût XP remboursement, Mettre à jour affichage, Recalculer XP disponible), logique annulation par ordre inverse LIFO Last In First Out (Première annulation = dernière avance achetée), remboursement intégral 100% pas pénalité

**Exemple annulation progressive**: Charme +3 coût 10+10+10 = 30 XP, Clic [-] → Charme +2 remboursement 10 XP, Clic [-] → Charme +1 remboursement 10 XP, Clic [-] → Charme +0 remboursement 10 XP retour état initial

**Annulation complète bouton Annuler**: Bouton global [Annuler] permet (Réinitialiser tous avances temporaires à 0, Rembourser tout XP dépensé, Retourner état initial personnage), confirmation popup confirmation recommandée V2

## Calcul XP Dépensé

**Algorithme refreshXP recalcule dynamiquement**: Logique (Pour chaque catégorie characteristic/skill/talent: Pour chaque élément: Calculer oldValue = avance actuelle - avances temporaires, Calculer newValue = avance actuelle, Appeler getXPCost(elem, oldValue, newValue), Multiplier par 2 si élément hors carrière type "otherXXX", Ajouter au total), Mettre à jour affichage XP disponible XP max - XP dépensé

**Temps réel**: Calcul exécuté après chaque modification clic +/clic -/changement

## Remboursement XP

**Règle 100% remboursement intégral**: Pas pénalité (Annuler avance 25 XP → +25 XP disponibles, Annuler talent 100 XP → +100 XP disponibles), justification mode création = phase test pas pénalité

**Différence création vs post-création**: Création wizard (Remboursement intégral, Annulation libre, Pas validation MJ), post-création V2 recommandé (Remboursement intégral OU avec pénalité option MJ, Annulation possible OU blocage après validation session option MJ, Validation MJ possible)

## Persistance

**Sauvegarde temporaire**: avances temporaires sauvegardés objet character en mémoire pendant session wizard, annulation générale retour état sauvegardé précédent character original sans avances temporaires

**Sauvegarde définitive validation finale**: Lors validation finale step Experience (avances temporaires consolidés dans avances permanentes, XP dépensé ajouté xp.used, XP disponible mis à jour, avances temporaires réinitialisés à 0), post-consolidation avances deviennent permanentes ne peuvent plus être annulées sauf mode post-création avec règles MJ

## Validation Historique

**Contraintes vérification**: Cohérence XP dépensé = somme coûts individuels, budget XP dépensé ≤ XP max création ou pas limite post-création, avances temporaires ≥ 0 pas annulation au-delà 0, recalcul temps réel affichage toujours synchronisé

**Messages erreur**: "Impossible d'annuler: Aucune avance achetée", "Confirmer annulation complète? (remboursement de 150 XP)"

## Relations

**Fichiers liés**: xp-budget.md - Budget XP disponible, xp-validation.md - Validation achats, xp-costs.md - Coûts éléments

**Tables database**: audit/database/characteristics.md, audit/database/skills.md, audit/database/talents.md

## Limites et Contraintes

**Pas historique détaillé V1**: Pas log horodaté chaque action +/- avec timestamp

**Pas export historique**: Pas génération rapport dépenses séquentielles

**Pas comparaison versions**: Pas diff personnage avant/après dépenses XP

**Pas annulation sélective**: Annulation uniquement ordre inverse LIFO, impossible annuler avance milieu sans annuler suivantes

**Pas sauvegarde multiple états**: Un seul état sauvegardé clone(), pas snapshots multiples
