# Pattern: Validation des valeurs

## Contexte
Validation de champs avec valeurs contraintes.
Garantit que seules les valeurs autorisées ou dans des plages valides sont utilisées.

---

## 1. Validation énumérations

### Format
Un champ doit avoir une valeur dans une liste autorisée.

### Algorithme
Vérifier que la valeur du champ est présente dans la liste des valeurs autorisées.

Si le champ est vide ou null, considérer comme valide (champ optionnel).

**Erreurs possibles :**
- `ENUM_INVALID` : Valeur non autorisée

### Exemples par table

**Skills.type :**
Valeurs autorisées : `["base", "avancée"]`

**Spells.type :**
Valeurs autorisées : `["Béni", "Magie mineure", "Magie des Arcanes", "Magie du Chaos", "Invocation"]`

**Careers.class :**
Valeurs autorisées : `["Citadins", "Courtisans", "Guerriers", "Itinérants", "Ruraux", "Chaos"]`

**Trappings.type :**
Valeurs autorisées : `["Arme", "Armure", "Équipement", "Conteneur", "Vêtement", "Nourriture", "Outil"]`

### Validation insensible à la casse
Normaliser la valeur et les valeurs autorisées en minuscules avant comparaison.

Permet d'accepter "CITADINS", "Citadins", "citadins" comme équivalents.

### Suggestion de correction
En cas d'erreur, suggérer la valeur la plus proche :
- Correspondance exacte case-insensitive
- Correspondance partielle (contient ou est contenu)
- Distance de Levenshtein (optionnel)

### Validation suite complète
Valider tous les champs énumérés d'une entité en une seule passe.

### Messages d'erreur
Format : `{entity}: {field} = "{value}" invalide. Valeurs autorisées: {allowed}. Suggestion: {suggestion}`

### Énumérations dynamiques
Pour les valeurs dépendant d'une autre table, extraire les valeurs autorisées de cette table.

Exemple : Careers.class doit être dans Classes.label

### Validation combinée
Avec dépendances entre champs : certaines énumérations ne sont valides que si un autre champ a une valeur spécifique.

Exemple :
- Si Spells.type = "Magie des Arcanes", alors subType doit être dans ["Feu", "Lumière", "Métal", etc.]

---

## 2. Validation plages numériques

### Algorithme de base
Vérifier qu'une valeur numérique est :
1. Du bon type (number)
2. Dans la plage [min, max]

Gérer les valeurs spéciales (vide, null, "–").

**Erreurs possibles :**
- `RANGE_TYPE` : Type incorrect
- `RANGE_OUT_OF_BOUNDS` : Valeur hors limites

### Plages communes

**Caractéristiques :**
- M (Mouvement): 0-10
- CC, CT, F, E, I, Ag, Dex, Int, FM, Soc: 0-100
- B (Blessures): 1-200

**Métadonnées :**
- index: 0-Infinity
- page: 1-999
- rand: 1-100
- enc (encombrement): 0-100

**Sorts :**
- cn (Casting Number): 0-50
- range (si numérique): 0-1000

### Validation avec valeurs spéciales
Accepter certaines valeurs non numériques comme valides (ex: "–" pour les créatures).

#### Valeur "–" (non applicable)
**Format :** "–" (tiret demi-cadratin U+2013, PAS tiret simple "-" U+002D)

**Contexte :** Indique qu'une caractéristique n'existe pas ou n'est pas applicable, principalement pour les créatures.

**Exemples :**
- `CT: "–"` → Pas d'attaque à distance
- `Int/FM/Soc: "–"` → Créature non intelligente (trait Fabriqué)
- `Dex: "–"` → Pas de manipulation fine

**Règles métier associées :**
- Trait "Bestial" → Soc = "–"
- Trait "Fabriqué" → Int, FM, Soc = "–"
- Si CT = "–", aucune arme à distance possible

**Gestion dans calculs :**
- Ignorer "–" dans les totaux et moyennes
- Pour certains calculs (ex: initiative), traiter "–" comme 0

**Normalisation Unicode :**
Standardiser sur U+2013 (tiret demi-cadratin). Convertir "-" (U+002D) ou "—" (U+2014) vers "–" lors de la validation.

**Validation cohérence avec traits :**
Vérifier que les caractéristiques "–" correspondent aux traits de la créature (Bestial, Fabriqué).

### Validation contextuelle
La plage peut dépendre d'autres champs de l'entité.

Exemple : Les Blessures d'une créature dépendent de sa taille :
- Minuscule: 1-3
- Petite: 5-15
- Moyenne: 10-20
- Grande: 20-40
- Énorme: 40-80
- Monstrueuse: 80-200

### Validation de cohérence
Vérifier que des valeurs liées respectent des contraintes.

Exemple : Caractéristique de base <= Caractéristique avancée

**Erreurs possibles :**
- `RANGE_INCOHERENT` : Valeurs incohérentes entre elles

### Messages d'erreur
- `RANGE_TYPE` : "{entity}: {field} doit être {expectedType}, trouvé {actualType}"
- `RANGE_OUT_OF_BOUNDS` : "{entity}: {field} = {value} hors limites ({min}-{max})"
- `RANGE_INCOHERENT` : "{entity}: {field1} ({value1}) incohérent avec {field2} ({value2})"

### Avertissements vs erreurs
Distinguer :
- **Erreurs** : valeurs impossibles (hors limites absolues)
- **Avertissements** : valeurs inhabituelles mais acceptables

Exemple : CC peut être 0-100 (limites absolues) mais 5-95 est normal.
Une valeur de 2 génère un avertissement, pas une erreur.

---

## Tables concernées

Toutes les tables avec champs énumérés ou valeurs numériques.

---

## Voir aussi

- [pattern-type-subtype.md](./pattern-type-subtype.md) - Hiérarchie type/subType
- [pattern-validation-references.md](./pattern-validation-references.md) - Validation références
