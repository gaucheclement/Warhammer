# Character Sheet - Section Identité

## Contexte

La section identité affiche les informations descriptives du personnage dans l'onglet "Perso" du résumé final (StepResume). Elle présente 15 champs organisés dans le panneau gauche de l'interface.

**Objectif** : Référence rapide des informations d'identification du personnage en jeu.

**Source** : Modèle Character (details[], specie, star, careerLevel) + tables de référence.

## Informations Affichées

### Structure (15 champs)

1. **Nom** - character.details[0] - Exemple : "Gunther von Hortmann"
2. **Race** - specie.label - Exemple : "Humain", "Nain", "Elfe"
3. **Signe Astrologique** - star.label - Exemple : "Wymund l'Anachorète"
4. **Classe** - career.class.label - Exemple : "Citadins", "Guerriers"
5. **Carrière** - career.label - Exemple : "Agitateur", "Répurgateur"
6. **Niveau de Carrière** - careerLevel.label - Exemple : "Démagogue"
7. **Schéma de Carrière** - careerLevel.label (dupliqué V1)
8. **Statut** - careerLevel.status - Exemple : "Bronze 3", "Argent 1"
9. **Âge** - details[1] - Exemple : "25 ans", "68 ans" (Nain)
10. **Taille** - details[4] - Exemple : "5 pieds 8 pouces"
11. **Cheveux** - details[3] - Exemple : "Blonds", "Roux"
12. **Yeux** - details[2] - Exemple : "Bleus", "Verts"
13. **Dieu Patron** - details[5] - Exemple : "Sigmar", "Ulric"
14. **Ambitions** - details[6] - Exemple : "Devenir riche"
15. **Motivations** - details[7] - Exemple : "Vengeance", "Honneur"

### Format

```
<label en gras>: <valeur>
<br>
```

Chaque champ occupe une ligne avec label en gras, deux-points, valeur en texte normal, et retour ligne.

## Interactivité

### Aide Contextuelle

**Mécanisme** : Chaque champ est cliquable et ouvre une popup (Helper.showPopin) avec description contextuelle.

**Contenu des popups** :
- **Race** : Description espèce (pitch, bonus caractéristiques, skills, talents)
- **Signe** : Description signe (effets, modificateurs, légende)
- **Classe** : Description classe sociale (équipement de départ)
- **Carrière** : Description carrière (pitch, rôle dans l'univers)
- **Niveau** : Détails niveau (skills, talents, trappings, avances caractéristiques)
- **Détails** : Description selon table Details (spécifique à l'espèce si applicable)

**Exemple** : Clic sur "Race: Humain" → Popup affiche pitch espèce + bonus CC/Dex/Soc + skills Langue/Résistance.

## Relations

### Dépendances Tables

- **database/species.md** : Données espèces
- **database/stars.md** : Données signes astrologiques
- **database/careers.md** : Données carrières
- **database/careerLevels.md** : Données niveaux de carrière
- **database/classes.md** : Données classes sociales
- **database/details.md** : Schémas champs de détail

### Dépendances Features

- **character-model/identity.md** : Stockage details[], specie, star, careerLevel
- **wizard/species-selection.md** : Sélection espèce
- **wizard/star-selection.md** : Sélection signe
- **wizard/career-selection.md** : Sélection carrière
- **wizard/detail-*.md** : Génération/saisie détails physiques et narratifs

### Flux de Données

1. **Wizard** : Remplit progressivement specie, star, careerLevel, details[]
2. **Character Model** : Stocke références (id) et valeurs
3. **Section Identité** : Récupère et formate pour affichage
4. **Joueur** : Consulte informations, clique pour aide contextuelle

## Règles Métier

### Champs Obligatoires

- **Race** : Toujours présente (sélectionnée au wizard)
- **Carrière** : Toujours présente (sélectionnée au wizard)
- **Niveau de Carrière** : Toujours présent (défini au wizard)

### Champs Optionnels

- **Signe Astrologique** : Peut être absent (affiche chaîne vide)
- **Nom, Âge, Taille, Yeux, Cheveux, Dieu, Ambitions, Motivations** : Peuvent être vides

### Affichage Conditionnel

**Si carrière absente** (cas théorique) :
- Classe, Carrière, Niveau, Schéma, Statut : affichent chaîne vide

**Si signe absent** :
- Signe Astrologique : affiche chaîne vide

**Gestion des nulls** :
- Valeur null ou undefined → affiche chaîne vide ('')
- Évite erreurs d'affichage si données incomplètes

## Exemples Concrets

### Agitateur Humain

```
Nom: Gunther von Hortmann
Race: Humain
Signe Astrologique: Wymund l'Anachorète
Classe: Citadins
Carrière: Agitateur
Niveau de Carrière: Démagogue
Schéma de Carrière: Démagogue
Statut: Bronze 3
Âge: 25 ans
Taille: 5 pieds 8 pouces
Cheveux: Blonds
Yeux: Bleus
Dieu Patron: Sigmar
Ambitions: Renverser le système corrompu
Motivations: Justice sociale
```

### Répurgateur Nain

```
Nom: Baldrik Ironbeard
Race: Nain
Signe Astrologique: La Grande Croix
Classe: Guerriers
Carrière: Répurgateur
Niveau de Carrière: Répurgateur
Schéma de Carrière: Répurgateur
Statut: Bronze 2
Âge: 68 ans
Taille: 4 pieds 6 pouces
Cheveux: Roux
Yeux: Marron
Dieu Patron: Grungni
Ambitions: Purger le Chaos
Motivations: Honneur ancestral
```

### Sorcier Elfe (sans signe)

```
Nom: Aelith Wintermoon
Race: Elfe
Signe Astrologique:
Classe: Lettrés
Carrière: Sorcier
Niveau de Carrière: Apprenti Sorcier
Schéma de Carrière: Apprenti Sorcier
Statut: Argent 3
Âge: 150 ans
Taille: 5 pieds 11 pouces
Cheveux: Blancs argentés
Yeux: Violets
Dieu Patron:
Ambitions: Maîtriser la Haute Magie
Motivations: Quête de connaissance
```

## Voir Aussi

- **character-sheet/characteristics-skills.md** : Affichage caractéristiques et compétences (panneau droit onglet Perso)
- **wizard/resume-display.md** : Organisation complète interface résumé (5 onglets)
- **save-load/sheets-load.md** : Chargement personnages sauvegardés
