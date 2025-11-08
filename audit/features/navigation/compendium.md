# Compendium - Consultation globale des données

## Vue d'ensemble

Le Compendium est un mode de consultation autonome permettant d'explorer toutes les données du système Warhammer Fantasy Roleplay en dehors du processus de création de personnage.

**Objectif métier** : Permettre aux Maîtres du Jeu et joueurs de consulter rapidement les informations pendant ou en dehors d'une partie.

## Fonctionnalités principales

### 1. Accès depuis le menu principal

**Point d'entrée** : Option "Compendium" dans le menu d'accueil, au même niveau que "Créer un personnage"

**Indépendance** : Aucun personnage requis pour accéder au Compendium

### 2. Sélection par type de contenu

**Principe** : Menu déroulant listant toutes les catégories de données disponibles

**Catégories** : Races, Carrières, Compétences, Talents, Sorts, Équipement, Armes, Armures, Créatures, Traits, Divinités, Règles

**Format** : Indentation avec espaces reflétant la hiérarchie (nombre d'espaces = niveau - 1)

**Exemples** :
- "Personnage" (niveau 1, aucun espace)
- " Compétences" (niveau 2, 1 espace)
- "Magie" (niveau 1)
- " Domaines Arcanes" (niveau 2)

### 3. Navigation par arborescence

**Structure** : Utilise la table Trees pour organiser le contenu. Voir [trees.md](../../database/trees.md)

**Fonctionnement** :
1. Sélection d'une catégorie dans le menu déroulant
2. Récupération des éléments enfants de cette catégorie
3. Affichage de la liste complète avec descriptions
4. Navigation possible vers sous-catégories

**Filtrage** : Seuls les noeuds avec typeItem="tree" et (type="tree" OU subType="root") apparaissent dans le menu

### 4. Affichage détaillé des éléments

**Contenu affiché** :
- Nom et label
- Description complète (HTML formaté)
- Caractéristiques spécifiques selon le type
- Références croisées
- Source (livre et page)

**Organisation** : Liste verticale scrollable

**Condition d'affichage** : Un élément apparaît si index ≠ 0 OU description non vide

### 5. Liens contextuels

**Principe** : Descriptions contiennent des références cliquables vers autres éléments

**Types de liens** : Compétences dans talents, Sorts dans domaines, Traits dans créatures, Divinités dans cultes

**Fonctionnement** : Descriptions HTML enrichies automatiquement avec hyperliens interactifs

### 6. Changement de catégorie dynamique

**Comportement** : Nouvelle sélection recharge immédiatement le contenu

**Conservation** : Aucune sauvegarde nécessaire (mode consultation seule)

## Relations avec autres fonctionnalités

### Lien avec Trees
**Dépendance forte** : Utilise exclusivement la table Trees pour l'organisation. Voir [trees.md](../../database/trees.md)

### Lien avec toutes les tables de données
**Accès universel** : Peut afficher les données de toutes les tables

**Mapping** : type du noeud Trees correspond au typeItem de la table cible

**Exemples** : type="spell" → table Spells, type="creature" → table Creatures, type="career" → table Careers

## Cas d'usage métier

### Maître du Jeu consulte une créature
1. Combat commence avec un Mutant
2. MJ ouvre le Compendium
3. Sélectionne "Bestiaire"
4. Trouve Mutant dans la liste
5. Lit caractéristiques et traits
6. Applique les règles

### Joueur explore les sorts
1. Veut connaître les sorts du domaine du Feu
2. Ouvre Compendium → "Magie" → "Domaines Arcanes" → "Feu"
3. Consulte les 15 sorts du domaine
4. Compare avec d'autres domaines

### Débutant découvre les carrières
1. Ouvre Compendium → "Classes et Carrières"
2. Lit les descriptions des classes
3. Explore les carrières de chaque classe
4. Note celles qui l'intéressent

### Vérification de règle
1. Débat sur l'état "Empoisonné"
2. MJ ouvre Compendium → "Règles et états" → "Empoisonné"
3. Lit les règles exactes
4. Applique correctement

## Règles métier

### Données en lecture seule
**Principe** : Le Compendium ne modifie jamais les données

**Conséquence** : Aucun bouton d'édition, sauvegarde ou suppression

**Exception** : Bouton Options pour changer le thème (clair/sombre)

### Chargement initial des données
**Déclenchement** : Au premier accès au Compendium si données non chargées

**Action** : Chargement complet de toutes les tables

### Affichage par défaut
**Comportement** : À l'ouverture, premier élément du menu déroulant automatiquement sélectionné

**Liste** : Tous les enfants de ce noeud listés immédiatement

### Thème visuel
**Options** : Thème clair ou sombre

**Sauvegarde** : Préférence utilisateur stockée localement

**Bouton** : Bascule "Clair"/"Noir"

## Points d'attention

### Performance
**Situation** : Certaines catégories (Compétences, Talents) contiennent des centaines d'éléments

**Mitigation** : Scrolling virtuel pour grandes listes

### Hiérarchie profonde
**Impact** : Arborescences à 4 niveaux nécessitent plusieurs sélections

**Exemple** : Racine → Possessions → Les armes → Armes de corps à corps → Base

### Descriptions vides
**Situation** : Noeuds structurels sans description

**Exemples** : "Base", "Escrime", "Armes d'hast"

## Exemples concrets Warhammer

### Bénédictions de Sigmar
1. "Magie" → "Bénédictions" → "Bénédictions de Sigmar"
2. Liste : "Prière pour la victoire", "Protection de Sigmar", etc.
3. Clic sur bénédiction pour description détaillée

### Arme spécifique
1. "Possessions" → "Les armes" → "Armes de corps à corps" → "Escrime"
2. Liste : Épée, Épée courte, Rapière, Espadon
3. Consultation caractéristiques (dégâts, allonge, atouts/défauts)

### Races jouables
1. "Personnage" → "Races"
2. Liste : Humains (Reikland/Nordland), Halflings, Nains, Elfes
3. Lecture modificateurs caractéristiques
4. Comparaison talents et compétences raciaux

### Trait de créature
1. "Bestiaire" → Traits → "Vol"
2. Lecture : "La créature peut voler. Son Mouvement indiqué est sa vitesse de vol"
3. Application immédiate
