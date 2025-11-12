# Exemples de Personnages Types

## Introduction

Archétypes complets illustrant les règles de création de personnages Warhammer. Chaque exemple décompose toutes les valeurs calculées.

**Objectif**: Documentation autonome pour comprendre génération et calculs sans référence code.

---

## Archétype 1: Agitateur Humain Niveau 1

### 1.1 Identité

**Johann, Humain Reiklander, Signe Grande Croix, Carrière Agitateur Bronze 1, Statut Cuivre 3**

### 1.2 Caractéristiques

#### Formule
```
Base Espèce + Roll (2d10) + Avances Carrière = Total
Bonus = Total ÷ 10 (division entière)
```

#### Valeurs

| Carac | Base Espèce | Roll 2d10 | Avances Carrière | Total | Bonus |
|-------|-------------|-----------|------------------|-------|-------|
| CC | 20 | +12 | 0 | 32 | BC 3 |
| CT | 20 | +11 | +3 | 34 | 3 |
| F | 20 | +10 | 0 | 30 | BF 3 |
| E | 20 | +15 | 0 | 35 | BE 3 |
| I | 20 | +14 | 0 | 34 | 3 |
| Ag | 20 | +15 | 0 | 35 | 3 |
| Dex | 20 | +10 | 0 | 30 | 3 |
| Int | 20 | +12 | +2 | 34 | 4 |
| FM | 20 | +15 | 0 | 35 | BFM 3 |
| Soc | 20 | +15 | 0 | 35 | BSoc 3 |

**Distribution avances carrière**: Agitateur N1 liste 3 caractéristiques (CT, Int, Soc). Joueur distribue 5 points: CT +3, Int +2, Soc +0.

### 1.3 Compétences

#### Espèce (Humain Reiklander)

**Liste disponible**: Athlétisme, Calme, Résistance, Langue (Bataille), Art (Au choix) ou Métier (Au choix), Animaux ou Charme, Commerage ou Ragots.

**Choix joueur**: Art (Peinture), Charme.

**Répartition 3×+5, 3×+3**:
- +5: Art (Peinture), Athlétisme, Calme
- +3: Résistance, Langue (Bataille), Charme

#### Carrière (Agitateur N1)

**Liste disponible (8 skills)**: Athlétisme, Esquive, Intuition, Corps à corps (Base), Calme, Charme, Commandement, Ragots.

**Répartition 40 points (max 10/skill)**:
- Athlétisme +5, Calme +5, Charme +10, Commandement +10, Ragots +10

#### Cumul et valeurs finales

| Compétence | Carac | Espèce | Carrière | Total Avances | Valeur |
|------------|-------|--------|----------|---------------|--------|
| Art (Peinture) | Dex 30 | +5 | - | 5 | 35 |
| Athlétisme | Ag 35 | +5 | +5 | 10 | 45 |
| Calme | FM 35 | +5 | +5 | 10 | 45 |
| Charme | Soc 35 | +3 | +10 | 13 | 48 |
| Commandement | Soc 35 | - | +10 | 10 | 45 |
| Langue (Bataille) | Int 34 | +3 | - | 3 | 37 |
| Ragots | Soc 35 | - | +10 | 10 | 45 |
| Résistance | E 35 | +3 | - | 3 | 38 |

### 1.4 Talents

#### Espèce (Humain)

**Liste**: "Perspicace ou Affable, Destinée, 3 Talent aléatoire"

**Acquisitions**:
- Choix "ou": Affable (+5 Sociabilité)
- Automatique: Destinée
- Aléatoires (3 tirés): Chanceux, Acuité auditive, Sixième sens

**Total race**: 5 talents (Affable, Destinée, Chanceux, Acuité auditive, Sixième sens)

#### Carrière (Agitateur N1)

**Liste (4 talents)**: Baratiner, Lire/Écriture, Sociable, Rompu aux armes

**Acquisitions**: Tous 4 acquis.

#### Effets appliqués

- Affable: Soc +5 → Base 35 → 40 (impact Charme 48→53, Commandement 45→50, Ragots 45→50)

### 1.5 Attributs dérivés

Formules complètes voir [resume-derived.md](../wizard/resume-derived.md).

**Mouvement**: Base Humain 4 → Marche 8, Course 16

**Points de Blessure**: Formule Humain = BF + 2×BE + BFM = 3 + 2×3 + 3 = 12

**Destin**: Base Humain 2 + Extra Points (+2) = 4

**Résolution**: Base Humain 0 + Extra Points (+1) = 1

**Fortune**: 0

