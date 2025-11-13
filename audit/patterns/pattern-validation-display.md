# Pattern: Validation et Affichage Collections

## Contexte

Pattern partagé entre equipment et magic pour validation règles métier et affichage collections organisées.

Utilisé par: equipment.md, magic.md

## Structure type Validation

### Vue d'ensemble
Définition périmètre validation et objectifs vérifications.

### Domaines validation
3-5 catégories validations selon système:
- Validation structurelle (propriétés requises)
- Validation métier (règles fonctionnelles)
- Validation références (liens autres entités)
- Validation limites (contraintes quantitatives)
- Cas limites (situations exceptionnelles)

### Validation structurelle
Vérification structure données:
- Propriétés requises selon type
- Types valeurs cohérentes
- Formats respectés

### Validation métier
Règles fonctionnelles système:
- Cohérence logique
- Contraintes domaine
- Règles exclusion/compatibilité

### Validation références
Liens inter-entités:
- Références existent
- Types correspondent
- Relations valides

### Cas limites
Situations exceptionnelles:
- Valeurs extrêmes
- Combinaisons rares
- Comportements frontières

## Structure type Affichage

### Vue d'ensemble
Objectif présentation et organisation affichage.

### Organisation affichage
Groupement logique éléments:
- Par catégories (type/subType)
- Hiérarchie sections
- Tri et ordre

### Informations affichées
Données présentées par élément:
- Informations essentielles
- Détails additionnels
- Méta-informations (source, coût)

### Tri et ordre
Ordonnancement éléments:
- Tri par défaut
- Options tri alternatives
- Regroupements secondaires

### Filtrage (optionnel)
Critères sélection:
- Filtres disponibles
- Combinaisons
- Recherche textuelle

### Interactions utilisateur
Actions possibles:
- Consulter détails
- Modifier état
- Opérations contextuelles

## Exemples concrets

### Equipment (validation)
**Domaines:**
- Structurelle: type valide, propriétés requises
- Encombrement: total vs limite
- Équipement porté: cohérence armes/armures
- Références: qualités existent
- Prix: valeurs >= 0

**Cas limites:**
- Surcharge encombrement
- Multi-pièces même zone
- Qualités incompatibles

### Equipment (affichage)
**Organisation:**
- Armes (mêlée/distance/munitions)
- Armures (par zones)
- Équipement (trappings)

**Informations:**
- Base: nom, enc, état
- Armes: dégâts, allonge, qualités
- Armures: zones, PA, qualités

**Tri:**
- Par type puis subType
- Par encombrement
- Par prix

### Magic (validation)
**Domaines:**
- Talents: prerequis absolu
- Domaine: exclusivité Arcanes
- Carrière: acces/restrictions
- Composants: obligatoires selon tradition
- XP: couts cohérents

**Cas limites:**
- Mélange domaines (corruption)
- Multi-dieux Divine
- Sorts hors carrière

### Magic (affichage)
**Organisation:**
- Petty Magic (mineurs)
- Par domaine/lore (Arcanes)
- Par dieu (Divine)

**Informations:**
- Base: nom, CN, tradition
- Détails: portée, cible, durée
- Coût: XP si non appris

**Tri:**
- CN croissant
- Alphabétique
- Connus d'abord

## Validation pattern

### Vérifications
- Section Vue d'ensemble présente
- Domaines validation définis (3-5)
- Structure affichage documentée
- Exemples fournis
- Référence au pattern dans fichiers utilisant

### Anti-patterns
- ❌ Code technique dans validation
- ❌ Duplication structure entre fichiers
- ❌ Affichage sans organisation claire
- ❌ Validation sans domaines

## Tables/Features concernées

**Equipment:**
- inventory.md → validation équipement
- display.md → affichage inventaire

**Magic:**
- validation.md → validation sorts
- display.md → affichage sorts
- search.md → filtrage sorts (extension affichage)

## Voir aussi

- [pattern-validation-references.md](./pattern-validation-references.md) - Validation références inter-tables
- [pattern-validation-valeurs.md](./pattern-validation-valeurs.md) - Validation énumérations et plages
- [pattern-type-subtype.md](./pattern-type-subtype.md) - Hiérarchie type/subType pour affichage
