# Talents - Ajout Compétences et Magie

## Vue d'ensemble

Deux mécanismes d'ajout via talents: `addSkill` (compétences) et `addMagic` (domaines magie). Élargissent capacités personnage en débloquant compétences ou accès magique.

## addSkill: Ajout de Compétences

### Fonctionnement

**Champ addSkill**: nom compétence à ajouter au personnage

**Format**: `"Nom Compétence"` ou `"Nom Compétence (Spécialisation)"`

**Effet**: compétence ajoutée automatiquement à l'acquisition du talent

**Permanence**: compétence reste tant que talent possédé

### Formats addSkill

**Compétence simple**: `"Emprise sur les animaux"`
- Ajoute compétence sans spécialisation

**Compétence avec spé fixe**: `"Chevaucher (Cheval)"`
- Ajoute compétence avec spécialisation déterminée

**Compétence avec spé choix**: `"Art (Au choix)"`
- Joueur choisit spécialisation parmi specs du talent
- Spé talent devient spé compétence

### Exemples

**Artiste** (specs Art):
- addSkill: `"Art (Au choix)"`
- Joueur choisit "Peinture" → compétence "Art (Peinture)" ajoutée

**Cavalier émérite**:
- addSkill: `"Chevaucher (Cheval)"`
- Compétence "Chevaucher (Cheval)" ajoutée directement

### Règles compétences ajoutées

**Acquisition gratuite**: compétence ajoutée sans coût XP

**Niveau initial**: généralement 0 avances, sauf indication contraire

**Origine talent**: compétence marquée origine "talent"

**Retrait**: si talent perdu, compétence retirée (sauf avances investies)

## addMagic: Accès Domaines Magiques

### Fonctionnement

**Champ addMagic**: type de magie débloqué

**Effet**: accès aux sorts du domaine magique

**Spécialisation**: souvent couplé avec specs pour choisir domaine précis

### Domaines magiques

**"Béni"**: magie divine, bénédictions des dieux
- Specs: noms des dieux (Sigmar, Ulric, etc.)
- Accès: bénédictions du dieu choisi

**"Magie mineure"**: petits sorts pratiques
- Nombre sorts: Bonus Force Mentale
- Sorts uniques du domaine

**"Magie des Arcanes"**: magie des couleurs
- Specs: couleurs magiques ou "Magie des couleurs"
- Nombre sorts: illimité dans domaine choisi (coût XP)

**"Magie du Chaos"**: magie corrompue
- Specs: domaines Chaos
- Nombre sorts: selon rang talent
- Risques: corruption

**"Invocation"**: invocation entités
- Specs: types entités ou dieux
- Nombre sorts: illimité (coût XP)

### Exemples

**Béni** (max 1):
- addMagic: `"Béni"`
- specs: `"Manann, Morr, Sigmar, ..."`
- Choix "Sigmar" → accès toutes bénédictions Sigmar

**Magie mineure** (hypothétique):
- addMagic: `"Magie mineure"`
- Nombre sorts = Bonus FM
- FM 35 (Bonus 3) → peut connaître 3 sorts Magie mineure

### Gestion des sorts

**Acquisition sorts**: après déblocage domaine, sorts achetés avec XP

**Mémorisation**: nombre sorts limité par règles magie

**Lancement**: utilise compétence Langue (Magick) ou équivalent

**Oubli**: si talent perdu, sorts du domaine perdus

## Interaction compétences-magie

### Compétences magiques

Certains talents addSkill + addMagic:
- addSkill: compétence lancer sorts
- addMagic: domaine sorts disponibles

### Prérequis sorts

Accès domaine ≠ maîtrise automatique

Besoin compétences appropriées pour lancer (Langue Magick, Focalisation, etc.)

## Cumul et synergie

### Plusieurs talents addSkill

Talents différents peuvent ajouter compétences différentes

Talents rangs multiples peuvent ajouter même compétence (renforce)

### Plusieurs talents addMagic

Peuvent débloquer plusieurs domaines magie

Exemple: Béni (Sigmar) + Magie mineure → 2 domaines accessibles

## Validation

### addSkill

**Compétence existe**: nom base doit être dans skills.json

**Format valide**: "Nom" ou "Nom (Spé)"

**Cohérence spé**: si "(Au choix)", specs talent doit être rempli

### addMagic

**Domaine valide**: doit être parmi valeurs autorisées

**Cohérence specs**: si addMagic rempli, specs souvent nécessaire

**Relations sorts**: vérifier sorts existent pour domaine

## Impact gameplay

**Élargissement capacités**: talents ouvrent nouvelles compétences/magies

**Gratuité**: compétences/magie ajoutées sans XP (juste talent)

**Spécialisation**: choix domaines influence style jeu

**Prérequis carrières**: certaines carrières exigent compétences/magie spécifiques
