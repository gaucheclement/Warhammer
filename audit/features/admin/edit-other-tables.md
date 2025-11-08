# Édition Autres Tables

## Objectif

Permet l'édition des tables de référence simples (lores, gods, stars, books, etc.) via l'interface d'administration. Tables utilisées comme valeurs de référence dans les autres données.

## Tables Concernées

**Lores** (domaines de magie): Fire, Beasts, Death, Heavens, Life, Light, Metal, Shadow, Petty, Hedgecraft, Witchcraft, etc.

**Gods** (divinités): Sigmar, Ulric, Taal, Rhya, Shallya, Morr, Verena, Myrmidia, Ranald, Manann, etc.

**Stars** (signes astrologiques): Daemon, Drummer, Gnuthus, Greased Goat, etc. (12 signes)

**Books** (livres sources): LDB (Livre de Base), Middenheim, AA, ADE3, SOC, Salzemund, etc.

**Classes** (classes sociales): Académiques, Artisans, Bourgeoisie, Citadins, Courtisans, Forestiers, Guerriers, Itinérants, Paysans, Rangers, Riverfolk

**Characteristics** (caractéristiques): WS, BS, S, T, I, Ag, Dex, Int, WP, Fel

**Details** (détails physiques): Tables de génération aléatoire pour âge, taille, yeux, cheveux

## Structure Commune

**Métadonnées**: Index, Label, Book (si applicable), Page (si applicable)

**Données descriptives**: desc (HTML riche, optionnel)

**Données spécifiques**: Champs supplémentaires selon la table (ex: abr pour books, bonus pour stars, etc.)

## Interface d'Édition

**Champs communs**: label, book/page (optionnel), desc (optionnel)

**Champs spécifiques**: Adaptés à chaque table

## Validation des Données

**Obligatoires**: label minimum

**Label unique**: Pas de doublons dans une même table

**Références**: Utilisées dans autres tables (species, careers, spells, etc.)

## Workflow Édition

**Créer entrée**: Label, desc optionnelle, champs spécifiques

**Modifier**: Sélectionner, ajuster, valider

**Supprimer**: Attention aux références depuis autres tables

## Exemples Concrets Warhammer

**Lore (Fire)**: label "Fire", desc "Domaine du feu et de la destruction..."

**God (Sigmar)**: label "Sigmar", desc "Dieu-Empereur fondateur de l'Empire..."

**Star (Drummer)**: label "Drummer", bonus "+3% Fellowship", desc "Signe du tambour..."

**Book (LDB)**: label "Livre de Base", abr "LDB", desc "Règles de base WFRP 4e édition"

**Class (Guerriers)**: label "Guerriers", desc "Combattants professionnels..."

## Gestion des Références

**Impact modifications**: Changer label impacte toutes références

**Cascade**: Pas de suppression/modification automatique

**Vérification manuelle**: Avant modification/suppression, vérifier usage

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/lores.md](../../database/lores.md)
- [database/gods.md](../../database/gods.md)
- [database/stars.md](../../database/stars.md)
- [database/books.md](../../database/books.md)
- [database/classes.md](../../database/classes.md)

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- Toutes les tables edit-* utilisent ces références
- [validation.md](./validation.md) - Validation
- [save.md](./save.md) - Sauvegarde

## Limites et Contraintes

**Pas de vérification références**: Modification/suppression sans alerte sur impact

**Pas de migration automatique**: Si label change, références cassées
