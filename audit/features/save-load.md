# Save/Load - Sauvegarde et restauration

## Vue d'ensemble

Système de persistance personnages supportant stockage cloud (Google Sheets), export/import JSON local, et gestion multi-personnages. Trois modes : sauvegarde automatique cloud, export manuel fichier, import depuis fichier.

## Sérialisation personnage

### Méthode save(step)

**Étapes** : `deleteEmpty()` → Clonage complet → Suppression champ `data`

**Suppression champ data** : Specie, Star, CareerLevel, Characteristics, Skills, Talents, Spells. Contient définitions statiques (déjà dans tables référence). Conservation : `id` + données personnage (advance, spec, origin). Économie ~70% taille JSON.

**Gestion stepIndex** : Si step fourni `stepIndex += step`, si null inchangé, si -1 personnage validé (pas incrémentation).

**Structure JSON** : `stepIndex` (état wizard, -1 = validé), `mode` (random/free), `specie`/`careerLevel` (ID + données sans data), `characteristics`/`skills`/`talents`/`spells` (tableaux sans data), `trappings` (possessions complètes), `details` (nom, âge, taille, yeux, cheveux), `xp` (actuelle, dépensée, totale, historique), `randomState` (choix aléatoires).

**Exemple** : Characteristic `{ id: "ws", base: 25, advance: 10, value: 35, origin: [...] }`, Skill `{ id: "art", spec: "Calligraphe", advance: 5, value: 30, origin: [...] }`, Talent `{ id: "hardy", max: 3, advance: 2, origin: [...] }`.

### Identifiant Unique (saveName)

**Génération** (première sauvegarde) : Format `_` + 9 alphanumériques, algorithme `Math.random().toString(36).substr(2, 9)`, exemple `_k3f9zm2lp`.
**Mise à jour** : Réutilisation clé existante, pas nouvelle ligne.
**Propriétés** : Unique, court (10 caractères), permanent, communicable.

## Stockage cloud

### Structure Feuille Save (Google Sheets)

**Format** : Colonnes A:B. Colonne A saveName, colonne B JSON personnage. Clé-valeur simple, une ligne = un personnage, recherche linéaire colonne A.

### Écriture (Save)

**Algorithme** : Lecture feuille `getRange('Save!A:B').getValues()` → Recherche clé colonne A (trouvée position i mise à jour, non trouvée i = première ligne vide) → Génération clé si vide → Écriture `val[i][0] = key`, `val[i][1] = JSON.stringify(save)` → Commit batch `setValues(val)`.

**Optimisations** : Lecture/écriture batch, recherche O(n) acceptable <100 personnages.

**Appel Client** : POST vers `googleURL`, Content-Type `text/plain;charset=utf-8`, Payload `action: "save"`, `saveName`, `data`. Réponse saveName (nouveau ou inchangé).

### Lecture (Load)

**Recherche** : Lecture feuille → Parcours linéaire colonne A → Si `val[i][0] === key` retour `val[i][1]` (JSON), sinon `""`.

**Appel Client** : GET, paramètres `action=load`, `saveName=_x7k2pm9q`. Réponse JSON personnage ou vide.

### Reconstruction (load)

**Principe** : Restauration complète en réhydratant références.

**Ordre** : stepIndex → Specie (lookup `allSpecies`) → CareerLevel (lookup `allCareersLevels`) → Characteristics (merge data + personnalisation) → Skills (merge data + spec) → Talents (merge data + spec) → Spells (lookup `allSpells`) → Copie directe trappings, details, xp, randomState, mode.

**Réhydratation** : JSON contient `id` → Lookup table + merge. Characteristics/Skills/Talents `all*[id]` → Clone → Merge. Skills/Talents copie `specs`/`spec` avant merge.

**Spécialisations** : Lookup + Clone `clone(allSkills[id])` → Restauration specs `elem.specs = el.specs`, `elem.spec = el.spec` → Reset specName `elem.specName = ''` → Merge.

## Stockage local

### Export JSON

**Différence vs Sheets** : Fichier local (vs cloud), export manuel (vs automatique), données complètes avec `data` optionnel (vs optimisé), format portable (vs saveName).

**Format** : `{ character: {...}, version: "1.0", exportDate: "ISO8601", metadata: {...} }`.

**Processus** : `save(null)` → Ajout `data` optionnel → Création objet racine → `JSON.stringify(exportData, null, 2)`.

**Téléchargement** : Création Blob `new Blob([json], {type: "application/json"})` → URL `URL.createObjectURL(blob)` → Lien `<a download="json" href=url>` → Click `link.click()` → Nettoyage `URL.revokeObjectURL(url)`.

**Nom fichier** : `{nom}_{espece}_{carriere}.json` (ex `Franz-Gruber_Humain_Agitateur.json`), fallback `character_{timestamp}.json`.

