# Tests Import/Export

## Objectif

Validation integrite donnees lors cycles sauvegarde et restauration personnages. Trois niveaux tests complementaires assurent fiabilite.

## Tests Unitaires

**Suite tests basique** : Valide operations fondamentales generation et sauvegarde.

**Tests inclus** : Generation basique, generation multiple coherence, test performance (5 generations rapides), verification donnees obligatoires, test stabilite (10 generations).

**Exemples Warhammer** : Humain Reiklander Soldat toutes composantes, Nain Combattant traits raciaux, Halfling Cuisinier talents depart.

**Metriques** : Nombre tests reussis/echoues, temps execution total et moyen, statistiques especes/carrieres, plages valeurs.

**Validation** : Chaque personnage doit avoir espece, carriere, caracteristiques (>=1), competences (>=1), talents (>=1), equipement (>=1).

## Tests Creation Complete

**Test etape par etape** : Valide chaque etape processus creation.

**Etapes testees** : Espece (modificateurs raciaux), Carriere (competences/talents depart), Caracteristiques (generation et bonus), Etoile destin (effets), Talents (specialisations), Competences (valeurs finales), Equipement (distribution), Details (age, taille, yeux, cheveux, nom, dieu).

**Exemple Warhammer - Heinrich Steinmetz Humain Reiklander Apprenti Artisan** :

Caracteristiques CC 28, CT 30, F 32, E 31, I 40, Ag 28, Dex 24, Int 32, FM 25, Soc 31.

Talents raciaux Perspicace, Tres resistant, Infatigable, Coeur vaillant.

Competences espece Charme, Commandement, Evaluation (5 avancements), Calme, Marchandage, Ragot (3 avancements).

Competences carriere Athletisme, Calme, Discretion, Esquive, Evaluation, Metier (Menuiserie), Resistance (5 avancements).

**Donnees capturees** : Etat avant/apres, choix effectue, validation contenu.

**Validation** : Chaque etape produit donnees coherentes avec choix precedents.

## Tests Validation Approfondie

**Test integrite** : Verifie coherence interne et integrite referentielle.

**Validations sources** : Especes disponibles (quantite, completude), Carrieres (quantite, niveaux), Competences (specialisations), Talents (prerequis, effets), Caracteristiques (10 obligatoires).

**Validations contenu** : Caracteristiques ont labels valides, Competences ont caracteristique associee, Talents ont description, Equipements ont type et encombrement.

**Seuils attendus** : Especes >=5, Carrieres >=64 (livre base), Competences >=100, Talents >=150, Caracteristiques =10.

**Exemples Warhammer** : Toutes especes livre base presentes, chaque carriere a 4 niveaux, talents avec prerequis pointent vers talents existants.

**Validation** : Aucune donnee manquante ou corrompue.

## Tests Round-Trip

**Cycle export/import** : Garantit personnage exporte puis reimporte identique original.

**Processus teste** : 1) Generer personnage aleatoire, 2) Exporter vers JSON, 3) Reimporter depuis JSON, 4) Comparer original vs reimporte.

**Donnees comparees** : Espece, carriere, caracteristiques, competences, talents, equipement, details, experience, destin/resilience.

**Exemples Warhammer** : Agitateur talent Orateur retrouve specialisation exacte, Eclaireur avec Orientation conserve bonus, Sorcier retrouve liste sorts appris.

**Critere succes** : Difference nulle entre personnage original et reimporte.

## Tests Cas Limites

**Situations extremes** :

**Personnage vide** : Import JSON minimal (seulement espece et carriere), valeurs par defaut appliquees.

**Personnage maximal** : Toutes competences maximum, tous talents disponibles, niveau 4 plusieurs carrieres.

**Specialisations multiples** : Metier 5 specialisations, Artiste multiples domaines, Langue variantes regionales.

**Caracteristiques extremes** : Valeurs minimum/maximum, modificateurs temporaires.

**Exemples Warhammer** : Nain Force 60+ (racial + carriere + talents + experience), Halfling Taille 4 pieds (minimum racial), Magicien Intelligence 70+, Guerrier 15 talents combat, Erudit parlant 10 langues specialisations.

**Validation** : Systeme gere tous cas sans erreur ni corruption.

## Tests Export Foundry

**Validation export Foundry VTT** : Verifie export produit JSON conforme format Foundry.

**Donnees exportees** : Caracteristiques, competences, talents, sorts, equipement, Destin/Fortune/Resilience.

**Format teste** : Structure JSON conforme, noms champs mappes, types donnees respectes, relations preservees.

**Exemples Warhammer** : Pretre sorts exporte prieres bon format, Voleur a talents dissimulation correctement mappes, Noble a statut social reflete.

**Validation** : JSON exporte peut etre importe Foundry VTT sans erreur.

## Rapports Test

**Format resultats** :

**Informations globales** : Nom suite, date/heure, nombre total tests, reussis/echoues, statut global.

**Performance** : Temps total (ms), temps moyen par test, temps par generation.

**Statistiques** : Especes testees, carrieres testees, plages valeurs observees.

**Details par test** : Index, nom, statut, temps, donnees personnage, erreurs, validations detaillees.

**Exemple Warhammer** :
```
Test #1: Basic Character Generation
Status: PASSED, Time: 245ms
Character: Humain Reiklander - Voleur
Stats: 10 characteristics, 18 skills, 5 talents, 12 trappings
Validations: 6/6 passed
```

**Format sortie** : JSON structure pour integration CI/CD.

## Utilisation Tests

**Execution manuelle endpoints HTTP** :
- `debug=unittest` - Suite tests unitaires complete
- `debug=fulltest` - Details etape par etape creation complete
- `debug=deeptest` - Validation approfondie controles integrite

**Validation continue - Quand executer** : Avant deploiement nouvelles donnees, apres modification algorithmes generation, lors changements format export/import, pour diagnostiquer anomalies signalees.

**Criteres validation** : 100% tests unitaires doivent passer, tests stabilite 10/10 generations reussies, tests round-trip difference nulle, tests Foundry import reussi Foundry VTT.

## Voir Aussi

- [json-serialization.md](./json-serialization.md) - Format sauvegarde teste et logique restauration testee
- [foundry-export.md](./foundry-export.md) - Format Foundry valide et regles validation appliquees
- [../wizard/resume.md](../wizard/resume.md) - Etape finale wizard (point depart export)
