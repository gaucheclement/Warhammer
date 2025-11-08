# Wizard Experience - Validation Budget

## Vue d'ensemble

La validation du budget XP garantit que les dépenses n'excèdent pas le budget disponible en création. En post-création, la validation est permissive.

**Référence:** `experience-budget.md`, `experience-history.md`

## Calcul XP total dépensé

### Algorithme de calcul

**Fonction refreshXP():**
1. Initialiser used = 0
2. Itérer toutes catégories (tab[type])
3. Pour chaque élément:
   - oldValue = getAdvance() - tmpadvance
   - newValue = getAdvance()
   - cost = Helper.getXPCost(elem, oldValue, newValue)
   - multiplicateur = type.startsWith('other') ? 2 : 1
   - used += cost × multiplicateur
4. Retourner used

**Stockage:** character.xp.tmp_used = used

### Catégories incluses

**En création (type='creation'):**
- Caractéristiques carrière (3)
- Talents carrière (4)
- Compétences carrière (8)

**Post-création (type='final'):**
- Caractéristiques en carrière
- Caractéristiques hors carrière (×2)
- Compétences en carrière
- Compétences hors carrière (×2)
- Talents en carrière
- Talents hors carrière (×2)

## Comparaison avec budget

### Budget disponible

**Sources XP:**
- character.xp.max: Total XP accumulé (espèce + carrière + étoile)

**XP restant:** character.xp.max - character.xp.tmp_used

**Affichage:** `[XP restant] Points d'Expérience à dépenser`

### Règles de comparaison

**En création:**
- Si XP restant < 0 → Budget dépassé (bloquant)
- Si XP restant ≥ 0 → Budget respecté

**Post-création:**
- Budget indicatif uniquement (pas de blocage)
- MJ gère dette XP manuellement

## Blocage si budget dépassé

### Mécanisme de blocage

**Bouton "Valider":**
- Création: disabled si XP restant < 0
- Post-création: Toujours activé

**Bouton "+" (achat):**
- Création: disabled si used + cost > xp.max
- Post-création: Toujours activé

### Cas particuliers

**Maximum atteint:**
- Bouton "+" désactivé si élément atteint max (getMax())
- Indépendant du budget XP

**Exemple:**
- Caractéristique 70 avances → Bouton "+" désactivé
- Talent rang max 3 atteint → Bouton "+" désactivé

## Messages d'erreur

### V1: Blocages silencieux

**Pas de messages texte explicites.**

**Feedback visuel uniquement:**
- Bouton "Valider" grisé (disabled)
- Bouton "+" grisé par élément
- XP restant affiché (peut être négatif, mais validation bloquée)

**Exemple XP restant négatif:**
- Budget: 50 XP
- Dépensé: 75 XP
- Affichage: "-25 Points d'Expérience à dépenser"
- Bouton "Valider": Désactivé

### Feedback utilisateur

**Compréhension implicite:**
- Joueur voit XP restant négatif → Comprend dépassement
- Boutons grisés → Indication visuelle claire

**Limitation:** Pas de texte "Budget dépassé de X XP".

## Exemples

### Exemple 1: Budget respecté (50 XP)

**Actions:**
1. Intelligence +2: 50 XP → XP restant: 0
2. Bouton "Valider": Activé (budget OK)

**Validation:** Autorisée.

### Exemple 2: Budget dépassé (50 XP)

**Actions:**
1. Intelligence +2: 50 XP → XP restant: 0
2. Tenter Calme +1: Bouton "+" désactivé (coût 10, dépasserait budget)

**Blocage:** Bouton "+" grisé, impossible achat supplémentaire.

### Exemple 3: XP négatif affiché (50 XP)

**Actions:**
1. Intelligence +2 (50), Calme +2 (20) → XP dépensé: 70
2. Affichage: "-20 Points d'Expérience à dépenser"
3. Bouton "Valider": Désactivé
4. Annuler Calme -2 → XP restant: 0
5. Bouton "Valider": Activé

### Exemple 4: Post-création permissif (500 XP)

**Actions:**
1. Dépenser 700 XP (Force +20, Métier +30, Talents multiples)
2. XP restant: -200
3. Bouton "Valider": Activé (pas de blocage)

**Justification:** MJ gère dette XP entre sessions.

## Règles métier

### Règle 1: Création stricte, post-création souple

En création, budget = limite absolue. Post-création, budget = indicatif.

### Règle 2: Validation temps réel

Chaque clic +/- recalcule used et met à jour boutons.

### Règle 3: Prévention achat

Bouton "+" désactivé AVANT dépassement (pas après correction).

### Règle 4: Annulation libre

Bouton "-" toujours possible si tmpadvance > 0 (remboursement XP).

## Relations

### Dépendances

**Features:**
- `experience-budget.md` - Sources XP
- `experience-characteristics.md` - Coûts
- `experience-skills.md` - Coûts
- `experience-talents.md` - Coûts
- `experience-history.md` - Suivi dépenses

**Règles:**
- `calculs-xp-progression.md` - Formules coûts

### Interactions

**Validation globale:** Résumé vérifie XP totale cohérente (voir `resume-validation.md`).

**Sauvegarde:** Budget figé après validation wizard.

## Références croisées

**Tables:**
- `audit/database/species.md` - Bonus XP
- `audit/database/careers.md` - Bonus XP
- `audit/database/stars.md` - Bonus XP

**Règles:**
- `calculs-xp-progression.md`

**Features:**
- `experience-budget.md`
- `experience-history.md`
- `experience-summary.md`
- `resume-validation.md`
