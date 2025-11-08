# Character Edit - Ajout/Suppression Sorts

## Vue d'ensemble

La gestion des sorts permet d'ajouter et de supprimer des sorts magiques au personnage. L'accès aux sorts dépend des talents magiques possédés (Sorcellerie, Magie Mineure, Béni, Invocation).

## Structure d'un sort

### Composants

- **ID** : Identifiant unique du sort
- **Type** : Lore magique (Magie des Arcanes, Magie Mineure, Bénédictions, Miracles)
- **Spécialisation** : Pour Magie des Arcanes uniquement (Feu, Mort, Ombres, etc.)

Un sort n'a pas d'avances ni de rangs. Il est soit connu, soit non connu.

### Label

Le label affiché dépend du type :
- **Magie des Arcanes avec spec** : "Nom du sort (Spécialisation)" - Ex: "Boule de feu (Feu)"
- **Autres types** : "Nom du sort" uniquement

## Ajout d'un sort

### Pré-requis : Talent magique

Avant d'ajouter un sort, le personnage doit posséder le talent correspondant :
- **Magie des Arcanes** : Talent "Sorcellerie (Magie des Arcanes)"
- **Magie Mineure** : Talent "Magie Mineure"
- **Bénédictions** : Talent "Béni (Nom du Dieu)"
- **Miracles** : Talent "Invocation (Nom du Dieu)"

### Vérification d'existence

`searchSpell(id, spec)` vérifie si le sort existe déjà. Si trouvé, il n'est pas ajouté à nouveau.

### Création

`setSpell()` crée une nouvelle instance avec :
- id, spec, data
- Méthode `getLabel()` pour affichage

### Filtre par lore

L'interface d'ajout filtre les sorts selon les talents magiques actifs. Seuls les sorts accessibles sont proposés à l'utilisateur.

## Suppression d'un sort

### Suppression manuelle

L'utilisateur peut retirer un sort manuellement de sa liste.

### Suppression automatique

Lors de `applyTalent()`, le système :
1. Construit la liste `magics` des types accessibles via talents actifs
2. Parcourt tous les sorts du personnage
3. Supprime les sorts dont le type ne correspond plus à un talent actif

Exemple : Si "Sorcellerie (Magie des Arcanes)" passe à 0 avances, tous les sorts de Magie des Arcanes sont supprimés.

## Cohérence avec les talents

### Synchronisation automatique

Les sorts sont toujours synchronisés avec les talents magiques :
- **Talent acquis** → Sorts du lore deviennent disponibles
- **Talent perdu** → Sorts du lore sont automatiquement retirés

Cette synchronisation est gérée par `applyTalent()` qui filtre les sorts à chaque modification de talents.

### Correspondance type/spec

Pour valider qu'un sort est accessible, le système vérifie :
- `magic.type === spell.data.type` : Le type du talent correspond au type du sort
- `magic.spec === spell.spec` : La spécialisation correspond (pour Magie des Arcanes)

Si aucune correspondance, le sort est supprimé.

## Cas spécial : Bénédictions

### Ajout automatique

Quand un personnage acquiert "Béni (Nom du Dieu)", toutes les bénédictions de ce dieu sont ajoutées automatiquement via :
1. Détection de `addMagic = "Béni"` dans le talent
2. Récupération : `CharGen.allGods[Helper.toId(spec)].getSpells()`
3. Ajout avec `setSpell()` pour chaque bénédiction

### Suppression automatique

Si le talent "Béni" perd ses avances, toutes les bénédictions du dieu sont retirées.

## Restrictions

### Pas de coût XP

Contrairement aux compétences et caractéristiques, les sorts n'ont pas de système d'avances ni de coût XP dans le code actuel. Leur acquisition est binaire : connu ou non connu.

### Pas de progression

Les sorts ne progressent pas en puissance. Un sort connu reste identique quelle que soit l'expérience du personnage.

## Exemple concret

### Scénario : Ajout de "Boule de feu"

**Pré-requis**
Le personnage possède "Sorcellerie (Magie des Arcanes)" avec advance ≥ 1.

**Ajout**
1. L'utilisateur sélectionne "Ajouter sort"
2. Filtrage : Seuls les sorts de type "Magie des Arcanes" sont affichés
3. Sélection : "Boule de feu" (type: Magie des Arcanes, spec: Feu)
4. Vérification : `searchSpell("boule_de_feu", "Feu")` → false
5. Création : `setSpell({id: "boule_de_feu", spec: "Feu", data: ...})`
6. Le sort est ajouté à la liste

**Affichage**
Label : "Boule de feu (Feu)"

**Perte du talent**
Si "Sorcellerie (Magie des Arcanes)" passe à 0 avances :
1. `applyTalent()` reconstruit la liste magics → vide pour Magie des Arcanes
2. Parcours des sorts : "Boule de feu" n'a plus de correspondance
3. Suppression automatique du sort

## Relations avec autres composants

- **[Talents](./talents.md)** : Débloquent l'accès aux lores magiques
- **[Base de données sorts](../../database/spells.md)** : Référentiel des sorts disponibles
- **[Dieux](../../database/gods.md)** : Fournissent les bénédictions et miracles
