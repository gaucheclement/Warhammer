# Système de Progression: 4 Niveaux de Carrière

## Vue d'ensemble

Chaque carrière Warhammer possède exactement 4 niveaux de progression représentant l'évolution du personnage dans sa profession. Le personnage commence au niveau 1 et progresse séquentiellement vers le niveau 4.

**Référence:** `audit/database/careerLevels.md`

## Structure des 4 niveaux

### Organisation fixe

Chaque carrière = 4 niveaux numérotés 1, 2, 3, 4 (aucune exception).

**Exemple Agitateur:**
1. Niveau 1: Pamphlétaire
2. Niveau 2: Agitateur
3. Niveau 3: Fauteur de Troubles
4. Niveau 4: Démagogue

**Exemple Artisan:**
1. Niveau 1: Apprenti Artisan
2. Niveau 2: Artisan
3. Niveau 3: Maître artisan
4. Niveau 4: Maître de guilde

### Caractéristiques par niveau

Chaque niveau apporte un ensemble défini d'avantages:

| Élément | Niveau 1 | Niveau 2 | Niveau 3 | Niveau 4 |
|---------|----------|----------|----------|----------|
| Characteristics | 3 | 1 | 1 | 1 |
| Skills | 8-10 | 6 | 4 | 2 |
| Talents | 4 | 4 | 4 | 4 |
| Trappings | Variable | Variable | Variable | Variable |

**Logique:** Plus le niveau est élevé, moins le personnage acquiert de nouvelles compétences (car il se spécialise), mais il continue d'acquérir le même nombre de talents.

## Nomenclature: Bronze, Argent, Or

### Métaux de prestige

Le champ `status` indique le statut social du personnage sous la forme "{Métal} {Niveau}".

**Métaux disponibles:**
- **Bronze:** Classes sociales basses et moyennes
- **Argent:** Classes moyennes et moyennes-supérieures
- **Or:** Classes supérieures et élites

**Niveaux:** 1 à 10 (échelle fine de prestige au sein de chaque métal)

### Exemples de progression par métal

**Progression homogène (Bronze):**
- Agitateur niveau 1: Bronze 1
- Agitateur niveau 2: Bronze 2
- Agitateur niveau 3: Bronze 3
- Agitateur niveau 4: Bronze 5

**Progression ascendante (Bronze → Argent → Or):**
- Artisan niveau 1: Bronze 2
- Artisan niveau 2: Argent 1
- Artisan niveau 3: Argent 3
- Artisan niveau 4: Or 1

**Progression moyenne (Argent):**
- Bourgeois niveau 1: Argent 1
- Bourgeois niveau 2: Argent 2
- Bourgeois niveau 3: Argent 5
- Bourgeois niveau 4: Or 1

### Non-linéarité du prestige

Le niveau de prestige ne progresse pas toujours de +1. Il peut sauter des valeurs.

**Exemples:**
- Bronze 1 → Bronze 2 → Bronze 3 → **Bronze 5** (saut de 4)
- Argent 1 → Argent 2 → **Argent 5** (saut de 3 et 4)

**Raison métier:** Certains niveaux de carrière représentent des bonds significatifs en responsabilité/reconnaissance sociale, pas seulement une évolution incrémentale.

## Progression linéaire vs changement de carrière

### Progression linéaire (normale)

Le personnage progresse dans sa carrière actuelle: niveau 1 → 2 → 3 → 4.

**Règles:**
- Progression obligatoirement séquentielle (pas de saut de niveau)
- Un personnage ne peut pas passer du niveau 1 au niveau 3 directement
- Chaque niveau doit être complété avant de passer au suivant
- Les avantages s'accumulent (voir `accumulation-avantages-careerlevels.md`)

**Exemple:** Un Pamphlétaire (niveau 1) doit devenir Agitateur (niveau 2) avant de devenir Fauteur de Troubles (niveau 3).

### Changement de carrière

Le personnage peut changer de carrière à n'importe quel moment, ce qui réinitialise son niveau de carrière à 1 dans la nouvelle carrière.

**Règles:**
- Le personnage conserve tous les avantages acquis dans l'ancienne carrière
- Il commence au niveau 1 de la nouvelle carrière
- Les coûts de progression peuvent différer (voir `calculs-xp-progression.md`)
- Il peut revenir à son ancienne carrière ultérieurement

**Exemple:** Un Agitateur niveau 3 peut changer pour devenir Artisan niveau 1, conservant tous ses skills/talents d'Agitateur.

### Dépenses XP en carrière vs hors carrière

**En carrière (coût normal):**
- Le personnage peut améliorer les caractéristiques de son niveau actuel
- Il peut améliorer les skills de son niveau actuel
- Il peut acquérir les talents de son niveau actuel
- Coût XP = coût standard

