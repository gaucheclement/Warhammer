# Advancement - Validation Achats XP

## Contexte

Le système valide chaque achat XP avant confirmation pour éviter les erreurs et incohérences. Cette validation se fait à plusieurs niveaux.

## Niveaux de Validation

### Validation Temps Réel (Pré-Achat)

**Moment:** Avant d'autoriser le clic sur bouton [+]

**Vérifications:**
1. **Budget suffisant** (mode création uniquement)
2. **Rang maximum** non atteint (talents, caractéristiques)
3. **Spécialisation choisie** (si requise)
4. **Pré-requis satisfaits** (talents chaînés)

**Résultat:** Bouton [+] activé/désactivé

### Validation Post-Achat (Confirmation)

**Moment:** Après le clic sur [+], avant mise à jour

**Vérifications:**
1. **Budget recalculé** (double-check)
2. **Valeur cohérente** (pas de dépassement limites)
3. **Spécialisation confirmée** (popup si nécessaire)

**Résultat:** Achat confirmé ou annulé

### Validation Finale (Step)

**Moment:** Avant validation du step Experience

**Vérifications:**
1. **Budget global** (XP disponible ≥ 0 en création)
2. **Cohérence totale** (somme dépenses = tmp_used)
3. **Aucun élément invalide**

**Résultat:** Step validé ou bloqué

## Contraintes par Type

**Caractéristiques:** Budget, dans/hors carrière (×2), avances ≤70, palier correct
**Compétences:** Budget, dans/hors carrière (×2), spécialisation si groupée, avances ≤70, type Basic/Advanced
**Talents:** Budget, dans/hors carrière (×2), pré-requis, rang séquentiel, rang max, spécialisation si requise
**Sorts:** Talent prérequis, domaine choisi, pas doublon, budget

## Validation Budget

### Mode Création

**Règle stricte:** XP disponible **DOIT être ≥ 0** avant validation step

**Blocages:**
- Bouton [+] désactivé si achat dépasse budget
- Bouton [Valider] désactivé si budget < 0
- Impossible de valider step avec budget négatif

**Calcul:**
```
XP disponible = xp.max - xp.tmp_used
Bouton [+] activé SI: XP disponible - coût_prochain_achat ≥ 0
Bouton [Valider] activé SI: XP disponible ≥ 0
```

### Mode Post-Création

**Règle souple:** XP disponible **peut être < 0** (dette temporaire autorisée)

**Pas de blocage automatique:**
- Bouton [+] toujours activé
- Bouton [Valider] toujours activé
- MJ gère manuellement les dépassements

## Validation Pré-Requis et Spécialisations

**Talents chaînés:** Vérifier prerequisite avant achat (ex: Frénésie → Flagellant)
**Rangs dynamiques:** Max = Bonus Carac (ex: Chanceux max = Bonus Chance)
**Spécialisations:** Popup sélection si champ specs présent et spec vide (compétences/talents)

## Blocages Silencieux (V1)

### Problème Actuel

V1 désactive les boutons **sans message d'explication**:
- Bouton [+] grisé → pourquoi? Budget? Limite? Pré-requis?
- Bouton [Valider] grisé → pourquoi? Budget négatif? Élément invalide?

**Impact UX:** Joueur ne comprend pas pourquoi l'action est bloquée

### Recommandation V2

**Messages explicites:**
- Tooltip sur bouton désactivé
- Message contextuel au survol
- Panneau "Problèmes détectés" listant toutes les violations

## Recalcul Complet

### Fonction refreshXP()

Appelée après **chaque modification** pour recalculer:
1. **XP dépensé total** (tmp_used)
2. **XP disponible** (max - used - tmp_used)
3. **État boutons** (+/- activés/désactivés)
4. **Affichage coûts** (prochaine avance)

**Garantit:** Cohérence en temps réel

## Exemples

**Budget:** XP 100, dépensé 85, achat 25 → 110 > 100 → Bloqué ("Budget insuffisant 15 XP")
**Pré-requis:** Sort Ghur sans talent → Bloqué ("Magie Arcanes Ghur requis")
**Rang max:** Chanceux 3/3 (Bonus Chance 3) → Bloqué ("Rang max atteint 3/3")

## Relations

### Fichiers Liés

- [xp-budget.md](./xp-budget.md) - Budget XP disponible
- [xp-log.md](./xp-log.md) - Historique dépenses
- [cost-characteristics.md](./cost-characteristics.md) - Validation caractéristiques
- [cost-skills-basic.md](./cost-skills-basic.md) - Validation compétences Basic
- [cost-talents.md](./cost-talents.md) - Validation talents
- [experience-validation.md](../wizard/experience-validation.md) - Validation wizard création
