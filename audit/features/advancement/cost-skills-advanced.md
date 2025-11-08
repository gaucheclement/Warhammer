# Advancement - Coût XP Compétences Advanced

## Contexte

Les compétences Advanced (avancées) nécessitent un apprentissage spécifique avant utilisation. Contrairement aux compétences Basic, elles ont une valeur de **0** jusqu'à leur acquisition.

Cette documentation décrit le calcul du coût XP pour acquérir et améliorer les compétences Advanced.

## Différence avec Basic

| Critère | Basic | Advanced |
|---------|-------|----------|
| Valeur initiale | Caractéristique liée | **0** (inutilisable) |
| Acquisition (dans carrière) | 10 XP | **20 XP** |
| Acquisition (hors carrière) | 20 XP | **40 XP** |
| Avances suivantes | Identique | Identique |
| Utilisable sans XP | Oui | **Non** |

## Formule de Coût XP

### Coût d'Acquisition (Première Avance)

**Dans carrière:** 20 XP
**Hors carrière:** 40 XP (× 2)

L'acquisition débloque la compétence et donne la première avance (+1).

### Coût des Avances Suivantes

Après acquisition, les paliers sont **identiques aux compétences Basic**:

| Palier (Avance) | Coût XP par +1 | Cumul depuis +1 |
|-----------------|----------------|-----------------|
| 1-5             | 10 XP          | 50 XP           |
| 6-10            | 15 XP          | 125 XP          |
| 11-15           | 20 XP          | 225 XP          |
| 16-20           | 30 XP          | 375 XP          |
| 21-25           | 40 XP          | 575 XP          |
| 26-30           | 60 XP          | 875 XP          |
| 31-35           | 80 XP          | 1275 XP         |
| 36-40           | 110 XP         | 1825 XP         |
| 41-45           | 140 XP         | 2525 XP         |
| 46-50           | 180 XP         | 3425 XP         |

### Coût Total

Pour passer de **0 avances** à **+N avances** (dans carrière):

**Coût Total = 20 XP (acquisition) + Coût Paliers**

**Exemples:**
- 0 → +1: **20 XP** (acquisition seule)
- 0 → +5: 20 + (4 × 10) = **60 XP**
- 0 → +10: 20 + 40 + 75 = **135 XP**

## Exemples Concrets

### Exemple 1: Érudit apprend Langue (Bretonnien) - dans carrière

Int 35, Langue (Bretonnien) = 0 → Acquisition 20 XP (Langue 36) + 4 avances (4×10) = **60 XP total** (Langue 40)

### Exemple 2: Soldat apprend Langue (Eltharin) - hors carrière

Int 30, Langue (Eltharin) = 0 → Acquisition 40 XP (×2) + 9 avances (4×20 + 5×30) = **270 XP total** (Langue 40)

### Exemple 3: Sorcier apprend Focalisation (Ulgu)

FM 35, Focalisation (Ulgu) = 0 → Acquisition 20 XP + 14 avances = **360 XP total** (Focalisation 50)

## Liste Compétences Advanced

**Principales compétences Advanced (~27 sur 47 totales):**
- **Langues:** Bretonnien, Eltharin, Khazalid, Magick, Reikspiel, etc.
- **Savoirs:** Savoirs (Droit), Savoirs (Théologie), Savoirs (Histoire), etc.
- **Magiques:** Focalisation, Incantation
- **Spécialisées:** Art (Calligraphie), Métier (Apothicaire), Navigation, Dressage, etc.

## Spécialisations

Toutes les compétences Advanced avec spécialisations nécessitent **une acquisition par spécialisation**:

**Exemple Langue:**
- Langue (Bretonnien) +5: 60 XP
- Langue (Eltharin) +3: 50 XP
- **Total: 110 XP** (deux compétences distinctes)

**Exemple Focalisation (cas particulier):**
Focalisation est groupée ET non groupée (voir [skills-specialisations.md](../../business-rules/skills-specialisations.md)).
- Focalisation générale +5: 60 XP
- Focalisation (Azyr) +10: 135 XP
- Peuvent coexister indépendamment

## Règles Métier

**Création:** Seulement compétences listées carrière niveau 1, acquisition obligatoire avant utilisation.
**Post-création:** Toutes compétences Advanced accessibles, coût × 2 hors carrière.

**Contrainte importante:** Une compétence Advanced **ne peut pas être utilisée** avant acquisition (valeur = 0).

## Valeur Finale

**Valeur Finale = Caractéristique Liée + Avances Achetées (XP)**

**Différence avec Basic:** Pas d'avances espèce/carrière automatiques (sauf exceptions rares comme talents).

**Exemple:**
- Intelligence: 35
- Langue (Bretonnien) avances achetées: +10
- **Valeur finale: 45**

## Validation

### Contraintes à Vérifier

1. **Type Advanced** : La compétence est bien de type "advanced"
2. **Acquisition préalable** : Ne peut pas ajouter avances sans acquisition
3. **Spécialisation choisie** : Toutes Advanced avec specs nécessitent sélection
4. **Budget XP suffisant** (création)
5. **Compétence dans carrière** (création) ou coût × 2 (post-création)

### Messages d'Erreur (V2)

- "Compétence non acquise: Acquisition requise (20 XP)"
- "Spécialisation requise: Choisissez une langue pour Langue"
- "Compétence hors carrière: coût × 2 (40 XP au lieu de 20 XP)"

## Relations

### Fichiers Liés

- [cost-skills-basic.md](./cost-skills-basic.md) - Coût XP compétences Basic
- [experience-skills.md](../wizard/experience-skills.md) - Dépenses XP compétences (wizard)
- [out-of-career.md](./out-of-career.md) - Multiplicateur × 2 hors carrière

### Tables Database

- [skills.md](../../database/skills.md) - Structure 47 compétences
- [careerLevels.md](../../database/careerLevels.md) - Compétences disponibles par niveau

### Business Rules

- [skills-specialisations.md](../../business-rules/skills-specialisations.md) - Spécialisations groupées
- [skills-avances-progression.md](../../business-rules/skills-avances-progression.md) - Système avances

### Patterns

- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Specs et "(Au choix)"
