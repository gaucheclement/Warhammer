# Filtrage des Carrières par Région

## Patterns techniques utilisés

- [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) - Système rand et clés régionales

## Vue d'ensemble

Le système de filtrage régional détermine la prévalence des carrières selon la région d'origine, reflétant spécificités culturelles et économiques des provinces de l'Empire.

**Objectif métier** : Adapter distribution des carrières aux particularités régionales (traditions, industries, influences religieuses).

## Régions disponibles

### Provinces impériales couvertes

L'objet `rand` contient trois clés régionales :

**Middenheim** : Cité-État d'Ulric - Culture martiale, influence ulricaine, rivalité avec Altdorf

**Middenland** : Province forestière - Chasse, élevage, économie forestière, culture nordique rude

**Nordland** : Province côtière - Économie maritime, pêche, commerce naval, climat rigoureux

### Régions absentes

**Reikland** (Altdorf), **Talabecland**, **Stirland**, **Averland** : Non représentées.

**Pourquoi** : Clés ciblent provinces avec spécificités marquées. Reikland = référence par défaut.

## Principe de fonctionnement

### Mécanisme de correspondance

Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour description complète du système de filtrage par clé-valeur.

**Application aux régions** : Utilise le même mécanisme que le filtrage par espèce, avec des clés régionales à la place des clés d'espèces.

**Règles d'accessibilité** :
- `carrière.rand[région]` = nombre → PRÉSENTE
- `carrière.rand[région]` = "" → ABSENTE
- Clé absente → ABSENTE

### Valeurs typiques
**Artisan** : `"Middenheim": 4, "Middenland": 3, "Nordland": 3` - Présent partout

**Agitateur** : `"Middenheim": 1, "Middenland": 1, "Nordland": 1` - Identique partout

**Soldat** : `"Middenheim": 30, "Middenland": 25, "Nordland": 28` - Forte variance

## Spécificités régionales

### Middenheim
**Favorisées** : Guerrier, Soldat (culture martiale), Prêtre d'Ulric, Artisan métallurgie

**Rares** : Prêtre de Sigmar (rivalité), professions "molles"

### Middenland
**Favorisées** : Garde-chasse, Chasseur, Bûcheron, Charbonnier, Villageois

**Rares** : Professions maritimes, urbaines raffinées

### Nordland
**Favorisées** : Batelier, Marin, Pêcheur, Contrebandier

**Rares** : Professions forestières/montagnardes

## Interaction espèce + région

### Combinaison des filtres
Si personnage a espèce ET région :

**Ordre de priorité** :
1. Si `rand[région]` existe et numérique → **UTILISER SEUIL RÉGIONAL**
2. Sinon → Utiliser `rand[espèce]`

**Exemple Humain Middenheim** :
- Soldat : `rand.Middenheim = 30` → utiliser 30 (pas `rand.Humain = 25`)

### Exemples combinés
**Nain Nordland** :
1. Vérifier `rand.Nain` numérique → carrière accessible Nains ?
2. Si oui, vérifier `rand.Nordland` pour seuil
3. Artisan : `rand.Nain = 8`, `rand.Nordland = 3` → utiliser 3

**Humain standard (sans région)** :
1. Pas de région spécifiée
2. Utiliser `rand.Humain` uniquement

## Cas d'usage

### Création Humain Middenheim
1. Filtrer `rand.Humain` numérique (accessibilité)
2. Pour génération aléatoire, utiliser `rand.Middenheim` (probabilité)
3. "Soldat" apparaît plus souvent (seuil 30 vs 25)

### Création Nain Nordland
1. Filtrer `rand.Nain` numérique
2. Exclure carrières maritimes (Nain interdit OU seuil Nordland trop élevé)
3. Favoriser métiers artisanaux

### Modes de génération
**Sans région** : Utiliser seuils espèce uniquement.

**Avec région** : Utiliser seuils régionaux pour espèces pertinentes.

**Mode libre** : Ignorer filtres, toutes carrières accessibles.

## Validation

Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

### Cohérence géographique
**Carrières maritimes** : `Nordland` numérique, `Middenland` bas/absent.

**Carrières forestières** : `Middenland` numérique, `Nordland` bas/absent.

**Carrières martiales** : `Middenheim` ≥ autres régions.

### Cohérence narrative
**Prêtre d'Ulric** : `Middenheim` élevé, autres bas.

**Prêtre de Sigmar** : `Middenheim` bas (rivalité religieuse).

## Interactions systèmes

### Avec filtrage espèce
Voir [filtrage-careers-espece.md](./filtrage-careers-espece.md)

**Règle** : Filtrage espèce AVANT régional.

**Ordre** :
1. Filtrer par espèce (accessibilité)
2. Appliquer seuils régionaux (probabilité)

### Avec génération aléatoire
Voir [ponderation-aleatoire-careers.md](./ponderation-aleatoire-careers.md)

**Règle** : Seuils régionaux remplacent seuils espèce pour génération aléatoire.

## Cas particuliers

### Carrières universelles
**Artisan** : Présent partout mais seuils légèrement différents selon économie locale.

### Carrières absentes
**Contrebandier** : `Nordland` numérique (côte), `Middenheim` et `Middenland` vides.

### Région par défaut
Si espèce sans région spécifiée, utiliser seuils espèce de base (équivalent Reikland).

## Références croisées

- [careers.md](../database/careers.md) - Table carrières
- [species.md](../database/species.md) - Régions d'espèces
- [filtrage-careers-espece.md](./filtrage-careers-espece.md) - Filtrage espèce
- [ponderation-aleatoire-careers.md](./ponderation-aleatoire-careers.md) - Génération aléatoire
