# Wizard Experience - XP Caractéristiques

## Vue d'ensemble

L'amélioration des caractéristiques via XP permet d'augmenter les valeurs de base. Le coût XP est progressif selon la valeur actuelle.

**Référence:** `calculs-xp-progression.md`, `characteristics.md`, `experience-budget.md`

## Coût XP caractéristiques

### Formule progressive (par tranche de 5)

| Niveau | Coût XP/point | Niveau | Coût XP/point |
|--------|---------------|--------|---------------|
| 1-5 | 25 | 36-40 | 150 |
| 6-10 | 30 | 41-45 | 190 |
| 11-15 | 40 | 46-50 | 230 |
| 16-20 | 50 | 51-55 | 280 |
| 21-25 | 70 | 56-60 | 330 |
| 26-30 | 90 | 61-65 | 390 |
| 31-35 | 120 | 66-70 | 450 |

### Calcul du coût

**Logique:** Sommer le coût de chaque point entre valeur actuelle et cible.

**Exemples:**
- Force 0→5: 5 × 25 = 125 XP
- Force 5→10: 5 × 30 = 150 XP
- Force 0→10: 125 + 150 = 275 XP
- Intelligence 25→30: 5 × 90 = 450 XP

## Sélection caractéristique

### En création (type='creation')

**Limitation stricte:** Uniquement les 3 caractéristiques du niveau 1 de carrière.

**Exemple Pamphlétaire niveau 1:**
- CT, Int, Soc (seulement ces 3)

### Post-création (type='final')

**En carrière (coût normal):** Caractéristiques accumulées niveaux atteints.
**Hors carrière (coût ×2):** Toutes les autres.

**Exemple Artisan niveau 2:**
- En carrière: F, E, Dex, Soc
- Hors carrière: CC, CT, I, Ag, Int, FM (×2)

## Avances achetables

### Incréments

**+1 / -1:** Boutons "+/-" pour acheter/vendre 1 point.

**Pas d'option +5/+10:** Joueur clique plusieurs fois.

### Limites

**Maximum théorique:** 70 avances.
**Pratique:** Limité par budget XP et coût exponentiel (0→70 ≈ 8000 XP).

## Calcul valeur finale

### Formule

**Total = Base + Avances**

- **Base:** Espèce + carrière + talents + étoile
- **Avances:** Points achetés XP

**Exemple Nain Artisan:**
- Force base: 30 (espèce) + 5 (carrière) = 35
- Achète +5: 5 × 25 = 125 XP
- Force totale: 40

### Affichage

**Colonnes:** Nom | Base | Aug | Coût | Total

**Exemple:**
- Force | 35 | 5 | 30 | 40

## Historique achats

### Suivi temporaire

**tmpadvance:** Avances temporaires (non validées).

**Comportement:**
- "+": tmpadvance++
- "-": tmpadvance--
- "Annuler": tmpadvance = 0
- "Valider": tmpadvance → permanent

### Calcul coût temps réel

1. oldValue = getAdvance() - tmpadvance
2. newValue = getAdvance()
3. Coût = Helper.getXPCost(elem, oldValue, newValue)
4. XP dépensé += Coût

## Exemples concrets

### Exemple 1: Humain Pamphlétaire (50 XP)

**Caractéristiques:** CT (30), Int (35), Soc (30)

**Options:**
- Int +2: 50 XP → Int 37, Restant: 0
- Soc +1 + CT +1: 50 XP → Restant: 0

### Exemple 2: Elfe Érudit (125 XP)

**Caractéristiques:** Int (45), FM (35), I (40)

**Options:**
- Int +5: 125 XP → Int 50, Restant: 0
- Int +2 (50) + FM +2 (50) + I +1 (25) → Restant: 0

### Exemple 3: Post-création Artisan niveau 2 (500 XP)

**En carrière:** F, E, Dex, Soc

**Option Force +10:**
- F 35→40: 5 × 30 = 150 XP
- F 40→45: 5 × 40 = 200 XP
- Total: 350 XP, Restant: 150

**Hors carrière Int +5 (×2):**
- Int 30→35: 5 × 25 × 2 = 250 XP
- Restant: 250

## Règles métier

### Règle 1: Coût progressif obligatoire

Impossible sauter des niveaux. Payer tous paliers intermédiaires.

### Règle 2: Multiplicateur hors carrière

×2 hors carrière post-création. En création, hors carrière = inaccessible.

### Règle 3: Modification libre

Augmenter/diminuer librement jusqu'à validation.

### Règle 4: Remboursement complet

Réduire avances rembourse intégralement.

## Relations

### Dépendances

**Tables:**
- `characteristics.md` - 18 caractéristiques
- `careerLevels.md` - Caractéristiques carrière
- `species.md` - Valeurs de base

**Règles:**
- `calculs-xp-progression.md` - Formules
- `experience-budget.md` - Budget

### Interactions

**Talents:** Modifient caractéristiques (Costaud +5 E).
**Species:** Valeur base par espèce.
**CareerLevels:** +5 par caractéristique listée.

## Références croisées

**Tables:**
- `audit/database/characteristics.md`
- `audit/database/careerLevels.md`
- `audit/database/species.md`

**Règles:**
- `calculs-xp-progression.md`
- `progression-careerlevels.md`

**Features:**
- `experience-budget.md`
- `experience-validation.md`
