# Admin - Opérations batch

## Vue d'ensemble

Opérations manipulation multiples données : export/import tables, sauvegarde/restauration, partage homebrew.

## Export

### Modes

Export sélectif : Choix tables à exporter, fichier JSON tables sélectionnées.

Export complet : Toutes tables en un fichier JSON.

### Format

Structure : JSON organisé par table avec toutes entrées.

Nom fichier : `warhammer_export_YYYYMMDD.json` (complet) ou `[table].json` (sélectif).

Taille : Export complet ~2.5 MB.

### Cas usage

Backup régulier, partage homebrew, migration, versionning.

## Import

### Modes

Remplacement complet : Écrase table existante.

Fusion : Ajoute nouvelles entrées, conserve existantes, ignore doublons.

Mise à jour : Modifie entrées existantes, conserve non modifiées, ajoute nouvelles.

### Validation

Format : Structure JSON valide, champs obligatoires présents, types corrects.

Références : Validation croisées si possible.

Cohérence : Vérification hiérarchies.

### Gestion conflits

Doublon index : Remplacement écrase, fusion ignore, MAJ remplace.

Doublon label : Alerte, décision manuelle.

Références manquantes : Bloquer import, signaler erreur.

### Process

Upload → Validation → Aperçu → Choix mode → Backup → Import → Confirmation.

Feedback : "X entrées ajoutées, Y modifiées, Z ignorées".

## Sauvegarde entités

### Validation avant

Champs obligatoires : Vérifier présence index, label.

Cohérence : Références valides, valeurs plages acceptables.

Blocage : Si erreur, sauvegarde bloquée avec messages.

### Backup

Copie état actuel avant modification, rollback si erreur.

Un seul backup, écrasé chaque sauvegarde.

### Conversion

Arrays vers texte : Listes virgules pour stockage.

Nettoyage : Trim espaces, normalisation.

### Feedback

En cours : Loader (<2s).

Succès : Retour auto, conservation état.

Erreur : Message explicite (validation, réseau, timeout 30s).

## Partage communautaire

Export homebrew : Filtrage book="Homebrew", fichier `homebrew_pack.json`.

Import homebrew : Mode fusion, validation manuelle MJ.

## Limites

Pas rollback partiel, pas merge intelligent, validation limitée références, pas compression, pas filtrage avancé, pas transformation formats, pas mode brouillon, pas versionning, pas détection conflits concurrents.

## Voir aussi

- [admin-validation.md](./admin-validation.md)
- [admin-edit-entities.md](./admin-edit-entities.md)
- [admin-permissions.md](./admin-permissions.md)
- [../../database/](../../database/)
