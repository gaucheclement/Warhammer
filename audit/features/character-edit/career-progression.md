# Character Edit - Progression Carrière

## Vue d'ensemble

La progression de carrière permet au personnage de monter en niveau dans sa carrière actuelle ou de changer de carrière. Chaque niveau débloque de nouvelles compétences, talents, et caractéristiques à améliorer. Le système suit la structure de Warhammer 4e édition avec 4 niveaux par carrière.

## Structure de carrière

### Stockage

Le personnage possède un objet `careerLevel` qui représente son niveau de carrière actuel :
- **id** : Identifiant du niveau (ex: "guerrier_2" pour Guerrier niveau 2)
- **data** : Référence complète au niveau de carrière
- Méthodes : `getLabel()`, `getCareer()`, `getCharacteristics()`, `getTalents()`, `getSkills()`

### Niveaux de carrière

Chaque carrière a 4 niveaux (rangs) :
1. Niveau 1 : Entrée dans la carrière
2. Niveau 2 : Progression intermédiaire
3. Niveau 3 : Maîtrise avancée
4. Niveau 4 : Expertise complète

## Passage au niveau supérieur

### Conditions de progression

Pour passer au niveau supérieur, le personnage doit généralement :
- Compléter un nombre minimum d'avances du niveau actuel
- Remplir les conditions narratives (accomplissement, temps de formation, etc.)

Les règles exactes de validation ne sont pas implémentées dans le code fourni mais font partie de la logique métier.

### Changement de niveau

Pour faire passer un personnage au niveau supérieur :
1. Récupérer le niveau suivant : `CharGen.data.careerLevel.allByCareer[carriere][niveau+1]`
2. Appeler `setCareerLevel(nouveauNiveau)`
3. Application automatique des avantages du nouveau niveau

### Application des avantages

Lors du changement de `careerLevel`, la méthode `setCareerLevel()` met à jour :
- Les caractéristiques de carrière via `getCharacteristics()`
- Les talents de carrière via `getTalents()`
- Les compétences de carrière via `getSkills()`

Chaque élément voit ses `origins` enrichies avec l'ID du nouveau niveau.

## Changement de carrière

### Choix d'une nouvelle carrière

Le personnage peut changer de carrière selon les règles :
- Carrières de sortie recommandées dans la carrière actuelle
- Validation par le MJ selon la narration
- Respect des pré-requis éventuels

### Processus de changement

1. Sélection de la nouvelle carrière
2. Détermination du niveau d'entrée (généralement 1, parfois niveau supérieur si carrière liée)
3. `setCareerLevel(nouvelleCarriere_niveau)`
4. Application des avantages de la nouvelle carrière

### Impact sur les avances

Les avances existantes restent sur le personnage :
- Les compétences gardent leurs avances même si plus dans la carrière
- Les talents conservés gardent leurs rangs
- Les caractéristiques maintiennent leurs améliorations

Cependant, les **coûts XP changent** : améliorer une compétence/talent hors carrière coûte x2.

## Validation des pré-requis

### Pré-requis de carrière

Certaines carrières avancées ont des pré-requis :
- Niveau minimum dans une carrière spécifique
- Caractéristique minimale
- Talent requis
- Compétence requise

La validation doit vérifier ces conditions avant d'autoriser le changement.

### Blocage ou avertissement

Si les pré-requis ne sont pas remplis :
- **Blocage strict** : Changement refusé
- **Avertissement** : Changement permis avec notification au joueur/MJ

Le mode choisi dépend de la configuration du système.

## Application des avantages de niveau

### Caractéristiques de carrière

Chaque niveau de carrière liste des caractéristiques à améliorer. `getCharacteristics()` :
1. Récupère la liste via `this.data.getCharacteristics()`
2. Pour chaque caractéristique, cherche ou crée l'instance sur le personnage
3. Ajoute l'ID du niveau de carrière aux `origins`

Ces caractéristiques peuvent ensuite être améliorées au coût standard (x1).

### Talents de carrière

`getTalents()` :
1. Récupère les talents du niveau via `this.data.getTalents()`
2. Pour chaque talent :
   - Cherche s'il existe déjà (`searchTalent`)
   - Si non, le crée (`createTalent`)
   - Ajoute l'ID de carrière aux `origins`
3. Gère les talents secondaires ajoutés par d'autres talents (via `addTalent`)

### Compétences de carrière

`getSkills()` :
1. Récupère la liste via `this.data.getSkills()`
2. Utilise `Helper.getSkills()` pour traiter les spécialisations et choix
3. Ajoute l'ID de carrière aux `origins` de chaque compétence
4. Trie les compétences via `Helper.sort()`

## Symboles et affichage

### Symbole de rang

Chaque niveau de carrière a un symbole visuel (icône) indiquant le rang (1, 2, 3, 4). Ce symbole est affiché :
- À côté du nom de la carrière
- Sur les compétences/talents débloqués par ce niveau (via `getSymbol()`)

### Historique de carrière

Si le personnage change de carrière, son historique peut être conservé :
- Liste des carrières passées
- Niveaux atteints dans chaque carrière
- Ordre chronologique des changements

Cela enrichit le background et permet de tracer la progression.

## Exemple concret

### Scénario : Passage de Guerrier 2 à Guerrier 3

**État initial**
- Carrière : Guerrier niveau 2
- careerLevel.id : "guerrier_2"

**Progression**
Le personnage a complété suffisamment d'avances. Le joueur demande la progression.

**Changement**
1. Récupération : `CharGen.data.careerLevel.allByCareer["guerrier"][3]`
2. `setCareerLevel(guerrier_3)`
3. Application :
   - Nouvelles caractéristiques de rang 3 ajoutées avec origin "guerrier_3"
   - Nouveaux talents de rang 3 ajoutés
   - Nouvelles compétences de rang 3 ajoutées

**Résultat**
- careerLevel.id : "guerrier_3"
- Les compétences/talents des niveaux 1, 2, 3 ont tous leurs origins respectives
- Le personnage peut améliorer les nouveaux éléments au coût standard (x1)

### Scénario : Changement de Guerrier 4 à Champion 1

**État initial**
- Carrière : Guerrier niveau 4 (carrière complétée)

**Changement**
Le personnage choisit Champion (carrière de sortie recommandée).

**Processus**
1. Sélection : Champion niveau 1
2. `setCareerLevel(CharGen.allCareersLevels["champion_1"])`
3. Application :
   - Caractéristiques de Champion 1 ajoutées
   - Talents de Champion 1 ajoutés
   - Compétences de Champion 1 ajoutées

**Impact XP**
- Compétences/talents de Guerrier : Coût x2 (hors carrière)
- Compétences/talents de Champion : Coût x1 (en carrière)

## Relations avec autres composants

- **[Caractéristiques](./characteristics.md)** : Débloquées par niveaux de carrière
- **[Compétences](./skills.md)** : Débloquées par niveaux de carrière
- **[Talents](./talents.md)** : Débloqués par niveaux de carrière
- **[Expérience](./xp-history.md)** : Coût XP dépend de l'appartenance à la carrière
- **[Base de données carrières](../../database/careers.md)** : Référentiel des carrières
