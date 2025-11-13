# Admin - Validation

## Vue d'ensemble

Validation modifications avant sauvegarde Google Sheets.

## Niveaux

Validation schéma : Structure JSON conforme (serveur).

Validation cohérence : Relations tables, références existantes.

Validation doublons : Index/labels uniques.

Validation métier : Règles Warhammer (rand, hiérarchies, CN numérique).

## Validations par table

**Species** : index unique, label unique, rand 1-100, références existent.

**Careers** : index unique, label unique, hiérarchie parent (parent.level = current.level - 1), class existe.

**Talents** : index unique, label unique, max valide (1/2-9/spec/vide).

**Skills** : index unique, label unique, characteristic valide (WS/BS/S/T/I/Ag/Dex/Int/WP/Fel), type Basic/Advanced.

**Spells** : index unique, label unique, lore existe, CN numérique (0-30+).

**Trappings** : index unique, label unique, type valide, enc numérique (0-999).

## Messages d'erreur

Format : "Erreur [table.field]: [description]".

Affichage : Liste rouge, blocage sauvegarde si critique.

## Validation serveur

Google Apps Script : Validation finale avant écriture.

Schémas JSON : Champs obligatoires, types corrects.

Rollback automatique : Annulation si erreur, restauration état.

Backup automatique : Copie avant modification.

## Validation client

HTML5 required : Champs obligatoires en rouge.

Autocomplétion : Limite saisies invalides.

Pas validation métier : Cohérence vérifiée serveur uniquement.

Pas validation cross-table temps réel.

## Limites

Pas validation exhaustive règles métier complexes, pas validation cascade impacts, format texte libre non parsé, pas validation temps réel références.

## Voir aussi

- [../../database/](../../database/)
- [admin-ui.md](./admin-ui.md)
- [admin-edit-entities.md](./admin-edit-entities.md)
