# Wizard Trappings - Organisation catégories

## Vue d'ensemble

L'équipement est organisé et affiché par catégories pour faciliter la lecture et la gestion. Le groupement est automatique basé sur le type d'objet.

## Catégories de trappings

### Types principaux

Basés sur champ `type` dans table Trappings :

| Type | Label affiché | Icône/Couleur | Exemples |
|------|---------------|---------------|----------|
| melee | Armes de mêlée | ⚔️ | Épée, Hallebarde, Dague |
| ranged | Armes à distance | 🏹 | Arbalète, Arc, Arme à poudre |
| ammunition | Munitions | 🎯 | Carreaux, Flèches, Billes |
| armor | Armures | 🛡️ | Armure cuir, Casque, Bouclier |
| vehicle | Véhicules | 🚗 | Charrette, Chariot, Cheval |
| trapping | Objets divers | 📦 | Sac, Corde, Lanterne, Outils |

Voir : [trappings.md](../../database/trappings.md)

### Sous-catégories (subType)

Organisation secondaire au sein de chaque type :

**Armes mêlée :**
- Armes de base
- Armes de cavalerie
- Armes d'hast
- Armes de parade
- Armes lourdes

**Armes distance :**
- Arbalètes
- Arcs
- Armes à poudre
- Armes de jet

**Armures :**
- Cuir souple
- Cuir
- Mailles
- Plates

**Objets divers :**
- Vêtements
- Sacs et Contenants
- Outils
- Équipement d'aventurier

## Affichage organisé

### Structure hiérarchique

```
Armes de mêlée (2)
  ↳ Épée longue
  ↳ Dague

Armures (3)
  ↳ Armure de cuir
  ↳ Casque
  ↳ Bouclier

Objets divers (5)
  ↳ Sac à dos
  ↳ Corde (10 mètres)
  ↳ Lanterne
  ↳ Nécessaire d'écriture
  ↳ Provisions (7 jours)
```

**Compteur :** Nombre d'objets par catégorie affiché

### Ordre d'affichage

**Par importance tactique :**
1. Armes de mêlée
2. Armes à distance
3. Munitions
4. Armures
5. Objets divers
6. Véhicules

**Au sein de chaque catégorie :** Ordre alphabétique ou ordre d'ajout

### Sections repliables

**Interface :** Accordéon ou sections collapsables
**Par défaut :** Toutes dépliées au wizard (pour visibilité complète)
**Clic titre :** Replier/déplier section

Permet focus sur catégorie spécifique sans scroll excessif.

## Groupement automatique

### Algorithme

Pour affichage `character.trappings[]` :

1. **Résolution :** Pour chaque label, lookup dans table Trappings → récupérer `type` et `subType`
2. **Groupement :** Créer map `{ type: [objets] }`
3. **Tri :** Ordre catégories prédéfini
4. **Affichage :** Itérer sur map, afficher sections

### Objets non trouvés

**Si `Helper.searchTrapping()` échoue :**
- Type par défaut : `trapping` (Objets divers)
- Affichage quand même dans liste
- Pas d'icône spécifique

Exemples : Argent (CO, PA, SB), objets custom

## Informations par objet

### Affichage ligne objet

**Format :** Label + Quantité + Enc + Actions

Exemple :
```
Corde (10 mètres)    [×1]  enc: 1   [ℹ️] [🗑️]
```

**Icônes :**
- ℹ️ : Aide (popup description)
- 🗑️ : Supprimer (si ajout manuel uniquement)

### Détails au survol

**Tooltip :** Survol affiche infos rapides
- Prix
- Encombrement
- Type/SubType
- Qualités (pour armes/armures)

## Exemples concrets

### Guerrier
Armes mêlée (2): Épée, Dague | Armures (4): Cuir, Casque, Bouclier, Grèves | Objets (4): Sac, Corde, Provisions, Outre

### Érudit
Armes mêlée (1): Dague | Objets (7): Sac, Grimoire, 3 Livres, Nécessaire écriture, Lanterne

### Chasseur
Armes mêlée (1): Dague | Armes distance (1): Arc | Munitions (1): Flèches ×20 | Armures (1): Cuir souple | Objets (5): Sac, Corde, Pièges, Provisions, Outre

## Affichage spécial argent

**Catégorie dédiée :** "Argent" ou "Finances" (haut ou bas liste)
**Format :** 2 CO + 5 PA + 12 SB = Total 572 SB (équivalence)
**Cumul :** Classe + Carrière + Achats/Ventes

## Filtres et recherche

**Barre recherche :** Filtrage instantané par label
**Filtres catégories :** Cases à cocher pour afficher/masquer types
**Tri :** Alphabétique, par encombrement, par prix, par ordre ajout

## Règles métier

### Automatique
Groupement et tri appliqués sans intervention utilisateur.

### Visibilité
Toutes catégories visibles par défaut au wizard (pas de catégories cachées).

### Cohérence
Même organisation utilisée dans character sheet post-création.

## Relations

**Avec database :**
- [trappings.md](../../database/trappings.md) : Champs `type` et `subType` pour groupement

**Avec patterns :**
- [pattern-type-subtype.md](../../patterns/pattern-type-subtype.md) : Hiérarchie catégories

**Avec autres features wizard :**
- [trappings-career.md](./trappings-career.md) : Source objets à catégoriser
- [trappings-manual.md](./trappings-manual.md) : Ajouts dans catégories appropriées
- [trappings-encumbrance.md](./trappings-encumbrance.md) : Affichage enc total par catégorie possible
