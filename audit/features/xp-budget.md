# Budget XP et Récapitulatif

## Objectif

Système suit budget XP disponible pour permettre joueurs dépenser points expérience de manière contrôlée avec vue d'ensemble dépenses par catégorie.

## Structure du Budget XP

**Champs character.xp**: xp.max (XP total gagné sources multiples), xp.used (XP déjà dépensé consolidé), xp.tmp_used (XP dépensé temporairement session actuelle annulable)

**XP disponible = xp.max - xp.used - xp.tmp_used**

## Sources XP

**En création**: Espèce aléatoire +50 XP premier tirage/+25 XP second tirage, Carrière aléatoire +50 XP premier tirage/+25 XP second tirage, Étoile aléatoire +25 XP, total typique 0-200 XP

**En post-création**: Récompenses MJ (aventures, roleplay, défaites ennemis), milestones narratifs, progression sessions, total variable 0-10000+ XP campagnes longues

## Affichage Budget

**Affichage temps réel**: Budget XP affiché temps réel pendant phase Experience, format [150] Points d'Expérience à dépenser, nombre mis à jour après chaque modification (Clic [+] XP diminue, Clic [-] XP augmente, Changement valeur recalcul complet)

**Couleurs V2 recommandé**: Vert XP disponible > 0, Orange XP disponible = 0, Rouge XP disponible < 0 (mode création bloqué, post-création autorisé)

## Gestion du Budget

**Mode création wizard blocage strict**: Bouton [+] désactivé si achat ferait dépasser budget, bouton [Valider] désactivé si XP disponible < 0, impossible valider avec budget négatif, logique disabled = (xp.max - xp.tmp_used - coût_prochain_achat) < 0

**Mode post-création souplesse**: Bouton [+] toujours activé pas blocage, budget peut devenir négatif dette XP temporaire, MJ peut autoriser "dépenses futures", MJ gère manuellement dépassements (V2 option "dette XP autorisée")

## Calcul XP Dépensé

**Algorithme recalcul dynamique tmp_used**: Pour chaque catégorie (Caractéristiques somme coûts paliers × multiplicateur carrière, Compétences somme coûts acquisition + avances × multiplicateur carrière, Talents somme coûts rangs × multiplicateur carrière), multiplicateur carrière (Élément dans carrière × 1, Élément hors carrière × 2)

**Exemple calcul**: Soc +3 dans: 25+25+25 = 75 XP, End +2 hors: (25+25) × 2 = 100 XP, Charme +5 dans: 10+10+10+10+10 = 50 XP, Affable dans: 100 XP = Total 325 XP

## Ajout XP Post-Création

**Méthode character.addXP**: Signature character.addXP(source, amount, permanent), paramètres (source raison attribution "Aventure terminée"/"Roleplay exceptionnel", amount montant XP positif, permanent true ajouté xp.max/false temporaire)

**Exemple**: character.addXP("Aventure: Temple maudit", 250, true) → xp.max += 250

**Historique gains XP**: Système peut stocker log gains traçabilité (Date gain, Source gain, Montant gain, XP max après gain), affichage onglet "Expérience" character sheet

## Récapitulatif XP

**Total par catégorie calcul automatique**: Système calcule automatiquement XP dépensé par catégorie (Caractéristiques somme coûts toutes caractéristiques améliorées, Compétences somme coûts toutes compétences acquisition + avances, Talents somme coûts tous talents tous rangs, Sorts somme coûts tous sorts appris si applicable), total général somme 4 catégories

**Affichage format**: Caractéristiques: 150 XP (3 améliorées), Compétences: 85 XP (5 acquises/améliorées), Talents: 200 XP (2 acquis), Sorts: 100 XP (3 appris), séparateur, Total dépensé: 535 XP, XP restant: 65 XP

**Statistiques dépenses par élément V1**: Pas breakdown détaillé par élément individuel

**Statistiques V2 recommandé**: Liste détaillée avec coût par élément, tri par coût éléments plus chers en premier, filtrage par catégorie, exemple (Sociabilité +6: 155 XP, Affable rang 1: 100 XP, Charme +5: 50 XP, Intelligence +3: 75 XP, Éloquent rang 1: 100 XP)

