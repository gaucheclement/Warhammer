# Wizard Species - Sélection Région

## Vue d'ensemble

**Objectif** : Permettre au joueur de sélectionner la région d'origine pour personnages Humains, influençant carrières disponibles et probabilités.

**Applicabilité** : Uniquement espèce Humain (variantes régionales).

**Impact** : Modifie seuils `career.rand[région]` pour génération aléatoire et filtrage.

## Régions disponibles

### Middenheim
- Cité-État d'Ulric
- Culture martiale, influence ulricaine, rivalité Sigmar
- Carrières favorisées : Guerrier, Soldat, Prêtre d'Ulric, Forgeron
- Carrières rares : Prêtre de Sigmar, professions maritimes

### Middenland
- Province forestière
- Économie : chasse, élevage, foresterie
- Carrières favorisées : Garde-chasse, Chasseur, Bûcheron, Villageois
- Carrières rares : Urbaines raffinées, maritimes

### Nordland
- Province côtière
- Économie maritime : pêche, commerce naval
- Carrières favorisées : Batelier, Marin, Pêcheur, Contrebandier
- Carrières rares : Forestières, montagnardes

### Régions absentes

**Reikland (Altdorf)** : Région par défaut, pas de clé spécifique.

**Autres** : Talabecland, Stirland, Averland non représentées.

## Fonctionnement wizard

### Moment sélection

**Déclenchement** : Après sélection variante Humain régionale (voir [species-selection.md]).

**Condition** : Si `species.refCareer` ∈ {Middenheim, Middenland, Nordland}.

**Optionnel** : Sélection peut être omise (carrières filtrées par espèce uniquement).

### Interface

**Format** :
```
( ) Middenheim - Cité martiale d'Ulric
( ) Middenland - Province forestière
( ) Nordland - Province côtière
( ) Aucune - Utiliser seuils standard
```

**Stockage** : `character.region` ou dans `character.specie.refCareer`.

**Valeurs** : "Middenheim", "Middenland", "Nordland", null.

## Impact sur carrières

### Mécanisme

**Règle** : Région modifie seuils dans `career.rand[région]`.

**Algorithme** :
1. Si `career.rand[région]` numérique → carrière accessible avec ce seuil
2. Si "", null, ou absent → carrière exclue
3. Si pas de région → utiliser `career.rand.Humain`

### Exemples concrets

**Soldat** :
- Humain : 25 | Middenheim : 30 | Middenland : 25 | Nordland : 28

**Contrebandier** :
- Humain : 85 | Nordland : 80 | Middenheim : "" | Middenland : ""

**Prêtre d'Ulric** :
- Middenheim : 20 | Middenland : 50 | Nordland : 60

**Prêtre de Sigmar** :
- Middenheim : 90 (rivalité) | Middenland : 75 | Nordland : 80

## Exemples par région

### Humain Middenheim
- **Typiques** : Soldat, Guerrier, Prêtre d'Ulric, Forgeron
- **Rares** : Prêtre de Sigmar, Agitateur
- **Absentes** : Batelier, Marin, Pêcheur
- **Spécificités** : Carrières martiales forte probabilité, culte Ulric privilégié

### Humain Middenland
- **Typiques** : Garde-chasse, Chasseur, Bûcheron, Charbonnier, Villageois
- **Rares** : Bourgeois, Lettré, urbaines sophistiquées
- **Absentes** : Maritimes
- **Spécificités** : Économie forestière/rurale prédominante

### Humain Nordland
- **Typiques** : Batelier, Marin, Pêcheur, Contrebandier, Artisan naval
- **Rares** : Garde-chasse, Bûcheron, forestières
- **Absentes** : Montagnardes
- **Spécificités** : Économie maritime/fluviale

## Interaction génération aléatoire

### Sans région
- Algorithme utilise `career.rand.Humain`
- Exemple : Tirage 50 → Artisan (rand.Humain = 55)

### Avec région
- Algorithme utilise `career.rand[région]` si existe
- Exemple Middenheim : Tirage 28 → Soldat (rand.Middenheim = 30)
- Exemple Nordland : Tirage 75 → Contrebandier (rand.Nordland = 80)

### Bonus XP
**Règle** : Pas de bonus XP régional (bonus +20 XP lié uniquement à espèce aléatoire).

## Restrictions

### Par espèce
**Applicable** : Variantes Humain avec `refCareer` régional uniquement.

**Non applicable** :
- Nains, Elfes, Halflings
- Humain Reiklander (région implicite)
- Humain Tiléens, Norse (régions non couvertes)

### Cohérence géographique
**Validation** : Région doit correspondre à `species.refCareer`.

**Correct** : Humains (Middenheim) → Région Middenheim.

**Incorrect** : Humains (Reiklander) → Région Nordland.

## Affichage wizard

### Informations par région

| Région | Titre | Description | Carrières typiques |
|--------|-------|-------------|--------------------|
| Middenheim | Cité-État d'Ulric | Culture martiale, artisanat armes | Soldat, Prêtre Ulric, Forgeron |
| Middenland | Province Forestière | Chasse, élevage, bois | Garde-chasse, Chasseur, Bûcheron |
| Nordland | Province Côtière | Maritime, pêche, commerce | Batelier, Marin, Pêcheur |

### Visualisation impact (optionnel)
- Middenheim : ~78 carrières (orientation martiale)
- Middenland : ~65 carrières (rural/forestier)
- Nordland : ~72 carrières (maritime)

## Validation

### Avant passage étape suivante
- Si variante régionale : région sélectionnée ou explicitement omise
- Cohérence `species.refCareer` ↔ région
- `character.region` persisté

### Optionnalité
**Règle** : Sélection région optionnelle même pour variantes régionales.

**Si omis** : Utilise seuils `rand.Humain` standard.

## Relations tables

| Table | Champ | Usage |
|-------|-------|-------|
| Species | refCareer | Indique région applicable |
| Careers | rand[région] | Seuils probabilité régionaux |

## Voir aussi

- [species-selection.md](./species-selection.md) - Sélection espèce
- [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md) - Filtrage par espèce
- [filtrage-careers-region.md](../../business-rules/filtrage-careers-region.md) - Logique filtrage régional
- [careers.md](../../database/careers.md) - Structure Careers
