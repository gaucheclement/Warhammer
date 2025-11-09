# Serialisation JSON

## Vue d'ensemble

Systeme import/export format JSON interne application. Sauvegarde locale, backup, partage personnages, migration versions futures. Format natif sans transformation contrairement export Foundry.

### Difference vs Foundry

**Foundry Export** : Transformation vers format specifique Foundry VTT, mapping requis, structure Actor.

**JSON Export** : Serialisation directe objet Character application, format natif.

**Avantage JSON Standard** : Pas perte information, reimport exact, plus simple.

## Export JSON Standard

### Format Export

**Structure** :
```
{
  character: { ... },
  version: "1.0",
  exportDate: "2025-01-15T10:30:00Z",
  metadata: {
    application: "Warhammer Character Generator",
    format: "Standard JSON"
  }
}
```

**Racine** : Objet wrapper avec metadata.

**character** : Objet complet serialise via `character.save(null)`.

### Options Export

**Export Complet** (avec champ `data`) : Inclut data reference complet (species.data, skills.data, etc.), Fichier volumineux (~50-100 KB), Reimport sans lookup tables necessaire.

**Export Leger** (sans champ `data`) : Seulement IDs et valeurs personnage, Fichier compact (~5-10 KB), Reimport necessite tables reference (comme sheets-load).

**V1** : Export complet commente, pas implemente.

### Process Export

1. Serialisation `character.save(null)` (null = pas incrementation stepIndex)
2. Wrapper creation objet racine avec metadata
3. Formatage `JSON.stringify(data, null, 2)` (pretty-print indentation 2 espaces)
4. Blob `new Blob([json], {type: "application/json"})`
5. Telechargement creation lien `<a download="character.json">` + click()

### Nom Fichier

**Format** : `{nom}_{espece}_{carriere}.json`

**Exemple** : `Franz-Gruber_Humain_Agitateur.json`

**Fallback** : `character_{timestamp}.json` (si nom vide)

**Normalisation** : Remplacement espaces par tirets, suppression caracteres speciaux.

### Cas d'Usage

**Backup local** : Sauvegarde personnelle hors cloud Google Sheets.

**Partage** : Envoi personnage MJ/joueurs (email, Discord, etc.).

**Version control** : Historique Git personnages campagne.

**Migration** : Import dans V2 future application.

**Analyse** : Scripts externes parsing stats, generation rapports.

### Exemples Concrets

**Export personnage complet** : Declencheur bouton "Exporter JSON" Resume. Donnees personnage stepIndex -1 (valide). Fichier `Johann-Schmidt_Humain_Agitateur.json` (78 KB). Contenu JSON formate, lisible, reimportable exactement.

**Export personnage intermediaire** : Declencheur export pendant creation (step Characteristics). Donnees stepIndex 2, seulement specie/career/characteristics. Fichier `character_2025-01-15_10-30.json`. Utilite backup intermediaire, reprendre autre machine.

### Validation

**JSON valide** : Parsable JSON.parse sans erreur.

**Champs requis** : stepIndex present.

**Coherence** : stepIndex >= 0 implique specie present.

## Import JSON Standard

### Process Import

1. Upload input file `<input type="file" accept=".json">`
2. Lecture `FileReader.readAsText(file)`
3. Parsing `JSON.parse(text)`
4. Validation verification structure minimale
5. Extraction `data.character || data` (support wrapper ou direct)
6. Chargement `character.load(characterData)`
7. Affichage redirection wizard ecran approprie (stepIndex)

### Formats Supportes

**Export JSON wrapper** : `{character: {...}, version, metadata}`

**Export JSON direct** : `{stepIndex, specie, career, ...}` (character seul)

**Sheets Save** : Compatible (meme format character.save())

### Validation Import

**Validation minimale** : JSON valide (pas exception parse), Type object (pas array, string, etc.), Champ stepIndex present.

**Validation recommandee** (V1 non implementee) : Version format compatible, Champs obligatoires specie (si stepIndex >= 0) characteristics, IDs valides (lookup tables reference), Coherence donnees (advances <= max, etc.).

**Messages erreur** : Fichier corrompu "Fichier JSON invalide. Verifiez format.", Structure invalide "Format non reconnu. Utilisez export application.", Version incompatible "Version non supportee. Mettez jour application.".

### Reconstruction Personnage

**Donnees completes** (avec champ `data`) : Si champ `data` present dans entites utilisation directe (pas lookup tables), Reimport identique export, Independant tables reference actuelles.

**Donnees legeres** (sans champ `data`) : Si seulement IDs lookup tables reference CharGen.data, Merge donnees personnage, Identique process sheets-load.

### Gestion Erreurs

**Fichier non JSON** : Extension .txt, .pdf parse exception message explicite.

**JSON invalide** : `{random: syntax error` parse exception.

**IDs invalides** : Specie "unknown-id" lookup null crash (validation manquante V1).

**Fichier vide** : `""` parse exception.

**Version incompatible** : Format V2 parsing partiel ou erreur.

### Securite

**Risques** : Injection code malveillant (JSON.parse safe, eval interdit), Fichier volumineux (DoS client), Corruption volontaire donnees.

**Mitigations** : Pas eval (JSON.parse uniquement), Limite taille fichier (ex 10 MB max), Validation stricte avant chargement, Sanitization descriptions HTML (eviter XSS).

