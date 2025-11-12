# Species - Table de données

## Vue d'ensemble

La table Species stocke les races jouables de Warhammer Fantasy Roleplay et leurs variantes régionales. Chaque entrée représente une race spécifique (Humain, Nain, Elfe, Halfling, etc.) avec ses caractéristiques, compétences et talents de départ.

**Objectif métier** : Fournir les données de base pour la création de personnage selon la race choisie.

## Structure des données

### Champs d'identification
- **index** : Numéro unique d'identification
- **label** : Nom complet de la race/variante (ex: "Humains (Reiklander)", "Nains", "Hauts elfes")
- **book** : Livre source (LDB, Middenheim, AA, ADE3, SOC, Salzemund)
- **page** : Page dans le livre source

### Champs de référence (Relations)
- **refChar** : Référence vers les caractéristiques (voir [characteristics.md])
- **refCareer** : Référence vers les carrières disponibles (voir [careers.md])
- **refDetail** : Référence vers les détails physiques (voir [details.md])

### Données de génération
- **rand** : Valeur de probabilité pour génération aléatoire (Humains: 90, Nains: 97, Hauts elfes: 99, Elfes sylvains: 100)

### Données descriptives
- **desc** : Description narrative en HTML (contexte culturel, apparence, "Points de vue" sur autres races, règles spécifiques)
- **skills** : Liste textuelle des compétences raciales (nécessite parsing)
- **talents** : Liste textuelle des talents raciaux (nécessite parsing)

## Types de races disponibles

### Humains (13 variantes)
Reikland: Reiklander (défaut LDB) | Middenland: Middenheim, Middenland, Nordland, Salzenmunder | Altdorf: South Banker, Eastender, Hexxerbezrik, Docklands | Norse: Bjornling, Sarl, Skaeling | Autres: Tiléens
**Caractéristiques communes** : refChar="Humain", refDetail="Humain", refCareer variable, rand=90

### Halflings (12 variantes)
Standard, Cendreplaine, Basseronce, Tuilecaramel, Piedfoin, Piedpaille, Piedfoin-Piedpaille, Pochégarée, Havrebas, Rumster, Bordécharde, Pavéderonces, Fraisedébois

### Nains (5 variantes)
Standard (LDB), Altdorfer, Norse, Cragforge Clan, Grumsson Clan
**Caractéristiques communes** : refChar="Nain", refDetail="Nain", refCareer="Nain", rand=97

### Elfes
**Hauts elfes** : Asur d'Ulthuan (marchands, diplomates) | **Elfes sylvains** : Asrai d'Athel Loren et Éonirs de Laurelorn

### Races rares
Gnomes, Ogres

## Génération aléatoire

### Principe de pondération
Le champ `rand` ne représente PAS une probabilité directe mais un **seuil maximal**. Les species sont ordonnées par `rand` croissant. Plus le `rand` est bas, plus la race est courante.

### Algorithme de sélection
**Processus** :
1. Générer un nombre aléatoire entre 1 et 100 (inclusive)
2. Parcourir les species dans l'ordre du fichier (ordre croissant de `rand`)
3. Sélectionner la première species où `rand >= valeur_aléatoire`

**Exemple concret** :
- Aléatoire = 45 → Humain sélectionné (car rand=90 et 90 >= 45)
- Aléatoire = 95 → Nain sélectionné (car rand=97 et 97 >= 95)
- Aléatoire = 99 → Haut Elfe sélectionné (car rand=99 et 99 >= 99)
- Aléatoire = 100 → Elfe Sylvain sélectionné (car rand=100 et 100 >= 100)

### Probabilités réelles
Les probabilités se calculent par ranges entre les valeurs de `rand` :
- **Humains** (rand=90) : 1-90 → **90% de chances**
- **Nains** (rand=97) : 91-97 → **7% de chances**
- **Hauts elfes** (rand=99) : 98-99 → **2% de chances**
- **Elfes sylvains** (rand=100) : 100 → **1% de chances**

