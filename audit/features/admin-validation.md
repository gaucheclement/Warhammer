# Validation Données Admin

## Objectif

Validation modifications admin avant sauvegarde dans Google Sheets. Vérifie cohérence données, schémas JSON, doublons et références.

## Niveaux de Validation

**Validation schéma**: Structure JSON conforme (champs obligatoires, types corrects) - serveur Google Apps Script

**Validation cohérence**: Relations entre tables, références existantes

**Validation doublons**: Index/labels uniques par table

**Validation métier**: Règles spécifiques Warhammer (rand, hiérarchies careers, characteristic valides, CN numérique, etc.)

## Validations par Table

**Species**: index unique, label unique, rand 1-100, refChar/refCareer/refDetail existent

**Careers**: index unique, label unique, hiérarchie parent-enfant cohérente (parent.level = current.level - 1), class existe, schémas caractéristiques décroissants

**Talents**: index unique, label unique (avec spécialisation), max valide (1 / 2-9 / spec / vide)

**Skills**: index unique, label unique, characteristic valide (WS/BS/S/T/I/Ag/Dex/Int/WP/Fel), type Basic/Advanced

**Spells**: index unique, label unique, lore existe, CN numérique (0-30+)

**Trappings**: index unique, label unique, type valide (weapon/armour/container/item), enc numérique (0-999)

## Messages d'Erreur

**Format**: "Erreur [table.field]: [description]"

**Exemples**:
- "Erreur species.rand: Valeur doit être entre 1 et 100"
- "Erreur careers.parent: Parent 'Soldat' n'existe pas"
- "Erreur careers.hiérarchie: Parent level 2, current level 4 (doit être 3)"
- "Erreur talents.label: Doublon détecté 'Acute Sense (Sight)'"
- "Erreur skills.characteristic: 'Force' invalide, doit être S"
- "Erreur spells.CN: Valeur doit être numérique"
- "Erreur trappings.enc: Valeur doit être numérique entre 0 et 999"

**Affichage**: Liste erreurs en rouge, blocage sauvegarde si erreur critique

## Validation Côté Serveur

**Google Apps Script**: Validation finale avant écriture Google Sheets

**Schémas JSON**: Vérification conformité structure (champs obligatoires présents, types corrects string/number/boolean)

**Rollback automatique**: Si erreur détection, annulation modification, restauration état précédent

**Backup automatique**: Copie état actuel avant modification (permet rollback)

## Validation Côté Client (Optionnelle)

**Validation temps réel**: Champs obligatoires en rouge si vides (validation basique HTML5 required)

**Autocomplétion**: Limite saisies invalides pour champs fermés (select standards)

**Pas de validation métier**: Cohérence vérifiée uniquement côté serveur (pas calculs JS complexes)

**Pas de validation cross-table**: Références existantes non vérifiées en temps réel

## Exemples Concrets Validation

**Exemple 1 - Species rand invalide**:
- Saisie: rand = 150
- Erreur: "species.rand doit être entre 1 et 100"
- Action: Correction à 100 ou moins

**Exemple 2 - Career parent manquant**:
- Saisie: level=2, parent="Chevalier" (n'existe pas)
- Erreur: "careers.parent 'Chevalier' introuvable"
- Action: Créer d'abord "Chevalier" ou choisir parent existant

**Exemple 3 - Career hiérarchie invalide**:
- Saisie: level=3, parent="Soldat" (level 0)
- Erreur: "careers.hiérarchie: Parent level 0, current level 3 (doit être level 2)"
- Action: Corriger hiérarchie (passer par level 1 et 2)

**Exemple 4 - Talent doublon**:
- Saisie: label="Strike Mighty Blow" (existe déjà index 42)
- Erreur: "talents.label doublon détecté"
- Action: Modifier label ou éditer existant

**Exemple 5 - Skills characteristic invalide**:
- Saisie: characteristic="Force"
- Erreur: "skills.characteristic invalide, doit être S"
- Action: Corriger en "S"

**Exemple 6 - Spells CN non numérique**:
- Saisie: CN="Difficile"
- Erreur: "spells.CN doit être numérique"
- Action: Saisir nombre (ex: 7)

## Relations

**Dépendances**: audit/database/*.md - Schémas tables, pattern-validation-*.md - Patterns validation

**Fonctionnalités liées**: admin-ui.md - Interface admin, admin-edit-entities.md - Formulaires édition, save.md - Sauvegarde post-validation

## Limites et Contraintes

**Pas de validation exhaustive**: Règles métier complexes non vérifiées (ex: schémas caractéristiques careers cohérents vs niveaux, équilibrage talents)

**Pas de validation cascade**: Impact modifications sur données existantes non calculé (ex: modifier label book impacte toutes références)

**Format texte libre**: Skills/talents/trappings (listes) non parsés validation (vérification syntaxe uniquement runtime)

**Pas de validation temps réel references**: Vérification uniquement sauvegarde, pas alerte si refChar/refCareer/refDetail n'existent pas encore

**Pas de validation prix**: Format prix trappings non vérifié (accept any string)

**Pas de validation range/target/duration**: Spells formats non structurés, accepte any string
