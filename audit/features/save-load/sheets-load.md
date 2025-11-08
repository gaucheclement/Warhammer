# Save/Load - Google Sheets Load

## Contexte

Chargement d'un personnage sauvegardé depuis la feuille Google Sheets "Save" pour continuer sa création ou le modifier. Le système reconstruit l'objet Character complet à partir du JSON sauvegardé en restaurant les références vers les tables de données.

## Recherche dans Feuille Save

### Algorithme de Recherche

**Entrée** : saveName (clé unique, ex: `_x7k2pm9q`)

**Processus** :
1. Lecture feuille : `getRange('Save!A:B').getValues()`
2. Parcours linéaire colonne A
3. Si `val[i][0] === key` : Retour `val[i][1]` (JSON personnage)
4. Si non trouvé : Retour JSON vide `""`

**Performance** : O(n) acceptable (<100 personnages typiquement)

**Retour** : ContentService JSON avec données personnage ou chaîne vide

## Désérialisation JSON

### Lecture Données Brutes

**Format reçu** : Chaîne JSON sérialisée
**Parsing** : `JSON.parse(response)`

**Structure attendue** :
- stepIndex, mode, randomState
- specie: `{ id, advance, ... }` (sans champ data)
- careerLevel: `{ id, ... }` (sans champ data)
- characteristics, skills, talents, spells : Tableaux (sans champ data)
- trappings, details, xp : Objects complets

## Reconstruction Objet Character

### Méthode character.load(data)

**Principe** : Restauration complète personnage en réhydratant références

**Ordre des opérations** :
1. Restauration stepIndex
2. Restauration Specie (lookup dans `CharGen.allSpecies`)
3. Restauration CareerLevel (lookup dans `CharGen.allCareersLevels`)
4. Restauration Characteristics (merge data + personnalisation)
5. Restauration Skills (merge data + spec)
6. Restauration Talents (merge data + spec)
7. Restauration Spells (lookup dans `CharGen.allSpells`)
8. Copie directe trappings, details, xp, randomState, mode

### Réhydratation des Références

**Principe** : JSON contient `id` uniquement → Lookup table référence + merge

**Process** :
- Characteristics/Skills/Talents : `CharGen.all*[id]` → Clone → Merge données personnage
- Skills/Talents : Copie `specs`/`spec` avant merge (spécialisations joueur)
- Specie/CareerLevel : Lookup direct → `setSpecie()`/`setCareerLevel()`

**Exemple Skill** :
`{ id: "art", spec: "Calligraphe", advance: 5 }` → Lookup "art" → Merge → Skill complet

### Gestion Spécialisations

**Étapes** :
1. Lookup + Clone : `Helper.clone(CharGen.allSkills[id])`
2. Restauration specs : `elem.specs = el.specs`, `elem.spec = el.spec`
3. Reset specName : `elem.specName = ''` (recalculé)
4. Merge : `Helper.merge(el, char)`

**Raison** : specs modifiables par joueur (pas référence statique)

## Gestion Erreurs

**Personnage non trouvé** : saveName invalide → Retour `""` → Message erreur
**JSON corrompu** : JSON.parse échoue → Exception non catchée (crash V1)
**Références manquantes** : ID invalide → `setSpecie(undefined)` → Crash potentiel (validation manquante V1)

## Appel Client

**Type** : GET, paramètres `action=load`, `saveName=_x7k2pm9q`
**Réponse** : JSON personnage ou chaîne vide

**Workflow** : URL `?code=_x7k2pm9q` → `load(code)` → `character.load(data)` → Wizard stepIndex

## Cas d'Usage

**Reprise création** (stepIndex 1) : Wizard s'ouvre step Characteristics, données pré-remplies
**Modification validé** (stepIndex -1) : Wizard s'ouvre Resume, édition details/XP/trappings

## Exemples Concrets

### Exemple 1 : Agitateur Humain (Step Career)

**Code** : `_x7k2pm9q`
**JSON** : stepIndex 1, specie "human", careerLevel "agitator_1", skills/talents niveau 1
**Reconstruction** : Lookup tables → Specie complète, CareerLevel complet, 18 characteristics, skills/talents réhydratés
**Résultat** : Wizard step Characteristics, données pré-remplies

### Exemple 2 : Franz Gruber Validé

**Code** : `_x7k2pm9q`
**JSON** : stepIndex -1, details "Franz Gruber 24 ans", xp 150/200, trappings complets
**Résultat** : Wizard Resume, édition possible

### Exemple 3 : Code Invalide

**Code** : `_invalid123` → JSON vide → Message "Code invalide"

## Voir Aussi

- [sheets-save.md](./sheets-save.md) - Sauvegarde personnages
- [character-model-save-load.md](../character-model/save-load.md) - Méthodes save/load
- [pattern-validation-references.md](../../patterns/pattern-validation-references.md) - Validation IDs