### Gestion des variantes (même rand)
**Problème** : Plusieurs species peuvent avoir le même `rand` (ex: toutes les variantes d'Humains ont rand=90)

**Solution** :
1. L'algorithme trouve TOUTES les species avec le même `rand` que la species sélectionnée
2. Ces species sont stockées comme choix possibles
3. Le joueur peut choisir parmi ces variantes (ou une seule est imposée aléatoirement)

**Exemple** :
- Aléatoire = 50 → rand=90 (Humains)
- Variantes disponibles : Reiklander, Middenheim, Middenland, Nordland, Tiléens, Altdorfer (4 variantes), Norse (3 variantes) = 13 choix
- Le système propose ces 13 variantes au joueur

### Affichage des ranges
Pour l'interface utilisateur, les ranges sont calculés dynamiquement :
- Première species : min=1, max=rand
- Species suivantes : min=(rand_précédent)+1, max=rand_actuel
- Groupement par refDetail pour affichage hiérarchique

**Exemple d'affichage** :
- Humain : 1-90 (avec sous-variantes : Reiklander, Middenheim, etc.)
- Nain : 91-97 (avec sous-variantes : Standard, Altdorfer, Norse, etc.)
- Haut Elfe : 98-99
- Elfe Sylvain : 100

### Bonus XP pour génération aléatoire
**Règle métier** : Le joueur reçoit **+20 XP** s'il accepte le premier résultat aléatoire sans relancer ou choisir manuellement

**Raison** : Récompenser le choix aléatoire et l'acceptation du destin du personnage (fidèle à l'esprit du jeu de rôle)

**États de génération** :
- `randomState.specie = 0` : Génération non lancée (bouton "Lancer" actif)
- `randomState.specie = 1` : Génération lancée et acceptée (+20 XP)
- `randomState.specie = -1` : Choix manuel activé (bouton "Choisir")
- `randomState.specie = -2` : Sélection finalisée (sauvegardée)

## Relations avec autres tables

### 1. Relation avec Careers (via refCareer)
**Objectif** : Filtrer les carrières disponibles pour une race
**Fonctionnement** : Une entrée career contient un champ `rand` avec des clés de races. La species indique quelle clé utiliser via `refCareer`. Exemple : Humain (Middenheim) → refCareer="Middenheim" → filtre les careers où `rand["Middenheim"]` existe
**Cas d'usage** : Génération aléatoire de carrière, affichage des carrières disponibles lors de la création
**Voir** : [careers.md] pour détails sur le filtrage

### 2. Relation avec Characteristics (via refChar)
**Objectif** : Déterminer les valeurs de base et modificateurs des caractéristiques
**Fonctionnement** : La table characteristics contient un champ `rand` avec les valeurs par race (exemples: "Humain", "Nain", "Haut Elfe", "Elfe Sylvain")
**Données extraites** : Valeurs de base (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc) et type de jet (+2d10)
**Voir** : [characteristics.md] pour valeurs par race

### 3. Relation avec Details (via refDetail)
**Objectif** : Calculer âge, taille, couleur yeux/cheveux
**Fonctionnement** : La table details contient des formules spécifiques par race
**Types de détails** : Age Base, Age Roll (ex: "+2d10 ans"), Height Base, Height Roll (ex: "+2d10 cm"), Couleur des yeux (table probabilités), Couleur des cheveux (table probabilités)
**Exemple concret (Humain)** : Age Base + 2d10 ans, Height Base + 2d10 cm (règle spéciale : si 10, relancer un dé supplémentaire)
**Voir** : [details.md] pour formules complètes

### 4. Relation avec Skills (parsing requis)
**Objectif** : Attribuer les compétences raciales au personnage
**Format stocké** : Chaîne de caractères avec virgules
Exemple: "Calme, Charme, Commandement, Corps à corps (Base), Évaluation..."
**Cas particuliers** : Compétences avec choix ("Langue (Au choix)", "Métier (Au choix)"), compétences avec spécialisation ("Corps à corps (Escrime)", "Projectiles (Arc)")
**Parsing nécessaire** : Conversion de la chaîne en liste d'éléments référençant la table skills
**Voir** : [skills.md], [parsing-wizard-data.md] et ticket #003 pour règles de parsing

