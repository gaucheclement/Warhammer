# Save/Load - Google Sheets Save

## Contexte

Sauvegarde de personnages dans Google Sheets via feuille "Save" avec système clé-valeur. Chaque personnage est identifié par un code unique (saveName) permettant sa récupération ultérieure.

## Structure Feuille Save

**Format** : Colonnes A:B
- **Colonne A** : saveName (identifiant unique)
- **Colonne B** : JSON personnage complet

**Caractéristiques** :
- Clé-valeur simple (2 colonnes)
- Une ligne = un personnage
- Recherche linéaire sur colonne A

## Identifiant Unique (saveName)

**Génération** (si vide, première sauvegarde) :
- Format : `_` + 9 caractères alphanumériques
- Algorithme : `Math.random().toString(36).substr(2, 9)`
- Exemple : `_k3f9zm2lp`

**Mise à jour** (si existe) :
- Réutilisation clé existante
- Pas de nouvelle ligne créée

**Propriétés** :
- Unique, court (10 caractères), permanent, communicable

## Sérialisation du Personnage

### Méthode character.save(step)

**Étapes** :
1. `deleteEmpty()` - Supprime éléments vides
2. Clonage complet (évite mutation originale)
3. Suppression champ `data` (toutes entités référencées)

**Suppression champ data** :
- Specie, Star, CareerLevel, Characteristics, Skills, Talents, Spells
- Raison : `data` contient définitions statiques (déjà dans tables référence)
- Conservation : `id` + données personnage (advance, spec, origin)
- Économie : ~70% réduction taille JSON

### Gestion stepIndex

**Si step fourni** : `stepIndex += step` (avancement wizard)
**Si step null** : stepIndex inchangé (sauvegarde simple)
**Si stepIndex === -1** : Personnage validé (pas d'incrémentation)

### Format JSON

**Structure** :
- `stepIndex` : État wizard (-1 = validé)
- `mode` : "random" ou "free"
- `specie`, `careerLevel` : ID + données personnage (sans champ data)
- `characteristics`, `skills`, `talents`, `spells` : Tableaux (sans champ data)
- `trappings` : Possessions complètes
- `details` : Nom, âge, taille, yeux, cheveux
- `xp` : Actuelle, dépensée, totale, historique
- `randomState` : État choix aléatoires

**Exemples éléments** :
- Characteristic : `{ id: "ws", base: 25, advance: 10, value: 35, origin: [...] }`
- Skill : `{ id: "art", spec: "Calligraphe", advance: 5, value: 30, origin: [...] }`
- Talent : `{ id: "hardy", max: 3, advance: 2, origin: [...] }`

## Écriture Google Sheets

### Algorithme

1. Lecture feuille : `getRange('Save!A:B').getValues()`
2. Recherche clé : Parcours colonne A
   - Trouvée : Position `i` → mise à jour
   - Non trouvée : Position `i` = première ligne vide
3. Génération clé si vide
4. Écriture : `val[i][0] = key`, `val[i][1] = JSON.stringify(save)`
5. Commit batch : `setValues(val)`

**Optimisations** :
- Lecture/écriture batch (pas ligne par ligne)
- Recherche linéaire O(n) acceptable (<100 personnages)

**Retour** : saveName (ContentService JSON)

## Appel Client

**Type** : POST vers `Helper.googleURL`
**Content-Type** : `text/plain;charset=utf-8`

**Payload** :
- `action`: "save"
- `saveName`: Vide (nouveau) ou existant (mise à jour)
- `data`: Résultat character.save(step)

**Réponse** : saveName (nouveau si généré, inchangé si mise à jour)

**Workflow asynchrone** :
`saveDatabaseCharacter(afterFunction, step)` → `character.save(step)` → fetch POST → `afterFunction(saveName)`

**UI** : Loader affiché pendant requête

## Exemples Concrets

### Exemple 1 : Première Sauvegarde (Agitateur Humain, step Species)

**Entrée** : saveName vide, stepIndex 0, step +1
**JSON** : specie: "human", characteristics base, skills/talents vides
**Sortie** : saveName généré `_x7k2pm9q`, stepIndex devient 1
**Résultat** : Nouvelle ligne créée, joueur reçoit code

### Exemple 2 : Mise à Jour (Ajout Career)

**Entrée** : saveName `_x7k2pm9q`, stepIndex 1, step +1
**JSON** : + careerLevel "agitator_1", + skills/talents niveau 1
**Sortie** : saveName inchangé, stepIndex devient 2
**Résultat** : Ligne existante mise à jour, pas de nouvelle ligne

### Exemple 3 : Personnage Validé (Resume)

**Entrée** : saveName `_x7k2pm9q`, stepIndex 9, validation → -1
**JSON** : Complet (details "Franz Gruber", xp 150/200, trappings, etc.)
**Sortie** : saveName inchangé, stepIndex = -1 (définitif)
**Résultat** : Personnage terminé, chargeable en mode édition

## Voir Aussi

- [sheets-load.md](./sheets-load.md) - Chargement personnages
- [character-list.md](./character-list.md) - Gestion liste personnages
- [character-model-save-load.md](../character-model/save-load.md) - Méthodes save/load
- [pattern-validation-references.md](../../patterns/pattern-validation-references.md) - Validation IDs
