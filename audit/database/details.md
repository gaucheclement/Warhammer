# Details - Table de données

## Vue d'ensemble

La table Details stocke les informations descriptives et formules pour générer les détails physiques et personnels des personnages (nom, âge, taille, yeux, cheveux, ambitions).

**Objectif métier** : Fournir les règles et données nécessaires pour compléter l'identité du personnage lors de la création.

## Structure des données

### Champs d'identification
- **index** : Numéro unique d'identification (0-10)
- **label** : Type de détail (Nom, Age, Age Base, Age Roll, Couleur des yeux, Couleur des cheveux, Taille, Height Base, Height Roll, Ambitions à court terme, Ambitions à long terme)

### Champs descriptifs
- **allDesc** : Description générale applicable à toutes les espèces (texte HTML)
- **desc** : Objet contenant les descriptions/valeurs spécifiques par espèce (clés: Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre)

## Types de détails disponibles

### 1. Nom (index 0)
Conventions de nommage par culture. **Humain** : Prénom + nom de famille (profession, lieu, trait). Nobles avec "von". **Halfling** : Baptême + prénoms + clan (nourriture/géographie). **Nain** : Prénom + nom familial (-sson/-sdottir/-snev/-sniz) + clan. Surnoms d'exploits. **Elfe** : Prénom + épithète (traits caractère ou nature). **Gnome** : Prénom (tradition familiale) + clan. **Ogre** : Noms traditionnels ou adoptés Empire. Titres/Grands Noms prioritaires.

### 2. Age (index 1)
Espérance de vie par espèce: Humain 60, Halfling 120, Nain 200+, Haut Elfe 1000+ (apparence éternelle), Gnome 500, Ogre 120 ans.

### 3-4. Age Base + Age Roll (index 2-3)
Formule: Age = Age Base + (1d10 × Age Roll)

| Espèce | Age Base | Age Roll | Exemple |
|--------|----------|----------|---------|
| Humain | 15 | 1 | 15 + 1d10 (16-25 ans) |
| Halfling | 15 | 5 | 15 + 5d10 (20-65 ans) |
| Nain | 15 | 10 | 15 + 10d10 (25-115 ans) |
| Haut Elfe | 30 | 10 | 30 + 10d10 (40-130 ans) |
| Elfe Sylvain | 30 | 10 | 30 + 10d10 (40-130 ans) |
| Gnome | 20 | 10 | 20 + 10d10 (30-120 ans) |
| Ogre | 15 | 5 | 15 + 5d10 (20-65 ans) |

### 5. Couleur des yeux (index 4)
Règles spéciales: Elfes lancent 2× (yeux bigarrés). Gnome: grisonne avec âge (grise à 200 ans). Ogre: pupilles adaptées haute altitude/désert. Autres: table standard (eyes.json).

### 6. Couleur des cheveux (index 5)
Toutes races (sauf elfes): grisonnent avec âge. Elfes éternellement jeunes. Gnome: finit argent (pas blanc). Ogre: épais/sombre, chauves à 30 ans, gris à 80 ans. Barbes courantes. Autres: table standard (hairs.json).

### 7-8. Taille + Height Base + Height Roll (index 6-8)
Moyennes: Nain 1,45m, Elfe 1,90m, Halfling 1m, Humain 1,75m. Formule: Taille = Height Base + (2d10 × Height Roll)

| Espèce | Height Base | Height Roll | Exemple |
|--------|-------------|-------------|---------|
| Humain | 145 | 5 | 145 + 10d10 (155-245 cm) |
| Halfling | 90 | 5 | 90 + 10d10 (100-190 cm) |
| Nain | 130 | 3 | 130 + 6d10 (136-190 cm) |
| Haut Elfe | 180 | 2 | 180 + 4d10 (184-220 cm) |
| Elfe Sylvain | 180 | 2 | 180 + 4d10 (184-220 cm) |
| Gnome | 100 | 2.5 | 100 + 5d10 (105-150 cm) |
| Ogre | 235 | 6 | 235 + 12d10 (247-355 cm) |

Note Gnome: 2,5 = moyenne 1,15m. Note Ogre: poids culturellement prioritaire sur taille.

### 9-10. Ambitions court/long terme (index 9-10)
Court terme (jours/semaines, 2-3 sessions): ruiner réputation rival, venger camarade, lier amitié. Long terme (mois/années, motivation principale): posséder relais, développer village, influencer Collèges Magie.

## Relations avec autres tables

### Species (via refDetail)
`refDetail` dans species.json pointe vers clé desc (ex: "Humain"). Extrait: Age Base/Roll, Height Base/Roll, règles yeux/cheveux. Voir [species.md].

### Eyes/Hairs (tables externes)
Eyes.json: probabilités couleurs yeux (1d100, elfes 2×). Hairs.json: probabilités cheveux (1d100, affecté âge sauf elfes).

## Cas d'usage métier

### Création personnage - Étape 7 : Détails
Compléter identité après espèce/carrière/caractéristiques. Processus: récupérer refDetail → extraire desc[refDetail] → calculer âge/taille (formules) → générer yeux/cheveux (tables/règles) → saisir nom (conventions) → définir ambitions. Modes: automatique, manuel, hybride.

## Tests de cohérence

### Structure
Index 0-10 présents/uniques. Labels uniques/non vides. Desc contient 7 clés espèces. Index numériques (2,3,7,8) ont valeurs numériques.

### Formules
Age Base + (10 × Age Roll) < espérance vie. Height Base + (20 × Height Roll) cohérent moyennes. Gnome Height Roll = 2.5.

### Relations/Descriptions
Clés desc = valeurs refDetail possibles (species.json). Eyes.json/hairs.json existent. HTML valide. Exemples concrets présents.

## Validation des données

### Champs obligatoires

| Champ | Contrainte | Message erreur |
|-------|------------|----------------|
| index | Unique, 0-10, numérique | "Index {X} manquant ou dupliqué" |
| label | Non vide, unique | "Label manquant pour index {X}" |
| desc | Objet avec 7 clés espèces | "Espèce {Y} absente dans desc de {label}" |

### Contraintes par type
Age/Height Base/Roll (2,3,7,8): numériques > 0 (Height Roll peut être décimal). Autres (0,4,5,6,9,10): texte HTML ou vide si allDesc rempli.

### Règles inter-champs
Desc[espèce] vide ET allDesc vide → erreur. Age Base + (10 × Age Roll max) < espérance vie. Height Base + (20 × Height Roll) cohérent moyennes.

### Messages erreur métier
"Impossible de calculer {label} pour {espèce}: données manquantes" | "{label} calculé ({valeur}) hors limites biologiques {espèce}" | "Espèce '{refDetail}' absente details.json" | "HTML mal formé dans {label}" | "Age Base invalide {espèce}: {valeur}" | "Description manquante {label}/{espèce}"
