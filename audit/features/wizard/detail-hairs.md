# Wizard Detail - Couleur des Cheveux

## Vue d'ensemble

L'etape Detail du wizard determine la couleur des cheveux via table 2d10 avec probabilites variant selon race.

**Objectif metier** : Creer diversite realiste couleurs capillaires respectant palettes raciales et vieillissement.

## Systeme de selection

### Generation aleatoire (2d10)
1. Lancer 2d10 (resultat 2-20, courbe Gauss)
2. Parcourir table hairs.json dans ordre croissant rand
3. Selectionner premiere entree ou rand >= resultat_2d10
4. Extraire label[species.refDetail] pour couleur
5. Afficher dans detail_3

**Exemple Nain** : 2d10 = 7+6 = 13 → rand >= 13 → "Bronze" (rand=14)

### Saisie manuelle
Joueur saisit texte libre. Usage pour couleurs rares/roleplay specifique ("Teinte mauve artificielle", "Blanc prematurement").

## Distribution probabilites (2d10)

| Resultat | Probabilite | Index hairs | Frequence |
|----------|-------------|-------------|-----------|
| 2-3 | 3% | 0-1 | Exceptionnelles |
| 4-7 | 20% | 2-3 | Peu courantes |
| 8-11 | 33% | 4 | **Tres courantes** |
| 12-14 | 24% | 5 | **Courantes** |
| 15-17 | 14% | 6 | Moyennement courantes |
| 18-20 | 6% | 7-9 | Rares |

**Couleurs dominantes** : Index 4-5 (rand 11-14) = 57% chances → cheveux typiques race.

## Palettes par race

### Humains
Palette naturelle : Blanc, Blond (pale/cendre), Blond, **Brun clair, Brun fonce** (frequents), Chatain, Roux, Brun roux, Noir

**Particularite** : Pilosite faciale (hommes) assortie chevelure.

### Hauts Elfes
Palette metallique noble : Argent, Blanc, Blond (pale/normal), **Blond intense, Blond cuivre** (frequents), Blond ambre, Auburn, Roux, Blond roux, Noir

**Specificite** : Jamais grisonnent (eternellement jeunes).

### Elfes Sylvains
Palette forestiere : Blond (tres pale/pale/normal/dore), **Brun, Brun acajou** (frequents), Chatain, Chatain roux, Brun roux, Noir

**Specificite** : Comme Hauts Elfes, immuables dans temps.

### Nains
Palette minerale : Blanc, Gris, Blond pale, Dore, **Cuivre, Bronze** (frequents), Brun, Brun fonce, Brun roux, Noir

**Particularite** : Barbes longues prisees (males/femelles), assortiment avec chevelure.

### Halflings
Palette douce : Blond (pale/normal), Sable, **Chataigne, Gingembre** (frequents), Brun (clair/fonce), Roux, Chatain, Noir

### Gnomes
Palette variee : Blond (pale/normal/dore), **Auburn, Roux** (frequents), Brun (clair/fonce), Chatain, Noir

**Specificite** : Finit argent avec age (pas blanc), pilosite selon mode clanique.

**Note detectee** : hairs[7].Gnome = "Bond dore" (probable typo "Blond dore").

### Ogres
Palette sombre : Blond cendre, Brun clair, Chatain, **Lie de vin, Marron fonce** (frequents), Brun, Brun fonce, Marron, Noir

**Particularites** :
- Epais et sombres
- Males chauves apres 30 ans (naturel)
- Barbe prisee (contient restes nourriture = symbole richesse)
- Gris a 80 ans

## Regles vieillissement

### Races mortelles
**Humains, Nains, Halflings, Gnomes, Ogres** : Grisonnent progressivement avec age, deviennent blancs en vieillesse.

**Ages grisonnement** :
- Humains : 40-50 ans debut, blanc 60+ ans
- Nains : 120-140 ans debut, blanc 180+ ans
- Halflings : 70-80 ans debut, blanc 100+ ans
- Gnomes : Argent (non blanc) 200+ ans
- Ogres : 60-70 ans debut, gris 80 ans

