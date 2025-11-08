# Édition Table Species

## Objectif

Permet l'édition des races jouables (species) et leurs variantes régionales via l'interface d'administration. Gère l'ajout, la modification et la suppression des species avec leurs caractéristiques, compétences et talents de départ.

## Structure des Champs Éditables

**Métadonnées**
- Index (numéro unique, généré automatiquement)
- Label (nom complet de la race/variante)
- Book (livre source via select autocomplete)
- Page (numéro de page)

**Références**
- refChar (référence vers table characteristics)
- refCareer (référence vers carrières disponibles)
- refDetail (référence vers détails physiques)

**Génération aléatoire**
- rand (seuil de probabilité 1-100)

**Données descriptives**
- desc (description HTML avec éditeur riche)
- skills (liste textuelle des compétences raciales)
- talents (liste textuelle des talents raciaux)

## Interface d'Édition

**Formulaire species**

Nom:
[suffix] [label] [prefix]

Livre:
[book (select)] [page (number)]

Références:
- Caractéristiques: [refChar (select autocomplete)]
- Carrières: [refCareer (select autocomplete)]
- Détails: [refDetail (select autocomplete)]

Génération aléatoire:
[rand (number 1-100)]

Compétences:
[skills (textarea)]

Talents:
[talents (textarea)]

Description:
[desc (textarea HTML riche)]

## Validation des Données

**Champs obligatoires**
- label (nom de la species)
- book et page (référence bibliographique)
- refChar, refCareer, refDetail (références vers autres tables)
- rand (valeur entre 1 et 100)

**Format skills**
- Liste séparée par virgules
- Peut contenir "(Au choix)" ou "OU"
- Exemple: "Calme, Charme Animal, Dressage (Au choix)"

**Format talents**
- Liste séparée par virgules
- Peut contenir spécialisations entre parenthèses
- Exemple: "Sens aiguisé (Vue), Vision nocturne"

**Contraintes rand**
- Valeur unique (pas de doublon) sauf pour variantes d'une même race
- Ordre croissant recommandé
- Maximum absolu = 100

## Workflow Édition Species

**Créer une nouvelle variante humaine**
1. Sélectionner "Species > Humains" dans le menu
2. Filtrer "Reiklander"
3. Cliquer sur "Humains (Reiklander)"
4. Cliquer sur "Dupliquer"
5. Modifier le label en "Humains (Wasteland)"
6. Conserver rand=90 (même groupe que Reiklander)
7. Modifier desc pour décrire les Wastelanders
8. Ajuster skills/talents si différents
9. Valider

**Créer une race entièrement nouvelle (homebrew)**
1. Sélectionner une race similaire (ex: Nains)
2. Dupliquer
3. Modifier label en "Skaven" (exemple homebrew)
4. Créer nouvelle entrée refChar="Skaven" (via edit-characteristics)
5. Créer nouvelle entrée refCareer="Skaven" (via edit-careers)
6. Créer nouvelle entrée refDetail="Skaven" (via edit-details)
7. Définir nouveau rand (ex: 101 pour race hors aléatoire standard)
8. Rédiger desc complète avec règles spéciales
9. Définir skills et talents de base
10. Valider

**Modifier une species existante**
1. Filtrer et sélectionner la species
2. Éditer les champs nécessaires
3. Valider (sauvegarde immédiate dans Google Sheets)

## Exemples Concrets Warhammer

**Exemple 1: Variante régionale Humain**
- Label: "Humains (Ostlander)"
- Book: "Middenheim" | Page: 42
- refChar: "Humain" (partagé avec tous les humains)
- refCareer: "Humain" (partagé)
- refDetail: "Humain" (partagé)
- rand: 90 (même groupe que Reiklander)
- skills: "Calme, Charme Animal, Dressage, Endurance, Intuition, Langue (Schlacht), Perception, Ragot, Savoir (Reikland)"
- talents: "Doigté, Savoir-vivre (Paysans), Vision nocturne"
- desc: HTML décrivant culture ostlandaise

**Exemple 2: Variante Halfling**
- Label: "Halflings (Cendreplaine)"
- Book: "AA" | Page: 19
- refChar: "Halfling"
- refCareer: "Halfling"
- refDetail: "Halfling"
- rand: 95 (entre Humains et Nains)
- skills: "Calme, Charme, Esquive, Intuition, Langue (Mootland), Perception, Ragot, Résistance à la Magie"
- talents: "Résistance au Chaos, Sens aiguisé (Goût), Trouillard"
- desc: Spécificités Cendreplaine

**Exemple 3: Race rare**
- Label: "Ogres"
- Book: "SOC" | Page: 156
- refChar: "Ogre"
- refCareer: "Ogre"
- refDetail: "Ogre"
- rand: 0 (non disponible en aléatoire, sélection manuelle uniquement)
- skills: "Intimidation, Langue (Grumbarth), Résistance à l'alcool"
- talents: "Effrayant, Fureur, Menaçant, Vision nocturne"
- desc: Règles spéciales Ogres (taille, force, etc.)

## Gestion des Références

**Création cohérente**
- refChar, refCareer, refDetail doivent exister dans leurs tables respectives
- Pour nouvelle race, créer d'abord les références dans les autres tables
- Utiliser autocomplete-free pour ajouter temporairement si référence manquante
- Validation finale vérifiera cohérence des références

**Cascade de dépendances**
- Créer species → nécessite characteristics + careers + details
- Supprimer species → vérifier qu'aucun personnage existant n'utilise cette race

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/species.md](../../database/species.md) - Structure complète des données species
- [database/characteristics.md](../../database/characteristics.md) - Table refChar
- [database/careers.md](../../database/careers.md) - Table refCareer
- [database/details.md](../../database/details.md) - Table refDetail
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing skills/talents

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin générale
- [validation.md](./validation.md) - Règles de validation
- [save.md](./save.md) - Processus de sauvegarde
- [edit-careers.md](./edit-careers.md) - Édition des carrières liées
- [edit-talents.md](./edit-talents.md) - Édition des talents référencés
- [edit-skills.md](./edit-skills.md) - Édition des skills référencés

## Limites et Contraintes

**Pas de suppression cascade**
- Supprimer une species ne supprime pas ses références (characteristics, careers, etc.)
- Vérification manuelle de l'impact requise

**Pas de validation temps réel**
- Vérification des références uniquement à la sauvegarde
- Pas d'alerte si refChar/refCareer/refDetail n'existent pas encore

**Format texte libre**
- skills et talents stockés en texte brut (parsing ultérieur)
- Erreurs de syntaxe non détectées à l'édition
- Validation complète uniquement au runtime (création de personnage)
