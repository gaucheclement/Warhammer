# Relation Careers → CareerLevels

## Patterns techniques utilisés

- [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md) - Relation string → entity

## Vue d'ensemble

Chaque carrière est composée de **4 niveaux de progression** séquentiels. Ces niveaux représentent l'évolution d'un personnage dans sa profession.

**Objectif métier** : Structurer la progression de carrière en étapes distinctes, chacune avec compétences, talents et équipement spécifiques.

## Structure de la relation

### Type de relation
**One-to-Many** : Une carrière → Exactement 4 niveaux (CareerLevels)

### Liaison
Voir [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md)

**Champ** : `careerLevel.career` (texte) = `career.label` (texte)

**Exemple** :
- Carrière : `label = "Agitateur"`
- Niveaux : 4 entrées dans careerLevels avec `career = "Agitateur"`

### Contrainte d'intégrité
Toute carrière DOIT avoir **exactement 4 niveaux** (pas 3, pas 5, exactement 4).

## Les 4 niveaux de progression

### Numérotation
Chaque niveau : `careerLevel` = 1, 2, 3, 4

**Structure** :
- **Niveau 1** : Débutant, apprenti
- **Niveau 2** : Professionnel compétent
- **Niveau 3** : Expert, maître
- **Niveau 4** : Sommité, légende

### Exemples concrets

**Agitateur** :
1. Pamphlétaire (Bronze 1) : Écrit et distribue tracts
2. Agitateur (Bronze 2) : Prend parole en public
3. Fauteur de Troubles (Bronze 3) : Provoque émeutes
4. Démagogue (Bronze 5) : Leader politique influent

**Artisan** :
1. Apprenti Artisan (Bronze 2) : Apprend le métier
2. Artisan (Argent 1) : Membre guilde, autonome
3. Maître artisan (Argent 3) : Enseigne, dirige atelier
4. Maître de guilde (Or 1) : Dirige toute la guilde

**Bourgeois** :
1. Employé (Argent 1) : Travailleur urbain
2. Propriétaire (Argent 3) : Possède affaire
3. Maître Marchand (Argent 5) : Commerce florissant
4. Bourgmestre (Or 2) : Dirigeant municipal

## Statut social par niveau

### Échelle
- **Bronze** (1-5) : Classes laborieuses
- **Argent** (1-5) : Classes moyennes
- **Or** (1-5) : Classes supérieures

### Progression typique
**Modèle ascendant** :
- Niveau 1 : Bronze (1-2)
- Niveau 2 : Bronze supérieur (3-5) ou Argent bas (1-2)
- Niveau 3 : Argent (1-3)
- Niveau 4 : Argent supérieur (3-5) ou Or (1-2)

**Carrières plafonnées** : Certaines ne dépassent jamais Bronze (Mendiant, Ratier).

**Carrières prestigieuses** : D'autres atteignent Or (Artisan, Bourgeois).

**Raison** : Réalisme social, mobilité limitée dans société féodale.

## Contenu par niveau

### Skills
Chaque niveau ajoute nouvelles compétences. Format : Liste textuelle (voir [parsing-wizard-data.md](./parsing-wizard-data.md)).

**Règle** : Compétences s'accumulent. Niveau 2 possède skills niveau 1 + niveau 2.

### Talents
Chaque niveau ajoute talents. Certains avec "(Au choix)" (voir [pattern-specialisations.md](../patterns/pattern-specialisations.md)).

### Trappings
Chaque niveau fournit équipement.

**Évolution** : Niveau 1 = base, Niveau 4 = prestige (atelier, guilde, mécène).

### Characteristics
Chaque niveau permet d'améliorer caractéristiques (voir [parsing-wizard-data.md](./parsing-wizard-data.md)).

## Progression obligatoire

### Séquence linéaire
Personnage DOIT progresser séquentiellement : 1 → 2 → 3 → 4.

**Interdiction** : Passer directement de niveau 1 à 3.

**Raison** : Cohérence narrative (apprentissage progressif) et équilibre gameplay.

### Complétion de niveau
Pour progresser au niveau suivant, acquérir **toutes** compétences, talents et avancées du niveau actuel.

**Exemple** : Pour passer d'Agitateur niveau 2 à niveau 3, avoir appris les 6 skills et 4 talents du niveau 2.

### Changement de carrière
Personnage peut changer de carrière (progression horizontale).

**Règles** :
- Peut quitter carrière à n'importe quel niveau
- Commence nouvelle carrière au niveau 1
- Conserve acquis ancienne carrière
- Coûts XP différents selon similarité

**Exemple** : Agitateur niveau 3 devient Enquêteur niveau 1. Conserve skills/talents d'Agitateur, commence progression Enquêteur.

## Navigation entre niveaux

### Label vs Career
**label** : Nom spécifique du niveau ("Pamphlétaire", "Démagogue")

**career** : Nom de la carrière parente ("Agitateur")

**Usage** :
- Affichage : Montrer `label` (descriptif)
- Regroupement : Utiliser `career` pour lister 4 niveaux
- Progression : Incrémenter `careerLevel` pour niveau suivant

### Affichage hiérarchique
```
Agitateur (Carrière)
├─ Niveau 1: Pamphlétaire (Bronze 1)
├─ Niveau 2: Agitateur (Bronze 2)
├─ Niveau 3: Fauteur de Troubles (Bronze 3)
└─ Niveau 4: Démagogue (Bronze 5)
```

## Cas d'usage

### Création personnage
Joueur choisit "Artisan" → Système trouve `career="Artisan"` ET `careerLevel=1` → Démarre "Apprenti Artisan" avec skills/talents/trappings niveau 1.

### Progression en jeu
Personnage "Artisan" (niveau 2) acquiert tout du niveau 2 → Dépense XP → Devient "Maître artisan" → Débloque niveau 3.

### Consultation progression
Interface affiche 4 niveaux de carrière actuelle → Joueur voit compétences/talents futurs → Planifie XP.

## Validation

**Cohérence données** :
- Exactement 4 CareerLevels par carrière
- `careerLevel` = 1, 2, 3, 4 (séquentiel)
- Tous CareerLevels d'une carrière ont même `career`
- Un seul CareerLevel par `careerLevel` (pas doublons)

## Références croisées

- [careers.md](../database/careers.md) - Table carrières
- [careerLevels.md](../database/careerLevels.md) - Table niveaux
- [parsing-wizard-data.md](./parsing-wizard-data.md) - Parsing skills/talents/characteristics
