# Interface Administration

## Objectif

Interface d'administration permet modifier données de référence jeu (species, careers, talents, skills, spells, trappings, etc.) directement dans Google Sheets via interface web sécurisée.

## Authentification

**Protection routes**: Accès réservé administrateurs authentifiés, redirection automatique page login si non authentifié, session maintenue pendant utilisation

**Page login**: Formulaire authentification simple, validation identifiants côté serveur, message erreur si échec, pas système récupération mot de passe (gestion manuelle)

## Navigation

**Menu principal**: Sélection déroulante catégories données à éditer, organisation hiérarchique par type contenu, structure arborescente reflétant organisation données

**Catégories disponibles**: Species, Careers, Talents, Skills, Spells, Trappings, Tables référence (Lores, Gods, Stars, Books, Classes, Characteristics, Details)

## Interface Two-Panel

**Panneau gauche (Liste)**: Affichage hiérarchique éléments catégorie sélectionnée, indentation visuelle niveaux hiérarchie, barre recherche filtrer éléments, sélection élément pour édition, indication visuelle élément sélectionné

**Panneau droit (Édition)**: Formulaire édition élément sélectionné, champs adaptés type données (texte, select, textarea), boutons Valider (sauvegarder), Dupliquer (créer basé existant), Prévisualiser (descriptions HTML optionnel)

## Workflow d'Édition

**Sélection élément**: Choisir catégorie menu principal → Filtrer/rechercher élément panneau gauche → Cliquer élément ouvrir édition → Formulaire remplit automatiquement données existantes

**Modification**: Éditer champs nécessaires → Utiliser éditeurs riches descriptions (HTML) → Sélectionner valeurs listes déroulantes (avec autocomplétion) → Cliquer Valider sauvegarder

**Duplication**: Sélectionner élément source → Cliquer Dupliquer → Nouvel élément créé avec mêmes données structure (type, subType, book, page) → Tous autres champs vidés → Label défini "new Item" → Élément inséré juste après source → Formulaire édition ouvre automatiquement

**Annulation**: Rechargement données originales si modification non sauvegardée, retour état initial en changeant catégorie ou élément

## Champs d'Édition

**Champs texte simples**: Nom, label, titre, abréviation, préfixe, suffixe

**Champs textarea**: Description (avec éditeur HTML riche), notes, commentaires, listes (skills, talents, trappings séparées virgules)

**Listes déroulantes**: Sélection parmi valeurs prédéfinies, autocomplétion faciliter recherche, mode "free" permettant ajouter nouvelles valeurs à la volée

**Champs numériques**: Page référence, valeurs caractéristiques, quantités, modificateurs, CN, enc, price

**Champs complexes**: Livre et page (combinaison select + input), listes éléments, tableaux valeurs

## Autocomplétion

**Mode standard (autocomplete)**: Liste fermée valeurs prédéfinies, recherche par saisie, sélection obligatoire dans liste, utilisé références fixes (books, species, careers)

**Mode libre (autocomplete-free)**: Liste suggestions mais saisie libre autorisée, si valeur saisie non existante ajoutée automatiquement liste, utilisé champs extensibles (nouveaux talents, nouvelles compétences, nouveaux lores)

## Éditeur HTML Riche

**Fonctionnalités**: Mise en forme texte (gras, italique, souligné), listes à puces et numérotées, sauts ligne et paragraphes, conservation balises HTML personnalisées

**Prévisualisation**: Bouton optionnel prévisualiser rendu HTML (voir admin-preview.md), affichage popup modale, conversion sauts ligne en br, nettoyage sauts ligne multiples fin texte

## Sauvegarde

**Processus**: Collecte données formulaire EditHelper.prepareData → Conversion structures imbriquées en format texte → Nettoyage valeurs (trim, remplacement caractères spéciaux ' → ') → Envoi serveur Google Apps Script google.script.run.saveData → Mise à jour données base Google Sheets → Rechargement partiel données modifiées → Restauration état interface (position, sélection, recherche)

**Feedback utilisateur**: Loader affiché pendant sauvegarde (~2s), retour automatique élément modifié après sauvegarde, conservation position scroll et filtre recherche

**Gestion erreurs**: Rollback automatique si erreur, état Google Sheets restauré, message erreur, pas modifications partielles

## Gestion Contenu Personnalisé (Homebrew)

**Marquage source**: Champ "book" indique source (officiels: LDB, Middenheim, AA, ADE3, SOC, Salzemund / homebrew: "Homebrew", "Custom", "Community")

**Affichage visuel**: Icône ou badge "Homebrew" sur contenu personnalisé, filtre affichage (officiels only, homebrew only, all), tri par source

**Création homebrew**: Via duplication (dupliquer entrée officielle, modifier book → "Homebrew") OU via création manuelle (créer nouvelle entrée, définir book = "Homebrew")

**Validation homebrew**: Même validation que officiel (schémas JSON, cohérence données), équilibrage non vérifié automatiquement (responsabilité créateur/MJ), références vers contenu officiel autorisées

## Import/Export JSON

**Export sélectif**: Choix tables à exporter, export complet (toutes tables), format JSON structuré compatible import, téléchargement fichier .json local

**Cas usage export**: Backup régulier (hebdomadaire), partage homebrew (talents personnalisés communauté), migration (réimport autre instance), versionning externe (avant modifications majeures)

**Import**: Upload fichier .json local, validation format (structure JSON conforme schémas), aperçu données avant import effectif, modes import (remplacement complet / fusion ajout / mise à jour existantes), gestion conflits (doublon index/label)

**Validation import**: Vérification structure (champs obligatoires), vérification types (number, string, boolean), liste erreurs si invalide, backup automatique état actuel avant import

## Historique Modifications (Non Implémenté)

**Fonctionnalités attendues V2**: Log modifications (qui, quand, quoi), historique par entrée, comparaison versions (diff avant → après), rollback restauration version antérieure

**Implémentation actuelle**: Backup unique automatique avant modification (écrasé chaque sauvegarde), pas log auteur/date, pas historique consultable, rollback limité (uniquement si erreur immédiate)

## Relations

**Dépendances**: audit/database/[species|careers|talents|skills|spells|trappings].md - Structures données

**Fonctionnalités liées**: admin-edit-entities.md - Édition tables, admin-validation.md - Validation modifications, admin-preview.md - Prévisualisation, admin-batch.md - Opérations batch, admin-permissions.md - Contrôle accès

## Limites et Contraintes

**Pas de gestion avancée**: Pas permissions granulaires (admin = accès complet), pas historique modifications consultable, pas vérification conflits concurrents, pas mode brouillon (modifications immédiates)

**Validation basique**: Validation schéma JSON côté serveur uniquement, pas validation métier temps réel, pas détection automatique incohérences

**Pas de sandboxing homebrew**: Homebrew mélangé avec officiel dans mêmes tables

**Pas de versionning**: Modifications homebrew écrasent précédentes

**Pas de système rating communautaire**: Pas notes/commentaires sur contenus partagés
