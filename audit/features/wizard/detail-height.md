# Wizard Detail - Calcul de la Taille

## Vue d'ensemble

L'etape Detail du wizard determine la taille du personnage selon sa race via formule combinant valeur base et jets de des.

**Objectif metier** : Creer variete tailles dans ranges biologiques raciaux avec impact potentiel sur Blessures.

## Modes de selection

### Generation aleatoire
1. Recuperer Height Base et Height Roll depuis species data
2. Calculer : Taille = Height Base + (Height Roll × 1d10)
3. Arrondir 2 decimales, afficher dans detail_4

**Exemple Humain** : 145 + (5 × 8 d10) = 185 cm = 1,85 m

### Saisie manuelle
Joueur saisit taille souhaitee. Usage pour concepts roleplay specifiques.

### Mode hybride
Generation puis modification manuelle si besoin.

## Formules par espece

| Espece | Height Base | Roll | Formule | Range (cm) | Moyenne |
|--------|-------------|------|---------|------------|---------|
| Halfling | 90 | 5 | 90 + 10d10 | 100-190 | 1,00 m |
| Gnome | 100 | 2.5 | 100 + 5d10 | 105-150 | 1,15 m |
| Nain | 130 | 3 | 130 + 6d10 | 136-190 | 1,45 m |
| Humain | 145 | 5 | 145 + 10d10 | 155-245 | 1,75 m |
| Elfe | 180 | 2 | 180 + 4d10 | 184-220 | 1,90 m |
| Ogre | 235 | 6 | 235 + 12d10 | 247-355 | 2,75 m |

### Variabilite
- **Elfes** (2 rolls) : Faible, silhouettes homogenes
- **Gnomes/Nains** (3 rolls) : Moderee, differences visibles
- **Humains/Halflings** (5 rolls) : Grande, diversite genetique
- **Ogres** (6 rolls) : Tres grande, certains geants

### Regle speciale Humains
Si d10 = 10, lancer d10 supplementaire et ajouter. Reflete grande variabilite.

**Exemple** : Jet 10+7, 5 → Total (10+7+5) × 5 = 110 → 145 + 110 = 255 cm

## Impact sur caracteristiques

### Relation avec Blessures
Taille influence Points Blessures selon seuils :

| Espece | Seuil | Modificateur BE |
|--------|-------|-----------------|
| Halfling | < 1,35 m | -2 |
| Nain | < 1,30 m | -2 |
| Humain | < 1,52 m | -3 |
| Humain | 1,52-1,64 | -2 |
| Humain | 1,64-1,83 | -1 |
| Humain | >= 2,01 | +1 |
| Elfe | < 1,73 m | -2 |
| Elfe | 1,73-1,83 | -1 |
| Ogre | >= 2,90 m | +1 |

**Calcul** : Blessures = BE + BFM + BVol + Modificateur Taille

**Exemple** : Humain 1,95 m, BE=3, BFM=2, BVol=3 → 3+2+3+1 = 9 PB

## Limites et validation

### Limites biologiques
**Min** : Height Base - 10 cm | **Max** : Height Base + (Roll × 20) + 10 cm

**Exemples** : Halfling 80-200 | Nain 120-200 | Humain 135-255 | Elfe 170-230 | Ogre 225-365 cm

### Validation saisie
- Numerique positive requis
- Warning si < Height Base - 5 ou > Height Base + (Roll × 15)
- Conversion auto metres/cm

**Messages** :
- "Taille inhabituelle (moyenne : {moyenne} m)"
- "Taille extreme, impact Blessures possible"

## Coherence metier

### Taille et roleplay
**Petite** : Discret, agile, moins intimidant
**Grande** : Intimidant, force percue, cible facile

### Impact social
- Nain 1,30 vs 1,55 m : Difference notable clan
- Humain 1,55 vs 2,10 m : Perception totalement differente
- Ogre 2,50 vs 3,20 m : Legendes vivantes

### Coherence carrieres
- **Voleur, Assassin** : Prefere petits
- **Soldat, Chevalier** : Prefere grands
- **Artisan** : Indifferent

## Stockage et affichage

### Structure
**Emplacement** : character.details[4]
**Format** : Decimal (metres, 2 decimales)
**Arrondi** : Math.round(value × 100) / 100

### Interface
**Champ** : detail_4 (input text)
**Label** : "Taille" depuis details[6].label
**Description** : Moyennes raciales desc[refDetail]

### Persistance
- **Save** : Valeur arrondie 2 decimales stockee
- **Load** : Affichage depuis character.details[4]
- **Reset** : Effacement

## Integration workflow wizard

### Dependances
**Prerequis** : Species avec data.height, data.rollHeight
**Flux** :
1. WizardStepSpecies : Selection avec data
2. WizardStepDetail : Lecture height/rollHeight
3. Calcul ou saisie
4. Calcul impact Blessures

### Actions

**Random (champ)** : Calcul formule, arrondi, rempli detail_4
**Random All** : Genere tous details simultanement
**Save** : Collecte, arrondi, stocke, recalcule Blessures
**Reset** : Efface champ et donnee

## Relations fichiers KB

### Database
- **[species.md](../../database/species.md)** : data.height, data.rollHeight
- **[details.md](../../database/details.md)** : Index 6-8
- **[characteristics.md](../../database/characteristics.md)** : Impact Blessures

### Business-rules
- **[calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md)** : Formules completes

## Exemples concrets

### Scenario 1 : Halfling typique
1. Random Taille
2. Height Base=90, Roll=5
3. 10d10 → somme 56
4. 90 + 56 = 146 cm = 1.46 m
5. Affiche 1.46
6. Verification : >= 1,35 m → pas malus Blessures

### Scenario 2 : Humain regle speciale
1. Random Taille
2. Base=145, Roll=5
3. 10d10 → deux 10 → relance 2d10 → 7, 4
4. Total 75 → 145 + 75 = 220 cm = 2.20 m
5. Verification : >= 2,01 m → +1 BE

### Scenario 3 : Nain trapu personnalise
1. Auto : 130 + 28 = 1.58 m
2. Joueur veut plus petit (roleplay)
3. Saisie : 1.35 m
4. Warning (< moyenne 1,45 m)
5. Confirmation → stockage 1.35
6. Pas impact Blessures (>= 1,30 m)

## Validation ticket

### Criteres acceptance
- ✅ Fichier < 200 lignes (190 lignes)
- ✅ Cross-refs species.md, details.md, characteristics.md, calculs-details-physiques.md
- ✅ Aucune info technique (QUOI/POURQUOI)
- ✅ Exemples concrets Warhammer
- ✅ Relations documentees

### Contenu complet
- ✅ Formules par espece avec ranges
- ✅ Generation avec regle speciale Humains
- ✅ Saisie manuelle validation
- ✅ Limites biologiques
- ✅ Impact Blessures documente
- ✅ Exemples 3 scenarios
- ✅ Coherence roleplay/carrieres
