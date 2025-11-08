# Wizard Career - Sélection carrière compatible espèce

## Vue d'ensemble

L'étape Carrière du wizard de création permet au joueur de choisir une profession parmi celles accessibles à son espèce. Le système filtre automatiquement les carrières selon les restrictions culturelles et biologiques de chaque race.

**Objectif métier** : Garantir une sélection de carrière cohérente avec l'espèce du personnage, reflétant affinités culturelles et tabous sociaux de Warhammer.

## Principes de sélection

### Filtrage automatique par espèce

Le système utilise `species.refCareer` comme clé d'identification pour filtrer les carrières via l'objet `careers.rand`.

**Règles d'accessibilité** :
- `carrière.rand[espèce.refCareer]` = nombre → **ACCESSIBLE**
- `carrière.rand[espèce.refCareer]` = "" → **NON ACCESSIBLE**
- Clé absente → **NON ACCESSIBLE**

### Mode de sélection

**Mode standard** : Liste filtrée par espèce avec possibilité de génération aléatoire (bonus XP).

**Mode libre** : Toutes carrières accessibles sans filtrage ni bonus XP (campagnes spéciales, concepts narratifs uniques).

## Types de compatibilité

### Carrières universelles

**Artisan** : Accessible à toutes espèces (Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre).

**Pourquoi** : Métier artisanal universel. Nains favorisés (tradition artisanale séculaire).

**Affichage** : Seuil affiché pour chaque espèce (Nain: 8, Halfling: 7, Humain: 3).

### Carrières multi-espèces restreintes

**Agitateur** : Humain (1), Halfling (2), Nain (2), Gnome (1). Elfes et Ogres exclus.

**Pourquoi** : Politique humaine, désintérêt des Elfes (trop nobles) et Ogres (pas concernés).

**Villageois** : Humain, Halfling, Nain, Gnome. Elfes et Ogres exclus.

**Pourquoi** : Espèces sédentaires uniquement. Elfes vivent en royaumes forestiers, Ogres nomades.

### Carrières mono-espèce

**Sorcier de village** : Humain uniquement (seuil 95, très rare).

**Pourquoi** : Tradition magique humaine pré-Collèges. Autres espèces ont propres systèmes magiques.

**Prêtre de Sigmar** : Humain uniquement.

**Pourquoi** : Culte exclusivement humain. Nains/Elfes ont propres panthéons.

### Carrières interdites (Chaos)

**Magus Tzeentch, Flagellant Khorne** : Tous `rand` vides.

**Pourquoi** : Narratif uniquement, campagnes Chaos spéciales avec mode libre.

## Affichage et organisation

### Regroupement par classe sociale

Les carrières accessibles sont organisées en 6 catégories :
- **Citadins** : Agitateur, Artisan, Bourgeois, Enquêteur, Marchand
- **Guerriers** : Soldat, Mercenaire, Pistolier, Chevalier
- **Lettrés** : Apprenti sorcier, Érudit, Médecin, Scribe
- **Roublards** : Criminel, Escroc, Receleur, Voleur
- **Ruraux** : Chasseur, Éleveur, Paysan, Vagabond
- **Itinérants** : Charlatan, Colporteur, Messager, Patrouilleur

**Exemple Nain** :
- **Citadins** : Artisan (8), Bourgeois (14), Enquêteur (16), Marchand (20)
- **Guerriers** : Soldat, Mercenaire, Tueur de Trolls
- **Lettrés** : Ingénieur (métier nain traditionnel)
- **PAS d'Agitateur** (rare, seuil 2 mais peu courant)
- **PAS de Sorcier** (magie arcanique interdite)

### Indicateurs de probabilité

Chaque carrière affiche son seuil aléatoire : `"Artisan 2-3"` (range entre seuils).

**Lecture** : Plus le seuil est bas, plus la carrière est commune. Artisan (3) plus fréquent que Sorcier (95).

### État désactivé initial

À l'ouverture, toutes carrières sont **désactivées** (grisées). Seules 3 options disponibles :
- **Lancer** : Générer aléatoirement (+50 XP ou +25 XP)
- **Lancer** (2ème fois) : Obtenir 3 choix au total (+25 XP)
- **Choisir** : Déverrouiller liste complète (0 XP)

## Modes de sélection

### Génération aléatoire

