# Import/Export - Sérialisation données

## Vue d'ensemble

Sérialisation personnages JSON : export/import complet, tests compatibilité.

## Sérialisation JSON

Format : JSON structuré avec toutes données personnage.

Structure : identity (nom, espèce, carrière), characteristics, skills, talents, spells, trappings, details, xp.

Encodage : UTF-8 pour accents.

## Export

Déclenchement : Bouton "Exporter" interface.

Process : Collecte données personnage → Conversion JSON → Téléchargement fichier.

Nom fichier : `[Nom]_[Date].json`.

## Import

Déclenchement : Upload fichier .json.

Process : Upload → Validation format → Parsing JSON → Création personnage → Confirmation.

Validation : Structure conforme, champs obligatoires présents, types corrects, références valides.

Gestion erreurs : Affichage erreurs spécifiques, blocage si invalide, suggestions corrections.

## Tests compatibilité

Tests : Export puis import = données identiques, compatibilité anciennes versions, gestion champs manquants.

Validation : Tous champs conservés, valeurs correctes, cohérence globale.

## Voir aussi

- [../save-load/](../save-load/)
- [../../patterns/pattern-validation-metadonnees.md](../../patterns/pattern-validation-metadonnees.md)