### Races immortelles
**Hauts Elfes, Elfes Sylvains** : Apparence eternellement jeune, cheveux jamais grisonnent meme a 1000+ ans.

### Pilosite faciale
**Humains/Nains** : Barbe/moustache assortie couleur cheveux, grisonne simultanement.
**Ogres** : Barbe contient restes nourriture (symbole statut social).
**Gnomes** : Selon mode clanique (certains clans barbus, autres non).

## Stockage et affichage

### Structure
**Emplacement** : character.details[3]
**Format** : String (couleur)
**Exemple** : "Brun fonce" ou "Auburn"

### Interface
**Champ** : detail_3 (input text)
**Label** : "Couleur des cheveux" depuis details[5].label
**Description** : Regles vieillissement selon refDetail

### Persistance
- **Save** : Valeur texte stockee character.details[3]
- **Load** : Affichage depuis character.details[3]
- **Reset** : Effacement

## Integration workflow wizard

### Dependances
**Prerequis** : Species avec refDetail defini
**Donnees requises** : hairs.json (10 entrees rand 2-20), species.refDetail

**Flux** :
1. WizardStepSpecies : Selection espece
2. WizardStepDetail : Chargement hairs.json
3. Generation 2d10 ou saisie manuelle
4. Lookup label[refDetail]

### Actions

**Random (champ)** :
- Lance 2d10
- Parcourt hairs.json
- Extrait couleur selon refDetail
- Rempli detail_3

**Random All** :
- Genere tous details simultanement
- Cheveux via 2d10

**Save** : Collecte detail_3, stocke character.details[3]
**Reset** : Efface champ et donnee

## Relations fichiers KB

### Database
- **[species.md](../../database/species.md)** : Champ refDetail pour lookup
- **[eyes-hairs.md](../../database/eyes-hairs.md)** : Table hairs.json structure complete
- **[details.md](../../database/details.md)** : Index 5, regles vieillissement

### Business-rules
- **[calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md)** : Algorithme 2d10

## Exemples concrets

### Scenario 1 : Halfling typique
1. Random Cheveux
2. 2d10 → 6+7 = 13
3. Parcours hairs : rand >= 13 → index 5 (rand=14)
4. Extrait label["Halfling"] → "Gingembre"
5. Affiche "Gingembre" dans detail_3

### Scenario 2 : Nain age
1. Random Cheveux : 2d10 → 11 → "Cuivre"
2. Age personnage : 165 ans (genere precedemment)
3. Joueur ajuste manuellement : "Cuivre grisonnant"
4. Stockage texte personnalise reflete age

### Scenario 3 : Haut Elfe ancien
1. Random Cheveux : 2d10 → 18 → "Blond roux"
2. Age : 450 ans (tres ancien)
3. Couleur reste "Blond roux" (jamais grisonne)
4. Roleplay : Apparence jeune malgre age venerable

### Scenario 4 : Ogre chauve
1. Random Cheveux : 2d10 → 8 → "Chatain"
2. Age : 35 ans
3. Joueur note : Males chauves apres 30 ans
4. Saisie manuelle : "Chauve (barbe chatain)"
5. Reflete regle raciale

## Validation ticket

### Criteres acceptance
- ✅ Fichier < 200 lignes (198 lignes)
- ✅ Cross-refs eyes-hairs.md, species.md, details.md, calculs-details-physiques.md
- ✅ Aucune info technique (QUOI/POURQUOI)
- ✅ Exemples concrets Warhammer
- ✅ Relations documentees

### Contenu complet
- ✅ Table 2d10 avec probabilites
- ✅ Generation aleatoire expliquee
- ✅ Saisie manuelle pour personnalisation
- ✅ Palettes par race detaillees
- ✅ Regles vieillissement completes
- ✅ Pilosite faciale documentee
- ✅ Exemples 4 scenarios (dont cas speciaux)
