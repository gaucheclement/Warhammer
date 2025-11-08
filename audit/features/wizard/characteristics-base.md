# Wizard Characteristics - Affichage caractéristiques de base

## Contexte

L'étape Caractéristiques du wizard de création affiche les 10 caractéristiques de base héritées de l'espèce choisie. Ces valeurs constituent le socle sur lequel sont construits tous les attributs du personnage.

**Relations** : Voir [characteristics.md](../../database/characteristics.md) et [species.md](../../database/species.md)

## 10 Caractéristiques de base

### Combat : CC, CT

**Capacité de Combat (CC)** : Compétence au corps à corps. Exemples : Nain 30, Haut Elfe 30, Humain 20

**Capacité de Tir (CT)** : Compétence aux armes à distance. Exemples : Halfling 30, Elfe Sylvain 30, Humain 20

### Physiques : F, E, I, Ag, Dex

**Force (F)** : Puissance musculaire. Bonus de Force pour dégâts et portage. Exemples : Ogre 35, Humain 20, Halfling 10

**Endurance (E)** : Résistance physique. Bonus d'Endurance pour Points de Blessure. Exemples : Nain 30-40, Ogre 35, Humain 20

**Initiative (I)** : Réactivité et ordre d'action au combat. Exemples : Haut Elfe 40, Elfe Sylvain 40, Humain 20, Ogre 0

**Agilité (Ag)** : Coordination pour esquive et acrobaties. Exemples : Elfe Sylvain 30, Haut Elfe 30, Humain 20, Ogre 10

**Dextérité (Dex)** : Habileté manuelle pour artisanat et précision. Exemples : Halfling 30, Gnome 30-40, Humain 20, Ogre 10

### Mentales : Int, FM, Soc

**Intelligence (Int)** : Apprentissage et raisonnement. Exemples : Haut Elfe 30, Gnome 30, Humain 20, Ogre 10

**Force Mentale (FM)** : Volonté et résistance mentale. Exemples : Nain 40, Gnome 30-40, Haut Elfe 30, Humain 20

**Sociabilité (Soc)** : Charisme et aptitudes sociales. Exemples : Haut Elfe 30, Humain 20, Nain 10

## Valeurs de base par espèce

### Système de valeurs

**Format stocké** : La table characteristics contient un champ `rand` avec les valeurs par espèce

**Structure** :
```
{
  "Humain": 20,
  "Nain": 30,
  "Haut Elfe": 30,
  "Elfe Sylvain": 30,
  "Halfling": 20,
  "Gnome": 20,
  "Ogre": 10
}
```

**Application** : Lors de la sélection d'une espèce, le système récupère `species.refChar` puis charge les valeurs correspondantes depuis `characteristics.rand[refChar]`

### Valeur fixe vs variable

**Valeurs fixes** : Certaines caractéristiques ont une valeur de base unique par espèce

**Valeurs variables** : D'autres ont une partie fixe + un jet de 2d10 (résultat 2 à 20)

**Exemples Humain** :
- CC : 20 (fixe) + 2d10
- E : 20 (fixe) + 2d10
- I : 20 (fixe) + 2d10

**Exemples Nain** :
- CC : 30 (fixe) + 2d10
- E : 30 (fixe) + 2d10
- FM : 40 (fixe) + 2d10

**Règle générale** : Les 10 caractéristiques de type "roll" (indices 0-9) utilisent toutes la formule Base + 2d10

## Affichage dans le wizard

### Tableau de base

**Colonnes** : Nom | Base | Jet | Total

**Exemple Humain** : CC (20 + 12 = 32), CT (20 + 8 = 28), F (20 + 14 = 34), E (20 + 11 = 31)

**Exemple Nain** : CC (30 + 9 = 39), E (30 + 12 = 42), FM (40 + 11 = 51), Ag (10 + 7 = 17)

**Provenance** : Valeurs Base viennent de Species via refChar. Colonne Base montre explicitement l'origine espèce.

**Immuabilité** : Joueur ne modifie pas les valeurs Base (déterminées par espèce), seulement le jet 2d10

## Relations avec autres données

### Vers Species

**Champ** : `species.refChar` → clé dans `characteristics.rand`

**Exemple** : "Humains (Reiklander)" → refChar="Humain" → characteristics.rand["Humain"]

**Usage** : Récupère les 10 valeurs de base lors de l'affichage initial

### Vers Characteristics

**Table source** : characteristics.json

**Champs utilisés** :
- `label` : Nom complet affiché
- `abr` : Abréviation (CC, CT, etc.)
- `type` : Filtre sur "roll" pour afficher seulement les 10 caractéristiques de base
- `rand` : Objet contenant les valeurs par espèce
- `desc` : Description affichée au survol

**Filtrage** : Seules les caractéristiques avec `type === "roll"` sont affichées (indices 0-9)

### Impact sur la suite

**Utilisation ultérieure** : Ces valeurs de base servent pour :
- Calcul des bonus (Total ÷ 10)
- Modification par bonus de carrière
- Tests de compétences (Compétence = Caractéristique + Avances)
- Attributs dérivés (Blessures, Mouvement)

**Stockage personnage** : Les valeurs "Base" sont stockées pour référence, le "Jet" est conservé séparément

## Exemples par espèce

**Humain** : Toutes à 20. Équilibré, aucune faiblesse marquée.

**Nain** : Forts E (30), CC (30), FM (40). Faibles Ag (10), Soc (10). Guerrier robuste et volontaire.

**Haut Elfe** : Forts I (40), Int (30), FM (30), Soc (30), CC/CT (30). Noble intelligent et agile.

**Elfe Sylvain** : Forts I (40), Ag (30), CT (30). Archer et forestier.

**Halfling** : Forts CT (30), Dex (30). Faible F (10). Artisan habile mais fragile.

**Gnome** : Forts FM (30-40), Dex (30-40). Magicien artisan.

**Ogre** : Forts F (35), E (35). Faibles I (0), Int (10), Ag (10), Dex (10). Brute physique.

## Voir aussi

- [characteristics.md](../../database/characteristics.md) - Structure complète de la table
- [species.md](../../database/species.md) - Valeurs par espèce
- [characteristics-roll.md](./characteristics-roll.md) - Jet de 2d10
- [characteristics-totals.md](./characteristics-totals.md) - Calcul des totaux et bonus
