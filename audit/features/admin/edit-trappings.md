# Édition Table Trappings

## Objectif

Permet l'édition de l'équipement (trappings) via l'interface d'administration. Gère armes, armures, objets divers avec leurs propriétés, prix et encumbrement.

## Structure des Champs Éditables

**Métadonnées**: Index, Label, Book, Page

**Classification**: Type (weapon/armour/container/item/folder), SubType, Category

**Propriétés armes**: Damage, Reach, Group (Melee/Ranged), Hands (1H/2H), Qualities (qualités d'arme)

**Propriétés armures**: Points (protection), Location (zones protégées), Qualities (qualités d'armure)

**Propriétés générales**: Encumbrance (enc), Price (prix), Availability (disponibilité)

**Données descriptives**: desc (HTML riche)

## Interface d'Édition

**Champs**: label, book/page, type/subType/category, damage/reach/group/hands (armes), points/location (armures), enc/price/availability, qualities (textarea), desc (HTML riche)

## Validation des Données

**Obligatoires**: label, type, enc

**Type**: weapon (arme), armour (armure), container (conteneur), item (objet), folder (organisation)

**Damage**: Format "+X" ou "SB+X" (Strength Bonus + X)

**Reach**: Very Short, Short, Average, Long, Very Long, Massive

**Encumbrance**: Nombre 0-999 (poids/encombrement en unités)

**Price**: Format "X gc" (gold crowns), "X s" (shillings), "X p" (pennies)

## Workflow Édition Trappings

**Créer arme**: Type weapon, damage/reach/group/hands, qualities, enc/price

**Créer armure**: Type armour, points/location, qualities, enc/price

**Créer objet**: Type item, category, enc/price, desc

**Modifier**: Filtrer par type/category, sélectionner, ajuster, valider

**Dupliquer**: Pour créer variante d'équipement

## Exemples Concrets Warhammer

**Hand Weapon** (LDB:297): Type weapon, damage "SB+4", reach Average, group Melee, hands 1H, qualities "–", enc 3, price "10 gc"

**Sword** (LDB:298): Type weapon, damage "SB+5", reach Average, group Melee, hands 1H, qualities "Hack", enc 4, price "10 gc"

**Leather Jerkin** (LDB:301): Type armour, points 1, location "Body", qualities "–", enc 2, price "10 gc"

**Backpack** (LDB:304): Type container, category "Storage", enc 1 (empty), capacity 10 items, price "1 gc"

## Gestion des Qualités

**Qualités armes**: Hack, Impale, Fast, Defensive, Blackpowder, etc.

**Qualités armures**: Flexible, Partial, Weakpoints, etc.

**Format**: Liste virgules ou "–" si aucune

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/trappings.md](../../database/trappings.md) - Structure complète
- [database/qualities.md](../../database/qualities.md) - Qualités disponibles

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [edit-careers.md](./edit-careers.md) - Careers référencent trappings de départ
- [validation.md](./validation.md) - Validation
- [save.md](./save.md) - Sauvegarde

## Limites et Contraintes

**Format texte libre**: Damage, qualities en texte brut

**Pas de validation prix**: Format prix non vérifié
