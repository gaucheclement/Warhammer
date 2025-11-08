# Character Sheet - Caractéristiques et Compétences

## Contexte

Affichage des caractéristiques et compétences réparti entre en-tête (caractéristiques rollables) et onglet "Compétences/Talents".

**Objectif** : Consultation rapide des valeurs pour jets de dés en jeu.

**Source** : character.characteristics[] et character.skills[]

## Caractéristiques Principales

### En-Tête Feuille

**Caractéristiques rollables** (type 'roll') : CC, CT, F, E, I, Ag, Dex, Int, FM, Soc

**Format tableau** :

| Carac | Symb | Init | Aug | Cour |
|-------|------|------|-----|------|
| CC    | ⚔️   | 35   | +5  | 40   |

**Colonnes** :
1. **Label** : Abréviation - Exemple : "CC", "F"
2. **Symbole** : Icône niveau carrière si dans plan (Bronze/Argent/Or)
3. **Init** : Base = Espèce + Roll + Talent + Star - Exemple : 35
4. **Aug** : Avances = Advance + Career + TmpAdvance - Vide si 0
5. **Cour** : Total = Init + Aug - Exemple : 40

**Clic** : Popup description + compétences carrière liées

### Panneau Droit Onglet "Perso"

**4 groupes de caractéristiques dérivées** :

**Destin** : Destin (valeur), Chance (= Destin)

**Résilience** : Résilience (valeur), Détermination (= Résilience), Dieu Patron (details[5])

**Mouvement** : Mouvement (valeur), Marche (Mvt × 2), Course (Mvt × 4)

**Autre** : Points de Blessures (formule espèce), Corruption (BE + BFM)

**Formules Blessures** :
- Standard : (BE × 2) + BFM
- Avec Force : + BF
- Ogre/Troll : × 2

## Compétences

### Onglet "Compétences/Talents"

**Panneau Gauche** : Compétences de base (type 'base' ET spec vide/'Base')

**Panneau Droit** : Compétences groupées et avancées (inverse)

**Format tableau identique** :

| Nom             | Carac  | Aug | Comp |
|-----------------|--------|-----|------|
| Athlétisme      | Ag 35  | +5  | 40   |
| Art (Peinture)  | Dex 28 | +8  | 36   |

**Colonnes** :
1. **Nom** : Label + spécialisation (si groupée) + symbole carrière
2. **Carac** : Abr + valeur base - Exemple : "Ag 35"
3. **Aug** : Avances (vide si 0) - Exemple : "+5"
4. **Comp** : Total - Exemple : "40"

**Particularité gauche** : getAllSkills() ajoute auto compétences base manquantes (advances = 0)

**Tri** : Alphabétique (Helper.sort)

**Clic** : Popup description compétence

## Calculs

### Caractéristiques

**Base** :
```
specie + roll + talent + star
```

**Avances** :
```
advance + career + tmpadvance
```

**Total** :
```
base + avances
```

**Bonus** :
```
Math.floor(total / 10)
```

### Compétences

**Base** :
```
characteristic.getTotal()
```

**Avances** :
```
advance + specie + career + tmpadvance
```

- **specie** : +5 ou +3 (skills espèce)
- **career** : Cumul niveaux 1-4
- **advance** : Achetées XP
- **tmpadvance** : Temporaires wizard

**Total** :
```
base + avances
```

## Symbole Niveau Carrière

**Logique** : Icône si élément dans plan carrière niveau 4

**Mécanisme** :
1. Cherche dans allByCareer[careerID][4]
2. Si trouvé → origin[0] = premier niveau acquis
3. Affiche icône selon careerLevel (1-4)

**Exemple** : "Corps à corps" acquise niveau 1 → Icône Bronze 1

## Popup Caractéristiques

**Contenu** :
- Description caractéristique
- Compétences de carrière liées (si présentes)

**Exemple CC** :
```
Capacité de Combat (CC)
Mesure adresse au corps à corps...

Compétences de carrière liées :
⚔️ Corps à corps (Base)
⚔️ Corps à corps (Bagarre)
```

## Exemples Concrets

### Agitateur Humain - En-Tête

CC ⚔️ 35+10=45, CT 30+5=35, F 28, E 35+5=40, I 32, Ag ⚔️ 35+5=40, Dex 30, Int ⚔️ 33+8=41, FM 30, Soc ⚔️ 38+10=48

**Dérivées** : Destin 3/Chance 3, Résilience 3/Détermination 3/Dieu Sigmar, Mvt 4/Marche 8/Course 16, Blessures 12, Corruption 7

**Compétences base** : Athlétisme Ag40+5=45, Corps à corps (Base) ⚔️ CC45+10=55, Langue (Reikspiel) Int41+5=46

**Compétences avancées** : Art (Calligraphie) ⚔️ Dex30+5=35, Charme ⚔️ Soc48+8=56, Intuition ⚔️ Int41+5=46

## Relations

### Dépendances Tables

- **database/characteristics.md** : Schéma 18 caractéristiques
- **database/skills.md** : Schéma 47 compétences
- **database/species.md** : Valeurs base par espèce
- **database/careerLevels.md** : Avances gratuites

### Dépendances Features

- **character-model/characteristics.md** : Stockage
- **character-model/skills.md** : Stockage
- **wizard/characteristics-base.md** : Génération base
- **wizard/skills-values.md** : Calcul initial
- **business-rules/skills-avances-progression.md** : Formules

## Voir Aussi

- **character-sheet/identity.md** : Section identité (panneau gauche Perso)
- **character-sheet/talents-spells.md** : Talents/sorts (suite onglet)
- **wizard/resume-derived.md** : Calculs attributs dérivés
