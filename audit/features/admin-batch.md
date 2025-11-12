# Opérations Batch et Imports/Exports

## Objectif

Gère les opérations batch permettant manipulation multiple données simultanément via import/export JSON et sauvegarde/restauration complète.

## Export Données JSON

**Fonctionnalités export**: Export sélectif (choix tables à exporter), export complet (toutes tables un seul fichier JSON), format JSON structuré compatible import, téléchargement fichier .json local

**Modes export**: Export table unique (ex: talents.json), export multi-tables (sélection multiple tables), export complet (toutes tables warhammer_full_backup.json)

**Format JSON généré**: Structure par table {"species": [...142 entrées...], "careers": [...117 entrées...], "talents": [...389 entrées...], ...}, par entrée tous champs (index, label, book, page, desc, etc.), préservation format identique données Google Sheets

**Processus export**: Sélection (interface checkboxes sélectionner tables ou bouton "Export complet") → Génération (lecture données Google Sheets, conversion JSON, formatage indentation pretty print) → Téléchargement (génération fichier .json, téléchargement navigateur, nom fichier warhammer_export_YYYYMMDD.json)

**Cas usage**: Backup régulier (export complet hebdomadaire sauvegarde), partage homebrew (export talents personnalisés partage communauté), migration (export réimport autre instance ou système externe), versionning externe (export avant modifications majeures)

**Exemples export**:
- Backup complet: Export complet → warhammer_backup_20250108.json (~2.5 MB) → Contient toutes tables complètes
- Partage talents homebrew: Sélectionner table "talents" → Export custom_talents.json → Fichier contient 389 talents → Partageable autres utilisateurs import
- Migration Foundry VTT: Export complet → Fichier JSON utilisé conversion Foundry

## Import Données JSON

**Fonctionnalités import**: Upload fichier .json local, validation format (vérification structure JSON conforme schémas), aperçu données avant import effectif, modes import multiples

**Modes import**: Remplacement complet (écrase table existante), fusion (ajoute entrées, conserve existantes, ignore doublons), mise à jour (modifie entrées existantes par index/label)

**Format JSON attendu**: Structure par table {"species": [...], "careers": [...], "talents": [...], ...}, structure par entrée même format données existantes Google Sheets

**Processus import**: Upload (sélection fichier .json local, lecture contenu fichier, parse JSON) → Validation (vérification structure champs obligatoires, vérification types number/string/boolean, vérification références si possible, liste erreurs si invalide) → Aperçu (affichage résumé nombre entrées par table, détection conflits index/labels existants, choix mode import) → Import (backup automatique état actuel, écriture Google Sheets selon mode choisi, rechargement données) → Confirmation (message succès détails X entrées ajoutées, Y modifiées, Z ignorées)

**Gestion conflits**: Doublon index (mode remplacement écrase, mode fusion ignore nouvel import, mode mise à jour remplace si index identique), doublon label (alerte utilisateur, décision manuelle garder existant/remplacer/renommer)

**Validation avancée**: Références croisées (vérifier refChar/refCareer/etc. existent), cohérence hiérarchies (careers parent-enfant valides), pas corruption (préservation intégrité données existantes)

**Exemples import**:
- Import talents homebrew: Upload custom_talents.json (5 nouveaux talents) → Validation OK → Aperçu "5 nouveaux talents détectés" → Mode fusion sélectionné → Import ajout 5 talents table existante → Confirmation "5 talents ajoutés avec succès"
- Import backup complet: Upload warhammer_backup.json (toutes tables) → Validation OK → Mode remplacement → Import écrasement complet toutes tables → Confirmation "142 species, 117 careers, 389 talents... importés"

## Sauvegarde et Restauration

**Process sauvegarde**: Collecte données formulaire (EditprepareData parcourt tous champs [name]) → Conversion structures imbriquées (arrays) en format texte → Nettoyage valeurs (trim, remplacement caractères spéciaux ' → ') → Validation (voir admin-validation.md, si erreur blocage sauvegarde + affichage messages) → Backup automatique (copie état actuel Google Sheets avant modification, permet rollback si erreur) → Écriture Google Sheets (google.script.run.saveData, appel asynchrone Google Apps Script, écriture ligne correspondant index dans sheet approprié) → Rechargement partiel (CharacterGenerator().loadPartialDataAndDisplay, rechargement uniquement données modifiées optimisation, mise à jour affichage sans full reload) → Restauration interface (retour même onglet tabs-X, restauration position scroll, restauration filtre recherche, ré-sélection élément modifié)