**Cas usage** : Backup local, partage MJ/joueurs, migration Foundry VTT, version control, analyse scripts.

### Import JSON

**Processus** : Input file `<input type="file" accept=".json">` → Lecture `FileReader.readAsText(file)` → Parsing `JSON.parse(text)` → Validation structure → Chargement `load(data.character || data)`.

**Formats supportés** : Export JSON complet (avec metadata), léger (character seul), Sheets Save (compatible).

**Validation** : JSON valide, champ `stepIndex` présent, type object.

**Erreurs** : JSON invalide "Fichier corrompu", structure invalide "Format non reconnu", version incompatible "Version non supportée".

**Différence vs Sheets** : Source fichier local vs cloud, format complet ou léger vs toujours léger, validation stricte vs minimale.

**Sécurité** : Pas eval (JSON.parse uniquement), limite taille 10 MB, validation stricte, sanitization HTML.

## Gestion liste personnages

### Source données

**Feuille Save** : Colonnes A:B saveName + JSON. Extraction métadonnées parse JSON ligne par ligne (nom, espèce, carrière, niveau, stepIndex, xp). Construction liste sans chargement complet.

**Performance** : Lecture batch, parsing minimal metadata, tri/filtrage côté client.

### Affichage

**Colonnes** : Nom (ou "Sans nom"), Espèce, Carrière, Niveau (1-4), Statut (En création/Validé), Date modification.

**Indicateurs** : stepIndex -1 badge "Validé" vert, 0-9 badge "En création" orange + étape, XP "150/200 XP".

**Tri** : Défaut date modification récent, options nom/espèce/carrière/XP.

**Filtrage** : Par espèce, statut, carrière, recherche textuelle nom.

### Actions

**Charger** : Click ligne/bouton → `load(saveName)` → `load(data)` → Wizard stepIndex.

**Supprimer** : Bouton poubelle → Confirmation dialogue nom → Suppression ligne feuille Save (shift rows). Définitif.

**Dupliquer** : Chargement → Génération nouveau saveName → Sauvegarde nouveau code → Ajout liste.

**Export Batch** : Sélection multiple → "Exporter sélection" → ZIP tous JSON.

**Pagination** (>20) : 20 par page, navigation « Précédent | 1 2 3 | Suivant ».

## Exemples concrets

### Première Sauvegarde (Agitateur Humain, step Species)

Entrée saveName vide stepIndex 0 step +1 → JSON specie "human" characteristics base skills/talents vides → Sortie saveName `_x7k2pm9q` stepIndex 1 → Nouvelle ligne joueur reçoit code.

### Chargement Personnage Validé

Code `_x7k2pm9q` → JSON stepIndex -1 details "Franz Gruber 24 ans" xp 150/200 trappings complets → Wizard Resume édition possible.

### Export puis Import

Export bouton "Exporter JSON" → `Franz-Gruber_Humain_Agitateur.json` 78 KB avec data → Import upload → Parse → Validation → Chargement → Wizard Resume.

### Mise à Jour (Ajout Career)

Entrée saveName `_x7k2pm9q` stepIndex 1 step +1 → JSON + careerLevel "agitator_1" + skills/talents niveau 1 → Sortie saveName inchangé stepIndex 2 → Ligne existante mise à jour.

### Code Invalide

Code `_invalid123` → JSON vide → Message "Code invalide".

### Liste 5 Personnages

| Nom | Espèce | Carrière | Niveau | Statut | XP |
|-----|--------|----------|--------|--------|-----|
| Franz Gruber | Humain | Agitateur | 1 | Validé | 150/200 |
| Thorin | Nain | Artisan | 2 | Validé | 250/300 |
| Sans nom | Elfe | Érudit | 1 | En création | 0/175 |

Click "Franz Gruber" → Wizard Resume stepIndex -1.

### Suppression Personnage

Click poubelle "Sans nom" → Confirmation "Supprimer définitivement 'Sans nom' (Elfe Érudit) ?" → Ligne supprimée → Liste rafraîchie 2 personnages.

### Filtrage par Espèce

Sélection filtre "Nain" → Affichage "Thorin" uniquement 1/5 → Reset "Tous" → Affichage complet.

## Gestion erreurs

**Personnage non trouvé** : saveName invalide → Retour `""` → Message erreur.
**JSON corrompu** : JSON.parse échoue → Exception non catchée (crash V1).
**Références manquantes** : ID invalide → `setSpecie(undefined)` → Crash potentiel (validation manquante V1).
**Fichier non JSON** : Extension .txt → Erreur parse → Message explicite.

## Voir aussi

- [character-model-save-load.md](../character-model/save-load.md) - Méthodes save/load détaillées
- [pattern-validation-references.md](../../patterns/pattern-validation-references.md) - Validation IDs
