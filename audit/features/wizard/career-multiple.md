# Wizard Career - Gestion carrières multiples

## Vue d'ensemble

Le système de création de personnage ne permet PAS le changement de carrière pendant le wizard. Un personnage créé a une seule carrière au niveau 1 (Bronze). Le changement de carrière est une fonctionnalité d'avancement post-création, pas du wizard initial.

**Objectif métier** : Garantir que la création produit des personnages débutants avec une seule carrière. Les parcours multi-carrières sont réservés à la progression avec XP.

## Restrictions en création

### Une seule carrière

**Règle stricte** : Le wizard de création (`characterOnCreation()`) ne permet de sélectionner qu'une seule carrière.

**Processus** :
1. Étape Species : Sélection espèce
2. Étape Careers : Sélection UNE carrière
3. Niveau 1 appliqué automatiquement
4. Étapes suivantes (Characteristics, Skills, etc.)
5. Sauvegarde personnage final

**Pas de retour arrière multi-carrière** : Si joueur revient à l'étape Careers après validation, il peut CHANGER de carrière (remplacer l'actuelle), pas en ajouter une seconde.

### Changement de carrière vs Ajout

**Changement** : Joueur sélectionne "Artisan", puis revient et choisit "Soldat". "Artisan" est REMPLACÉ par "Soldat", pas conservé.

**Code** : `character.career = null` puis `setCareerLevel(nouvelle_carrière[1])`.

**Pourquoi** : Création = débutant. Pas d'historique de carrières multiples.

## État du personnage (randomState)

### Champ career

**Valeurs** :
- `0` : Aucune sélection effectuée
- `1` : 1 tirage aléatoire effectué
- `2` : 2 tirages aléatoires effectués
- `-1` : Mode choix manuel activé
- `-2` : Carrière validée et sauvegardée

**Réinitialisation** : Si joueur revient à l'étape Careers, `randomState.career` peut être restauré à 0 (`resetAction`).

### Champ imposedCareers

**Format** : Tableau d'IDs de carrières proposées lors des tirages aléatoires.

**Exemples** :
- Tirage 1 : `imposedCareers = [42]` (Artisan)
- Tirage 2 : `imposedCareers = [42, 78, 91]` (Artisan, Milicien, Enquêteur)

**Persistance** : Conservé si joueur revient en arrière, garantit re-affichage des mêmes propositions.

## Différence création vs avancement

### Mode création (characterOnCreation = true)

**Objectif** : Créer personnage débutant avec 1 carrière niveau 1.

**Contraintes** :
- Sélection 1 seule carrière
- Niveau 1 obligatoire
- Niveaux 2-4 masqués (`hide()`)

**Validation** : Sauvegarde carrière actuelle, passe étape suivante.

### Mode avancement (characterOnCreation = false)

**Objectif** : Progresser ou changer de carrière avec XP.

**Possibilités** :
- Progresser dans carrière actuelle (niveau 1→2, 2→3, 3→4)
- Changer de carrière (passer à nouvelle carrière niveau 1)
- Conserver historique carrières précédentes

**Affichage** : Niveaux 2-4 visibles et sélectionnables (`listchild3` non masqué).

## Logique de sauvegarde

### Validation carrière

**Code** : `saveAction()` vérifie si carrière/niveau ont changé.

**Ligne clé** : `var ret = CharGen.character.careerLevel && CharGen.character.careerLevel.id === character.careerLevel.id`

**Retour** :
- `true` : Même carrière/niveau qu'avant → Pas de changement
- `false` : Carrière/niveau différent → Changement détecté

### Attribution XP bonus

**Condition** : Uniquement si `!isFreeMode()` ET `randomState.career > 0`.

**Montants** :
- `randomState.career === 1` : +50 XP
- `randomState.career === 2` : +25 XP
- Autres : 0 XP

**Code** : `character.addXP('Carrière Aléatoire', ...)`

### Finalisation

Après validation :
1. Application bonus XP si applicable
2. `randomState.career = -2` (marqueur "terminé")
3. Sauvegarde personnage
4. Passage étape suivante

## Historique de carrières (post-création)

### Structure character.careers[]

**Format** : Tableau d'objets carrière avec métadonnées.

**Exemples** :
```
character.careers = [
  {career: "Artisan", level: 4, xpSpent: 800},
  {career: "Marchand", level: 2, xpSpent: 300}
]
```

**Pas en création** : Ce tableau est vide ou contient uniquement la carrière actuelle lors de la création.

### Règles changement de carrière

**Coût XP** : Changer de carrière coûte 100 XP (règles Warhammer).

**Conservation acquis** : Skills, talents, caractéristiques des carrières précédentes sont conservés.

**Nouvelle carrière** : Démarre toujours niveau 1 de la nouvelle carrière.

**Exemple** : Artisan niveau 4 (800 XP) devient Marchand niveau 1. Conserve skills artisanales, mais débute Marchand comme novice.

## Validation retour arrière

### Retour à l'étape Careers

**Scénario** : Joueur valide "Artisan", puis utilise "Annuler" pour revenir.

**Comportement** :
- Carrière "Artisan" reste sélectionnée
- État `randomState` restauré (tirages conservés si aléatoire)
- Joueur peut changer pour autre carrière

**Limite** : Toujours 1 seule carrière finale. Pas d'accumulation.

### Réinitialisation complète

**Action** : `resetAction()` remet `character.career = null`.

**Raison** : Annulation totale de la sélection, joueur repart de zéro.

## Cas d'usage

### Création simple sans retour
1. Étape Careers : Sélection "Soldat"
2. Validation → Étape Characteristics
3. Validation → Étape Skills
4. Sauvegarde finale : Personnage avec 1 carrière "Soldat niveau 1"

### Création avec changement d'avis
1. Étape Careers : Sélection "Artisan"
2. Validation → Étape Characteristics
3. Retour arrière → Étape Careers
4. Changement : "Artisan" → "Milicien"
5. Validation → Caractéristiques réappliquées pour "Milicien"
6. Sauvegarde finale : Personnage avec 1 carrière "Milicien niveau 1"

### Progression post-création (avancement)
1. Personnage créé : "Artisan niveau 1" (100 XP)
2. Campagne : Gagne 300 XP → Total 400 XP
3. Avancement : "Artisan niveau 2" (coût 100 XP) → Reste 300 XP
4. Avancement : "Artisan niveau 3" (coût 200 XP) → Reste 100 XP
5. Changement : Nouvelle carrière "Marchand niveau 1" (coût 100 XP) → 0 XP restant
6. Historique : `[{Artisan, 3}, {Marchand, 1}]`

### Validation données
1. Joueur sélectionne carrière
2. Système vérifie existence niveau 1
3. Application avantages (voir [career-level-benefits.md](./career-level-benefits.md))
4. Vérification cohérence (pas de doublons, références valides)
5. Sauvegarde si valide

## Références croisées

- [career-selection.md](./career-selection.md) - Sélection carrière initiale
- [career-level-initial.md](./career-level-initial.md) - Niveau 1 obligatoire
- [career-level-benefits.md](./career-level-benefits.md) - Application avantages
- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Progression et changements
