# Navigation par Arborescence Dynamique

## Vue d'ensemble

La navigation par arborescence dynamique permet d'explorer le contenu Warhammer via une structure hiérarchique qui se déploie selon la sélection. Organisation en niveaux imbriqués (racine → catégories → sous-catégories → éléments) avec filtrage dynamique par type.

**Objectif métier** : Exploration progressive du contenu général vers les détails spécifiques en quelques clics.

## Fonctionnalités principales

### 1. Sélection du type de contenu

**Composant** : Menu déroulant listant les points d'entrée

**Contenu** : Noeuds avec typeItem="tree" et (type="tree" OU subType="root")

**Types sélectionnables** : Personnage, Carrières, Compétences, Talents, Sorts, Équipement, Armes, Armures, Bestiaire, Divinités

**Indentation** : Espaces reflétant la hiérarchie (nombre d'espaces = niveau - 1)

### 2. Affichage hiérarchique des enfants

**Déclenchement** : Sélection d'un noeud dans le menu

**Comportement** : Récupération de tous les éléments enfants du noeud

**Organisation** : Structure définie dans Trees. Voir [trees.md](../../database/trees.md)

**Profondeur** : Maximum 4 niveaux

### 3. Parcours itératif de l'arborescence

**Principe** : Exploration itérative (non récursive) pour collecter tous les descendants

**Mécanisme** :
1. Noeud sélectionné placé dans pile de traitement
2. Pour chaque noeud : vérification conditions, ajout au résultat, ajout enfants à la pile
3. Traitement jusqu'à épuisement de la pile
4. Résultat = liste complète des éléments

**Attribut level** : Chaque élément enrichi avec niveau de profondeur (racine=0, enfants=1, etc.)

### 4. Filtrage par condition

**Conditions** : Type d'élément, type de contenu, sous-type, index, présence de description

**Flexibilité** : Conditions modifiables selon contexte

### 5. Affichage de la liste résultante

**Format** : Liste verticale scrollable

**Contenu** : Label, description, indicateurs de niveau, références croisées

**Inclusion** : Élément affiché si index ≠ 0 OU description non vide

### 6. Réactivité au changement

**Actions** :
1. Masquage liste précédente
2. Parcours depuis nouveau noeud
3. Génération nouvelle liste filtrée
4. Affichage

**Performance** : Traitement itératif optimisé pour centaines de noeuds

## Relations avec autres fonctionnalités

### Lien avec Trees
**Dépendance absolue** : Structure hiérarchique de Trees

**Champ folder** : Définit le parent (format "type|label")

**Documentation** : Voir [trees.md](../../database/trees.md)

### Lien avec Compendium
**Complémentarité** : Mécanisme de navigation du Compendium

**Documentation** : Voir [compendium.md](./compendium.md)

### Lien avec toutes les tables
**Mapping** : Chaque type de noeud correspond à une table

**Exemples** : type="spell" → Spells, type="talent" → Talents, type="creature" → Creatures

## Cas d'usage métier

### Navigation progressive dans les sorts
1. Sélection "Sorts"
2. Affichage : Domaines Arcanes, Magie Mineure, Bénédictions
3. Clic "Domaines Arcanes" → Feu, Métal, Mort
4. Clic "Feu" → 15 sorts avec descriptions

### Exploration des carrières
1. Sélection "Carrières"
2. Affichage : Académiques, Guerriers, Rôdeurs, Chevaliers
3. Clic "Académiques" → Apprenti Sorcier, Érudit, Ingénieur
4. Descriptions complètes affichées

### Consultation du bestiaire
1. Sélection "Bestiaire"
2. Affichage : Créatures majeures, mineures, animaux, traits
3. Clic sur catégorie
4. Liste avec caractéristiques, compétences, talents, traits

### Changement dynamique
1. Consultation "Sorts" (arborescence affichée)
2. Changement vers "Équipement"
3. Masquage instantané, nouvelle arborescence générée
4. Transition fluide

## Règles métier

### Structure hiérarchique
**Principe** : Chaque noeud (sauf racine) a un parent valide via folder

**Exception** : Racine (index=0) a folder vide

### Évitement des cycles
**Règle** : Un noeud ne peut être son propre ancêtre

### Profondeur maximale
**Limite** : 4 niveaux

**Exemple** : Racine → Possessions → Les armes → Armes de corps à corps → Base

### Filtrage du menu
**Condition** : typeItem="tree" ET (type="tree" OU subType="root")

### Ordre de traitement
**Respect** : Ordre défini dans Trees

### Affichage conditionnel
**Règle** : Visible si index ≠ 0 OU description non vide

## Points d'attention

### Noeuds vides
**Exemples** : "Base", "Escrime", "Armes d'hast"

**Comportement** : Peuvent être filtrés de l'affichage final

### Performance
**Parcours itératif** : Plus performant que récursivité

**Filtrage** : Appliqué pendant parcours

### Types hybrides
**Distinction** : "tree" structurel vs noeuds pointant vers données réelles

**Exemples** : "tree|Personnage" (structurel), "specie|Humains" (donnée)

### Indentation
**Calcul** : Espaces = level - 1

## Exemples concrets Warhammer

### Arborescence des sorts
**Sélection** : "Sorts"

**Structure** :
- Domaines Arcanes (Feu 15 sorts, Métal 12, Mort 14)
- Magie Mineure (12 sorts)
- Bénédictions (Sigmar 8, Ulric 7, Shallya 6)

**Navigation** : Clic "Feu" → "Boule de feu", "Mur de flammes", "Lance de feu"

### Arborescence des armes
**Sélection** : "Les armes"

**Structure** :
- Corps à corps (Bagarre, Base, Cavalerie, Escrime, Armes d'hast)
- Distance (Arbalètes, Arcs, Armes de jet)

**Navigation** : Clic "Escrime" → Épée, Rapière, Espadon avec caractéristiques

### Arborescence des carrières
**Sélection** : "Classes et Carrières"

**Structure** :
- Académiques (Apprenti Sorcier, Érudit, Ingénieur)
- Guerriers (Soldat, Patrouilleur, Combattant de rue)
- Rôdeurs (Chasseur de primes, Hors-la-loi, Pilleur de tombes)

**Navigation** : Clic "Académiques" → Descriptions et prérequis
