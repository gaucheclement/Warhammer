# Calculs des Coûts XP de Progression

## Vue d'ensemble

Les Points d'Expérience (PX/XP) permettent d'améliorer le personnage entre les aventures. Les coûts varient selon le type d'élément (skill/characteristic/talent) et le niveau atteint.

**Règle multiplicateur:** Améliorer des éléments hors carrière coûte 2× le prix normal.

**Référence:** `progression-careerlevels.md`, `accumulation-avantages-careerlevels.md`

## Coûts par type

### Skills (Compétences)

**Formule:** Coût par palier de 5 niveaux, progressif.

| Niveau atteint | Coût XP |
|----------------|---------|
| 1-5 | 10 XP |
| 6-10 | 15 XP |
| 11-15 | 20 XP |
| 16-20 | 30 XP |
| 21-25 | 40 XP |
| 26-30 | 60 XP |
| 31-35 | 80 XP |
| 36-40 | 110 XP |
| 41-45 | 140 XP |
| 46-50 | 180 XP |
| 51-55 | 220 XP |
| 56-60 | 270 XP |
| 61-65 | 320 XP |
| 66-70 | 380 XP |

**Exemple:** Améliorer une skill de 0 à 10
- 0 → 1-5: 5 × 10 = 50 XP
- 6 → 10: 5 × 15 = 75 XP
- **Total:** 125 XP

**Exemple:** Améliorer une skill de 15 à 20
- 16 → 20: 5 × 30 = 150 XP

### Characteristics (Caractéristiques)

**Formule:** Coût par palier de 5 niveaux, progressif (plus cher que skills).

| Niveau atteint | Coût XP |
|----------------|---------|
| 1-5 | 25 XP |
| 6-10 | 30 XP |
| 11-15 | 40 XP |
| 16-20 | 50 XP |
| 21-25 | 70 XP |
| 26-30 | 90 XP |
| 31-35 | 120 XP |
| 36-40 | 150 XP |
| 41-45 | 190 XP |
| 46-50 | 230 XP |
| 51-55 | 280 XP |
| 56-60 | 330 XP |
| 61-65 | 390 XP |
| 66-70 | 450 XP |

**Exemple:** Améliorer Force de 0 à 10
- 0 → 1-5: 5 × 25 = 125 XP
- 6 → 10: 5 × 30 = 150 XP
- **Total:** 275 XP

### Talents

**Formule:** Rang × 100 XP

**Calcul:** Pour acquérir le talent au rang N, coût = N × 100 XP.

| Rang | Coût XP |
|------|---------|
| 1 | 100 XP |
| 2 | 200 XP |
| 3 | 300 XP |
| 4 | 400 XP |

**Exemple:** Acquérir "Costaud" rang 1 = 100 XP

**Exemple talents multiples:**
- Acquérir "Costaud" rang 1: 100 XP
- Acquérir "Costaud" rang 2: 200 XP (supplémentaires)
- Acquérir "Costaud" rang 3: 300 XP (supplémentaires)
- **Total pour rang 3:** 600 XP

**Exception Magie du Chaos:** Coût fixe 100 XP quel que soit le rang.

## En carrière vs Hors carrière

### En carrière (coût normal)

**Définition:** Éléments listés dans le niveau de carrière actuel.

**Coût:** Formules standard ci-dessus.

**Exemple Pamphlétaire niveau 1:**
- Characteristics en carrière: Capacité de Tir, Intelligence, Sociabilité
- Skills en carrière: Les 8 skills du niveau 1
- Talents en carrière: Les 4 talents du niveau 1

**Amélioration CT 0→5:** 5 × 25 = 125 XP (coût normal)

### Hors carrière (coût ×2)

**Définition:** Éléments NON listés dans le niveau de carrière actuel.

**Coût:** Formule standard × 2.

**Exemple Pamphlétaire niveau 1:**
- Characteristics hors carrière: Force, Endurance, Dextérité, etc.
- Skills hors carrière: Tous skills non listés au niveau 1

**Amélioration Force 0→5:** 5 × 25 × 2 = 250 XP (coût double)

### Accumulation et carrière

**Important:** Le personnage accumule les éléments de TOUS les niveaux atteints.

**Exemple Artisan niveau 2:**
- En carrière: Characteristics niveaux 1-2 (Force, Endurance, Dextérité, Sociabilité), Skills niveaux 1-2 (14 skills), Talents niveaux 1-2 (8 talents)
- Coût normal pour améliorer ces 4 characteristics + 14 skills + 8 talents
- Coût double pour tout le reste

## Progression de niveau

### Coût pour atteindre un niveau

**Règle:** Pour progresser au niveau suivant, le personnage doit acquérir TOUS les éléments du nouveau niveau.

**Artisan niveau 1 → niveau 2:**
- Acquérir Sociabilité (characteristic niveau 2): 125 XP (0→5)
- Acquérir 6 skills niveau 2: Variable selon skills
- Acquérir 4 talents niveau 2: 4 × 100 = 400 XP
- **Minimum:** ~600-800 XP (selon skills déjà possédés)

**Note:** Si le personnage possède déjà certains éléments (ex: via autre carrière), le coût est réduit.

## Changement de carrière

### Coût standard

Changer de carrière n'a PAS de coût XP en soi. Le personnage commence au niveau 1 de la nouvelle carrière.

**Règle:** Le personnage peut progresser normalement dans la nouvelle carrière en dépensant XP pour acquérir les éléments des niveaux.

### Exemple

**Agitateur niveau 3 change pour Artisan:**
- Pas de coût pour le changement lui-même
- Pour atteindre Artisan niveau 1: Acquérir les 8 skills + 4 talents + améliorer 3 characteristics
- Éléments déjà possédés via Agitateur: Comptent déjà acquis, pas de coût supplémentaire

## Exemples de calculs

### Création personnage (Pamphlétaire niveau 1)

**Budget départ:** Variable selon espèce/classe (ex: 50 XP)

**Dépenses possibles:**
- Améliorer CT 0→5: 125 XP (hors budget typique)
- Améliorer Intelligence 0→2: 2 × 25 = 50 XP (utilise tout le budget)
- Acquérir skill "Art (Écriture)" 0→5: 5 × 10 = 50 XP (utilise tout le budget)

### Post-création (Artisan niveau 2)

**Objectif:** Améliorer Sociabilité de 25 à 30

**Calcul:**
- Niveau actuel: 25
- Niveau cible: 30
- Palier 26-30: 90 XP par niveau
- **Coût:** 5 × 90 = 450 XP

**En carrière:** 450 XP (Sociabilité est dans carrière niveau 2)

### Hors carrière

**Objectif:** Améliorer Force Mentale (hors carrière Artisan) de 20 à 25

**Calcul:**
- Palier 21-25: 70 XP par niveau
- Coût normal: 5 × 70 = 350 XP
- **Coût hors carrière:** 350 × 2 = 700 XP

## Références croisées

**Tables:**
- `audit/database/careerLevels.md` - Structure des niveaux
- `audit/database/characteristics.md` - Caractéristiques
- `audit/database/skills.md` - Compétences
- `audit/database/talents.md` - Talents

**Règles métier:**
- `progression-careerlevels.md` - Système de progression
- `accumulation-avantages-careerlevels.md` - Cumul des avantages