**Statistiques par type dans/hors carrière**: XP dépensé dans carrière XXX XP, XP dépensé hors carrière ×2 XXX XP, ratio optimisation X%, utilité identifier dépenses sous-optimales trop hors carrière

**Graphiques V2**: Camembert catégories (Répartition XP par catégorie Caractéristiques 28%/Compétences 16%/Talents 37%/Sorts 19%, visuel graphique camembert pie chart ou barres), courbe progression (Évolution XP dans temps Axe X Sessions/Temps Axe Y XP total, courbes XP gagné/XP dépensé/XP disponible, visuel graphique ligne temporelle)

**Export rapport**: Formats export (TXT/MD rapport texte détails dépenses par catégorie, CSV tableau analyse Type/Nom/Avances/Coût/Dans Carrière, PDF V2 rapport formaté avec graphiques archivage/partage MJ)

**Organisation visuelle V1**: Affichage inline dans step Experience pas panneau dédié

**Organisation V2 recommandé**: Panneaux (Panneau gauche budget et contrôles, Panneau central listes achat, Panneau droit récapitulatif temps réel), avantage vision permanente répartition XP pendant achats, alternative onglet récapitulatif (Onglet dédié "Récapitulatif XP" comme wizard Resume, contenu statistiques complètes/graphiques/export/historique gains XP sources)

## Optimisation Joueur

**Comparaison coûts**: Récapitulatif aide comparer coûts pour optimiser dépenses, scénario (Soc +1 dans carrière 25 XP, End +1 hors carrière 50 XP, Talent Dur à cuire hors carrière 200 XP), analyse privilégier Soc +1 meilleur ratio efficacité/coût

**Recommandations V2**: Alertes dépenses hors carrière 40% ×2, suggestions progression niveau

**Sources XP historique**: Liste gains espèce/carrière/étoile/aventures avec totaux

## Validation Budget

**Contraintes mode création**: XP disponible ≥ 0 avant validation step, budget initial cohérent sources XP correctes, pas dépassement autorisé

**Contraintes mode post-création**: XP disponible peut être négatif dette temporaire, MJ valide dépassements option, traçabilité gains/dépenses

**Messages erreur**: "Budget XP insuffisant (25 XP nécessaires, 10 XP disponibles)", "Validation bloquée: XP disponible négatif (-15 XP)", "Dette XP: -50 XP (à rembourser avec prochains gains)"

**Validation cohérence**: Vérifications (Somme catégories = Total dépensé, Total dépensé = character.xp.tmp_used ou xp.used, XP restant = xp.max - total dépensé, Aucun élément négatif), messages incohérence V2 ("Incohérence détectée: Somme catégories ≠ Total (recalcul en cours)")

## Exemples Concrets

**Exemple 1 création Humain Agitateur**: Budget initial (Espèce Humain 0 XP choix direct, Carrière Agitateur +50 XP premier tirage, Étoile +25 XP = Total 75 XP), dépenses (Soc +3: 75 XP = Restant 0 XP budget épuisé)

**Exemple 2 post-création aventure complète**: Budget avant aventure 50 XP disponible (375 max - 325 used), gains (Aventure terminée +200 XP, Roleplay +50 XP = Nouveau budget 300 XP disponible 625 max - 325 used), dépenses (Passage carrière niveau 2 complétion + nouveaux avantages = Coût estimé ~250 XP)

## Relations

**Fichiers liés**: xp-log.md - Historique dépenses détaillé, xp-validation.md - Validation achats, xp-costs.md - Coûts éléments

**Tables database**: Aucune logique pure

## Limites et Contraintes

**Pas breakdown détaillé V1**: Pas liste coût par élément individuel

**Pas graphiques V1**: Pas visualisation répartition

**Pas export rapport V1**: Pas génération fichiers analyse

**Pas détection optimisation**: Pas alertes dépenses sous-optimales hors carrière

**Pas historique gains traçable**: Pas log sources XP consultable
