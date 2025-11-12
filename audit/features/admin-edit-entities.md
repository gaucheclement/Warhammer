# Édition Entités Référentielles

## Objectif

Permet l'édition centralisée des tables de référence (species, careers, skills, talents, spells, trappings) via l'interface d'administration. Gère l'ajout, modification et suppression avec leurs propriétés spécifiques.

## Structure Commune Tous Types

**Métadonnées obligatoires**: Index (unique auto), Label (nom), Book (source), Page (référence)
**Classification**: Type/SubType (hiérarchie), Category/Class/Group (organisation)
**Références**: Liens vers autres tables (refChar, refCareer, refDetail)
**Données descriptives**: desc (HTML riche avec éditeur)

## Édition Species

**Champs spécifiques**: refChar, refCareer, refDetail (références obligatoires), rand (1-100 génération aléatoire), skills/talents (listes textuelles virgule)

**Validation**: Label unique, rand unique par groupe variante, références existantes

**Workflow création race**: Dupliquer similaire → Modifier label → Créer refChar/refCareer/refDetail (via edit-other-tables) → Définir rand → Rédiger desc/skills/talents → Valider

**Exemples**: Humains (Ostlander) rand=90, Halflings (Cendreplaine) rand=95, Ogres rand=0 (sélection manuelle)

## Édition Careers

**Champs spécifiques**: Class (Académiques, Artisans, etc.), Level (0-5 hiérarchie), Statut (Argent/Bronze/Or/Laiton), Parent (carrière parente si level>0), Caractéristiques (10 valeurs 0-5), Skills/Talents/Trappings (listes)

**Hiérarchie**: Root (0) → Level 1-4 → Level 5+ (sorties), validation parent.level = current.level - 1

**Validation**: Hiérarchie cohérente, schémas caractéristiques décroissants avec niveaux

**Workflow création**: Root (level 0) → Niveaux progression (1-4, parent obligatoire) → Sorties (5+)

**Exemples**: Soldat (LDB:54) level 0 WS:5 BS:4, Garde level 2 parent Soldat, Seigneur de guerre level 5 sortie

## Édition Skills

**Champs spécifiques**: Type (Basic/Advanced), Characteristic (WS/BS/I/Ag/Dex/Int/WP/Fel), Spécialisations (liste ou "(Au choix)")

**Validation**: Characteristic valide parmi 10, type Basic/Advanced

**Workflow**: Créer skill simple (Basic/Advanced + characteristic) OU skill avec spécialisation (une entrée par spec ou générique)

**Exemples**: Melee (Basic) characteristic WS, Lore (History) Advanced characteristic Int, Language (Reikspiel) Advanced Int spécialisation

## Édition Talents

**Champs spécifiques**: Max (1 unique / 2-9 limité / spec par spécialisation / vide illimité), Spécialisations (liste "Spec1/Spec2"), Tests (compétences/caractéristiques affectées), Effects (modificateurs numériques)

**Validation**: Max valide, format spécialisations correct

**Workflow**: Simple (max=1) OU avec specs (max=spec, une par spec) OU prenable multiple fois (max=N ou vide)

**Exemples**: Acute Sense (Sight) max=spec tests Perception, Warrior Born max=1, Strike Mighty Blow max=vide

## Édition Spells

**Champs spécifiques**: Type (spell/petty), Lore (domaine magie), CN (Casting Number 0-30+), Range/Target/Duration (formats variés), Ingredients (composants matériels)

**Lores**: Fire, Beasts, Death, Heavens, Life, Light, Metal, Shadow, Hedgecraft, Witchcraft, Daemonology, Necromancy, Petty

**Validation**: CN numérique, lore existe

**Workflow**: Label → lore → CN → range/target/duration → ingredients (optionnel) → desc

**Exemples**: Fireball (Fire CN 7 range Willpower×4), Aethyric Armour (Petty CN 3 range You), Curse of Arrow Attraction (Shadow CN 9 ingredients Broken arrow)

## Édition Trappings

