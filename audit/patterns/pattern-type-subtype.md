# Pattern: type + subType (Catégorisation hiérarchique)

## Contexte
Hiérarchie à deux niveaux pour catégoriser les entités.
Type = catégorie principale, subType = sous-catégorie ou variante.

## Format
Deux champs :
- `type` : Catégorie principale (obligatoire)
- `subType` : Sous-catégorie (optionnel)

## Exemples par table

### Spells
```
{ "label": "Bouclier de Volonté", "type": "Magie des Arcanes", "subType": "Lumière" }
{ "label": "Marcher sur l'Eau", "type": "Invocation", "subType": "Manann" }
```

### Trappings
```
{ "label": "Épée", "type": "Arme", "subType": "Arme de mêlée" }
{ "label": "Cuir bouilli", "type": "Armure", "subType": "Armure légère" }
```

### Skills
```
{ "label": "Corps à corps", "type": "base", "subType": "" }
{ "label": "Langue", "type": "avancée", "subType": "" }
```

## Hiérarchies typiques

### Spells.type
- `Béni` (subType = divinité ou vide)
- `Magie mineure` (subType = vide)
- `Magie des Arcanes` (subType = domaine de magie)
- `Magie du Chaos` (subType = dieu du Chaos)
- `Invocation` (subType = divinité)

### Trappings.type
- `Arme` (subType = "Arme de mêlée" | "Arme à distance" | "Arme de jet")
- `Armure` (subType = "Armure légère" | "Armure moyenne" | "Armure lourde")
- `Équipement` (subType = catégorie)
- `Conteneur` (subType = vide)

### Skills.type
- `base` (accessible à tous)
- `avancée` (nécessite formation)

## Algorithmes

### Filtrage par type
Filtrer les entités qui ont un type donné.

### Filtrage par type + subType
Filtrer par type ET subType (si subType fourni).

### Groupement hiérarchique
Grouper les entités par type, puis par subType au sein de chaque type.

## Validation

### Type obligatoire
Vérifier que le champ type est présent et non vide.

Erreurs possibles :
- `TYPE_MISSING` : Type manquant

### SubType cohérent avec type
Pour certains types, le subType est obligatoire ou doit être dans une liste définie.

Erreurs possibles :
- `TYPE_UNKNOWN` : Type non reconnu
- `SUBTYPE_REQUIRED` : SubType obligatoire pour ce type
- `SUBTYPE_INVALID` : SubType invalide pour ce type

Exemple de règles :
- "Magie des Arcanes" → subType obligatoire, doit être un domaine valide (Feu, Lumière, etc.)
- "Invocation" → subType obligatoire, doit être une divinité valide
- "Béni" → subType optionnel

## Tables concernées
- Spells (type + subType)
- Trappings (type + subType)
- Skills (type, subType rare)
- Talents (type rare, subType rare)

## Voir aussi
- [pattern-validation-valeurs.md](./pattern-validation-valeurs.md) - Validation énumérations
