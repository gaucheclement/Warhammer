# Classes - Table de données

## Vue d'ensemble

La table Classes stocke les 10 classes sociales regroupant les carrières dans Warhammer Fantasy Roleplay. Chaque classe représente un groupe socio-professionnel avec son équipement initial et son positionnement social.

**Objectif métier** : Organiser les carrières par catégorie sociale et définir l'équipement de départ commun à toutes les carrières de cette classe.

## Structure des données

### Champs d'identification
- **index** : Numéro unique (0 à 9)
- **label** : Nom de la classe (ex: "Citadins", "Courtisans", "Guerriers")
- **book** : Livre source (LDB, SOC, EDO)
- **page** : Page dans le livre source

### Champs descriptifs
- **desc** : Description narrative du groupe social (statut, mobilité sociale, rôle dans la société)
- **trappings** : Liste d'équipements de départ fournis à toutes les carrières de cette classe

## Typologie des classes

### Classes jouables (9)

**Citadins** : Habitants des villes et cités, classe moyenne respectueuse des lois. Gagnent convenablement leur vie.

**Courtisans** : Dirigeants ou fournisseurs de services spécialisés. Statut élevé avec accès à des postes d'influence.

**Guerriers** : Combattants qualifiés utilisant leurs prouesses physiques. Origines variées, statut élevé ou inférieur.

**Itinérants** : Voyageurs gagnant leur vie sur les routes. Majoritairement classe inférieure avec possibilités d'ascension.

**Lettrés** : Érudits utilisant leur éducation. Seuls à savoir lire et écrire. Statut initial inférieur, positions importantes accessibles.

**Riverains** : Vivant et travaillant sur les rivières et voies navigables. Statut inférieur avec opportunités vers une vie confortable.

**Seafarers** : Marins et gens de mer (extension SOC). Pas de description fournie dans les données.

**Roublards** : Habitants urbains vivant d'activités illégales ou peu recommandables. Classe inférieure sans accès au statut élevé.

**Ruraux** : Habitants des fermes, villages et campagnes. Classe inférieure avec possibilité d'influence locale significative.

### Classe non-jouable (1)

**Chaos** : Carrières interdites liées au Chaos. Aucun équipement de départ. Cas particulier système.

## Système d'équipement de départ

### Principe
Chaque classe définit un **set d'équipements communs** fourni à toutes les carrières appartenant à cette classe. Les carrières individuelles ajoutent ensuite leurs équipements spécifiques via leurs career levels.

### Format trappings
Liste textuelle séparée par virgules : "Cape, Vêtements, Dague, Bourse, Besace, Flasque (Alcool)"

### Exemples concrets

**Citadins** : "Cape, Vêtements, Dague, Chapeau, Bourse, Besace, Déjeuner"
- Équipement urbain de base pour Agitateur, Artisan, Bourgeois, etc.

**Guerriers** : "Vêtements, Arme simple, Dague, Bourse"
- Équipement de combat minimal pour Soldat, Mercenaire, Pistolier, etc.

**Lettrés** : "Vêtements, Dague, Bourse, Besace, Nécessaire d'écriture, Feuille de parchemin (1d10)"
- Outils intellectuels pour Apprenti sorcier, Érudit, Scribe, etc.

**Itinérants** : "Cape, Vêtements, Dague, Bourse, Sac à dos, Boîte à amadou, Couverture, Ration (Multiple)"
- Équipement de voyage pour Charlatan, Colporteur, Messager, etc.

**Roublards** : "Vêtements, Dague, Bourse, Besace, Bougie (2), Alumette (1d10), Capuchon ou Masque"
- Équipement furtif pour Criminel, Escroc, Receleur, etc.

**Chaos** : "Rien"
- Aucun équipement pour carrières interdites

### Parsing des trappings
La chaîne textuelle est parsée en liste d'objets trapping. Notation "(Multiple)" ou "(1d10)" indique quantité variable.

## Relations avec autres tables

### Relation vers Careers
**Type** : One-to-Many
**Lien** : `careers.class` (texte) → `classes.label` (texte)
**Usage** : Chaque carrière appartient à UNE classe sociale

### Relation vers Trappings
**Type** : Many-to-Many (via parsing)
**Lien** : `classes.trappings` (texte parsé) → table trappings
**Usage** : Résolution des noms d'équipements en objets trappings complets

### Relation vers CareerLevels
**Type** : Indirecte via Careers
**Lien** : Classes → Careers → CareerLevels
**Usage** : Les career levels ajoutent équipements spécifiques aux équipements de classe

### Référencé par
- Fichier KB `careers.md` : Explique la classification par classe
- Fichier KB `careerLevels.md` : Accumulation équipements de base + niveaux
- Fichier KB `trappings.md` : Liste des équipements disponibles

## Règles métier

### Affichage des descriptions
Les descriptions de classe sont affichées avec :
1. Description narrative du groupe social
2. Liste des carrières disponibles dans cette classe (via matching)
3. Liste des équipements de départ formatée en HTML

### Contraintes de données
- **label** : Unique, utilisé comme clé de relation textuelle
- **trappings** : Parsing requis pour résolution en objets
- **desc** : Peut contenir HTML, applique système d'aide contextuelle
- **index** : Séquentiel 0-9

### Classes vides ou incomplètes
- **Seafarers** : Description vide dans les données source
- **Chaos** : Trappings = "Rien", description vide, cas système

### Livre source et pagination
- **LDB** : Livre de Base (8 classes principales, page 31)
- **SOC** : Sea of Claws (Seafarers, page 63)
- **EDO** : Enemy in Darkness Oath (Chaos, page 77)

## Volumétrie et couverture

**Total** : 10 classes
**Avec description complète** : 8 classes
**Sans description** : 2 classes (Seafarers, Chaos)
**Taille fichier** : 4 KB

## Règles de validation

### Obligatoires
- index : Entier 0-9
- label : Chaîne non vide
- book : Code livre (LDB, SOC, EDO)
- page : Numéro de page

### Optionnels mais attendus
- desc : Texte descriptif (vide pour Seafarers et Chaos)
- trappings : Liste équipements (vide uniquement pour Chaos = "Rien")

### Cohérence référentielle
- Toutes les carrières doivent référencer une classe existante via `careers.class`
- Tous les trappings listés doivent exister dans la table trappings

## Notes importantes

### Différence Classes vs Careers
- **Classes** : 10 groupes sociaux larges (Citadins, Guerriers, etc.)
- **Careers** : 117 métiers spécifiques (Agitateur, Soldat, etc.)
- Une classe contient plusieurs carrières, une carrière appartient à une classe

### Équipement cumulatif
L'équipement final d'un personnage = Équipement de classe + Équipement du career level 1 + Équipement des progressions

### Usage en création de personnage
1. Joueur choisit espèce
2. Système filtre carrières accessibles
3. Joueur choisit carrière
4. Système attribue équipements : classe + career level initial

### Classes et mobilité sociale
Les descriptions indiquent les possibilités d'ascension sociale :
- Courtisans : Statut déjà élevé
- Lettrés, Itinérants : Démarrent bas, ascension possible
- Roublards : Peuvent gagner argent mais pas statut
- Ruraux : Influence locale seulement
