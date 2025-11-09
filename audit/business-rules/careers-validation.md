# Business Rules - Validation Carrières

## Patterns techniques utilisés

- [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md) - Unicité index/labels, séquentialité
- [pattern-validation-references.md](../patterns/pattern-validation-references.md) - Cohérence références inter-tables
- [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md) - Valeurs énumérées, plages
- [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) - Structure rand, seuils cumulatifs
- [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) - Balises HTML, format pitch

## Vue d'ensemble

Règles de validation et tests de cohérence garantissant intégrité des carrières et relations. Empêchent données invalides et détectent incohérences avant impact joueur.

## Tests de structure

### Unicité index
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Test** : Tous `index` uniques (0-116), séquentiels

**Échec** : Index dupliqué → Ambiguïté identification

### Unicité label
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Test** : Tous `label` uniques (case-insensitive), 3-50 caractères

**Échec** : Label dupliqué → Confusion joueur, erreurs filtrage

### Présence champs obligatoires
**Champs** : `index`, `label`, `class`, `desc`, `book`, `page`, `rand`

**Échec** : Champ manquant → Erreur affichage

## Validation objet rand

Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour règles complètes.

### Structure complète
**Test** : Exactement 10 clés (7 espèces + 3 régions)

**Clés** : Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre, Middenheim, Middenland, Nordland

**Échec** : Clé manquante → Filtrage incomplet

### Valeurs valides
**Type** : Numérique (1-100) ou chaîne vide ""

**Échec** : Valeur invalide (null, 0, -1, 101) → Erreur filtrage

### Seuils cohérents
**Règle** : Pour chaque espèce/région, seuils croissants ou égaux entre carrières

**Échec** : Seuil décroissant → Génération aléatoire incohérente

**Erreur** : "Seuils décroissants pour {espèce} : carrière '{label1}' ({seuil1}) > '{label2}' ({seuil2})"

### Couverture probabilités
**Règle** : Au moins une carrière avec seuil ≥95 pour chaque espèce

**Échec** : Dernière carrière seuil 50 → Tirages 51-100 sans résultat

## Validation champs métier

### class
Voir [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md)

**Valeurs** : Citadins, Courtisans, Guerriers, Itinérants, Ruraux, Chaos

**Test** : Classe existe dans `classes.json`

### desc
Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

**Contraintes** : 100-5000 caractères, balises autorisées (`<i>`, `<I>`, `<BR>`, `<br>`, `<b>`), commence par `<i>`

**Échec** : Balises interdites (`<script>`, `<iframe>`) → Risque sécurité

### book et page
**book** : Non vide, 2-10 caractères (LDB, EDO, AA, ADE3, SOC)

**page** : >0, <1000

## Tests relations inter-tables

### Vers Species
Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

**Test** : Clés `rand` correspondent à `species.refCareer` existants

**Test** : Chaque species a ≥5 carrières accessibles (rand numérique)

**Échec** : Espèce avec <3 carrières → Génération personnage impossible

### Vers CareerLevels
Voir [relation-careers-careerlevels.md](./relation-careers-careerlevels.md)

**Test** : Exactement 4 CareerLevels avec `career=label` et `careerLevel=1,2,3,4` (sans trou)

**Erreur** : "Carrière '{label}' : {nb} niveaux trouvés au lieu de 4"

### Vers Classes
Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

**Test** : Chaque `class` existe dans `classes.json`

**Test** : Chaque classe a ≥5 carrières

**Échec** : Classe avec 1 carrière → Choix limité joueur

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
**Règle maritimes** : Batelier, Marin, Pêcheur doivent avoir `Nordland` numérique

**Règle martiales** : Soldat, Guerrier ont `Middenheim` ≥ autres régions

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

## Scénarios validation et test

### Création carrière
1. Valider champs obligatoires, unicité index/label, objet rand, cohérence métier
2. Si succès → Sauvegarder, sinon → Retourner erreurs

### Modification carrière
1. Valider champs modifiés
2. Si modification `label` → Vérifier impact CareerLevels
3. Sauvegarder ou retourner erreurs

### Import batch
1. Valider chaque carrière, collecter erreurs, retourner rapport
2. N'importer aucune si au moins 1 erreur

### Test génération espèce
Filtrer carrières `rand.{Espèce}` numérique, vérifier ≥10 trouvées, tirer aléatoire 50 fois, vérifier distribution cohérente, aucun tirage interdit.

### Test progression carrière
Vérifier carrière existe, 4 CareerLevels séquentiels (1-4), progression statut cohérente.

## Recommandations

Tests automatisés avant commit. Validation frontend + serveur. Messages clairs sans jargon. Maintenir données référence "gold standard".

## Voir aussi

- [careers.md](../database/careers.md) - Table carrières
- [filtrage-careers-espece.md](./filtrage-careers-espece.md) - Filtrage espèce
- [filtrage-careers-region.md](./filtrage-careers-region.md) - Filtrage région
- [relation-careers-careerlevels.md](./relation-careers-careerlevels.md) - Relation niveaux
