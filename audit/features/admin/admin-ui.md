# Admin - Interface

## Vue d'ensemble

Interface admin modifie données référence jeu via interface web sécurisée.

## Authentification

Protection routes : Accès réservé admins, redirection login si non authentifié.

Page login : Formulaire simple, validation serveur, pas récupération mot de passe.

## Navigation

Menu principal : Sélection catégories données, organisation hiérarchique.

Catégories : Species, Careers, Talents, Skills, Spells, Trappings, Tables référence (Lores, Gods, Stars, Books, Classes, Characteristics, Details).

## Interface Two-Panel

Panneau gauche : Liste hiérarchique éléments, indentation niveaux, barre recherche, indication sélection.

Panneau droit : Formulaire édition, champs adaptés type, boutons Valider/Dupliquer/Prévisualiser.

## Workflow édition

Sélection : Catégorie → Filtrer → Cliquer élément → Formulaire remplit données.

Modification : Éditer champs → Éditeurs riches HTML → Sélectionner valeurs → Valider.

Duplication : Sélectionner source → Dupliquer → "new Item" créé → Formulaire ouvert.

Annulation : Rechargement données si non sauvegardé.

## Champs édition

Texte simples : Nom, label, titre.

Textarea : Description (HTML riche), notes, listes virgules.

Listes déroulantes : Valeurs prédéfinies, autocomplétion, mode "free" ajout valeurs.

Numériques : Page, valeurs caractéristiques, CN, enc, price.

## Autocomplétion

Standard : Liste fermée prédéfinies, sélection obligatoire.

Libre : Suggestions mais saisie libre, ajout automatique.

## Éditeur HTML

Fonctionnalités : Gras, italique, souligné, listes, sauts ligne.

Prévisualisation : Bouton optionnel popup modale.

## Sauvegarde

Process : Collecte → Conversion → Nettoyage → Validation → Backup → Mise à jour → Rechargement → Restauration.

Feedback : Loader (~2s), retour auto, conservation position/filtres.

Erreurs : Rollback auto, restauration, message explicite.

## Homebrew

Marquage : Champ "book" indique source (LDB/Homebrew).

Affichage : Icône "Homebrew", filtre affichage, tri source.

Création : Via duplication (modifier book → "Homebrew") ou manuelle (book = "Homebrew").

Validation : Même que officiel (schémas JSON), équilibrage non vérifié.

## Import/Export

Export : Choix tables, complet ou sélectif, format JSON, download .json.

Usage export : Backup, partage homebrew, migration, versionning.

Import : Upload .json, validation format, aperçu, modes (remplacement/fusion/MAJ), gestion conflits.

Validation import : Structure, types, erreurs si invalide, backup avant import.

## Limites

Pas gestion avancée permissions, pas vérification conflits concurrents, pas mode brouillon, validation basique, pas sandboxing homebrew, pas versionning, pas rating communautaire.

## Voir aussi

- [../../database/](../../database/)
- [admin-edit-entities.md](./admin-edit-entities.md)
- [admin-validation.md](./admin-validation.md)
- [admin-preview.md](./admin-preview.md)
- [admin-batch.md](./admin-batch.md)
- [admin-permissions.md](./admin-permissions.md)
