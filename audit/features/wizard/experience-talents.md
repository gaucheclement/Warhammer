# Wizard Experience - XP Talents

## Vue d'ensemble

L'acquisition de talents via XP suit une formule fixe (rang × 100 XP). Les talents peuvent avoir plusieurs rangs selon leur type.

**Référence:** `calculs-xp-progression.md`, `talents.md`, `experience-budget.md`

## Coût XP talents

### Formule fixe

**Coût = Rang × 100 XP**

| Rang | Coût XP |
|------|---------|
| 1 | 100 XP |
| 2 | 200 XP |
| 3 | 300 XP |
| 4 | 400 XP |

**Note:** Coût cumulatif total pour atteindre rang N = (1+2+...+N) × 100.

**Exemples cumulatifs:**
- Rang 1: 100 XP total
- Rang 2: 300 XP total (100+200)
- Rang 3: 600 XP total (100+200+300)

### Exception Magie du Chaos

**Magie du Chaos:** Coût fixe 100 XP quel que soit le rang (anomalie historique).

## Sélection talent

### En création (type='creation')

**Limitation:** Uniquement 4 talents niveau 1 carrière.

**Exemple Pamphlétaire niveau 1:**
- Éloquence, Étiquette, Lisez et écrivez, Sociable

### Post-création (type='final')

**En carrière (coût normal):** Talents accumulés niveaux atteints.
**Hors carrière (coût ×2):** Tous les autres talents.

**Exemple Artisan niveau 2:**
- En carrière: 8 talents (4 niveau 1 + 4 niveau 2)
- Hors carrière: Tous autres talents (×2)

## Rangs supplémentaires

### Types de rangs

**Unique (max 1):** Majorité des talents (ex: Éloquence).
**Fixes (max 2-4):** Rang max défini (ex: Artiste max 3).
**Dynamiques:** Max = formule (ex: Costaud max "Bonus End").
**Illimités:** Pas de max (très rare).

### Acquisition rangs

**Processus:**
1. Acheter rang 1 (100 XP)
2. Si max pas atteint, acheter rang 2 (200 XP)
3. Continuer jusqu'à max

**Exemple Costaud (max Bonus End = 3):**
- Rang 1: 100 XP
- Rang 2: 200 XP
- Rang 3: 300 XP
- Rang 4+: Impossible (max atteint)

## Validation pré-requis

### Talents chaînés

**addTalent:** Certains talents débloquent d'autres talents.

**Exemple Flagellant → Frénésie:**
- Posséder Flagellant = prérequis pour Frénésie
- Sans Flagellant, Frénésie inaccessible

**Note:** Validation automatique, bouton "+" désactivé si prérequis absent.

### Spécialisations

**Talents avec specs:** Nécessitent choix spécialisation.

**Exemple Artiste:**
- Popup: Choisir spécialisation (Art, Danse, Musique...)
- Chaque spé = talent indépendant

## Historique achats

**tmpadvance:** Rangs temporaires.

**Comportement:**
- "+": Acheter rang suivant (rang × 100 XP)
- "-": Vendre rang actuel (remboursement)
- "Annuler": tmpadvance = 0
- "Valider": tmpadvance → permanent

### Calcul coût

**Logique:**
- oldValue = getAdvance() - tmpadvance
- newValue = getAdvance()
- Coût = newValue × 100 (sauf Magie Chaos = 100 fixe)

## Exemples

### Exemple 1: Pamphlétaire (50 XP)

**Budget insuffisant** pour talent (min 100 XP).

**Alternative:** Dépenser sur compétences/caractéristiques.

### Exemple 2: Elfe Érudit (125 XP)

**Talents:** Calme, Étiquette, Lisez et écrivez, Sociable

**Option:**
- Calme rang 1: 100 XP → Restant: 25 XP

### Exemple 3: Post-création Artisan niveau 2 (500 XP)

**En carrière:** 8 talents

**Option Artisan (Forgeron) rang 3:**
- Rang 1: 100 XP
- Rang 2: 200 XP
- Rang 3: 300 XP (si max ≥ 3)
- Total: 600 XP (budget insuffisant)

**Option Alternative:**
- Costaud rang 1 (100) + Dur à cuire rang 1 (100) → Restant: 300 XP

**Hors carrière Ambidextre (×2):**
- Rang 1: 100 × 2 = 200 XP

## Règles métier

### Règle 1: Coût fixe par rang

Contrairement compétences/caractéristiques, coût = rang × 100 (pas progressif par palier).

### Règle 2: Rang séquentiel

Impossible acheter rang 3 sans posséder rang 1 et 2.

### Règle 3: Maximum respecté

Bouton "+" désactivé si rang max atteint.

### Règle 4: Prérequis bloquants

addTalent vérifié avant autoriser achat.

## Relations

### Dépendances

**Tables:** `talents.md`, `careerLevels.md`
**Règles:** `calculs-xp-progression.md`, `talents-rangs-multiples.md`

### Interactions

**Species:** Certaines espèces octroient talents gratuits.
**Stars:** Étoile du Sorcier octroie talent gratuit.
**CareerLevels:** Liste talents par niveau.
**addTalent:** Talents débloquent talents.

## Références croisées

**Tables:**
- `audit/database/talents.md`
- `audit/database/careerLevels.md`

**Règles:**
- `calculs-xp-progression.md`
- `talents-rangs-multiples.md`
- `talents-specialisations.md`
- `talents-deblocage-talents.md`

**Features:**
- `experience-budget.md`
- `experience-validation.md`