### 5. Relation avec Talents (parsing requis)
**Objectif** : Attribuer les talents raciaux au personnage
**Format stocké** : Chaîne de caractères avec virgules
Exemple: "Perspicace ou Affable, Destinée, 3 Talent aléatoire"
**Cas particuliers** : Choix exclusifs ("Perspicace ou Affable"), talents multiples aléatoires ("3 Talent aléatoire"), talents avec choix ("Savoir-vivre (Au choix)")
**Parsing nécessaire** : Conversion de la chaîne en liste d'éléments avec gestion des choix
**Voir** : [talents.md], [parsing-wizard-data.md] et ticket #003 pour règles de parsing

## Cas d'usage métier

### Création de personnage - Étape 1 : Sélection de race
**Objectif** : Permettre au joueur de choisir sa race
**Options** : 1) Sélection manuelle (liste triée par label) 2) Génération aléatoire (utilise champ `rand`, voir ticket #002)
**Données affichées** : Label, description (desc), compétences (skills), talents (talents), carrières disponibles (via relation careers), caractéristiques de base (via relation characteristics)

### Filtrage de carrières disponibles
**Objectif** : Limiter les carrières selon la race choisie
**Processus** : 1) Récupérer `refCareer` de la species 2) Filtrer les careers où `rand[refCareer]` existe 3) Afficher uniquement ces carrières
**Exemple** : Species "Humains (Middenheim)" → refCareer="Middenheim" → Careers avec rand["Middenheim"] défini

## Points d'attention

### Différence entre variantes régionales
Les variantes d'une même race partagent : même refChar (valeurs caractéristiques identiques), même refDetail (formules âge/taille identiques), mais skills et talents DIFFÉRENTS selon région/culture.
**Exemple** : Tous les Humains ont les mêmes caractéristiques de base, mais les Middenheimers ont des compétences urbaines alors que les Middenländers ont des compétences de survie.

### Données manquantes (desc vide)
Certaines variantes n'ont pas de description et héritent de la race de base. Seuls skills et talents diffèrent. Exemples: "Humains (Tiléens)", "Nains (Altdorfer)"

### Cross-références nécessaires
Pour exploiter pleinement une species, accéder à : [careers.md] (carrières disponibles), [characteristics.md] (valeurs de base), [details.md] (formules âge/taille), [skills.md] (compétences après parsing), [talents.md] (talents après parsing)

## Tests de cohérence

### Intégrité référentielle
**Test 1-3** : `refChar`, `refCareer`, `refDetail` pointent vers entrées existantes
**Test 4** : `book` référencent livres valides (LDB, Middenheim, AA, ADE3, SOC, Salzemund)

### Validations génération aléatoire
**Test 5** : Valeurs `rand` ordonnées croissantes (ex: 90, 97, 99, 100)
**Test 6** : Pas de doublons `rand` pour races différentes (variantes même race OK)
**Test 7** : Ranges cumulatifs couvrent 1-100 sans trous
**Test 8** : Probabilités cohérentes (sum ≈ 100%)

### Parsing/Descriptions/Limites
**Test 9-13** : Skills/talents parsables, existent dans tables, spécialisations valides, "X Talent" numérique
**Test 14-15** : HTML bien formé, liens vers entités existantes
**Test 16-18** : Races rares complètes, variantes héritent, âge/taille dans limites biologiques
**Test 19-20** : Création E2E, export/import préserve données

## Validation des données

### Champs obligatoires / Contraintes
**index** (unique, 0,1,2...), **label** (unique, 3-50 car), **refChar/refCareer/refDetail** (strings), **rand** (1-100, croissant), **skills/talents** (parsing valide, voir [parsing-wizard-data.md]), **book** (LDB/Middenheim/AA/ADE3/SOC/Salzemund), **page** (1-999)
**desc** (optionnel, HTML valide, vide OK pour variantes)

### Règles inter-champs
**Règle 1** : Si desc vide, alors label doit indiquer variante (ex: "Humains (Tiléens)")
**Règle 2** : Variantes même race ont même refChar/refDetail, refCareer peut différer
**Règle 3** : Races rares (Gnomes, Ogres) doivent avoir desc non vide

### Messages d'erreur métier
**Manquant refChar** : "Impossible de déterminer les caractéristiques pour {label}" | **Parsing skills échoue** : "Compétences raciales mal formatées pour {label} : {skills}" | **rand désordonnées** : "Probabilités de génération incohérentes : {label} ({rand}) après {label_précédent} ({rand_précédent})" | **desc vide sans variante** : "Description manquante pour la race principale {label}"
