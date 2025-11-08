# Édition Table Spells

## Objectif

Permet l'édition des sorts (spells) via l'interface d'administration. Gère l'ajout, modification et suppression des spells avec leurs lores, CN (Casting Number), portée, durée et effets.

## Structure des Champs Éditables

**Métadonnées**: Index, Label, Book, Page

**Classification**: Type (spell/petty/folder), SubType, Lore (domaine de magie)

**Mécanique**: CN (Casting Number), Range (portée), Target (cible), Duration (durée)

**Ingrédients**: Ingredients (composants matériels requis)

**Données descriptives**: desc (HTML riche)

## Interface d'Édition

**Champs**: label, book/page, type/subType, lore (select autocomplete-free), CN (number), range/target/duration (text), ingredients (textarea), desc (HTML riche)

## Validation des Données

**Obligatoires**: label, lore, CN

**Type**: petty (sort mineur), spell (sort majeur), folder (organisation)

**Lore**: Fire, Beasts, Death, Heavens, Life, Light, Metal, Shadow, Hedgecraft, Witchcraft, Daemonology, Necromancy, Petty, etc.

**CN**: Nombre 0-30+ (difficulté du sort)

**Range/Target/Duration**: Formats variés (ex: "Touch", "Willpower yards", "Instant", "Willpower rounds")

## Workflow Édition Spells

**Créer spell**: Label, lore, CN, range/target/duration, ingredients (optionnel), desc

**Créer petty spell**: Type petty, CN généralement 0-5, pas d'ingrédients

**Modifier**: Filtrer par lore, sélectionner, ajuster, valider

**Dupliquer**: Pour créer variante d'un sort

## Exemples Concrets Warhammer

**Fireball** (LDB:242): Lore Fire, CN 7, range "Willpower x4 yards", target "1 target", duration "Instant", ingredients "Sulfur", desc "Boule de feu..."

**Aethyric Armour** (LDB:238): Lore Petty, CN 3, range "You", target "Self", duration "Willpower rounds", ingredients "–", desc "Armure magique..."

**Curse of Arrow Attraction** (LDB:243): Lore Shadow, CN 9, range "Willpower yards", target "1 target", duration "Willpower rounds", ingredients "Broken arrow", desc "Malédiction attirant projectiles..."

## Gestion des Lores

**Lores officiels**: Fire, Beasts, Death, Heavens, Life, Light, Metal, Shadow

**Lores spéciaux**: Hedgecraft (sorcellerie villageoise), Witchcraft (sorcières), Daemonology (interdit), Necromancy (interdit)

**Petty Magic**: Lore "Petty" pour sorts mineurs accessibles à tous

**Autocomplete-free**: Permet ajout nouveaux lores (homebrew)

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/spells.md](../../database/spells.md) - Structure complète
- [database/lores.md](../../database/lores.md) - Lores disponibles

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [edit-careers.md](./edit-careers.md) - Careers magiques référencent lores
- [validation.md](./validation.md) - Validation
- [save.md](./save.md) - Sauvegarde

## Limites et Contraintes

**Format texte libre**: Range/target/duration non structurés

**Pas de validation CN**: Valeur CN non vérifiée par rapport à puissance

**Ingredients optionnels**: Peut être "–" si aucun
