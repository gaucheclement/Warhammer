# Validation Données Admin

## Objectif

Validation des modifications admin avant sauvegarde dans Google Sheets. Vérifie cohérence données, schémas JSON, doublons et références.

## Niveaux de Validation

**Validation schéma**: Structure JSON conforme (champs obligatoires, types corrects)

**Validation cohérence**: Relations entre tables, références existantes

**Validation doublons**: Index/labels uniques par table

**Validation métier**: Règles spécifiques Warhammer (ex: rand, hiérarchies careers)

## Validations par Table

**Species**: index unique, label unique, rand 1-100, refChar/refCareer/refDetail existent

**Careers**: index unique, label unique, hiérarchie parent-enfant cohérente, class existe

**Talents**: index unique, label unique (avec spécialisation), max valide

**Skills**: index unique, label unique, characteristic valide (WS/BS/S/T/I/Ag/Dex/Int/WP/Fel)

**Spells**: index unique, label unique, lore existe, CN numérique

**Trappings**: index unique, label unique, type valide, enc numérique

## Messages d'Erreur

**Format**: "Erreur [table.field]: [description]"

**Exemples**:
- "Erreur species.rand: Valeur doit être entre 1 et 100"
- "Erreur careers.parent: Parent 'Soldat' n'existe pas"
- "Erreur talents.label: Doublon détecté 'Acute Sense (Sight)'"
- "Erreur skills.characteristic: 'Force' invalide, doit être S"

**Affichage**: Liste des erreurs en rouge, blocage sauvegarde si erreur critique

## Validation Côté Serveur

**Google Apps Script**: Validation finale avant écriture Google Sheets

**Schémas JSON**: Vérification conformité structure

**Rollback automatique**: Si erreur détection, annulation modification

## Validation Côté Client (Optionnelle)

**Validation temps réel**: Champs obligatoires en rouge si vides

**Autocomplétion**: Limite saisies invalides pour champs fermés

**Pas de validation métier**: Cohérence vérifiée uniquement côté serveur

## Exemples Concrets Warhammer

**Exemple 1: Species rand invalide**
- Saisie: rand = 150
- Erreur: "species.rand doit être entre 1 et 100"
- Action: Correction à 100 ou moins

**Exemple 2: Career parent manquant**
- Saisie: level=2, parent="Chevalier" (n'existe pas)
- Erreur: "careers.parent 'Chevalier' introuvable"
- Action: Créer d'abord "Chevalier" ou choisir parent existant

**Exemple 3: Talent doublon**
- Saisie: label="Strike Mighty Blow" (existe déjà à index 42)
- Erreur: "talents.label doublon détecté"
- Action: Modifier label ou éditer l'existant

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/*.md](../../database/) - Schémas des tables
- [pattern-validation-*.md](../../patterns/pattern-validation-metadonnees.md) - Patterns validation

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [save.md](./save.md) - Sauvegarde post-validation
- Toutes les tables edit-* - Validation spécifique

## Limites et Contraintes

**Pas de validation exhaustive**: Règles métier complexes non vérifiées

**Pas de validation cascade**: Impact modifications sur données existantes non calculé

**Format texte libre**: Skills/talents/trappings (listes) non parsés à la validation
