# Validation Achats XP

## Objectif

Système valide chaque achat XP avant confirmation pour éviter erreurs et incohérences. Validation plusieurs niveaux temps réel, post-achat, finale.

## Niveaux de Validation

**Validation temps réel pré-achat**: Moment avant autoriser clic bouton [+], vérifications (Budget suffisant mode création uniquement, Rang maximum non atteint talents/caractéristiques, Spécialisation choisie si requise, Pré-requis satisfaits talents chaînés), résultat bouton [+] activé/désactivé

**Validation post-achat confirmation**: Moment après clic [+] avant mise à jour, vérifications (Budget recalculé double-check, Valeur cohérente pas dépassement limites, Spécialisation confirmée popup si nécessaire), résultat achat confirmé ou annulé

**Validation finale step**: Moment avant validation step Experience, vérifications (Budget global XP disponible ≥ 0 en création, Cohérence totale somme dépenses = XP temporaire, Aucun élément invalide), résultat step validé ou bloqué

## Contraintes par Type

**Caractéristiques**: Budget, dans/hors carrière ×2, avances ≤70, palier correct

**Compétences**: Budget, dans/hors carrière ×2, spécialisation si groupée, avances ≤70, type Basic/Advanced

**Talents**: Budget, dans/hors carrière ×2, pré-requis, rang séquentiel, rang max, spécialisation si requise

**Sorts**: Talent prérequis, domaine choisi, pas doublon, budget

## Validation Budget

**Mode création règle stricte**: XP disponible DOIT être ≥ 0 avant validation step, blocages (Bouton [+] désactivé si achat dépasse budget, Bouton [Valider] désactivé si budget < 0, Impossible valider step avec budget négatif), calcul (XP disponible = xp.max - xp.XP temporaire, Bouton [+] activé SI XP disponible - coût_prochain_achat ≥ 0, Bouton [Valider] activé SI XP disponible ≥ 0)

**Mode post-création règle souple**: XP disponible peut être < 0 dette temporaire autorisée, pas blocage automatique (Bouton [+] toujours activé, Bouton [Valider] toujours activé, MJ gère manuellement dépassements)

## Validation Pré-Requis et Spécialisations

**Talents chaînés**: Vérifier prerequisite avant achat (ex: Frénésie → Flagellant)

**Rangs dynamiques**: Max = Bonus Carac (ex: Chanceux max = Bonus Chance)

**Spécialisations**: Popup sélection si champ specs présent et spec vide (compétences/talents groupés nécessitent choix spécialisation avant achat)

## Recalcul Complet

**Fonction refreshXP**: Appelée après chaque modification pour recalculer (XP dépensé total XP temporaire, XP disponible max - used - XP temporaire, État boutons +/- activés/désactivés, Affichage coûts prochaine avance), garantit cohérence en temps réel

**Algorithme recalcul XP dépensé**: Pour chaque catégorie (Caractéristiques somme coûts paliers × multiplicateur carrière, Compétences somme coûts acquisition + avances × multiplicateur carrière, Talents somme coûts rangs × multiplicateur carrière), multiplicateur carrière (Élément dans carrière × 1, Élément hors carrière × 2)

## Blocages Silencieux

**Problème actuel**: Boutons désactivés sans message explication (Bouton [+] grisé → pourquoi Budget/Limite/Pré-requis, Bouton [Valider] grisé → pourquoi Budget négatif/Élément invalide), impact UX joueur ne comprend pas pourquoi action bloquée

**Améliorations possibles**: Tooltip sur bouton désactivé, message contextuel au survol, panneau "Problèmes détectés" listant toutes violations

## Exemples Validation

**Budget insuffisant**: XP 100, dépensé 85, achat 25 → 110 > 100 → Bloqué message "Budget insuffisant 15 XP disponibles, 25 XP nécessaires"

**Pré-requis manquant**: Sort Ghur sans talent → Bloqué message "Magie Arcanes (Ghur) requis"

**Rang max atteint**: Chanceux 3/3 Bonus Chance 3 → Bloqué message "Rang maximum atteint 3/3 Bonus Chance = 3"

**Spécialisation requise**: Clic [+] Métier sans spec → Popup sélection obligatoire (Forgeron, Cuisinier, Apothicaire, etc.)

**Acquisition Advanced requise**: Avances Langue Bretonnien sans acquisition → Bloqué message "Compétence non acquise: Acquisition requise 20 XP"

## Messages d'Erreur Recommandés

**Budget**: "Budget XP insuffisant (25 XP nécessaires, 10 XP disponibles)", "Validation bloquée: XP disponible négatif (-15 XP)"

**Pré-requis**: "Pré-requis manquant: Sens de la magie requis pour Magie des Arcanes", "Acquérir rang 1 avant rang 2"

**Rang maximum**: "Rang maximum atteint (3/3): Bonus Chance = 3", "Avances maximum atteintes (+70)"

**Spécialisation**: "Spécialisation requise: Choisissez un type d'arme pour Maîtrise", "Spécialisation requise: Choisissez une langue pour Langue"

**Hors carrière**: "Compétence hors carrière: coût × 2 (40 XP au lieu de 20 XP)", "Élément hors carrière: Coût × 2 (100 XP au lieu de 50 XP)"

## Relations

**Fichiers liés**: xp-budget.md - Budget XP disponible, xp-log.md - Historique dépenses, xp-costs.md - Validation coûts, xp-career.md - Restrictions carrière

**Tables database**: Toutes tables database pour validation schémas

## Limites et Contraintes

**Blocages silencieux**: Pas messages explicites pourquoi action bloquée

**Pas validation exhaustive**: Règles métier complexes non vérifiées temps réel

**Pas panneau récapitulatif problèmes**: Pas liste centralisée toutes violations détectées

**Validation côté client limitée**: Validation basique HTML5 required, pas calculs JS complexes
