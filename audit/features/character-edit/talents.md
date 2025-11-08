# Character Edit - Ajout/Suppression Talents

## Vue d'ensemble

La gestion des talents permet d'ajouter, supprimer et améliorer les talents d'un personnage. Les talents peuvent avoir des rangs, des spécialisations, et impactent d'autres aspects du personnage (caractéristiques, compétences, sorts).

## Structure d'un talent

### Composants

- **ID** : Identifiant unique
- **Avances permanentes** : Rang actuel (advance)
- **Avances temporaires** : Rang en test (tmpadvance)
- **Avances aléatoires** : Provenant de tirage (roll)
- **Spécialisation** : Si applicable (spec ou specs)
- **Origines** : Sources d'acquisition (carrières, etc.)

### Calculs

**Base** = 0 (toujours)

**Avances totales** = advance + roll + tmpadvance

**Total** = base + avances = avances totales

**Bonus** = floor(total / 10)

## Ajout d'un talent

### Vérification d'existence

Avant ajout, `searchTalent()` vérifie si le talent existe déjà avec même ID et même spécialisation. Si trouvé, fusion des origines. Sinon, création d'une nouvelle instance.

### Spécialisations

Trois cas :
- **Spec fixe** : Le talent a une spécialisation définie (Combat de Rue)
- **Specs multiples** : Choix parmi une liste (Armes naturelles: Cornes, Griffes, etc.)
- **Sans spec** : Talent générique (Chance)

Chaque spécialisation crée une instance séparée.

### Talents automatiques

Certains talents ajoutent automatiquement d'autres talents via `addTalent`. Lors de `applyTalent()`, ces talents secondaires sont ajoutés si le talent principal a des avances.

## Suppression d'un talent

### Nettoyage automatique

`deleteEmpty()` supprime les talents avec `getAdvance() === 0`.

### Impact sur le personnage

Lors de la suppression d'un talent, `applyTalent()` met à jour :
- **Caractéristiques** : Retire les bonus (addCharacteristic)
- **Compétences** : Supprime les compétences ajoutées (addSkill)
- **Sorts** : Retire les sorts accessibles (addMagic)
- **Talents secondaires** : Supprime les talents liés (addTalent)

## Gestion des rangs

### Maximum de rangs

Chaque talent a une limite `max` :
- **Valeur numérique** : 2, 3, 4, etc. (nombre de fois prenable)
- **"Aucun"** : Illimité
- **"Bonus de X"** : Limité au bonus de caractéristique (ex: Bonus de Sociabilité)

`getMax()` calcule la limite effective en récupérant le bonus si nécessaire.

### Progression des rangs

L'utilisateur peut augmenter le rang via `tmpadvance`. À la validation (`saveAdvance()`), le coût est calculé et les avances transférées à `advance`.

## Validation des pré-requis

### Types de pré-requis

Les talents peuvent avoir des conditions d'acquisition (non implémentées dans le code fourni mais présentes dans les données) :
- Niveau de caractéristique minimum
- Autre talent requis
- Compétence requise
- Carrière spécifique

La validation bloque l'ajout si les conditions ne sont pas remplies.

## Effets des talents

### Bonus de caractéristique (addCharacteristic)

Certains talents ajoutent un bonus à une caractéristique :
- **+5 par rang** : Pour la plupart (Endurance durcie, etc.)
- **+1 par rang** : Pour Mouvement, Chance, Détermination, Corruption
- **Bonus d'Endurance** : Pour Points de Blessures

Le bonus est : `multiplicateur × getTotal()`.

### Ajout de compétence (addSkill)

Talents comme Linguistique ajoutent une compétence. La spec du talent détermine la spec de la compétence. `applyTalent()` maintient la cohérence : compétence ajoutée si talent actif, retirée sinon.

### Ajout de magie (addMagic)

Talents magiques (Sorcellerie, Magie Mineure, Béni, Invocation) débloquent l'accès aux sorts d'un lore. `applyTalent()` filtre les sorts du personnage pour ne garder que ceux accessibles via les talents magiques actifs.

### Ajout de talent secondaire (addTalent)

Certains talents en donnent d'autres. Ex: "Sang-Froid" pourrait donner "Imperturbable". Le talent secondaire hérite de la spec du talent principal si applicable.

## Application des effets

### Méthode `applyTalent()`

Appelée après chaque modification de talents, elle :
1. **Réinitialise** tous les bonus de talent sur les caractéristiques à 0
2. **Parcourt** tous les talents avec avances > 0
3. **Applique** les effets de chaque talent actif :
   - Bonus caractéristique
   - Ajout sorts
   - Construction liste compétences/talents liés
4. **Nettoie** sorts et compétences qui ne sont plus couverts

Cette méthode assure la cohérence globale du personnage.

## Symbole et affichage

`getSymbol()` affiche l'icône du niveau de carrière qui a débloqué le talent.

Label : Nom + (spécialisation). Ex: "Armes naturelles (Cornes)".

## Coût en XP

Même principe que les compétences et caractéristiques :
- Coût progressif selon niveau départ/arrivée
- Multiplicateur x1 (carrière) ou x2 (hors carrière)
- Log XP : "Talent: Chance 1 => 2" : -50

## Exemple concret

### Scénario : Ajout de Sorcellerie (Magie des Arcanes)

**Ajout**
1. Recherche : `searchTalent("Sorcellerie", "Magie des Arcanes")` → false
2. Création : `createTalent({id: "sorcellerie", spec: "Magie des Arcanes", ...})`
3. `setTalent()` : Ajout au tableau talents
4. advance: 1 (rang 1 acquis)

**Effets (applyTalent)**
1. addMagic détecté : type="Magie des Arcanes", spec="Magie des Arcanes"
2. Ajout à la liste `magics`
3. Le personnage peut maintenant apprendre des sorts de Magie des Arcanes

**Progression**
L'utilisateur augmente à rang 2 :
- tmpadvance: 1
- Validation : advance passe à 2
- Le talent reste actif, pas de changement de liste de sorts (toujours Magie des Arcanes)

**Suppression**
Toutes avances à 0 :
- `deleteEmpty()` retire le talent
- `applyTalent()` : "Magie des Arcanes" retiré de magics
- Tous les sorts de Magie des Arcanes sont supprimés du personnage

## Cas spécial : Béni

Le talent "Béni" avec une spécialisation (nom d'un dieu) ajoute automatiquement toutes les bénédictions de ce dieu via :
- addMagic = "Béni"
- Récupération des sorts : `CharGen.allGods[Helper.toId(spec)].getSpells()`
- Ajout avec `setSpell()` pour chaque bénédiction

## Relations avec autres composants

- **[Caractéristiques](./characteristics.md)** : Talents modifient les bonus
- **[Compétences](./skills.md)** : Talents ajoutent des compétences
- **[Sorts](../wizard/spells.md)** : Talents débloquent l'accès aux lores
- **[Carrière](../wizard/career.md)** : Source principale de talents
- **[Expérience](../wizard/experience.md)** : Coût d'acquisition des talents
