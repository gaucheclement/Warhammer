# Validation des Données - Carrières

## Patterns techniques utilisés

- [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md) - Index uniques et séquentiels, Labels uniques
- [pattern-validation-references.md](../patterns/pattern-validation-references.md) - Références inter-tables
- [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md) - Valeurs énumérées, Plages de valeurs
- [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) - Balises HTML autorisées, Format pitch italique

## Vue d'ensemble

Règles de validation garantissant que chaque carrière respecte contraintes métier avant insertion/modification.

**Objectif métier** : Empêcher données invalides, maintenir intégrité, fournir messages erreur clairs.

## Champs obligatoires

### index
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Contraintes** : Unique, 0-116, séquentiel

### label
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Contraintes** : Unique, 3-50 caractères, non vide

### class
Voir [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md)

**Valeurs** : Citadins, Courtisans, Guerriers, Itinérants, Ruraux, Chaos

**Test** : Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md) pour vérification existence dans classes.json

### desc
Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) et [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

**Contraintes** : 100-5000 caractères, HTML minimal, commence par `<i>`

### book
**Contraintes** : Non vide, 2-10 caractères

**Valeurs courantes** : LDB, EDO, AA, ADE3, SOC

### page
Voir [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md)

**Contraintes** : >0, <1000

### rand
Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour structure complète.

**Contraintes** : Exactement 10 clés, valeurs numériques 1-100 ou ""

## Validation objet rand

### Structure
**Clés obligatoires** : Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre, Middenheim, Middenland, Nordland

### Valeurs espèces
Voir [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md) pour validation plages 1-100.

**Type** : Entier ou chaîne vide

**Range** : 1-100 si numérique

### Cohérence seuils
Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour règles seuils cumulatifs.

**Règle** : Seuils croissants pour une espèce donnée

**Erreur** : "Seuils décroissants détectés pour {espèce} : carrière '{label1}' ({seuil1}) > '{label2}' ({seuil2})"

### Couverture
**Règle** : Au moins une carrière seuil ≥95 pour chaque espèce

**Erreur** : "Espèce {espèce} : aucune carrière avec seuil ≥95"

## Validation relations

### Vers Classes
Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

**Test** : `class` existe dans `classes.json`

### Vers CareerLevels
Voir [relation-careers-careerlevels.md](./relation-careers-careerlevels.md)

**Test** : Exactement 4 CareerLevels avec `career=label` et `careerLevel=1,2,3,4`

**Erreur** : "Carrière '{label}' : {nb} niveaux trouvés au lieu de 4"

### Vers Species
Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

**Test** : Clés `rand` correspondent à `species.refCareer`

## Validation descriptions HTML

Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) pour liste complète balises.

### Balises autorisées
**Liste blanche** : `<i>`, `<I>`, `<BR>`, `<br>`, `<b>`

**Erreur** : "Description contient balises non autorisées : {liste}"

### Format pitch
Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

**Règle** : Premier élément texte doit être `<i>texte</i>`

### Longueur
**Min** : 100 caractères

**Max** : 5000 caractères

## Validation cohérence métier

### Carrières universelles
**Règle** : Si label contient "Artisan" ou "Villageois", ≥4 espèces numériques

**Erreur** : "Carrière universelle '{label}' accessible à seulement {nb} espèces"

### Carrières exclusives
**Règle** : Si 1 seule espèce numérique, toutes autres doivent être ""

**Erreur** : "Carrière '{label}' mono-espèce incohérente"

### Carrières Chaos
**Règle** : Si `class="Chaos"`, tous `rand` doivent être ""

**Erreur** : "Carrière Chaos '{label}' accessible en génération aléatoire"

### Cohérence régionale
**Règle** : Carrières maritimes (contient "Batelier", "Marin", "Pêcheur") doivent avoir `Nordland` numérique

**Erreur** : "Carrière maritime '{label}' inaccessible en Nordland"

## Messages erreur utilisateur

### Format standard
`[Champ] {libellé erreur} : {détails}`

**Exemples** :
- `[index] Index 5 déjà utilisé par carrière 'Marchand'`
- `[rand.Humain] Seuil invalide : 150. Attendu 1-100 ou ''`
- `[class] Classe 'Paysans' inconnue. Classes valides : Citadins, Courtisans, Guerriers, Itinérants, Ruraux, Chaos`

### Sévérité
**Erreur bloquante** : Empêche sauvegarde (champs obligatoires, valeurs hors range)

**Avertissement** : Permet sauvegarde mais signale (cohérence métier)

## Scénarios validation

### Création carrière
1. Valider champs obligatoires
2. Valider unicité index/label
3. Valider objet rand complet
4. Valider cohérence métier
5. Si succès → Sauvegarder, sinon → Retourner erreurs

### Modification carrière
1. Valider champs modifiés
2. Si modification `label` → Vérifier impact CareerLevels
3. Valider cohérence globale
4. Sauvegarder ou retourner erreurs

### Import batch
1. Valider chaque carrière individuellement
2. Collecter toutes erreurs
3. Retourner rapport complet
4. N'importer aucune si au moins 1 erreur

## Règles spéciales

### Index séquentiel
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Règle** : Index doivent se suivre sans trou (0, 1, 2, ..., 116)

**Exception** : Trous autorisés si carrière supprimée

### Label unique case-insensitive
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Règle** : "Agitateur" et "agitateur" considérés identiques

### Rand cohérence globale
Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md)

**Règle** : Pour chaque espèce, vérifier seuils croissants sur TOUTES carrières

## Recommandations

### Validation frontend
Valider côté client pour feedback immédiat, mais TOUJOURS revalider côté serveur.

### Messages clairs
Éviter jargon technique. Fournir exemples valides dans messages erreur.

## Références croisées

- [careers.md](../database/careers.md) - Table carrières
- [tests-coherence-careers.md](./tests-coherence-careers.md) - Tests intégrité
