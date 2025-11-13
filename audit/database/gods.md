# Gods - Table de données

## Vue d'ensemble

La table Gods stocke les divinités du Vieux Monde et leurs attributs religieux. Chaque entrée représente une divinité spécifique avec ses sphères d'influence, adorateurs, bénédictions divines et miracles.

**Objectif métier** : Fournir les données religieuses pour la sélection de divinité lors de la création de personnage et déterminer les bénédictions/miracles disponibles aux prêtres.

## Structure des données

### Champs d'identification
- **index** : Numéro unique d'identification (0-15)
- **label** : Nom de la divinité (ex: "Manann", "Sigmar", "Verena")
- **title** : Titre descriptif (ex: "Dieu de la mer", "Dieu de l'Empire", "Déesse de la sagesse")
- **book** : Livre source (LDB, ADE3, SOC, NADJ)
- **page** : Page dans le livre source

### Données descriptives
- **desc** : Description narrative en HTML contenant sphères d'influence, adorateurs, offrandes, siège du pouvoir, chef du culte, ordres principaux, festivités, livres sacrés, symboles, mythologie, commandements

### Données mécaniques
- **blessings** : Liste textuelle des bénédictions divines (nécessite parsing vers table spells)
- **miracles** : Liste textuelle des miracles spécifiques (nécessite parsing vers table spells, peut être vide)

## Divinités disponibles

