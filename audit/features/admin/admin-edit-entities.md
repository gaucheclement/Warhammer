# Admin - Édition entités

## Vue d'ensemble

Interface édition centralisée tables référence : species, careers, skills, talents, spells, trappings.

## Structure commune

Métadonnées : Index, Label, Book, Page.

Classification : Type, SubType, Category, Class, Group.

Références : refChar, refCareer, refDetail.

Description : desc (HTML).

## Édition par type

### Species

Champs : refChar, refCareer, refDetail, rand (1-100), skills/talents (listes texte).

Validation : Label unique, rand unique par variante, références existantes.

### Careers

Champs : Class, Level (0-5), Statut, Parent, Caractéristiques (10 valeurs 0-5), Skills/Talents/Trappings.

Hiérarchie : Root (0) → Niveaux 1-4 → Sorties (5+).

Validation : parent.level = current.level - 1.

### Skills

Champs : Type (Basic/Advanced), Characteristic (WS/BS/I/Ag/Dex/Int/WP/Fel), Spécialisations.

Validation : Characteristic valide, type Basic/Advanced.

### Talents

Champs : Max (1/2-9/spec/vide), Spécialisations, Tests, Effects.

Validation : Max valide, format specs correct.

### Spells

Champs : Type (spell/petty), Lore, CN (0-30+), Range/Target/Duration, Ingredients.

Lores : Fire, Beasts, Death, Heavens, Life, Light, Metal, Shadow, Hedgecraft, Witchcraft, Daemonology, Necromancy, Petty.

Validation : CN numérique, lore existe.

### Trappings

Armes : Damage (SB+X), Reach, Group (Melee/Ranged), Hands (1H/2H), Qualities.

Armures : Points, Location, Qualities.

Général : Encumbrance (0-999), Price, Availability.

Validation : Type valide, enc numérique.

## Interface

Two-Panel : Liste gauche (hiérarchique + filtre) + Formulaire droit (adapté au type).

Champs dynamiques : Texte, Textarea, Select, Numériques.

Autocomplétion : Standard (liste fermée) ou libre (ajout valeurs).

Boutons : Valider, Dupliquer, Prévisualiser.

## Duplication

Workflow : Sélectionner source → Dupliquer → Label "new Item" + structure préservée → Insertion après source → Formulaire ouvert.

## Validation

Schéma JSON côté serveur.

Doublons : Index/labels uniques.

Références : Validation existence à sauvegarde.

Messages erreur : "Erreur [table.field]: [description]", blocage si critique.

## Sauvegarde

Process : Collecte formulaire → Nettoyage → Backup → Écriture → Rechargement → Restauration interface.

Feedback : Loader (<2s), retour automatique, pas message succès explicite.

Erreur : Rollback automatique.

## Limites

Pas suppression cascade, pas validation temps réel références, format texte libre non parsé édition, pas calcul automatique cohérence.

## Voir aussi

- [../../database/](../../database/)
- [admin-validation.md](./admin-validation.md)
- [admin-ui.md](./admin-ui.md)
- [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md)
