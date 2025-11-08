# Equipment - Validation équipement

## Vue d'ensemble

La validation de l'équipement vérifie que toutes les règles métier sont respectées, que les données sont cohérentes, et que le personnage respecte les limites imposées par le système (encombrement, équipement porté, etc.).

## Domaines de validation

### Validation structurelle

**Objets individuels:**
- Chaque objet doit avoir un `id` et un `type`
- Le `type` doit être valide (melee/ranged/armor/ammunition/vehicle/trapping)
- Les propriétés requises selon le type doivent être présentes

**Exemple arme:**
- Si type = melee/ranged: `damage` et `reach` requis
- Si type = armor: `loc` et `pa` requis

### Validation encombrement

**Limite d'encombrement:**
- Calculer encombrement total
- Comparer avec limite (Force + Endurance)
- Alerter si dépassement

**Impact:**
- Si dépassement: afficher pénalités applicables
- Suggérer solutions (retirer objets, augmenter caractéristiques)

Voir [encumbrance-calc.md](./encumbrance-calc.md) et [encumbrance-limit.md](./encumbrance-limit.md)

### Validation équipement porté

**Armures:**
- Vérifier qu'on ne porte pas plusieurs pièces incompatibles
- Alerter si protection excessive (trop de couches)
- Note: Le cumul de PA est autorisé mais peut être limité selon les règles

**Armes:**
- Vérifier cohérence (ne peut pas tenir 3 armes à deux mains)
- Alerter si trop d'armes équipées simultanément

**Boucliers:**
- Maximum 1 bouclier équipé
- Nécessite une main libre

### Validation références

**Qualités:**
- Toutes les qualités référencées doivent exister dans la base
- Type et subType cohérents

**Patterns:**
Voir [pattern-validation-references.md](../../patterns/pattern-validation-references.md)

### Validation prix et disponibilité

**Prix:**
- price >= 0
- Cohérence entre gold/silver/bronze et price consolidé

**Disponibilité:**
- Valeur dans la liste autorisée (Commune/Limitée/Rare/Exotique/Unique)
- Cohérence avec le type d'objet

Voir [pricing.md](./pricing.md)

## Messages d'avertissement

### Types de messages

**Erreur bloquante:**
- Données manquantes obligatoires
- Type invalide
- Référence vers objet inexistant

**Avertissement:**
- Encombrement dépassé
- Équipement incohérent
- Prix anormal

**Information:**
- Suggestions d'optimisation
- Objets non utilisés
- Redondances

### Exemples de messages

**Encombrement:**
```
⚠ Encombrement dépassé: 75/60
Pénalités actives: Mouvement -2, Tests physiques -10%
Suggestion: Retirer 15 enc pour revenir dans la limite
```

**Équipement:**
```
⚠ Vous portez 3 armes à deux mains
Les armes à deux mains nécessitent les deux mains pour être utilisées
```

**Références:**
```
❌ Qualité "Tranchante" introuvable
L'arme "Épée elfique" référence une qualité qui n'existe pas
```

## Validation en temps réel

### Déclenchement

Validation automatique quand:
- Objet ajouté à l'inventaire
- Objet retiré de l'inventaire
- État changé (porté ↔ stocké)
- Caractéristique modifiée (Force/Endurance)
- Propriété d'objet modifiée

### Feedback immédiat

L'interface doit montrer instantanément:
- État de l'encombrement (code couleur)
- Pénalités actives
- Alertes sur équipement

## Règles métier récapitulatives

### Objets

- Type obligatoire et valide
- Propriétés cohérentes avec le type
- enc >= 0
- price >= 0
- Qualités existantes

### Encombrement

- Total = Σ(enc × quantité) pour objets portés
- Limite = Force + Endurance
- Si total > limite: pénalités

### Équipement porté

- Armures: cumul PA autorisé
- Armes: cohérence avec mains disponibles
- Boucliers: maximum 1

### Monnaie

- Valeurs >= 0
- Conversions exactes (1 CO = 20 PA, 1 PA = 12 S)

## Exemples Warhammer

**Validation OK:** Force 35, End 30 → Limite 65, Enc 30 → ✓ Tout OK
**Avec alertes:** Force 25, End 25 → Limite 50, Enc 56 → ⚠ Surcharge +6

## Relations avec d'autres systèmes

### Avec Encumbrance
Validation principale de l'encombrement.
Voir [encumbrance-calc.md](./encumbrance-calc.md), [encumbrance-limit.md](./encumbrance-limit.md)

### Avec Inventory
Validation de tous les objets de l'inventaire.
Voir [inventory.md](./inventory.md)

### Avec Display
Affichage des messages de validation.
Voir [display.md](./display.md)

## Patterns réutilisés

Voir [pattern-validation-references.md](../../patterns/pattern-validation-references.md) pour validation des références.
Voir [pattern-validation-valeurs.md](../../patterns/pattern-validation-valeurs.md) pour validation des plages et énumérations.