**Tirage 1** : Clic sur "Lancer" génère 1 carrière aléatoire. Elle devient sélectionnable, toutes autres restent grisées.
- Accepter → +50 XP, passer à l'étape suivante
- Refuser → Clic "Lancer" à nouveau

**Tirage 2** : Génère 2 carrières supplémentaires (total 3 actives).
- Choisir parmi les 3 → +25 XP
- Refuser → Clic "Choisir"

**Tirage 3** : Clic "Choisir" déverrouille toutes carrières accessibles. 0 XP bonus.

**Gestion doublons** : Système stocke carrières proposées (`imposedCareers`), garantit 3 carrières distinctes.

### Sélection manuelle directe

**Processus** :
1. Clic "Choisir" (bouton "Other")
2. Toutes carrières compatibles espèce deviennent cliquables
3. Choix libre parmi liste regroupée par classe
4. Aucun bonus XP

**Cas d'usage** : Joueur a concept précis de personnage, refuse hasard.

### Mode libre (MJ)

**Activation** : MJ active `character.isFreeMode()` avant étape.

**Comportement** :
- Boutons "Lancer" et "Choisir" masqués
- TOUTES carrières accessibles (ignore `rand`)
- Pas de bonus XP
- Permet concepts narratifs (Nain Sorcier, Elfe Mendiant)

## Affinités culturelles par espèce

### Humains
Polyvalents, accès à toutes carrières. Exclusives : Sorcier de village (95), Prêtre de Sigmar.

### Nains
Favorisées : Artisan (8), Guerrier, Ingénieur. Interdites : Sorcier (tabou magie arcanique).

### Halflings
Favorisées : Artisan (7), Bourgeois (10), Marchand (16), Cuisinier. Interdites : Chevalier (taille).

### Elfes
Favorisées : Artiste (14), Mage, Éclaireur. Interdites : Mendiant, Ratier, Égoutier (fierté).

### Gnomes et Ogres
Gnomes : Métiers techniques. Ogres : Métiers physiques uniquement.

## Interactions avec autres étapes

### Avec Step Species
Ordre : Species AVANT Careers. Dépendance : `character.getSpecie().data.refCareer`.

### Avec Step Career Levels
Choisir carrière sélectionne automatiquement niveau 1 (Bronze) via `setCareerLevel()`.

### Avec filtrage régional
Filtrage combiné espèce + région. Exemple : Nain de Middenheim → intersection des deux critères.

## Validation

Vérifications : espèce définie, carrière compatible (`rand[espèce]` numérique), niveau 1 existe.

Messages erreur : "Veuillez sélectionner une espèce avant de choisir une carrière."

## Cas d'usage détaillés

### Création Nain standard
1. Étape Species : Sélection "Nain"
2. Étape Careers : Affiche carrières `rand.Nain` numérique
3. Organisation : Citadins (Artisan, Bourgeois), Guerriers (Soldat), Lettrés (Ingénieur)
4. Masque : Sorcier (interdit), Agitateur (rare), Mendiant (rare)
5. Clic "Lancer" : Génère "Artisan" (seuil 8, commun)
6. Accepter : +50 XP, passer Step Characteristics

### Création Elfe avec concept précis
1. Étape Species : Sélection "Haut Elfe"
2. Étape Careers : Affiche carrières Elfes (limitées)
3. Clic "Choisir" (refuse hasard)
4. Sélection manuelle "Mage" dans classe Lettrés
5. Aucun bonus XP, mais contrôle total

### Génération aléatoire Halfling flexible
1. Étape Species : Sélection "Halfling"
2. Étape Careers : Clic "Lancer"
3. Génération : Dés 15 → "Marchand" (seuil 16)
4. Refus (veut alternatives)
5. Clic "Lancer" à nouveau
6. Génération : 2 carrières supplémentaires → "Artisan" (7), "Cuisinier" (12)
7. Choix parmi 3 : "Cuisinier" → +25 XP

## Références croisées

- [careers.md](../../database/careers.md) - Table carrières
- [species.md](../../database/species.md) - Table espèces
- [classes.md](../../database/classes.md) - Classes sociales
- [careerLevels.md](../../database/careerLevels.md) - Niveaux de progression
- [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md) - Règles filtrage
- [ponderation-aleatoire-careers.md](../../business-rules/ponderation-aleatoire-careers.md) - Génération aléatoire