---

## Archétype 2: Artisan Nain Niveau 1

### 2.1 Identité

**Grimsson, Nain, Carrière Artisan Bronze 2, Statut Argent 1**

### 2.2 Caractéristiques

| Carac | Base Espèce | Roll 2d10 | Avances Carrière | Total | Bonus |
|-------|-------------|-----------|------------------|-------|-------|
| CC | 30 | +9 | 0 | 39 | BC 3 |
| CT | 20 | +8 | 0 | 28 | 2 |
| F | 20 | +13 | +2 | 35 | BF 3 |
| E | 30 | +12 | 0 | 42 | BE 4 |
| I | 20 | +8 | 0 | 28 | 2 |
| Ag | 10 | +5 | 0 | 15 | 1 |
| Dex | 20 | +10 | +3 | 33 | 3 |
| Int | 20 | +8 | 0 | 28 | 2 |
| FM | 40 | +11 | 0 | 51 | BFM 5 |
| Soc | 10 | +5 | 0 | 15 | 1 |

**Distribution avances carrière**: Artisan N1 liste 3 caractéristiques (Dex, F, Soc). Joueur distribue 5 points: Dex +3, F +2, Soc +0.

### 2.3 Compétences

#### Espèce (Nain)

**Liste**: Résistance, Endurance, Calme, Corps à corps (Base), Métier (Au choix), Langue (Khazalid), Connaissance (Géologie) ou Connaissance (Métallurgie).

**Choix**: Métier (Forgeron), Connaissance (Métallurgie).

**Répartition 3×+5, 3×+3**:
- +5: Métier (Forgeron), Résistance, Endurance
- +3: Calme, Corps à corps (Base), Connaissance (Métallurgie)

#### Carrière (Artisan N1)

**Liste (8 skills)**: Calme, Résistance, Métier (Forgeron), Corps à corps (Base), Perception, Marchandage, Ragots, Évaluation.

**Répartition 40 points**: Métier (Forgeron) +10, Évaluation +10, Marchandage +10, Perception +10.

#### Valeurs finales

| Compétence | Carac | Espèce | Carrière | Total Avances | Valeur |
|------------|-------|--------|----------|---------------|--------|
| Métier (Forgeron) | Dex 33 | +5 | +10 | 15 | 48 |
| Évaluation | Int 28 | - | +10 | 10 | 38 |
| Marchandage | Soc 15 | - | +10 | 10 | 25 |
| Perception | I 28 | - | +10 | 10 | 38 |
| Résistance | E 42 | +5 | - | 5 | 47 |
| Endurance | E 42 | +5 | - | 5 | 47 |
| Calme | FM 51 | +3 | - | 3 | 54 |
| Corps à corps (Base) | CC 39 | +3 | - | 3 | 42 |
| Connaissance (Métallurgie) | Int 28 | +3 | - | 3 | 31 |
| Langue (Khazalid) | Int 28 | - | - | 0 | 28 |

### 2.4 Talents

#### Espèce (Nain)

**Liste**: "Costaud, Déterminé ou Obstiné, Résistance magie, Lire/Écriture ou Impitoyable"

**Acquisitions**:
- Automatiques: Costaud (+5 Endurance), Résistance magie
- Choix "ou": Déterminé, Lire/Écriture

**Total race**: 4 talents

#### Carrière (Artisan N1)

**Liste (4 talents)**: "Ambidextre ou Maître artisan, Méticuleux, Résistance (Maladie), Lire/Écriture"

**Acquisitions**: Maître artisan (choix), Méticuleux, Résistance (Maladie), Lire/Écriture (rang 2 si doublon race).

#### Effets appliqués

- Costaud: E +5 → 42→47

### 2.5 Attributs dérivés

Formules voir [resume-derived.md](../wizard/resume-derived.md).

**Mouvement**: Base Nain 3 → Marche 6, Course 12

**Points de Blessure**: Formule Nain = BF + 2×BE + BFM = 3 + 2×4 + 5 = 16

**Destin**: Base Nain 0 + Extra Points (+0) = 0

**Résolution**: Base Nain 2 + Extra Points (+2) = 4

---

## Archétype 3: Mage Elfe Azyr Niveau 1

### 3.1 Identité

**Elenwe, Haut Elfe, Carrière Apprenti Sorcier Bronze 1, Domaine Azyr (Ciel)**

### 3.2 Caractéristiques