**Feedback utilisateur**: Loader overlay "body" avec icône chargement pendant sauvegarde, durée généralement < 2 secondes, confirmation retour automatique élément modifié = confirmation implicite, pas message explicite si succès (interface restaure silencieusement)

**Gestion erreurs**: Erreur validation (blocage avant envoi, affichage erreurs), erreur réseau (timeout après 30 secondes, message erreur générique), erreur serveur (rollback automatique, état Google Sheets restauré, message erreur), erreur parsing (retour erreur JSON malformé)

**Format données sauvegardées**: Structure JSON {"typeItem": "species", "index": 5, "label": "Humains (Reiklander)", "book": "LDB", "page": 12, ...autres champs...}, arrays convertis ([{label: "Skill1"}, {label: "Skill2"}] → "Skill1, Skill2"), valeurs nettoyées (trim, ' → ', sauts ligne normalisés)

**Optimisations sauvegarde**: Rechargement partiel (seule table modifiée rechargée), pas full reload (évite rechargement complet application), conservation état (position, filtres, sélection préservés)

## Backup et Historique

**Backup automatique**: Un seul backup automatique avant chaque modification, backup écrasé chaque nouvelle sauvegarde (pas historique multiple), restauration automatique si erreur immédiate

**Historique modifications (non implémenté V1)**: Log modifications (enregistrement chaque modification qui/quand/quoi), historique par entrée (liste modifications entrée spécifique, chronologie complète), comparaison versions (diff version N vs N-1, affichage champs modifiés avant → après, visuel type git diff), rollback (restauration version antérieure, annulation dernière modification, retour version spécifique date/version)

**Données logger (proposition V2)**: Par modification (timestamp YYYY-MM-DD HH:MM:SS, user email/nom admin, table species/careers/talents/etc., index/label entrée, type opération CREATE/UPDATE/DELETE, valeurs avant snapshot, valeurs après snapshot), stockage table séparée Google Sheets "admin_history", rotation conserver 6 mois historique archivage au-delà, taille estimation 10-50 KB par modification ~1-5 MB/mois

## Partage Communautaire

**Export sélectif homebrew**: Exporter uniquement contenu homebrew → homebrew_pack.json (filtrage par book="Homebrew"), partage communauté via forum/discord/etc.

**Import partage**: Importer pack homebrew autres utilisateurs, mode fusion (ajout sans écraser officiel)

**Attribution**: Champ "author" optionnel créditer créateur (non implémenté V1)

**Validation communautaire**: Pas système validation intégré (validation manuelle MJ avant import)

## Relations

**Dépendances**: admin-validation.md - Validation JSON, audit/database/*.md - Schémas tables

**Fonctionnalités liées**: admin-ui.md - Interface admin, admin-edit-entities.md - Formulaires sources, admin-permissions.md - Contrôle accès batch operations

## Limites et Contraintes

**Pas de rollback partiel**: Si erreur pendant import, rollback complet (pas annulation partielle)

**Pas de merge intelligent**: Fusion basique (ajoute ou ignore), pas merge champ par champ

**Validation limitée**: Références croisées non vérifiées exhaustivement

**Pas de compression**: Fichiers volumineux (MB) si export complet

**Pas de filtrage avancé**: Export table entière, pas sélection par critères (ex: exporter uniquement species LDB)

**Pas de transformation**: Export brut, pas conversion format (ex: conversion CSV ou XML)

**Pas de mode brouillon**: Sauvegarde immédiate, pas annulation possible après validation

**Pas de versionning**: Pas historique modifications consultable (voir admin-ui.md section Historique)

**Pas de détection conflits concurrents**: Si modification concurrente, dernière écrase précédente (pas merge automatique)

**Backup unique**: Un seul backup automatique (écrasé chaque sauvegarde, pas historique versions multiples)