**Champs spécifiques armes**: Damage (SB+X), Reach (Very Short/Short/Average/Long/Very Long/Massive), Group (Melee/Ranged), Hands (1H/2H), Qualities (liste)

**Champs spécifiques armures**: Points (protection), Location (zones), Qualities (liste)

**Champs généraux**: Encumbrance (0-999), Price (X gc/s/p), Availability

**Validation**: Type valide, enc numérique

**Workflow**: Type weapon (damage/reach/group/hands/qualities) OU armour (points/location/qualities) OU item (category/enc/price)

**Exemples**: Hand Weapon damage SB+4 reach Average group Melee hands 1H enc 3 price 10gc, Leather Jerkin armour points 1 location Body enc 2 price 10gc, Backpack container enc 1 capacity 10 price 1gc

## Interface Édition Unifiée

**Two-Panel**: Panneau gauche liste hiérarchique + filtre recherche, Panneau droit formulaire édition adapté au type

**Champs dynamiques**: Texte simple (label, nom), Textarea (desc HTML riche, skills/talents/trappings listes), Select (book, type, characteristic), Numériques (page, CN, enc, damage, points)

**Autocomplétion**: Mode standard (liste fermée références fixes) OU mode libre (autocomplete-free, ajout valeurs à la volée)

**Boutons**: Valider (sauvegarde Google Sheets), Dupliquer (créer basé existant), Prévisualiser (desc HTML, optionnel)

## Duplication Workflow

**Process standardisé**: Sélectionner source → Dupliquer → Label "new Item" + structure préservée (type, subType, book, page) + autres champs vidés → Insertion après source → Formulaire auto-ouvert

**Usage**: Créer variantes (species régionales, careers similaires, talents avec spécialisations différentes)

## Validation Commune

**Schéma JSON**: Structure conforme (champs obligatoires, types corrects) validé côté serveur Google Apps Script

**Doublons**: Index/labels uniques par table, alerte si conflit

**Références**: Validation existence refChar/refCareer/refDetail/parent à la sauvegarde (pas temps réel)

**Format texte libre**: Skills/talents/trappings (listes virgules) parsés au runtime, erreurs syntaxe non détectées édition

**Messages erreur**: "Erreur [table.field]: [description]", liste rouge, blocage sauvegarde si critique

## Sauvegarde et Restauration

**Process**: Collecte formulaire (EditprepareData) → Nettoyage (trim, ' → ') → Backup automatique Google Sheets → Écriture ligne index → Rechargement partiel → Restauration interface (position scroll, filtre, sélection)

**Feedback**: Loader pendant sauvegarde (<2s), retour automatique élément = confirmation implicite, pas message explicite succès

**Erreur**: Rollback automatique si échec, état restauré

## Relations

**Dépendances**: audit/database/[species|careers|skills|talents|spells|trappings].md - Structures complètes données

**Fonctionnalités liées**: admin-validation.md - Règles validation, admin-ui.md - Interface générale, admin-batch.md - Opérations batch, admin-permissions.md - Contrôle accès

**Patterns**: pattern-parsing.md - Parsing listes, pattern-specialisations.md - Format specs, pattern-validation-metadonnees.md - Validation

## Limites et Contraintes

**Pas de suppression cascade**: Supprimer entrée ne supprime pas références (vérification manuelle impact requise)

**Pas de validation temps réel**: Vérification références uniquement à sauvegarde, pas alerte si refChar/refCareer/refDetail n'existent pas encore

**Format texte libre**: Skills/talents/trappings en texte brut, parsing ultérieur runtime, erreurs syntaxe non détectées édition

**Pas de calcul automatique**: Schémas caractéristiques careers non validés vs niveaux précédents, cohérence progression manuelle

**Pas de vérification cascade**: Modifier parent careers n'alerte pas impact enfants, supprimer carrière ne vérifie pas si personnages l'utilisent

**Pas de validation characteristic**: Skills pas vérification characteristic existe

**Pas de validation effets**: Talents modificateurs non vérifiés édition

**Pas de validation CN**: Spells valeur CN non vérifiée vs puissance

**Pas de validation prix**: Trappings format prix non vérifié
