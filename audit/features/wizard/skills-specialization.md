# Wizard Skills - Spécialisations

## Contexte

Gestion des spécialisations de compétences groupées durant l'étape Skills du wizard. Certaines compétences nécessitent une spécialisation (ex: Art → Peinture, Métier → Forgeron, Langue → Bretonnien).

**Objectif métier** : Permettre au joueur de définir les spécialisations des compétences groupées héritées de l'espèce ou de la carrière.

## Périmètre fonctionnel

### Compétences nécessitant spécialisation

**Compétences groupées** (voir [skills.md](../../database/skills.md))
- Champ `specs` non vide indique une compétence groupée
- Exemples : Art, Métier, Langue, Connaissance, Focalisation, Corps à corps, Projectiles, Discrétion

**Format specs**
- Liste séparée par virgules : "Item1, Item2, Item3"
- Exemple Art : "Calligraphie, Cartographie, Écriture, Gravure, Icones, Mosaïque, Peinture, Sculpture, Tatouage, Tissage"

### Types de spécialisations

**Liste fermée**
- Spécialisations définies dans le champ `specs` de la table Skills
- Le joueur doit choisir parmi les options disponibles
- Exemples : Art (10 options), Corps à corps (8 options), Focalisation (9 Vents de Magie)

**Liste ouverte "(Au choix)"**
- Marqueur spécial dans species.skills ou careerLevels.skills
- Format : "Métier (Au choix)", "Langue (Au choix)"
- Le joueur peut saisir librement OU choisir parmi les specs de la table Skills

### Modes de sélection

**Spécialisation prédéfinie**
- Format : "Langue (Bataille)", "Corps à corps (Base)"
- Pas de choix à faire, la spécialisation est fixée
- Affichage direct avec la spécialisation

**Spécialisation à définir**
- Format : "Art (Au choix)", "Métier (?)"
- Popup de sélection affichée au premier clic sur la compétence
- Blocage jusqu'à sélection (impossible d'allouer des points sans spécialisation)

## Interface de sélection

### Popup de spécialisation

**Déclenchement**
- Automatique au premier clic sur une compétence avec "(Au choix)" ou sans spécialisation définie
- Fonction : `Helper.showSpecialisationPopin(character, elem, change, null, true)`

**Contenu**
- Titre : "Choisissez une spécialisation pour [Nom de la compétence]"
- Liste des spécialisations disponibles (provenant de `skills.specs`)
- Bouton "Valider" pour confirmer

**Options d'affichage**
- Si liste fermée : radio buttons ou dropdown avec les specs de la table Skills
- Si "(Au choix)" : champ texte libre OU dropdown des specs courantes

### Comportement

**Sélection**
- Le joueur clique sur une spécialisation ou saisit du texte
- Clic sur "Valider" enregistre le choix
- La popup se ferme et la compétence affiche maintenant "Nom (Spécialisation)"

**Annulation**
- Bouton "Annuler" ou clic hors de la popup
- La compétence reste non spécialisée
- Impossible d'allouer des points tant que la spécialisation n'est pas définie

## Exemples concrets Warhammer

### Art (Au choix) - Humain

**Source** : species.skills pour Humain = "Art (Au choix) ou Métier (Au choix)"

**Scénario** : Joueur choisit Art parmi "Art ou Métier", puis doit spécialiser

**Options disponibles** : Calligraphie, Cartographie, Écriture, Gravure, Icones, Mosaïque, Peinture, Sculpture, Tatouage, Tissage

**Sélection** : Joueur choisit "Peinture"

**Résultat** : La compétence devient "Art (Peinture)" et peut recevoir des augmentations

### Métier (Forgeron) - Nain

**Source** : species.skills pour Nain = "Métier (Au choix)"

**Scénario** : Spécialisation à définir parmi liste ouverte

**Options suggérées** : Forgeron, Charpentier, Menuisier, Maçon, Tanneur, Brasseur, Boulanger, Boucher...

**Sélection** : Joueur choisit ou saisit "Forgeron"

**Résultat** : "Métier (Forgeron)"

### Langue (Bataille) - Humain

**Source** : species.skills pour Humain = "Langue (Bataille)"

**Scénario** : Spécialisation prédéfinie

**Comportement** : Pas de popup, la compétence est directement "Langue (Bataille)"

**Résultat** : Aucune action requise du joueur

### Focalisation - Mage

**Source** : talent "Mage Mineur" ajoute "Focalisation"

**Options disponibles** : Aqshy, Azyr, Chamon, Dhar, Ghur, Ghyran, Hysh, Shyish, Ulgu (9 Vents de Magie)

**Sélection** : Joueur choisit son domaine de magie (ex: "Azyr")

**Résultat** : "Focalisation (Azyr)"

### Corps à corps - Agitateur

**Source** : careerLevels.skills niveau 1 Agitateur = "Corps à corps (Base)"

**Scénario** : Spécialisation prédéfinie

**Comportement** : Pas de popup, directement "Corps à corps (Base)"

**Résultat** : Aucune action requise

## Relations avec autres composants

**Tables** : Skills (specs), Species (skills avec "(Au choix)"), CareerLevels (skills)

**Étapes wizard** : Utilisé dans Species Skills et Career Skills

**Patterns** : Spécialisations (format "(Au choix)", parsing specs)

## Règles métier

### Contraintes

**Spécialisation obligatoire**
- Toute compétence groupée doit avoir une spécialisation définie
- Impossible de valider l'étape avec des spécialisations manquantes

**Unicité**
- Chaque combinaison (Nom, Spécialisation) est une compétence distincte
- Exemple : Art (Peinture) ≠ Art (Sculpture)
- Un personnage peut acquérir plusieurs spécialisations de la même compétence groupée

**Cohérence avec table Skills**
- Si liste fermée : la spécialisation doit exister dans `skills.specs`
- Si "(Au choix)" : validation plus souple, accepte texte libre

### Cas particulier : Focalisation

**Compétence hybride**
- Groupée (avec 9 Vents de Magie) pour les mages formés
- Non groupée (sans spécialisation) pour ceux sans formation magique
- Seule compétence avec ce double statut

**Détermination du mode**
- Si acquise via talent (Mage Mineur, Magie des Arcanes) → groupée, nécessite spécialisation
- Si acquise autrement → non groupée, pas de spécialisation

## Validation et contraintes

### Validation au clic sur "Valider"

**Critère 1 : Toutes spécialisations définies**
- Parcours de toutes les compétences sélectionnées
- Vérification que champ `spec` est rempli pour les compétences groupées
- Blocage si au moins une spécialisation manquante

**Critère 2 : Spécialisation valide**
- Si liste fermée : vérifier que la spec existe dans `skills.specs`
- Si "(Au choix)" : accepter toute valeur non vide

**Messages utilisateur**
- Popup automatique si spécialisation manquante lors de l'allocation de points
- Pas de message d'erreur explicite, feedback visuel via popup

## Voir aussi

- [skills-species.md](./skills-species.md) - Compétences d'espèce
- [skills-career.md](./skills-career.md) - Compétences de carrière
- [skills-choice.md](./skills-choice.md) - Gestion "Au choix"
- [skills.md](../../database/skills.md) - Table Skills (specs)
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Pattern spécialisations
