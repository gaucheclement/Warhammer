# Wizard Experience - XP Compétences

## Vue d'ensemble

L'amélioration des compétences via XP permet d'augmenter les avances. Coût progressif, moins cher que caractéristiques.

**Référence:** `calculs-xp-progression.md`, `skills.md`, `experience-budget.md`

## Coût XP compétences

### Formule progressive (par tranche de 5)

| Niveau | Coût | Niveau | Coût |
|--------|------|--------|------|
| 1-5 | 10 | 36-40 | 110 |
| 6-10 | 15 | 41-45 | 140 |
| 11-15 | 20 | 46-50 | 180 |
| 16-20 | 30 | 51-55 | 220 |
| 21-25 | 40 | 56-60 | 270 |
| 26-30 | 60 | 61-65 | 320 |
| 31-35 | 80 | 66-70 | 380 |

**Exemples:**
- 0→5: 50 XP, 5→10: 75 XP, 0→10: 125 XP

## Types compétences

### Basic vs Advanced

**Basic:** Valeur initiale = Caractéristique liée (ex: Athlétisme).
**Advanced:** Valeur initiale = 0, acquisition = 1ère avance (ex: Langue).

**Note:** Coût XP identique.

### Compétences groupées

**Spécialisation obligatoire:** Art, Métier, Langue, etc.

Chaque spécialisation = compétence indépendante.

## Sélection

### En création (type='creation')

**Limitation:** Uniquement 8 compétences niveau 1 carrière.

**Exemple Pamphlétaire:** Art (Écriture), Calme, Charme, Commandement, Commérage, Intuition, Résistance, Savoir (Loi)

### Post-création (type='final')

**En carrière (coût normal):** Compétences accumulées.
**Hors carrière (coût ×2):** Basic uniquement (Advanced nécessite talent).

## Acquisition nouvelle compétence

### Première avance

**Processus:**
1. Sélectionner compétence (popup si groupée)
2. Acheter première avance (10 XP)

**Exemple Langue (Bretonnien):**
- Choix spécialisation: "Bretonnien"
- Coût: 10 XP, Valeur: 1

## Avances supplémentaires

**Incréments:** +1/-1 via boutons.

**Calcul:** Total = Caractéristique + Avances

**Exemple Nain Athlétisme:**
- Ag: 25, Avances carrière: 5, Achète +10: 125 XP
- Total: 40

## Historique achats

**tmpadvance:** Avances temporaires.

**Coût temps réel:**
1. oldValue = getAdvance() - tmpadvance
2. newValue = getAdvance()
3. Coût = Helper.getXPCost × (hors carrière ? 2 : 1)

## Exemples

### Exemple 1: Pamphlétaire (50 XP)

**Options:**
- Art (Écriture) +5: 50 XP
- Calme +2 (20) + Charme +3 (30)

### Exemple 2: Elfe Érudit (125 XP)

**Options:**
- Érudition +5 (50) + Langue +5 (50) + Alphabet +2 (20) → Restant: 5

### Exemple 3: Artisan niveau 2 (500 XP)

**En carrière Métier (Forgeron) +20:**
- 0→5: 50, 6→10: 75, 11→15: 100, 16→20: 150
- Total: 375 XP

**Hors carrière Athlétisme +10 (×2):**
- 125 × 2 = 250 XP

## Règles métier

### Règle 1: Basic accessibles

Création: carrière uniquement. Post: Basic hors carrière (×2).

### Règle 2: Advanced nécessite talent

Advanced hors carrière = talent addSkill requis.

### Règle 3: Spécialisation définitive

Une fois choisie, non modifiable.

### Règle 4: Indépendance spécialisations

Art (Peinture) ≠ Art (Musique).

## Relations

### Dépendances

**Tables:** `skills.md`, `careerLevels.md`, `characteristics.md`
**Règles:** `calculs-xp-progression.md`, `skills-specialisations.md`

### Interactions

**Talents:** addSkill ajoute compétences.
**Species:** +3/+5 avances initiales.
**CareerLevels:** Liste compétences.

## Références croisées

**Tables:**
- `audit/database/skills.md`
- `audit/database/careerLevels.md`

**Règles:**
- `calculs-xp-progression.md`
- `skills-specialisations.md`

**Features:**
- `experience-budget.md`
- `experience-validation.md`