### Exemples Concrets

**Import export complet** : Fichier `Franz-Gruber.json` (78 KB, avec champs `data`). Process Parse, Validation, Chargement direct. Resultat Wizard Resume, personnage restaure exactement.

**Import export leger** : Fichier `backup.json` (8 KB, IDs uniquement). Process Parse, Validation, Lookup tables, Merge, Chargement. Resultat Identique sheets-load.

**Import fichier corrompu** : Fichier syntax error JSON. Erreur JSON.parse exception. Message "Fichier JSON invalide...". Resultat Pas chargement, retour ecran import.

### Cas d'Usage

**Restauration backup** : Recuperation apres perte cloud.

**Partage joueur-joueur** : Envoi personnage email/Discord.

**Migration V0 vers V1** : Import anciens exports (si format compatible).

**Batch import** : Chargement multiples personnages (MJ campagne).

## Compatibilite Versions

### Versioning Format

**Version actuelle** : "1.0" (V1 application)

**Champ version** : metadata.version ou version racine JSON export

**Stockage** : Version enregistree lors export, verifiee lors import

### Evolutions Format

**Changements mineurs** (1.0 vers 1.1) : Exemples ajout champs optionnels, nouveaux types talents, skills additionnels. Compatibilite ascendante (imports anciens fonctionnent). Strategie fallback valeurs par defaut champs absents.

**Changements majeurs** (1.0 vers 2.0) : Exemples restructuration caracteristiques, changement IDs, nouveau format spells. Compatibilite non garantie transformation necessaire. Strategie migration script convertissant V1 vers V2.

### Migration Donnees

**Process migration** : Detection lecture champ version JSON import. Comparaison version < versionActuelle migration requise. Transformation application migrations sequentielles (1.0→1.1→1.2→2.0). Validation verification coherence post-migration. Chargement import donnees migrees.

**Migrations possibles 1.0 vers 1.1** : Ajout champ character.background (default ""), Ajout champ talents.tier (default 1).

**Migrations possibles 1.0 vers 2.0** (hypothetique) : Refonte IDs string vers numeric, Separation skills base vs advanced, Nouveau format spells lore vers school.

### Compatibilite Ascendante

**Principe** : Nouveaux exports importables dans anciennes versions (avec perte features recentes).

**Strategie** : Champs nouveaux marques optionnels, Anciennes versions ignorent champs inconnus, Fonctionnalites core preservees.

**Exemple** : Export V1.2 inclut character.motivation (nouveau). Import V1.0 ignore motivation charge reste normalement. Resultat personnage fonctionnel V1.0 (sans motivation).

### Compatibilite Descendante

**Principe** : Anciens exports importables dans nouvelles versions.

**Strategie** : Nouvelles versions detectent version export, Application migrations automatiques, Fallback valeurs par defaut manquantes.

**Exemple** : Export V1.0 pas champ background. Import V1.2 detecte version 1.0 applique migration ajoute background="". Resultat personnage compatible V1.2.

### Messages Version

**Version trop ancienne** : "Fichier version {version} trop ancien. Migration disponible jusqu'a version {minSupported}."

**Version trop recente** : "Fichier version {version} cree avec version plus recente. Mettez jour application."

**Migration reussie** : "Fichier migre de version {old} vers {new}."

**Warnings** : Perte fonctionnalites "Import V{version} dans V{current}: certaines donnees recentes seront ignorees.", Migration partielle "Migration reussie avec warnings: 3 champs inconnus ignores.".

### Gestion Foundry VTT

**Versions Foundry** : 0.8.x, 9.x, 10.x, 11.x (evolutions API)

**Systeme WFRP** : 6.x, 7.x (changements schema Actor)

**Strategie** : Detection version Foundry dans JSON (flags.core.version), Mapping adaptatif selon version, Fallback formats anciens.

**Exemple** : Export Foundry 0.8 characteristics structure legacy. Import App detecte version applique mapping 0.8. Resultat caracteristiques converties correctement.

### Tests Compatibilite

**Suite tests** : Imports exports V1.0, V1.1, V1.2 verifies.

**Regression** : Nouveaux exports testes import anciennes versions.

**Edge cases** : Fichiers corrompus partiellement, versions exotiques.

### Exemples Concrets

**Migration 1.0 vers 1.2** : Export V1.0 pas champ background ni motivation. Import V1.2 detecte version. Migration ajout background="", motivation="", tier=1 tous talents. Resultat personnage compatible V1.2 editable normalement.

**Import version future** : Export V2.5 (application future). Import V1.2 (actuelle). Erreur "Version 2.5 non supportee. Version actuelle: 1.2. Mettez jour." Resultat import bloque utilisateur doit upgrader app.

**Compatibilite Foundry** : Export Foundry VTT 11.x systeme WFRP 7.2. Import App V1.2 supporte jusqu'a WFRP 7.x. Process mapping adaptatif detecte 7.2 applique transformations correctes. Resultat personnage importe quelques warnings champs nouveaux ignores.

## Voir Aussi

- [foundry-export.md](./foundry-export.md) - Export Foundry VTT (format alternatif)
- [import-export-tests.md](./import-export-tests.md) - Tests validation import/export
- [../save-load/json-export.md](../save-load/json-export.md) - Documentation sauvegarde detaillee
- [../save-load/json-import.md](../save-load/json-import.md) - Documentation import detaillee
