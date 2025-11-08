# Advancement - Coût XP Compétences Basic

## Contexte

Les compétences Basic (de base) sont accessibles à tous les personnages sans apprentissage préalable. Cependant, pour les améliorer et augmenter leurs chances de réussite, les joueurs doivent dépenser des Points d'Expérience (XP).

Cette documentation décrit le calcul du coût XP pour acheter des avances de compétences Basic, avec une distinction entre:
- **Acquisition** (première avance): Coût initial pour "débloquer" la compétence
- **Amélioration** (avances suivantes): Coûts progressifs par palier

## Structure des Compétences Basic

Les compétences Basic (~20 sur 47 totales) incluent: Corps à Corps, Charme, Calme, Athlétisme, Intimidation, Perception, etc.

Chaque compétence est liée à une caractéristique: Corps à Corps → CC, Charme → Soc, Calme → FM.
La **valeur de base** = valeur de la caractéristique liée.

## Formule de Coût XP

### Coût d'Acquisition (Première Avance)

**Dans carrière:** 10 XP
**Hors carrière:** 20 XP (× 2)

L'acquisition permet de passer de 0 avance à +1 avance sur la compétence.

**Exemple:**
Un Agitateur (carrière niveau 1) a accès à **Charme** dans sa carrière.
- Acquisition de Charme: **10 XP** (dans carrière)
- Acquisition de Conduite: **20 XP** (hors carrière)

### Coût des Avances Suivantes (Amélioration)

Après l'acquisition, chaque avance supplémentaire coûte selon le palier actuel:

| Palier (Avance) | Coût XP par +1 | Cumul XP (depuis +1) |
|-----------------|----------------|----------------------|
| 1-5             | 10 XP          | 50 XP                |
| 6-10            | 15 XP          | 125 XP               |
| 11-15           | 20 XP          | 225 XP               |
| 16-20           | 30 XP          | 375 XP               |
| 21-25           | 40 XP          | 575 XP               |
| 26-30           | 60 XP          | 875 XP               |
| 31-35           | 80 XP          | 1275 XP              |
| 36-40           | 110 XP         | 1825 XP              |
| 41-45           | 140 XP         | 2525 XP              |
| 46-50           | 180 XP         | 3425 XP              |
| 51-55           | 220 XP         | 4525 XP              |
| 56-60           | 270 XP         | 5875 XP              |
| 61-65           | 320 XP         | 7475 XP              |
| 66-70           | 380 XP         | 9375 XP              |

**Note:** Ces coûts s'appliquent **après** l'acquisition initiale (+1).

### Coût Total Complet

Pour passer de **0 avances** à **+N avances** (dans carrière):

**Coût Total = 10 XP (acquisition) + Coût Paliers**

**Exemples:**
- 0 → +1: **10 XP** (acquisition seule)
- 0 → +5: 10 + (4 × 10) = **50 XP**
- 0 → +10: 10 + (4 × 10) + (5 × 15) = **135 XP**
- 0 → +20: 10 + 50 + 75 + 100 + 150 = **385 XP**

## Exemples Concrets

### Exemple 1: Agitateur améliore Charme (dans carrière)

Soc 35, Charme non acquis → Acquisition 10 XP (Charme 36) + 5 avances (4×10 + 1×15) = **65 XP total** (Charme 41)

### Exemple 2: Artisan améliore Métier (Charron) hors carrière

Dex 30, Métier non acquis → Acquisition 20 XP (×2) + 4 avances (4×20) = **100 XP total** (Métier 35)

### Exemple 3: Nain Répurgateur améliore Calme

FM 30 + avances espèce +5 = 35 → Acquisition 10 XP + 9 avances (4×10 + 5×15) = **125 XP total** (Calme 45)

## Règles Métier

**Création:** Seulement compétences listées carrière niveau 1, budget XP limité, blocage si dépassement.
**Post-création:** Toutes compétences Basic accessibles, coût × 2 hors carrière, pas blocage strict.

## Valeur Finale

La valeur finale d'une compétence Basic est calculée ainsi:

**Valeur Finale = Caractéristique Liée + Avances Espèce + Avances Carrière + Avances Achetées (XP)**

**Exemple complet:**
- Sociabilité: 35
- Charme avances espèce (Humain): +0
- Charme avances carrière (Agitateur niveau 1): +0
- Charme avances achetées (XP): +10
- **Valeur finale Charme: 45**

**Test de compétence:** Lancer 1d100 ≤ 45 pour réussir un test de Charme.

## Différence Basic vs Advanced

**Basic:** Valeur = caractéristique sans acquisition, acquisition 10/20 XP, utilisable sans XP.
**Advanced:** Valeur = 0 sans acquisition, acquisition 20/40 XP, inutilisable sans XP (voir [cost-skills-advanced.md](./cost-skills-advanced.md)).

## Limites et Spécialisations

Avances max: +70. Compétences avec spécialisations (Art, Métier) comptent comme compétences séparées.
Métier (Forgeron) +10 et Métier (Cuisinier) +5 = 175 XP total (deux compétences distinctes).

## Validation

### Contraintes à Vérifier

1. **Type Basic** : La compétence est bien de type "base" (pas "advanced")
2. **Budget XP suffisant** (mode création)
3. **Compétence dans carrière** (création) ou accepter coût × 2 (post-création)
4. **Palier correct** : Le coût affiché correspond au palier actuel
5. **Spécialisation choisie** : Si la compétence a des specs, une spécialisation doit être sélectionnée

### Messages d'Erreur (V2)

**V1 actuel:** Désactivation silencieuse du bouton [+]
**V2 recommandé:**
- "Budget XP insuffisant (10 XP nécessaires pour acquisition, 5 XP disponibles)"
- "Compétence hors carrière: coût × 2 (20 XP au lieu de 10 XP)"
- "Spécialisation requise: Choisissez une spécialisation pour Métier"

## Relations

### Fichiers Liés

- [cost-skills-advanced.md](./cost-skills-advanced.md) - Coût XP compétences Advanced
- [experience-skills.md](../wizard/experience-skills.md) - Dépenses XP compétences (wizard)
- [out-of-career.md](./out-of-career.md) - Multiplicateur × 2 hors carrière
- [xp-budget.md](./xp-budget.md) - Gestion budget XP
- [validation.md](./validation.md) - Validation achats XP

### Tables Database

- [skills.md](../../database/skills.md) - Structure 47 compétences (base/advanced)
- [careerLevels.md](../../database/careerLevels.md) - Compétences disponibles par niveau

### Business Rules

- [skills-specialisations.md](../../business-rules/skills-specialisations.md) - Spécialisations compétences groupées
- [skills-avances-progression.md](../../business-rules/skills-avances-progression.md) - Système avances et progression

### Patterns

- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Specs et "(Au choix)"
- [pattern-validation-valeurs.md](../../patterns/pattern-validation-valeurs.md) - Validation plages
