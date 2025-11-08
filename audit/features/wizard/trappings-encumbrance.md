# Wizard Trappings - Calcul encombrement

## Vue d'ensemble

Affichage en temps réel de l'encombrement total et de la limite de portage du personnage. Indicateur visuel si dépassement de la capacité.

## Source des données

### Encombrement par objet

**Champ :** `trappings.enc` (nombre)
**Source :** Table Trappings

Valeurs typiques :
- 0 : Objets légers (munitions, bijoux)
- 1-2 : Moyens (arme légère, sac)
- 3-4 : Lourds (arme 2 mains, armure)
- 6+ : Très lourds (baril, équipement lourd)

Voir : [calcul-encombrement.md](../../business-rules/calcul-encombrement.md)

### Quantités

**Multiplicateur :** Quantité × enc unitaire

Exemples :
- 1 Hallebarde : 1 × 3 = 3
- 10 Clous : 10 × 0 = 0
- 2 Livres : 2 × 1 = 2

## Calcul total

### Formule

**Encombrement total = Σ (quantité × enc) pour tous trappings**

Parcours `character.trappings[]` :
1. Pour chaque objet, résoudre via `Helper.searchTrapping(label)`
2. Récupérer champ `enc`
3. Multiplier par quantité si applicable
4. Additionner tous les résultats

### Objets contenants

**Champ carry :** Capacité de contenu (ne réduit PAS l'encombrement)

Exemple :
```
Sac à dos : enc 1, carry 2
Contenu (Rations enc 1 + Corde enc 1)

Encombrement total = 1 (sac) + 1 (rations) + 1 (corde) = 3
```

Le `carry` indique organisation, pas allègement magique.

Voir : [calcul-encombrement.md](../../business-rules/calcul-encombrement.md)

## Limite de portage

### Calcul limite

**Formule : Bonus de Force × 10**

Bonus de Force = Force ÷ 10 (arrondi inférieur)

Exemples :
- Force 25 → BF 2 → Limite 20
- Force 35 → BF 3 → Limite 30
- Force 42 → BF 4 → Limite 40

### Source Force

**Au step Trappings :**
- Force de base (espèce)
- + Avances espèce (skills +5 ou +3)
- + Avances carrière niveau 1 (si Force listée)
- + Modificateurs talents (si applicables)
- + Modificateur signe astrologique (si applicable)

**Calcul dynamique :** Valeur Force actuelle du personnage au moment du step.

## Affichage interface

### Indicateur encombrement

**Format :** "Encombrement : X / Y"
- X = Total actuel
- Y = Limite (BF × 10)

**Position :** Panneau droit, partie basse ou header

### Jauge visuelle

**Barre de progression :**
- Longueur : (Total / Limite) × 100%
- Couleur selon seuils

**Codes couleur :**
| Ratio | Couleur | Signification |
|-------|---------|---------------|
| 0-70% | Vert | Normal, marge confortable |
| 71-100% | Orange | Proche limite, attention |
| 101%+ | Rouge | Surchargé, pénalités ! |

### Message d'état

**≤ 100% :** "Encombrement normal"
**> 100% :** "Surchargé ! Mouvement réduit, malus Agilité, pas de course"

## Dépassement limite

### Seuils de pénalités

**Normal (≤ BF × 10) :**
- Aucune pénalité
- Mouvement normal
- Actions normales

**Surchargé (BF × 10 < enc ≤ BF × 20) :**
- Mouvement réduit de moitié
- Malus -10 aux Tests d'Agilité
- Pas de course possible
- Fatigue accrue

**Immobilisé (> BF × 20) :**
- Déplacement impossible
- Nécessite laisser objets sur place

### Avertissement création

**Au wizard :** Dépassement autorisé avec avertissement visible

Message : "Attention : Votre personnage est surchargé. Il subira des pénalités en jeu. Réduisez votre équipement ou augmentez votre Force."

**Pas de blocage :** Le joueur peut valider même surchargé (gestion en jeu).

## Mise à jour temps réel

### Déclencheurs recalcul

**Ajout objet :** Recalcul immédiat après sélection choix "ou" ou ajout manuel
**Suppression objet :** Recalcul après retrait
**Modification quantité :** Recalcul à chaque changement

**Affichage synchronisé :** Jauge et texte actualisés instantanément.

## Exemples concrets

### Guerrier léger (Force 35, BF 3, Limite 30)
Épée + Bouclier + Armure cuir + Sac + Provisions + Corde = 9 / 30 (30%, Vert)

### Guerrier lourd (Force 35, BF 3, Limite 30)
Hallebarde + Armure plates + Bouclier + Sac + Provisions + Baril + Outils = 22 / 30 (73%, Orange)

### Guerrier surchargé (Force 25, BF 2, Limite 20)
Hallebarde + Armure complète + Bouclier + Sac + Provisions + Baril + Outils = 25 / 20 (125%, Rouge SURCHARGÉ)

### Érudit optimisé (Force 30, BF 3, Limite 30)
Dague + Sac + Grimoire + 3 Livres + Nécessaire + Lanterne = 6 / 30 (20%, Vert)

## Optimisation

**Conseils si proche/dépassement limite :**
- Objets enc 0 ne comptent pas (munitions, bijoux)
- Contenants (carry) organisent mais n'allègent pas
- Prioriser armes légères et armure cuir
- Éviter objets très lourds (baril enc 6, armure complète enc 8)

## Relations

**Avec database :**
- [trappings.md](../../database/trappings.md) : Champ `enc` et `carry`
- [characteristics.md](../../database/characteristics.md) : Force et Bonus Force

**Avec business-rules :**
- [calcul-encombrement.md](../../business-rules/calcul-encombrement.md) : Formules et seuils

**Avec autres features wizard :**
- [trappings-career.md](./trappings-career.md) : Source objets initiaux
- [trappings-manual.md](./trappings-manual.md) : Ajout objets supplémentaires
- [trappings-validation.md](./trappings-validation.md) : Vérification finale
