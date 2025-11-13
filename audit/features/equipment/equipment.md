# Equipment - Équipement

## Vue d'ensemble

Gestion équipement : armes, armures, objets, encombrement, monnaie.

## Types équipement

### Armes mêlée

Type : "melee", subType : Groupe (Basic, Cavalry, Fencing, Brawling, Flail, Parry, Polearm, Two-Handed).

Propriétés : damage (BF+X), reach (allonge), qualities.

### Armes distance

Type : "ranged", subType : Groupe (Bow, Crossbow, Entangling, Engineering, Explosives, Sling, Throwing, Blackpowder).

Propriétés : damage, reach (portée mètres), qualities.

Modificateurs portée : Bout portant +40%, Courte +20%, Longue +0%, Extrême -20%.

### Munitions

Type : "ammunition", damage (modificateur optionnel).

### Armures

Type : "armor", loc (zones corporelles), pa (Points Armure), qualities.

PA réduit blessures attaque.

Zones : Tête, Torse, Bras, Jambes.

Valeurs PA : 0 (aucune), 1 (cuir), 2 (maille), 3 (demi-plate), 4-5 (plate).

Cumul PA : Plusieurs pièces même zone cumulent.

### Objets divers

Type : "trapping", carry (capacité stockage conteneur optionnel).

## Qualités équipement

### Armes

Atouts : Accurate, Defensive, Damaging, Fast, Hack, Impact, Impale, Penetrating, Pummel, Entangle, Wrap.

Défauts : Slow, Tiring, Unreliable, Blackpowder.

Application combat automatique.

### Armures

Atouts : Flexible, Impenetrable, Fine, Durable, Lightweight.

Défauts : Partial, Weakpoints, Heavy, Uncomfortable.

Modification PA, encombrement, effets usage.

## Encombrement

Calcul : Total = Σ (enc × quantité) objets portés.

Limite = Force + Endurance.

États : Normal (≤ limite, aucune pénalité), Surchargé (> limite, pénalités).

Pénalités surcharge :
- Légère (+1 à +10) : Mvt -1, Tests physiques -5%
- Moyenne (+11 à +20) : Mvt -2, Tests physiques -10%, Ag -10%
- Lourde (+21+) : Mvt -3, Tests physiques -20%, Ag -20%, Impossible courir

Affichage : X / Y, codes couleur (Vert <80%, Orange 80-100%, Rouge >100%).

## Organisation inventaire

Catégorisation : Type (melee/ranged/ammunition/armor/vehicle/trapping), subType (groupes armes, types objets).

État : Porté (compte enc, prêt emploi) ou Stocké (rangé, action accès).

## Économie

### Monnaie

Types : Couronne Or (CO), Pistole Argent (PA), Sou (S).

Conversions : 1 CO = 20 PA, 1 PA = 12 S, 1 CO = 240 S.

Encombrement pièces : <100 enc 0, 100-500 enc 1, 500-1000 enc 2.

### Prix disponibilité

Niveaux : Commune (partout), Limitée (villes), Rare (grandes villes), Exotique (très rare), Unique (objet unique).

Variations régionales selon localisation.

## Validation

Structurelle : id+type, type valide, propriétés requises.

Encombrement : Calculer total, alerter dépassement.

Équipement porté : Cohérence armes/armures/boucliers.

Références : Qualités existent base.

Validation temps réel : Ajout/retrait objet, état changé, carac modifiée.

## Affichage

Organisation : Regroupement catégories (Armes, Armures, Équipement, Monnaie).

Tri : Type, subType, alphabétique, enc, prix, ordre ajout.

Informations : Nom, quantité, enc, état, dégâts/PA, qualités.

Interactions : Voir détails, équiper/déséquiper, porter/stocker, vendre, jeter.

## Voir aussi

- [../../database/trappings.md](../../database/trappings.md)
- [../../database/qualities.md](../../database/qualities.md)
- [../../business-rules/calcul-encombrement.md](../../business-rules/calcul-encombrement.md)
