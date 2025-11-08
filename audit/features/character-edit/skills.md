# Character Edit - Ajout/Suppression Compétences

## Vue d'ensemble

La gestion des compétences permet d'ajouter de nouvelles compétences à un personnage, de les supprimer, et de modifier leurs avances. Chaque compétence est liée à une caractéristique et peut avoir des spécialisations.

## Structure d'une compétence

### Composants

Chaque compétence stocke :
- **ID** : Identifiant unique de la compétence
- **Avances d'espèce** : Bonus initial de la race (specie)
- **Avances de carrière** : Bonus de progression professionnelle (career)
- **Avances permanentes** : Points dépensés en XP (advance)
- **Avances temporaires** : Points non validés (tmpadvance)
- **Spécialisation** : Si applicable (spec)
- **Origines** : Liste des sources (espèce, carrières, talents)

### Calculs

**Valeur de base** = caractéristique associée totale

**Avances totales** = specie + career + advance + tmpadvance

**Valeur finale** = base + avances totales

**Bonus** = floor(valeur finale / 10)

## Ajout d'une compétence

### Types de compétences

- **Base** : Disponibles pour tous, ajoutées automatiquement via `getAllSkills()`
- **Avancées** : Acquises par carrière, espèce ou talent

### Spécialisations

Trois formats possibles :
- **Specs fixes** : Liste définie (Langue: Bretonnien, Reikspiel, etc.)
- **"Au choix"** : Libre saisie
- **Sans spec** : Compétence générique

Chaque spécialisation crée une instance séparée avec ses propres avances.

### Recherche et déduplication

Avant ajout, `searchSkill()` vérifie l'existence (ID + spec). Si trouvée, fusion des origines. Sinon, création d'une nouvelle instance.

## Suppression d'une compétence

### Nettoyage automatique

`deleteEmpty()` supprime les compétences avec `getAdvance() === 0` pour éviter l'encombrement.

### Suppression manuelle

Réinitialiser toutes les avances à 0. Le prochain nettoyage la retirera.

### Compétences liées à des talents

Gestion automatique par `applyTalent()` : ajout quand talent acquis, suppression quand talent perdu.

## Modification des avances

### Édition inline

Modification de `tmpadvance` pour tester, puis `saveAdvance()` transfère vers `advance`.

### Avances automatiques (non éditables)

- **career** : Calculées selon niveaux de carrière franchis
- **specie** : Bonus raciaux fixes définis à la création (Nain: +10 Résistance alcool, Elfe: +10 Perception)

## Spécialisations multiples

Chaque spécialisation = instance séparée (Langue: Bretonnien, Reikspiel, Eltharin = 3 instances distinctes).

`searchSkill()` paramètre `strict` :
- **true** : Toutes specs doivent correspondre
- **false** : Première instance trouvée (gère "Au choix")

## Coût en XP

Dépend du niveau actuel, cible, et appartenance carrière (x1 en carrière, x2 hors carrière). `Helper.getXPCost()` calcule le coût progressif.

`saveAdvance()` : calcul coût, application multiplicateur, log XP, mise à jour xp.used.

## Origines et traçabilité

Tableau `origins` : IDs de carrière, espèce, ou "talent". Les origines s'accumulent si multiples sources.

Format spécial avec "|" : "vagabond_1|base" (carrière + métadonnées). `hasOrigin()` gère le split.

## Affichage

`getSymbol()` : Icône du niveau de carrière source.

Label : Nom + (spécialisation) + symbole. Ex: "Langue (Reikspiel)" + icône rang 1.

## Relation caractéristiques

Base = valeur totale de la caractéristique associée. Changement de caractéristique → recalcul automatique de toutes les compétences liées.

Affichage caractéristique liste les compétences de carrière qui l'utilisent.

## Exemple concret

### Scénario : Ajout de Commandement

**Situation initiale**
Le personnage n'a pas la compétence Commandement.

**Ajout**
1. L'utilisateur sélectionne "Ajouter compétence"
2. Recherche : `searchSkill("Commandement", "", true, "", false)` → false
3. Création : `createSkill(CharGen.allSkills["commandement"])`
4. Initialisation :
   - advance: 0
   - tmpadvance: 0
   - specie: 0
   - career: 0 (si pas dans la carrière)
   - origins: []
5. Ajout : `setSkill(nouvelleCompetence)`

**Modification**
1. Utilisateur ajoute +5 en tmpadvance
2. Coût XP calculé : 100 XP (hors carrière, donc x2)
3. Validation : `saveAdvance()`
   - advance passe à 5
   - Log : "Compétence: Commandement 0 => 5" : -100
   - xp.used += 100

## Relations avec autres composants

- **[Caractéristiques](./characteristics.md)** : Base de calcul des compétences
- **[Talents](../wizard/talents.md)** : Certains talents ajoutent des compétences
- **[Carrière](../wizard/career.md)** : Source principale de compétences
- **[Espèce](../wizard/species.md)** : Fournit compétences et bonus initiaux
- **[Expérience](../wizard/experience.md)** : Coût d'amélioration des compétences
