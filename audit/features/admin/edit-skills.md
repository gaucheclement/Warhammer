# Édition Table Skills

## Objectif

Permet l'édition des compétences (skills) via l'interface d'administration. Gère l'ajout, modification et suppression des skills avec leurs caractéristiques associées et spécialisations.

## Structure des Champs Éditables

**Métadonnées**: Index, Label, Book, Page

**Classification**: Type (Basic/Advanced/skill/folder), SubType, Group (groupement logique)

**Caractéristique**: Characteristic (WS, BS, I, Ag, Dex, Int, WP, Fel) - caractéristique utilisée pour les tests

**Spécialisations**: Peut contenir liste de spécialisations possibles ou "(Au choix)"

**Données descriptives**: desc (HTML riche)

## Interface d'Édition

**Champs**: label (avec éventuellement spécialisation), book/page, type/subType, group, characteristic (select), desc (HTML riche)

## Validation des Données

**Obligatoires**: label, characteristic

**Type**: Basic (compétence de base), Advanced (avancée), skill (utilisable), folder (organisation)

**Characteristic**: Doit correspondre à une des 10 caractéristiques (WS, BS, S, T, I, Ag, Dex, Int, WP, Fel)

**Spécialisations**: Format "Skill (Spec)" ou "Skill (Au choix)"

## Workflow Édition Skills

**Créer skill simple**: Label, type Basic/Advanced, characteristic, desc

**Créer skill avec spécialisation**: "Melee (Basic/Brawling/Cavalry/Fencing/Flail/Parry/Polearm/Two-handed)" - une entrée par spec ou générique avec liste

**Modifier**: Filtrer, sélectionner, ajuster, valider

**Dupliquer**: Pour créer nouvelle spécialisation

## Exemples Concrets Warhammer

**Melee (Basic)** (LDB:132): Type Basic, characteristic WS, desc "Combat au corps-à-corps avec armes simples..."

**Lore (History)** (LDB:131): Type Advanced, characteristic Int, spécialisation History, desc "Connaissance de l'histoire..."

**Language (Reikspiel)** (LDB:131): Type Advanced, characteristic Int, spécialisation Reikspiel, desc "Compréhension et expression en Reikspiel..."

**Charm** (LDB:129): Type Basic, characteristic Fel, desc "Séduction et persuasion..."

## Gestion des Spécialisations

**Format**: Même principe que talents, "(Au choix)" pour liste ouverte

**Characteristic partagée**: Toutes spécialisations d'une skill utilisent la même caractéristique

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/skills.md](../../database/skills.md) - Structure complète
- [database/characteristics.md](../../database/characteristics.md) - Characteristics référencées
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Format specs

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [edit-species.md](./edit-species.md) - Species référencent skills
- [edit-careers.md](./edit-careers.md) - Careers référencent skills
- [edit-talents.md](./edit-talents.md) - Talents peuvent affecter skills
- [validation.md](./validation.md) - Validation
- [save.md](./save.md) - Sauvegarde

## Limites et Contraintes

**Pas de validation characteristic**: Pas de vérification que characteristic existe

**Spécialisations textuelles**: Liste en texte libre
