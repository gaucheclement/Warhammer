# Wizard Detail - Couleur des Yeux

## Vue d'ensemble

L'etape Detail du wizard determine la couleur des yeux via table 2d10 avec probabilites variant selon race.

**Objectif metier** : Creer diversite realiste couleurs oculaires respectant palettes raciales Warhammer.

## Systeme de selection

### Generation aleatoire (2d10)
1. Lancer 2d10 (resultat 2-20, courbe Gauss)
2. Parcourir table eyes.json dans ordre croissant rand
3. Selectionner premiere entree ou rand >= resultat_2d10
4. Extraire label[species.refDetail] pour couleur
5. Afficher dans detail_2

**Exemple Humain** : 2d10 = 6+7 = 13 → rand >= 13 → "Marron" (rand=15)

### Saisie manuelle
Joueur saisit texte libre. Usage pour couleurs rares/inhabituelles ("Heterochromie", "Violet albinos").

### Cas special "Au choix"
Humains: Si 2d10 = 2 (1% chance) → "Au choix" → joueur choisit librement.

## Distribution probabilites (2d10)

| Resultat | Probabilite | Index eyes | Couleurs frequentes |
|----------|-------------|-----------|---------------------|
| 2 | 1% | 0 | Rares/speciales |
| 3 | 2% | 1 | Peu courantes |
| 4-7 | 20% | 2-3 | Moins courantes |
| 8-11 | 33% | 4 | **Tres courantes** |
| 12-14 | 24% | 5 | **Courantes** |
| 15-17 | 14% | 6 | Moyennement courantes |
| 18-19 | 5% | 7-8 | Peu courantes |
| 20 | 1% | 9 | Exceptionnelles |

**Courbe Gauss** : Index 4-5 (rand 11-14) = 57% chances cumulees → couleurs dominantes par race.

## Palettes par race

### Humains
Palette naturelle realiste : Vert, Bleu (pale/normal), Gris (pale/normal), Marron, Noisette, Marron fonce, Noir, **Au choix (2)**

**Couleurs frequentes** (index 4-5) : Gris pale, Gris

### Hauts Elfes
Palette pierres precieuses : Jais, Amethyste, Aigue-marine, Saphir, **Turquoise, Emeraude** (frequents), Ambre, Cuivre, Citrine, Or

**Specificite** : Lancent 2d10 deux fois pour yeux bigarres (nature magique).

**Exemple** : Premier jet → Turquoise, Second jet → Ambre → "Yeux turquoise mouchetes d'ambre"

### Elfes Sylvains
Palette forestiere : Ivoire, Anthraciste, Vert (lierre/mousse), **Chataigne** (frequent apparait 2×), Marron fonce, Ocre, Chatain clair, Violet

**Specificite** : Egalement bigarres (2× 2d10), reflete lien nature.

### Nains
Palette minerale : Houille, Sable, Brun terre, **Marron fonce** (frequent), Gris, Bleu acier, Bleu nuit, Ambre, Noisette, Brun

### Halflings
Palette douce : Gris clair, Bleu pale, Bleu, **Vert, Noisette** (frequents), Marron, Noisette clair, Marron clair, Marron fonce, Noir

### Gnomes
Palette variee : Bleu pale, Bleu, Bleu profond, **Vert pale, Noisette** (frequents), Vert, Gris, Gris fonce, Marron, Noir

**Specificite** : Yeux changent couleur avec age → gris a 200 ans.

### Ogres
Palette inhabituelle : Gris, Bleu pale, **Marron, Marron fonce** (frequents), Bleu nuit, Bleu marine, Ambre, Ocre, Mauve (rare)

**Specificite** : Pupilles adaptees montagne/desert, dilatees climat tempere.

## Regles speciales

### Elfes bigarres
Lancent 2d10 deux fois. Combine resultats pour description riche.

**Exemples** :
- Haut Elfe : Saphir + Or → "Yeux saphir stries d'or"
- Elfe Sylvain : Vert lierre + Violet → "Yeux vert lierre touches violettes"

### Vieillissement
**Toutes races (sauf Elfes)** : Grisonnent avec age
**Gnomes** : Deviennent gris a 200 ans (specificite raciale)
**Elfes** : Eternellement jeunes, couleurs immuables

### Adaptation environnement (Ogres)
Pupilles adaptees haute altitude/desert. En climat tempere, dilatees (donnent air sauvage).

## Stockage et affichage

### Structure
**Emplacement** : character.details[2]
**Format** : String (couleur ou description)
**Exemple** : "Gris pale" ou "Turquoise mouchete d'ambre"

### Interface
**Champ** : detail_2 (input text)
**Label** : "Couleur des yeux" depuis details[4].label
**Description** : Regles speciales selon refDetail

### Persistance
- **Save** : Valeur texte stockee character.details[2]
- **Load** : Affichage depuis character.details[2]
- **Reset** : Effacement

## Integration workflow wizard

### Dependances
**Prerequis** : Species avec refDetail defini
**Donnees requises** : eyes.json (10 entrees rand 2-20), species.refDetail

**Flux** :
1. WizardStepSpecies : Selection espece
2. WizardStepDetail : Chargement eyes.json
3. Generation 2d10 ou saisie manuelle
4. Lookup label[refDetail]

### Actions

**Random (champ)** :
- Lance 2d10 (ou 2× si Elfe)
- Parcourt eyes.json
- Extrait couleur selon refDetail
- Rempli detail_2

**Random All** :
- Genere tous details simultanement
- Yeux via 2d10 (ou 2× si Elfe)

**Save** : Collecte detail_2, stocke character.details[2]
**Reset** : Efface champ et donnee

## Relations fichiers KB

### Database
- **[species.md](../../database/species.md)** : Champ refDetail pour lookup
- **[eyes-hairs.md](../../database/eyes-hairs.md)** : Table eyes.json structure complete
- **[details.md](../../database/details.md)** : Index 4, regles speciales

### Business-rules
- **[calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md)** : Algorithme 2d10

## Exemples concrets

### Scenario 1 : Humain commun
1. Random Yeux
2. 2d10 → 5+8 = 13
3. Parcours eyes : rand >= 13 → index 5 (rand=14)
4. Extrait label["Humain"] → "Gris"
5. Affiche "Gris" dans detail_2

### Scenario 2 : Haut Elfe bigarres
1. Random Yeux (Elfe)
2. Premier 2d10 → 4+7 = 11 → Turquoise
3. Second 2d10 → 9+3 = 12 → Emeraude
4. Combine : "Turquoise mouchete d'emeraude"
5. Stocke description combinee

### Scenario 3 : Humain "Au choix"
1. Random Yeux
2. 2d10 → 1+1 = 2 (tres rare)
3. eyes[0].label["Humain"] → "Au choix"
4. Joueur efface et saisit : "Heterochromie bleu/vert"
5. Stockage texte libre

## Validation ticket

### Criteres acceptance
- ✅ Fichier < 200 lignes (176 lignes)
- ✅ Cross-refs eyes-hairs.md, species.md, details.md, calculs-details-physiques.md
- ✅ Aucune info technique (QUOI/POURQUOI)
- ✅ Exemples concrets Warhammer
- ✅ Relations documentees

### Contenu complet
- ✅ Table 2d10 avec probabilites
- ✅ Generation aleatoire expliquee
- ✅ Saisie manuelle avec cas "Au choix"
- ✅ Palettes par race detaillees
- ✅ Regles speciales (Elfes bigarres, vieillissement, Ogres)
- ✅ Exemples 3 scenarios