| Carac | Base Espèce | Roll 2d10 | Avances Carrière | Total | Bonus |
|-------|-------------|-----------|------------------|-------|-------|
| CC | 30 | +10 | 0 | 40 | 4 |
| CT | 30 | +8 | 0 | 38 | 3 |
| F | 20 | +5 | 0 | 25 | BF 2 |
| E | 20 | +8 | 0 | 28 | BE 2 |
| I | 40 | +10 | 0 | 50 | 5 |
| Ag | 30 | +8 | 0 | 38 | 3 |
| Dex | 30 | +8 | 0 | 38 | 3 |
| Int | 30 | +10 | +3 | 43 | 4 |
| FM | 30 | +10 | +2 | 42 | BFM 4 |
| Soc | 30 | +10 | 0 | 40 | 4 |

**Distribution avances carrière**: Apprenti Sorcier N1 liste (Int, FM, Soc). Joueur distribue 5 points: Int +3, FM +2.

### 3.3 Compétences

#### Espèce (Haut Elfe)

**Liste**: Calme, Charme, Esquive, Intuition, Perception, Langue (Eltharin), Connaissance (Ulthuan) ou Art (Au choix).

**Choix**: Art (Calligraphie).

**Répartition 3×+5, 3×+3**:
- +5: Intuition, Perception, Calme
- +3: Charme, Esquive, Art (Calligraphie)

#### Carrière (Apprenti Sorcier N1)

**Liste (8 skills)**: Focalisation (Azyr), Intuition, Langue (Magick), Perception, Résistance, Calme, Esquive, Connaissance (Magie).

**Répartition 40 points**: Focalisation (Azyr) +10, Intuition +10, Langue (Magick) +10, Connaissance (Magie) +10.

#### Valeurs finales

| Compétence | Carac | Espèce | Carrière | Total Avances | Valeur |
|------------|-------|--------|----------|---------------|--------|
| Focalisation (Azyr) | FM 42 | - | +10 | 10 | 52 |
| Intuition | I 50 | +5 | +10 | 15 | 65 |
| Langue (Magick) | Int 43 | - | +10 | 10 | 53 |
| Connaissance (Magie) | Int 43 | - | +10 | 10 | 53 |
| Perception | I 50 | +5 | - | 5 | 55 |
| Calme | FM 42 | +5 | - | 5 | 47 |
| Charme | Soc 40 | +3 | - | 3 | 43 |
| Esquive | Ag 38 | +3 | - | 3 | 41 |
| Art (Calligraphie) | Dex 38 | +3 | - | 3 | 41 |
| Langue (Eltharin) | Int 43 | - | - | 0 | 43 |

### 3.4 Talents

#### Espèce (Haut Elfe)

**Liste**: "Perspicace ou Affable, Seconde Vue, Sixième Sens, 2 Talent aléatoire"

**Acquisitions**:
- Choix: Perspicace
- Automatiques: Seconde Vue, Sixième Sens
- Aléatoires (2): Vision nocturne, Linguiste

**Total race**: 5 talents

#### Carrière (Apprenti Sorcier N1)

**Liste (4 talents)**: Magie des Arcanes (Azyr), Instinct magique, Lecture rapide, Lire/Écriture.

**Acquisitions**: Tous 4.

#### Effets appliqués

- Magie des Arcanes (Azyr): Ajoute accès domaine Azyr, débloque tous sorts Azyr

### 3.5 Attributs dérivés

Formules voir [resume-derived.md](../wizard/resume-derived.md).

**Mouvement**: Base Elfe 5 → Marche 10, Course 20

**Points de Blessure**: Formule Elfe = BF + 2×BE + BFM = 2 + 2×2 + 4 = 10

**Destin**: Base Elfe 0

**Résolution**: Base Elfe 0

---

## Archétype 4: Bourgeois Halfling Niveau 1

### 4.1 Identité

**Milo Brandybuck, Halfling, Carrière Bourgeois Bronze 1, Statut Argent 3**

### 4.2 Caractéristiques

| Carac | Base Espèce | Roll 2d10 | Avances Carrière | Total | Bonus |
|-------|-------------|-----------|------------------|-------|-------|
| CC | 10 | +5 | 0 | 15 | 1 |
| CT | 30 | +10 | 0 | 40 | 4 |
| F | 10 | +5 | 0 | 15 | BF 1 |
| E | 20 | +8 | 0 | 28 | BE 2 |
| I | 20 | +10 | 0 | 30 | 3 |
| Ag | 20 | +8 | +1 | 29 | 2 |
| Dex | 30 | +9 | +1 | 40 | 4 |
| Int | 20 | +8 | 0 | 28 | 2 |
| FM | 20 | +10 | 0 | 30 | 3 |
| Soc | 20 | +9 | +3 | 32 | 3 |