### Dieux majeurs de l'Empire (LDB)
**Manann** (Dieu de la mer) : Mers, océans, marins, pêcheurs | **Morr** (Dieu de la mort) : Mort, rêves, fossoyeurs, chasseurs de morts-vivants | **Myrmidia** (Déesse de la stratégie) : Stratégie martiale, estaliens, tiléens | **Ranald** (Dieu de la ruse) : Duperie, voleurs, chance, pauvres | **Rhya** (Déesse de la fertilité) : Fertilité, vie, été, fermiers | **Shallya** (Déesse de la miséricorde) : Miséricorde, guérison, pauvres, médecins | **Sigmar** (Dieu de l'Empire) : Empire, Reikland, unité impériale | **Taal** (Dieu de la nature) : Régions sauvages, printemps, forestiers | **Ulric** (Dieu de la guerre) : Guerre, hiver, loups, guerriers | **Verena** (Déesse de la sagesse) : Apprentissage, justice, érudits

### Divinités mineures et régionales
**Handrich** (ADE3) : Commerce et richesse | **Solkan** (ADE3) : Justice vengeresse | **Stromfels** (SOC) : Pirates, naufrageurs, requins (culte hérétique)

### Divinités gnomes (NADJ)
**Evawn** (Déesse des voyages) : Voyage, commerce, vol | **Mabyn** (Déesse des ombres) : Ombres, vengeance, magie | **Ringil** (Dieu du divertissement) : Divertissement, espionnage, tromperie

## Format des descriptions

### Structure HTML standardisée
Toutes les descriptions suivent un patron structuré avec balises HTML :
- **Sphères** : Domaines d'influence et régions patronnées
- **Adorateurs** : Types de fidèles principaux
- **Offrandes** : Dons traditionnels au dieu
- **Siège du pouvoir** : Localisation du temple principal
- **Chef du Culte** : Titre du dirigeant religieux
- **Principaux Ordres** : Ordres religieux et templiers
- **Festivités majeures** : Célébrations religieuses
- **Livres sacrés populaires** : Textes religieux
- **Symboles sacrés courants** : Iconographie
- **Sections narratives** : Les adorateurs, Les sites sacrés, Les pénitences
- **Commandements** : Liste à puces des règles religieuses

### Variations pour divinités mineures
Certaines divinités (Handrich, Solkan, Stromfels) ont descriptions vides car détails dans livres source. Divinités gnomes ont format simplifié (sphères, adorateurs, commandements seulement).

## Parsing des bénédictions et miracles

### Bénédictions (champ blessings)
**Format stocké** : Chaîne de caractères avec virgules séparant les noms de bénédictions
**Exemples** : "Bénédiction de Bataille, Bénédiction de Courage, Bénédiction de Droiture"

**Parsing nécessaire** : Conversion en liste d'éléments référençant table spells avec type "Bénédiction"
**Nombre de bénédictions** : Toujours 6 bénédictions par divinité

### Miracles (champ miracles)
**Format stocké** : Chaîne de caractères avec point-virgule + espace ('; ') séparant les noms de miracles OU chaîne vide

**Algorithme de parsing** :
1. Si miracles non vide : Split par '; ' et créer références vers table spells
2. Si miracles vide : Rechercher dans table spells les entrées de type "Invocation" avec spec égal au label du dieu
3. Retourner liste de références vers éléments spell

**Exemples** :
- Evawn : "Invitation; Abri de Rhya; Riche, pauvre, mendiant, voleur"
- Manann : "" (vide, donc recherche Invocations de Manann dans table spells)

## Relations avec autres tables

### 1. Relation avec Spells (blessings et miracles)
**Objectif** : Lister les bénédictions et miracles accordés par la divinité aux prêtres
**Fonctionnement** : Les champs blessings et miracles contiennent noms de sorts. Ces noms sont résolus en références vers table spells
**Types de sorts** : Bénédictions (type "Bénédiction"), Miracles (type "Invocation" avec spec = nom du dieu)
**Voir** : [spells.md] pour structure complète des sorts divins

### 2. Relation avec Careers (implicite)
**Objectif** : Certaines carrières requièrent ou favorisent une divinité
**Fonctionnement** : Les careers de prêtres (Prêtre, Prêtre guerrier, Initié) filtrent les sorts disponibles selon le dieu choisi
**Exemple** : Prêtre de Sigmar ne peut apprendre que les bénédictions de Sigmar
**Voir** : [careers.md] pour carrières religieuses

### 3. Relation avec Lores (pour miracles)
**Objectif** : Organiser les miracles par domaine magique
**Fonctionnement** : Certains miracles sont organisés en lores (domaines de magie divine)
**Voir** : [lores.md] pour organisation des sorts divins

## Cas d'usage métier

### Création de personnage - Sélection de divinité
**Objectif** : Permettre au joueur de choisir son dieu patron
**Contexte** : Étape 7 du wizard (WizardStep7Details)
**Données affichées** : Label, title, desc (description complète), liste des commandements

**Critères de choix** :
- Alignement avec carrière (prêtres doivent choisir divinité compatible)
- Préférences culturelles (Sigmar populaire dans Empire, Ulric dans Middenland)
- Race (divinités gnomes pour gnomes uniquement)

### Détermination des sorts disponibles
**Objectif** : Lister les bénédictions et miracles qu'un prêtre peut apprendre
**Processus** :
1. Récupérer blessings du dieu choisi
2. Parser en liste de références vers spells
3. Récupérer miracles (parsing ou recherche dans spells)
4. Filtrer selon niveau de carrière et restrictions

### Affichage de description
**Objectif** : Présenter informations sur une divinité
**Données affichées** :
- Section "Info" : desc parsé avec liens vers autres entités (lores, autres dieux)
- Section "Miracles" : Liste des bénédictions + liste des miracles (si non vide)

**Rendering** : HTML avec balises `<b>`, `<br>`, `<ul>`, `<li>`, `<h3>` convertis en format lisible

## Points d'attention

### Différence entre bénédictions et miracles
**Bénédictions** : Sorts mineurs accessibles aux prêtres d'un dieu (6 par divinité)
- **Acquisition** : Le talent "Béni (Dieu)" donne **TOUTES les bénédictions du dieu gratuitement** (les 6 listées dans le champ blessings)
- Acquises immédiatement à l'obtention du talent, aucun coût XP

**Miracles** : Sorts puissants spécifiques à certaines divinités, nécessitent rituels ou conditions spéciales
- **Acquisition** : Le talent "Invocation (Dieu)" donne **accès** aux miracles du dieu
- Chaque miracle doit être **acheté individuellement avec XP** (comme les sorts arcanes)

### Divinités sans description complète
Handrich, Solkan, Stromfels ont desc vide car détails dans livres source (ADE3, SOC). Système doit gérer desc vide sans erreur.

### Parsing des commandements
Commandements stockés dans desc sous forme `<ul><li>Texte</li></ul>`. Extraction nécessite parsing HTML pour présentation en liste claire.

### Restrictions raciales
Divinités gnomes (Evawn, Mabyn, Ringil) limitées aux personnages gnomes. Autres divinités ouvertes à toutes races (sauf restrictions culturelles suggérées).

## Tests de cohérence

### Intégrité référentielle
**Test 1** : Tous les noms dans blessings existent dans table spells avec type "Bénédiction"
**Test 2** : Tous les noms dans miracles existent dans table spells avec type "Invocation"
**Test 3** : Chaque divinité a exactement 6 bénédictions
**Test 4** : book référence livres valides (LDB, ADE3, SOC, NADJ)

### Validations structure description
**Test 5** : desc contient balises HTML bien formées (pas de balises non fermées)
**Test 6** : Commandements présents dans desc (balises `<ul>` et `<li>`)
**Test 7** : Sections obligatoires présentes pour dieux majeurs (Sphères, Adorateurs, Commandements)

### Parsing et résolution
**Test 8** : Parsing blessings retourne toujours 6 éléments valides
**Test 9** : Parsing miracles retourne liste vide ou éléments valides
**Test 10** : Miracles vides déclenchent recherche dans spells et trouvent résultats
**Test 11** : Aucun doublon dans blessings d'une même divinité
**Test 12** : Aucun doublon dans miracles d'une même divinité

### Cohérence métier
**Test 13** : Divinités gnomes (index 13-15) ont book="NADJ"
**Test 14** : Divinités majeures (index 0-9) ont book="LDB"
**Test 15** : Toutes les divinités ont label unique
**Test 16** : title cohérent avec desc (si desc non vide)

## Validation des données

### Champs obligatoires / Contraintes
**index** : Unique, entier, 0-15
**label** : Unique, string, 3-30 caractères, nom propre
**title** : String, 0-50 caractères, peut être vide pour divinités mineures
**book** : Valeurs autorisées : "LDB", "ADE3", "SOC", "NADJ"
**page** : Entier, 1-999
**blessings** : String non vide, parsing doit retourner exactement 6 références valides vers spells
**miracles** : String, peut être vide, si non vide parsing doit retourner références valides vers spells
**desc** : String, peut être vide, si non vide doit contenir HTML valide

### Règles inter-champs
**Règle 1** : Si desc vide, alors title peut être vide (divinités mineures)
**Règle 2** : Si desc non vide, doit contenir section Commandements (balise `<ul>`)
**Règle 3** : Divinités avec book="NADJ" sont réservées aux gnomes (metadata culturelle)
**Règle 4** : Nombre de bénédictions toujours égal à 6 après parsing

### Messages d'erreur métier
**Parsing blessings échoue** : "Bénédictions mal formatées pour {label} : {blessings}"
**Parsing miracles échoue** : "Miracles mal formatés pour {label} : {miracles}"
**Bénédiction manquante** : "Bénédiction {nom} introuvable dans table spells pour {label}"
**Miracle manquant** : "Miracle {nom} introuvable dans table spells pour {label}"
**Nombre bénédictions incorrect** : "{label} doit avoir exactement 6 bénédictions, trouvé {nombre}"
**HTML invalide** : "Description HTML mal formée pour {label}"
**Commandements manquants** : "Commandements requis dans description de {label}"
