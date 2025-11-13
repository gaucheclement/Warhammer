# Save/Load - Sauvegarde et chargement

## Vue d'ensemble

Sauvegarde personnages Google Sheets, chargement via codes uniques, export/import fichiers.

## Données sauvegardées

Obligatoire : Espèce, carrière, caractéristiques, compétences, talents, sorts, équipement, détails, XP.

Optionnel : État création (étape wizard), mode génération, choix aléatoires.

Exclus : Définitions statiques tables (conservé IDs seulement), données temporaires.

Format identifiant : Code unique 10 caractères (cloud) ou nom fichier descriptif (export).

## Sauvegarde

Validation : Données minimales (espèce + carrière), cohérence (IDs existent, avances ≤ max, specs valides).

Optimisation : Exclusion définitions statiques, ~70% réduction taille.

Déclenchement : Bouton "Sauvegarder" → Collecte → Code unique → Écriture Google Sheets → Retour code.

## Chargement

Reconstruction : IDs → Récupération définitions tables → Fusion données statiques + personnalisées.

Ordre : Espèce → Carrière → Caractéristiques → Compétences → Talents → Sorts → Équipement → Détails → XP.

Erreurs : ID invalide (blocage), référence manquante (blocage), données corrompues (blocage), version incompatible (migration ou blocage).

## Multi-personnages

Liste : Nom, espèce, carrière, niveau, statut, XP, tri date modification.

Filtrage : Espèce, statut, carrière, recherche textuelle.

Actions : Charger, supprimer (confirmation), dupliquer (nouveau ID), export batch (ZIP).

## Export/Import fichier

Format : JSON structuré, métadonnées (version, date, source), encodage UTF-8.

Validation import : Structure valide, version compatible, références existent, sécurité (limite 10 MB).

Compatibilité : Support anciennes versions (migration auto), blocage versions récentes, valeurs défaut champs manquants.

## Voir aussi

- [../import-export/import-export.md](../import-export/import-export.md)
- [../../patterns/pattern-google-sheets-storage.md](../../patterns/pattern-google-sheets-storage.md)
- [../../patterns/pattern-validation-references.md](../../patterns/pattern-validation-references.md)
