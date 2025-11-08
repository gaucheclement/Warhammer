# Wizard Career - Sélection niveau initial

## Vue d'ensemble

L'étape Carrière sélectionne automatiquement le niveau 1 (Bronze) de la carrière choisie lors de la création de personnage. Ce niveau initial définit les compétences, talents, équipement et avances de caractéristiques de départ.

**Objectif métier** : Garantir que tout personnage débute sa carrière au niveau 1, reflétant son statut de débutant. Le système applique automatiquement les avantages du niveau Bronze sans intervention du joueur.

## Niveau initial par défaut

### Niveau 1 (Bronze) obligatoire

**Règle** : En mode création (`characterOnCreation()`), le système sélectionne TOUJOURS le niveau 1 de la carrière.

**Code** : `character.setCareerLevel(CharGen.data.careerLevel.allByCareer[el.id][1])`

**Paramètre `[1]`** : Index 1 correspond au niveau 1 (Bronze). Index 0 serait invalide, index 2-4 pour niveaux supérieurs.

### Pourquoi niveau 1 uniquement

**Règles Warhammer** : Personnages débutent Bronze, progressent vers Argent puis Or via XP.

**Équilibrage** : Niveau 1 garantit personnages comparables en puissance. Démarrer niveau supérieur déséquilibrerait campagne.

**Narratif** : Personnages sont novices dans leur profession, pas vétérans.

## Structure d'un niveau 1

### Composants niveau 1

**Statut** : Bronze 1-4 (détermine revenus, accès social).

**Caractéristiques** : 3 carac × +5 points (cumulent avec bonus raciaux).

**Skills** : 8-10 compétences (simples, avec spécialisation, ou choix exclusifs).

**Talents** : 4 talents (fixes ou avec choix).

**Trappings** : Équipement classe sociale + équipement spécifique niveau 1.

## Application automatique

### Sélection carrière → Niveau 1

**Processus** :
1. Joueur clique carrière (ex: "Artisan")
2. Système exécute `character.setCareerLevel(...[1])`
3. Niveau 1 "Apprenti" sélectionné automatiquement
4. Avantages appliqués (voir section suivante)

**Pas de choix** : Joueur ne peut PAS sélectionner niveau 2-4 en création. Ces niveaux sont masqués (`hide()`).

### Avantages appliqués

Voir [career-level-benefits.md](./career-level-benefits.md) pour détails complets.

**Résumé** :
1. Avances caractéristiques (+5 sur 3 carac)
2. Skills ajoutées (8-10 compétences)
3. Talents ajoutés (4 talents)
4. Trappings ajoutés (classe + niveau 1)

## Niveaux supérieurs (hors création)

### Niveaux 2-4 masqués

**Code** : `$careers.find('li[data-line].listchild3').hide()`

**Raison** : `listchild3` représente les niveaux individuels. En création, seul le niveau 1 est pertinent.

### Mode avancement

**Contexte** : Après création, joueur peut progresser vers niveaux 2-4 via dépense XP.

**Affichage** : En mode avancement (`!characterOnCreation()`), niveaux 2-4 deviennent visibles et sélectionnables.

**Exemple** : Artisan expérimenté peut avancer vers "Artisan niveau 2 - Compagnon" (Bronze 3), puis niveau 3 "Maître artisan" (Argent 1).

## Cas particuliers

### Campagnes avancées et changements

**Campagnes avancées** : MJ peut modifier index vers `[2]` ou `[3]` + attribuer XP compensatoire.

**Changement carrière** : Toujours niveau 1 de la nouvelle carrière (pas conservation niveaux).

## Relation avec autres tables

### Career → CareerLevels

**Lien** : `CharGen.data.careerLevel.allByCareer[career.id]`

**Structure** : Tableau de 4 éléments (niveaux I-IV).

**Index** :
- `[0]` : Niveau 0 (invalide ou header)
- `[1]` : Niveau 1 (Bronze) ← **Sélectionné en création**
- `[2]` : Niveau 2 (Bronze)
- `[3]` : Niveau 3 (Argent)
- `[4]` : Niveau 4 (Or)

### CareerLevels → Characteristics, Skills, Talents, Trappings

**Parsing requis** : Champs `characteristics`, `skills`, `talents`, `trappings` sont des chaînes CSV.

**Résolution** : Système parse et résout références vers tables respectives.

**Exemple** : `"Capacité de Tir, Intelligence, Sociabilité"` → 3 objets Characteristic.

## Validation

### Vérifications obligatoires

**Niveau 1 existe** : `CharGen.data.careerLevel.allByCareer[career.id][1]` ne doit pas être `undefined`.

**Erreur si absent** : "Erreur système : Niveau 1 introuvable pour cette carrière."

### Cohérence données

**Règle** : TOUTES carrières doivent avoir exactement 4 niveaux (I-IV) dans `careerLevels.json`.

**Test** : Parcourir toutes carrières, vérifier `allByCareer[id].length === 4`.

## Cas d'usage

### Création Nain Artisan
1. Étape Species : Sélection "Nain"
2. Étape Careers : Sélection "Artisan"
3. Système exécute `setCareerLevel(...[1])`
4. Niveau 1 "Apprenti" appliqué :
   - Statut : Bronze 2
   - Carac : +5 CC, +5 Ag, +5 F
   - Skills : Calme, Résistance, Marchandage, Métier (Au choix), etc.
   - Talents : Ambidextre, Travailleur, etc.
   - Trappings : Classe Citadins + Outils métier

### Création Humain Soldat
1. Étape Species : Sélection "Humain"
2. Étape Careers : Génération aléatoire → "Soldat"
3. Système applique niveau 1 "Recrue" :
   - Statut : Bronze 3
   - Carac : +5 CC, +5 Cd, +5 F
   - Skills : Athlétisme, Calme, Corps à corps (Base), Intimidation
   - Talents : Armure lourde, Combat de rue
   - Trappings : Classe Guerriers + Armure légère, Arme simple

### Validation avant sauvegarde
1. Joueur sélectionne carrière
2. Système vérifie `careerLevel[1]` existe
3. Application avantages niveau 1
4. Vérification cohérence (skills/talents valides)
5. Sauvegarde personnage
6. Passage étape suivante (Characteristics)

## Références croisées

- [careerLevels.md](../../database/careerLevels.md) - Table niveaux
- [career-selection.md](./career-selection.md) - Sélection carrière
- [career-level-benefits.md](./career-level-benefits.md) - Application avantages
- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Progression niveaux
