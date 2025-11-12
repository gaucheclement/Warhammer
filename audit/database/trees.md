# Trees - Table de données

## Vue d'ensemble

La table Trees stocke l'arborescence complète de navigation et d'organisation du contenu Warhammer Fantasy Roleplay. Elle structure hiérarchiquement toutes les entités du jeu (personnages, règles, équipement, magie, créatures, religions).

**Objectif métier** : Fournir une navigation organisée et contextuelle pour explorer toutes les données du système de jeu.

## Structure des données

### Champs d'identification
- **index** : Numéro unique d'identification (0 à 96)
- **label** : Nom du noeud/chapitre (ex: "Personnage", "Compétences", "Armures")
- **book** : Livre source (LDB, ADE2, MSRC, EDOC)
- **page** : Page dans le livre source (vide pour noeuds structurels)

### Champs hiérarchiques
- **folder** : Référence au parent dans l'arbre (format: "type|label" ex: "tree|Personnage")
- **type** : Type de contenu (tree, specie, career, skill, talent, spell, trapping, etc.)
- **subType** : Sous-type ou spécialisation (root, magie mineure, melee, ranged, armor, weapon, etc.)

### Données descriptives
- **desc** : Description narrative en HTML (règles, contexte, explications)

## Types de contenus organisés

### Navigation structurelle (type="tree")
**Racine** : Point d'entrée (index=0) | **Personnage** : Création et caractéristiques | **Règles** : Mécanique de jeu | **Religions et croyances** : Cultes et divinités | **Magie** : Système magique | **Entre deux aventures** : Activités hors-jeu | **Glorieux Reikland** : Cadre de campagne | **Bestiaire** : Créatures | **Livres** : Sources

### Entités jouables
**specie** (races), **career** (carrières), **class** (classes), **characteristic** (caractéristiques), **star** (signes astrologiques), **skill** (compétences), **talent** (talents)

### Équipement et possessions
**trapping** (possessions générales), **weapon** (armes globales), **melee** (armes de corps à corps), **ranged** (armes à distance), **ammunition** (munitions), **armor** (armures), **quality** (atouts/défauts), **riverboat** (embarcations), **vehicle** (véhicules), **machine** (machines de guerre)

### Magie et religion
**spell** (sorts), **magick** (domaines de magie), **lore** (savoir/lore), **god** (divinités), **book** (livres de règles)

### Bestiaire et règles
**creature** (créatures), **trait** (traits de créature), **psychologie** (traits psychologiques), **etat** (états/conditions)

## Organisation hiérarchique

### Principe du champ folder
Le champ `folder` crée la hiérarchie parent-enfant. Format: "type|label"
**Exemples** :
- "tree|Racine" → Enfant direct de Racine
- "specie|Races" → Enfant du noeud Races (type specie)
- "weapon|Les armes" → Enfant du noeud Les armes (type weapon)
- "melee|Armes de corps à corps" → Enfant du noeud Armes de corps à corps (type melee)

### Noeuds racines (subType="root")
Marquent les points d'entrée de chaque grande catégorie. Exemples: Races (specie/root), Classes et Carrières (class/root), Compétences (skill/root), Talents (talent/root), Possessions (trapping/root), Armures (armor/root), Bestiaire (creature/root)

### Profondeur maximale
L'arbre atteint 4 niveaux de profondeur maximum. Exemple: Racine → Possessions → Les armes → Armes de corps à corps → Base

## Relations avec autres tables

### 1. Référencement croisé dans descriptions
**Objectif** : Lier les entités entre elles dans les descriptions HTML
**Fonctionnement** : Le champ `desc` contient du HTML avec références implicites vers autres entités
**Liens hypertexte** : Applique des liens vers characteristic, trait, talent, lore, skill, god, spell, etat, psychologie, magick, quality, career, tree
**Usage** : Navigation contextuelle depuis la description d'une entrée vers entités liées

### 2. Relation avec toutes les tables de données
**Objectif** : Organiser l'accès aux données par thématique
**Fonctionnement** : Le champ `type` indique quelle table de données est référencée
**Mapping type → table** : specie→Species, career→Careers, skill→Skills, talent→Talents, spell→Spells, trapping→Trappings, creature→Creatures, god→Gods, etc.
**Usage** : Filtrage et affichage des données par catégorie navigable

### 3. Index par type et subType (allByType)
**Objectif** : Accès rapide aux noeuds par catégorie
**Structure** : `allByType[type][id]` et `allByType[type][subType]`
**Exemples** :
- `allByType["spell"]["magie mineure"]` → noeud "Sorts mineurs"
- `allByType["melee"]["root"]` → noeud racine des armes de mêlée
**Usage** : Retrouver rapidement un noeud structurel sans parcourir l'arbre

