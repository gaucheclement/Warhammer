# Catégorisation de l'équipement

## Vue d'ensemble

Les trappings sont organisés en 6 types avec sous-catégories. Chaque type possède des propriétés spécifiques.

## Types principaux

### melee (Armes de mêlée)
- **Propriétés :** `reach` (allonge texte), `damage`, `qualities`
- **Sous-types :** Armes d'hast, Armes de base, Armes de cavalerie, Armes à 1/2 main(s), Armes de parade
- **Exemples :** Hallebarde (reach "Longue", damage "+BF+4"), Épée (reach "Moyenne", damage "+BF+4")

### ranged (Armes à distance)
- **Propriétés :** `reach` (portée mètres), `damage`, `qualities` (souvent "Recharge N")
- **Sous-types :** Arbalète, Arc, Armes de lancer, Armes à poudre, Frondes
- **Exemples :** Arbalète (reach 60, damage "+9", qualities "Recharge 1")

### ammunition (Munitions)
- **Propriétés :** `reach` "Comme l'arme", `qualities` additionnelles
- **Sous-types :** Correspondent aux armes
- **Principe :** Héritent caractéristiques arme + ajoutent qualités
- **Exemples :** Carreau (subType "Arbalète", qualities "Empaleuse")

### armor (Armures)
- **Propriétés :** `loc` (emplacements), `pa` (points armure), `qualities`
- **Sous-types :** Cuir souple, Cuir, Maille, Plates
- **Emplacements :** Tête, Bras, Corps, Jambes, ou combinaisons
- **Exemples :** Calotte cuir (loc "Tête", pa 1, qualities "Partielle")

### vehicle (Véhicules)
- **Propriétés :** `carry` (chargement), `mode` (propulsion), `toughness`, `wounds`
- **Format mode :** Nombre + Type (A=Animal, C=Cheval)
- **Exemples :** Charrette (carry 25, mode "1 A", toughness 25, wounds 10)

### trapping (Objets divers)
- **Propriétés :** `carry` (pour contenants)
- **Sous-types :** Sacs et Contenants, Outils, Vêtements, Provisions, Équipement général
- **Exemples :** Sac à dos (carry 2), Baril (carry 12)

## Qualités d'armes

### Atouts fréquents

| Qualité | Effet |
|---------|-------|
| Assommante | Peut sonner sur tête (Test Force vs Résistance) |
| Défensive | +1 DR parade |
| Dévastatrice | Choisir DR ou dé unités pour dégâts |
| Empaleuse | Critique sur 10/20/30 ET doubles ≤ Test |
| Recharge N | N Actions pour recharger |
| Rapide | +1 Attaque |
| Taille | Bonus vs grande taille |
| Précise | +1 DR attaques ciblées |

### Défauts

| Qualité | Effet |
|---------|-------|
| Encombrante | Malus en espace confiné |
| Inoffensive | Dégâts = DR uniquement |
| Lente | -1 Initiative |
| Peu fiable | Risque défaillance |

### Qualités avec paramètres

Format : `"Qualité (Indice)"`
- "Recharge 1" : 1 action
- "À Répétition (5)" : 5 munitions auto
- "À Explosion (3)" : rayon 3m

## Qualités d'armures

### Atouts

| Qualité | Effet |
|---------|-------|
| Flexible | Cumul sous armure non-Flexible |
| Impénétrable | Ignore Critiques nombres impairs |
| Solide | Résiste dégradation |

### Défauts

| Qualité | Effet |
|---------|-------|
| Partielle | PA ignorés sur pairs ou Critiques |
| Points faibles | Zones vulnérables |
| Encombrante | Malus Agilité |

## Catégorisation par usage

**Combat rapproché :** melee (reach, damage, qualities combat)
**Combat distance :** ranged + ammunition (portée, damage, qualities tir)
**Protection :** armor (loc, pa, qualities défensives)
**Transport :** vehicle + trapping contenants (carry, enc, mode)
**Équipement général :** trapping (usage narratif)

## Arborescence navigation

**Structure :** `tree.allByType[type][subTypeId]`
**Niveaux :** Type → SubType
**Calcul :** `Helper.toId(subType)`
**Usage :** Organisation UI, filtres

## Exemples détaillés

### Armes mêlée

**Légère :**
```
Dague : melee, Armes à 1 main
reach "Très courte", damage "+BF+2", qualities "Rapide"
```

**Lourde :**
```
Hallebarde : melee, Armes d'hast
reach "Longue", damage "+BF+4", qualities "Défensive, Taille, Empaleuse"
```

### Armes distance

```
Arbalète : ranged, Arbalète
reach 60, damage "+9", qualities "Recharge 1"

Carreau : ammunition, Arbalète
reach "Comme l'arme", qualities "Empaleuse"
```

### Armures

**Complète :**
```
Armure plates : armor, Plates
Multiple pièces, toutes localisations
```

**Partielle :**
```
Calotte : armor, Cuir souple
loc "Tête", pa 1, qualities "Partielle"
```

### Véhicules

```
Charrette : vehicle
carry 25, mode "1 A", toughness 25, wounds 10
```

### Contenants

```
Sac à dos : trapping, Sacs et Contenants
enc 1, carry 2

Baril : trapping, Sacs et Contenants
enc 6, carry 12
```

## Relations

**Qualities :** Table définit effets mécaniques

**Tree :** Arborescence navigation type/subType

**Trappings :** Structure principale (`audit/database/trappings.md`)
