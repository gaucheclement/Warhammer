# Wizard Skills - Compétences de l'Espèce

## Contexte

Première partie de l'étape Skills du wizard de création de personnage. Le joueur sélectionne quelles compétences raciales il souhaite améliorer parmi celles héritées de son espèce.

**Objectif métier** : Permettre au joueur d'investir ses points d'augmentation raciaux pour personnaliser son personnage selon son espèce.

## Périmètre fonctionnel

### Compétences héritées de l'espèce

**Source des compétences**
- Proviennent du champ `skills` de la table Species (voir [species.md](../../database/species.md))
- Format texte nécessitant parsing (voir [pattern-parsing.md](../../patterns/pattern-parsing.md))
- Exemples : "Athlétisme, Calme, Résistance, Langue (Bataille)", "Art (Au choix) ou Métier (Au choix)"

**Quantité**
- Variable selon l'espèce (généralement 4-8 compétences)
- Inclut les spécialisations prédéfinies ou "Au choix"

### Système d'augmentations raciales

**Répartition des points**
- 3 compétences à +5 augmentations chacune
- 3 compétences à +3 augmentations chacune
- Total : 6 compétences sélectionnées parmi les skills de l'espèce

**Règles de sélection**
- Choix parmi uniquement les skills de l'espèce (liste fermée)
- Chaque compétence peut recevoir 0, 3 ou 5 augmentations (pas d'autres valeurs)
- Une compétence ne peut pas avoir à la fois +3 et +5 (exclusif)
- Validation : exactement 3 compétences à +5 ET 3 compétences à +3

### Gestion des spécialisations

**Spécialisations prédéfinies**
- Exemple Humain : "Langue (Bataille)" → spécialisation déjà définie
- Pas de choix à faire, la spécialisation est fixée
- Affichage : "Langue (Bataille)"

**Spécialisations "Au choix"**
- Exemple Humain : "Art (Au choix)" → le joueur doit choisir
- Popup de sélection affichée lors du clic sur la compétence
- Liste des specs provient du champ `specs` de la table Skills
- Affichage après choix : "Art (Peinture)"

**Opérateur "ou"**
- Exemple Humain : "Art (Au choix) ou Métier (Au choix)"
- Le joueur choisit l'une des deux options
- Une seule des deux compétences apparaît dans la liste finale

## Affichage

### Structure de l'interface

**Panneau gauche** : Deux compteurs dynamiques (slots restants 3→0) pour "+5 Augmentations" et "+3 Augmentations"

**Liste compétences** : Tableau (Nom | Base | Augm | Total) avec une ligne par skill de l'espèce, boutons +/- pour ajuster

### Valeurs

**Nom** : Label avec spécialisation (ex: "Art (Peinture)", "Athlétisme"). **Base** : Valeur caractéristique liée (ex: Dextérité 28). **Augm** : Augmentations (0, 3 ou 5). **Total** : Base + Augmentations.

### Contrôles

**Boutons +/-** : Cycle 0→3→5 (pas d'intermédiaire), désactivés selon limites (- si 0, + si 5)
**Bouton Valider** : Activé uniquement si exactement 3 skills à +5 ET 3 skills à +3

## Exemples concrets Warhammer

### Humain (Reiklander)

**Skills de l'espèce** : Athlétisme, Calme, Résistance, Langue (Bataille), Art (Au choix) ou Métier (Au choix), Animaux ou Charme, Commerage ou Ragots

**Sélection** : Joueur choisit Art (Peinture), Charme. Répartition : +5 (Art Peinture, Athlétisme, Calme), +3 (Résistance, Langue Bataille, Charme)

**Résultat** : Art (Peinture) 28+5=33, Athlétisme 25+5=30, Calme 32+5=37, Résistance 30+3=33, Langue (Bataille) 32+3=35, Charme 35+3=38

### Nain

**Skills de l'espèce** : Résistance, Endurance, Calme, Corps à corps (Base), Métier (Au choix), Langue (Khazalid), Connaissance (Géologie) ou Connaissance (Métallurgie)

**Sélection** : Métier (Forgeron), Connaissance (Métallurgie). Répartition : +5 (Métier Forgeron, Résistance, Endurance), +3 (Calme, Corps à corps Base, Connaissance Métallurgie)

**Résultat** : Métier (Forgeron) 30+5=35, Résistance 40+5=45, Endurance 40+5=45, Calme 42+3=45, Corps à corps (Base) 30+3=33, Connaissance (Métallurgie) 28+3=31

### Halfling

**Skills de l'espèce** : Calme, Charme, Esquive, Intuition, Discrétion (Rurale), Perception, Animaux ou Ragots

**Sélection** : Ragots. Répartition : +5 (Charme, Calme, Ragots), +3 (Intuition, Perception, Esquive)

**Résultat** : Charme 30+5=35, Calme 35+5=40, Ragots 30+5=35, Intuition 30+3=33, Perception 25+3=28, Esquive 25+3=28

## Relations avec autres composants

### Tables database

**Species** (voir [species.md](../../database/species.md))
- Champ `skills` : liste textuelle des compétences raciales
- Nécessite parsing pour extraire la liste (voir [pattern-parsing.md](../../patterns/pattern-parsing.md))

**Skills** (voir [skills.md](../../database/skills.md))
- Champ `characteristic` : détermine la valeur "Base"
- Champ `specs` : liste des spécialisations pour "(Au choix)"

**Characteristics** (voir [characteristics.md](../../database/characteristics.md))
- Fournit les valeurs de base pour chaque compétence
- Valeurs déjà calculées avec modificateurs d'espèce et de signe astrologique

### Étapes du wizard

**Étape précédente : Species** (voir [species-selection.md](./species-selection.md))
- Détermine les compétences disponibles

**Étape suivante : Career Skills** (voir [skills-career.md](./skills-career.md))
- Les augmentations d'espèce s'ajoutent aux augmentations de carrière

### Patterns techniques

**Parsing** (voir [pattern-parsing.md](../../patterns/pattern-parsing.md))
- Séparateur virgule pour lister les skills
- Opérateur "ou" pour choix exclusifs
- Parenthèses pour spécialisations
- "(Au choix)" pour sélection dynamique

**Spécialisations** (voir [pattern-specialisations.md](../../patterns/pattern-specialisations.md))
- Format "Nom (Spécialisation)"
- Popup de sélection pour "(Au choix)"
- Validation que la spécialisation existe dans la table Skills

## Règles métier

### Contraintes

**Nombre de sélections**
- Exactement 6 compétences doivent recevoir des augmentations
- 3 avec +5, 3 avec +3 (pas d'autre combinaison possible)

**Valeurs autorisées**
- Augmentations : 0, 3 ou 5 uniquement
- Pas de valeurs intermédiaires (1, 2, 4)

**Liste fermée**
- Seules les compétences de l'espèce sont sélectionnables
- Pas possible d'ajouter d'autres compétences à cette étape

### Spécialisations obligatoires

**Compétences groupées**
- Si la compétence a des spécialisations (champ `specs` non vide), la spécialisation est obligatoire
- Popup affichée si spécialisation non encore définie
- Blocage jusqu'à ce que le joueur ait choisi

**Validation**
- Impossible de valider l'étape si des spécialisations "(Au choix)" ne sont pas résolues
- Message d'erreur si tentative de validation sans spécialisation

### Mode Free

**Différence avec mode guidé**
- En mode Free : toutes les compétences de la base de données sont disponibles (pas seulement celles de l'espèce)
- Les compétences raciales sont surlignées (class `highlighting`)
- Pas de limite de +10 par compétence
- Validation non bloquante (peut valider avec 0 sélections ou répartition non conforme)

## Validation et contraintes

### Validation au clic sur "Valider"

**Critère 1 : Nombre de compétences à +5**
- Doit être exactement 3
- Sinon : bouton "Valider" désactivé

**Critère 2 : Nombre de compétences à +3**
- Doit être exactement 3
- Sinon : bouton "Valider" désactivé

**Critère 3 : Spécialisations définies**
- Toutes les compétences avec "(Au choix)" doivent avoir une spécialisation sélectionnée
- Popup affichée automatiquement si manquant

**Messages utilisateur**
- Compteurs visuels mis à jour dynamiquement (nombre de slots restants)
- Bouton "Valider" grisé si validation échoue
- Pas de message d'erreur explicite (feedback visuel uniquement)

## Voir aussi

- [skills-career.md](./skills-career.md) - Étape suivante (compétences de carrière)
- [skills-specialization.md](./skills-specialization.md) - Gestion détaillée des spécialisations
- [skills-advances.md](./skills-advances.md) - Calcul des avances
- [skills-values.md](./skills-values.md) - Calcul des valeurs finales
- [species.md](../../database/species.md) - Source des compétences raciales
- [skills.md](../../database/skills.md) - Définition des compétences
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing des listes de skills
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Gestion des spécialisations