**Hors carrière (coût double):**
- Le personnage peut améliorer d'autres caractéristiques
- Il peut acquérir d'autres skills de base
- Coût XP = coût standard × 2

**Exemple:** Un Pamphlétaire (niveau 1) peut améliorer ses 3 characteristics au coût normal, ou améliorer d'autres characteristics au coût double.

## Restrictions de progression

### Pendant la création du personnage

**Règle:** Le personnage peut uniquement dépenser ses PX sur les éléments de son niveau de carrière actuel (niveau 1).

**Disponible:**
- 3 characteristics du niveau 1
- 8-10 skills du niveau 1
- 4 talents du niveau 1

**Non disponible:**
- Éléments des niveaux 2-4 (non encore débloqués)
- Changement de carrière (après la création uniquement)

### Après la création

**Règle:** Le personnage peut dépenser ses PX sur:
- Éléments de son niveau actuel (coût normal)
- Éléments hors carrière (coût × 2)
- Changer de carrière

**Déblocage progressif:** Les éléments des niveaux suivants se débloquent quand le personnage atteint ce niveau.

## Cas d'usage

### Cas 1: Progression standard

**Scénario:** Apprenti Artisan (niveau 1) progresse normalement.

**Séquence:**
1. Début: Apprenti Artisan (niveau 1, Bronze 2)
2. Acquisition: 8 skills, 4 talents, amélioration de 3 characteristics
3. Progression: Devient Artisan (niveau 2, Argent 1)
4. Nouveau déblocage: 6 nouveaux skills, 4 nouveaux talents, 1 nouvelle characteristic
5. Accumulation: Conserve tout du niveau 1 + acquiert niveau 2

### Cas 2: Changement de carrière

**Scénario:** Agitateur niveau 3 change pour Artisan.

**État initial:**
- Carrière: Agitateur
- Niveau: 3 (Fauteur de Troubles, Bronze 3)
- Acquis: 18 skills (8+6+4), 12 talents (4+4+4), 5 characteristics (3+1+1)

**Après changement:**
- Carrière: Artisan
- Niveau: 1 (Apprenti Artisan, Bronze 2)
- Conservé: Tous les skills/talents/characteristics d'Agitateur
- Nouveau déblocage: 8 skills niveau 1 Artisan, 4 talents niveau 1 Artisan, 3 characteristics niveau 1 Artisan
- Peut progresser: Vers Artisan niveau 2 ensuite

### Cas 3: Multi-carrières

**Scénario:** Personnage explore 3 carrières différentes.

**Parcours:**
1. Agitateur niveau 1 → niveau 2 → niveau 3
2. Changement → Artisan niveau 1 → niveau 2
3. Changement → Enquêteur niveau 1

**Résultat final:**
- Carrière actuelle: Enquêteur (niveau 1)
- Historique: Agitateur 3, Artisan 2
- Total acquis: Skills/talents/characteristics des 3 carrières (cumul)

## Relation Database Careers → CareerLevels

### Pattern utilisé

[pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md) - Relation string → entity

### Type de relation

**One-to-Many** : Une carrière → Exactement 4 niveaux (CareerLevels)

**Liaison** : `careerLevel.career` (texte) = `career.label` (texte)

**Exemple** :
- Carrière : `label = "Agitateur"`
- Niveaux : 4 entrées dans careerLevels avec `career = "Agitateur"`

### Contrainte d'intégrité

Toute carrière DOIT avoir **exactement 4 niveaux** (pas 3, pas 5, exactement 4).

### Navigation entre niveaux

**label** : Nom spécifique du niveau ("Pamphlétaire", "Démagogue")

**career** : Nom de la carrière parente ("Agitateur")

**Usage** :
- Affichage : Montrer `label` (descriptif)
- Regroupement : Utiliser `career` pour lister 4 niveaux
- Progression : Incrémenter `careerLevel` pour niveau suivant

**Affichage hiérarchique** :
```
Agitateur (Carrière)
├─ Niveau 1: Pamphlétaire (Bronze 1)
├─ Niveau 2: Agitateur (Bronze 2)
├─ Niveau 3: Fauteur de Troubles (Bronze 3)
└─ Niveau 4: Démagogue (Bronze 5)
```

### Validation database

**Cohérence données** :
- Exactement 4 CareerLevels par carrière
- `careerLevel` = 1, 2, 3, 4 (séquentiel)
- Tous CareerLevels d'une carrière ont même `career`
- Un seul CareerLevel par `careerLevel` (pas doublons)

## Relations avec autres règles

**Accumulation:** Voir `accumulation-avantages-careerlevels.md` pour le cumul des avantages par niveau.

**Coûts XP:** Voir `calculs-xp-progression.md` pour les formules de coût par niveau et hors carrière.

**Parsing:** Voir `parsing-wizard-data.md` pour le format des données.

**Tables database:** Voir `audit/database/careers.md` et `audit/database/careerLevels.md` pour les schémas complets.