**Distribution avances carrière**: Bourgeois N1 liste (Ag, Dex, Soc). Joueur distribue 5 points: Ag +1, Dex +1, Soc +3.

### 4.3 Compétences

#### Espèce (Halfling)

**Liste**: Calme, Charme, Esquive, Intuition, Discrétion (Rurale), Perception, Animaux ou Ragots.

**Choix**: Ragots.

**Répartition 3×+5, 3×+3**:
- +5: Charme, Calme, Ragots
- +3: Intuition, Perception, Esquive

#### Carrière (Bourgeois N1)

**Liste (8 skills)**: Charme, Résistance, Commandement, Ragots, Intuition, Connaissance (Reikland), Art (Au choix) ou Métier (Au choix), Langue (Au choix).

**Choix**: Métier (Cuisine), Langue (Tiléen).

**Répartition 40 points**: Charme +10, Ragots +10, Commandement +10, Métier (Cuisine) +5, Langue (Tiléen) +5.

#### Valeurs finales

| Compétence | Carac | Espèce | Carrière | Total Avances | Valeur |
|------------|-------|--------|----------|---------------|--------|
| Charme | Soc 32 | +5 | +10 | 15 | 47 |
| Ragots | Soc 32 | +5 | +10 | 15 | 47 |
| Commandement | Soc 32 | - | +10 | 10 | 42 |
| Métier (Cuisine) | Dex 40 | - | +5 | 5 | 45 |
| Langue (Tiléen) | Int 28 | - | +5 | 5 | 33 |
| Calme | FM 30 | +5 | - | 5 | 35 |
| Intuition | I 30 | +3 | - | 3 | 33 |
| Perception | I 30 | +3 | - | 3 | 33 |
| Esquive | Ag 29 | +3 | - | 3 | 32 |

### 4.4 Talents

#### Espèce (Halfling)

**Liste**: "Résistance Chaos, Chanceux, Petit"

**Acquisitions**: Tous 3 automatiques.

#### Carrière (Bourgeois N1)

**Liste (4 talents)**: Étiquette, Chanceux, Lire/Écriture, Savoir-vivre.

**Acquisitions**: Tous 4. Chanceux rang 2 (doublon race+carrière).

### 4.5 Attributs dérivés

Formules voir [resume-derived.md](../wizard/resume-derived.md).

**Mouvement**: Base Halfling 3 → Marche 6, Course 12

**Points de Blessure**: Formule Halfling DIFFÉRENTE (SANS BF) = 2×BE + BFM = 2×2 + 3 = 7

**Destin**: Base Halfling 0

**Résolution**: Base Halfling 0

**Fortune**: +2 (Chanceux rang 2)

---

## Résumé règles de création

**Caractéristiques**:
- Base espèce + Roll 2d10 (ou manuel 100 points)
- 5 points distribués entre les 3 caractéristiques carrière

**Compétences**:
- Race: 3 différentes à +5, 3 différentes à +3
- Carrière: 40 points distribués, max 10 par compétence
- Cumul: avances race + carrière s'additionnent
- Valeur = Caractéristique + Avances

**Talents**:
- Race: TOUS talents listés + choix "ou" + aléatoires (champ rand)
- Carrière: 4 talents listés, choix "ou", spécialisations

**Attributs dérivés**:
- Bonus = Caractéristique ÷ 10
- Points de Blessure, Mouvement, Destin, Résolution : Voir formules complètes dans [resume-derived.md](../wizard/resume-derived.md)

---

## Références

**Tables database**: [species.md](../../database/species.md), [careers.md](../../database/careers.md), [careerLevels.md](../../database/careerLevels.md), [characteristics.md](../../database/characteristics.md), [skills.md](../../database/skills.md), [talents.md](../../database/talents.md)

**Règles métier**: [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md), [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md), [specialisations-skills-talents.md](../../business-rules/specialisations-skills-talents.md), [talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md)

**Patterns**: [pattern-parsing.md](../../patterns/pattern-parsing.md), [pattern-specialisations.md](../../patterns/pattern-specialisations.md), [pattern-talent-aleatoire.md](../../patterns/pattern-talent-aleatoire.md)

**Workflows**: [workflow-creation-complete.md](../workflows/workflow-creation-complete.md)

**Wizard**: [wizard/characteristics.md](../wizard/characteristics.md), [wizard/skills.md](../wizard/skills.md), [wizard/talents.md](../wizard/talents.md)
