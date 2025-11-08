# Character Model - Gestion trappings

## Objectif

Documenter la gestion de l'équipement (trappings): ajout, quantités, calcul encombrement.

## Contexte Warhammer

Les trappings représentent tout l'équipement du personnage:
- **Armes**: Épée, arc, arbalète...
- **Armures**: Cuir, mailles, plaques...
- **Équipement**: Corde, lanterne, rations...
- **Contenants**: Sac à dos, besace...

Chaque item a un encombrement (enc) et peut être en quantité multiple.

Voir [database/trappings.md](../database/trappings.md)

## Structure du tableau trappings

Le tableau trappings contient des objets simples (PAS de méthodes complexes):

```
{
  label: 'Épée',
  type: 'Arme',
  qty: 1,
  enc: 1
}
```

Propriétés:
- **label**: Nom de l'item
- **type**: Catégorie (Arme, Armure, Équipement...)
- **qty**: Quantité possédée
- **enc**: Encombrement unitaire

**Note**: Pas d'id, pas de data reference. Structure simplifiée.

## Méthodes principales

### addTrappings(trappings)

**Rôle**: Ajouter une liste d'équipements.

**Comportement**:
1. Pour chaque trapping:
   - Si déjà présent (même label): augmente qty
   - Sinon: ajoute au tableau

2. Retourne tableau mis à jour

**Usage**: Appelé lors de:
- Sélection équipement de départ (carrière)
- Ajout manuel
- Achat/récompense

### getTrappings()

**Rôle**: Retourner tout l'équipement.

**Retour**: Tableau de trappings

## Gestion quantités

Les trappings peuvent être en quantité multiple.

**Exemples**:
- Flèches: qty=20, enc=0 (groupées)
- Rations: qty=7, enc=0.1 (total enc = 0.7)
- Épée: qty=1, enc=1

**Ajout**: Si addTrappings(['Flèche']) et 'Flèche' déjà présent avec qty=20, passe à qty=21.

## Calcul encombrement

L'encombrement total est calculé par calculateEncumbrance().

**Formule**: Somme de (qty × enc) pour tous les trappings

**Limite**: Bonus d'Endurance + Bonus de Force
- Si total > limite: personnage encombré (malus)

**Exemple**:
- Épée: 1 × 1 = 1
- Armure cuir: 1 × 3 = 3
- Rations: 7 × 0.1 = 0.7
- Total: 4.7
- Limite (BE=3, BF=2): 5
- Non encombré (4.7 < 5)

Voir [derived.md](./derived.md) pour le calcul.

## Catégories

Les trappings sont organisés par type:
- **Armes de mêlée**: Épée, Hache, Marteau...
- **Armes de tir**: Arc, Arbalète, Fronde...
- **Armures**: Cuir, Mailles, Plaques...
- **Vêtements**: Robes, Manteau...
- **Équipement général**: Corde, Lanterne, Outils...
- **Contenants**: Sac, Besace, Coffre...

**Filtrage**: getTrappings().filter(t => t.type === 'Arme')

## Équipement de départ carrière

Chaque niveau de carrière définit des trappings de départ.

**Exemple Soldat Niveau 1**:
- Armure de cuir
- Arme à une main
- Dague

**Gestion**: Les trappings de carrière sont listés dans les données mais PEUVENT être remplacés par des choix (or de départ pour acheter).

Voir [database/career-levels.md](../database/career-levels.md)

## Exemples concrets

**Guerrier débutant**:
```
[
  {label: 'Épée', type: 'Arme de mêlée', qty: 1, enc: 1},
  {label: 'Armure de cuir', type: 'Armure', qty: 1, enc: 3},
  {label: 'Sac à dos', type: 'Contenant', qty: 1, enc: 0.1},
  {label: 'Rations', type: 'Équipement', qty: 7, enc: 0.1}
]
Encombrement total: 1 + 3 + 0.1 + 0.7 = 4.8
```

**Archer**:
```
[
  {label: 'Arc', type: 'Arme de tir', qty: 1, enc: 1},
  {label: 'Flèches', type: 'Munition', qty: 20, enc: 0},
  {label: 'Dague', type: 'Arme de mêlée', qty: 1, enc: 0.1},
  {label: 'Vêtements', type: 'Vêtement', qty: 1, enc: 0}
]
Encombrement total: 1 + 0 + 0.1 + 0 = 1.1
```

**Érudit**:
```
[
  {label: 'Grimoire', type: 'Livre', qty: 1, enc: 0.1},
  {label: 'Encre et plume', type: 'Équipement', qty: 1, enc: 0},
  {label: 'Robes', type: 'Vêtement', qty: 1, enc: 0.1}
]
Encombrement total: 0.2
```

## Validation

Contraintes:
- qty >= 0 (pas de quantité négative)
- enc >= 0
- label non vide
- Encombrement total <= limite (sinon malus)

Voir [validation.md](./validation.md)

## Voir aussi

- [database/trappings.md](../database/trappings.md) - Liste équipements
- [database/career-levels.md](../database/career-levels.md) - Équipement de départ
- [derived.md](./derived.md) - Calcul encombrement et limite
