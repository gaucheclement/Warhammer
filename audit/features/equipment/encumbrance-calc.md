# Equipment - Calcul de l'encombrement

## Vue d'ensemble

L'encombrement total représente le poids et l'encombrement combinés de tout l'équipement porté par le personnage. Il est calculé en additionnant les valeurs d'encombrement de chaque objet.

## Formule de base

```
Encombrement Total = Σ (enc × quantité) pour chaque objet porté
```

**enc** - Valeur d'encombrement de l'objet (propriété dans trapping)
**quantité** - Nombre d'exemplaires possédés (implicite ou explicite)

## Calcul par objet

Chaque objet de l'inventaire contribue à l'encombrement:

**Objet unique:**
- 1 épée (enc 1) = 1 encombrement

**Objets multiples:**
- 10 flèches (enc 0.1 chacune) = 1 encombrement total
- 3 couvertures (enc 1 chacune) = 3 encombrement

**Objets sans encombrement:**
- enc = 0 signifie que l'objet n'ajoute rien (pièces de monnaie individuelles, petits objets)

## Équipement porté vs stocké

**Porté (worn):**
- Compte dans l'encombrement total
- Armures portées, armes à la ceinture, sac à dos

**Stocké (stored):**
- Peut être compté ou non selon l'implémentation
- Objets dans des conteneurs, monture, chariot

Dans l'implémentation actuelle, le système ne distingue pas systématiquement porté/stocké pour le calcul, mais cette distinction existe fonctionnellement.

Voir [worn-vs-stored.md](./worn-vs-stored.md)

## Encombrement par catégorie

L'affichage peut regrouper l'encombrement par type:

**Armes:**
- Somme des enc de toutes les armes (melee + ranged + ammunition)

**Armures:**
- Somme des enc de toutes les pièces d'armure

**Autres:**
- Somme des enc des trappings divers

**Total:**
- Somme de toutes les catégories

## Exemples concrets Warhammer

### Personnage léger
```
Équipement:
- Dague (enc 0)
- Arc (enc 1)
- 20 flèches (enc 0.1 × 20 = 2)
- Gilet de cuir (enc 1)
- Sac à dos (enc 1)
- Couverture (enc 1)
- Rations (enc 1)

Total: 0 + 1 + 2 + 1 + 1 + 1 + 1 = 7 encombrement
```

### Personnage lourd
```
Équipement:
- Épée (enc 1)
- Hallebarde (enc 2)
- Bouclier (enc 1)
- Armure de maille complète (enc 3)
- Casque (enc 0)
- Sac à dos (enc 1)
- Corde 10m (enc 1)
- Divers (enc 3)

Total: 1 + 2 + 1 + 3 + 0 + 1 + 1 + 3 = 12 encombrement
```

## Affichage total

L'encombrement total est affiché avec la limite du personnage:

**Format:** `X / Y` où X = encombrement actuel, Y = limite

**Exemple:** `7 / 10` signifie 7 d'encombrement sur une limite de 10

**Codes couleur (suggestion):**
- Vert: X < Y (dans la limite)
- Orange: X = Y (à la limite)
- Rouge: X > Y (surcharge)

## Monnaie

La monnaie contribue aussi à l'encombrement:
- Les pièces individuelles ont enc = 0
- Mais des grandes quantités peuvent peser

Voir [money.md](./money.md) pour les détails.

## Relations avec d'autres systèmes

### Avec Inventory
Tous les objets de l'inventaire ont une propriété `enc`.
Voir [inventory.md](./inventory.md)

### Avec Encumbrance Limit
Le total est comparé à la limite pour détecter les surcharges.
Voir [encumbrance-limit.md](./encumbrance-limit.md)

### Avec Encumbrance Penalties
Si le total dépasse la limite, des pénalités s'appliquent.
Voir [encumbrance-penalties.md](./encumbrance-penalties.md)

### Avec Worn vs Stored
Seul l'équipement porté compte (en théorie).
Voir [worn-vs-stored.md](./worn-vs-stored.md)

## Validation

### Règles métier

**Cohérence:**
- Tous les objets doivent avoir une valeur enc définie
- enc doit être >= 0
- Le total doit être recalculé quand l'inventaire change

**Calcul:**
- Somme correcte de tous les enc × quantité
- Exclusion des objets stockés (si applicable)

### Vérifications

- Vérifier que tous les trappings ont une propriété enc
- Vérifier que enc >= 0
- Alerter si total > limite
- Vérifier la cohérence du total affiché
