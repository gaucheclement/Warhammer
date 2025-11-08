# Import/Export - Tests

## Objectif

Documentation des tests d'import/export validant l'intégrité des données lors des cycles de sauvegarde et restauration de personnages.

## Vue d'ensemble

Le système de tests valide que les personnages peuvent être exportés puis réimportés sans perte ni corruption. Trois niveaux de tests complémentaires assurent la fiabilité.

## Tests unitaires

**Suite de tests basique :** Valide les opérations fondamentales de génération et sauvegarde.

**Tests inclus :** Génération basique, génération multiple pour cohérence, test de performance (5 générations rapides), vérification données obligatoires, test de stabilité (10 générations).

**Exemples Warhammer :** Humain Reiklander Soldat avec toutes composantes, Nain Combattant avec traits raciaux, Halfling Cuisinier avec talents de départ.

**Métriques :** Nombre tests réussis/échoués, temps exécution total et moyen, statistiques espèces/carrières, plages de valeurs.

**Validation :** Chaque personnage doit avoir espèce, carrière, caractéristiques (≥1), compétences (≥1), talents (≥1), équipement (≥1).

Voir [json-export.md](./json-export.md) pour le format de sauvegarde.

## Tests de création complète

**Test étape par étape :** Valide chaque étape du processus de création.

**Étapes testées :** Espèce (modificateurs raciaux), Carrière (compétences/talents départ), Caractéristiques (génération et bonus), Étoile de destin (effets), Talents (spécialisations), Compétences (valeurs finales), Équipement (distribution), Détails (âge, taille, yeux, cheveux, nom, dieu).

**Exemple Warhammer - Heinrich Steinmetz, Humain Reiklander Apprenti Artisan :**
- Caractéristiques : CC 28, CT 30, F 32, E 31, I 40, Ag 28, Dex 24, Int 32, FM 25, Soc 31
- Talents raciaux : Perspicace, Très résistant, Infatigable, Cœur vaillant
- Compétences espèce : Charme, Commandement, Évaluation (5 avancements), Calme, Marchandage, Ragot (3 avancements)
- Compétences carrière : Athlétisme, Calme, Discrétion, Esquive, Évaluation, Métier (Menuiserie), Résistance (5 avancements)

**Données capturées :** État avant/après, choix effectué, validation contenu.

**Validation :** Chaque étape produit des données cohérentes avec choix précédents.

Voir [json-import.md](./json-import.md) pour la restauration.

## Tests de validation approfondie

**Test d'intégrité :** Vérifie la cohérence interne et l'intégrité référentielle.

**Validations sources :** Espèces disponibles (quantité, complétude), Carrières (quantité, niveaux), Compétences (spécialisations), Talents (prérequis, effets), Caractéristiques (10 obligatoires).

**Validations de contenu :** Caractéristiques ont labels valides, Compétences ont caractéristique associée, Talents ont description, Équipements ont type et encombrement.

**Seuils attendus :** Espèces ≥5, Carrières ≥64 (livre de base), Compétences ≥100, Talents ≥150, Caractéristiques =10.

**Exemples Warhammer :** Toutes espèces du livre de base présentes, chaque carrière a 4 niveaux, talents avec prérequis pointent vers talents existants.

**Validation :** Aucune donnée manquante ou corrompue.

## Tests round-trip

**Cycle export/import :** Garantit qu'un personnage exporté puis réimporté est identique à l'original.

**Processus testé :** 1) Générer personnage aléatoire, 2) Exporter vers JSON, 3) Réimporter depuis JSON, 4) Comparer original vs réimporté.

**Données comparées :** Espèce, carrière, caractéristiques, compétences, talents, équipement, détails, expérience, destin/résilience.

**Exemples Warhammer :** Agitateur avec talent Orateur retrouve sa spécialisation exacte, Éclaireur avec Orientation conserve son bonus, Sorcier retrouve sa liste de sorts appris.

**Critère de succès :** Différence nulle entre personnage original et réimporté.

Voir [version-compatibility.md](./version-compatibility.md) pour les changements de format.

## Tests de cas limites

**Situations extrêmes :**

**Personnage vide :** Import JSON minimal (seulement espèce et carrière), valeurs par défaut appliquées.

**Personnage maximal :** Toutes compétences au maximum, tous talents disponibles, niveau 4 dans plusieurs carrières.

**Spécialisations multiples :** Métier avec 5 spécialisations, Artiste avec multiples domaines, Langue avec variantes régionales.

**Caractéristiques extrêmes :** Valeurs minimum/maximum, modificateurs temporaires.

**Exemples Warhammer :** Nain Force 60+ (racial + carrière + talents + expérience), Halfling Taille 4 pieds (minimum racial), Magicien Intelligence 70+, Guerrier avec 15 talents de combat, Érudit parlant 10 langues avec spécialisations.

**Validation :** Système gère tous les cas sans erreur ni corruption.

## Tests d'export Foundry

**Validation export Foundry VTT :** Vérifie que l'export produit un JSON conforme au format Foundry.

**Données exportées :** Caractéristiques, compétences, talents, sorts, équipement, Destin/Fortune/Résilience.

**Format testé :** Structure JSON conforme, noms de champs mappés, types de données respectés, relations préservées.

**Exemples Warhammer :** Prêtre avec sorts exporte ses prières dans le bon format, Voleur a ses talents de dissimulation correctement mappés, Noble a son statut social reflété.

**Validation :** JSON exporté peut être importé dans Foundry VTT sans erreur.

Voir [foundry-format.md](./foundry-format.md) et [foundry-mapping.md](./foundry-mapping.md).

## Rapports de test

**Format des résultats :**

**Informations globales :** Nom suite, date/heure, nombre total tests, réussis/échoués, statut global.

**Performance :** Temps total (ms), temps moyen par test, temps par génération.

**Statistiques :** Espèces testées, carrières testées, plages de valeurs observées.

**Détails par test :** Index, nom, statut, temps, données personnage, erreurs, validations détaillées.

**Exemple Warhammer :**
```
Test #1: Basic Character Generation
Status: PASSED, Time: 245ms
Character: Humain Reiklander - Voleur
Stats: 10 characteristics, 18 skills, 5 talents, 12 trappings
Validations: 6/6 passed
```

**Format de sortie :** JSON structuré pour intégration CI/CD.

## Utilisation des tests

**Exécution manuelle via endpoints HTTP :**
- `debug=unittest` - Suite de tests unitaires complète
- `debug=fulltest` - Détails étape par étape d'une création complète
- `debug=deeptest` - Validation approfondie avec contrôles d'intégrité

**Validation continue - Quand exécuter :** Avant déploiement de nouvelles données, après modification des algorithmes de génération, lors de changements de format export/import, pour diagnostiquer anomalies signalées.

**Critères de validation :** 100% des tests unitaires doivent passer, tests de stabilité 10/10 générations réussies, tests round-trip différence nulle, tests Foundry import réussi dans Foundry VTT.

## Relations

**Dépend de :**
- [json-export.md](./json-export.md) - Format de sauvegarde testé
- [json-import.md](./json-import.md) - Logique de restauration testée
- [foundry-format.md](./foundry-format.md) - Format Foundry validé
- [foundry-validation.md](./foundry-validation.md) - Règles de validation appliquées

**Utilisé par :** Processus de déploiement, debugging, documentation.

**Voir aussi :**
- [../wizard/resume.md](../wizard/resume.md) - Étape finale du wizard (point de départ de l'export)
- [version-compatibility.md](./version-compatibility.md) - Gestion des versions lors des tests round-trip
