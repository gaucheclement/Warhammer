# Pattern: "–" (Valeur non applicable)

## Contexte
Valeur spéciale indiquant qu'une caractéristique n'existe pas ou n'est pas applicable.
Utilisé principalement pour les créatures.

## Format
```
"–"  // Tiret demi-cadratin (U+2013), PAS tiret simple "-"
```

## Exemples

### Creatures.char
```
Golem de Pierre :
- CT: "–" (pas d'attaque à distance)
- Dex: "–" (pas de manipulation fine)
- Int/FM/Soc: "–" (créature non intelligente)
```

### Interprétation
- `CT: "–"` → Pas d'attaque à distance
- `Int/FM/Soc: "–"` → Créature non intelligente (trait Fabriqué)
- `Dex: "–"` → Pas de manipulation fine

## Détection
Vérifier si la valeur est `"–"` ou `"—"` (support variantes Unicode).

## Règles métier

### Créatures Bestiales
Trait "Bestial" → Sociabilité (Soc) doit être "–".

### Créatures Fabriquées
Trait "Fabriqué" → Intelligence, Force Mentale et Sociabilité doivent être "–".

### Attaques à distance
Si CT = "–", aucune arme à distance possible.

## Calculs

### Ignorer dans calculs
Lors du calcul de totaux ou moyennes, ignorer les valeurs "–".

### Remplacement par zéro (selon contexte)
Pour certains calculs (ex: initiative), traiter "–" comme 0.

## Affichage
Afficher "–" tel quel (pas de conversion en nombre ou texte).

## Validation

### Type correct
Une caractéristique peut être soit un entier, soit "–".

### Cohérence avec traits
Vérifier que les caractéristiques "–" correspondent aux traits de la créature :
- Bestial → Soc = "–"
- Fabriqué → Int, FM, Soc = "–"

## Attention Unicode

### Caractères similaires
```
"-"   U+002D  Tiret-moins (ASCII) ❌
"–"   U+2013  Tiret demi-cadratin ✅
"—"   U+2014  Tiret cadratin ⚠️
```

### Normalisation
Standardiser sur U+2013 (tiret demi-cadratin).
Convertir "-" ou "—" vers "–" lors de la validation.

## Tables concernées
- Creatures (char)
- Occasionnellement dans d'autres tables

## Voir aussi
- [pattern-validation-valeurs.md](./pattern-validation-valeurs.md) - Validation valeurs numériques
