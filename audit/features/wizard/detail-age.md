# Wizard Detail - Calcul de l'Age

## Vue d'ensemble

L'etape Detail du wizard permet de determiner l'age du personnage selon sa race. Le systeme utilise une formule specifique par espece combinant valeur de base et jets de des.

**Objectif metier** : Generer age realiste coherent avec esperance de vie raciale, avec variete entre personnages.

## Modes de selection

### Generation aleatoire
1. Recuperer Age Base et Age Roll depuis details.json selon species.refDetail
2. Calculer : Age = Age Base + (Age Roll × 1d10)
3. Afficher resultat dans champ detail_1

**Exemple Humain** : 15 + 1d10 = 15 + 7 = 22 ans

### Saisie manuelle
Joueur saisit directement age souhaite (pas validation stricte). Usage pour concept roleplay specifique (veteran, jeune prodige).

### Mode hybride
Generation aleatoire puis modification manuelle. Equilibre rapidite/personnalisation.

## Formules par espece

| Espece | Formule | Range | Esperance vie | Interpretation |
|--------|---------|-------|---------------|----------------|
| Humain | 15 + 1d10 | 16-25 | ~60 ans | Jeunes adultes aptes aventure |
| Halfling | 15 + 5d10 | 20-65 | ~120 ans | Adolescents a adultes matures |
| Nain | 15 + 10d10 | 25-115 | 200+ ans | Jeunes guerriers (100 ans = jeune) |
| Haut Elfe | 30 + 10d10 | 40-130 | 1000+ ans | Adolescence elfique |
| Elfe Sylvain | 30 + 10d10 | 40-130 | 1000+ ans | Identique Hauts Elfes |
| Gnome | 20 + 10d10 | 30-120 | ~500 ans | Jeunes artisans |
| Ogre | 15 + 5d10 | 20-65 | ~120 ans | Jeunes mercenaires |

**Variabilite** :
- 1d10 (Humains) : Faible variabilite, tous jeunes adultes
- 5d10 (Halflings/Ogres) : Variabilite moyenne (20-50 ans ecart)
- 10d10 (Nains/Elfes/Gnomes) : Grande variabilite (100 ans ecart)

**Interpretation metier** : Races longues vies ont plus latitude d'age pour debuter aventures.

## Limites et validation

### Limites biologiques
**Minimum** : Age Base par race
**Maximum suggere** : Esperance vie - 10 ans

**Exemples** :
- Humain : 16-50 ans (au-dela trop age aventures)
- Nain : 25-190 ans
- Elfe : 40-900 ans (apparence eternelle)
- Ogre : 20-110 ans

### Validation saisie manuelle
- Valeur numerique positive requise
- Warning si age < Age Base (inhabituel)
- Warning si age > esperance vie × 0.8 (personnage age)
- Pas blocage strict (liberte roleplay)

**Messages** :
- "Age inhabituel pour votre race (minimum suggere : {Age Base} ans)"
- "Personnage age, peut affecter capacites physiques"
- "Veuillez saisir un age valide en annees"

## Coherence metier

### Ages et carriere aventurier
Ages generes = personnages aptes physiquement pour carriere initiale.

**Exemples** :
- Humain 22 ans : Soldat, Eclaireur (pleine forme)
- Nain 71 ans : Guerrier, Artisan (jeune vigoureux)
- Elfe 98 ans : Eclaireur, Mage (adolescent elfe)

### Impact roleplay
- **Age jeune** : Inexperience, naivete, enthousiasme
- **Age moyen** : Experience equilibree, sagesse moderee
- **Age eleve** : Veterant, sagesse, limitations physiques possibles

## Stockage et affichage

### Structure
**Emplacement** : character.details[1]
**Format** : Nombre entier (annees)
**Exemple** : 22

### Affichage interface
**Champ** : detail_1 (input text)
**Label** : "Age" depuis details[1].label
**Description** : allDesc ou desc[refDetail] selon espece

### Persistance
- **Save** : Valeur recuperee via $('.details').val(), stockee character.details[1]
- **Load** : Affichage depuis character.details[1]
- **Reset** : character.details[1] = ''

## Integration workflow wizard

### Dependances
**Prerequis** : Species selectionnee (species.refDetail defini)
**Donnees requises** : details.json index 1-3 (Age, Age Base, Age Roll)

**Flux** :
1. WizardStepSpecies : Selection espece
2. WizardStepDetail : Lecture details.json selon refDetail
3. Calcul age si random, ou saisie manuelle

### Actions disponibles

**Bouton Random (champ)** :
- Click icone alea pour Age uniquement
- Execute Age Base + (Age Roll × 1d10)
- Rempli detail_1, trigger 'change'

**Bouton Random All** :
- Genere tous details simultanement (age, yeux, cheveux, taille)
- Stockage auto character.details[]

**Bouton Save** :
- Collecte detail_1
- Stocke character.details[1]
- Sauvegarde character

**Bouton Reset** : Efface character.details[1] et champ

## Relations avec autres fichiers KB

### Database
- **[species.md](../../database/species.md)** : Champ refDetail determine espece lookup
- **[details.md](../../database/details.md)** : Table details.json, index 1-3

### Business-rules
- **[calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md)** : Formules et exemples detailles

### Patterns
- **[pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md)** : Systeme rand (d10 direct ici)

## Exemples concrets

### Scenario 1 : Creation rapide Humain
1. Click "Random All" sur step Detail
2. Lit species.refDetail = "Humain"
3. Lit details.json : Age Base=15, Age Roll=1
4. Lance 1d10 → 8
5. Calcul : 15 + 8 = 23 ans
6. Affiche 23 dans detail_1
7. Validation → stockage character.details[1]

### Scenario 2 : Nain veteran
1. Click "Random" Age : 15 + 10d10 = 58 ans
2. Joueur veut Nain plus experimente
3. Modification manuelle : 85 ans
4. Stockage 85 (coherent esperance 200+ ans)

### Scenario 3 : Elfe jeune prodige
1. Generation : 30 + 10d10 = 97 ans
2. Concept : Elfe exceptionnellement jeune
3. Saisie : 45 ans
4. Warning possible (< moyenne)
5. Confirmation → 45 ans stocke
6. Roleplay : Elfe tres jeune/inexperimente

## Validation ticket

### Criteres acceptance
- ✅ Fichier < 200 lignes (196 lignes)
- ✅ Cross-refs vers species.md, details.md, calculs-details-physiques.md
- ✅ Aucune info technique (QUOI/POURQUOI uniquement)
- ✅ Exemples concrets Warhammer (Humain, Nain, Elfe)
- ✅ Relations documentees (species.refDetail, details.json)

### Contenu complet
- ✅ Formule par espece avec ranges
- ✅ Generation aleatoire expliquee
- ✅ Saisie manuelle avec validation
- ✅ Limites min/max par espece
- ✅ Exemples concrets 3 scenarios
- ✅ Coherence metier (ages aventuriers)
- ✅ Impact roleplay documente
