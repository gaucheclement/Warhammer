# Wizard Experience - Récapitulatif

## Vue d'ensemble

Le récapitulatif des dépenses XP présente les totaux par catégorie et le budget restant. Il aide le joueur à optimiser l'allocation de ses points.

**Référence:** `experience-budget.md`, `experience-history.md`, `experience-validation.md`

## Total XP dépensé par catégorie

### Calcul par catégorie

**Algorithme refreshXP():**
- Itère toutes les catégories (characteristic, skill, talent)
- Pour chaque élément avec tmpadvance > 0:
  - Calcule coût: Helper.getXPCost(elem, oldValue, newValue)
  - Applique multiplicateur (×2 hors carrière)
  - Cumule dans total catégorie

**Limitation V1:** Calcul interne uniquement, pas d'affichage séparé par catégorie.

### Structure des catégories

**1. Caractéristiques:**
- En carrière: Coût standard
- Hors carrière: Coût × 2

**2. Compétences:**
- En carrière: Coût standard
- Hors carrière (Basic): Coût × 2
- Hors carrière (Advanced): Nécessite talent addSkill

**3. Talents:**
- En carrière: Coût standard (rang × 100 XP)
- Hors carrière: Coût × 2

## XP restant disponible

### Calcul temps réel

**Formule:** XP restant = character.xp.max - character.xp.tmp_used

**Mise à jour:** Instantanée après chaque clic +/-

**Affichage:** `[XP restant] Points d'Expérience à dépenser`

### Indicateurs visuels

**XP positif (ex: 25):**
- Affichage normal
- Achats possibles

**XP négatif (ex: -10):**
- Affichage: "-10 Points d'Expérience à dépenser"
- Bouton "Valider" désactivé (création)
- Bouton "+" désactivé pour nouveaux achats

**XP = 0:**
- Budget épuisé
- Validation possible (création)
- Nouveaux achats bloqués

## Statistiques dépenses

### Données disponibles

**Par élément:**
- Nom
- Valeur base
- Avances temporaires (tmpadvance)
- Coût prochain achat
- Valeur totale

**Globales:**
- XP max (budget total)
- XP tmp_used (dépensé session)
- XP restant (max - tmp_used)

### Analyse de répartition

**V1 limité:** Pas d'analyse statistique détaillée.

**Données implicites:**
- Joueur peut compter manuellement achats par catégorie
- Tables affichent coûts individuels (colonne jaune)

**Calcul mental nécessaire:** Somme coûts caractéristiques, compétences, talents.

## Graphique ou tableau récapitulatif

### Limitations V1

**Pas de tableau récapitulatif dédié.**

**Affichage disponible:**
1. En-tête: XP restant
2. Trois sections séparées:
   - Caractéristiques (tableau)
   - Talents (tableau)
   - Compétences (tableau)

**Format tableaux:** Nom | Base | Aug | Coût | Total

### Organisation visuelle

**Structure:**
- Panneau gauche: Sections en carrière (création et post-création)
- Panneau droit: Sections hors carrière (post-création uniquement)

**Séparation claire:** Coût normal vs coût ×2 visible par position.

## Exemples

### Exemple 1: Création simple (50 XP)

**Pamphlétaire Humain:**
- Intelligence +2: 50 XP → Total caractéristiques: 50 XP
- Compétences: 0 XP, Talents: 0 XP
- XP restant: 0

### Exemple 2: Post-création complexe (500 XP)

**Artisan Nain niveau 2:**

**En carrière:**
- Force +10: 350 XP, Métier (Forgeron) +10: 125 XP

**Hors carrière:**
- Athlétisme +1: 20 XP (10×2)

**Récapitulatif:**
- Caractéristiques: 350 XP
- Compétences: 145 XP (125 + 20)
- Talents: 0 XP
- Total: 495 XP, Restant: 5 XP

## Règles métier

### Règle 1: Pas de breakdown automatique

V1 ne calcule pas totaux par catégorie séparément. Total global uniquement.

### Règle 2: Rafraîchissement temps réel

Chaque modification met à jour XP restant instantanément.

### Règle 3: Visibilité coûts individuels

Chaque ligne affiche coût prochain achat (jaune), permettant estimation manuelle.

### Règle 4: Optimisation joueur

Joueur compare coûts caractéristiques vs compétences vs talents pour maximiser impact.

## Relations

### Dépendances

**Features:**
- `experience-budget.md` - Budget total
- `experience-characteristics.md` - Dépenses caractéristiques
- `experience-skills.md` - Dépenses compétences
- `experience-talents.md` - Dépenses talents
- `experience-history.md` - Suivi achats
- `experience-validation.md` - Vérification budget

**Règles:**
- `calculs-xp-progression.md` - Formules coûts

### Interactions

**Résumé global:** `resume-display.md` présente XP totale (actuelle + dépensée).

**Validation:** `resume-validation.md` vérifie cohérence XP totale.

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
- `experience-validation.md`
- `resume-display.md`
- `resume-validation.md`