### 4. Génération d'ID unique
**Format** : "type|label" (fonction generateId)
**Exemples** : "tree|personnage", "specie|races", "melee|base"
**Unicité** : Combinaison type+label garantit l'unicité
**Usage** : Indexation et recherche rapide dans allById

## Cas d'usage métier

### Navigation thématique
**Objectif** : Permettre l'exploration du contenu par chapitres logiques
**Processus** : 1) Afficher Racine 2) Lister enfants (folder="tree|Racine") 3) Utilisateur sélectionne chapitre 4) Descendre dans l'arbre
**Exemple** : Racine → Personnage → Compétences → Affiche toutes les skills

### Aide contextuelle
**Objectif** : Afficher les règles pertinentes selon le contexte
**Exemple** : Lors de la sélection d'une arme → Afficher "Atouts d'arme" et "Défauts d'arme" depuis Trees
**Fonctionnement** : getDescription() applique les liens hypertextes vers entités liées

### Filtrage par livre source
**Objectif** : Limiter le contenu aux livres possédés par le joueur
**Processus** : Filtrer `book` selon choix utilisateur
**Exemples de livres** : LDB (Livre de Base), ADE2 (Archives de l'Empire 2), MSRC (Mort sur le Reik Compagnon), EDOC (Ennemi dans l'Ombre Compagnon)

## Points d'attention

### Noeuds vides (desc="")
Certains noeuds sont purement structurels sans description. Exemples: "Armes d'hast", "Bagarre", "Base", "Escrime". Ils servent uniquement à organiser la hiérarchie.

### Types hybrides (tree vs entités)
Le type "tree" représente des noeuds structurels purs. Les autres types (specie, career, etc.) sont des noeuds pointant vers des données réelles.

### Référence circulaire potentielle
Un noeud ne peut pas être son propre parent (éviter folder="type|label" où type|label = ID actuel)

## Tests de cohérence

### Intégrité hiérarchique
**Test 1** : Tous les `folder` pointent vers un index existant (sauf Racine qui a folder="")
**Test 2** : Aucun cycle dans l'arbre (A→B→C→A impossible)
**Test 3** : Un seul noeud racine absolu (index=0, folder="")
**Test 4** : Tous les noeuds sont accessibles depuis Racine
**Test 5** : Profondeur maximale respectée (4 niveaux)

### Validations type/subType
**Test 6** : `type` appartient à liste valide (tree, specie, career, skill, etc.)
**Test 7** : `subType` cohérent avec `type` (ex: melee/subType ne peut être "armor")
**Test 8** : Noeuds root ont bien subType="root"
**Test 9** : Chaque catégorie majeure a un noeud root

### Références et descriptions
**Test 10** : `book` référence livre valide (LDB, ADE2, MSRC, EDOC)
**Test 11** : `page` numérique ou vide pour noeuds structurels
**Test 12** : HTML dans `desc` bien formé (balises fermées)
**Test 13** : Liens dans descriptions pointent vers entités existantes

### Unicité et indexation
**Test 14** : `index` unique et séquentiel (0,1,2...96)
**Test 15** : Combinaison type+label unique (pas de doublons d'ID)
**Test 16** : Tous les types dans allByType sont indexables

## Validation des données

### Champs obligatoires
**index** (unique, 0-96), **label** (3-100 car), **folder** (format "type|label" ou vide pour Racine), **type** (liste valide), **subType** (string ou vide), **book** (LDB/ADE2/MSRC/EDOC), **page** (numérique ou vide)

### Contraintes de format
**folder** : Regex "^(tree|specie|career|skill|talent|spell|trapping|weapon|melee|ranged|armor|ammunition|creature|magick|god|lore|quality|trait|psychologie|etat|book|class|characteristic|star|riverboat|vehicle|machine)\\|[^|]+$" ou vide
**type** : Énumération stricte des 26 types possibles
**desc** : HTML valide (peut être vide)

### Règles inter-champs
**Règle 1** : Si folder vide, alors index=0 (Racine unique)
**Règle 2** : Si subType="root", alors folder pointe vers type="tree"
**Règle 3** : Si page vide, alors desc peut être vide (noeud structurel)
**Règle 4** : Si type≠"tree", alors folder ne peut être vide

### Messages d'erreur métier
**Parent inexistant** : "Référence invalide folder='{folder}' pour {label} (index={index})" | **Cycle détecté** : "Hiérarchie cyclique détectée incluant {label}" | **Type invalide** : "Type '{type}' inconnu pour {label}" | **Racine multiple** : "Plusieurs noeuds racines détectés (index={index1} et {index2})" | **HTML malformé** : "Description HTML invalide pour {label} : {erreur}"
